import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, CheckCircle, ArrowRight, User, Briefcase, FileText, Award } from 'lucide-react'
export default function CertificationApply() {
  const navigate = useNavigate()
  const [assessmentResult, setAssessmentResult] = useState(null)
  const [formData, setFormData] = useState({
    realName: '',
    phone: '',
    email: '',
    idCard: '',
    bio: '',
    skills: [],
    portfolio: [],
    experience: '',
    hourlyRate: '',
    agreeTerms: false
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const skillOptions = [
    'AI广告创作', 'AI电影制作', 'AI漫剧制作', 'AI短剧创作',
    'AI UI设计', '智能体搭建', 'AI工作流设计', '内容策划',
    '视频剪辑', '文案创作', '数据分析', '项目管理'
  ]
  useEffect(() => {
    const result = JSON.parse(localStorage.getItem('opc_assessment_result') || '{}')
    if (!result.level || result.level === 'L0') {
      navigate('/opc-assessment')
      return
    }
    setAssessmentResult(result)
  }, [navigate])
  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }
  const handleSubmit = async () => {
    setIsSubmitting(true)
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 保存申请记录
    const application = {
      ...formData,
      assessmentLevel: assessmentResult?.level,
      assessmentScore: assessmentResult?.scores,
      applyTime: new Date().toISOString(),
      status: 'pending'
    }
    localStorage.setItem('opc_certification_application', JSON.stringify(application))
    
    setIsSubmitting(false)
    setSubmitSuccess(true)
  }
  if (submitSuccess) {
    return (
      
        <div className="min-h-screen bg-slate-900 py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">申请提交成功！</h1>
            <p className="text-gray-400 mb-8">
              你的认证申请已提交，我们的审核团队将在3个工作日内完成审核。<br/>
              审核通过后，你将正式成为认证职业OPC，可以开始接单变现。
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/opc-profile')}
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl"
              >
                查看我的档案
              </button>
              <button
                onClick={() => navigate('/training')}
                className="px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl"
              >
                先去学习课程
              </button>
            </div>
          </div>
        </div>
      
    )
  }
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">申请认证职业OPC</h3>
            <p className="text-cyan-400 text-sm">
              评估等级: {assessmentResult?.levelName} ({assessmentResult?.level})
            </p>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">真实姓名 *</label>
          <input
            type="text"
            value={formData.realName}
            onChange={(e) => setFormData({...formData, realName: e.target.value})}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
            placeholder="请输入真实姓名"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">联系电话 *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
            placeholder="请输入手机号"
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-400 text-sm mb-2">电子邮箱 *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
          placeholder="请输入邮箱地址"
        />
      </div>
      <div>
        <label className="block text-gray-400 text-sm mb-2">身份证号 *</label>
        <input
          type="text"
          value={formData.idCard}
          onChange={(e) => setFormData({...formData, idCard: e.target.value})}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
          placeholder="用于实名认证"
        />
      </div>
      <div>
        <label className="block text-gray-400 text-sm mb-2">个人简介 *</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none resize-none"
          placeholder="介绍你的专业背景、擅长领域和创作理念..."
        />
      </div>
      <button
        onClick={() => setCurrentStep(2)}
        disabled={!formData.realName || !formData.phone || !formData.email || !formData.idCard || !formData.bio}
        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span>下一步</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-white font-semibold mb-4">选择你的技能标签 *</label>
        <p className="text-gray-400 text-sm mb-4">选择你擅长的领域，这将影响系统对你的需求匹配</p>
        <div className="flex flex-wrap gap-3">
          {skillOptions.map(skill => (
            <button
              key={skill}
              onClick={() => handleSkillToggle(skill)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                formData.skills.includes(skill)
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-white font-semibold mb-4">作品集 *</label>
        <p className="text-gray-400 text-sm mb-4">上传你的代表作品，至少3个（支持图片、视频链接、文档）</p>
        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer">
          <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">点击或拖拽上传作品</p>
          <p className="text-gray-500 text-sm">支持 JPG, PNG, MP4, PDF 格式</p>
        </div>
      </div>
      <div>
        <label className="block text-gray-400 text-sm mb-2">从业经历</label>
        <textarea
          value={formData.experience}
          onChange={(e) => setFormData({...formData, experience: e.target.value})}
          rows={3}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none resize-none"
          placeholder="描述你的相关工作经验..."
        />
      </div>
      <div>
        <label className="block text-gray-400 text-sm mb-2">服务报价（元/小时）*</label>
        <input
          type="number"
          value={formData.hourlyRate}
          onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
          placeholder="例如: 500"
        />
        <p className="text-gray-500 text-sm mt-2">
          参考: L1级建议200-500元/小时，L2级500-1000元/小时，L3级1000-2000元/小时
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex-1 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
        >
          上一步
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          disabled={formData.skills.length === 0 || !formData.hourlyRate}
          className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>下一步</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">申请信息确认</h3>
        
        <div className="space-y-4 text-sm">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">真实姓名</span>
            <span className="text-white">{formData.realName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">联系电话</span>
            <span className="text-white">{formData.phone}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">电子邮箱</span>
            <span className="text-white">{formData.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">评估等级</span>
            <span className="text-cyan-400">{assessmentResult?.levelName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">技能标签</span>
            <span className="text-white">{formData.skills.join(', ')}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">服务报价</span>
            <span className="text-white">¥{formData.hourlyRate}/小时</span>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="agree"
          checked={formData.agreeTerms}
          onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
          className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
        />
        <label htmlFor="agree" className="text-gray-400 text-sm">
          我已阅读并同意《OPC服务协议》和《平台规则》，承诺提供真实信息，
          遵守平台规范，保证服务质量。
        </label>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex-1 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
        >
          上一步
        </button>
        <button
          onClick={handleSubmit}
          disabled={!formData.agreeTerms || isSubmitting}
          className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '提交中...' : '提交申请'}
        </button>
      </div>
    </div>
  )
  return (
    
      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">签约认证职业OPC</h1>
            <p className="text-gray-400">填写信息，申请成为平台认证创作者</p>
          </div>
          {/* 步骤指示器 */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
          {/* 步骤标签 */}
          <div className="flex justify-center gap-8 mb-8 text-sm">
            <span className={currentStep === 1 ? 'text-cyan-400' : 'text-gray-500'}>基本信息</span>
            <span className={currentStep === 2 ? 'text-cyan-400' : 'text-gray-500'}>技能作品</span>
            <span className={currentStep === 3 ? 'text-cyan-400' : 'text-gray-500'}>确认提交</span>
          </div>
          {/* 表单内容 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
        </div>
      </div>
    
  )
}
