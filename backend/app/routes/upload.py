import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMP_UPLOAD_DIR = os.path.join(BASE_DIR, "tmp", "uploads")

os.makedirs(TMP_UPLOAD_DIR, exist_ok=True)


@router.post("")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    tmp_filename = f"{uuid.uuid4().hex}.csv"
    tmp_path = os.path.join(TMP_UPLOAD_DIR, tmp_filename)

    with open(tmp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "tmp_path": tmp_path,
        "original_filename": file.filename
    }
