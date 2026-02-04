"""
任务队列
"""
import asyncio
import heapq
from typing import Optional

from app.models.task import TranslationTask


class TaskQueue:
    """
    优先级任务队列

    特性:
    - 基于优先级的队列
    - FIFO 同级排序
    - 线程安全
    """

    def __init__(self, max_size: int = 100):
        self.max_size = max_size
        self._queue: list[tuple[int, int, TranslationTask]] = []  # (priority, counter, task)
        self._counter = 0
        self._lock = asyncio.Lock()
        self._not_empty = asyncio.Condition(self._lock)

    async def enqueue(self, task: TranslationTask) -> None:
        """
        任务入队

        Args:
            task: 翻译任务
        """
        async with self._lock:
            if len(self._queue) >= self.max_size:
                raise QueueFullError(f"Queue is full (max_size={self.max_size})")

            # 使用负优先级，因为 heapq 是最小堆
            priority = -task.priority
            heapq.heappush(self._queue, (priority, self._counter, task))
            self._counter += 1
            self._not_empty.notify()

            import logging
            logging.info(f"Task {task.id} enqueued (priority={task.priority}, queue_size={len(self._queue)})")

    async def dequeue(self) -> TranslationTask:
        """
        任务出队

        Returns:
            翻译任务

        Raises:
            QueueEmptyError: 队列为空
        """
        async with self._lock:
            while len(self._queue) == 0:
                await self._not_empty.wait()

            _, _, task = heapq.heappop(self._queue)
            logging = __import__("logging").getLogger(__name__)
            logging.info(f"Task {task.id} dequeued (queue_size={len(self._queue)})")
            return task

    async def peek(self) -> Optional[TranslationTask]:
        """查看队首任务（不移除）"""
        async with self._lock:
            if len(self._queue) == 0:
                return None
            _, _, task = self._queue[0]
            return task

    async def remove(self, task_id: str) -> bool:
        """
        从队列中移除任务

        Args:
            task_id: 任务 ID

        Returns:
            是否成功移除
        """
        async with self._lock:
            for i, (_, _, task) in enumerate(self._queue):
                if task.id == task_id:
                    self._queue.pop(i)
                    heapq.heapify(self._queue)
                    logging = __import__("logging").getLogger(__name__)
                    logging.info(f"Task {task_id} removed from queue")
                    return True
            return False

    async def size(self) -> int:
        """获取队列大小"""
        async with self._lock:
            return len(self._queue)

    async def is_empty(self) -> bool:
        """队列是否为空"""
        async with self._lock:
            return len(self._queue) == 0

    def clear(self) -> None:
        """清空队列"""
        self._queue.clear()
        self._counter = 0


class QueueFullError(Exception):
    """队列已满"""
    pass


class QueueEmptyError(Exception):
    """队列为空"""
    pass
