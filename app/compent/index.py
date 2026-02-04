import os
import traceback
from urllib.parse import quote

import gradio as gr

from app.compent.chat_compent import launch_chat_compent
from app.compent.file_compent import launch_file_compent
from app.util.config import Settings


def get_file_list():
    try:
        file_path = Settings.FILE_OUTPUT_PATH
        files = os.listdir(file_path)
        # 排除以 "." 开头的文件
        files = [file for file in files if not file.startswith('.')]
        return [[file, os.path.join(file_path, file)] for file in files]
    except Exception as e:
        print(f"Error in get_file_list: {e}")
        return []


def generate_download_links():
    try:
        file_path = Settings.FILE_OUTPUT_PATH
        files = os.listdir(file_path)
        # 排除以 "." 开头的文件
        files = [file for file in files if not file.startswith('.')]

        html = "<ul>"
        for file in files:
            # 只对文件名进行 URL 编码
            encoded_filename = quote(file)
            html += f'<li><a href="/file/{encoded_filename}" download="{file}">{file}</a></li>'
        html += "</ul>"
        return html
    except Exception as e:
        print(f"Error in generate_download_links: {e}")
        return "<p>Error generating file list</p>"


async def launch_gradio():
    try:
        # 启动 Gradio 界面
        file_compent = await launch_file_compent()
        chat_compent = await launch_chat_compent()

        with gr.Blocks() as file_tab:
            gr.Markdown("## 下载列表")
            download_links = gr.HTML(value=generate_download_links, every=10)

        app = gr.TabbedInterface(
            [file_compent, chat_compent],
            ['文件转译', '在线文本翻译'],
            theme=gr.themes.Monochrome(),
        ).queue(10)

        app.launch()
    except Exception as e:
        print(f"Error in launch_gradio: {e}")
        print(traceback.format_exc())
        raise
