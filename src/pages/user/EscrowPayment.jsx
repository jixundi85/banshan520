import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// 资金托管支付系统
export default function EscrowPayment() {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [milestones, setMilestones] = useState([])
  const [paymentStep, setPaymentStep] = useState(1)
  useEffect(() => {
    // 模拟加载项目数据
    const mockProject = {
      id: projectId || 'P001',
      name: '科技公司品牌宣传片制作',
      budget: 8000,
      opc: { name: '创意工坊', level: 'L3', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator1' },
      status: '待付款'
    }
    setProject(mockProject)
    // 默认里程碑
    setMilestones([
      { id: 1, name: '项目启动', percent: 30, amount: 2400, status: 'pending', desc: '确认需求，启动项目' },
      { id: 2, name: '初稿交付', percent: 40, amount: 3200, status: 'pending', desc: '提交初稿，客户审核' },
      { id: 3, name: '终稿验收', percent: 30, amount: 2400, status: 'pending', desc: '修改完善，最终交付' },
    ])
  }, [projectId])
  const handlePay = () => {
    // 模拟支付
    alert(`支付成功！项目资金已托管至平台\n项目：${project.name}\n总金额：¥${project.budget}`)
    navigate('/user/projects')
  }
  if (!project) return null
  return (
    
      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* 步骤指示 */}
          <div className="flex items-center justify-center mb-8">
            {['确认订单', '资金托管', '项目启动'].map((step, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  paymentStep > i + 1 ? 'bg-emerald-500 text-white' : 
                  paymentStep === i + 1 ? 'bg-violet-500 text-white' : 'bg-white/10 text-gray-400'
                }`}>
                  {paymentStep > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`ml-2 text-sm ${paymentStep === i + 1 ? 'text-white' : 'text-gray-400'}`}>
                  {step}
                </span>
                {i < 2 && <div className="w-12 h-px bg-white/10 mx-4" />}
              </div>
            ))}
          </div>
          {/* 项目信息 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">项目信息</h2>
            <div className="flex items-center gap-4 mb-4">
              <img src={project.opc.avatar} alt="" className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="text-white font-medium">{project.name}</h3>
                <p className="text-gray-400 text-sm">{project.opc.name} · {project.opc.level}</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-white/10">
              <span className="text-gray-400">项目预算</span>
              <span className="text-2xl font-bold text-violet-400">¥{project.budget}</span>
            </div>
          </div>
          {/* 里程碑付款计划 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">里程碑付款计划</h2>
            <div className="space-y-4">
              {milestones.map((m, i) => (
                <div key={m.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center text-violet-400 font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium">{m.name}</h4>
                      <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400">{m.percent}%</span>
                    </div>
                    <p className="text-gray-500 text-sm">{m.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">¥{m.amount}</p>
                    <p className="text-xs text-gray-500">验收后释放</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 支付安全说明 */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 text-xl">🔒</span>
              <div>
                <h4 className="text-emerald-400 font-medium mb-1">资金托管保障</h4>
                <p className="text-gray-400 text-sm">您的资金将由平台托管，按里程碑验收后逐步释放给创作者，确保双方权益。</p>
              </div>
            </div>
          </div>
          {/* 支付按钮 */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            >
              取消
            </button>
            <button
              onClick={handlePay}
              className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all"
            >
              确认支付 ¥{project.budget}
            </button>
          </div>
        </div>
      </div>
    
  )
}
