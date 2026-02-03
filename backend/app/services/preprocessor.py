import os
import pandas as pd

from src.preprocessor.reg_preprocessor import RegressionPreprocessor
from src.preprocessor.class_preprocessor import ClassificationPreprocessor

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

RAW_DIRS = {
    "regression": os.path.join(BASE_DIR, "data", "raw", "regression"),
    "classification": os.path.join(BASE_DIR, "data", "raw", "classification"),
}

OUT_DIRS = {
    "regression": os.path.join(BASE_DIR, "data", "preprocessed", "regression"),
    "classification": os.path.join(BASE_DIR, "data", "preprocessed", "classification"),
}

PREP_DIRS = {
    "regression": os.path.join(BASE_DIR, "models", "preprocessors", "regression"),
    "classification": os.path.join(BASE_DIR, "models", "preprocessors", "classification"),
}

for d in list(OUT_DIRS.values()) + list(PREP_DIRS.values()):
    os.makedirs(d, exist_ok=True)


def run_preprocessor(dataset_id, problem_type, target_column):
    if problem_type not in ("regression", "classification"):
        raise ValueError("Invalid problem type")

    raw_path = os.path.join(RAW_DIRS[problem_type], f"{dataset_id}.csv")
    out_path = os.path.join(OUT_DIRS[problem_type], f"{dataset_id}_clean.csv")

    if not os.path.exists(raw_path):
        raise FileNotFoundError(f"Raw dataset not found: {raw_path}")

    df_raw = pd.read_csv(raw_path)

    if problem_type == "regression":
        preprocessor = RegressionPreprocessor(target_column=target_column, dataset_id=dataset_id)
    else:
        preprocessor = ClassificationPreprocessor(target_column=target_column, dataset_id=dataset_id)

    df_clean = preprocessor.fit_transform(df_raw)

    preprocessor.save(PREP_DIRS[problem_type])
    df_clean.to_csv(out_path, index=False)

    return out_path, os.path.join(PREP_DIRS[problem_type], f"{dataset_id}.pkl")
