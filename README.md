# 通用爬虫网站

一个基于React + Ant Design前端和Python + FastAPI后端的通用爬虫网站。

## 项目结构

```
spider/
├── frontend/          # React前端应用
├── backend/           # Python FastAPI后端
├── docs/             # 项目文档
└── docker-compose.yml # Docker编排文件
```

## 快速开始

### 前端
```bash
cd frontend
npm install
npm start
```

### 后端
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 使用Docker
```bash
docker-compose up -d
```

## 功能特性

- 🕷️ 通用爬虫引擎
- 📊 数据可视化
- 🔧 爬虫任务管理
- 📈 实时监控
- 🎨 现代化UI界面

## 技术栈

- **前端**: React 18, Ant Design, TypeScript
- **后端**: Python 3.9+, FastAPI, SQLAlchemy
- **数据库**: PostgreSQL
- **缓存**: Redis
- **任务队列**: Celery
