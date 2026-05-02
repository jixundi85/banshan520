import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronRight, ChevronLeft, Loader2, Building2 } from 'lucide-react'

// 通用诊断问卷 - 第一部分
const generalQuestions = [
  {
    id: 0,
    question: '您的企业所属行业？',
    type: 'single',
    options: ['电商零售', '教育培训', '文化传媒', '科技互联网', '传统制造', '金融服务', '医疗健康', '其他'],
    isIndustry: true // 标记为行业选择
  },
  {
    id: 1,
    question: '企业当前规模？',
    type: 'single',
    options: ['10人以下', '10-50人', '50-200人', '200-1000人', '1000人以上']
  },
  {
    id: 2,
    question: '目前企业在AI应用方面处于哪个阶段？',
    type: 'single',
    options: ['尚未开始', '初步了解', '小规模试点', '部分业务应用', '全面数字化转型']
  },
  {
    id: 3,
    question: '企业当前面临的核心痛点？（可多选）',
    type: 'multiple',
    options: ['内容生产效率低', '人力成本过高', '缺乏AI技术人才', '数据安全风险', '营销获客困难', '业务流程繁琐', '决策缺乏数据支撑', '跨境业务合规难题']
  },
  {
    id: 4,
    question: '您最希望通过AI解决什么问题？',
    type: 'single',
    options: ['内容创作与营销', '客户服务自动化', '数据分析与决策', '业务流程优化', '产品研发创新', '全链路数字化转型']
  }
]

// 行业专属问卷 - 根据行业显示不同问题
const industryQuestions = {
  '电商零售': [
    {
      id: 'ind_1',
      question: '电商业务中最需要AI优化的环节？（可多选）',
      type: 'multiple',
      options: ['AI直播带货', '智能选品', '客服自动化', '个性化推荐', '库存管理', '物流优化', '价格策略', '用户画像分析']
    },
    {
      id: 'ind_2',
      question: '当前电商内容生产的主要痛点？',
      type: 'single',
      options: ['SKU多，内容生产跟不上', '专业主播成本高', '素材质量不稳定', '多平台分发效率低', '以上全部']
    },
    {
      id: 'ind_3',
      question: '对AI数字人直播的需求程度？',
      type: 'single',
      options: ['暂不需要', '了解中', '有计划尝试', '已经在用', '需要私有化部署']
    }
  ],
  '教育培训': [
    {
      id: 'ind_1',
      question: '教育业务中最需要AI优化的环节？（可多选）',
      type: 'multiple',
      options: ['AI课程开发', '个性化学习推荐', '智能批改作业', '学员数据追踪', '招生营销', '师资培训', '教务管理', '家校沟通']
    },
    {
      id: 'ind_2',
      question: '对AI课程内容的制作需求？',
      type: 'single',
      options: ['不需要', '少量短视频制作', '系统化课程开发', '需要数字人/虚拟老师', '全流程AI课程生产']
    },
    {
      id: 'ind_3',
      question: '学员服务自动化的重点？',
      type: 'single',
      options: ['不需要', '自动答疑', '学习进度跟踪', '智能测评', '全智能班主任']
    }
  ],
  '文化传媒': [
    {
      id: 'ind_1',
      question: '传媒业务中最需要AI优化的环节？（可多选）',
      type: 'multiple',
      options: ['内容创意策划', 'AI视频制作', '数字人IP打造', '多平台分发', '粉丝互动分析', '版权保护', '热点追踪', '商业化变现']
    },
    {
      id: 'ind_2',
      question: '对AIGC内容生产的定位？',
      type: 'single',
      options: ['不了解', '辅助创作工具', '主要生产方式', '需要差异化竞争', '建立内容壁垒']
    },
    {
      id: 'ind_3',
      question: '数字人/IP需求？',
      type: 'single',
      options: ['不需要', '虚拟主播', '品牌数字代言人', '虚拟偶像', '元宇宙布局']
    }
  ],
  '科技互联网': [
    {
      id: 'ind_1',
      question: '科技业务中最需要AI优化的环节？（可多选）',
      type: 'multiple',
      options: ['产品研发加速', '代码自动化', '智能测试', '数据分析', '用户体验优化', '运维自动化', '安全监控', '文档智能化']
    },
    {
      id: 'ind_2',
      question: '对AI开发工具的需求程度？',
      type: 'single',
      options: ['暂不需要', '代码补全/审查', '自动化测试', 'AI辅助设计', '全流程AI开发']
    },
    {
      id: 'ind_3',
      question: '对大模型/AI API的依赖程度？',
      type: 'single',
      options: ['不使用', '少量API调用', '核心业务依赖', '需要微调私有化', '自研大模型']
    }
  ],
  '传统制造': [
    {
      id: 'ind_1',
      question: '制造业中最需要AI优化的环节？（可多选）',
      type: 'multiple',
      options: ['AI质检', '生产排程', '设备预测性维护', '供应链优化', '能耗管理', '质量追溯', '工艺参数优化', '安全生产监控']
    },
    {
      id: 'ind_2',
      question: '工业AI应用的主要场景？',
      type: 'single',
      options: ['暂未涉及', '视觉质检', '设备预测维护', '生产优化', '智能工厂']
    },
    {
      id: 'ind_3',
      question: '对边缘计算/私有化部署的需求？',
      type: 'single',
      options: ['不需要', '边缘推理', '私有化AI平台', '工厂级私有云', '全面智能化改造']
    }
  ],
  '金融服务': [
    {
      id: 'ind_1',
      question: '金融业务中最需要AI优化的环节？（可多选）',
      type: 'multiple',
      options: ['智能风控', '合规自动化', '客服机器人', '智能投顾', '反欺诈', '数据分析', '文档处理', '客户服务']
    },
    {
      id: 'ind_2',
      question: '对AI风控的需求重点？',
      type: 'single',
      options: ['不需要', '信用评估辅助', '反欺诈检测', '实时风控', '智能监管合规']
    },
    {
      id: 'ind_3',
      question: '对数据安全和合规的要求？',
      type: 'single',
      options: ['一般合规', '行业标准合规', '严格数据隔离', '私有化部署', '监管沙箱合规']
    }
  ],
  '医疗健康': [
    {
      id: 'ind_1',
      question: '医疗业务中最需要AI优化的环节？（可多选）',
      type: 'multiple',
      options: ['影像识别辅助', '病历智能化', '药物研发', '患者随访', '远程问诊', '运营效率', '营销获客', '健康管理系统']
    },
    {
      id: 'ind_2',
      question: '对AI辅助诊断的需求？',
      type: 'single',
      options: ['不需要', '影像AI辅助', '临床决策支持', '全流程AI诊疗', '医学研究']
    },
    {
      id: 'ind_3',
      question: '对医疗数据合规的要求？',
      type: 'single',
      options: ['一般合规', '等保合规', '医疗数据脱敏', '私有化部署', '医疗AI认证']
    }
  ],
  '其他': [
    {
      id: 'ind_1',
      question: '企业最希望AI解决的核心问题？（可多选）',
      type: 'multiple',
      options: ['降本增效', '业务增长', '数字化转型', '智能化运营', '数据驱动决策', '客户体验提升', '风险控制', '创新能力']
    },
    {
      id: 'ind_2',
      question: '当前数字化基础？',
      type: 'single',
      options: ['基础薄弱', '有一定数字化', '核心业务数字化', '数据驱动运营', '智能化企业']
    },
    {
      id: 'ind_3',
      question: '对AI升级的预期投入？',
      type: 'single',
      options: ['低成本试水', '适度投入', '重点投入', '战略级投入', '按ROI评估']
    }
  ]
}

// 第二部分通用问题
const generalQuestionsPart2 = [
  {
    id: 5,
    question: '企业在数据方面的现状？',
    type: 'single',
    options: ['数据分散无管理', '有基础数据沉淀', '已建立数据仓库', '具备数据分析能力', '数据驱动决策']
  },
  {
    id: 6,
    question: '对AI投入的预算范围？',
    type: 'single',
    options: ['5万以下', '5-20万', '20-50万', '50-100万', '100万以上', '按需灵活投入']
  },
  {
    id: 7,
    question: '对数据主权和隐私保护的要求？',
    type: 'single',
    options: ['一般关注', '比较重视', '非常重要', '核心诉求，必须私有化部署']
  },
  {
    id: 8,
    question: '是否了解或需要政策补贴支持？',
    type: 'single',
    options: ['不了解', '听说过但未申请', '正在了解申请流程', '需要协助申请MDAG/FIMI等补贴']
  },
  {
    id: 9,
    question: '期望的AI升级时间周期？',
    type: 'single',
    options: ['1个月内', '1-3个月', '3-6个月', '6-12个月', '长期规划逐步实施']
  }
]

// 行业标签到OPC类型的映射
const industryToOPCTypes = {
  '电商零售': ['AI短视频', 'AI带货变现'],
  '教育培训': ['AI漫剧', 'AI设计师'],
  '文化传媒': ['AI短剧', 'AI漫剧'],
  '科技互联网': ['AI设计师', 'AI电影'],
  '传统制造': ['AI短视频', 'AI设计师'],
  '金融服务': ['AI设计师', 'AI短视频'],
  '医疗健康': ['AI短视频', 'AI设计师'],
  '其他': ['AI短视频', 'AI设计师']
}

// 行业痛点到OPC类型的映射
const painPointToOPCTypes = {
  '内容生产效率低': ['AI短视频', 'AI短剧', 'AI设计师'],
  '人力成本过高': ['AI短视频', 'AI设计师'],
  '缺乏AI技术人才': ['AI设计师', 'AI电影'],
  '数据安全风险': ['AI设计师'],
  '营销获客困难': ['AI短视频', 'AI带货变现'],
  '业务流程繁琐': ['AI设计师'],
  '决策缺乏数据支撑': ['AI设计师'],
  '跨境业务合规难题': ['AI设计师']
}

export default function EnterpriseDiagnosis() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [industry, setIndustry] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  // 行业专属问题列表
  const industrySpecificQuestions = industry ? industryQuestions[industry] || industryQuestions['其他'] : []
  
  // 总问题数 = 通用第一部分 + 行业问题 + 通用第二部分
  const totalQuestions = generalQuestions.length + industrySpecificQuestions.length + generalQuestionsPart2.length
  
  // 计算当前问题
  const getCurrentQuestion = () => {
    if (currentStep < generalQuestions.length) {
      return { ...generalQuestions[currentStep], index: currentStep }
    } else if (currentStep < generalQuestions.length + industrySpecificQuestions.length) {
      const indIndex = currentStep - generalQuestions.length
      return { ...industrySpecificQuestions[indIndex], index: currentStep }
    } else {
      const part2Index = currentStep - generalQuestions.length - industrySpecificQuestions.length
      return { ...generalQuestionsPart2[part2Index], index: currentStep }
    }
  }

  const currentQuestion = getCurrentQuestion()

  // 处理答案
  const handleAnswer = (questionId, answer) => {
    // 如果是行业选择，更新行业状态
    if (currentQuestion.isIndustry) {
      setIndustry(answer)
    }
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  // 处理多选
  const handleMultipleAnswer = (questionId, option) => {
    setAnswers(prev => {
      const current = prev[questionId] || []
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter(item => item !== option) }
      }
      return { ...prev, [questionId]: [...current, option] }
    })
  }

  // 下一步
  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1)
      setProgress(((currentStep + 1) / totalQuestions) * 100)
    } else {
      // 生成报告
      setIsGenerating(true)
      setProgress(100)
      setTimeout(() => {
        const result = calculateResult()
        localStorage.setItem('enterprise_diagnosis_result', JSON.stringify(result))
        navigate('/diagnosis-result')
      }, 2000)
    }
  }

  // 上一步
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setProgress((currentStep / totalQuestions) * 100)
    }
  }

  // 判断是否可以下一步
  const canProceed = () => {
    const answer = answers[currentQuestion.id]
    if (currentQuestion.type === 'multiple') {
      return answer && answer.length > 0
    }
    return answer !== undefined
  }

  // 计算结果
  const calculateResult = () => {
    const industry = answers[0] || '其他'
    const scale = answers[1] || '未知规模'
    const painPoints = answers[3] || []
    const aiGoal = answers[4] || ''
    
    // 计算四个维度分数
    const aiStage = answers[2]
    const readinessMap = {
      '尚未开始': 20, '初步了解': 40, '小规模试点': 60,
      '部分业务应用': 75, '全面数字化转型': 90
    }
    const readiness = readinessMap[aiStage] || 50

    const dataStage = answers[5]
    const dataMap = {
      '数据分散无管理': 25, '有基础数据沉淀': 45,
      '已建立数据仓库': 65, '具备数据分析能力': 80, '数据驱动决策': 95
    }
    const data = dataMap[dataStage] || 40

    const security = answers[7]
    const securityMap = {
      '一般关注': 40, '比较重视': 55, '非常重要': 75, '核心诉求，必须私有化部署': 90
    }
    const securityScore = securityMap[security] || 50

    const budget = answers[6]
    const budgetMap = {
      '5万以下': 30, '5-20万': 50, '20-50万': 70,
      '50-100万': 85, '100万以上': 95, '按需灵活投入': 60
    }
    const budgetScore = budgetMap[budget] || 50

    // 总分
    const totalScore = Math.round((readiness + data + securityScore + budgetScore) / 4)

    // 等级
    let level = '初级转型者'
    if (totalScore >= 75) level = '高级转型者'
    else if (totalScore >= 60) level = '中级转型者'
    else if (totalScore >= 45) level = '入门转型者'

    // 推荐路径
    let recommendation = '建议从AI认知培训开始，逐步建立数据基础，再引入AI应用'
    if (totalScore >= 75) {
      recommendation = '您已具备较强的AI基础，建议直接引入深度AI解决方案'
    } else if (totalScore >= 60) {
      recommendation = '建议选择性引入AI应用，重点突破核心业务场景'
    }

    // 描述
    let description = `您的企业（${industry}）在AI升级之路上处于"${level}"阶段。`
    if (readiness < 40) {
      description += ' AI认知和实践都需要从基础开始建立。'
    } else if (readiness >= 70) {
      description += ' 您对AI已有较深理解，具备升级的基础条件。'
    }

    // 推荐OPC类型
    const recommendedOPCTypes = new Set()
    
    // 行业相关
    if (industryToOPCTypes[industry]) {
      industryToOPCTypes[industry].forEach(type => recommendedOPCTypes.add(type))
    }
    
    // 痛点相关
    if (painPoints.length > 0) {
      painPoints.forEach(pain => {
        if (painPointToOPCTypes[pain]) {
          painPointToOPCTypes[pain].forEach(type => recommendedOPCTypes.add(type))
        }
      })
    }

    return {
      totalScore,
      level,
      scores: {
        readiness,
        data,
        security: securityScore,
        budget: budgetScore
      },
      answers: {
        0: industry,
        1: scale,
        2: aiStage,
        3: painPoints,
        4: aiGoal,
        5: dataStage,
        6: budget,
        7: security,
        8: answers[8],
        9: answers[9]
      },
      recommendation,
      description,
      industry,
      recommendedOPCTypes: Array.from(recommendedOPCTypes)
    }
  }

  // 获取当前问题的答案
  const getCurrentAnswer = () => {
    return answers[currentQuestion.id]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 pt-12 lg:pt-16 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full mb-4">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">企业智能升级诊断</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {industry ? `${industry}行业专属诊断` : 'AI升级成熟度诊断'}
            </span>
          </h1>
          <p className="text-gray-400 text-sm">
            {currentStep < generalQuestions.length
              ? '请回答以下问题，我们将为您生成专属诊断报告'
              : currentStep < generalQuestions.length + industrySpecificQuestions.length
              ? `${industry}行业专属问题`
              : '最后几个问题即可完成诊断'
            }
          </p>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>问题 {currentStep + 1} / {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 问题卡片 */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
          {/* 问题内容 */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                currentQuestion.isIndustry 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-slate-700 text-gray-300'
              }`}>
                {currentStep + 1}
              </span>
              <h2 className="text-xl font-semibold text-white leading-relaxed flex-1">
                {currentQuestion.question}
              </h2>
            </div>
            
            {currentQuestion.type === 'multiple' && (
              <p className="text-gray-400 text-sm ml-11 mb-4">(可多选)</p>
            )}
          </div>

          {/* 选项 */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentQuestion.type === 'multiple'
                ? (getCurrentAnswer() || []).includes(option)
                : getCurrentAnswer() === option
              
              return (
                <button
                  key={index}
                  onClick={() => currentQuestion.type === 'multiple'
                    ? handleMultipleAnswer(currentQuestion.id, option)
                    : handleAnswer(currentQuestion.id, option)
                  }
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/20 shadow-lg shadow-cyan-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-700 text-gray-400'
                  }`}>
                    {isSelected && <CheckCircle size={16} />}
                  </div>
                  <span className={`font-medium ${isSelected ? 'text-cyan-400' : 'text-gray-200'}`}>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              disabled={isGenerating}
              className="px-6 py-4 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <ChevronLeft size={20} />
              上一步
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={!canProceed() || isGenerating}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              canProceed() && !isGenerating
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-500'
                : 'bg-slate-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                正在生成专属报告...
              </>
            ) : currentStep === totalQuestions - 1 ? (
              <>
                生成诊断报告
                <CheckCircle size={20} />
              </>
            ) : (
              <>
                下一步
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* 底部提示 */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            预计完成时间：2-3分钟 • 您的回答将被严格保密
          </p>
        </div>
      </div>
    </div>
  )
}
