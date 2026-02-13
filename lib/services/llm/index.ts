/**
 * LLM 翻译服务统一入口
 */

export * from './types'
export * from './openai'
export * from './claude'

import { LLMTranslateService, LLMProvider } from './types'
import { OpenAITranslateService } from './openai'
import { ClaudeTranslateService } from './claude'

/**
 * LLM 服务工厂函数
 */
export function createLLMService(
  provider: LLMProvider | string,
  apiKey?: string
): LLMTranslateService {
  switch (provider.toLowerCase()) {
    case 'openai':
    case 'gpt':
      return new OpenAITranslateService(apiKey)

    case 'claude':
    case 'anthropic':
      return new ClaudeTranslateService(apiKey)

    case 'moonshot':
      // TODO: 实现 Moonshot 服务
      throw new Error('Moonshot service not implemented yet')

    case 'siliconflow':
      // TODO: 实现 SiliconFlow 服务
      throw new Error('SiliconFlow service not implemented yet')

    default:
      // 默认使用 OpenAI
      console.warn(`Unknown LLM provider: ${provider}, falling back to OpenAI`)
      return new OpenAITranslateService(apiKey)
  }
}

/**
 * 根据模型名称推断提供商
 */
export function inferProviderFromModel(model: string): LLMProvider {
  const modelLower = model.toLowerCase()

  if (modelLower.includes('gpt') || modelLower.includes('o1')) {
    return 'openai'
  }

  if (modelLower.includes('claude')) {
    return 'claude'
  }

  if (modelLower.includes('moonshot')) {
    return 'moonshot'
  }

  if (modelLower.includes('deepseek') || modelLower.includes('qwen')) {
    return 'siliconflow'
  }

  // 默认 OpenAI
  return 'openai'
}

/**
 * 便捷函数：根据模型创建服务
 */
export function createServiceFromModel(model: string, apiKey?: string): LLMTranslateService {
  const provider = inferProviderFromModel(model)
  return createLLMService(provider, apiKey)
}
