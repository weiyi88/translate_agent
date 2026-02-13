/**
 * DOCX 服务统一入口
 */

export * from './types'
export * from './parser'
export * from './generator'

// 便捷导出
export { parseDocx, getTranslatableSegments } from './parser'
export { generateTranslatedDocx } from './generator'
