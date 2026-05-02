import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  FolderOpen, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  ChevronRight,
  Calendar,
  User,
  DollarSign,
  TrendingUp
} from 'lucide-react'
import './MyProjects.css'

const MyProjects = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    totalValue: 0
  })

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, activeFilter, searchQuery])

  const loadProjects = () => {
    const myProjects = JSON.parse(localStorage.getItem('myProjects') || '[]')
    const projects = JSON.parse(localStorage.getItem('projects') || '[]')
    const allProjects = [...myProjects, ...projects]
    
    setProjects(allProjects)
    
    // 计算统计数据
    const total = allProjects.length
    const inProgress = allProjects.filter(p => 
      p.status === 'inprogress' || p.status === '进行中'
    ).length
    const completed = allProjects.filter(p => 
      p.status === 'completed' || p.status === '已完成'
    ).length
    const totalValue = allProjects.reduce((sum, p) => {
      const price = p.price || p.budget || 0
      return sum + (typeof price === 'string' ? 
        parseInt(price.replace(/[^0-9]/g, '')) : price)
    }, 0)
    
    setStats({ total, inProgress, completed, totalValue })
  }

  const filterProjects = () => {
    let filtered = [...projects]
    
    // 状态筛选
    if (activeFilter !== 'all') {
      filtered = filtered.filter(p => {
        const status = p.status?.toLowerCase() || ''
        switch (activeFilter) {
          case 'pending':
            return status.includes('待') || status === 'pending'
          case 'inprogress':
            return status.includes('进行') || status === 'inprogress'
          case 'review':
            return status.includes('验收') || status === 'review'
          case 'completed':
            return status.includes('完成') || status === 'completed'
          default:
            return true
        }
      })
    }
    
    // 搜索筛选
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.opc?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredProjects(filtered)
  }

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase() || ''
    if (s.includes('完成') || s === 'completed') {
      return { label: '已完成', color: '#10b981', icon: CheckCircle2 }
    } else if (s.includes('进行') || s === 'inprogress') {
      return { label: '进行中', color: '#3b82f6', icon: TrendingUp }
    } else if (s.includes('验收') || s === 'review') {
      return { label: '待验收', color: '#f59e0b', icon: AlertCircle }
    } else if (s.includes('待') || s === 'pending') {
      return { label: '待启动', color: '#64748b', icon: Clock }
    }
    return { label: status || '进行中', color: '#64748b', icon: Clock }
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

  return (
    <div className="my-projects-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/user')}>
          <ArrowLeft size={20} />
          返回
        </button>
        <h1>我的项目</h1>
        <button className="new-project-btn" onClick={() => navigate('/enterprise-diagnosis')}>
          <Plus size={18} />
          新建项目
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <FolderOpen size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">项目总数</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon progress">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">进行中</span>
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
            <span className="stat-value">{formatCurrency(stats.totalValue)}</span>
            <span className="stat-label">项目总值</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="filter-section">
        <div className="filter-tabs">
          {[
            { key: 'all', label: '全部项目' },
            { key: 'pending', label: '待启动' },
            { key: 'inprogress', label: '进行中' },
            { key: 'review', label: '待验收' },
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
            placeholder="搜索项目名称、客户..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="projects-list">
        {filteredProjects.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={64} />
            <h3>暂无项目</h3>
            <p>您还没有参与任何项目，开始创建您的第一个项目吧</p>
            <button 
              className="create-project-btn"
              onClick={() => navigate('/enterprise-diagnosis')}
            >
              创建项目
            </button>
          </div>
        ) : (
          filteredProjects.map(project => {
            const statusConfig = getStatusConfig(project.status)
            const StatusIcon = statusConfig.icon
            
            return (
              <div 
                key={project.id} 
                className="project-card"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="project-card-header">
                  <div className="project-info">
                    <h3>{project.name}</h3>
                    <span className="project-id">ID: {project.id}</span>
                  </div>
                  <div 
                    className="status-badge"
                    style={{ 
                      background: `${statusConfig.color}20`,
                      color: statusConfig.color,
                      borderColor: `${statusConfig.color}40`
                    }}
                  >
                    <StatusIcon size={14} />
                    {statusConfig.label}
                  </div>
                </div>
                
                <div className="project-card-body">
                  <div className="project-meta">
                    <div className="meta-item">
                      <User size={14} />
                      <span>{project.client || project.company || '未知客户'}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{formatDate(project.createdAt || project.startDate)}</span>
                    </div>
                    <div className="meta-item">
                      <DollarSign size={14} />
                      <span className="price">{formatCurrency(project.price || project.budget)}</span>
                    </div>
                  </div>
                  
                  {project.opc && (
                    <div className="opc-info">
                      <div className="opc-avatar">
                        {project.opc.avatar ? (
                          <img src={project.opc.avatar} alt={project.opc.name} />
                        ) : (
                          <User size={16} />
                        )}
                      </div>
                      <span className="opc-name">{project.opc.name || project.opc}</span>
                      <span className="opc-title">{project.opc.title || 'OPC创作者'}</span>
                    </div>
                  )}
                  
                  {project.progress !== undefined && (
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>项目进度</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="project-card-footer">
                  <button className="view-btn">
                    查看详情
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

export default MyProjects
