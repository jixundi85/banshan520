import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  WORKFLOW_TYPES,
  WORKFLOW_STATUS,
  AD_TEMPLATES,
  LOG_TYPES,
  addWorkflowRecord
} from '../../data/workflowSchema'
import { workflowService, zhipuService, imageService } from '../../services/aiService'

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

// 尺寸预览组件
function SizePreview({ size, selected, onClick }) {
  const sizes = {
    '1:1': { label: '1:1', desc: '社交媒体' },
    '16:9': { label: '16:9', desc: '横版视频' },
    '9:16': { label: '9:16', desc: '竖版story' },
    '4:5': { label: '4:5', desc: 'Instagram' }
  }
  
  const config = sizes[size] || { label: size, desc: '' }
  const isSquare = size === '1:1' || size === '4:5'
  
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border transition-all ${
        selected 
          ? 'bg-emerald-500/20 border-emerald-500/50' 
          : 'bg-slate-700/30 border-slate-600/30 hover:border-emerald-500/30'
      }`}
    >
      <div 
        className={`mx-auto bg-slate-600/50 ${isSquare ? 'w-10 h-10' : size === '16:9' ? 'w-14 h-8' : 'w-8 h-14'} rounded`}
      />
      <div className="mt-2 text-xs text-center">
        <div className={`font-medium ${selected ? 'text-emerald-400' : 'text-white'}`}>{config.label}</div>
        <div className="text-slate-500">{config.desc}</div>
      </div>
    </button>
  )
}

export default function AdWorkflow() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const logContainerRef = useRef(null)

  // 状态
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({
    productImages: [],
    productName: '',
    scene: '',
    style: '',
    sizes: ['1:1', '9:16'],
    highlights: '',
    discount: '',
    brandStory: '',
    duration: '',
    tone: '',
    transition: ''
  })
  const [uploadedImages, setUploadedImages] = useState([])
  const [status, setStatus] = useState(WORKFLOW_STATUS.IDLE)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)
  const [executionTime, setExecutionTime] = useState(0)

  // 初始化
  useEffect(() => {
    const templateId = searchParams.get('template')
    if (templateId) {
      const template = AD_TEMPLATES.find(t => t.id === templateId)
      if (template) {
        setSelectedTemplate(template)
      }
    }
  }, [searchParams])

  // 选择模板
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setFormData({
      productImages: [],
      productName: '',
      scene: template.inputs.find(i => i.id === 'scene')?.options?.[0] || '',
      style: template.inputs.find(i => i.id === 'style')?.options?.[0] || '',
      sizes: ['1:1', '9:16'],
      highlights: '',
      discount: '',
      brandStory: '',
      duration: template.inputs.find(i => i.id === 'duration')?.options?.[0] || '',
      tone: template.inputs.find(i => i.id === 'tone')?.options?.[0] || '',
      transition: template.inputs.find(i => i.id === 'transition')?.options?.[0] || ''
    })
    setUploadedImages([])
    setStatus(WORKFLOW_STATUS.IDLE)
    setProgress(0)
    setLogs([])
    setResult(null)
  }

  // 处理输入变化
  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  // 切换尺寸
  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  // 处理图片上传
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }))
    setUploadedImages(prev => [...prev, ...newImages])
    setFormData(prev => ({ ...prev, productImages: [...prev.productImages, ...newImages] }))
  }

  // 删除图片
  const removeImage = (index) => {
    setUploadedImages(prev => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  // 添加日志
  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, timestamp: Date.now() }])
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.scrollHeight
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
      // 构建广告提示词
      const productName = formData.productName || '产品'
      const scene = formData.scene || 'modern lifestyle'
      const style = formData.style || 'professional'
      const highlights = formData.highlights || ''
      
      addLog('📊 正在分析产品信息...', LOG_TYPES.PROGRESS)
      await new Promise(r => setTimeout(r, 500))
      
      // 步骤1: 生成广告文案
      addLog('✍️ [1/3] 正在生成广告文案...', LOG_TYPES.PROGRESS)
      
      let adCopy = ''
      try {
        const copyResult = await zhipuService.creativeWrite(
          `${productName} - ${highlights}`,
          'advertisement'
        )
        adCopy = copyResult
        addLog('✅ 广告文案生成成功!', LOG_TYPES.SUCCESS)
      } catch (e) {
        adCopy = `【${productName}】\n限时特惠，错过不再有！`
        addLog('⚠️ 使用默认文案', LOG_TYPES.WARNING)
      }
      
      setProgress(20)
      
      // 步骤2: 调用AI图像生成
      addLog('🎨 [2/3] 正在生成广告图像...', LOG_TYPES.PROGRESS)
      
      const adResult = await workflowService.adGeneration({
        productName,
        productDesc: `${scene}, ${style} style, ${highlights}`,
        style,
        formats: formData.sizes
      }, (status) => {
        setProgress(20 + Math.round(status.progress * 0.5))
        addLog(`📊 ${status.message}`, LOG_TYPES.PROGRESS)
      })
      
      setProgress(80)
      
      // 步骤3: 批量处理完成
      addLog('✨ [3/3] 正在整理生成结果...', LOG_TYPES.PROGRESS)
      await new Promise(r => setTimeout(r, 300))
      
      const endTime = Date.now()
      setExecutionTime(Math.round((endTime - startTime) / 1000))
      setStatus(WORKFLOW_STATUS.COMPLETED)
      setProgress(100)
      
      addLog('🎉 广告素材生成完成!', LOG_TYPES.SUCCESS)
      
      if (adResult.images?.some(img => img.imageUrl?.includes('pollinations'))) {
        addLog('💡 提示: 当前使用免费AI服务(Pollinations)，配置API可获得更高质量', LOG_TYPES.WARNING)
      }

      // 生成结果
      setResult({
        type: 'images',
        adCopy,
        totalAssets: adResult.images?.length || 0,
        sizes: formData.sizes,
        images: adResult.images || [],
        mock: adResult.mock
      })

      // 保存到历史
      addWorkflowRecord({
        type: WORKFLOW_TYPES.AD,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        status: WORKFLOW_STATUS.COMPLETED,
        sizes: formData.sizes,
        totalAssets: adResult.images?.length || 0
      })

    } catch (error) {
      console.error('广告生成失败:', error)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* 头部 */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/ai-workflow')}
            className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-emerald-500/50 transition-colors"
          >
            <IconBack />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">广告自动生成</h1>
            <p className="text-sm text-slate-400">产品LoRA · 批量输出 · 全平台适配</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：模板选择 & 参数配置 */}
          <div className="space-y-6">
            {/* 模板选择 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-400">▸</span> 选择广告类型
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {AD_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    disabled={status === WORKFLOW_STATUS.RUNNING}
                    className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                      selectedTemplate?.id === template.id
                        ? 'bg-emerald-500/10 border-emerald-500/50'
                        : 'bg-slate-700/30 border-slate-600/30 hover:border-emerald-500/30'
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
                  <span className="text-emerald-400">▸</span> 参数配置
                </h2>
                <div className="space-y-4">
                  {/* 产品图片上传 */}
                  {selectedTemplate.inputs.some(i => i.type === 'file' || i.type === 'file-multiple') && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {selectedTemplate.id === 'ad-listing' ? '产品图片组' : '产品图片'}
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          multiple={selectedTemplate.id === 'ad-listing'}
                          onChange={handleImageUpload}
                          className="hidden"
                          id="product-images"
                          disabled={status === WORKFLOW_STATUS.RUNNING}
                        />
                        <label
                          htmlFor="product-images"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600/50 rounded-lg cursor-pointer hover:border-emerald-500/50 hover:bg-slate-700/30 transition-colors"
                        >
                          <IconUpload />
                          <span className="mt-2 text-sm text-slate-400">
                            点击上传产品图片
                          </span>
                          <span className="text-xs text-slate-500 mt-1">
                            支持 JPG/PNG，建议 1024x1024 以上
                          </span>
                        </label>
                      </div>
                      {uploadedImages.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {uploadedImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img 
                                src={img.preview} 
                                alt={img.name} 
                                className="w-16 h-16 object-cover rounded-lg" 
                              />
                              <button
                                onClick={() => removeImage(idx)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 产品名称 */}
                  {selectedTemplate.inputs.some(i => i.id === 'productName') && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">产品名称</label>
                      <input
                        type="text"
                        value={formData.productName}
                        onChange={(e) => handleInputChange('productName', e.target.value)}
                        placeholder="输入产品名称"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        disabled={status === WORKFLOW_STATUS.RUNNING}
                      />
                    </div>
                  )}

                  {/* 品牌故事 */}
                  {selectedTemplate.inputs.some(i => i.id === 'brandStory') && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">品牌故事</label>
                      <textarea
                        value={formData.brandStory}
                        onChange={(e) => handleInputChange('brandStory', e.target.value)}
                        placeholder="描述品牌核心价值和故事..."
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                        disabled={status === WORKFLOW_STATUS.RUNNING}
                      />
                    </div>
                  )}

                  {/* 风格选择 */}
                  {(selectedTemplate.inputs.find(i => i.id === 'style') || selectedTemplate.inputs.find(i => i.id === 'tone')) && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {selectedTemplate.inputs.find(i => i.id === 'style')?.label || 
                         selectedTemplate.inputs.find(i => i.id === 'tone')?.label}
                      </label>
                      <select
                        value={formData.style || formData.tone}
                        onChange={(e) => handleInputChange(selectedTemplate.inputs.find(i => i.id === 'style')?.id || 'tone', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                        disabled={status === WORKFLOW_STATUS.RUNNING}
                      >
                        {(selectedTemplate.inputs.find(i => i.id === 'style')?.options || 
                          selectedTemplate.inputs.find(i => i.id === 'tone')?.options || []).map(opt => (
                          <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 尺寸选择 */}
                  {selectedTemplate.inputs.some(i => i.id === 'sizes') && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">输出尺寸</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['1:1', '16:9', '9:16', '4:5'].map(size => (
                          <SizePreview
                            key={size}
                            size={size}
                            selected={formData.sizes.includes(size)}
                            onClick={() => toggleSize(size)}
                          />
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-slate-400">
                        已选择: {formData.sizes.join(', ')} · 共 {formData.sizes.length * 6} 个素材
                      </div>
                    </div>
                  )}

                  {/* 产品卖点 */}
                  {selectedTemplate.inputs.some(i => i.id === 'highlights') && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">产品卖点</label>
                      <textarea
                        value={formData.highlights}
                        onChange={(e) => handleInputChange('highlights', e.target.value)}
                        placeholder="输入3-5个核心卖点，用逗号分隔..."
                        rows={2}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                        disabled={status === WORKFLOW_STATUS.RUNNING}
                      />
                    </div>
                  )}
                </div>

                {/* 执行按钮 */}
                <div className="mt-6 flex gap-3">
                  {status === WORKFLOW_STATUS.IDLE && (
                    <button
                      onClick={handleExecute}
                      disabled={uploadedImages.length === 0}
                      className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-opacity flex items-center justify-center gap-2 ${
                        uploadedImages.length > 0
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90'
                          : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <IconPlay />
                      开始生成
                    </button>
                  )}
                  {status === WORKFLOW_STATUS.RUNNING && (
                    <button
                      disabled
                      className="flex-1 px-6 py-3 bg-slate-700/50 text-slate-400 font-medium rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      生成中...
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
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <IconPlay />
                        再次生成
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
                  <span className="text-slate-300">生成进度</span>
                  <span className="text-emerald-400 font-mono">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* 执行日志 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-400">▸</span> 生成日志
                <IconTerminal />
              </h2>
              <div
                ref={logContainerRef}
                className="h-48 overflow-y-auto bg-slate-900/50 rounded-lg p-4 font-mono text-sm space-y-1"
              >
                {logs.length === 0 ? (
                  <p className="text-slate-500">上传产品图后点击开始生成...</p>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className={`flex items-start gap-2 ${
                      log.type === LOG_TYPES.SUCCESS ? 'text-emerald-400' :
                      log.type === LOG_TYPES.ERROR ? 'text-red-400' :
                      log.type === LOG_TYPES.WARNING ? 'text-amber-400' :
                      log.type === LOG_TYPES.PROGRESS ? 'text-emerald-400' :
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
                  生成耗时: <span className="text-emerald-400 font-mono">{executionTime}秒</span>
                </div>
              )}
            </div>

            {/* 结果展示 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-400">▸</span> 生成结果
              </h2>
              
              {result ? (
                <div className="space-y-4">
                  {/* 统计 */}
                  <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🎨</span>
                      <div>
                        <div className="text-lg font-bold text-white">{result.totalAssets} 个素材</div>
                        <div className="text-sm text-slate-400">
                          尺寸: {result.sizes.join(', ')}
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                      全部下载
                    </button>
                  </div>

                  {/* 预览网格 */}
                  <div className="grid grid-cols-3 gap-2">
                    {(result.images || []).slice(0, 9).map((img, idx) => (
                      <div key={idx} className="relative group">
                        {img.imageUrl && (
                          <img 
                            src={img.imageUrl} 
                            alt={`广告素材 ${img.format}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button 
                            onClick={() => {
                              if (img.imageUrl) {
                                const a = document.createElement('a')
                                a.href = img.imageUrl
                                a.download = `ad_${img.format}_${idx + 1}.png`
                                a.click()
                              }
                            }}
                            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                          >
                            <IconDownload className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(result.images?.length || 0) > 9 && (
                    <div className="text-center text-slate-400 text-sm">
                      还有 {(result.images?.length || 0) - 9} 个素材...
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                      🏛️ 存入版权库
                    </button>
                    <button className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600/30 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">
                      📋 复制链接
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-slate-900/30 rounded-lg">
                  <div className="text-center">
                    <span className="text-5xl mb-3 block opacity-50">📦</span>
                    <p className="text-slate-500">暂无生成结果</p>
                    <p className="text-xs text-slate-600 mt-1">上传产品图后点击开始生成</p>
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
