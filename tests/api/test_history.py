"""
历史记录 API 测试
"""
import pytest
from datetime import datetime
from uuid import uuid4, UUID

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import TaskStatus


@pytest.mark.asyncio
class TestHistoryAPI:
    """历史记录 API 测试"""

    @pytest.fixture
    async def sample_tasks(self, db: AsyncSession):
        """创建示例任务"""
        from app.db.repository import TaskRepository

        repo = TaskRepository(db)

        tasks = []
        for i in range(5):
            task = await repo.create_task(
                file_name=f"test_{i}.pptx",
                file_path=f"/uploads/test_{i}.pptx",
                file_type="pptx",
                target_language="English",
                model="gpt-4o-mini",
                priority=5,
            )
            tasks.append(task)

        await db.commit()
        return tasks

    async def test_get_history(self, client: AsyncClient, sample_tasks):
        """测试查询历史记录"""
        response = await client.get("/api/translate/history/")

        assert response.status_code == 200
        data = response.json()

        # 验证响应结构
        assert "total" in data
        assert "page" in data
        assert "page_size" in data
        assert "items" in data

        # 验证数据
        assert data["total"] >= 5
        assert data["page"] == 1
        assert len(data["items"]) >= 5

        # 验证单项结构
        item = data["items"][0]
        assert "task_id" in item
        assert "file_name" in item
        assert "status" in item
        assert "progress" in item

    async def test_get_history_pagination(self, client: AsyncClient, sample_tasks):
        """测试分页"""
        # 第一页
        response = await client.get("/api/translate/history/?page=1&page_size=2")
        assert response.status_code == 200
        data = response.json()
        assert data["page"] == 1
        assert data["page_size"] == 2
        assert len(data["items"]) == 2

        # 第二页
        response = await client.get("/api/translate/history/?page=2&page_size=2")
        assert response.status_code == 200
        data = response.json()
        assert data["page"] == 2
        assert len(data["items"]) >= 1

    async def test_get_history_filter_by_status(self, client: AsyncClient, sample_tasks):
        """测试按状态筛选"""
        response = await client.get(
            "/api/translate/history/?status=pending"
        )

        assert response.status_code == 200
        data = response.json()

        # 所有返回的任务状态都应该是 pending
        for item in data["items"]:
            assert item["status"] == "pending"

    async def test_get_history_sorting(self, client: AsyncClient, sample_tasks):
        """测试排序"""
        # 升序
        response = await client.get(
            "/api/translate/history/?order_by=created_at&desc=false"
        )
        assert response.status_code == 200
        data = response.json()

        # 验证时间升序
        if len(data["items"]) > 1:
            times = [item["created_at"] for item in data["items"]]
            assert times == sorted(times)

    async def test_get_task_detail(self, client: AsyncClient, sample_tasks):
        """测试查询任务详情"""
        task_id = sample_tasks[0].id

        response = await client.get(f"/api/translate/history/{task_id}")

        assert response.status_code == 200
        data = response.json()

        # 验证详情字段
        assert data["task_id"] == str(task_id)
        assert "file_name" in data
        assert "file_path" in data
        assert "status" in data
        assert "progress" in data
        assert "created_at" in data

    async def test_get_task_detail_not_found(self, client: AsyncClient):
        """测试查询不存在的任务"""
        fake_id = uuid4()

        response = await client.get(f"/api/translate/history/{fake_id}")

        assert response.status_code == 404
        assert "不存在" in response.json()["detail"]

    async def test_delete_task(self, client: AsyncClient, sample_tasks):
        """测试删除任务"""
        task_id = sample_tasks[0].id

        response = await client.delete(
            f"/api/translate/history/{task_id}?delete_files=false"
        )

        assert response.status_code == 200
        data = response.json()

        assert data["success"] is True
        assert "已删除" in data["message"]

        # 验证任务已被删除
        response = await client.get(f"/api/translate/history/{task_id}")
        assert response.status_code == 404

    async def test_delete_task_with_files(self, client: AsyncClient, sample_tasks, tmp_path):
        """测试删除任务并清理文件"""
        # 创建临时文件
        test_file = tmp_path / "test.pptx"
        test_file.write_text("test")

        # 更新任务的文件路径
        from app.db.repository import TaskRepository
        from app.db.database import get_db

        async for db in get_db():
            repo = TaskRepository(db)
            await repo.update_task(
                task_id=sample_tasks[1].id,
                file_path=str(test_file),
            )
            await db.commit()
            break

        task_id = sample_tasks[1].id

        # 删除任务
        response = await client.delete(
            f"/api/translate/history/{task_id}?delete_files=true"
        )

        assert response.status_code == 200
        data = response.json()

        assert data["success"] is True
        # 文件应该被删除
        assert not test_file.exists()

    async def test_delete_task_not_found(self, client: AsyncClient):
        """测试删除不存在的任务"""
        fake_id = uuid4()

        response = await client.delete(f"/api/translate/history/{fake_id}")

        assert response.status_code == 404

    async def test_invalid_page_number(self, client: AsyncClient):
        """测试无效的页码"""
        response = await client.get("/api/translate/history/?page=0")

        assert response.status_code == 422  # Validation error

    async def test_invalid_page_size(self, client: AsyncClient):
        """测试无效的每页条数"""
        response = await client.get("/api/translate/history/?page_size=101")

        assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
class TestHistoryAPIEdgeCases:
    """边缘情况测试"""

    async def test_empty_history(self, client: AsyncClient):
        """测试空历史记录"""
        response = await client.get("/api/translate/history/")

        assert response.status_code == 200
        data = response.json()

        assert data["total"] == 0
        assert data["items"] == []

    async def test_large_page_number(self, client: AsyncClient):
        """测试超大页码"""
        response = await client.get("/api/translate/history/?page=9999")

        assert response.status_code == 200
        data = response.json()

        # 应该返回空列表
        assert data["items"] == []
