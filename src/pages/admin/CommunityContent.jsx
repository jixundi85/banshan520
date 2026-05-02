/**
 * 后台管理 - 社区内容管理
 * 管理交流帖子、教程、AI内容、悬赏任务
 */
import { useState, useEffect } from 'react'
import {
  MessageSquare, BookOpen, Sparkles, Gift, Plus, Edit, Trash2, Eye, EyeOff,
  Search, Filter, Clock, TrendingUp, Star, ChevronDown, X, Save, Image as ImageIcon,
  CheckCircle, AlertCircle, Users, DollarSign, BarChart3
} from 'lucide-react'
import dataService from './dataService'

export default function CommunityContent() {
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [tutorials, setTutorials] = useState([])
  const [aiContents, setAiContents] = useState([])
  const [rewards, setRewards] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editType, setEditType] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [toast, setToast] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const postsData = dataService.loadData('community_posts')
    const tutorialsData = dataService.loadData('community_tutorials')
    const aiData = dataService.loadData('community_ai_content')
    const rewardsData = dataService.loadData('community_rewards')

    // 如果没有数据，使用默认数据
    if (!postsData) {
      setPosts(getDefaultPosts())
      dataService.saveData('community_posts', getDefaultPosts())
    } else {
      setPosts(postsData)
    }

    if (!tutorialsData) {
      setTutorials(getDefaultTutorials())
      dataService.saveData('community_tutorials', getDefaultTutorials())
    } else {
      setTutorials(tutorialsData)
    }

    if (!aiData) {
      setAiContents(getDefaultAIContent())
      dataService.saveData('community_ai_content', getDefaultAIContent())
    } else {
      setAiContents(aiData)
    }

    if (!rewardsData) {
      setRewards(getDefaultRewards())
      dataService.saveData('community_rewards', getDefaultRewards())
    } else {
      setRewards(rewardsData)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const saveData = (type, data) => {
    dataService.saveData(type, data)
    if (type === 'community_posts') setPosts(data)
    if (type === 'community_tutorials') setTutorials(data)
    if (type === 'community_ai_content') setAiContents(data)
    if (type === 'community_rewards') setRewards(data)
    showToast('保存成功')
  }

  // ============ 默认帖子数据 ============
  const getDefaultPosts = () => [
    {
      id: 'p1', title: '分享我用Stable Diffusion生成赛博朋克风格的完整工作流', author: '林艺涵',
      content: '最近在研究如何用ControlNet精准控制AI生成图像的构图和姿势...',
      topics: ['#工具流', '#AI设计'], likes: 328, comments: 56, collects: 89, views: 2341,
      status: 'published', isHot: true, isPinned: true, createdAt: '2026-04-28T08:00:00Z'
    },
    {
      id: 'p2', title: '用即梦AI制作品牌广告片的实战经验分享', author: '张明远',
      content: '用即梦AI制作的品牌广告片新鲜出炉！这次尝试了多种运镜方式...',
      topics: ['#AI广告', '#工作流'], likes: 456, comments: 78, collects: 134, views: 3456,
      status: 'published', isHot: true, isPinned: false, createdAt: '2026-04-27T14:00:00Z'
    },
    {
      id: 'p3', title: '《最后的星球》我的第一部AI科幻短片创作复盘', author: '李思琪',
      content: '从剧本到分镜，从画面生成到后期合成，全程使用AI工具辅助创作...',
      topics: ['#影视漫剧', '#踩坑记录'], likes: 892, comments: 145, collects: 267, views: 5678,
      status: 'published', isHot: true, isPinned: false, createdAt: '2026-04-26T20:00:00Z'
    },
    {
      id: 'p4', title: '新人求助：AI绘图和AI视频应该先学哪个？', author: '碳基小明',
      content: '刚学完入门课程，对AI创作很感兴趣。想问一下各位大佬...',
      topics: ['#AI短视频', '#提示词'], likes: 45, comments: 23, collects: 8, views: 567,
      status: 'published', isHot: false, isPinned: false, createdAt: '2026-04-25T16:00:00Z'
    },
    {
      id: 'p5', title: 'Midjourney万能公式：主体+风格+光线+构图+参数', author: '赵小雨',
      content: '分享一个我用Midjourney总结的万能公式...',
      topics: ['#AI设计', '#提示词'], likes: 1234, comments: 267, collects: 456, views: 12356,
      status: 'published', isHot: true, isPinned: false, createdAt: '2026-04-24T12:00:00Z'
    },
  ]

  // ============ 默认教程数据 ============
  const getDefaultTutorials = () => [
    { id: 't1', title: '零基础入门AI短视频创作', author: '林艺涵', category: 'AI短视频', views: 5432, likes: 234, status: 'published', cover: 'https://picsum.photos/800/450?random=101', date: '2026-04-25' },
    { id: 't2', title: 'AI广告片商业制作实战', author: '张明远', category: 'AI广告', views: 4321, likes: 189, status: 'published', cover: 'https://picsum.photos/800/450?random=102', date: '2026-04-20' },
    { id: 't3', title: 'Midjourney商业设计案例拆解', author: '赵小雨', category: 'AI设计师', views: 6789, likes: 345, status: 'published', cover: 'https://picsum.photos/800/450?random=103', date: '2026-04-18' },
    { id: 't4', title: 'AI短剧制作从剧本到成片', author: '李思琪', category: '影视漫剧', views: 3210, likes: 156, status: 'published', cover: 'https://picsum.photos/800/450?random=104', date: '2026-04-15' },
  ]

  // ============ 默认AI内容数据 ============
  const getDefaultAIContent = () => [
    { id: 'a1', type: 'daily', title: '[简报] 4月28日AI短视频创作热点', summary: 'AI抓取了156篇最新文章，提炼3个核心技巧...', likes: 89, collects: 34, status: 'published', date: '2026-04-28' },
    { id: 'a2', type: 'card', title: '如何让AI视频没有"AI味"——5个技巧', summary: '1.增加随机性 2.加入真实纹理 3.手动调整帧...', likes: 156, collects: 78, status: 'published', date: '2026-04-27' },
    { id: 'a3', type: 'path', title: '新手入门AI设计师学习路径（30天计划）', summary: '系统化的AI设计学习路线...', likes: 234, collects: 123, status: 'published', date: '2026-04-26' },
  ]

  // ============ 默认悬赏数据 ============
  const getDefaultRewards = () => [
    { id: 'r1', title: '悬赏1000元：真实家居环境照片采集', bounty: 1000, deadline: '2026-05-05', participants: 23, status: 'active', settleType: '人工评审' },
    { id: 'r2', title: '悬赏500元：AI短视频脚本征集', bounty: 500, deadline: '2026-05-10', participants: 67, status: 'active', settleType: '按点赞结算' },
    { id: 'r3', title: '悬赏2000元：品牌吉祥物设计', bounty: 2000, deadline: '2026-05-15', participants: 12, status: 'active', settleType: '专业评审' },
    { id: 'r4', title: '悬赏300元：即梦/可灵提示词分享', bounty: 300, deadline: '2026-05-20', participants: 234, status: 'active', settleType: '按点赞结算' },
  ]

  // ============ 操作处理 ============
  const handleToggleStatus = (type, item) => {
    const dataKey = `community_${type}`
    let data = []
    if (type === 'posts') data = [...posts]
    if (type === 'tutorials') data = [...tutorials]
    if (type === 'aiContents') data = [...aiContents]
    if (type === 'rewards') data = [...rewards]

    const newStatus = item.status === 'published' ? 'draft' : 'published'
    const updated = data.map(d => d.id === item.id ? { ...d, status: newStatus } : d)
    saveData(dataKey, updated)
  }

  const handleToggleHot = (item) => {
    const newData = posts.map(p => p.id === item.id ? { ...p, isHot: !p.isHot } : p)
    saveData('community_posts', newData)
  }

  const handleTogglePinned = (item) => {
    const newData = posts.map(p => p.id === item.id ? { ...p, isPinned: !p.isPinned } : p)
    saveData('community_posts', newData)
  }

  const handleDelete = (type, item) => {
    if (!confirm(`确定要删除 "${item.title || item.name}" 吗？`)) return
    const dataKey = `community_${type}`
    let data = []
    if (type === 'posts') data = [...posts]
    if (type === 'tutorials') data = [...tutorials]
    if (type === 'aiContents') data = [...aiContents]
    if (type === 'rewards') data = [...rewards]

    const updated = data.filter(d => d.id !== item.id)
    saveData(dataKey, updated)
    showToast('删除成功')
  }

  const handleAdd = (type) => {
    setEditType(type)
    setEditItem(getEmptyItem(type))
    setShowEditModal(true)
  }

  const handleEdit = (type, item) => {
    setEditType(type)
    setEditItem({ ...item })
    setShowEditModal(true)
  }

  const getEmptyItem = (type) => {
    if (type === 'posts') return { id: `p${Date.now()}`, title: '', author: '', content: '', topics: [], likes: 0, comments: 0, collects: 0, views: 0, status: 'draft', isHot: false, isPinned: false, createdAt: new Date().toISOString() }
    if (type === 'tutorials') return { id: `t${Date.now()}`, title: '', author: '', category: 'AI短视频', views: 0, likes: 0, status: 'draft', cover: '', date: new Date().toISOString().split('T')[0] }
    if (type === 'aiContents') return { id: `a${Date.now()}`, type: 'daily', title: '', summary: '', likes: 0, collects: 0, status: 'draft', date: new Date().toISOString().split('T')[0] }
    if (type === 'rewards') return { id: `r${Date.now()}`, title: '', bounty: 0, deadline: '', participants: 0, status: 'draft', settleType: '人工评审' }
    return {}
  }

  const handleSave = () => {
    const dataKey = `community_${editType === 'aiContents' ? 'ai_content' : editType}`
    let data = []
    if (editType === 'posts') data = [...posts]
    if (editType === 'tutorials') data = [...tutorials]
    if (editType === 'aiContents') data = [...aiContents]
    if (editType === 'rewards') data = [...rewards]

    const existingIndex = data.findIndex(d => d.id === editItem.id)
    if (existingIndex >= 0) {
      data[existingIndex] = editItem
    } else {
      data.unshift(editItem)
    }

    saveData(dataKey, data)
    setShowEditModal(false)
  }

  // ============ 筛选 ============
  const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.author.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredTutorials = tutorials.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.author.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredAiContents = aiContents.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredRewards = rewards.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">社区内容管理</h1>
          <p className="text-gray-400">管理交流帖子、教程、AI内容和悬赏任务</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <button onClick={loadData} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 transition-colors">
            刷新
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{posts.length}</p>
              <p className="text-sm text-gray-400">交流帖子</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{tutorials.length}</p>
              <p className="text-sm text-gray-400">教程课程</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{aiContents.length}</p>
              <p className="text-sm text-gray-400">AI内容</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rewards.length}</p>
              <p className="text-sm text-gray-400">悬赏任务</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'posts' ? 'text-purple-400 border-purple-400' : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            交流帖子
          </button>
          <button
            onClick={() => setActiveTab('tutorials')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tutorials' ? 'text-purple-400 border-purple-400' : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            教程课程
          </button>
          <button
            onClick={() => setActiveTab('aiContents')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'aiContents' ? 'text-purple-400 border-purple-400' : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            AI内容
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'rewards' ? 'text-purple-400 border-purple-400' : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4 inline mr-2" />
            悬赏任务
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {/* 操作栏 */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {activeTab === 'posts' && `共 ${filteredPosts.length} 篇帖子`}
            {activeTab === 'tutorials' && `共 ${filteredTutorials.length} 个教程`}
            {activeTab === 'aiContents' && `共 ${filteredAiContents.length} 条内容`}
            {activeTab === 'rewards' && `共 ${filteredRewards.length} 个任务`}
          </div>
          <button
            onClick={() => handleAdd(activeTab)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增
          </button>
        </div>

        {/* 帖子列表 */}
        {activeTab === 'posts' && (
          <div className="divide-y divide-white/5">
            {filteredPosts.map(post => (
              <div key={post.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {post.isPinned && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">置顶</span>}
                      {post.isHot && <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">热门</span>}
                      <span className={`px-2 py-0.5 text-xs rounded ${post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {post.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </div>
                    <h4 className="text-white font-medium mb-1 truncate">{post.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{post.author}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likes}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{post.comments}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3" />{post.collects}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.topics.map((topic, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded">{topic}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleStatus('posts', post)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                      {post.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleToggleHot(post)} className={`p-2 hover:bg-white/10 rounded ${post.isHot ? 'text-orange-400' : 'text-gray-400'}`}>
                      <TrendingUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleTogglePinned(post)} className={`p-2 hover:bg-white/10 rounded ${post.isPinned ? 'text-red-400' : 'text-gray-400'}`}>
                      <Star className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEdit('posts', post)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('posts', post)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 教程列表 */}
        {activeTab === 'tutorials' && (
          <div className="divide-y divide-white/5">
            {filteredTutorials.map(tutorial => (
              <div key={tutorial.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-4">
                  <img src={tutorial.cover} alt="" className="w-32 h-20 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">{tutorial.category}</span>
                      <span className={`px-2 py-0.5 text-xs rounded ${tutorial.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {tutorial.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </div>
                    <h4 className="text-white font-medium mb-1">{tutorial.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{tutorial.author}</span>
                      <span>{tutorial.date}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{tutorial.views}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{tutorial.likes}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleStatus('tutorials', tutorial)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                      {tutorial.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleEdit('tutorials', tutorial)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('tutorials', tutorial)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI内容列表 */}
        {activeTab === 'aiContents' && (
          <div className="divide-y divide-white/5">
            {filteredAiContents.map(content => (
              <div key={content.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-lg">
                    {content.type === 'daily' ? '📰' : content.type === 'card' ? '🃏' : '🧭'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                        {content.type === 'daily' ? '每日简报' : content.type === 'card' ? '知识卡片' : '学习路径'}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded ${content.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {content.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </div>
                    <h4 className="text-white font-medium mb-1">{content.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-1">{content.summary}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                      <span>{content.date}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{content.likes}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3" />{content.collects}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleStatus('aiContents', content)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                      {content.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleEdit('aiContents', content)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('aiContents', content)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 悬赏列表 */}
        {activeTab === 'rewards' && (
          <div className="divide-y divide-white/5">
            {filteredRewards.map(reward => (
              <div key={reward.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">
                        ¥{reward.bounty}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded ${reward.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {reward.status === 'active' ? '进行中' : '已结束'}
                      </span>
                    </div>
                    <h4 className="text-white font-medium mb-1">{reward.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{reward.participants}人参与</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />截止 {reward.deadline}</span>
                      <span>结算：{reward.settleType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleStatus('rewards', reward)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                      {reward.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleEdit('rewards', reward)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('rewards', reward)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 编辑弹窗 */}
      {showEditModal && editItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-slate-800/95 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold">编辑{activeTab === 'posts' ? '帖子' : activeTab === 'tutorials' ? '教程' : activeTab === 'aiContents' ? 'AI内容' : '悬赏任务'}</h3>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white">
                ×
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* 帖子编辑 */}
              {editType === 'posts' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">标题</label>
                    <input type="text" value={editItem.title} onChange={e => setEditItem({ ...editItem, title: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">作者</label>
                    <input type="text" value={editItem.author} onChange={e => setEditItem({ ...editItem, author: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">内容</label>
                    <textarea value={editItem.content} onChange={e => setEditItem({ ...editItem, content: e.target.value })} rows={4} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white resize-none" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">点赞数</label>
                      <input type="number" value={editItem.likes} onChange={e => setEditItem({ ...editItem, likes: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">评论数</label>
                      <input type="number" value={editItem.comments} onChange={e => setEditItem({ ...editItem, comments: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">收藏数</label>
                      <input type="number" value={editItem.collects} onChange={e => setEditItem({ ...editItem, collects: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">状态</label>
                    <select value={editItem.status} onChange={e => setEditItem({ ...editItem, status: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white">
                      <option value="published">已发布</option>
                      <option value="draft">草稿</option>
                    </select>
                  </div>
                </>
              )}

              {/* 教程编辑 */}
              {editType === 'tutorials' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">标题</label>
                    <input type="text" value={editItem.title} onChange={e => setEditItem({ ...editItem, title: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">作者</label>
                    <input type="text" value={editItem.author} onChange={e => setEditItem({ ...editItem, author: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">分类</label>
                    <select value={editItem.category} onChange={e => setEditItem({ ...editItem, category: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white">
                      <option value="AI短视频">AI短视频</option>
                      <option value="AI广告">AI广告</option>
                      <option value="AI设计师">AI设计师</option>
                      <option value="影视漫剧">影视漫剧</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">封面URL</label>
                    <input type="text" value={editItem.cover} onChange={e => setEditItem({ ...editItem, cover: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">状态</label>
                    <select value={editItem.status} onChange={e => setEditItem({ ...editItem, status: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white">
                      <option value="published">已发布</option>
                      <option value="draft">草稿</option>
                    </select>
                  </div>
                </>
              )}

              {/* AI内容编辑 */}
              {editType === 'aiContents' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">类型</label>
                    <select value={editItem.type} onChange={e => setEditItem({ ...editItem, type: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white">
                      <option value="daily">每日简报</option>
                      <option value="card">知识卡片</option>
                      <option value="path">学习路径</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">标题</label>
                    <input type="text" value={editItem.title} onChange={e => setEditItem({ ...editItem, title: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">摘要</label>
                    <textarea value={editItem.summary} onChange={e => setEditItem({ ...editItem, summary: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">状态</label>
                    <select value={editItem.status} onChange={e => setEditItem({ ...editItem, status: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white">
                      <option value="published">已发布</option>
                      <option value="draft">草稿</option>
                    </select>
                  </div>
                </>
              )}

              {/* 悬赏编辑 */}
              {editType === 'rewards' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">标题</label>
                    <input type="text" value={editItem.title} onChange={e => setEditItem({ ...editItem, title: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">奖金金额</label>
                      <input type="number" value={editItem.bounty} onChange={e => setEditItem({ ...editItem, bounty: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">截止日期</label>
                      <input type="date" value={editItem.deadline} onChange={e => setEditItem({ ...editItem, deadline: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">结算方式</label>
                    <select value={editItem.settleType} onChange={e => setEditItem({ ...editItem, settleType: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white">
                      <option value="人工评审">人工评审</option>
                      <option value="按点赞结算">按点赞结算</option>
                      <option value="专业评审">专业评审</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">状态</label>
                    <select value={editItem.status} onChange={e => setEditItem({ ...editItem, status: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white">
                      <option value="active">进行中</option>
                      <option value="ended">已结束</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400">取消</button>
              <button onClick={handleSave} className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-medium">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 辅助组件
function Heart({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}
