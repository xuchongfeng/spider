from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.spider_task import TaskStatus

class TaskBase(BaseModel):
    name: str
    description: Optional[str] = None
    url: str
    config: Optional[str] = None

class TaskCreate(TaskBase):
    user_id: Optional[int] = None

class TaskUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    config: Optional[str] = None
    status: Optional[TaskStatus] = None

class TaskResponse(TaskBase):
    id: int
    status: TaskStatus
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

    class Config:
        from_attributes = True
