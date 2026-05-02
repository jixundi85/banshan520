import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// 评估维度定义
const dimensions = [
  { key: 'content', name: '内容创作', desc: 'AI漫剧、短视频、广告、电影制作能力' },
  { key: 'workflow', name: '工作流搭建', desc: '智能体工具、小龙虾开发、AI工作流构建' },
  { key: 'model', name: '大模型应用', desc: '大模型训练、微调、应用落地能力' },
  { key: 'business', name: '商业落地', desc: '企业AI升级、商业化交付、项目管理' }
]
// 评估题目（每维度5题，共20题）- 贴合AIGC业务方向
const questions = [
  // 内容创作维度
  { id: 1, dimension: 'content', question: '你能否独立完成AI漫剧的全流程制作？', options: [
    { text: '能独立完成脚本、分镜、角色、动画全流程', score: 5 },
    { text: '能完成大部分环节，部分需要外部支持', score: 4 },
    { text: '了解流程，但实操经验较少', score: 2 },
    { text: '不太了解AI漫剧制作流程', score: 1 }
  ]},
  { id: 2, dimension: 'content', question: '在AI广告制作方面，你的经验是？', options: [
    { text: '独立完成过多个品牌AI广告项目并上线', score: 5 },
    { text: '参与过AI广告项目，熟悉制作流程', score: 4 },
    { text: '学习过相关技术，缺乏实战经验', score: 2 },
    { text: '没有接触过AI广告制作', score: 1 }
  ]},
  { id: 3, dimension: 'content', question: '你使用AI工具制作AI电影/短剧的经验如何？', options: [
    { text: '完整制作过AI电影或系列短剧作品', score: 5 },
    { text: '制作过AI短视频，了解长视频流程', score: 4 },
    { text: '会用AI生成片段，未完整制作过', score: 2 },
    { text: '没有尝试过AI电影制作', score: 1 }
  ]},
  { id: 4, dimension: 'content', question: '对于AI文旅内容制作（如虚拟景区、数字人导游），你的掌握程度？', options: [
    { text: '交付过AI文旅项目，熟悉行业需求', score: 5 },
    { text: '制作过相关作品，了解应用场景', score: 4 },
    { text: '看过案例，知道基本技术路线', score: 2 },
    { text: '不了解AI文旅内容制作', score: 1 }
  ]},
  { id: 5, dimension: 'content', question: '你掌握的AI设计工具有哪些？', options: [
    { text: '精通Midjourney/SD/ComfyUI等全流程工具', score: 5 },
    { text: '熟练使用主流AI设计工具', score: 4 },
    { text: '会用基础的AI绘图工具', score: 2 },
    { text: '很少使用AI设计工具', score: 1 }
  ]},
  
  // 工作流搭建维度
  { id: 6, dimension: 'workflow', question: '你是否具备AI工作流搭建能力？', options: [
    { text: '能独立搭建复杂AI工作流并交付企业使用', score: 5 },
    { text: '能搭建中等复杂度的工作流', score: 4 },
    { text: '会用现成的工作流模板', score: 2 },
    { text: '不了解工作流搭建', score: 1 }
  ]},
  { id: 7, dimension: 'workflow', question: '对于智能体（Agent）开发，你的经验是？', options: [
    { text: '独立开发过智能体应用并上线运行', score: 5 },
    { text: '参与过智能体项目开发', score: 4 },
    { text: '学习过智能体概念和基础开发', score: 2 },
    { text: '不了解智能体开发', score: 1 }
  ]},
  { id: 8, dimension: 'workflow', question: '你是否使用过小龙虾（Coze/扣子）等低代码AI开发平台？', options: [
    { text: '熟练使用并交付过多个项目', score: 5 },
    { text: '会用平台搭建基础应用', score: 4 },
    { text: '了解平台功能，实操较少', score: 2 },
    { text: '没听说过这些平台', score: 1 }
  ]},
  { id: 9, dimension: 'workflow', question: '在自动化内容生产方面，你的能力是？', options: [
    { text: '搭建过自动化内容生产线，实现批量产出', score: 5 },
    { text: '会用RPA+AI实现部分自动化', score: 4 },
    { text: '了解自动化概念，未实际搭建', score: 2 },
    { text: '没有接触过自动化生产', score: 1 }
  ]},
  { id: 10, dimension: 'workflow', question: '你是否具备AI工具链整合能力？', options: [
    { text: '能整合多种AI工具形成完整解决方案', score: 5 },
    { text: '能组合3-5种工具完成项目', score: 4 },
    { text: '会用单一工具完成基础任务', score: 2 },
    { text: '不熟悉AI工具链整合', score: 1 }
  ]},
  
  // 大模型应用维度
  { id: 11, dimension: 'model', question: '你是否具备大模型训练/微调能力？', options: [
    { text: '有实际微调经验，能定制垂直领域模型', score: 5 },
    { text: '了解微调方法，做过实验性项目', score: 4 },
    { text: '知道概念，没有实操经验', score: 2 },
    { text: '不了解大模型训练/微调', score: 1 }
  ]},
  { id: 12, dimension: 'model', question: '对于Prompt Engineering（提示词工程），你的水平是？', options: [
    { text: '精通多模型提示词优化，有系统方法论', score: 5 },
    { text: '熟练编写高效提示词', score: 4 },
    { text: '会写基础提示词，效果一般', score: 2 },
    { text: '不太懂提示词优化技巧', score: 1 }
  ]},
  { id: 13, dimension: 'model', question: '你是否了解RAG（检索增强生成）技术？', options: [
    { text: '落地过RAG项目，能解决实际问题', score: 5 },
    { text: '搭建过RAG demo，了解技术细节', score: 4 },
    { text: '知道概念，没有实操', score: 2 },
    { text: '不了解RAG技术', score: 1 }
  ]},
  { id: 14, dimension: 'model', question: '在企业AI应用落地方面，你的经验是？', options: [
    { text: '主导过企业AI项目落地并产生实际效益', score: 5 },
    { text: '参与过企业AI应用实施', score: 4 },
    { text: '了解企业AI应用场景', score: 2 },
    { text: '没有企业AI项目经验', score: 1 }
  ]},
  { id: 15, dimension: 'model', question: '你对多模态大模型（图文音视频）的掌握程度？', options: [
    { text: '熟练使用多模态模型完成复杂项目', score: 5 },
    { text: '会用多模态模型处理常见任务', score: 4 },
    { text: '了解能力，使用经验较少', score: 2 },
    { text: '不了解多模态大模型', score: 1 }
  ]},
  
  // 商业落地维度
  { id: 16, dimension: 'business', question: '你是否有企业AI智能升级项目经验？', options: [
    { text: '主导过多个企业AI升级项目交付', score: 5 },
    { text: '参与过企业AI咨询或实施项目', score: 4 },
    { text: '了解企业AI需求，缺乏项目经验', score: 2 },
    { text: '没有接触过企业AI项目', score: 1 }
  ]},
  { id: 17, dimension: 'business', question: '对于AIGC商业化变现，你的理解是？', options: [
    { text: '有成熟的变现模式和稳定客户', score: 5 },
    { text: '完成过商业项目，了解变现路径', score: 4 },
    { text: '有作品但缺乏商业转化经验', score: 2 },
    { text: '没有考虑过商业化', score: 1 }
  ]},
  { id: 18, dimension: 'business', question: '你在项目管理与客户沟通方面的能力？', options: [
    { text: '能独立管理项目全流程并维护客户关系', score: 5 },
    { text: '能完成项目交付，沟通顺畅', score: 4 },
    { text: '技术可以，沟通需要提升', score: 2 },
    { text: '更擅长执行，不擅长项目管理', score: 1 }
  ]},
  { id: 19, dimension: 'business', question: '你是否具备跨领域整合能力（如AI+营销/AI+教育）？', options: [
    { text: '在特定领域有深度整合经验', score: 5 },
    { text: '有跨领域项目经验', score: 4 },
    { text: '了解跨领域应用场景', score: 2 },
    { text: '只专注单一技术领域', score: 1 }
  ]},
  { id: 20, dimension: 'business', question: '你希望在AIGC领域的发展方向是？', options: [
    { text: '成为企业AI升级解决方案专家', score: 5 },
    { text: '成为AIGC内容创作专家', score: 4 },
    { text: '成为AI技术开发者', score: 3 },
    { text: '还在探索中，没有明确方向', score: 1 }
  ]}
]
// 用户类型判定（小白 vs 专业）
const determineUserType = (scores) => {
  const { content, workflow, model, business } = scores
  const avgScore = (content + workflow + model + business) / 4
  
  // 平均分<50 或 内容创作<40 判定为小白
  if (avgScore < 50 || content < 40) {
    return 'beginner'
  }
  return 'professional'
}
// 等级评定算法
const calculateLevel = (scores) => {
  const { content, workflow, model, business } = scores
  
  // L4: 全维度≥80，商业落地≥70
  if (content >= 80 && workflow >= 80 && model >= 80 && business >= 70) {
    return { level: 'L4', name: '极核引擎手', color: 'from-amber-400 to-yellow-500', type: 'professional' }
  }
  // L3: 内容创作≥80，工作流搭建≥70，大模型应用≥60
  if (content >= 80 && workflow >= 70 && model >= 60) {
    return { level: 'L3', name: '全域操盘手', color: 'from-purple-400 to-violet-500', type: 'professional' }
  }
  // L2: 内容创作≥70，工作流搭建≥60
  if (content >= 70 && workflow >= 60) {
    return { level: 'L2', name: '矩阵架构师', color: 'from-cyan-400 to-blue-500', type: 'professional' }
  }
  // L1: 内容创作≥60
  if (content >= 60) {
    return { level: 'L1', name: '战术执行者', color: 'from-emerald-400 to-teal-500', type: 'professional' }
  }
  // 未达标 - 小白
  return { level: 'L0', name: '潜力新人', color: 'from-gray-400 to-gray-500', type: 'beginner' }
}
// 生成能力标签
const generateTags = (scores) => {
  const tags = []
  if (scores.content >= 80) tags.push('内容创作')
  if (scores.workflow >= 80) tags.push('工作流搭建')
  if (scores.model >= 80) tags.push('大模型应用')
  if (scores.business >= 80) tags.push('商业落地')
  if (scores.content >= 70 && scores.workflow >= 70) tags.push('全栈AIGC')
  if (scores.model >= 70 && scores.business >= 70) tags.push('AI解决方案')
  return tags.length > 0 ? tags : ['持续成长']
}
export default function OPCAssessment() {
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)
  // 从localStorage恢复进度
  useEffect(() => {
    const saved = localStorage.getItem('opc_assessment_progress')
    if (saved) {
      const { answers: savedAnswers, currentQ: savedQ } = JSON.parse(saved)
      setAnswers(savedAnswers)
      setCurrentQ(savedQ)
    }
  }, [])
  // 保存进度
  useEffect(() => {
    localStorage.setItem('opc_assessment_progress', JSON.stringify({ answers, currentQ }))
  }, [answers, currentQ])
  const handleAnswer = (questionId, score) => {
    const newAnswers = { ...answers, [questionId]: score }
    setAnswers(newAnswers)
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      // 计算结果
      calculateResult(newAnswers)
    }
  }
  const calculateResult = (finalAnswers) => {
    const scores = { content: 0, workflow: 0, model: 0, business: 0 }
    const counts = { content: 0, workflow: 0, model: 0, business: 0 }
    questions.forEach(q => {
      const score = finalAnswers[q.id] || 0
      scores[q.dimension] += score
      counts[q.dimension]++
    })
    // 转换为百分制
    Object.keys(scores).forEach(key => {
      scores[key] = Math.round((scores[key] / (counts[key] * 5)) * 100)
    })
    
    const levelInfo = calculateLevel(scores)
    const tags = generateTags(scores)
    
    const userType = levelInfo.type
    
    const resultData = {
      level: levelInfo.level,
      levelName: levelInfo.name,
      color: levelInfo.color,
      userType, // 'beginner' | 'professional'
      scores,
      tags,
      completedAt: new Date().toISOString()
    }
    
    setResult(resultData)
    localStorage.setItem('opc_assessment_result', JSON.stringify(resultData))
    setShowResult(true)
  }
  const progress = ((currentQ + 1) / questions.length) * 100
  if (showResult && result) {
    return (
      
        <div className="min-h-screen bg-slate-900 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* 结果卡片 */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 mb-8">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${result.color} rounded-3xl mb-6 shadow-2xl`}>
                  <span className="text-4xl font-bold text-white">{result.level}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{result.levelName}</h1>
                <p className="text-gray-400">您的OPC能力等级评定结果</p>
              </div>
              {/* 能力雷达 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {dimensions.map(d => (
                  <div key={d.key} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{result.scores[d.key]}</div>
                    <div className="text-gray-400 text-sm">{d.name}</div>
                    <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-1000"
                        style={{ width: `${result.scores[d.key]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* 能力标签 */}
              <div className="mb-8">
                <p className="text-gray-400 text-sm mb-3">能力标签</p>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 rounded-full text-violet-400 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* 用户类型判定结果 */}
              {result.userType === 'beginner' ? (
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">潜力新人</h3>
                      <p className="text-purple-400 text-sm">建议先学习系统课程</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    你的创作潜力正在觉醒！建议先进入课程中心学习人工智能和AIGC实战课程，
                    掌握核心技能后再申请成为认证OPC。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-gray-300 text-xs">零基础友好</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-gray-300 text-xs">系统学习</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-gray-300 text-xs">实战导向</span>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">专业创作者</h3>
                      <p className="text-cyan-400 text-sm">具备签约认证资格</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    你的能力已经达到专业水平！可以申请签约成为认证职业OPC，
                    进入智配中心承接企业需求，开始你的变现之旅。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-gray-300 text-xs">立即接单</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-gray-300 text-xs">企业需求</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-gray-300 text-xs">稳定收入</span>
                  </div>
                </div>
              )}
              {/* 升级建议 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">🎯 升级建议</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {result.userType === 'beginner' ? (
                    <>
                      <li>• 进入课程中心学习AI漫剧、AI广告等实战课程</li>
                      <li>• 掌握ComfyUI、Midjourney等主流AI工具</li>
                      <li>• 学习工作流搭建和智能体开发基础</li>
                      <li>• 完成学习后可重新评估申请签约</li>
                    </>
                  ) : result.level === 'L1' ? (
                    <>
                      <li>• 强化AI内容创作能力，积累作品集</li>
                      <li>• 学习工作流搭建，提升自动化生产能力</li>
                      <li>• 参与实战项目，积累商业交付经验</li>
                      <li>• 目标：提升至L2矩阵架构师</li>
                    </>
                  ) : result.level === 'L2' ? (
                    <>
                      <li>• 深入学习大模型应用和Prompt Engineering</li>
                      <li>• 掌握RAG、智能体开发等进阶技术</li>
                      <li>• 开始承担企业AI项目的整体交付</li>
                      <li>• 目标：提升至L3全域操盘手</li>
                    </>
                  ) : result.level === 'L3' ? (
                    <>
                      <li>• 提升商业落地能力，拓展企业客户资源</li>
                      <li>• 培养跨领域整合能力，提供完整解决方案</li>
                      <li>• 带领团队完成复杂项目交付</li>
                      <li>• 目标：冲击L4极核引擎手</li>
                    </>
                  ) : result.level === 'L4' ? (
                    <>
                      <li>• 您已达到最高等级，具备生态构建能力</li>
                      <li>• 建议申请成为平台导师，培养AIGC人才</li>
                      <li>• 参与行业标准制定，引领AIGC发展方向</li>
                    </>
                  ) : null}
                </ul>
              </div>
            </div>
            {/* 操作按钮 - 根据用户类型显示不同按钮 */}
            <div className="flex flex-wrap gap-4 justify-center">
              {result.userType === 'beginner' ? (
                <>
                  <button
                    onClick={() => navigate('/training')}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all"
                  >
                    进入课程中心学习
                  </button>
                  <button
                    onClick={() => navigate('/opc-profile')}
                    className="px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                  >
                    查看档案
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/opc-certification')}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all"
                  >
                    申请签约认证OPC
                  </button>
                  <button
                    onClick={() => navigate('/matching-center')}
                    className="px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                  >
                    进入智配中心
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setAnswers({})
                  setCurrentQ(0)
                  setShowResult(false)
                  localStorage.removeItem('opc_assessment_progress')
                }}
                className="px-8 py-3 text-gray-400 hover:text-white transition-colors"
              >
                重新评估
              </button>
            </div>
          </div>
        </div>
      
    )
  }
  const currentQuestion = questions[currentQ]
  return (
    
      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* 头部 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">OPC能力评估</h1>
            <p className="text-gray-400">20道题目，评估您的四维度能力水平</p>
          </div>
          {/* 进度条 */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>进度 {currentQ + 1}/{questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {/* 当前维度标签 */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 rounded-full text-violet-400 text-sm">
              {dimensions.find(d => d.key === currentQuestion.dimension)?.name}
            </span>
          </div>
          {/* 题目卡片 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-xl md:text-2xl text-white font-medium mb-6">
              {currentQuestion.question}
            </h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion.id, option.score)}
                  className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-violet-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-violet-500/20 group-hover:text-violet-400 transition-colors">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-gray-300 group-hover:text-white">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* 提示 */}
          <p className="text-center text-gray-500 text-sm">
            选择最符合您实际情况的选项，评估结果将自动保存
          </p>
        </div>
      </div>
    
  )
}
