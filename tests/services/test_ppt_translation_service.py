"""
测试 PPT 翻译服务
"""
import asyncio
import logging
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.services.ppt_translation_service import PPTTranslationService


logger = logging.getLogger(__name__)


class TestPPTTranslationService:
    """测试 PPT 翻译服务"""

    @pytest.fixture
    def mock_llm_service(self):
        """模拟 LLM 服务"""
        mock_service = MagicMock()

        # 模拟 translates_chain 返回的 chain
        mock_chain = MagicMock()
        mock_chain.chain_ainvoke = AsyncMock(
            return_value={
                'translate_text': ['Translated text 1', 'Translated text 2']
            }
        )
        mock_service.translates_chain.return_value = mock_chain

        return mock_service

    @pytest.fixture
    def mock_prompt(self):
        """模拟 prompt"""
        return "Translate the following text to {language}"

    @pytest.fixture
    def mock_struct(self):
        """模拟结构"""
        return '{"translate_text": []}'

    @pytest.fixture
    def progress_callback(self):
        """进度回调"""
        callback = MagicMock()
        return callback

    @pytest.mark.asyncio
    async def test_translate_success(
        self,
        mock_llm_service,
        mock_prompt,
        mock_struct,
        progress_callback,
    ):
        """测试翻译成功"""
        # 创建服务
        service = PPTTranslationService(
            llm_service=mock_llm_service,
            prompt=mock_prompt,
            struct=mock_struct,
            progress_callback=progress_callback,
        )

        # 模拟 PPT 工具函数
        with patch('app.services.ppt_translation_service.get_psr') as mock_get_psr, \
             patch('app.services.ppt_translation_service.page_num_presentation') as mock_page_num, \
             patch('app.services.ppt_translation_service.extract_text_from_presentation') as mock_extract, \
             patch('app.services.ppt_translation_service.restore_text_to_presentation') as mock_restore, \
             patch('app.services.ppt_translation_service.save_traslate_file') as mock_save:

            # 配置 mock
            mock_psr = MagicMock()
            mock_get_psr.return_value = mock_psr
            mock_page_num.return_value = 2

            # 模拟异步生成器
            async def mock_generator():
                yield [['Text 1', (0, 0), {'shape_type': 'TEXT', 'table_info': None, 'font_info': {}}]]
                yield [['Text 2', (1, 0), {'shape_type': 'TEXT', 'table_info': None, 'font_info': {}}]]

            mock_extract.return_value = mock_generator()
            mock_restore.return_value = None
            mock_save.return_value = '/output/test.pptx'

            # 执行翻译
            result = await service.translate(
                file_path='/input/test.pptx',
                target_language='English',
                output_path='/output/test.pptx',
            )

            # 验证结果
            assert result == '/output/test.pptx'

            # 验证调用
            mock_get_psr.assert_called_once_with('/input/test.pptx')
            mock_page_num.assert_called_once_with(mock_psr)
            assert mock_restore.call_count == 2
            mock_save.assert_called_once()

            # 验证进度回调
            assert progress_callback.call_count >= 3  # 至少: 开始, 第1页, 第2页, 完成

    @pytest.mark.asyncio
    async def test_translate_empty_page(
        self,
        mock_llm_service,
        mock_prompt,
        mock_struct,
    ):
        """测试空页面跳过"""
        service = PPTTranslationService(
            llm_service=mock_llm_service,
            prompt=mock_prompt,
            struct=mock_struct,
        )

        with patch('app.services.ppt_translation_service.get_psr') as mock_get_psr, \
             patch('app.services.ppt_translation_service.page_num_presentation') as mock_page_num, \
             patch('app.services.ppt_translation_service.extract_text_from_presentation') as mock_extract, \
             patch('app.services.ppt_translation_service.restore_text_to_presentation') as mock_restore, \
             patch('app.services.ppt_translation_service.save_traslate_file') as mock_save:

            mock_psr = MagicMock()
            mock_get_psr.return_value = mock_psr
            mock_page_num.return_value = 1

            # 模拟空页面
            async def mock_generator():
                yield []

            mock_extract.return_value = mock_generator()
            mock_save.return_value = '/output/test.pptx'

            result = await service.translate(
                file_path='/input/test.pptx',
                target_language='English',
                output_path='/output/test.pptx',
            )

            # 空页面不应调用 restore
            mock_restore.assert_not_called()

    @pytest.mark.asyncio
    async def test_translate_error_handling(
        self,
        mock_llm_service,
        mock_prompt,
        mock_struct,
    ):
        """测试错误处理"""
        service = PPTTranslationService(
            llm_service=mock_llm_service,
            prompt=mock_prompt,
            struct=mock_struct,
        )

        with patch('app.services.ppt_translation_service.get_psr') as mock_get_psr:
            # 模拟加载失败
            mock_get_psr.side_effect = Exception("File not found")

            # 验证异常
            with pytest.raises(Exception) as exc_info:
                await service.translate(
                    file_path='/input/invalid.pptx',
                    target_language='English',
                    output_path='/output/test.pptx',
                )

            assert "PPT 翻译失败" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_progress_callback_error_handling(
        self,
        mock_llm_service,
        mock_prompt,
        mock_struct,
    ):
        """测试进度回调错误处理"""
        # 创建会抛出异常的回调
        def failing_callback(progress, message):
            raise Exception("Callback error")

        service = PPTTranslationService(
            llm_service=mock_llm_service,
            prompt=mock_prompt,
            struct=mock_struct,
            progress_callback=failing_callback,
        )

        with patch('app.services.ppt_translation_service.get_psr') as mock_get_psr, \
             patch('app.services.ppt_translation_service.page_num_presentation') as mock_page_num, \
             patch('app.services.ppt_translation_service.extract_text_from_presentation') as mock_extract, \
             patch('app.services.ppt_translation_service.save_traslate_file') as mock_save:

            mock_psr = MagicMock()
            mock_get_psr.return_value = mock_psr
            mock_page_num.return_value = 1

            async def mock_generator():
                yield [['Text', (0, 0), {'shape_type': 'TEXT', 'table_info': None, 'font_info': {}}]]

            mock_extract.return_value = mock_generator()
            mock_save.return_value = '/output/test.pptx'

            # 即使回调失败，翻译也应该继续
            result = await service.translate(
                file_path='/input/test.pptx',
                target_language='English',
                output_path='/output/test.pptx',
            )

            assert result == '/output/test.pptx'
