import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, BookOpen, FileText, Video, Download, 
  ChevronRight, Star, Clock, Eye, Tag, Filter,
  TrendingUp, Zap, Award, Lightbulb, Layers
} from 'lucide-react'
import { useToast } from '../../components/Toast.jsx'
import { PageLoading } from '../../components/Skeleton.jsx'
// ======= 知识库分类 =======
const CATEGORIES = [
  { id: 'all', name: '全部', icon: Layers, color: 'text-gray-400' },
  { id: 'tutorial', name: '操作教程', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'case', name: '案例拆解', icon: FileText, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { id: 'video', name: '视频课程', icon: Video, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'tool', name: '工具资源', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'strategy', name: '运营策略', icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10' },
]
// ======= 知识库文章数据 =======
const KNOWLEDGE_ARTICLES = [
  {
    id: 1,
    title: '即梦AI视频制作完全指南：从入门到精通',
    category: 'tutorial',
    tags: ['即梦', 'AI视频', '教程'],
    author: '林小影',
    authorAvatar: '林',
    views: 12580,
    likes: 892,
    createdAt: '2026-04-10',
    readTime: '15分钟',
    difficulty: '入门',
    summary: '全面讲解即梦AI视频工具的使用方法，包括文生视频、图生视频、运镜控制等核心功能。',
    content: '即梦是目前国内最主流的AI视频生成工具之一...'
  },
  {
    id: 2,
    title: 'AI短剧爆款案例分析：都市情感题材的流量密码',
    category: 'case',
    tags: ['AI短剧', '案例分析', '爆款'],
    author: '周编剧',
    authorAvatar: '周',
    views: 8920,
    likes: 567,
    createdAt: '2026-04-08',
    readTime: '20分钟',
    difficulty: '进阶',
    summary: '深度拆解3部播放量破亿的AI短剧，分析其剧本结构、角色设计和营销策略。',
    content: '都市情感题材一直是短剧市场的热门...'
  },
  {
    id: 3,
    title: 'Midjourney商业级出图工作流：品牌设计实战',
    category: 'video',
    tags: ['Midjourney', '品牌设计', '工作流'],
    author: '设计小美',
    authorAvatar: '美',
    views: 15670,
    likes: 1234,
    createdAt: '2026-04-05',
    readTime: '25分钟',
    difficulty: '中级',
    summary: '从需求分析到最终交付，完整演示如何用Midjourney完成品牌视觉设计项目。',
    content: '商业级AI设计不仅仅是生成图片...'
  },
  {
    id: 4,
    title: 'AI带货视频选品策略：高转化率产品特征分析',
    category: 'strategy',
    tags: ['AI带货', '选品', '转化率'],
    author: '带货达人',
    authorAvatar: '达',
    views: 23450,
    likes: 1890,
    createdAt: '2026-04-03',
    readTime: '18分钟',
    difficulty: '中级',
    summary: '基于1000+带货视频数据分析，总结高转化产品的共同特征和选品方法论。',
    content: '选品是带货成功的第一要素...'
  },
  {
    id: 5,
    title: 'ComfyUI节点工作流搭建：自动化批量生成',
    category: 'tool',
    tags: ['ComfyUI', '工作流', '自动化'],
    author: '技术老王',
    authorAvatar: '王',
    views: 6780,
    likes: 445,
    createdAt: '2026-04-01',
    readTime: '30分钟',
    difficulty: '高级',
    summary: '手把手教你搭建ComfyUI工作流，实现图片批量生成和自动化处理。',
    content: 'ComfyUI是目前最强大的AI图像生成工具...'
  },
  {
    id: 6,
    title: 'AI漫剧角色一致性技巧：Lora模型训练实战',
    category: 'tutorial',
    tags: ['AI漫剧', 'Lora', '角色一致性'],
    author: '漫小七',
    authorAvatar: '漫',
    views: 9870,
    likes: 723,
    createdAt: '2026-03-28',
    readTime: '35分钟',
    difficulty: '高级',
    summary: '解决AI漫剧角色不一致的痛点，详细讲解Lora模型训练流程和参数调优。',
    content: '角色一致性是AI漫剧制作的最大挑战...'
  },
  {
    id: 7,
    title: '短视频平台算法解析：抖音/小红书流量机制',
    category: 'strategy',
    tags: ['算法', '抖音', '小红书', '流量'],
    author: '运营专家',
    authorAvatar: '运',
    views: 45670,
    likes: 3456,
    createdAt: '2026-03-25',
    readTime: '22分钟',
    difficulty: '入门',
    summary: '深度解析主流短视频平台的推荐算法，帮助你更好地理解流量分发机制。',
    content: '理解平台算法是内容创作的基础...'
  },
  {
    id: 8,
    title: 'AI电影分镜设计：从剧本到画面的视觉转化',
    category: 'video',
    tags: ['AI电影', '分镜', '视觉设计'],
    author: '李导演',
    authorAvatar: '李',
    views: 7890,
    likes: 567,
    createdAt: '2026-03-20',
    readTime: '28分钟',
    difficulty: '进阶',
    summary: '电影级分镜设计方法论，教你如何将剧本转化为AI可执行的视觉指令。',
    content: '分镜是电影制作的核心环节...'
  },
  {
    id: 9,
    title: 'ChatGPT提示词工程：高质量内容生成技巧',
    category: 'tutorial',
    tags: ['ChatGPT', '提示词', '内容生成'],
    author: 'AI研究员',
    authorAvatar: '研',
    views: 34560,
    likes: 2789,
    createdAt: '2026-03-18',
    readTime: '20分钟',
    difficulty: '入门',
    summary: '系统讲解提示词工程的核心原理，提供多个可直接使用的提示词模板。',
    content: '提示词是与AI沟通的艺术...'
  },
  {
    id: 10,
    title: '电商详情页设计规范：提升转化的视觉策略',
    category: 'case',
    tags: ['电商', '详情页', '转化率'],
    author: '电商设计',
    authorAvatar: '电',
    views: 12340,
    likes: 890,
    createdAt: '2026-03-15',
    readTime: '16分钟',
    difficulty: '中级',
    summary: '基于消费者心理学的高转化详情页设计指南，包含大量实战案例。',
    content: '详情页是电商转化的关键环节...'
  }
]
// ======= 热门标签 =======
const HOT_TAGS = ['即梦', 'Midjourney', 'AI短剧', '带货', '提示词', '工作流', 'Lora', 'ComfyUI', '分镜', '运营']
export default function KnowledgeBase() {
  const navigate = useNavigate()
  const toast = useToast()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [selectedTag, setSelectedTag] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  useEffect(() => {
    setTimeout(() => setLoading(false), 600)
  }, [])
  // 筛选文章
  const filteredArticles = KNOWLEDGE_ARTICLES.filter(article => {
    if (activeCategory !== 'all' && article.category !== activeCategory) return false
    if (selectedTag && !article.tags.includes(selectedTag)) return false
    if (searchText) {
      const q = searchText.toLowerCase()
      return article.title.toLowerCase().includes(q) || 
             article.tags.some(t => t.toLowerCase().includes(q)) ||
             article.summary.toLowerCase().includes(q)
    }
    return true
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'popular') return b.views - a.views
    if (sortBy === 'likes') return b.likes - a.likes
    return 0
  })
  const handleArticleClick = (article) => {
    setSelectedArticle(article)
  }
  const handleDownload = (article) => {
    toast.success(`开始下载: ${article.title}`)
  }
  if (loading) {
    return <PageLoading message="加载知识库..." />
  }
  return (
    
      <div className="min-h-screen bg-slate-950">
        <style>{`
          .gradient-text {
            background: linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #818cf8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .mesh-bg {
            background-image: 
              radial-gradient(at 0% 0%, rgba(99,102,241,0.15) 0px, transparent 50%),
              radial-gradient(at 100% 0%, rgba(139,92,246,0.15) 0px, transparent 50%);
          }
          .glass-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.08);
          }
          .glass-card:hover {
            border-color: rgba(255,255,255,0.15);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          }
        `}</style>
        {/* Hero区 */}
        <section className="relative overflow-hidden pt-16 pb-8">
          <div className="absolute inset-0 mesh-bg"></div>
          <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[150px]"></div>
          
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-full text-violet-300 text-sm mb-6">
                <BookOpen className="w-4 h-4" />
                知识库
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-4">
                碳硅知识库
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                系统化的AI创作知识体系，从入门到精通的完整学习路径
              </p>
            </div>
            {/* 搜索框 */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜索文章、教程、标签..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>
            {/* 热门标签 */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {HOT_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedTag === tag
                      ? 'bg-violet-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </section>
        {/* 主内容区 */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 左侧分类 */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-4 sticky top-24">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  分类筛选
                </h3>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => {
                    const count = cat.id === 'all' 
                      ? KNOWLEDGE_ARTICLES.length 
                      : KNOWLEDGE_ARTICLES.filter(a => a.category === cat.id).length
                    
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                          activeCategory === cat.id
                            ? 'bg-violet-500/20 text-white border border-violet-500/30'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-violet-400' : cat.color}`} />
                          <span>{cat.name}</span>
                        </div>
                        <span className={`text-xs ${activeCategory === cat.id ? 'text-violet-400' : 'text-gray-500'}`}>
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {/* 统计信息 */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-violet-400">{KNOWLEDGE_ARTICLES.length}</p>
                      <p className="text-gray-500 text-xs">文章总数</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-400">
                        {KNOWLEDGE_ARTICLES.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-xs">总阅读量</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 右侧文章列表 */}
            <div className="lg:col-span-3">
              {/* 排序和筛选状态 */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400">
                  共 <span className="text-white font-semibold">{filteredArticles.length}</span> 篇文章
                  {selectedTag && (
                    <span className="ml-2">
                      · 标签: <span className="text-violet-400">#{selectedTag}</span>
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">排序:</span>
                  {[
                    { key: 'newest', label: '最新' },
                    { key: 'popular', label: '最热' },
                    { key: 'likes', label: '最多赞' },
                  ].map(sort => (
                    <button
                      key={sort.key}
                      onClick={() => setSortBy(sort.key)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        sortBy === sort.key
                          ? 'bg-violet-500/20 text-violet-400'
                          : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* 文章列表 */}
              <div className="space-y-4">
                {filteredArticles.map(article => {
                  const category = CATEGORIES.find(c => c.id === article.category)
                  
                  return (
                    <div 
                      key={article.id}
                      onClick={() => handleArticleClick(article)}
                      className="glass-card rounded-2xl p-6 hover:border-violet-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        {/* 分类图标 */}
                        <div className={`w-12 h-12 rounded-xl ${category?.bg || 'bg-gray-500/10'} flex items-center justify-center flex-shrink-0`}>
                          {category && <category.icon className={`w-6 h-6 ${category.color}`} />}
                        </div>
                        {/* 内容 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${category?.bg || 'bg-gray-500/10'} ${category?.color || 'text-gray-400'}`}>
                              {category?.name}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              article.difficulty === '入门' ? 'bg-emerald-500/10 text-emerald-400' :
                              article.difficulty === '中级' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-red-500/10 text-red-400'
                            }`}>
                              {article.difficulty}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {article.summary}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs">
                                  {article.authorAvatar}
                                </div>
                                {article.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {article.readTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {article.views.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-amber-400" />
                                {article.likes}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(article)
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all text-sm"
                            >
                              <Download className="w-4 h-4" />
                              下载
                            </button>
                          </div>
                          {/* 标签 */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            {article.tags.map(tag => (
                              <span 
                                key={tag}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedTag(tag)
                                }}
                                className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded hover:bg-violet-500/20 hover:text-violet-400 transition-all cursor-pointer"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {filteredArticles.length === 0 && (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">未找到相关文章</h3>
                  <p className="text-gray-400 mb-6">尝试更换搜索词或清除筛选条件</p>
                  <button
                    onClick={() => {
                      setSearchText('')
                      setSelectedTag(null)
                      setActiveCategory('all')
                    }}
                    className="px-6 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-all"
                  >
                    清除筛选
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        {/* 文章详情弹窗 */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              {/* 头部 */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {(() => {
                        const category = CATEGORIES.find(c => c.id === selectedArticle.category)
                        return (
                          <span className={`px-2 py-0.5 rounded text-xs ${category?.bg || 'bg-gray-500/10'} ${category?.color || 'text-gray-400'}`}>
                            {category?.name}
                          </span>
                        )
                      })()}
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        selectedArticle.difficulty === '入门' ? 'bg-emerald-500/10 text-emerald-400' :
                        selectedArticle.difficulty === '中级' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {selectedArticle.difficulty}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{selectedArticle.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
                      {selectedArticle.authorAvatar}
                    </div>
                    {selectedArticle.author}
                  </span>
                  <span>{selectedArticle.createdAt}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedArticle.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedArticle.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400" />
                    {selectedArticle.likes}
                  </span>
                </div>
              </div>
              {/* 内容 */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg mb-6">
                    {selectedArticle.summary}
                  </p>
                  <div className="bg-white/5 rounded-xl p-6 mb-6">
                    <p className="text-gray-400">
                      完整文章内容需要登录后查看。这里展示的是文章摘要和预览内容。
                    </p>
                    <p className="text-gray-400 mt-4">
                      {selectedArticle.content}
                    </p>
                  </div>
                  <p className="text-gray-500 text-center">
                    ... 更多内容请下载完整文档 ...
                  </p>
                </div>
                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
                  {selectedArticle.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-violet-500/10 text-violet-400 text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* 底部操作 */}
              <div className="p-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/30 transition-all">
                    <Star className="w-4 h-4" />
                    收藏
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all">
                    <Download className="w-4 h-4" />
                    下载PDF
                  </button>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
  )
}
