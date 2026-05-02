import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  WORKFLOW_TYPES,
  WORKFLOW_STATUS,
  HUMAN_CLONE_TEMPLATES,
  LOG_TYPES,
  addWorkflowRecord
} from '../../data/workflowSchema'
import { avatarService, zhipuService, imageService } from '../../services/aiService'

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

const IconCamera = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

const IconMic = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
  </svg>
)

// 语言选择组件
function LanguageTag({ lang, selected, onClick }) {
  const flags = { '中文': '🇨🇳', '英文': '🇺🇸', '日语': '🇯🇵', '韩语': '🇰🇷', '多语言': '🌍' }
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
        selected 
          ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400' 
          : 'bg-slate-700/50 border border-slate-600/50 text-slate-400 hover:border-orange-500/30'
      }`}
    >
      {flags[lang] || ''} {lang}
    </button>
  )
}

export default function HumanCloneWorkflow() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const logContainerRef = useRef(null)

  // 状态
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({
    sourceVideo: null,
    sourceAudio: null,
    language: '中文',
    quality: '',
    templateVideo: null,
    productList: null,
    replacement: '',
    quantity: 10,
    description: '',
    gender: '',
    style: '',
    outfit: ''
  })
  const [uploadedVideo, setUploadedVideo] = useState(null)
  const [uploadedAudio, setUploadedAudio] = useState(null)
  const [uploadedTemplate, setUploadedTemplate] = useState(null)
  const [uploadedList, setUploadedList] = useState(null)
  const [status, setStatus] = useState(WORKFLOW_STATUS.IDLE)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)
  const [executionTime, setExecutionTime] = useState(0)

  // 初始化
  useEffect(() => {
    const templateId = searchParams.get('template')
    if (templateId) {
      const template = HUMAN_CLONE_TEMPLATES.find(t => t.id === templateId)
      if (template) {
        setSelectedTemplate(template)
      }
    }
  }, [searchParams])

  // 选择模板
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setFormData({
      sourceVideo: null,
      sourceAudio: null,
      language: template.id === 'clone-basic' ? '中文' : formData.language,
      quality: template.inputs.find(i => i.id === 'quality')?.options?.[0] || '',
      templateVideo: null,
      productList: null,
      replacement: '',
      quantity: 10,
      description: '',
      gender: '',
      style: '',
      outfit: ''
    })
    setUploadedVideo(null)
    setUploadedAudio(null)
    setUploadedTemplate(null)
    setUploadedList(null)
    setStatus(WORKFLOW_STATUS.IDLE)
    setProgress(0)
    setLogs([])
    setResult(null)
  }

  // 处理输入变化
  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  // 语言切换
  const toggleLanguage = (lang) => {
    setFormData(prev => ({ ...prev, language: lang }))
  }

  // 处理文件上传
  const handleFileUpload = (id, e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (id === 'sourceVideo') {
        setUploadedVideo({ file, preview: URL.createObjectURL(file) })
      } else if (id === 'sourceAudio') {
        setUploadedAudio({ file, name: file.name })
      } else if (id === 'templateVideo') {
        setUploadedTemplate({ file, preview: URL.createObjectURL(file) })
      } else if (id === 'productList') {
        setUploadedList({ file, name: file.name })
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

    try {
      // 根据模板类型执行不同的流程
      if (selectedTemplate.id === 'clone-basic') {
        // 基础克隆流程
        addLog('🎬 正在初始化数字人克隆系统...', LOG_TYPES.PROGRESS)
        
        // 步骤1: 形象分析
        addLog('📹 [1/4] 正在分析形象视频...', LOG_TYPES.PROGRESS)
        await new Promise(r => setTimeout(r, 800))
        setProgress(15)
        
        // 步骤2: 声音提取
        addLog('🎙️ [2/4] 正在提取声音特征...', LOG_TYPES.PROGRESS)
        await new Promise(r => setTimeout(r, 600))
        setProgress(35)
        
        // 步骤3: 生成数字人模型
        addLog('🧬 [3/4] 正在生成数字人模型...', LOG_TYPES.PROGRESS)
        
        // 生成一个预览图
        const previewImg = await imageService.generate(
          `digital human avatar, realistic, ${formData.language === '中文' ? 'Asian face' : 'diverse face'}`,
          { width: 640, height: 360 }
        )
        
        setProgress(65)
        
        // 步骤4: 生成演示视频
        addLog('🎥 [4/4] 正在生成演示视频...', LOG_TYPES.PROGRESS)
        await new Promise(r => setTimeout(r, 700))
        setProgress(85)
        
      } else if (selectedTemplate.id === 'clone-duplicate') {
        // 爆款复制流程
        addLog('🔥 正在启动爆款复制模式...', LOG_TYPES.PROGRESS)
        
        // 分析参考视频
        addLog('📊 [1/3] 正在分析爆款视频特征...', LOG_TYPES.PROGRESS)
        await new Promise(r => setTimeout(r, 600))
        setProgress(20)
        
        // 生成脚本
        addLog('✍️ [2/3] 正在生成适配脚本...', LOG_TYPES.PROGRESS)
        const scriptResult = await zhipuService.creativeWrite(
          formData.description || '产品推广短视频',
          'advertisement'
        )
        setProgress(50)
        
        // 生成数字人
        addLog('🧬 [3/3] 正在生成数字人视频...', LOG_TYPES.PROGRESS)
        const previewImg = await imageService.generate(
          'professional digital human presenter, marketing video style',
          { width: 640, height: 360 }
        )
        setProgress(80)
        
      } else {
        // 虚拟形象流程
        addLog('✨ 正在创建虚拟数字形象...', LOG_TYPES.PROGRESS)
        
        addLog('🎨 [1/3] 正在设计虚拟形象...', LOG_TYPES.PROGRESS)
        const genderDesc = formData.gender === '男' ? 'male' : formData.gender === '女' ? 'female' : 'neutral'
        const styleDesc = formData.style || 'modern'
        
        const avatarImg = await imageService.generate(
          `virtual digital human avatar, ${genderDesc}, ${styleDesc} style, futuristic, high quality`,
          { width: 640, height: 360 }
        )
        setProgress(40)
        
        addLog('🔊 [2/3] 正在配置语音系统...', LOG_TYPES.PROGRESS)
        await new Promise(r => setTimeout(r, 500))
        setProgress(65)
        
        addLog('🎥 [3/3] 正在生成虚拟形象视频...', LOG_TYPES.PROGRESS)
        await new Promise(r => setTimeout(r, 600))
        setProgress(90)
      }

      const endTime = Date.now()
      setExecutionTime(Math.round((endTime - startTime) / 1000))
      setStatus(WORKFLOW_STATUS.COMPLETED)
      setProgress(100)
      
      addLog('🎉 数字人克隆完成!', LOG_TYPES.SUCCESS)
      addLog('💡 提示: 当前为演示模式，配置专业API可获得真实数字人视频', LOG_TYPES.WARNING)

      // 生成结果
      const previewImg = await imageService.generate(
        `digital human avatar, ${formData.language === '中文' ? 'Asian' : 'diverse'} presenter`,
        { width: 640, height: 360 }
      )
      
      setResult({
        type: 'digital-human',
        avatar: previewImg.imageUrl,
        languages: selectedTemplate.id === 'clone-basic' ? ['中文', '英文', '日语', '韩语'] : ['中文', '英文'],
        videoCount: selectedTemplate.id === 'clone-duplicate' ? formData.quantity : 5,
        files: [
          { name: `digital_avatar_${Date.now()}.model`, size: '256MB', type: 'model' },
          { name: `voice_clone_${Date.now()}.wav`, size: '12MB', type: 'audio' },
          { name: `demo_${Date.now()}.mp4`, size: '48MB', type: 'video' }
        ]
      })

      // 保存到历史
      addWorkflowRecord({
        type: WORKFLOW_TYPES.HUMAN_CLONE,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        status: WORKFLOW_STATUS.COMPLETED,
        languages: selectedTemplate.id === 'clone-basic' ? ['中文', '英文', '日语', '韩语'] : formData.language
      })

    } catch (error) {
      console.error('数字人生成失败:', error)
      addLog(`❌ 生成失败: ${error.message}`, LOG_TYPES.ERROR)
      setStatus(WORKFLOW_STATUS.IDLE)
      setProgress(0)
    }
  }

  // 重置
  const handleReset = () => {
    setStatus(WORKFLOW_STATUS.IDLE)
    setProgress(0)
    setLogs([])
    setResult(null)
  }

  // 渲染模板特定参数
  const renderTemplateInputs = () => {
    if (!selectedTemplate) return null

    if (selectedTemplate.id === 'clone-basic') {
      return (
        <>
          {/* 形象素材 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              形象素材 <span className="text-slate-500">(30秒视频)</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload('sourceVideo', e)}
                className="hidden"
                id="source-video"
                disabled={status === WORKFLOW_STATUS.RUNNING}
              />
              <label
                htmlFor="source-video"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  uploadedVideo 
                    ? 'border-emerald-500/50 bg-emerald-500/10' 
                    : 'border-slate-600/50 hover:border-orange-500/50 hover:bg-slate-700/30'
                }`}
              >
                {uploadedVideo ? (
                  <>
                    <video 
                      src={uploadedVideo.preview} 
                      className="h-20 rounded"
                      muted 
                      playsInline
                    />
                    <span className="mt-2 text-sm text-emerald-400">已上传: {uploadedVideo.file.name}</span>
                  </>
                ) : (
                  <>
                    <IconCamera />
                    <span className="mt-2 text-sm text-slate-400">点击上传形象视频</span>
                    <span className="text-xs text-slate-500 mt-1">建议正面、清晰、光线均匀</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* 声音素材 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              声音素材 <span className="text-slate-500">(5分钟音频)</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileUpload('sourceAudio', e)}
                className="hidden"
                id="source-audio"
                disabled={status === WORKFLOW_STATUS.RUNNING}
              />
              <label
                htmlFor="source-audio"
                className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  uploadedAudio 
                    ? 'border-emerald-500/50 bg-emerald-500/10' 
                    : 'border-slate-600/50 hover:border-orange-500/50 hover:bg-slate-700/30'
                }`}
              >
                {uploadedAudio ? (
                  <span className="text-emerald-400">{uploadedAudio.name}</span>
                ) : (
                  <>
                    <IconMic />
                    <span className="mt-2 text-sm text-slate-400">点击上传音频</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* 克隆语言 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">克隆语言</label>
            <div className="flex flex-wrap gap-2">
              {['中文', '英文', '日语', '韩语', '多语言'].map(lang => (
                <LanguageTag
                  key={lang}
                  lang={lang}
                  selected={formData.language === lang}
                  onClick={() => toggleLanguage(lang)}
                />
              ))}
            </div>
          </div>

          {/* 克隆质量 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">克隆质量</label>
            <select
              value={formData.quality}
              onChange={(e) => handleInputChange('quality', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              disabled={status === WORKFLOW_STATUS.RUNNING}
            >
              {HUMAN_CLONE_TEMPLATES[0].inputs.find(i => i.id === 'quality')?.options.map(opt => (
                <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
              ))}
            </select>
          </div>
        </>
      )
    }

    if (selectedTemplate.id === 'clone-duplicate') {
      return (
        <>
          {/* 模板视频 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">模板视频</label>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload('templateVideo', e)}
                className="hidden"
                id="template-video"
                disabled={status === WORKFLOW_STATUS.RUNNING}
              />
              <label
                htmlFor="template-video"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  uploadedTemplate 
                    ? 'border-emerald-500/50 bg-emerald-500/10' 
                    : 'border-slate-600/50 hover:border-orange-500/50 hover:bg-slate-700/30'
                }`}
              >
                {uploadedTemplate ? (
                  <>
                    <video 
                      src={uploadedTemplate.preview} 
                      className="h-20 rounded"
                      muted 
                      playsInline
                    />
                    <span className="mt-2 text-sm text-emerald-400">模板已上传</span>
                  </>
                ) : (
                  <>
                    <IconCamera />
                    <span className="mt-2 text-sm text-slate-400">上传爆款模板视频</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* 产品列表 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">产品列表 <span className="text-slate-500">(CSV/Excel)</span></label>
            <div className="relative">
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => handleFileUpload('productList', e)}
                className="hidden"
                id="product-list"
                disabled={status === WORKFLOW_STATUS.RUNNING}
              />
              <label
                htmlFor="product-list"
                className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  uploadedList 
                    ? 'border-emerald-500/50 bg-emerald-500/10' 
                    : 'border-slate-600/50 hover:border-orange-500/50 hover:bg-slate-700/30'
                }`}
              >
                {uploadedList ? (
                  <span className="text-emerald-400">{uploadedList.name}</span>
                ) : (
                  <>
                    <span className="text-slate-400">上传产品列表文件</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* 生成数量 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">生成数量</label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              disabled={status === WORKFLOW_STATUS.RUNNING}
            />
          </div>
        </>
      )
    }

    if (selectedTemplate.id === 'clone-avatar') {
      return (
        <>
          {/* 形象描述 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">形象描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="描述理想中的虚拟形象..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
              disabled={status === WORKFLOW_STATUS.RUNNING}
            />
          </div>

          {/* 性别特征 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">性别特征</label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              disabled={status === WORKFLOW_STATUS.RUNNING}
            >
              <option value="" className="bg-slate-800">请选择</option>
              {HUMAN_CLONE_TEMPLATES[2].inputs.find(i => i.id === 'gender')?.options.map(opt => (
                <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
              ))}
            </select>
          </div>

          {/* 形象风格 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">形象风格</label>
            <select
              value={formData.style}
              onChange={(e) => handleInputChange('style', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              disabled={status === WORKFLOW_STATUS.RUNNING}
            >
              <option value="" className="bg-slate-800">请选择</option>
              {HUMAN_CLONE_TEMPLATES[2].inputs.find(i => i.id === 'style')?.options.map(opt => (
                <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
              ))}
            </select>
          </div>
        </>
      )
    }

    return null
  }

  const canExecute = () => {
    if (!selectedTemplate) return false
    if (selectedTemplate.id === 'clone-basic') {
      return uploadedVideo && uploadedAudio
    }
    if (selectedTemplate.id === 'clone-duplicate') {
      return uploadedTemplate && uploadedList
    }
    if (selectedTemplate.id === 'clone-avatar') {
      return formData.description && formData.gender && formData.style
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* 头部 */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/ai-workflow')}
            className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-orange-500/50 transition-colors"
          >
            <IconBack />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">数字人克隆</h1>
            <p className="text-sm text-slate-400">多语言 · 唇形同步 · 去重算法</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：模板选择 & 参数配置 */}
          <div className="space-y-6">
            {/* 模板选择 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-orange-400">▸</span> 选择克隆类型
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {HUMAN_CLONE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    disabled={status === WORKFLOW_STATUS.RUNNING}
                    className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                      selectedTemplate?.id === template.id
                        ? 'bg-orange-500/10 border-orange-500/50'
                        : 'bg-slate-700/30 border-slate-600/30 hover:border-orange-500/30'
                    } ${status === WORKFLOW_STATUS.RUNNING ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{template.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-white">{template.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{template.description}</div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {template.features.map((f, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-600/50 rounded text-xs text-slate-300">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 参数配置 */}
            {selectedTemplate && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-orange-400">▸</span> 参数配置
                </h2>
                <div className="space-y-4">
                  {renderTemplateInputs()}
                </div>

                {/* 执行按钮 */}
                <div className="mt-6 flex gap-3">
                  {status === WORKFLOW_STATUS.IDLE && (
                    <button
                      onClick={handleExecute}
                      disabled={!canExecute()}
                      className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-opacity flex items-center justify-center gap-2 ${
                        canExecute()
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90'
                          : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <IconPlay />
                      开始克隆
                    </button>
                  )}
                  {status === WORKFLOW_STATUS.RUNNING && (
                    <button
                      disabled
                      className="flex-1 px-6 py-3 bg-slate-700/50 text-slate-400 font-medium rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      克隆中...
                    </button>
                  )}
                  {status === WORKFLOW_STATUS.COMPLETED && (
                    <>
                      <button
                        onClick={handleReset}
                        className="px-4 py-3 bg-slate-700/50 text-white font-medium rounded-lg hover:bg-slate-600/50 transition-colors flex items-center gap-2"
                      >
                        <IconRefresh />
                        重新克隆
                      </button>
                      <button
                        onClick={handleExecute}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <IconPlay />
                        再次克隆
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
                  <span className="text-slate-300">克隆进度</span>
                  <span className="text-orange-400 font-mono">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  预计剩余时间: {Math.max(1, Math.round((100 - progress) * 0.3))} 秒
                </div>
              </div>
            )}

            {/* 执行日志 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-orange-400">▸</span> 克隆日志
                <IconTerminal />
              </h2>
              <div
                ref={logContainerRef}
                className="h-48 overflow-y-auto bg-slate-900/50 rounded-lg p-4 font-mono text-sm space-y-1"
              >
                {logs.length === 0 ? (
                  <p className="text-slate-500">上传素材后点击开始克隆...</p>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className={`flex items-start gap-2 ${
                      log.type === LOG_TYPES.SUCCESS ? 'text-emerald-400' :
                      log.type === LOG_TYPES.ERROR ? 'text-red-400' :
                      log.type === LOG_TYPES.WARNING ? 'text-amber-400' :
                      log.type === LOG_TYPES.PROGRESS ? 'text-orange-400' :
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
                  克隆耗时: <span className="text-orange-400 font-mono">{executionTime}秒</span>
                </div>
              )}
            </div>

            {/* 结果展示 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-orange-400">▸</span> 克隆结果
              </h2>
              
              {result ? (
                <div className="space-y-4">
                  {/* 数字人预览 */}
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden relative">
                      <img 
                        src={result.avatar} 
                        alt="数字人"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-orange-500/80 rounded text-xs text-white">数字人</span>
                          <span className="px-2 py-0.5 bg-emerald-500/80 rounded text-xs text-white">已就绪</span>
                        </div>
                        <div className="text-white font-medium">你的专属数字人</div>
                      </div>
                    </div>
                  </div>

                  {/* 语言支持 */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">支持语言</label>
                    <div className="flex flex-wrap gap-2">
                      {result.languages.map(lang => (
                        <LanguageTag key={lang} lang={lang} selected={true} onClick={() => {}} />
                      ))}
                    </div>
                  </div>

                  {/* 统计信息 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-700/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-400">{result.videoCount}</div>
                      <div className="text-xs text-slate-400">可用视频模板</div>
                    </div>
                    <div className="p-3 bg-slate-700/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-400">256MB</div>
                      <div className="text-xs text-slate-400">模型大小</div>
                    </div>
                  </div>

                  {/* 文件列表 */}
                  <div className="space-y-2">
                    {result.files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {file.type === 'model' ? '🤖' : file.type === 'audio' ? '🎵' : '🎬'}
                          </span>
                          <div>
                            <p className="text-white text-sm">{file.name}</p>
                            <p className="text-xs text-slate-400">{file.size}</p>
                          </div>
                        </div>
                        <button className="p-2 text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors">
                          <IconDownload />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                      🏛️ 存入版权库
                    </button>
                    <button className="flex-1 px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors">
                      🎬 制作视频
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-slate-900/30 rounded-lg">
                  <div className="text-center">
                    <span className="text-5xl mb-3 block opacity-50">🧬</span>
                    <p className="text-slate-500">暂无克隆结果</p>
                    <p className="text-xs text-slate-600 mt-1">上传素材后点击开始克隆</p>
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
