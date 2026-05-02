/**
 * 我的订单页面
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCopyrightOrders, getCurrentUser, ORDER_STATUS } from '../../../data/copyrightSchema'
import { ShoppingBag, Clock, Check, X, Eye, FileText, Download, ArrowLeft } from 'lucide-react'

export default function CopyrightMyOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const user = getCurrentUser()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    const allOrders = getCopyrightOrders()
    setOrders(allOrders.filter(o => o.buyer_id === user?.id || o.buyer_id === 'guest'))
    setLoading(false)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full flex items-center gap-1">
          <Clock className="w-4 h-4" /> 待支付
        </span>
      case ORDER_STATUS.PAID:
        return <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full flex items-center gap-1">
          <Check className="w-4 h-4" /> 已支付
        </span>
      case ORDER_STATUS.COMPLETED:
        return <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full flex items-center gap-1">
          <Check className="w-4 h-4" /> 已完成
        </span>
      case ORDER_STATUS.REFUNDED:
        return <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full flex items-center gap-1">
          <X className="w-4 h-4" /> 已退款
        </span>
      default:
        return null
    }
  }

  const getPayInfo = (order) => {
    if (order.pay_method === 'cash') {
      return <span className="text-cyan-400 font-bold">¥{order.pay_amount_cash?.toLocaleString()}</span>
    } else if (order.pay_method === 'points') {
      return <span className="text-amber-400 font-bold">⭐ {order.pay_amount_points?.toLocaleString()}</span>
    }
    return null
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const statusFilters = [
    { id: 'all', label: '全部', count: orders.length },
    { id: ORDER_STATUS.PENDING, label: '待支付', count: orders.filter(o => o.status === ORDER_STATUS.PENDING).length },
    { id: ORDER_STATUS.PAID, label: '已支付', count: orders.filter(o => o.status === ORDER_STATUS.PAID).length },
    { id: ORDER_STATUS.COMPLETED, label: '已完成', count: orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length },
  ]

  return (
    <div className="pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 顶部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">📋</span>
              我的订单
            </h1>
            <p className="text-slate-400 mt-2">查看和管理您的版权交易订单</p>
          </div>
          <button onClick={() => navigate('/copyright')} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            继续购物
          </button>
        </div>

        {/* 筛选 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {statusFilters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              filter === f.id ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}>
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* 订单列表 */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">加载中...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 rounded-2xl">
            <div className="text-7xl mb-4 opacity-50">📋</div>
            <p className="text-2xl text-slate-400 mb-2">暂无订单</p>
            <p className="text-slate-500 mb-6">您还没有购买任何版权商品</p>
            <button onClick={() => navigate('/copyright')} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl">
              去逛逛版权市场
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
                {/* 订单头部 */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 text-sm">订单号: <span className="text-slate-400">{order.id}</span></span>
                    <span className="text-slate-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* 商品信息 */}
                <div className="flex gap-4 mb-4">
                  <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                    <img src={order.goods_cover} alt={order.goods_title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{order.goods_title}</h3>
                    <div className="flex gap-2 text-sm text-slate-400">
                      <span className="bg-slate-700 px-2 py-0.5 rounded">{order.auth_label}</span>
                      <span>卖家: @{order.seller_name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {getPayInfo(order)}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                  <div className="text-slate-500 text-sm">
                    实付: <span className="text-white font-medium">{getPayInfo(order)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      查看详情
                    </button>
                    {order.status === ORDER_STATUS.PAID && (
                      <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        下载授权
                      </button>
                    )}
                    {order.status === ORDER_STATUS.PENDING && (
                      <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-colors">
                        立即支付
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
