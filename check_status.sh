#!/bin/bash

echo "========================================="
echo "  AI Office 文档翻译系统 - 服务状态"
echo "========================================="
echo ""

# 检查后端
if pgrep -f "uvicorn main:app" > /dev/null; then
    BACKEND_PID=$(pgrep -f "uvicorn main:app")
    echo "✅ 后端 (FastAPI): 运行中 (PID: $BACKEND_PID)"
    echo "   访问: http://localhost:8002"
    echo "   API 文档: http://localhost:8002/docs"
else
    echo "❌ 后端 (FastAPI): 未运行"
    echo "   启动命令: python main.py"
fi

echo ""

# 检查前端
if pgrep -f "next dev" > /dev/null; then
    FRONTEND_PID=$(pgrep -f "next dev" | head -1)
    FRONTEND_PORT=$(lsof -ti:3001 > /dev/null 2>&1 && echo "3001" || echo "3000")
    echo "✅ 前端 (Next.js): 运行中 (PID: $FRONTEND_PID)"
    echo "   访问: http://localhost:$FRONTEND_PORT"
    echo "   翻译页面: http://localhost:$FRONTEND_PORT/translate"
else
    echo "❌ 前端 (Next.js): 未运行"
    echo "   启动命令: cd web && npm run dev"
fi

echo ""

# 检查数据库
if psql -U blue_focus -d ai_translate -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ 数据库 (PostgreSQL): 连接成功"
    echo "   数据库名: ai_translate"
    echo "   用户: blue_focus"
else
    echo "⚠️  数据库 (PostgreSQL): 连接失败或未配置"
    echo "   检查命令: psql -U blue_focus -d ai_translate"
fi

echo ""
echo "========================================="
echo "  快速操作"
echo "========================================="
echo "查看后端日志: tail -f /tmp/backend.log"
echo "查看前端日志: tail -f /tmp/frontend_new.log"
echo "停止所有服务: pkill -f 'uvicorn|next dev'"
echo ""
