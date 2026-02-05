import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.validator import validate_dataset

router = APIRouter()

class ValidateRequest(BaseModel):
    tmp_path: str
    problem_type: str
    target_column: str


@router.post("")
def validate_route(payload: ValidateRequest):
    if payload.problem_type not in ("classification", "regression"):
        raise HTTPException(status_code=400, detail="Invalid problem type")

    if not os.path.exists(payload.tmp_path):
        raise HTTPException(status_code=404, detail="Temporary uploaded file not found")

    result = validate_dataset(
        payload.tmp_path,
        payload.target_column,
        payload.problem_type
    )

    errors = result.get("errors", [])
    warnings = result.get("warnings", [])
    stats = result.get("stats", {})

    if errors:
        return {
            "status": "error",
            "errors": errors,
            "warnings": warnings,
            "stats": stats
        }

    if warnings:
        return {
            "status": "warning",
            "warnings": warnings,
            "stats": stats,
            "message": "Dataset is valid but has warnings."
        }

    return {
        "status": "ok",
        "stats": stats,
        "message": "Validation successful! You can proceed with analyzing."
    }

