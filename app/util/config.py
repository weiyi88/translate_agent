

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

from app.util.index import get_project_path


class ClassSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra='allow'
    )

    OPENAI_API_KEY: str = "xxx"
    OPENAI_BASE_URL: str = 'https://xxx'
    OPENAI_MODEL_GPT4O_MINI: str = 'xxx'
    OPENAI_MODEL_GPT4O: str = 'xxx'

    MOONSHOT_API_KEY: str = "xxx"
    MOONSHOT_BASE_URL: str = "xxx"
    MOONSHOT_CHAT_MODEL: str = "xxx"

    ANTHROPIC_API_KEY: str = "xxx"
    ANTHROPIC_BASE_URL: str = "xxx"
    ANTHROPIC_CHAT_MODEL: str = "xxx"

    LANGCHAIN_TRACING_V2: str = "xxx"
    LANGCHAIN_ENDPOINT: str = "xxx"
    LANGCHAIN_API_KEY: str = "xxx"
    LANGCHAIN_PROJECT: str = "xxx"

    FILE_INPUT_PATH: str = get_project_path()+"uploads/"
    FILE_OUTPUT_PATH: str = get_project_path()+"output/"
    LOGGING_LOG_PATH: str = get_project_path()+"logs/"
    PROMPT_PATH: str = get_project_path()+"prompt/"
    LOGGING_LOG_LEVEL: str = "INFO"
    WEB_SITE: str = "https://translate.bluefocuslibrary.com/"

    # 添加 Gradio 配置选项
    GRADIO_TEMP_DIR: str = '/path/to/temp'
    GRADIO_SERVER_NAME: str = '0.0.0.0'
    GRADIO_ANALYTICS_ENABLED: bool = True
    GRADIO_DEBUG: bool = True
    GRADIO_ROOT_PATH: str = '/myapp'
    GRADIO_SHARE: bool = True
    GRADIO_SERVER_PORT: int = 8001

    # 添加 SILICONFLOW 配置选项
    SILICONFLOW_API_KEY: str = "xxx"
    SILICONFLOW_API_URL: str = "xxx"
    SILICONFLOW_MODEL_QWEN: str = "xxx"
    SILICONFLOW_MODEL_YI: str = "xxx"
    SILICONFLOW_MODEL_LLAMA: str = "xxx"
    SILICONFLOW_MODEL_MISTRALAI: str = "xxx"

    # 付费的模型
    PAYMENT_MODEL: list[str] = ["gpt-4o-mini", "gpt-4o",
                                "moonshot-v1-128k", "claude-3-5-sonnet-20240620"]

    # 支持的文件类型
    FILE_TYPE_LIST: list[str] = ['pptx', 'docx', 'pdf', 'xlsx']

    # 需要的文件
    NEED_FILE_LIST: list[str] = ['translate_pptx_json',
                                 'translate_docx_json', 'translate_pdf_json', 'translate_xlsx_json', 'struct_json']
    # Prompt File
    TRANSLATE_PPTX_JSON: str = 'translate_pptx_json'
    TRANSLATE_DOCX_STR: str = 'translate_docx_json'
    TRANSLATE_PDF_JSON: str = 'translate_pdf_json'
    TRANSLATE_XLSX_JSON: str = 'translate_xlsx_json'
    TRANSLATE_CHAT_STR: str = 'translate_chat_str'
    STRUCT_JSON: str = 'struct_json'
    STRUCT_STR: str = ""

    # text chunk length
    CHUNK_LENGTH: int = 0


@lru_cache
def get_settings():
    return ClassSettings()


Settings = get_settings()
