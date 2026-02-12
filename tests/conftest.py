"""
Pytest 配置 - 简化版
"""
import pytest
from pathlib import Path


@pytest.fixture(autouse=True)
def setup_test_files():
    """自动创建测试文件目录"""
    test_files_dir = Path(__file__).parent / "test_files"
    test_files_dir.mkdir(exist_ok=True)
    yield
