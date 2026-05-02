import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useToast } from '../../components/Toast'
import {
  ClipboardList, Save, RefreshCw, ChevronRight, ChevronLeft,
  CheckCircle, AlertCircle, Clock, FileText, Trash2,
  Play, Eye, Edit3, X
} from 'lucide-react'

// ======= 问卷配置 =======
const SURVEY_CONFIG = {
  id: 'enterprise_diagnosis_v1',
  title: '企业AI成熟度诊断问卷',
  subtitle: '通过15道选择题，快速了解您的AI现状',
  totalQuestions: 15,
  timeEstimate: '5分钟',
  sections: [
    {
      id: 'basic',
      name: '基本信息',
      icon: '📋',
      questions: [
        { id: 'q1', type: 'radio', label: '您的企业类型是？', options: ['初创企业(1-50人)', '中小企业(51-200人)', '成长期企业(201-500人)', '大型企业(500人以上)'] },
        { id: 'q2', type: 'radio', label: '您所在行业是？', options: ['互联网/科技', '电商/零售', '制造/实业', '金融/服务', '教育/培训', '医疗/健康', '媒体/内容', '其他'] },
        { id: 'q3', type: 'radio', label: '您目前的主要业务痛点是？', options: ['内容生产效率低', '营销获客成本高', '客户转化率低', '团队协作效率差', '数据分析能力弱', '全选'] },
      ]
    },
    {
      id: 'ai_usage',
      name: 'AI使用现状',
      icon: '🤖',
      questions: [
        { id: 'q4', type: 'radio', label: '您的团队日常使用哪些AI工具？', options: ['ChatGPT/Claude等AI对话', 'Midjourney/Stable Diffusion等AI绘画', '剪映/Runway等AI视频', '还没有系统使用', '多选'] },
        { id: 'q5', type: 'radio', label: '使用AI的频率是？', options: ['每天多次', '每天一次', '每周几次', '偶尔使用', '几乎不用'] },
        { id: 'q6', type: 'radio', label: '使用AI的主要目的是？', options: ['内容创作', '数据分析', '客户服务', '产品设计', '内部管理', '多个目的'] },
        { id: 'q7', type: 'radio', label: '团队中掌握AI工具的人占比？', options: ['80%以上', '50%-80%', '20%-50%', '20%以下', '不清楚'] },
      ]
    },
    {
      id: 'budget_plan',
      name: '预算与计划',
      icon: '💰',
      questions: [
        { id: 'q8', type: 'radio', label: '您每月愿意为AI工具投入多少？', options: ['500元以下', '500-2000元', '2000-5000元', '5000-10000元', '10000元以上'] },
        { id: 'q9', type: 'radio', label: '您对AI培训的接受度是？', options: ['非常愿意，愿意投入时间学习', '愿意，但需要有人指导', '有时间再说', '暂时不考虑'] },
        { id: 'q10', type: 'radio', label: '您希望AI帮助解决什么问题？', options: ['提升内容产出效率', '降低人力成本', '优化营销效果', '改善客户体验', '全选'] },
      ]
    },
    {
      id: 'evaluation',
      name: '效果评估',
      icon: '📊',
      questions: [
        { id: 'q11', type: 'radio', label: '目前AI工具对您的工作帮助程度？', options: ['非常大，解决了主要痛点', '比较大，提升了效率', '一般，效果不明显', '帮助很小', '没有帮助'] },
        { id: 'q12', type: 'radio', label: '您认为AI落地的最大障碍是？', options: ['成本太高', '不知道怎么用', '效果不稳定', '团队不接受', '缺乏指导'] },
        { id: 'q13', type: 'radio', label: '您愿意为AI解决方案付费吗？', options: ['愿意，看重效果', '愿意，但价格要合理', '看情况', '不愿意'] },
        { id: 'q14', type: 'radio', label: '您的企业数字化基础如何？', options: ['有完善的数字化系统', '有部分数字化系统', '刚开始数字化', '还未开始'] },
        { id: 'q15', type: 'radio', label: '您对AI的信任度是？', options: ['非常信任，积极尝试', '比较信任，谨慎使用', '一般，还在观察', '不太信任', '完全不信'] },
      ]
    }
  ]
}

// ======= 本地存储键 =======
const STORAGE_KEY = 'diagnosis_survey_progress'
const HISTORY_KEY = 'diagnosis_survey_history'

// ======= 主组件 =======
export default function SurveyWithResume() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  // 状态
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [surveyHistory, setSurveyHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  // 当前数据
  const sections = SURVEY_CONFIG.sections
  const currentSectionData = sections[currentSection]
  const currentQuestionData = currentSectionData?.questions[currentQuestion]
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0)

  // 计算进度
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / totalQuestions) * 100

  // 加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      setAnswers(data.answers || {})
      setCurrentSection(data.currentSection || 0)
      setCurrentQuestion(data.currentQuestion || 0)
      setLastSaved(new Date(data.savedAt))
    }

    const history = localStorage.getItem(HISTORY_KEY)
    if (history) {
      setSurveyHistory(JSON.parse(history))
    }
  }, [])

  // 自动保存
  useEffect(() => {
    const timer = setTimeout(() => {
      saveProgress(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [answers, currentSection, currentQuestion])

  // 保存进度
  const saveProgress = (showMsg = true) => {
    setIsSaving(true)
    const data = {
      answers,
      currentSection,
      currentQuestion,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setLastSaved(new Date())
    setIsSaving(false)
    if (showMsg) showToast('进度已保存', 'success')
  }

  // 清除进度
  const clearProgress = () => {
    if (confirm('确定要清除当前进度吗？')) {
      localStorage.removeItem(STORAGE_KEY)
      setAnswers({})
      setCurrentSection(0)
      setCurrentQuestion(0)
      setLastSaved(null)
      showToast('进度已清除', 'success')
    }
  }

  // 选择答案
  const handleSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))

    // 自动进入下一题
    setTimeout(() => {
      if (currentQuestion < currentSectionData.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else if (currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1)
        setCurrentQuestion(0)
      }
    }, 300)
  }

  // 导航到指定问题
  const goToQuestion = (sectionIndex, questionIndex) => {
    setCurrentSection(sectionIndex)
    setCurrentQuestion(questionIndex)
    setShowHistory(false)
  }

  // 提交问卷
  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      showToast(`还有 ${totalQuestions - answeredCount} 题未完成`, 'warning')
      return
    }

    // 保存到历史
    const record = {
      id: Date.now(),
      completedAt: new Date().toISOString(),
      answers,
      score: calculateScore()
    }
    const history = [...surveyHistory, record]
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    localStorage.removeItem(STORAGE_KEY)

    showToast('问卷已提交！正在生成诊断报告...', 'success')
    setTimeout(() => navigate('/diagnosis-result'), 1500)
  }

  // 计算得分
  const calculateScore = () => {
    // 简化评分逻辑
    let score = 0
    Object.values(answers).forEach((answer, index) => {
      if (index < 3) score += 20
      else if (index < 6) score += 15
      else score += 10
    })
    return Math.min(100, score)
  }

  // 恢复历史记录
  const restoreFromHistory = (record) => {
    setAnswers(record.answers)
    setLastSaved(new Date(record.completedAt))
    showToast('已恢复历史记录', 'success')
    setShowHistory(false)
  }

  // 获取当前区块进度
  const getSectionProgress = (sectionIndex) => {
    const section = sections[sectionIndex]
    const answered = section.questions.filter(q => answers[q.id]).length
    return { answered, total: section.questions.length }
  }

  return (
      <div className="min-h-screen bg-slate-900">
        {/* 顶部进度条 */}
        <div className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-4">
            {/* 进度信息 */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-violet-400" />
                  {SURVEY_CONFIG.title}
                </h1>
                <p className="text-gray-400 text-sm mt-1">{SURVEY_CONFIG.subtitle}</p>
              </div>
              <div className="flex items-center gap-4">
                {/* 自动保存状态 */}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      保存中...
                    </>
                  ) : lastSaved ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      已保存 {lastSaved.toLocaleTimeString()}
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      未保存
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 进度条 */}
            <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* 进度文字 */}
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-gray-400">已完成 {answeredCount} / {totalQuestions} 题</span>
              <span className="text-violet-400 font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* 区块导航 */}
        <div className="bg-slate-800/40 border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {sections.map((section, index) => {
                const progress = getSectionProgress(index)
                const isActive = index === currentSection
                const isCompleted = progress.answered === progress.total

                return (
                  <button
                    key={section.id}
                    onClick={() => goToQuestion(index, 0)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                        : isCompleted
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span className="text-sm font-medium">{section.name}</span>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-xs">{progress.answered}/{progress.total}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 主内容 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* 历史记录按钮 */}
          {surveyHistory.length > 0 && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" />
                历史记录 ({surveyHistory.length})
              </button>
            </div>
          )}

          {/* 历史记录面板 */}
          {showHistory && (
            <div className="mb-6 bg-white/5 rounded-2xl border border-white/10 p-4">
              <h3 className="text-white font-medium mb-3">历史记录</h3>
              <div className="space-y-2">
                {surveyHistory.map((record, index) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center text-violet-400">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white text-sm">
                          完成于 {new Date(record.completedAt).toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-xs">
                          得分：{record.score}分 · {Object.keys(record.answers).length}题
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => restoreFromHistory(record)}
                      className="px-3 py-1.5 bg-violet-500/20 text-violet-400 text-sm rounded-lg hover:bg-violet-500/30 transition-colors"
                    >
                      恢复
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 问题卡片 */}
          {currentQuestionData && (
            <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-8">
              {/* 问题信息 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-violet-500/20 text-violet-400 text-sm rounded-full">
                    {currentSection + 1}/{sections.length}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-400 text-sm">
                    第 {sections.slice(0, currentSection).reduce((sum, s) => sum + s.questions.length, 0) + currentQuestion + 1} 题
                  </span>
                </div>
                {answers[currentQuestionData.id] && (
                  <span className="flex items-center gap-1 text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    已作答
                  </span>
                )}
              </div>

              {/* 问题 */}
              <h2 className="text-2xl font-bold text-white mb-8">
                {currentQuestionData.label}
              </h2>

              {/* 选项 */}
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => {
                  const isSelected = answers[currentQuestionData.id] === option

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(currentQuestionData.id, option)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-violet-500/20 border-violet-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium ${
                          isSelected
                            ? 'bg-violet-500 text-white'
                            : 'bg-white/10 text-gray-400'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg">{option}</span>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-violet-400 ml-auto" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* 导航按钮 */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => {
                    if (currentQuestion > 0) {
                      setCurrentQuestion(prev => prev - 1)
                    } else if (currentSection > 0) {
                      setCurrentSection(prev => prev - 1)
                      setCurrentQuestion(sections[currentSection - 1].questions.length - 1)
                    }
                  }}
                  disabled={currentSection === 0 && currentQuestion === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  上一题
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={clearProgress}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="清除进度"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => saveProgress()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    保存
                  </button>
                </div>

                {currentSection === sections.length - 1 && currentQuestion === currentSectionData.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={answeredCount < totalQuestions}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium rounded-lg hover:from-violet-400 hover:to-fuchsia-400 transition-all disabled:opacity-50"
                  >
                    提交问卷
                    <CheckCircle className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (currentQuestion < currentSectionData.questions.length - 1) {
                        setCurrentQuestion(prev => prev + 1)
                      } else if (currentSection < sections.length - 1) {
                        setCurrentSection(prev => prev + 1)
                        setCurrentQuestion(0)
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    下一题
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 题目导航 */}
          <div className="mt-6 bg-slate-800/40 rounded-xl p-4">
            <h3 className="text-white font-medium mb-3">快速导航</h3>
            <div className="flex flex-wrap gap-2">
              {sections.map((section, sIndex) => (
                section.questions.map((q, qIndex) => {
                  const globalIndex = sections.slice(0, sIndex).reduce((sum, s) => sum + s.questions.length, 0) + qIndex
                  const isAnswered = !!answers[q.id]
                  const isCurrent = sIndex === currentSection && qIndex === currentQuestion

                  return (
                    <button
                      key={q.id}
                      onClick={() => goToQuestion(sIndex, qIndex)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        isCurrent
                          ? 'bg-violet-500 text-white'
                          : isAnswered
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {globalIndex + 1}
                    </button>
                  )
                })
              ))}
            </div>
          </div>

          {/* 提示 */}
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30"></div>
              已作答
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-violet-500"></div>
              当前
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-white/5"></div>
              未作答
            </div>
          </div>
        </div>
      </div>

  )
}
