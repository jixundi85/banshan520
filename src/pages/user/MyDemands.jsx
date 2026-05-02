import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  FileText, 
  Plus, 
  Search, 
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Calendar,
  DollarSign,
  Tag,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react'
import './MyDemands.css'

const MyDemands = () => {
  const navigate = useNavigate()
  const [demands, setDemands] = useState([])
  const [filteredDemands, setFilteredDemands] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    totalBudget: 0
  })

  useEffect(() => {
    loadDemands()
  }, [])

  useEffect(() => {
    filterDemands()
  }, [demands, activeFilter, searchQuery])

  const loadDemands = () => {
    const myDemands = JSON.parse(localStorage.getItem('myDemands') || '[]')
    const demands = JSON.parse(localStorage.getItem('demands') || '[]')
    const allDemands = [...myDemands, ...demands]
    
    setDemands(allDemands)
    
    // 计算统计数据
    const total = allDemands.length
    const active = allDemands.filter(d => 
      d.status === 'active' || d.status === 'open' || d.status === '招募中'
    ).length
    const completed = allDemands.filter(d => 
      d.status === 'completed' || d.status === '已完成' || d.status === 'closed'
    ).length
    const totalBudget = allDemands.reduce((sum, d) => {
      const budget = d.budget || d.price || 0
      return sum + (typeof budget === 'string' ? 
        parseInt(budget.replace(/[^0-9]/g, '')) : budget)
    }, 0)
    
    setStats({ total, active, completed, totalBudget })
  }

  const filterDemands = () => {
    let filtered = [...demands]
    
    // 状态筛选
    if (activeFilter !== 'all') {
      filtered = filtered.filter(d => {
        const status = d.status?.toLowerCase() || ''
        switch (activeFilter) {
          case 'active':
            return status.includes('active') || status.includes('open') || 
                   status.includes('招募') || status === 'active'
          case 'inprogress':
            return status.includes('进行') || status.includes('progress')
          case 'completed':
            return status.includes('完成') || status.includes('closed') || 
                   status === 'completed'
          default:
            return true
        }
      })
    }
    
    // 搜索筛选
    if (searchQuery) {
      filtered = filtered.filter(d => 
        d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredDemands(filtered)
  }

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase() || ''
    if (s.includes('完成') || s === 'completed' || s === 'closed') {
      return { label: '已完成', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)' }
    } else if (s.includes('进行') || s === 'inprogress') {
      return { label: '进行中', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)' }
    } else if (s.includes('招募') || s === 'active' || s === 'open') {
      return { label: '招募中', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)' }
    }
    return { label: status || '招募中', color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.2)' }
  }

  const formatCurrency = (value) => {
    if (typeof value === 'string') {
      return value
    }
    return `¥${(value || 0).toLocaleString()}`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '待定'
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return '待定'
      return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return '待定'
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这个需求吗？')) {
      const updated = demands.filter(d => d.id !== id)
      setDemands(updated)
      localStorage.setItem('myDemands', JSON.stringify(updated))
    }
  }

  return (
    <div className="my-demands-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/user')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <h1>我的需求</h1>
        <button className="new-demand-btn" onClick={() => navigate('/enterprise-demand')}>
          <Plus size={18} />
          发布需求
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">需求总数</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">招募中</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">已完成</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon value">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatCurrency(stats.totalBudget)}</span>
            <span className="stat-label">总预算</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="filter-section">
        <div className="filter-tabs">
          {[
            { key: 'all', label: '全部需求' },
            { key: 'active', label: '招募中' },
            { key: 'inprogress', label: '进行中' },
            { key: 'completed', label: '已完成' }
          ].map(filter => (
            <button
              key={filter.key}
              className={`filter-tab ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="搜索需求标题、描述..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Demands List */}
      <div className="demands-list">
        {filteredDemands.length === 0 ? (
          <div className="empty-state">
            <FileText size={64} />
            <h3>暂无需求</h3>
            <p>您还没有发布任何需求，开始发布您的第一个需求吧</p>
            <button 
              className="create-demand-btn"
              onClick={() => navigate('/enterprise-demand')}
            >
              发布需求
            </button>
          </div>
        ) : (
          filteredDemands.map(demand => {
            const statusConfig = getStatusConfig(demand.status)
            const applicants = demand.applicants || demand.applications || []
            
            return (
              <div 
                key={demand.id} 
                className="demand-card"
              >
                <div className="demand-card-header">
                  <div className="demand-info">
                    <div className="demand-title-row">
                      <h3>{demand.title}</h3>
                      <span 
                        className="status-badge"
                        style={{ 
                          background: statusConfig.bgColor,
                          color: statusConfig.color
                        }}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                    <span className="demand-id">ID: {demand.id}</span>
                  </div>
                  <div className="demand-actions">
                    <button 
                      className="icon-btn view"
                      onClick={() => navigate(`/demand/${demand.id}`)}
                      title="查看详情"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="icon-btn edit"
                      onClick={() => navigate(`/demand/${demand.id}/edit`)}
                      title="编辑"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="icon-btn delete"
                      onClick={() => handleDelete(demand.id)}
                      title="删除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="demand-card-body">
                  <p className="demand-description">
                    {demand.description?.substring(0, 120)}
                    {demand.description?.length > 120 ? '...' : ''}
                  </p>
                  
                  <div className="demand-meta">
                    <div className="meta-item">
                      <Tag size={14} />
                      <span>{demand.category || 'AI服务'}</span>
                    </div>
                    <div className="meta-item">
                      <DollarSign size={14} />
                      <span className="budget">{formatCurrency(demand.budget || demand.price)}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{formatDate(demand.createdAt || demand.publishDate)}</span>
                    </div>
                    <div className="meta-item">
                      <Users size={14} />
                      <span>{applicants.length} 人报名</span>
                    </div>
                  </div>
                  
                  {demand.skills && demand.skills.length > 0 && (
                    <div className="skills-tags">
                      {demand.skills.slice(0, 5).map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                      {demand.skills.length > 5 && (
                        <span className="skill-tag more">+{demand.skills.length - 5}</span>
                      )}
                    </div>
                  )}
                  
                  {applicants.length > 0 && (
                    <div className="applicants-preview">
                      <div className="applicants-avatars">
                        {applicants.slice(0, 3).map((app, idx) => (
                          <div key={idx} className="applicant-avatar">
                            {app.avatar ? (
                              <img src={app.avatar} alt={app.name} />
                            ) : (
                              <span>{app.name?.charAt(0) || '?'}</span>
                            )}
                          </div>
                        ))}
                        {applicants.length > 3 && (
                          <div className="applicant-avatar more">
                            +{applicants.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="applicants-text">
                        {applicants.length} 位创作者已报名
                      </span>
                      <button 
                        className="view-applicants-btn"
                        onClick={() => navigate(`/demand/${demand.id}/applicants`)}
                      >
                        查看报名
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="demand-card-footer">
                  <button 
                    className="manage-btn"
                    onClick={() => navigate(`/demand/${demand.id}`)}
                  >
                    管理需求
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyDemands
