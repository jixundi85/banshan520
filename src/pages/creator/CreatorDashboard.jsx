import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, Eye, MessageCircle, Star, ArrowUpRight, 
  Wallet, ShoppingBag, Users, Film, Image, FileText, 
  BarChart3, Calendar, ChevronRight, Sparkles, DollarSign
} from 'lucide-react'

// Mock current user data
const currentUser = {
  id: 'creator_001',
  name: 'AI创作达人',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator',
  opcLevel: 'advanced', // primary, intermediate, advanced
  opcTitle: 'AI视频创作专家',
  totalEarnings: 128500,
  monthlyEarnings: 15800,
  totalWorks: 156,
  totalViews: 2580000,
  totalLikes: 89500,
  followers: 12500,
  completedOrders: 89,
  rating: 4.9,
  earningsTrend: [
    { month: '10月', amount: 8500 },
    { month: '11月', amount: 12000 },
    { month: '12月', amount: 9800 },
    { month: '01月', amount: 14500 },
    { month: '02月', amount: 13200 },
    { month: '03月', amount: 15800 },
  ]
}

// Recent works data
const recentWorks = [
  {
    id: 1,
    title: 'AI生成的未来城市概念视频',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/city/400/300',
    views: 45600,
    likes: 3200,
    earnings: 2800,
    status: 'published',
    createdAt: '2026-04-10'
  },
  {
    id: 2,
    title: '品牌宣传片 - 科技感十足',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/brand/400/300',
    views: 89200,
    likes: 5600,
    earnings: 5800,
    status: 'published',
    createdAt: '2026-04-08'
  },
  {
    id: 3,
    title: 'AI电商主图设计合集',
    type: 'image',
    thumbnail: 'https://picsum.photos/seed/ecom/400/300',
    views: 23400,
    likes: 1800,
    earnings: 1200,
    status: 'published',
    createdAt: '2026-04-05'
  },
  {
    id: 4,
    title: '企业宣传文案智能生成',
    type: 'text',
    thumbnail: 'https://picsum.photos/seed/text/400/300',
    views: 12800,
    likes: 920,
    earnings: 800,
    status: 'draft',
    createdAt: '2026-04-12'
  }
]

// Pending orders
const pendingOrders = [
  {
    id: 'ORD2026041501',
    client: '科技创新公司',
    service: 'AI品牌宣传片定制',
    amount: 5800,
    deadline: '2026-04-20',
    status: 'in_progress'
  },
  {
    id: 'ORD2026041203',
    client: '电商创业者',
    service: '产品主图设计套餐',
    amount: 1200,
    deadline: '2026-04-18',
    status: 'in_progress'
  }
]

// Notification data
const notifications = [
  { id: 1, type: 'order', message: '新订单待确认：AI宣传片制作', time: '10分钟前', unread: true },
  { id: 2, type: 'earning', message: '收益到账：+¥2,800', time: '1小时前', unread: true },
  { id: 3, type: 'review', message: '客户评价：5星好评', time: '3小时前', unread: false },
  { id: 4, type: 'system', message: '恭喜获得"月度之星"称号', time: '1天前', unread: false },
]

// Quick actions
const quickActions = [
  { id: 'new-service', icon: <FileText />, label: '发布服务', color: '#8b5cf6' },
  { id: 'orders', icon: <ShoppingBag />, label: '处理订单', color: '#f59e0b' },
  { id: 'earnings', icon: <Wallet />, label: '查看收益', color: '#10b981' },
  { id: 'messages', icon: <MessageCircle />, label: '消息中心', color: '#3b82f6' },
]

export default function CreatorDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('30d')

  // Calculate stats
  const stats = [
    {
      label: '总收益',
      value: currentUser.totalEarnings.toLocaleString(),
      suffix: '元',
      trend: '+18.5%',
      trendUp: true,
      icon: <DollarSign className="text-2xl" />,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      label: '本月收益',
      value: currentUser.monthlyEarnings.toLocaleString(),
      suffix: '元',
      trend: '+12.3%',
      trendUp: true,
      icon: <TrendingUp className="text-2xl" />,
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      label: '作品总数',
      value: currentUser.totalWorks,
      suffix: '个',
      trend: '+12',
      trendUp: true,
      icon: <Film className="text-2xl" />,
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      label: '总浏览量',
      value: (currentUser.totalViews / 10000).toFixed(1) + '万',
      suffix: '',
      trend: '+25.8%',
      trendUp: true,
      icon: <Eye className="text-2xl" />,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      label: '粉丝数',
      value: (currentUser.followers / 10000).toFixed(1) + '万',
      suffix: '',
      trend: '+8.2%',
      trendUp: true,
      icon: <Users className="text-2xl" />,
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      label: '评分',
      value: currentUser.rating,
      suffix: '分',
      trend: 'TOP 5%',
      trendUp: true,
      icon: <Star className="text-2xl" />,
      gradient: 'from-yellow-500 to-amber-500'
    }
  ]

  // Render earnings chart
  const renderEarningsChart = () => {
    const maxAmount = Math.max(...currentUser.earningsTrend.map(d => d.amount))
    return (
      <div className="flex items-end justify-between h-40 px-4">
        {currentUser.earningsTrend.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="relative w-full flex justify-center">
              <div 
                className="w-10 bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-md transition-all duration-500"
                style={{ height: `${(item.amount / maxAmount) * 140}px` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-slate-400 whitespace-nowrap">
                  {item.amount >= 10000 ? (item.amount/10000).toFixed(1) + '万' : item.amount}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">{item.month}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-900 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* User Info Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full border-2 border-violet-400"
                />
                <div className="absolute -bottom-1 -right-1 bg-violet-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {currentUser.opcLevel === 'advanced' ? '专家' : currentUser.opcLevel === 'intermediate' ? '资深' : '初级'}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{currentUser.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-violet-500/30 text-violet-300 text-sm rounded-full">
                    {currentUser.opcTitle}
                  </span>
                  <span className="text-slate-400 text-sm">OPC认证创作者</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => navigate(`/${action.id === 'new-service' ? 'service-market' : action.id === 'orders' ? 'my-orders' : action.id === 'earnings' ? 'earnings-center' : 'messages'}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: action.color + '20', color: action.color }}
                >
                  {action.icon}
                  <span className="font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-6 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-xl`}
              >
                <div className="flex items-start justify-between">
                  <div className="text-white/80">{stat.icon}</div>
                  <div className={`flex items-center gap-0.5 text-xs ${stat.trendUp ? 'text-emerald-200' : 'text-red-200'}`}>
                    <ArrowUpRight className={stat.trendUp ? '' : 'rotate-90'} />
                    {stat.trend}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                    <span className="text-sm font-normal text-white/70 ml-1">{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
            {['overview', 'works', 'orders', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-violet-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'overview' ? '总览' : tab === 'works' ? '作品管理' : tab === 'orders' ? '订单管理' : '数据分析'}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            {['7d', '30d', '90d', '1y'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded ${
                  timeRange === range 
                    ? 'bg-violet-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range === '7d' ? '7天' : range === '30d' ? '30天' : range === '90d' ? '90天' : '1年'}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Main Stats */}
          <div className="col-span-2 space-y-6">
            {/* Earnings Trend */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="text-violet-400" />
                  收益趋势
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    ¥{currentUser.monthlyEarnings.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">本月收入</div>
                </div>
              </div>
              {renderEarningsChart()}
            </div>

            {/* Recent Works */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Film className="text-violet-400" />
                  最新作品
                </h3>
                <button 
                  onClick={() => navigate('/user/creator')}
                  className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1"
                >
                  查看全部 <ChevronRight />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {recentWorks.map(work => (
                  <div 
                    key={work.id}
                    className="bg-slate-700/30 rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-violet-500/50 transition-all"
                  >
                    <div className="relative h-32">
                      <img 
                        src={work.thumbnail} 
                        alt={work.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        {work.type === 'video' && (
                          <span className="px-2 py-0.5 bg-violet-600/80 text-white text-xs rounded">
                            <Film className="inline mr-1" />视频
                          </span>
                        )}
                        {work.type === 'image' && (
                          <span className="px-2 py-0.5 bg-amber-600/80 text-white text-xs rounded">
                            <Image className="inline mr-1" />图片
                          </span>
                        )}
                        {work.type === 'text' && (
                          <span className="px-2 py-0.5 bg-blue-600/80 text-white text-xs rounded">
                            <FileText className="inline mr-1" />文案
                          </span>
                        )}
                      </div>
                      {work.status === 'draft' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="px-3 py-1 bg-slate-600 text-white text-sm rounded">草稿</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="text-white font-medium truncate">{work.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye /> {(work.views / 1000).toFixed(1)}k
                        </span>
                        <span className="flex items-center gap-1">
                          <Star /> {(work.likes / 1000).toFixed(1)}k
                        </span>
                        <span className="text-emerald-400">¥{work.earnings}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Pending Orders */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ShoppingBag className="text-amber-400" />
                  进行中订单
                </h3>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                  {pendingOrders.length}个
                </span>
              </div>
              <div className="space-y-3">
                {pendingOrders.map(order => (
                  <div 
                    key={order.id}
                    className="bg-slate-700/30 rounded-lg p-3 cursor-pointer hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-white font-medium text-sm">{order.service}</div>
                        <div className="text-slate-400 text-xs mt-1">{order.client}</div>
                      </div>
                      <div className="text-emerald-400 font-medium">¥{order.amount}</div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-slate-500">截止 {order.deadline}</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                        {order.status === 'in_progress' ? '进行中' : '待开始'}
                      </span>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => navigate('/my-orders')}
                  className="w-full py-2 text-center text-violet-400 hover:text-violet-300 text-sm border border-violet-500/30 rounded-lg hover:bg-violet-500/10 transition-colors"
                >
                  查看全部订单
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="text-pink-400" />
                  最新动态
                </h3>
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
              </div>
              <div className="space-y-3">
                {notifications.map(notif => (
                  <div 
                    key={notif.id}
                    className={`flex items-start gap-3 p-2 rounded-lg ${
                      notif.unread ? 'bg-violet-500/10' : 'hover:bg-slate-700/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notif.type === 'order' ? 'bg-amber-500/20 text-amber-400' :
                      notif.type === 'earning' ? 'bg-emerald-500/20 text-emerald-400' :
                      notif.type === 'review' ? 'bg-pink-500/20 text-pink-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {notif.type === 'order' ? <ShoppingBag /> :
                       notif.type === 'earning' ? <DollarSign /> :
                       notif.type === 'review' ? <Star /> :
                       <BarChart3 />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${notif.unread ? 'text-white font-medium' : 'text-slate-300'}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{notif.time}</p>
                    </div>
                    {notif.unread && (
                      <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-gradient-to-br from-violet-900/50 to-purple-900/50 rounded-xl p-6 border border-violet-500/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="text-violet-400" />
                快速成长指南
              </h3>
              <div className="space-y-3">
                {[
                  { step: 1, title: '完善服务详情', desc: '让客户更了解你的能力' },
                  { step: 2, title: '积累优秀案例', desc: '展示你的最佳作品' },
                  { step: 3, title: '提升响应速度', desc: '快速回复提升接单率' },
                  { step: 4, title: '获取客户好评', desc: '口碑是最好的广告' },
                ].map(item => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{item.title}</div>
                      <div className="text-slate-400 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate('/opc-training')}
                className="w-full mt-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors"
              >
                开始特训营学习
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
