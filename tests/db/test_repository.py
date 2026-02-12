"""
数据库 Repository 测试
"""
import pytest
from uuid import UUID
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.db.database import Base
from app.db.models import TranslationTaskDB
from app.db.repository import TaskRepository
from app.models.task import TaskStatus, TaskPriority, ErrorType


# 使用内存数据库进行测试
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture
async def engine():
    """创建测试数据库引擎"""
    engine = create_async_engine(TEST_DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
async def session(engine):
    """创建测试会话"""
    async_session = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
        await session.rollback()


@pytest.fixture
def repository(session):
    """创建 Repository 实例"""
    return TaskRepository(session)


@pytest.mark.asyncio
async def test_create_task(repository: TaskRepository, session: AsyncSession):
    """测试创建任务"""
    task = await repository.create_task(
        file_name="test.pptx",
        file_path="/path/to/test.pptx",
        file_type="pptx",
        target_language="English",
        model="gpt-4o",
        priority=TaskPriority.HIGH,
    )
    await session.commit()

    assert task.id is not None
    assert isinstance(task.id, UUID)
    assert task.file_name == "test.pptx"
    assert task.file_path == "/path/to/test.pptx"
    assert task.file_type == "pptx"
    assert task.target_language == "English"
    assert task.model == "gpt-4o"
    assert task.status == TaskStatus.PENDING
    assert task.priority == TaskPriority.HIGH
    assert task.progress == 0.0


@pytest.mark.asyncio
async def test_get_task(repository: TaskRepository, session: AsyncSession):
    """测试获取单个任务"""
    # 创建任务
    task = await repository.create_task(
        file_name="test.docx",
        file_path="/path/to/test.docx",
        file_type="docx",
        target_language="Chinese",
        model="claude-opus-4",
    )
    await session.commit()

    # 获取任务
    retrieved_task = await repository.get_task(task.id)
    assert retrieved_task is not None
    assert retrieved_task.id == task.id
    assert retrieved_task.file_name == "test.docx"

    # 测试不存在的任务
    from uuid import uuid4
    non_existent = await repository.get_task(uuid4())
    assert non_existent is None


@pytest.mark.asyncio
async def test_get_tasks(repository: TaskRepository, session: AsyncSession):
    """测试获取任务列表"""
    # 创建多个任务
    for i in range(5):
        await repository.create_task(
            file_name=f"test_{i}.pptx",
            file_path=f"/path/to/test_{i}.pptx",
            file_type="pptx",
            target_language="English",
            model="gpt-4o",
        )
    await session.commit()

    # 获取所有任务
    tasks = await repository.get_tasks()
    assert len(tasks) == 5

    # 测试分页
    tasks_page1 = await repository.get_tasks(skip=0, limit=2)
    assert len(tasks_page1) == 2

    tasks_page2 = await repository.get_tasks(skip=2, limit=2)
    assert len(tasks_page2) == 2


@pytest.mark.asyncio
async def test_update_task(repository: TaskRepository, session: AsyncSession):
    """测试更新任务"""
    # 创建任务
    task = await repository.create_task(
        file_name="test.xlsx",
        file_path="/path/to/test.xlsx",
        file_type="xlsx",
        target_language="Japanese",
        model="moonshot-v1",
    )
    await session.commit()

    # 更新任务状态和进度
    updated_task = await repository.update_task(
        task.id,
        status=TaskStatus.PROCESSING,
        progress=50.0,
        started_at=datetime.now(),
    )
    await session.commit()

    assert updated_task is not None
    assert updated_task.status == TaskStatus.PROCESSING
    assert updated_task.progress == 50.0
    assert updated_task.started_at is not None


@pytest.mark.asyncio
async def test_update_task_with_error(repository: TaskRepository, session: AsyncSession):
    """测试更新任务错误信息"""
    # 创建任务
    task = await repository.create_task(
        file_name="test.pdf",
        file_path="/path/to/test.pdf",
        file_type="pdf",
        target_language="French",
        model="claude-sonnet",
    )
    await session.commit()

    # 更新错误信息
    updated_task = await repository.update_task(
        task.id,
        status=TaskStatus.FAILED,
        error_message="API call failed",
        error_type=ErrorType.API_ERROR,
    )
    await session.commit()

    assert updated_task.status == TaskStatus.FAILED
    assert updated_task.error_message == "API call failed"
    assert updated_task.error_type == ErrorType.API_ERROR


@pytest.mark.asyncio
async def test_delete_task(repository: TaskRepository, session: AsyncSession):
    """测试删除任务"""
    # 创建任务
    task = await repository.create_task(
        file_name="test.pptx",
        file_path="/path/to/test.pptx",
        file_type="pptx",
        target_language="English",
        model="gpt-4o",
    )
    await session.commit()

    # 删除任务
    success = await repository.delete_task(task.id)
    await session.commit()
    assert success is True

    # 验证删除
    deleted_task = await repository.get_task(task.id)
    assert deleted_task is None

    # 测试删除不存在的任务
    from uuid import uuid4
    success = await repository.delete_task(uuid4())
    assert success is False


@pytest.mark.asyncio
async def test_count_tasks(repository: TaskRepository, session: AsyncSession):
    """测试统计任务数量"""
    # 创建任务
    for i in range(3):
        await repository.create_task(
            file_name=f"test_{i}.pptx",
            file_path=f"/path/to/test_{i}.pptx",
            file_type="pptx",
            target_language="English",
            model="gpt-4o",
        )
    await session.commit()

    # 统计全部任务
    count = await repository.count_tasks()
    assert count == 3

    # 按状态统计
    count_pending = await repository.count_tasks(status=TaskStatus.PENDING)
    assert count_pending == 3


@pytest.mark.asyncio
async def test_get_pending_tasks(repository: TaskRepository, session: AsyncSession):
    """测试获取待处理任务"""
    # 创建不同优先级的任务
    await repository.create_task(
        file_name="low.pptx",
        file_path="/path/low.pptx",
        file_type="pptx",
        target_language="English",
        model="gpt-4o",
        priority=TaskPriority.LOW,
    )
    await repository.create_task(
        file_name="high.pptx",
        file_path="/path/high.pptx",
        file_type="pptx",
        target_language="English",
        model="gpt-4o",
        priority=TaskPriority.HIGH,
    )
    await session.commit()

    # 获取待处理任务（应按优先级排序）
    pending_tasks = await repository.get_pending_tasks()
    assert len(pending_tasks) == 2
    assert pending_tasks[0].file_name == "high.pptx"  # 高优先级在前


@pytest.mark.asyncio
async def test_increment_retry_count(repository: TaskRepository, session: AsyncSession):
    """测试增加重试次数"""
    # 创建任务
    task = await repository.create_task(
        file_name="test.pptx",
        file_path="/path/to/test.pptx",
        file_type="pptx",
        target_language="English",
        model="gpt-4o",
    )
    await session.commit()

    assert task.retry_count == 0

    # 增加重试次数
    updated = await repository.increment_retry_count(task.id)
    await session.commit()
    assert updated.retry_count == 1

    # 再次增加
    updated = await repository.increment_retry_count(task.id)
    await session.commit()
    assert updated.retry_count == 2
