from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import media
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Toddler NAS Photo Indexer API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(media.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Toddler NAS Photo Indexer API"}
