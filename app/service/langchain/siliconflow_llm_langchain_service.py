
from typing import List

from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from app.schemas.llm_interface import LLMInterface
from app.util.config import Settings


class Struct_Json(BaseModel):
    translate_text: List[str] = Field(description="翻译后的文本")


class SiliconflowLLMLangchainClass(LLMInterface["SiliconflowLLMLangchainClass"]):
    def __init__(self, model: str, output: str = 'json'):
        self.parser = JsonOutputParser(
            pydantic_object=Struct_Json) if output == 'json' else StrOutputParser()
        self.model = ChatOpenAI(
            api_key=Settings.SILICONFLOW_API_KEY,
            base_url=Settings.SILICONFLOW_API_URL,
            model=model,
            temperature=0.7,
        )

    def translates_chain(self, prompt: str) -> "SiliconflowLLMLangchainClass":
        message = ChatPromptTemplate.from_messages(
            [
                ('system', prompt),
                ('human', "{question}")
            ]
        )
        self.chain = (message | self.model | self.parser)
        return self

    async def chain_ainvoke(self, content: str, struct: str, language: str) -> None:
        """ 异步执行翻译任务 """
        return await self.chain.ainvoke(
            {
                "question": f"""翻译以下文本:{content} """,
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
