from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(PROJECT_ROOT)

from routes import upload, validate, analyze, predict, download, features

app = FastAPI(title="PickMyModel")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/upload")
app.include_router(validate.router, prefix="/validate")
app.include_router(analyze.router, prefix="/analyze")
app.include_router(predict.router, prefix="/predict")
app.include_router(download.router, prefix="/download")
app.include_router(features.router, prefix="/features")
