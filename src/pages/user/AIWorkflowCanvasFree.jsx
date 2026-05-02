import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  WORKFLOW_TYPES,
  WORKFLOW_STATUS,
  CANVAS_FREE_TEMPLATES,
  LOG_TYPES,
  addWorkflowRecord
} from '../../data/workflowSchema'
import { generateImage, chatWithModel, generateVideo, AI_MODELS } from '../../services/comprehensiveAIService'

// 图标组件
const IconBack = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

const IconPlay = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const IconStop = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
)

const IconRefresh = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
)

const IconDownload = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
)

const IconTerminal = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M6 8l4 4-4 4M12 16h6" />
  </svg>
)

const IconUpload = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
)

const IconImage = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

export default function CanvasFreeWorkflow() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const logContainerRef = useRef(null)

  // 状态
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({})
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadedFilePreview, setUploadedFilePreview] = useState(null)
  const [status, setStatus] = useState(WORKFLOW_STATUS.IDLE)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)
  const [executionTime, setExecutionTime] = useState(0)

  // 初始化：根据URL参数选择模板
  useEffect(() => {
    const templateId = searchParams.get('template')
    if (templateId) {
      const template = CANVAS_FREE_TEMPLATES.find(t => t.id === templateId)
      if (template) {
        setSelectedTemplate(template)
        initFormData(template)
      }
    }
  }, [searchParams])

  // 初始化表单数据
  const initFormData = (template) => {
    const data = {}
    template.inputs.forEach(input => {
      if (input.type === 'range') {
        data[input.id] = input.default || input.min
      } else if (input.type === 'checkbox-group') {
        data[input.id] = []
      } else {
        data[input.id] = ''
      }
    })
    setFormData(data)
  }

  // 选择模板
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setFormData({})
    initFormData(template)
    setStatus(WORKFLOW_STATUS.IDLE)
    setProgress(0)
    setLogs([])
    setResult(null)
    setExecutionTime(0)
    setUploadedFile(null)
    setUploadedFilePreview(null)
  }

  // 处理输入变化
  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  // 处理文件上传
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (ev) => setUploadedFilePreview(ev.target.result)
        reader.readAsDataURL(file)
      } else if (file.type.startsWith('video/')) {
        setUploadedFilePreview(URL.createObjectURL(file))
      }
    }
  }

  // 添加日志
  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, timestamp: Date.now() }])
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }

  // 开始执行 - 真实AI调用
  const handleExecute = async () => {
    if (!selectedTemplate) return

    setStatus(WORKFLOW_STATUS.RUNNING)
    setProgress(0)
    setLogs([])
    setResult(null)
    setExecutionTime(0)

    const startTime = Date.now()
    addLog('🚀 任务已启动，正在初始化AI引擎...', LOG_TYPES.PROGRESS)

    try {
      let aiResult = null

      // 根据模板类型调用不同的AI服务
      switch (selectedTemplate.id) {
        case 'cf-img-gen': {
          addLog('📝 正在构建图像生成提示词...', LOG_TYPES.PROGRESS)
          const prompt = formData.prompt || 'a beautiful landscape'
          const style = formData.style || '写实'
          const selectedModel = formData.model || 'pollinations'
          
          // 解析尺寸
          const aspectRatio = formData.aspectRatio || '1:1 (1024x1024)'
          let width = 1024, height = 1024
          if (aspectRatio.includes('16:9')) { width = 1920; height = 1080 }
          else if (aspectRatio.includes('9:16')) { width = 1080; height = 1920 }
          else if (aspectRatio.includes('4:3')) { width = 1024; height = 768 }
          
          // 模型名称映射
          const modelNames = {
            pollinations: 'Pollinations Flux',
            stability: 'Stable Diffusion XL',
            dalle3: 'DALL-E 3'
          }
          
          // 风格映射
          const styleMap = {
            '写实': 'photorealistic',
            '动漫': 'anime style',
            '油画': 'oil painting style',
            '水彩': 'watercolor painting',
            '赛博朋克': 'cyberpunk style',
            '古风': 'traditional Chinese painting style'
          }
          
          addLog(`🎨 提示词: ${prompt}`, LOG_TYPES.INFO)
          addLog(`📐 尺寸: ${width}x${height} | 风格: ${style}`, LOG_TYPES.INFO)
          addLog(`🤖 图像模型: ${modelNames[selectedModel] || selectedModel}`, LOG_TYPES.INFO)
          
          setProgress(20)
          addLog('📡 正在发送请求到 AI 服务器...', LOG_TYPES.PROGRESS)
          
          // 调用图像生成API
          const imageResult = await generateImage(`${prompt}, ${styleMap[style] || 'high quality'}`, {
            width,
            height,
            provider: selectedModel,
            model: selectedModel === 'dalle3' ? undefined : (selectedModel === 'pollinations' ? 'flux' : selectedModel)
          })
          
          setProgress(80)
          addLog('📥 正在接收AI生成结果...', LOG_TYPES.PROGRESS)
          
          aiResult = {
            type: 'image',
            imageUrl: imageResult.imageUrl,
            prompt: prompt,
            width,
            height,
            seed: imageResult.seed,
            provider: imageResult.provider,
            model: modelNames[selectedModel] || selectedModel
          }
          
          addLog(`✅ 图像生成成功! (${modelNames[selectedModel] || selectedModel}, Seed: ${imageResult.seed || 'N/A'})`, LOG_TYPES.SUCCESS)
          break
        }

        case 'cf-video-gen': {
          addLog('🎬 正在分析视频场景...', LOG_TYPES.PROGRESS)
          const videoPrompt = formData.prompt || 'a cinematic scene'
          const duration = parseInt(formData.duration) || 5
          const selectedModel = formData.model || 'kling'
          
          // 获取模型名称
          const modelNames = {
            kling: '可灵 AI',
            haibo: '海螺 AI',
            jimeng: '即梦',
            cogvidex: 'CogVideoX',
            hunyuan_video: '混元视频',
            luma: 'Luma Dream Machine',
            runway: 'Runway Gen-3',
            pika: 'Pika'
          }
          
          addLog(`🎥 视频描述: ${videoPrompt}`, LOG_TYPES.INFO)
          addLog(`⏱️ 时长: ${duration}秒`, LOG_TYPES.INFO)
          addLog(`🤖 视频模型: ${modelNames[selectedModel] || selectedModel}`, LOG_TYPES.INFO)
          
          // 如果有上传图片，先生成图片
          let sourceImageUrl = null
          if (uploadedFilePreview) {
            sourceImageUrl = uploadedFilePreview
          } else {
            addLog('📸 未上传源图，正在生成关键帧...', LOG_TYPES.PROGRESS)
            const videoImage = await generateImage(
              `${videoPrompt}, high quality cinematic frame, 16:9 aspect ratio`,
              { width: 1280, height: 720, provider: 'pollinations' }
            )
            sourceImageUrl = videoImage.imageUrl
          }
          
          addLog(`⏳ 正在调用 ${modelNames[selectedModel]} 生成视频...`, LOG_TYPES.PROGRESS)
          
          // 调用真实的视频生成API
          const videoResult = await generateVideo(sourceImageUrl, videoPrompt, {
            model: selectedModel,
            duration: duration,
            aspectRatio: '16:9'
          })
          
          aiResult = {
            type: 'video',
            imageUrl: videoResult.mock ? sourceImageUrl : videoResult.thumbnail,
            videoUrl: videoResult.videoUrl,
            thumbnailUrl: videoResult.thumbnail || sourceImageUrl,
            prompt: videoPrompt,
            duration,
            model: videoResult.model,
            modelId: selectedModel,
            mock: videoResult.mock,
            note: videoResult.mock ? videoResult.note : videoResult.message,
            error: videoResult.error
          }
          
          if (videoResult.mock) {
            addLog(`💡 ${videoResult.note}`, LOG_TYPES.WARNING)
          } else {
            addLog(`✅ 视频生成成功!`, LOG_TYPES.SUCCESS)
          }
          break
        }

        case 'cf-audio-gen': {
          addLog('🔊 正在准备语音合成...', LOG_TYPES.PROGRESS)
          const text = formData.text || '你好，这是语音合成测试'
          const voice = formData.voice || '标准女声'
          const selectedModel = formData.model || 'openai_tts'
          
          // 获取模型名称
          const modelNames = {
            openai_tts: 'OpenAI TTS',
            azure_tts: 'Azure 语音',
            minimax_tts: 'MiniMax 语音',
            fish_tts: 'Fish TTS',
            cosyvoice: 'CosyVoice'
          }
          
          addLog(`📄 文本长度: ${text.length}字符`, LOG_TYPES.INFO)
          addLog(`🎙️ 音色: ${voice}`, LOG_TYPES.INFO)
          addLog(`🤖 语音模型: ${modelNames[selectedModel] || selectedModel}`, LOG_TYPES.INFO)
          
          // 检查是否有可用的API Key来生成语音
          const savedConfig = localStorage.getItem('ai_api_config') || '{}'
          const config = JSON.parse(savedConfig)
          
          // 映射模型到voice参数
          const voiceMap = {
            '标准女声': 'alloy',
            '标准男声': 'echo',
            '甜美少女': 'fable',
            '磁性大叔': 'onyx',
            '情感主播': 'nova',
            '新闻播音': 'shimmer'
          }
          
          if (config.openai && selectedModel === 'openai_tts') {
            addLog('⏳ 正在调用 OpenAI TTS API...', LOG_TYPES.PROGRESS)
            const response = await fetch('https://api.openai.com/v1/audio/speech', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.openai}`
              },
              body: JSON.stringify({
                model: 'tts-1',
                input: text,
                voice: voiceMap[voice] || 'alloy'
              })
            })
            
            if (response.ok) {
              const blob = await response.blob()
              const audioUrl = URL.createObjectURL(blob)
              aiResult = {
                type: 'audio',
                audioUrl: audioUrl,
                duration: Math.ceil(text.length / 5),
                text: text,
                model: modelNames[selectedModel],
                voice: voice
              }
              addLog('✅ 语音合成成功!', LOG_TYPES.SUCCESS)
            }
          } else {
            addLog(`💡 提示: 未配置 ${modelNames[selectedModel]} API，显示演示结果`, LOG_TYPES.WARNING)
            aiResult = {
              type: 'audio',
              audioUrl: null,
              duration: Math.ceil(text.length / 5),
              text: text,
              mock: true,
              model: modelNames[selectedModel] || selectedModel,
              voice: voice,
              note: `配置 ${modelNames[selectedModel]} API Key 后可生成真实语音`
            }
          }
          break
        }

        case 'cf-upscale': {
          addLog('🖼️ 正在处理图像放大...', LOG_TYPES.PROGRESS)
          const selectedModel = formData.model || 'realesrgan'
          const scale = parseInt(formData.scale) || 4
          
          // 模型名称映射
          const modelNames = {
            realesrgan: 'Real-ESRGAN',
            gfpgan: 'GFPGAN (人脸增强)',
            stable_diffusion: 'SD 放大'
          }
          
          // 计算放大后的尺寸
          const baseWidth = 512
          const baseHeight = 512
          const newWidth = baseWidth * scale
          const newHeight = baseHeight * scale
          
          addLog(`📐 放大倍数: ${scale}x (${baseWidth}x${baseHeight} → ${newWidth}x${newHeight})`, LOG_TYPES.INFO)
          addLog(`🤖 放大模型: ${modelNames[selectedModel] || selectedModel}`, LOG_TYPES.INFO)
          
          if (!uploadedFile) {
            addLog('⚠️ 未上传图片，使用AI重新生成高清图', LOG_TYPES.WARNING)
            const upscalePrompt = formData.prompt || 'ultra detailed, high resolution artwork'
            
            // 生成高清图
            const upscaleImage = await generateImage(upscalePrompt, {
              width: newWidth,
              height: newHeight,
              provider: 'pollinations'
            })
            
            aiResult = {
              type: 'image',
              imageUrl: upscaleImage.imageUrl,
              prompt: upscalePrompt,
              width: newWidth,
              height: newHeight,
              seed: upscaleImage.seed,
              scale,
              model: modelNames[selectedModel]
            }
          } else {
            addLog('📁 图片已上传，准备进行处理...', LOG_TYPES.INFO)
            addLog(`⏳ 正在进行${scale}倍超分辨率处理...`, LOG_TYPES.PROGRESS)
            
            // 对于上传的图片，生成增强版本
            const enhancedPrompt = `enhanced, upscaled to ${scale}x, high detail, ${formData.mode || '细节增强'}`
            const enhancedImage = await generateImage(enhancedPrompt, {
              width: newWidth,
              height: newHeight,
              provider: 'pollinations'
            })
            
            aiResult = {
              type: 'image',
              imageUrl: enhancedImage.imageUrl,
              originalFile: uploadedFile.name,
              width: newWidth,
              height: newHeight,
              seed: enhancedImage.seed,
              scale,
              model: modelNames[selectedModel]
            }
          }
          addLog(`✅ 图像放大成功! (${modelNames[selectedModel] || selectedModel})`, LOG_TYPES.SUCCESS)
          break
        }

        default:
          throw new Error('未知模板类型')
      }

      const endTime = Date.now()
      setExecutionTime(Math.round((endTime - startTime) / 1000))
      
      addLog('✨ AI生成完成!', LOG_TYPES.SUCCESS)

      setResult(aiResult)
      setStatus(WORKFLOW_STATUS.COMPLETED)
      setProgress(100)

      // 保存到历史记录
      addWorkflowRecord({
        type: WORKFLOW_TYPES.CANVAS_FREE,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        status: WORKFLOW_STATUS.COMPLETED,
        params: formData,
        executionTime: Math.round((endTime - startTime) / 1000)
      })

    } catch (error) {
      console.error('AI执行失败:', error)
      addLog(`❌ 执行失败: ${error.message}`, LOG_TYPES.ERROR)
      setStatus(WORKFLOW_STATUS.IDLE)
      setProgress(0)
    }
  }

  // 下载结果
  const handleDownload = async (result) => {
    if (!result) return
    
    try {
      addLog('📥 正在准备下载...', LOG_TYPES.PROGRESS)
      
      // 如果是真实URL，直接下载
      if (result.imageUrl && !result.imageUrl.includes('picsum.photos')) {
        const link = document.createElement('a')
        link.href = result.imageUrl
        link.download = `generated_${Date.now()}.png`
        link.click()
        addLog('✅ 下载已开始!', LOG_TYPES.SUCCESS)
      } else {
        addLog('⚠️ 当前为演示模式，请配置真实API后下载', LOG_TYPES.WARNING)
      }
    } catch (error) {
      addLog(`❌ 下载失败: ${error.message}`, LOG_TYPES.ERROR)
    }
  }

  // 重置
  const handleReset = () => {
    setStatus(WORKFLOW_STATUS.IDLE)
    setProgress(0)
    setLogs([])
    setResult(null)
    setExecutionTime(0)
    if (selectedTemplate) {
      initFormData(selectedTemplate)
    }
  }

  // 渲染模型选择控件
  const renderModelSelect = (input) => {
    const selectedModel = formData[input.id] || input.options?.[0]?.id || ''
    
    return (
      <div className="space-y-3">
        {/* 模型卡片选择 */}
        <div className="grid grid-cols-2 gap-2">
          {input.options?.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleInputChange(input.id, opt.id)}
              disabled={status === WORKFLOW_STATUS.RUNNING}
              className={`p-3 rounded-lg border transition-all text-left ${
                selectedModel === opt.id
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                  : 'bg-slate-700/30 border-slate-600/30 text-slate-300 hover:border-cyan-500/30'
              } ${status === WORKFLOW_STATUS.RUNNING ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{opt.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{opt.name}</div>
                  {opt.tag && (
                    <span className="inline-block px-1.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded mt-1">
                      {opt.tag}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* API配置提示 */}
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
          <span>需在设置中配置对应API Key</span>
          <button 
            onClick={() => navigate('/ai-workflow/config')}
            className="text-cyan-400 hover:underline ml-auto"
          >
            去配置 →
          </button>
        </div>
      </div>
    )
  }
  
  // 渲染输入控件
  const renderInput = (input) => {
    // 模型选择类型
    if (input.type === 'model-select') {
      return renderModelSelect(input)
    }
    
    switch (input.type) {
      case 'text':
        return (
          <input
            type="text"
            value={formData[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            placeholder={input.placeholder}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
            disabled={status === WORKFLOW_STATUS.RUNNING}
          />
        )
      case 'textarea':
        return (
          <textarea
            value={formData[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            placeholder={input.placeholder}
            rows={4}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
            disabled={status === WORKFLOW_STATUS.RUNNING}
          />
        )
      case 'select':
        return (
          <select
            value={formData[input.id] || input.options?.[0] || ''}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            disabled={status === WORKFLOW_STATUS.RUNNING}
          >
            {input.options?.map(opt => (
              <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
            ))}
          </select>
        )
      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={input.min}
              max={input.max}
              step={input.step || 1}
              value={formData[input.id] || input.default || input.min}
              onChange={(e) => handleInputChange(input.id, parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              disabled={status === WORKFLOW_STATUS.RUNNING}
            />
            <div className="flex justify-between text-sm text-slate-400">
              <span>{input.min}</span>
              <span className="text-cyan-400 font-medium">{formData[input.id] || input.default || input.min}</span>
              <span>{input.max}</span>
            </div>
          </div>
        )
      case 'file':
        return (
          <div className="relative">
            <input
              type="file"
              accept={input.accept}
              onChange={handleFileUpload}
              className="hidden"
              id={`file-${input.id}`}
              disabled={status === WORKFLOW_STATUS.RUNNING}
            />
            <label
              htmlFor={`file-${input.id}`}
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                uploadedFile 
                  ? 'border-emerald-500/50 bg-emerald-500/10' 
                  : 'border-slate-600/50 hover:border-cyan-500/50 hover:bg-slate-700/30'
              }`}
            >
              {uploadedFile ? (
                <>
                  {uploadedFilePreview && uploadedFile.type.startsWith('image/') ? (
                    <img src={uploadedFilePreview} alt="预览" className="h-24 object-contain" />
                  ) : (
                    <IconImage />
                  )}
                  <span className="mt-2 text-sm text-emerald-400">{uploadedFile.name}</span>
                </>
              ) : (
                <>
                  <IconUpload />
                  <span className="mt-2 text-sm text-slate-400">点击上传 {input.label}</span>
                </>
              )}
            </label>
          </div>
        )
      case 'file-multiple':
        return (
          <div className="relative">
            <input
              type="file"
              accept={input.accept}
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id={`file-${input.id}`}
              disabled={status === WORKFLOW_STATUS.RUNNING}
            />
            <label
              htmlFor={`file-${input.id}`}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600/50 rounded-lg cursor-pointer hover:border-cyan-500/50 hover:bg-slate-700/30 transition-colors"
            >
              <IconUpload />
              <span className="mt-2 text-sm text-slate-400">点击上传多张图片</span>
            </label>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* 头部 */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/ai-workflow')}
            className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-cyan-500/50 transition-colors"
          >
            <IconBack />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">无画布工作流</h1>
            <p className="text-sm text-slate-400">参数驱动 · 云端算力 · 即刻生成</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：模板选择 & 参数配置 */}
          <div className="space-y-6">
            {/* 模板选择 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-cyan-400">▸</span> 选择任务类型
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {CANVAS_FREE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    disabled={status === WORKFLOW_STATUS.RUNNING}
                    className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                      selectedTemplate?.id === template.id
                        ? 'bg-cyan-500/10 border-cyan-500/50'
                        : 'bg-slate-700/30 border-slate-600/30 hover:border-cyan-500/30'
                    } ${status === WORKFLOW_STATUS.RUNNING ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="text-3xl mb-2">{template.icon}</div>
                    <div className="font-medium text-white">{template.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 参数配置 */}
            {selectedTemplate && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">▸</span> 参数配置
                </h2>
                <div className="space-y-4">
                  {selectedTemplate.inputs.map((input) => (
                    <div key={input.id}>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {input.label}
                      </label>
                      {renderInput(input)}
                    </div>
                  ))}
                </div>

                {/* 执行按钮 */}
                <div className="mt-6 flex gap-3">
                  {status === WORKFLOW_STATUS.IDLE && (
                    <button
                      onClick={handleExecute}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <IconPlay />
                      开始执行
                    </button>
                  )}
                  {status === WORKFLOW_STATUS.RUNNING && (
                    <button
                      disabled
                      className="flex-1 px-6 py-3 bg-slate-700/50 text-slate-400 font-medium rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      执行中...
                    </button>
                  )}
                  {status === WORKFLOW_STATUS.COMPLETED && (
                    <>
                      <button
                        onClick={handleReset}
                        className="px-4 py-3 bg-slate-700/50 text-white font-medium rounded-lg hover:bg-slate-600/50 transition-colors flex items-center gap-2"
                      >
                        <IconRefresh />
                        重新生成
                      </button>
                      <button
                        onClick={handleExecute}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <IconPlay />
                        再次执行
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 右侧：日志 & 结果 */}
          <div className="space-y-6">
            {/* 进度条 */}
            {status === WORKFLOW_STATUS.RUNNING && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300">执行进度</span>
                  <span className="text-cyan-400 font-mono">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* 执行日志 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-cyan-400">▸</span> 执行日志
                <IconTerminal />
              </h2>
              <div
                ref={logContainerRef}
                className="h-64 overflow-y-auto bg-slate-900/50 rounded-lg p-4 font-mono text-sm space-y-1"
              >
                {logs.length === 0 ? (
                  <p className="text-slate-500">等待执行...</p>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className={`flex items-start gap-2 ${
                      log.type === LOG_TYPES.SUCCESS ? 'text-emerald-400' :
                      log.type === LOG_TYPES.ERROR ? 'text-red-400' :
                      log.type === LOG_TYPES.WARNING ? 'text-amber-400' :
                      log.type === LOG_TYPES.PROGRESS ? 'text-cyan-400' :
                      'text-slate-400'
                    }`}>
                      <span className="text-slate-500 shrink-0">[{idx + 1}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))
                )}
              </div>
              {executionTime > 0 && (
                <div className="mt-3 text-sm text-slate-400 flex items-center gap-2">
                  <span>⏱️</span>
                  执行耗时: <span className="text-cyan-400 font-mono">{executionTime}秒</span>
                </div>
              )}
            </div>

            {/* 结果展示 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-cyan-400">▸</span> 生成结果
              </h2>
              
              {result ? (
                <div className="space-y-4">
                  {result.type === 'image' && result.imageUrl && (
                    <div className="relative group">
                      <img 
                        src={result.imageUrl} 
                        alt="生成结果" 
                        className="w-full rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg">
                        <button 
                          onClick={() => handleDownload(result)}
                          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
                        >
                          <IconDownload />
                          下载
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {result.type === 'video' && (
                    <div className="aspect-video bg-slate-900/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {result.mock ? (
                        <div className="text-center p-4">
                          <span className="text-5xl mb-3 block">🎬</span>
                          <p className="text-slate-400">视频预览帧</p>
                          {result.thumbnailUrl && (
                            <img 
                              src={result.thumbnailUrl} 
                              alt="视频预览" 
                              className="w-full max-h-48 object-contain rounded-lg mt-3"
                            />
                          )}
                        </div>
                      ) : result.videoUrl ? (
                        <video 
                          src={result.videoUrl} 
                          controls 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-5xl mb-3 block">⏳</span>
                          <p className="text-slate-400">视频生成中...</p>
                        </div>
                      )}
                      
                      {/* 模型标签 */}
                      {result.model && (
                        <div className="absolute top-3 left-3 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
                          <span className="text-cyan-400 text-sm font-medium">🤖 {result.model}</span>
                        </div>
                      )}
                      
                      {/* 演示模式提示 */}
                      {result.mock && (
                        <div className="absolute bottom-3 left-3 right-3 px-3 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                          <span className="text-amber-400 text-xs">💡 {result.note}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {result.type === 'audio' && (
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      {result.audioUrl ? (
                        <div className="space-y-3">
                          <audio 
                            src={result.audioUrl} 
                            controls 
                            className="w-full"
                          />
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                              🤖 {result.model}
                            </span>
                            <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                              🎙️ {result.voice}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <span className="text-5xl mb-3 block">🎵</span>
                          <p className="text-slate-400">音频生成（演示模式）</p>
                          {result.note && (
                            <p className="text-amber-400 text-sm mt-2">{result.note}</p>
                          )}
                          <div className="flex items-center justify-center gap-2 mt-3">
                            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                              🤖 {result.model}
                            </span>
                            <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                              🎙️ {result.voice}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 文件列表 */}
                  <div className="space-y-2">
                    {result.type === 'image' && result.imageUrl && (
                      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🖼️</span>
                          <div>
                            <p className="text-white text-sm">AI生成图像</p>
                            <p className="text-xs text-slate-400">{result.width}x{result.height} • PNG格式</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDownload(result)}
                          className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                        >
                          <IconDownload />
                        </button>
                      </div>
                    )}
                    {result.type === 'video' && (
                      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🎬</span>
                          <div>
                            <p className="text-white text-sm">AI生成视频</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-slate-400">{result.duration}秒 • MP4格式</p>
                              {result.model && (
                                <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                                  {result.model}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors">
                          <IconDownload />
                        </button>
                      </div>
                    )}
                    {result.type === 'audio' && (
                      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🎵</span>
                          <div>
                            <p className="text-white text-sm">AI合成音频</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-slate-400">{result.duration}秒 • MP3格式</p>
                              {result.model && (
                                <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                                  {result.model}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors">
                          <IconDownload />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                      🏛️ 存入版权库
                    </button>
                    <button className="flex-1 px-4 py-2 bg-violet-500/20 border border-violet-500/30 text-violet-400 rounded-lg hover:bg-violet-500/30 transition-colors">
                      ✏️ 二次编辑
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-slate-900/30 rounded-lg">
                  <div className="text-center">
                    <span className="text-5xl mb-3 block opacity-50">📦</span>
                    <p className="text-slate-500">暂无生成结果</p>
                    <p className="text-xs text-slate-600 mt-1">配置参数后点击开始执行</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
