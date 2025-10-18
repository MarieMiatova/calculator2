from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from datetime import datetime
from sqlalchemy.orm import Session

from .database import SessionLocal, engine
from .models import Base, History
from .schemas import HistoryEntry


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Калькулятор API")


origins = [
    "*"  
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/history", response_model=List[HistoryEntry])
def get_history(db: Session = Depends(get_db)):
    items = db.query(History).order_by(History.timestamp.desc()).limit(100).all()
    return items

class HistoryCreate(HistoryEntry):
    id: None = None
    timestamp: str | None = None  
@app.post("/api/history", response_model=HistoryEntry)
def add_history(item: HistoryCreate, db: Session = Depends(get_db)):
    try:
        ts = datetime.fromisoformat(item.timestamp) if item.timestamp else datetime.utcnow()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid timestamp format")
    h = History(expression=item.expression, result=item.result, timestamp=ts)
    db.add(h)
    db.commit()
    db.refresh(h)
    return h
