from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas
from ..database import get_db
from sqlalchemy import or_, func
from ..routers.auth import get_current_user

router = APIRouter(
    prefix="/api/media",
    tags=["media"],
)

@router.post("", response_model=schemas.Media)
def create_media(media: schemas.MediaCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_media = models.Media(**media.model_dump())
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media

@router.get("", response_model=List[schemas.Media])
def list_media(
    file_type: Optional[str] = None,
    age_months: Optional[int] = None,
    event_name: Optional[str] = None,
    tag: Optional[str] = None,
    q: Optional[str] = None,
    is_favorite: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    query = db.query(models.Media)
    
    if file_type:
        query = query.filter(models.Media.file_type == file_type)
    if age_months is not None:
        query = query.filter(models.Media.age_months == age_months)
    if event_name:
        query = query.filter(models.Media.event_name == event_name)
    if tag:
        query = query.filter(models.Media.tags.contains(tag))
    if is_favorite is not None:
        query = query.filter(models.Media.is_favorite == is_favorite)
    if q:
        query = query.filter(
            or_(
                models.Media.filename.contains(q),
                models.Media.event_name.contains(q),
                models.Media.memo.contains(q),
                models.Media.tags.contains(q)
            )
        )
    
    return query.all()

@router.get("/tags", response_model=List[str])
def list_tags(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    media_list = db.query(models.Media.tags).filter(models.Media.tags != None).all()
    tags_set = set()
    for m in media_list:
        if m.tags:
            for tag in m.tags.split(","):
                tags_set.add(tag.strip())
    return sorted(list(tags_set))

@router.get("/events", response_model=List[str])
def list_events(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    events = db.query(models.Media.event_name).filter(models.Media.event_name != None).distinct().all()
    return sorted([e[0] for e in events])

@router.get("/age-groups", response_model=List[schemas.AgeGroupCount])
def list_age_groups(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    results = db.query(
        models.Media.age_months, 
        func.count(models.Media.id)
    ).group_by(models.Media.age_months).all()
    return [{"age_months": r[0], "count": r[1]} for r in results]

@router.get("/by-age/{age_months}", response_model=List[schemas.Media])
def list_by_age(age_months: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return db.query(models.Media).filter(models.Media.age_months == age_months).all()

@router.get("/by-event/{event_name}", response_model=List[schemas.Media])
def list_by_event(event_name: str, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return db.query(models.Media).filter(models.Media.event_name == event_name).all()

@router.get("/search", response_model=List[schemas.Media])
def search_media(q: str = Query(...), db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return db.query(models.Media).filter(
        or_(
            models.Media.filename.contains(q),
            models.Media.event_name.contains(q),
            models.Media.memo.contains(q),
            models.Media.tags.contains(q)
        )
    ).all()

@router.get("/{media_id}", response_model=schemas.Media)
def get_media(media_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if db_media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    return db_media

@router.put("/{media_id}", response_model=schemas.Media)
def update_media(media_id: int, media: schemas.MediaUpdate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if db_media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    
    update_data = media.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_media, key, value)
    
    db.commit()
    db.refresh(db_media)
    return db_media

@router.delete("/{media_id}")
def delete_media(media_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if db_media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    
    db.delete(db_media)
    db.commit()
    return {"detail": "Media deleted"}

@router.patch("/{media_id}/favorite", response_model=schemas.Media)
def toggle_favorite(media_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if db_media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    
    db_media.is_favorite = not db_media.is_favorite
    db.commit()
    db.refresh(db_media)
    return db_media
