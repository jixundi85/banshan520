/**
 * 统一需求发布表单组件
 * 支持快速发布和企业深度发布两种模式
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, 
  Building2, User, FileText, DollarSign, Clock, Tag
} from 'lucide-react'
import { CATEGORY_META } from '../data/demandSchema'
import { createDemand, getUserInfo } from '../data/demandSchema'
import './DemandForm.css'

// 项目类型映射到分类
const PROJECT_TYPE_MAPPING = {
  'ai-video': 'shortvideo',
  'digital-human': 'shortvideo',
  'ai-agent': 'designer',
  'content-ops': 'commerce',
  'private-deploy': 'film',
  'consulting': 'commerce',
}

export default function DemandForm({ 
  mode = 'quick', // 'quick' | 'enterprise' | 'from-matching'
  initialData = {},
  onSuccess,
  onCancel,
  defaultCategory
}) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // 基本信息
    title: initialData.title || '',
    desc: initialData.desc || '',
    catId: initialData.catId || defaultCategory || 'shortvideo',
    
    // 企业信息（企业模式）
    companyName: initialData.companyName || '',
    industry: initialData.industry || '',
    contactName: initialData.contactName || '',
    contactPhone: initialData.contactPhone || '',
    
    // 预算与周期
    budget: initialData.budget || '',
    budgetMin: initialData.budgetMin || '',
    budgetMax: initialData.budgetMax || '',
    budgetType: initialData.budgetType || 'fixed',
    deadline: initialData.deadline || '',
    timeline: initialData.timeline || '',
    
    // 规格
    tags: initialData.tags || [],
    requirements: initialData.requirements || [],
  })
  const [tagInput, setTagInput] = useState('')
  const [requirementInput, setRequirementInput] = useState('')

  // 获取用户信息
  const userInfo = getUserInfo()

  // 总步骤数（根据模式）
  const totalSteps = mode === 'enterprise' ? 3 : 2

  // 项目类型（企业模式）
  const projectTypes = [
    { id: 'ai-video', name: 'AI短视频制作', icon: '🎬', desc: '品牌宣传、产品展示、带货视频' },
    { id: 'digital-human', name: '数字人定制', icon: '👤', desc: '虚拟主播、智能客服、品牌代言人' },
    { id: 'ai-agent', name: 'AI Agent搭建', icon: '🤖', desc: '智能客服、自动化流程、数据分析' },
    { id: 'content-ops', name: '内容运营升级', icon: '✍️', desc: 'AI文案、图文生成、社媒矩阵' },
    { id: 'private-deploy', name: '私有化部署', icon: '🏢', desc: '本地大模型、数据主权、安全合规' },
    { id: 'consulting', name: 'AI战略咨询', icon: '💡', desc: '转型规划、团队培训、技术选型' }
  ]

  // 预算范围
  const budgetRanges = [
    { value: '5000-10000', label: '¥5,000 - 10,000', min: 5000, max: 10000 },
    { value: '10000-30000', label: '¥10,000 - 30,000', min: 10000, max: 30000 },
    { value: '30000-50000', label: '¥30,000 - 50,000', min: 30000, max: 50000 },
    { value: '50000-100000', label: '¥50,000 - 100,000', min: 50000, max: 100000 },
    { value: '100000+', label: '¥100,000+', min: 100000, max: 999999 },
  ]

  // 交付周期
  const timelines = [
    { value: 'urgent', label: '紧急（1周内）' },
    { value: 'normal', label: '正常（2-4周）' },
    { value: 'relaxed', label: '宽松（1-2月）' },
    { value: 'longterm', label: '长期合作' }
  ]

  // 分类列表
  const categories = Object.values(CATEGORY_META)

  // 输入变更
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 添加标签
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  // 删除标签
  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  // 添加需求
  const addRequirement = () => {
    if (requirementInput.trim() && !formData.requirements.includes(requirementInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }))
      setRequirementInput('')
    }
  }

  // 删除需求
  const removeRequirement = (req) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== req)
    }))
  }

  // 验证步骤
  const isStepValid = () => {
    switch (step) {
      case 1:
        if (mode === 'enterprise') {
          return formData.companyName && formData.industry && formData.contactName && formData.contactPhone
        }
        return formData.catId
      case 2:
        return formData.title && formData.desc
      case 3:
        return formData.budget || (formData.budgetMin && formData.budgetMax)
      default:
        return false
    }
  }

  // 提交
  const handleSubmit = () => {
    // 解析预算
    let budget = 0
    let budgetMin = 0
    let budgetMax = 0
    
    if (formData.budget) {
      const range = budgetRanges.find(r => r.value === formData.budget)
      if (range) {
        budget = range.min
        budgetMin = range.min
        budgetMax = range.max
      }
    } else if (formData.budgetMin && formData.budgetMax) {
      budgetMin = parseInt(formData.budgetMin)
      budgetMax = parseInt(formData.budgetMax)
      budget = budgetMin
    }

    const demandData = {
      type: mode === 'enterprise' ? 'enterprise' : 'personal',
      title: formData.title,
      desc: formData.desc,
      catId: mode === 'enterprise' && formData.projectType 
        ? PROJECT_TYPE_MAPPING[formData.projectType] || 'shortvideo'
        : formData.catId,
      
      // 发布方信息
      publisherName: userInfo?.name || formData.contactName || '匿名用户',
      publisherAvatar: userInfo?.avatar || '',
      companyName: formData.companyName,
      
      // 预算
      budget,
      budgetMin,
      budgetMax,
      budgetType: formData.budgetMin && formData.budgetMax ? 'range' : 'fixed',
      timeline: formData.timeline,
      deadline: formData.deadline,
      
      // 规格
      tags: formData.tags,
      requirements: formData.requirements,
      
      // 额外信息
      industry: formData.industry,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      projectType: formData.projectType,
    }

    const newDemand = createDemand(demandData)
    setSubmitted(true)
    
    if (onSuccess) {
      onSuccess(newDemand)
    }
  }

  // 成功后
  const handleSuccessAction = (action) => {
    switch (action) {
      case 'my-demands':
        navigate('/demand-center')
        break
      case 'market':
        navigate('/demand')
        break
      case 'home':
        navigate('/')
        break
      default:
        if (onCancel) {
          onCancel()
        } else {
          navigate('/demand-center')
        }
    }
  }

  // 成功页面
  if (submitted) {
    return (
      <div className="demand-form-modal">
        <div className="demand-form-success">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h2>需求发布成功！</h2>
          <p>您的需求已进入半山需求广场，OPC专家将为您服务</p>
          
          <div className="success-summary">
            <div className="summary-item">
              <span className="label">需求标题：</span>
              <span className="value">{formData.title}</span>
            </div>
            <div className="summary-item">
              <span className="label">需求分类：</span>
              <span className="value">
                {CATEGORY_META[mode === 'enterprise' && formData.projectType 
                  ? PROJECT_TYPE_MAPPING[formData.projectType]
                  : formData.catId]?.name || 'AI短视频'}
              </span>
            </div>
            {formData.budget && (
              <div className="summary-item">
                <span className="label">预算范围：</span>
                <span className="value">{budgetRanges.find(r => r.value === formData.budget)?.label}</span>
              </div>
            )}
          </div>

          <div className="success-actions">
            <button 
              className="action-btn primary"
              onClick={() => handleSuccessAction('my-demands')}
            >
              查看我的需求
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => handleSuccessAction('market')}
            >
              浏览需求广场
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="demand-form-modal">
      <div className="demand-form-container">
        {/* Header */}
        <div className="form-header">
          <h2>
            {mode === 'enterprise' ? '发布企业需求' : '发布需求'}
          </h2>
          <button className="close-btn" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        {/* 进度指示器 */}
        <div className="step-indicator">
          {mode === 'enterprise' ? (
            <>
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <span className="step-num">1</span>
                <span className="step-label">企业信息</span>
              </div>
              <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <span className="step-num">2</span>
                <span className="step-label">需求描述</span>
              </div>
              <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <span className="step-num">3</span>
                <span className="step-label">预算周期</span>
              </div>
            </>
          ) : (
            <>
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <span className="step-num">1</span>
                <span className="step-label">选择分类</span>
              </div>
              <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <span className="step-num">2</span>
                <span className="step-label">填写需求</span>
              </div>
            </>
          )}
        </div>

        {/* 表单内容 */}
        <div className="form-content">
          {/* Step 1: 企业信息或分类选择 */}
          {step === 1 && mode === 'enterprise' && (
            <div className="form-step">
              <div className="step-title">
                <Building2 size={20} />
                <span>企业基本信息</span>
              </div>
              
              <div className="form-group">
                <label>企业名称 *</label>
                <input
                  type="text"
                  placeholder="请输入企业全称"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>所属行业 *</label>
                <div className="option-grid">
                  {['电商零售', '教育培训', '金融服务', '医疗健康', '制造业', '房地产', '餐饮旅游', '其他'].map(industry => (
                    <button
                      key={industry}
                      className={`option-btn ${formData.industry === industry ? 'selected' : ''}`}
                      onClick={() => handleInputChange('industry', industry)}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>联系人 *</label>
                  <input
                    type="text"
                    placeholder="您的姓名"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>联系电话 *</label>
                  <input
                    type="tel"
                    placeholder="手机号码"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: 快速模式 - 分类选择 */}
          {step === 1 && mode !== 'enterprise' && (
            <div className="form-step">
              <div className="step-title">
                <Tag size={20} />
                <span>选择需求分类</span>
              </div>
              
              <div className="category-grid">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-card ${formData.catId === cat.id ? 'selected' : ''}`}
                    onClick={() => handleInputChange('catId', cat.id)}
                  >
                    <span className="cat-icon">{cat.icon}</span>
                    <span className="cat-name">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: 需求描述 */}
          {step === 2 && mode === 'enterprise' && (
            <div className="form-step">
              <div className="step-title">
                <FileText size={20} />
                <span>项目需求描述</span>
              </div>

              <div className="form-group">
                <label>项目类型 *</label>
                <div className="project-types">
                  {projectTypes.map(type => (
                    <button
                      key={type.id}
                      className={`project-type-card ${formData.projectType === type.id ? 'selected' : ''}`}
                      onClick={() => handleInputChange('projectType', type.id)}
                    >
                      <span className="type-icon">{type.icon}</span>
                      <span className="type-name">{type.name}</span>
                      <span className="type-desc">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>需求标题 *</label>
                <input
                  type="text"
                  placeholder="简明扼要地描述您的需求"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>详细描述 *</label>
                <textarea
                  rows={4}
                  placeholder="请详细描述您的项目需求，包括：&#10;• 项目背景和目标&#10;• 期望的交付成果&#10;• 特殊要求或偏好"
                  value={formData.desc}
                  onChange={(e) => handleInputChange('desc', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>技能标签</label>
                <div className="tag-input">
                  <input
                    type="text"
                    placeholder="输入标签后按回车添加"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button onClick={addTag}>添加</button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="tag-list">
                    {formData.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                        <button onClick={() => removeTag(tag)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>具体要求</label>
                <div className="tag-input">
                  <input
                    type="text"
                    placeholder="输入要求后按回车添加"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <button onClick={addRequirement}>添加</button>
                </div>
                {formData.requirements.length > 0 && (
                  <div className="tag-list">
                    {formData.requirements.map(req => (
                      <span key={req} className="requirement-tag">
                        {req}
                        <button onClick={() => removeRequirement(req)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: 快速模式 - 需求描述 */}
          {step === 2 && mode !== 'enterprise' && (
            <div className="form-step">
              <div className="step-title">
                <FileText size={20} />
                <span>填写需求信息</span>
              </div>

              <div className="form-group">
                <label>需求标题 *</label>
                <input
                  type="text"
                  placeholder="简明扼要地描述您的需求"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>详细描述 *</label>
                <textarea
                  rows={4}
                  placeholder="请详细描述您的需求，包括：&#10;• 具体需求内容&#10;• 期望的交付成果&#10;• 特殊要求"
                  value={formData.desc}
                  onChange={(e) => handleInputChange('desc', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>技能标签</label>
                <div className="tag-input">
                  <input
                    type="text"
                    placeholder="输入标签后按回车添加"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button onClick={addTag}>添加</button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="tag-list">
                    {formData.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                        <button onClick={() => removeTag(tag)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: 预算与周期（仅企业模式） */}
          {step === 3 && mode === 'enterprise' && (
            <div className="form-step">
              <div className="step-title">
                <DollarSign size={20} />
                <span>预算与周期</span>
              </div>

              <div className="form-group">
                <label>项目预算 *</label>
                <div className="option-grid">
                  {budgetRanges.map(budget => (
                    <button
                      key={budget.value}
                      className={`option-btn ${formData.budget === budget.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('budget', budget.value)}
                    >
                      {budget.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>期望交付周期 *</label>
                <div className="option-grid">
                  {timelines.map(timeline => (
                    <button
                      key={timeline.value}
                      className={`option-btn ${formData.timeline === timeline.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('timeline', timeline.value)}
                    >
                      {timeline.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 摘要 */}
              <div className="summary-card">
                <h4>需求摘要</h4>
                <div className="summary-content">
                  <div className="summary-row">
                    <span className="label">企业：</span>
                    <span className="value">{formData.companyName}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">项目：</span>
                    <span className="value">
                      {projectTypes.find(p => p.id === formData.projectType)?.name || '未选择'}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="label">需求：</span>
                    <span className="value">{formData.title}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="form-footer">
          {step > 1 && (
            <button className="prev-btn" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={16} />
              上一步
            </button>
          )}
          <div className="footer-spacer"></div>
          {step < totalSteps ? (
            <button 
              className="next-btn" 
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
            >
              下一步
              <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              className="submit-btn" 
              onClick={handleSubmit}
              disabled={!isStepValid()}
            >
              发布需求
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
