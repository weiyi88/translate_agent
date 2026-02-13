/**
 * DOCX 处理类型定义
 */

/**
 * Run 级别的文本样式
 */
export interface RunStyle {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strike?: boolean
  color?: string // RGB hex (#RRGGBB)
  highlight?: string // 高亮颜色
  fontSize?: number // 字号 (pt)
  fontFamily?: string // 字体
  superscript?: boolean
  subscript?: boolean
}

/**
 * 段落样式
 */
export interface ParagraphStyle {
  alignment?: 'left' | 'center' | 'right' | 'justify' | 'both'
  indent?: {
    left?: number
    right?: number
    firstLine?: number
  }
  spacing?: {
    before?: number
    after?: number
    line?: number
  }
  outlineLevel?: number // 标题级别 (0-8, 0=H1)
  styleId?: string // Word 内置样式 ID (如 'Heading1')
  bullet?: {
    level: number
    type: 'bullet' | 'number'
  }
}

/**
 * Run (文本片段)
 */
export interface DocxRun {
  text: string
  style: RunStyle
}

/**
 * 段落
 */
export interface DocxParagraph {
  type: 'paragraph'
  runs: DocxRun[]
  paragraphStyle: ParagraphStyle
  skipTranslate: boolean // 是否跳过翻译
}

/**
 * 表格单元格
 */
export interface DocxTableCell {
  text: string
  runs: DocxRun[]
  columnSpan?: number
  rowSpan?: number
  skipTranslate: boolean
}

/**
 * 表格行
 */
export interface DocxTableRow {
  cells: DocxTableCell[]
}

/**
 * 表格
 */
export interface DocxTable {
  type: 'table'
  rows: DocxTableRow[]
  width?: number
}

/**
 * 文档元素 (段落或表格)
 */
export type DocxElement = DocxParagraph | DocxTable

/**
 * 解析后的 DOCX 文档结构
 */
export interface ParsedDocx {
  elements: DocxElement[]
  metadata: {
    fileName: string
    totalParagraphs: number
    totalTables: number
    totalChars: number
  }
}

/**
 * 翻译后的段落
 */
export interface TranslatedParagraph {
  originalElement: DocxParagraph
  translatedRuns: DocxRun[]
}

/**
 * 翻译后的表格单元格
 */
export interface TranslatedTableCell {
  originalCell: DocxTableCell
  translatedRuns: DocxRun[]
}

/**
 * 翻译后的文档
 */
export interface TranslatedDocx {
  elements: Array<TranslatedParagraph | DocxTable>
  metadata: {
    totalTranslated: number
    totalSkipped: number
  }
}

/**
 * 跳过翻译的模式
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
