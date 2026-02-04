import gradio as gr
from click import File
from compent.file_service import generate_file
from util.config import Settings


async def launch_gradio():

    app = gr.Interface(
        fn=generate_file,
        inputs=[
            gr.File(label="上传文件")
        ],
        outputs=[
            gr.File(label="下载文件")
        ],
        title="上传PPT,翻译成对应语言",
        description="""
        <div style="text-align: center">
        <h2>将上传的文件翻译成对应的语言，而且不改变原有的格式</h2>
        </div>
        """,
        article="""
        <div style="text-align: center;">
        <h2>power by llm</h2>
        </div>
        """,
        theme=gr.themes.Monochrome()
    ).queue(
        default_concurrency_limit=10
    )

    # 启动应用程序
    app.launch(server_name="0.0.0.0", server_port=Settings.GRADIO_SERVER_PORT,
               share=True, favicon_path=None, prevent_thread_lock=True)
