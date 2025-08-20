#!/bin/bash

echo "🚀 启动通用爬虫网站开发环境..."

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3未安装，请先安装Python3"
    exit 1
fi

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js"
    exit 1
fi

echo "📦 安装后端依赖..."
cd backend
if [ ! -d "venv" ]; then
    echo "创建Python虚拟环境..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt

echo "📦 安装前端依赖..."
cd ../frontend
npm install

echo "🚀 启动后端服务..."
cd ../backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!

echo "🚀 启动前端服务..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "✅ 开发环境启动完成！"
echo ""
echo "🌐 前端地址: http://localhost:3000"
echo "🔧 后端API: http://localhost:8000"
echo ""
echo "🔑 默认登录账号: admin / admin"
echo ""
echo "📋 按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '🛑 停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
