#!/bin/bash

echo "🚀 启动通用爬虫网站项目..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

echo "📦 构建并启动服务..."
docker-compose up --build -d

echo "⏳ 等待服务启动..."
sleep 10

echo "✅ 服务启动完成！"
echo ""
echo "🌐 前端地址: http://localhost:3000"
echo "🔧 后端API: http://localhost:8000"
echo "📊 数据库: localhost:5432"
echo "🗄️  Redis: localhost:6379"
echo ""
echo "📖 API文档: http://localhost:8000/docs"
echo ""
echo "🔑 默认登录账号: admin / admin"
echo ""
echo "📋 查看服务状态: docker-compose ps"
echo "📋 查看日志: docker-compose logs -f"
echo "🛑 停止服务: docker-compose down"
