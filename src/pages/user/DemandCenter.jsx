/**
 * 需求中心 - 统一需求管理页面
 * 整合：我的需求 + 需求管理 + 投标管理
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutGrid, List, Plus, Search, Clock,
  MessageSquare, Building2, DollarSign, Calendar, ArrowRight
} from 'lucide-react'
import { 
  getMyDemands, 
  getMyBids, 
  getDemandById,
  CATEGORY_META, 
  STATUS_META,
  DEMAND_STATUS,
  formatTimeAgo,
  formatBudget,
} from '../../data/demandSchema'
import DemandForm from '../../components/DemandForm'
import './DemandCenter.css'

export default function DemandCenter() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('my-demands') // my-demands | my-bids
  const [demands, setDemands] = useState([])
  const [myBids, setMyBids] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid | list
  const [showPublishForm, setShowPublishForm] = useState(false)

  // 加载数据
  useEffect(() => {
    loadData()
    const handleStorage = () => loadData()
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const loadData = () => {
    setDemands(getMyDemands())
    setMyBids(getMyBids())
  }

  // 过滤需求
  const filteredDemands = demands.filter(demand => {
    if (statusFilter !== 'all' && demand.status !== statusFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        demand.title?.toLowerCase().includes(query) ||
        demand.desc?.toLowerCase().includes(query) ||
        demand.companyName?.toLowerCase().includes(query)
      )
    }
    return true
  })

  // 获取投标对应的需求
  const getBidDemand = (bid) => {
    return getDemandById(bid.demandId)
  }

  // Tab 配置
  const tabs = [
    { id: 'my-demands', label: '我的需求', count: demands.length },
    { id: 'my-bids', label: '我的投标', count: myBids.length },
  ]

  // 状态配置
  const statusTabs = [
    { id: 'all', label: '全部' },
    { id: DEMAND_STATUS.PENDING, label: '待接单' },
    { id: DEMAND_STATUS.MATCHING, label: '匹配中' },
    { id: DEMAND_STATUS.PROGRESS, label: '进行中' },
    { id: DEMAND_STATUS.COMPLETED, label: '已完成' },
  ]

  // 渲染需求卡片
  const renderDemandCard = (demand) => {
    const catMeta = CATEGORY_META[demand.catId] || CATEGORY_META.shortvideo
    const statusMeta = STATUS_META[demand.status] || STATUS_META[DEMAND_STATUS.PENDING]
    const bidCount = demand.bids?.length || 0

    return (
      <div 
        key={demand.id} 
        className="demand-card"
        onClick={() => navigate(`/demand/${demand.id}`)}
      >
        <div className="card-cover">
          {demand.coverImage ? (
            <img src={demand.coverImage} alt={demand.title} />
          ) : (
            <div className="cover-placeholder">
              <span>{catMeta.icon}</span>
            </div>
          )}
          <div className={`card-status ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}>
            <span className={`status-dot ${statusMeta.dot}`}></span>
            {statusMeta.label}
          </div>
        </div>

        <div className="card-content">
          <div className="card-header">
            <span className={`category-tag ${catMeta.text}`}>
              {catMeta.icon} {catMeta.name}
            </span>
            {demand.companyName && (
              <span className="company-tag">
                <Building2 size={12} />
                {demand.companyName}
              </span>
            )}
          </div>

          <h3 className="card-title">{demand.title}</h3>
          <p className="card-desc">{demand.desc}</p>

          <div className="card-meta">
            <div className="meta-item">
              <DollarSign size={14} />
              <span>{formatBudget(demand)}</span>
            </div>
            <div className="meta-item">
              <Calendar size={14} />
              <span>{demand.deadline || demand.timeline || '不限'}</span>
            </div>
            <div className="meta-item">
              <MessageSquare size={14} />
              <span>{bidCount} 个投标</span>
            </div>
          </div>

          <div className="card-footer">
            <span className="time">
              <Clock size={12} />
              {formatTimeAgo(demand.publishTime || demand.createdAt)}
            </span>
            <button className="view-btn">
              查看详情 <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 渲染投标卡片
  const renderBidCard = (bid) => {
    const demand = getBidDemand(bid)
    if (!demand) return null

    const catMeta = CATEGORY_META[demand.catId] || CATEGORY_META.shortvideo
    const bidStatusMeta = {
      pending: { label: '待选择', color: 'text-amber-400', bg: 'bg-amber-500/15' },
      accepted: { label: '已中标', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
      rejected: { label: '未选中', color: 'text-gray-400', bg: 'bg-gray-500/15' },
    }[bid.status] || { label: '待选择', color: 'text-amber-400', bg: 'bg-amber-500/15' }

    return (
      <div 
        key={bid.id} 
        className="bid-card"
        onClick={() => navigate(`/demand/${demand.id}`)}
      >
        <div className="bid-header">
          <div className="bid-demand-info">
            <span className={`category-tag ${catMeta.text}`}>
              {catMeta.icon} {catMeta.name}
            </span>
            <h3>{demand.title}</h3>
          </div>
          <div className={`bid-status ${bidStatusMeta.color} ${bidStatusMeta.bg}`}>
            {bidStatusMeta.label}
          </div>
        </div>

        <div className="bid-details">
          <div className="bid-price">
            <DollarSign size={16} />
            <span className="price">¥{bid.price?.toLocaleString()}</span>
            <span className="days">/ {bid.days}天</span>
          </div>
          <div className="bid-time">
            <Clock size={14} />
            {formatTimeAgo(bid.createdAt)}
          </div>
        </div>

        {bid.proposal && (
          <p className="bid-proposal">{bid.proposal}</p>
        )}
      </div>
    )
  }

  // 空状态
  const renderEmpty = (type) => (
    <div className="empty-state">
      <div className="empty-icon">
        {type === 'demands' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <h3>{type === 'demands' ? '暂无需求' : '暂无投标'}</h3>
      <p>
        {type === 'demands' 
          ? '发布您的第一个需求，开启AI升级之旅' 
          : '去需求广场投标，获取更多合作机会'}
      </p>
      <button 
        className="empty-action"
        onClick={() => type === 'demands' ? setShowPublishForm(true) : navigate('/demand')}
      >
        {type === 'demands' ? '发布需求' : '浏览需求'}
      </button>
    </div>
  )

  return (
    <div className="demand-center-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>需求中心</h1>
          <p>管理您的需求和投标</p>
        </div>
        <button className="publish-btn" onClick={() => setShowPublishForm(true)}>
          <Plus size={18} />
          发布需求
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 工具栏 */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="搜索需求..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="toolbar-right">
          <div className="status-filter">
            {statusTabs.map(status => (
              <button
                key={status.id}
                className={`filter-btn ${statusFilter === status.id ? 'active' : ''}`}
                onClick={() => setStatusFilter(status.id)}
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="page-content">
        {activeTab === 'my-demands' && (
          <>
            {filteredDemands.length > 0 ? (
              <div className={`demands-container ${viewMode}`}>
                {filteredDemands.map(renderDemandCard)}
              </div>
            ) : (
              renderEmpty('demands')
            )}
          </>
        )}

        {activeTab === 'my-bids' && (
          <>
            {myBids.length > 0 ? (
              <div className="bids-container">
                {myBids.map(renderBidCard)}
              </div>
            ) : (
              renderEmpty('bids')
            )}
          </>
        )}
      </div>

      {/* 发布表单弹窗 */}
      {showPublishForm && (
        <DemandForm
          mode="quick"
          onSuccess={() => {
            setShowPublishForm(false)
            loadData()
          }}
          onCancel={() => setShowPublishForm(false)}
        />
      )}
    </div>
  )
}
