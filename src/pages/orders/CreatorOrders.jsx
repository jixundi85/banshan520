import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import {
  ShoppingBag, Package, Clock, CheckCircle, XCircle, AlertCircle,
  Search, Filter, Download, ChevronRight, Eye, MessageCircle,
  Star, Calendar, DollarSign, Users, TrendingUp, ArrowUpRight,
  MoreVertical, Copy, Phone, Mail, FileText, MapPin, FilterIcon
} from 'lucide-react'
import './CreatorOrders.css'

// 模拟订单数据
const mockOrders = [
  // 甲方视角订单（我发布的采购需求）
  {
    id: 'ORD20260416001',
    type: 'buyer',
    role: 'buyer',
    title: '企业品牌宣传片制作',
    subtitle: '需要30秒AI宣传片，突出品牌调性',
    category: 'video',
    budget: 5800,
    status: 'matching',
    proposals: 5,
    views: 128,
    deadline: '2026-04-25',
    createdAt: '2026-04-16 08:30',
    client: null
  },
  {
    id: 'ORD20260415002',
    type: 'buyer',
    role: 'buyer',
    title: '产品详情页UI设计',
    subtitle: '电商产品详情页，要求现代简约风格',
    category: 'design',
    budget: 2800,
    status: 'in_progress',
    proposals: 3,
    views: 86,
    deadline: '2026-04-20',
    createdAt: '2026-04-15 14:20',
    client: null,
    selectedCreator: {
      id: 'C002',
      name: '陈设计',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      level: 'middle'
    }
  },
  // 乙方视角订单（我接取的服务）
  {
    id: 'ORD20260414003',
    type: 'seller',
    role: 'seller',
    title: '品牌LOGO设计',
    subtitle: '客户要求简约现代风格，包含3个方案',
    category: 'design',
    amount: 1200,
    received: 360,
    pending: 840,
    status: 'in_progress',
    progress: 60,
    deadline: '2026-04-22',
    createdAt: '2026-04-14 09:15',
    client: {
      name: '李总',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      phone: '139****6666'
    }
  },
  {
    id: 'ORD20260410004',
    type: 'seller',
    role: 'seller',
    title: '企业宣传海报',
    subtitle: '尺寸A3，300dpi，用于线下展会',
    category: 'design',
    amount: 800,
    received: 800,
    pending: 0,
    status: 'completed',
    rating: 5,
    completedAt: '2026-04-13 16:00',
    createdAt: '2026-04-10 11:30',
    client: {
      name: '王总',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      phone: '137****5555'
    }
  },
  {
    id: 'ORD20260408005',
    type: 'seller',
    role: 'seller',
    title: 'AI短剧第一集制作',
    subtitle: '2分钟AI短剧，风格要求赛博朋克',
    category: 'film',
    amount: 3500,
    received: 1050,
    pending: 2450,
    status: 'in_progress',
    progress: 30,
    deadline: '2026-04-30',
    createdAt: '2026-04-08 15:45',
    client: {
      name: '赵总',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      phone: '136****4444'
    }
  },
  {
    id: 'ORD20260405006',
    type: 'seller',
    role: 'seller',
    title: '电商主图视频',
    subtitle: '产品30秒展示视频，突出卖点',
    category: 'video',
    amount: 1500,
    received: 1500,
    pending: 0,
    status: 'completed',
    rating: 4.8,
    completedAt: '2026-04-07 18:30',
    createdAt: '2026-04-05 10:00',
    client: {
      name: '孙总',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      phone: '135****3333'
    }
  }
]

// 订单状态配置
const statusConfig = {
  pending: { text: '待响应', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: Clock },
  matching: { text: '匹配中', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', icon: Users },
  in_progress: { text: '进行中', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', icon: TrendingUp },
  completed: { text: '已完成', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', icon: CheckCircle },
  cancelled: { text: '已取消', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: XCircle }
}

const categoryConfig = {
  video: { text: '视频制作', color: '#ec4899' },
  design: { text: '设计服务', color: '#8b5cf6' },
  film: { text: '短剧漫剧', color: '#f59e0b' },
  advert: { text: '广告电影', color: '#06b6d4' },
  travel: { text: '文旅宣传', color: '#10b981' }
}

export default function CreatorOrders() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [activeRole, setActiveRole] = useState('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showDetail, setShowDetail] = useState(null)

  // 统计数据
  const stats = {
    buyer: { total: 2, active: 1, completed: 0, budget: 8600 },
    seller: { total: 4, active: 2, completed: 2, earnings: 6200, pending: 3290 }
  }

  // 筛选订单
  const filteredOrders = mockOrders.filter(order => {
    if (activeRole !== 'all') {
      if (activeRole === 'buyer' && order.role !== 'buyer') return false
      if (activeRole === 'seller' && order.role !== 'seller') return false
    }
    if (activeTab !== 'all') {
      if (activeTab === 'active' && ['completed', 'cancelled'].includes(order.status)) return false
      if (activeTab === 'completed' && order.status !== 'completed') return false
    }
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      return order.title.toLowerCase().includes(keyword) ||
             order.subtitle.toLowerCase().includes(keyword) ||
             (order.client?.name || '').toLowerCase().includes(keyword)
    }
    return true
  })

  const getStatusConfig = (status) => statusConfig[status] || statusConfig.pending

  return (
      <div className="creator-orders">
        {/* 顶部区域 */}
        <div className="orders-header">
          <div className="header-top">
            <div>
              <h1>订单中心</h1>
              <p>管理您的所有需求订单与服务订单</p>
            </div>
            <div className="header-actions">
              <button className="export-btn">
                <Download size={16} />
                导出记录
              </button>
            </div>
          </div>

          {/* 角色切换 */}
          <div className="role-tabs">
            <button className={`role-tab ${activeRole === 'all' ? 'active' : ''}`} onClick={() => setActiveRole('all')}>
              <Package size={18} />
              全部订单
            </button>
            <button className={`role-tab ${activeRole === 'buyer' ? 'active' : ''}`} onClick={() => setActiveRole('buyer')}>
              <ShoppingBag size={18} />
              我发布的
            </button>
            <button className={`role-tab ${activeRole === 'seller' ? 'active' : ''}`} onClick={() => setActiveRole('seller')}>
              <DollarSign size={18} />
              我接单的
            </button>
          </div>

          {/* 统计卡片 */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><Package size={20} /></div>
              <div className="stat-info">
                <span className="stat-value">{activeRole === 'seller' ? stats.seller.total : activeRole === 'buyer' ? stats.buyer.total : 6}</span>
                <span className="stat-label">总订单</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon active"><TrendingUp size={20} /></div>
              <div className="stat-info">
                <span className="stat-value">{activeRole === 'seller' ? stats.seller.active : activeRole === 'buyer' ? stats.buyer.active : 3}</span>
                <span className="stat-label">进行中</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon money"><DollarSign size={20} /></div>
              <div className="stat-info">
                <span className="stat-value">{activeRole === 'seller' ? '¥' + stats.seller.earnings.toLocaleString() : '¥' + (activeRole === 'buyer' ? stats.buyer.budget.toLocaleString() : '14,800')}</span>
                <span className="stat-label">{activeRole === 'seller' ? '已完成收益' : activeRole === 'buyer' ? '总预算' : '总金额'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="filter-bar">
          <div className="search-input">
            <Search size={18} />
            <input type="text" placeholder="搜索订单名称或客户名称..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
          </div>
          <div className="status-filters">
            <button className={`filter-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>全部</button>
            <button className={`filter-btn ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>进行中</button>
            <button className={`filter-btn ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>已完成</button>
          </div>
        </div>

        {/* 订单列表 */}
        <div className="orders-list">
          {filteredOrders.map(order => {
            const status = getStatusConfig(order.status)
            const StatusIcon = status.icon
            const category = categoryConfig[order.category] || categoryConfig.design

            return (
              <div key={order.id} className="order-card" onClick={() => setShowDetail(order)}>
                <div className="order-header">
                  <div className="order-meta">
                    <span className="order-id">#{order.id}</span>
                    <span className="order-type-badge" style={{ background: order.role === 'buyer' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(139, 92, 246, 0.15)', color: order.role === 'buyer' ? '#3b82f6' : '#8b5cf6' }}>
                      {order.role === 'buyer' ? '采购需求' : '服务订单'}
                    </span>
                    <span className="category-badge" style={{ background: `${category.color}15`, color: category.color }}>{category.text}</span>
                  </div>
                  <div className="order-status" style={{ background: status.bg, color: status.color }}>
                    <StatusIcon size={14} />
                    {status.text}
                  </div>
                </div>

                <div className="order-content">
                  <h3 className="order-title">{order.title}</h3>
                  <p className="order-subtitle">{order.subtitle}</p>
                </div>

                {order.client && (
                  <div className="client-info">
                    <img src={order.client.avatar} alt={order.client.name} className="client-avatar" />
                    <span className="client-name">{order.client.name}</span>
                    <button className="contact-btn"><MessageCircle size={14} />联系</button>
                  </div>
                )}

                {order.selectedCreator && (
                  <div className="creator-info">
                    <span className="label">承接方：</span>
                    <img src={order.selectedCreator.avatar} alt={order.selectedCreator.name} className="creator-avatar" />
                    <span className="creator-name">{order.selectedCreator.name}</span>
                    <span className="creator-level">{order.selectedCreator.level === 'senior' ? '高级OPC' : order.selectedCreator.level === 'middle' ? '中级OPC' : '初级OPC'}</span>
                  </div>
                )}

                {order.status === 'in_progress' && order.progress !== undefined && (
                  <div className="progress-section">
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${order.progress}%` }}></div></div>
                    <span className="progress-text">{order.progress}%</span>
                  </div>
                )}

                {order.rating && (
                  <div className="rating-section"><Star size={14} fill="#f59e0b" stroke="#f59e0b" /><span className="rating-value">{order.rating}</span></div>
                )}

                <div className="order-footer">
                  <div className="order-price">
                    {order.role === 'buyer' ? (
                      <><span className="price-label">预算</span><span className="price">¥{order.budget.toLocaleString()}</span></>
                    ) : (
                      <><span className="price-label">订单金额</span><span className="price">¥{order.amount?.toLocaleString()}</span>{order.pending > 0 && <span className="pending-amount">待结 ¥{order.pending.toLocaleString()}</span>}</>
                    )}
                  </div>
                  <div className="order-actions">
                    <span className="deadline"><Calendar size={14} />{order.deadline}</span>
                    <button className="action-btn" onClick={(e) => { e.stopPropagation(); setShowDetail(order); }}><Eye size={16} />查看</button>
                  </div>
                </div>

                {order.status === 'matching' && order.proposals > 0 && (
                  <div className="proposals-badge"><Users size={14} />{order.proposals} 个提案<ChevronRight size={14} /></div>
                )}
              </div>
            )
          })}
        </div>

        {/* 空状态 */}
        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <Package size={64} className="empty-icon" />
            <h3>暂无订单</h3>
            <p>您还没有相关的订单记录</p>
            {activeRole === 'buyer' && <Link to="/demand" className="empty-action">发布需求</Link>}
            {activeRole === 'seller' && <Link to="/service-market" className="empty-action">去看看需求广场</Link>}
          </div>
        )}

        {/* 订单详情弹窗 */}
        {showDetail && (
          <div className="modal-overlay" onClick={() => setShowDetail(null)}>
            <div className="modal-content order-detail-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>订单详情</h2>
                <button className="close-btn" onClick={() => setShowDetail(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <div className="detail-row"><span className="detail-label">订单编号</span><span className="detail-value">{showDetail.id}<button className="copy-btn"><Copy size={14} /></button></span></div>
                  <div className="detail-row"><span className="detail-label">订单类型</span><span className="detail-value">{showDetail.role === 'buyer' ? '采购需求' : '服务订单'}</span></div>
                  <div className="detail-row"><span className="detail-label">订单状态</span><span className="detail-value"><span className="status-badge" style={{ background: getStatusConfig(showDetail.status).bg, color: getStatusConfig(showDetail.status).color }}>{getStatusConfig(showDetail.status).text}</span></span></div>
                  <div className="detail-row"><span className="detail-label">创建时间</span><span className="detail-value">{showDetail.createdAt}</span></div>
                  <div className="detail-row"><span className="detail-label">截止日期</span><span className="detail-value">{showDetail.deadline}</span></div>
                </div>
                <div className="detail-section">
                  <h4>订单内容</h4>
                  <div className="order-info-card"><h5>{showDetail.title}</h5><p>{showDetail.subtitle}</p></div>
                </div>
                <div className="detail-section">
                  <h4>金额信息</h4>
                  <div className="amount-info">
                    <div className="amount-row"><span>订单金额</span><span className="amount">¥{(showDetail.amount || showDetail.budget)?.toLocaleString()}</span></div>
                    {showDetail.received && <div className="amount-row"><span>已结算</span><span className="received">¥{showDetail.received.toLocaleString()}</span></div>}
                    {showDetail.pending > 0 && <div className="amount-row"><span>待结算</span><span className="pending">¥{showDetail.pending.toLocaleString()}</span></div>}
                  </div>
                </div>
                {showDetail.client && (
                  <div className="detail-section">
                    <h4>{showDetail.role === 'buyer' ? '期望承接方' : '委托客户'}</h4>
                    <div className="client-detail">
                      <img src={showDetail.client.avatar} alt={showDetail.client.name} className="avatar" />
                      <div className="info"><span className="name">{showDetail.client.name}</span><span className="phone">{showDetail.client.phone}</span></div>
                      <button className="contact-btn"><MessageCircle size={16} />联系</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {showDetail.status === 'in_progress' && <button className="btn primary">更新进度</button>}
                {showDetail.status === 'completed' && !showDetail.rating && <button className="btn primary">去评价</button>}
                {showDetail.status === 'matching' && showDetail.role === 'buyer' && <button className="btn primary">查看提案</button>}
                <button className="btn secondary" onClick={() => setShowDetail(null)}>关闭</button>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}
