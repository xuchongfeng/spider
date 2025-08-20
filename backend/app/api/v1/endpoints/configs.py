from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.spider_config import SpiderConfig
from app.schemas.config import ConfigCreate, ConfigUpdate, ConfigResponse

router = APIRouter()

@router.get("/", response_model=List[ConfigResponse])
async def get_configs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """获取爬虫配置列表"""
    configs = db.query(SpiderConfig).offset(skip).limit(limit).all()
    return configs

@router.post("/", response_model=ConfigResponse)
async def create_config(
    config: ConfigCreate,
    db: Session = Depends(get_db)
):
    """创建新的爬虫配置"""
    db_config = SpiderConfig(**config.dict())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

@router.get("/{config_id}", response_model=ConfigResponse)
async def get_config(
    config_id: int,
    db: Session = Depends(get_db)
):
    """获取特定爬虫配置"""
    config = db.query(SpiderConfig).filter(SpiderConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=404, detail="配置未找到")
    return config

@router.put("/{config_id}", response_model=ConfigResponse)
async def update_config(
    config_id: int,
    config_update: ConfigUpdate,
    db: Session = Depends(get_db)
):
    """更新爬虫配置"""
    db_config = db.query(SpiderConfig).filter(SpiderConfig.id == config_id).first()
    if not db_config:
        raise HTTPException(status_code=404, detail="配置未找到")
    
    for field, value in config_update.dict(exclude_unset=True).items():
        setattr(db_config, field, value)
    
    db.commit()
    db.refresh(db_config)
    return db_config

@router.delete("/{config_id}")
async def delete_config(
    config_id: int,
    db: Session = Depends(get_db)
):
    """删除爬虫配置"""
    config = db.query(SpiderConfig).filter(SpiderConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=404, detail="配置未找到")
    
    db.delete(config)
    db.commit()
    return {"message": "配置已删除"}
