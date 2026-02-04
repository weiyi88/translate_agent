import gradio as gr
from click import File
from gradio_client import Client

from app.compent.file_service import generate_file
from app.compent.radio_compent import (radio_language_compent,
                                       radio_translation_model_compent)


async def launch_file_compent():
    return gr.Interface(
        fn=generate_file,
        inputs=[
            gr.File(label="上传文件"),
            # 创建单选框
            radio_language_compent(),
            radio_translation_model_compent()
        ],
        outputs=[
            gr.File(label="下载文件")
        ],
        title="LLM 文件转译",
        description="""
        <div style="text-align: center; font-line-height: 1.5; font-size: 16px;">
        <span>上传文件转译成对应语言，并不改变原本格式</span>
        <br>
        <span>目前支持 word、pptx、excel、csv文件</span>
        <br>
        <span style="color: red">转译后页面空白，是字体颜色与背景颜色一致</span>
        </div>
        """,
        article="""
        <div style="text-align: center;">
        <a href="https://rongyeliu.com">
        <h1>RongYe.Liu</h1>
        </a>
        </div>
        """,
        theme=gr.themes.Monochrome()
    )
