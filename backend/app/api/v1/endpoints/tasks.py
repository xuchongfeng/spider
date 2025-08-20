from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.spider_task import SpiderTask, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.spider_service import SpiderService

router = APIRouter()

@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """获取爬虫任务列表"""
    tasks = db.query(SpiderTask).offset(skip).limit(limit).all()
    return tasks

@router.post("/", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db)
):
    """创建新的爬虫任务"""
    db_task = SpiderTask(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """获取特定爬虫任务"""
    task = db.query(SpiderTask).filter(SpiderTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="任务未找到")
    return task

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db)
):
    """更新爬虫任务"""
    db_task = db.query(SpiderTask).filter(SpiderTask.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="任务未找到")
    
    for field, value in task_update.dict(exclude_unset=True).items():
        setattr(db_task, field, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """删除爬虫任务"""
    task = db.query(SpiderTask).filter(SpiderTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="任务未找到")
    
    db.delete(task)
    db.commit()
    return {"message": "任务已删除"}

@router.post("/{task_id}/start")
async def start_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """启动爬虫任务"""
    task = db.query(SpiderTask).filter(SpiderTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="任务未找到")
    
    if task.status != TaskStatus.PENDING:
        raise HTTPException(status_code=400, detail="任务状态不允许启动")
    
    # 这里应该调用爬虫服务
    spider_service = SpiderService()
    # spider_service.start_task(task)
    
    task.status = TaskStatus.RUNNING
    db.commit()
    
    return {"message": "任务已启动", "task_id": task_id}

@router.post("/{task_id}/stop")
async def stop_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """停止爬虫任务"""
    task = db.query(SpiderTask).filter(SpiderTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="任务未找到")
    
    if task.status != TaskStatus.RUNNING:
        raise HTTPException(status_code=400, detail="任务状态不允许停止")
    
    task.status = TaskStatus.CANCELLED
    db.commit()
    
    return {"message": "任务已停止", "task_id": task_id}
