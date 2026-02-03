from src.meta.regression.reg_meta_predictor import predict_best_model_for_dataset as predict_reg
from src.meta.classification.class_meta_predictor import predict_best_model_for_dataset as predict_clf


def predict_best_model(dataset_id, problem_type):
    if problem_type == "regression":
        return predict_reg(dataset_id)
    elif problem_type == "classification":
        return predict_clf(dataset_id)
    else:
        raise ValueError("Invalid problem type")
