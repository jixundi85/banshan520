import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Lightbulb } from 'lucide-react'
import { opcCreators, opcConsultants, recommendOPCsFromDiagnosis } from '../../data/opcData'

// 使用共享的OPC数据

// 评分维度配置
const scoreDimensions = {
  readiness: { name: 'AI就绪度', icon: '🚀', color: 'from-cyan-400 to-blue-400' },
  data: { name: '数据成熟度', icon: '📊', color: 'from-green-400 to-emerald-400' },
  security: { name: '安全敏感度', icon: '🔒', color: 'from-orange-400 to-red-400' },
  budget: { name: '投入意愿度', icon: '💰', color: 'from-purple-400 to-pink-400' }
}

// 企业画像标签映射
const industryTags = {
  '电商零售': ['营销自动化', '内容批量生产'],
  '教育培训': ['AI课程开发', '个性化学习'],
  '文化传媒': ['AIGC内容', '数字人IP'],
  '科技互联网': ['产品研发', '技术架构'],
  '传统制造': ['流程优化', '质检自动化'],
  '金融服务': ['风控模型', '合规自动化'],
  '医疗健康': ['影像识别', '病历分析'],
  '其他': ['通用AI方案']
}

// ============================================
// 智能推荐核心逻辑
// ============================================

// 根据诊断结果计算推荐套餐
const calculatePackageRecommendation = (result) => {
  if (!result) return { recommended: 'growth', reason: '' }
  
  const { totalScore, scores, answers } = result
  const industry = answers[0] || '其他'
  const scale = answers[1] || '其他'
  const goals = answers[4] || ''
  
  // 计算综合推荐指数
  const recommendation = {
    starter: { score: 0, reason: '' },
    growth: { score: 0, reason: '' },
    premium: { score: 0, reason: '' }
  }
  
  // 1. 基于总分的推荐
  if (totalScore < 40) {
    recommendation.starter.score += 50
    recommendation.starter.reason = 'AI成熟度较低，建议从启航版开始'
  } else if (totalScore >= 40 && totalScore < 70) {
    recommendation.growth.score += 50
    recommendation.growth.reason = '具备一定基础，适合成长版快速提升'
  } else {
    recommendation.premium.score += 50
    recommendation.premium.reason = 'AI就绪度高，适合旗舰版深度转型'
  }
  
  // 2. 基于预算意愿调整
  if (scores.budget > 80) {
    recommendation.premium.score += 20
  } else if (scores.budget > 60) {
    recommendation.growth.score += 15
  } else {
    recommendation.starter.score += 20
  }
  
  // 3. 基于安全敏感度
  if (scores.security > 75) {
    recommendation.premium.score += 15
    recommendation.premium.reason = '安全要求高，需要全私有化部署'
  }
  
  // 4. 基于数据成熟度
  if (scores.data < 50) {
    recommendation.starter.score += 10
    recommendation.starter.reason = '建议先打好数据基础'
  }
  
  // 5. 基于行业特性
  const highSecurityIndustries = ['金融服务', '医疗健康', '政府机构']
  if (highSecurityIndustries.includes(industry)) {
    recommendation.premium.score += 15
    recommendation.premium.reason = `${industry}需要高安全标准`
  }
  
  // 6. 基于企业规模
  if (scale.includes('500人以上') || scale.includes('集团')) {
    recommendation.premium.score += 20
  } else if (scale.includes('50-500人')) {
    recommendation.growth.score += 15
  } else {
    recommendation.starter.score += 15
  }
  
  // 返回得分最高的套餐
  const scoreArray = [
    { id: 'starter', score: recommendation.starter.score },
    { id: 'growth', score: recommendation.growth.score },
    { id: 'premium', score: recommendation.premium.score }
  ]
  scoreArray.sort((a, b) => b.score - a.score)
  
  const best = scoreArray[0]
  const bestReason = recommendation[best.id].reason
  
  return {
    recommended: best.id,
    reason: bestReason,
    scores: recommendation
  }
}

// 获取套餐的个性化服务项（根据企业短板调整排序）
const getPersonalizedFeatures = (packageId, result) => {
  if (!result) return []
  
  const { scores, answers } = result
  const industry = answers[0] || '其他'
  const painPoints = answers[3] || []
  
  // 基础服务项
  const baseFeatures = {
    starter: [
      { text: '✅ AI成熟度诊断', priority: 100 },
      { text: '✅ 3个OPC人才匹配', priority: 90 },
      { text: '✅ 5个AI视频服务', priority: 70 },
      { text: '✅ 10个AI文案服务', priority: 65 },
      { text: '✅ 企业培训课程（5门）', priority: scores.readiness < 60 ? 95 : 60 },
      { text: '✅ 云端协作工具', priority: 50 },
      { text: '✅ 基础数据安全保障', priority: scores.security > 70 ? 85 : 40 },
      { text: '✅ 工作日响应支持', priority: 30 }
    ],
    growth: [
      { text: '✅ AI成熟度诊断', priority: 80 },
      { text: '✅ 10个OPC人才匹配', priority: 95 },
      { text: '✅ 20个AI视频服务', priority: 70 },
      { text: '✅ 50个AI文案服务', priority: 65 },
      { text: '✅ 企业培训课程（15门）', priority: scores.readiness < 70 ? 90 : 55 },
      { text: '✅ 云端协作工具', priority: 50 },
      { text: '✅ 半私有化部署', priority: scores.security > 60 ? 88 : 40 },
      { text: '✅ 专属顾问服务（季度）', priority: 85 }
    ],
    premium: [
      { text: '✅ 深度AI战略诊断', priority: 100 },
      { text: '✅ 不限OPC人才匹配', priority: 95 },
      { text: '✅ 不限AI视频服务', priority: 80 },
      { text: '✅ 不限AI文案服务', priority: 75 },
      { text: '✅ 全员培训+认证', priority: scores.readiness < 80 ? 90 : 60 },
      { text: '✅ 云端协作工具', priority: 45 },
      { text: '✅ 全私有化部署', priority: scores.security > 70 ? 98 : 50 },
      { text: '✅ 专属顾问服务（驻场）', priority: 92 }
    ]
  }
  
  // 根据痛点调整优先级
  if (painPoints.includes('内容生产效率低')) {
    baseFeatures[packageId].push({ text: '🎯 重点解决内容生产痛点', priority: 99 })
  }
  if (painPoints.includes('人力成本过高')) {
    baseFeatures[packageId].push({ text: '🎯 重点解决人力成本问题', priority: 99 })
  }
  
  // 行业特定服务
  if (industry === '文化传媒') {
    baseFeatures[packageId].unshift({ text: '🎬 文化产业专项支持', priority: 100 })
  }
  
  // 排序并返回
  return baseFeatures[packageId]
    .sort((a, b) => b.priority - a.priority)
    .map(f => f.text)
}

// 获取个性化推荐标签
const getPackageTag = (packageId, recommendation) => {
  if (recommendation.recommended !== packageId) return null
  
  const tags = {
    starter: { text: '建议起步', color: 'green' },
    growth: { text: '智能推荐', color: 'cyan' },
    premium: { text: '最佳匹配', color: 'purple' }
  }
  
  return tags[packageId]
}

// 获取个性化推荐文案
const getRecommendationCopy = (result) => {
  if (!result) return '基于您的企业现状，为您匹配最优AI升级方案'
  
  const { totalScore, scores, answers } = result
  const industry = answers[0] || '企业'
  const scale = answers[1] || '团队'
  
  if (totalScore < 40) {
    return `针对${industry}${scale}的AI入门需求，推荐从启航版开始建立AI认知与基础能力`
  } else if (totalScore < 70) {
    return `您的企业AI就绪度达${scores.readiness}分，适合成长版实现规模化应用`
  } else {
    return `您的企业已具备${scores.readiness > 80 ? '卓越' : '良好'}的AI基础，推荐旗舰版实现深度数字化转型`
  }
}

// 痛点→解决方案映射
const painPointSolutions = {
  '内容生产效率低': {
    solution: 'AIGC内容工厂搭建',
    tools: ['AI文案', 'AI绘图', 'AI视频'],
    opcType: ['AIGC专家', '内容策略师']
  },
  '人力成本过高': {
    solution: 'AI替代与增强方案',
    tools: ['RPA自动化', 'AI客服', '智能审批'],
    opcType: ['流程优化专家', 'RPA工程师']
  },
  '缺乏AI技术人才': {
    solution: 'OPC人才外包+内部培养',
    tools: ['企业培训', '人才匹配'],
    opcType: ['AI培训师', '技术顾问']
  },
  '数据安全风险': {
    solution: '私有化部署+数据主权方案',
    tools: ['本地大模型', '离岸数据中心'],
    opcType: ['安全架构师', '合规专家']
  },
  '营销获客困难': {
    solution: 'AI精准营销系统',
    tools: ['智能投放', '内容矩阵', '数字人直播'],
    opcType: ['增长黑客', 'AI营销专家']
  },
  '业务流程繁琐': {
    solution: '业务流程AI化改造',
    tools: ['流程挖掘', '智能审批', '知识图谱'],
    opcType: ['流程优化师', 'BPM专家']
  },
  '决策缺乏数据支撑': {
    solution: '数据中台+AI决策支持',
    tools: ['BI系统', '预测模型', '智能报表'],
    opcType: ['数据架构师', '商业分析师']
  },
  '跨境业务合规难题': {
    solution: '离岸合规架构设计',
    tools: ['MDAG申请', 'FIMI合规', '数据本地化'],
    opcType: ['合规顾问', '跨境法务']
  }
}

export default function DiagnosisResult() {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [recommendedOPCs, setRecommendedOPCs] = useState({ creators: [], consultants: [] })
  
  // 从URL参数获取初始Tab
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (['overview', 'opc', 'solution'].includes(tab)) return tab
    return 'overview'
  }
  
  const [activeTab, setActiveTab] = useState(getInitialTab)

  useEffect(() => {
    // 从localStorage读取诊断结果
    const savedResult = localStorage.getItem('enterprise_diagnosis_result')
    if (savedResult) {
      const parsed = JSON.parse(savedResult)
      setResult(parsed)
      
      // 使用共享的OPC推荐函数
      const recommendations = recommendOPCsFromDiagnosis(parsed)
      setRecommendedOPCs(recommendations)
    }
  }, [])

  // 生成升级建议
  const generateRecommendations = () => {
    if (!result) return []
    
    const { scores, answers } = result
    const recommendations = []
    
    // 基于AI就绪度 - 企业Boss公开课
    if (scores.readiness < 60) {
      recommendations.push({
        icon: '🎓',
        title: 'AI认知升级',
        desc: '建议先进行全员AI培训，建立基础认知',
        action: '查看Boss公开课',
        link: '/boss-academy'
      })
    }
    
    // 基于数据成熟度 - 发布需求找OPC解决
    if (scores.data < 50) {
      recommendations.push({
        icon: '📈',
        title: '数据基础建设',
        desc: '建议先建立数据收集和管理体系',
        action: '发布数据需求',
        link: '/enterprise-demand'
      })
    }
    
    // 基于安全敏感度 - 离岸中心
    if (scores.security > 75) {
      recommendations.push({
        icon: '🏝️',
        title: '离岸数据中心',
        desc: '考虑马来西亚/新加坡节点部署',
        action: '探索离岸方案',
        link: '/offshore-hub'
      })
    }
    
    // 基于痛点 - 去智配中心找解决方案（answers[3] 是痛点多选数组）
    const painPoints = answers[3] || []
    if (Array.isArray(painPoints)) {
      painPoints.slice(0, 2).forEach(pain => {
        const solution = painPointSolutions[pain]
        if (solution && !recommendations.find(r => r.title.includes(solution.solution))) {
          recommendations.push({
            icon: '💡',
            title: solution.solution,
            desc: `解决"${pain}"的最佳实践方案`,
            action: '去智配中心匹配',
            link: '/creator?tab=opc-experts'
          })
        }
      })
    }
    
    return recommendations.slice(0, 4)
  }

  // 生成诊断概要
  const generateSummary = (result) => {
    if (!result) return '暂无诊断数据'
    
    const { scores, answers, totalScore, level } = result
    const industry = answers[0] || '未知行业'
    const scale = answers[1] || '未知规模'
    
    let summary = `${industry}企业，${scale}。\n\n`
    summary += `您的企业碳硅共生指数为${totalScore}分，处于"${level}"阶段。\n\n`
    
    // 分析薄弱项
    const weakDimensions = Object.entries(scores)
      .filter(([_, score]) => score < 60)
      .map(([key]) => scoreDimensions[key]?.name)
      .filter(Boolean)
    
    if (weakDimensions.length > 0) {
      summary += `在${weakDimensions.join('、')}方面仍有较大提升空间。\n\n`
    }
    
    summary += '建议通过OPC人才匹配获取专业支持，快速提升企业AI能力。'
    
    return summary
  }

  // 生成企业画像标签
  const generateCompanyTags = () => {
    if (!result) return []
    const { answers } = result
    const tags = []
    
    // answers[0] = 行业, answers[1] = 企业规模, answers[4] = AI目标
    if (answers[0]) tags.push({ label: answers[0], type: 'industry' })
    if (answers[1]) tags.push({ label: answers[1], type: 'scale' })
    if (answers[4]) tags.push({ label: answers[4], type: 'goal' })
    
    // 根据分数添加特征标签
    if (result.scores.readiness > 70) tags.push({ label: 'AI先行者', type: 'feature' })
    if (result.scores.security > 75) tags.push({ label: '安全敏感', type: 'feature' })
    if (result.scores.budget > 70) tags.push({ label: '高投入意愿', type: 'feature' })
    
    return tags
  }

  // 空状态处理
  if (!result) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <Building2 size={32} className="text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">暂无诊断数据</h2>
          <p className="text-gray-400 mb-4">请先完成企业AI诊断</p>
          <button
            onClick={() => navigate('/enterprise-diagnosis')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all"
          >
            去进行诊断
          </button>
        </div>
      </div>
    )
  }

  const recommendations = generateRecommendations()
  const companyTags = generateCompanyTags()
  
  // 智能推荐核心
  const packageRecommendation = calculatePackageRecommendation(result)
  const recommendationCopy = getRecommendationCopy(result)

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              企业智能升级诊断报告
            </span>
          </h1>
          <p className="text-gray-400">基于您的企业现状，为您匹配最优AI升级方案</p>
        </div>

        {/* Tab切换 */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'overview', label: '诊断概览', icon: '📊' },
            { id: 'opc', label: '推荐OPC', icon: '👥' },
            { id: 'solution', label: '升级方案', icon: '💡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 诊断概览 Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 核心指标卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 碳硅共生指数 */}
              <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-4 border-cyan-500/30 mb-4">
                  <div>
                    <div className="text-4xl font-bold text-white">{result.totalScore}</div>
                    <div className="text-xs text-gray-400">总分</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{result.level}</h3>
                <p className="text-sm text-gray-400">碳硅共生指数</p>
              </div>

              {/* 企业画像 */}
              <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🏢 企业画像</h3>
                <div className="flex flex-wrap gap-2">
                  {companyTags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        tag.type === 'industry' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                        tag.type === 'feature' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        'bg-slate-700 text-gray-300'
                      }`}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400">{result.description}</p>
                </div>
              </div>

              {/* 诊断概要卡片 */}
              <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb size={20} className="text-cyan-400" />
                  诊断概要
                </h3>
                <p className="text-gray-300 mb-4 text-sm whitespace-pre-line">{generateSummary(result)}</p>
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => setActiveTab('solution')}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all"
                  >
                    查看升级方案 →
                  </button>
                </div>
              </div>
            </div>

            {/* 维度分数详情 */}
            <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">📈 维度分析</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(result.scores).map(([key, score]) => (
                  <div key={key} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{scoreDimensions[key].icon}</span>
                      <span className="text-gray-400 text-sm">{scoreDimensions[key].name}</span>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-3xl font-bold text-white">{score}</span>
                      <span className="text-gray-500 text-sm mb-1">/100</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${scoreDimensions[key].color} transition-all duration-1000`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {score >= 75 ? '优秀' : score >= 60 ? '良好' : '待提升'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 推荐OPC Tab */}
        {activeTab === 'opc' && (
          <div className="space-y-8">
            {/* OPC创作者推荐 */}
            {recommendedOPCs.creators?.length > 0 && (
              <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
                  <h3 className="text-lg font-semibold text-white">🎬 为您匹配的OPC创作者</h3>
                  <span className="text-sm text-gray-400">基于您的企业画像智能推荐</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedOPCs.creators.map((opc) => (
                    <div key={opc.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all border border-transparent hover:border-cyan-500/30">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={opc.avatarUrl} alt={opc.name} className="w-14 h-14 rounded-full bg-slate-700 object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white truncate">{opc.name}</h4>
                            <span className={`px-1.5 py-0.5 rounded text-xs ${
                              opc.availability === '可接单' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-orange-500/20 text-orange-400'
                            }`}>
                              {opc.availability}
                            </span>
                          </div>
                          <p className="text-sm text-cyan-400 truncate">{opc.title}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {opc.skills.slice(0, 2).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-700 rounded text-xs text-gray-400">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        <span>⭐ {opc.rating}</span>
                        <span>📋 {opc.completedProjects}个项目</span>
                        <span className="text-cyan-400 font-medium">匹配度 {opc.matchScore}%</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // 通过 URL 参数传递意图（最可靠的方式）
                            const opcDataBase64 = btoa(encodeURIComponent(JSON.stringify(opc)))
                            navigate(`/creator?tab=opc-experts&intent=creator&opc=${opcDataBase64}`)
                          }}
                          className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all text-sm font-medium"
                        >
                          立即咨询
                        </button>
                        <button
                          onClick={() => navigate('/creator-profile/' + opc.id, { state: { creator: opc } })}
                          className="px-3 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all text-sm"
                        >
                          详情
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OPC咨询专家推荐 */}
            {recommendedOPCs.consultants?.length > 0 && (
              <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
                  <h3 className="text-lg font-semibold text-white">💼 为您匹配的OPC咨询专家</h3>
                  <span className="text-sm text-gray-400">基于您的企业画像智能推荐</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedOPCs.consultants.map((opc) => (
                    <div key={opc.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all border border-transparent hover:border-purple-500/30">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={opc.avatarUrl} alt={opc.name} className="w-14 h-14 rounded-full bg-slate-700 object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white truncate">{opc.name}</h4>
                            <span className={`px-1.5 py-0.5 rounded text-xs ${
                              opc.availability === '可接单' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-orange-500/20 text-orange-400'
                            }`}>
                              {opc.availability}
                            </span>
                          </div>
                          <p className="text-sm text-purple-400 truncate">{opc.title}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {opc.skills.slice(0, 2).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-700 rounded text-xs text-gray-400">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        <span>⭐ {opc.rating}</span>
                        <span>📋 {opc.completedProjects}个项目</span>
                        <span className="text-purple-400 font-medium">匹配度 {opc.matchScore}%</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // 保存咨询意图到 localStorage
                            localStorage.setItem('consultation_intent', JSON.stringify({
                              type: 'consultant',
                              opcId: opc.id,
                              opcData: opc,
                              packageName: `指定专家：${opc.name}`,
                              diagnosisResult: result,
                              timestamp: new Date().toISOString()
                            }))
                            navigate('/creator?tab=opc-experts')
                          }}
                          className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all text-sm font-medium"
                        >
                          立即咨询
                        </button>
                        <button
                          onClick={() => navigate('/creator-profile/' + opc.id, { state: { consultant: opc } })}
                          className="px-3 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all text-sm"
                        >
                          详情
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 查看更多 */}
            <div className="text-center">
              <button
                onClick={() => navigate('/creator?tab=opc-experts')}
                className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all border border-white/10"
              >
                去OPC专家咨询 →
              </button>
            </div>
          </div>
        )}

        {/* 升级方案 Tab */}
        {activeTab === 'solution' && (
          <div className="space-y-6">
            {/* 服务方案卡片 */}
            <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">🎯 企业AI升级方案</h3>
                <span className="text-sm text-cyan-400">✨ {recommendationCopy}</span>
              </div>
              
              {/* 三套餐 - 企业AI升级方案（严格水平对齐） */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ========== 启航版 ========== */}
                <div className={`relative flex flex-col rounded-2xl p-6 border-2 transition-all ${
                  packageRecommendation.recommended === 'starter' 
                    ? 'bg-gradient-to-b from-green-500/15 to-green-500/5 border-green-500 shadow-lg shadow-green-500/20' 
                    : 'bg-gradient-to-b from-green-500/10 to-transparent border-white/10 hover:border-green-500/50'
                }`}>
                  {/* 智能推荐标签 - 固定占位 */}
                  <div className="h-6 flex items-center justify-center mb-2">
                    {packageRecommendation.recommended === 'starter' ? (
                      <div className="px-4 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                        {getPackageTag('starter', packageRecommendation)?.text || '建议起步'}
                      </div>
                    ) : <div />}
                  </div>
                  
                  {/* 推荐理由 - 固定高度 */}
                  <div className="h-10 flex items-center justify-center mb-2">
                    {packageRecommendation.recommended === 'starter' && packageRecommendation.reason ? (
                      <p className="text-xs text-green-400 text-center leading-tight px-1">{packageRecommendation.reason}</p>
                    ) : <div />}
                  </div>
                  
                  {/* 标题区 */}
                  <div className="text-center mb-2">
                    <h4 className="text-xl font-bold text-white">启航版</h4>
                    <p className="text-sm text-gray-400">AI升级入门首选</p>
                  </div>
                  
                  {/* 价格区 - 固定高度 */}
                  <div className="h-20 flex flex-col items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-green-400">¥29,800</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 line-through">¥39,800</span>
                      <span className="text-xs text-green-400">省¥10,000</span>
                    </div>
                  </div>
                  
                  {/* 适用周期 - 固定高度 */}
                  <div className="h-10 text-center text-xs text-gray-400 mb-3">
                    <p>适用周期：<span className="text-white">3个月</span></p>
                    <p>适合：<span className="text-white">中小企业、初创团队</span></p>
                  </div>
                  
                  {/* 服务列表 - 固定高度 */}
                  <div className="h-[132px] overflow-hidden mb-3">
                    {getPersonalizedFeatures('starter', result).slice(0, 6).map((feature, i) => (
                      <div key={i} className="text-sm text-gray-300 leading-relaxed">{feature}</div>
                    ))}
                  </div>
                  
                  {/* 按钮 - 固定在底部 */}
                  <button
                    onClick={() => {
                      localStorage.setItem('consultation_intent', JSON.stringify({
                        package: 'starter',
                        packageName: '启航版',
                        price: 29800,
                        originalPrice: 39800,
                        period: '3个月',
                        recommendationReason: packageRecommendation.reason,
                        diagnosisResult: result,
                        timestamp: new Date().toISOString()
                      }))
                      navigate('/ai-assistant')
                    }}
                    className={`w-full py-3 rounded-lg transition-all font-medium ${
                      packageRecommendation.recommended === 'starter'
                        ? 'bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/30'
                        : 'bg-green-600/50 text-white hover:bg-green-600'
                    }`}
                  >
                    立即咨询
                  </button>
                </div>

                {/* ========== 成长版 ========== */}
                <div className={`relative flex flex-col rounded-2xl p-6 border-2 transition-all ${
                  packageRecommendation.recommended === 'growth' 
                    ? 'bg-gradient-to-b from-cyan-500/15 to-cyan-500/5 border-cyan-500 shadow-lg shadow-cyan-500/20' 
                    : 'bg-gradient-to-b from-cyan-500/10 to-transparent border-white/10 hover:border-cyan-500/50'
                }`}>
                  {/* 智能推荐标签 - 固定占位 */}
                  <div className="h-6 flex items-center justify-center mb-2">
                    {packageRecommendation.recommended === 'growth' ? (
                      <div className="px-4 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full">
                        {getPackageTag('growth', packageRecommendation)?.text || '智能推荐'}
                      </div>
                    ) : <div />}
                  </div>
                  
                  {/* 推荐理由 - 固定高度 */}
                  <div className="h-10 flex items-center justify-center mb-2">
                    {packageRecommendation.recommended === 'growth' && packageRecommendation.reason ? (
                      <p className="text-xs text-cyan-400 text-center leading-tight px-1">{packageRecommendation.reason}</p>
                    ) : <div />}
                  </div>
                  
                  {/* 标题区 */}
                  <div className="text-center mb-2">
                    <h4 className="text-xl font-bold text-white">成长版</h4>
                    <p className="text-sm text-gray-400">AI规模化应用</p>
                  </div>
                  
                  {/* 价格区 - 固定高度 */}
                  <div className="h-20 flex flex-col items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-cyan-400">¥79,800</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 line-through">¥99,800</span>
                      <span className="text-xs text-cyan-400">省¥20,000</span>
                    </div>
                  </div>
                  
                  {/* 适用周期 - 固定高度 */}
                  <div className="h-10 text-center text-xs text-gray-400 mb-3">
                    <p>适用周期：<span className="text-white">6个月</span></p>
                    <p>适合：<span className="text-white">成长期企业、规模团队</span></p>
                  </div>
                  
                  {/* 服务列表 - 固定高度 */}
                  <div className="h-[132px] overflow-hidden mb-3">
                    {getPersonalizedFeatures('growth', result).slice(0, 6).map((feature, i) => (
                      <div key={i} className="text-sm text-gray-300 leading-relaxed">{feature}</div>
                    ))}
                  </div>
                  
                  {/* 按钮 */}
                  <button
                    onClick={() => {
                      localStorage.setItem('consultation_intent', JSON.stringify({
                        package: 'growth',
                        packageName: '成长版',
                        price: 79800,
                        originalPrice: 99800,
                        period: '6个月',
                        recommendationReason: packageRecommendation.reason,
                        diagnosisResult: result,
                        timestamp: new Date().toISOString()
                      }))
                      navigate('/ai-assistant')
                    }}
                    className={`w-full py-3 rounded-lg transition-all font-medium ${
                      packageRecommendation.recommended === 'growth'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/30'
                        : 'bg-cyan-600/50 text-white hover:bg-cyan-600'
                    }`}
                  >
                    立即咨询
                  </button>
                </div>

                {/* ========== 旗舰版 ========== */}
                <div className={`relative flex flex-col rounded-2xl p-6 border-2 transition-all ${
                  packageRecommendation.recommended === 'premium' 
                    ? 'bg-gradient-to-b from-purple-500/15 to-purple-500/5 border-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'bg-gradient-to-b from-purple-500/10 to-transparent border-white/10 hover:border-purple-500/50'
                }`}>
                  {/* 智能推荐标签 - 固定占位 */}
                  <div className="h-6 flex items-center justify-center mb-2">
                    {packageRecommendation.recommended === 'premium' ? (
                      <div className="px-4 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full">
                        {getPackageTag('premium', packageRecommendation)?.text || '最佳匹配'}
                      </div>
                    ) : <div />}
                  </div>
                  
                  {/* 推荐理由 - 固定高度 */}
                  <div className="h-10 flex items-center justify-center mb-2">
                    {packageRecommendation.recommended === 'premium' && packageRecommendation.reason ? (
                      <p className="text-xs text-purple-400 text-center leading-tight px-1">{packageRecommendation.reason}</p>
                    ) : <div />}
                  </div>
                  
                  {/* 标题区 */}
                  <div className="text-center mb-2">
                    <h4 className="text-xl font-bold text-white">旗舰版</h4>
                    <p className="text-sm text-gray-400">AI数字化转型</p>
                  </div>
                  
                  {/* 价格区 - 固定高度 */}
                  <div className="h-20 flex flex-col items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-purple-400">¥199,800</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 line-through">¥268,000</span>
                      <span className="text-xs text-purple-400">省¥68,200</span>
                    </div>
                  </div>
                  
                  {/* 适用周期 - 固定高度 */}
                  <div className="h-10 text-center text-xs text-gray-400 mb-3">
                    <p>适用周期：<span className="text-white">12个月</span></p>
                    <p>适合：<span className="text-white">大型企业、集团组织</span></p>
                  </div>
                  
                  {/* 服务列表 - 固定高度 */}
                  <div className="h-[132px] overflow-hidden mb-3">
                    {getPersonalizedFeatures('premium', result).slice(0, 6).map((feature, i) => (
                      <div key={i} className="text-sm text-gray-300 leading-relaxed">{feature}</div>
                    ))}
                  </div>
                  
                  {/* 按钮 */}
                  <button
                    onClick={() => {
                      localStorage.setItem('consultation_intent', JSON.stringify({
                        package: 'premium',
                        packageName: '旗舰版',
                        price: 199800,
                        originalPrice: 268000,
                        period: '12个月',
                        recommendationReason: packageRecommendation.reason,
                        diagnosisResult: result,
                        timestamp: new Date().toISOString()
                      }))
                      navigate('/ai-assistant')
                    }}
                    className={`w-full py-3 rounded-lg transition-all font-medium ${
                      packageRecommendation.recommended === 'premium'
                        ? 'bg-purple-500 text-white hover:bg-purple-400 shadow-lg shadow-purple-500/30'
                        : 'bg-purple-600/50 text-white hover:bg-purple-600'
                    }`}
                  >
                    立即咨询
                  </button>
                </div>
              </div>
            </div>

            {/* 升级路线图 */}
            <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">🗺️ AI升级路线图</h3>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-500"></div>
                <div className="space-y-6">
                  {[
                    {
                      phase: '第一阶段',
                      title: '认知建立与试点',
                      duration: '1-2个月',
                      tasks: ['全员AI培训', '选择1-2个场景试点', '建立数据收集体系'],
                      status: result.scores.readiness < 60 ? 'current' : 'completed'
                    },
                    {
                      phase: '第二阶段',
                      title: '场景扩展与流程优化',
                      duration: '3-6个月',
                      tasks: ['扩展AI应用场景', '流程自动化改造', '引入OPC人才'],
                      status: result.scores.readiness >= 60 && result.scores.readiness < 75 ? 'current' : 'pending'
                    },
                    {
                      phase: '第三阶段',
                      title: '全面数字化与智能化',
                      duration: '6-12个月',
                      tasks: ['数据中台建设', 'AI决策支持系统', '私有化部署'],
                      status: result.scores.readiness >= 75 ? 'current' : 'pending'
                    }
                  ].map((stage, index) => (
                    <div key={index} className="relative flex gap-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 z-10 ${
                        stage.status === 'completed' ? 'bg-green-500 border-green-500' :
                        stage.status === 'current' ? 'bg-cyan-500 border-cyan-500' :
                        'bg-slate-700 border-slate-600'
                      }`}>
                        <span className="text-xl">
                          {stage.status === 'completed' ? '✓' : 
                           stage.status === 'current' ? '●' : 
                           '○'}
                        </span>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-cyan-400">{stage.phase}</span>
                          <span className="text-xs text-gray-500">{stage.duration}</span>
                        </div>
                        <h4 className="font-semibold text-white mb-2">{stage.title}</h4>
                        <ul className="space-y-1">
                          {stage.tasks.map((task, i) => (
                            <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                              <span className="w-1 h-1 bg-cyan-500 rounded-full"></span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 增值服务 */}
            <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">✨</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">增值服务</h3>
                  <p className="text-sm text-gray-400">可按需叠加的专项服务</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: '🔒',
                    title: '私有化部署',
                    price: '¥68,000',
                    unit: '起',
                    desc: '本地大模型部署，数据完全自主可控',
                    highlight: result.scores.security > 70
                  },
                  {
                    icon: '🏝️',
                    title: '离岸数据中心',
                    price: '¥38,000',
                    unit: '/月',
                    desc: '马来西亚/新加坡节点，MDAG/FIMI合规',
                    highlight: result.answers?.[3]?.includes('跨境业务合规难题')
                  },
                  {
                    icon: '📚',
                    title: '企业内训',
                    price: '¥18,000',
                    unit: '/次',
                    desc: '定制化AI培训课程，10-50人规模',
                    highlight: result.scores.readiness < 60
                  },
                  {
                    icon: '🤖',
                    title: '数字员工',
                    price: '¥8,800',
                    unit: '/人/月',
                    desc: 'AI虚拟员工，7x24小时自动化办公',
                    highlight: result.scores.budget > 60
                  },
                  {
                    icon: '📊',
                    title: '数据中台',
                    price: '¥128,000',
                    unit: '起',
                    desc: '企业级数据治理与智能分析平台',
                    highlight: result.scores.data < 50
                  },
                  {
                    icon: '🎬',
                    title: 'AIGC内容工厂',
                    price: '¥28,800',
                    unit: '/月',
                    desc: 'AI批量内容生产解决方案',
                    highlight: result.answers?.[4]?.includes('内容生产')
                  },
                  {
                    icon: '🔗',
                    title: '系统集成',
                    price: '面议',
                    unit: '',
                    desc: 'ERP/CRM/OA系统AI升级改造',
                    highlight: false
                  },
                  {
                    icon: '🛡️',
                    title: '合规咨询',
                    price: '¥6,800',
                    unit: '/小时',
                    desc: 'AI法规解读与合规方案设计',
                    highlight: result.scores.security > 70
                  }
                ].map((service, index) => (
                  <div 
                    key={index} 
                    className={`relative bg-white/5 rounded-xl p-4 border transition-all ${
                      service.highlight 
                        ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' 
                        : 'border-transparent hover:border-white/10'
                    }`}
                  >
                    {service.highlight && (
                      <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                        推荐
                      </div>
                    )}
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <h4 className="font-semibold text-white mb-1">{service.title}</h4>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-lg font-bold text-amber-400">{service.price}</span>
                      {service.unit && <span className="text-xs text-gray-500">{service.unit}</span>}
                    </div>
                    <p className="text-xs text-gray-400">{service.desc}</p>
                    <button 
                      onClick={() => navigate('/ai-assistant')}
                      className="mt-3 w-full py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all text-sm"
                    >
                      咨询详情
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 下一步行动 */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">🚀 下一步行动</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate('/enterprise-demand')}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left"
                >
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-medium text-white mb-1">发布需求</div>
                  <div className="text-sm text-gray-400">详细描述您的AI升级需求</div>
                </button>
                <button
                  onClick={() => navigate('/creator?tab=opc-experts')}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left"
                >
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-medium text-white mb-1">OPC咨询</div>
                  <div className="text-sm text-gray-400">智能匹配最适合的OPC专家</div>
                </button>
                <button
                  onClick={() => navigate('/boss-academy')}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left"
                >
                  <div className="text-2xl mb-2">🎓</div>
                  <div className="font-medium text-white mb-1">Boss公开课</div>
                  <div className="text-sm text-gray-400">提升团队AI认知水平</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 底部操作 */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/enterprise-diagnosis')}
            className="px-6 py-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all"
          >
            ← 重新诊断
          </button>
          <button
            onClick={() => navigate('/enterprise-profile')}
            className="px-6 py-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all"
          >
            🏢 企业档案
          </button>
          <button
            onClick={() => navigate('/learning-path')}
            className="px-6 py-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all"
          >
            🎯 升级路径
          </button>
          <button
            onClick={() => {
              // 保存报告到本地
              const reportData = JSON.stringify(result, null, 2)
              const blob = new Blob([reportData], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `企业智能升级诊断报告_${new Date().toLocaleDateString()}.json`
              a.click()
            }}
            className="px-6 py-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all"
          >
            💾 保存报告
          </button>
        </div>
      </div>
    </div>
  )
}
