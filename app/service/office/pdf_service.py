

import asyncio
import os

import pdfplumber

from app.service.langchain.index import LLM_obj
from app.service.langchain.openai_llm_langchain_service import \
    OpenaiLLMLangchainClass
from app.service.langchain.siliconflow_llm_langchain_service import \
    SiliconflowLLMLangchainClass
from app.util.config import Settings


async def launch_translate_pdf(file_path: str, prompt: str, struct: str, output_name: str, language_radio: str, llm_radio: str) -> str:
    llm_obj: OpenaiLLMLangchainClass | SiliconflowLLMLangchainClass = LLM_obj(
        llm_radio, 'str')
    output_path = Settings.FILE_OUTPUT_PATH + output_name

    """异步处理PDF 文件并且转译"""
    text = ""
    with pdfplumber.open(file_path, 'rb') as fp:
        text = "".join(page.extract_text() or "" for page in fp.pages)

    """按照文本长度分割"""
    segments = [text[i+i+Settings.CHUNK_LENGTH]
                for i in range(0, len(text), Settings.CHUNK_LENGTH)]

    """调用翻译服务"""
    tasks = [await (llm_obj.
                    translates_chain(prompt).
                    chain_ainvoke(segment, struct, language_radio))
             for segment in segments]
    translated_text = await asyncio.gather(*tasks)

    """拼接翻译结果"""
    translated_text = "".join(translated_text)

    """写入文件"""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(translated_text)

    return os.path.abspath(output_path)
