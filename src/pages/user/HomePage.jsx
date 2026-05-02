import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../utils/api'
import { useCopyrightOrders } from '../../hooks/useCopyright'
import { useCourseOrders } from '../../hooks/useCourseOrders'
import { Sparkles } from 'lucide-react'

// 引入课程数据
import { allCourses as courses } from '../../data/unifiedCourses'

// 引入版权数据 - 直接使用版权交易中心的真实数据源
import { getCopyrightGoods, initCopyrightData } from '../../data/copyrightSchema'

// 引入社区数据
import { getAllPosts, formatTimeAgo } from '../../data/communitySchema'

// 需求订单模拟数据（按6大分类，每类2-3个，共16个需求）
const mockDemands = [
  // AI短视频
  { id: 1, title: '科技公司品牌宣传片制作', category: 'AI短视频', catKey: 'shortvideo', budget: '5000-8000', deadline: '7天内', bids: 12, status: '招募中', publisher: '张先生', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangSir', tags: ['品牌宣传', '科技风', '60秒'], urgent: false },
  { id: 2, title: '房地产楼盘航拍宣传视频', category: 'AI短视频', catKey: 'shortvideo', budget: '8000-12000', deadline: '10天内', bids: 7, status: '招募中', publisher: '李经理', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiManager', tags: ['航拍风格', '高端楼盘', '3分钟'], urgent: true },
  // AI短剧
  { id: 3, title: 'AI短剧《总裁的心尖宠》5集制作', category: 'AI短剧', catKey: 'shortdrama', budget: '12000-18000', deadline: '20天内', bids: 5, status: '招募中', publisher: '王编剧', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangScript', tags: ['都市爱情', '5集', '竖屏'], urgent: false },
  { id: 4, title: '悬疑推理短剧《消失的证人》3集', category: 'AI短剧', catKey: 'shortdrama', budget: '9000-15000', deadline: '15天内', bids: 9, status: '招募中', publisher: '陈导演', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChenDir', tags: ['悬疑推理', '3集', '横屏'], urgent: true },
  // AI漫剧
  { id: 5, title: '国风漫剧《倾城·长安》漫画分镜', category: 'AI漫剧', catKey: 'mangadrama', budget: '6000-10000', deadline: '12天内', bids: 4, status: '招募中', publisher: '赵漫画师', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhaoManga', tags: ['国风', '古风', '50话'], urgent: false },
  { id: 6, title: '都市校园漫剧角色设计+分镜稿', category: 'AI漫剧', catKey: 'mangadrama', budget: '4000-7000', deadline: '8天内', bids: 6, status: '招募中', publisher: '周同学', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhouXTD', tags: ['校园', '青春', '角色设计'], urgent: false },
  // AI电影
  { id: 7, title: '科幻短片《星际流浪者》10分钟', category: 'AI电影', catKey: 'film', budget: '30000-50000', deadline: '30天内', bids: 3, status: '招募中', publisher: '刘制片人', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiuProd', tags: ['科幻', '10分钟', '电影级'], urgent: false },
  { id: 8, title: '公益微电影《回家的路》5分钟', category: 'AI电影', catKey: 'film', budget: '15000-25000', deadline: '25天内', bids: 8, status: '招募中', publisher: '孙公益', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunPubGood', tags: ['公益', '温情', '5分钟'], urgent: true },
  // AI设计师
  { id: 9, title: '新茶饮品牌全套VI设计', category: 'AI设计师', catKey: 'designer', budget: '8000-12000', deadline: '10天内', bids: 15, status: '招募中', publisher: '茶颜老板', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChaYanBoss', tags: ['品牌VI', '茶饮', '全套'], urgent: false },
  { id: 10, title: '游戏APP界面UI/UX设计20屏', category: 'AI设计师', catKey: 'designer', budget: '12000-20000', deadline: '15天内', bids: 11, status: '招募中', publisher: '吴游戏', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WuGame', tags: ['UI设计', '游戏', '20屏'], urgent: true },
  { id: 11, title: '电商节日海报系列设计（10张）', category: 'AI设计师', catKey: 'designer', budget: '3000-5000', deadline: '5天内', bids: 22, status: '招募中', publisher: '郑电商', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhengEC', tags: ['海报设计', '节日', '电商'], urgent: true },
  // AI带货变现
  { id: 12, title: '美妆品牌带货短视频20条', category: 'AI带货变现', catKey: 'commerce', budget: '5000-8000', deadline: '7天内', bids: 18, status: '招募中', publisher: '林美妆', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LinMakeup', tags: ['美妆带货', '20条', 'TikTok'], urgent: false },
  { id: 13, title: '保健品直播话术脚本+视觉素材', category: 'AI带货变现', catKey: 'commerce', budget: '4000-6000', deadline: '6天内', bids: 9, status: '招募中', publisher: '徐健康', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XuHealth', tags: ['直播脚本', '保健品', '素材'], urgent: false },
  { id: 14, title: '宠物食品小红书种草视频15条', category: 'AI带货变现', catKey: 'commerce', budget: '6000-9000', deadline: '8天内', bids: 13, status: '招募中', publisher: '何宠物', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HePet', tags: ['小红书', '宠物', '15条'], urgent: true },
  // 额外补充
  { id: 15, title: '互联网公司年会开场视频制作', category: 'AI短视频', catKey: 'shortvideo', budget: '10000-15000', deadline: '3天内', bids: 20, status: '招募中', publisher: '互联网公司HR', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=InternetHR', tags: ['年会', '开场视频', '震撼'], urgent: true },
  { id: 16, title: '古风武侠AI短剧《江湖令》全集', category: 'AI短剧', catKey: 'shortdrama', budget: '20000-35000', deadline: '30天内', bids: 6, status: '招募中', publisher: '武侠工作室', publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WuxiaStudio', tags: ['古风武侠', '全集', '竖屏'], urgent: false },
]

// 需求分类颜色及图标配置（与需求大厅详情页一致）
const demandCategoryMeta = {
  'AI短视频': { gradient: 'from-cyan-500 to-blue-600', light: 'from-cyan-500/15 to-blue-600/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: '🎬', glow: 'shadow-cyan-500/20' },
  'AI短剧':   { gradient: 'from-violet-500 to-purple-600', light: 'from-violet-500/15 to-purple-600/10', border: 'border-violet-500/30', text: 'text-violet-400', icon: '🎭', glow: 'shadow-violet-500/20' },
  'AI漫剧':   { gradient: 'from-pink-500 to-rose-600', light: 'from-pink-500/15 to-rose-600/10', border: 'border-pink-500/30', text: 'text-pink-400', icon: '📚', glow: 'shadow-pink-500/20' },
  'AI电影':   { gradient: 'from-orange-500 to-amber-600', light: 'from-orange-500/15 to-amber-600/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: '🎥', glow: 'shadow-orange-500/20' },
  'AI设计师': { gradient: 'from-emerald-500 to-teal-600', light: 'from-emerald-500/15 to-teal-600/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: '🎨', glow: 'shadow-emerald-500/20' },
  'AI带货变现':{ gradient: 'from-yellow-500 to-orange-500', light: 'from-yellow-500/15 to-orange-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: '💰', glow: 'shadow-yellow-500/20' },
}

const mockCreators = [
  { id: 1, name: '创意工坊', specialty: 'AI视频 · 特效制作', rating: 4.9, works_count: 45, followers_count: 2300, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator1', level: 'senior' },
  { id: 2, name: '视觉大师', specialty: 'AI绘画 · 商业设计', rating: 5.0, works_count: 128, followers_count: 5600, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator2', level: 'expert' },
  { id: 3, name: 'AI动画师小王', specialty: 'AI动画 · 角色设计', rating: 4.8, works_count: 67, followers_count: 1800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator3', level: 'middle' },
  { id: 4, name: '科技创想', specialty: 'AI视频 · 产品演示', rating: 4.7, works_count: 89, followers_count: 3200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator4', level: 'senior' }
]

const levelColors = {
  junior: 'bg-green-500/20 text-green-400',
  middle: 'bg-blue-500/20 text-blue-400',
  senior: 'bg-purple-500/20 text-purple-400',
  expert: 'bg-yellow-500/20 text-yellow-400'
}

const categoryColors = {
  'AI短视频': 'from-cyan-500 to-blue-500',
  'AI短剧': 'from-violet-500 to-purple-500',
  'AI漫剧': 'from-pink-500 to-rose-500',
  'AI电影': 'from-orange-500 to-amber-500',
  'AI设计师': 'from-emerald-500 to-teal-500',
  'AI带货变现': 'from-yellow-500 to-orange-500'
}

// 数字滚动动画组件
function AnimatedNumber({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const increment = end / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// 浮动光球背景组件
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/30 to-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-600/25 to-blue-600/15 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-fuchsia-600/20 to-pink-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + i * 0.5}s`
          }}
        />
      ))}
    </div>
  )
}

// 玻璃拟态卡片组件
function GlassCard({ children, className = '', hover = true }) {
  return (
    <div className={`
      bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
      ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

// 需求大厅区块（与需求大厅详情页风格一致，2行4列展示8个需求）
function DemandSection({ navigate }) {
  // 精选8条需求（各分类代表项目）
  const featuredDemands = [
    mockDemands[0],  // 科技公司品牌宣传片
    mockDemands[1],  // 房地产楼盘航拍
    mockDemands[3],  // 悬疑推理短剧
    mockDemands[7],  // 公益微电影
    mockDemands[9],  // 游戏APP界面设计
    mockDemands[11], // 美妆品牌带货
    mockDemands[14], // 互联网公司年会
    mockDemands[15], // 古风武侠AI短剧
  ]

  // 统计数据
  const statsData = [
    { value: '2,847', label: '需求总数', icon: '📋' },
    { value: '1,286', label: '认证创作者', icon: '✅' },
    { value: '¥568万', label: '总成交额', icon: '💰' },
    { value: '¥3,280', label: '平均预算', icon: '📊' },
  ]

  // 分类标签
  const categories = [
    { name: '全部', icon: '✨', active: true },
    { name: 'AI短视频', icon: '🎬', active: false },
    { name: 'AI短剧', icon: '🎭', active: false },
    { name: 'AI漫剧', icon: '📚', active: false },
    { name: 'AI电影', icon: '🎥', active: false },
    { name: 'AI设计师', icon: '🎨', active: false },
    { name: 'AI带货变现', icon: '💰', active: false },
  ]

  // 投标弹窗状态
  const [bidModal, setBidModal] = useState({ show: false, demand: null })
  const [bidForm, setBidForm] = useState({ price: '', message: '', days: '' })

  // 打开投标弹窗
  const handleBid = (e, demand) => {
    e.stopPropagation()
    setBidModal({ show: true, demand })
    setBidForm({ price: demand.budget, message: '', days: '7' })
  }

  // 提交投标
  const handleSubmitBid = () => {
    if (!bidForm.price || !bidForm.message || !bidForm.days) {
      alert('请填写完整的投标信息')
      return
    }
    alert(`投标成功！\\n需求：${bidModal.demand.title}\\n报价：¥${bidForm.price}\\n工期：${bidForm.days}天`)
    setBidModal({ show: false, demand: null })
  }

  return (
    <section className="max-w-6xl mx-auto px-4 mb-24">
      {/* 标题区 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">智配中心</span>
          </h2>
          <p className="text-gray-400">智能匹配需求与创作力，让价值高效流动</p>
        </div>
        <Link to="/demand" className="group flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
          查看全部
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* 数据统计行 */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {statsData.map((stat, index) => (
          <div key={index} className="flex items-center gap-2 px-3 py-2.5 bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-lg">
            <span className="text-lg">{stat.icon}</span>
            <div>
              <div className="text-white text-sm font-bold">{stat.value}</div>
              <div className="text-gray-500 text-xs">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 分类筛选标签 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              cat.active
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/60 border border-white/10 text-gray-400 hover:border-amber-500/30 hover:text-amber-400'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 4列2行需求卡片 - 与需求大厅详情页风格一致 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {featuredDemands.map((demand) => {
          const meta = demandCategoryMeta[demand.category] || demandCategoryMeta['AI短视频']
          return (
            <div
              key={demand.id}
              className={`group relative bg-slate-800/60 backdrop-blur-sm border ${meta.border} rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${meta.glow} hover:bg-slate-800/90`}
              onClick={() => navigate('/demand')}
            >
              {/* 顶部彩色条 */}
              <div className={`h-1 w-full bg-gradient-to-r ${meta.gradient}`}></div>

              <div className="p-3">
                {/* 头：分类 + 状态 */}
                <div className="flex items-center justify-between mb-2">
                  <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r ${meta.light} border ${meta.border}`}>
                    <span className="text-xs">{meta.icon}</span>
                    <span className={`text-xs font-medium ${meta.text}`}>{demand.category}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs ${demand.urgent ? 'animate-pulse' : ''}`}>
                    {demand.urgent ? '🔥 急需' : '⏰ 招募中'}
                  </span>
                </div>

                {/* 标题 */}
                <h3 className="text-xs font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors leading-tight" style={{ minHeight: '2.5em' }}>
                  {demand.title}
                </h3>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {demand.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-white/5 text-gray-400 text-xs rounded border border-white/8">{tag}</span>
                  ))}
                </div>

                {/* 预算 */}
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-amber-400 text-xs font-bold">¥</span>
                  <span className="text-white text-sm font-semibold">{demand.budget}</span>
                </div>

                {/* 分割线 */}
                <div className="border-t border-white/5 mb-2"></div>

                {/* 发布者 + 统计 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <img src={demand.publisherAvatar} alt={demand.publisher} className="w-5 h-5 rounded-full border border-white/10" />
                    <span className="text-gray-500 text-xs truncate max-w-[60px]">{demand.publisher}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {demand.bids}人
                  </div>
                </div>

                {/* 投标按钮 */}
                <button
                  className={`w-full mt-2 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all bg-gradient-to-r ${meta.gradient} text-white opacity-90 hover:opacity-100`}
                  onClick={(e) => handleBid(e, demand)}
                >
                  立即投标
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* 发布需求 CTA 条 */}
      <div className="mt-6 flex items-center justify-between px-5 py-3 bg-white/3 backdrop-blur-sm border border-amber-500/15 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-lg shadow-lg shadow-amber-500/20">
            📢
          </div>
          <div>
            <p className="text-white text-sm font-semibold">有AI创作需求？</p>
            <p className="text-gray-500 text-xs">发布需求，数百位认证创作者为您服务</p>
          </div>
        </div>
        <Link
          to="/demand"
          className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap"
        >
          + 发布需求
        </Link>
      </div>

      {/* 投标弹窗 */}
      {bidModal.show && bidModal.demand && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setBidModal({ show: false, demand: null })}>
          <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">投递标书</h3>
              <button
                onClick={() => setBidModal({ show: false, demand: null })}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 需求信息 */}
            <div className="p-5 border-b border-white/10">
              <div className="text-gray-400 text-xs mb-1">投递至</div>
              <div className="text-white font-medium">{bidModal.demand.title}</div>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-gray-400">预算：<span className="text-amber-400 font-semibold">¥{bidModal.demand.budget}</span></span>
                <span className="text-gray-400">当前投标：<span className="text-white">{bidModal.demand.bids}人</span></span>
              </div>
            </div>

            {/* 投标表单 */}
            <div className="p-5 space-y-4">
              {/* 报价 */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">您的报价（¥）</label>
                <input
                  type="number"
                  value={bidForm.price}
                  onChange={e => setBidForm({ ...bidForm, price: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="输入您的报价"
                />
              </div>

              {/* 工期 */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">预计工期（天）</label>
                <input
                  type="number"
                  value={bidForm.days}
                  onChange={e => setBidForm({ ...bidForm, days: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="预计完成天数"
                />
              </div>

              {/* 留言 */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">给雇主留言</label>
                <textarea
                  value={bidForm.message}
                  onChange={e => setBidForm({ ...bidForm, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                  placeholder="介绍您的优势和相关经验..."
                />
              </div>

              {/* 提交按钮 */}
              <button
                onClick={handleSubmitBid}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20"
              >
                确认投递
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const [creators, setCreators] = useState(mockCreators)
  const [stats, setStats] = useState({ usersCount: 0, coursesCount: 0, creatorsCount: 0, demandsCount: 0 })
  const [loginState, setLoginState] = useState({
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null')
  })
  const [buyingId, setBuyingId] = useState(null)
  const [buyMsg, setBuyMsg] = useState('')
  const copyright = useCopyrightOrders()
  const courseOrder = useCourseOrders()
  const [buyingCourseId, setBuyingCourseId] = useState(null)
  const [courseBuyMsg, setCourseBuyMsg] = useState('')

  // 版权交易中心真实数据
  const [portraits, setPortraits] = useState([])
  const [novels, setNovels] = useState([])
  const [films, setFilms] = useState([])

  useEffect(() => {
    // 加载版权交易中心真实数据
    initCopyrightData()
    setPortraits(getCopyrightGoods('portrait'))
    setNovels(getCopyrightGoods('novel'))
    setFilms(getCopyrightGoods('film'))
  }, [])

  useEffect(() => {
    // 获取统计数据
    const totalStudents = courses.reduce((sum, c) => sum + c.students, 0)
    setStats({
      usersCount: 10242,
      coursesCount: courses.length,
      creatorsCount: 200,
      demandsCount: 1000
    })

    const handleLoginSuccess = () => {
      setLoginState({
        isAuthenticated: !!localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user') || 'null')
      })
    }

    window.addEventListener('loginSuccess', handleLoginSuccess)
    window.addEventListener('logout', handleLoginSuccess)
    window.addEventListener('storage', handleLoginSuccess)

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess)
      window.removeEventListener('logout', handleLoginSuccess)
      window.removeEventListener('storage', handleLoginSuccess)
    }
  }, [])

  const isAuthenticated = () => {
    return loginState.isAuthenticated
  }

  const getCategoryDisplay = (category) => {
    const map = {
      'shortvideo': 'AI短视频',
      'shortdrama': 'AI短剧',
      'mangadrama': 'AI漫剧',
      'film': 'AI电影',
      'designer': 'AI设计师',
      'commerce': 'AI带货变现'
    }
    return map[category] || category
  }

  const handleBuyCopyright = async (e, item) => {
    e.stopPropagation()
    if (buyingId) return
    if (!loginState.isAuthenticated) {
      navigate('/login')
      return
    }
    setBuyingId(item.id)
    setBuyMsg('')
    try {
      const order = copyright.createOrder({
        goods_id: item.id,
        price_cash: item.price_cash || 0,
        price_points: item.price_points || 0,
        pay_type: (item.price_cash || 0) > 0 ? 'cash' : 'points',
      })
      const result = copyright.payOrder(order.id, (item.price_cash || 0) > 0 ? 'cash' : 'points')
      if (result.success) {
        setBuyMsg(`✅ 购买成功！已获得「${item.title}」授权`)
      } else {
        setBuyMsg(`⚠️ ${result.message}`)
      }
    } catch {
      setBuyMsg('❌ 购买失败，请稍后重试')
    }
    setBuyingId(null)
    setTimeout(() => setBuyMsg(''), 3000)
  }

  const handleBuyCourse = (e, course) => {
    e.preventDefault()
    e.stopPropagation()
    if (buyingCourseId) return
    if (!loginState.isAuthenticated) {
      navigate('/login')
      return
    }
    setBuyingCourseId(course.id)
    setCourseBuyMsg('')
    try {
      const order = courseOrder.createOrder(course)
      const result = courseOrder.payOrder(order?.id)
      if (result.success) {
        setCourseBuyMsg(`✅ 购买成功！已获得「${course.title}」`)
      } else {
        setCourseBuyMsg(`⚠️ ${result.message}`)
      }
    } catch {
      setCourseBuyMsg('❌ 购买失败，请稍后重试')
    }
    setBuyingCourseId(null)
    setTimeout(() => setCourseBuyMsg(''), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* 自定义样式 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.3); }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Hero Section - 第五栖息地入口 */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <FloatingOrbs />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          {/* 顶部标签组 - 垂直居中 */}
          <div className="flex flex-col items-center gap-2 mb-6 animate-slide-up">
            {/* 绿色标签 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-300">半山 · 碳硅共生经济模型</span>
            </div>
          </div>

          {/* 主标题 */}
          <div className="mb-4 animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-3">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                智力调度中心
              </span>
            </h1>
          </div>

          {/* 副标题 */}
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-2 animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            硅基算力外骨骼 × 碳基灵魂创造力
          </p>
          <p className="text-sm text-gray-500 mb-12 animate-slide-up" style={{ animationDelay: '0.25s', opacity: 0 }}>
            马来西亚离岸节点 · 数据主权独立 · OPC网络调度
          </p>

          {/* 双入口卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            {/* 超级个体觉醒 */}
            <Link to="/awakening" className="group relative block">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-2">
                {/* 图标 */}
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-violet-500/30">
                  🧠
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">超级个体觉醒</h2>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                  加入OPC网络，调用云端硅基工具链<br/>
                  让你的灵魂密度成为最强印钞机
                </p>
                
                <div className="space-y-2 mb-8 text-left">
                  {['AI工作站赋能', '全球需求匹配', '链上确权分润'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full"></span>
                      {item}
                    </div>
                  ))}
                </div>
                
                <button className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/20">
                  开始觉醒 →
                </button>
              </div>
            </Link>

            {/* 企业智能升级 */}
            <Link to="/enterprise-guide" className="group relative block">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/30 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2">
                {/* 图标 */}
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-cyan-500/30">
                  🏢
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">企业智能升级</h2>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                  AI私有化部署方案定制<br/>
                  降本增效一站式解决
                </p>
                
                <div className="space-y-2 mb-8 text-left">
                  {['智能诊断评估', '私有化部署方案', 'OPC人才匹配'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                      {item}
                    </div>
                  ))}
                </div>
                
                <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20">
                  立即诊断 →
                </button>
              </div>
            </Link>
          </div>

          {/* 底部信任标识 */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm animate-slide-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full"></span>马来西亚离岸节点</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-400 rounded-full"></span>数据主权独立</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-400 rounded-full"></span>碳硅协同协议</span>
          </div>
        </div>
      </section>

      {/* 智力矩阵 */}
      <section className="max-w-6xl mx-auto px-4 mb-24">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">智力矩阵</span>
          </h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">无缝聚合全球百款精锐工具与百位超级大脑，一站式解决创作需求</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { number: '100', unit: '位', label: '超级个体入驻', color: 'text-violet-400' },
            { number: '100', unit: '款', label: '全球领先工具', color: 'text-cyan-400' },
            { number: '1000', unit: '家', label: '会员企业需求', color: 'text-amber-400' },
            { number: '0', unit: '个', label: '累计交付任务', color: 'text-emerald-400' },
          ].map((item, index) => (
            <div key={index} className="text-center py-6 px-4 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/[0.05] hover:border-white/15 transition-all">
              <p className={`text-3xl md:text-4xl font-bold ${item.color} mb-1`}>
                <AnimatedNumber end={parseInt(item.number)} />{item.unit}
              </p>
              <p className="text-gray-400 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 社区动态展示 ===== */}
      <section className="max-w-6xl mx-auto px-4 mb-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">🔥 火热社区</span>
          </h2>
          <p className="text-gray-400">24小时AI员工在线运营，真实创作者经验分享</p>
        </div>

        {/* 统一社区卡片 */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          {/* 顶部：AI在线 + 数据统计 */}
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-white/10">
            {/* AI在线状态 */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-green-400 text-sm font-medium">AI员工在线</span>
              </div>
              <div className="flex -space-x-2">
                {['🤖', '🎨', '📊', '🎬', '💼'].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm border-2 border-slate-800">
                    {emoji}
                  </div>
                ))}
              </div>
              <span className="text-gray-400 text-sm">+156名</span>
            </div>

            {/* 数据统计 */}
            <div className="flex items-center gap-6 ml-auto">
              <div className="text-center">
                <p className="text-xl font-bold text-white">2.3k</p>
                <p className="text-xs text-gray-500">今日发帖</p>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">8.9k</p>
                <p className="text-xs text-gray-500">社区成员</p>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">45k</p>
                <p className="text-xs text-gray-500">互动次数</p>
              </div>
            </div>
          </div>

          {/* 热门帖子网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {getAllPosts().slice(0, 4).map((post) => (
              <Link
                key={post.id}
                to="/community?tab=exchange"
                className={`group block bg-slate-900/50 rounded-2xl p-4 hover:bg-slate-900/70 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 ${
                  post.isAIPost ? 'border border-violet-500/20' : 'border border-white/5'
                }`}
              >
                {/* 标识 */}
                <div className="flex items-center gap-2 mb-3">
                  {post.isAIPost ? (
                    <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs rounded-full">
                      🤖 AI
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                      👤 真人
                    </span>
                  )}
                  {post.isHot && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">🔥热</span>}
                  {post.isEssence && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">⭐精</span>}
                </div>

                {/* 标题 */}
                <h4 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-violet-400 transition-colors">
                  {post.title}
                </h4>

                {/* 内容 */}
                <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                  {typeof post.content === 'string' ? post.content.slice(0, 60) : ''}
                </p>

                {/* 图片 */}
                {post.images?.length > 0 && (
                  <img src={post.images[0]} alt="" className="w-full h-24 object-cover rounded-lg mb-3" />
                )}

                {/* 底部：作者+互动 */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-violet-500/30 to-cyan-500/30 rounded-full flex items-center justify-center text-xs text-white">
                      {post.isAIPost ? '🤖' : post.authorAvatar}
                    </div>
                    <span className="text-gray-400 text-xs truncate max-w-20">
                      {post.isAIPost ? post.sourceAIName : post.authorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 进入社区按钮 */}
          <div className="mt-6 text-center">
            <Link 
              to="/community?tab=exchange"
              className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-bold hover:from-violet-500 hover:to-cyan-500 transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5"
            >
              <span>🚀</span>
              <span>进入社区交流</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== AIGC实战课程 ===== */}
      <section className="max-w-6xl mx-auto px-4 mb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/15 border border-violet-500/30 rounded-full mb-3">
              <span className="text-violet-400 text-xs font-medium">🎓 系统学习</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              AIGC<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"> 实战课程</span>
            </h2>
            <p className="text-gray-400 mt-2">从零到变现，系统掌握AI创作核心技能</p>
          </div>
          <Link to="/training" className="hidden md:flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors group">
            查看全部课程
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.slice(0, 8).map((course) => (
            <Link
              to={`/training/course/${course.id}`}
              key={course.id}
              className="group relative bg-slate-800/60 backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-500 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
            >
              {/* 封面 */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {course.coverImage ? (
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-900/50 to-slate-900 flex items-center justify-center text-5xl">
                    🎬
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                {/* 标签层 */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {course.featured && (
                    <span className="px-2 py-0.5 bg-violet-500 text-white text-xs rounded-full font-medium shadow">热门</span>
                  )}
                  <span className="px-2 py-0.5 bg-black/60 text-white/90 text-xs rounded-full backdrop-blur-sm border border-white/20">{course.level}</span>
                </div>
                {/* 底部分类 */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-xl border border-white/20 font-medium">
                    {course.tags?.[0] || 'AI创作'}
                  </span>
                </div>
              </div>

              {/* 内容 */}
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors leading-snug">
                  {course.title}
                </h3>
                <p className="text-slate-500 text-xs mb-3">{course.teacher?.name || '平台讲师'}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400 text-xs font-bold">★</span>
                    <span className="text-white text-xs">{course.rating}</span>
                    <span className="text-slate-600 text-xs">({course.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <span>👤</span>
                    <span>{course.students?.toLocaleString()}</span>
                  </div>
                </div>

                {/* 价格 */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-violet-400">¥{course.price}</span>
                    <span className="text-slate-500 line-through text-sm">¥{course.originalPrice}</span>
                    <span className="text-xs text-slate-500">{course.lessons}节</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/training/course/${course.id}`) }}
                    className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-medium rounded-lg hover:from-violet-400 hover:to-purple-400 transition-colors shadow-lg"
                  >
                    立即购买
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link to="/training" className="inline-flex items-center gap-2 text-sm text-violet-400 border border-violet-500/30 px-4 py-2 rounded-xl hover:bg-violet-500/10 transition-colors">
            查看全部课程 →
          </Link>
        </div>
      </section>

      {/* ===== 需求广场 ===== */}
      <section className="max-w-6xl mx-auto px-4 mb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 rounded-full mb-3">
              <span className="text-cyan-400 text-xs font-medium">💼 实时接单</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              企业<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> 需求广场</span>
            </h2>
            <p className="text-gray-400 mt-2">海量企业需求等你来接，直接变现创作能力</p>
          </div>
          <Link to="/demand" className="hidden md:flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors group">
            进入需求大厅
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {mockDemands.slice(0, 8).map((demand) => {
            const meta = demandCategoryMeta[demand.category] || demandCategoryMeta['AI短视频']
            return (
              <Link
                to={`/demand/${demand.id}`}
                key={demand.id}
                className={`group relative bg-slate-800/60 backdrop-blur-sm border ${meta.border} rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${meta.glow} hover:bg-slate-800/90`}
              >
                {/* 顶部彩条 */}
                <div className={`h-1 w-full bg-gradient-to-r ${meta.gradient}`}></div>

                <div className="p-3">
                  {/* 分类+状态 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r ${meta.light} border ${meta.border}`}>
                      <span className="text-xs">{meta.icon}</span>
                      <span className={`text-xs font-medium ${meta.text}`}>{demand.category}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs ${demand.urgent ? 'animate-pulse' : ''}`}>
                      {demand.urgent ? '🔥 急需' : '⏰ 招募中'}
                    </span>
                  </div>

                  {/* 标题 */}
                  <h3 className="text-xs font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors leading-tight" style={{ minHeight: '2.5em' }}>
                    {demand.title}
                  </h3>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {demand.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-white/5 text-gray-400 text-xs rounded border border-white/8">{tag}</span>
                    ))}
                  </div>

                  {/* 预算 */}
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-amber-400 text-xs font-bold">¥</span>
                    <span className="text-white text-sm font-semibold">{demand.budget}</span>
                  </div>

                  {/* 分隔线 */}
                  <div className="border-t border-white/5 mb-2"></div>

                  {/* 发布者+投标统计 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <img src={demand.publisherAvatar} alt={demand.publisher} className="w-5 h-5 rounded-full border border-white/10" />
                      <span className="text-gray-500 text-xs truncate max-w-[60px]">{demand.publisher}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {demand.bids}人
                    </div>
                  </div>

                  {/* 投标按钮 */}
                  <button
                    className={`w-full mt-2 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all bg-gradient-to-r ${meta.gradient} text-white opacity-90 hover:opacity-100`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                  >
                    立即投标
                  </button>
                </div>
              </Link>
            )
          })}
        </div>

        {/* 快速发布需求入口 */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link to="/demand" className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition-colors text-sm font-medium">
            查看全部需求 →
          </Link>
          <Link to="/enterprise-demand" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all text-sm font-medium shadow-lg shadow-cyan-500/20">
            + 立即发布需求
          </Link>
        </div>
      </section>

      {/* ===== 版权交易 - 三大板块分开 ===== */}
      <section className="max-w-6xl mx-auto px-4 mb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full mb-3">
              <span className="text-amber-400 text-xs font-medium">🏛️ 资产流通</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              版权<span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> 交易中心</span>
            </h2>
            <p className="text-gray-400 mt-2">数字人、剧本、AI影视版权资产，链上确权流转</p>
          </div>
          <Link to="/copyright" className="hidden md:flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors group">
            进入版权市场
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* AI肖像权板块 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👤</span>
              <h3 className="text-xl font-bold text-white">AI肖像权</h3>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">{portraits.length}个商品</span>
            </div>
            <Link to="/copyright/list/portrait" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              查看更多 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {portraits.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/copyright/detail/${item.id}`)}
                className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-slate-700/50 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10 group"
              >
                {/* 封面 - 1:1正方形 */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.faceCloseup || item.frontView || item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' }}
                  />
                  {/* 渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-30" />
                  {/* 顶部标签 */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-emerald-500/90 backdrop-blur text-white text-xs font-medium rounded-lg shadow-lg">
                      👤 AI演员
                    </span>
                  </div>
                  {/* 价格标签 */}
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-1 bg-emerald-500/90 backdrop-blur text-white text-sm font-bold rounded-lg shadow-lg">
                      ¥{(item.price_cash || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                {/* 信息区域 */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-emerald-300 transition-colors">{item.title}</h3>
                  {/* 作者 */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-slate-600 overflow-hidden">
                      {item.ownerAvatar ? <img src={item.ownerAvatar} alt="" className="w-full h-full object-cover" /> : <span className="text-xs">🏢</span>}
                    </div>
                    <span className="text-slate-400 text-xs truncate">{item.owner || item.author}</span>
                  </div>
                  {/* 类型标签 */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {item.ageRange || item.style}
                    </span>
                  </div>
                  {/* 底部统计和按钮 */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <span className="flex items-center gap-1">👁️ {item.views?.toLocaleString() || 0}</span>
                      {item.rating && <span className="text-amber-400">⭐ {item.rating}</span>}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/copyright/detail/${item.id}`) }}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-medium rounded-lg transition-all"
                    >
                      查看
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 小说剧本板块 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <h3 className="text-xl font-bold text-white">小说剧本</h3>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">{novels.length}个商品</span>
            </div>
            <Link to="/copyright/list/novel" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
              查看更多 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {novels.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/copyright/detail/${item.id}`)}
                className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-slate-700/50 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 group"
              >
                {/* 封面 - 1:1正方形 */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.faceCloseup || item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop' }}
                  />
                  {/* 渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-50" />
                  {/* 书脊效果 */}
                  <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-l from-amber-900/40 to-transparent" />
                  {/* 顶部标签 */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-amber-500/90 backdrop-blur text-white text-xs font-medium rounded-lg shadow-lg">
                      📚 小说
                    </span>
                  </div>
                  {/* 价格标签 */}
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-1 bg-amber-500/90 backdrop-blur text-white text-sm font-bold rounded-lg shadow-lg">
                      ¥{(item.price_cash || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                {/* 信息区域 */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-amber-300 transition-colors">{item.title}</h3>
                  {/* 作者 */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-slate-600 overflow-hidden">
                      {item.ownerAvatar ? <img src={item.ownerAvatar} alt="" className="w-full h-full object-cover" /> : <span className="text-xs">🏢</span>}
                    </div>
                    <span className="text-slate-400 text-xs truncate">{item.owner || item.author}</span>
                  </div>
                  {/* 类型标签 */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30">
                      📝 {item.wordCount ? `${(item.wordCount/10000).toFixed(0)}万字` : '小说'}
                    </span>
                  </div>
                  {/* 底部统计和按钮 */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <span className="flex items-center gap-1">👁️ {item.views?.toLocaleString() || 0}</span>
                      {item.rating && <span className="text-amber-400">⭐ {item.rating}</span>}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/copyright/detail/${item.id}`) }}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-white text-xs font-medium rounded-lg transition-all"
                    >
                      查看
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI影视板块 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎬</span>
              <h3 className="text-xl font-bold text-white">AI影视作品</h3>
              <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 text-xs rounded-full">{films.length}个商品</span>
            </div>
            <Link to="/copyright/list/film" className="text-sm text-pink-400 hover:text-pink-300 transition-colors">
              查看更多 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {films.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/copyright/detail/${item.id}`)}
                className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-slate-700/50 rounded-2xl overflow-hidden cursor-pointer hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-500/10 group"
              >
                {/* 封面 - 1:1正方形 */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.faceCloseup || item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop' }}
                  />
                  {/* 渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-50" />
                  {/* 播放标识 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <span className="text-2xl text-white ml-1">▶</span>
                    </div>
                  </div>
                  {/* 顶部标签 */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-pink-500/90 backdrop-blur text-white text-xs font-medium rounded-lg shadow-lg">
                      🎬 AI影视
                    </span>
                  </div>
                  {/* 价格标签 */}
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-1 bg-pink-500/90 backdrop-blur text-white text-sm font-bold rounded-lg shadow-lg">
                      ¥{(item.price_cash || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                {/* 信息区域 */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-pink-300 transition-colors">{item.title}</h3>
                  {/* 作者 */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-slate-600 overflow-hidden">
                      {item.ownerAvatar ? <img src={item.ownerAvatar} alt="" className="w-full h-full object-cover" /> : <span className="text-xs">🏢</span>}
                    </div>
                    <span className="text-slate-400 text-xs truncate">{item.owner || item.author}</span>
                  </div>
                  {/* 类型标签 */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="bg-pink-500/20 text-pink-300 text-xs px-2 py-0.5 rounded-full border border-pink-500/30">
                      🎬 {item.episodes ? `${item.episodes}集` : 'AI影视'}
                    </span>
                  </div>
                  {/* 底部统计和按钮 */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <span className="flex items-center gap-1">👁️ {item.views?.toLocaleString() || 0}</span>
                      {item.rating && <span className="text-amber-400">⭐ {item.rating}</span>}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/copyright/detail/${item.id}`) }}
                      className="px-3 py-1 bg-pink-500 hover:bg-pink-400 text-white text-xs font-medium rounded-lg transition-all"
                    >
                      查看
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 购买消息提示 */}
        {buyMsg && (
          <div className="mt-6 text-center text-sm text-amber-300 animate-pulse">{buyMsg}</div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link to="/copyright" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/20 transition-colors text-sm font-medium">
            浏览全部版权资产 →
          </Link>
          <Link to="/copyright/sell" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all text-sm font-medium shadow-lg shadow-amber-500/20">
            + 上架我的版权
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
