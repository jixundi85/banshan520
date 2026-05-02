import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Upload,
  Download,
  Send,
  AlertCircle,
  CheckSquare,
  X,
  Loader2,
  Lock,
  Unlock,
  CreditCard,
  FileCheck,
  Package,
  Star
} from 'lucide-react'
import './ProjectWorkspace.css'
import { opcService, reviewService } from '../../services/dataService.js'
import { useToast } from '../../components/Toast.jsx'
import { useConfirm, useConfirmActions } from '../../components/ConfirmDialog.jsx'
import { PageLoading } from '../../components/Skeleton.jsx'

// 项目状态机配置
const STATUS_CONFIG = {
  '待启动': { 
    code: 'pending', 
    color: '#94a3b8', 
    bgColor: 'rgba(148, 163, 184, 0.1)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
    next: ['进行中'],
    action: '启动项目'
  },
  '进行中': { 
    code: 'inprogress', 
    color: '#3b82f6', 
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    next: ['待验收'],
    action: '提交验收'
  },
  '待验收': { 
    code: 'review', 
    color: '#f59e0b', 
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    next: ['待付尾款', '进行中'],
    action: '确认验收'
  },
  '待付尾款': { 
    code: 'final', 
    color: '#8b5cf6', 
    bgColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    next: ['已完成'],
    action: '支付尾款'
  },
  '已完成': { 
    code: 'completed', 
    color: '#10b981', 
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    next: [],
    action: '项目结束'
  },
  '已取消': { 
    code: 'cancelled', 
    color: '#ef4444', 
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    next: [],
    action: '项目取消'
  }
}

const ProjectWorkspace = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()
  const { confirmSubmit, confirmCancel } = useConfirmActions()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('milestones')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true)
      try {
        // 从localStorage获取项目数据（兼容多个存储键）
        const myProjects = JSON.parse(localStorage.getItem('myProjects') || '[]')
        const projects = JSON.parse(localStorage.getItem('projects') || '[]')
        const allProjects = [...myProjects, ...projects]
        const foundProject = allProjects.find(p => p.id === projectId)
        
        if (foundProject) {
          // 标准化项目数据格式
          const normalizedProject = normalizeProjectData(foundProject)
          setProject(normalizedProject)
        } else {
          // 如果没有找到项目，显示演示数据
          setProject(getDemoProject())
        }
        
        // 加载消息记录
        const savedMessages = JSON.parse(localStorage.getItem(`project_messages_${projectId}`) || '[]')
        setMessages(savedMessages)
      } catch (error) {
        toast.error('加载项目数据失败')
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [projectId])

  // 标准化项目数据（兼容智配中心创建的项目）
  const normalizeProjectData = (data) => {
    const price = data.price || data.budget || 50000
    const depositRatio = typeof data.deposit === 'number' && data.deposit < 1 ? data.deposit : 0.3
    const depositAmount = Math.round(price * depositRatio)
    const paidAmount = data.paidAmount || 0
    
    return {
      ...data,
      // 金额字段统一
      budget: `¥${price.toLocaleString()}`,
      duration: data.duration || '30天',
      // 状态映射
      status: data.status === 'deposit' ? '待付定金' :
              data.status === 'inprogress' ? '进行中' :
              data.status === 'review' ? '待验收' :
              data.status === 'final' ? '待付尾款' :
              data.status === 'completed' ? '已完成' :
              data.status || '进行中',
      // 客户信息
      client: data.client || data.company || '某企业',
      // OPC信息
      opc: data.opc?.name || data.opc || '待分配',
      // 日期
      startDate: data.startDate || data.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      // 里程碑（使用已有的或生成默认）
      milestones: data.milestones || [
        { id: 1, name: '项目启动', status: paidAmount > 0 ? 'completed' : 'pending', date: data.createdAt?.split('T')[0], description: '完成合同签署与定金支付' },
        { id: 2, name: '需求确认', status: 'pending', date: null, description: '确认详细需求与交付标准' },
        { id: 3, name: '内容制作', status: 'pending', date: null, description: 'OPC进行内容创作' },
        { id: 4, name: '初稿交付', status: 'pending', date: null, description: '提交初稿并收集反馈' },
        { id: 5, name: '项目验收', status: 'pending', date: null, description: '最终交付与尾款结算' }
      ],
      // 交付物
      deliverables: data.deliverables || [],
      // 项目类型
      type: data.type === 'package' ? '套餐服务' : data.type || 'AI服务'
    }
  }

  const getDemoProject = () => ({
    id: projectId,
    name: 'AI数字人客服系统开发',
    type: 'AI Agent',
    budget: '¥50,000',
    duration: '30天',
    status: '进行中',
    client: '某电商公司',
    opc: '张创作者',
    startDate: '2026-04-01',
    milestones: [
      { id: 1, name: '需求确认', status: 'completed', date: '2026-04-03', description: '完成需求调研与功能确认' },
      { id: 2, name: '方案交付', status: 'in_progress', date: '2026-04-10', description: '提交技术方案与原型设计' },
      { id: 3, name: '开发实施', status: 'pending', date: '2026-04-20', description: '核心功能开发与测试' },
      { id: 4, name: '成果验收', status: 'pending', date: '2026-04-28', description: '系统部署与验收交付' },
      { id: 5, name: '尾款结算', status: 'pending', date: '2026-04-30', description: '项目尾款支付与评价' }
    ],
    deliverables: [
      { id: 1, name: '需求规格说明书.pdf', size: '2.5MB', date: '2026-04-03', type: 'document' },
      { id: 2, name: '原型设计稿.fig', size: '15MB', date: '2026-04-08', type: 'design' }
    ]
  })

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    const newMessage = {
      id: Date.now(),
      content: message,
      sender: '企业',
      time: new Date().toLocaleString('zh-CN'),
      avatar: '企'
    }
    
    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    localStorage.setItem(`project_messages_${projectId}`, JSON.stringify(updatedMessages))
    setMessage('')
  }

  // 保存项目到localStorage
  const saveProject = (updatedProject) => {
    const myProjects = JSON.parse(localStorage.getItem('myProjects') || '[]')
    const projects = JSON.parse(localStorage.getItem('projects') || '[]')
    
    // 尝试在myProjects中更新
    const myIndex = myProjects.findIndex(p => p.id === projectId)
    if (myIndex >= 0) {
      myProjects[myIndex] = updatedProject
      localStorage.setItem('myProjects', JSON.stringify(myProjects))
    }
    
    // 尝试在projects中更新
    const index = projects.findIndex(p => p.id === projectId)
    if (index >= 0) {
      projects[index] = updatedProject
      localStorage.setItem('projects', JSON.stringify(projects))
    }
  }

  // 计算项目进度
  const calculateProgress = (milestones) => {
    if (!milestones || milestones.length === 0) return 0
    const completed = milestones.filter(m => m.status === 'completed').length
    return Math.round((completed / milestones.length) * 100)
  }

  // 处理里程碑完成
  const handleMilestoneComplete = (milestoneId) => {
    const updatedProject = { ...project }
    const now = new Date().toISOString().split('T')[0]
    
    updatedProject.milestones = project.milestones.map((m, idx) => {
      if (m.id === milestoneId) {
        // 标记当前里程碑完成
        return { ...m, status: 'completed', date: now }
      } else if (m.id === milestoneId + 1) {
        // 下一个里程碑变为进行中
        return { ...m, status: 'in_progress', date: now }
      }
      return m
    })
    
    // 更新项目进度
    updatedProject.progress = calculateProgress(updatedProject.milestones)
    
    // 检查是否所有里程碑完成，自动进入待验收状态
    const allCompleted = updatedProject.milestones.every(m => m.status === 'completed')
    if (allCompleted && updatedProject.status === '进行中') {
      updatedProject.status = '待验收'
    }
    
    setProject(updatedProject)
    saveProject(updatedProject)
  }

  // 处理状态流转
  const handleStatusChange = async (newStatus) => {
    const statusLabels = {
      '进行中': '启动项目',
      '待验收': '提交验收',
      '待付尾款': '确认付款',
      '已完成': '完成项目'
    }
    
    const confirmed = await confirm({
      title: `确认${statusLabels[newStatus] || '状态变更'}`,
      message: `确定要将项目状态变更为「${newStatus}」吗？`,
      confirmText: '确认',
      type: 'info'
    })
    
    if (!confirmed) return
    
    const updatedProject = { ...project, status: newStatus }
    
    // 状态变更时的特殊处理
    if (newStatus === '进行中' && project.status === '待启动') {
      // 启动项目，第一个里程碑变为进行中
      updatedProject.milestones = project.milestones.map((m, idx) => 
        idx === 0 ? { ...m, status: 'in_progress' } : m
      )
      toast.success('项目已启动！')
    } else if (newStatus === '待验收') {
      // 提交验收
      updatedProject.reviewSubmitDate = new Date().toISOString()
      toast.success('已提交验收，等待确认')
    } else if (newStatus === '已完成') {
      // 项目完成
      updatedProject.completedDate = new Date().toISOString()
      toast.success('项目已完成！')
      
      // 触发OPC等级晋升检查
      if (updatedProject.opcId) {
        opcService.updateProjectStatus(updatedProject.id, 'completed')
        const levelUpCheck = opcService.checkLevelUp()
        if (levelUpCheck.canLevelUp) {
          toast.success(`恭喜！OPC 满足升级条件，可晋升至 ${levelUpCheck.nextLevel}`)
        }
      }
    }
    
    setProject(updatedProject)
    saveProject(updatedProject)
    setShowStatusModal(false)
  }

  // 处理验收确认
  const handleReviewConfirm = async (approved) => {
    const confirmed = await confirm({
      title: approved ? '确认验收通过' : '确认退回修改',
      message: approved 
        ? '验收通过后项目将进入待付尾款状态，确认吗？'
        : '退回修改后OPC将重新处理，确认吗？',
      confirmText: '确认',
      type: approved ? 'info' : 'warning'
    })
    
    if (!confirmed) return
    
    const updatedProject = { ...project }
    
    if (approved) {
      // 验收通过，进入待付尾款状态
      updatedProject.status = '待付尾款'
      updatedProject.reviewComment = reviewComment
      updatedProject.reviewRating = reviewRating
      updatedProject.reviewDate = new Date().toISOString()
      
      // 保存评价到评价系统，触发信用分更新
      if (project.opcId && reviewRating > 0) {
        reviewService.create({
          projectId: project.id,
          projectName: project.name || project.title,
          fromId: project.enterpriseId || 'enterprise_user',
          fromType: 'enterprise',
          toId: project.opcId,
          toType: 'opc',
          rating: reviewRating,
          comment: reviewComment,
        })
      }
    } else {
      // 验收不通过，返回进行中
      updatedProject.status = '进行中'
      updatedProject.reviewComment = reviewComment
    }
    
    setProject(updatedProject)
    saveProject(updatedProject)
    setShowReviewModal(false)
    setReviewComment('')
    
    toast.success(approved ? '验收通过，请支付尾款' : '已退回修改')
  }

  // 处理支付
  const handlePayment = () => {
    const updatedProject = { ...project }
    const price = parseInt(project.budget?.replace(/[^0-9]/g, '') || 0)
    const depositRatio = 0.3
    const depositAmount = Math.round(price * depositRatio)
    const finalAmount = price - depositAmount
    
    if (project.status === '待启动') {
      // 支付定金
      updatedProject.paidAmount = depositAmount
      updatedProject.status = '进行中'
    } else if (project.status === '待付尾款') {
      // 支付尾款
      updatedProject.paidAmount = price
      updatedProject.status = '已完成'
      updatedProject.completedDate = new Date().toISOString()
    }
    
    setProject(updatedProject)
    saveProject(updatedProject)
    setShowPaymentModal(false)
  }

  // 处理文件上传
  const handleFileUpload = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploading(true)
    
    // 模拟上传过程
    setTimeout(() => {
      const newDeliverables = Array.from(files).map((file, idx) => ({
        id: Date.now() + idx,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
        date: new Date().toISOString().split('T')[0],
        type: file.type.includes('image') ? 'image' : 'document',
        url: URL.createObjectURL(file)
      }))
      
      const updatedProject = {
        ...project,
        deliverables: [...(project.deliverables || []), ...newDeliverables]
      }
      
      setProject(updatedProject)
      saveProject(updatedProject)
      setUploading(false)
    }, 1500)
  }

  // 处理文件下载
  const handleDownload = (file) => {
    if (file.url) {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      link.click()
    }
  }

  if (loading || !project) {
    return <PageLoading message="加载项目数据..." />
  }

  return (
    <div className="project-workspace">
      {/* Header */}
      <div className="workspace-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          返回
        </button>
        <div className="project-title">
          <h1>{project.name}</h1>
          <span className={`status-badge ${project.status === '进行中' ? 'active' : ''}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Info Card */}
      <div className="project-info-card">
        <div className="info-grid">
          <div className="info-item">
            <label>项目类型</label>
            <span>{project.type}</span>
          </div>
          <div className="info-item">
            <label>项目预算</label>
            <span className="budget">{project.budget}</span>
          </div>
          <div className="info-item">
            <label>项目周期</label>
            <span>{project.duration}</span>
          </div>
          <div className="info-item">
            <label>启动日期</label>
            <span>{project.startDate}</span>
          </div>
          <div className="info-item">
            <label>企业客户</label>
            <span>{project.client}</span>
          </div>
          <div className="info-item">
            <label>负责OPC</label>
            <span className="opc-name">{project.opc}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="workspace-tabs">
        <button 
          className={`tab-btn ${activeTab === 'milestones' ? 'active' : ''}`}
          onClick={() => setActiveTab('milestones')}
        >
          <Clock size={18} />
          项目里程碑
        </button>
        <button 
          className={`tab-btn ${activeTab === 'deliverables' ? 'active' : ''}`}
          onClick={() => setActiveTab('deliverables')}
        >
          <FileText size={18} />
          交付物管理
        </button>
        <button 
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <MessageSquare size={18} />
          沟通记录
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'milestones' && (
          <div className="milestones-section">
            <div className="section-header">
              <h3>项目进度时间线</h3>
              <div className="progress-badge">
                <span className="progress-label">总进度</span>
                <span className="progress-value">{project.progress || 0}%</span>
              </div>
            </div>
            
            {/* 总进度条 */}
            <div className="overall-progress">
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
            </div>
            
            <div className="timeline">
              {project.milestones?.map((milestone, index) => (
                <div 
                  key={milestone.id} 
                  className={`timeline-item ${milestone.status}`}
                >
                  <div className="timeline-marker">
                    {milestone.status === 'completed' ? (
                      <CheckCircle size={24} className="completed-icon" />
                    ) : milestone.status === 'in_progress' ? (
                      <Clock size={24} className="progress-icon" />
                    ) : (
                      <div className="pending-dot" />
                    )}
                  </div>
                  <div className="timeline-content">
                    <div className="milestone-header">
                      <h4>{milestone.name}</h4>
                      <span className={`milestone-status-badge ${milestone.status}`}>
                        {milestone.status === 'completed' ? '已完成' : 
                         milestone.status === 'in_progress' ? '进行中' : '待开始'}
                      </span>
                    </div>
                    <p className="milestone-desc">{milestone.description}</p>
                    {milestone.date && (
                      <span className="milestone-date">完成日期: {milestone.date}</span>
                    )}
                    {milestone.status === 'in_progress' && project.status === '进行中' && (
                      <button 
                        className="complete-btn"
                        onClick={() => handleMilestoneComplete(milestone.id)}
                      >
                        <CheckCircle size={16} />
                        确认完成
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deliverables' && (
          <div className="deliverables-section">
            <h3>项目交付物</h3>
            <div className="upload-area">
              {uploading ? (
                <div className="uploading-state">
                  <Loader2 size={32} className="spin" />
                  <p>正在上传...</p>
                </div>
              ) : (
                <>
                  <Upload size={32} />
                  <p>拖拽文件到此处上传，或点击选择文件</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="upload-btn">
                    选择文件
                  </label>
                </>
              )}
            </div>
            <div className="deliverables-list">
              {project.deliverables?.length === 0 ? (
                <div className="no-deliverables">
                  <FileText size={48} />
                  <p>暂无交付物</p>
                </div>
              ) : (
                project.deliverables?.map(file => (
                  <div key={file.id} className="deliverable-item">
                    <div className="file-info">
                      <FileText size={24} />
                      <div>
                        <span className="file-name">{file.name}</span>
                        <span className="file-meta">{file.size} · {file.date}</span>
                      </div>
                    </div>
                    <button className="download-btn" onClick={() => handleDownload(file)}>
                      <Download size={18} />
                      下载
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-section">
            <h3>项目沟通记录</h3>
            <div className="messages-list">
              {messages.length === 0 ? (
                <div className="no-messages">暂无沟通记录</div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`message-item ${msg.sender === '企业' ? 'self' : ''}`}>
                    <div className="message-avatar">{msg.avatar}</div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="sender">{msg.sender}</span>
                        <span className="time">{msg.time}</span>
                      </div>
                      <p className="message-text">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="message-input-area">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="输入消息..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Project Actions */}
      <div className="project-actions">
        <div className="action-card">
          <h3>
            <Package size={20} />
            项目状态管理
          </h3>
          <div className="status-flow">
            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
              <div 
                key={status}
                className={`status-node ${project.status === status ? 'active' : ''} ${config.next.includes(project.status) ? 'reachable' : ''}`}
                style={{
                  backgroundColor: project.status === status ? config.bgColor : 'transparent',
                  borderColor: project.status === status ? config.borderColor : 'rgba(255,255,255,0.1)',
                  color: project.status === status ? config.color : '#64748b'
                }}
              >
                <span className="status-name">{status}</span>
              </div>
            ))}
          </div>
          
          {/* 状态流转按钮 */}
          <div className="status-actions">
            {project.status === '待启动' && (
              <button 
                className="action-btn primary"
                onClick={() => setShowPaymentModal(true)}
              >
                <CreditCard size={18} />
                支付定金并启动项目
              </button>
            )}
            
            {project.status === '进行中' && (
              <button 
                className="action-btn primary"
                onClick={() => handleStatusChange('待验收')}
              >
                <FileCheck size={18} />
                提交验收
              </button>
            )}
            
            {project.status === '待验收' && (
              <>
                <button 
                  className="action-btn success"
                  onClick={() => setShowReviewModal(true)}
                >
                  <CheckSquare size={18} />
                  验收通过
                </button>
                <button 
                  className="action-btn warning"
                  onClick={() => handleReviewConfirm(false)}
                >
                  <AlertCircle size={18} />
                  验收不通过，返回修改
                </button>
              </>
            )}
            
            {project.status === '待付尾款' && (
              <button 
                className="action-btn primary"
                onClick={() => setShowPaymentModal(true)}
              >
                <CreditCard size={18} />
                支付尾款
              </button>
            )}
            
            {project.status === '已完成' && (
              <>
                <div className="completion-badge">
                  <CheckCircle size={24} />
                  <span>项目已完成</span>
                </div>
                <button 
                  className="action-btn primary"
                  onClick={() => navigate(`/rating?projectId=${project.id}&type=opc`)}
                >
                  <Star size={18} />
                  评价OPC创作者
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="payment-section">
        <h3>
          <DollarSign size={20} />
          项目结算
        </h3>
        <div className="payment-info">
          <div className="payment-item">
            <span>项目总金额</span>
            <strong>{project.budget}</strong>
          </div>
          <div className="payment-item">
            <span>已支付金额</span>
            <strong style={{ color: '#10b981' }}>
              ¥{(project.paidAmount || 0).toLocaleString()}
            </strong>
          </div>
          <div className="payment-item">
            <span>待支付金额</span>
            <strong className="pending">
              ¥{((parseInt(project.budget?.replace(/[^0-9]/g, '') || 0) - (project.paidAmount || 0))).toLocaleString()}
            </strong>
          </div>
        </div>
        
        {/* 支付进度条 */}
        <div className="payment-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${((project.paidAmount || 0) / parseInt(project.budget?.replace(/[^0-9]/g, '') || 1)) * 100}%` 
              }}
            />
          </div>
          <span className="progress-text">
            {Math.round(((project.paidAmount || 0) / parseInt(project.budget?.replace(/[^0-9]/g, '') || 1)) * 100)}% 已支付
          </span>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <CreditCard size={24} />
                {project.status === '待启动' ? '支付定金' : '支付尾款'}
              </h3>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="payment-summary">
                <div className="summary-row">
                  <span>项目总金额</span>
                  <strong>{project.budget}</strong>
                </div>
                <div className="summary-row">
                  <span>已支付</span>
                  <strong>¥{(project.paidAmount || 0).toLocaleString()}</strong>
                </div>
                <div className="summary-row total">
                  <span>本次支付</span>
                  <strong>
                    ¥{project.status === '待启动' 
                      ? Math.round(parseInt(project.budget?.replace(/[^0-9]/g, '') || 0) * 0.3).toLocaleString()
                      : (parseInt(project.budget?.replace(/[^0-9]/g, '') || 0) - (project.paidAmount || 0)).toLocaleString()
                    }
                  </strong>
                </div>
              </div>
              <div className="payment-methods">
                <label className="payment-method active">
                  <input type="radio" name="payment" defaultChecked />
                  <span>企业钱包</span>
                </label>
                <label className="payment-method">
                  <input type="radio" name="payment" />
                  <span>银行转账</span>
                </label>
                <label className="payment-method">
                  <input type="radio" name="payment" />
                  <span>支付宝</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPaymentModal(false)}>
                取消
              </button>
              <button className="btn-primary" onClick={handlePayment}>
                确认支付
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <CheckSquare size={24} />
                项目验收
              </h3>
              <button className="close-btn" onClick={() => setShowReviewModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="review-section">
                <label>验收评分</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`star ${star <= reviewRating ? 'active' : ''}`}
                      onClick={() => setReviewRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="review-section">
                <label>验收意见</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="请输入验收意见..."
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowReviewModal(false)}>
                取消
              </button>
              <button className="btn-primary" onClick={() => handleReviewConfirm(true)}>
                确认验收通过
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectWorkspace
