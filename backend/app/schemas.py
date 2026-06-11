from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional, List

class MediaBase(BaseModel):
    filename: str
    nas_path: str
    file_type: str
    taken_at: date
    age_months: int
    event_name: Optional[str] = None
    tags: Optional[str] = None
    memo: Optional[str] = None
    is_favorite: bool = False

class MediaCreate(MediaBase):
    pass

class MediaUpdate(BaseModel):
    filename: Optional[str] = None
    nas_path: Optional[str] = None
    file_type: Optional[str] = None
    taken_at: Optional[date] = None
    age_months: Optional[int] = None
    event_name: Optional[str] = None
    tags: Optional[str] = None
    memo: Optional[str] = None
    is_favorite: Optional[bool] = None

class MediaFavorite(BaseModel):
    is_favorite: bool

class Media(MediaBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AgeGroupCount(BaseModel):
    age_months: int
    count: int
