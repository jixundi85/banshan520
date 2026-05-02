import 'dotenv/config'

// Groq API 配置
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * 调用大模型 API
 * @param {Array} messages - 消息数组 [{role: 'user'|'assistant'|'system', content: string}]
 * @param {Object} options - 配置选项
 * @returns {Promise<string>} - 返回 AI 回复
 */
export async function callAI(messages, options = {}) {
  const apiKey = process.env.GROQ_API_KEY
  
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('请先配置 GROQ_API_KEY！\n访问 https://console.groq.com/keys 注册并获取 API Key')
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',  // 免费模型，速度快
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      top_p: 0.95
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Groq API 错误: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

/**
 * 创建系统提示词
 */
export function createSystemPrompt(context = '') {
  return `你是半山AIX平台的智能客服助手"半山小助手"。

【平台介绍】
半山AIX实验室是半山碳硅共生研究院旗下专注于AI企业诊断、OPC智能匹配、创作者孵化的核心平台。
OPC（Original Producer Creator）是原创内容生产者创作者，包括AI视频、AI广告电影、AI设计师、AI短剧漫剧、AI文旅宣传片等领域的专业创作者。

【回答规范】
1. 回答简洁专业，控制在100字以内
2. 如涉及价格、具体方案，建议用户联系客服获取详情
3. 如果不知道答案，诚实告知并引导联系人工客服
4. 保持友好、专业的语气

${context ? '【相关知识】\n' + context : ''}

【开场白】
您好！我是半山AI助手，有什么可以帮您的吗？`
}

/**
 * 估算 token 数量（简单估算）
 */
export function estimateTokens(text) {
  // 简单估算：中文约2字符=1 token，英文约4字符=1 token
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const otherChars = text.length - chineseChars
  return Math.ceil(chineseChars / 2 + otherChars / 4)
}
