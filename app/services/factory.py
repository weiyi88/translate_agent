"""
翻译服务工厂

负责创建和配置各种文件类型的翻译服务
"""
import logging
from pathlib import Path
from typing import Callable, Optional

from app.services.ppt_translation_service import PPTTranslationService


logger = logging.getLogger(__name__)


class TranslationServiceFactory:
    """翻译服务工厂"""

    def __init__(self, prompt_dir: str = None):
        """
        初始化工厂

        Args:
            prompt_dir: prompt 文件目录，默认为 source_backup/app/prompt
        """
        if prompt_dir is None:
            # 默认 prompt 目录
            project_root = Path(__file__).parent.parent.parent
            prompt_dir = project_root / "source_backup" / "app" / "prompt"

        self.prompt_dir = Path(prompt_dir)
        logger.info(f"TranslationServiceFactory initialized with prompt_dir={self.prompt_dir}")

    def load_prompt(self, prompt_name: str) -> str:
        """
        加载 prompt 文件

        Args:
            prompt_name: prompt 文件名（不含扩展名）

        Returns:
            prompt 内容

        Raises:
            FileNotFoundError: prompt 文件不存在
        """
        prompt_file = self.prompt_dir / f"{prompt_name}.txt"

        if not prompt_file.exists():
            raise FileNotFoundError(f"Prompt file not found: {prompt_file}")

        with open(prompt_file, 'r', encoding='utf-8') as f:
            content = f.read()

        logger.info(f"Loaded prompt: {prompt_name}")
        return content

    def create_ppt_service(
        self,
        llm_service,
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ) -> PPTTranslationService:
        """
        创建 PPT 翻译服务

        Args:
            llm_service: LLM 服务实例
            progress_callback: 进度回调函数

        Returns:
            PPT 翻译服务实例

        Raises:
            FileNotFoundError: prompt 文件不存在
        """
        # 加载 prompt
        prompt = self.load_prompt("translate_pptx_json")
        struct = self.load_prompt("struct_json")

        # 创建服务
        service = PPTTranslationService(
            llm_service=llm_service,
            prompt=prompt,
            struct=struct,
            progress_callback=progress_callback,
        )

        logger.info("Created PPT translation service")
        return service

    # TODO: 添加其他文件类型的工厂方法
    # def create_word_service(...)
    # def create_excel_service(...)
    # def create_pdf_service(...)
