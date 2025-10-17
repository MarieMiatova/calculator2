from pydantic import BaseModel
from datetime import datetime
class HistoryEntry(BaseModel):
    expression: str
    result: str
    timestamp: datetime | None = None