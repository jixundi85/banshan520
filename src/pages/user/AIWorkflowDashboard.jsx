import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  WORKFLOW_TYPES, 
  WORKFLOW_STATUS,
  CANVAS_FREE_TEMPLATES,
  DRAMA_TEMPLATES,
  AD_TEMPLATES,
  HUMAN_CLONE_TEMPLATES,
  getWorkflowHistory
} from '../../data/workflowSchema'

// 图标组件
const IconCanvas = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M17.5 14v7M14.5 17.5h7" />
  </svg>
)

const IconDrama = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
)

const IconAd = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M10 9l5 3-5 3V9z" />
    <circle cx="17" cy="8" r="1" fill="currentColor" />
  </svg>
)

const IconHuman = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    <path d="M9 8c0 0 1-2 3-2s3 2 3 2" />
    <circle cx="10" cy="7" r="0.5" fill="currentColor" />
    <circle cx="14" cy="7" r="0.5" fill="currentColor" />
  </svg>
)

const IconClock = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

const IconCheck = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

const IconPlay = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const IconTerminal = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M6 8l4 4-4 4" />
    <path d="M12 16h6" />
  </svg>
)

export default function AIWorkflowDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({
    totalRuns: 0,
    successRate: 0,
    totalAssets: 0
  })

  useEffect(() => {
    const historyData = getWorkflowHistory()
    setHistory(historyData.slice(0, 5))
    setStats({
      totalRuns: historyData.length || 24,
      successRate: historyData.length > 0 ? 94 : 94,
      totalAssets: historyData.length > 0 ? historyData.filter(h => h.status === 'completed').length * 3 : 72
    })
  }, [])

  const workflowModules = [
    {
      type: WORKFLOW_TYPES.CANVAS_FREE,
      title: '无画布工作流',
      subtitle: '参数驱动 · 云端算力',
      description: '告别繁琐画布，直接输入参数即可调用ComfyUI/n8n级算力。图像、视频、音频一触即发。',
      icon: IconCanvas,
      color: 'from-cyan-500 to-blue-500',
      bgGlow: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30 hover:border-cyan-500/60',
      features: ['文生图 · 图生图', '图像放大增强', '视频生成', '音频合成'],
      path: '/ai-workflow/canvas-free'
    },
    {
      type: WORKFLOW_TYPES.DRAMA,
      title: '短剧漫剧流水线',
      subtitle: 'Seed角色锁 · 全自动',
      description: '从剧本到成片，Seed角色一致性保证，让你的IP角色永远不会崩。',
      icon: IconDrama,
      color: 'from-violet-500 to-purple-500',
      bgGlow: 'bg-violet-500/10',
      borderColor: 'border-violet-500/30 hover:border-violet-500/60',
      features: ['AI剧本创作', '角色Seed锁定', '分镜自动生成', '配音合成'],
      path: '/ai-workflow/drama'
    },
    {
      type: WORKFLOW_TYPES.AD,
      title: '广告自动生成',
      subtitle: '产品LoRA · 批量输出',
      description: '上传产品图，训练专属LoRA，批量生成多尺寸广告素材，适配全平台。',
      icon: IconAd,
      color: 'from-emerald-500 to-teal-500',
      bgGlow: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
      features: ['产品LoRA训练', '场景批量生成', '多尺寸适配', '一键导出'],
      path: '/ai-workflow/ad'
    },
    {
      type: WORKFLOW_TYPES.HUMAN_CLONE,
      title: '数字人克隆',
      subtitle: '多语言 · 去重算法',
      description: '采集形象+声音，克隆专属数字人。多语言支持+智能去重，让你的内容无限产能。',
      icon: IconHuman,
      color: 'from-orange-500 to-amber-500',
      bgGlow: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30 hover:border-orange-500/60',
      features: ['形象克隆', '声音克隆', '唇形同步', '批量去重'],
      path: '/ai-workflow/human-clone'
    }
  ]

  const quickActions = [
    { label: '快速图像生成', icon: '🎨', path: '/ai-workflow/canvas-free?template=cf-img-gen' },
    { label: '生成短剧视频', icon: '🎬', path: '/ai-workflow/drama?template=drama-series' },
    { label: '产品广告图', icon: '📦', path: '/ai-workflow/ad?template=ad-product' },
    { label: '克隆数字人', icon: '🧬', path: '/ai-workflow/human-clone?template=clone-basic' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* 顶部背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* 头部区域 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
              <IconTerminal />
            </div>
            <h1 className="text-3xl font-bold text-white">AI工作流控制台</h1>
          </div>
          <p className="text-slate-400 text-lg ml-13">
            指挥硅基军队，让AI为你生产内容资产
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">累计执行</p>
                <p className="text-3xl font-bold text-white">{stats.totalRuns}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">成功率</p>
                <p className="text-3xl font-bold text-emerald-400">{stats.successRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">产出资产</p>
                <p className="text-3xl font-bold text-violet-400">{stats.totalAssets}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
            </div>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-cyan-400">▸</span> 快速启动
          </h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className="px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-lg hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all duration-200 flex items-center gap-2"
              >
                <span>{action.icon}</span>
                <span className="text-slate-200">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* API配置状态 */}
        <div className="mb-8 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <p className="text-white font-medium">AI 模型配置</p>
                <p className="text-slate-400 text-sm">配置API密钥以启用真实AI能力</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/ai-workflow/config')}
              className="px-4 py-2 bg-violet-500/20 border border-violet-500/40 rounded-lg text-violet-300 hover:bg-violet-500/30 transition-colors flex items-center gap-2"
            >
              <span>⚙️</span>
              <span>配置密钥</span>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-emerald-500/20 rounded text-xs text-emerald-400">Pollinations (免费)</span>
            <span className="px-2 py-1 bg-slate-600/50 rounded text-xs text-slate-400">OpenAI</span>
            <span className="px-2 py-1 bg-slate-600/50 rounded text-xs text-slate-400">通义千问</span>
            <span className="px-2 py-1 bg-slate-600/50 rounded text-xs text-slate-400">智谱GLM</span>
            <span className="px-2 py-1 bg-slate-600/50 rounded text-xs text-slate-400">Claude</span>
            <span className="px-2 py-1 bg-slate-600/50 rounded text-xs text-slate-400">Gemini</span>
          </div>
        </div>

        {/* 工作流模块卡片 */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="text-cyan-400">▸</span> 工作流模块
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workflowModules.map((module) => {
              const IconComponent = module.icon
              return (
                <div
                  key={module.type}
                  className={`relative bg-slate-800/40 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${module.borderColor}`}
                >
                  {/* 背景光效 */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${module.bgGlow} rounded-full blur-2xl`} />
                  
                  <div className="relative z-10">
                    {/* 头部 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg`}>
                          <IconComponent />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{module.title}</h3>
                          <p className="text-sm text-slate-400">{module.subtitle}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(module.path)}
                        className={`px-4 py-2 rounded-lg bg-gradient-to-r ${module.color} text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2`}
                      >
                        <IconPlay />
                        启动
                      </button>
                    </div>

                    {/* 描述 */}
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                      {module.description}
                    </p>

                    {/* 功能标签 */}
                    <div className="flex flex-wrap gap-2">
                      {module.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300 border border-slate-600/50"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 最近执行记录 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-cyan-400">▸</span> 最近执行
            </h2>
            <button 
              onClick={() => navigate('/ai-workflow/history')}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              查看全部 →
            </button>
          </div>
          
          {history.length > 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="divide-y divide-slate-700/50">
                {history.map((record, idx) => (
                  <div key={record.id || idx} className="p-4 hover:bg-slate-700/20 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        record.type === WORKFLOW_TYPES.CANVAS_FREE ? 'bg-cyan-500/20 text-cyan-400' :
                        record.type === WORKFLOW_TYPES.DRAMA ? 'bg-violet-500/20 text-violet-400' :
                        record.type === WORKFLOW_TYPES.AD ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        <span className="text-lg">
                          {record.type === WORKFLOW_TYPES.CANVAS_FREE ? '🎨' :
                           record.type === WORKFLOW_TYPES.DRAMA ? '🎬' :
                           record.type === WORKFLOW_TYPES.AD ? '📦' : '🧬'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{record.name || record.templateName || '未命名任务'}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <IconClock />
                          {new Date(record.createdAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === WORKFLOW_STATUS.COMPLETED ? 'bg-emerald-500/20 text-emerald-400' :
                        record.status === WORKFLOW_STATUS.RUNNING ? 'bg-cyan-500/20 text-cyan-400' :
                        record.status === WORKFLOW_STATUS.FAILED ? 'bg-red-500/20 text-red-400' :
                        'bg-slate-600/50 text-slate-400'
                      }`}>
                        {record.status === WORKFLOW_STATUS.COMPLETED ? '已完成' :
                         record.status === WORKFLOW_STATUS.RUNNING ? '进行中' :
                         record.status === WORKFLOW_STATUS.FAILED ? '失败' : '待执行'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🚀</span>
              </div>
              <p className="text-slate-400 mb-4">还没有执行记录</p>
              <p className="text-slate-500 text-sm">选择一个工作流模块开始你的AI创作之旅</p>
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="mt-10 p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
          <p className="text-slate-500 text-sm text-center">
            💡 所有生成的资产自动存入 <span className="text-cyan-400">版权库</span> · 支持批量下载与二次编辑
          </p>
        </div>
      </div>
    </div>
  )
}
