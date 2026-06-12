from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import media
from .routers import auth as auth_router
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Toddler NAS Photo Indexer API")

_cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
app.include_router(media.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Toddler NAS Photo Indexer API"}
