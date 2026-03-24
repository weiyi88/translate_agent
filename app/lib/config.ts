// ============================================================
// 全局配置文件 — 所有硬编码、枚举、明文常量统一在此管理
// ============================================================

// ── 应用基本信息 ──────────────────────────────────────────────
export const APP = {
  name: 'TranslateAI',           // 产品名称
  url: 'https://translateagent.app', // 生产域名
  supportEmail: 'support@translateagent.app', // 客服邮箱
}

// ── AI 模型列表 ───────────────────────────────────────────────
export const AI_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', labelZh: 'GPT-4o Mini（快速）' },
  { value: 'gpt-4o',      label: 'GPT-4o',      labelZh: 'GPT-4o（推荐）' },
  { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', labelZh: 'Claude 3.5（高质量）' },
] as const

export const DEFAULT_MODEL = 'gpt-4o-mini' // 默认模型

// ── 支持的界面语言 ────────────────────────────────────────────
export const UI_LANGUAGES = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en',    label: 'English' },
] as const

export const DEFAULT_UI_LANGUAGE = 'zh-CN' // 默认界面语言

// ── 主题选项 ──────────────────────────────────────────────────
export const THEMES = [
  { value: 'light',  label: 'Light',  labelZh: '浅色' },
  { value: 'dark',   label: 'Dark',   labelZh: '深色' },
  { value: 'system', label: 'System', labelZh: '跟随系统' },
] as const

export const DEFAULT_THEME = 'system' // 默认主题

// ── 翻译支持的目标语言 ────────────────────────────────────────
export const TRANSLATE_LANGUAGES = [
  { value: 'zh-CN', label: '中文（简体）' },
  { value: 'zh-TW', label: '中文（繁體）' },
  { value: 'en',    label: 'English' },
  { value: 'ja',    label: '日本語' },
  { value: 'ko',    label: '한국어' },
  { value: 'fr',    label: 'Français' },
  { value: 'de',    label: 'Deutsch' },
  { value: 'es',    label: 'Español' },
  { value: 'ru',    label: 'Русский' },
  { value: 'ar',    label: 'العربية' },
] as const

// ── 词库配置 ──────────────────────────────────────────────────
export const GLOSSARY = {
  maxFileSizeMB: 10,             // 上传文件最大 MB
  supportedFormats: ['.csv', '.xlsx'], // 支持格式
  sampleCsvHeader: '原文,译文,语种', // 示例 CSV 表头
}

// ── 文件上传配置 ──────────────────────────────────────────────
export const FILE_UPLOAD = {
  maxFileSizeMB: 50,             // 翻译文档最大 MB
  supportedTypes: ['.docx', '.pptx', '.xlsx', '.pdf'], // 支持格式
}

// ── 个人资料占位数据（开发期间用，接入真实用户数据后删除）──
export const PROFILE_PLACEHOLDER = {
  name: '',                      // 姓名占位
  email: '',                     // 邮箱占位
  company: '',                   // 公司占位
  position: '',                  // 职位占位
}

// ── API 密钥配置 ──────────────────────────────────────────────
export const API_KEY = {
  placeholder: 'sk_live_••••••••••••••••', // 密钥显示占位符
  prefix: 'sk_live_',            // 密钥前缀
}

// ── 轮询 / 任务配置 ───────────────────────────────────────────
export const TASK = {
  pollIntervalMs: 2000,          // 状态轮询间隔
  pollMaxAttempts: 300,          // 最大轮询次数
}

// ── 时区选项 ──────────────────────────────────────────────────
export const TIMEZONES = [
  { value: 'Asia/Shanghai',    label: 'UTC+8 中国标准时间' },
  { value: 'America/New_York', label: 'UTC-5 美国东部时间' },
  { value: 'Europe/London',    label: 'UTC+0 格林威治时间' },
  { value: 'Asia/Tokyo',       label: 'UTC+9 日本标准时间' },
] as const

export const DEFAULT_TIMEZONE = 'Asia/Shanghai' // 默认时区
