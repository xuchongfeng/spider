# 通用爬虫网站 API 文档

## 基础信息

- 基础URL: `http://localhost:8000/api/v1`
- 认证方式: JWT Token
- 数据格式: JSON

## 认证相关

### 用户注册
```
POST /auth/register
```

**请求体:**
```json
{
  "username": "用户名",
  "email": "邮箱",
  "password": "密码"
}
```

### 用户登录
```
POST /auth/login
```

**请求体:**
```form-data
username: 用户名
password: 密码
```

**响应:**
```json
{
  "access_token": "JWT令牌",
  "token_type": "bearer"
}
```

## 爬虫任务管理

### 获取任务列表
```
GET /tasks?skip=0&limit=100
```

### 创建任务
```
POST /tasks
```

**请求体:**
```json
{
  "name": "任务名称",
  "description": "任务描述",
  "url": "目标URL",
  "config": "配置JSON字符串"
}
```

### 获取任务详情
```
GET /tasks/{task_id}
```

### 更新任务
```
PUT /tasks/{task_id}
```

### 删除任务
```
DELETE /tasks/{task_id}
```

### 启动任务
```
POST /tasks/{task_id}/start
```

### 停止任务
```
POST /tasks/{task_id}/stop
```

## 爬虫数据管理

### 获取数据列表
```
GET /data?skip=0&limit=100&task_id=1
```

### 获取数据详情
```
GET /data/{data_id}
```

### 删除数据
```
DELETE /data/{data_id}
```

## 爬虫配置管理

### 获取配置列表
```
GET /configs?skip=0&limit=100
```

### 创建配置
```
POST /configs
```

**请求体:**
```json
{
  "name": "配置名称",
  "description": "配置描述",
  "config_data": {
    "selectors": {
      "title": "css:h1.title",
      "content": "css:.content"
    },
    "headers": {
      "User-Agent": "Mozilla/5.0..."
    },
    "delay": 1
  }
}
```

### 获取配置详情
```
GET /configs/{config_id}
```

### 更新配置
```
PUT /configs/{config_id}
```

### 删除配置
```
DELETE /configs/{config_id}
```

## 状态码说明

- 200: 成功
- 201: 创建成功
- 400: 请求参数错误
- 401: 未认证
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误

## 错误响应格式

```json
{
  "detail": "错误描述信息"
}
```
