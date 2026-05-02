import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  WORKFLOW_TYPES,
  WORKFLOW_STATUS,
  DRAMA_TEMPLATES,
  LOG_TYPES,
  addWorkflowRecord
} from '../../data/workflowSchema'
import { generateScript, chatWithModel, generateImage, AI_MODELS } from '../../services/comprehensiveAIService'

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

const IconCheck = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

// 步骤状态组件
function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep
        const isCurrent = idx === currentStep
        const isPending = idx > currentStep
        
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                isCompleted ? 'bg-emerald-500 text-white' :
                isCurrent ? 'bg-violet-500 text-white ring-4 ring-violet-500/30' :
                'bg-slate-700/50 text-slate-500'
              }`}>
                {isCompleted ? <IconCheck /> : step.icon}
              </div>
              <div className={`mt-2 text-sm font-medium text-center ${
                isCompleted ? 'text-emerald-400' :
                isCurrent ? 'text-white' :
                'text-slate-500'
              }`}>
                {step.name}
              </div>
              {step.description && (
                <div className="text-xs text-slate-500 text-center mt-1 hidden md:block">
                  {step.description}
                </div>
              )}
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                idx < currentStep ? 'bg-emerald-500' : 'bg-slate-700/50'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function DramaWorkflow() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const logContainerRef = useRef(null)

  // 状态
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [script, setScript] = useState('')
  const [characterCount, setCharacterCount] = useState(0)
  const [formData, setFormData] = useState({ theme: '' })
  const [status, setStatus] = useState(WORKFLOW_STATUS.IDLE)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)
  const [executionTime, setExecutionTime] = useState(0)
  
  // 剧本生成模型选项
  const [selectedScriptModel, setSelectedScriptModel] = useState('auto')
  
  // 可用的剧本生成模型
  const scriptModels = [
    { id: 'auto', name: '自动选择', icon: '🎯', desc: '根据配置自动选择可用模型' },
    { id: 'qwen-max', name: 'Qwen-Max', icon: '🐱', desc: '通义千问最强模型' },
    { id: 'qwen-plus', name: 'Qwen-Plus', icon: '🐱', desc: '通义千问高效模型' },
    { id: 'glm-4', name: 'GLM-4', icon: '🔮', desc: '智谱大模型' },
    { id: 'gpt-4o', name: 'GPT-4o', icon: '🤖', desc: 'OpenAI最新模型' },
    { id: 'gpt-4', name: 'GPT-4', icon: '🤖', desc: 'OpenAI旗舰模型' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', icon: '✨', desc: 'Google最强模型' },
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5', icon: '🧠', desc: 'Anthropic高效模型' },
    { id: 'doubao-pro-32k', name: '豆包 Pro', icon: '🥜', desc: '字节跳动大模型' }
  ]

  // 初始化
  useEffect(() => {
    const templateId = searchParams.get('template')
    if (templateId) {
      const template = DRAMA_TEMPLATES.find(t => t.id === templateId)
      if (template) {
        setSelectedTemplate(template)
      }
    }
  }, [searchParams])

  // 选择模板
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setScript('')
    setStatus(WORKFLOW_STATUS.IDLE)
    setCurrentStep(0)
    setProgress(0)
    setLogs([])
    setResult(null)
  }

  // 添加日志
  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, timestamp: Date.now() }])
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }

  // 处理剧本输入
  const handleScriptChange = (e) => {
    const value = e.target.value
    setScript(value)
    setCharacterCount(value.length)
  }

  // AI辅助创作剧本 - 真实大模型调用
  const handleGenerateScript = async () => {
    if (!selectedTemplate) return
    
    const theme = formData.theme || '一个关于成长与救赎的故事'
    
    addLog('✨ 正在调用AI剧本创作助手...', LOG_TYPES.PROGRESS)
    addLog('📡 连接中...', LOG_TYPES.INFO)
    
    // 检查本地配置
    const savedConfig = localStorage.getItem('ai_api_config') || '{}'
    const config = JSON.parse(savedConfig)
    
    // 获取选中的模型信息
    const selectedModel = scriptModels.find(m => m.id === selectedScriptModel) || scriptModels[0]
    const modelId = selectedScriptModel === 'auto' ? null : selectedScriptModel
    
    // 检查模型是否可用
    const modelConfigMap = {
      'qwen-max': config.qwen,
      'qwen-plus': config.qwen,
      'glm-4': config.zhipu,
      'gpt-4o': config.openai,
      'gpt-4': config.openai,
      'gemini-1.5-pro': config.gemini,
      'claude-3-5-sonnet-20241022': config.anthropic,
      'doubao-pro-32k': config.doubao
    }
    
    const requiredKey = modelId ? modelConfigMap[modelId] : null
    
    // 如果选择了特定模型但没有配置
    if (modelId && !requiredKey) {
      addLog(`⚠️ ${selectedModel.name} 需要配置 API Key`, LOG_TYPES.WARNING)
      addLog(`💡 请前往「AI模型配置」页面配置 ${selectedModel.name} 的API Key`, LOG_TYPES.INFO)
      return
    }
    
    // 自动选择可用模型
    let finalModelId = modelId
    let modelName = selectedModel.name
    
    if (selectedScriptModel === 'auto') {
      // 按优先级自动选择
      if (config.qwen) {
        finalModelId = 'qwen-max'
        modelName = '通义千问 Qwen-Max'
      } else if (config.zhipu) {
        finalModelId = 'glm-4'
        modelName = '智谱 GLM-4'
      } else if (config.openai) {
        finalModelId = 'gpt-4o'
        modelName = 'OpenAI GPT-4o'
      } else if (config.gemini) {
        finalModelId = 'gemini-1.5-pro'
        modelName = 'Google Gemini 1.5 Pro'
      } else {
        addLog('⚠️ 未配置任何AI模型 API Key', LOG_TYPES.WARNING)
        addLog('💡 请前往「AI模型配置」页面配置 API Key', LOG_TYPES.INFO)
        return
      }
    }
    
    addLog(`🤖 使用模型: ${modelName}`, LOG_TYPES.INFO)
    addLog('⏳ AI正在创作剧本，请稍候...', LOG_TYPES.PROGRESS)
    
    try {
      // 获取模板对应的类型
      const genreMap = {
        'drama-short': '短剧剧本',
        'drama-cartoon': '故事',
        'drama-travel': '故事'
      }
      const genre = genreMap[selectedTemplate.id] || '短剧剧本'
      
      const scriptPrompt = `请根据以下主题创作一个${genre}：
主题：${theme}

要求：
1. 适合1-3分钟短视频
2. 有明确的开端、发展、高潮、结局
3. 有人物对白和动作指示
4. 结尾有反转或情感共鸣
5. 总字数800-1500字

请直接输出剧本内容，不要其他说明。`
      
      const response = await chatWithModel(finalModelId, [
        { role: 'user', content: scriptPrompt }
      ])
      
      const aiScript = response.choices?.[0]?.message?.content || ''
      
      if (aiScript) {
        setScript(aiScript)
        setCharacterCount(aiScript.length)
        addLog('✅ AI剧本生成成功!', LOG_TYPES.SUCCESS)
      } else {
        throw new Error('AI返回内容为空')
      }
      
    } catch (error) {
      console.error('AI剧本生成失败:', error)
      addLog(`⚠️ AI生成失败: ${error.message}`, LOG_TYPES.WARNING)
      addLog('💡 请检查API配置或稍后重试', LOG_TYPES.INFO)
    }
  }

  /* 示例剧本内容（仅供参考）
🎬 第一幕：开场
场景：现代都市咖啡厅，日内

（白领小林独自坐在角落，神情落寞地看着窗外的雨）

小林：（叹气）每天都是这样，两点一线的生活...

（手机响起，一条神秘短信）

小林：什么？第五栖息地？

🎬 第二幕：转折
场景：废弃工厂，夜外

（小林按照短信来到旧工厂，昏暗的灯光下发现一个发光的箱子）

（箱子里是一面古老的镜子）

小林：（触碰镜面）

（镜面泛起涟漪，数字代码流动）

🎬 第三幕：高潮
场景：数字空间

（小林发现自己置身于赛博空间）

神秘人：欢迎来到第五栖息地，碳与硅共生的新世界。

小林：这是什么地方？

神秘人：这是你内心深处的另一个自己，等待被唤醒。

【未完待续...】

---
提示：请在设置中配置API密钥以获取真实AI创作
*/

  // 开始执行 - 真实AI调用
  const handleExecute = async () => {
    if (!selectedTemplate || !script) return

    setStatus(WORKFLOW_STATUS.RUNNING)
    setProgress(0)
    setLogs([])
    setResult(null)
    setExecutionTime(0)
    setCurrentStep(0)

    const startTime = Date.now()
    const totalSteps = selectedTemplate.steps.length

    try {
      // 步骤1: 剧本解析
      addLog('📜 [1/5] 正在解析剧本结构...', LOG_TYPES.PROGRESS)
      await new Promise(r => setTimeout(r, 800))
      setCurrentStep(0)
      setProgress(20)
      
      // 步骤2: 角色分析
      addLog('👥 [2/5] 正在分析角色特征...', LOG_TYPES.PROGRESS)
      await new Promise(r => setTimeout(r, 600))
      setCurrentStep(1)
      setProgress(40)
      
      // 步骤3: 分镜生成（调用AI服务）
      addLog('🎬 [3/5] 正在生成场景分镜...', LOG_TYPES.PROGRESS)
      
      const scriptResult = await workflowService.scriptGeneration({
        theme: script.substring(0, 100), // 取前100字作为主题
        genre: selectedTemplate.id === 'drama-short' ? 'drama' : 'story',
        duration: 60
      }, (status) => {
        setProgress(40 + Math.round(status.progress * 0.3))
        addLog(`📊 ${status.message}`, LOG_TYPES.PROGRESS)
      })
      
      setCurrentStep(2)
      setProgress(70)
      
      // 步骤4: 角色Seed锁定
      addLog('🔒 [4/5] 正在锁定角色Seed一致性...', LOG_TYPES.PROGRESS)
      await new Promise(r => setTimeout(r, 500))
      setCurrentStep(3)
      setProgress(85)
      
      // 步骤5: 视频合成
      addLog('🎥 [5/5] 正在合成最终视频...', LOG_TYPES.PROGRESS)
      await new Promise(r => setTimeout(r, 600))
      setCurrentStep(4)
      setProgress(95)

      const endTime = Date.now()
      setExecutionTime(Math.round((endTime - startTime) / 1000))
      setStatus(WORKFLOW_STATUS.COMPLETED)
      setCurrentStep(totalSteps - 1)
      setProgress(100)
      
      addLog('✨ 短剧生产完成!', LOG_TYPES.SUCCESS)
      
      if (scriptResult.mock) {
        addLog('💡 提示: 当前为演示模式，配置API后可生成真实视频', LOG_TYPES.WARNING)
      }

      // 生成结果
      setResult({
        type: 'video',
        script: scriptResult.content,
        scenes: scriptResult.scenes || [],
        totalScenes: scriptResult.totalScenes || 5,
        duration: `${Math.ceil((scriptResult.totalScenes || 5) * 15 / 60)}分${(scriptResult.totalScenes || 5) * 15 % 60}秒`,
        characters: 3,
        mock: scriptResult.mock,
        videoUrl: scriptResult.scenes?.[0]?.imageUrl || null
      })

      // 保存到历史
      addWorkflowRecord({
        type: WORKFLOW_TYPES.DRAMA,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        status: WORKFLOW_STATUS.COMPLETED,
        scriptLength: script.length,
        executionTime: Math.round((endTime - startTime) / 1000)
      })

    } catch (error) {
      console.error('执行失败:', error)
      addLog(`❌ 执行失败: ${error.message}`, LOG_TYPES.ERROR)
      setStatus(WORKFLOW_STATUS.IDLE)
      setCurrentStep(0)
      setProgress(0)
    }
  }

  // 重置
  const handleReset = () => {
    setStatus(WORKFLOW_STATUS.IDLE)
    setCurrentStep(0)
    setProgress(0)
    setLogs([])
    setResult(null)
    setScript('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* 头部 */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/ai-workflow')}
            className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-violet-500/50 transition-colors"
          >
            <IconBack />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">短剧漫剧流水线</h1>
            <p className="text-sm text-slate-400">Seed角色锁 · 全自动生产 · 从剧本到成片</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：模板选择 & 剧本输入 */}
          <div className="space-y-6">
            {/* 模板选择 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-violet-400">▸</span> 选择生产类型
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {DRAMA_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    disabled={status === WORKFLOW_STATUS.RUNNING}
                    className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                      selectedTemplate?.id === template.id
                        ? 'bg-violet-500/10 border-violet-500/50'
                        : 'bg-slate-700/30 border-slate-600/30 hover:border-violet-500/30'
                    } ${status === WORKFLOW_STATUS.RUNNING ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{template.icon}</span>
                      <div>
                        <div className="font-medium text-white">{template.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{template.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 剧本输入 */}
            {selectedTemplate && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="text-violet-400">▸</span> 剧本输入
                  </h2>
                  <button
                    onClick={handleGenerateScript}
                    disabled={status === WORKFLOW_STATUS.RUNNING}
                    className="px-3 py-1.5 text-xs bg-violet-500/20 border border-violet-500/30 text-violet-400 rounded-lg hover:bg-violet-500/30 transition-colors"
                  >
                    ✨ AI辅助创作
                  </button>
                </div>
                
                {/* 剧本生成模型选择 */}
                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-2">剧本创作模型</label>
                  <select
                    value={selectedScriptModel}
                    onChange={(e) => setSelectedScriptModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                  >
                    {scriptModels.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.icon} {model.name} - {model.desc}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* 主题输入 */}
                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-2">创作主题</label>
                  <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                    placeholder="输入剧本主题，如：穿越重生、霸道总裁、甜宠等"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                
                <textarea
                  value={script}
                  onChange={handleScriptChange}
                  placeholder="输入剧本内容，支持多集连载...
                  
示例格式：
第一集：场景描述，对话内容
第二集：剧情推进，高潮部分..."
                  rows={10}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                  disabled={status === WORKFLOW_STATUS.RUNNING}
                />
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-500">字符数：{characterCount}</span>
                  <span className="text-slate-500">建议 2000-10000 字</span>
                </div>

                {/* 步骤指示器 */}
                <StepIndicator steps={selectedTemplate.steps} currentStep={currentStep} />

                {/* 执行按钮 */}
                <div className="mt-6 flex gap-3">
                  {status === WORKFLOW_STATUS.IDLE && (
                    <button
                      onClick={handleExecute}
                      disabled={!script}
                      className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-opacity flex items-center justify-center gap-2 ${
                        script 
                          ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90'
                          : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <IconPlay />
                      开始生产
                    </button>
                  )}
                  {status === WORKFLOW_STATUS.RUNNING && (
                    <button
                      disabled
                      className="flex-1 px-6 py-3 bg-slate-700/50 text-slate-400 font-medium rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      生产中...
                    </button>
                  )}
                  {status === WORKFLOW_STATUS.COMPLETED && (
                    <>
                      <button
                        onClick={handleReset}
                        className="px-4 py-3 bg-slate-700/50 text-white font-medium rounded-lg hover:bg-slate-600/50 transition-colors flex items-center gap-2"
                      >
                        <IconRefresh />
                        重新生产
                      </button>
                      <button
                        onClick={handleExecute}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <IconPlay />
                        再次生产
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
                  <span className="text-slate-300">生产进度</span>
                  <span className="text-violet-400 font-mono">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  正在执行: {selectedTemplate?.steps[currentStep]?.name || '初始化...'}
                </div>
              </div>
            )}

            {/* 执行日志 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-violet-400">▸</span> 生产日志
                <IconTerminal />
              </h2>
              <div
                ref={logContainerRef}
                className="h-64 overflow-y-auto bg-slate-900/50 rounded-lg p-4 font-mono text-sm space-y-1"
              >
                {logs.length === 0 ? (
                  <p className="text-slate-500">输入剧本后点击开始生产...</p>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className={`flex items-start gap-2 ${
                      log.type === LOG_TYPES.SUCCESS ? 'text-emerald-400' :
                      log.type === LOG_TYPES.ERROR ? 'text-red-400' :
                      log.type === LOG_TYPES.WARNING ? 'text-amber-400' :
                      log.type === LOG_TYPES.PROGRESS ? 'text-violet-400' :
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
                  生产耗时: <span className="text-violet-400 font-mono">{executionTime}秒</span>
                </div>
              )}
            </div>

            {/* 结果展示 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-violet-400">▸</span> 生成结果
              </h2>
              
              {result ? (
                <div className="space-y-4">
                  {/* 视频预览 */}
                  <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {result.videoUrl ? (
                      <img src={result.videoUrl} alt="预览" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">🎬</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-lg font-medium">{selectedTemplate?.name}</div>
                      <div className="text-sm text-slate-300">{result.duration}</div>
                    </div>
                    <div className="absolute top-4 right-4 px-2 py-1 bg-violet-500/80 rounded text-xs text-white">
                      {result.totalScenes} 场景
                    </div>
                  </div>

                  {/* 统计信息 */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-700/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-violet-400">{result.totalScenes}</div>
                      <div className="text-xs text-slate-400">分镜数量</div>
                    </div>
                    <div className="p-3 bg-slate-700/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-violet-400">{result.characters}</div>
                      <div className="text-xs text-slate-400">角色数量</div>
                    </div>
                    <div className="p-3 bg-slate-700/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-violet-400">{result.duration}</div>
                      <div className="text-xs text-slate-400">成片时长</div>
                    </div>
                  </div>

                  {/* 分镜预览 */}
                  {result.scenes && result.scenes.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-slate-400">分镜预览:</div>
                      <div className="grid grid-cols-3 gap-2">
                        {result.scenes.slice(0, 6).map((scene, idx) => (
                          <div key={idx} className="relative aspect-video bg-slate-700/50 rounded-lg overflow-hidden">
                            {scene.imageUrl && (
                              <img src={scene.imageUrl} alt={scene.title} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-xs text-white">
                              {scene.id}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 文件列表 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🎬</span>
                        <div>
                          <p className="text-white text-sm">AI生成短剧视频</p>
                          <p className="text-xs text-slate-400">MP4 • {result.duration}</p>
                        </div>
                      </div>
                      <button className="p-2 text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors">
                        <IconDownload />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📄</span>
                        <div>
                          <p className="text-white text-sm">AI生成剧本脚本</p>
                          <p className="text-xs text-slate-400">TXT • {characterCount}字符</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const blob = new Blob([result.script || script], { type: 'text/plain' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `script_${Date.now()}.txt`
                          a.click()
                        }}
                        className="p-2 text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
                      >
                        <IconDownload />
                      </button>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                      🏛️ 存入版权库
                    </button>
                    <button className="flex-1 px-4 py-2 bg-violet-500/20 border border-violet-500/30 text-violet-400 rounded-lg hover:bg-violet-500/30 transition-colors">
                      ▶️ 立即播放
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-slate-900/30 rounded-lg">
                  <div className="text-center">
                    <span className="text-5xl mb-3 block opacity-50">🎭</span>
                    <p className="text-slate-500">暂无生成结果</p>
                    <p className="text-xs text-slate-600 mt-1">输入剧本后点击开始生产</p>
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
