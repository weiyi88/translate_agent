"""
FastAPI 应用入口 - 用于测试
从根目录的 main.py 导入 app 实例
"""
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# 从根目录导入 app
from main import app

__all__ = ['app']
