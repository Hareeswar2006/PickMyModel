import os
import json
import pickle
import pandas as pd
import numpy as np


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

META_CSV = os.path.join(BASE_DIR, "data", "meta", "meta_class.csv")
ARTIFACT_DIR = os.path.join(BASE_DIR, "models", "meta", "classification")

DROP_COLS = [
    "dataset_id",
    "source",
    "target_column",
    "timestamp",
    "best_model_label"
]


def load_artifacts():
    with open(os.path.join(ARTIFACT_DIR, "meta_model.pkl"), "rb") as f:
        model = pickle.load(f)

    with open(os.path.join(ARTIFACT_DIR, "label_encoder.pkl"), "rb") as f:
        label_encoder = pickle.load(f)

    with open(os.path.join(ARTIFACT_DIR, "features.json"), "r") as f:
        feature_names = json.load(f)

    return model, label_encoder, feature_names


def load_meta_csv():
    if not os.path.exists(META_CSV):
        raise FileNotFoundError("meta_class.csv not found")

    df = pd.read_csv(META_CSV)

    if df.empty:
        raise ValueError("meta_class.csv is empty")

    return df


def prepare_features(df, feature_names):
    X = df.drop(columns=[c for c in DROP_COLS if c in df.columns])

    missing = set(feature_names) - set(X.columns)
    if missing:
        raise ValueError(f"Missing required meta-features: {missing}")

    X = X[feature_names]
    X = X.fillna(0.0).astype(float)

    return X


def predict_best_model_for_dataset(dataset_id):
    model, label_encoder, feature_names = load_artifacts()
    df = load_meta_csv()

    row = df[df["dataset_id"] == dataset_id]
    if row.empty:
        raise ValueError(f"Dataset {dataset_id} not found in meta_class.csv")

    X = prepare_features(row, feature_names)

    pred = model.predict(X)[0]
    best_model_label = label_encoder.inverse_transform([pred])[0]

    return best_model_label



def main():
    print("[META] Predicting missing best_model_label values (classification)")

    model, le, feature_names = load_artifacts()
    df = load_meta_csv()

    mask = df["best_model_label"].isna()

    if mask.sum() == 0:
        print("[INFO] No rows require prediction")
        return

    infer_df = df.loc[mask].copy()
    print(f"[INFO] Predicting for {len(infer_df)} datasets")

    X_infer = prepare_features(infer_df, feature_names)

    preds = model.predict(X_infer)
    pred_labels = le.inverse_transform(preds)

    df.loc[mask, "best_model_label"] = pred_labels
    df.to_csv(META_CSV, index=False)

    print("[DONE] meta_class.csv updated with predicted best models")
    print(df.loc[mask, ["dataset_id", "best_model_label"]])


if __name__ == "__main__":
    main()
