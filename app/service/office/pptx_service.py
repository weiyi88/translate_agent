import logging
import pprint

import gradio as gr
from tqdm.asyncio import tqdm

from app.schemas.llm_interface import LLMInterface
from app.service.langchain.anthropic_llm_langchain_service import \
    AnthropicLangchainClass
from app.service.langchain.index import LLM_obj
from app.service.langchain.moonshot_llm_langchain_service import \
    MoohShotLangchainClass
from app.service.langchain.openai_llm_langchain_service import \
    OpenaiLLMLangchainClass
from app.service.langchain.siliconflow_llm_langchain_service import \
    SiliconflowLLMLangchainClass
from app.util.pptx import (chunk_content_by_lenth,
                           extract_text_from_presentation, get_psr,
                           page_num_presentation, restore_text_to_presentation,
                           save_traslate_file)


# 新版本,一段一段来，llm容易幻读
async def launch_translation_ppt_fail(file_path: str, prompt: str, struct: str, output_name: str, language_radio: str, llm_radio: str, process=gr.Progress(track_tqdm=True)) -> str:
    try:
        psr = get_psr(file_path)
        llm_obj: OpenaiLLMLangchainClass | SiliconflowLLMLangchainClass | MoohShotLangchainClass | AnthropicLangchainClass = LLM_obj(
            llm_radio)

        all_text = await extract_text_from_presentation(psr)
        chunked_text = await chunk_content_by_lenth(all_text)
        for chunk in tqdm(chunked_text, total=len(chunked_text), desc="translate"):
            translated_chunks = []
            chunk_text = [item[0] for item in chunk]
            logging.info(f"=============翻译前: {chunk_text}")
            translate_text_dict = await (llm_obj.translates_chain(prompt)).chain_ainvoke(str(chunk_text), struct, language_radio)
            translate_text_arr = translate_text_dict['translate_text']
            translated_chunks = [[translate_text_arr[i]]+item[1:]
                                 for i, item in enumerate(chunk)]
            logging.info(f"+++++++++++++++翻译结果: {translated_chunks}")
            await restore_text_to_presentation(psr, translated_chunks)
    except Exception as e:
        logging.error(f"-----------------翻译ppt 错误 error:  {e}")
    logging.info(f"-----------------{output_name} 翻译ppt 完成")
    return await save_traslate_file(psr, output_name)


# 旧版本,一页页来，启用
async def launch_translation_pptx(file_path: str, prompt: str, struct: str, output_name: str, language_radio: str, llm_radio: str, progress=gr.Progress()) -> str:
    try:
        psr = get_psr(file_path)
        llm_obj: OpenaiLLMLangchainClass = LLM_obj(llm_radio)

        total_pages = page_num_presentation(psr)
        page_generator = extract_text_from_presentation(psr)

        for i in range(total_pages):
            progress((i + 1) / total_pages, f"正在翻译第 {i+1}/{total_pages} 页")

            page_arr = await anext(page_generator)

            text_arr = str([x[0] for x in page_arr])
            logging.info(f"=============翻译前: {text_arr}")
            translate_text_dict = await (llm_obj.translates_chain(prompt)).chain_ainvoke(text_arr, struct, language_radio)

            translate_text_arr = translate_text_dict['translate_text']
            logging.info(f"+++++++++++++++翻译结果: {translate_text_arr}")
            translate_text_and_position_arr = [
                [translate_text_arr[key]]+item[1:] for key, item in enumerate(page_arr)]

            await restore_text_to_presentation(psr, translate_text_and_position_arr)

    except Exception as e:
        logging.error(f"-----------------翻译ppt 错误 error: {e}")
    logging.info(f"-----------------{output_name} 翻译ppt 完成")
    return await save_traslate_file(psr, output_name)
