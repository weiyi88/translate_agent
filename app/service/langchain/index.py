

from app.schemas.llm_interface import LLMInterface
from app.service.langchain.anthropic_llm_langchain_service import \
    AnthropicLangchainClass
from app.service.langchain.moonshot_llm_langchain_service import \
    MoohShotLangchainClass
from app.service.langchain.openai_llm_langchain_service import \
    OpenaiLLMLangchainClass
from app.service.langchain.siliconflow_llm_langchain_service import \
    SiliconflowLLMLangchainClass
from app.util.config import Settings


# 获取语言模型对象
def LLM_obj(llm_name: str, output: str = 'json') -> LLMInterface:
    if llm_name in Settings.PAYMENT_MODEL:
        match llm_name:
            case Settings.OPENAI_MODEL_GPT4O | Settings.OPENAI_MODEL_GPT4O_MINI:
                return OpenaiLLMLangchainClass(llm_name, output)
            case Settings.ANTHROPIC_CHAT_MODEL:
                return AnthropicLangchainClass(llm_name, output)
            case Settings.MOONSHOT_CHAT_MODEL:
                return MoohShotLangchainClass(llm_name, output)
            case _:
                return OpenaiLLMLangchainClass(llm_name, output)

    else:
        return SiliconflowLLMLangchainClass(llm_name, output)
