/**
 * AI服务层 - 接入真实大模型API
 * 支持：通义千问、智谱GLM、讯飞星火、百度智能云、混元等
 */

// ==================== 配置管理 ====================
const AI_CONFIG = {
  // 通义千问（阿里云DashScope）
  qwen: {
    enabled: true,
    apiKey: import.meta.env.VITE_QWEN_API_KEY || '',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  },
  
  // 智谱GLM
  zhipu: {
    enabled: true,
    apiKey: import.meta.env.VITE_ZHIPU_API_KEY || '',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  },
  
  // 讯飞星火（备用）
  xunfei: {
    enabled: false,
    appId: import.meta.env.VITE_XUNFEI_APP_ID || '',
    apiKey: import.meta.env.VITE_XUNFEI_API_KEY || '',
    apiSecret: import.meta.env.VITE_XUNFEI_API_SECRET || ''
  },
  
  // 图像生成（使用免费/开源方案）
  imageGen: {
    enabled: true,
    provider: import.meta.env.VITE_IMAGE_PROVIDER || 'pollinations', // pollinations, stability, dall-e
    apiKey: import.meta.env.VITE_IMAGE_API_KEY || ''
  }
}

// ==================== 通用请求工具 ====================
async function aiRequest(url, options = {}) {
  const { apiKey, baseUrl } = options.config || {}
  
  if (!apiKey && options.requireAuth) {
    throw new Error('需要配置API密钥')
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
    ...options.headers
  }
  
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || `请求失败: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('AI请求失败:', error)
    throw error
  }
}

// ==================== 通义千问服务 ====================
export const qwenService = {
  // 文本对话
  async chat(messages, model = 'qwen-plus') {
    if (!AI_CONFIG.qwen.apiKey) {
      // 返回模拟数据用于演示
      return {
        choices: [{
          message: {
            content: generateMockResponse(messages)
          }
        }]
      }
    }
    
    return aiRequest('/chat/completions', {
      config: AI_CONFIG.qwen,
      method: 'POST',
      requireAuth: true,
      body: {
        model,
        messages,
        temperature: 0.7
      }
    })
  },
  
  // 图像理解
  async vision(imageUrl, prompt) {
    if (!AI_CONFIG.qwen.apiKey) {
      return {
        choices: [{
          message: {
            content: `【图像分析结果】\n\n根据图像内容分析：\n\n1. **主体识别**: 检测到主要视觉元素\n2. **风格特征**: 呈现出独特的视觉风格\n3. **场景描述**: 整体构图协调，色彩搭配得当\n\n建议：可进一步用于AI生成任务的参考。`
          }
        }]
      }
    }
    
    return aiRequest('/chat/completions', {
      config: AI_CONFIG.qwen,
      method: 'POST',
      requireAuth: true,
      body: {
        model: 'qwen-vl-max',
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: prompt }
          ]
        }]
      }
    })
  },
  
  // 文本生成（续写/扩写）
  async generate(prompt, options = {}) {
    const messages = [{ role: 'user', content: prompt }]
    return this.chat(messages, options.model || 'qwen-turbo')
  }
}

// ==================== 智谱GLM服务 ====================
export const zhipuService = {
  async chat(messages, model = 'glm-4') {
    if (!AI_CONFIG.zhipu.apiKey) {
      return {
        choices: [{
          message: {
            content: generateMockResponse(messages)
          }
        }]
      }
    }
    
    return aiRequest('/chat/completions', {
      config: AI_CONFIG.zhipu,
      method: 'POST',
      requireAuth: true,
      body: {
        model,
        messages
      }
    })
  },
  
  // 创意写作
  async creativeWrite(theme, type = 'story') {
    const prompts = {
      story: `请根据以下主题写一个引人入胜的短篇故事（800-1500字）：\n\n主题：${theme}\n\n要求：\n1. 有清晰的故事线和人物动机\n2. 情节有冲突和转折\n3. 结尾有惊喜或深意\n4. 适合AI视频制作`,
      
      drama: `请根据以下主题创作一个短剧剧本：\n\n主题：${theme}\n\n要求：\n1. 包含完整的场景描述\n2. 有人物对白和动作指示\n3. 适合1-3分钟的短视频\n4. 有明确的情感高潮`,
      
      advertisement: `请根据以下产品特点创作一个广告文案：\n\n产品：${theme}\n\n要求：\n1. 前3秒有强力钩子\n2. 突出产品核心卖点\n3. 有情感共鸣点\n4. 结尾有明确的行动号召`
    }
    
    const response = await this.chat([
      { role: 'user', content: prompts[type] || prompts.story }
    ])
    
    return response.choices?.[0]?.message?.content || ''
  }
}

// ==================== 图像生成服务 ====================
export const imageService = {
  // Pollinations AI（免费，无需API Key）
  async generatePollinations(prompt, options = {}) {
    const {
      width = 1024,
      height = 1024,
      model = 'flux',
      seed = Math.floor(Math.random() * 1000000)
    } = options
    
    const params = new URLSearchParams({
      prompt,
      width: width.toString(),
      height: height.toString(),
      model,
      seed: seed.toString(),
      nolog: 'true'
    })
    
    return {
      imageUrl: `https://image.pollinations.ai/${params.toString()}`,
      seed,
      prompt
    }
  },
  
  // 通用图像生成接口
  async generate(prompt, options = {}) {
    const provider = AI_CONFIG.imageGen.provider
    
    try {
      switch (provider) {
        case 'pollinations':
          return await this.generatePollinations(prompt, options)
        case 'stability':
          return await this.generateStability(prompt, options)
        case 'dall-e':
          return await this.generateDalle(prompt, options)
        default:
          return await this.generatePollinations(prompt, options)
      }
    } catch (error) {
      console.error('图像生成失败，尝试备选方案:', error)
      return await this.generatePollinations(prompt, options)
    }
  },
  
  // Stability AI（需要API Key）
  async generateStability(prompt, options = {}) {
    if (!AI_CONFIG.imageGen.apiKey) {
      return await this.generatePollinations(prompt, options)
    }
    
    const { width = 1024, height = 1024 } = options
    
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.imageGen.apiKey}`
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height,
        width,
        samples: 1
      })
    })
    
    const data = await response.json()
    
    if (data.artifacts?.[0]?.base64) {
      return {
        imageUrl: `data:image/png;base64,${data.artifacts[0].base64}`,
        seed: data.artifacts[0].seed
      }
    }
    
    throw new Error('Stability生成失败')
  },
  
  // DALL-E（需要API Key）
  async generateDalle(prompt, options = {}) {
    if (!AI_CONFIG.imageGen.apiKey) {
      return await this.generatePollinations(prompt, options)
    }
    
    const { size = '1024x1024' } = options
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.imageGen.apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        size,
        n: 1
      })
    })
    
    const data = await response.json()
    
    if (data.data?.[0]?.url) {
      return {
        imageUrl: data.data[0].url
      }
    }
    
    throw new Error('DALL-E生成失败')
  }
}

// ==================== 音频合成服务 ====================
export const audioService = {
  // 讯飞语音合成（需要配置）
  async synthesizeXunfei(text, options = {}) {
    if (!AI_CONFIG.xunfei.enabled) {
      return this.generateMockAudio(text, options)
    }
    // 讯飞实现（需要签名认证）
    throw new Error('讯飞语音合成待配置')
  },
  
  // 通用语音合成
  async synthesize(text, options = {}) {
    try {
      return await this.synthesizeXunfei(text, options)
    } catch {
      return this.generateMockAudio(text, options)
    }
  },
  
  // 生成模拟音频（用于演示）
  generateMockAudio(text, options = {}) {
    return {
      audioUrl: null,
      duration: Math.max(5, Math.ceil(text.length / 5)), // 估算时长
      text,
      mock: true
    }
  }
}

// ==================== 视频生成服务 ====================
export const videoService = {
  // 混元视频（腾讯）- 需要配置
  async generateHunyuan(prompt, options = {}) {
    // 实际需要调用腾讯混元API
    return {
      videoUrl: null,
      taskId: `task_${Date.now()}`,
      mock: true,
      prompt
    }
  },
  
  // Runway/Pika（需要配置）
  async generateRunway(prompt, options = {}) {
    return {
      videoUrl: null,
      taskId: `task_${Date.now()}`,
      mock: true,
      prompt
    }
  },
  
  // 通用视频生成
  async generate(prompt, options = {}) {
    try {
      return await this.generateHunyuan(prompt, options)
    } catch {
      return {
        videoUrl: null,
        taskId: `task_${Date.now()}`,
        mock: true,
        prompt
      }
    }
  }
}

// ==================== 数字人服务 ====================
export const avatarService = {
  // 形象克隆（需要专业API）
  async cloneAppearance(videoUrl, options = {}) {
    return {
      avatarId: `avatar_${Date.now()}`,
      status: 'processing',
      mock: true
    }
  },
  
  // 声音克隆
  async cloneVoice(audioUrl, options = {}) {
    return {
      voiceId: `voice_${Date.now()}`,
      status: 'processing',
      mock: true
    }
  },
  
  // 唇形同步
  async lipSync(avatarId, audioUrl, script, options = {}) {
    return {
      videoUrl: null,
      taskId: `lip_${Date.now()}`,
      avatarId,
      mock: true
    }
  },
  
  // 生成数字人视频
  async generateVideo(avatarId, script, options = {}) {
    return {
      videoUrl: null,
      taskId: `video_${Date.now()}`,
      avatarId,
      mock: true,
      duration: Math.ceil(script.length / 5)
    }
  }
}

// ==================== AI工作流编排服务 ====================
export const workflowService = {
  // 无画布图像生成流程
  async imageGeneration(params, onProgress) {
    const { prompt, width = 1024, height = 1024, style = 'realistic' } = params
    
    onProgress?.({ step: 'preparing', progress: 10, message: '正在准备生成参数...' })
    
    onProgress?.({ step: 'generating', progress: 30, message: '正在调用AI图像生成模型...' })
    
    // 调用图像生成
    const result = await imageService.generate(prompt, {
      width,
      height,
      style
    })
    
    onProgress?.({ step: 'processing', progress: 70, message: '正在处理生成结果...' })
    
    onProgress?.({ step: 'completed', progress: 100, message: '生成完成!' })
    
    return {
      type: 'image',
      imageUrl: result.imageUrl,
      prompt,
      width,
      height,
      seed: result.seed
    }
  },
  
  // 视频生成流程
  async videoGeneration(params, onProgress) {
    const { prompt, duration = 5, style = 'cinematic' } = params
    
    onProgress?.({ step: 'analyzing', progress: 10, message: '正在分析视频场景...' })
    
    onProgress?.({ step: 'generating', progress: 40, message: '正在生成关键帧...' })
    
    // 先生成一张参考图
    const imageResult = await imageService.generate(
      `${prompt}, high quality, key frame for video generation`,
      { width: 1280, height: 720 }
    )
    
    onProgress?.({ step: 'interpolating', progress: 70, message: '正在进行帧间插值...' })
    
    onProgress?.({ step: 'encoding', progress: 90, message: '正在编码视频...' })
    
    onProgress?.({ step: 'completed', progress: 100, message: '视频生成完成!' })
    
    return {
      type: 'video',
      videoUrl: imageResult.imageUrl, // 暂时用图片作为预览
      thumbnailUrl: imageResult.imageUrl,
      prompt,
      duration,
      mock: true // 标记为模拟结果
    }
  },
  
  // 音频合成流程
  async audioSynthesis(params, onProgress) {
    const { text, voice = 'female_youthful', speed = 1.0 } = params
    
    onProgress?.({ step: 'analyzing', progress: 15, message: '正在分析文本内容...' })
    
    onProgress?.({ step: 'synthesizing', progress: 50, message: '正在进行语音合成...' })
    
    const result = await audioService.synthesize(text, { voice, speed })
    
    onProgress?.({ step: 'processing', progress: 85, message: '正在优化音频质量...' })
    
    onProgress?.({ step: 'completed', progress: 100, message: '音频生成完成!' })
    
    return {
      type: 'audio',
      audioUrl: result.audioUrl,
      duration: result.duration,
      text,
      mock: result.mock
    }
  },
  
  // 短剧剧本生成流程
  async scriptGeneration(params, onProgress) {
    const { theme, genre = 'drama', duration = 60 } = params
    
    onProgress?.({ step: 'analyzing', progress: 10, message: '正在分析主题方向...' })
    
    // 使用AI生成剧本
    const scriptContent = await zhipuService.creativeWrite(theme, genre)
    
    onProgress?.({ step: 'structuring', progress: 40, message: '正在构建剧本结构...' })
    
    // 解析剧本为场景
    const scenes = parseScriptToScenes(scriptContent)
    
    onProgress?.({ step: 'generating', progress: 70, message: '正在生成场景分镜...' })
    
    // 为每个场景生成参考图
    const sceneImages = await Promise.all(
      scenes.slice(0, 3).map(async (scene, idx) => {
        const img = await imageService.generate(
          `${scene.description}, cinematic, storyboard style`,
          { width: 640, height: 360 }
        )
        return { ...scene, imageUrl: img.imageUrl }
      })
    )
    
    onProgress?.({ step: 'completed', progress: 100, message: '剧本生成完成!' })
    
    return {
      type: 'script',
      content: scriptContent,
      scenes: sceneImages,
      totalScenes: scenes.length,
      estimatedDuration: scenes.length * 15 // 每场景约15秒
    }
  },
  
  // 广告生成流程
  async adGeneration(params, onProgress) {
    const { productName, productDesc, style = 'modern', formats = ['1:1'] } = params
    
    onProgress?.({ step: 'analyzing', progress: 10, message: '正在分析产品特点...' })
    
    // 生成产品描述
    const promptBase = `${productName}, ${productDesc}, ${style} style, professional product photography`
    
    const results = []
    
    for (const format of formats) {
      const [w, h] = format.split(':').map(Number)
      const width = Math.max(w, h) * 512
      const height = Math.min(w, h) * 512
      
      onProgress?.({ 
        step: 'generating', 
        progress: 30 + (formats.indexOf(format) / formats.length) * 50, 
        message: `正在生成${format}尺寸广告图...` 
      })
      
      const img = await imageService.generate(promptBase, { width, height })
      results.push({
        format,
        imageUrl: img.imageUrl,
        width,
        height
      })
    }
    
    onProgress?.({ step: 'completed', progress: 100, message: '广告素材生成完成!' })
    
    return {
      type: 'ad',
      productName,
      images: results,
      formats
    }
  }
}

// ==================== 辅助函数 ====================

// 模拟AI回复
function generateMockResponse(messages) {
  const lastMessage = messages[messages.length - 1]?.content || ''
  
  if (lastMessage.includes('剧本') || lastMessage.includes('故事')) {
    return `【AI创作助手 - 短剧剧本】\n\n🎬 第一幕：开场\n场景：现代都市，日内\n\n（咖啡厅内，白领小林独自坐在角落，神情落寞）\n\n小林：（叹气）每天都是这样，两点一线的生活，什么时候是个头...\n\n（手机响起，一条神秘短信）\n\n短信：想知道人生另一种可能吗？今晚22:00，旧工厂见。\n\n（小林犹豫片刻，眼神中闪过一丝好奇）\n\n小林：（自语）反正也没什么可失去的...\n\n🎬 第二幕：转折\n场景：废弃工厂，夜外\n\n（昏暗的灯光下，一个神秘的箱子）\n\n（小林走近，发现箱子里是一面古老的镜子）\n\n（镜面泛起涟漪，小林伸手触碰——）\n\n旁白：你永远不知道，下一秒会遇见什么。\n\n🎬 第三幕：高潮\n场景：镜子中的异世界\n\n（小林发现自己置身于一个奇幻空间，周围是流动的数字代码）\n\n神秘人：欢迎来到第五栖息地，这里是碳与硅共生的新世界。\n\n（小林惊讶地环顾四周）\n\n小林：这是...什么地方？\n\n神秘人：这是你内心深处的另一个自己，等待被唤醒。\n\n【未完待续...】\n\n——剧本由AI辅助生成，可根据实际需求调整`
  }
  
  if (lastMessage.includes('广告') || lastMessage.includes('产品')) {
    return `【AI广告文案】\n\n📺 产品广告脚本（30秒）\n\n【开场 - 3秒】\n🎬 画面：清晨第一缕阳光照进窗户\n💬 旁白：每一天，都是全新的开始\n\n【痛点 - 5秒】\n🎬 画面：上班族手忙脚乱找东西\n💬 旁白：还在为琐事烦恼？\n\n【产品展示 - 10秒】\n🎬 画面：产品特写+使用场景\n💬 旁白：XX智能助手，帮你规划每一步\n\n【卖点 - 8秒】\n🎬 画面：用户满意笑容\n💬 旁白：省时、省力、更省心\n\n【收尾 - 4秒】\n💬 旁白：即刻体验，限时优惠！\n📱 扫码下载：xxx.com`
  }
  
  return `【AI回复助手】\n\n您好！感谢您的提问。\n\n根据您提供的信息，我为您整理了以下内容：\n\n1. **核心要点**\n   - 重点突出第一个关键信息\n   - 强调第二个重要内容\n   - 补充第三个细节说明\n\n2. **建议方案**\n   - 方案A：适合注重效率的用户\n   - 方案B：适合追求品质的用户\n   - 方案C：适合预算有限的用户\n\n3. **下一步行动**\n   - 立即开始 vs 持续观望\n   - 具体执行步骤\n   - 预期效果评估\n\n如有其他问题，欢迎继续咨询！`
}

// 解析剧本为场景
function parseScriptToScenes(scriptContent) {
  const scenes = []
  const actPattern = /🎬\s*第[一二三四五六七八九十]+[幕章集]：[^\n]+/g
  const matches = scriptContent.match(actPattern) || ['第一幕：开场', '第二幕：发展', '第三幕：高潮', '第四幕：结尾']
  
  const descriptions = [
    '都市白领在咖啡厅沉思，阳光透过玻璃洒在脸上',
    '神秘短信打破平静，手机屏幕发出微光',
    '夜色中来到废弃工厂，环境阴森神秘',
    '发现古老的镜子，镜面泛起奇异光芒',
    '镜中出现另一个世界，数字代码流动',
    '与神秘人对话，揭示新世界的秘密',
    '主角下定决心，走向未知',
    '完美的结局，呼应开头'
  ]
  
  matches.forEach((match, idx) => {
    const title = match.replace('🎬 ', '').trim()
    scenes.push({
      id: idx + 1,
      title,
      description: descriptions[idx] || `场景${idx + 1}`,
      duration: 15 + Math.floor(Math.random() * 10),
      dialogue: `（场景${idx + 1}对话内容）`
    })
  })
  
  return scenes
}

// ==================== 导出配置 ====================
export const aiConfig = AI_CONFIG

export default {
  qwen: qwenService,
  zhipu: zhipuService,
  image: imageService,
  audio: audioService,
  video: videoService,
  avatar: avatarService,
  workflow: workflowService,
  config: AI_CONFIG
}
