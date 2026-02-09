
import logging
import os
import shutil
from datetime import datetime

from app.schemas.file_Exception import UnsupportFileException
from app.service.office.docx_service import launch_translation_docx
from app.service.office.pdf_service import launch_translate_pdf
from app.service.office.pptx_service import launch_translation_pptx
from app.service.office.xlsx_service import launch_translate_xlsx
from app.util.config import Settings
from app.util.index import read_prompt


async def generate_file(file_obj: object, language_radio: str, llm_radio: str):
    file_name = os.path.basename(file_obj.name)
    file_upload_path = Settings.FILE_INPUT_PATH
    os.makedirs(file_upload_path, exist_ok=True)
    splice_file_name = str(file_name).replace(" ", "_")
    shutil.copy(file_obj.name, file_upload_path +
                splice_file_name)    # 保存上传文件到指定目录

    file_type = file_name.split(".")[-1]
    file_path = file_upload_path+splice_file_name
    output_name = datetime.now().strftime("%Y%m%d_%H%M%S") + \
        "_to_"+language_radio+":"+file_name

    logging.info(
        f"------ 开始翻译文件 ------ 文件名: {file_name}, 文件类型: {file_type}, 目标语言: {language_radio}, 语言模型: {llm_radio}")
    match file_type:
        case "pptx":
            return await launch_translation_pptx(
                file_path,
                prompt=read_prompt(Settings.TRANSLATE_PPTX_JSON) if read_prompt(
                    Settings.TRANSLATE_PPTX_JSON) else "",
                struct=read_prompt(Settings.STRUCT_JSON)if read_prompt(
                    Settings.STRUCT_JSON) else "",
                output_name=output_name,
                language_radio=language_radio,
                llm_radio=llm_radio
            )
        case "pdf":
            return await launch_translate_pdf(
                file_path,
                prompt=read_prompt(Settings.TRANSLATE_PDF_JSON) if read_prompt(
                    Settings.TRANSLATE_PDF_JSON) else "",
                struct="",
                output_name=output_name,
                language_radio=language_radio,
                llm_radio=llm_radio,
            )
        case "docx":
            return await launch_translation_docx(
                file_path,
                prompt=read_prompt(Settings.TRANSLATE_DOCX_STR) if read_prompt(
                    Settings.TRANSLATE_DOCX_STR) else "",
                struct="",
                output_name=output_name,
                language_radio=language_radio,
                llm_radio=llm_radio
            )
        case "xlsx":
            return await launch_translate_xlsx(
                file_path,
                prompt=read_prompt(Settings.TRANSLATE_XLSX_JSON) if read_prompt(
                    Settings.TRANSLATE_XLSX_JSON) else "",
                struct=read_prompt(Settings.STRUCT_JSON)if read_prompt(
                    Settings.STRUCT_JSON) else "",
                output_name=output_name,
                language_radio=language_radio,
                llm_radio=llm_radio
            )
        case _:
            logging.error("文件类型不支持")
            raise UnsupportFileException(f"不支持的文件类型: {file_type}")
