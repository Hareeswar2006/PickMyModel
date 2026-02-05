import os
import pandas as pd
import math
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from src.regression.reg_meta_writer import run_single_regression_meta
from src.classification.classification_meta_writer import run_single_classification_meta

from app.services.run_logger import log_run
from app.services.preprocessor import run_preprocessor
from app.services.meta_predictor import predict_best_model
from app.services.bench_trainer import train_and_evaluate

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

META_FILES = {
    "regression": os.path.join(BASE_DIR, "data", "meta", "meta_reg.csv"),
    "classification": os.path.join(BASE_DIR, "data", "meta", "meta_class.csv"),
}

GUEST_LOG = os.path.join(BASE_DIR, "logs", "guest_datasets.log")
os.makedirs(os.path.dirname(GUEST_LOG), exist_ok=True)


class AnalyzeRequest(BaseModel):
    tmp_path: str
    problem_type: str
    target_column: str
    is_guest: bool = False
    user_id: Optional[str] = None


def make_json_safe(obj):
    if isinstance(obj, dict):
        return {k: make_json_safe(v) for k, v in obj.items()}

    if isinstance(obj, list):
        return [make_json_safe(v) for v in obj]

    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj

    return obj

def read_meta_row(problem_type: str, dataset_id: str):
    meta_csv = META_FILES[problem_type]

    if not os.path.exists(meta_csv):
        raise RuntimeError("Meta CSV not found")

    df = pd.read_csv(meta_csv)
    row = df[df["dataset_id"] == dataset_id]

    if row.empty:
        raise RuntimeError("Meta row not found")

    return row.iloc[0].to_dict()


@router.post("")
def analyze_dataset(payload: AnalyzeRequest):
    if payload.problem_type not in ("regression", "classification"):
        raise HTTPException(status_code=400, detail="Invalid problem type")

    if not os.path.exists(payload.tmp_path):
        raise HTTPException(status_code=404, detail="Uploaded file not found")

    if payload.problem_type == "regression":
        dataset_id = run_single_regression_meta(payload.tmp_path, payload.target_column)
    else:
        dataset_id = run_single_classification_meta(payload.tmp_path, payload.target_column)

    analytics = read_meta_row(payload.problem_type, dataset_id)
    #print(analytics)


    preprocessed_path, preprocessor_path = run_preprocessor(dataset_id=dataset_id, problem_type=payload.problem_type, target_column=payload.target_column)


    best_model = predict_best_model(dataset_id=dataset_id, problem_type=payload.problem_type)

    metrics, model_path = train_and_evaluate(dataset_path=preprocessed_path, dataset_id=dataset_id, problem_type=payload.problem_type, model_label=best_model, target_column=payload.target_column)

    log_run(dataset_id=dataset_id, problem_type=payload.problem_type, best_model=best_model, metrics=metrics, user_id=payload.user_id if not payload.is_guest else None, is_guest=payload.is_guest)


    response = {
        "dataset_id": dataset_id,
        "problem_type": payload.problem_type,
        "analytics": analytics,
        "best_model": best_model,
        "metrics": metrics,
        "artifacts": {
            "preprocessed_data": preprocessed_path,
            "preprocessor_path": preprocessor_path,
            "model_path": model_path
        },
        "message": "Analysis completed successfully"
    }

    return make_json_safe(response)
