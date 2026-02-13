/**
 * PPTX 解析器
 *
 * 模仿 Python 实现: cc_code/backup/source_backup/app/util/pptx.py
 * 核心函数:
 * - extract_text_from_presentation() -> 异步生成器，逐页 yield
 * - extract_text_from_group() -> 递归处理组合形状
 * - extract_text_from_shape() -> 处理普通形状、表格、图表
 * - get_font_info() -> 提取完整的字体和格式信息
 */

import * as fs from 'fs/promises'
import JSZip from 'jszip'
import { parseStringPromise } from 'xml2js'
import {
  ParsedPPTX,
  PPTXSlide,
  PPTXTextElement,
  PPTXPosition,
  PPTXShapeMetadata,
  PPTXFontInfo,
  shouldSkipTranslation,
} from './types'

/**
 * 解析 PPTX 文件
 * 主入口函数，返回完整的解析结构
 */
export async function parsePPTX(filePath: string): Promise<ParsedPPTX> {
  const buffer = await fs.readFile(filePath)
  const zip = await JSZip.loadAsync(buffer)

  // 获取 presentation.xml 以确定幻灯片数量
  const presentationXml = await zip
    .file('ppt/presentation.xml')
    ?.async('string')
  if (!presentationXml) {
    throw new Error('Invalid PPTX: presentation.xml not found')
  }

  const presentation = await parseStringPromise(presentationXml)
  const slideIds =
    presentation['p:presentation']?.['p:sldIdLst']?.[0]?.['p:sldId'] || []
  const totalSlides = slideIds.length

  // 逐页解析
  const slides: PPTXSlide[] = []
  let totalElements = 0
  let totalChars = 0

  for (let slideNumber = 0; slideNumber < totalSlides; slideNumber++) {
    const slideElements = await extractSlideTexts(zip, slideNumber)

    slides.push({
      slideNumber,
      elements: slideElements,
    })

    totalElements += slideElements.length
    totalChars += slideElements.reduce((sum, el) => sum + el.text.length, 0)
  }

  return {
    slides,
    metadata: {
      fileName: filePath.split('/').pop() || 'unknown.pptx',
      totalSlides,
      totalElements,
      totalChars,
    },
  }
}

/**
 * 提取单页的所有文本元素
 * 对应 Python: extract_text_from_presentation() 的单页逻辑
 */
async function extractSlideTexts(
  zip: JSZip,
  slideNumber: number
): Promise<PPTXTextElement[]> {
  const slideXmlPath = `ppt/slides/slide${slideNumber + 1}.xml`
  const slideXml = await zip.file(slideXmlPath)?.async('string')

  if (!slideXml) {
    console.warn(`Slide ${slideNumber + 1} not found`)
    return []
  }

  const slide = await parseStringPromise(slideXml)
  const shapes = slide['p:sld']?.['p:cSld']?.[0]?.['p:spTree']?.[0] || {}

  const elements: PPTXTextElement[] = []

  // 提取所有形状的索引键
  const shapeKeys = Object.keys(shapes).filter(
    (key) => key.startsWith('p:') && key !== 'p:nvGrpSpPr' && key !== 'p:grpSpPr'
  )

  let shapeIndex = 0

  for (const key of shapeKeys) {
    const shapeList = shapes[key]
    if (!Array.isArray(shapeList)) continue

    for (const shape of shapeList) {
      if (key === 'p:grpSp') {
        // 组合形状 - 递归提取
        const groupElements = await extractGroupShapes(
          shape,
          slideNumber,
          [shapeIndex]
        )
        elements.push(...groupElements)
      } else {
        // 普通形状
        const shapeElements = await extractShapeText(
          shape,
          slideNumber,
          shapeIndex,
          key
        )
        elements.push(...shapeElements)
      }
      shapeIndex++
    }
  }

  return elements
}

/**
 * 递归提取组合形状中的文本
 * 对应 Python: extract_text_from_group()
 */
async function extractGroupShapes(
  group: any,
  slideNumber: number,
  groupIndex: number[]
): Promise<PPTXTextElement[]> {
  const elements: PPTXTextElement[] = []
  const shapes = group || {}

  const shapeKeys = Object.keys(shapes).filter(
    (key) => key.startsWith('p:') && key !== 'p:nvGrpSpPr' && key !== 'p:grpSpPr'
  )

  let subShapeIndex = 0

  for (const key of shapeKeys) {
    const shapeList = shapes[key]
    if (!Array.isArray(shapeList)) continue

    for (const shape of shapeList) {
      const position = [...groupIndex, subShapeIndex]

      if (key === 'p:grpSp') {
        // 嵌套的组合形状
        const nestedElements = await extractGroupShapes(
          shape,
          slideNumber,
          position
        )
        elements.push(...nestedElements)
      } else {
        // 组合内的普通形状
        const shapeElements = await extractShapeText(
          shape,
          slideNumber,
          position,
          key
        )
        elements.push(...shapeElements)
      }
      subShapeIndex++
    }
  }

  return elements
}

/**
 * 提取单个形状的文本
 * 对应 Python: extract_text_from_shape()
 *
 * @param shape - 形状对象
 * @param slideNumber - 幻灯片编号
 * @param shapeIndex - 形状索引 (number 或 number[])
 * @param shapeType - 形状类型键 (如 'p:sp', 'p:graphicFrame')
 */
async function extractShapeText(
  shape: any,
  slideNumber: number,
  shapeIndex: number | number[],
  shapeType: string
): Promise<PPTXTextElement[]> {
  const elements: PPTXTextElement[] = []

  // 构造位置信息
  const position: PPTXPosition = [
    slideNumber,
    Array.isArray(shapeIndex) ? shapeIndex : shapeIndex,
  ]

  // 处理文本框 (p:sp)
  if (shapeType === 'p:sp') {
    const textBody = shape['p:txBody']?.[0]
    if (textBody) {
      const text = extractTextFromTextBody(textBody)
      if (text && text.trim()) {
        const fontInfo = extractFontInfo(textBody)
        elements.push({
          text: text.trim(),
          position,
          metadata: {
            shape_type: 'AUTO_SHAPE (1)',
            table_info: null,
            font_info: fontInfo,
          },
        })
      }
    }
  }

  // 处理表格 (p:graphicFrame)
  if (shapeType === 'p:graphicFrame') {
    const graphic = shape['a:graphic']?.[0]
    const graphicData = graphic?.['a:graphicData']?.[0]
    const table = graphicData?.['a:tbl']?.[0]

    if (table) {
      const rows = table['a:tr'] || []
      rows.forEach((row: any, rowIndex: number) => {
        const cells = row['a:tc'] || []
        cells.forEach((cell: any, colIndex: number) => {
          const textBody = cell['a:txBody']?.[0]
          if (textBody) {
            const text = extractTextFromTextBody(textBody)
            if (text && text.trim()) {
              const fontInfo = extractFontInfo(textBody)
              elements.push({
                text: text.trim(),
                position,
                metadata: {
                  shape_type: 'MSO_SHAPE_TYPE.TABLE (19)',
                  table_info: { row: rowIndex, col: colIndex },
                  font_info: fontInfo,
                },
              })
            }
          }
        })
      })
    }

    // 处理图表标题
    const chart = graphicData?.['c:chart']
    if (chart) {
      // 图表通常在单独的 XML 中，这里简化处理
      // 生产环境需要解析 ppt/charts/chartX.xml
      elements.push({
        text: '[Chart Title]', // 占位符
        position,
        metadata: {
          shape_type: 'CHART',
          table_info: null,
          font_info: {},
        },
      })
    }
  }

  return elements
}

/**
 * 从 TextBody 中提取文本
 */
function extractTextFromTextBody(textBody: any): string {
  const paragraphs = textBody['a:p'] || []
  const texts: string[] = []

  paragraphs.forEach((para: any) => {
    const runs = para['a:r'] || []
    runs.forEach((run: any) => {
      const text = run['a:t']?.[0]
      if (typeof text === 'string') {
        texts.push(text)
      } else if (text && typeof text === 'object' && text._) {
        texts.push(text._)
      }
    })
  })

  return texts.join('')
}

/**
 * 提取字体和格式信息
 * 对应 Python: get_font_info()
 */
function extractFontInfo(textBody: any): PPTXFontInfo {
  const fontInfo: PPTXFontInfo = {}

  const paragraphs = textBody['a:p'] || []
  if (paragraphs.length === 0) return fontInfo

  const firstPara = paragraphs[0]
  const runs = firstPara['a:r'] || []
  if (runs.length === 0) return fontInfo

  const firstRun = runs[0]
  const rPr = firstRun['a:rPr']?.[0] // Run Properties

  if (!rPr) return fontInfo

  // 字体大小 (单位: 百分点，100 = 1pt)
  if (rPr.$ && rPr.$.sz) {
    fontInfo.size = parseInt(rPr.$.sz, 10)
  }

  // 字体名称
  const latin = rPr['a:latin']?.[0]
  if (latin?.$ && latin.$.typeface) {
    fontInfo.name = latin.$.typeface
  }

  // 粗体
  if (rPr.$ && rPr.$.b === '1') {
    fontInfo.bold = true
  }

  // 斜体
  if (rPr.$ && rPr.$.i === '1') {
    fontInfo.italic = true
  }

  // 下划线
  if (rPr.$ && rPr.$.u) {
    fontInfo.underline = true
  }

  // 颜色
  const solidFill = rPr['a:solidFill']?.[0]
  if (solidFill) {
    const srgbClr = solidFill['a:srgbClr']?.[0]
    if (srgbClr?.$ && srgbClr.$.val) {
      const hex = srgbClr.$.val
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      fontInfo.color = [r, g, b]
    }
  }

  // 段落属性
  const pPr = firstPara['a:pPr']?.[0] // Paragraph Properties
  if (pPr) {
    // 对齐方式
    if (pPr.$ && pPr.$.algn) {
      const alignMap: Record<string, number> = {
        l: 1, // left
        ctr: 2, // center
        r: 3, // right
        just: 4, // justify
      }
      fontInfo.alignment = alignMap[pPr.$.algn] || 1
    }

    // 段落级别
    if (pPr.$ && pPr.$.lvl) {
      fontInfo.level = parseInt(pPr.$.lvl, 10)
    }

    // 行间距
    if (pPr['a:lnSpc']) {
      const spcPct = pPr['a:lnSpc'][0]['a:spcPct']?.[0]
      if (spcPct?.$ && spcPct.$.val) {
        fontInfo.line_spacing = parseInt(spcPct.$.val, 10) / 100000
      }
    }

    // 段前间距
    if (pPr['a:spcBef']) {
      const spcPts = pPr['a:spcBef'][0]['a:spcPts']?.[0]
      if (spcPts?.$ && spcPts.$.val) {
        fontInfo.space_before = parseInt(spcPts.$.val, 10)
      }
    }

    // 段后间距
    if (pPr['a:spcAft']) {
      const spcPts = pPr['a:spcAft'][0]['a:spcPts']?.[0]
      if (spcPts?.$ && spcPts.$.val) {
        fontInfo.space_after = parseInt(spcPts.$.val, 10)
      }
    }
  }

  // 文本框属性 (bodyPr)
  const bodyPr = textBody['a:bodyPr']?.[0]
  if (bodyPr) {
    // 自动换行
    if (bodyPr.$ && bodyPr.$.wrap) {
      fontInfo.word_wrap = bodyPr.$.wrap !== 'none'
    }

    // 自动调整大小
    if (bodyPr['a:spAutoFit']) {
      fontInfo.auto_size = 1 // SHAPE_TO_FIT_TEXT
    } else if (bodyPr['a:noAutofit']) {
      fontInfo.auto_size = 0 // NONE
    } else if (bodyPr['a:normAutofit']) {
      fontInfo.auto_size = 2 // TEXT_TO_FIT_SHAPE
    }

    // 垂直对齐
    if (bodyPr.$ && bodyPr.$.anchor) {
      const anchorMap: Record<string, number> = {
        t: 1, // top
        ctr: 2, // middle
        b: 3, // bottom
      }
      fontInfo.vertical_anchor = anchorMap[bodyPr.$.anchor] || 1
    }

    // 边距 (EMU 单位，914400 EMU = 1 inch)
    if (bodyPr.$ && bodyPr.$.lIns) {
      fontInfo.margin_left = parseInt(bodyPr.$.lIns, 10)
    }
    if (bodyPr.$ && bodyPr.$.rIns) {
      fontInfo.margin_right = parseInt(bodyPr.$.rIns, 10)
    }
    if (bodyPr.$ && bodyPr.$.tIns) {
      fontInfo.margin_top = parseInt(bodyPr.$.tIns, 10)
    }
    if (bodyPr.$ && bodyPr.$.bIns) {
      fontInfo.margin_bottom = parseInt(bodyPr.$.bIns, 10)
    }
  }

  return fontInfo
}

/**
 * 获取需要翻译的文本段落（排除跳过的）
 */
export function getTranslatableSegments(
  parsedPPTX: ParsedPPTX
): Array<{ slideNumber: number; elementIndex: number; text: string }> {
  const segments: Array<{
    slideNumber: number
    elementIndex: number
    text: string
  }> = []

  parsedPPTX.slides.forEach((slide) => {
    slide.elements.forEach((element, index) => {
      if (!shouldSkipTranslation(element.text)) {
        segments.push({
          slideNumber: slide.slideNumber,
          elementIndex: index,
          text: element.text,
        })
      }
    })
  })

  return segments
}
