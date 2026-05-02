import { useState, useEffect } from 'react'
import { 
  X, 
  Building2, 
  Target, 
  DollarSign, 
  Clock, 
  FileText, 
  Zap,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Briefcase,
  Tag,
  Calendar,
  Upload,
  Sparkles
} from 'lucide-react'

const CATEGORIES = [
  { id: 'ai-video', name: 'AI短视频', icon: '🎬', desc: '宣传片、广告、短视频制作' },
  { id: 'ai-drama', name: 'AI短剧', icon: '🎭', desc: '系列短剧、微短剧制作' },
  { id: 'ai-film', name: 'AI电影', icon: '🎬', desc: '微电影、动画电影制作' },
  { id: 'ai-design', name: 'AI设计师', icon: '🎨', desc: 'VI设计、海报、插画' },
  { id: 'ai-copy', name: 'AI文案', icon: '✍️', desc: '脚本、文案、剧本创作' },
  { id: 'ai-voice', name: 'AI配音', icon: '🎙️', desc: '配音、音效、音乐制作' }
]

const BUDGET_RANGES = [
  { value: '3k-5k', label: '¥3,000 - ¥5,000', desc: '小型项目' },
  { value: '5k-10k', label: '¥5,000 - ¥10,000', desc: '中型项目' },
  { value: '10k-20k', label: '¥10,000 - ¥20,000', desc: '大型项目' },
  { value: '20k-50k', label: '¥20,000 - ¥50,000', desc: '企业级项目' },
  { value: '50k+', label: '¥50,000+', desc: '定制化项目' }
]

const TIMELINES = [
  { value: '3', label: '3天内', desc: '加急', color: 'red' },
  { value: '7', label: '7天内', desc: '较急', color: 'amber' },
  { value: '15', label: '15天内', desc: '正常', color: 'blue' },
  { value: '30', label: '30天内', desc: '宽松', color: 'green' }
]

export default function PublishDemandModal({ isOpen, onClose, initialData = null }) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subCategory: '',
    budget: '',
    timeline: '',
    description: '',
    requirements: [],
    referenceFiles: [],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    companyName: '',
    urgency: 'normal'
  })

  // 如果有初始数据（从诊断结果带入），自动填充
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        title: initialData.title || prev.title,
        category: initialData.category || prev.category,
        description: initialData.description || prev.description
      }))
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 保存到 localStorage
    const demands = JSON.parse(localStorage.getItem('publishedDemands') || '[]')
    const newDemand = {
      id: `d-${Date.now()}`,
      ...formData,
      status: 'open',
      publishTime: new Date().toISOString(),
      views: 0,
      applications: 0,
      matchScore: 0
    }
    demands.unshift(newDemand)
    localStorage.setItem('publishedDemands', JSON.stringify(demands))
    
    setIsSubmitting(false)
    onClose()
    alert('需求发布成功！')
  }

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    switch (step) {
      case 1: return formData.category && formData.title
      case 2: return formData.budget && formData.timeline
      case 3: return formData.description.length >= 50
      case 4: return formData.contactName && formData.contactPhone
      default: return true
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f0f15] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-white/10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              发布需求
            </h2>
            <p className="text-sm text-gray-400 mt-1">基于企业诊断结果，智能匹配最佳创作者</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 bg-white/5">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: '需求类型' },
              { num: 2, label: '预算周期' },
              { num: 3, label: '详细描述' },
              { num: 4, label: '联系方式' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center gap-2 ${step >= s.num ? 'text-violet-400' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step > s.num ? 'bg-emerald-500 text-white' :
                    step === s.num ? 'bg-violet-500 text-white' :
                    'bg-white/10 text-gray-500'
                  }`}>
                    {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                  </div>
                  <span className="text-sm hidden sm:inline">{s.label}</span>
                </div>
                {idx < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${step > s.num ? 'bg-violet-500' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  需求标题 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="例如：房地产楼盘航拍宣传视频制作"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  选择服务类型 <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateForm('category', cat.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.category === cat.id
                          ? 'bg-violet-500/20 border-violet-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-2xl mb-2">{cat.icon}</div>
                      <div className="font-medium text-sm">{cat.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{cat.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  细分类型
                </label>
                <div className="flex flex-wrap gap-2">
                  {['宣传片', '广告片', '品牌视频', '产品视频', '活动记录', '其他'].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => updateForm('subCategory', sub)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        formData.subCategory === sub
                          ? 'bg-violet-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  预算范围 <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BUDGET_RANGES.map((budget) => (
                    <button
                      key={budget.value}
                      onClick={() => updateForm('budget', budget.value)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.budget === budget.value
                          ? 'bg-violet-500/20 border-violet-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-medium">{budget.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{budget.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  交付周期 <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TIMELINES.map((time) => (
                    <button
                      key={time.value}
                      onClick={() => {
                        updateForm('timeline', time.label)
                        updateForm('urgency', time.color === 'red' ? 'urgent' : time.color === 'amber' ? 'normal' : 'low')
                      }}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        formData.timeline === time.label
                          ? 'bg-violet-500/20 border-violet-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-medium">{time.label}</div>
                      <div className={`text-xs mt-1 ${
                        time.color === 'red' ? 'text-red-400' :
                        time.color === 'amber' ? 'text-amber-400' :
                        time.color === 'blue' ? 'text-blue-400' :
                        'text-emerald-400'
                      }`}>{time.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-violet-500/10 rounded-xl p-4 border border-violet-500/20">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-violet-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-violet-300 mb-1">智能建议</h4>
                    <p className="text-sm text-gray-400">
                      根据您的企业诊断结果，建议预算范围 ¥8,000-¥15,000，交付周期 10-15天，
                      可获得较高质量的创作者响应。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  需求详细描述 <span className="text-red-400">*</span>
                  <span className="text-gray-500 font-normal ml-2">（至少50字）</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  placeholder={`请详细描述您的需求，例如：\n\n【项目背景】\n...\n\n【具体要求】\n1. ...\n2. ...\n\n【参考风格】\n...`}
                  rows={10}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">已输入 {formData.description.length} 字</span>
                  <span className={`text-xs ${formData.description.length >= 50 ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {formData.description.length >= 50 ? '✓ 满足最低要求' : '建议详细描述，提高匹配精准度'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  技能要求标签
                </label>
                <div className="flex flex-wrap gap-2">
                  {['航拍', '视频剪辑', 'AI绘画', '调色', '配音', '字幕', '动效', '分镜', '剧本', '3D建模'].map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        const newSkills = formData.requirements.includes(skill)
                          ? formData.requirements.filter(s => s !== skill)
                          : [...formData.requirements, skill]
                        updateForm('requirements', newSkills)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        formData.requirements.includes(skill)
                          ? 'bg-violet-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  参考文件
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-violet-500/50 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 mb-1">点击上传参考文件</p>
                  <p className="text-xs text-gray-500">支持图片、视频、文档等格式，单个文件不超过50MB</p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    联系人姓名 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => updateForm('contactName', e.target.value)}
                    placeholder="请输入联系人姓名"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    公司名称
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateForm('companyName', e.target.value)}
                    placeholder="请输入公司名称"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    联系电话 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => updateForm('contactPhone', e.target.value)}
                    placeholder="请输入联系电话"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    联系邮箱
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateForm('contactEmail', e.target.value)}
                    placeholder="请输入联系邮箱"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-emerald-300 mb-1">发布前确认</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• 需求发布后将进入智能匹配系统</li>
                      <li>• 匹配的创作者将收到通知并可申请项目</li>
                      <li>• 您可以在"我的项目"中管理所有需求</li>
                      <li>• 平台提供资金托管保障交易安全</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/5 bg-white/5">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
              step === 1
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            上一步
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-medium transition-all ${
                canProceed()
                  ? 'bg-violet-600 hover:bg-violet-500 text-white'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              下一步
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-medium transition-all ${
                canProceed() && !isSubmitting
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  发布中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  发布需求
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
