/**
 * DOCX 解析器
 *
 * 使用 mammoth 提取 DOCX 文档的文本内容，
 * 但保留原始格式信息用于后续还原。
 *
 * 注意：mammoth 主要用于文本提取，格式信息有限
 * 更复杂的格式需要直接解析 DOCX XML
 */

import * as fs from 'fs/promises'
import * as mammoth from 'mammoth'
import { join } from 'path'
import JSZip from 'jszip'
import {
  ParsedDocx,
  DocxElement,
  DocxParagraph,
  DocxRun,
  DocxTable,
  DocxTableRow,
  DocxTableCell,
  ParagraphStyle,
  RunStyle,
  shouldSkipTranslation,
} from './types'

/**
 * 解析 DOCX 文件
 */
export async function parseDocx(filePath: string): Promise<ParsedDocx> {
  const absolutePath = filePath.startsWith('/')
    ? filePath
    : join(process.cwd(), filePath)

  // 读取文件
  const buffer = await fs.readFile(absolutePath)

  // 使用 mammoth 提取基础文本结构
  const mammothResult = await mammoth.extractRawText({ buffer })

  // 解析 XML 以获取详细格式信息
  const elements = await parseDocxXml(buffer)

  // 计算统计信息
  const stats = calculateStats(elements)

  return {
    elements,
    metadata: {
      fileName: filePath.split('/').pop() || 'unknown.docx',
      totalParagraphs: stats.paragraphs,
      totalTables: stats.tables,
      totalChars: stats.chars,
    },
  }
}

/**
 * 解析 DOCX XML 获取详细格式信息
 */
async function parseDocxXml(buffer: Buffer): Promise<DocxElement[]> {
  const zip = await JSZip.loadAsync(buffer)
  const documentXml = await zip.file('word/document.xml')?.async('string')

  if (!documentXml) {
    throw new Error('Invalid DOCX: document.xml not found')
  }

  const elements: DocxElement[] = []

  // 使用正则解析 XML (简化版，生产环境建议用 xml2js)
  const bodyMatch = documentXml.match(/<w:body[^>]*>([\s\S]*?)<\/w:body>/i)
  if (!bodyMatch) {
    return elements
  }

  const bodyContent = bodyMatch[1]

  // 解析段落
  const paragraphMatches = bodyContent.matchAll(/<w:p[^>]*>([\s\S]*?)<\/w:p>/g)
  for (const match of paragraphMatches) {
    const paragraph = parseParagraph(match[1])
    if (paragraph) {
      elements.push(paragraph)
    }
  }

  // 解析表格
  const tableMatches = bodyContent.matchAll(/<w:tbl[^>]*>([\s\S]*?)<\/w:tbl>/g)
  for (const match of tableMatches) {
    const table = parseTable(match[1])
    if (table) {
      elements.push(table)
    }
  }

  return elements
}

/**
 * 解析单个段落
 */
function parseParagraph(paragraphXml: string): DocxParagraph | null {
  const runs: DocxRun[] = []

  // 解析段落样式
  const paragraphStyle = parseParagraphStyle(paragraphXml)

  // 解析所有 runs
  const runMatches = paragraphXml.matchAll(/<w:r[^>]*>([\s\S]*?)<\/w:r>/g)
  for (const match of runMatches) {
    const run = parseRun(match[1])
    if (run) {
      runs.push(run)
    }
  }

  // 如果没有 runs，跳过
  if (runs.length === 0) {
    return null
  }

  // 判断是否跳过翻译
  const fullText = runs.map((r) => r.text).join('')
  const skipTranslate = shouldSkipTranslation(fullText)

  return {
    type: 'paragraph',
    runs,
    paragraphStyle,
    skipTranslate,
  }
}

/**
 * 解析段落样式
 */
function parseParagraphStyle(paragraphXml: string): ParagraphStyle {
  const style: ParagraphStyle = {}

  // 解析对齐方式
  const alignMatch = paragraphXml.match(/<w:jc\s+w:val="([^"]+)"/)
  if (alignMatch) {
    const alignMap: Record<string, ParagraphStyle['alignment']> = {
      left: 'left',
      center: 'center',
      right: 'right',
      both: 'justify',
      justify: 'justify',
    }
    style.alignment = alignMap[alignMatch[1]] || 'left'
  }

  // 解析样式 ID (如 Heading1)
  const styleIdMatch = paragraphXml.match(/<w:pStyle\s+w:val="([^"]+)"/)
  if (styleIdMatch) {
    style.styleId = styleIdMatch[1]

    // 判断标题级别
    const headingMatch = style.styleId.match(/Heading(\d+)/i)
    if (headingMatch) {
      style.outlineLevel = parseInt(headingMatch[1], 10) - 1
    }
  }

  // 解析缩进
  const indentMatch = paragraphXml.match(
    /<w:ind\s+(?:w:left="(\d+)")?[^>]*(?:w:right="(\d+)")?[^>]*(?:w:firstLine="(\d+)")?/
  )
  if (indentMatch) {
    style.indent = {
      left: indentMatch[1] ? parseInt(indentMatch[1], 10) / 20 : undefined, // twips to pt
      right: indentMatch[2] ? parseInt(indentMatch[2], 10) / 20 : undefined,
      firstLine: indentMatch[3]
        ? parseInt(indentMatch[3], 10) / 20
        : undefined,
    }
  }

  // 解析间距
  const spacingMatch = paragraphXml.match(
    /<w:spacing\s+(?:w:before="(\d+)")?[^>]*(?:w:after="(\d+)")?[^>]*(?:w:line="(\d+)")?/
  )
  if (spacingMatch) {
    style.spacing = {
      before: spacingMatch[1] ? parseInt(spacingMatch[1], 10) / 20 : undefined,
      after: spacingMatch[2] ? parseInt(spacingMatch[2], 10) / 20 : undefined,
      line: spacingMatch[3] ? parseInt(spacingMatch[3], 10) / 240 : undefined, // 行距
    }
  }

  return style
}

/**
 * 解析单个 Run
 */
function parseRun(runXml: string): DocxRun | null {
  // 提取文本
  const textMatch = runXml.match(/<w:t[^>]*>([^<]*)<\/w:t>/)
  const text = textMatch ? textMatch[1] : ''

  if (!text) {
    return null
  }

  // 解析样式
  const style = parseRunStyle(runXml)

  return { text, style }
}

/**
 * 解析 Run 样式
 */
function parseRunStyle(runXml: string): RunStyle {
  const style: RunStyle = {}

  // 粗体
  if (/<w:b(?:\s|\/|>)/.test(runXml)) {
    style.bold = true
  }

  // 斜体
  if (/<w:i(?:\s|\/|>)/.test(runXml)) {
    style.italic = true
  }

  // 下划线
  if (/<w:u(?:\s|\/|>)/.test(runXml)) {
    style.underline = true
  }

  // 删除线
  if (/<w:strike(?:\s|\/|>)/.test(runXml)) {
    style.strike = true
  }

  // 字体颜色
  const colorMatch = runXml.match(/<w:color\s+w:val="([^"]+)"/)
  if (colorMatch && colorMatch[1] !== 'auto') {
    style.color = `#${colorMatch[1]}`
  }

  // 高亮
  const highlightMatch = runXml.match(/<w:highlight\s+w:val="([^"]+)"/)
  if (highlightMatch) {
    style.highlight = highlightMatch[1]
  }

  // 字号 (半点 -> 点)
  const sizeMatch = runXml.match(/<w:sz\s+w:val="(\d+)"/)
  if (sizeMatch) {
    style.fontSize = parseInt(sizeMatch[1], 10) / 2
  }

  // 字体
  const fontMatch = runXml.match(/<w:rFonts[^>]+w:ascii="([^"]+)"/)
  if (fontMatch) {
    style.fontFamily = fontMatch[1]
  }

  // 上标
  if (/<w:vertAlign\s+w:val="superscript"/.test(runXml)) {
    style.superscript = true
  }

  // 下标
  if (/<w:vertAlign\s+w:val="subscript"/.test(runXml)) {
    style.subscript = true
  }

  return style
}

/**
 * 解析表格
 */
function parseTable(tableXml: string): DocxTable | null {
  const rows: DocxTableRow[] = []

  // 解析所有行
  const rowMatches = tableXml.matchAll(/<w:tr[^>]*>([\s\S]*?)<\/w:tr>/g)
  for (const match of rowMatches) {
    const row = parseTableRow(match[1])
    if (row) {
      rows.push(row)
    }
  }

  if (rows.length === 0) {
    return null
  }

  return {
    type: 'table',
    rows,
  }
}

/**
 * 解析表格行
 */
function parseTableRow(rowXml: string): DocxTableRow | null {
  const cells: DocxTableCell[] = []

  // 解析所有单元格
  const cellMatches = rowXml.matchAll(/<w:tc[^>]*>([\s\S]*?)<\/w:tc>/g)
  for (const match of cellMatches) {
    const cell = parseTableCell(match[1])
    if (cell) {
      cells.push(cell)
    }
  }

  if (cells.length === 0) {
    return null
  }

  return { cells }
}

/**
 * 解析表格单元格
 */
function parseTableCell(cellXml: string): DocxTableCell | null {
  const runs: DocxRun[] = []
  const texts: string[] = []

  // 解析单元格中的所有段落的所有 runs
  const paragraphMatches = cellXml.matchAll(/<w:p[^>]*>([\s\S]*?)<\/w:p>/g)
  for (const pMatch of paragraphMatches) {
    const runMatches = pMatch[1].matchAll(/<w:r[^>]*>([\s\S]*?)<\/w:r>/g)
    for (const rMatch of runMatches) {
      const run = parseRun(rMatch[1])
      if (run) {
        runs.push(run)
        texts.push(run.text)
      }
    }
  }

  const text = texts.join('')
  const skipTranslate = shouldSkipTranslation(text)

  // 解析合并信息
  let columnSpan: number | undefined
  let rowSpan: number | undefined

  const gridSpanMatch = cellXml.match(/<w:gridSpan\s+w:val="(\d+)"/)
  if (gridSpanMatch) {
    columnSpan = parseInt(gridSpanMatch[1], 10)
  }

  const vMergeMatch = cellXml.match(/<w:vMerge(?:\s+w:val="([^"]+)")?/)
  if (vMergeMatch && !vMergeMatch[1]) {
    // vMerge without val means continuation cell
    rowSpan = 0 // 标记为合并后续单元格
  }

  return {
    text,
    runs,
    columnSpan,
    rowSpan,
    skipTranslate,
  }
}

/**
 * 计算统计信息
 */
function calculateStats(elements: DocxElement[]): {
  paragraphs: number
  tables: number
  chars: number
} {
  let paragraphs = 0
  let tables = 0
  let chars = 0

  for (const element of elements) {
    if (element.type === 'paragraph') {
      paragraphs++
      chars += element.runs.reduce((sum, run) => sum + run.text.length, 0)
    } else if (element.type === 'table') {
      tables++
      for (const row of element.rows) {
        for (const cell of row.cells) {
          chars += cell.text.length
        }
      }
    }
  }

  return { paragraphs, tables, chars }
}

/**
 * 获取需要翻译的文本段落（排除跳过的）
 */
export function getTranslatableSegments(
  parsedDocx: ParsedDocx
): Array<{ index: number; text: string; type: 'paragraph' | 'table-cell' }> {
  const segments: Array<{
    index: number
    text: string
    type: 'paragraph' | 'table-cell'
  }> = []

  let index = 0
  for (const element of parsedDocx.elements) {
    if (element.type === 'paragraph') {
      if (!element.skipTranslate) {
        const text = element.runs.map((r) => r.text).join('')
        segments.push({ index, text, type: 'paragraph' })
      }
      index++
    } else if (element.type === 'table') {
      for (const row of element.rows) {
        for (const cell of row.cells) {
          if (!cell.skipTranslate && cell.text.trim()) {
            segments.push({ index, text: cell.text, type: 'table-cell' })
          }
          index++
        }
      }
    }
  }

  return segments
}
