"""
翻译引擎测试
"""
import pytest
from datetime import datetime

from app.core.engine import TranslationEngine
from app.models.task import TaskStatus, TaskPriority


@pytest.mark.asyncio
async def test_engine_lifecycle():
    """测试引擎生命周期"""
    engine = TranslationEngine(max_concurrent_tasks=2)

    # 启动
    await engine.start()
    assert engine.is_running is True

    # 停止
    await engine.stop()
    assert engine.is_running is False


@pytest.mark.asyncio
async def test_create_task():
    """测试创建任务"""
    engine = TranslationEngine()
    await engine.start()

    task = await engine.create_task(
        file_path="/path/to/file.pptx",
        file_type="pptx",
        target_language="English",
        model="gpt-4o-mini",
        priority=TaskPriority.NORMAL,
    )

    assert task.id is not None
    assert task.file_path == "/path/to/file.pptx"
    assert task.status == TaskStatus.QUEUED
    assert task.retry_count == 0

    await engine.stop()


@pytest.mark.asyncio
async def test_task_dependencies():
    """测试任务依赖关系"""
    engine = TranslationEngine()
    await engine.start()

    # 创建任务 A
    task_a = await engine.create_task(
        file_path="/path/to/a.pptx",
        file_type="pptx",
        target_language="English",
        model="gpt-4o-mini",
    )

    # 创建任务 B，依赖 A
    task_b = await engine.create_task(
        file_path="/path/to/b.docx",
        file_type="docx",
        target_language="English",
        model="gpt-4o-mini",
        depends_on=[task_a.id],
    )

    assert task_b.depends_on == [task_a.id]
    assert task_a.status == TaskStatus.QUEUED
    assert task_b.status == TaskStatus.PENDING  # 等待依赖

    await engine.stop()


@pytest.mark.asyncio
async def test_cancel_task():
    """测试取消任务"""
    engine = TranslationEngine()
    await engine.start()

    task = await engine.create_task(
        file_path="/path/to/file.pptx",
        file_type="pptx",
        target_language="English",
        model="gpt-4o-mini",
    )

    await engine.cancel_task(task.id)

    status = await engine.get_task_status(task.id)
    assert status.status == TaskStatus.CANCELLED

    await engine.stop()
