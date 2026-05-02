import { useState, useEffect } from 'react'
import {
  Search, Plus, Edit, Trash2, Eye, Shield,
  Users, CheckCircle, XCircle, Download, RefreshCw
} from 'lucide-react'
import dataService from './dataService'

export default function User() {
  const [users, setUsers] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const data = dataService.loadData('users') || []
    setUsers(data)
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredUsers = users.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false
    if (statusFilter !== 'all' && user.status !== statusFilter) return false
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      return (
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        (user.phone && user.phone.includes(keyword))
      )
    }
    return true
  })

  const handleEdit = (user) => {
    setCurrentUser(user)
    setEditForm({ ...user })
    setShowEditModal(true)
  }

  const handleView = (user) => {
    setCurrentUser(user)
    setShowDetailModal(true)
  }

  const handleSave = () => {
    dataService.updateRecord('users', currentUser.id, editForm)
    loadUsers()
    setShowEditModal(false)
    showToast('用户信息已更新')
  }

  const handleStatusChange = (user, newStatus) => {
    dataService.updateRecord('users', user.id, { status: newStatus })
    loadUsers()
    showToast(`用户状态已更新为${newStatus === 'active' ? '正常' : newStatus === 'banned' ? '已封禁' : '未激活'}`)
  }

  const handleDelete = (user) => {
    if (window.confirm(`确定要删除用户 "${user.name}" 吗？此操作不可恢复。`)) {
      dataService.deleteRecord('users', user.id)
      loadUsers()
      showToast('用户已删除')
    }
  }

  const handleExport = () => {
    const csv = [
      ['ID', '姓名', '邮箱', '手机', '角色', '状态', '注册时间'].join(','),
      ...filteredUsers.map(u => [u.id, u.name, u.email, u.phone, u.role, u.status, u.registeredAt].join(','))
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_${Date.now()}.csv`
    a.click()
    showToast('数据已导出')
  }

  const stats = {
    total: users.length,
    creators: users.filter(u => u.role === 'creator').length,
    active: users.filter(u => u.status === 'active').length,
    banned: users.filter(u => u.status === 'banned').length,
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">用户管理</h1>
          <p className="text-gray-400">管理平台所有用户账号</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadUsers} className="btn-secondary flex items-center gap-2">
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
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-400">总用户数</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.creators}</div>
              <div className="text-sm text-gray-400">创作者</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.active}</div>
              <div className="text-sm text-gray-400">活跃用户</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.banned}</div>
              <div className="text-sm text-gray-400">已封禁</div>
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
              placeholder="搜索用户姓名、邮箱或手机..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="all">全部角色</option>
            <option value="user">普通用户</option>
            <option value="creator">创作者</option>
            <option value="admin">管理员</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="all">全部状态</option>
            <option value="active">正常</option>
            <option value="inactive">未激活</option>
            <option value="banned">已封禁</option>
          </select>
          <div className="text-sm text-gray-400">
            共 {filteredUsers.length} 条结果
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">用户</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">角色</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">积分</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">余额</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">注册时间</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">最后登录</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      user.role === 'creator' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role === 'admin' ? '管理员' : user.role === 'creator' ? '创作者' : '用户'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      user.status === 'banned' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {user.status === 'active' ? '正常' : user.status === 'banned' ? '已封禁' : '未激活'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.points?.toLocaleString() || 0}</td>
                  <td className="px-4 py-3 text-sm text-amber-400">¥{user.balance?.toFixed(2) || '0.00'}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{user.registeredAt}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleView(user)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(user)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button onClick={() => handleStatusChange(user, 'banned')} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400">
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => handleStatusChange(user, 'active')} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(user)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400">
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
          <div className="bg-slate-800/95 rounded-2xl border border-white/10 w-full max-w-lg mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold">编辑用户</h3>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400">
                ×
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">姓名</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">邮箱</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">手机</label>
                <input
                  type="text"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">角色</label>
                <select
                  value={editForm.role || 'user'}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="user">普通用户</option>
                  <option value="creator">创作者</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">状态</label>
                <select
                  value={editForm.status || 'active'}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="active">正常</option>
                  <option value="inactive">未激活</option>
                  <option value="banned">已封禁</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">积分</label>
                <input
                  type="number"
                  value={editForm.points || 0}
                  onChange={(e) => setEditForm({ ...editForm, points: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">余额</label>
                <input
                  type="number"
                  value={editForm.balance || 0}
                  onChange={(e) => setEditForm({ ...editForm, balance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
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

      {/* Detail Modal */}
      {showDetailModal && currentUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowDetailModal(false)}>
          <div className="bg-slate-800/95 rounded-2xl border border-white/10 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold">用户详情</h3>
              <button onClick={() => setShowDetailModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400">
                ×
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-medium">
                  {currentUser.avatar}
                </div>
                <div>
                  <div className="text-xl font-bold">{currentUser.name}</div>
                  <div className="text-gray-400">{currentUser.email}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">手机</span>
                  <span>{currentUser.phone}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">角色</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    currentUser.role === 'creator' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {currentUser.role === 'creator' ? '创作者' : '用户'}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">状态</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    currentUser.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {currentUser.status === 'active' ? '正常' : '已封禁'}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">积分</span>
                  <span className="text-amber-400">{currentUser.points?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">余额</span>
                  <span className="text-amber-400">¥{currentUser.balance?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">注册时间</span>
                  <span>{currentUser.registeredAt}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">最后登录</span>
                  <span>{currentUser.lastLogin}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
