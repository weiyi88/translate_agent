#!/bin/bash

echo "========================================="
echo "  日志搜索工具"
echo "========================================="
echo ""

if [ -z "$1" ]; then
  read -p "输入要搜索的关键词: " keyword
else
  keyword="$1"
fi

echo ""
echo "=== 在后端日志中搜索 '$keyword' ==="
grep -i "$keyword" /tmp/backend.log || echo "未找到匹配项"

echo ""
echo "=== 在前端日志中搜索 '$keyword' ==="
grep -i "$keyword" /tmp/frontend_new.log || echo "未找到匹配项"
