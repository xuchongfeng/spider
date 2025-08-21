from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.services.proxy_service import ProxyWebsiteService, ProxyService
from app.schemas.proxy import (
    ProxyWebsiteCreate, ProxyWebsiteUpdate, ProxyWebsiteResponse,
    ProxyCreate, ProxyUpdate, ProxyResponse, ProxyStats
)

router = APIRouter()

# ProxyWebsite endpoints
@router.post("/websites/", response_model=ProxyWebsiteResponse)
def create_proxy_website(
    proxy_website: ProxyWebsiteCreate,
    db: Session = Depends(get_db)
):
    service = ProxyWebsiteService(db)
    return service.create_proxy_website(proxy_website)

@router.get("/websites/", response_model=List[ProxyWebsiteResponse])
def get_proxy_websites(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    service = ProxyWebsiteService(db)
    return service.get_proxy_websites(skip=skip, limit=limit)

@router.get("/websites/{website_id}", response_model=ProxyWebsiteResponse)
def get_proxy_website(website_id: int, db: Session = Depends(get_db)):
    service = ProxyWebsiteService(db)
    proxy_website = service.get_proxy_website(website_id)
    if not proxy_website:
        raise HTTPException(status_code=404, detail="代理网站不存在")
    return proxy_website

@router.put("/websites/{website_id}", response_model=ProxyWebsiteResponse)
def update_proxy_website(
    website_id: int,
    proxy_website: ProxyWebsiteUpdate,
    db: Session = Depends(get_db)
):
    service = ProxyWebsiteService(db)
    updated_website = service.update_proxy_website(website_id, proxy_website)
    if not updated_website:
        raise HTTPException(status_code=404, detail="代理网站不存在")
    return updated_website

@router.delete("/websites/{website_id}")
def delete_proxy_website(website_id: int, db: Session = Depends(get_db)):
    service = ProxyWebsiteService(db)
    success = service.delete_proxy_website(website_id)
    if not success:
        raise HTTPException(status_code=404, detail="代理网站不存在")
    return {"message": "代理网站删除成功"}

# Proxy endpoints
@router.post("/", response_model=ProxyResponse)
def create_proxy(proxy: ProxyCreate, db: Session = Depends(get_db)):
    service = ProxyService(db)
    return service.create_proxy(proxy)

@router.get("/", response_model=List[ProxyResponse])
def get_proxies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    protocol: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    source_website_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = ProxyService(db)
    filters = {
        'protocol': protocol,
        'country': country,
        'is_active': is_active,
        'source_website_id': source_website_id
    }
    # 移除None值
    filters = {k: v for k, v in filters.items() if v is not None}
    return service.get_proxies(skip=skip, limit=limit, filters=filters)

@router.get("/stats", response_model=ProxyStats)
def get_proxy_stats(db: Session = Depends(get_db)):
    service = ProxyService(db)
    return service.get_proxy_stats()

@router.get("/{proxy_id}", response_model=ProxyResponse)
def get_proxy(proxy_id: int, db: Session = Depends(get_db)):
    service = ProxyService(db)
    proxy = service.get_proxy(proxy_id)
    if not proxy:
        raise HTTPException(status_code=404, detail="代理不存在")
    return proxy

@router.put("/{proxy_id}", response_model=ProxyResponse)
def update_proxy(
    proxy_id: int,
    proxy: ProxyUpdate,
    db: Session = Depends(get_db)
):
    service = ProxyService(db)
    updated_proxy = service.update_proxy(proxy_id, proxy)
    if not updated_proxy:
        raise HTTPException(status_code=404, detail="代理不存在")
    return updated_proxy

@router.delete("/{proxy_id}")
def delete_proxy(proxy_id: int, db: Session = Depends(get_db)):
    service = ProxyService(db)
    success = service.delete_proxy(proxy_id)
    if not success:
        raise HTTPException(status_code=404, detail="代理不存在")
    return {"message": "代理删除成功"}

@router.get("/random/", response_model=ProxyResponse)
def get_random_proxy(
    protocol: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    service = ProxyService(db)
    proxy = service.get_random_proxy(protocol=protocol, country=country)
    if not proxy:
        raise HTTPException(status_code=404, detail="没有可用的代理")
    return proxy
