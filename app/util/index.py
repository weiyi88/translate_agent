import os
import shutil
from ast import List
from pathlib import Path


def get_project_path():
    return os.path.join(os.path.dirname(__file__))+'/../'

#  读取prompt文件


def read_prompt(file_name):
    try:
        with open(get_project_path()+"./prompt/" + file_name+".txt", "r") as f:
            return f.read()
    except:
        return False


# 复制文件，如果目标文件不存在
def copy_file_if_not_exists(src_path, dst_path):
    if not os.path.exists(dst_path):
        shutil.copy(src_path, dst_path)


#  读取数组内容
def get_array_one(arr: list, index: int):
    tem = []
    for item in arr:
        tem.append(item[index])
    return tem


def get_file_name(file_path) -> str:
    return (Path(file_path).name).split('.')[0]


def check_file_type(file_type: str):
    if file_type not in ['pptx', 'docx', 'pdf', 'xlsx']:
        return False


def check_file_path(file_path: str):
    if os.path.exists(file_path):
        return True
