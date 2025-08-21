from fastapi import APIRouter
from app.api.v1.endpoints import auth, tasks, data, configs, proxy

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["认证"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["爬虫任务"])
api_router.include_router(data.router, prefix="/data", tags=["爬虫数据"])
api_router.include_router(configs.router, prefix="/configs", tags=["爬虫配置"])
api_router.include_router(proxy.router, prefix="/proxy", tags=["代理管理"])
