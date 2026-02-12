# 历史记录 API 文档

## 概述

历史记录 API 提供翻译任务的查询、详情查看和删除功能。

## API 端点

### 1. 查询历史记录

```http
GET /api/translate/history/
```

#### 查询参数

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | int | 否 | 1 | 页码，从 1 开始 |
| page_size | int | 否 | 20 | 每页条数，范围 1-100 |
| status | TaskStatus | 否 | None | 按状态筛选 (pending/queued/processing/completed/failed/cancelled) |
| file_type | string | 否 | None | 按文件类型筛选 (pptx/docx/xlsx/pdf) |
| order_by | string | 否 | created_at | 排序字段 |
| desc | bool | 否 | true | 是否降序 |

#### 响应示例

```json
{
  "total": 100,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "task_id": "550e8400-e29b-41d4-a716-446655440000",
      "file_name": "presentation.pptx",
      "file_type": "pptx",
      "target_language": "English",
      "model": "gpt-4o-mini",
      "status": "completed",
      "progress": 100.0,
      "created_at": "2026-02-11T12:00:00",
      "started_at": "2026-02-11T12:00:10",
      "completed_at": "2026-02-11T12:05:30"
    }
  ]
}
```

### 2. 查询任务详情

```http
GET /api/translate/history/{task_id}
```

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| task_id | UUID | 任务 ID |

#### 响应示例

```json
{
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "file_name": "presentation.pptx",
  "file_path": "/uploads/550e8400-e29b-41d4-a716-446655440000.pptx",
  "file_type": "pptx",
  "target_language": "English",
  "model": "gpt-4o-mini",
  "status": "completed",
  "priority": 5,
  "progress": 100.0,
  "created_at": "2026-02-11T12:00:00",
  "started_at": "2026-02-11T12:00:10",
  "completed_at": "2026-02-11T12:05:30",
  "output_path": "/output/550e8400-e29b-41d4-a716-446655440000.pptx",
  "error_message": null,
  "error_type": null,
  "retry_count": 0
}
```

#### 错误响应

```json
{
  "detail": "任务 550e8400-e29b-41d4-a716-446655440000 不存在"
}
```

### 3. 删除任务

```http
DELETE /api/translate/history/{task_id}
```

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| task_id | UUID | 任务 ID |

#### 查询参数

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| delete_files | bool | 否 | true | 是否同时删除原文件和译文 |

#### 响应示例

```json
{
  "success": true,
  "message": "任务 550e8400-e29b-41d4-a716-446655440000 已删除",
  "deleted_files": [
    "/uploads/550e8400-e29b-41d4-a716-446655440000.pptx",
    "/output/550e8400-e29b-41d4-a716-446655440000.pptx"
  ]
}
```

## 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 404 | 任务不存在 |
| 422 | 参数验证失败 |
| 500 | 服务器错误 |

## 使用示例

### Python (httpx)

```python
import httpx

async with httpx.AsyncClient() as client:
    # 查询历史记录
    response = await client.get(
        "http://localhost:8000/api/translate/history/",
        params={
            "page": 1,
            "page_size": 10,
            "status": "completed",
        }
    )
    data = response.json()
    print(f"总共 {data['total']} 条记录")

    # 查询详情
    task_id = data["items"][0]["task_id"]
    response = await client.get(
        f"http://localhost:8000/api/translate/history/{task_id}"
    )
    detail = response.json()
    print(f"任务进度: {detail['progress']}%")

    # 删除任务
    response = await client.delete(
        f"http://localhost:8000/api/translate/history/{task_id}",
        params={"delete_files": True}
    )
    result = response.json()
    print(f"删除结果: {result['message']}")
```

### JavaScript (fetch)

```javascript
// 查询历史记录
const response = await fetch(
  '/api/translate/history/?page=1&page_size=10&status=completed'
);
const data = await response.json();
console.log(`总共 ${data.total} 条记录`);

// 查询详情
const taskId = data.items[0].task_id;
const detailResponse = await fetch(`/api/translate/history/${taskId}`);
const detail = await detailResponse.json();
console.log(`任务进度: ${detail.progress}%`);

// 删除任务
const deleteResponse = await fetch(
  `/api/translate/history/${taskId}?delete_files=true`,
  { method: 'DELETE' }
);
const result = await deleteResponse.json();
console.log(`删除结果: ${result.message}`);
```

### cURL

```bash
# 查询历史记录
curl "http://localhost:8000/api/translate/history/?page=1&page_size=10"

# 查询详情
curl "http://localhost:8000/api/translate/history/550e8400-e29b-41d4-a716-446655440000"

# 删除任务
curl -X DELETE "http://localhost:8000/api/translate/history/550e8400-e29b-41d4-a716-446655440000?delete_files=true"
```

## 注意事项

1. **分页**: 页码从 1 开始，page_size 最大为 100
2. **文件删除**: 默认会同时删除原文件和译文，设置 `delete_files=false` 可保留文件
3. **排序**: 支持按任意数据库字段排序，常用的有 `created_at`、`completed_at`、`progress`
4. **筛选**: 可以组合多个筛选条件，如同时按状态和文件类型筛选

## 与 Task #3 的集成

Task #3 (翻译 API) 创建的任务会自动出现在历史记录中：

```
POST /api/translate/upload  → 创建任务
    ↓
任务自动入库
    ↓
GET /api/translate/history/ → 可以查询到该任务
```

## 测试

运行测试：

```bash
pytest tests/api/test_history.py -v
```

测试覆盖：
- ✅ 查询历史记录（分页、筛选、排序）
- ✅ 查询任务详情
- ✅ 删除任务（带文件清理）
- ✅ 错误处理（404、422、500）
- ✅ 边缘情况（空列表、超大页码）

## 待完成

- [ ] 集成到主 FastAPI app
- [ ] 添加 file_type 筛选到 repository
- [ ] 添加时间范围筛选
- [ ] 添加批量删除功能
- [ ] 添加导出功能（CSV/Excel）

## 文件位置

```
app/api/
├── routes/
│   └── history.py          ✅ 路由实现
└── schemas/
    └── history.py          ✅ 响应模型

tests/api/
└── test_history.py         ✅ API 测试
```

## 版本历史

- v1.0.0 (2026-02-11): 初始版本，基础框架完成
