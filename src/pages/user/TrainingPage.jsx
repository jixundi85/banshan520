import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Rocket, MapPinned, Wifi, Calendar, Clock, Users,
  Star, Award, GraduationCap, ArrowRight, Play, ChevronRight,
  CheckCircle, Users2, TrendingUp, Gift
} from 'lucide-react'
import { unifiedCourses, allCourses } from '../../data/unifiedCourses'
import './TrainingPage.css'

// ======= 课程分类配置 =======
const MAIN_CATEGORIES = {
  creator: {
    id: 'creator',
    name: '创作者课程',
    desc: '适合想要学习AI内容创作的学员',
    gradient: 'from-amber-500 to-orange-500',
    subCategories: [
      { id: 'video', name: 'AI视频', icon: '🎬', color: '#f97316' },
      { id: 'film', name: 'AI广告电影', icon: '🎥', color: '#8b5cf6' },
      { id: 'designer', name: 'AI设计师', icon: '🎨', color: '#a855f7' },
      { id: 'drama', name: 'AI短剧', icon: '🎭', color: '#ec4899' },
      { id: 'mangadrama', name: 'AI漫剧', icon: '📚', color: '#ec4899' },
      { id: 'commerce', name: 'AI带货变现', icon: '💰', color: '#d97706' },
      { id: 'travel', name: 'AI文旅', icon: '✈️', color: '#10b981' },
    ]
  },
  consultant: {
    id: 'consultant',
    name: '咨询专家课程',
    desc: '适合想要成为OPC认证咨询专家的学员',
    gradient: 'from-indigo-500 to-purple-500',
    subCategories: [
      { id: 'strategy', name: '企业战略咨询', icon: '📊', color: '#b45309' },
      { id: 'listing', name: '企业上市咨询', icon: '🌐', color: '#dc2626' },
      { id: 'financing', name: '企业融资咨询', icon: '💰', color: '#7c3aed' },
      { id: 'equity', name: '股权架构咨询', icon: '📈', color: '#0891b2' },
      { id: 'overseas', name: '战略出海咨询', icon: '🚀', color: '#0f766e' },
      { id: 'ai-upgrade', name: 'AI升级转型', icon: '🤖', color: '#6366f1' },
      { id: 'deployment', name: '私有化部署', icon: '🔒', color: '#475569' },
    ]
  }
}

// 分类颜色映射
const CATEGORY_COLORS = {
  video:    { bg: 'from-orange-500 to-red-500',   text: 'text-orange-500',   border: 'border-orange-500/20' },
  film:     { bg: 'from-cyan-500 to-blue-500',    text: 'text-cyan-400',      border: 'border-cyan-500/20' },
  designer: { bg: 'from-violet-500 to-purple-500', text: 'text-violet-400',    border: 'border-violet-500/20' },
  drama:    { bg: 'from-pink-500 to-rose-500',     text: 'text-pink-400',     border: 'border-pink-500/20' },
  travel:   { bg: 'from-emerald-500 to-teal-500', text: 'text-emerald-400',  border: 'border-emerald-500/20' },
  mangadrama: { bg: 'from-pink-500 to-rose-500',  text: 'text-pink-400',     border: 'border-pink-500/20' },
  commerce:   { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  strategy:       { bg: 'from-amber-500 to-orange-500', text: 'text-amber-500',  border: 'border-amber-500/20' },
  listing:        { bg: 'from-red-500 to-rose-500',    text: 'text-red-400',    border: 'border-red-500/20' },
  financing:      { bg: 'from-violet-500 to-purple-500',text: 'text-violet-400', border: 'border-violet-500/20' },
  equity:         { bg: 'from-cyan-500 to-blue-500',   text: 'text-cyan-400',   border: 'border-cyan-500/20' },
  overseas:       { bg: 'from-teal-500 to-emerald-500',text: 'text-teal-400',   border: 'border-teal-500/20' },
  'ai-upgrade':   { bg: 'from-indigo-500 to-violet-500',text: 'text-indigo-400',border: 'border-indigo-500/20' },
  deployment:     { bg: 'from-slate-500 to-gray-500',  text: 'text-slate-400',  border: 'border-slate-500/20' },
}

// ======= 创作者实战课程数据 =======

// ======= 特训营数据 =======
const OFFLINE_CAMPS = [
  {
    id: 'offline-1',
    title: 'AIGC短视频实战特训营',
    subtitle: '3天2夜现场集训',
    description: '三天两夜高强度实战训练，导师面对面指导，完成商业级AI短视频作品',
    location: '深圳·南山科技园',
    date: '2026年5月15-17日',
    price: 9999,
    originalPrice: 19999,
    spots: 30,
    enrolled: 18,
    features: ['导师面授', '现场实操', '作品点评', '结业证书'],
    highlight: '前10名报名立减2000元',
    gradient: 'from-orange-500 to-red-600',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop'
  },
  {
    id: 'offline-2',
    title: 'AI广告电影制作特训营',
    subtitle: '5天4夜影视级特训',
    description: '五天四夜沉浸式学习，从创意到成片，产出专业级AI广告电影作品',
    location: '杭州·西湖区',
    date: '2026年6月20-24日',
    price: 25999,
    originalPrice: 39999,
    spots: 20,
    enrolled: 8,
    features: ['导演指导', '专业设备', '项目实战', '就业推荐'],
    highlight: '含2个月后期指导',
    gradient: 'from-purple-500 to-pink-600',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=500&fit=crop'
  },
  {
    id: 'offline-3',
    title: 'AI短剧创作特训营',
    subtitle: '4天3夜编剧实战',
    description: '四天三夜编剧与拍摄实战，完整体验AI短剧从创意到上线的全流程',
    location: '北京·朝阳CBD',
    date: '2026年5月28-31日',
    price: 15999,
    originalPrice: 29999,
    spots: 25,
    enrolled: 12,
    features: ['剧本打磨', 'AI分镜', '后期制作', '变现指导'],
    highlight: '优秀作品直接签约',
    gradient: 'from-pink-500 to-rose-600',
    coverImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=500&fit=crop'
  }
]

const ONLINE_CAMPS = [
  {
    id: 'online-1',
    title: 'AIGC实战直播特训营',
    subtitle: '每周直播+答疑',
    description: '8周在线直播特训，AI工具实战应用，导师每周直播答疑，作业点评',
    startDate: '随时开课',
    duration: '8周',
    price: 3999,
    originalPrice: 7999,
    enrolled: 856,
    features: ['直播授课', '作业点评', '答疑社群', '永久回放'],
    gradient: 'from-blue-500 to-cyan-600',
    coverImage: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=500&fit=crop'
  },
  {
    id: 'online-2',
    title: 'AI短视频矩阵特训营',
    subtitle: '30天打造爆款账号',
    description: '30天AI短视频创作特训，涵盖选题、脚本、生成、剪辑、发布全流程',
    startDate: '滚动开班',
    duration: '30天',
    price: 2999,
    originalPrice: 5999,
    enrolled: 1289,
    features: ['AI脚本', '批量生成', '矩阵运营', '资源对接'],
    gradient: 'from-emerald-500 to-teal-600',
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop'
  },
  {
    id: 'online-3',
    title: 'AI设计商业变现特训营',
    subtitle: '副业变现全攻略',
    description: '8周AI设计特训，从技能学习到商业变现，接单技巧与客户运营',
    startDate: '预约报名',
    duration: '8周',
    price: 2499,
    originalPrice: 4999,
    enrolled: 654,
    features: ['设计技能', '接单技巧', '客户运营', '持续更新'],
    gradient: 'from-violet-500 to-purple-600',
    coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=500&fit=crop'
  }
]

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState('courses')
  const [activeCategory, setActiveCategory] = useState('creator')
  const [activeSubCategory, setActiveSubCategory] = useState(null)
  const [campTab, setCampTab] = useState('offline')

  // 过滤课程（使用完整合并数据集）
  const filteredCourses = activeSubCategory
    ? allCourses.filter(c => c.category === activeSubCategory)
    : allCourses

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* 顶部 Hero 区域 */}
      <div className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 pt-12 pb-16">
          {/* 标签 */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full backdrop-blur-sm">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium tracking-wide">OPC特训中心</span>
            </div>
          </div>
          
          {/* 标题 */}
          <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              AIGC 创作者学院
            </span>
          </h1>
          <p className="text-center text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            从入门到精通，系统化学习 AI 内容创作，开启你的 AIGC 创作者之路
          </p>
          
          {/* 快捷入口 */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: BookOpen, text: '在线课程', color: 'amber' },
              { icon: Rocket, text: '特训营', color: 'purple' },
              { icon: Award, text: '认证专家', color: 'blue' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-2 px-4 py-2 bg-${item.color}-500/10 border border-${item.color}-500/20 rounded-full`}>
                <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                <span className={`text-${item.color}-400 text-sm`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 pb-16 -mt-4">
        
        {/* 主 Tab 切换 - 胶囊式 */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl">
            <button
              onClick={() => setActiveTab('courses')}
              className={`relative px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'courses' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {activeTab === 'courses' && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/25" />
              )}
              <span className="relative flex items-center gap-2.5">
                <BookOpen className="w-5 h-5" />
                AIGC 实战课程
              </span>
            </button>
            <button
              onClick={() => setActiveTab('camps')}
              className={`relative px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'camps' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {activeTab === 'camps' && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/25" />
              )}
              <span className="relative flex items-center gap-2.5">
                <Rocket className="w-5 h-5" />
                AIGC 特训营
              </span>
            </button>
          </div>
        </div>

        {/* ===== 实战课程 ===== */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            {/* 分类导航 */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                {/* 当前分类 */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${MAIN_CATEGORIES[activeCategory].gradient} flex items-center justify-center shadow-lg`}>
                    {activeCategory === 'creator' ? <BookOpen className="w-7 h-7 text-white" /> : <Award className="w-7 h-7 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{MAIN_CATEGORIES[activeCategory].name}</h2>
                    <p className="text-slate-500 text-sm">{MAIN_CATEGORIES[activeCategory].desc}</p>
                  </div>
                </div>
                
                {/* 分类切换按钮 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveCategory('creator')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeCategory === 'creator'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    创作者课程
                  </button>
                  <button
                    onClick={() => setActiveCategory('consultant')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeCategory === 'consultant'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    咨询专家课程
                  </button>
                </div>
              </div>
              
              {/* 子分类标签 */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveSubCategory(null)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeSubCategory === null
                      ? 'bg-white text-slate-900 shadow-lg'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  全部
                </button>
                {MAIN_CATEGORIES[activeCategory].subCategories.map((sub) => {
                  const colors = CATEGORY_COLORS[sub.id] || { bg: 'from-gray-500 to-gray-600', text: 'text-gray-400', border: 'border-gray-500/20' }
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubCategory(sub.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeSubCategory === sub.id
                          ? `bg-gradient-to-r ${colors.bg} text-white shadow-lg`
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{sub.icon}</span>
                      <span>{sub.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 课程网格 - 2x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course, index) => (
                <Link
                  key={course.id}
                  to={`/training/course/${course.id}`}
                  className="group block bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* 封面 */}
                    <div className="relative sm:w-48 aspect-video sm:aspect-auto overflow-hidden">
                      <img 
                        src={course.coverImage} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/80" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-xs font-medium text-white">
                        {course.categoryName}
                      </div>
                      {course.featured && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 rounded-lg text-xs font-bold text-white shadow-lg">
                          ⭐ 精品
                        </div>
                      )}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 p-5 flex flex-col">
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-1">{course.subtitle}</p>

                      {/* 讲师 */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                          {course.teacher.avatar}
                        </div>
                        <span className="text-slate-400 text-sm">{course.teacher.name}</span>
                      </div>

                      {/* 统计 */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {course.students.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" /> {course.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {course.duration}
                        </span>
                      </div>

                      {/* 价格和按钮 */}
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-white">¥{course.price}</span>
                          <span className="text-slate-500 line-through text-sm ml-2">¥{course.originalPrice}</span>
                        </div>
                        <span className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-amber-500/20">
                          立即购买
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 新人福利 */}
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 rounded-3xl p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/20">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white text-xl font-bold mb-1">新人专享福利</h4>
                    <p className="text-slate-400">积分购买享折扣 · 免费试看第一节 · 永久回放学习</p>
                  </div>
                </div>
                <Link
                  to="/awakening"
                  className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-2xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-xl shadow-amber-500/20 whitespace-nowrap"
                >
                  领取福利
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ===== 特训营 ===== */}
        {activeTab === 'camps' && (
          <div className="space-y-8">
            {/* 特训营介绍 */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 border border-purple-500/20 rounded-3xl p-8 text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-purple-500/20 to-transparent rounded-full blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/20 rounded-full mb-4">
                  <Rocket className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-xs font-medium">高强度 · 高效率 · 高回报</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">AIGC 特训营</h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                  线下集训 + 线上直播，沉浸式学习环境，导师全程陪跑指导，快速提升实战能力
                </p>
              </div>
            </div>

            {/* 线下/线上切换 */}
            <div className="flex justify-center">
              <div className="inline-flex p-1.5 bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl">
                <button
                  onClick={() => setCampTab('offline')}
                  className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                    campTab === 'offline' ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {campTab === 'offline' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20" />
                  )}
                  <span className="relative flex items-center gap-2">
                    <MapPinned className="w-4 h-4" />
                    线下特训
                  </span>
                </button>
                <button
                  onClick={() => setCampTab('online')}
                  className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                    campTab === 'online' ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {campTab === 'online' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/20" />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    线上特训
                  </span>
                </button>
              </div>
            </div>

            {/* 线下特训 */}
            {campTab === 'offline' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {OFFLINE_CAMPS.map((camp, index) => (
                  <Link
                    key={camp.id}
                    to={`/training/camp/${camp.id}`}
                    className="group relative bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1"
                  >
                    {/* 序号装饰 */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-slate-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center text-slate-600 font-bold text-xl group-hover:text-orange-400 transition-colors z-10">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    
                    {/* 封面 */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={camp.coverImage} 
                        alt={camp.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                      <div className={`absolute bottom-4 left-4 px-3 py-1.5 bg-gradient-to-r ${camp.gradient} rounded-xl text-sm font-semibold text-white shadow-lg`}>
                        {camp.subtitle}
                      </div>
                    </div>

                    {/* 内容 */}
                    <div className="p-6">
                      <h3 className="text-white font-bold text-xl mb-2 group-hover:text-orange-400 transition-colors">
                        {camp.title}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{camp.description}</p>

                      {/* 信息 */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar size={14} className="text-orange-400" />
                          <span>{camp.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <MapPinned size={14} className="text-orange-400" />
                          <span>{camp.location}</span>
                        </div>
                      </div>

                      {/* 特点 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {camp.features.map(f => (
                          <span key={f} className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs rounded-lg">
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* 亮点 */}
                      {camp.highlight && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 mb-4">
                          <p className="text-amber-400 text-sm font-medium">🔥 {camp.highlight}</p>
                        </div>
                      )}

                      {/* 进度条 */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                          <span>报名进度</span>
                          <span>{camp.enrolled}/{camp.spots}人 · 剩{camp.spots - camp.enrolled}名</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                            style={{ width: `${(camp.enrolled / camp.spots) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* 价格和按钮 */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div>
                          <span className="text-2xl font-bold text-white">¥{camp.price.toLocaleString()}</span>
                          <span className="text-slate-500 line-through text-sm ml-2">¥{camp.originalPrice.toLocaleString()}</span>
                        </div>
                        <span className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/20">
                          立即报名
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* 线上特训 */}
            {campTab === 'online' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {ONLINE_CAMPS.map((camp, index) => (
                  <Link
                    key={camp.id}
                    to={`/training/camp/${camp.id}`}
                    className="group relative bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1"
                  >
                    {/* 序号装饰 */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-slate-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center text-slate-600 font-bold text-xl group-hover:text-blue-400 transition-colors z-10">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    
                    {/* 封面 */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={camp.coverImage} 
                        alt={camp.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                      <div className={`absolute bottom-4 left-4 px-3 py-1.5 bg-gradient-to-r ${camp.gradient} rounded-xl text-sm font-semibold text-white shadow-lg`}>
                        {camp.subtitle}
                      </div>
                      <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-lg text-xs font-medium text-white">
                        {camp.enrolled}人已报名
                      </div>
                    </div>

                    {/* 内容 */}
                    <div className="p-6">
                      <h3 className="text-white font-bold text-xl mb-2 group-hover:text-blue-400 transition-colors">
                        {camp.title}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{camp.description}</p>

                      {/* 信息 */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar size={14} className="text-blue-400" />
                          <span>{camp.startDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock size={14} className="text-blue-400" />
                          <span>周期：{camp.duration}</span>
                        </div>
                      </div>

                      {/* 特点 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {camp.features.map(f => (
                          <span key={f} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg">
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* 价格和按钮 */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div>
                          <span className="text-2xl font-bold text-white">¥{camp.price.toLocaleString()}</span>
                          <span className="text-slate-500 line-through text-sm ml-2">¥{camp.originalPrice.toLocaleString()}</span>
                        </div>
                        <span className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20">
                          立即报名
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* 特训营优势 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users2, title: '导师陪跑', desc: '全程指导答疑', gradient: 'from-amber-500 to-orange-500' },
                { icon: Award, title: '权威认证', desc: '颁发结业证书', gradient: 'from-purple-500 to-pink-500' },
                { icon: Rocket, title: '实战项目', desc: '真实项目驱动', gradient: 'from-blue-500 to-cyan-500' },
                { icon: TrendingUp, title: '资源对接', desc: '行业人脉拓展', gradient: 'from-emerald-500 to-teal-500' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 text-center hover:border-white/10 transition-all group">
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
