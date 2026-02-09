from abc import ABC, abstractmethod
from typing import Any, Generic, List, TypeVar

from pydantic import BaseModel, Field

# 定义一个结构化的 JSON 输出模型


class Struct_Json(BaseModel):
    translate_text: List[str] = Field(description="翻译后的文本")


# 定义一个泛型类型 T，用于 LLMInterface
T = TypeVar("T", bound="LLMInterface")

# 定义 LLMInterface 接口


class LLMInterface(ABC, Generic[T]):
    @abstractmethod
    def __init__(self, model: str, output: str = "json") -> None:
        """初始化 LLM 接口"""
        pass

    @abstractmethod
    async def translates_chain(self, prompt: str) -> T:
        """根据给定的提示返回一个链条"""
        pass

    @abstractmethod
    async def chain_ainvoke(self, content: str, struct: str, language: str) -> Any:
        """异步执行翻译任务"""
        pass

    @abstractmethod
    async def chain_astream(self, content: str, struct: str, language: str) -> Any:
        """异步流式执行翻译任务"""
        pass
