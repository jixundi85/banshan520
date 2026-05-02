import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Building2, Users, Star, Target, TrendingUp, CheckCircle,
  ArrowRight, Filter, Search, MapPin, Briefcase, Award,
  Zap, ChevronRight, BarChart3, Radar, Sparkles
} from 'lucide-react'

// 模拟OPC数据
const mockOPCs = [
  {
    id: 'opc_001',
    name: '李明',
    avatar: '李',
    level: 'L4',
    title: '极核引擎手',
    skills: ['AI短剧', '内容策划', '团队管理'],
    industries: ['短视频', '电商'],
    completedProjects: 45,
    rating: 4.9,
    hourlyRate: 800,
    availability: '可接单',
    dimensionScores: { execution: 90, architecture: 85, coordination: 88, strategy: 82 }
  },
  {
    id: 'opc_002',
    name: '王芳',
    avatar: '王',
    level: 'L3',
    title: '全域操盘手',
    skills: ['AI广告', '品牌策划', '数据分析'],
    industries: ['广告', '品牌'],
    completedProjects: 32,
    rating: 4.8,
    hourlyRate: 500,
    availability: '可接单',
    dimensionScores: { execution: 85, architecture: 78, coordination: 82, strategy: 75 }
  },
  {
    id: 'opc_003',
    name: '张伟',
    avatar: '张',
    level: 'L2',
    title: '矩阵架构师',
    skills: ['AI设计', 'UI/UX', '视觉创意'],
    industries: ['设计', '互联网'],
    completedProjects: 18,
    rating: 4.7,
    hourlyRate: 350,
    availability: '忙碌',
    dimensionScores: { execution: 78, architecture: 72, coordination: 65, strategy: 60 }
  },
  {
    id: 'opc_004',
    name: '陈静',
    avatar: '陈',
    level: 'L1',
    title: '战术执行者',
    skills: ['AI文案', '内容创作', '社媒运营'],
    industries: ['新媒体', '教育'],
    completedProjects: 8,
    rating: 4.6,
    hourlyRate: 200,
    availability: '可接单',
    dimensionScores: { execution: 70, architecture: 55, coordination: 50, strategy: 45 }
  },
  {
    id: 'opc_005',
    name: '刘洋',
    avatar: '刘',
    level: 'L3',
    title: '全域操盘手',
    skills: ['AI电影', '视频制作', '后期剪辑'],
    industries: ['影视', '娱乐'],
    completedProjects: 28,
    rating: 4.8,
    hourlyRate: 600,
    availability: '可接单',
    dimensionScores: { execution: 88, architecture: 80, coordination: 75, strategy: 70 }
  },
  {
    id: 'opc_006',
    name: '赵敏',
    avatar: '赵',
    level: 'L2',
    title: '矩阵架构师',
    skills: ['AI漫剧', '漫画创作', 'IP孵化'],
    industries: ['动漫', '文创'],
    completedProjects: 15,
    rating: 4.7,
    hourlyRate: 400,
    availability: '可接单',
    dimensionScores: { execution: 80, architecture: 75, coordination: 68, strategy: 62 }
  }
]

// 等级对应关系
const levelMatchingRules = {
  L1: { minOPCLevel: 'L1', maxOPCLevel: 'L2', desc: '初创企业推荐L1-L2 OPC' },
  L2: { minOPCLevel: 'L2', maxOPCLevel: 'L3', desc: '成长企业推荐L2-L3 OPC' },
  L3: { minOPCLevel: 'L3', maxOPCLevel: 'L4', desc: '认证企业推荐L3-L4 OPC' },
  L4: { minOPCLevel: 'L4', maxOPCLevel: 'L4', desc: '标杆企业推荐L4 OPC' }
}

// 等级颜色
const levelColors = {
  L1: 'from-green-500 to-emerald-500',
  L2: 'from-blue-500 to-cyan-500',
  L3: 'from-purple-500 to-pink-500',
  L4: 'from-amber-500 to-orange-500'
}

export default function MatchingCenter() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('experts') // experts | my-demands | my-bids
  const [enterpriseLevel, setEnterpriseLevel] = useState('L2')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [selectedIndustries, setSelectedIndustries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredOPCs, setFilteredOPCs] = useState(mockOPCs)
  const [selectedOPC, setSelectedOPC] = useState(null)
  const [consultationIntent, setConsultationIntent] = useState(null) // 来自诊断的咨询意向
  
  // 新增：我的需求数据
  const [myDemands, setMyDemands] = useState([])
  const [myBids, setMyBids] = useState([])

  // 技能标签
  const skillTags = ['AI短剧', 'AI广告', 'AI电影', 'AI漫剧', 'AI设计', '内容策划', '品牌策划', '视频制作']
  const industryTags = ['短视频', '电商', '广告', '品牌', '设计', '互联网', '新媒体', '影视', '动漫']

  useEffect(() => {
    // 加载用户信息
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(userData)
    
    // 从企业诊断结果中读取等级（正确的key）
    const diagnosisResult = JSON.parse(localStorage.getItem('enterprise_diagnosis_result') || '{}')
    if (diagnosisResult.level) {
      // L4 领先型 → L4，提取前两个字符
      const levelCode = diagnosisResult.level.split(' ')[0]
      setEnterpriseLevel(levelCode || 'L2')
    } else {
      // 兼容旧key
      const oldDiagnosis = JSON.parse(localStorage.getItem('enterpriseDiagnosis') || '{}')
      if (oldDiagnosis.level) setEnterpriseLevel(oldDiagnosis.level)
    }

    // 读取来自诊断结果页的咨询意向
    const intent = localStorage.getItem('consultation_intent')
    if (intent) {
      setConsultationIntent(JSON.parse(intent))
    }
    
    // 加载我的需求数据
    const loadMyData = () => {
      // 加载统一需求数据
      const unifiedDemands = localStorage.getItem('unified_my_demands')
      if (unifiedDemands) {
        setMyDemands(JSON.parse(unifiedDemands))
      }
      
      // 加载我的投标数据
      const unifiedBids = localStorage.getItem('unified_my_bids')
      if (unifiedBids) {
        setMyBids(JSON.parse(unifiedBids))
      }
    }
    
    loadMyData()
    
    // 监听 storage 变化
    const handleStorage = () => loadMyData()
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // 筛选OPC
  useEffect(() => {
    let filtered = mockOPCs
    
    // 根据企业等级筛选匹配的OPC
    const matchingRule = levelMatchingRules[enterpriseLevel]
    const levelOrder = ['L1', 'L2', 'L3', 'L4']
    const minIdx = levelOrder.indexOf(matchingRule.minOPCLevel)
    const maxIdx = levelOrder.indexOf(matchingRule.maxOPCLevel)
    
    filtered = filtered.filter(opc => {
      const opcIdx = levelOrder.indexOf(opc.level)
      return opcIdx >= minIdx && opcIdx <= maxIdx
    })
    
    // 技能筛选
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(opc => 
        selectedSkills.some(skill => opc.skills.includes(skill))
      )
    }
    
    // 行业筛选
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter(opc => 
        selectedIndustries.some(ind => opc.industries.includes(ind))
      )
    }
    
    // 搜索
    if (searchQuery) {
      filtered = filtered.filter(opc => 
        opc.name.includes(searchQuery) ||
        opc.skills.some(s => s.includes(searchQuery)) ||
        opc.title.includes(searchQuery)
      )
    }
    
    // 按匹配度排序（评分+完成项目数）
    filtered = filtered.sort((a, b) => {
      const scoreA = a.rating * 10 + a.completedProjects * 0.1
      const scoreB = b.rating * 10 + b.completedProjects * 0.1
      return scoreB - scoreA
    })
    
    setFilteredOPCs(filtered)
  }, [enterpriseLevel, selectedSkills, selectedIndustries, searchQuery])

  // 计算匹配度
  const calculateMatchScore = (opc) => {
    const levelOrder = ['L1', 'L2', 'L3', 'L4']
    const enterpriseIdx = levelOrder.indexOf(enterpriseLevel)
    const opcIdx = levelOrder.indexOf(opc.level)
    
    // 等级匹配权重 40%
    const levelDiff = Math.abs(enterpriseIdx - opcIdx)
    const levelScore = Math.max(0, 40 - levelDiff * 15)
    
    // 技能匹配权重 30%
    const skillScore = selectedSkills.length > 0 
      ? (opc.skills.filter(s => selectedSkills.includes(s)).length / selectedSkills.length) * 30
      : 15
    
    // 评分权重 20%
    const ratingScore = (opc.rating / 5) * 20
    
    // 经验权重 10%
    const expScore = Math.min(opc.completedProjects / 50, 1) * 10
    
    return Math.round(levelScore + skillScore + ratingScore + expScore)
  }

  // 切换技能筛选
  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  // 切换行业筛选
  const toggleIndustry = (industry) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold">智配中心</h1>
                <p className="text-slate-400 text-xs">企业等级 × OPC等级 智能匹配</p>
              </div>
            </div>
            
            {/* Tab 导航 */}
            <div className="flex items-center gap-1 bg-slate-800/50 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('experts')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'experts'
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                OPC专家
              </button>
              <button
                onClick={() => setActiveTab('my-demands')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'my-demands'
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                我的需求
                {myDemands.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                    {myDemands.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('my-bids')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'my-bids'
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                我的投标
                {myBids.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                    {myBids.length}
                  </span>
                )}
              </button>
            </div>
            
            <button 
              onClick={() => navigate('/enterprise-profile')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              返回企业中心
            </button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">

          {/* 来自诊断报告的咨询意向横幅 */}
          {consultationIntent && (
            <div className="mb-6 bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border border-cyan-500/50 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl">🎯</div>
                <div>
                  <div className="text-white font-bold mb-1">
                    您已选择 <span className="text-cyan-400">「{consultationIntent.packageName}」</span>，以下是为您推荐的专属OPC
                  </div>
                  <div className="text-slate-400 text-sm">
                    诊断得分 {consultationIntent.diagnosisResult?.totalScore} 分 · {consultationIntent.diagnosisResult?.level} · {new Date(consultationIntent.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/diagnosis-result')}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm"
                >
                  查看报告
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('consultation_intent')
                    setConsultationIntent(null)
                  }}
                  className="px-3 py-2 text-slate-400 hover:text-white transition-all text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* OPC专家 Tab 内容 */}
          {activeTab === 'experts' && (
            <>
              {/* 企业等级信息 */}
              <div className="mb-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-blue-400" />
                    <div>
                      <h2 className="text-white font-bold">企业智能匹配</h2>
                      <p className="text-slate-400 text-sm">根据企业等级推荐最适合的OPC</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">企业等级</span>
                    <select 
                      value={enterpriseLevel}
                      onChange={(e) => setEnterpriseLevel(e.target.value)}
                      className="px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-white"
                    >
                      <option value="L1">L1 - 探索企业</option>
                      <option value="L2">L2 - 成长企业</option>
                      <option value="L3">L3 - 认证企业</option>
                      <option value="L4">L4 - 标杆企业</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-blue-300 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>{levelMatchingRules[enterpriseLevel].desc}</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-4 gap-6">
            {/* 左侧筛选 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 搜索 */}
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索OPC或技能"
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500"
                  />
                </div>
              </div>

              {/* 技能筛选 */}
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" /> 技能筛选
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillTags.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        selectedSkills.includes(skill)
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* 行业筛选 */}
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" /> 行业筛选
                </h3>
                <div className="flex flex-wrap gap-2">
                  {industryTags.map(industry => (
                    <button
                      key={industry}
                      onClick={() => toggleIndustry(industry)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        selectedIndustries.includes(industry)
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              {/* 匹配说明 */}
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-400" /> 匹配算法
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>等级匹配</span>
                    <span className="text-white">40%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>技能匹配</span>
                    <span className="text-white">30%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>评分权重</span>
                    <span className="text-white">20%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>经验权重</span>
                    <span className="text-white">10%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧OPC列表 */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400">
                  共找到 <span className="text-white font-bold">{filteredOPCs.length}</span> 位匹配的OPC
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Filter className="w-4 h-4" />
                  <span>按匹配度排序</span>
                </div>
              </div>

              <div className="space-y-4">
                {filteredOPCs.map(opc => {
                  const matchScore = calculateMatchScore(opc)
                  return (
                    <div 
                      key={opc.id}
                      onClick={() => setSelectedOPC(opc)}
                      className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        {/* 头像 */}
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${levelColors[opc.level]} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
                          {opc.avatar}
                        </div>

                        {/* 信息 */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-bold text-lg">{opc.name}</h3>
                                <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${levelColors[opc.level]} text-white`}>
                                  {opc.level}
                                </span>
                                <span className="text-slate-400 text-sm">{opc.title}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500" /> {opc.rating}
                                </span>
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-green-500" /> {opc.completedProjects}个项目
                                </span>
                                <span className={`flex items-center gap-1 ${opc.availability === '可接单' ? 'text-green-400' : 'text-yellow-400'}`}>
                                  <Zap className="w-4 h-4" /> {opc.availability}
                                </span>
                              </div>
                            </div>
                            
                            {/* 匹配度 */}
                            <div className="text-right">
                              <div className="text-3xl font-bold text-purple-400">{matchScore}%</div>
                              <p className="text-slate-400 text-sm">匹配度</p>
                            </div>
                          </div>

                          {/* 技能 */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {opc.skills.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg">
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* 行业 */}
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Briefcase className="w-4 h-4" />
                            {opc.industries.join(' · ')}
                          </div>
                        </div>

                        {/* 价格 */}
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-bold text-white">¥{opc.hourlyRate}</div>
                          <p className="text-slate-400 text-sm">/小时</p>
                          <button className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all">
                            查看详情
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredOPCs.length === 0 && (
                <div className="text-center py-12 bg-slate-900/50 border border-white/10 rounded-2xl">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">没有找到匹配的OPC</p>
                  <p className="text-slate-500 text-sm mt-2">请调整筛选条件</p>
                </div>
              )}
            </div>
          </div>
            </>
          )}

          {/* 我的需求 Tab 内容 */}
          {activeTab === 'my-demands' && (
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-xl">我的需求</h2>
                  <p className="text-slate-400 text-sm mt-1">查看您发布的需求</p>
                </div>
                <button 
                  onClick={() => navigate('/demand-center')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  去需求中心管理
                </button>
              </div>
              
              {myDemands.length > 0 ? (
                <div className="space-y-4">
                  {myDemands.map(demand => {
                    const statusColors = {
                      pending: 'bg-amber-500/20 text-amber-400',
                      matching: 'bg-blue-500/20 text-blue-400',
                      progress: 'bg-emerald-500/20 text-emerald-400',
                      completed: 'bg-gray-500/20 text-gray-400',
                    }
                    const statusLabels = {
                      pending: '待接单',
                      matching: '匹配中',
                      progress: '进行中',
                      completed: '已完成',
                    }
                    return (
                      <div 
                        key={demand.id}
                        onClick={() => navigate(`/demand/${demand.id}`)}
                        className="bg-slate-800/50 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white font-medium">{demand.title}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs ${statusColors[demand.status] || statusColors.pending}`}>
                                {statusLabels[demand.status] || '待接单'}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm line-clamp-2">{demand.desc}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                              <span>预算: ¥{demand.budget?.toLocaleString() || '待定'}</span>
                              <span>投标: {demand.bids?.length || 0} 个</span>
                              <span>发布于: {new Date(demand.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-500" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">暂无需求</p>
                  <p className="text-slate-500 text-sm mt-2">发布您的第一个需求，开启AI升级之旅</p>
                  <button 
                    onClick={() => navigate('/demand-center')}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    立即发布
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 我的投标 Tab 内容 */}
          {activeTab === 'my-bids' && (
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
              <div className="mb-6">
                <h2 className="text-white font-bold text-xl">我的投标</h2>
                <p className="text-slate-400 text-sm mt-1">管理您的投标记录</p>
              </div>
              
              {myBids.length > 0 ? (
                <div className="space-y-4">
                  {myBids.map(bid => {
                    const bidStatusColors = {
                      pending: 'bg-amber-500/20 text-amber-400',
                      accepted: 'bg-emerald-500/20 text-emerald-400',
                      rejected: 'bg-gray-500/20 text-gray-400',
                    }
                    const bidStatusLabels = {
                      pending: '待选择',
                      accepted: '已中标',
                      rejected: '未选中',
                    }
                    return (
                      <div 
                        key={bid.id}
                        onClick={() => navigate(`/demand/${bid.demandId}`)}
                        className="bg-slate-800/50 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white font-medium">{bid.proposal?.slice(0, 30) || '投标方案'}...</h3>
                              <span className={`px-2 py-0.5 rounded text-xs ${bidStatusColors[bid.status] || bidStatusColors.pending}`}>
                                {bidStatusLabels[bid.status] || '待选择'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="text-emerald-400 font-medium">¥{bid.price?.toLocaleString()}</span>
                              <span>周期: {bid.days}天</span>
                              <span>投于: {new Date(bid.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-500" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">暂无投标</p>
                  <p className="text-slate-500 text-sm mt-2">去需求广场投标，获取更多合作机会</p>
                  <button 
                    onClick={() => navigate('/demand')}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    浏览需求
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* OPC详情弹窗 */}
      {selectedOPC && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 头部 */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-start gap-4">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${levelColors[selectedOPC.level]} flex items-center justify-center text-white text-2xl font-bold`}>
                  {selectedOPC.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-white font-bold text-xl">{selectedOPC.name}</h2>
                    <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${levelColors[selectedOPC.level]} text-white`}>
                      {selectedOPC.level}
                    </span>
                  </div>
                  <p className="text-slate-400 mb-3">{selectedOPC.title}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-yellow-400" /> {selectedOPC.rating}
                    </span>
                    <span className="text-slate-400">{selectedOPC.completedProjects}个项目</span>
                    <span className="text-white font-bold">¥{selectedOPC.hourlyRate}/小时</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOPC(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 能力雷达 */}
            <div className="p-6 border-b border-white/10">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Radar className="w-4 h-4 text-purple-400" /> 能力维度
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedOPC.dimensionScores).map(([key, score]) => (
                  <div key={key} className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400 text-sm">
                        {key === 'execution' && '执行力'}
                        {key === 'architecture' && '架构能力'}
                        {key === 'coordination' && '协调能力'}
                        {key === 'strategy' && '战略能力'}
                      </span>
                      <span className="text-white font-bold">{score}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 技能 & 行业 */}
            <div className="p-6 border-b border-white/10">
              <div className="mb-4">
                <h3 className="text-white font-medium mb-2">专业技能</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedOPC.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">服务行业</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedOPC.industries.map(ind => (
                    <span key={ind} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="p-6 flex gap-4">
              <button 
                onClick={() => navigate(`/enterprise-demand?opc=${selectedOPC.id}`)}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                发起合作
              </button>
              <button className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors">
                查看作品
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
