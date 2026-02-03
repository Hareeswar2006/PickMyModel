import pandas as pd
import numpy as np
from scipy.stats import skew

MIN_ABSOLUTE_ROWS = 50
RECOMMENDED_ROWS = 200

MAX_MISSING_RATIO_WARNING = 0.30
MAX_MAJORITY_CLASS_RATIO = 0.85
MAX_CLASSES_WARNING = 20
MAX_SKEW_WARNING = 2.0


def validate_dataset(dataset_path, target_column, problem_type):
    df = pd.read_csv(dataset_path)
    errors = []
    warnings = []
    stats = {}

    if target_column not in df.columns:
        errors.append("Target column not found in dataset.")
        return {"errors": errors, "warnings": warnings, "stats": stats}
    
    df = df.copy()
    df = df.dropna(subset=[target_column])

    rows = len(df)

    if rows == 0:
        errors.append("All target values are missing.")
        return {"errors": errors, "warnings": warnings, "stats": stats}
    
    if rows < MIN_ABSOLUTE_ROWS:
        errors.append(f"Datset has fewer than {MIN_ABSOLUTE_ROWS} usable rows.")
        return {"errors": errors, "warnings": warnings, "stats": stats}
    
    y = df[target_column]

    if y.nunique() < 2:
        errors.append("Target column has less than 2 unique values.")
        return {"errors": errors, "warnings": warnings, "stats": stats}

    if problem_type == "regression":
        if not pd.api.types.is_numeric_dtype(y):
            errors.append("Target column must be numeric for regression.")
            return {"errors": errors, "warnings": warnings, "stats": stats}

    X = df.drop(columns = [target_column])

    numeric_features = X.select_dtypes(include = "number")
    categorical_features = X.select_dtypes(exclude = "number")

    if numeric_features.shape[1] == 0 and categorical_features.shape[1] == 0:
        errors.append("No usable feature columns found.")
        return {"errors": errors, "warnings": warnings, "stats": stats}

    if rows < RECOMMENDED_ROWS:
        warnings.append(f"Dataset has fewer than {RECOMMENDED_ROWS} rows, results may be unstable.")

    missing_ratio = df.isna().mean().mean()
    if missing_ratio > MAX_MISSING_RATIO_WARNING:
        warnings.append(f"High missingness detected ({missing_ratio:.0%}).")

    if problem_type == "classification":
        class_counts = y.value_counts(normalize = True)
        majority_ratio = class_counts.iloc[0]

        if majority_ratio > MAX_MAJORITY_CLASS_RATIO:
            warnings.append(f"Severe class imbalance detected (majority class {majority_ratio:.0%}).")

        num_classes = y.nunique()
        if num_classes > MAX_CLASSES_WARNING:
            warnings.append(f"High number of classes detected ({num_classes}).")

    
    if problem_type == "regression":
        y_skew = skew(y)
        if abs(y_skew) > MAX_SKEW_WARNING:
            warnings.append(f"Target is highly skewed (skewness = {y_skew:.2f}).")

    for col in categorical_features.columns:
        cardinality = categorical_features[col].nunique(dropna=True)
        if cardinality > 0.5 * rows:
            warnings.append(f"High-cardinality categorical feature detected: '{col}'.")
            break
    
    stats = {
        "rows": rows,
        "features": X.shape[1],
        "numeric_features": numeric_features.shape[1],
        "categorical_features": categorical_features.shape[1],
        "missing_ratio": round(missing_ratio, 4),
    }

    if problem_type == "classification":
        stats.update({"num_classes": y.nunique(), "majority_class_ratio": round(majority_ratio, 4)})


    return {"errors": errors, "warnings": warnings, "stats": stats}
