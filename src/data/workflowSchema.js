// AI工作流数据模型

// 工作流类型定义
export const WORKFLOW_TYPES = {
  CANVAS_FREE: 'canvas-free',      // 无画布工作流
  DRAMA: 'drama',                  // 短剧漫剧生产
  AD: 'ad',                        // 广告自动生成
  HUMAN_CLONE: 'human-clone'       // 数字人克隆
}

// 工作流状态
export const WORKFLOW_STATUS = {
  IDLE: 'idle',           // 空闲
  RUNNING: 'running',     // 运行中
  COMPLETED: 'completed', // 已完成
  FAILED: 'failed',       // 失败
  PAUSED: 'paused'        // 暂停
}

// 工作流节点类型
export const NODE_TYPES = {
  INPUT: 'input',         // 输入节点
  PROCESS: 'process',     // 处理节点
  OUTPUT: 'output',      // 输出节点
  CONDITION: 'condition', // 条件节点
  MERGE: 'merge'          // 合并节点
}

// 无画布工作流预设模板
export const CANVAS_FREE_TEMPLATES = [
  {
    id: 'cf-img-gen',
    name: '图像生成',
    icon: '🎨',
    description: '文生图/图生图，支持多种风格',
    category: 'generation',
    inputs: [
      { id: 'prompt', label: '提示词', type: 'textarea', placeholder: '描述你想要的画面...' },
      { id: 'negativePrompt', label: '反向提示词', type: 'textarea', placeholder: '不想出现的内容...' },
      { id: 'model', label: '模型', type: 'model-select', modelType: 'image', 
        options: [
          { id: 'pollinations', name: 'Pollinations Flux (免费)', icon: '🌐' },
          { id: 'stability', name: 'Stable Diffusion XL', icon: '🎨' },
          { id: 'dalle3', name: 'DALL-E 3', icon: '🖼️' }
        ]
      },
      { id: 'style', label: '风格', type: 'select', options: ['写实', '动漫', '油画', '水彩', '赛博朋克', '古风'] },
      { id: 'aspectRatio', label: '尺寸', type: 'select', options: ['1:1 (1024x1024)', '16:9 (1920x1080)', '9:16 (1080x1920)', '4:3 (1024x768)'] },
      { id: 'steps', label: '生成步数', type: 'range', min: 20, max: 50, default: 30 },
      { id: 'guidance', label: '引导强度', type: 'range', min: 1, max: 15, default: 7.5 }
    ],
    output: { type: 'image', format: 'PNG' }
  },
  {
    id: 'cf-video-gen',
    name: '视频生成',
    icon: '🎬',
    description: '图生视频/文生视频',
    category: 'generation',
    inputs: [
      { id: 'sourceImage', label: '源图片', type: 'file', accept: 'image/*' },
      { id: 'model', label: '视频模型', type: 'model-select', modelType: 'video',
        options: [
          { id: 'kling', name: '可灵 AI (快手)', icon: '🎯', tag: '推荐' },
          { id: 'haibo', name: '海螺 AI (字节)', icon: '🐚' },
          { id: 'jimeng', name: '即梦 (字节)', icon: '✨' },
          { id: 'cogvidex', name: 'CogVideoX (智谱)', icon: '🔮' },
          { id: 'hunyuan_video', name: '混元视频 (腾讯)', icon: '🐧' },
          { id: 'luma', name: 'Luma Dream Machine', icon: '💫' },
          { id: 'runway', name: 'Runway Gen-3', icon: '🎬' },
          { id: 'pika', name: 'Pika 1.5', icon: '🎈' }
        ]
      },
      { id: 'motion', label: '运动类型', type: 'select', options: ['自然流动', '运镜推拉', '特效转场', '角色动画'] },
      { id: 'duration', label: '时长', type: 'select', options: ['3秒', '5秒', '10秒'] },
      { id: 'fps', label: '帧率', type: 'select', options: ['24fps', '30fps', '60fps'] },
      { id: 'prompt', label: '运动描述', type: 'textarea', placeholder: '描述期望的运动效果...' }
    ],
    output: { type: 'video', format: 'MP4' }
  },
  {
    id: 'cf-audio-gen',
    name: '音频生成',
    icon: '🎵',
    description: '文字转语音/音乐生成',
    category: 'generation',
    inputs: [
      { id: 'text', label: '文本内容', type: 'textarea', placeholder: '输入要转化的文字...' },
      { id: 'model', label: '语音模型', type: 'model-select', modelType: 'tts',
        options: [
          { id: 'openai_tts', name: 'OpenAI TTS', icon: '🔊' },
          { id: 'azure_tts', name: 'Azure 语音', icon: '☁️' },
          { id: 'minimax_tts', name: 'MiniMax 语音', icon: '🎙️' },
          { id: 'fish_tts', name: 'Fish TTS', icon: '🐟' },
          { id: 'cosyvoice', name: 'CosyVoice (阿里)', icon: '🏠' }
        ]
      },
      { id: 'voice', label: '音色', type: 'select', options: ['标准女声', '标准男声', '甜美少女', '磁性大叔', '情感主播', '新闻播音'] },
      { id: 'speed', label: '语速', type: 'range', min: 0.5, max: 2, step: 0.1, default: 1 },
      { id: 'pitch', label: '音调', type: 'range', min: 0.5, max: 2, step: 0.1, default: 1 },
      { id: 'musicStyle', label: '音乐风格', type: 'select', options: ['无', '轻音乐', '电子', '古典', '摇滚', '国风'] }
    ],
    output: { type: 'audio', format: 'MP3/WAV' }
  },
  {
    id: 'cf-upscale',
    name: '图像放大',
    icon: '📐',
    description: '无损放大与超分辨率',
    category: 'enhancement',
    inputs: [
      { id: 'image', label: '上传图片', type: 'file', accept: 'image/*' },
      { id: 'model', label: '放大模型', type: 'model-select', modelType: 'upscale',
        options: [
          { id: 'realesrgan', name: 'Real-ESRGAN (免费)', icon: '🔍' },
          { id: 'gfpgan', name: 'GFPGAN (人脸增强)', icon: '👤' },
          { id: 'stable_diffusion', name: 'SD 放大', icon: '🎨' }
        ]
      },
      { id: 'scale', label: '放大倍数', type: 'select', options: ['2x', '4x', '8x'] },
      { id: 'mode', label: '模式', type: 'select', options: ['细节增强', '动漫专用', '通用平滑'] }
    ],
    output: { type: 'image', format: 'PNG' }
  }
]

// 短剧漫剧模板
export const DRAMA_TEMPLATES = [
  {
    id: 'drama-series',
    name: 'AI短剧系列',
    icon: '🎭',
    description: '完整短剧生产流水线',
    steps: [
      { id: 'script', name: '剧本创作', icon: '📝', description: 'AI辅助剧本创作' },
      { id: 'characters', name: '角色设定', icon: '👤', description: 'Seed角色锁定一致性' },
      { id: 'storyboard', name: '分镜生成', icon: '🎬', description: 'AI生成分镜画面' },
      { id: 'voice', name: '配音合成', icon: '🎙️', description: '多角色语音生成' },
      { id: 'video', name: '视频合成', icon: '🎥', description: '最终视频输出' }
    ]
  },
  {
    id: 'drama-manga',
    name: 'AI漫剧',
    icon: '📚',
    description: '漫画风格动态呈现',
    steps: [
      { id: 'script', name: '脚本改编', icon: '📝', description: '小说转漫画脚本' },
      { id: 'layout', name: '分镜布局', icon: '📐', description: '漫画分镜设计' },
      { id: 'style', name: '画风训练', icon: '🎨', description: 'LoRA画风定制' },
      { id: 'animation', name: '动态效果', icon: '✨', description: '漫画动效添加' },
      { id: 'audio', name: '音效配音', icon: '🔊', description: '沉浸式音效' }
    ]
  },
  {
    id: 'drama-travel',
    name: '文旅宣传片',
    icon: '🏔️',
    description: '旅游景点AI宣传',
    steps: [
      { id: 'location', name: '场景采集', icon: '📍', description: '素材收集整理' },
      { id: 'narrative', name: '文案撰写', icon: '✍️', description: 'AI撰写解说词' },
      { id: 'visuals', name: '画面生成', icon: '🖼️', description: 'AI生成旅游场景' },
      { id: 'music', name: '背景音乐', icon: '🎵', description: '氛围音乐合成' },
      { id: 'export', name: '成片输出', icon: '📤', description: '多格式导出' }
    ]
  }
]

// 广告模板
export const AD_TEMPLATES = [
  {
    id: 'ad-product',
    name: '产品展示广告',
    icon: '📦',
    description: '产品图+LoRA保真',
    features: ['产品图LoRA训练', '多角度生成', '场景融入', '多尺寸适配'],
    inputs: [
      { id: 'productImage', label: '产品图片', type: 'file', accept: 'image/*' },
      { id: 'productName', label: '产品名称', type: 'text', placeholder: '输入产品名称' },
      { id: 'scene', label: '使用场景', type: 'select', options: ['电商主图', '社交媒体', '户外广告', '视频封面'] },
      { id: 'style', label: '广告风格', type: 'select', options: ['简约高端', '生活场景', '科技感', '国潮风', 'ins风'] },
      { id: 'sizes', label: '输出尺寸', type: 'checkbox-group', options: ['正方形(1:1)', '横版(16:9)', '竖版(9:16)', '故事版(4:5)'] }
    ]
  },
  {
    id: 'ad-video',
    name: 'AI广告电影',
    icon: '🎬',
    description: '品牌故事短视频',
    features: ['脚本创作', '角色生成', '场景合成', '背景音乐'],
    inputs: [
      { id: 'brandStory', label: '品牌故事', type: 'textarea', placeholder: '描述品牌核心价值和故事...' },
      { id: 'duration', label: '视频时长', type: 'select', options: ['15秒', '30秒', '60秒'] },
      { id: 'tone', label: '基调风格', type: 'select', options: ['情感温暖', '科技未来', '时尚潮流', '幽默风趣', '大气磅礴'] },
      { id: 'bgMusic', label: '背景音乐', type: 'select', options: ['舒缓钢琴', '动感电子', '激情摇滚', '国风古韵', '自定义上传'] }
    ]
  },
  {
    id: 'ad-listing',
    name: '电商主图视频',
    icon: '🛒',
    description: '快速生成主图视频',
    features: ['批量处理', '自动字幕', '转场特效', '限时优惠角标'],
    inputs: [
      { id: 'productImages', label: '产品图片组', type: 'file-multiple', accept: 'image/*' },
      { id: 'highlights', label: '产品卖点', type: 'textarea', placeholder: '输入3-5个核心卖点...' },
      { id: 'discount', label: '优惠信息', type: 'text', placeholder: '如: 限时5折' },
      { id: 'transition', label: '转场效果', type: 'select', options: ['平滑淡入淡出', '速度感滑动', '弹性缩放', '随机智能'] }
    ]
  }
]

// 数字人模板
export const HUMAN_CLONE_TEMPLATES = [
  {
    id: 'clone-basic',
    name: '基础数字人克隆',
    icon: '🧬',
    description: '多语言数字人克隆',
    features: ['形象采集', '声音克隆', '唇形同步', '多语言支持'],
    inputs: [
      { id: 'sourceVideo', label: '形象素材(30秒)', type: 'file', accept: 'video/*' },
      { id: 'sourceAudio', label: '声音素材(5分钟)', type: 'file', accept: 'audio/*' },
      { id: 'language', label: '克隆语言', type: 'select', options: ['中文', '英文', '日语', '韩语', '多语言'] },
      { id: 'quality', label: '克隆质量', type: 'select', options: ['快速预览', '标准品质', '高清精修'] }
    ]
  },
  {
    id: 'clone-duplicate',
    name: '爆款视频复制',
    icon: '📺',
    description: '学习爆款风格批量生产',
    features: ['风格学习', '内容替换', '批量生成', '去重优化'],
    inputs: [
      { id: 'templateVideo', label: '模板视频', type: 'file', accept: 'video/*' },
      { id: 'productList', label: '产品列表', type: 'file', accept: '.csv,.xlsx' },
      { id: 'replacement', label: '内容替换规则', type: 'textarea', placeholder: '定义替换规则...' },
      { id: 'quantity', label: '生成数量', type: 'number', min: 1, max: 100, default: 10 }
    ]
  },
  {
    id: 'clone-avatar',
    name: '虚拟形象创建',
    icon: '👤',
    description: '全新虚拟人设计',
    features: ['AI形象设计', '服装定制', '动作库', '表情库'],
    inputs: [
      { id: 'description', label: '形象描述', type: 'textarea', placeholder: '描述理想中的虚拟形象...' },
      { id: 'gender', label: '性别特征', type: 'select', options: ['女性', '男性', '中性', '无性别'] },
      { id: 'style', label: '形象风格', type: 'select', options: ['写实', '二次元', '3D风格', '古风'] },
      { id: 'outfit', label: '服装风格', type: 'select', options: ['职业正装', '休闲时尚', '国风汉服', '科技未来', '自定义'] }
    ]
  }
]

// 执行日志类型
export const LOG_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  PROGRESS: 'progress'
}

// 生成模拟执行日志
export function generateLogs(workflowType, templateId) {
  const baseLogs = [
    { type: LOG_TYPES.INFO, message: '初始化工作流引擎...', timestamp: Date.now() },
    { type: LOG_TYPES.SUCCESS, message: '工作流配置加载完成', timestamp: Date.now() + 500 },
    { type: LOG_TYPES.INFO, message: '检查GPU资源...', timestamp: Date.now() + 1000 }
  ]

  const typeSpecificLogs = {
    [WORKFLOW_TYPES.CANVAS_FREE]: [
      { type: LOG_TYPES.PROGRESS, message: '[1/4] 加载AI模型...', timestamp: Date.now() + 1500 },
      { type: LOG_TYPES.SUCCESS, message: '模型加载完成: SDXL Turbo', timestamp: Date.now() + 3000 },
      { type: LOG_TYPES.PROGRESS, message: '[2/4] 处理输入参数...', timestamp: Date.now() + 3500 },
      { type: LOG_TYPES.SUCCESS, message: '参数解析完成', timestamp: Date.now() + 4000 },
      { type: LOG_TYPES.PROGRESS, message: '[3/4] 执行推理生成...', timestamp: Date.now() + 4500 },
      { type: LOG_TYPES.INFO, message: '生成进度: 25%', timestamp: Date.now() + 6000 },
      { type: LOG_TYPES.INFO, message: '生成进度: 50%', timestamp: Date.now() + 7500 },
      { type: LOG_TYPES.INFO, message: '生成进度: 75%', timestamp: Date.now() + 9000 },
      { type: LOG_TYPES.SUCCESS, message: '生成完成!', timestamp: Date.now() + 10000 },
      { type: LOG_TYPES.PROGRESS, message: '[4/4] 后处理与优化...', timestamp: Date.now() + 10500 },
      { type: LOG_TYPES.SUCCESS, message: '图像优化完成', timestamp: Date.now() + 11000 },
      { type: LOG_TYPES.SUCCESS, message: '✨ 任务完成! 输出已保存至版权库', timestamp: Date.now() + 11500 }
    ],
    [WORKFLOW_TYPES.DRAMA]: [
      { type: LOG_TYPES.PROGRESS, message: '[1/5] 剧本解析...', timestamp: Date.now() + 1500 },
      { type: LOG_TYPES.SUCCESS, message: '剧本结构分析完成', timestamp: Date.now() + 3000 },
      { type: LOG_TYPES.PROGRESS, message: '[2/5] 角色AI训练中...', timestamp: Date.now() + 3500 },
      { type: LOG_TYPES.INFO, message: '正在提取角色特征...', timestamp: Date.now() + 5000 },
      { type: LOG_TYPES.SUCCESS, message: 'Seed角色库已锁定', timestamp: Date.now() + 7000 },
      { type: LOG_TYPES.PROGRESS, message: '[3/5] 分镜批量生成...', timestamp: Date.now() + 7500 },
      { type: LOG_TYPES.INFO, message: '场景 #1 生成中...', timestamp: Date.now() + 9000 },
      { type: LOG_TYPES.INFO, message: '场景 #2 生成中...', timestamp: Date.now() + 10500 },
      { type: LOG_TYPES.SUCCESS, message: '分镜生成完成: 12个场景', timestamp: Date.now() + 12000 },
      { type: LOG_TYPES.PROGRESS, message: '[4/5] 配音合成...', timestamp: Date.now() + 12500 },
      { type: LOG_TYPES.SUCCESS, message: '5个角色配音已完成', timestamp: Date.now() + 14000 },
      { type: LOG_TYPES.PROGRESS, message: '[5/5] 视频合成输出...', timestamp: Date.now() + 14500 },
      { type: LOG_TYPES.SUCCESS, message: '渲染进度: 100%', timestamp: Date.now() + 16000 },
      { type: LOG_TYPES.SUCCESS, message: '🎬 成片已生成! 时长: 3分24秒', timestamp: Date.now() + 16500 },
      { type: LOG_TYPES.SUCCESS, message: '✨ 已自动存入版权库-影视成品', timestamp: Date.now() + 17000 }
    ],
    [WORKFLOW_TYPES.AD]: [
      { type: LOG_TYPES.PROGRESS, message: '[1/4] 产品特征提取...', timestamp: Date.now() + 1500 },
      { type: LOG_TYPES.SUCCESS, message: '产品LoRA训练启动', timestamp: Date.now() + 3000 },
      { type: LOG_TYPES.INFO, message: '训练迭代: 100/200', timestamp: Date.now() + 5000 },
      { type: LOG_TYPES.SUCCESS, message: 'LoRA模型收敛完成', timestamp: Date.now() + 8000 },
      { type: LOG_TYPES.PROGRESS, message: '[2/4] 场景批量生成...', timestamp: Date.now() + 8500 },
      { type: LOG_TYPES.INFO, message: '生成广告场景: 电商主图', timestamp: Date.now() + 10000 },
      { type: LOG_TYPES.INFO, message: '生成广告场景: 社交媒体', timestamp: Date.now() + 11500 },
      { type: LOG_TYPES.SUCCESS, message: '场景生成完成: 8个变体', timestamp: Date.now() + 13000 },
      { type: LOG_TYPES.PROGRESS, message: '[3/4] 尺寸适配处理...', timestamp: Date.now() + 13500 },
      { type: LOG_TYPES.SUCCESS, message: '1:1 正方形适配完成', timestamp: Date.now() + 14500 },
      { type: LOG_TYPES.SUCCESS, message: '16:9 横版适配完成', timestamp: Date.now() + 15000 },
      { type: LOG_TYPES.SUCCESS, message: '9:16 竖版适配完成', timestamp: Date.now() + 15500 },
      { type: LOG_TYPES.PROGRESS, message: '[4/4] 批量导出...', timestamp: Date.now() + 16000 },
      { type: LOG_TYPES.SUCCESS, message: '📦 共生成 24 个广告素材', timestamp: Date.now() + 17500 },
      { type: LOG_TYPES.SUCCESS, message: '✨ 已自动存入版权库', timestamp: Date.now() + 18000 }
    ],
    [WORKFLOW_TYPES.HUMAN_CLONE]: [
      { type: LOG_TYPES.PROGRESS, message: '[1/5] 形象特征提取...', timestamp: Date.now() + 1500 },
      { type: LOG_TYPES.INFO, message: '面部特征点检测中...', timestamp: Date.now() + 3000 },
      { type: LOG_TYPES.SUCCESS, message: '形象数字化完成', timestamp: Date.now() + 5000 },
      { type: LOG_TYPES.PROGRESS, message: '[2/5] 声音克隆训练...', timestamp: Date.now() + 5500 },
      { type: LOG_TYPES.INFO, message: '音频特征提取: 音调/语速/音色', timestamp: Date.now() + 7000 },
      { type: LOG_TYPES.INFO, message: '声纹模型训练中...', timestamp: Date.now() + 9000 },
      { type: LOG_TYPES.SUCCESS, message: '声音克隆完成', timestamp: Date.now() + 12000 },
      { type: LOG_TYPES.PROGRESS, message: '[3/5] 唇形同步模型...', timestamp: Date.now() + 12500 },
      { type: LOG_TYPES.SUCCESS, message: '唇形同步模型就绪', timestamp: Date.now() + 15000 },
      { type: LOG_TYPES.PROGRESS, message: '[4/5] 多语言TTS训练...', timestamp: Date.now() + 15500 },
      { type: LOG_TYPES.INFO, message: '中文TTS: 完成', timestamp: Date.now() + 17000 },
      { type: LOG_TYPES.INFO, message: '英文TTS: 完成', timestamp: Date.now() + 18000 },
      { type: LOG_TYPES.INFO, message: '日语TTS: 完成', timestamp: Date.now() + 19000 },
      { type: LOG_TYPES.SUCCESS, message: '多语言支持已开启', timestamp: Date.now() + 20000 },
      { type: LOG_TYPES.PROGRESS, message: '[5/5] 生成测试视频...', timestamp: Date.now() + 20500 },
      { type: LOG_TYPES.SUCCESS, message: '🧬 数字人克隆完成!', timestamp: Date.now() + 23000 },
      { type: LOG_TYPES.SUCCESS, message: '✨ 可用于任何视频制作', timestamp: Date.now() + 23500 }
    ]
  }

  return [...baseLogs, ...(typeSpecificLogs[workflowType] || [])]
}

// 存储键名
export const STORAGE_KEYS = {
  WORKFLOW_HISTORY: 'ai_workflow_history',
  WORKFLOW_PRESETS: 'ai_workflow_presets',
  USER_PREFERENCES: 'ai_workflow_preferences'
}

// 获取工作流历史
export function getWorkflowHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORKFLOW_HISTORY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// 保存工作流历史
export function saveWorkflowHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKFLOW_HISTORY, JSON.stringify(history))
  } catch (e) {
    console.error('保存工作流历史失败:', e)
  }
}

// 添加工作流记录
export function addWorkflowRecord(record) {
  const history = getWorkflowHistory()
  const newRecord = {
    id: `wf_${Date.now()}`,
    ...record,
    createdAt: new Date().toISOString()
  }
  history.unshift(newRecord)
  // 只保留最近50条
  if (history.length > 50) {
    history.pop()
  }
  saveWorkflowHistory(history)
  return newRecord
}
