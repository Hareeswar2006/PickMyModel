import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

router = APIRouter()


@router.get("/{dataset_id}/dataset")
def download_cleaned_csv(dataset_id, problem_type):
    path = os.path.join(BASE_DIR, "data", "preprocessed", problem_type, f"{dataset_id}_clean.csv")

    if not os.path.exists(path):
        raise HTTPException(404, "Cleaned dataset not found")

    return FileResponse(path, filename=f"{dataset_id}_clean.csv", media_type="text/csv")


@router.get("/{dataset_id}/model")
def download_model(dataset_id, problem_type):
    path = os.path.join(BASE_DIR, "models", "best_models", problem_type, f"{dataset_id}_best_model.pkl")

    if not os.path.exists(path):
        raise HTTPException(404, "Model not found")

    return FileResponse(path, filename=f"{dataset_id}_best_model.pkl", media_type="application/octet-stream")
