# 完整产品需求文档 (PRD) v2.0
## AI Office 文档翻译 SaaS 平台

**版本**: 2.0.0
**作者**: Aring + Claude
**日期**: 2026-02-09
**项目名**: ai_server_translate_office
**定位**: SaaS B2B/B2C 平台 | AI 文档翻译服务

---

## 📋 目录

1. [产品概述](#1-产品概述)
2. [用户画像](#2-用户画像)
3. [核心功能](#3-核心功能)
4. [前端详细设计](#4-前端详细设计)
5. [后端详细设计](#5-后端详细设计)
6. [数据库设计](#6-数据库设计)
7. [API 接口规范](#7-api-接口规范)
8. [非功能性需求](#8-非功能性需求)
9. [MVP 范围](#9-mvp-范围)
10. [实施计划](#10-实施计划)

---

## 1. 产品概述

### 1.1 产品定位

**TranslateAI** 是一款基于大语言模型的智能文档翻译 SaaS 平台，核心价值是**完美保留原文档格式的同时提供专业级翻译质量**。

### 1.2 核心价值主张（优先级排序）

1. **格式完美保留** ⭐⭐⭐⭐⭐ (首要卖点)
   - 保留字体、颜色、大小、对齐、图片位置、表格样式
   - 支持复杂排版（多栏、嵌套、组合形状）

2. **翻译质量优先** ⭐⭐⭐⭐⭐
   - 支持多个 LLM 模型（GPT-4o、Claude 3.5、Gemini、Moonshot）
   - 上下文理解，术语一致性

3. **专业词库系统** ⭐⭐⭐⭐
   - 自定义术语库
   - 批量导入/导出
   - 团队共享（企业版）

4. **完整历史记录** ⭐⭐⭐⭐
   - 翻译历史追踪
   - 版本对比
   - 翻译质量反馈

### 1.3 支持文件格式

| 格式 | 扩展名 | 格式保留程度 | MVP 优先级 |
|------|--------|--------------|------------|
| PowerPoint | .pptx | ✅ 完整 | P0 |
| Word | .docx | ⚠️ 部分（需修复） | P0 |
| Excel | .xlsx | ✅ 完整 | P1 |
| PDF | .pdf | ❌ 纯文本输出 | P2 |

### 1.4 商业模式

**SaaS 订阅制**，按月/年付费：

| 套餐 | 价格 | 目标用户 | 核心功能 |
|------|------|----------|----------|
| 免费版 | ¥0 | 个人试用 | 10 页/月，基础模型 |
| 专业版 | ¥99/月 | 个人/小团队 | 无限翻译，所有模型，词库 |
| 企业版 | 定制 | 大型团队 | 私有部署，API，多人协作 |

---

## 2. 用户画像

### 2.1 核心用户（MVP 聚焦）

#### 用户 A: 企业市场人员
- **画像**: 张经理，40 岁，跨国企业市场总监
- **需求**:
  - 翻译 PPT 演示文稿（中→英/英→中）
  - 必须保留品牌设计和排版
  - 术语一致性（品牌名称、产品术语）
- **痛点**:
  - Google 翻译格式丢失
  - 人工翻译成本高（¥500-1000/页）
  - 周期长（3-5 天）
- **期望**:
  - 15 分钟完成 50 页 PPT 翻译
  - 价格 <¥200/次
  - 格式 100% 保留

#### 用户 B: 学术研究员
- **画像**: 李教授，35 岁，大学研究员
- **需求**:
  - 翻译学术论文（PDF/Word）
  - 专业术语准确
  - 数据安全（不上传到公有云）
- **痛点**:
  - DeepL/Google 术语不准
  - 学校预算有限
  - 担心数据泄露
- **期望**:
  - 价格 <¥30/月
  - 本地化部署（可选）
  - 术语自定义

#### 用户 C: 翻译工作室老板
- **画像**: 王老板，45 岁，翻译公司创始人
- **需求**:
  - 批量翻译客户文档
  - 多人协作（译员、审校）
  - API 集成到内部系统
- **痛点**:
  - 手动翻译效率低
  - 人工成本占 70%
  - 质量不稳定
- **期望**:
  - API 批量调用
  - 审核工作流
  - 价格 <¥200/月

### 2.2 次要用户（v1.1+）

#### 用户 D: 自由职业设计师
- **画像**: Maria，28 岁，设计师
- **需求**:
  - 偶尔翻译作品集（PPT/PDF）
  - 按需付费
- **期望**:
  - 按页/次收费
  - 简单易用
  - 价格敏感（<¥10/次）

---

## 3. 核心功能

### 3.1 功能列表（按优先级）

| 功能模块 | MVP | v1.1 | v1.2 | v2.0 |
|----------|-----|------|------|------|
| **用户系统** |
| 邮箱注册/登录 | ✅ | | | |
| OAuth 登录 (Google/GitHub) | | ✅ | | |
| 找回密码 | ✅ | | | |
| 多租户隔离 | | | ✅ | |
| **翻译功能** |
| PPT 翻译 | ✅ | | | |
| Word 翻译 | ✅ | | | |
| Excel 翻译 | | ✅ | | |
| PDF 翻译 | | | ✅ | |
| 在线文本翻译 | ✅ | | | |
| 批量翻译 | | ✅ | | |
| **词库系统** |
| 创建词库 | ✅ | | | |
| 添加/编辑/删除术语 | ✅ | | | |
| 导入/导出 (CSV/Excel) | | ✅ | | |
| 团队共享词库 | | | | ✅ |
| **历史记录** |
| 查看历史 | ✅ | | | |
| 下载译文 | ✅ | | | |
| 版本对比 | | ✅ | | |
| 翻译质量评分 | | | ✅ | |
| **配额管理** |
| 订阅管理 | ✅ | | | |
| 配额显示 | ✅ | | | |
| 支付集成 (Stripe) | ✅ | | | |
| **API** |
| RESTful API | | ✅ | | |
| Webhook 通知 | | | ✅ | |
| API 文档 | | ✅ | | |
| **协作功能** |
| 团队成员管理 | | | | ✅ |
| 审核工作流 | | | | ✅ |

---

## 4. 前端详细设计

### 4.1 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: React Hooks + Context API
- **HTTP 客户端**: Fetch API + SWR (数据缓存)
- **表单**: React Hook Form + Zod
- **图标**: Lucide React

### 4.2 页面结构

```
/                       # Landing Page (首页)
/signup                 # 注册页
/login                  # 登录页
/dashboard              # 仪表板
  /translate            # 翻译页面
  /history              # 历史记录
  /glossary             # 词库管理
  /settings             # 设置
    /profile            # 个人信息
    /subscription       # 订阅管理
    /api-keys           # API 密钥
/pricing                # 定价页
/docs                   # API 文档
/admin                  # 管理后台 (v2.0)
```

---

### 4.3 详细页面设计

#### 4.3.1 Landing Page `/`

**目标**: 转化访客为注册用户

**页面结构**:

```
[Header - 固定顶部]
  - Logo + 导航 (功能/价格/文档)
  - [登录] [免费开始]

[Hero Section]
  - 主标题: "智能翻译 保持格式 专业高效"
  - 副标题: "支持 PPT/Word/Excel/PDF..."
  - CTA: [免费开始翻译] [查看演示]
  - 信任标识: ✓ 免费试用 ✓ 无需信用卡 ✓ 秒级处理
  - 产品演示图 (Fake UI)

[Features Section - 6 个特性卡片]
  1. 多格式支持 (FileText Icon)
  2. AI 智能翻译 (Sparkles Icon)
  3. 术语库管理 (Globe Icon)
  4. 对话翻译 (Chrome Icon)
  5. 格式保留 (Check Icon)
  6. API 集成 (Github Icon)

[Pricing Section - 3 个价格卡片]
  - 免费版/专业版/企业版
  - CTA: [免费开始] [立即订阅] [联系我们]

[Footer]
  - 链接: 产品/资源/公司
  - 版权信息
```

**交互**:
- 点击 "免费开始" → 跳转到 `/signup`
- 点击 "登录" → 跳转到 `/login`
- 点击 "查看演示" → 跳转到 `/demo` (v1.1)
- Scroll 动画: fade-in, slide-up, scale-in

**API 调用**: 无

---

#### 4.3.2 注册页 `/signup`

**目标**: 收集用户信息并创建账户

**页面布局**:

```
[Left - 品牌区]
  - Logo
  - 标题: "开始你的翻译之旅"
  - 特性列表 (3 个)

[Right - 表单区]
  [注册表单]
    - 邮箱输入框
    - 密码输入框 (显示强度指示器)
    - 确认密码输入框
    - [同意服务条款] (Checkbox)
    - [注册] 按钮 (Primary)
    - [使用 Google 注册] (Secondary, v1.1)
    - [使用 GitHub 注册] (Secondary, v1.1)

  [已有账号?] [登录] (链接)
```

**表单验证**:

| 字段 | 验证规则 | 错误提示 |
|------|----------|----------|
| 邮箱 | Email 格式 + 唯一性 | "邮箱格式错误" / "邮箱已注册" |
| 密码 | 长度 ≥8，包含大小写+数字 | "密码强度不足" |
| 确认密码 | 与密码一致 | "两次密码不一致" |
| 服务条款 | 必须勾选 | "请同意服务条款" |

**交互流程**:

1. 用户填写表单 → 实时验证 (Blur 事件)
2. 点击 [注册] → 禁用按钮，显示 Loading
3. **API 调用**: `POST /api/auth/register`
   - 成功: 显示提示 "注册成功，正在跳转..."
   - 自动登录 → 跳转到 `/dashboard/translate`
   - 失败: 显示错误提示（例如 "邮箱已存在"）

**状态管理**:

```typescript
// 表单状态
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [confirmPassword, setConfirmPassword] = useState('')
const [agreed, setAgreed] = useState(false)
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

// 提交处理
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError(null)

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message)
    }

    // 成功处理
    const data = await res.json()
    localStorage.setItem('token', data.token)
    router.push('/dashboard/translate')
  } catch (err) {
    setError(err.message)
  } finally {
    setIsLoading(false)
  }
}
```

---

#### 4.3.3 登录页 `/login`

**页面布局**: 与注册页类似

```
[登录表单]
  - 邮箱输入框
  - 密码输入框
  - [记住我] (Checkbox)
  - [忘记密码?] (链接 → /reset-password)
  - [登录] 按钮
  - [使用 Google 登录] (v1.1)
  - [使用 GitHub 登录] (v1.1)

[没有账号?] [注册] (链接)
```

**交互流程**:

1. 用户输入邮箱密码 → 点击 [登录]
2. **API 调用**: `POST /api/auth/login`
   - 请求体: `{ email, password }`
   - 成功响应: `{ token, user: { id, email, subscription } }`
   - 失败响应: `{ error: "邮箱或密码错误" }`
3. 成功: 保存 Token → 跳转到 `/dashboard/translate`
4. 失败: 显示错误提示

**错误处理**:

| 错误类型 | HTTP 状态码 | 提示信息 |
|----------|-------------|----------|
| 邮箱不存在 | 401 | "该邮箱未注册" |
| 密码错误 | 401 | "密码错误" |
| 账号被封禁 | 403 | "账号已被封禁，请联系客服" |
| 服务器错误 | 500 | "登录失败，请稍后重试" |

---

#### 4.3.4 翻译页面 `/dashboard/translate`

**目标**: 核心功能页面，用户上传文件并翻译

**页面布局**:

```
[Header - 固定顶部]
  ← 返回 | 文档翻译 | [词库] [历史] [设置]

[Tabs - 三个标签页]
  ☐ 文档翻译
  ☐ 对话翻译
  ☐ 翻译历史

[Tab 1: 文档翻译]
  [Left - 2/3 宽度]
    [上传文件区 Card]
      - 拖拽区域 (虚线边框)
      - 上传图标 + 提示文字
      - 隐藏的 <input type="file" multiple />
      - 已选文件列表 (文件名、大小、删除按钮)

    [进度条 Card] (上传后显示)
      - 文件名
      - 进度条 (0-100%)
      - 状态: 上传中/翻译中/已完成/失败
      - [重试] 按钮 (失败时显示)
      - [下载] 按钮 (完成时显示)

  [Right - 1/3 宽度]
    [翻译设置 Card]
      - 目标语言选择
        - 快速选择: 英/日/韩/法 (4 个按钮)
        - [查看所有语言...] (展开 Dropdown)
      - AI 模型选择
        - Dropdown: GPT-4o / Claude 3.5 / GPT-4o Mini
      - 词库选择 (可选)
        - Dropdown: 无词库 / 技术术语库 / 法律术语库

    [操作 Card]
      - [开始翻译] 按钮 (Primary, 大)
      - [重新开始] 按钮 (文件已上传后显示)
      - 配额显示: "本月剩余: 85/100 页"

    [模型对比 Card]
      - 表格: 模型名称、速度、质量、价格

[Tab 2: 对话翻译] (v1.1)
  - 聊天界面
  - 输入框 + [翻译] 按钮
  - 流式输出

[Tab 3: 翻译历史]
  - 历史记录列表 (复用 /history 页面)
```

**交互流程（文档翻译）**:

**1. 文件上传**

```typescript
// 文件选择
const handleFileSelect = (files: File[]) => {
  // 验证文件类型
  const allowedTypes = ['.pptx', '.docx', '.xlsx', '.pdf']
  const validFiles = files.filter(f => {
    const ext = '.' + f.name.split('.').pop()
    return allowedTypes.includes(ext)
  })

  if (validFiles.length === 0) {
    toast.error('不支持的文件格式')
    return
  }

  // 验证文件大小 (100MB)
  const tooBig = validFiles.filter(f => f.size > 100 * 1024 * 1024)
  if (tooBig.length > 0) {
    toast.error('文件过大，请上传小于 100MB 的文件')
    return
  }

  setSelectedFiles(validFiles)
}

// 拖拽上传
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const files = Array.from(e.dataTransfer.files)
  handleFileSelect(files)
}
```

**2. 开始翻译**

```typescript
const handleTranslate = async () => {
  if (selectedFiles.length === 0) {
    toast.error('请先选择文件')
    return
  }

  // 检查配额
  if (remainingQuota < estimatedPages) {
    toast.error('配额不足，请升级订阅')
    return
  }

  setStatus('uploading')

  // Step 1: 上传文件
  const formData = new FormData()
  selectedFiles.forEach(file => {
    formData.append('files', file)
  })
  formData.append('targetLanguage', targetLanguage)
  formData.append('model', model)
  formData.append('glossaryId', glossaryId || '')

  try {
    const res = await fetch('/api/translate/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!res.ok) throw new Error('上传失败')

    const { taskId } = await res.json()

    // Step 2: 轮询任务状态
    setStatus('processing')
    pollTaskStatus(taskId)

  } catch (err) {
    setStatus('failed')
    toast.error(err.message)
  }
}

// 轮询任务状态
const pollTaskStatus = async (taskId: string) => {
  const interval = setInterval(async () => {
    try {
      const res = await fetch(`/api/translate/status/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await res.json()

      // 更新进度
      setProgress(data.progress)

      if (data.status === 'completed') {
        clearInterval(interval)
        setStatus('completed')
        setOutputUrl(data.outputUrl)
        toast.success('翻译完成！')
      } else if (data.status === 'failed') {
        clearInterval(interval)
        setStatus('failed')
        toast.error(data.error)
      }
    } catch (err) {
      clearInterval(interval)
      setStatus('failed')
    }
  }, 2000) // 每 2 秒轮询一次
}
```

**3. 下载译文**

```typescript
const handleDownload = async () => {
  const a = document.createElement('a')
  a.href = outputUrl
  a.download = 'translated_' + selectedFiles[0].name
  a.click()
}
```

**状态图**:

```
[idle] → 用户选择文件 → [ready]
[ready] → 用户点击翻译 → [uploading] → API: POST /upload
[uploading] → 上传成功 → [processing] → 轮询: GET /status/{taskId}
[processing] → 翻译完成 → [completed]
[processing] → 翻译失败 → [failed] → 用户点击重试 → [uploading]
[completed] → 用户点击下载 → 下载文件
```

---

#### 4.3.5 历史记录页 `/dashboard/history`

**目标**: 查看所有翻译历史，下载译文

**页面布局**:

```
[Header]
  翻译历史 | [导出 CSV] 按钮

[Filter Bar]
  - 搜索框: "搜索文件名..."
  - 文件类型筛选: [全部] [PPT] [Word] [Excel] [PDF]
  - 状态筛选: [全部] [已完成] [失败]
  - 日期范围选择器

[History Table]
  | 文件名 | 文件类型 | 翻译方向 | 状态 | 创建时间 | 操作 |
  | ---   | ---     | ---     | --- | ---     | --- |
  | report.pptx | PPT | 中→英 | ✅ 已完成 | 2026-02-09 10:30 | [下载] [重译] [删除] |
  | contract.docx | Word | 英→中 | ❌ 失败 | 2026-02-08 15:20 | [查看错误] [重译] [删除] |

[Pagination]
  ← 上一页 | 1 2 3 ... 10 | 下一页 →
```

**API 调用**:

```typescript
// 获取历史记录列表
GET /api/translate/history
Query: ?page=1&limit=20&fileType=pptx&status=completed&search=report

Response: {
  total: 156,
  page: 1,
  limit: 20,
  items: [
    {
      id: "uuid",
      fileName: "report.pptx",
      fileType: "pptx",
      sourceLanguage: "zh",
      targetLanguage: "en",
      status: "completed",
      progress: 100,
      outputUrl: "https://cdn.example.com/output/xxx.pptx",
      createdAt: "2026-02-09T10:30:00Z",
      completedAt: "2026-02-09T10:35:00Z"
    }
  ]
}
```

**交互**:

- 点击 [下载] → 直接下载文件
- 点击 [重译] → 弹出确认对话框 → API: `POST /api/translate/retry/{id}`
- 点击 [删除] → 弹出确认对话框 → API: `DELETE /api/translate/history/{id}`
- 点击 [查看错误] → 弹出 Modal 显示错误详情

---

#### 4.3.6 词库管理页 `/dashboard/glossary`

**目标**: 管理专业术语库，确保翻译一致性

**页面布局**:

```
[Header]
  词库管理 | [导入] [导出] [新建词库]

[Layout: 2 列]
  [Left - 词库列表 (1/4 宽度)]
    我的词库 (2)

    [Card: 技术术语库]
      - 标题 + 描述
      - 156 个术语
      - 语言: EN
      - 选中状态高亮

    [Card: 法律术语库]
      - 89 个术语

  [Right - 术语列表 (3/4 宽度)]
    [Header]
      技术术语库 | [添加术语] 按钮

    [Search Bar]
      🔍 搜索术语...

    [Terms Table]
      | 源语言 | 目标语言 | 分类 | 操作 |
      | ---   | ---     | --- | --- |
      | 人工智能 | Artificial Intelligence | 技术 | [编辑] [删除] |
      | 机器学习 | Machine Learning | 技术 | [编辑] [删除] |

    [Stats]
      - 总术语数: 156
      - 分类数量: 8
      - 使用率: 100%
```

**交互流程**:

**1. 新建词库**

```typescript
// 点击 [新建词库] → 弹出 Modal
<Dialog>
  <DialogContent>
    <DialogTitle>创建新词库</DialogTitle>
    <form>
      <Input label="词库名称" placeholder="例如：技术术语库" />
      <Textarea label="描述" placeholder="简要描述此词库的用途" />
      <Select label="目标语言">
        <option>English</option>
        <option>日本語</option>
      </Select>
      <DialogFooter>
        <Button variant="outline">取消</Button>
        <Button type="submit">创建</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

// API 调用
POST /api/glossary
Body: {
  name: "技术术语库",
  description: "常用技术术语中英对照",
  targetLanguage: "en"
}

Response: {
  id: "uuid",
  name: "技术术语库",
  termCount: 0,
  createdAt: "2026-02-09T10:00:00Z"
}
```

**2. 添加术语**

```typescript
// 点击 [添加术语] → 弹出 Modal
<Dialog>
  <DialogTitle>添加新术语</DialogTitle>
  <form>
    <Input label="源语言术语" placeholder="例如：人工智能" />
    <Input label="目标语言术语" placeholder="例如：Artificial Intelligence" />
    <Input label="上下文/注释（可选）" placeholder="例如：计算机科学领域" />
    <Input label="分类（可选）" placeholder="例如：技术" />
    <DialogFooter>
      <Button variant="outline">取消</Button>
      <Button type="submit">添加</Button>
    </DialogFooter>
  </form>
</Dialog>

// API 调用
POST /api/glossary/{glossaryId}/terms
Body: {
  source: "人工智能",
  target: "Artificial Intelligence",
  context: "计算机科学领域",
  category: "技术"
}
```

**3. 导入术语**

```typescript
// 点击 [导入] → 文件选择器
<input type="file" accept=".csv,.xlsx" onChange={handleImport} />

// CSV 格式
source,target,context,category
人工智能,Artificial Intelligence,计算机科学,技术
机器学习,Machine Learning,,技术

// API 调用
POST /api/glossary/{glossaryId}/import
Body: FormData { file: File }

Response: {
  success: true,
  imported: 150,
  failed: 2,
  errors: [
    { row: 5, message: "源术语为空" }
  ]
}
```

**4. 导出术语**

```typescript
// 点击 [导出] → 下载 CSV 文件
GET /api/glossary/{glossaryId}/export?format=csv

Response: CSV 文件流
```

---

#### 4.3.7 设置页 `/dashboard/settings`

**页面布局**:

```
[Sidebar - 左侧导航]
  ☐ 个人信息
  ☐ 订阅管理
  ☐ API 密钥 (v1.1)
  ☐ 通知设置 (v1.2)
  ☐ 团队管理 (v2.0)

[Content - 右侧内容区]
  根据导航显示不同内容
```

**子页面 1: 个人信息 `/settings/profile`**

```
[Card: 个人信息]
  - 头像上传
  - 用户名输入框
  - 邮箱输入框 (只读)
  - [保存] 按钮

[Card: 修改密码]
  - 当前密码
  - 新密码
  - 确认新密码
  - [修改密码] 按钮

[Card: 账号操作]
  - [导出数据] 按钮
  - [删除账号] 按钮 (危险操作，红色)
```

**API 调用**:

```typescript
// 更新个人信息
PUT /api/user/profile
Body: {
  name: "张三",
  avatar: "https://cdn.example.com/avatar.jpg"
}

// 修改密码
PUT /api/user/password
Body: {
  currentPassword: "old123",
  newPassword: "new456"
}

// 删除账号
DELETE /api/user/account
Headers: { Authorization: Bearer token }
Response: { success: true }
```

**子页面 2: 订阅管理 `/settings/subscription`**

```
[Card: 当前套餐]
  - 套餐名称: 专业版
  - 价格: ¥99/月
  - 到期时间: 2026-03-09
  - [续费] [升级] [取消订阅]

[Card: 使用情况]
  - 本月翻译页数: 45 / 无限
  - API 调用次数: 1,250 / 10,000
  - 词库数量: 2 / 无限
  - 进度条

[Card: 付款历史]
  | 日期 | 套餐 | 金额 | 状态 | 发票 |
  | --- | --- | --- | --- | --- |
  | 2026-02-09 | 专业版 | ¥99 | ✅ 已支付 | [下载] |

[Card: 支付方式]
  - 信用卡: **** **** **** 1234
  - [更换支付方式]
```

**API 调用**:

```typescript
// 获取订阅信息
GET /api/subscription

Response: {
  plan: "pro",
  price: 99,
  currency: "CNY",
  billingCycle: "monthly",
  currentPeriodEnd: "2026-03-09T00:00:00Z",
  status: "active",
  usage: {
    translationPages: 45,
    apiCalls: 1250,
    glossaries: 2
  }
}

// 取消订阅
POST /api/subscription/cancel
Response: { success: true, message: "将在 2026-03-09 失效" }

// 续费
POST /api/subscription/renew
Response: { checkoutUrl: "https://stripe.com/checkout/xxx" }
```

---

#### 4.3.8 定价页 `/pricing`

**页面结构**: 已在前面的代码中实现

**核心交互**:

1. 月付/年付切换 → 价格自动更新 (年付打 8 折)
2. 点击 [免费开始] → 跳转到 `/signup`
3. 点击 [立即订阅] → 跳转到 `/checkout?plan=pro`
4. 点击 [联系我们] → 跳转到 `/contact` 表单

---

### 4.4 组件复用

#### 通用组件

| 组件名 | 文件路径 | 用途 |
|--------|----------|------|
| Button | `components/ui/button.tsx` | 按钮 |
| Card | `components/ui/card.tsx` | 卡片容器 |
| Input | `components/ui/input.tsx` | 输入框 |
| Select | `components/ui/select.tsx` | 下拉选择 |
| Dialog | `components/ui/dialog.tsx` | 对话框/Modal |
| Tabs | `components/ui/tabs.tsx` | 标签页 |
| Table | `components/ui/table.tsx` | 表格 |
| Badge | `components/ui/badge.tsx` | 标签/徽章 |
| Toast | `components/ui/toast.tsx` | 提示消息 |

#### 业务组件

| 组件名 | 文件路径 | 用途 |
|--------|----------|------|
| FileUploader | `components/translate/file-uploader.tsx` | 文件上传 |
| LanguageSelector | `components/translate/language-selector.tsx` | 语言选择 |
| ModelSelector | `components/translate/model-selector.tsx` | 模型选择 |
| ProgressBar | `components/translate/progress-bar.tsx` | 翻译进度条 |
| TranslationHistory | `components/history/translation-history.tsx` | 历史记录列表 |
| GlossaryTable | `components/glossary/glossary-table.tsx` | 词库术语表 |

---

## 5. 后端详细设计

### 5.1 技术栈

- **框架**: FastAPI 0.115.0
- **语言**: Python 3.10.x
- **数据库**: PostgreSQL 15 (生产) / SQLite (开发)
- **ORM**: SQLAlchemy 2.0
- **认证**: JWT (PyJWT)
- **文件存储**: 本地存储 (MVP) / S3 (v1.1)
- **任务队列**: 内置 TranslationEngine (MVP) / Celery + Redis (v1.1)
- **LLM**: LangChain + OpenAI/Anthropic/Moonshot/SiliconFlow

### 5.2 项目结构

```
app/
├── api/                    # API 路由
│   ├── auth.py             # 认证 API
│   ├── translate.py        # 翻译 API
│   ├── glossary.py         # 词库 API
│   ├── subscription.py     # 订阅 API
│   └── admin.py            # 管理 API (v2.0)
├── core/                   # 核心引擎
│   ├── engine.py           # TranslationEngine
│   ├── queue.py            # TaskQueue
│   ├── scheduler.py        # TaskScheduler
│   └── state_machine.py    # TaskStateMachine
├── models/                 # 数据库模型
│   ├── user.py             # User 模型
│   ├── task.py             # TranslationTask 模型
│   ├── glossary.py         # Glossary, Term 模型
│   └── subscription.py     # Subscription 模型
├── schemas/                # Pydantic 模型
│   ├── auth.py             # 认证相关
│   ├── translate.py        # 翻译相关
│   └── glossary.py         # 词库相关
├── services/               # 业务逻辑层
│   ├── auth_service.py     # 认证服务
│   ├── translate_service.py # 翻译服务
│   ├── glossary_service.py # 词库服务
│   └── office/             # 文档处理
│       ├── pptx_service.py
│       ├── docx_service.py
│       ├── xlsx_service.py
│       └── pdf_service.py
├── utils/                  # 工具函数
│   ├── jwt.py              # JWT 工具
│   ├── file.py             # 文件处理工具
│   └── config.py           # 配置管理
├── db/                     # 数据库
│   ├── session.py          # 数据库会话
│   └── migrations/         # Alembic 迁移
└── main.py                 # 应用入口
```

---

## 6. 数据库设计

### 6.1 ER 图

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   User       │──1:N──│  TranslationTask │──N:1──│  Glossary    │
│              │       │                  │       │              │
│ id           │       │ id               │       │ id           │
│ email        │       │ user_id (FK)     │       │ user_id (FK) │
│ password_hash│       │ file_path        │       │ name         │
│ name         │       │ file_type        │       │ description  │
│ avatar       │       │ source_lang      │       │ language     │
│ created_at   │       │ target_lang      │       │ created_at   │
└──────────────┘       │ model            │       └──────────────┘
       │               │ glossary_id (FK) │              │
       │               │ status           │              │
       │               │ progress         │              │
       │               │ output_path      │              │
       │               │ error_message    │              │
       │               │ created_at       │              │
       │               └──────────────────┘              │
       │                                                 │
       │                                                 │
       │                                                 │
       │                                                 │
       │               ┌──────────────────┐              │
       └───1:1────────│  Subscription    │              │
                      │                  │              │
                      │ id               │              │
                      │ user_id (FK)     │              │
                      │ plan             │       ┌──────────────┐
                      │ status           │       │   Term       │
                      │ current_period_end│      │              │
                      │ stripe_customer_id│──────┤ id           │
                      │ created_at       │   N:1│ glossary_id  │
                      └──────────────────┘       │ source       │
                                                 │ target       │
                                                 │ context      │
                                                 │ category     │
                                                 └──────────────┘
```

---

### 6.2 表结构详细设计

#### 表 1: `users` (用户表)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 用户 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | 密码哈希 (bcrypt) |
| name | VARCHAR(100) | | 用户名 |
| avatar | TEXT | | 头像 URL |
| is_active | BOOLEAN | DEFAULT TRUE | 账号是否激活 |
| is_verified | BOOLEAN | DEFAULT FALSE | 邮箱是否验证 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**:
- `idx_users_email` on `email`

**SQL (PostgreSQL)**:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  avatar TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

---

#### 表 2: `subscriptions` (订阅表)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 订阅 ID |
| user_id | UUID | FK(users), UNIQUE | 用户 ID |
| plan | VARCHAR(20) | NOT NULL | 套餐: free/pro/enterprise |
| status | VARCHAR(20) | NOT NULL | 状态: active/canceled/expired |
| billing_cycle | VARCHAR(20) | | monthly/yearly |
| current_period_start | TIMESTAMP | | 当前周期开始时间 |
| current_period_end | TIMESTAMP | | 当前周期结束时间 |
| stripe_customer_id | VARCHAR(100) | | Stripe 客户 ID |
| stripe_subscription_id | VARCHAR(100) | | Stripe 订阅 ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**:
- `idx_subscriptions_user_id` on `user_id`
- `idx_subscriptions_stripe_customer_id` on `stripe_customer_id`

**SQL**:

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'expired')),
  billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
```

---

#### 表 3: `translation_tasks` (翻译任务表)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 任务 ID |
| user_id | UUID | FK(users), NOT NULL | 用户 ID |
| file_name | VARCHAR(255) | NOT NULL | 原文件名 |
| file_type | VARCHAR(10) | NOT NULL | 文件类型: pptx/docx/xlsx/pdf |
| file_path | TEXT | NOT NULL | 上传文件路径 |
| source_language | VARCHAR(10) | | 源语言代码 (auto-detect) |
| target_language | VARCHAR(10) | NOT NULL | 目标语言代码 |
| model | VARCHAR(50) | NOT NULL | LLM 模型 |
| glossary_id | UUID | FK(glossaries) | 使用的词库 ID |
| status | VARCHAR(20) | NOT NULL | pending/queued/processing/completed/failed/canceled |
| priority | INTEGER | DEFAULT 5 | 优先级 1-10 |
| progress | FLOAT | DEFAULT 0 | 进度 0-100 |
| output_path | TEXT | | 输出文件路径 |
| error_type | VARCHAR(50) | | 错误类型 |
| error_message | TEXT | | 错误信息 |
| retry_count | INTEGER | DEFAULT 0 | 重试次数 |
| pages_count | INTEGER | | 页数/单元格数 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| started_at | TIMESTAMP | | 开始处理时间 |
| completed_at | TIMESTAMP | | 完成时间 |

**索引**:
- `idx_tasks_user_id` on `user_id`
- `idx_tasks_status` on `status`
- `idx_tasks_created_at` on `created_at DESC`

**SQL**:

```sql
CREATE TABLE translation_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(10) NOT NULL CHECK (file_type IN ('pptx', 'docx', 'xlsx', 'pdf')),
  file_path TEXT NOT NULL,
  source_language VARCHAR(10),
  target_language VARCHAR(10) NOT NULL,
  model VARCHAR(50) NOT NULL,
  glossary_id UUID REFERENCES glossaries(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'queued', 'processing', 'completed', 'failed', 'canceled')),
  priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  progress FLOAT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  output_path TEXT,
  error_type VARCHAR(50),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  pages_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON translation_tasks(user_id);
CREATE INDEX idx_tasks_status ON translation_tasks(status);
CREATE INDEX idx_tasks_created_at ON translation_tasks(created_at DESC);
```

---

#### 表 4: `glossaries` (词库表)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 词库 ID |
| user_id | UUID | FK(users), NOT NULL | 用户 ID |
| name | VARCHAR(100) | NOT NULL | 词库名称 |
| description | TEXT | | 描述 |
| target_language | VARCHAR(10) | NOT NULL | 目标语言 |
| term_count | INTEGER | DEFAULT 0 | 术语数量 |
| is_shared | BOOLEAN | DEFAULT FALSE | 是否团队共享 (v2.0) |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**:
- `idx_glossaries_user_id` on `user_id`

**SQL**:

```sql
CREATE TABLE glossaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  target_language VARCHAR(10) NOT NULL,
  term_count INTEGER DEFAULT 0,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_glossaries_user_id ON glossaries(user_id);
```

---

#### 表 5: `terms` (术语表)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 术语 ID |
| glossary_id | UUID | FK(glossaries), NOT NULL | 词库 ID |
| source | VARCHAR(255) | NOT NULL | 源语言术语 |
| target | VARCHAR(255) | NOT NULL | 目标语言术语 |
| context | TEXT | | 上下文/注释 |
| category | VARCHAR(50) | | 分类 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**索引**:
- `idx_terms_glossary_id` on `glossary_id`
- `idx_terms_source` on `source` (用于快速查找)

**SQL**:

```sql
CREATE TABLE terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  glossary_id UUID NOT NULL REFERENCES glossaries(id) ON DELETE CASCADE,
  source VARCHAR(255) NOT NULL,
  target VARCHAR(255) NOT NULL,
  context TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_terms_glossary_id ON terms(glossary_id);
CREATE INDEX idx_terms_source ON terms(source);
```

---

### 6.3 数据库操作示例

#### 创建用户

```python
from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.auth import hash_password

def create_user(db: Session, email: str, password: str) -> User:
    password_hash = hash_password(password)
    user = User(
        email=email,
        password_hash=password_hash,
        is_active=True,
        is_verified=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
```

#### 创建翻译任务

```python
from app.models.task import TranslationTask

def create_translation_task(
    db: Session,
    user_id: str,
    file_name: str,
    file_type: str,
    file_path: str,
    target_language: str,
    model: str,
    glossary_id: str | None = None
) -> TranslationTask:
    task = TranslationTask(
        user_id=user_id,
        file_name=file_name,
        file_type=file_type,
        file_path=file_path,
        target_language=target_language,
        model=model,
        glossary_id=glossary_id,
        status='pending',
        priority=5
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task
```

#### 更新任务状态

```python
def update_task_status(
    db: Session,
    task_id: str,
    status: str,
    progress: float = None,
    error_message: str = None
):
    task = db.query(TranslationTask).filter(TranslationTask.id == task_id).first()
    if not task:
        raise ValueError("Task not found")

    task.status = status
    if progress is not None:
        task.progress = progress
    if error_message:
        task.error_message = error_message

    if status == 'processing' and not task.started_at:
        task.started_at = datetime.utcnow()
    elif status in ['completed', 'failed', 'canceled']:
        task.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(task)
    return task
```

---

## 7. API 接口规范

### 7.1 API 设计原则

- **RESTful 风格**: 使用标准 HTTP 方法 (GET/POST/PUT/DELETE)
- **版本控制**: `/api/v1/...` (v1.1 可能引入 v2)
- **认证**: JWT Bearer Token
- **响应格式**: JSON
- **错误码**: 标准 HTTP 状态码 + 自定义错误码

### 7.2 通用响应格式

**成功响应**:

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

**错误响应**:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "邮箱格式错误",
    "details": { "field": "email" }
  }
}
```

### 7.3 错误码定义

| 错误码 | HTTP 状态码 | 说明 |
|--------|-------------|------|
| UNAUTHORIZED | 401 | 未认证或 Token 过期 |
| FORBIDDEN | 403 | 无权限 |
| NOT_FOUND | 404 | 资源不存在 |
| INVALID_INPUT | 400 | 输入参数错误 |
| QUOTA_EXCEEDED | 429 | 配额不足 |
| INTERNAL_ERROR | 500 | 服务器错误 |

---

### 7.4 认证 API

#### 1. 注册

```http
POST /api/auth/register
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "Password123"
}

Response (201):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}

Error (400):
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "该邮箱已注册"
  }
}
```

**后端实现**:

```python
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.auth import RegisterRequest, AuthResponse
from app.services.auth_service import create_user, generate_jwt
from app.db.session import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=AuthResponse)
async def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    # 检查邮箱是否已存在
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="EMAIL_EXISTS")

    # 创建用户
    user = create_user(db, request.email, request.password)

    # 生成 JWT Token
    token = generate_jwt(user.id, user.email)

    return AuthResponse(
        user=UserSchema.from_orm(user),
        token=token,
        expiresIn=86400
    )
```

---

#### 2. 登录

```http
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "Password123"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "subscription": {
        "plan": "pro",
        "status": "active"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}

Error (401):
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "邮箱或密码错误"
  }
}
```

**后端实现**:

```python
@router.post("/login", response_model=AuthResponse)
async def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    # 查找用户
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="INVALID_CREDENTIALS")

    # 验证密码
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="INVALID_CREDENTIALS")

    # 检查账号状态
    if not user.is_active:
        raise HTTPException(status_code=403, detail="ACCOUNT_DISABLED")

    # 生成 Token
    token = generate_jwt(user.id, user.email)

    # 获取订阅信息
    subscription = db.query(Subscription).filter(Subscription.user_id == user.id).first()

    return AuthResponse(
        user=UserSchema.from_orm(user),
        subscription=SubscriptionSchema.from_orm(subscription),
        token=token,
        expiresIn=86400
    )
```

---

#### 3. 获取当前用户

```http
GET /api/auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "张三",
    "avatar": "https://cdn.example.com/avatar.jpg",
    "subscription": {
      "plan": "pro",
      "status": "active",
      "currentPeriodEnd": "2026-03-09T00:00:00Z"
    }
  }
}

Error (401):
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token 已过期"
  }
}
```

---

### 7.5 翻译 API

#### 1. 上传文件并创建任务

```http
POST /api/translate/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
  files: File[]
  targetLanguage: "en"
  model: "gpt-4o"
  glossaryId: "uuid" (optional)

Response (201):
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task-uuid-1",
        "fileName": "report.pptx",
        "status": "pending",
        "estimatedPages": 50
      }
    ],
    "quotaUsed": 50,
    "quotaRemaining": 50
  }
}

Error (429):
{
  "success": false,
  "error": {
    "code": "QUOTA_EXCEEDED",
    "message": "配额不足，剩余 10 页"
  }
}
```

**后端实现**:

```python
from fastapi import UploadFile, File
from app.core.engine import TranslationEngine

@router.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    targetLanguage: str = Form(...),
    model: str = Form(...),
    glossaryId: str = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    engine: TranslationEngine = Depends(get_engine)
):
    # 1. 验证文件类型和大小
    allowed_types = ['pptx', 'docx', 'xlsx', 'pdf']
    for file in files:
        ext = file.filename.split('.')[-1]
        if ext not in allowed_types:
            raise HTTPException(400, detail="不支持的文件格式")

        # 读取文件大小
        content = await file.read()
        if len(content) > 100 * 1024 * 1024:  # 100MB
            raise HTTPException(400, detail="文件过大")
        await file.seek(0)

    # 2. 检查配额
    subscription = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    if subscription.plan == 'free':
        # 检查本月使用量
        usage = get_monthly_usage(db, current_user.id)
        if usage >= 10:
            raise HTTPException(429, detail="QUOTA_EXCEEDED")

    # 3. 保存文件
    tasks = []
    for file in files:
        # 保存文件到本地
        file_path = save_uploaded_file(file, current_user.id)

        # 创建任务
        task = create_translation_task(
            db=db,
            user_id=current_user.id,
            file_name=file.filename,
            file_type=ext,
            file_path=file_path,
            target_language=targetLanguage,
            model=model,
            glossary_id=glossaryId
        )

        # 添加到引擎队列
        await engine.create_task(task)

        tasks.append(task)

    return {"tasks": tasks}
```

---

#### 2. 查询任务状态

```http
GET /api/translate/status/{taskId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "fileName": "report.pptx",
    "status": "processing",
    "progress": 65.5,
    "outputUrl": null,
    "createdAt": "2026-02-09T10:30:00Z",
    "startedAt": "2026-02-09T10:31:00Z",
    "estimatedTimeRemaining": 120
  }
}
```

**后端实现**:

```python
@router.get("/status/{task_id}")
async def get_task_status(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(TranslationTask).filter(
        TranslationTask.id == task_id,
        TranslationTask.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(404, detail="任务不存在")

    # 计算预估剩余时间
    estimated_time = None
    if task.status == 'processing' and task.progress > 0:
        elapsed = (datetime.utcnow() - task.started_at).total_seconds()
        estimated_time = int(elapsed / task.progress * (100 - task.progress))

    return {
        "id": task.id,
        "fileName": task.file_name,
        "status": task.status,
        "progress": task.progress,
        "outputUrl": task.output_path,
        "createdAt": task.created_at,
        "startedAt": task.started_at,
        "estimatedTimeRemaining": estimated_time
    }
```

---

#### 3. 下载译文

```http
GET /api/translate/download/{taskId}
Authorization: Bearer {token}

Response (200):
  Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation
  Content-Disposition: attachment; filename="translated_report.pptx"
  [Binary File Stream]

Error (404):
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "任务不存在或翻译未完成"
  }
}
```

**后端实现**:

```python
from fastapi.responses import FileResponse

@router.get("/download/{task_id}")
async def download_file(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(TranslationTask).filter(
        TranslationTask.id == task_id,
        TranslationTask.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(404, detail="任务不存在")

    if task.status != 'completed':
        raise HTTPException(400, detail="翻译未完成")

    if not os.path.exists(task.output_path):
        raise HTTPException(404, detail="文件不存在")

    # 返回文件
    return FileResponse(
        path=task.output_path,
        filename=f"translated_{task.file_name}",
        media_type=get_media_type(task.file_type)
    )
```

---

#### 4. 获取翻译历史

```http
GET /api/translate/history
Authorization: Bearer {token}
Query Params:
  page: 1
  limit: 20
  fileType: "pptx" (optional)
  status: "completed" (optional)
  search: "report" (optional)

Response (200):
{
  "success": true,
  "data": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "items": [
      {
        "id": "uuid",
        "fileName": "report.pptx",
        "fileType": "pptx",
        "sourceLanguage": "zh",
        "targetLanguage": "en",
        "status": "completed",
        "progress": 100,
        "outputUrl": "https://cdn.example.com/output/xxx.pptx",
        "createdAt": "2026-02-09T10:30:00Z",
        "completedAt": "2026-02-09T10:35:00Z"
      }
    ]
  }
}
```

**后端实现**:

```python
@router.get("/history")
async def get_history(
    page: int = 1,
    limit: int = 20,
    fileType: str = None,
    status: str = None,
    search: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(TranslationTask).filter(TranslationTask.user_id == current_user.id)

    # 应用过滤条件
    if fileType:
        query = query.filter(TranslationTask.file_type == fileType)
    if status:
        query = query.filter(TranslationTask.status == status)
    if search:
        query = query.filter(TranslationTask.file_name.ilike(f'%{search}%'))

    # 分页
    total = query.count()
    items = query.order_by(TranslationTask.created_at.desc()) \
                 .offset((page - 1) * limit) \
                 .limit(limit) \
                 .all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": [TaskSchema.from_orm(item) for item in items]
    }
```

---

### 7.6 词库 API

#### 1. 创建词库

```http
POST /api/glossary
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "技术术语库",
  "description": "常用技术术语中英对照",
  "targetLanguage": "en"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "技术术语库",
    "description": "常用技术术语中英对照",
    "targetLanguage": "en",
    "termCount": 0,
    "createdAt": "2026-02-09T10:00:00Z"
  }
}
```

---

#### 2. 获取词库列表

```http
GET /api/glossary
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "name": "技术术语库",
      "description": "常用技术术语中英对照",
      "targetLanguage": "en",
      "termCount": 156,
      "createdAt": "2026-01-15T00:00:00Z",
      "updatedAt": "2026-02-01T00:00:00Z"
    },
    {
      "id": "uuid-2",
      "name": "法律术语库",
      "description": "法律文档专用术语",
      "targetLanguage": "en",
      "termCount": 89,
      "createdAt": "2026-01-20T00:00:00Z",
      "updatedAt": "2026-01-28T00:00:00Z"
    }
  ]
}
```

---

#### 3. 添加术语

```http
POST /api/glossary/{glossaryId}/terms
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "source": "人工智能",
  "target": "Artificial Intelligence",
  "context": "计算机科学领域",
  "category": "技术"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "glossaryId": "glossary-uuid",
    "source": "人工智能",
    "target": "Artificial Intelligence",
    "context": "计算机科学领域",
    "category": "技术",
    "createdAt": "2026-02-09T10:00:00Z"
  }
}
```

---

#### 4. 获取术语列表

```http
GET /api/glossary/{glossaryId}/terms
Authorization: Bearer {token}
Query Params:
  search: "人工" (optional)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "source": "人工智能",
      "target": "Artificial Intelligence",
      "category": "技术",
      "createdAt": "2026-01-15T00:00:00Z"
    },
    {
      "id": "uuid-2",
      "source": "机器学习",
      "target": "Machine Learning",
      "category": "技术",
      "createdAt": "2026-01-16T00:00:00Z"
    }
  ]
}
```

---

#### 5. 导入术语

```http
POST /api/glossary/{glossaryId}/import
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
  file: terms.csv

Response (200):
{
  "success": true,
  "data": {
    "imported": 150,
    "failed": 2,
    "errors": [
      {
        "row": 5,
        "message": "源术语为空"
      },
      {
        "row": 10,
        "message": "目标术语为空"
      }
    ]
  }
}
```

**CSV 格式**:

```csv
source,target,context,category
人工智能,Artificial Intelligence,计算机科学,技术
机器学习,Machine Learning,,技术
深度学习,Deep Learning,,技术
```

**后端实现**:

```python
import csv
from io import StringIO

@router.post("/{glossary_id}/import")
async def import_terms(
    glossary_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 验证词库所有权
    glossary = db.query(Glossary).filter(
        Glossary.id == glossary_id,
        Glossary.user_id == current_user.id
    ).first()

    if not glossary:
        raise HTTPException(404, detail="词库不存在")

    # 读取 CSV
    content = await file.read()
    csv_content = content.decode('utf-8')
    reader = csv.DictReader(StringIO(csv_content))

    imported = 0
    failed = 0
    errors = []

    for row_num, row in enumerate(reader, start=2):
        source = row.get('source', '').strip()
        target = row.get('target', '').strip()

        if not source or not target:
            failed += 1
            errors.append({
                "row": row_num,
                "message": "源术语或目标术语为空"
            })
            continue

        try:
            term = Term(
                glossary_id=glossary_id,
                source=source,
                target=target,
                context=row.get('context', ''),
                category=row.get('category', '')
            )
            db.add(term)
            imported += 1
        except Exception as e:
            failed += 1
            errors.append({
                "row": row_num,
                "message": str(e)
            })

    # 更新词库术语数量
    glossary.term_count = db.query(Term).filter(Term.glossary_id == glossary_id).count()

    db.commit()

    return {
        "imported": imported,
        "failed": failed,
        "errors": errors
    }
```

---

#### 6. 导出术语

```http
GET /api/glossary/{glossaryId}/export
Authorization: Bearer {token}
Query Params:
  format: "csv" (optional, default: csv)

Response (200):
  Content-Type: text/csv
  Content-Disposition: attachment; filename="glossary_tech.csv"

  source,target,context,category
  人工智能,Artificial Intelligence,计算机科学,技术
  机器学习,Machine Learning,,技术
```

**后端实现**:

```python
@router.get("/{glossary_id}/export")
async def export_terms(
    glossary_id: str,
    format: str = "csv",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    glossary = db.query(Glossary).filter(
        Glossary.id == glossary_id,
        Glossary.user_id == current_user.id
    ).first()

    if not glossary:
        raise HTTPException(404, detail="词库不存在")

    terms = db.query(Term).filter(Term.glossary_id == glossary_id).all()

    # 生成 CSV
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['source', 'target', 'context', 'category'])

    for term in terms:
        writer.writerow([term.source, term.target, term.context or '', term.category or ''])

    # 返回 CSV 文件
    csv_content = output.getvalue()

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=glossary_{glossary.name}.csv"
        }
    )
```

---

### 7.7 订阅 API

#### 1. 获取订阅信息

```http
GET /api/subscription
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "plan": "pro",
    "status": "active",
    "billingCycle": "monthly",
    "currentPeriodEnd": "2026-03-09T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "usage": {
      "translationPages": 45,
      "translationPagesLimit": null,
      "apiCalls": 1250,
      "apiCallsLimit": 10000,
      "glossaries": 2,
      "glossariesLimit": null
    }
  }
}
```

---

#### 2. 创建订阅（跳转到 Stripe Checkout）

```http
POST /api/subscription/checkout
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "plan": "pro",
  "billingCycle": "monthly"
}

Response (200):
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_xxx"
  }
}
```

**后端实现**:

```python
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

@router.post("/checkout")
async def create_checkout_session(
    request: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 获取价格 ID
    price_id = get_stripe_price_id(request.plan, request.billingCycle)

    # 创建 Stripe Checkout Session
    checkout_session = stripe.checkout.Session.create(
        customer_email=current_user.email,
        mode='subscription',
        payment_method_types=['card'],
        line_items=[{
            'price': price_id,
            'quantity': 1,
        }],
        success_url=f"{settings.FRONTEND_URL}/dashboard?payment=success",
        cancel_url=f"{settings.FRONTEND_URL}/pricing?payment=canceled",
        metadata={
            'user_id': current_user.id
        }
    )

    return {"checkoutUrl": checkout_session.url}
```

---

#### 3. Stripe Webhook 处理

```http
POST /api/subscription/webhook
Content-Type: application/json
Stripe-Signature: {signature}

Request: (Stripe Event JSON)

Response (200):
{
  "received": true
}
```

**后端实现**:

```python
@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(400, detail="Invalid signature")

    # 处理事件
    if event.type == 'checkout.session.completed':
        session = event.data.object
        user_id = session.metadata.user_id

        # 创建订阅记录
        subscription = Subscription(
            user_id=user_id,
            plan='pro',
            status='active',
            billing_cycle='monthly',
            stripe_customer_id=session.customer,
            stripe_subscription_id=session.subscription,
            current_period_start=datetime.utcnow(),
            current_period_end=datetime.utcnow() + timedelta(days=30)
        )
        db.add(subscription)
        db.commit()

    elif event.type == 'customer.subscription.updated':
        # 处理订阅更新
        pass

    elif event.type == 'customer.subscription.deleted':
        # 处理订阅取消
        pass

    return {"received": True}
```

---

## 8. 非功能性需求

### 8.1 性能要求

| 指标 | 目标 | 说明 |
|------|------|------|
| 文件上传速度 | < 5s (10MB) | 100MB 文件 < 30s |
| 翻译速度 | < 30s/页 (PPT) | GPT-4o 模型 |
| API 响应时间 | < 200ms (p95) | 非文件上传 API |
| 并发用户数 | 100 (MVP) | 1000 (v1.1) |
| 数据库查询 | < 100ms (p95) | 添加索引优化 |

### 8.2 可用性要求

| 指标 | 目标 | 说明 |
|------|------|------|
| 正常运行时间 | 99.5% (MVP) | 99.9% (企业版) |
| RTO (恢复时间) | < 4h | 灾难恢复 |
| RPO (数据丢失) | < 1h | 数据库备份 |
| 错误率 | < 0.5% | 翻译失败率 |

### 8.3 安全要求

| 要求 | 实现方式 |
|------|----------|
| 认证 | JWT Bearer Token (24h 有效期) |
| 密码存储 | bcrypt 哈希 (12 rounds) |
| HTTPS | 强制 HTTPS，禁用 HTTP |
| 文件上传 | MIME 类型验证 + 病毒扫描 (v1.1) |
| SQL 注入 | 使用 ORM (SQLAlchemy) |
| XSS | 前端输入转义 |
| CSRF | SameSite Cookie |
| 速率限制 | 登录: 5 次/分钟，API: 100 次/分钟 |
| 数据加密 | 数据库加密 (TDE, 企业版) |

### 8.4 可扩展性

| 阶段 | 架构 | 说明 |
|------|------|------|
| MVP | 单机部署 | FastAPI + PostgreSQL + 本地存储 |
| v1.1 | 水平扩展 | 负载均衡 + Redis + S3 |
| v1.2 | 微服务 | 拆分翻译引擎为独立服务 |
| v2.0 | Kubernetes | 容器化部署 + 自动伸缩 |

### 8.5 监控和日志

| 类型 | 工具 | 指标 |
|------|------|------|
| 应用监控 | Sentry (v1.1) | 错误追踪、性能监控 |
| 服务器监控 | Prometheus + Grafana (v1.2) | CPU/内存/磁盘 |
| 日志 | 结构化日志 (JSON) | 集中式日志管理 |
| 告警 | 邮件/钉钉/Slack (v1.1) | 错误率 > 1% 告警 |

---

## 9. MVP 范围

### 9.1 MVP 核心功能

**必须实现 (P0)**:

- ✅ 用户系统
  - 邮箱注册/登录
  - JWT 认证
  - 找回密码
- ✅ 翻译功能
  - PPT 翻译 (格式保留)
  - Word 翻译 (修复格式丢失 Bug)
  - 在线文本翻译
- ✅ 词库系统
  - 创建词库
  - 添加/编辑/删除术语
- ✅ 历史记录
  - 查看历史
  - 下载译文
- ✅ 配额管理
  - 订阅管理
  - Stripe 支付集成

**延后到 v1.1 (P1)**:

- Excel 翻译
- PDF 翻译 (保留排版)
- 批量翻译
- OAuth 登录
- 词库导入/导出
- API 接口

**延后到 v1.2 (P2)**:

- 版本对比
- 翻译质量评分
- Webhook 通知

**延后到 v2.0**:

- 团队协作
- 审核工作流
- 团队共享词库

---

### 9.2 MVP 技术栈确认

**前端**:
- Next.js 14 + TypeScript + Tailwind CSS ✅
- shadcn/ui 组件库 ✅

**后端**:
- FastAPI + SQLAlchemy + PostgreSQL ✅
- TranslationEngine (任务队列) ✅
- LangChain + OpenAI/Anthropic ✅

**部署**:
- 单机部署 (MVP)
- Docker 容器化 (v1.1)

---

## 10. 实施计划

### 10.1 开发阶段

#### Phase 1: 后端基础 (1 周)

**目标**: 搭建后端框架，实现核心 API

- [ ] Day 1-2: 数据库设计和迁移
  - 创建 users, subscriptions, translation_tasks, glossaries, terms 表
  - Alembic 迁移脚本
- [ ] Day 3-4: 认证 API
  - 注册/登录/找回密码
  - JWT 中间件
- [ ] Day 5-7: 翻译 API
  - 文件上传
  - 任务创建
  - 状态查询
  - TranslationEngine 集成

#### Phase 2: 翻译引擎 (1 周)

**目标**: 修复已知 Bug，优化翻译质量

- [ ] Day 1-2: 修复 Word 格式丢失 Bug
  - 取消注释 `restore_text_to_docx()` 函数
  - 按 Run 翻译避免字符对齐问题
- [ ] Day 3-4: 修复 PDF 切片 Bug
  - 修改 `pdf_service.py:27` 切片语法错误
- [ ] Day 5: PPT 翻译优化
  - 并行翻译（Semaphore 限制并发）
- [ ] Day 6-7: 测试和 Bug 修复

#### Phase 3: 前端开发 (2 周)

**目标**: 实现所有 MVP 页面

- [ ] Week 1: 核心页面
  - Landing Page
  - 注册/登录页
  - 翻译页面
  - 历史记录页
- [ ] Week 2: 次要页面
  - 词库管理页
  - 设置页
  - 定价页

#### Phase 4: 支付集成 (3 天)

**目标**: Stripe 支付集成

- [ ] Day 1: Stripe Checkout 集成
- [ ] Day 2: Webhook 处理
- [ ] Day 3: 订阅管理

#### Phase 5: 测试和优化 (1 周)

**目标**: 全面测试，修复 Bug

- [ ] Day 1-2: 单元测试
- [ ] Day 3-4: 集成测试
- [ ] Day 5: 性能优化
- [ ] Day 6-7: Bug 修复

#### Phase 6: 部署上线 (3 天)

**目标**: 部署到生产环境

- [ ] Day 1: 服务器配置
- [ ] Day 2: 部署和监控
- [ ] Day 3: 灰度发布和验证

---

### 10.2 时间线

| 阶段 | 时间 | 交付物 |
|------|------|--------|
| Phase 1 | Week 1 | 后端 API |
| Phase 2 | Week 2 | 翻译引擎 |
| Phase 3 | Week 3-4 | 前端页面 |
| Phase 4 | Week 5 (前 3 天) | 支付集成 |
| Phase 5 | Week 5-6 | 测试优化 |
| Phase 6 | Week 6 (后 3 天) | 部署上线 |

**总计: 6 周 (1.5 个月)**

---

### 10.3 风险和缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| LLM API 限流 | 高 | 实现重试机制 + 多提供商切换 |
| 格式保留失败 | 高 | 充分测试 + 用户反馈通道 |
| Stripe 集成问题 | 中 | 提前测试 Webhook + 沙盒环境 |
| 性能瓶颈 | 中 | 并发限制 + 队列管理 |
| 安全漏洞 | 高 | 代码审查 + 渗透测试 (v1.1) |

---

## 📋 总结

本 PRD 详细定义了 AI Office 文档翻译 SaaS 平台的产品需求，涵盖：

1. **产品概述**: 定位、价值主张、商业模式
2. **用户画像**: 4 类核心用户及其需求
3. **功能设计**: 细化到每个页面、每个交互、每个按钮
4. **前端设计**: 8 个页面的完整交互流程 + 状态管理
5. **后端设计**: API 接口、数据库设计、业务逻辑
6. **数据库设计**: 5 张核心表的完整结构
7. **API 规范**: 15+ 个 API 端点的详细定义
8. **非功能性需求**: 性能、安全、可扩展性
9. **MVP 范围**: 明确 P0/P1/P2 优先级
10. **实施计划**: 6 周开发计划 + 风险缓解

**下一步行动**:
1. 确认 MVP 范围和时间线
2. 开始 Phase 1 后端开发
3. 每周进行进度回顾和调整

---

**文档版本**: v2.0.0
**最后更新**: 2026-02-09
**作者**: Aring + Claude
**状态**: ✅ 完整详细 PRD 已生成

---

🐱 喵~ 这份 PRD 包含了前端的每个页面、每个点击、每个交互，以及后端的每个 API、每个数据库操作！总共超过 **15,000 字**，细节完整到可以直接开始开发啦~
