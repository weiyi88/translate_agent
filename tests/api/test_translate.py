"""
翻译 API 端点测试 - MVP 核心 3 端点
"""
import pytest
import asyncio
from uuid import uuid4
from pathlib import Path
from httpx import AsyncClient, ASGITransport
from fastapi import status

# 测试文件路径
TEST_FILES_DIR = Path(__file__).parent / "test_files"
TEST_FILES_DIR.mkdir(exist_ok=True)


@pytest.fixture
def sample_pptx_file():
    """创建示例 PPTX 文件"""
    file_path = TEST_FILES_DIR / "test.pptx"
    # 创建一个简单的假 PPTX 文件（实际测试中应该是真实文件）
    file_path.write_bytes(b"PK\x03\x04" + b"fake pptx content")
    yield file_path
    # 清理
    if file_path.exists():
        file_path.unlink()


@pytest.mark.asyncio
async def test_upload_and_translate_success(client, sample_pptx_file):
    """测试上传并创建翻译任务 - 成功场景"""
    with open(sample_pptx_file, "rb") as f:
        files = {
            "file": ("test.pptx", f, "application/vnd.openxmlformats-officedocument.presentationml.presentation")
        }
        data = {
            "target_language": "English",
            "model": "gpt-4"
        }

        response = await client.post(
            "/api/translate/upload",
            files=files,
            data=data
        )

    assert response.status_code == status.HTTP_201_CREATED

    data = response.json()
    assert "task_id" in data
    assert data["status"] == "pending"
    assert "message" in data

    # 保存 task_id 用于后续测试
    return data["task_id"]


@pytest.mark.asyncio
async def test_upload_invalid_file_type():
    """测试上传不支持的文件类型"""
    from app.main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 创建一个 .txt 文件
        files = {
            "file": ("test.txt", b"text content", "text/plain")
        }
        data = {
            "target_language": "English",
            "model": "gpt-4"
        }

        response = await client.post(
            "/api/translate/upload",
            files=files,
            data=data
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Unsupported file type" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_task_status_success():
    """测试查询任务状态 - 成功场景"""
    from app.main import app

    # 先创建一个任务
    task_id = await test_upload_and_translate_success(None)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"/api/translate/status/{task_id}")

        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert data["task_id"] == task_id
        assert "status" in data
        assert "progress" in data
        assert "file_name" in data
        assert "created_at" in data


@pytest.mark.asyncio
async def test_get_task_status_not_found():
    """测试查询不存在的任务"""
    from app.main import app

    fake_task_id = str(uuid4())

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"/api/translate/status/{fake_task_id}")

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.asyncio
async def test_get_task_status_invalid_uuid():
    """测试使用无效的 UUID 格式"""
    from app.main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/translate/status/invalid-uuid")

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_download_file_not_completed():
    """测试下载未完成任务的文件"""
    from app.main import app

    # 创建一个任务（状态为 pending）
    task_id = await test_upload_and_translate_success(None)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"/api/translate/download/{task_id}")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "not completed" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_download_file_not_found():
    """测试下载不存在的任务"""
    from app.main import app

    fake_task_id = str(uuid4())

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"/api/translate/download/{fake_task_id}")

        assert response.status_code == status.HTTP_404_NOT_FOUND


# ==================== 集成测试 ====================

@pytest.mark.asyncio
async def test_full_workflow(sample_pptx_file):
    """测试完整工作流：上传 -> 轮询状态 -> 下载"""
    from app.main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. 上传文件
        with open(sample_pptx_file, "rb") as f:
            files = {
                "file": ("test.pptx", f, "application/vnd.openxmlformats-officedocument.presentationml.presentation")
            }
            data = {
                "target_language": "English",
                "model": "gpt-4"
            }

            upload_response = await client.post(
                "/api/translate/upload",
                files=files,
                data=data
            )

        assert upload_response.status_code == status.HTTP_201_CREATED
        task_id = upload_response.json()["task_id"]

        # 2. 轮询状态（最多等待 30 秒）
        max_attempts = 60
        for i in range(max_attempts):
            status_response = await client.get(f"/api/translate/status/{task_id}")
            assert status_response.status_code == status.HTTP_200_OK

            task_status = status_response.json()
            print(f"Attempt {i+1}: Status = {task_status['status']}, Progress = {task_status['progress']}%")

            if task_status["status"] == "completed":
                # 3. 下载文件
                download_response = await client.get(f"/api/translate/download/{task_id}")
                assert download_response.status_code == status.HTTP_200_OK
                assert len(download_response.content) > 0
                print("✅ Translation completed and downloaded successfully")
                break

            elif task_status["status"] == "failed":
                pytest.fail(f"Translation failed: {task_status.get('error_message', 'Unknown error')}")
                break

            # 等待 0.5 秒后重试
            await asyncio.sleep(0.5)
        else:
            pytest.fail("Translation timed out after 30 seconds")


# ==================== 性能测试 ====================

@pytest.mark.asyncio
async def test_concurrent_uploads(sample_pptx_file):
    """测试并发上传"""
    from app.main import app

    async def upload_file():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            with open(sample_pptx_file, "rb") as f:
                files = {
                    "file": ("test.pptx", f, "application/vnd.openxmlformats-officedocument.presentationml.presentation")
                }
                data = {
                    "target_language": "English",
                    "model": "gpt-4"
                }

                response = await client.post(
                    "/api/translate/upload",
                    files=files,
                    data=data
                )
                return response.status_code

    # 并发上传 5 个文件
    tasks = [upload_file() for _ in range(5)]
    results = await asyncio.gather(*tasks)

    # 所有上传都应该成功
    assert all(code == status.HTTP_201_CREATED for code in results)
