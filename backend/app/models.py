from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, func
from .database import Base

class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    nas_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False) # "photo" or "video"
    taken_at = Column(Date, nullable=False)
    age_months = Column(Integer, nullable=False)
    event_name = Column(String, nullable=True)
    tags = Column(String, nullable=True) # comma-separated
    memo = Column(String, nullable=True)
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
