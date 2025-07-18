#!/bin/bash

# 构建前端项目脚本
# 使用方法: ./build.sh

echo "🚀 开始构建 SH-HK Demo 前端项目..."

# 1. 安装依赖
echo "📦 安装依赖..."
npm install

# 2. 构建前端项目
echo "🔨 构建前端项目..."
npm run build

# 3. 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 构建成功！构建文件位于 dist/ 目录"
    echo "📊 构建文件大小:"
    du -sh dist/*
else
    echo "❌ 构建失败！请检查错误信息"
    exit 1
fi

echo "🎉 构建完成！"
echo "📝 接下来您可以："
echo "   1. 将 dist/ 目录内容部署到服务器"
echo "   2. 更新 nginx_conf/default.conf 配置文件"
echo "   3. 使用 docker-compose up -d 部署服务" 