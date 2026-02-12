#!/bin/bash

echo "========================================="
echo "  日志查看工具"
echo "========================================="
echo ""
echo "选择要查看的日志:"
echo "1) 后端日志（实时）"
echo "2) 前端日志（实时）"
echo "3) 后端日志（最近 50 行）"
echo "4) 前端日志（最近 50 行）"
echo "5) 后端日志（全部）"
echo "6) 前端日志（全部）"
echo "7) 同时查看两个日志（实时）"
echo ""
read -p "请输入选项 (1-7): " choice

case $choice in
  1)
    echo "查看后端实时日志（按 Ctrl+C 退出）..."
    tail -f /tmp/backend.log
    ;;
  2)
    echo "查看前端实时日志（按 Ctrl+C 退出）..."
    tail -f /tmp/frontend_new.log
    ;;
  3)
    echo "=== 后端日志（最近 50 行）==="
    tail -50 /tmp/backend.log
    ;;
  4)
    echo "=== 前端日志（最近 50 行）==="
    tail -50 /tmp/frontend_new.log
    ;;
  5)
    echo "=== 后端完整日志 ==="
    cat /tmp/backend.log
    ;;
  6)
    echo "=== 前端完整日志 ==="
    cat /tmp/frontend_new.log
    ;;
  7)
    echo "同时查看两个日志（按 Ctrl+C 退出）..."
    tail -f /tmp/backend.log /tmp/frontend_new.log
    ;;
  *)
    echo "无效选项"
    exit 1
    ;;
esac
