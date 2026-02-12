"""
Task #3 API 端点测试模板

为实现准备的测试骨架
"""
import pytest
from uuid import uuid4
from httpx import AsyncClient
from fastapi import status

from app.main import app
from app.models.task import TaskStatus


@pytest.fixture
async def client():
    """创建测试客户端"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def sample_task_data():
    """示例任务数据"""
    return {
        "file_path": "uploads/test.pptx",
        "file_type": "pptx",
        "target_language": "English",
        "model": "gpt-4o",
        "priority": 5
    }


# ==================== 任务管理 API 测试 ====================

@pytest.mark.asyncio
async def test_create_task(client: AsyncClient, sample_task_data):
    """测试创建任务"""
    response = await client.post("/api/tasks", json=sample_task_data)
    assert response.status_code == status.HTTP_201_CREATED

    data = response.json()
    assert "id" in data
    assert data["file_type"] == "pptx"
    assert data["status"] == "pending"
    assert data["progress"] == 0.0


@pytest.mark.asyncio
async def test_create_task_invalid_data(client: AsyncClient):
    """测试创建任务（无效数据）"""
    invalid_data = {
        "file_path": "uploads/test.pptx",
        # 缺少必需字段
    }
    response = await client.post("/api/tasks", json=invalid_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_batch_create_tasks(client: AsyncClient, sample_task_data):
    """测试批量创建任务"""
    tasks = [sample_task_data, sample_task_data]
    response = await client.post("/api/tasks/batch", json=tasks)
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert len(data) == 2
    assert all("id" in task for task in data)


@pytest.mark.asyncio
async def test_get_task(client: AsyncClient, sample_task_data):
    """测试获取任务详情"""
    # 先创建任务
    create_response = await client.post("/api/tasks", json=sample_task_data)
    task_id = create_response.json()["id"]

    # 获取任务
    response = await client.get(f"/api/tasks/{task_id}")
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert data["id"] == task_id


@pytest.mark.asyncio
async def test_get_task_not_found(client: AsyncClient):
    """测试获取不存在的任务"""
    fake_id = str(uuid4())
    response = await client.get(f"/api/tasks/{fake_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.asyncio
async def test_list_tasks(client: AsyncClient, sample_task_data):
    """测试获取任务列表"""
    # 创建几个任务
    for _ in range(3):
        await client.post("/api/tasks", json=sample_task_data)

    # 获取列表
    response = await client.get("/api/tasks?limit=10")
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert "total" in data
    assert "items" in data
    assert len(data["items"]) >= 3


@pytest.mark.asyncio
async def test_list_tasks_with_filter(client: AsyncClient, sample_task_data):
    """测试过滤任务列表"""
    response = await client.get("/api/tasks?status=pending&limit=10")
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    # 所有返回的任务应该是 pending 状态
    assert all(task["status"] == "pending" for task in data["items"])


@pytest.mark.asyncio
async def test_update_task(client: AsyncClient, sample_task_data):
    """测试更新任务"""
    # 创建任务
    create_response = await client.post("/api/tasks", json=sample_task_data)
    task_id = create_response.json()["id"]

    # 更新任务
    update_data = {"status": "processing", "progress": 50.0}
    response = await client.patch(f"/api/tasks/{task_id}", json=update_data)
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert data["status"] == "processing"
    assert data["progress"] == 50.0


@pytest.mark.asyncio
async def test_cancel_task(client: AsyncClient, sample_task_data):
    """测试取消任务"""
    # 创建任务
    create_response = await client.post("/api/tasks", json=sample_task_data)
    task_id = create_response.json()["id"]

    # 取消任务
    response = await client.post(f"/api/tasks/{task_id}/cancel")
    assert response.status_code == status.HTTP_200_OK

    # 验证状态
    get_response = await client.get(f"/api/tasks/{task_id}")
    assert get_response.json()["status"] == "cancelled"


@pytest.mark.asyncio
async def test_retry_task(client: AsyncClient, sample_task_data):
    """测试重试任务"""
    # 创建任务
    create_response = await client.post("/api/tasks", json=sample_task_data)
    task_id = create_response.json()["id"]

    # 先标记为失败
    await client.patch(f"/api/tasks/{task_id}", json={"status": "failed"})

    # 重试任务
    response = await client.post(f"/api/tasks/{task_id}/retry")
    assert response.status_code == status.HTTP_202_ACCEPTED

    data = response.json()
    assert "retry_count" in data


@pytest.mark.asyncio
async def test_delete_task(client: AsyncClient, sample_task_data):
    """测试删除任务"""
    # 创建任务
    create_response = await client.post("/api/tasks", json=sample_task_data)
    task_id = create_response.json()["id"]

    # 删除任务
    response = await client.delete(f"/api/tasks/{task_id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT

    # 验证已删除
    get_response = await client.get(f"/api/tasks/{task_id}")
    assert get_response.status_code == status.HTTP_404_NOT_FOUND


# ==================== 文件管理 API 测试 ====================

@pytest.mark.asyncio
async def test_upload_file(client: AsyncClient):
    """测试文件上传"""
    files = {"file": ("test.pptx", b"fake pptx content", "application/vnd.openxmlformats-officedocument.presentationml.presentation")}
    response = await client.post("/api/upload", files=files)
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert "file_path" in data
    assert "file_name" in data
    assert "file_size" in data


@pytest.mark.asyncio
async def test_upload_invalid_file_type(client: AsyncClient):
    """测试上传不支持的文件类型"""
    files = {"file": ("test.txt", b"text content", "text/plain")}
    response = await client.post("/api/upload", files=files)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.asyncio
async def test_download_file(client: AsyncClient):
    """测试文件下载"""
    # TODO: 先上传一个文件，然后下载
    pass


@pytest.mark.asyncio
async def test_delete_file(client: AsyncClient):
    """测试文件删除"""
    # TODO: 先上传一个文件，然后删除
    pass


# ==================== 统计和监控 API 测试 ====================

@pytest.mark.asyncio
async def test_get_stats(client: AsyncClient):
    """测试获取统计信息"""
    response = await client.get("/api/stats")
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert "total_tasks" in data
    assert "pending" in data
    assert "processing" in data
    assert "completed" in data
    assert "failed" in data


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """测试健康检查"""
    response = await client.get("/api/health")
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert "status" in data
    assert "database" in data
    assert data["status"] in ["healthy", "degraded", "unhealthy"]


# ==================== SSE 测试 ====================

@pytest.mark.asyncio
async def test_task_stream(client: AsyncClient, sample_task_data):
    """测试任务进度 SSE 流"""
    # 创建任务
    create_response = await client.post("/api/tasks", json=sample_task_data)
    task_id = create_response.json()["id"]

    # TODO: 测试 SSE 流
    # 需要特殊的 SSE 客户端
    pass


# ==================== 错误处理测试 ====================

@pytest.mark.asyncio
async def test_invalid_task_id_format(client: AsyncClient):
    """测试无效的任务 ID 格式"""
    response = await client.get("/api/tasks/invalid-uuid")
    assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_422_UNPROCESSABLE_ENTITY]


@pytest.mark.asyncio
async def test_database_error_handling(client: AsyncClient):
    """测试数据库错误处理"""
    # TODO: 模拟数据库错误
    pass


# ==================== 性能测试 ====================

@pytest.mark.asyncio
async def test_concurrent_task_creation(client: AsyncClient, sample_task_data):
    """测试并发创建任务"""
    import asyncio

    # 并发创建 10 个任务
    tasks = [
        client.post("/api/tasks", json=sample_task_data)
        for _ in range(10)
    ]

    responses = await asyncio.gather(*tasks)
    assert all(r.status_code == status.HTTP_201_CREATED for r in responses)


@pytest.mark.asyncio
async def test_pagination_performance(client: AsyncClient):
    """测试分页性能"""
    # 获取大量任务
    response = await client.get("/api/tasks?limit=1000")
    assert response.status_code == status.HTTP_200_OK

    # 响应时间应该合理（这里只检查是否成功）
    data = response.json()
    assert "items" in data
