import { useState, useEffect } from 'react'
import {
  Search, Users, CheckCircle, XCircle, Clock,
  Eye, Shield, Star, RefreshCw, Award
} from 'lucide-react'
import dataService from './dataService'

export default function Creator() {
  const [creators, setCreators] = useState([])
  const [applications, setApplications] = useState([])
  const [activeTab, setActiveTab] = useState('creators')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [certFilter, setCertFilter] = useState('all')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [currentCreator, setCurrentCreator] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const users = dataService.loadData('users') || []
    setCreators(users.filter(u => u.role === 'creator'))

    const apps = dataService.loadData('creatorApplications') || []
    setApplications(apps)
  }

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const filteredCreators = creators.filter(creator => {
    if (certFilter !== 'all' && (certFilter === 'certified') !== creator.isCertified) return false
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      return (
        creator.name.toLowerCase().includes(keyword) ||
        (creator.email && creator.email.toLowerCase().includes(keyword))
      )
    }
    return true
  })

  const pendingApplications = applications.filter(a => a.status === 'pending')
  const approvedApplications = applications.filter(a => a.status === 'approved')

  const handleApprove = (app) => {
    // 更新申请状态
    dataService.updateRecord('creatorApplications', app.id, {
      status: 'approved',
      reviewTime: new Date().toISOString(),
      reviewBy: 'admin'
    })

    // 更新用户认证状态
    const users = dataService.loadData('users') || []
    const userIndex = users.findIndex(u => u.id === app.userId || u.name === app.name)
    if (userIndex !== -1) {
      users[userIndex].isCertified = true
      users[userIndex].certifiedSkills = app.skills
      dataService.saveData('users', users)
    }

    loadData()
    showToast(`已通过 ${app.name} 的认证申请`)
  }

  const handleReject = (app) => {
    const reason = prompt('请输入拒绝原因：')
    if (reason) {
      dataService.updateRecord('creatorApplications', app.id, {
        status: 'rejected',
        reviewTime: new Date().toISOString(),
        reviewBy: 'admin',
        rejectReason: reason
      })
      loadData()
      showToast('已拒绝该申请')
    }
  }

  const handleViewCreator = (creator) => {
    setCurrentCreator(creator)
    setShowDetailModal(true)
  }

  const handleRevoke = (creator) => {
    if (window.confirm(`确定要取消 ${creator.name} 的认证资格吗？`)) {
      dataService.updateRecord('users', creator.id, {
        isCertified: false,
        certifiedSkills: []
      })
      loadData()
      showToast('已取消该创作者的认证资格')
    }
  }

  const stats = {
    total: creators.length,
    certified: creators.filter(c => c.isCertified).length,
    pending: pendingApplications.length,
    today: approvedApplications.filter(a => a.reviewTime && a.reviewTime.startsWith(new Date().toISOString().split('T')[0])).length
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
          <h1 className="text-2xl font-bold">创作者管理</h1>
          <p className="text-gray-400">管理认证创作者及认证审核</p>
        </div>
        <button onClick={loadData} className="btn-secondary flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          刷新
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-400">创作者总数</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.certified}</div>
              <div className="text-sm text-gray-400">认证创作者</div>
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
              <div className="text-sm text-gray-400">待审核</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.today}</div>
              <div className="text-sm text-gray-400">今日认证</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-xl">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('creators')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'creators'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            创作者列表 ({creators.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-4 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'applications'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            认证申请
            {pendingApplications.length > 0 && (
              <span className="px-2 py-0.5 bg-yellow-500 text-black text-xs rounded-full">
                {pendingApplications.length}
              </span>
            )}
          </button>
        </div>

        {/* Creators Tab */}
        {activeTab === 'creators' && (
          <div className="p-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索创作者姓名..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500"
                />
              </div>
              <select
                value={certFilter}
                onChange={(e) => setCertFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="all">全部</option>
                <option value="certified">已认证</option>
                <option value="uncertified">未认证</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">创作者</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">认证状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">擅长领域</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">收益</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">注册时间</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCreators.map(creator => (
                    <tr key={creator.id} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                            {creator.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{creator.name}</div>
                            <div className="text-xs text-gray-400">{creator.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {creator.isCertified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            <Shield className="w-3 h-3" /> 认证
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                            未认证
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(creator.certifiedSkills || []).slice(0, 3).map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-amber-400">
                        ¥{creator.balance?.toLocaleString() || '0.00'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{creator.registeredAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleViewCreator(creator)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </button>
                          {creator.isCertified && (
                            <button onClick={() => handleRevoke(creator)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="p-4">
            {pendingApplications.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">暂无待审核的申请</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-400">待审核申请 ({pendingApplications.length})</h3>
                {pendingApplications.map(app => (
                  <div key={app.id} className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-lg font-medium">
                          {app.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-sm text-gray-400">申请时间：{app.applyTime}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(app)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> 通过
                        </button>
                        <button
                          onClick={() => handleReject(app)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" /> 拒绝
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-2">申请领域</div>
                        <div className="flex flex-wrap gap-2">
                          {app.skills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-2">代表作品</div>
                        <div className="space-y-1">
                          {app.works.map((work, i) => (
                            <div key={i} className="text-sm">
                              <span className="text-white">{work.title}</span>
                              {work.url && (
                                <a href={work.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-purple-400 hover:underline">
                                  查看 →
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Approved History */}
            {approvedApplications.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-400 mb-4">已通过申请</h3>
                <div className="space-y-2">
                  {approvedApplications.map(app => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>{app.name}</span>
                        <span className="text-sm text-gray-400">
                          {app.skills.join('、')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        审核时间：{app.reviewTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && currentCreator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowDetailModal(false)}>
          <div className="bg-slate-800/95 rounded-2xl border border-white/10 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold">创作者详情</h3>
              <button onClick={() => setShowDetailModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400">
                ×
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-2xl">
                  {currentCreator.avatar}
                </div>
                <div>
                  <div className="text-xl font-bold flex items-center gap-2">
                    {currentCreator.name}
                    {currentCreator.isCertified && (
                      <Shield className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div className="text-gray-400">{currentCreator.email}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">认证状态</div>
                  <div className={currentCreator.isCertified ? 'text-green-400' : 'text-gray-400'}>
                    {currentCreator.isCertified ? '已认证' : '未认证'}
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">擅长领域</div>
                  <div className="flex flex-wrap gap-1">
                    {(currentCreator.certifiedSkills || []).map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">账户收益</div>
                  <div className="text-2xl font-bold text-amber-400">
                    ¥{currentCreator.balance?.toLocaleString() || '0.00'}
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">注册时间</div>
                  <div>{currentCreator.registeredAt}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">最后登录</div>
                  <div>{currentCreator.lastLogin}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
