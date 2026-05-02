/**
 * 综合AI服务层 - 接入国内外主流大模型
 * 支持：OpenAI GPT、Anthropic Claude、Google Gemini、Meta Llama、通义千问、文心一言、智谱GLM、讯飞星火、混元、豆包等
 */

// ==================== 环境配置 ====================
const ENV = {
  // OpenAI (GPT-4, GPT-4o, DALL-E, Sora)
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  OPENAI_BASE_URL: import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1',
  
  // Anthropic (Claude 3.5)
  ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  
  // Google Gemini
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  GEMINI_BASE_URL: import.meta.env.VITE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
  
  // 通义千问（阿里云）
  QWEN_API_KEY: import.meta.env.VITE_QWEN_API_KEY || '',
  QWEN_BASE_URL: import.meta.env.VITE_QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  
  // 智谱GLM
  ZHIPU_API_KEY: import.meta.env.VITE_ZHIPU_API_KEY || '',
  ZHIPU_BASE_URL: import.meta.env.VITE_ZHIPU_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4',
  
  // 百度文心一言
  ERNIE_API_KEY: import.meta.env.VITE_ERNIE_API_KEY || '',
  ERNIE_SECRET_KEY: import.meta.env.VITE_ERNIE_SECRET_KEY || '',
  
  // 讯飞星火
  XUNFEI_APP_ID: import.meta.env.VITE_XUNFEI_APP_ID || '',
  XUNFEI_API_KEY: import.meta.env.VITE_XUNFEI_API_KEY || '',
  XUNFEI_API_SECRET: import.meta.env.VITE_XUNFEI_API_SECRET || '',
  
  // 腾讯混元
  HUNYUAN_APP_ID: import.meta.env.VITE_HUNYUAN_APP_ID || '',
  HUNYUAN_SECRET_ID: import.meta.env.VITE_HUNYUAN_SECRET_ID || '',
  HUNYUAN_SECRET_KEY: import.meta.env.VITE_HUNYUAN_SECRET_KEY || '',
  
  // 豆包（火山引擎）
  DOUBAO_API_KEY: import.meta.env.VITE_DOUBAO_API_KEY || '',
  
  // Stability AI
  STABILITY_API_KEY: import.meta.env.VITE_STABILITY_API_KEY || '',
  
  // Pollinations (免费，无需Key)
  USE_POLLINATIONS: true
}

// ==================== 模型定义 ====================
export const AI_MODELS = {
  // === OpenAI 系列 ===
  openai: {
    gpt4o: { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', type: 'chat', maxTokens: 128000 },
    gpt4: { id: 'gpt-4', name: 'GPT-4', provider: 'openai', type: 'chat', maxTokens: 128000 },
    gpt4turbo: { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', type: 'chat', maxTokens: 128000 },
    gpt35turbo: { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', type: 'chat', maxTokens: 16385 },
    dall_e3: { id: 'dall-e-3', name: 'DALL-E 3', provider: 'openai', type: 'image' },
    dall_e2: { id: 'dall-e-2', name: 'DALL-E 2', provider: 'openai', type: 'image' },
    sora: { id: 'sora', name: 'Sora', provider: 'openai', type: 'video' }
  },
  
  // === Anthropic 系列 ===
  claude: {
    claude35sonnet: { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic', type: 'chat', maxTokens: 200000 },
    claude3opus: { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic', type: 'chat', maxTokens: 200000 },
    claude3sonnet: { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'anthropic', type: 'chat', maxTokens: 200000 },
    claude3haiku: { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'anthropic', type: 'chat', maxTokens: 200000 }
  },
  
  // === Google Gemini 系列 ===
  gemini: {
    gemini2flash: { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', provider: 'gemini', type: 'chat', maxTokens: 1000000 },
    gemini15pro: { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'gemini', type: 'chat', maxTokens: 2000000 },
    gemini15flash: { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'gemini', type: 'chat', maxTokens: 1000000 },
    gemini1pro: { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', provider: 'gemini', type: 'chat', maxTokens: 32768 }
  },
  
  // === 通义千问系列 ===
  qwen: {
    qwen2_72b: { id: 'qwen2-72b-instruct', name: 'Qwen2-72B', provider: 'qwen', type: 'chat', maxTokens: 32000 },
    qwen2_57b: { id: 'qwen2-57b-a14b-instruct', name: 'Qwen2-57B', provider: 'qwen', type: 'chat', maxTokens: 32000 },
    qwenplus: { id: 'qwen-plus', name: 'Qwen Plus', provider: 'qwen', type: 'chat', maxTokens: 32000 },
    qwenturbo: { id: 'qwen-turbo', name: 'Qwen Turbo', provider: 'qwen', type: 'chat', maxTokens: 8000 },
    qwenmax: { id: 'qwen-max', name: 'Qwen Max', provider: 'qwen', type: 'chat', maxTokens: 8000 },
    qwenvlmax: { id: 'qwen-vl-max', name: 'Qwen-VL-Max', provider: 'qwen', type: 'vision', maxTokens: 8000 },
    qwenimg: { id: 'qwen-vl-plus', name: 'Qwen-VL-Plus', provider: 'qwen', type: 'vision', maxTokens: 4000 }
  },
  
  // === 智谱GLM系列 ===
  zhipu: {
    glm4: { id: 'glm-4', name: 'GLM-4', provider: 'zhipu', type: 'chat', maxTokens: 128000 },
    glm4plus: { id: 'glm-4-plus', name: 'GLM-4 Plus', provider: 'zhipu', type: 'chat', maxTokens: 128000 },
    glm4v: { id: 'glm-4v', name: 'GLM-4V', provider: 'zhipu', type: 'vision', maxTokens: 4000 },
    glm3turbo: { id: 'glm-3-turbo', name: 'GLM-3 Turbo', provider: 'zhipu', type: 'chat', maxTokens: 128000 }
  },
  
  // === 文心一言系列 ===
  ernie: {
    ernie4: { id: 'ernie-4.0-8k-latest', name: 'ERNIE 4.0', provider: 'ernie', type: 'chat', maxTokens: 8000 },
    ernie35: { id: 'ernie-3.5-8k', name: 'ERNIE 3.5', provider: 'ernie', type: 'chat', maxTokens: 8000 },
    ernievl: { id: 'ernie-4.0-8k-vip', name: 'ERNIE-4.0-VIP', provider: 'ernie', type: 'vision', maxTokens: 8000 }
  },
  
  // === 讯飞星火系列 ===
  xunfei: {
    spark4: { id: 'generalv4.0', name: '星火大模型4.0', provider: 'xunfei', type: 'chat', maxTokens: 8192 },
    spark35: { id: 'generalv3.5', name: '星火大模型3.5', provider: 'xunfei', type: 'chat', maxTokens: 8192 },
    spark32: { id: 'generalv3.0', name: '星火大模型3.0', provider: 'xunfei', type: 'chat', maxTokens: 8192 }
  },
  
  // === 混元系列 ===
  hunyuan: {
    hunyuanpro: { id: 'hunyuan-pro', name: '混元-Pro', provider: 'hunyuan', type: 'chat', maxTokens: 128000 },
    hunyuanstandard: { id: 'hunyuan-standard', name: '混元-Standard', provider: 'hunyuan', type: 'chat', maxTokens: 128000 },
    hunyuanlite: { id: 'hunyuan-lite', name: '混元-Lite', provider: 'hunyuan', type: 'chat', maxTokens: 128000 }
  },
  
  // === 豆包系列 ===
  doubao: {
    doubaoPro: { id: 'doubao-pro-32k', name: '豆包 Pro', provider: 'doubao', type: 'chat', maxTokens: 32000 },
    doubaoLite: { id: 'doubao-lite-32k', name: '豆包 Lite', provider: 'doubao', type: 'chat', maxTokens: 32000 },
    doubaoVision: { id: 'doubao-vision-pro', name: '豆包视觉', provider: 'doubao', type: 'vision', maxTokens: 4000 }
  },
  
  // === 图像生成 ===
  image: {
    pollinations: { id: 'flux', name: 'Pollinations Flux (免费)', provider: 'pollinations', type: 'image' },
    stability: { id: 'sdxl', name: 'Stable Diffusion XL', provider: 'stability', type: 'image' },
    dalle3: { id: 'dall-e-3', name: 'DALL-E 3', provider: 'openai', type: 'image' }
  },

  // === 视频生成 ===
  video: {
    kling: { id: 'kling', name: '可灵 AI (快手)', provider: 'kling', type: 'video', duration: '5s' },
    haibo: { id: 'haibo', name: '海螺 AI (字节)', provider: 'haibo', type: 'video', duration: '6s' },
    jimeng: { id: 'jimeng', name: '即梦 (字节)', provider: 'jimeng', type: 'video', duration: '3s' },
    gen3: { id: 'gen3', name: 'Runway Gen-3', provider: 'runway', type: 'video', duration: '10s' },
    pika: { id: 'pika', name: 'Pika 1.5', provider: 'pika', type: 'video', duration: '3s' },
    luma: { id: 'luma', name: 'Luma Dream Machine', provider: 'luma', type: 'video', duration: '5s' },
    cogvidex: { id: 'cogvidex', name: 'CogVideoX (智谱)', provider: 'cogvideo', type: 'video', duration: '6s' },
    hunyuan_video: { id: 'hunyuan_video', name: '混元视频 (腾讯)', provider: 'hunyuan', type: 'video', duration: '5s' }
  },

  // === 语音合成 ===
  tts: {
    openai_tts: { id: 'tts-1', name: 'OpenAI TTS', provider: 'openai', type: 'tts' },
    azure_tts: { id: 'azure', name: 'Azure 语音', provider: 'azure', type: 'tts' },
    minimax_tts: { id: 'minimax', name: 'MiniMax 语音', provider: 'minimax', type: 'tts' },
    fish_tts: { id: 'fish', name: 'Fish TTS', provider: 'fish', type: 'tts' },
    cosyvoice: { id: 'cosyvoice', name: 'CosyVoice (阿里)', provider: 'cosyvoice', type: 'tts' }
  }
}

// ==================== 统一聊天接口 ====================
export async function chatWithModel(modelId, messages, options = {}) {
  const model = findModel(modelId)
  if (!model) throw new Error(`未知模型: ${modelId}`)
  
  switch (model.provider) {
    case 'openai':
      return openaiChat(model.id, messages, options)
    case 'anthropic':
      return anthropicChat(model.id, messages, options)
    case 'gemini':
      return geminiChat(model.id, messages, options)
    case 'qwen':
      return qwenChat(model.id, messages, options)
    case 'zhipu':
      return zhipuChat(model.id, messages, options)
    case 'doubao':
      return doubaoChat(model.id, messages, options)
    default:
      throw new Error(`暂不支持 ${model.provider} 模型`)
  }
}

function findModel(modelId) {
  const allModels = [
    ...Object.values(AI_MODELS.openai),
    ...Object.values(AI_MODELS.claude),
    ...Object.values(AI_MODELS.gemini),
    ...Object.values(AI_MODELS.qwen),
    ...Object.values(AI_MODELS.zhipu),
    ...Object.values(AI_MODELS.ernie),
    ...Object.values(AI_MODELS.xunfei),
    ...Object.values(AI_MODELS.hunyuan),
    ...Object.values(AI_MODELS.doubao),
    ...Object.values(AI_MODELS.image),
    ...Object.values(AI_MODELS.video),
    ...Object.values(AI_MODELS.tts)
  ]
  return allModels.find(m => m.id === modelId)
}

// ==================== OpenAI 接口 ====================
async function openaiChat(model, messages, options = {}) {
  if (!ENV.OPENAI_API_KEY) {
    throw new Error('需要配置 OPENAI_API_KEY')
  }
  
  const response = await fetch(`${ENV.OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENV.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4000,
      ...options.extra
    })
  })
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `OpenAI API 错误: ${response.status}`)
  }
  
  return response.json()
}

// ==================== Anthropic 接口 ====================
async function anthropicChat(model, messages, options = {}) {
  if (!ENV.ANTHROPIC_API_KEY) {
    throw new Error('需要配置 ANTHROPIC_API_KEY')
  }
  
  // Anthropic 需要特殊的消息格式
  const systemPrompt = messages.find(m => m.role === 'system')
  const chatMessages = messages.filter(m => m.role !== 'system')
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ENV.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model,
      max_tokens: options.maxTokens ?? 4096,
      system: systemPrompt?.content,
      messages: chatMessages,
      temperature: options.temperature ?? 0.7
    })
  })
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Anthropic API 错误: ${response.status}`)
  }
  
  const data = await response.json()
  return {
    choices: [{
      message: { role: 'assistant', content: data.content[0].text }
    }]
  }
}

// ==================== Google Gemini 接口 ====================
async function geminiChat(model, messages, options = {}) {
  if (!ENV.GEMINI_API_KEY) {
    throw new Error('需要配置 GEMINI_API_KEY')
  }
  
  // 转换消息格式
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  
  const systemInstruction = messages.find(m => m.role === 'system')?.content
  
  const response = await fetch(
    `${ENV.GEMINI_BASE_URL}/models/${model}:generateContent?key=${ENV.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 4096
        }
      })
    }
  )
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Gemini API 错误: ${response.status}`)
  }
  
  const data = await response.json()
  return {
    choices: [{
      message: { role: 'assistant', content: data.candidates?.[0]?.content?.parts?.[0]?.text || '' }
    }]
  }
}

// ==================== 通义千问接口 ====================
async function qwenChat(model, messages, options = {}) {
  if (!ENV.QWEN_API_KEY) {
    throw new Error('需要配置 QWEN_API_KEY')
  }
  
  const response = await fetch(`${ENV.QWEN_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENV.QWEN_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4000
    })
  })
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `通义千问 API 错误: ${response.status}`)
  }
  
  return response.json()
}

// ==================== 智谱GLM接口 ====================
async function zhipuChat(model, messages, options = {}) {
  if (!ENV.ZHIPU_API_KEY) {
    throw new Error('需要配置 ZHIPU_API_KEY')
  }
  
  const response = await fetch(`${ENV.ZHIPU_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENV.ZHIPU_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages
    })
  })
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `智谱 API 错误: ${response.status}`)
  }
  
  return response.json()
}

// ==================== 豆包接口 ====================
async function doubaoChat(model, messages, options = {}) {
  if (!ENV.DOUBAO_API_KEY) {
    throw new Error('需要配置 DOUBAO_API_KEY')
  }
  
  const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENV.DOUBAO_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7
    })
  })
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `豆包 API 错误: ${response.status}`)
  }
  
  return response.json()
}

// ==================== 图像生成接口 ====================
export async function generateImage(prompt, options = {}) {
  const { provider = 'pollinations', width = 1024, height = 1024, model = 'flux' } = options
  
  switch (provider) {
    case 'pollinations':
      return generateByPollinations(prompt, { width, height, model })
    case 'stability':
      return generateByStability(prompt, { width, height })
    case 'dalle':
      return generateByDalle(prompt, { size: `${width}x${height}` })
    default:
      return generateByPollinations(prompt, { width, height, model })
  }
}

async function generateByPollinations(prompt, options = {}) {
  // 每次生成都使用新的随机 seed
  const { width = 1024, height = 1024, model = 'flux', seed = Math.floor(Math.random() * 1000000) } = options
  
  // Pollinations 正确 URL 格式: /prompt/{encoded_prompt}?width=&height=&seed=&model=
  const encodedPrompt = encodeURIComponent(prompt)
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&seed=${seed}&nolog=true`
  
  return {
    imageUrl,
    seed,
    provider: 'pollinations',
    prompt,
    width,
    height,
    success: true
  }
}

async function generateByStability(prompt, options = {}) {
  if (!ENV.STABILITY_API_KEY) {
    console.warn('Stability API Key 未配置，切换到 Pollinations')
    return generateByPollinations(prompt, options)
  }
  
  const { width = 1024, height = 1024 } = options
  
  const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENV.STABILITY_API_KEY}`
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt }],
      cfg_scale: 7,
      height,
      width,
      samples: 1
    })
  })
  
  if (!response.ok) {
    throw new Error(`Stability API 错误: ${response.status}`)
  }
  
  const data = await response.json()
  return {
    imageUrl: `data:image/png;base64,${data.artifacts[0].base64}`,
    seed: data.artifacts[0].seed,
    provider: 'stability',
    success: true
  }
}

async function generateByDalle(prompt, options = {}) {
  if (!ENV.OPENAI_API_KEY) {
    throw new Error('需要配置 OPENAI_API_KEY 使用 DALL-E')
  }
  
  const { size = '1024x1024' } = options
  
  const response = await fetch(`${ENV.OPENAI_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENV.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      size,
      quality: 'standard',
      n: 1
    })
  })
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `DALL-E API 错误: ${response.status}`)
  }
  
  const data = await response.json()
  return {
    imageUrl: data.data[0].url,
    provider: 'dall-e-3',
    revisedPrompt: data.data[0].revised_prompt,
    success: true
  }
}

// ==================== 视频生成接口 ====================
export async function generateVideo(imageUrl, prompt, options = {}) {
  const { model = 'kling', duration = 5, aspectRatio = '16:9' } = options
  
  // 从localStorage读取配置
  const savedConfig = localStorage.getItem('ai_api_config') || '{}'
  const config = JSON.parse(savedConfig)
  
  // 映射模型到实际API
  const modelMap = {
    kling: { name: '可灵 AI', apiKey: config.kling, endpoint: 'https://api.klingai.com' },
    haibo: { name: '海螺 AI', apiKey: config.haibo, endpoint: 'https://ark.cn-beijing.volces.com' },
    jimeng: { name: '即梦', apiKey: config.jimeng, endpoint: 'https://ark.cn-beijing.volces.com' },
    cogvidex: { name: 'CogVideoX', apiKey: config.zhipu || ENV.ZHIPU_API_KEY, endpoint: ENV.ZHIPU_BASE_URL },
    hunyuan_video: { name: '混元视频', apiKey: config.hunyuan || ENV.HUNYUAN_SECRET_KEY, endpoint: '' },
    runway: { name: 'Runway Gen-3', apiKey: config.runway, endpoint: 'https://api.dev.runwayml.com' },
    pika: { name: 'Pika', apiKey: config.pika, endpoint: 'https://api.pika.art' },
    luma: { name: 'Luma', apiKey: config.luma, endpoint: 'https://api.lumalabs.ai' }
  }
  
  const selectedModel = modelMap[model] || modelMap.kling
  
  // 如果没有配置API Key，返回演示结果
  if (!selectedModel.apiKey) {
    console.warn(`[${selectedModel.name}] 未配置API Key，返回演示结果`)
    return {
      success: true,
      mock: true,
      model: selectedModel.name,
      modelId: model,
      message: `当前使用 ${selectedModel.name}（需配置API Key）`,
      imageUrl: imageUrl,
      prompt: prompt,
      duration: duration,
      note: '演示模式：配置API Key后可生成真实视频'
    }
  }
  
  // 根据不同模型调用对应API
  try {
    switch (model) {
      case 'kling':
        return await generateByKling(imageUrl, prompt, duration, selectedModel.apiKey, aspectRatio)
      case 'haibo':
      case 'jimeng':
        return await generateByByteDance(imageUrl, prompt, duration, selectedModel.apiKey, model)
      case 'cogvidex':
        return await generateByCogVideoX(imageUrl, prompt, duration, selectedModel.apiKey)
      case 'luma':
        return await generateByLuma(imageUrl, prompt, duration, selectedModel.apiKey)
      default:
        throw new Error(`暂不支持 ${selectedModel.name}`)
    }
  } catch (error) {
    console.error(`[${selectedModel.name}] API调用失败:`, error)
    // 返回带错误信息的演示结果
    return {
      success: false,
      mock: true,
      model: selectedModel.name,
      modelId: model,
      error: error.message,
      imageUrl: imageUrl,
      prompt: prompt,
      note: `API调用失败，请检查 ${selectedModel.name} API Key 配置`
    }
  }
}

// 可灵AI视频生成
async function generateByKling(imageUrl, prompt, duration, apiKey, aspectRatio) {
  // 可灵API调用示例（需适配实际API）
  const response = await fetch('https://api.klingai.com/v1/video/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      image_url: imageUrl,
      prompt: prompt,
      duration: duration,
      aspect_ratio: aspectRatio
    })
  })
  
  if (!response.ok) {
    throw new Error(`可灵API错误: ${response.status}`)
  }
  
  const data = await response.json()
  return {
    success: true,
    videoId: data.video_id,
    videoUrl: data.video_url,
    model: '可灵 AI',
    duration: duration
  }
}

// 字节系视频生成（海螺/即梦）
async function generateByByteDance(imageUrl, prompt, duration, apiKey, model) {
  const modelName = model === 'haibo' ? '海螺 AI' : '即梦'
  
  // 火山引擎API格式
  const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/video/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      input: {
        image_url: imageUrl,
        prompt: prompt
      },
      parameters: {
        duration: duration
      }
    })
  })
  
  if (!response.ok) {
    throw new Error(`${modelName} API错误: ${response.status}`)
  }
  
  const data = await response.json()
  return {
    success: true,
    taskId: data.id,
    videoUrl: data.data?.video_url,
    model: modelName,
    duration: duration
  }
}

// CogVideoX视频生成
async function generateByCogVideoX(imageUrl, prompt, duration, apiKey) {
  const response = await fetch(`${ENV.ZHIPU_BASE_URL}/video/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'cogvideox',
      image_url: imageUrl,
      prompt: prompt
    })
  })
  
  if (!response.ok) {
    throw new Error(`CogVideoX API错误: ${response.status}`)
  }
  
  const data = await response.json()
  return {
    success: true,
    taskId: data.id,
    videoUrl: data.video_url,
    model: 'CogVideoX (智谱)',
    duration: duration
  }
}

// Luma Dream Machine
async function generateByLuma(imageUrl, prompt, duration, apiKey) {
  const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: prompt,
      image_url: imageUrl
    })
  })
  
  if (!response.ok) {
    throw new Error(`Luma API错误: ${response.status}`)
  }
  
  const data = await response.json()
  return {
    success: true,
    generationId: data.id,
    videoUrl: data.assets?.video,
    model: 'Luma Dream Machine',
    duration: duration
  }
}

// ==================== 剧本/广告生成专用 ====================
export async function generateScript(theme, type = 'drama', modelId = 'glm-4') {
  const prompts = {
    drama: `请根据以下主题创作一个精彩的AI短剧剧本，要求：
1. 适合1-3分钟短视频
2. 有明确的开端、发展、高潮、结局
3. 有人物对白和动作指示
4. 结尾有反转或情感共鸣
5. 总字数800-1500字

主题：${theme}`,
    
    advertisement: `请根据以下产品创作一个30秒广告脚本，要求：
1. 前3秒有强力钩子吸引眼球
2. 突出产品核心卖点
3. 有情感共鸣或幽默元素
4. 结尾有明确行动号召（CTA）
5. 格式包含画面描述和配音文案

产品：${theme}`,
    
    story: `请根据以下主题创作一个引人入胜的故事，要求：
1. 有清晰的故事线和人物动机
2. 情节有冲突和转折
3. 结尾有惊喜或深意
4. 适合AI视频制作
5. 总字数1000-2000字

主题：${theme}`
  }
  
  const response = await chatWithModel(modelId, [
    { role: 'user', content: prompts[type] || prompts.drama }
  ])
  
  return response.choices?.[0]?.message?.content || ''
}

// ==================== 快捷调用函数 ====================
export const aiService = {
  // 通用聊天
  chat: chatWithModel,
  
  // 图像生成
  image: generateImage,
  
  // 视频生成
  video: generateVideo,
  
  // 剧本/广告生成
  script: generateScript,
  
  // 快捷调用 - 按模型系列
  gpt: (messages, options) => chatWithModel('gpt-4o', messages, options),
  claude: (messages, options) => chatWithModel('claude-3-5-sonnet-20241022', messages, options),
  gemini: (messages, options) => chatWithModel('gemini-1.5-pro', messages, options),
  qwen: (messages, options) => chatWithModel('qwen-plus', messages, options),
  zhipu: (messages, options) => chatWithModel('glm-4', messages, options),
  doubao: (messages, options) => chatWithModel('doubao-pro-32k', messages, options),
  
  // 创意写作
  creative: async (theme, type, modelId) => generateScript(theme, type, modelId),
  
  // 获取可用模型列表
  getModels: () => AI_MODELS,
  
  // 检查API配置状态
  checkConfig: () => {
    const savedConfig = localStorage.getItem('ai_api_config') || '{}'
    const config = JSON.parse(savedConfig)
    return {
      openai: !!ENV.OPENAI_API_KEY || !!config.openai,
      anthropic: !!ENV.ANTHROPIC_API_KEY || !!config.anthropic,
      gemini: !!ENV.GEMINI_API_KEY || !!config.gemini,
      qwen: !!ENV.QWEN_API_KEY || !!config.qwen,
      zhipu: !!ENV.ZHIPU_API_KEY || !!config.zhipu,
      doubao: !!ENV.DOUBAO_API_KEY || !!config.doubao,
      stability: !!ENV.STABILITY_API_KEY || !!config.stability,
      pollinations: ENV.USE_POLLINATIONS,
      // 视频模型
      kling: !!config.kling,
      haibo: !!config.haibo,
      jimeng: !!config.jimeng,
      cogvideo: !!config.zhipu || !!ENV.ZHIPU_API_KEY,
      hunyuan: !!config.hunyuan,
      luma: !!config.luma,
      runway: !!config.runway,
      pika: !!config.pika
    }
  },
  
  // 获取所有可用模型（按类别）
  getModelsByCategory: () => ({
    chat: [
      ...Object.values(AI_MODELS.openai).filter(m => m.type === 'chat'),
      ...Object.values(AI_MODELS.claude),
      ...Object.values(AI_MODELS.gemini),
      ...Object.values(AI_MODELS.qwen),
      ...Object.values(AI_MODELS.zhipu),
      ...Object.values(AI_MODELS.doubao)
    ],
    image: Object.values(AI_MODELS.image),
    video: Object.values(AI_MODELS.video),
    tts: Object.values(AI_MODELS.tts)
  })
}

export default aiService
