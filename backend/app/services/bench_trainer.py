from src.bench.class_bench_trainer import train_single_model as train_clf
from src.bench.reg_bench_trainer import train_single_model as train_reg


def train_and_evaluate(dataset_id, problem_type, model_label, dataset_path=None, target_column=None):
    if problem_type == "classification":
        return train_clf(dataset_id, model_label)

    elif problem_type == "regression":
        return train_reg(dataset_id, model_label)

    else:
        raise ValueError("Invalid problem type")
