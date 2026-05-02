import { useState, useEffect } from 'react'
import {
  Search, RefreshCw, Download, FileText,
  DollarSign, ShoppingCart, Clock, CheckCircle, XCircle
} from 'lucide-react'
import dataService from './dataService'

export default function Order() {
  const [orders, setOrders] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [toast, setToast] = useState(null)
  const pageSize = 10

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    const data = dataService.loadData('orders') || []
    // 按时间倒序
    data.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    setOrders(data)
  }

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const getFilteredOrders = () => {
    return orders.filter(order => {
      if (typeFilter !== 'all' && order.type !== typeFilter) return false
      if (statusFilter !== 'all' && order.status !== statusFilter) return false
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase()
        if (!order.id.toLowerCase().includes(keyword) &&
            !order.userName.toLowerCase().includes(keyword) &&
            !order.itemTitle.toLowerCase().includes(keyword)) {
          return false
        }
      }
      // 日期筛选
      if (dateRange !== 'all') {
        const orderDate = new Date(order.createTime)
        const today = new Date()
        if (dateRange === 'today') {
          if (orderDate.toDateString() !== today.toDateString()) return false
        } else if (dateRange === 'week') {
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          if (orderDate < weekAgo) return false
        } else if (dateRange === 'month') {
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          if (orderDate < monthAgo) return false
        }
      }
      return true
    })
  }

  const filteredOrders = getFilteredOrders()
  const totalPages = Math.ceil(filteredOrders.length / pageSize)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleExport = () => {
    const csv = [
      ['订单号', '用户', '类型', '商品', '金额', '状态', '时间'].join(','),
      ...filteredOrders.map(o => [o.id, o.userName, o.type, o.itemTitle, o.amount, o.status, o.createTime].join(','))
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders_${Date.now()}.csv`
    a.click()
    showToast('订单数据已导出')
  }

  const getTypeLabel = (type) => {
    const labels = {
      course: '课程',
      case: '案例',
      demand_bid: '需求投标',
      points: '积分充值'
    }
    return labels[type] || type
  }

  const getTypeIcon = (type) => {
    const icons = {
      course: '📚',
      case: '📋',
      demand_bid: '💼',
      points: '💰'
    }
    return icons[type] || '📦'
  }

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0),
    pending: orders.filter(o => o.status === 'pending').length
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-green-500 text-white">
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">订单管理</h1>
          <p className="text-gray-400">管理平台所有交易订单</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadOrders} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            刷新
          </button>
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <Download className="w-5 h-5" />
            导出
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-400">订单总数</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-sm text-gray-400">已完成</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">¥{stats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-400">总成交额</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm text-gray-400">待处理</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单号、用户或商品..."
              value={searchKeyword}
              onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(1) }}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1) }}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="all">全部类型</option>
            <option value="course">课程</option>
            <option value="case">案例</option>
            <option value="demand_bid">需求投标</option>
            <option value="points">积分充值</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
            <option value="refunded">已退款</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => { setDateRange(e.target.value); setCurrentPage(1) }}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
          </select>
          <div className="text-sm text-gray-400">
            共 {filteredOrders.length} 条结果
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">订单号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">用户</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">类型</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">商品</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">金额</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">时间</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    暂无订单数据
                  </td>
                </tr>
              ) : (
                paginatedOrders.map(order => (
                  <tr key={order.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-sm font-mono">{order.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(order.type)}</span>
                        <span className="text-sm">{order.userName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-white/10 text-xs rounded">
                        {getTypeLabel(order.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm truncate max-w-[200px]" title={order.itemTitle}>
                      {order.itemTitle}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-amber-400">
                      ¥{order.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'cancelled' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {order.status === 'completed' ? '已完成' :
                         order.status === 'pending' ? '待处理' :
                         order.status === 'cancelled' ? '已取消' : '已退款'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{order.createTime}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <div className="text-sm text-gray-400">
              第 {currentPage} / {totalPages} 页，共 {filteredOrders.length} 条
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm disabled:opacity-50"
              >
                上一页
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page
                if (totalPages <= 5) {
                  page = i + 1
                } else if (currentPage <= 3) {
                  page = i + 1
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i
                } else {
                  page = currentPage - 2 + i
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      currentPage === page ? 'bg-purple-500 text-white' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
