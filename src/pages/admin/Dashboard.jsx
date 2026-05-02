import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, BookOpen, ShoppingCart, FileText,
  TrendingUp, DollarSign, Eye, Edit
} from 'lucide-react'
import dataService from './dataService'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [pendingApplications, setPendingApplications] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    // 获取统计数据
    const dashboardStats = dataService.getStats()
    setStats(dashboardStats)

    // 获取最近订单
    const orders = dataService.loadData('orders') || []
    setRecentOrders(orders.slice(0, 5))

    // 获取最近用户
    const users = dataService.loadData('users') || []
    setRecentUsers(users.slice(0, 5))

    // 获取待审核申请
    const applications = dataService.loadData('creatorApplications') || []
    setPendingApplications(applications.filter(a => a.status === 'pending'))
  }

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
    refunded: 'bg-purple-500/20 text-purple-400',
  }

  const statusText = {
    pending: '待处理',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款',
  }

  if (!stats) return <div className="p-8 text-white">加载中...</div>

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">数据看板</h1>
        <p className="text-gray-400">实时了解平台运营状况</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">总用户数</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-green-400">+{Math.floor(stats.totalUsers * 0.05)}</span>
            <span className="text-gray-500">本月新增</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.publishedCourses}</div>
              <div className="text-sm text-gray-400">课程数量</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-green-400">+{stats.publishedCourses > 0 ? 2 : 0}</span>
            <span className="text-gray-500">本月新增</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.openDemands}</div>
              <div className="text-sm text-gray-400">进行中需求</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-green-400">+{Math.floor(stats.totalDemands * 0.08)}</span>
            <span className="text-gray-500">本月新增</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">¥{stats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-400">总成交额</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+{Math.floor(stats.totalRevenue * 0.12)}</span>
            <span className="text-gray-500">本月增长</span>
          </div>
        </div>
      </div>

      {/* Quick Actions & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 待处理事项 */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            待处理事项
          </h3>
          <div className="space-y-3">
            {pendingApplications.length > 0 && (
              <Link to="/admin/creator" className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg hover:bg-yellow-500/20 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <div className="text-sm font-medium">创作者认证申请</div>
                    <div className="text-xs text-gray-400">{pendingApplications.length} 条待审核</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  {pendingApplications.length}
                </span>
              </Link>
            )}

            {stats.totalOrders > 0 && (
              <Link to="/admin/order" className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <div className="text-sm font-medium">订单待处理</div>
                    <div className="text-xs text-gray-400">{stats.totalOrders - 2} 条待处理</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  {stats.totalOrders - 2}
                </span>
              </Link>
            )}

            {pendingApplications.length === 0 && stats.totalOrders === 0 && (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl">✨</span>
                <p className="mt-2">暂无待处理事项</p>
              </div>
            )}
          </div>
        </div>

        {/* 最近订单 */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">最近订单</h3>
            <Link to="/admin/order" className="text-sm text-purple-400 hover:text-purple-300">
              查看全部 →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-white/10">
                  <th className="pb-3 font-medium">订单号</th>
                  <th className="pb-3 font-medium">用户</th>
                  <th className="pb-3 font-medium">商品</th>
                  <th className="pb-3 font-medium">金额</th>
                  <th className="pb-3 font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 text-sm">{order.id}</td>
                    <td className="py-3 text-sm">{order.userName}</td>
                    <td className="py-3 text-sm truncate max-w-[150px]">{order.itemTitle}</td>
                    <td className="py-3 text-sm text-amber-400">¥{order.amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[order.status]}`}>
                        {statusText[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Users & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近用户 */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">最近注册用户</h3>
            <Link to="/admin/user" className="text-sm text-purple-400 hover:text-purple-300">
              管理用户 →
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                    {user.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.role === 'creator'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {user.role === 'creator' ? '创作者' : '用户'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">快捷操作</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/course" className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-medium">课程管理</div>
                <div className="text-xs text-gray-400">管理课程内容</div>
              </div>
            </Link>
            <Link to="/admin/creator" className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm font-medium">创作者管理</div>
                <div className="text-xs text-gray-400">认证审核</div>
              </div>
            </Link>
            <Link to="/admin/demand" className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-medium">需求管理</div>
                <div className="text-xs text-gray-400">处理需求订单</div>
              </div>
            </Link>
            <Link to="/admin/content" className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Edit className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-medium">内容配置</div>
                <div className="text-xs text-gray-400">首页Banner等</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
