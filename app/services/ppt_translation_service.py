"""
PPT 翻译服务

负责 PPT 文件的翻译处理，保留原有格式
"""
import asyncio
import inspect
import logging
from pathlib import Path
from typing import Callable, Optional, Union

from pptx import Presentation

from app.util.pptx import (
    extract_text_from_presentation,
    get_psr,
    page_num_presentation,
    restore_text_to_presentation,
    save_traslate_file,
)


logger = logging.getLogger(__name__)


class PPTTranslationService:
    """
    PPT 翻译服务

    支持:
    - 文本框翻译
    - 表格翻译
    - 图表标题翻译
    - 组合形状翻译
    - 格式保留
    """

    def __init__(
        self,
        llm_service,
        prompt: str,
        struct: str,
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ):
        """
        初始化 PPT 翻译服务

        Args:
            llm_service: LLM 服务实例 (实现了 LLMInterface)
            prompt: 翻译 prompt 模板
            struct: 输出格式结构
            progress_callback: 进度回调函数 (progress: float, message: str)
        """
        self.llm_service = llm_service
        self.prompt = prompt
        self.struct = struct
        self.progress_callback = progress_callback

    async def translate(
        self,
        file_path: str,
        target_language: str,
        output_path: str,
    ) -> str:
        """
        翻译 PPT 文件

        Args:
            file_path: 输入文件路径
            target_language: 目标语言
            output_path: 输出文件路径

        Returns:
            翻译后的文件路径

        Raises:
            Exception: 翻译失败
        """
        try:
            # 加载 PPT
            psr = get_psr(file_path)
            total_pages = page_num_presentation(psr)

            logger.info(f"开始翻译 PPT: {file_path}, 共 {total_pages} 页")
            await self._report_progress(0.0, f"开始翻译，共 {total_pages} 页")

            # 获取文本提取生成器
            page_generator = extract_text_from_presentation(psr)

            # 逐页翻译
            for page_index in range(total_pages):
                # 计算进度
                progress = (page_index / total_pages) * 100
                await self._report_progress(
                    progress,
                    f"正在翻译第 {page_index + 1}/{total_pages} 页"
                )

                # 提取当前页文本
                page_arr = await anext(page_generator)

                if not page_arr:
                    logger.info(f"第 {page_index + 1} 页无文本，跳过")
                    continue

                # 提取纯文本
                text_arr = [x[0] for x in page_arr]
                logger.info(f"第 {page_index + 1} 页文本: {text_arr}")

                # 调用 LLM 翻译
                translate_text_dict = await (
                    self.llm_service.translates_chain(self.prompt)
                ).chain_ainvoke(
                    str(text_arr),
                    self.struct,
                    target_language,
                )

                # 获取翻译结果
                translate_text_arr = translate_text_dict['translate_text']
                logger.info(f"第 {page_index + 1} 页翻译结果: {translate_text_arr}")

                # 组合翻译文本和位置信息
                translate_text_and_position_arr = [
                    [translate_text_arr[key]] + item[1:]
                    for key, item in enumerate(page_arr)
                ]

                # 还原到 PPT
                await restore_text_to_presentation(
                    psr,
                    translate_text_and_position_arr
                )

            # 保存翻译后的文件
            await self._report_progress(90.0, "正在保存文件")

            output_file_path = await save_traslate_file(psr, output_path)

            await self._report_progress(100.0, "翻译完成")
            logger.info(f"PPT 翻译完成: {output_file_path}")

            return output_file_path

        except Exception as e:
            logger.error(f"PPT 翻译失败: {e}", exc_info=True)
            raise Exception(f"PPT 翻译失败: {str(e)}")

    async def _report_progress(self, progress: float, message: str) -> None:
        """
        报告进度（支持同步和异步回调）

        Args:
            progress: 进度百分比 (0-100)
            message: 进度消息
        """
        if self.progress_callback:
            try:
                # 检查回调是否是协程函数
                if inspect.iscoroutinefunction(self.progress_callback):
                    await self.progress_callback(progress, message)
                else:
                    self.progress_callback(progress, message)
            except Exception as e:
                logger.warning(f"进度回调失败: {e}")
