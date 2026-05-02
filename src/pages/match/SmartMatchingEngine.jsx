import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/Toast'
import {
  Brain, Sparkles, Users, Target, Zap, TrendingUp,
  CheckCircle, Star, Filter, SortAsc, ChevronRight,
  Search, ThumbsUp, Clock, Award, Clock3
} from 'lucide-react'
// ======= 标签体系配置 =======
const TAG_CATEGORIES = {
  video: {
    name: 'AI视频',
    tags: ['品牌宣传', '产品展示', '短视频', '纪录片', '动画', '特效', '航拍', '微电影', '广告片', '课程视频'],
    weight: 1.5,
  },
  design: {
    name: 'AI设计',
    tags: ['VI设计', '海报设计', 'UI/UX', '包装设计', '插画', 'LOGO设计', '品牌设计', '电商设计', 'PPT设计', '字体设计'],
    weight: 1.3,
  },
  copy: {
    name: 'AI文案',
    tags: ['品牌故事', '产品文案', '种草文案', '直播脚本', '短视频脚本', '广告语', '新闻稿', '小红书', '公众号', '营销方案'],
    weight: 1.2,
  },
  drama: {
    name: 'AI短剧',
    tags: ['都市爱情', '悬疑推理', '古风穿越', '科幻未来', '家庭伦理', '校园青春', '职场商战', '恐怖惊悚', '喜剧搞笑', '励志成长'],
    weight: 1.4,
  },
  consultation: {
    name: '咨询服务',
    tags: ['战略咨询', '品牌定位', '市场分析', '运营策略', '营销策划', 'IP孵化', '内容策略', '用户增长', '数据洞察', '竞争分析'],
    weight: 1.6,
  },
}
// ======= 评分维度 =======
const SCORING_DIMENSIONS = {
  skills: { name: '技能匹配', weight: 0.35, icon: Target },
  experience: { name: '经验匹配', weight: 0.25, icon: Clock },
  rating: { name: '客户评分', weight: 0.20, icon: Star },
  response: { name: '响应速度', weight: 0.10, icon: Zap },
  price: { name: '价格合理', weight: 0.10, icon: TrendingUp },
}
// ======= 模拟创作者数据 =======
const MOCK_CREATORS = [
  {
    id: 1, name: '视频大神', avatar: '视', level: 8,
    specialties: ['视频', '设计'],
    tags: ['品牌宣传', '产品展示', '短视频', '特效'],
    rating: 4.9, orders: 156, responseTime: 1.2, completionRate: 98,
    bio: '专注AI视频制作8年，服务品牌100+',
    price: { min: 5000, max: 30000 },
    matchScore: 96,
    matchReasons: ['技能完全匹配', '高评分口碑好', '响应速度快'],
  },
  {
    id: 2, name: '设计小美', avatar: '设', level: 7,
    specialties: ['设计'],
    tags: ['VI设计', '海报设计', '包装设计', '插画'],
    rating: 4.8, orders: 89, responseTime: 2.5, completionRate: 95,
    bio: 'AI设计专家，擅长品牌视觉升级',
    price: { min: 3000, max: 15000 },
    matchScore: 92,
    matchReasons: ['设计经验丰富', '标签高度匹配'],
  },
  {
    id: 3, name: '文案达人', avatar: '文', level: 6,
    specialties: ['文案'],
    tags: ['种草文案', '直播脚本', '小红书', '广告语'],
    rating: 4.7, orders: 234, responseTime: 0.8, completionRate: 99,
    bio: '月产爆款文案1000+，擅长内容营销',
    price: { min: 1000, max: 5000 },
    matchScore: 88,
    matchReasons: ['价格区间匹配', '响应极快'],
  },
  {
    id: 4, name: '短剧导演', avatar: '导', level: 9,
    specialties: ['短剧'],
    tags: ['都市爱情', '悬疑推理', '古风穿越', '微电影'],
    rating: 5.0, orders: 45, responseTime: 3.0, completionRate: 100,
    bio: '专业短剧导演，AI短剧先驱者',
    price: { min: 10000, max: 50000 },
    matchScore: 85,
    matchReasons: ['顶级评分', '高完成率'],
  },
  {
    id: 5, name: '品牌顾问', avatar: '顾', level: 8,
    specialties: ['咨询'],
    tags: ['战略咨询', '品牌定位', '营销策划'],
    rating: 4.9, orders: 67, responseTime: 4.0, completionRate: 97,
    bio: '10年品牌经验，服务上市公司30+',
    price: { min: 8000, max: 50000 },
    matchScore: 82,
    matchReasons: ['咨询经验丰富'],
  },
]
// ======= 需求示例 =======
const SAMPLE_REQUIREMENTS = [
  { id: 1, title: '科技公司品牌宣传片', category: 'video', tags: ['品牌宣传', '产品展示'], budget: 15000 },
  { id: 2, title: '新茶饮品牌全套VI设计', category: 'design', tags: ['VI设计', '品牌设计'], budget: 12000 },
  { id: 3, title: '美妆产品小红书种草', category: 'copy', tags: ['种草文案', '小红书'], budget: 5000 },
  { id: 4, title: '悬疑推理短剧5集', category: 'drama', tags: ['悬疑推理', '短视频'], budget: 20000 },
  { id: 5, title: '企业AI升级战略咨询', category: 'consultation', tags: ['战略咨询', '营销策划'], budget: 30000 },
]
// ======= 主组件 =======
export default function SmartMatchingEngine() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  // 状态
  const [activeTab, setActiveTab] = useState('match') // match/config/history
  const [selectedRequirement, setSelectedRequirement] = useState(null)
  const [creators, setCreators] = useState(MOCK_CREATORS)
  const [sortBy, setSortBy] = useState('matchScore') // matchScore/rating/price
  const [filterTags, setFilterTags] = useState([])
  const [showDetail, setShowDetail] = useState(null)
  const [isMatching, setIsMatching] = useState(false)
  // 模拟匹配过程
  const handleMatch = (requirement) => {
    setIsMatching(true)
    setSelectedRequirement(requirement)
    // 模拟AI匹配计算
    setTimeout(() => {
      // 更新匹配分数（添加随机波动模拟真实计算）
      const updatedCreators = MOCK_CREATORS.map(creator => {
        let score = 70 + Math.random() * 30
        // 标签匹配加分
        requirement.tags.forEach(tag => {
          if (creator.tags.includes(tag)) score += 5
        })
        // 类别匹配加分
        if (creator.specialties.some(s => s.includes(requirement.category))) {
          score += 10
        }
        // 价格区间匹配
        if (creator.price.min <= requirement.budget && creator.price.max >= requirement.budget * 0.5) {
          score += 5
        }
        return { ...creator, matchScore: Math.min(99, Math.round(score)) }
      }).sort((a, b) => b.matchScore - a.matchScore)
      setCreators(updatedCreators)
      setIsMatching(false)
      showToast('智能匹配完成！', 'success')
    }, 1500)
  }
  // 排序后的创作者
  const sortedCreators = useMemo(() => {
    const sorted = [...creators]
    switch (sortBy) {
      case 'matchScore':
        return sorted.sort((a, b) => b.matchScore - a.matchScore)
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'price':
        return sorted.sort((a, b) => a.price.min - b.price.min)
      default:
        return sorted
    }
  }, [creators, sortBy])
  // 计算综合得分
  const calculateScore = (creator, dimension) => {
    switch (dimension) {
      case 'skills':
        return selectedRequirement?.tags.filter(t => creator.tags.includes(t)).length / selectedRequirement?.tags.length * 100
      case 'experience':
        return Math.min(100, creator.orders / 3)
      case 'rating':
        return creator.rating * 20
      case 'response':
        return Math.max(0, 100 - creator.responseTime * 20)
      case 'price':
        const avgPrice = (creator.price.min + creator.price.max) / 2
        return selectedRequirement?.budget >= avgPrice * 0.5 && selectedRequirement?.budget <= avgPrice * 1.5 ? 80 : 50
      default:
        return 0
    }
  }
  return (
    
      <div className="min-h-screen bg-slate-900">
        {/* Hero区 */}
        <div className="bg-gradient-to-br from-violet-900/30 to-cyan-900/20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full mb-4">
                <Brain className="w-4 h-4 text-violet-400" />
                <span className="text-violet-400 text-sm">AI驱动的智能匹配</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  OPC智能匹配引擎
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                基于多维度算法，精准匹配最适合您的AI创作者
              </p>
            </div>
            {/* 匹配维度说明 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10 max-w-4xl mx-auto">
              {Object.entries(SCORING_DIMENSIONS).map(([key, dim]) => (
                <div key={key} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-2 bg-violet-500/20 rounded-xl flex items-center justify-center">
                    <dim.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <p className="text-white font-medium">{dim.name}</p>
                  <p className="text-violet-400 text-sm">权重 {dim.weight * 100}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Tab导航 */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 py-4 border-b border-white/5">
            {[
              { id: 'match', name: '立即匹配', icon: Sparkles },
              { id: 'config', name: '标签配置', icon: Target },
              { id: 'history', name: '匹配记录', icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
        {/* 内容区 */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* 立即匹配 */}
          {activeTab === 'match' && (
            <div>
              {/* 选择需求 */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">选择需求类型</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {SAMPLE_REQUIREMENTS.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => handleMatch(req)}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        selectedRequirement?.id === req.id
                          ? 'bg-violet-500/20 border-violet-500'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <p className="text-white font-medium mb-1">{req.title}</p>
                      <p className="text-gray-500 text-sm">¥{req.budget.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </div>
              {/* 匹配中 */}
              {isMatching && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 relative">
                    <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    <Brain className="absolute inset-0 m-auto w-10 h-10 text-violet-400" />
                  </div>
                  <p className="text-white text-xl font-medium">AI正在计算最佳匹配...</p>
                  <p className="text-gray-400 mt-2">综合分析技能、经验、评分等多维度</p>
                </div>
              )}
              {/* 匹配结果 */}
              {!isMatching && selectedRequirement && (
                <>
                  {/* 结果概览 */}
                  <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white">
                        匹配结果
                        <span className="text-violet-400 ml-2">{sortedCreators.length} 位创作者</span>
                      </h2>
                      <div className="flex items-center gap-3">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                        >
                          <option value="matchScore">按匹配度</option>
                          <option value="rating">按评分</option>
                          <option value="price">按价格</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequirement.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-violet-500/20 text-violet-400 text-sm rounded-full">
                          #{tag}
                        </span>
                      ))}
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full">
                        预算 ¥{selectedRequirement.budget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {/* 创作者列表 */}
                  <div className="space-y-4">
                    {sortedCreators.map((creator, index) => (
                      <div
                        key={creator.id}
                        className={`bg-slate-800/60 border rounded-2xl p-6 transition-all hover:border-white/20 cursor-pointer ${
                          index === 0 ? 'border-amber-500/50' : 'border-white/10'
                        }`}
                        onClick={() => setShowDetail(creator)}
                      >
                        <div className="flex items-start gap-6">
                          {/* 排名/匹配分 */}
                          <div className="text-center">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl mb-2 ${
                              index === 0
                                ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                                : index === 1
                                ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
                                : index === 2
                                ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-white'
                                : 'bg-slate-700 text-gray-400'
                            }`}>
                              {index + 1}
                            </div>
                            <div className={`text-2xl font-bold ${
                              creator.matchScore >= 90 ? 'text-amber-400' :
                              creator.matchScore >= 80 ? 'text-violet-400' : 'text-gray-400'
                            }`}>
                              {creator.matchScore}%
                            </div>
                            <p className="text-gray-500 text-xs">匹配度</p>
                          </div>
                          {/* 用户信息 */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xl text-white font-bold">
                                {creator.avatar}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-bold text-lg">{creator.name}</span>
                                  <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs rounded-full">Lv.{creator.level}</span>
                                </div>
                                <p className="text-gray-400 text-sm">{creator.bio}</p>
                              </div>
                            </div>
                            {/* 标签 */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {creator.tags.slice(0, 5).map((tag, i) => (
                                <span
                                  key={i}
                                  className={`px-2 py-0.5 text-xs rounded-full ${
                                    selectedRequirement.tags.includes(tag)
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-white/5 text-gray-400'
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            {/* 匹配原因 */}
                            <div className="flex flex-wrap gap-2">
                              {creator.matchReasons.map((reason, i) => (
                                <span key={i} className="flex items-center gap-1 text-xs text-gray-400">
                                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                                  {reason}
                                </span>
                              ))}
                            </div>
                          </div>
                          {/* 数据 */}
                          <div className="grid grid-cols-4 gap-6 text-center">
                            <div>
                              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-bold">{creator.rating}</span>
                              </div>
                              <p className="text-gray-500 text-xs">评分</p>
                            </div>
                            <div>
                              <div className="text-white font-bold mb-1">{creator.orders}</div>
                              <p className="text-gray-500 text-xs">已完成</p>
                            </div>
                            <div>
                              <div className="text-white font-bold mb-1">{creator.completionRate}%</div>
                              <p className="text-gray-500 text-xs">完成率</p>
                            </div>
                            <div>
                              <div className="text-white font-bold mb-1">{creator.responseTime}h</div>
                              <p className="text-gray-500 text-xs">响应</p>
                            </div>
                          </div>
                          {/* 价格 */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">¥{creator.price.min.toLocaleString()}</p>
                            <p className="text-gray-500 text-sm">起</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500 self-center" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* 未选择时 */}
              {!isMatching && !selectedRequirement && (
                <div className="text-center py-20">
                  <Target className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">选择上方需求类型开始智能匹配</p>
                </div>
              )}
            </div>
          )}
          {/* 标签配置 */}
          {activeTab === 'config' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">标签体系配置</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(TAG_CATEGORIES).map(([key, category]) => (
                  <div key={key} className="bg-slate-800/60 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">{category.name}</h3>
                      <span className="px-3 py-1 bg-violet-500/20 text-violet-400 text-sm rounded-full">
                        权重 {category.weight}x
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white/5 text-gray-300 text-sm rounded-lg border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* 权重说明 */}
              <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">匹配权重说明</h3>
                <div className="space-y-3">
                  {Object.entries(SCORING_DIMENSIONS).map(([key, dim]) => (
                    <div key={key} className="flex items-center gap-4">
                      <div className="w-32 text-gray-400">{dim.name}</div>
                      <div className="flex-1 h-4 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                          style={{ width: `${dim.weight * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-20 text-right text-violet-400 font-medium">{dim.weight * 100}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* 匹配记录 */}
          {activeTab === 'history' && (
            <div className="text-center py-20">
              <Clock className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">暂无匹配记录</p>
              <p className="text-gray-500">开始匹配后，记录将显示在这里</p>
            </div>
          )}
        </div>
        {/* 创作者详情弹窗 */}
        {showDetail && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-2xl shadow-2xl">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl text-white font-bold">
                      {showDetail.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold text-white">{showDetail.name}</h3>
                        <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-sm rounded-full">Lv.{showDetail.level}</span>
                      </div>
                      <p className="text-gray-400">{showDetail.bio}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetail(null)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                {/* 评分维度 */}
                <h4 className="text-white font-semibold mb-4">匹配分析</h4>
                <div className="space-y-3 mb-6">
                  {Object.entries(SCORING_DIMENSIONS).map(([key, dim]) => {
                    const score = calculateScore(showDetail, key)
                    return (
                      <div key={key} className="flex items-center gap-4">
                        <div className="w-24 text-gray-400 text-sm">{dim.name}</div>
                        <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-right text-white font-medium">{Math.round(score)}分</div>
                      </div>
                    )
                  })}
                </div>
                {/* 标签 */}
                <h4 className="text-white font-semibold mb-3">擅长领域</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {showDetail.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 text-gray-300 text-sm rounded-lg">{tag}</span>
                  ))}
                </div>
                {/* 价格 */}
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl mb-6">
                  <span className="text-gray-400">服务价格</span>
                  <span className="text-2xl font-bold text-amber-400">
                    ¥{showDetail.price.min.toLocaleString()} - ¥{showDetail.price.max.toLocaleString()}
                  </span>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl hover:from-violet-400 hover:to-fuchsia-400 transition-all">
                  立即委托
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
  )
}
