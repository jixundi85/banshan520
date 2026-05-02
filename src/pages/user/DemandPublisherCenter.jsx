import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, CheckCircle, XCircle, Clock, DollarSign, Users, FileText, ArrowRight, Loader2, Wallet, Settings, LogOut } from 'lucide-react'

// ─── 分类元数据 ───────────────────────────────────────────
const CATEGORY_META = {
  shortvideo: { id: 'shortvideo', name: 'AI短视频', icon: '🎬', gradient: 'from-cyan-500 to-blue-600', text: 'text-cyan-400' },
  shortdrama: { id: 'shortdrama', name: 'AI短剧', icon: '🎭', gradient: 'from-violet-500 to-purple-600', text: 'text-violet-400' },
  mangadrama: { id: 'mangadrama', name: 'AI漫剧', icon: '📚', gradient: 'from-pink-500 to-rose-600', text: 'text-pink-400' },
  film: { id: 'film', name: 'AI电影', icon: '🎥', gradient: 'from-orange-500 to-amber-600', text: 'text-orange-400' },
  designer: { id: 'designer', name: 'AI设计师', icon: '🎨', gradient: 'from-emerald-500 to-teal-600', text: 'text-emerald-400' },
  commerce: { id: 'commerce', name: 'AI带货变现', icon: '💰', gradient: 'from-yellow-500 to-orange-500', text: 'text-yellow-400' },
  uidesign: { id: 'uidesign', name: 'UI设计', icon: '🖥️', gradient: 'from-blue-500 to-indigo-600', text: 'text-blue-400' },
  logodesign: { id: 'logodesign', name: 'LOGO设计', icon: '✏️', gradient: 'from-rose-500 to-pink-600', text: 'text-rose-400' },
  advideo: { id: 'advideo', name: '广告片', icon: '📺', gradient: 'from-amber-500 to-yellow-600', text: 'text-amber-400' },
}

const STATUS_META = {
  pending: { label: '待接单', bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  matching: { label: '匹配中', bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  progress: { label: '进行中', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  completed: { label: '已完成', bg: 'bg-gray-500/15', text: 'text-gray-400', border: 'border-gray-500/30' },
}

// ─── 格式化时间 ───────────────────────────────────────────
function formatTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function DemandPublisherCenter() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('demands') // demands, bids, wallet
  const [user, setUser] = useState(null)
  const [myDemands, setMyDemands] = useState([])
  const [bidRecords, setBidRecords] = useState([])
  const [selectedDemand, setSelectedDemand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [walletData, setWalletData] = useState({ balance: 0, frozen: 0, totalEarned: 0 })

  // 加载数据
  useEffect(() => {
    const loadData = () => {
      // 加载用户信息
      const userStr = localStorage.getItem('user')
      if (userStr) setUser(JSON.parse(userStr))

      // 加载我发布的需求
      const savedDemands = localStorage.getItem('publishedDemands')
      if (savedDemands) {
        const demands = JSON.parse(savedDemands)
        // 合并投标数量
        const savedBids = localStorage.getItem('bidRecords')
        const bids = savedBids ? JSON.parse(savedBids) : []
        
        const demandsWithBids = demands.map(d => ({
          ...d,
          bids: bids.filter(b => b.demandId === d.id).length
        }))
        setMyDemands(demandsWithBids)
      }

      // 加载所有投标记录
      const savedBids = localStorage.getItem('bidRecords')
      if (savedBids) setBidRecords(JSON.parse(savedBids))

      // 加载钱包数据
      const walletStr = localStorage.getItem('publisherWallet')
      if (walletStr) {
        setWalletData(JSON.parse(walletStr))
      }

      setLoading(false)
    }
    loadData()
  }, [activeTab])

  // 选择中标者
  const handleSelectWinner = (bid) => {
    if (!window.confirm(`确定选择 ${bid.creatorName} 作为中标者吗？`)) return

    // 更新投标记录状态
    const updatedBids = bidRecords.map(b => {
      if (b.id === bid.id) {
        return { ...b, status: 'accepted', isWinner: true }
      }
      if (b.demandId === bid.demandId) {
        return { ...b, status: 'rejected' }
      }
      return b
    })
    localStorage.setItem('bidRecords', JSON.stringify(updatedBids))
    setBidRecords(updatedBids)

    // 更新需求状态为进行中
    const updatedDemands = myDemands.map(d => {
      if (d.id === bid.demandId) {
        return { ...d, status: 'progress', winnerId: bid.creatorId, winnerName: bid.creatorName }
      }
      return d
    })
    localStorage.setItem('publishedDemands', JSON.stringify(updatedDemands))
    setMyDemands(updatedDemands)

    // 划转30%预付款给创作者（从冻结资金中划转）
    const demand = myDemands.find(d => d.id === bid.demandId)
    if (demand) {
      const prepayment = Math.round(demand.budget * 0.3)
      
      // 更新需求方钱包（预付款从冻结转为创作者收入）
      const newPublisherWallet = {
        ...walletData,
        frozen: walletData.frozen - prepayment
      }
      localStorage.setItem('publisherWallet', JSON.stringify(newPublisherWallet))
      setWalletData(newPublisherWallet)
      
      // 更新创作者钱包（30%预付款到账，但处于冻结状态）
      const creatorWalletStr = localStorage.getItem('creatorWallet')
      const creatorWallet = creatorWalletStr ? JSON.parse(creatorWalletStr) : { 
        balance: 0, frozen: 0, totalEarned: 0, withdrawable: 0, completedOrders: 0 
      }
      const newCreatorWallet = {
        ...creatorWallet,
        frozen: creatorWallet.frozen + prepayment,
        totalEarned: creatorWallet.totalEarned + prepayment
      }
      localStorage.setItem('creatorWallet', JSON.stringify(newCreatorWallet))
    }

    alert('中标成功！已通知创作者，30%预付款已划转至创作者账户（订单完成前冻结）。')
  }

  // 确认验收
  const handleConfirmDelivery = (demand) => {
    if (!window.confirm('确认验收作品并支付尾款吗？')) return

    // 更新需求状态为已完成
    const updatedDemands = myDemands.map(d => {
      if (d.id === demand.id) {
        return { ...d, status: 'completed' }
      }
      return d
    })
    localStorage.setItem('publishedDemands', JSON.stringify(updatedDemands))
    setMyDemands(updatedDemands)

    // 计算款项
    const prepayment = Math.round(demand.budget * 0.3)
    const finalPayment = Math.round(demand.budget * 0.7)
    
    // 更新需求方钱包
    const newPublisherWallet = {
      ...walletData,
      frozen: walletData.frozen - prepayment,
      totalEarned: walletData.totalEarned + demand.budget
    }
    localStorage.setItem('publisherWallet', JSON.stringify(newPublisherWallet))
    setWalletData(newPublisherWallet)
    
    // 更新创作者钱包（70%尾款到账，预付款解冻，全部转为可提现）
    const creatorWalletStr = localStorage.getItem('creatorWallet')
    const creatorWallet = creatorWalletStr ? JSON.parse(creatorWalletStr) : { 
      balance: 0, frozen: 0, totalEarned: 0, withdrawable: 0, completedOrders: 0 
    }
    const newCreatorWallet = {
      ...creatorWallet,
      balance: creatorWallet.balance + finalPayment,
      frozen: creatorWallet.frozen - prepayment,
      withdrawable: creatorWallet.withdrawable + demand.budget,
      totalEarned: creatorWallet.totalEarned + finalPayment,
      completedOrders: creatorWallet.completedOrders + 1
    }
    localStorage.setItem('creatorWallet', JSON.stringify(newCreatorWallet))

    alert('验收成功！尾款已支付给创作者，订单完成。')
  }

  // 获取某需求的投标列表
  const getDemandBids = (demandId) => {
    return bidRecords.filter(b => b.demandId === demandId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ── 顶部导航 ──────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">需求方中心</h1>
              <div className="h-6 w-px bg-white/10"></div>
              <nav className="flex items-center gap-1">
                {[
                  { id: 'demands', label: '我的需求', icon: FileText },
                  { id: 'wallet', label: '资金管理', icon: Wallet },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setSelectedDemand(null); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/demand/publish')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all"
              >
                <Plus className="w-4 h-4" />
                发布需求
              </button>
              <div className="h-8 w-px bg-white/10"></div>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── 主体内容 ──────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'demands' && (
          <div className="space-y-6">
            {!selectedDemand ? (
              /* ── 需求列表 ── */
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold text-lg">我发布的需求</h2>
                  <p className="text-gray-500 text-sm">共 {myDemands.length} 条需求</p>
                </div>

                {myDemands.length === 0 ? (
                  <div className="text-center py-16 bg-slate-800/60 rounded-2xl border border-white/8">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-white font-medium mb-2">暂无发布的需求</h3>
                    <p className="text-gray-500 text-sm mb-4">发布您的第一个需求，寻找合适的创作者</p>
                    <button 
                      onClick={() => navigate('/demand/publish')}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-400 hover:to-orange-400 transition-all"
                    >
                      立即发布
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {myDemands.map(demand => {
                      const cat = CATEGORY_META[demand.catId] || CATEGORY_META.shortvideo
                      const st = STATUS_META[demand.status] || STATUS_META.pending
                      const bids = getDemandBids(demand.id)
                      const hasWinner = bids.some(b => b.isWinner)

                      return (
                        <div key={demand.id} className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${cat.gradient} flex items-center justify-center text-lg`}>
                                {cat.icon}
                              </div>
                              <div>
                                <h3 className="text-white font-bold">{demand.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${st.bg} ${st.text} border ${st.border}`}>
                                    {st.label}
                                  </span>
                                  <span className="text-gray-500 text-xs">{formatTime(demand.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-amber-400 font-bold text-lg">¥{demand.budget?.toLocaleString()}</p>
                              <p className="text-gray-500 text-xs">固定报价</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-6">
                              <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                                <Users className="w-4 h-4" />
                                {bids.length} 人投标
                              </span>
                              {hasWinner && (
                                <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
                                  <CheckCircle className="w-4 h-4" />
                                  已中标
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {demand.status === 'progress' && (
                                <button 
                                  onClick={() => handleConfirmDelivery(demand)}
                                  className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-lg hover:bg-emerald-500/30 transition-all"
                                >
                                  确认验收
                                </button>
                              )}
                              <button 
                                onClick={() => setSelectedDemand(demand)}
                                className="flex items-center gap-1 px-4 py-2 bg-white/5 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-all"
                              >
                                查看投标
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              /* ── 投标详情 ── */
              <>
                <div className="flex items-center gap-4 mb-6">
                  <button 
                    onClick={() => setSelectedDemand(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ← 返回列表
                  </button>
                  <h2 className="text-white font-bold text-lg">{selectedDemand.title}</h2>
                </div>

                {(() => {
                  const bids = getDemandBids(selectedDemand.id)
                  const winner = bids.find(b => b.isWinner)

                  return (
                    <div className="space-y-4">
                      {winner && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-emerald-400 font-bold">中标创作者</h3>
                          </div>
                          <div className="flex items-center gap-4">
                            <img src={winner.creatorAvatar} alt={winner.creatorName} className="w-16 h-16 rounded-full border-2 border-emerald-500/30" />
                            <div className="flex-1">
                              <h4 className="text-white font-bold text-lg">{winner.creatorName}</h4>
                              <p className="text-gray-400 text-sm">{winner.expertise}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-amber-400 font-bold">报价 ¥{winner.price}</span>
                                <span className="text-gray-500 text-sm">工期 {winner.days} 天</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-sm mb-1">联系方式</p>
                              <p className="text-white">微信: {winner.contactWechat || '未填写'}</p>
                              <p className="text-white">电话: {winner.contactPhone || '未填写'}</p>
                              <p className="text-emerald-400 text-xs mt-2">✓ 已中标，可联系创作者</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <h3 className="text-white font-bold">全部投标 ({bids.length})</h3>

                      {bids.length === 0 ? (
                        <div className="text-center py-12 bg-slate-800/60 rounded-2xl border border-white/8">
                          <p className="text-gray-500">暂无投标记录</p>
                        </div>
                      ) : (
                        bids.map(bid => (
                          <div key={bid.id} className={`bg-slate-800/60 backdrop-blur-sm border rounded-2xl p-6 ${bid.isWinner ? 'border-emerald-500/30' : 'border-white/8'}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-4">
                                <img src={bid.creatorAvatar} alt={bid.creatorName} className="w-12 h-12 rounded-full border border-white/10" />
                                <div>
                                  <h4 className="text-white font-bold">{bid.creatorName}</h4>
                                  <p className="text-gray-400 text-sm">{bid.expertise}</p>
                                </div>
                              </div>
                            <div className="text-right">
                              <p className="text-amber-400 font-bold">¥{bid.price?.toLocaleString?.() || bid.price}</p>
                              <p className="text-gray-500 text-xs">固定定价</p>
                            </div>
                            </div>

                            <div className="mt-4 space-y-2">
                              {bid.proposal && (
                                <div>
                                  <p className="text-gray-500 text-xs mb-1">{bid.bidType === 'design' ? '设计方案' : '创作方案'}</p>
                                  <p className="text-gray-300 text-sm">{bid.proposal}</p>
                                </div>
                              )}
                              {bid.creativeConcept && (
                                <div>
                                  <p className="text-gray-500 text-xs mb-1">创意说明</p>
                                  <p className="text-gray-300 text-sm">{bid.creativeConcept}</p>
                                </div>
                              )}
                            </div>

                            {bid.portfolioUrls?.length > 0 && (
                              <div className="mt-4">
                                <p className="text-gray-500 text-xs mb-2">代表作/案例链接</p>
                                <div className="flex flex-wrap gap-2">
                                  {bid.portfolioUrls.map((url, idx) => (
                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-amber-400 text-sm hover:underline">
                                      作品{idx + 1}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 仅中标后显示联系方式 */}
                            {bid.isWinner && (
                              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <p className="text-emerald-400 text-xs mb-2 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  中标创作者联系方式
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-gray-500 text-xs">微信号</p>
                                    <p className="text-white text-sm">{bid.contactWechat || '未填写'}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs">手机号</p>
                                    <p className="text-white text-sm">{bid.contactPhone || '未填写'}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {selectedDemand.status === 'pending' && !bid.isWinner && (
                              <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                                <button 
                                  onClick={() => handleSelectWinner(bid)}
                                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all"
                                >
                                  选择中标
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )
                })()}
              </>
            )}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <h2 className="text-white font-bold text-lg">资金管理</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
                <p className="text-gray-500 text-sm mb-2">账户余额</p>
                <p className="text-3xl font-bold text-white">¥{walletData.balance?.toLocaleString()}</p>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
                <p className="text-gray-500 text-sm mb-2">冻结资金</p>
                <p className="text-3xl font-bold text-amber-400">¥{walletData.frozen?.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-1">进行中项目的预付款</p>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
                <p className="text-gray-500 text-sm mb-2">累计支出</p>
                <p className="text-3xl font-bold text-emerald-400">¥{walletData.totalEarned?.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">充值</h3>
              <p className="text-gray-400 text-sm mb-4">发布需求前需要充值对应金额到平台托管</p>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  placeholder="输入充值金额"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all">
                  立即充值
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
