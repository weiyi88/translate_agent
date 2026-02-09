

import logging

from app.service.langchain.index import LLM_obj
from app.service.langchain.openai_llm_langchain_service import \
    OpenaiLLMLangchainClass
from app.service.langchain.siliconflow_llm_langchain_service import \
    SiliconflowLLMLangchainClass
from app.util.config import Settings
from app.util.index import read_prompt


async def chat_service(message: str, history: list, language_radio: str, llm_ragio: str):
    logging.info(
        f"chat_service: message: {message}, history: {history}, language_radio: {language_radio}, llm_ragio: {llm_ragio}")
    """返回流式数据"""
    llm_obj: OpenaiLLMLangchainClass | SiliconflowLLMLangchainClass = LLM_obj(
        llm_ragio, 'str')
    prompt = read_prompt(Settings.TRANSLATE_CHAT_STR) if read_prompt(
        Settings.TRANSLATE_CHAT_STR) else ""
    struct = read_prompt(Settings.STRUCT_STR) if read_prompt(
        Settings.STRUCT_STR) else ""
    result = ''
    if message is None or message == "":
        return "请输入需要翻译的文本"
    async for chunk in await llm_obj.translates_chain(prompt).chain_astream(message, struct, language_radio):
        result += chunk

    return result
