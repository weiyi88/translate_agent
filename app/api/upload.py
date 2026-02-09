"""
文件上传和下载 API
"""
import os
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse

router = APIRouter(prefix="/api", tags=["files"])

# 上传目录
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# 输出目录
OUTPUT_DIR = Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)

# 允许的文件类型
ALLOWED_EXTENSIONS = {".pptx", ".docx", ".xlsx", ".pdf"}

# 最大文件大小 (100MB)
MAX_FILE_SIZE = 100 * 1024 * 1024


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    上传文件

    - 支持的格式: .pptx, .docx, .xlsx, .pdf
    - 最大大小: 100MB

    返回: { "file_path": "uploads/xxx.pptx" }
    """
    # 检查文件扩展名
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"不支持的文件类型: {file_ext}。仅支持 {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # 生成唯一文件名
    file_id = str(uuid.uuid4())
    safe_filename = f"{file_id}{file_ext}"
    file_path = UPLOAD_DIR / safe_filename

    # 保存文件
    try:
        content = await file.read()

        # 检查文件大小
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"文件过大。最大允许 {MAX_FILE_SIZE // 1024 // 1024}MB"
            )

        with open(file_path, "wb") as f:
            f.write(content)

        return {
            "file_path": str(file_path),
            "original_filename": file.filename,
            "file_size": len(content),
        }

    except Exception as e:
        # 清理失败的文件
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"文件上传失败: {str(e)}")


@router.get("/download/{file_path:path}")
async def download_file(file_path: str):
    """
    下载文件

    - 支持下载 uploads/ 和 output/ 目录下的文件
    """
    # 安全检查: 防止路径遍历攻击
    safe_path = Path(file_path).resolve()

    # 检查文件是否在允许的目录下
    if not (
        str(safe_path).startswith(str(UPLOAD_DIR.resolve()))
        or str(safe_path).startswith(str(OUTPUT_DIR.resolve()))
    ):
        raise HTTPException(status_code=403, detail="禁止访问此路径")

    # 检查文件是否存在
    if not safe_path.exists() or not safe_path.is_file():
        raise HTTPException(status_code=404, detail="文件不存在")

    # 返回文件
    return FileResponse(
        path=safe_path,
        filename=safe_path.name,
        media_type="application/octet-stream",
    )
