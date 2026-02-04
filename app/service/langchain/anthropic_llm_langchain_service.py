from typing import List

from langchain_anthropic import ChatAnthropic
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from app.schemas.llm_interface import LLMInterface
from app.util.config import Settings


class Struct_Json(BaseModel):
    translate_text: List[str] = Field(..., alias='translate_text')


class AnthropicLangchainClass(LLMInterface["AnthropicLangchainClass"]):
    def __init__(self, model: str, output: str = 'json'):
        self.model = ChatAnthropic(
            model=model,
            temperature=0.7,
            api_key=Settings.ANTHROPIC_API_KEY,
            base_url=Settings.ANTHROPIC_BASE_URL,
        )
        self.parser = JsonOutputParser(
            pydantic_object=Struct_Json)if output == 'json' else StrOutputParser()

    def translates_chain(self, prompt: str) -> "AnthropicLangchainClass":
        message = ChatPromptTemplate.from_messages(
            [
                ('system', prompt),
                ('human', "{question}")
            ]
        )

        self.chain = (message | self.model | self.parser)
        return self

    async def chain_ainvoke(self, content: str, struct: str, language: str) -> any:
        """ 异步执行翻译任务 """
        return await self.chain.ainvoke(
            {
                "question": f"""将以下文本:
                {content}
                翻译为{language},
                结构为{struct},
                要遵守<Rule>要求,
                直接返回，不要任何解释
                """,
                "language": language,
                "struct": struct
            }
        )

    async def chain_astream(self, content: str, struct: str, language: str) -> any:
        """ 异步流式执行翻译任务 """
        return self.chain.astream(
            {
                "question": f"""翻译以下文本:{content}""",
                "language": language,
                "struct": struct
            }
        )
