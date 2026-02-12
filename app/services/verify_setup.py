"""
PPT 翻译服务快速验证脚本

用于验证服务是否正确配置和工作
"""
import asyncio
import logging
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


async def verify_imports():
    """验证所有必要的导入"""
    try:
        from app.services.ppt_translation_service import PPTTranslationService
        logger.info("✓ PPTTranslationService 导入成功")

        from app.services.factory import TranslationServiceFactory
        logger.info("✓ TranslationServiceFactory 导入成功")

        from app.service.langchain.index import LLM_obj
        logger.info("✓ LLM_obj 导入成功")

        from app.util.pptx import (
            get_psr,
            page_num_presentation,
            extract_text_from_presentation,
            restore_text_to_presentation,
            save_traslate_file,
        )
        logger.info("✓ pptx 工具函数导入成功")

        from app.util.config import Settings
        logger.info("✓ Settings 导入成功")

        return True
    except Exception as e:
        logger.error(f"✗ 导入失败: {e}")
        return False


async def verify_factory():
    """验证工厂可以正确加载 prompt"""
    try:
        from app.services.factory import TranslationServiceFactory

        factory = TranslationServiceFactory()
        logger.info("✓ 工厂创建成功")

        # 尝试加载 prompt
        prompt = factory.load_prompt("translate_pptx_json")
        logger.info(f"✓ PPT prompt 加载成功 (长度: {len(prompt)})")

        struct = factory.load_prompt("struct_json")
        logger.info(f"✓ struct prompt 加载成功 (长度: {len(struct)})")

        return True
    except FileNotFoundError as e:
        logger.error(f"✗ Prompt 文件未找到: {e}")
        logger.error("请确保 source_backup/app/prompt/ 目录存在且包含必要的文件")
        return False
    except Exception as e:
        logger.error(f"✗ 工厂验证失败: {e}")
        return False


async def verify_llm_service():
    """验证 LLM 服务可以创建"""
    try:
        from app.service.langchain.index import LLM_obj

        # 尝试创建一个 LLM 服务（不实际调用 API）
        llm_service = LLM_obj("gpt-4o-mini")
        logger.info("✓ LLM 服务创建成功")

        # 检查必要的方法
        if hasattr(llm_service, 'translates_chain'):
            logger.info("✓ LLM 服务有 translates_chain 方法")
        else:
            logger.warning("✗ LLM 服务缺少 translates_chain 方法")
            return False

        return True
    except Exception as e:
        logger.error(f"✗ LLM 服务验证失败: {e}")
        return False


async def verify_service_creation():
    """验证可以创建 PPT 翻译服务"""
    try:
        from app.services.factory import TranslationServiceFactory
        from app.service.langchain.index import LLM_obj

        factory = TranslationServiceFactory()
        llm_service = LLM_obj("gpt-4o-mini")

        def progress_callback(progress: float, message: str):
            logger.info(f"进度回调: [{progress:.1f}%] {message}")

        service = factory.create_ppt_service(
            llm_service=llm_service,
            progress_callback=progress_callback,
        )

        logger.info("✓ PPT 翻译服务创建成功")

        # 检查服务方法
        if hasattr(service, 'translate'):
            logger.info("✓ 服务有 translate 方法")
        else:
            logger.warning("✗ 服务缺少 translate 方法")
            return False

        return True
    except Exception as e:
        logger.error(f"✗ 服务创建失败: {e}")
        return False


async def verify_config():
    """验证配置"""
    try:
        from app.util.config import Settings

        logger.info(f"✓ 输入路径: {Settings.FILE_INPUT_PATH}")
        logger.info(f"✓ 输出路径: {Settings.FILE_OUTPUT_PATH}")
        logger.info(f"✓ 日志路径: {Settings.LOGGING_LOG_PATH}")
        logger.info(f"✓ Prompt 路径: {Settings.PROMPT_PATH}")

        # 检查目录是否存在
        input_path = Path(Settings.FILE_INPUT_PATH)
        output_path = Path(Settings.FILE_OUTPUT_PATH)

        if not input_path.exists():
            logger.warning(f"⚠ 输入目录不存在: {input_path}")

        if not output_path.exists():
            logger.warning(f"⚠ 输出目录不存在: {output_path}")

        return True
    except Exception as e:
        logger.error(f"✗ 配置验证失败: {e}")
        return False


async def main():
    """主函数"""
    logger.info("=" * 60)
    logger.info("PPT 翻译服务验证脚本")
    logger.info("=" * 60)

    results = []

    logger.info("\n1. 验证导入...")
    results.append(await verify_imports())

    logger.info("\n2. 验证工厂...")
    results.append(await verify_factory())

    logger.info("\n3. 验证 LLM 服务...")
    results.append(await verify_llm_service())

    logger.info("\n4. 验证服务创建...")
    results.append(await verify_service_creation())

    logger.info("\n5. 验证配置...")
    results.append(await verify_config())

    logger.info("\n" + "=" * 60)
    if all(results):
        logger.info("✓ 所有验证通过！服务已准备就绪。")
        logger.info("=" * 60)
        return 0
    else:
        logger.error("✗ 部分验证失败，请检查错误信息。")
        logger.info("=" * 60)
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
