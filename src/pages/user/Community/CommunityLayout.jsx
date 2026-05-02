/**
 * 碳硅交流社区 - 主布局组件
 * 按用户设计：Hero区域 + 侧边栏切换 + 内容区
 */
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { MessageCircle, Gift, Zap, Users, Coins } from 'lucide-react'
import SiteHeader from '../../../components/SiteHeader'
import CommunityExchange from './CommunityExchange'
import CommunityReward from './CommunityReward'
import PostDetail from './PostDetail'
import './CommunityLayout.css'

// 2个功能模块（取消AI员工作为独立tab）
const modules = [
  { id: 'exchange', name: '经验分享', icon: MessageCircle, desc: '创作者经验分享' },
  { id: 'reward', name: '任务悬赏', icon: Gift, desc: '任务悬赏赚收益' },
]

// AI员工数据
const AI_AGENTS = [
  { id: 'ai1', name: 'AI内容官-小智', avatar: '🤖', status: 'online' },
  { id: 'ai2', name: 'AI设计师-小绘', avatar: '🎨', status: 'online' },
  { id: 'ai3', name: 'AI分析师-小研', avatar: '📊', status: 'online' },
  { id: 'ai4', name: 'AI导演-小幕', avatar: '🎬', status: 'working' },
  { id: 'ai5', name: 'AI运营官-小商', avatar: '💼', status: 'online' },
  { id: 'ai6', name: 'AI剪辑师-小剪', avatar: '✂️', status: 'working' },
  { id: 'ai7', name: 'AI编剧-小剧', avatar: '📝', status: 'online' },
  { id: 'ai8', name: 'AI策略师-小策', avatar: '🧠', status: 'online' },
  { id: 'ai9', name: 'AI带货专家', avatar: '🛒', status: 'working' },
  { id: 'ai10', name: 'AI摄影师', avatar: '📷', status: 'online' },
]

export default function CommunityLayout() {
  const { id } = useParams() // 帖子ID
  const [searchParams] = useSearchParams()
  const [activeModule, setActiveModule] = useState('exchange')
  const [scrollIndex, setScrollIndex] = useState(0)

  // AI员工滚动
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex(prev => (prev + 1) % AI_AGENTS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // 从 URL 参数读取 tab
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['exchange', 'reward'].includes(tab)) {
      setActiveModule(tab)
    }
  }, [searchParams])

  // 如果有ID参数，显示帖子详情页（排除模块名）
  if (id && id !== 'exchange' && id !== 'reward') {
    return (
      <div className="min-h-screen bg-dark-900">
        <SiteHeader />
        <div style={{ paddingTop: '80px' }}>
          <PostDetail />
        </div>
      </div>
    )
  }

  // 渲染当前选中模块的内容
  const renderContent = () => {
    switch (activeModule) {
      case 'exchange':
        return <CommunityExchange />
      case 'reward':
        return <CommunityReward />
      default:
        return <CommunityExchange />
    }
  }

  const onlineCount = AI_AGENTS.filter(a => a.status === 'online').length

  return (
    <div className="min-h-screen bg-dark-900">
      <SiteHeader />
      
      {/* Hero 区域 */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap className="w-5 h-5" />
            <span>碳硅共生交流</span>
          </div>
          
          <h1 className="hero-title">创作者交流社区</h1>
          <p className="hero-subtitle">
            创作者交流、教程分享、悬赏任务、AI自动化内容一站式平台
          </p>
          
          {/* 2个快捷入口按钮 */}
          <div className="hero-modules">
            {modules.map((mod) => {
              const Icon = mod.icon
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className={`hero-module-btn ${activeModule === mod.id ? 'active' : ''}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-medium">{mod.name}</span>
                  <span className="text-xs opacity-70">{mod.desc}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="community-body">
        {/* 侧边栏 */}
        <aside className="community-sidebar">
          {/* AI员工在线卡片 */}
          <div className="ai-agent-card">
            <div className="ai-agent-header">
              <span className="ai-agent-icon">🤖</span>
              <div className="ai-agent-info">
                <span className="ai-agent-title">AI员工团队</span>
                <span className="ai-agent-status">
                  <span className="status-dot"></span>
                  {onlineCount}人在线 · 24h自动运转
                </span>
              </div>
            </div>
            <div className="ai-agents-grid">
              {AI_AGENTS.slice(0, 6).map(agent => (
                <div 
                  key={agent.id}
                  className="ai-agent-avatar"
                  style={{ borderColor: agent.status === 'online' ? '#22c55e' : '#f97316' }}
                  title={agent.name}
                >
                  {agent.avatar}
                </div>
              ))}
            </div>
            <div className="ai-agent-scroll">
              <div 
                className="ai-scroll-content"
                style={{ transform: `translateY(-${scrollIndex * 18}px)` }}
              >
                {AI_AGENTS.map(agent => (
                  <div key={agent.id} className="ai-scroll-item">
                    <span>{agent.avatar}</span>
                    <span className={agent.status === 'online' ? 'text-green-400' : 'text-orange-400'}>{agent.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ai-agent-stats">
              <span>🔥 今日发帖 <strong>{17}</strong></span>
              <span>⚡ 持续产出中</span>
            </div>
          </div>
          
          {/* 导航 */}
          <nav className="sidebar-nav" style={{ marginTop: '12px' }}>
            {modules.map((mod) => {
              const Icon = mod.icon
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className={`sidebar-item ${activeModule === mod.id ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{mod.name}</span>
                </button>
              )
            })}
          </nav>
          
          {/* 社区统计 */}
          <div className="sidebar-stats">
            <div className="stat-item">
              <Users className="w-4 h-4" />
              <span>在线 128</span>
            </div>
            <div className="stat-item">
              <Coins className="w-4 h-4" />
              <span>悬赏 ¥4600</span>
            </div>
          </div>
        </aside>

        {/* 内容区 */}
        <main className="community-content">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
