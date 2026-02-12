import time
from re import S
from tkinter import NO
from typing import List

from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from app.schemas.llm_interface import LLMInterface
from app.util.config import Settings


class Struct_Json(BaseModel):
    translate_text: List[str] = Field(description="翻译后的文本")


class OpenaiLLMLangchainClass(LLMInterface["OpenaiLLMLangchainClass"]):
    def __init__(self, model: str, ouput: str = "json"):
        self.model = ChatOpenAI(
            api_key=Settings.OPENAI_API_KEY,
            base_url=Settings.OPENAI_BASE_URL,
            model=model,
            temperature=0.7
        )
        self.model = self.model.with_structured_output(
            Struct_Json) if ouput == "json" else self.model
        self.parser = StrOutputParser()

    def translates_chain(self, prompt: str) -> "OpenaiLLMLangchainClass":
        message = ChatPromptTemplate.from_messages(
            [
                ('system', prompt),
                ('human', "{question}")
            ]
        )

        self.chain = (message | self.model)
        return self

    async def chain_ainvoke(self, content: str, struct: str, language: str) -> any:
        """ 异步执行翻译任务 """
        return await self.chain.ainvoke(
            {
                "question": f"""将以下文本:
                {content}
                翻译为:{language}语言,
                结构为:{struct},
                要遵守<Rule>要求,
                直接返回，不要任何解释
                """,
                "language": language,
                "struct": struct
            }
        )

    async def chain_astream(self, content: str, struct: str, language: str) -> any:
        """ 异步流式执行翻译任务 """
        return (self.chain | self.parser).astream(
            {
                "question": f"""翻译以下文本:{content}""",
                "language": language,
                "struct": struct
            }
        )
