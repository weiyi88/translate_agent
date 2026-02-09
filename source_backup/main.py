import asyncio
import logging
from itertools import count

from dotenv import load_dotenv

from app.compent.index import launch_gradio
from app.service.logging_service import launch_logging_service, log_message
from app.util.config import Settings
from app.util.index import check_file_path, read_prompt


async def main():
    for file_name in Settings.NEED_FILE_LIST:
        if not check_file_path(Settings.PROMPT_PATH+file_name+".txt"):
            raise FileNotFoundError(f"{file_name} not found")
    load_dotenv()              # 加载环境变量
    launch_logging_service()   # 启动日志服务
    log_message(logging.INFO, "Application started")  # 使用新的日志函数
    await launch_gradio()

if __name__ == '__main__':
    asyncio.run(main())
