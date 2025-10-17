from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal, engine
from backend.app.models import Base, History
from backend.app.schemas import HistoryEntry
from datetime import datetime

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Калькулятор API")

class HistoryCreate(BaseModel):
    expression: str
    result: str
    timestamp: str | None = None

@app.get("/api/history", response_model=list)
def get_history():
    with SessionLocal() as db:
        items = db.query(History).order_by(History.timestamp.desc()).limit(100).all()
        return [
            {"expression": h.expression, "result": h.result, "timestamp": h.timestamp.isoformat()}
            for h in items
        ]

@app.post("/api/history", response_model=dict)
def add_history(item: HistoryCreate):
    with SessionLocal() as db:
        ts = datetime.fromisoformat(item.timestamp) if item.timestamp else datetime.utcnow()
        h = History(expression=item.expression, result=item.result, timestamp=ts)
        db.add(h)
        db.commit()
        db.refresh(h)
        return {"expression": h.expression, "result": h.result, "timestamp": h.timestamp.isoformat()}