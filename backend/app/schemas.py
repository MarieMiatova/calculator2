from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class HistoryEntry(BaseModel):
    id: Optional[int] = None
    expression: str
    result: str
    timestamp: Optional[datetime] = None

    class Config:
        orm_mode = True
