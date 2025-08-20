from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class ConfigBase(BaseModel):
    name: str
    description: Optional[str] = None
    config_data: Dict[str, Any]

class ConfigCreate(ConfigBase):
    pass

class ConfigUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    config_data: Optional[Dict[str, Any]] = None
    is_default: Optional[bool] = None
    is_active: Optional[bool] = None

class ConfigResponse(ConfigBase):
    id: int
    is_default: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
