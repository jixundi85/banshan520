import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, CheckCircle, Clock, CreditCard, MessageSquare, 
  FileText, ArrowRight, AlertCircle, User, Calendar,
  DollarSign, Percent, Shield, Sparkles
} from 'lucide-react'

// 项目状态配置
const PROJECT_STATUS = {
  pending: { 
    label: '待接单', 
    color: 'text-amber-400', 
    bg: 'bg-amber-500/15', 
    border: 'border-amber-500/30', 
    icon: '⏳',
    desc: '平台正在为您匹配最合适的OPC创作者',
    action: null
  },
  deposit: { 
    label: '待付定金', 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/15', 
    border: 'border-blue-500/30', 
    icon: '💳',
    desc: '支付项目定金后，OPC将立即启动项目',
    action: { label: '支付定金', primary: true }
  },
  inprogress: { 
    label: '进行中', 
    color: 'text-indigo-400', 
    bg: 'bg-indigo-500/15', 
    border: 'border-indigo-500/30', 
    icon: '🔥',
    desc: 'OPC正在按计划执行项目，可实时沟通',
    action: { label: '进入工作台', primary: true }
  },
  review: { 
    label: '待验收', 
    color: 'text-violet-400', 
    bg: 'bg-violet-500/15', 
    border: 'border-violet-500/30', 
    icon: '👀',
    desc: 'OPC已提交交付物，请查看并确认验收',
    action: { label: '查看交付物', primary: true }
  },
  final: { 
    label: '待付尾款', 
    color: 'text-pink-400', 
    bg: 'bg-pink-500/15', 
    border: 'border-pink-500/30', 
    icon: '💰',
    desc: '验收通过后，支付尾款获取全部交付物',
    action: { label: '支付尾款', primary: true }
  },
  completed: { 
    label: '已完成', 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500/15', 
    border: 'border-emerald-500/30', 
    icon: '✅',
    desc: '项目已圆满结束，感谢您的信任',
    action: { label: '查看评价', primary: false }
  }
}

export default function ProjectDetailModal({ isOpen, onClose, project, onUpdate }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentType, setPaymentType] = useState(null) // 'deposit' | 'final'

  if (!isOpen || !project) return null

  const status = PROJECT_STATUS[project.status] || PROJECT_STATUS.pending
  const depositAmount = Math.round(project.price * (project.deposit || 0.3))
  const finalAmount = project.price - depositAmount
  const progress = project.progress || 0

  // 处理主要操作
  const handlePrimaryAction = () => {
    switch(project.status) {
      case 'deposit':
        setPaymentType('deposit')
        setShowPaymentModal(true)
        break
      case 'final':
        setPaymentType('final')
        setShowPaymentModal(true)
        break
      case 'inprogress':
      case 'review':
        // 跳转到项目工作台
        navigate(`/project/${project.id}`)
        onClose()
        break
      case 'completed':
        setActiveTab('review')
        break
      default:
        break
    }
  }

  // 处理支付
  const handlePayment = () => {
    const newStatus = paymentType === 'deposit' ? 'inprogress' : 'completed'
    const updatedProject = {
      ...project,
      status: newStatus,
      progress: paymentType === 'deposit' ? 10 : 100,
      paidAmount: (project.paidAmount || 0) + (paymentType === 'deposit' ? depositAmount : finalAmount)
    }
    
    // 更新localStorage
    const projects = JSON.parse(localStorage.getItem('myProjects') || '[]')
    const index = projects.findIndex(p => p.id === project.id)
    if (index >= 0) {
      projects[index] = updatedProject
      localStorage.setItem('myProjects', JSON.stringify(projects))
    }
    
    onUpdate(updatedProject)
    setShowPaymentModal(false)
  }

  // 模拟里程碑数据
  const milestones = project.milestones || [
    { id: 1, name: '项目启动', status: project.status !== 'pending' && project.status !== 'deposit' ? 'completed' : 'pending', date: project.createdAt },
    { id: 2, name: '需求确认', status: progress >= 20 ? 'completed' : progress >= 10 ? 'inprogress' : 'pending', date: null },
    { id: 3, name: '初稿交付', status: progress >= 50 ? 'completed' : progress >= 30 ? 'inprogress' : 'pending', date: null },
    { id: 4, name: '修改完善', status: progress >= 80 ? 'completed' : progress >= 60 ? 'inprogress' : 'pending', date: null },
    { id: 5, name: '最终交付', status: progress >= 100 ? 'completed' : progress >= 90 ? 'inprogress' : 'pending', date: null }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* 弹窗内容 */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${status.bg} ${status.border} border flex items-center justify-center text-2xl`}>
              {status.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{project.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${status.bg} ${status.color} ${status.border} border`}>
                  {status.label}
                </span>
                <span className="text-gray-500 text-sm">项目编号: {project.id}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 主体内容 */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* 左侧：项目信息 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tab导航 */}
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                {[
                  { id: 'overview', label: '项目概览', icon: FileText },
                  { id: 'milestones', label: '里程碑', icon: Calendar },
                  { id: 'deliverables', label: '交付物', icon: CheckCircle },
                  { id: 'messages', label: '沟通记录', icon: MessageSquare }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab内容 */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* 状态说明 */}
                  <div className={`p-5 rounded-2xl ${status.bg} ${status.border} border`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 ${status.color} flex-shrink-0 mt-0.5`} />
                      <div>
                        <p className={`font-medium ${status.color}`}>当前状态：{status.label}</p>
                        <p className="text-gray-400 text-sm mt-1">{status.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* 项目信息卡片 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-500 text-xs mb-1">项目金额</p>
                      <p className="text-2xl font-bold text-white">¥{project.price?.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-500 text-xs mb-1">预计周期</p>
                      <p className="text-2xl font-bold text-white">{project.duration || '待定'}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-500 text-xs mb-1">已支付</p>
                      <p className="text-2xl font-bold text-emerald-400">¥{(project.paidAmount || 0).toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-500 text-xs mb-1">待支付</p>
                      <p className="text-2xl font-bold text-amber-400">¥{(project.price - (project.paidAmount || 0)).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">项目进度</span>
                      <span className="text-white font-medium">{progress}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'milestones' && (
                <div className="space-y-4">
                  {milestones.map((milestone, idx) => (
                    <div key={milestone.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          milestone.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          milestone.status === 'inprogress' ? 'bg-indigo-500/20 text-indigo-400' :
                          'bg-white/5 text-gray-500'
                        }`}>
                          {milestone.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                           milestone.status === 'inprogress' ? <Clock className="w-5 h-5" /> :
                           <span className="text-sm">{idx + 1}</span>}
                        </div>
                        {idx < milestones.length - 1 && (
                          <div className={`w-0.5 flex-1 my-2 ${
                            milestone.status === 'completed' ? 'bg-emerald-500/30' : 'bg-white/10'
                          }`}></div>
                        )}
                      </div>
                      <div className={`flex-1 pb-6 ${
                        milestone.status === 'completed' ? 'opacity-100' :
                        milestone.status === 'inprogress' ? 'opacity-100' : 'opacity-50'
                      }`}>
                        <h4 className="text-white font-medium">{milestone.name}</h4>
                        <p className="text-gray-500 text-sm mt-1">
                          {milestone.status === 'completed' ? '已完成' :
                           milestone.status === 'inprogress' ? '进行中' : '待开始'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'deliverables' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400">
                    {project.status === 'completed' ? '交付物已解锁，可下载查看' :
                     project.status === 'final' || project.status === 'review' ? '交付物待验收后解锁' :
                     '项目进行中，暂无交付物'}
                  </p>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-4">进入工作台查看完整沟通记录</p>
                  <button 
                    onClick={() => { navigate(`/project/${project.id}`); onClose() }}
                    className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all"
                  >
                    进入工作台
                  </button>
                </div>
              )}
            </div>

            {/* 右侧：操作面板 */}
            <div className="space-y-4">
              {/* 主要操作按钮 */}
              {status.action && (
                <button
                  onClick={handlePrimaryAction}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    status.action.primary
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {status.action.label}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* 支付信息 */}
              {(project.status === 'deposit' || project.status === 'final') && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm mb-3">支付信息</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">项目总额</span>
                      <span className="text-white">¥{project.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">定金比例</span>
                      <span className="text-white">{Math.round((project.deposit || 0.3) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">定金金额</span>
                      <span className="text-emerald-400">¥{depositAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <span className="text-gray-500">尾款金额</span>
                      <span className="text-amber-400">¥{finalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 平台保障 */}
              <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-medium">平台保障</span>
                </div>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>• 资金托管，安全有保障</li>
                  <li>• 不满意可申请退款</li>
                  <li>• 专业客服全程跟进</li>
                </ul>
              </div>

              {/* 创作者信息 */}
              {project.opc && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm mb-3">负责创作者</p>
                  <div className="flex items-center gap-3">
                    <img src={project.opc.avatar} alt={project.opc.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-white font-medium">{project.opc.name}</p>
                      <p className="text-gray-500 text-xs">{project.opc.title}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 支付弹窗 */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}></div>
          <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-2">
              {paymentType === 'deposit' ? '支付项目定金' : '支付项目尾款'}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {paymentType === 'deposit' 
                ? '支付定金后，平台将立即通知OPC启动项目' 
                : '支付尾款后，可获取全部交付物并评价'}
            </p>
            
            <div className="text-center py-6 mb-6">
              <p className="text-gray-400 text-sm mb-2">支付金额</p>
              <p className="text-4xl font-bold text-white">
                ¥{(paymentType === 'deposit' ? depositAmount : finalAmount).toLocaleString()}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePayment}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                确认支付
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-4 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
