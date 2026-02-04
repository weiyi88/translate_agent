import gradio as gr
from numpy import place

from app.compent.chat_service import chat_service
from app.compent.radio_compent import (radio_language_compent,
                                       radio_translation_model_compent)
from app.util.config import Settings


async def launch_chat_compent():
    return gr.ChatInterface(
        fn=chat_service,
        additional_inputs=[
            radio_language_compent(),
            gr.Radio(
                choices=[
                    ("gpt-4o-mini", Settings.OPENAI_MODEL_GPT4O_MINI),
                    ("gpt-4o", Settings.OPENAI_MODEL_GPT4O),
                    ("kimi", Settings.MOONSHOT_CHAT_MODEL),
                    # ("claude3.5", Settings.ANTHROPIC_CHAT_MODEL),
                    ("Qwen2-7B", "Qwen/Qwen2-7B-Instruct"),
                    # ("Yi-1.5-9B", "01-ai/Yi-1.5-9B-Chat-16K"),
                    ("llama3.1-8B", "meta-llama/Meta-Llama-3.1-8B-Instruct"),
                    # ("Mistral-7B", "mistralai/Mistral-7B-Instruct-v0.2")
                ],  # 选项列表
                label="翻译的模型",  # 标签
                value="moonshot-v1-128k"  # 默认选中的选项
            )
        ],
        title=" LLM 转译",
        submit_btn="翻译",
        # description="""
        # <div style="text-align: center">
        # <h2>输入文本，将其翻译，可选择不同模型和翻译语言</h2>
        # </div>
        # """,
        fill_height=False,
        theme=gr.themes.Monochrome()
    )
