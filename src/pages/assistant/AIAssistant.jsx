import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/Toast'
import {
  Bot, Send, Sparkles, Brain, MessageSquare, Loader2,
  ChevronRight, Lightbulb, Target, TrendingUp, Users,
  Briefcase, FileText, Video, Palette, Mic, Star,
  Copy, ThumbsUp, ThumbsDown, RefreshCw, Settings,
  X, Zap, Shield, Clock, CheckCircle, AlertCircle
} from 'lucide-react'
// ======= 助手角色配置 =======
const ASSISTANT_ROLES = [
  {
    id: 'diagnosis',
    name: 'AI诊断师',
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/10',
    desc: '深度分析企业AI现状，生成个性化诊断报告',
    capabilities: ['AI成熟度评估', '差距分析', '升级路线图'],
    prompt: '你是一位专业的AI转型顾问，擅长分析企业的AI应用现状和潜力。'
  },
  {
    id: 'strategy',
    name: '战略规划师',
    icon: Target,
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500/10',
    desc: '制定AI驱动增长策略，优化商业模式',
    capabilities: ['商业模式优化', '增长策略', '竞争分析'],
    prompt: '你是一位经验丰富的商业战略顾问，专注于AI时代的商业创新。'
  },
  {
    id: 'creative',
    name: '创意顾问',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
    desc: '激发创意灵感，优化内容营销策略',
    capabilities: ['创意头脑风暴', '内容策略', '爆款分析'],
    prompt: '你是一位资深创意顾问，精通AIGC内容创作和营销传播。'
  },
  {
    id: 'ops',
    name: '运营专家',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10',
    desc: '优化运营流程，提升团队协作效率',
    capabilities: ['流程优化', '团队管理', '效率提升'],
    prompt: '你是一位卓越的运营管理专家，擅长流程优化和效率提升。'
  }
]
// ======= 快捷问题 =======
const QUICK_QUESTIONS = {
  diagnosis: [
    '分析我们公司目前的AI成熟度',
    '我们和行业领先者差距在哪里？',
    '制定3个月的AI升级计划',
  ],
  strategy: [
    '如何用AI提升电商转化率？',
    '我们的商业模式有哪些AI升级机会？',
    '分析竞品的AI布局策略',
  ],
  creative: [
    '帮我策划一个AI短剧营销方案',
    '分析近期爆款内容的共同点',
    '如何用AI提升内容产出效率？',
  ],
  ops: [
    '优化内容生产团队的工作流程',
    '如何用AI降低运营成本？',
    '建立AI辅助的协作机制',
  ]
}
// ======= 消息类型 =======
const MessageType = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
}
// ======= 主组件 =======
export default function AIAssistant() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  // 状态
  const [activeRole, setActiveRole] = useState('diagnosis')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: MessageType.ASSISTANT,
      role: 'diagnosis',
      content: '您好！我是半山AIX的专业AI顾问。\n\n我可以帮助您：\n• 分析企业的AI现状和升级潜力\n• 制定个性化的AI转型策略\n• 优化内容创作和运营流程\n\n请告诉我您想了解的具体问题，或者选择一个角色类型获得专业建议。',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  // 当前角色配置
  const currentRoleConfig = ASSISTANT_ROLES.find(r => r.id === activeRole)
  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  // 发送消息
  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return
    const userMessage = {
      id: Date.now(),
      type: MessageType.USER,
      content: inputText,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)
    // 模拟AI响应
    setTimeout(() => {
      const response = generateResponse(inputText, activeRole)
      const assistantMessage = {
        id: Date.now() + 1,
        type: MessageType.ASSISTANT,
        role: activeRole,
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }
  // 生成响应
  const generateResponse = (question, role) => {
    const responses = {
      diagnosis: `根据您的问题，我来帮您分析：
**🔍 现状评估**
1. **技术基础** - 需要评估现有的数字化程度
2. **人员能力** - 团队对AI工具的熟悉程度
3. **业务场景** - 哪些环节适合引入AI
**📋 建议路线图**
| 阶段 | 时间 | 目标 |
|------|------|------|
| 基础期 | 1-2周 | 完成诊断+培训 |
| 试点期 | 3-8周 | 2-3个场景落地 |
| 扩展期 | 3-6月 | 全面推广 |
**💡 关键建议**
• 先从高频、低风险场景入手
• 重视员工培训和变革管理
• 建立AI使用规范和数据安全机制
需要我进一步展开哪个方面？`,
      strategy: `这是一个很好的战略问题！让我来帮您分析：
**🎯 核心机会识别**
1. **内容生产自动化** - AI可以提升内容产出效率300%+
2. **客户洞察智能化** - 通过AI分析用户行为数据
3. **营销精准化** - AI驱动的个性化推荐
**📊 实施优先级**
• P0: 内容生产 + 客服自动化
• P1: 数据分析 + 用户洞察
• P2: 流程自动化 + 决策支持
**⚡ 快速见效案例**
• 某电商：通过AI生成产品描述，效率提升500%
• 某品牌：用AI做社媒内容，流量增长200%
• 某企业：AI客服解决80%常见问题
您目前最想从哪个方向突破？我可以给您更具体的方案。`,
      creative: `好问题！让我从创意角度帮您分析：
**💡 创意策略**
1. **内容差异化** - 利用AI打造独特风格
2. **规模化生产** - 用AI保证内容质量的同时提升产量
3. **数据驱动** - 通过AI分析爆款规律
**🎬 创意方向建议**
• **竖屏短剧**：3-5分钟，剧情紧凑，适合AI制作
• **种草视频**：产品展示+场景化内容
• **知识科普**：专业内容+AI可视化
**📈 爆款公式**
• 情感共鸣 + 视觉冲击 + 悬念设置 + 价值输出
您想专注于哪个内容方向？我可以帮您策划具体的创意方案。`,
      ops: `运营优化是AI落地的关键领域！让我来分析：
**⚙️ 流程优化方向**
**1. 内容生产流**
需求 → AI生成 → 人工审核 → 发布 → 数据分析
AI可介入：需求理解、素材生成、初稿撰写
**2. 团队协作流**
• 早会用AI做数据简报
• 任务分配用AI辅助
• 复盘用AI生成报告
**3. 效率提升指标**
• 写稿：2小时 → 20分钟 (6倍提升)
• 设计：3小时 → 30分钟 (6倍提升)
• 数据整理：1小时 → 5分钟 (12倍提升)
**🎯 建议先从哪些环节优化？**
您目前运营中最大的痛点是什么？`,
    }
    return responses[role] || '感谢您的提问！让我仔细分析后给您回复。'
  }
  // 快捷提问
  const handleQuickQuestion = (question) => {
    setInputText(question)
    inputRef.current?.focus()
  }
  // 复制消息
  const handleCopy = (content) => {
    navigator.clipboard.writeText(content)
    showToast('已复制到剪贴板', 'success')
  }
  return (
    
      <div className="h-[calc(100vh-64px)] bg-slate-900 flex">
        {/* 左侧角色选择 */}
        <div className="w-80 bg-slate-800/60 border-r border-white/5 p-4 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              专业顾问
            </h2>
            <p className="text-gray-400 text-sm">选择不同角色获得专业建议</p>
          </div>
          {/* 角色列表 */}
          <div className="space-y-3 flex-1 overflow-y-auto">
            {ASSISTANT_ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  activeRole === role.id
                    ? `bg-gradient-to-br ${role.color} shadow-lg`
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${role.bgColor} flex items-center justify-center ${
                    activeRole === role.id ? 'bg-white/20' : ''
                  }`}>
                    <role.icon className={`w-5 h-5 ${
                      activeRole === role.id ? 'text-white' : 'text-violet-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${activeRole === role.id ? 'text-white' : 'text-white'}`}>
                      {role.name}
                    </p>
                    <p className={`text-xs mt-1 ${
                      activeRole === role.id ? 'text-white/80' : 'text-gray-400'
                    }`}>
                      {role.desc}
                    </p>
                  </div>
                </div>
                {activeRole === role.id && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {role.capabilities.map((cap, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/10 text-white/80 text-xs rounded-full">
                        {cap}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
          {/* 设置 */}
          <button
            onClick={() => setShowSettings(true)}
            className="mt-4 flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">设置</span>
          </button>
        </div>
        {/* 右侧对话区 */}
        <div className="flex-1 flex flex-col">
          {/* 顶部 */}
          <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentRoleConfig?.color} flex items-center justify-center`}>
                  {currentRoleConfig && <currentRoleConfig.icon className="w-5 h-5 text-white" />}
                </div>
                <div>
                <h3 className="text-white font-semibold">{currentRoleConfig?.name}</h3>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  在线
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMessages([{
                  id: Date.now(),
                  type: MessageType.ASSISTANT,
                  role: activeRole,
                  content: `您好！我是半山AIX的${currentRoleConfig?.name}。\n\n${currentRoleConfig?.desc}\n\n请问有什么可以帮您？`,
                  timestamp: new Date()
                }])}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.type === MessageType.USER ? 'justify-end' : ''}`}
              >
                {/* 助手头像 */}
                {message.type === MessageType.ASSISTANT && (
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentRoleConfig?.color} flex-shrink-0 flex items-center justify-center`}>
                    {currentRoleConfig && <currentRoleConfig.icon className="w-5 h-5 text-white" />}
                  </div>
                )}
                {/* 消息内容 */}
                <div className={`max-w-[70%] ${message.type === MessageType.USER ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block p-4 rounded-2xl ${
                      message.type === MessageType.USER
                        ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-br-sm'
                        : 'bg-white/10 text-white rounded-bl-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  </div>
                  {/* 操作 */}
                  {message.type === MessageType.ASSISTANT && (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleCopy(message.content)}
                        className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                {/* 用户头像 */}
                {message.type === MessageType.USER && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
                    我
                  </div>
                )}
              </div>
            ))}
            {/* 正在输入 */}
            {isTyping && (
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentRoleConfig?.color} flex-shrink-0 flex items-center justify-center`}>
                  {currentRoleConfig && <currentRoleConfig.icon className="w-5 h-5 text-white" />}
                </div>
                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* 快捷问题 */}
          {!messages.length || messages.length <= 2 ? (
            <div className="px-6 pb-4">
              <p className="text-gray-500 text-sm mb-3">快捷问题：</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS[activeRole]?.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {/* 输入区 */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder={`向${currentRoleConfig?.name}提问...`}
                  rows={1}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium rounded-xl hover:from-violet-400 hover:to-fuchsia-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                发送
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2 text-center">
              AI助手仅供参考，实际决策请结合业务情况判断
            </p>
          </div>
        </div>
        {/* 设置弹窗 */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">助手设置</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* 创意度 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white font-medium">创意度</label>
                    <span className="text-violet-400 font-mono">{temperature.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-violet-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>精确</span>
                    <span>平衡</span>
                    <span>创意</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full py-3 bg-violet-500 text-white font-medium rounded-xl hover:bg-violet-400 transition-colors"
                >
                  保存设置
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
  )
}
