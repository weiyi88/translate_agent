// @ts-nocheck
/**
 * DOCX 生成器
 *
 * 根据解析后的文档结构和翻译结果，
 * 生成保留原始格式的 DOCX 文件。
 */

import * as fs from 'fs/promises'
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, IParagraphOptions, IRunOptions } from 'docx'
import { join } from 'path'
import {
  ParsedDocx,
  DocxElement,
  DocxParagraph,
  DocxRun,
  DocxTable,
  ParagraphStyle,
  RunStyle,
  TranslatedDocx,
} from './types'

/**
 * 生成翻译后的 DOCX 文件
 */
export async function generateDocx(
  translatedDocx: TranslatedDocx,
  outputPath: string
): Promise<void> {
  const absolutePath = outputPath.startsWith('/')
    ? outputPath
    : join(process.cwd(), outputPath)

  // 构建 Document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: buildDocumentChildren(translatedDocx),
      },
    ],
  })

  // 生成 buffer
  const buffer = await Packer.toBuffer(doc)

  // 写入文件
  await fs.writeFile(absolutePath, buffer)
}

/**
 * 构建文档子元素
 */
function buildDocumentChildren(translatedDocx: TranslatedDocx): Array<Paragraph | Table> {
  const children: Array<Paragraph | Table> = []

  for (const element of translatedDocx.elements) {
    if ('translatedRuns' in element) {
      // 翻译后的段落
      const paragraph = buildParagraph(
        element.translatedRuns,
        element.originalElement.paragraphStyle
      )
      children.push(paragraph)
    } else {
      // 表格
      const table = buildTable(element)
      children.push(table)
    }
  }

  return children
}

/**
 * 构建段落
 */
function buildParagraph(runs: DocxRun[], paragraphStyle: ParagraphStyle): Paragraph {
  const options: IParagraphOptions = {}

  // 应用段落样式
  if (paragraphStyle.alignment) {
    const alignmentMap: Record<string, AlignmentType> = {
      left: AlignmentType.LEFT,
      center: AlignmentType.CENTER,
      right: AlignmentType.RIGHT,
      justify: AlignmentType.JUSTIFIED,
      both: AlignmentType.JUSTIFIED,
    }
    options.alignment = alignmentMap[paragraphStyle.alignment] || AlignmentType.LEFT
  }

  // 标题级别
  if (paragraphStyle.outlineLevel !== undefined) {
    const headingLevels = [
      HeadingLevel.HEADING_1,
      HeadingLevel.HEADING_2,
      HeadingLevel.HEADING_3,
      HeadingLevel.HEADING_4,
      HeadingLevel.HEADING_5,
      HeadingLevel.HEADING_6,
    ]
    if (paragraphStyle.outlineLevel < headingLevels.length) {
      options.heading = headingLevels[paragraphStyle.outlineLevel]
    }
  }

  // 缩进
  if (paragraphStyle.indent) {
    options.indent = {
      left: paragraphStyle.indent.left,
      right: paragraphStyle.indent.right,
      firstLine: paragraphStyle.indent.firstLine,
    }
  }

  // 间距
  if (paragraphStyle.spacing) {
    options.spacing = {
      before: paragraphStyle.spacing.before,
      after: paragraphStyle.spacing.after,
      line: paragraphStyle.spacing.line,
    }
  }

  // 构建 runs
  options.children = runs.map((run) => buildTextRun(run))

  return new Paragraph(options)
}

/**
 * 构建 TextRun
 */
function buildTextRun(run: DocxRun): TextRun {
  const options: IRunOptions = {
    text: run.text,
  }

  // 应用样式
  if (run.style.bold) {
    options.bold = true
  }

  if (run.style.italic) {
    options.italics = true
  }

  if (run.style.underline) {
    options.underline = {}
  }

  if (run.style.strike) {
    options.strike = true
  }

  if (run.style.color) {
    // 移除 # 号
    options.color = run.style.color.replace(/^#/, '')
  }

  if (run.style.fontSize) {
    options.size = run.style.fontSize * 2 // pt to half-points
  }

  if (run.style.fontFamily) {
    options.font = run.style.fontFamily
  }

  if (run.style.superscript) {
    options.superScript = true
  }

  if (run.style.subscript) {
    options.subScript = true
  }

  return new TextRun(options)
}

/**
 * 构建表格
 */
function buildTable(table: DocxTable): Table {
  const rows = table.rows.map((row) => buildTableRow(row))

  return new Table({
    rows,
    width: {
      size: table.width || 100,
      type: WidthType.PERCENTAGE,
    },
  })
}

/**
 * 构建表格行
 */
function buildTableRow(row: { cells: any[] }): TableRow {
  const cells = row.cells.map((cell) => buildTableCell(cell))

  return new TableRow({
    children: cells,
  })
}

/**
 * 构建表格单元格
 */
function buildTableCell(cell: any): TableCell {
  const runs = cell.translatedRuns || cell.runs || []
  const paragraphs = [
    new Paragraph({
      children: runs.map((run: DocxRun) => buildTextRun(run)),
    }),
  ]

  return new TableCell({
    children: paragraphs,
    columnSpan: cell.columnSpan,
    rowSpan: cell.rowSpan,
  })
}

/**
 * 简化版：根据原始文档和翻译映射生成新文档
 */
export async function generateTranslatedDocx(
  parsedDocx: ParsedDocx,
  translations: Map<number, string>, // index -> translated text
  outputPath: string
): Promise<void> {
  const children: Array<Paragraph | Table> = []

  let elementIndex = 0

  for (const element of parsedDocx.elements) {
    if (element.type === 'paragraph') {
      // 如果有翻译，使用翻译后的文本
      const translatedText = translations.get(elementIndex)

      if (translatedText && !element.skipTranslate) {
        // 重建 runs，保留原始样式，但替换文本
        const newRuns = rebuildRunsWithTranslation(element.runs, translatedText)
        const paragraph = buildParagraph(newRuns, element.paragraphStyle)
        children.push(paragraph)
      } else {
        // 保持原样
        const paragraph = buildParagraph(element.runs, element.paragraphStyle)
        children.push(paragraph)
      }

      elementIndex++
    } else if (element.type === 'table') {
      // 表格处理：逐单元格翻译
      const translatedTable = buildTranslatedTable(element, translations, elementIndex)
      children.push(translatedTable)

      // 更新索引（每个单元格计数）
      for (const row of element.rows) {
        elementIndex += row.cells.length
      }
    }
  }

  // 创建文档
  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })

  // 生成并保存
  const { Packer } = require('docx')
  const buffer = await Packer.toBuffer(doc)

  const absolutePath = outputPath.startsWith('/')
    ? outputPath
    : join(process.cwd(), outputPath)

  await fs.writeFile(absolutePath, buffer)
}

/**
 * 根据翻译文本重建 runs（保留格式）
 *
 * 策略：将翻译后的文本按原始 runs 的长度比例分配
 */
function rebuildRunsWithTranslation(originalRuns: DocxRun[], translatedText: string): DocxRun[] {
  // 如果只有一个 run，直接替换
  if (originalRuns.length === 1) {
    return [
      {
        text: translatedText,
        style: originalRuns[0].style,
      },
    ]
  }

  // 多个 runs：按比例分配文本（简化策略）
  const totalOriginalLength = originalRuns.reduce((sum, run) => sum + run.text.length, 0)
  const newRuns: DocxRun[] = []
  let remainingText = translatedText
  let accumulatedLength = 0

  for (let i = 0; i < originalRuns.length; i++) {
    const run = originalRuns[i]
    const runRatio = run.text.length / totalOriginalLength

    // 计算这个 run 应该占的翻译文本长度
    let targetLength: number

    if (i === originalRuns.length - 1) {
      // 最后一个 run，取剩余所有文本
      targetLength = remainingText.length
    } else {
      targetLength = Math.round(translatedText.length * runRatio)
    }

    // 切分文本
    const runText = remainingText.substring(0, targetLength)
    remainingText = remainingText.substring(targetLength)

    newRuns.push({
      text: runText,
      style: run.style,
    })

    accumulatedLength += runText.length
  }

  return newRuns
}

/**
 * 构建翻译后的表格
 */
function buildTranslatedTable(
  table: DocxTable,
  translations: Map<number, string>,
  startIndex: number
): Table {
  let cellIndex = startIndex

  const rows = table.rows.map((row) => {
    const cells = row.cells.map((cell) => {
      const translatedText = translations.get(cellIndex)

      let runs: DocxRun[]

      if (translatedText && !cell.skipTranslate) {
        runs = rebuildRunsWithTranslation(cell.runs, translatedText)
      } else {
        runs = cell.runs
      }

      cellIndex++

      return {
        runs,
        translatedRuns: runs,
        columnSpan: cell.columnSpan,
        rowSpan: cell.rowSpan,
      }
    })

    return { cells }
  })

  return buildTable({ type: 'table', rows, width: table.width })
}

// 导入 Packer 和 WidthType
const { Packer, WidthType } = require('docx')
