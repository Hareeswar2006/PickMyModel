import os
import pickle
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

router = APIRouter()


class PredictRequest(BaseModel):
    dataset_id: str
    problem_type: str
    rows: list[dict]


@router.post("")
def predict(payload: PredictRequest):
    problem = payload.problem_type.lower()

    preprocessor_path = os.path.join(
        BASE_DIR, "models", "preprocessors", problem, f"{payload.dataset_id}_preprocessor.pkl"
    )
    model_path = os.path.join(
        BASE_DIR, "models", "best_models", problem, f"{payload.dataset_id}_best_model.pkl"
    )

    if not os.path.exists(preprocessor_path) or not os.path.exists(model_path):
        raise HTTPException(404, "Model artifacts not found")

    with open(preprocessor_path, "rb") as f:
        preprocessor = pickle.load(f)

    with open(model_path, "rb") as f:
        model = pickle.load(f)

    df = pd.DataFrame(payload.rows)

    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.fillna(0)

    X = preprocessor.transform(df)

    if problem == "regression":
        preds = model.predict(X)
        return {
            "prediction": float(preds[0])
        }

    if problem == "classification":
        pred_idx = int(model.predict(X)[0])

        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X)[0]
            classes = model.classes_

            probabilities = {
                str(cls): float(prob)
                for cls, prob in zip(classes, probs)
            }
        else:
            probabilities = None

        return {
            "prediction": str(model.classes_[pred_idx]),
            "probabilities": probabilities
        }