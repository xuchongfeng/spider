from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime

# ProxyWebsite schemas
class ProxyWebsiteBase(BaseModel):
    name: str
    url: HttpUrl
    description: Optional[str] = None
    is_active: bool = True
    crawl_interval: int = 3600

class ProxyWebsiteCreate(ProxyWebsiteBase):
    pass

class ProxyWebsiteUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[HttpUrl] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    crawl_interval: Optional[int] = None

class ProxyWebsiteResponse(ProxyWebsiteBase):
    id: int
    last_crawl_time: Optional[datetime] = None
    success_rate: float = 0.0
    total_proxies: int = 0
    valid_proxies: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Proxy schemas
class ProxyBase(BaseModel):
    ip: str
    port: int
    protocol: str = "http"
    country: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    isp: Optional[str] = None
    anonymity: str = "unknown"

class ProxyCreate(ProxyBase):
    source_website_id: int

class ProxyUpdate(BaseModel):
    speed: Optional[float] = None
    success_rate: Optional[float] = None
    is_active: Optional[bool] = None

class ProxyResponse(ProxyBase):
    id: int
    speed: Optional[float] = None
    success_rate: float = 0.0
    last_check_time: Optional[datetime] = None
    is_active: bool = True
    source_website_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 统计信息
class ProxyStats(BaseModel):
    total_proxies: int
    active_proxies: int
    inactive_proxies: int
    http_proxies: int
    https_proxies: int
    socks_proxies: int
    countries_count: int
    avg_speed: Optional[float] = None
    avg_success_rate: Optional[float] = None
