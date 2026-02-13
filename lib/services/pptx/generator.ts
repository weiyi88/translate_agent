/**
 * PPTX 生成器
 *
 * 根据解析后的文档结构和翻译结果，
 * 生成保留原始格式的 PPTX 文件。
 *
 * 参考 Python 实现: cc_code/backup/source_backup/app/util/pptx.py
 * - restore_text_to_presentation()
 * - get_or_create_nested_shape()
 * - apply_font_info_safely()
 */

import PptxGenJS from 'pptxgenjs'
import * as fs from 'fs/promises'
import { join } from 'path'
import {
  TranslatedPPTX,
  TranslatedPPTXElement,
  PPTXPosition,
  PPTXFontInfo,
  PPTXTableInfo,
  formatPosition,
} from './types'

/**
 * 生成翻译后的 PPTX 文件
 *
 * @param originalPptxPath - 原始 PPTX 文件路径
 * @param translatedPptx - 翻译后的文档结构
 * @param outputPath - 输出文件路径
 */
export async function generateTranslatedPPTX(
  originalPptxPath: string,
  translatedPptx: TranslatedPPTX,
  outputPath: string
): Promise<void> {
  // 加载原始 PPTX (使用 pptxgenjs 无法直接修改现有文件)
  // 策略: 使用 python-pptx 的 Node.js 替代方案或直接操作 XML
  // 这里我们使用更可靠的方法: 调用 Python 脚本

  // 准备翻译数据
  const translationData = prepareTranslationData(translatedPptx)

  // 调用 Python 还原脚本
  await restoreWithPython(originalPptxPath, translationData, outputPath)
}

/**
 * 准备翻译数据为 Python 脚本可用的格式
 */
function prepareTranslationData(translatedPptx: TranslatedPPTX): TranslatedPPTXElement[] {
  const allElements: TranslatedPPTXElement[] = []

  for (const slide of translatedPptx.slides) {
    allElements.push(...slide.elements)
  }

  return allElements
}

/**
 * 使用 Python 脚本还原翻译
 *
 * 这是一个临时方案，因为 Node.js 缺少完整的 python-pptx 等效库。
 * 理想情况下应该使用纯 TypeScript 实现。
 */
async function restoreWithPython(
  originalPath: string,
  translations: TranslatedPPTXElement[],
  outputPath: string
): Promise<void> {
  // 将翻译数据写入临时 JSON 文件
  const tempJsonPath = outputPath.replace(/\.pptx$/, '.translations.json')
  await fs.writeFile(tempJsonPath, JSON.stringify(translations, null, 2))

  // 调用 Python 脚本 (需要实现)
  const { spawn } = require('child_process')
  const pythonScript = join(__dirname, '../../../scripts/restore_pptx.py')

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [
      pythonScript,
      originalPath,
      tempJsonPath,
      outputPath,
    ])

    let stderr = ''

    pythonProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString()
    })

    pythonProcess.on('close', async (code: number) => {
      // 清理临时文件
      await fs.unlink(tempJsonPath).catch(() => {})

      if (code !== 0) {
        reject(new Error(`Python script failed: ${stderr}`))
      } else {
        resolve()
      }
    })
  })
}

/**
 * 纯 TypeScript 实现 (使用 pptxgenjs)
 *
 * 限制: pptxgenjs 无法直接修改现有 PPTX，只能创建新的。
 * 因此这个方法适用于从头创建 PPTX，但不适合保留复杂格式。
 *
 * 保留这个函数作为参考/备用方案。
 */
export async function generatePPTXWithPptxGenJS(
  translatedPptx: TranslatedPPTX,
  outputPath: string
): Promise<void> {
  const pptx = new PptxGenJS()

  // 逐页创建幻灯片
  for (const slideData of translatedPptx.slides) {
    const slide = pptx.addSlide()

    // 添加翻译后的文本元素
    for (const element of slideData.elements) {
      await addTextElementToSlide(slide, element)
    }
  }

  // 保存文件
  const absolutePath = outputPath.startsWith('/')
    ? outputPath
    : join(process.cwd(), outputPath)

  await pptx.writeFile({ fileName: absolutePath })
}

/**
 * 添加文本元素到幻灯片
 */
async function addTextElementToSlide(
  slide: any,
  element: TranslatedPPTXElement
): Promise<void> {
  const { translatedText, metadata } = element
  const { shape_type, table_info, font_info } = metadata

  // 根据形状类型处理
  if (shape_type.includes('TABLE') && table_info) {
    // 表格单元格 - 需要完整的表格结构，这里简化处理
    console.warn('Table cells require full table structure, skipping:', element.position)
  } else if (shape_type.includes('CHART')) {
    // 图表标题 - pptxgenjs 有限支持
    console.warn('Chart titles have limited support, skipping:', element.position)
  } else {
    // 普通文本框/自动形状
    const textOptions = buildTextOptions(font_info)
    slide.addText(translatedText, textOptions)
  }
}

/**
 * 根据 PPTXFontInfo 构建 pptxgenjs 文本选项
 */
function buildTextOptions(fontInfo: PPTXFontInfo): any {
  const options: any = {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 1,
  }

  if (fontInfo.size) {
    options.fontSize = fontInfo.size / 100 // 转换回 pt
  }

  if (fontInfo.name) {
    options.fontFace = fontInfo.name
  }

  if (fontInfo.bold) {
    options.bold = true
  }

  if (fontInfo.italic) {
    options.italic = true
  }

  if (fontInfo.underline) {
    options.underline = { style: 'sng' }
  }

  if (fontInfo.color) {
    const [r, g, b] = fontInfo.color
    options.color = rgbToHex(r, g, b)
  }

  // 对齐方式
  if (fontInfo.alignment !== undefined) {
    const alignmentMap: { [key: number]: string } = {
      1: 'left',
      2: 'center',
      3: 'right',
      4: 'justify',
    }
    options.align = alignmentMap[fontInfo.alignment] || 'left'
  }

  return options
}

/**
 * RGB 转十六进制
 */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    ((r << 16) | (g << 8) | b)
      .toString(16)
      .padStart(6, '0')
      .toUpperCase()
  )
}

/**
 * 获取嵌套形状 (对应 Python get_or_create_nested_shape)
 *
 * TypeScript 版本 - 这个函数需要 python-pptx 的等效实现。
 * 目前作为接口定义，实际实现需要使用底层 XML 操作或 Python 互操作。
 *
 * @param slide - 幻灯片对象
 * @param position - 位置信息 (可能是数字或嵌套数组)
 * @returns 目标形状对象
 */
export function getNestedShape(slide: any, position: number | number[]): any {
  // 如果是简单索引
  if (typeof position === 'number') {
    return slide.shapes[position]
  }

  // 嵌套位置: [parent_index, child_index, ...]
  let currentShape = slide.shapes

  for (let i = 0; i < position.length; i++) {
    const index = position[i]

    // 最后一个索引
    if (i === position.length - 1) {
      if (currentShape.shapes && index < currentShape.shapes.length) {
        return currentShape.shapes[index]
      } else if (index < currentShape.length) {
        return currentShape[index]
      } else {
        throw new Error(`Shape index ${index} out of range at depth ${i}`)
      }
    }

    // 中间索引 - 继续向下遍历
    if (currentShape.shapes) {
      // GroupShape
      if (index >= currentShape.shapes.length) {
        throw new Error(`Shape index ${index} out of range in group at depth ${i}`)
      }
      currentShape = currentShape.shapes[index]
    } else {
      // ShapeCollection
      if (index >= currentShape.length) {
        throw new Error(`Shape index ${index} out of range at depth ${i}`)
      }
      currentShape = currentShape[index]
    }
  }

  return currentShape
}

/**
 * 应用字体信息 (对应 Python apply_font_info_safely)
 *
 * 这个函数需要访问 python-pptx 的 TextFrame/Font/Paragraph 对象。
 * 在纯 TypeScript 环境中无法直接实现，需要通过 Python 互操作。
 *
 * @param textFrame - 文本框对象
 * @param fontInfo - 字体信息
 */
export function applyFontInfo(textFrame: any, fontInfo: PPTXFontInfo): void {
  try {
    // 字体级别属性
    if (textFrame.paragraphs && textFrame.paragraphs[0]?.runs?.[0]) {
      const font = textFrame.paragraphs[0].runs[0].font

      if (fontInfo.size !== undefined) {
        font.size = fontInfo.size // Python 已经是 pt * 100
      }

      if (fontInfo.name) {
        font.name = fontInfo.name
      }

      if (fontInfo.bold !== undefined) {
        font.bold = fontInfo.bold
      }

      if (fontInfo.italic !== undefined) {
        font.italic = fontInfo.italic
      }

      if (fontInfo.underline !== undefined) {
        font.underline = fontInfo.underline
      }

      if (fontInfo.color) {
        const [r, g, b] = fontInfo.color
        font.color.rgb = { r, g, b }
      }

      if (fontInfo.language_id !== undefined) {
        font.language_id = fontInfo.language_id
      }

      // 段落级别属性
      const paragraph = textFrame.paragraphs[0]

      if (fontInfo.alignment !== undefined) {
        paragraph.alignment = fontInfo.alignment
      }

      if (fontInfo.level !== undefined) {
        paragraph.level = fontInfo.level
      }

      if (fontInfo.line_spacing !== undefined) {
        paragraph.line_spacing = fontInfo.line_spacing
      }

      if (fontInfo.space_before !== undefined) {
        paragraph.space_before = fontInfo.space_before
      }

      if (fontInfo.space_after !== undefined) {
        paragraph.space_after = fontInfo.space_after
      }
    }

    // 文本框级别属性
    if (fontInfo.word_wrap !== undefined) {
      textFrame.word_wrap = fontInfo.word_wrap
    }

    if (fontInfo.auto_size !== undefined) {
      textFrame.auto_size = fontInfo.auto_size
    }

    if (fontInfo.vertical_anchor !== undefined) {
      textFrame.vertical_anchor = fontInfo.vertical_anchor
    }

    if (fontInfo.margin_left !== undefined) {
      textFrame.margin_left = fontInfo.margin_left
    }

    if (fontInfo.margin_right !== undefined) {
      textFrame.margin_right = fontInfo.margin_right
    }

    if (fontInfo.margin_top !== undefined) {
      textFrame.margin_top = fontInfo.margin_top
    }

    if (fontInfo.margin_bottom !== undefined) {
      textFrame.margin_bottom = fontInfo.margin_bottom
    }
  } catch (error) {
    console.warn(`Failed to apply font info: ${error}`)
  }
}

/**
 * 还原文本到演示文稿 (对应 Python restore_text_to_presentation)
 *
 * 这是核心还原逻辑的 TypeScript 版本。
 * 由于缺少 python-pptx 的完整等效库，实际实现需要：
 * 1. 使用 Python 互操作 (当前方案)
 * 2. 或者直接操作 PPTX 的 XML 结构
 * 3. 或者等待社区开发完整的 TypeScript PPTX 库
 *
 * @param presentation - 演示文稿对象
 * @param translatedElements - 翻译后的元素数组
 */
export async function restoreTextToPresentation(
  presentation: any,
  translatedElements: TranslatedPPTXElement[]
): Promise<void> {
  for (const element of translatedElements) {
    try {
      const { translatedText, position, metadata } = element
      const [slideNumber, shapeIndex] = position
      const { shape_type, table_info, font_info } = metadata

      // 获取幻灯片
      const slide = presentation.slides[slideNumber]
      if (!slide) {
        console.error(`Slide ${slideNumber} not found`)
        continue
      }

      // 获取形状 (处理嵌套)
      const shape = getNestedShape(
        slide,
        typeof shapeIndex === 'number' ? shapeIndex : shapeIndex
      )

      // 根据形状类型还原文本
      if (shape_type.includes('TABLE') && table_info) {
        // 表格单元格
        const cell = shape.table.cell(table_info.row, table_info.col)
        cell.text = translatedText
        applyFontInfo(cell.text_frame, font_info)
      } else if (shape_type.includes('CHART')) {
        // 图表标题
        if (shape.has_title) {
          shape.chart_title.text_frame.text = translatedText
          applyFontInfo(shape.chart_title.text_frame, font_info)
        }
      } else if (shape.text !== undefined) {
        // 普通文本形状
        shape.text = translatedText
        if (shape.text_frame) {
          applyFontInfo(shape.text_frame, font_info)
        }
      } else {
        console.warn(`Cannot handle shape type: ${shape_type} at ${formatPosition(position)}`)
      }
    } catch (error) {
      console.error(`Error restoring text at ${formatPosition(element.position)}: ${error}`)
    }
  }
}

/**
 * 导出主函数
 */
export default {
  generateTranslatedPPTX,
  generatePPTXWithPptxGenJS,
  restoreTextToPresentation,
  getNestedShape,
  applyFontInfo,
}
