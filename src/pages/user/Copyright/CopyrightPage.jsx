/**
 * 版权交易中心首页 - Tab切换版
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { COPYRIGHT_CATEGORY_META, getCopyrightGoods, SAMPLE_COPYRIGHT_GOODS, initCopyrightData } from '../../../data/copyrightSchema'
import { useCopyrightOrders } from '../../../hooks/useCopyright'

export default function CopyrightPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('portrait')
  const [viewMode, setViewMode] = useState('grid')
  const [goods, setGoods] = useState([])
  const [stats, setStats] = useState({ totalGoods: 0, totalOrders: 0, totalValue: 0 })
  const [buyingId, setBuyingId] = useState(null)
  const [buyMsg, setBuyMsg] = useState('')
  const copyright = useCopyrightOrders()

  useEffect(() => {
    // 初始化数据
    initCopyrightData()
  }, [])

  useEffect(() => {
    // 加载当前板块商品
    const data = getCopyrightGoods(activeTab)
    setGoods(data)
    
    // 更新统计
    const all = getCopyrightGoods()
    const orders = JSON.parse(localStorage.getItem('copyright_orders') || '[]')
    setStats({
      totalGoods: all.length,
      totalOrders: orders.length,
      totalValue: orders.reduce((sum, o) => sum + (o.price_cash || 0), 0),
    })
  }, [activeTab])

  const categories = Object.values(COPYRIGHT_CATEGORY_META)
  
  // 计算各板块数量
  const allGoods = getCopyrightGoods()
  const getCategoryCount = (type) => allGoods.filter(g => g.type === type).length

  const statsData = [
    { icon: '📦', label: '上架商品', value: stats.totalGoods, color: 'from-cyan-600 to-blue-600' },
    { icon: '📋', label: '已完成交易', value: stats.totalOrders, color: 'from-emerald-600 to-teal-600' },
    { icon: '💵', label: '交易总额', value: `¥${stats.totalValue.toLocaleString()}`, color: 'from-amber-600 to-orange-600' },
    { icon: '⭐', label: '我的积分', value: '10,000', color: 'from-pink-600 to-rose-600' },
  ]

  const handleBuy = async (e, item) => {
    e.stopPropagation()
    if (buyingId) return
    if (!localStorage.getItem('token')) {
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
        setBuyMsg(`✅ 「${item.title}」购买成功！`)
      } else {
        setBuyMsg(`⚠️ ${result.message}`)
      }
    } catch {
      setBuyMsg('❌ 购买失败，请稍后重试')
    }
    setBuyingId(null)
    setTimeout(() => setBuyMsg(''), 3000)
  }

  return (
    <div className="pb-12">
        {/* Banner */}
        <div className="relative bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border-b border-cyan-500/20">
          <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full px-4 py-1 mb-4">
              <span className="text-cyan-400 text-sm">🏛️ 数字内容与AI文创资产合规流通平台</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">版权交易中心</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">确权 · 挂牌 · 交易 · 授权 · 结算</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate('/copyright/sell')} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                💰 我要卖版权
              </button>
              <button onClick={() => navigate('/copyright/my-assets')} className="px-6 py-3 bg-slate-700/50 border border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-600/50 transition-all">
                📦 我的版权资产
              </button>
              <button onClick={() => navigate('/copyright/my-orders')} className="px-6 py-3 bg-slate-700/50 border border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-600/50 transition-all">
                📋 我的订单
              </button>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsData.map((s, i) => (
              <div key={i} className={`bg-gradient-to-br ${s.color} p-4 rounded-xl`}>
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab切换三大板块 */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 左侧板块导航 */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 sticky top-24">
                <h3 className="text-white font-semibold mb-4">📂 交易板块</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                        activeTab === cat.id
                          ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg`
                          : 'text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <div className="font-medium">{cat.name}</div>
                        <div className="text-xs opacity-70">{getCategoryCount(cat.id)}件商品</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧商品列表 */}
            <div className="flex-1">
              {/* 头部筛选 */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {categories.find(c => c.id === activeTab)?.name}
                </h2>
                <div className="text-slate-400 text-sm">
                  共 {goods.length} 件商品
                </div>
              </div>

              {/* 商品列表 */}
              {goods.length > 0 ? (
                <>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
                  : 'space-y-4'
                }>
                  {goods.map((item) => {
                    // 根据类型选择不同的卡片样式
                    const cardConfig = {
                      portrait: { gradient: 'from-emerald-500/20 to-teal-500/20', accent: 'emerald', border: 'hover:border-emerald-500/50', shadow: 'hover:shadow-emerald-500/10' },
                      novel: { gradient: 'from-amber-500/20 to-orange-500/20', accent: 'amber', border: 'hover:border-amber-500/50', shadow: 'hover:shadow-amber-500/10' },
                      film: { gradient: 'from-pink-500/20 to-rose-500/20', accent: 'pink', border: 'hover:border-pink-500/50', shadow: 'hover:shadow-pink-500/10' },
                    }
                    const cfg = cardConfig[item.type] || cardConfig.portrait
                    return (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/copyright/detail/${item.id}`)}
                      className={`bg-gradient-to-br ${cfg.gradient} border border-slate-700/50 rounded-2xl overflow-hidden cursor-pointer ${cfg.border} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${cfg.shadow} group`}
                    >
                      {/* 封面 */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={item.type === 'portrait' ? (item.faceCloseup || item.frontView) : (item.faceCloseup || item.coverImage || 'https://picsum.photos/400/400?random=' + item.id)}
                          alt={item.title}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { e.target.src = 'https://picsum.photos/400/400?grayscale' }}
                        />
                        {/* 渐变遮罩 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-50" />

                        {/* 顶部标签 */}
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 bg-${cfg.accent}-500/90 backdrop-blur text-white text-xs font-medium rounded-lg shadow-lg`}>
                            {item.type === 'portrait' ? '👤 AI演员' : item.type === 'novel' ? '📚 小说' : '🎬 AI影视'}
                          </span>
                        </div>

                        {/* 影视播放标识 */}
                        {item.type === 'film' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                              <span className="text-2xl text-white ml-1">▶</span>
                            </div>
                          </div>
                        )}

                        {/* 小说书脊效果 */}
                        {item.type === 'novel' && (
                          <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-l from-amber-900/40 to-transparent" />
                        )}

                        {/* 价格标签 */}
                        <div className="absolute bottom-2 right-2">
                          <span className={`px-2 py-1 bg-${cfg.accent}-500/90 backdrop-blur text-white text-sm font-bold rounded-lg shadow-lg`}>
                            ¥{(item.price_cash || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* 信息区域 */}
                      <div className="p-4">
                        {/* 标题 */}
                        <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h3>

                        {/* 作者 */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-5 h-5 rounded-full bg-slate-600 overflow-hidden">
                            {item.ownerAvatar ? <img src={item.ownerAvatar} alt="" className="w-full h-full object-cover" /> : <span className="text-xs">🏢</span>}
                          </div>
                          <span className="text-slate-400 text-xs truncate">{item.owner || item.author}</span>
                        </div>

                        {/* 类型标签 */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.type === 'portrait' && (
                            <span className={`bg-${cfg.accent}-500/20 text-${cfg.accent}-300 text-xs px-2 py-0.5 rounded-full border border-${cfg.accent}-500/30`}>
                              {item.ageRange || item.style}
                            </span>
                          )}
                          {item.type === 'novel' && (
                            <>
                              <span className={`bg-${cfg.accent}-500/20 text-${cfg.accent}-300 text-xs px-2 py-0.5 rounded-full border border-${cfg.accent}-500/30`}>
                                📝 {item.wordCount ? `${(item.wordCount/10000).toFixed(0)}万字` : '小说'}
                              </span>
                            </>
                          )}
                          {item.type === 'film' && (
                            <span className={`bg-${cfg.accent}-500/20 text-${cfg.accent}-300 text-xs px-2 py-0.5 rounded-full border border-${cfg.accent}-500/30`}>
                              🎬 {item.episodes ? `${item.episodes}集` : 'AI影视'}
                            </span>
                          )}
                        </div>

                        {/* 底部统计和按钮 */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                          <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <span className="flex items-center gap-1">👁️ {item.views?.toLocaleString() || 0}</span>
                            {item.rating && <span className="text-amber-400">⭐ {item.rating}</span>}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/copyright/detail/${item.id}`) }}
                            className={`px-3 py-1 bg-${cfg.accent}-500 hover:bg-${cfg.accent}-400 text-white text-xs font-medium rounded-lg transition-all`}
                          >
                            查看
                          </button>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
                {buyMsg && (
                  <div className="mt-4 text-center text-sm text-cyan-300 animate-pulse">{buyMsg}</div>
                )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl text-white font-semibold mb-2">暂无商品</h3>
                  <p className="text-slate-400 mb-6">该板块暂无商品上架</p>
                  <button
                    onClick={() => navigate('/copyright/sell')}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl"
                  >
                    立即发布
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 平台特色 */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">平台特色</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🔐', title: '版权确权', desc: '区块链存证，权属核验，合同标准化' },
              { icon: '⚡', title: '智能匹配', desc: 'AI推荐，精准匹配需求方与版权方' },
              { icon: '💳', title: '双渠道支付', desc: '积分+现金，资金托管保障安全' },
              { icon: '📝', title: '授权管理', desc: '使用范围、期限、地域清晰定义' },
              { icon: '📊', title: '数据透明', desc: '实时交易数据，透明分账记录' },
              { icon: '🤝', title: '专业服务', desc: '7×24客服，交易纠纷调解' },
            ].map((f, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl hover:border-cyan-500/30 transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h4 className="font-semibold text-white mb-2">{f.title}</h4>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 底部CTA */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border border-cyan-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">开始您的版权交易之旅</h3>
            <p className="text-slate-300 mb-6">无论是出售还是购买版权，我们都为您提供一站式解决方案</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate('/copyright/sell')} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                🚀 我要卖版权
              </button>
              <button onClick={() => navigate('/copyright')} className="px-8 py-4 bg-slate-700/50 border border-slate-600 text-white font-bold rounded-xl hover:bg-slate-600/50 transition-all">
                🔍 浏览商品
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}
