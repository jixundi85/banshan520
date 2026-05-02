import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { X, Send, Heart, Loader2, Check, ArrowLeft, Upload, FileText, Calendar, DollarSign, User, Building2, Clock, Eye, MessageSquare } from 'lucide-react'
import { CATEGORY_META, STATUS_META, DEFAULT_DEMANDS, formatTimeAgo, isDesignCategory } from '../../data/demandData.js'

export default function DemandDetail() {
  const { demandId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [demand, setDemand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [isCreator, setIsCreator] = useState(false)
  const [creatorCertified, setCreatorCertified] = useState(false)
  const [showBidForm, setShowBidForm] = useState(location.state?.openBidForm || false)
  const [bidRecords, setBidRecords] = useState([])
  const [showBidders, setShowBidders] = useState(false)
  
  // 投标表单 - 无需报价，接受固定价格
  const [bid, setBid] = useState({
    expertise: '',
    proposal: '',
    creativeConcept: '',
    portfolioUrls: '',
    contactWechat: '',
    contactPhone: '',
  })
  const [bidErrors, setBidErrors] = useState({})
  const [bidding, setBidding] = useState(false)
  const [bidOk, setBidOk] = useState(false)

  // 加载用户认证状态和需求数据
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      const creatorProfile = localStorage.getItem('creatorProfile')
      const certification = localStorage.getItem('creatorCertification')
      
      if (token && userStr) {
        setUser(JSON.parse(userStr))
      }
      
      if (creatorProfile) {
        setIsCreator(true)
        if (certification) {
          const cert = JSON.parse(certification)
          if (cert.status === 'approved') {
            setCreatorCertified(true)
          }
        }
      }
    }
    checkAuth()
    
    // 加载需求数据
    const loadDemand = () => {
      setLoading(true)
      // 从 localStorage 加载用户发布的需求
      const saved = localStorage.getItem('publishedDemands')
      const userDemands = saved ? JSON.parse(saved) : []
      const allDemands = [...DEFAULT_DEMANDS, ...userDemands]
      const found = allDemands.find(d => d.id === parseInt(demandId))
      
      if (found) {
        setDemand(found)
      }
      setLoading(false)
    }
    loadDemand()
    
    // 加载该需求的投标记录
    const loadBidRecords = () => {
      const saved = localStorage.getItem('bidRecords')
      if (saved) {
        const allRecords = JSON.parse(saved)
        const demandBids = allRecords.filter(r => r.demandId === parseInt(demandId))
        setBidRecords(demandBids)
      }
    }
    loadBidRecords()
  }, [demandId])

  const handleBid = async (e) => {
    e.preventDefault()
    const errors = {}
    const isDesign = isDesignCategory(demand?.catId)
    
    if (!bid.expertise.trim()) errors.expertise = '请输入擅长领域'
    
    if (isDesign) {
      if (!bid.proposal.trim()) errors.proposal = '请输入设计方案说明'
    } else {
      if (!bid.proposal.trim()) errors.proposal = '请输入创作方案说明'
    }
    
    if (!bid.creativeConcept.trim()) errors.creativeConcept = '请输入创意说明'
    
    if (!bid.contactWechat.trim() && !bid.contactPhone.trim()) {
      errors.contact = '请至少填写一种联系方式'
    }
    
    if (Object.keys(errors).length > 0) { setBidErrors(errors); return }

    setBidding(true); setBidErrors({})
    await new Promise(r => setTimeout(r, 1500))
    
    // 保存投标记录 - 接受固定价格
    const bidRecord = {
      id: Date.now(),
      demandId: demand.id,
      demandTitle: demand.title,
      creatorId: user?.id || 'anonymous',
      creatorName: user?.name || '匿名创作者',
      creatorAvatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator',
      price: demand.budget, // 接受固定价格
      expertise: bid.expertise,
      proposal: bid.proposal,
      creativeConcept: bid.creativeConcept,
      portfolioUrls: bid.portfolioUrls.split(',').filter(Boolean),
      contactWechat: bid.contactWechat,
      contactPhone: bid.contactPhone,
      bidType: isDesign ? 'design' : 'video',
      status: 'pending',
      createdAt: new Date().toISOString(),
      isRead: false,
      isWinner: false,
    }
    
    try {
      const saved = localStorage.getItem('bidRecords')
      const arr = saved ? JSON.parse(saved) : []
      arr.unshift(bidRecord)
      localStorage.setItem('bidRecords', JSON.stringify(arr))
    } catch {}
    
    setBidding(false); setBidOk(true)
    setTimeout(() => {
      setBidOk(false)
      setShowBidForm(false)
      setBid({
        expertise: '', proposal: '', creativeConcept: '', portfolioUrls: '',
        contactWechat: '', contactPhone: ''
      })
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  if (!demand) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">需求不存在或已下架</p>
          <button onClick={() => navigate('/demand')} className="text-amber-400 hover:underline">
            返回智配中心
          </button>
        </div>
      </div>
    )
  }

  const cat = CATEGORY_META[demand.catId] || CATEGORY_META.shortvideo
  const st = STATUS_META[demand.status] || STATUS_META.pending
  const isDesign = isDesignCategory(demand.catId)
  const canBid = creatorCertified && demand.status === 'pending'

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ── 顶部导航 ──────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/demand')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>返回智配中心</span>
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${cat.light} border ${cat.border}`}>
              <span className="text-sm">{cat.icon}</span>
              <span className={`text-xs font-medium ${cat.text}`}>{cat.name}</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${st.bg} border ${st.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
              <span className={`text-xs ${st.text}`}>{st.label}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── 主体内容 ──────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── 左侧：发布方信息 ───────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 发布方卡片 */}
              <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
                <h3 className="text-gray-400 text-sm font-medium mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  需求发布方
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <img src={demand.publisherAvatar} alt={demand.publisher} className="w-16 h-16 rounded-full border-2 border-white/10" />
                  <div>
                    <h4 className="text-white font-bold">{demand.company}</h4>
                    <p className="text-gray-400 text-sm">{demand.publisher}</p>
                    {demand.isCertified && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs mt-1">
                        <Check className="w-3 h-3" />
                        企业认证
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{demand.companyDesc || '暂无简介'}</p>
              </div>

              {/* 项目统计 */}
              <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
                <h3 className="text-gray-400 text-sm font-medium mb-4">项目统计</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <p className="text-2xl font-bold text-white">{demand.bids}</p>
                    <p className="text-gray-500 text-xs">投标人数</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <p className="text-2xl font-bold text-white">{demand.views}</p>
                    <p className="text-gray-500 text-xs">浏览次数</p>
                  </div>
                </div>
              </div>

              {/* 收藏按钮 */}
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition-all">
                <Heart className="w-5 h-5" />
                收藏需求
              </button>

              {/* 报名者列表 - 仅需求发布者可见 */}
              {demand.isUser && bidRecords.length > 0 && (
                <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">已报名创作者</h3>
                    <span className="text-amber-400 text-xs font-bold">{bidRecords.length}人</span>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {bidRecords.map((bid, idx) => (
                      <div key={bid.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <span className="text-gray-500 text-xs font-mono">#{idx + 1}</span>
                        <img src={bid.creatorAvatar} alt={bid.creatorName} className="w-10 h-10 rounded-full border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{bid.creatorName}</p>
                          <p className="text-gray-500 text-xs truncate">{bid.expertise}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          bid.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          bid.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {bid.status === 'pending' ? '待处理' : bid.status === 'accepted' ? '已中标' : '已拒绝'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── 右侧：需求详情 ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* 封面图 */}
            {demand.coverImage && (
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <img src={demand.coverImage} alt={demand.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{demand.title}</h1>
                  <div className="flex flex-wrap gap-2">
                    {demand.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full border border-white/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 关键信息 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  平台托管定价
                </p>
                <p className="text-amber-400 text-xl font-bold">¥{demand.budget?.toLocaleString?.() || demand.budget}</p>
                <p className="text-gray-500 text-xs mt-1">接受此价格即可投标</p>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  交付周期
                </p>
                <p className="text-white text-lg font-bold">{demand.deadline}</p>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  发布时间
                </p>
                <p className="text-white text-lg font-bold">{formatTimeAgo(demand.createdAt)}</p>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  浏览量
                </p>
                <p className="text-white text-lg font-bold">{demand.views}</p>
              </div>
            </div>

            {/* 需求描述 */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                需求详情
              </h3>
              <p className="text-gray-300 leading-relaxed">{demand.desc}</p>
            </div>

            {/* 创作要求 */}
            {demand.requirements?.length > 0 && (
              <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">创作要求</h3>
                <ul className="space-y-2">
                  {demand.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 风格参考 */}
            {demand.referenceImages?.length > 0 && (
              <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">风格参考</h3>
                <div className="flex flex-wrap gap-3">
                  {demand.referenceImages.map((img, idx) => (
                    <img key={idx} src={img} alt="参考" className="w-32 h-24 object-cover rounded-lg border border-white/10" />
                  ))}
                </div>
              </div>
            )}

            {/* ── 投标操作区 ─────────────────────────────── */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
              {!creatorCertified ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🔒</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">需要认证创作者身份</h3>
                  <p className="text-gray-400 mb-4">只有平台认证创作者才能参与投标</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-400 hover:to-orange-400 transition-all">
                    申请创作者认证
                  </button>
                </div>
              ) : demand.status !== 'pending' ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">该需求当前不接受投标</p>
                </div>
              ) : showBidForm ? (
                <div>
                  {bidOk ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">投标成功！</h3>
                      <p className="text-gray-400">您的投标已提交，需求方将在后台收到通知</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBid} className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg">
                            {isDesign ? '🎨 设计类投标' : '🎬 视频类投标'}
                          </h3>
                          <p className="text-gray-500 text-xs mt-1">
                            接受固定价格 ¥{demand.budget?.toLocaleString?.() || demand.budget}
                          </p>
                        </div>
                        <button type="button" onClick={() => setShowBidForm(false)} className="text-gray-500 hover:text-white text-sm">
                          取消
                        </button>
                      </div>

                      {/* 擅长领域 */}
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">擅长领域 *</label>
                        <input value={bid.expertise} onChange={e => setBid({...bid, expertise:e.target.value})}
                          placeholder="如：品牌宣传片、短视频剪辑、UI设计等"
                          className={`w-full px-3 py-2.5 bg-white/5 border rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder-gray-600 ${bidErrors.expertise ? 'border-red-500' : 'border-white/10'}`} />
                        {bidErrors.expertise && <p className="text-red-400 text-xs mt-1">{bidErrors.expertise}</p>}
                      </div>

                      {/* 创作/设计方案 */}
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">
                          {isDesign ? '设计方案说明 *' : '创作方案说明 *'}
                        </label>
                        <textarea value={bid.proposal} onChange={e => setBid({...bid, proposal:e.target.value})} rows={3}
                          placeholder={isDesign ? "详细描述您的设计理念、创作思路、风格定位..." : "描述您的视频制作方案，包括拍摄计划、后期流程、技术手段..."}
                          className={`w-full px-3 py-2.5 bg-white/5 border rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all resize-none placeholder-gray-600 ${bidErrors.proposal ? 'border-red-500' : 'border-white/10'}`} />
                        {bidErrors.proposal && <p className="text-red-400 text-xs mt-1">{bidErrors.proposal}</p>}
                      </div>

                      {/* 创意说明 */}
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">创意说明 *</label>
                        <textarea value={bid.creativeConcept} onChange={e => setBid({...bid, creativeConcept:e.target.value})} rows={2}
                          placeholder="阐述您的创意亮点、叙事结构、视觉风格..."
                          className={`w-full px-3 py-2.5 bg-white/5 border rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all resize-none placeholder-gray-600 ${bidErrors.creativeConcept ? 'border-red-500' : 'border-white/10'}`} />
                        {bidErrors.creativeConcept && <p className="text-red-400 text-xs mt-1">{bidErrors.creativeConcept}</p>}
                      </div>

                      {/* 作品链接 */}
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">代表作/案例链接（可选）</label>
                        <input value={bid.portfolioUrls} onChange={e => setBid({...bid, portfolioUrls: e.target.value})}
                          placeholder="粘贴作品链接，多个用逗号分隔"
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder-gray-600" />
                      </div>

                      {/* 联系方式（仅中标后可见） */}
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                        <p className="text-amber-400 text-xs mb-3 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          以下联系方式仅中标后对需求方可见
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">微信号</label>
                            <input value={bid.contactWechat} onChange={e => setBid({...bid, contactWechat: e.target.value})}
                              placeholder="选填"
                              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">手机号</label>
                            <input value={bid.contactPhone} onChange={e => setBid({...bid, contactPhone: e.target.value})}
                              placeholder="选填"
                              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all" />
                          </div>
                        </div>
                        {bidErrors.contact && <p className="text-red-400 text-xs mt-2">{bidErrors.contact}</p>}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setShowBidForm(false)} disabled={bidding}
                          className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/10 transition-all disabled:opacity-50">
                          取消
                        </button>
                        <button type="submit" disabled={bidding}
                          className={`flex-1 py-3 bg-gradient-to-r ${cat.gradient} text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg`}>
                          {bidding ? <><Loader2 className="w-4 h-4 animate-spin" />提交中...</> : <><Send className="w-4 h-4" />提交投标</>}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <button onClick={() => setShowBidForm(true)}
                    className={`px-8 py-4 bg-gradient-to-r ${cat.gradient} text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2 mx-auto`}>
                    <Send className="w-5 h-5" />
                    立即投标
                  </button>
                  <p className="text-gray-500 text-sm mt-3">已有 {bidRecords.length || demand.bids} 位创作者参与投标</p>
                  
                  {/* 查看报名者按钮 - 仅登录用户可见 */}
                  {user && bidRecords.length > 0 && (
                    <button 
                      onClick={() => setShowBidders(true)}
                      className="mt-4 text-amber-400 text-sm hover:underline"
                    >
                      查看报名者列表 →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── 报名者列表弹窗 ──────────────────────────── */}
      {showBidders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowBidders(false)}></div>
          <div className="relative w-full max-w-lg bg-slate-800 border border-white/10 rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden">
            <div className={`h-1 w-full bg-gradient-to-r ${cat.gradient}`}></div>
            <div className="p-5 border-b border-white/8 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold">报名者列表</h3>
                <p className="text-gray-500 text-xs mt-1">共 {bidRecords.length} 位创作者参与投标</p>
              </div>
              <button onClick={() => setShowBidders(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[calc(80vh-100px)]">
              <div className="space-y-4">
                {bidRecords.map((bid, idx) => (
                  <div key={bid.id} className="p-4 bg-white/5 border border-white/8 rounded-xl">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 text-xs font-mono">#{idx + 1}</span>
                      <img src={bid.creatorAvatar} alt={bid.creatorName} className="w-12 h-12 rounded-full border border-white/10" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium">{bid.creatorName}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            bid.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                            bid.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {bid.status === 'pending' ? '待处理' : bid.status === 'accepted' ? '已中标' : '已拒绝'}
                          </span>
                        </div>
                        <p className="text-amber-400 text-sm mt-1">擅长：{bid.expertise}</p>
                        <p className="text-gray-400 text-xs mt-2 line-clamp-2">{bid.proposal}</p>
                        <p className="text-gray-500 text-xs mt-2">投标时间：{new Date(bid.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
