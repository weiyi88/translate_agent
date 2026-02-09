"""
翻译工作流引擎
"""
import asyncio
import logging
from typing import Optional

from app.core.queue import TaskQueue
from app.core.scheduler import TaskScheduler
from app.core.state_machine import TaskStateMachine, StateTransitionError
from app.models.task import TranslationTask, TaskStatus, TaskResult


logger = logging.getLogger(__name__)


class TranslationEngine:
    """
    翻译工作流引擎

    负责:
    - 任务创建和管理
    - 任务调度
    - 状态跟踪
    - 错误处理
    """

    def __init__(
        self,
        max_concurrent_tasks: int = 3,
        queue_size: int = 100,
        max_retries: int = 3,
        retry_delay: float = 1.0,
        retry_backoff: float = 2.0,
    ):
        self.max_concurrent_tasks = max_concurrent_tasks
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.retry_backoff = retry_backoff

        # 任务队列
        self.queue = TaskQueue(max_size=queue_size)

        # 任务调度器
        self.scheduler = TaskScheduler(
            max_concurrent_tasks=max_concurrent_tasks,
            engine=self
        )

        # 任务存储 (task_id -> task)
        self.tasks: dict[str, TranslationTask] = {}

        # 状态机存储 (task_id -> state_machine)
        self.state_machines: dict[str, TaskStateMachine] = {}

        # 运行标志
        self.is_running = False

    async def start(self) -> None:
        """启动引擎"""
        if self.is_running:
            logger.warning("Engine is already running")
            return

        self.is_running = True
        logger.info(f"TranslationEngine started with max_concurrent_tasks={self.max_concurrent_tasks}")

        # 启动调度器
        await self.scheduler.start()

    async def stop(self) -> None:
        """停止引擎"""
        if not self.is_running:
            return

        self.is_running = False
        await self.scheduler.stop()
        logger.info("TranslationEngine stopped")

    async def create_task(
        self,
        file_path: str,
        file_type: str,
        target_language: str,
        model: str,
        priority: int = 5,
        depends_on: list[str] = None,
    ) -> TranslationTask:
        """
        创建翻译任务

        Args:
            file_path: 文件路径
            file_type: 文件类型 (pptx/docx/xlsx/pdf)
            target_language: 目标语言
            model: LLM 模型
            priority: 优先级 (1-10)
            depends_on: 依赖的任务 ID 列表

        Returns:
            创建的任务
        """
        task = TranslationTask(
            file_path=file_path,
            file_type=file_type,
            target_language=target_language,
            model=model,
            priority=priority,
            depends_on=depends_on or [],
        )

        # 存储任务
        self.tasks[task.id] = task

        # 创建状态机
        state_machine = TaskStateMachine()
        self.state_machines[task.id] = state_machine

        # 初始状态转换: PENDING -> QUEUED
        await self._transition_task(task.id, TaskStatus.QUEUED)

        # 检查依赖关系
        if await self._check_dependencies(task):
            # 依赖满足，加入队列
            await self.queue.enqueue(task)
        else:
            # 依赖未满足，等待
            logger.info(f"Task {task.id} waiting for dependencies")

        logger.info(f"Created task {task.id}: {file_path}")
        return task

    async def get_task_status(self, task_id: str) -> TaskResult:
        """获取任务状态"""
        if task_id not in self.tasks:
            raise ValueError(f"Task {task_id} not found")

        task = self.tasks[task_id]
        return TaskResult(
            task_id=task.id,
            status=task.status,
            output_path=task.output_path,
            error_message=task.error_message,
            progress=task.progress,
            created_at=task.created_at,
            completed_at=task.completed_at,
        )

    async def retry_task(self, task_id: str) -> None:
        """重试失败的任务"""
        if task_id not in self.tasks:
            raise ValueError(f"Task {task_id} not found")

        task = self.tasks[task_id]
        state_machine = self.state_machines[task_id]

        if not state_machine.can_retry():
            raise ValueError(f"Task {task_id} cannot be retried")

        # 重置任务
        task.retry_count += 1
        task.error_message = None
        task.error_type = None
        task.progress = 0.0

        # 状态转换: FAILED -> QUEUED
        await self._transition_task(task_id, TaskStatus.QUEUED)

        # 重新入队
        await self.queue.enqueue(task)

        logger.info(f"Retrying task {task_id}, attempt {task.retry_count}")

    async def cancel_task(self, task_id: str) -> None:
        """取消任务"""
        if task_id not in self.tasks:
            raise ValueError(f"Task {task_id} not found")

        # 状态转换: * -> CANCELLED
        await self._transition_task(task_id, TaskStatus.CANCELLED)

        # 从队列移除
        await self.queue.remove(task_id)

        logger.info(f"Cancelled task {task_id}")

    async def wait_for_task(self, task_id: str, timeout: float = None) -> TaskResult:
        """
        等待任务完成

        Args:
            task_id: 任务 ID
            timeout: 超时时间（秒）

        Returns:
            任务结果
        """
        start_time = asyncio.get_event_loop().time()

        while True:
            result = await self.get_task_status(task_id)

            if result.status in [TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED]:
                return result

            if timeout and (asyncio.get_event_loop().time() - start_time) > timeout:
                raise TimeoutError(f"Task {task_id} timed out")

            await asyncio.sleep(0.5)

    async def _transition_task(self, task_id: str, new_status: TaskStatus) -> None:
        """转换任务状态"""
        if task_id not in self.state_machines:
            raise ValueError(f"Task {task_id} not found")

        state_machine = self.state_machines[task_id]
        task = self.tasks[task_id]

        try:
            state_machine.transition_to(new_status)
            task.status = new_status

            # 更新时间戳
            if new_status == TaskStatus.PROCESSING:
                from datetime import datetime
                task.started_at = datetime.now()
            elif new_status in [TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED]:
                from datetime import datetime
                task.completed_at = datetime.now()

        except StateTransitionError as e:
            logger.error(f"State transition error for task {task_id}: {e}")
            raise

    async def _check_dependencies(self, task: TranslationTask) -> bool:
        """检查任务依赖是否满足"""
        for dep_id in task.depends_on:
            if dep_id not in self.tasks:
                logger.warning(f"Dependency {dep_id} not found for task {task.id}")
                return False

            dep_task = self.tasks[dep_id]
            if dep_task.status != TaskStatus.COMPLETED:
                return False

        return True

    async def _on_task_completed(self, task_id: str) -> None:
        """任务完成回调"""
        # 检查是否有其他任务依赖此任务
        for other_task_id, other_task in self.tasks.items():
            if task_id in other_task.depends_on and other_task.status == TaskStatus.PENDING:
                # 检查是否所有依赖都满足
                if await self._check_dependencies(other_task):
                    await self._transition_task(other_task_id, TaskStatus.QUEUED)
                    await self.queue.enqueue(other_task)
                    logger.info(f"Task {other_task_id} dependencies satisfied, enqueued")
