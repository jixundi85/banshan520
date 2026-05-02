import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, Plus, Send, Heart, Eye, Loader2, Check, Search, Filter, ChevronDown,
  Target, Users, Star, Briefcase, Zap, Award, Building2, ChevronRight,
  ArrowRight, FileText, CheckCircle, Clock, DollarSign, Calendar,
  Edit3, Trash2, Eye as EyeIcon, MoreVertical, Brain, Shield
} from 'lucide-react'
import { CATEGORY_META, STATUS_META, budgetRanges, formatTimeAgo } from '../../data/demandData.js'
import { getDemands, createDemand, toggleCollect } from '../../services/demandService.js'

// ─── 玻璃卡片组件 ────────────────────────────────────────────
function GlassCard({ children, className = '' }) {
  return (
    <div className={`bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl ${className}`}>
      {children}
    </div>
  )
}

// ─── 发布需求表单组件 ────────────────────────────────────────
function PublishDemandForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    desc: '',
    catId: 'shortvideo',
    budget: '',
    deadline: '7天内',
    requirements: '',
    contact: '',
    company: '',
    urgent: false
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const categories = [
    { id: 'shortvideo', name: '短视频', icon: '🎬' },
    { id: 'shortdrama', name: 'AI短剧', icon: '🎭' },
    { id: 'mangadrama', name: 'AI漫剧', icon: '📚' },
    { id: 'film', name: 'AI电影', icon: '🎥' },
    { id: 'designer', name: 'AI设计', icon: '🎨' },
    { id: 'commerce', name: 'AI带货', icon: '💰' }
  ]

  const deadlines = ['3天内', '5天内', '7天内', '10天内', '15天内', '20天内', '30天内']

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = '请输入需求标题'
    if (!form.desc.trim()) errs.desc = '请输入需求描述'
    if (!form.budget.trim()) errs.budget = '请输入预算'
    if (!form.contact.trim()) errs.contact = '请输入联系方式'
    if (!form.company.trim()) errs.company = '请输入公司名称'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    setSubmitting(true)
    
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const newDemand = {
      title: form.title,
      description: form.desc,
      category: form.catId,
      budget: parseInt(form.budget),
      budget_min: parseInt(form.budget),
      budget_max: parseInt(form.budget),
      deadline: form.deadline,
      requirements: form.requirements.split('\n').filter(Boolean),
      contact: form.contact,
      company: form.company,
      is_urgent: form.urgent,
      publisher_id: user.id || 'enterprise',
      publisher_name: user.name || '企业用户',
      publisher_avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Enterprise'
    }
    
    try {
      // 调用真实API
      await createDemand(newDemand)
    } catch (err) {
      console.error('保存失败:', err)
    }
    
    setSubmitting(false)
    setSuccess(true)
    setTimeout(() => {
      onSuccess({ ...newDemand, id: Date.now() })
    }, 1500)
  }

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative w-full max-w-lg bg-slate-800 border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">需求发布成功！</h2>
          <p className="text-gray-400 mb-6">您的需求已发布，等待OPC创作者投标</p>
          <button 
            onClick={() => onSuccess(newDemand)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all"
          >
            查看我的需求
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-slate-800 border border-white/10 rounded-2xl shadow-2xl mt-8 mb-8">
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl"></div>
        
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-400" />
            发布新需求
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 需求标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              需求标题 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              placeholder="例如：品牌宣传片制作、AI短剧定制"
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 ${errors.title ? 'border-red-500' : 'border-white/10'}`}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* 需求分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">需求类型</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateForm('catId', cat.id)}
                  className={`p-3 rounded-xl border text-sm transition-all flex items-center gap-2 ${
                    form.catId === cat.id
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 预算和截止时间 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                预算（元）<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  value={form.budget}
                  onChange={(e) => updateForm('budget', e.target.value)}
                  placeholder="5000"
                  className={`w-full pl-8 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 ${errors.budget ? 'border-red-500' : 'border-white/10'}`}
                />
              </div>
              {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">截止时间</label>
              <select
                value={form.deadline}
                onChange={(e) => updateForm('deadline', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
              >
                {deadlines.map(d => <option key={d} value={d} className="bg-slate-800">{d}</option>)}
              </select>
            </div>
          </div>

          {/* 公司信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                公司名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => updateForm('company', e.target.value)}
                placeholder="您的公司名称"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 ${errors.company ? 'border-red-500' : 'border-white/10'}`}
              />
              {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                联系方式 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => updateForm('contact', e.target.value)}
                placeholder="微信/手机/邮箱"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 ${errors.contact ? 'border-red-500' : 'border-white/10'}`}
              />
              {errors.contact && <p className="text-red-400 text-xs mt-1">{errors.contact}</p>}
            </div>
          </div>

          {/* 需求描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              需求描述 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.desc}
              onChange={(e) => updateForm('desc', e.target.value)}
              rows={4}
              placeholder="详细描述您的需求，包括目标、风格偏好、交付要求等..."
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 resize-none ${errors.desc ? 'border-red-500' : 'border-white/10'}`}
            />
            {errors.desc && <p className="text-red-400 text-xs mt-1">{errors.desc}</p>}
          </div>

          {/* 具体要求 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">具体要求（可选）</label>
            <textarea
              value={form.requirements}
              onChange={(e) => updateForm('requirements', e.target.value)}
              rows={3}
              placeholder="每行一条要求，例如：\n有相关项目经验\n可提供作品案例\n支持快速响应"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 resize-none"
            />
          </div>

          {/* 紧急需求 */}
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <input
              type="checkbox"
              id="urgent"
              checked={form.urgent}
              onChange={(e) => updateForm('urgent', e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="urgent" className="text-gray-300 cursor-pointer">
              <span className="font-medium">紧急需求</span>
              <span className="text-gray-500 text-sm ml-2">标记后将在列表中优先展示</span>
            </label>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  发布中...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  立即发布
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── 需求卡片组件 ────────────────────────────────────────────
function DemandCard({ demand, onDetail, onBid, onCollect, matchScore }) {
  const cat = CATEGORY_META[demand.catId] || CATEGORY_META.shortvideo
  const st  = STATUS_META[demand.status] || STATUS_META.pending
  const timeAgo = demand.publishTime ? formatTimeAgo(demand.publishTime) : demand.createdAt

  const getMatchColor = (level) => {
    switch(level) {
      case 'high': return 'from-emerald-500 to-emerald-400'
      case 'medium': return 'from-amber-500 to-amber-400'
      default: return 'from-gray-500 to-gray-400'
    }
  }

  return (
    <div
      className={`group relative bg-slate-800/60 backdrop-blur-sm border ${cat.border} rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:${cat.glow} hover:bg-slate-800/90`}
      onClick={() => onDetail(demand)}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${cat.gradient}`}></div>
      
      {matchScore && (
        <div className="absolute top-2 left-2 z-10">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${getMatchColor(matchScore.level)} shadow-lg`}>
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white text-xs font-bold">{matchScore.score}% 匹配</span>
          </div>
        </div>
      )}

      {demand.coverImage && (
        <div className="relative h-32 overflow-hidden">
          <img 
            src={demand.coverImage} 
            alt={demand.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-800/80 to-transparent"></div>
          <div className="absolute top-2 right-2">
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${st.bg} border ${st.border} backdrop-blur-sm`}>
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
              <span className={`text-xs ${st.text}`}>{st.label}</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r ${cat.light} border ${cat.border}`}>
            <span className="text-sm">{cat.icon}</span>
            <span className={`text-xs font-medium ${cat.text}`}>{cat.name}</span>
          </div>
          {demand.urgent && <span className="text-red-400 text-xs">🔥 紧急</span>}
        </div>

        <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-snug">
          {demand.title}
        </h3>

        <div className="flex flex-wrap gap-1 mb-3">
          {Array.isArray(demand.tags) && demand.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-white/5 text-gray-400 text-xs rounded border border-white/8">{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-gray-500 text-xs">¥</span>
            <span className="text-white text-base font-bold">{typeof demand.budget === 'number' ? demand.budget.toLocaleString() : demand.budget}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Clock className="w-3 h-3 text-blue-400" />
            {demand.deadline}
          </div>
        </div>

        <div className="border-t border-white/5 mb-3"></div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src={demand.publisherAvatar} alt={demand.publisher} className="w-6 h-6 rounded-full border border-white/10" />
            <div className="flex flex-col">
              <span className="text-gray-300 text-xs truncate max-w-[80px]">{demand.publisher}</span>
            </div>
          </div>
          <span className="text-gray-500 text-xs">{timeAgo}</span>
        </div>

        <div className="flex items-center gap-4 mb-3 text-gray-500 text-xs">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {demand.views}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {demand.likes || 0}人投标
          </span>
        </div>

        <div className="flex gap-2">
          <button
            className={`flex items-center justify-center gap-1 w-9 h-9 rounded-xl border transition-all flex-shrink-0 ${
              demand.collected
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : 'bg-white/5 border-white/10 text-gray-500 hover:text-red-400 hover:border-red-500/40'
            }`}
            onClick={(e) => { e.stopPropagation(); onCollect(demand) }}
          >
            <Heart className={`w-4 h-4 ${demand.collected ? 'fill-current' : ''}`} />
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all bg-gradient-to-r ${cat.gradient} text-white opacity-90 hover:opacity-100 shadow-lg`}
            disabled={demand.status === 'completed'}
            onClick={(e) => { e.stopPropagation(); onBid(demand) }}
          >
            <Send className="w-3.5 h-3.5" />
            立即投标
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── 我的需求卡片 ────────────────────────────────────────────
function MyDemandCard({ demand, onView, onEdit, onDelete }) {
  const statusConfig = {
    pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: '待接单' },
    matching: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: '匹配中' },
    progress: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: '进行中' },
    completed: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', label: '已完成' }
  }
  const st = statusConfig[demand.status] || statusConfig.pending

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-5 hover:border-amber-500/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-medium line-clamp-1">{demand.title}</h3>
            <span className={`px-2 py-0.5 rounded text-xs ${st.bg} ${st.text} border ${st.border}`}>
              {st.label}
            </span>
            {demand.urgent && <span className="text-red-400 text-xs">🔥 紧急</span>}
          </div>
          <p className="text-gray-500 text-sm line-clamp-2">{demand.desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span className="text-white font-medium">¥{demand.budget?.toLocaleString()}</span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-blue-400" />
          {demand.deadline}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4 text-purple-400" />
          {demand.likes || 0} 个投标
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-gray-600 text-xs">
          发布于 {new Date(demand.publishTime || demand.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onView(demand)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="查看详情"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onEdit(demand)}
            className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
            title="编辑"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(demand)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── 我的投标卡片 ────────────────────────────────────────────
function MyBidCard({ bid, onView }) {
  const statusConfig = {
    pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: '待选择' },
    accepted: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: '已中标' },
    rejected: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: '未选中' }
  }
  const st = statusConfig[bid.status] || statusConfig.pending

  return (
    <div 
      className="bg-slate-800/60 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all cursor-pointer"
      onClick={() => onView(bid)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs ${st.bg} ${st.text}`}>
              {st.label}
            </span>
            <span className="text-gray-600 text-xs">
              投于 {new Date(bid.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-white font-medium line-clamp-1">
            {bid.demandTitle || '需求 #' + bid.demandId}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 text-sm">
        <span className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span className="text-white font-bold">¥{bid.price?.toLocaleString()}</span>
        </span>
        <span className="flex items-center gap-1 text-gray-500">
          <Calendar className="w-4 h-4" />
          {bid.days}天
        </span>
      </div>

      {bid.proposal && (
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{bid.proposal}</p>
      )}

      <div className="flex items-center justify-end">
        <span className="text-purple-400 text-sm flex items-center gap-1">
          查看详情 <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  )
}

// ─── 投标表单 ────────────────────────────────────────────────
function BidForm({ demand, onClose, onSuccess }) {
  const [bid, setBid] = useState({ 
    price: '', days: '', proposal: '', productionPlan: '', 
    creativeConcept: '', deliveryCycle: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const isDesign = ['designer', 'mangadrama'].includes(demand?.catId)

  const validate = () => {
    const errs = {}
    if (!bid.price.trim()) errs.price = '请输入报价'
    if (!bid.days.trim()) errs.days = '请输入工期'
    if (isDesign && !bid.proposal.trim()) errs.proposal = '请输入设计方案说明'
    if (!isDesign && !bid.productionPlan.trim()) errs.productionPlan = '请输入制作方案'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const bidRecord = {
      id: Date.now(),
      demandId: demand.id,
      demandTitle: demand.title,
      creatorId: user.id || 'creator',
      creatorName: user.name || '创作者',
      creatorAvatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator',
      price: bid.price,
      days: bid.days,
      proposal: bid.proposal,
      productionPlan: bid.productionPlan,
      creativeConcept: bid.creativeConcept,
      deliveryCycle: bid.deliveryCycle,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    try {
      const existing = JSON.parse(localStorage.getItem('bidRecords') || '[]')
      existing.unshift(bidRecord)
      localStorage.setItem('bidRecords', JSON.stringify(existing))
      
      const myBids = JSON.parse(localStorage.getItem('unified_my_bids') || '[]')
      myBids.unshift(bidRecord)
      localStorage.setItem('unified_my_bids', JSON.stringify(myBids))
    } catch (err) {
      console.error('保存失败:', err)
    }
    
    setSubmitting(false)
    setSuccess(true)
    setTimeout(() => onSuccess(), 1500)
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div className="relative bg-slate-800 border border-white/10 rounded-2xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">投标成功！</h3>
          <p className="text-gray-400">等待需求方审核，请保持联系方式畅通</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-slate-800 border border-white/10 rounded-2xl shadow-2xl mt-8 mb-8">
        <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl"></div>
        
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-purple-400" />
            投标报价
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">您的报价 *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input type="number" value={bid.price} onChange={e => setBid({...bid, price: e.target.value})}
                  className={`w-full pl-7 pr-3 py-2.5 bg-white/5 border rounded-xl text-white ${errors.price ? 'border-red-500' : 'border-white/10'}`} />
              </div>
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">预计工期 *</label>
              <div className="relative">
                <input type="number" value={bid.days} onChange={e => setBid({...bid, days: e.target.value})}
                  className={`w-full pl-3 pr-9 py-2.5 bg-white/5 border rounded-xl text-white ${errors.days ? 'border-red-500' : 'border-white/10'}`} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">天</span>
              </div>
              {errors.days && <p className="text-red-400 text-xs mt-1">{errors.days}</p>}
            </div>
          </div>

          {isDesign ? (
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">设计方案说明 *</label>
              <textarea value={bid.proposal} onChange={e => setBid({...bid, proposal: e.target.value})} rows={3}
                placeholder="详细描述您的设计理念..."
                className={`w-full px-3 py-2.5 bg-white/5 border rounded-xl text-white resize-none ${errors.proposal ? 'border-red-500' : 'border-white/10'}`} />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">制作方案 *</label>
                <textarea value={bid.productionPlan} onChange={e => setBid({...bid, productionPlan: e.target.value})} rows={2}
                  placeholder="描述视频制作方案..."
                  className={`w-full px-3 py-2.5 bg-white/5 border rounded-xl text-white resize-none ${errors.productionPlan ? 'border-red-500' : 'border-white/10'}`} />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">创意说明</label>
                <textarea value={bid.creativeConcept} onChange={e => setBid({...bid, creativeConcept: e.target.value})} rows={2}
                  placeholder="阐述创意亮点..."
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white resize-none" />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl">
              取消
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? '提交中...' : '提交投标'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── 权限提示弹窗 ────────────────────────────────────────────
function AuthModal({ type, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-slate-800 border border-white/10 rounded-2xl shadow-2xl p-6 text-center">
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500 absolute top-0 left-0 rounded-t-2xl"></div>
        
        {type === 'login' && (
          <>
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">请先登录</h3>
            <p className="text-gray-400 mb-6">登录后即可投标和发布需求</p>
            <button onClick={() => window.location.href = '/login'} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold">
              去登录
            </button>
          </>
        )}
        
        {type === 'creator' && (
          <>
            <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎨</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">成为创作者</h3>
            <p className="text-gray-400 mb-6">完成创作者认证后才能投标接单</p>
            <button onClick={() => window.location.href = '/opc-assessment'} className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-bold">
              去认证
            </button>
          </>
        )}
        
        {type === 'certified' && (
          <>
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⏳</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">等待认证审核</h3>
            <p className="text-gray-400 mb-6">您的认证申请正在审核中</p>
            <button onClick={onClose} className="w-full py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl">
              我知道了
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── 主页面组件 ──────────────────────────────────────────────
export default function DemandPage() {
  const navigate = useNavigate()
  
  // 核心状态
  const [activeTab, setActiveTab] = useState('market') // market | my-demands | my-bids
  const [demands, setDemands] = useState([])
  const [myDemands, setMyDemands] = useState([])
  const [myBids, setMyBids] = useState([])
  
  // 筛选状态
  const [activeCat, setActiveCat] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [activeBudget, setActiveBudget] = useState('all')
  const [activeSort, setActiveSort] = useState('match')
  const [searchText, setSearchText] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 12

  // 用户状态
  const [user, setUser] = useState(null)
  const [isCreator, setIsCreator] = useState(false)
  const [creatorCertified, setCreatorCertified] = useState(false)
  const [creatorProfile, setCreatorProfile] = useState(null)

  // 弹窗状态
  const [showPublishForm, setShowPublishForm] = useState(false)
  const [showBidForm, setShowBidForm] = useState(null) // 当前投标的需求
  const [showDetail, setShowDetail] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalType, setAuthModalType] = useState('login')

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      // 用户信息
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      const creatorProfileData = localStorage.getItem('creatorProfile')
      const certification = localStorage.getItem('creatorCertification')
      
      if (token && userStr) {
        setUser(JSON.parse(userStr))
      }
      if (creatorProfileData) {
        setIsCreator(true)
        setCreatorProfile(JSON.parse(creatorProfileData))
        if (certification) {
          const cert = JSON.parse(certification)
          if (cert.status === 'approved') setCreatorCertified(true)
        }
      }

      // 从后端API加载需求数据
      try {
        const data = await getDemands({ limit: 100 })
        if (data.items && data.items.length > 0) {
          setDemands(data.items)
        } else {
          // 如果API返回空，使用本地默认数据
          setDemands(DEFAULT_DEMANDS)
        }
      } catch (err) {
        console.error('加载需求数据失败:', err)
        // API失败时使用本地默认数据
        setDemands(DEFAULT_DEMANDS)
      }

      // 加载我的需求
      try {
        const myD = JSON.parse(localStorage.getItem('unified_my_demands') || '[]')
        setMyDemands(myD)
      } catch {
        setMyDemands([])
      }

      // 加载我的投标
      try {
        const myB = JSON.parse(localStorage.getItem('unified_my_bids') || '[]')
        setMyBids(myB)
      } catch {
        setMyBids([])
      }
    }

    loadData()
    
    // 监听 storage 变化
    const handleStorage = () => loadData()
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // 匹配度计算
  const calculateMatchScore = (demand) => {
    if (!creatorProfile) return null
    let score = 50
    const reasons = []
    
    const demandSkills = demand.tags || []
    const creatorSkills = creatorProfile.skills || []
    const matched = demandSkills.filter(tag => 
      creatorSkills.some(s => s.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(s.toLowerCase()))
    )
    if (matched.length > 0) {
      score += Math.min(30, matched.length * 10)
      reasons.push(`匹配${matched.length}项技能`)
    }
    
    return {
      score: Math.min(100, score),
      reasons: reasons.slice(0, 3),
      level: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low'
    }
  }

  // 筛选需求
  const filteredDemands = demands.filter(d => {
    if (activeCat !== 'all' && d.catId !== activeCat) return false
    if (activeStatus !== 'all' && d.status !== activeStatus) return false
    if (activeBudget !== 'all') {
      const r = budgetRanges.find(b => b.id === activeBudget)
      if (r && (d.budgetMin < r.min || d.budgetMin > r.max)) return false
    }
    if (searchText) {
      const kw = searchText.toLowerCase()
      if (!d.title.toLowerCase().includes(kw) && !d.desc?.toLowerCase().includes(kw)) return false
    }
    return true
  })

  // 排序
  const sortedDemands = [...filteredDemands].sort((a, b) => {
    switch (activeSort) {
      case 'match':
        if (a.matchScore && b.matchScore) return b.matchScore.score - a.matchScore.score
        return 0
      case 'latest':
        return new Date(b.publishTime || b.createdAt) - new Date(a.publishTime || a.createdAt)
      case 'budget':
        return (b.budget || 0) - (a.budget || 0)
      case 'urgent':
        if (a.urgent && !b.urgent) return -1
        if (!a.urgent && b.urgent) return 1
        return 0
      default:
        return 0
    }
  })

  const demandsWithMatch = sortedDemands.map(d => ({
    ...d,
    matchScore: creatorProfile ? calculateMatchScore(d) : null
  }))

  const paginatedDemands = demandsWithMatch.slice(0, page * PAGE_SIZE)
  const hasMore = paginatedDemands.length < sortedDemands.length

  // 分类统计
  const catStats = Object.values(CATEGORY_META).map(c => ({
    ...c, count: demands.filter(d => d.catId === c.id).length
  }))

  // 权限检查
  const checkPermission = (action) => {
    if (!user) {
      setAuthModalType('login')
      setShowAuthModal(true)
      return false
    }
    if (action === 'bid') {
      if (!isCreator) {
        setAuthModalType('creator')
        setShowAuthModal(true)
        return false
      }
      if (!creatorCertified) {
        setAuthModalType('certified')
        setShowAuthModal(true)
        return false
      }
    }
    return true
  }

  // 处理收藏
  const handleCollect = (demand) => {
    if (!checkPermission()) return
    setDemands(prev => prev.map(d =>
      d.id === demand.id ? { ...d, collected: !d.collected, likes: d.collected ? d.likes - 1 : d.likes + 1 } : d
    ))
  }

  // 发布成功回调
  const handlePublishSuccess = (newDemand) => {
    setShowPublishForm(false)
    setMyDemands(prev => [newDemand, ...prev])
    setActiveTab('my-demands')
  }

  // 删除我的需求
  const handleDeleteDemand = (demand) => {
    if (!confirm('确定删除这个需求吗？')) return
    
    try {
      // 从统一数据删除
      const unified = JSON.parse(localStorage.getItem('unified_demands') || '[]')
      const filtered = unified.filter(d => d.id !== demand.id)
      localStorage.setItem('unified_demands', JSON.stringify(filtered))
      
      // 从我的需求删除
      const myD = JSON.parse(localStorage.getItem('unified_my_demands') || '[]')
      const myFiltered = myD.filter(d => d.id !== demand.id)
      localStorage.setItem('unified_my_demands', JSON.stringify(myFiltered))
      
      setMyDemands(myFiltered)
      
      // 更新广场数据
      setDemands(prev => prev.filter(d => d.id !== demand.id))
    } catch (err) {
      console.error('删除失败:', err)
    }
  }

  // 查看需求详情
  const handleViewDemand = (demand) => {
    navigate(`/demand/${demand.id}`)
  }

  // 投标
  const handleBid = (demand) => {
    if (!checkPermission('bid')) return
    setShowBidForm(demand)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
      `}</style>

      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px]"></div>
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-gradient-to-t from-amber-500/8 to-transparent blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/25 rounded-full mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            <span className="text-amber-400 text-sm font-medium">实时招募 · {demands.filter(d => d.status === 'pending').length} 个需求待接单</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">智配中心</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            智能匹配需求与创作力，让价值高效流动
          </p>

          {/* 统计 */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
            {[
              { icon: '📋', val: `${demands.length}+`, label: '总需求' },
              { icon: '💎', val: '¥86万+', label: '本月成交' },
              { icon: '⚡', val: '2.3h', label: '平均接单' },
              { icon: '✅', val: '98%', label: '好评率' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <span>{s.icon}</span>
                <span className="font-bold text-white">{s.val}</span>
                <span className="text-gray-500">{s.label}</span>
              </div>
            ))}
          </div>

          {/* 主按钮 */}
          <button
            onClick={() => {
              if (!user) {
                setAuthModalType('login')
                setShowAuthModal(true)
              } else {
                setShowPublishForm(true)
              }
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-2xl shadow-amber-500/30 hover:from-amber-400 hover:to-orange-400 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-5 h-5" />
            发布需求
          </button>
        </div>
      </section>

      {/* ── Tab 导航 ───────────────────────────────── */}
      <section className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-3">
            <button
              onClick={() => setActiveTab('market')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'market'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                需求广场
              </span>
            </button>
            <button
              onClick={() => setActiveTab('my-demands')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'my-demands'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              我的发布
              {myDemands.length > 0 && (
                <span className="px-1.5 py-0.5 bg-emerald-500/30 rounded text-xs">{myDemands.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('my-bids')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'my-bids'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Send className="w-4 h-4" />
              我的投标
              {myBids.length > 0 && (
                <span className="px-1.5 py-0.5 bg-purple-500/30 rounded text-xs">{myBids.length}</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── 快捷功能入口 ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/smart-match')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all text-sm font-medium"
          >
            <Brain className="w-4 h-4" />
            AI智能匹配
          </button>
          <button
            onClick={() => navigate('/enterprise-hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl text-amber-400 hover:from-amber-500/30 hover:to-orange-500/30 transition-all text-sm font-medium"
          >
            <Briefcase className="w-4 h-4" />
            企业服务中台
          </button>
          <button
            onClick={() => navigate('/credit-profile')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 hover:from-emerald-500/30 hover:to-teal-500/30 transition-all text-sm font-medium"
          >
            <Shield className="w-4 h-4" />
            信用档案
          </button>
        </div>
      </section>

      {/* ── 需求广场 ───────────────────────────────── */}
      {activeTab === 'market' && (
        <>
          {/* 分类卡片 */}
          <section className="max-w-7xl mx-auto px-4 mb-6 mt-6">
            <div className="flex flex-wrap gap-2">
              {catStats.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCat(cat.id === activeCat ? 'all' : cat.id); setPage(1) }}
                  className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300 ${
                    activeCat === cat.id
                      ? `bg-gradient-to-r ${cat.light} border-${cat.border} shadow-lg shadow-${cat.id === 'shortvideo' ? 'cyan' : cat.id === 'shortdrama' ? 'violet' : cat.id === 'mangadrama' ? 'pink' : cat.id === 'film' ? 'orange' : cat.id === 'designer' ? 'emerald' : cat.id === 'commerce' ? 'yellow' : 'blue'}-500/20`
                      : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <span className={`text-lg transition-transform group-hover:scale-110 ${activeCat === cat.id ? '' : 'grayscale group-hover:grayscale-0'}`}>
                    {cat.icon}
                  </span>
                  <div className="flex flex-col items-start">
                    <span className={`text-sm font-semibold leading-tight ${activeCat === cat.id ? cat.text : 'text-gray-300'}`}>
                      {cat.name}
                    </span>
                    <span className={`text-xs ${activeCat === cat.id ? cat.text + '/60' : 'text-gray-500'}`}>
                      {cat.count}个
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 搜索筛选栏 */}
          <section className="sticky top-32 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    value={searchText}
                    onChange={(e) => { setSearchText(e.target.value); setPage(1) }}
                    placeholder="搜索需求标题或描述..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'all', label: '全部' },
                    { id: 'pending', label: '待接单' },
                    { id: 'matching', label: '匹配中' },
                    { id: 'progress', label: '进行中' },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => { setActiveStatus(s.id); setPage(1) }}
                      className={`px-3 py-2 rounded-lg text-xs transition-all border ${
                        activeStatus === s.id
                          ? 'bg-violet-600/80 text-white border-violet-500/50'
                          : 'bg-white/5 text-gray-400 border-white/8 hover:bg-white/10'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <select
                  value={activeBudget}
                  onChange={(e) => { setActiveBudget(e.target.value); setPage(1) }}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-xs"
                >
                  {budgetRanges.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
                <select
                  value={activeSort}
                  onChange={(e) => { setActiveSort(e.target.value); setPage(1) }}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-xs"
                >
                  <option value="match">🎯 最匹配</option>
                  <option value="latest">🕐 最新</option>
                  <option value="budget">💰 最高预算</option>
                  <option value="urgent">🔥 紧急</option>
                </select>
              </div>
            </div>
          </section>

          {/* 需求列表 */}
          <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400 text-sm">
                共 <span className="text-white font-semibold">{filteredDemands.length}</span> 个需求
                {activeCat !== 'all' && <span className="text-amber-400 ml-1">· {CATEGORY_META[activeCat]?.name}</span>}
              </p>
              {(activeCat !== 'all' || activeStatus !== 'all' || activeBudget !== 'all' || searchText) && (
                <button
                  onClick={() => { setActiveCat('all'); setActiveStatus('all'); setActiveBudget('all'); setSearchText(''); setPage(1) }}
                  className="px-3 py-1 text-xs text-gray-500 hover:text-white bg-white/5 rounded-full border border-white/8"
                >
                  清除筛选 ×
                </button>
              )}
            </div>

            {paginatedDemands.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedDemands.map(demand => (
                  <DemandCard
                    key={demand.id}
                    demand={demand}
                    onDetail={handleViewDemand}
                    onBid={handleBid}
                    onCollect={handleCollect}
                    matchScore={demand.matchScore}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-white font-medium mb-2">暂无符合条件的需求</h3>
                <p className="text-gray-500 text-sm">试试调整筛选条件，或直接发布你的需求</p>
              </div>
            )}

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10"
                >
                  <ChevronDown className="w-5 h-5" />
                  加载更多（剩余 {filteredDemands.length - paginatedDemands.length} 个）
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {/* ── 我的发布 ───────────────────────────────── */}
      {activeTab === 'my-demands' && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-bold text-xl">我的发布</h2>
              <p className="text-gray-500 text-sm mt-1">管理您发布的全部需求</p>
            </div>
            <button
              onClick={() => setShowPublishForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all"
            >
              <Plus className="w-4 h-4" />
              发布新需求
            </button>
          </div>

          {myDemands.length > 0 ? (
            <div className="grid gap-4">
              {myDemands.map(demand => (
                <MyDemandCard
                  key={demand.id}
                  demand={demand}
                  onView={handleViewDemand}
                  onEdit={handleViewDemand}
                  onDelete={handleDeleteDemand}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-800/30 rounded-2xl border border-white/5">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">暂无发布需求</h3>
              <p className="text-gray-500 text-sm mb-6">发布您的第一个需求，开启与OPC的合作</p>
              <button
                onClick={() => setShowPublishForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl"
              >
                <Plus className="w-5 h-5" />
                发布需求
              </button>
            </div>
          )}
        </section>
      )}

      {/* ── 我的投标 ───────────────────────────────── */}
      {activeTab === 'my-bids' && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-bold text-xl">我的投标</h2>
              <p className="text-gray-500 text-sm mt-1">查看您的投标记录和状态</p>
            </div>
            <button
              onClick={() => setActiveTab('market')}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all"
            >
              <Search className="w-4 h-4" />
              浏览需求
            </button>
          </div>

          {myBids.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {myBids.map(bid => (
                <MyBidCard
                  key={bid.id}
                  bid={bid}
                  onView={() => navigate(`/demand/${bid.demandId}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-800/30 rounded-2xl border border-white/5">
              <Send className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">暂无投标记录</h3>
              <p className="text-gray-500 text-sm mb-6">去需求广场投标，获取更多合作机会</p>
              <button
                onClick={() => setActiveTab('market')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl"
              >
                <Target className="w-5 h-5" />
                浏览需求
              </button>
            </div>
          )}
        </section>
      )}

      {/* ── 发布需求弹窗 ──────────────────────────── */}
      {showPublishForm && (
        <PublishDemandForm
          onClose={() => setShowPublishForm(false)}
          onSuccess={handlePublishSuccess}
        />
      )}

      {/* ── 投标表单弹窗 ───────────────────────────── */}
      {showBidForm && (
        <BidForm
          demand={showBidForm}
          onClose={() => setShowBidForm(null)}
          onSuccess={() => {
            setShowBidForm(null)
            // 刷新我的投标
            try {
              const myB = JSON.parse(localStorage.getItem('unified_my_bids') || '[]')
              setMyBids(myB)
            } catch {}
          }}
        />
      )}

      {/* ── 权限提示弹窗 ───────────────────────────── */}
      {showAuthModal && (
        <AuthModal
          type={authModalType}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  )
}
