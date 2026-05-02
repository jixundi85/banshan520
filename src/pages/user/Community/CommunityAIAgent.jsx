/**
 * 碳硅共生交流群 - AI员工模块（智能团队）
 * 模拟真实AI员工团队，展示工作状态和进度
 */
import { useState, useEffect } from 'react'
import { Sparkles, Clock, CheckCircle2, AlertCircle, MessageSquare, Star, ChevronRight, X, Search, RefreshCw, TrendingUp } from 'lucide-react'
import './CommunityAIAgent.css'

// ============ AI员工数据 ============
const AI_EMPLOYEES = [
  // 管理层
  { id: 'e01', name: '豆包', avatar: '🥟', role: '运营总监', dept: '运营部', status: 'online', task: '审核今日悬赏任务', progress: 85, skills: ['内容运营', '数据分析'], performance: 98 },
  { id: 'e02', name: 'GPT-4', avatar: '🤖', role: '技术总监', dept: '技术部', status: 'online', task: '优化AI员工学习算法', progress: 67, skills: ['算法优化', '模型训练'], performance: 96 },
  { id: 'e03', name: '文心一言', avatar: '📝', role: '内容总监', dept: '内容部', status: 'online', task: '撰写AIGC行业日报', progress: 92, skills: ['内容创作', '文案策划'], performance: 95 },
  
  // 内容部
  { id: 'e04', name: 'Kimi', avatar: '🧠', role: '资深编辑', dept: '内容部', status: 'online', task: '整理用户反馈问题', progress: 78, skills: ['内容编辑', '用户洞察'], performance: 94 },
  { id: 'e05', name: '通义千问', avatar: '❓', role: '问答专家', dept: '内容部', status: 'busy', task: '处理创作者咨询(23条)', progress: 65, skills: ['问答服务', '知识库'], performance: 91 },
  { id: 'e06', name: '智谱AI', avatar: '📊', role: '数据分析师', dept: '内容部', status: 'online', task: '分析本周课程数据', progress: 45, skills: ['数据分析', '报表生成'], performance: 93 },
  
  // 技术部
  { id: 'e07', name: 'Claude', avatar: '🎨', role: 'UI设计师', dept: '技术部', status: 'online', task: '设计新版首页布局', progress: 88, skills: ['UI设计', '交互设计'], performance: 97 },
  { id: 'e08', name: 'Midjourney', avatar: '🖼️', role: 'AI画师', dept: '技术部', status: 'busy', task: '生成品牌宣传素材(8张)', progress: 75, skills: ['AI绘画', '图像生成'], performance: 99 },
  { id: 'e09', name: 'Stable Diffusion', avatar: '⚡', role: '图像工程师', dept: '技术部', status: 'online', task: '优化模型推理速度', progress: 56, skills: ['模型优化', '图像处理'], performance: 92 },
  { id: 'e10', name: 'Runway', avatar: '🎬', role: '视频工程师', dept: '技术部', status: 'away', task: '处理视频生成任务队列', progress: 34, skills: ['视频生成', '后期处理'], performance: 88 },
  
  // 运营部
  { id: 'e11', name: '即梦', avatar: '💭', role: '营销策划', dept: '运营部', status: 'online', task: '策划五一活动方案', progress: 72, skills: ['活动策划', '营销推广'], performance: 94 },
  { id: 'e12', name: '可灵', avatar: '🎭', role: '短视频运营', dept: '运营部', status: 'online', task: '剪辑今日热点视频', progress: 90, skills: ['短视频运营', '内容剪辑'], performance: 96 },
  { id: 'e13', name: '海螺AI', avatar: '🐚', role: '用户运营', dept: '运营部', status: 'busy', task: '私信回复(45条未读)', progress: 58, skills: ['用户运营', '社群管理'], performance: 90 },
  
  // 客服部
  { id: 'e14', name: '讯飞星火', avatar: '🔥', role: '高级客服', dept: '客服部', status: 'online', task: '解答课程购买咨询', progress: 83, skills: ['客户服务', '问题诊断'], performance: 95 },
  { id: 'e15', name: '腾讯混元', avatar: '🐧', role: '技术支持', dept: '客服部', status: 'online', task: '排查创作者登录问题', progress: 41, skills: ['技术支持', '故障排查'], performance: 89 },
]

// ============ 工作动态 ============
const WORK_UPDATES = [
  { id: 'w1', employee: '豆包', avatar: '🥟', action: '完成了', target: '悬赏任务审核 #103', time: '3分钟前' },
  { id: 'w2', employee: 'Claude', avatar: '🎨', action: '发布了', target: '新版UI设计稿 v2.1', time: '8分钟前' },
  { id: 'w3', employee: '即梦', avatar: '💭', action: '提交了', target: '五一活动初版方案', time: '15分钟前' },
  { id: 'w4', employee: '可灵', avatar: '🎭', action: '生成了', target: '今日热点短视频 x3', time: '23分钟前' },
  { id: 'w5', employee: 'GPT-4', avatar: '🤖', action: '优化了', target: 'AI员工响应速度 +15%', time: '32分钟前' },
  { id: 'w6', employee: 'Midjourney', avatar: '🖼️', action: '完成了', target: '品牌素材包 x12', time: '45分钟前' },
]

// ============ 公告数据 ============
const ANNOUNCEMENTS = [
  { id: 'a1', title: '🎉 五一活动即将上线', content: '为庆祝五一劳动节，我们将推出一系列优惠活动，最高可享5折优惠！', time: '1小时前' },
  { id: 'a2', title: '📢 新课程上线通知', content: '《AI广告片商业制作实战》课程已上线，欢迎大家学习！', time: '3小时前' },
  { id: 'a3', title: '🔥 悬赏任务更新', content: '新增3个高额悬赏任务，总奖金池超过5000元！', time: '5小时前' },
]

export default function CommunityAIAgent() {
  const [employees, setEmployees] = useState(AI_EMPLOYEES)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [activeTab, setActiveTab] = useState('team')
  const [deptFilter, setDeptFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAnnouncement, setShowAnnouncement] = useState(ANNOUNCEMENTS[0])

  // 筛选员工
  const filteredEmployees = employees.filter(emp => {
    if (deptFilter !== 'all' && emp.dept !== deptFilter) return false
    if (statusFilter !== 'all' && emp.status !== statusFilter) return false
    if (searchQuery && !emp.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // 部门统计
  const deptStats = {
    '运营部': employees.filter(e => e.dept === '运营部').length,
    '技术部': employees.filter(e => e.dept === '技术部').length,
    '内容部': employees.filter(e => e.dept === '内容部').length,
    '客服部': employees.filter(e => e.dept === '客服部').length,
  }

  // 在线统计
  const onlineStats = {
    online: employees.filter(e => e.status === 'online').length,
    busy: employees.filter(e => e.status === 'busy').length,
    away: employees.filter(e => e.status === 'away').length,
    offline: employees.filter(e => e.status === 'offline').length,
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'away': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return '在线'
      case 'busy': return '工作中'
      case 'away': return '离开'
      default: return '离线'
    }
  }

  const getDeptColor = (dept) => {
    switch (dept) {
      case '运营部': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
      case '技术部': return 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
      case '内容部': return 'from-green-500/20 to-emerald-500/20 border-green-500/30'
      case '客服部': return 'from-orange-500/20 to-amber-500/20 border-orange-500/30'
      default: return ''
    }
  }

  return (
    <div className="ai-agent-page">
      <div className="ai-agent-content">
        {/* 顶部公告栏 */}
        {showAnnouncement && (
          <div className="announcement-bar">
            <div className="announcement-content">
              <span className="announcement-icon">📢</span>
              <span className="announcement-text">{showAnnouncement.title}</span>
              <span className="announcement-time">{showAnnouncement.time}</span>
            </div>
            <button className="announcement-close" onClick={() => {
              const idx = ANNOUNCEMENTS.findIndex(a => a.id === showAnnouncement.id)
              setShowAnnouncement(ANNOUNCEMENTS[(idx + 1) % ANNOUNCEMENTS.length])
            }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* 顶部统计卡片 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon bg-green-500/20 text-green-400">🟢</div>
            <div className="stat-info">
              <span className="stat-value">{onlineStats.online}</span>
              <span className="stat-label">在线</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-yellow-500/20 text-yellow-400">🟡</div>
            <div className="stat-info">
              <span className="stat-value">{onlineStats.busy}</span>
              <span className="stat-label">工作中</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-orange-500/20 text-orange-400">🟠</div>
            <div className="stat-info">
              <span className="stat-value">{onlineStats.away}</span>
              <span className="stat-label">离开</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-purple-500/20 text-purple-400">🤖</div>
            <div className="stat-info">
              <span className="stat-value">{employees.length}</span>
              <span className="stat-label">员工总数</span>
            </div>
          </div>
        </div>

        {/* Tab切换 */}
        <div className="tab-bar">
          <button 
            className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            👥 团队成员
          </button>
          <button 
            className={`tab-btn ${activeTab === 'work' ? 'active' : ''}`}
            onClick={() => setActiveTab('work')}
          >
            📋 工作动态
          </button>
        </div>

        {/* 团队成员视图 */}
        {activeTab === 'team' && (
          <>
            {/* 搜索和筛选 */}
            <div className="filter-bar">
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="搜索员工..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                value={deptFilter} 
                onChange={(e) => setDeptFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">全部部门</option>
                <option value="运营部">运营部 ({deptStats['运营部']})</option>
                <option value="技术部">技术部 ({deptStats['技术部']})</option>
                <option value="内容部">内容部 ({deptStats['内容部']})</option>
                <option value="客服部">客服部 ({deptStats['客服部']})</option>
              </select>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">全部状态</option>
                <option value="online">在线</option>
                <option value="busy">忙碌中</option>
                <option value="away">离开</option>
              </select>
            </div>

            {/* 员工网格 */}
            <div className="employees-grid">
              {filteredEmployees.map(emp => (
                <div 
                  key={emp.id} 
                  className="employee-card"
                  onClick={() => setSelectedEmployee(emp)}
                >
                  {/* 头像和状态 */}
                  <div className="employee-header">
                    <div className="employee-avatar">
                      <span className="avatar-emoji">{emp.avatar}</span>
                      <span className={`status-dot ${getStatusColor(emp.status)}`}></span>
                    </div>
                    <div className="employee-dept">
                      <span className={`dept-badge ${getDeptColor(emp.dept)}`}>
                        {emp.dept}
                      </span>
                    </div>
                  </div>

                  {/* 员工信息 */}
                  <div className="employee-info">
                    <h4 className="employee-name">{emp.name}</h4>
                    <p className="employee-role">{emp.role}</p>
                  </div>

                  {/* 当前任务 */}
                  <div className="employee-task">
                    <div className="task-header">
                      <Clock size={12} />
                      <span>当前任务</span>
                    </div>
                    <p className="task-name">{emp.task}</p>
                    <div className="task-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${emp.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{emp.progress}%</span>
                    </div>
                  </div>

                  {/* 技能标签 */}
                  <div className="employee-skills">
                    {emp.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>

                  {/* 绩效 */}
                  <div className="employee-performance">
                    <TrendingUp size={12} />
                    <span>绩效 {emp.performance}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 工作动态视图 */}
        {activeTab === 'work' && (
          <div className="work-dynamics">
            <h3 className="section-title">📋 实时工作动态</h3>
            <div className="dynamics-list">
              {WORK_UPDATES.map(update => (
                <div key={update.id} className="dynamics-item">
                  <div className="dynamics-avatar">
                    <span>{update.avatar}</span>
                  </div>
                  <div className="dynamics-content">
                    <p>
                      <span className="dynamics-name">{update.employee}</span>
                      <span className="dynamics-action"> {update.action} </span>
                      <span className="dynamics-target">{update.target}</span>
                    </p>
                    <span className="dynamics-time">{update.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 快速入口 */}
            <div className="quick-actions">
              <h3 className="section-title">⚡ 快速操作</h3>
              <div className="actions-grid">
                <button className="action-btn">
                  <span className="action-icon">📝</span>
                  <span>联系客服</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">💡</span>
                  <span>建议反馈</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">📊</span>
                  <span>数据报告</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">🎯</span>
                  <span>任务中心</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 员工详情弹窗 */}
      {selectedEmployee && (
        <div className="detail-modal" onClick={() => setSelectedEmployee(null)}>
          <div className="detail-panel employee-detail" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedEmployee(null)}>
              <X size={20} />
            </button>

            {/* 头部信息 */}
            <div className="detail-header">
              <div className="detail-avatar">
                <span className="avatar-emoji large">{selectedEmployee.avatar}</span>
                <span className={`status-dot large ${getStatusColor(selectedEmployee.status)}`}></span>
              </div>
              <div className="detail-basic">
                <h2>{selectedEmployee.name}</h2>
                <p>{selectedEmployee.role} · {selectedEmployee.dept}</p>
                <span className={`status-badge ${selectedEmployee.status}`}>
                  {getStatusText(selectedEmployee.status)}
                </span>
              </div>
            </div>

            {/* 技能 */}
            <div className="detail-section">
              <h4>专业技能</h4>
              <div className="skills-list">
                {selectedEmployee.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag large">{skill}</span>
                ))}
              </div>
            </div>

            {/* 当前任务 */}
            <div className="detail-section">
              <h4>当前任务</h4>
              <div className="current-task">
                <p className="task-title">{selectedEmployee.task}</p>
                <div className="task-progress large">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${selectedEmployee.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{selectedEmployee.progress}%</span>
                </div>
              </div>
            </div>

            {/* 绩效 */}
            <div className="detail-section">
              <h4>工作绩效</h4>
              <div className="performance-display">
                <div className="performance-score">
                  <span className="score-value">{selectedEmployee.performance}</span>
                  <span className="score-max">/100</span>
                </div>
                <div className="performance-bar">
                  <div 
                    className="performance-fill" 
                    style={{ width: `${selectedEmployee.performance}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="detail-actions">
              <button className="action-btn primary">
                <MessageSquare size={16} />
                发起咨询
              </button>
              <button className="action-btn secondary">
                <Star size={16} />
                收藏员工
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
