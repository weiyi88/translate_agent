import gradio as gr

from app.util.config import Settings


def radio_language_compent():
    return gr.Radio(
        choices=["English", "Chinese", "Japanese",
                 "Korean", "Arabic", "Greek"],
        label="Select a language",
        value="English"
    )


def radio_translation_model_compent():
    return gr.Radio(
        choices=[
            ("gpt-4o-mini", Settings.OPENAI_MODEL_GPT4O_MINI),
            ("gpt-4o", Settings.OPENAI_MODEL_GPT4O),
            # ("kimi", Settings.MOONSHOT_CHAT_MODEL),
            # ("claude3.5", Settings.ANTHROPIC_CHAT_MODEL),
            # ("Qwen2-7B", "Qwen/Qwen2-7B-Instruct"),
            # ("Yi-1.5-9B", "01-ai/Yi-1.5-9B-Chat-16K"),
            # ("llama3.1-8B", "meta-llama/Meta-Llama-3.1-8B-Instruct"),
            # ("Mistral-7B", "mistralai/Mistral-7B-Instruct-v0.2")
        ],  # 选项列表
        label="翻译的模型",  # 标签
        value="gpt-4o"  # 默认选中的选项
    )
