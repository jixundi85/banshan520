/**
 * 我的版权资产页面
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCopyrightGoods, getCopyrightLicenses, getCurrentUser, COPYRIGHT_STATUS } from '../../../data/copyrightSchema'
import { Package, FileText, Eye, Edit, Trash2, Download, Clock, Check, X, ArrowLeft, Plus } from 'lucide-react'

export default function CopyrightMyAssetsPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('goods')
  const [goods, setGoods] = useState([])
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(true)

  const user = getCurrentUser()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }
    loadData()
  }, [navigate])

  const loadData = () => {
    setLoading(true)
    const allGoods = getCopyrightGoods()
    const allLicenses = getCopyrightLicenses()
    setGoods(allGoods.filter(g => g.owner_id === user?.id || g.owner_id === 'guest'))
    setLicenses(allLicenses.filter(l => l.buyer_id === user?.id || l.buyer_id === 'guest'))
    setLoading(false)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case COPYRIGHT_STATUS.APPROVED:
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> 已通过</span>
      case COPYRIGHT_STATUS.PENDING:
        return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> 审核中</span>
      case COPYRIGHT_STATUS.REJECTED:
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1"><X className="w-3 h-3" /> 已拒绝</span>
      case COPYRIGHT_STATUS.OFFLINE:
        return <span className="px-2 py-1 bg-slate-500/20 text-slate-400 text-xs rounded-full">已下架</span>
      default:
        return null
    }
  }

  return (
    <div className="pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 顶部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">📦</span>
              我的版权资产
            </h1>
            <p className="text-slate-400 mt-2">管理您的版权商品和授权记录</p>
          </div>
          <button
            onClick={() => navigate('/copyright/sell')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            发布新商品
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('goods')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              tab === 'goods' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Package className="w-5 h-5" />
            我的商品
            <span className={`px-2 py-0.5 rounded-full text-xs ${tab === 'goods' ? 'bg-white/20' : 'bg-slate-700'}`}>
              {goods.length}
            </span>
          </button>
          <button
            onClick={() => setTab('licenses')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              tab === 'licenses' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            我的授权
            <span className={`px-2 py-0.5 rounded-full text-xs ${tab === 'licenses' ? 'bg-white/20' : 'bg-slate-700'}`}>
              {licenses.length}
            </span>
          </button>
        </div>

        {/* 商品列表 */}
        {tab === 'goods' && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-400">加载中...</p>
              </div>
            ) : goods.length === 0 ? (
              <div className="text-center py-20 bg-slate-800/50 rounded-2xl">
                <div className="text-7xl mb-4 opacity-50">📦</div>
                <p className="text-2xl text-slate-400 mb-2">暂无商品</p>
                <p className="text-slate-500 mb-6">发布您的第一个版权商品吧</p>
                <button
                  onClick={() => navigate('/copyright/sell')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl"
                >
                  立即发布
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {goods.map(item => (
                  <div key={item.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex gap-4 hover:border-slate-600 transition-all">
                    <div className="w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(item.status)}
                            <span className="text-slate-400 text-xs">{item.category}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                          <p className="text-slate-400 text-sm line-clamp-1">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-2 text-white mb-2">
                            {item.price_cash > 0 && <span className="text-cyan-400 font-bold">¥{item.price_cash?.toLocaleString()}</span>}
                            {item.price_points > 0 && <span className="text-amber-400">⭐ {item.price_points?.toLocaleString()}</span>}
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 text-slate-400">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 text-slate-400">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 text-slate-500 text-xs mt-2">
                        <span>👁️ {item.views || 0}</span>
                        <span>📥 {item.downloads || 0}</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 授权列表 */}
        {tab === 'licenses' && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-400">加载中...</p>
              </div>
            ) : licenses.length === 0 ? (
              <div className="text-center py-20 bg-slate-800/50 rounded-2xl">
                <div className="text-7xl mb-4 opacity-50">📜</div>
                <p className="text-2xl text-slate-400 mb-2">暂无授权记录</p>
                <p className="text-slate-500 mb-6">购买版权后，这里将显示您的授权信息</p>
                <button onClick={() => navigate('/copyright')} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl">
                  去逛逛
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {licenses.map(lic => (
                  <div key={lic.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-white mb-1">{lic.goods_title}</h3>
                        <span className="text-cyan-400 text-sm">{lic.auth_label}</span>
                      </div>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">有效</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div><span className="text-slate-500">授权范围：</span><span className="text-white">{lic.auth_scope}</span></div>
                      <div><span className="text-slate-500">授权期限：</span><span className="text-white">{lic.auth_duration}</span></div>
                      <div><span className="text-slate-500">授权区域：</span><span className="text-white">{lic.auth_region}</span></div>
                      <div><span className="text-slate-500">订单号：</span><span className="text-slate-400 text-xs">{lic.order_id}</span></div>
                    </div>
                    <button className="w-full py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      下载授权证书
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
