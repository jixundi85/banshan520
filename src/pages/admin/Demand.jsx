import { useState, useEffect } from 'react'
import {
  Search, Plus, Edit, Trash2, Eye, ShoppingCart,
  DollarSign, Users, Clock, RefreshCw, CheckCircle, AlertCircle
} from 'lucide-react'
import dataService from './dataService'

const CATEGORY_META = {
  'AI短视频': { icon: '🎬', color: 'from-cyan-500 to-blue-600' },
  'AI短剧': { icon: '🎭', color: 'from-violet-500 to-purple-600' },
  'AI漫剧': { icon: '📚', color: 'from-pink-500 to-rose-600' },
  'AI电影': { icon: '🎥', color: 'from-orange-500 to-amber-600' },
  'AI设计师': { icon: '🎨', color: 'from-emerald-500 to-teal-600' },
  'AI带货变现': { icon: '💰', color: 'from-yellow-500 to-orange-500' },
}

export default function Demand() {
  const [demands, setDemands] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentDemand, setCurrentDemand] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadDemands()
  }, [])

  const loadDemands = () => {
    const data = dataService.loadData('demands') || []
    setDemands(data)
  }

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const filteredDemands = demands.filter(demand => {
    if (categoryFilter !== 'all' && demand.category !== categoryFilter) return false
    if (statusFilter !== 'all' && demand.status !== statusFilter) return false
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      return (
        demand.title.toLowerCase().includes(keyword) ||
        demand.client.toLowerCase().includes(keyword)
      )
    }
    return true
  })

  const handleEdit = (demand) => {
    setCurrentDemand(demand)
    setEditForm({ ...demand })
    setShowEditModal(true)
  }

  const handleSave = () => {
    dataService.updateRecord('demands', currentDemand.id, editForm)
    loadDemands()
    setShowEditModal(false)
    showToast('需求信息已更新')
  }

  const handleDelete = (demand) => {
    if (window.confirm(`确定要删除需求 "${demand.title}" 吗？`)) {
      dataService.deleteRecord('demands', demand.id)
      loadDemands()
      showToast('需求已删除')
    }
  }

  const handleClose = (demand) => {
    dataService.updateRecord('demands', demand.id, { status: 'closed' })
    loadDemands()
    showToast('需求已关闭')
  }

  const handleReopen = (demand) => {
    dataService.updateRecord('demands', demand.id, { status: 'open' })
    loadDemands()
    showToast('需求已重新开放')
  }

  const handleAdd = () => {
    setCurrentDemand(null)
    setEditForm({
      title: '',
      category: 'AI短视频',
      client: '',
      budget: 0,
      bids: 0,
      status: 'open',
      urgent: false,
      deadline: '',
      description: '',
      tags: []
    })
    setShowEditModal(true)
  }

  const stats = {
    total: demands.length,
    open: demands.filter(d => d.status === 'open').length,
    urgent: demands.filter(d => d.urgent && d.status === 'open').length,
    totalBudget: demands.filter(d => d.status === 'open').reduce((sum, d) => sum + d.budget, 0)
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
          <h1 className="text-2xl font-bold">需求管理</h1>
          <p className="text-gray-400">管理平台所有需求订单</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadDemands} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            刷新
          </button>
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            添加需求
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-400">需求总数</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.open}</div>
              <div className="text-sm text-gray-400">进行中</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.urgent}</div>
              <div className="text-sm text-gray-400">紧急需求</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">¥{stats.totalBudget.toLocaleString()}</div>
              <div className="text-sm text-gray-400">总预算</div>
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
              placeholder="搜索需求名称或客户..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="all">全部分类</option>
            {Object.keys(CATEGORY_META).map(cat => (
              <option key={cat} value={cat}>{CATEGORY_META[cat].icon} {cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="all">全部状态</option>
            <option value="open">进行中</option>
            <option value="closed">已关闭</option>
          </select>
          <div className="text-sm text-gray-400">
            共 {filteredDemands.length} 条结果
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">需求</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">分类</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">客户</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">预算</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">投标数</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemands.map(demand => (
                <tr key={demand.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          {demand.title}
                          {demand.urgent && <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded animate-pulse">🔥 急</span>}
                        </div>
                        <div className="text-xs text-gray-400">{demand.createdAt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-white/10 text-xs rounded">
                      {CATEGORY_META[demand.category]?.icon} {demand.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{demand.client}</td>
                  <td className="px-4 py-3 text-sm text-amber-400 font-semibold">¥{demand.budget.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{demand.bids}人</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      demand.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {demand.status === 'open' ? '进行中' : '已关闭'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(demand)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </button>
                      {demand.status === 'open' ? (
                        <button onClick={() => handleClose(demand)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400">
                          <Clock className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => handleReopen(demand)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(demand)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-slate-800/95 rounded-2xl border border-white/10 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold">{currentDemand ? '编辑需求' : '添加需求'}</h3>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400">
                ×
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">需求标题</label>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">分类</label>
                  <select
                    value={editForm.category || 'AI短视频'}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    {Object.keys(CATEGORY_META).map(cat => (
                      <option key={cat} value={cat}>{CATEGORY_META[cat].icon} {cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">客户名称</label>
                  <input
                    type="text"
                    value={editForm.client || ''}
                    onChange={(e) => setEditForm({ ...editForm, client: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">预算金额</label>
                  <input
                    type="number"
                    value={editForm.budget || 0}
                    onChange={(e) => setEditForm({ ...editForm, budget: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">投标数</label>
                  <input
                    type="number"
                    value={editForm.bids || 0}
                    onChange={(e) => setEditForm({ ...editForm, bids: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">状态</label>
                <select
                  value={editForm.status || 'open'}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="open">进行中</option>
                  <option value="closed">已关闭</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">紧急标记</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.urgent || false}
                    onChange={(e) => setEditForm({ ...editForm, urgent: e.target.checked })}
                    className="w-5 h-5 rounded bg-white/5 border border-white/20 text-red-500"
                  />
                  <span className="text-sm">标记为紧急需求</span>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400">
                取消
              </button>
              <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white font-medium">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
