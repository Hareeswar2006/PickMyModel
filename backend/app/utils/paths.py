import os

BASE_DATA = "data"

def raw_path(problem_type, dataset_id):
    return f"{BASE_DATA}/raw/{problem_type}/{dataset_id}.csv"

def clean_path(problem_type, dataset_id):
    return f"{BASE_DATA}/preprocessed/{problem_type}/{dataset_id}_clean.csv"

def meta_csv(problem_type):
    return f"{BASE_DATA}/meta/meta_{problem_type}.csv"
