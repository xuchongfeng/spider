from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.spider_data import SpiderData
from app.schemas.data import DataResponse

router = APIRouter()

@router.get("/", response_model=List[DataResponse])
async def get_data(
    skip: int = 0,
    limit: int = 100,
    task_id: int = None,
    db: Session = Depends(get_db)
):
    """获取爬虫数据列表"""
    query = db.query(SpiderData)
    if task_id:
        query = query.filter(SpiderData.task_id == task_id)
    
    data_list = query.offset(skip).limit(limit).all()
    return data_list

@router.get("/{data_id}", response_model=DataResponse)
async def get_data_by_id(
    data_id: int,
    db: Session = Depends(get_db)
):
    """获取特定爬虫数据"""
    data = db.query(SpiderData).filter(SpiderData.id == data_id).first()
    if not data:
        raise HTTPException(status_code=404, detail="数据未找到")
    return data

@router.delete("/{data_id}")
async def delete_data(
    data_id: int,
    db: Session = Depends(get_db)
):
    """删除爬虫数据"""
    data = db.query(SpiderData).filter(SpiderData.id == data_id).first()
    if not data:
        raise HTTPException(status_code=404, detail="数据未找到")
    
    db.delete(data)
    db.commit()
    return {"message": "数据已删除"}
