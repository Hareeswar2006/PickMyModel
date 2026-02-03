import json
import uuid
from datetime import datetime
from pathlib import Path

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

RUN_LOG = LOG_DIR / "run_logs.jsonl"


def log_run(dataset_id, problem_type, best_model, metrics, user_id, is_guest):
    record = {
        "run_id": uuid.uuid4().hex[:8],
        "dataset_id": dataset_id,
        "problem_type": problem_type,
        "best_model": best_model,
        "metrics": metrics,
        "user_id": user_id,
        "is_guest": is_guest,
        "timestamp": datetime.utcnow().isoformat()
    }

    with open(RUN_LOG, "a") as f:
        f.write(json.dumps(record) + "\n")
