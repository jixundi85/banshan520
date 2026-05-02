import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/Toast'
import {
  Shield, Star, Award, TrendingUp, Clock, CheckCircle,
  AlertCircle, Users, FileText, Video, Image, MessageSquare,
  ThumbsUp, ThumbsDown, Calendar, ChevronRight, Activity,
  Zap, Crown, Sparkles, Eye, Download
} from 'lucide-react'
// ======= 信用等级配置 =======
const CREDIT_LEVELS = {
  S: { name: 'S级', color: 'from-amber-400 to-orange-500', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500/30', icon: Crown, minScore: 95 },
  A: { name: 'A级', color: 'from-violet-400 to-purple-500', bgColor: 'bg-violet-500/20', borderColor: 'border-violet-500/30', icon: Star, minScore: 85 },
  B: { name: 'B级', color: 'from-cyan-400 to-blue-500', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/30', icon: Sparkles, minScore: 70 },
  C: { name: 'C级', color: 'from-emerald-400 to-teal-500', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/30', icon: CheckCircle, minScore: 50 },
  D: { name: 'D级', color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-500/30', icon: AlertCircle, minScore: 0 },
}
// ======= 评价标签 =======
const REVIEW_TAGS = [
  { name: '专业可靠', positive: true, count: 156 },
  { name: '交付准时', positive: true, count: 142 },
  { name: '质量优秀', positive: true, count: 138 },
  { name: '沟通顺畅', positive: true, count: 125 },
  { name: '超出预期', positive: true, count: 98 },
  { name: '价格合理', positive: true, count: 87 },
  { name: '态度敷衍', positive: false, count: 3 },
  { name: '延期交付', positive: false, count: 5 },
]
// ======= 模拟数据 =======
const MOCK_DATA = {
  userId: 'user_001',
  userName: '创意大神',
  userType: 'creator', // creator / enterprise
  creditScore: 92,
  level: 'A',
  totalOrders: 45,
  completedOrders: 42,
  cancelledOrders: 3,
  avgRating: 4.8,
  totalEarnings: 128000,
  responseRate: 98.5,
  deliveryRate: 95.2,
  disputeRate: 2.1,
  firstOrderTime: '2023-06-15',
  lastOrderTime: '2024-01-18',
  badges: [
    { id: 1, name: '年度最佳', icon: '🏆', type: 'annual' },
    { id: 2, name: '速度之星', icon: '⚡', type: 'speed' },
    { id: 3, name: '品质保证', icon: '💎', type: 'quality' },
    { id: 4, name: '服务之星', icon: '⭐', type: 'service' },
  ],
  recentReviews: [
    { id: 1, order: '品牌宣传片制作', rating: 5, tags: ['专业可靠', '交付准时', '质量优秀'], client: '张经理', date: '2024-01-15', content: '非常满意！专业度高，沟通顺畅，交付准时。下次还合作！' },
    { id: 2, order: '产品包装设计', rating: 5, tags: ['超出预期', '沟通顺畅'], client: '李总', date: '2024-01-10', content: '作品超出预期，很有心，细节处理得很好！' },
    { id: 3, order: 'AI数字人定制', rating: 4, tags: ['专业可靠', '质量优秀'], client: '王总监', date: '2024-01-05', content: '整体满意，效果很好，有一些小细节需要改进。' },
  ],
  orderHistory: [
    { month: '2024-01', orders: 8, rating: 4.9, earnings: 28000 },
    { month: '2023-12', orders: 12, rating: 4.8, earnings: 35000 },
    { month: '2023-11', orders: 10, rating: 4.7, earnings: 28000 },
    { month: '2023-10', orders: 7, rating: 4.9, earnings: 20000 },
    { month: '2023-09', orders: 5, rating: 4.8, earnings: 12000 },
    { month: '2023-08', orders: 3, rating: 4.6, earnings: 5000 },
  ],
}
// ======= 主组件 =======
export default function CreditProfile() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  // 状态
  const [activeTab, setActiveTab] = useState('overview') // overview/reviews/history/report
  const [data, setData] = useState(MOCK_DATA)
  // 获取等级配置
  const levelConfig = CREDIT_LEVELS[data.level]
  // 计算各项指标
  const completionRate = ((data.completedOrders / data.totalOrders) * 100).toFixed(1)
  const positiveRate = ((data.recentReviews.filter(r => r.rating >= 4).length / data.recentReviews.length) * 100).toFixed(0)
  // 获取评级进度
  const getLevelProgress = () => {
    const currentLevel = CREDIT_LEVELS[data.level]
    const nextLevel = Object.values(CREDIT_LEVELS).find(l => l.minScore > currentLevel.minScore)
    if (!nextLevel) return 100
    const range = nextLevel.minScore - currentLevel.minScore
    const progress = data.creditScore - currentLevel.minScore
    return Math.min(100, (progress / range) * 100)
  }
  return (
    
      <div className="min-h-screen bg-slate-900 pt-16">
        {/* 顶部档案卡片 */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-start justify-between">
              {/* 左侧信息 */}
              <div className="flex items-start gap-6">
                {/* 头像 */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-3xl text-white font-bold">
                    {data.userName[0]}
                  </div>
                  <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r ${levelConfig.color} text-white text-sm font-bold border-2 border-slate-900`}>
                    {levelConfig.name}
                  </div>
                </div>
                {/* 基础信息 */}
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{data.userName}</h1>
                  <p className="text-gray-400 mb-3">
                    {data.userType === 'creator' ? 'OPC认证创作者' : '认证企业'} · 入驻{data.firstOrderTime.split('-')[0]}年
                  </p>
                  {/* 徽章 */}
                  <div className="flex flex-wrap gap-2">
                    {data.badges.map((badge) => (
                      <div key={badge.id} className="flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                        <span>{badge.icon}</span>
                        <span className="text-amber-400 text-sm">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* 右侧操作 */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors">
                  <Eye className="w-4 h-4" />
                  公开档案
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors">
                  <Download className="w-4 h-4" />
                  下载报告
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 信用分大卡片 */}
        <div className="max-w-6xl mx-auto px-4 -mt-8">
          <div className={`bg-gradient-to-br ${levelConfig.bgColor} border ${levelConfig.borderColor} rounded-2xl p-6 backdrop-blur-xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                {/* 信用分 */}
                <div className="text-center">
                  <div className="relative w-28 h-28">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="6" fill="none" className="text-white/10" />
                      <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="6" fill="none" className="text-white" strokeDasharray={`${data.creditScore * 3.14} 314`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-white">{data.creditScore}</span>
                        <p className="text-gray-400 text-xs">信用分</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 等级进度 */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <levelConfig.icon className={`w-8 h-8 ${levelConfig.color.split(' ')[0].replace('from-', 'text-')}`} />
                    <div>
                      <p className="text-white font-bold text-lg">{levelConfig.name}信用等级</p>
                      <p className="text-gray-400 text-sm">
                        {Object.values(CREDIT_LEVELS).find(l => l.minScore > levelConfig.minScore)
                          ? `距离${Object.values(CREDIT_LEVELS).find(l => l.minScore > levelConfig.minScore)?.name}还需 ${Object.values(CREDIT_LEVELS).find(l => l.minScore > levelConfig.minScore)?.minScore - data.creditScore} 分`
                          : '已达最高等级'}
                      </p>
                    </div>
                  </div>
                  <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${levelConfig.color} rounded-full transition-all`}
                      style={{ width: `${getLevelProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {/* 核心指标 */}
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white mb-1">
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    {data.avgRating}
                  </div>
                  <p className="text-gray-400 text-sm">平均评分</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-emerald-400 mb-1">
                    {completionRate}%
                  </div>
                  <p className="text-gray-400 text-sm">完成率</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-cyan-400 mb-1">
                    {data.responseRate}%
                  </div>
                  <p className="text-gray-400 text-sm">响应率</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-amber-400 mb-1">
                    ¥{(data.totalEarnings / 10000).toFixed(1)}万
                  </div>
                  <p className="text-gray-400 text-sm">累计收益</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tab导航 */}
        <div className="max-w-6xl mx-auto px-4 mt-8">
          <div className="flex gap-6 py-4 border-b border-white/5">
            {[
              { id: 'overview', name: '信用概览', icon: Shield },
              { id: 'reviews', name: '评价详情', icon: Star },
              { id: 'history', name: '成长记录', icon: TrendingUp },
              { id: 'report', name: '信用报告', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
        {/* 内容区 */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 信用概览 */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 能力雷达 */}
              <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-6">能力评估</h3>
                <div className="space-y-4">
                  {[
                    { name: '专业能力', score: 95, icon: Award },
                    { name: '服务质量', score: 92, icon: Star },
                    { name: '交付效率', score: 88, icon: Zap },
                    { name: '沟通能力', score: 90, icon: MessageSquare },
                    { name: '客户满意度', score: 94, icon: ThumbsUp },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-violet-400" />
                          <span className="text-gray-300">{item.name}</span>
                        </div>
                        <span className="text-white font-medium">{item.score}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 评价标签 */}
              <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-6">累计标签</h3>
                <div className="space-y-3">
                  {REVIEW_TAGS.map((tag, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {tag.positive ? (
                          <ThumbsUp className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ThumbsDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className={tag.positive ? 'text-gray-300' : 'text-gray-500'}>
                          {tag.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${tag.positive ? 'bg-emerald-500' : 'bg-red-500'}`}
                            style={{ width: `${(tag.count / 200) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm w-12 text-right">{tag.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 近期评价 */}
              <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold">近期评价</h3>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1"
                  >
                    查看更多 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.recentReviews.map((review) => (
                    <div key={review.id} className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">{review.order}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-600'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{review.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {review.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">{tag}</span>
                          ))}
                        </div>
                        <span className="text-gray-500 text-xs">{review.client} · {review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* 评价详情 */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {data.recentReviews.map((review) => (
                <div key={review.id} className="bg-slate-800/60 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold mb-1">{review.order}</h3>
                      <p className="text-gray-500 text-sm">
                        {review.client} · {review.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-600'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{review.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* 成长记录 */}
          {activeTab === 'history' && (
            <div>
              <h3 className="text-white font-bold mb-6">月度成长趋势</h3>
              <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6">
                <div className="flex items-end justify-between h-48">
                  {data.orderHistory.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full flex flex-col items-center">
                        <span className="text-white font-medium text-sm mb-1">{item.orders}</span>
                        <div
                          className="w-12 bg-gradient-to-t from-violet-500 to-fuchsia-500 rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${(item.orders / 15) * 120}px` }}
                        ></div>
                      </div>
                      <span className="text-gray-500 text-xs">{item.month.split('-')[1]}月</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-white/10 text-sm">
                  <div>
                    <span className="text-gray-500">累计订单：</span>
                    <span className="text-white font-medium">{data.totalOrders}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">累计收益：</span>
                    <span className="text-amber-400 font-medium">¥{data.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">平均评分：</span>
                    <span className="text-white font-medium">{data.avgRating}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* 信用报告 */}
          {activeTab === 'report' && (
            <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${levelConfig.bgColor} border ${levelConfig.borderColor} mb-4`}>
                  <levelConfig.icon className={`w-8 h-8 ${levelConfig.color.split(' ')[0].replace('from-', 'text-')}`} />
                  <span className="text-white font-bold text-xl">{levelConfig.name}信用报告</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{data.userName}</h2>
                <p className="text-gray-400">生成时间：{new Date().toLocaleString()}</p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-2">信用分数</p>
                    <p className="text-3xl font-bold text-white">{data.creditScore}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-2">完成订单</p>
                    <p className="text-3xl font-bold text-emerald-400">{data.completedOrders}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-2">好评率</p>
                    <p className="text-3xl font-bold text-amber-400">{positiveRate}%</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-2">信用等级</p>
                    <p className={`text-3xl font-bold ${levelConfig.color.split(' ')[0].replace('from-', 'text-')}`}>{levelConfig.name}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">详细指标</h3>
                  <div className="space-y-4">
                    {[
                      { name: '订单完成率', value: completionRate, unit: '%' },
                      { name: '客户响应率', value: data.responseRate, unit: '%' },
                      { name: '准时交付率', value: data.deliveryRate, unit: '%' },
                      { name: '争议率', value: data.disputeRate, unit: '%', inverse: true },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="text-gray-400 w-32">{item.name}</span>
                        <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.inverse ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'}`}
                            style={{ width: `${item.inverse ? 100 - item.value : item.value}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium w-20 text-right">{item.value}{item.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">信用建议</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">继续保持高质量的服务，争取获得更多好评</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">注意订单交付时间，避免延期影响信用</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">继续保持，提升服务体验，冲击S级信用</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    
  )
}
