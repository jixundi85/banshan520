import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '../../components/Toast'
import {
  Briefcase, FileText, Users, BarChart3, Settings, Bell,
  Search, Filter, Plus, MoreVertical, ChevronRight,
  Clock, CheckCircle, AlertCircle, XCircle, Send,
  Eye, Edit, Trash2, Download, Upload, MessageSquare,
  Wrench, Zap, Shield, Server, Database, Headphones,
  Calendar, DollarSign, TrendingUp, ArrowUp, ArrowDown
} from 'lucide-react'
// ======= 工单状态配置 =======
const ORDER_STATUS = {
  pending: { name: '待处理', color: 'amber', icon: Clock, bg: 'bg-amber-500/20', text: 'text-amber-400' },
  processing: { name: '处理中', color: 'blue', icon: Wrench, bg: 'bg-blue-500/20', text: 'text-blue-400' },
  reviewing: { name: '审核中', color: 'violet', icon: Eye, bg: 'bg-violet-500/20', text: 'text-violet-400' },
  completed: { name: '已完成', color: 'emerald', icon: CheckCircle, bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  cancelled: { name: '已取消', color: 'gray', icon: XCircle, bg: 'bg-gray-500/20', text: 'text-gray-400' },
}
// ======= 工单类型 =======
const ORDER_TYPES = [
  { id: 'ai_video', name: 'AI视频服务', icon: '🎬', color: 'from-violet-500 to-purple-600' },
  { id: 'ai_design', name: 'AI设计服务', icon: '🎨', color: 'from-emerald-500 to-teal-600' },
  { id: 'ai_copy', name: 'AI文案服务', icon: '📝', color: 'from-amber-500 to-orange-600' },
  { id: 'ai_consult', name: 'AI咨询服务', icon: '💡', color: 'from-cyan-500 to-blue-600' },
  { id: 'deployment', name: '私有化部署', icon: '☁️', color: 'from-pink-500 to-rose-600' },
  { id: 'training', name: '培训服务', icon: '📚', color: 'from-indigo-500 to-blue-600' },
]
// ======= 模拟工单数据 =======
const INITIAL_ORDERS = [
  {
    id: 'WO-2024-001',
    title: '品牌宣传片制作',
    type: 'ai_video',
    status: 'processing',
    budget: 15000,
    paid: 15000,
    creator: { name: '视频大神', avatar: '视', level: 8 },
    progress: 65,
    createdAt: '2024-01-10',
    deadline: '2024-01-25',
    messages: 12,
    files: 3,
  },
  {
    id: 'WO-2024-002',
    title: '产品包装设计',
    type: 'ai_design',
    status: 'completed',
    budget: 8000,
    paid: 8000,
    creator: { name: '设计小美', avatar: '设', level: 6 },
    progress: 100,
    createdAt: '2024-01-05',
    deadline: '2024-01-15',
    messages: 8,
    files: 5,
  },
  {
    id: 'WO-2024-003',
    title: 'AI私有化部署咨询',
    type: 'ai_consult',
    status: 'pending',
    budget: 50000,
    paid: 25000,
    creator: null,
    progress: 0,
    createdAt: '2024-01-18',
    deadline: '2024-02-18',
    messages: 2,
    files: 1,
  },
  {
    id: 'WO-2024-004',
    title: '营销文案批量生成',
    type: 'ai_copy',
    status: 'reviewing',
    budget: 3000,
    paid: 3000,
    creator: { name: '文案达人', avatar: '文', level: 5 },
    progress: 90,
    createdAt: '2024-01-12',
    deadline: '2024-01-20',
    messages: 5,
    files: 2,
  },
  {
    id: 'WO-2024-005',
    title: '企业培训课程采购',
    type: 'training',
    status: 'pending',
    budget: 29800,
    paid: 0,
    creator: null,
    progress: 0,
    createdAt: '2024-01-19',
    deadline: '2024-01-26',
    messages: 1,
    files: 0,
  },
]
// ======= 统计数据 =======
const STATS_DATA = {
  totalOrders: 28,
  totalSpending: 156000,
  activeOrders: 5,
  completedOrders: 20,
  pendingPayments: 29800,
  monthGrowth: 23.5,
}
// ======= 主组件 =======
export default function EnterpriseServiceHub() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  // 状态
  const [activeTab, setActiveTab] = useState('orders') // orders/services/team/analytics
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showOrderDetail, setShowOrderDetail] = useState(null)
  const [showNewOrder, setShowNewOrder] = useState(false)
  // 新建工单表单
  const [newOrderForm, setNewOrderForm] = useState({
    title: '',
    type: 'ai_video',
    description: '',
    budget: '',
    deadline: '',
    requirements: '',
  })
  // 筛选后的工单
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false
    if (typeFilter !== 'all' && order.type !== typeFilter) return false
    if (searchKeyword && !order.title.toLowerCase().includes(searchKeyword.toLowerCase())) return false
    return true
  })
  // 创建工单
  const handleCreateOrder = () => {
    if (!newOrderForm.title || !newOrderForm.type || !newOrderForm.budget) {
      showToast('请填写必填项', 'error')
      return
    }
    const newOrder = {
      id: `WO-2024-${String(orders.length + 1).padStart(3, '0')}`,
      title: newOrderForm.title,
      type: newOrderForm.type,
      status: 'pending',
      budget: parseInt(newOrderForm.budget),
      paid: 0,
      creator: null,
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
      deadline: newOrderForm.deadline || '',
      messages: 0,
      files: 0,
    }
    setOrders([newOrder, ...orders])
    setShowNewOrder(false)
    setNewOrderForm({ title: '', type: 'ai_video', description: '', budget: '', deadline: '', requirements: '' })
    showToast('工单创建成功！', 'success')
  }
  // 获取状态样式
  const getStatusStyle = (status) => {
    const config = ORDER_STATUS[status]
    return `${config.bg} ${config.text}`
  }
  // 获取类型配置
  const getTypeConfig = (type) => {
    return ORDER_TYPES.find(t => t.id === type) || ORDER_TYPES[0]
  }
  return (
    
      <div className="min-h-screen bg-slate-900 pt-16">
        {/* 顶部标题区 */}
        <div className="bg-slate-800/60 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <Server className="w-5 h-5 text-white" />
                  </div>
                  企业服务中台
                </h1>
                <p className="text-gray-400 mt-1">一站式管理企业AI服务需求</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button
                  onClick={() => setShowNewOrder(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium rounded-xl hover:from-violet-400 hover:to-fuchsia-400 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  新建工单
                </button>
              </div>
            </div>
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <Briefcase className="w-4 h-4" />
                  总工单
                </div>
                <p className="text-2xl font-bold text-white">{STATS_DATA.totalOrders}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <DollarSign className="w-4 h-4" />
                  总消费
                </div>
                <p className="text-2xl font-bold text-white">¥{(STATS_DATA.totalSpending / 10000).toFixed(1)}万</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <Wrench className="w-4 h-4" />
                  进行中
                </div>
                <p className="text-2xl font-bold text-blue-400">{STATS_DATA.activeOrders}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  月增长
                </div>
                <p className="text-2xl font-bold text-emerald-400">+{STATS_DATA.monthGrowth}%</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <AlertCircle className="w-4 h-4" />
                  待付款
                </div>
                <p className="text-2xl font-bold text-amber-400">¥{(STATS_DATA.pendingPayments / 10000).toFixed(1)}万</p>
              </div>
            </div>
          </div>
        </div>
        {/* Tab导航 */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 py-4 border-b border-white/5">
            {[
              { id: 'orders', name: '工单管理', icon: FileText },
              { id: 'services', name: '服务采购', icon: Zap },
              { id: 'team', name: '团队管理', icon: Users },
              { id: 'analytics', name: '数据分析', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
        {/* 内容区 */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* 工单管理 */}
          {activeTab === 'orders' && (
            <div>
              {/* 筛选工具栏 */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* 搜索 */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="搜索工单..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                {/* 状态筛选 */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
                  >
                    <option value="all">全部状态</option>
                    {Object.entries(ORDER_STATUS).map(([key, val]) => (
                      <option key={key} value={key}>{val.name}</option>
                    ))}
                  </select>
                </div>
                {/* 类型筛选 */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
                >
                  <option value="all">全部类型</option>
                  {ORDER_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              {/* 工单列表 */}
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const typeConfig = getTypeConfig(order.type)
                  const statusConfig = ORDER_STATUS[order.status]
                  return (
                    <div
                      key={order.id}
                      onClick={() => setShowOrderDetail(order)}
                      className="bg-slate-800/60 border border-white/10 rounded-2xl p-5 hover:border-white/20 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {/* 类型图标 */}
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${typeConfig.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                            {typeConfig.icon}
                          </div>
                          {/* 信息 */}
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-white font-semibold text-lg">{order.title}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyle(order.status)}`}>
                                {statusConfig.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {order.id}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                ¥{order.budget.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {order.createdAt}
                              </span>
                              {order.deadline && (
                                <>
                                  <span>→</span>
                                  <span className={new Date(order.deadline) < new Date() ? 'text-red-400' : ''}>
                                    {order.deadline}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* 右侧信息 */}
                        <div className="flex items-center gap-6">
                          {/* 创作者 */}
                          {order.creator ? (
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                                {order.creator.avatar}
                              </div>
                              <div>
                                <p className="text-white text-sm">{order.creator.name}</p>
                                <p className="text-gray-500 text-xs">Lv.{order.creator.level}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-1">
                                <Users className="w-5 h-5 text-gray-500" />
                              </div>
                              <p className="text-gray-500 text-xs">待匹配</p>
                            </div>
                          )}
                          {/* 进度 */}
                          {order.status !== 'pending' && order.status !== 'cancelled' && (
                            <div className="text-center w-20">
                              <div className="relative w-12 h-12 mx-auto mb-1">
                                <svg className="w-12 h-12 transform -rotate-90">
                                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-700" />
                                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-violet-500" strokeDasharray={`${order.progress * 1.26} 126`} strokeLinecap="round" />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                  {order.progress}%
                                </span>
                              </div>
                              <p className="text-gray-500 text-xs">进度</p>
                            </div>
                          )}
                          {/* 消息数 */}
                          <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-1">
                              <MessageSquare className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-xs">{order.messages}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  )
                })}
                {filteredOrders.length === 0 && (
                  <div className="text-center py-20">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">暂无工单</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* 服务采购 */}
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ORDER_TYPES.map((type) => (
                <div
                  key={type.id}
                  className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all cursor-pointer group"
                  onClick={() => {
                    setNewOrderForm({ ...newOrderForm, type: type.id })
                    setShowNewOrder(true)
                  }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{type.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">快速创建{type.name}工单</p>
                  <button className="w-full py-2 bg-white/5 text-gray-300 text-sm rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    新建工单
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* 团队管理 */}
          {activeTab === 'team' && (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">团队管理</h3>
              <p className="text-gray-500 mb-6">管理您的企业团队成员和权限</p>
              <button className="px-6 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-400 transition-colors">
                添加成员
              </button>
            </div>
          )}
          {/* 数据分析 */}
          {activeTab === 'analytics' && (
            <div className="text-center py-20">
              <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">数据分析</h3>
              <p className="text-gray-500 mb-6">查看消费统计和服务效率分析</p>
              <button className="px-6 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-400 transition-colors">
                查看报告
              </button>
            </div>
          )}
        </div>
        {/* 新建工单弹窗 */}
        {showNewOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">新建工单</h3>
                <button
                  onClick={() => setShowNewOrder(false)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* 工单标题 */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">工单标题 *</label>
                  <input
                    type="text"
                    value={newOrderForm.title}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, title: e.target.value })}
                    placeholder="请输入工单标题"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                {/* 服务类型 */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">服务类型 *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {ORDER_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setNewOrderForm({ ...newOrderForm, type: type.id })}
                        className={`p-3 rounded-xl border transition-all flex items-center gap-2 ${
                          newOrderForm.type === type.id
                            ? `bg-gradient-to-br ${type.color} border-transparent text-white`
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-sm">{type.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {/* 预算 */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">预算金额 (¥) *</label>
                  <input
                    type="number"
                    value={newOrderForm.budget}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, budget: e.target.value })}
                    placeholder="请输入预算金额"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                {/* 截止日期 */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">期望完成日期</label>
                  <input
                    type="date"
                    value={newOrderForm.deadline}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, deadline: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                {/* 需求描述 */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">需求描述</label>
                  <textarea
                    value={newOrderForm.description}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, description: e.target.value })}
                    rows={4}
                    placeholder="详细描述您的需求..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 resize-none"
                  />
                </div>
                {/* 参考文件 */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">上传参考文件</label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-violet-500/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">点击或拖拽上传文件</p>
                    <p className="text-gray-600 text-xs mt-1">支持 PDF、Word、图片等</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={() => setShowNewOrder(false)}
                  className="px-6 py-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateOrder}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium rounded-xl hover:from-violet-400 hover:to-fuchsia-400 transition-all"
                >
                  创建工单
                </button>
              </div>
            </div>
          </div>
        )}
        {/* 工单详情弹窗 */}
        {showOrderDetail && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{showOrderDetail.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyle(showOrderDetail.status)}`}>
                      {ORDER_STATUS[showOrderDetail.status].name}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{showOrderDetail.id}</p>
                </div>
                <button
                  onClick={() => setShowOrderDetail(null)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* 进度 */}
                {showOrderDetail.status !== 'pending' && showOrderDetail.status !== 'cancelled' && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">完成进度</span>
                      <span className="text-white font-medium">{showOrderDetail.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                        style={{ width: `${showOrderDetail.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {/* 信息卡片 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">预算金额</p>
                    <p className="text-2xl font-bold text-amber-400">¥{showOrderDetail.budget.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">已付款</p>
                    <p className="text-2xl font-bold text-emerald-400">¥{showOrderDetail.paid.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">创建日期</p>
                    <p className="text-white font-medium">{showOrderDetail.createdAt}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">截止日期</p>
                    <p className={`font-medium ${showOrderDetail.deadline && new Date(showOrderDetail.deadline) < new Date() ? 'text-red-400' : 'text-white'}`}>
                      {showOrderDetail.deadline || '未设置'}
                    </p>
                  </div>
                </div>
                {/* 创作者 */}
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-500 text-sm mb-3">执行创作者</p>
                  {showOrderDetail.creator ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                        {showOrderDetail.creator.avatar}
                      </div>
                      <div>
                        <p className="text-white font-medium">{showOrderDetail.creator.name}</p>
                        <p className="text-gray-500 text-sm">OPC Lv.{showOrderDetail.creator.level}</p>
                      </div>
                      <button className="ml-auto px-4 py-2 bg-violet-500/20 text-violet-400 text-sm rounded-xl hover:bg-violet-500/30 transition-colors">
                        联系
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400">待匹配</p>
                      <button className="px-4 py-2 bg-violet-500/20 text-violet-400 text-sm rounded-xl hover:bg-violet-500/30 transition-colors">
                        立即匹配
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={() => setShowOrderDetail(null)}
                  className="px-6 py-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-colors"
                >
                  关闭
                </button>
                <button className="px-6 py-2.5 bg-violet-500 text-white rounded-xl hover:bg-violet-400 transition-colors">
                  查看详情
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
  )
}
