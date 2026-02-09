"""
任务状态机
"""
from enum import Enum
from typing import Callable, Dict

from app.models.task import TaskStatus


class StateTransitionError(Exception):
    """状态转换错误"""
    pass


class TaskStateMachine:
    """
    任务状态机

    状态转换规则:
    - PENDING -> QUEUED
    - QUEUED -> PROCESSING
    - PROCESSING -> COMPLETED
    - PROCESSING -> FAILED
    - FAILED -> QUEUED (重试)
    - QUEUED -> CANCELLED
    - PROCESSING -> CANCELLED
    - COMPLETED -> [*]
    - FAILED -> [*] (放弃重试)
    - CANCELLED -> [*]
    """

    # 定义允许的状态转换
    TRANSITIONS: Dict[TaskStatus, list[TaskStatus]] = {
        TaskStatus.PENDING: [TaskStatus.QUEUED, TaskStatus.CANCELLED],
        TaskStatus.QUEUED: [TaskStatus.PROCESSING, TaskStatus.CANCELLED],
        TaskStatus.PROCESSING: [TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED],
        TaskStatus.FAILED: [TaskStatus.QUEUED],  # 重试
        TaskStatus.COMPLETED: [],  # 终态
        TaskStatus.CANCELLED: [],  # 终态
    }

    def __init__(self):
        self.current_state: TaskStatus = TaskStatus.PENDING
        self.state_history: list[TaskStatus] = [TaskStatus.PENDING]

        # 状态变更回调
        self.on_state_change: Callable[[TaskStatus, TaskStatus], None] = lambda old, new: None

    def can_transition_to(self, new_state: TaskStatus) -> bool:
        """检查是否可以转换到新状态"""
        return new_state in self.TRANSITIONS.get(self.current_state, [])

    def transition_to(self, new_state: TaskStatus) -> None:
        """
        转换到新状态

        Args:
            new_state: 目标状态

        Raises:
            StateTransitionError: 如果不允许的转换
        """
        if not self.can_transition_to(new_state):
            raise StateTransitionError(
                f"Cannot transition from {self.current_state} to {new_state}"
            )

        old_state = self.current_state
        self.current_state = new_state
        self.state_history.append(new_state)

        # 触发回调
        self.on_state_change(old_state, new_state)

    def is_terminal(self) -> bool:
        """是否为终态"""
        return self.current_state in [TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED]

    def can_retry(self) -> bool:
        """是否可以重试"""
        return self.current_state == TaskStatus.FAILED

    def reset(self) -> None:
        """重置状态机"""
        self.current_state = TaskStatus.PENDING
        self.state_history = [TaskStatus.PENDING]
