from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class DataResponse(BaseModel):
    id: int
    task_id: int
    url: str
    title: Optional[str] = None
    content: Optional[str] = None
    extracted_data: Optional[Dict[str, Any]] = None
    raw_html: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
