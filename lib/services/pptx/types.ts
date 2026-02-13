/**
 * PPTX 处理类型定义
 *
 * 参考 Python 实现: cc_code/backup/source_backup/app/util/pptx.py
 */

/**
 * 字体信息 (对应 Python get_font_info)
 * 包含字体、段落和文本框的所有格式属性
 */
export interface PPTXFontInfo {
  // 字体属性
  size?: number // pt * 100 (Python 使用 pt * 100 存储)
  name?: string // 字体名称
  bold?: boolean
  italic?: boolean
  underline?: boolean
  color?: [number, number, number] // RGB 三元组
  language_id?: number

  // 段落属性
  alignment?: number // 对齐方式枚举
  level?: number // 段落级别
  line_spacing?: number // 行间距
  space_before?: number // 段前间距
  space_after?: number // 段后间距

  // 文本框属性
  word_wrap?: boolean
  auto_size?: number // 自动调整大小枚举
  vertical_anchor?: number // 垂直对齐枚举
  margin_left?: number
  margin_right?: number
  margin_top?: number
  margin_bottom?: number
}

/**
 * 表格单元格信息
 */
export interface PPTXTableInfo {
  row: number // 行索引
  col: number // 列索引
}

/**
 * 形状类型 (对应 Python MSO_SHAPE_TYPE)
 */
export type PPTXShapeType =
  | 'GROUP' // 组合形状
  | 'TABLE' // 表格
  | 'CHART' // 图表
  | 'TEXT_BOX' // 文本框
  | 'AUTO_SHAPE' // 自动形状
  | 'PICTURE' // 图片
  | 'OTHER' // 其他

/**
 * 形状元数据
 */
export interface PPTXShapeMetadata {
  shape_type: string // 形状类型字符串 (如 "MSO_SHAPE_TYPE.TABLE (19)")
  table_info: PPTXTableInfo | null // 表格信息（仅表格单元格有效）
  font_info: PPTXFontInfo // 字体和格式信息
}

/**
 * 位置信息
 * - 普通形状: (slide_number, shape_index)
 * - 嵌套形状: (slide_number, (parent_index, child_index, ...))
 *
 * 示例:
 * - (0, 2) - 第 1 页的第 3 个形状
 * - (1, (0, 2)) - 第 2 页的第 1 个组合中的第 3 个形状
 * - (2, (1, 0, 3)) - 第 3 页的第 2 个组合的第 1 个子组合的第 4 个形状
 */
export type PPTXPosition = [number, number | number[]]

/**
 * PPTX 文本元素 (对应 Python 三元组)
 * Python: [text, (slide_number, shape_index), {"shape_type": ..., "table_info": ..., "font_info": ...}]
 */
export interface PPTXTextElement {
  text: string // 文本内容
  position: PPTXPosition // 位置信息
  metadata: PPTXShapeMetadata // 形状元数据
}

/**
 * 单页的所有文本元素
 */
export interface PPTXSlide {
  slideNumber: number
  elements: PPTXTextElement[]
}

/**
 * 解析后的 PPTX 文档结构
 */
export interface ParsedPPTX {
  slides: PPTXSlide[]
  metadata: {
    fileName: string
    totalSlides: number
    totalElements: number
    totalChars: number
  }
}

/**
 * 翻译后的文本元素
 * 保留原始位置和格式信息，替换文本内容
 */
export interface TranslatedPPTXElement {
  translatedText: string // 翻译后的文本
  position: PPTXPosition // 原始位置
  metadata: PPTXShapeMetadata // 原始格式信息
}

/**
 * 翻译后的 PPTX 文档
 */
export interface TranslatedPPTX {
  slides: Array<{
    slideNumber: number
    elements: TranslatedPPTXElement[]
  }>
  metadata: {
    totalTranslated: number
    totalSkipped: number
  }
}

/**
 * 跳过翻译的模式 (与 DOCX 一致)
 */
export const SKIP_PATTERNS = [
  /^https?:\/\//i, // URL
  /^[\w.-]+@[\w.-]+\.\w+$/i, // 邮箱
  /```[\s\S]*?```/, // 代码块
  /^\d+[\.\)]?\s*$/, // 纯数字/序号
  /^[\s\n\r]*$/, // 空白
]

/**
 * 判断文本是否需要跳过翻译
 */
export function shouldSkipTranslation(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return true
  }

  return SKIP_PATTERNS.some((pattern) => pattern.test(text))
}

/**
 * 格式化位置信息为字符串 (用于日志)
 */
export function formatPosition(position: PPTXPosition): string {
  const [slideNum, shapeIndex] = position
  if (typeof shapeIndex === 'number') {
    return `slide=${slideNum}, shape=${shapeIndex}`
  }
  return `slide=${slideNum}, shape=${JSON.stringify(shapeIndex)}`
}
