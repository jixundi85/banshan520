import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Brain, Zap, Users, Lightbulb, 
  ArrowRight, BookOpen, Target, Sparkles,
  Clock, Star, TrendingUp, CheckCircle,
  Download, Share2, Award, GraduationCap, Briefcase
} from 'lucide-react'
import { allCourses as courses } from '../../data/unifiedCourses'
import { getDemands, CATEGORY_META, DEMAND_STATUS } from '../../data/demandSchema'
import './OPCResult.css'

// 维度配置
const dimensionConfig = {
  execution: { 
    name: '战术执行力', 
    icon: Zap, 
    color: '#3b82f6',
    gradient: 'from-blue-500 to-blue-600'
  },
  architecture: { 
    name: '架构设计力', 
    icon: Brain, 
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-600'
  },
  coordination: { 
    name: '协同调度力', 
    icon: Users, 
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600'
  },
  strategy: { 
    name: '战略规划力', 
    icon: Lightbulb, 
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600'
  }
}

// 等级配置
const levelConfig = {
  L1: {
    name: '战术执行者',
    desc: '从执行者到操盘手的蜕变之路',
    color: '#4ade80',
    bgGradient: 'from-emerald-500/20 to-green-600/10',
    borderColor: 'border-emerald-500/30',
    type: 'beginner' // 小白
  },
  L2: {
    name: '矩阵架构师',
    desc: '具备独立承接项目的能力',
    color: '#60a5fa',
    bgGradient: 'from-blue-500/20 to-indigo-600/10',
    borderColor: 'border-blue-500/30',
    type: 'intermediate' // 进阶
  },
  L3: {
    name: '全域操盘手',
    desc: '可独立运营AI项目的专家',
    color: '#a78bfa',
    bgGradient: 'from-violet-500/20 to-purple-600/10',
    borderColor: 'border-violet-500/30',
    type: 'professional' // 专业
  },
  L4: {
    name: '极核引擎手',
    desc: '引领行业的顶尖OPC创作者',
    color: '#f472b6',
    bgGradient: 'from-pink-500/20 to-rose-600/10',
    borderColor: 'border-pink-500/30',
    type: 'professional' // 专业
  }
}

// 用户类型对应的行动指令
const actionConfig = {
  beginner: {
    title: '立即报名OPC特训营入门课',
    subtitle: '解锁AI变现能力，开启创作之旅',
    icon: GraduationCap,
    gradient: 'from-emerald-500 to-teal-500',
    target: '/training',
    buttonText: '立即报名入门课'
  },
  intermediate: {
    title: '一键申请签约认证',
    subtitle: '快速获得接单权限，开始变现',
    icon: Award,
    gradient: 'from-violet-500 to-purple-500',
    target: '/opc-certification',
    buttonText: '立即签约认证'
  },
  professional: {
    title: '开启接单变现之旅',
    subtitle: '您的能力已达标，可以直接接单',
    icon: Briefcase,
    gradient: 'from-amber-500 to-orange-500',
    target: '/demand',
    buttonText: '去智配中心接单'
  }
}

// 课程推荐算法 - 根据OPC评估结果匹配课程
const recommendCourses = (result) => {
  const { dimensionScores, tags, level } = result
  const recommended = []
  
  // 收集所有标签
  const allCategories = new Set()
  
  // 根据标签推荐
  tags.forEach(tag => {
    const categoryMapping = {
      '基础AI': ['video'],
      '进阶AI': ['video', 'commerce'],
      '专业AI': ['drama', 'designer'],
      '全栈AI': ['drama', 'mangadrama', 'film'],
      'AI开发': ['film', 'designer'],
      '新手': ['video'],
      '熟练': ['video', 'commerce'],
      '高效': ['drama', 'designer'],
      '专家': ['drama', 'mangadrama', 'film'],
      '大师': ['film', 'designer'],
      '单技能': ['video'],
      '双技能': ['video', 'commerce'],
      '多技能': ['drama', 'designer'],
      '全链路': ['drama', 'mangadrama'],
      '方法论': ['film', 'designer'],
      '模板化': ['video'],
      '调整': ['video', 'commerce'],
      '设计': ['drama', 'designer'],
      '优化': ['drama', 'mangadrama'],
      '创新': ['film', 'mangadrama'],
      '学习': ['video'],
      '贡献': ['video', 'commerce'],
      '活跃': ['drama', 'designer'],
      'KOL': ['drama', 'mangadrama', 'film'],
      '标杆': ['film', 'designer']
    }
    
    if (categoryMapping[tag]) {
      categoryMapping[tag].forEach(cat => allCategories.add(cat))
    }
  })
  
  // 根据最低分维度推荐专项课程
  const minDim = Object.entries(dimensionScores).reduce((a, b) => 
    a[1] < b[1] ? a : b
  )
  
  if (minDim[1] < 50) {
    if (minDim[0] === 'execution') allCategories.add('video')
    if (minDim[0] === 'architecture') allCategories.add('designer')
    if (minDim[0] === 'coordination') allCategories.add('commerce')
    if (minDim[0] === 'strategy') allCategories.add('drama')
  }
  
  // 默认推荐
  if (allCategories.size === 0) {
    allCategories.add('shortvideo')
    allCategories.add('commerce')
  }
  
  // 根据等级决定推荐级别
  const levelFilter = level === 'L1' ? ['入门'] : 
                      level === 'L2' ? ['入门', '中级', '进阶'] : 
                      ['进阶', '专业']
  
  // 筛选并推荐课程
  courses.forEach(course => {
    if (allCategories.has(course.category) && levelFilter.includes(course.level)) {
      if (!recommended.find(c => c.id === course.id)) {
        recommended.push(course)
      }
    }
  })
  
  // 如果推荐不足，补充热门课程
  if (recommended.length < 3) {
    courses.filter(c => c.featured && !recommended.find(r => r.id === c.id))
      .slice(0, 3 - recommended.length)
      .forEach(course => recommended.push(course))
  }
  
  return recommended.slice(0, 4)
}

// 需求匹配算法 - 根据OPC评估结果匹配需求订单
const recommendDemands = (result) => {
  const { dimensionScores, tags, level } = result
  
  // 读取统一需求数据
  const allDemands = getDemands()
  
  // 筛选待接单的需求
  const pendingDemands = allDemands.filter(d => d.status === DEMAND_STATUS.PENDING)
  
  // 根据等级和能力筛选
  const execScore = dimensionScores.execution || 0
  const archScore = dimensionScores.architecture || 0
  
  let filteredDemands = pendingDemands
  
  // L1用户只能接简单任务
  if (level === 'L1') {
    filteredDemands = pendingDemands.filter(d => 
      d.budget && d.budget < 3000
    )
  }
  
  // 如果有需求，返回前3个
  if (filteredDemands.length > 0) {
    return filteredDemands.slice(0, 3)
  }
  
  // 如果没有真实需求，返回示例数据
  return [
    {
      id: 'sample-1',
      title: '电商品牌AI短视频制作',
      catId: 'shortvideo',
      budget: 5000,
      budgetType: 'fixed',
      publisherName: '某电商公司',
      deadline: '7天内',
      status: DEMAND_STATUS.PENDING,
      bids: []
    },
    {
      id: 'sample-2',
      title: '产品种草图文设计',
      catId: 'designer',
      budget: 3000,
      budgetType: 'fixed',
      publisherName: '某品牌方',
      deadline: '5天内',
      status: DEMAND_STATUS.PENDING,
      bids: []
    },
    {
      id: 'sample-3',
      title: 'AI短剧脚本创作',
      catId: 'shortdrama',
      budget: 8000,
      budgetType: 'fixed',
      publisherName: '某MCN机构',
      deadline: '10天内',
      status: DEMAND_STATUS.PENDING,
      bids: []
    }
  ]
}

// 判断用户类型
const getUserType = (result) => {
  const { level, dimensionScores } = result
  const avgScore = Object.values(dimensionScores).reduce((a, b) => a + b, 0) / 4
  
  if (level === 'L1' && avgScore < 50) return 'beginner'
  if (level === 'L2' && avgScore < 60) return 'intermediate'
  return 'professional'
}

// 生成核心评估结果摘要（≤300字）
const generateSummary = (result, levelInfo, userType) => {
  const { dimensionScores, totalScore, tags } = result
  
  // 找出最高和最低维度
  const sortedDims = Object.entries(dimensionScores).sort((a, b) => b[1] - a[1])
  const highestDim = dimensionConfig[sortedDims[0][0]]
  const lowestDim = dimensionConfig[sortedDims[sortedDims.length - 1][0]]
  
  let summary = ''
  
  // 用户类型描述
  if (userType === 'beginner') {
    summary = `您是AI创作领域的新秀，具备一定的基础能力。在四大维度中，您的${highestDim.name}表现最为突出（${sortedDims[0][1]}分），建议重点加强${lowestDim.name}，这将帮助您更快成长为专业的OPC创作者。`
  } else if (userType === 'intermediate') {
    summary = `您已具备成为OPC创作者的基础能力，综合得分${totalScore}分。在${highestDim.name}方面表现优秀（${sortedDims[0][1]}分），具备独立承接项目的能力。建议通过签约认证，正式开启您的变现之路。`
  } else {
    summary = `恭喜！您已具备专业OPC创作者的能力，综合得分高达${totalScore}分。您的${highestDim.name}达到${sortedDims[0][1]}分，处于行业领先水平。建议立即签约接单，将您的能力转化为实际收益。`
  }
  
  return summary
}

// 下载报告为PDF（模拟）
const downloadReport = (result, levelInfo) => {
  const reportContent = `
OPC能力评估报告
================
评估等级：${levelInfo.name} (${result.level})
综合得分：${result.totalScore}分

四维度分析：
- 战术执行力：${result.dimensionScores.execution}分
- 架构设计力：${result.dimensionScores.architecture}分
- 协同调度力：${result.dimensionScores.coordination}分
- 战略规划力：${result.dimensionScores.strategy}分

能力标签：${result.tags.join('、')}

生成时间：${new Date().toLocaleString('zh-CN')}
半山AIX - OPC智能匹配网络
  `.trim()
  
  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `OPC评估报告_${levelInfo.name}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// 分享报告
const shareReport = async (result, levelInfo) => {
  const shareData = {
    title: `我的OPC能力评估结果：${levelInfo.name}`,
    text: `我在半山AIX完成了OPC能力评估，综合得分${result.totalScore}分，评定为${levelInfo.name}！你也来试试吧~`,
    url: window.location.origin + '/opc-assessment'
  }
  
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      // 用户取消分享
    }
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(shareData.url).then(() => {
      alert('分享链接已复制到剪贴板！')
    })
  }
}

export default function OPCResult() {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [recommendedDemands, setRecommendedDemands] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const savedResult = localStorage.getItem('opcAssessmentResult')
    if (savedResult) {
      const parsed = JSON.parse(savedResult)
      setResult(parsed)
      
      // 计算推荐
      const matchedCourses = recommendCourses(parsed)
      setRecommendedCourses(matchedCourses)
      
      const matchedDemands = recommendDemands(parsed)
      setRecommendedDemands(matchedDemands)
    }
  }, [])

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">暂无评估数据</div>
          <button
            onClick={() => navigate('/opc-assessment')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
          >
            开始评估
          </button>
        </div>
      </div>
    )
  }

  const levelInfo = levelConfig[result.level] || levelConfig.L1
  const userType = getUserType(result)
  const userAction = actionConfig[userType]
  const summary = generateSummary(result, levelInfo, userType)
  const ActionIcon = userAction.icon

  // 根据用户类型显示不同的Tab
  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', label: '评估报告', icon: '📊' }
    ]
    
    if (userType === 'beginner') {
      return [
        ...baseTabs,
        { id: 'courses', label: '学习路径', icon: '📚' }
      ]
    }
    
    // 进阶和专业用户
    return [
      ...baseTabs,
      { id: 'courses', label: '推荐课程', icon: '📚' },
      { id: 'demands', label: '匹配订单', icon: '💼' }
    ]
  }

  const tabs = getTabs()

  // 渲染课程卡片
  const renderCourseCard = (course) => {
    const meta = CATEGORY_META[course.category] || CATEGORY_META.shortvideo
    return (
      <div 
        key={course.id}
        onClick={() => navigate(`/course/${course.id}`)}
        className="bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all cursor-pointer group"
      >
        <div className="relative h-36 overflow-hidden">
          <img 
            src={course.coverImage} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${meta.gradient} text-white`}>
            {meta.icon} {meta.name}
          </div>
          <div 
            className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${course.levelColor}20`, color: course.levelColor }}
          >
            {course.level}
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
            {course.title}
          </h4>
          <p className="text-sm text-gray-400 mb-3 line-clamp-1">{course.subtitle}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-purple-400 font-bold">¥{course.price}</span>
              <span className="text-gray-500 line-through">¥{course.originalPrice}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 渲染需求卡片
  const renderDemandCard = (demand) => {
    const meta = CATEGORY_META[demand.catId] || CATEGORY_META.shortvideo
    return (
      <div 
        key={demand.id}
        className="bg-slate-800/60 border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${meta.gradient} text-white`}>
            {meta.icon} {meta.name}
          </div>
          <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
            待接单
          </span>
        </div>
        <h4 className="font-semibold text-white mb-2 line-clamp-2">{demand.title}</h4>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span>预算: ¥{(demand.budget || 0).toLocaleString()}</span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {demand.deadline || '灵活'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-gray-400">
              {demand.publisherName?.charAt(0) || '匿'}
            </div>
            <span className="text-sm text-gray-500">{demand.publisherName}</span>
          </div>
          <button
            onClick={() => navigate('/demand')}
            className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors"
          >
            查看详情
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 报告头部 - 优化结构 */}
        <div className="text-center mb-8">
          {/* 报告标题 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">OPC超级个体觉醒诊断报告</span>
          </div>
          
          {/* 等级展示 */}
          <h1 className="text-4xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              {levelInfo.name}
            </span>
          </h1>
          
          {/* 等级标签 */}
          <div className="inline-flex items-center gap-3 mb-4">
            <span 
              className="px-4 py-1.5 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${levelInfo.color}20`, color: levelInfo.color }}
            >
              {result.level}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{levelInfo.desc}</span>
          </div>
          
          {/* 核心评估结果（≤300字） */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                <Target size={16} />
                核心评估结果
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                {summary}
              </p>
            </div>
          </div>
          
          {/* 行动指令区域 - PRD要求的关键按钮 */}
          <div className={`max-w-2xl mx-auto mb-6`}>
            <div className={`bg-gradient-to-r ${userAction.gradient} p-[2px] rounded-2xl`}>
              <div className="bg-slate-900 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${userAction.gradient} flex items-center justify-center`}>
                    <ActionIcon size={28} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white mb-1">{userAction.title}</h3>
                    <p className="text-gray-400 text-sm">{userAction.subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(userAction.target)}
                  className={`w-full py-4 bg-gradient-to-r ${userAction.gradient} text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all shadow-lg`}
                >
                  {userAction.buttonText} →
                </button>
              </div>
            </div>
          </div>
          
          {/* 操作按钮：下载 + 分享 */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => downloadReport(result, levelInfo)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 transition-all"
            >
              <Download size={16} />
              <span className="text-sm">下载报告</span>
            </button>
            <button
              onClick={() => shareReport(result, levelInfo)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 transition-all"
            >
              <Share2 size={16} />
              <span className="text-sm">分享</span>
            </button>
          </div>
        </div>

        {/* Tab切换 */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========== 评估报告 Tab ========== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 四维度雷达图 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">🎯 四维度能力分析</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(result.dimensionScores).map(([key, score]) => {
                  const dim = dimensionConfig[key]
                  const DimIcon = dim.icon
                  return (
                    <div 
                      key={key} 
                      className="bg-white/5 rounded-xl p-4 text-center"
                    >
                      <div 
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${dim.gradient} mb-3`}
                      >
                        <DimIcon size={24} className="text-white" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{score}</div>
                      <div className="text-sm text-gray-400">{dim.name}</div>
                      <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${dim.gradient} transition-all duration-1000`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 能力标签 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">🏷️ 你的能力标签</h3>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-white/10 rounded-full text-sm text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 快速行动入口 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">🚀 快速行动</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate('/training')}
                  className="p-4 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-all flex items-center gap-3"
                >
                  <span className="text-2xl">📚</span>
                  <div>
                    <div className="font-medium text-white text-sm">查看推荐课程</div>
                    <div className="text-xs text-gray-400">学习提升能力</div>
                  </div>
                </button>
                {userType !== 'beginner' && (
                  <button
                    onClick={() => navigate('/opc-certification')}
                    className="p-4 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-all flex items-center gap-3"
                  >
                    <span className="text-2xl">⭐</span>
                    <div>
                      <div className="font-medium text-white text-sm">签约成为OPC</div>
                      <div className="text-xs text-gray-400">开始接单变现</div>
                    </div>
                  </button>
                )}
                {userType !== 'beginner' && (
                  <button
                    onClick={() => navigate('/demand')}
                    className="p-4 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-all flex items-center gap-3"
                  >
                    <span className="text-2xl">💼</span>
                    <div>
                      <div className="font-medium text-white text-sm">匹配需求订单</div>
                      <div className="text-xs text-gray-400">开始接单赚钱</div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========== 推荐课程 Tab ========== */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <BookOpen size={28} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">智能推荐课程</h3>
                  <p className="text-gray-400 text-sm">基于您的能力评估，为您匹配最合适的学习路径</p>
                </div>
              </div>
              
              {/* 签约入口 - 非新手用户 */}
              {userType !== 'beginner' && (
                <div className="mt-4 p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-violet-300 mb-1">✨ 您也可以直接签约成为OPC创作者</div>
                      <p className="text-sm text-gray-400">跳过学习，直接开始接单变现</p>
                    </div>
                    <button
                      onClick={() => navigate('/opc-certification')}
                      className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                    >
                      立即签约
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedCourses.map(course => renderCourseCard(course))}
            </div>

            {/* 更多课程入口 */}
            <div className="text-center">
              <button
                onClick={() => navigate('/training')}
                className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all border border-white/10"
              >
                查看全部课程 →
              </button>
            </div>
          </div>
        )}

        {/* ========== 匹配订单 Tab ========== */}
        {activeTab === 'demands' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <TrendingUp size={28} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">智能匹配订单</h3>
                  <p className="text-gray-400 text-sm">基于您的能力等级，为您推荐最适合接单的需求</p>
                </div>
              </div>
              
              {/* 签约入口 */}
              <div className="mt-4 p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-violet-300 mb-1">还没有签约？</div>
                    <p className="text-sm text-gray-400">签约成为OPC创作者后即可投标接单</p>
                  </div>
                  <button
                    onClick={() => navigate('/opc-certification')}
                    className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                  >
                    立即签约
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedDemands.map(demand => renderDemandCard(demand))}
            </div>

            {/* 更多订单入口 */}
            <div className="text-center">
              <button
                onClick={() => navigate('/demand')}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                去智配中心查看全部订单 →
              </button>
            </div>
          </div>
        )}

        {/* 底部操作 */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/opc-assessment')}
            className="px-6 py-3 bg-white/10 text-gray-400 rounded-xl hover:bg-white/20 transition-all"
          >
            ← 重新评估
          </button>
          <button
            onClick={() => navigate('/awakening')}
            className="px-6 py-3 bg-white/10 text-gray-400 rounded-xl hover:bg-white/20 transition-all"
          >
            🏠 返回首页
          </button>
        </div>
      </div>
    </div>
  )
}
