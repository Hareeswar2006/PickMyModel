import os
import json
import pandas as pd
from fastapi import APIRouter, HTTPException

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

router = APIRouter()

MAX_CATEGORIES = 20


@router.get("/{problem_type}/{dataset_id}")
def get_features(problem_type, dataset_id):

    schema_path = os.path.join(BASE_DIR, "models", "preprocessors", problem_type, f"{dataset_id}_schema.json")
    #print('features schema-path',schema_path)

    if not os.path.exists(schema_path):
        raise HTTPException(404, "Feature schema not found")

    with open(schema_path, "r") as f:
        schema = json.load(f)

    return schema
