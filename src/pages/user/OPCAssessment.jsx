import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Brain, 
  Target, 
  Users, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react'
import './OPCAssessment.css'

// OPC能力评估问卷数据
const assessmentData = {
  dimensions: [
    {
      id: 'execution',
      name: '战术执行力',
      icon: Zap,
      description: '基础工具使用、任务完成效率、单点场景落地能力',
      color: '#3b82f6'
    },
    {
      id: 'architecture',
      name: '架构设计力',
      icon: Brain,
      description: '框架搭建、流程设计、系统化思维能力',
      color: '#8b5cf6'
    },
    {
      id: 'coordination',
      name: '协同调度力',
      icon: Users,
      description: '跨部门协作、资源调配、节点管理能力',
      color: '#f59e0b'
    },
    {
      id: 'strategy',
      name: '战略规划力',
      icon: Lightbulb,
      description: '方向定义、系统设计、创新引领能力',
      color: '#10b981'
    }
  ],
  questions: [
    // 战术执行力 (5题)
    {
      id: 1,
      dimension: 'execution',
      question: '你熟练使用哪些AI工具？',
      options: [
        { value: 20, label: '基础工具（ChatGPT/文心一言等）', tags: ['基础AI'] },
        { value: 40, label: '进阶工具（Midjourney/Stable Diffusion等）', tags: ['进阶AI'] },
        { value: 60, label: '专业工具（ComfyUI/AutoGPT等）', tags: ['专业AI'] },
        { value: 80, label: '全栈工具链 + 私有化部署', tags: ['全栈AI'] },
        { value: 100, label: '自研工具/二次开发', tags: ['AI开发'] }
      ]
    },
    {
      id: 2,
      dimension: 'execution',
      question: '你完成一个标准AI内容生产任务的效率如何？',
      options: [
        { value: 20, label: '需要指导，耗时较长', tags: ['新手'] },
        { value: 40, label: '能独立完成，时间正常', tags: ['熟练'] },
        { value: 60, label: '高效完成，有优化空间', tags: ['高效'] },
        { value: 80, label: '快速完成，质量稳定', tags: ['专家'] },
        { value: 100, label: '极速完成，可批量处理', tags: ['大师'] }
      ]
    },
    {
      id: 3,
      dimension: 'execution',
      question: '你在AI内容生产中的单点突破能力如何？',
      options: [
        { value: 20, label: '单一技能（如仅会写文案）', tags: ['单技能'] },
        { value: 40, label: '2-3项技能组合', tags: ['双技能'] },
        { value: 60, label: '多技能熟练切换', tags: ['多技能'] },
        { value: 80, label: '全链路技能掌握', tags: ['全链路'] },
        { value: 100, label: '技能创新/方法论输出', tags: ['方法论'] }
      ]
    },
    {
      id: 4,
      dimension: 'execution',
      question: '你的AI项目交付质量如何？',
      options: [
        { value: 20, label: '基本可用，需多次修改', tags: ['待提升'] },
        { value: 40, label: '符合要求，偶有瑕疵', tags: ['合格'] },
        { value: 60, label: '质量稳定，客户满意', tags: ['良好'] },
        { value: 80, label: '超出预期，有亮点', tags: ['优秀'] },
        { value: 100, label: '行业标杆，可复制', tags: ['卓越'] }
      ]
    },
    {
      id: 5,
      dimension: 'execution',
      question: '你处理AI任务中的突发问题的能力？',
      options: [
        { value: 20, label: '经常需要求助', tags: ['依赖'] },
        { value: 40, label: '能解决常见问题', tags: ['独立'] },
        { value: 60, label: '快速定位并解决', tags: ['敏捷'] },
        { value: 80, label: '预防问题发生', tags: ['预判'] },
        { value: 100, label: '形成解决方案库', tags: ['体系'] }
      ]
    },
    // 架构设计力 (5题)
    {
      id: 6,
      dimension: 'architecture',
      question: '你设计AI工作流的能力如何？',
      options: [
        { value: 20, label: '使用现成模板', tags: ['模板化'] },
        { value: 40, label: '能简单调整流程', tags: ['调整'] },
        { value: 60, label: '独立设计工作流', tags: ['设计'] },
        { value: 80, label: '优化复杂工作流', tags: ['优化'] },
        { value: 100, label: '创新工作流范式', tags: ['创新'] }
      ]
    },
    {
      id: 7,
      dimension: 'architecture',
      question: '你在多工具协同使用方面的能力？',
      options: [
        { value: 20, label: '单工具使用', tags: ['单点'] },
        { value: 40, label: '2-3个工具串联', tags: ['串联'] },
        { value: 60, label: '多工具自动化集成', tags: ['集成'] },
        { value: 80, label: '复杂工具链编排', tags: ['编排'] },
        { value: 100, label: '自研中间件/连接器', tags: ['自研'] }
      ]
    },
    {
      id: 8,
      dimension: 'architecture',
      question: '你的系统化思维能力如何？',
      options: [
        { value: 20, label: '关注单点任务', tags: ['点状'] },
        { value: 40, label: '理解任务间关系', tags: ['线状'] },
        { value: 60, label: '构建局部系统', tags: ['面状'] },
        { value: 80, label: '全局系统规划', tags: ['体状'] },
        { value: 100, label: '生态系统设计', tags: ['生态'] }
      ]
    },
    {
      id: 9,
      dimension: 'architecture',
      question: '你在AI项目中的模块化设计能力？',
      options: [
        { value: 20, label: '整体处理，不分模块', tags: ['整体'] },
        { value: 40, label: '简单功能划分', tags: ['划分'] },
        { value: 60, label: '清晰模块边界', tags: ['边界'] },
        { value: 80, label: '模块可复用设计', tags: ['复用'] },
        { value: 100, label: '模块生态构建', tags: ['生态'] }
      ]
    },
    {
      id: 10,
      dimension: 'architecture',
      question: '你的AI项目标准化能力？',
      options: [
        { value: 20, label: '无标准化意识', tags: ['随意'] },
        { value: 40, label: '基础规范遵循', tags: ['规范'] },
        { value: 60, label: '建立项目标准', tags: ['标准'] },
        { value: 80, label: '输出方法论', tags: ['方法论'] },
        { value: 100, label: '行业标准制定', tags: ['行业'] }
      ]
    },
    // 协同调度力 (5题)
    {
      id: 11,
      dimension: 'coordination',
      question: '你在跨部门协作中的角色通常是？',
      options: [
        { value: 20, label: '被动接受任务', tags: ['执行'] },
        { value: 40, label: '主动沟通协调', tags: ['协调'] },
        { value: 60, label: '牵头组织协作', tags: ['牵头'] },
        { value: 80, label: '统筹多方资源', tags: ['统筹'] },
        { value: 100, label: '建立协作机制', tags: ['机制'] }
      ]
    },
    {
      id: 12,
      dimension: 'coordination',
      question: '你管理AI项目节点的能力如何？',
      options: [
        { value: 20, label: '单节点执行', tags: ['单点'] },
        { value: 40, label: '多节点跟踪', tags: ['跟踪'] },
        { value: 60, label: '节点间协调', tags: ['协调'] },
        { value: 80, label: '关键路径管控', tags: ['管控'] },
        { value: 100, label: '全链路优化', tags: ['优化'] }
      ]
    },
    {
      id: 13,
      dimension: 'coordination',
      question: '你在资源调配方面的能力？',
      options: [
        { value: 20, label: '使用自有资源', tags: ['自有'] },
        { value: 40, label: '申请所需资源', tags: ['申请'] },
        { value: 60, label: '优化资源配置', tags: ['优化'] },
        { value: 80, label: '跨项目资源调度', tags: ['调度'] },
        { value: 100, label: '资源池建设', tags: ['建设'] }
      ]
    },
    {
      id: 14,
      dimension: 'coordination',
      question: '你处理多方冲突的能力？',
      options: [
        { value: 20, label: '回避冲突', tags: ['回避'] },
        { value: 40, label: '基础沟通协调', tags: ['沟通'] },
        { value: 60, label: '寻找共赢方案', tags: ['共赢'] },
        { value: 80, label: '预防冲突发生', tags: ['预防'] },
        { value: 100, label: '建立冲突解决机制', tags: ['机制'] }
      ]
    },
    {
      id: 15,
      dimension: 'coordination',
      question: '你的项目进度把控能力？',
      options: [
        { value: 20, label: '按 deadline 赶工', tags: ['赶工'] },
        { value: 40, label: '基本按时完成', tags: ['按时'] },
        { value: 60, label: '提前规划缓冲', tags: ['规划'] },
        { value: 80, label: '动态调整节奏', tags: ['动态'] },
        { value: 100, label: '精准预测交付', tags: ['精准'] }
      ]
    },
    // 战略规划力 (5题)
    {
      id: 16,
      dimension: 'strategy',
      question: '你在AI领域的方向感如何？',
      options: [
        { value: 20, label: '跟随潮流', tags: ['跟随'] },
        { value: 40, label: '有明确方向', tags: ['明确'] },
        { value: 60, label: '方向与趋势结合', tags: ['结合'] },
        { value: 80, label: '引领局部方向', tags: ['引领'] },
        { value: 100, label: '定义行业标准', tags: ['定义'] }
      ]
    },
    {
      id: 17,
      dimension: 'strategy',
      question: '你的AI系统设计能力？',
      options: [
        { value: 20, label: '单点解决方案', tags: ['单点'] },
        { value: 40, label: '功能模块设计', tags: ['模块'] },
        { value: 60, label: '系统架构设计', tags: ['架构'] },
        { value: 80, label: '平台级设计', tags: ['平台'] },
        { value: 100, label: '生态级设计', tags: ['生态'] }
      ]
    },
    {
      id: 18,
      dimension: 'strategy',
      question: '你的创新引领能力？',
      options: [
        { value: 20, label: '模仿学习', tags: ['模仿'] },
        { value: 40, label: '微创新', tags: ['微创新'] },
        { value: 60, label: '模式创新', tags: ['模式'] },
        { value: 80, label: '范式创新', tags: ['范式'] },
        { value: 100, label: '颠覆式创新', tags: ['颠覆'] }
      ]
    },
    {
      id: 19,
      dimension: 'strategy',
      question: '你的商业敏感度如何？',
      options: [
        { value: 20, label: '专注技术实现', tags: ['技术'] },
        { value: 40, label: '理解业务需求', tags: ['业务'] },
        { value: 60, label: '把握商业机会', tags: ['商业'] },
        { value: 80, label: '创造商业价值', tags: ['价值'] },
        { value: 100, label: '定义商业模式', tags: ['模式'] }
      ]
    },
    {
      id: 20,
      dimension: 'strategy',
      question: '你的AI领域影响力？',
      options: [
        { value: 20, label: '个人学习者', tags: ['学习'] },
        { value: 40, label: '团队贡献者', tags: ['贡献'] },
        { value: 60, label: '社区活跃者', tags: ['活跃'] },
        { value: 80, label: '意见领袖', tags: ['KOL'] },
        { value: 100, label: '行业标杆', tags: ['标杆'] }
      ]
    }
  ]
}

export default function OPCAssessment() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selectedOption, setSelectedOption] = useState(null)

  const totalQuestions = assessmentData.questions.length
  const currentQuestion = assessmentData.questions[currentStep]
  const progress = ((currentStep + 1) / totalQuestions) * 100

  // 获取当前维度的信息
  const currentDimension = assessmentData.dimensions.find(d => d.id === currentQuestion.dimension)
  const DimensionIcon = currentDimension.icon

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
  }

  const handleNext = () => {
    if (!selectedOption) return

    // 保存答案
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        value: selectedOption.value,
        tags: selectedOption.tags,
        dimension: currentQuestion.dimension
      }
    }))

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1)
      setSelectedOption(null)
    } else {
      // 评估完成，计算结果
      calculateAndSaveResult()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      // 恢复之前的选择
      const prevAnswer = answers[assessmentData.questions[currentStep - 1].id]
      if (prevAnswer) {
        const prevQuestion = assessmentData.questions[currentStep - 1]
        const prevOption = prevQuestion.options.find(o => o.value === prevAnswer.value)
        setSelectedOption(prevOption)
      } else {
        setSelectedOption(null)
      }
    }
  }

  const calculateAndSaveResult = () => {
    // 计算各维度得分
    const dimensionScores = {
      execution: 0,
      architecture: 0,
      coordination: 0,
      strategy: 0
    }

    const dimensionCounts = {
      execution: 0,
      architecture: 0,
      coordination: 0,
      strategy: 0
    }

    // 收集所有标签
    const allTags = []

    // 遍历所有答案
    Object.values(answers).forEach(answer => {
      dimensionScores[answer.dimension] += answer.value
      dimensionCounts[answer.dimension] += 1
      allTags.push(...answer.tags)
    })

    // 计算平均分
    Object.keys(dimensionScores).forEach(key => {
      dimensionScores[key] = Math.round(dimensionScores[key] / dimensionCounts[key])
    })

    // 去重标签
    const uniqueTags = [...new Set(allTags)]

    // 评定等级
    let level = 'L1'
    let levelName = '战术执行者'

    const exec = dimensionScores.execution
    const arch = dimensionScores.architecture
    const coord = dimensionScores.coordination
    const strat = dimensionScores.strategy

    if (exec >= 80 && arch >= 70 && coord >= 60 && strat >= 70) {
      level = 'L4'
      levelName = '极核引擎手'
    } else if (exec >= 80 && arch >= 70 && coord >= 60) {
      level = 'L3'
      levelName = '全域操盘手'
    } else if (exec >= 70 && arch >= 60) {
      level = 'L2'
      levelName = '矩阵架构师'
    }

    // 保存结果
    const result = {
      level,
      levelName,
      dimensionScores,
      tags: uniqueTags,
      assessmentDate: new Date().toISOString(),
      totalScore: Math.round((exec + arch + coord + strat) / 4)
    }

    localStorage.setItem('opcAssessmentResult', JSON.stringify(result))

    // 跳转到结果页
    navigate('/opc-result')
  }

  // 保存进度到localStorage
  useEffect(() => {
    localStorage.setItem('opcAssessmentProgress', JSON.stringify({
      currentStep,
      answers,
      lastUpdated: new Date().toISOString()
    }))
  }, [currentStep, answers])

  // 恢复进度
  useEffect(() => {
    const saved = localStorage.getItem('opcAssessmentProgress')
    if (saved) {
      const { currentStep: savedStep, answers: savedAnswers } = JSON.parse(saved)
      if (savedStep && savedAnswers) {
        setCurrentStep(savedStep)
        setAnswers(savedAnswers)
        // 恢复当前问题的选择
        const currentQ = assessmentData.questions[savedStep]
        const currentA = savedAnswers[currentQ.id]
        if (currentA) {
          const option = currentQ.options.find(o => o.value === currentA.value)
          setSelectedOption(option)
        }
      }
    }
  }, [])

  return (
    <div className="opc-assessment">
      {/* Header */}
      <div className="assessment-header">
        <div className="header-content">
          <div className="header-badge">
            <Sparkles size={16} />
            <span>OPC能力评估</span>
          </div>
          <h1>发现你的碳基灵魂密度</h1>
          <p>通过20道专业题目，全面评估你的AI能力四维度</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-dimension">
            <DimensionIcon size={16} style={{ color: currentDimension.color }} />
            {currentDimension.name}
          </span>
          <span className="progress-count">
            问题 {currentStep + 1} / {totalQuestions}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${currentDimension.color}, ${currentDimension.color}80)`
            }}
          />
        </div>
        <p className="dimension-desc">{currentDimension.description}</p>
      </div>

      {/* Question Card */}
      <div className="question-card">
        <h2 className="question-text">
          <span className="question-number">{currentStep + 1}.</span>
          {currentQuestion.question}
        </h2>

        <div className="options-list">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${selectedOption?.value === option.value ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option)}
              style={selectedOption?.value === option.value ? {
                borderColor: currentDimension.color,
                background: `${currentDimension.color}15`
              } : {}}
            >
              <div className="option-radio">
                {selectedOption?.value === option.value && (
                  <CheckCircle2 size={20} style={{ color: currentDimension.color }} />
                )}
              </div>
              <span className="option-label">{option.label}</span>
              <div className="option-tags">
                {option.tags.map((tag, i) => (
                  <span key={i} className="option-tag">{tag}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="assessment-nav">
        <button
          className="nav-btn prev"
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          <ChevronLeft size={20} />
          上一题
        </button>

        <button
          className="nav-btn next"
          onClick={handleNext}
          disabled={!selectedOption}
          style={selectedOption ? {
            background: `linear-gradient(135deg, ${currentDimension.color}, ${currentDimension.color}80)`
          } : {}}
        >
          {currentStep === totalQuestions - 1 ? '查看结果' : '下一题'}
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dimension Legend */}
      <div className="dimension-legend">
        {assessmentData.dimensions.map(dim => {
          const Icon = dim.icon
          const isActive = dim.id === currentDimension.id
          return (
            <div 
              key={dim.id} 
              className={`legend-item ${isActive ? 'active' : ''}`}
              style={isActive ? { color: dim.color } : {}}
            >
              <Icon size={16} />
              <span>{dim.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
