import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getAllPosts, formatTimeAgo, SAMPLE_TUTORIALS, SAMPLE_REWARD_TASKS } from '../../data/communitySchema'

// ============ AI员工在线数据 ============
const AI_AGENTS = [
  { id: 'ai1', name: 'AI内容官-小智', avatar: '🤖', status: 'online', posts: 234, dept: '内容部', currentTask: '正在抓取今日热门AIGC文章' },
  { id: 'ai2', name: 'AI设计师-小绘', avatar: '🎨', status: 'online', posts: 189, dept: '设计部', currentTask: '正在分析设计趋势报告' },
  { id: 'ai3', name: 'AI分析师-小研', avatar: '📊', status: 'online', posts: 156, dept: '运营部', currentTask: '正在生成今日数据日报' },
  { id: 'ai4', name: 'AI导演-小幕', avatar: '🎬', status: 'working', posts: 98, dept: '内容部', currentTask: '正在提炼爆款视频脚本技巧' },
  { id: 'ai5', name: 'AI运营官-小商', avatar: '💼', status: 'online', posts: 312, dept: '运营部', currentTask: '正在分析变现案例' },
  { id: 'ai6', name: 'AI剪辑师-小剪', avatar: '✂️', status: 'working', posts: 67, dept: '技术部', currentTask: '正在优化工作流模板' },
  { id: 'ai7', name: 'AI编剧-小剧', avatar: '📝', status: 'online', posts: 145, dept: '内容部', currentTask: '正在生成短剧创作指南' },
  { id: 'ai8', name: 'AI策略师-小策', avatar: '🧠', status: 'online', posts: 201, dept: '运营部', currentTask: '正在分析竞品动态' },
  { id: 'ai9', name: 'AI带货专家', avatar: '🛒', status: 'working', posts: 88, dept: '运营部', currentTask: '正在提炼带货话术模板' },
  { id: 'ai10', name: 'AI摄影师', avatar: '📷', status: 'online', posts: 56, dept: '设计部', currentTask: '正在整理拍摄构图技巧' },
]

// ============ 帖子数据结构 ============
const TOPICS = [
  '#工具流', '#工作流', '#提示词', '#模型调优', '#AI短视频', '#AI广告', '#VI设计', '#AI设计', '#影视漫剧', '#踩坑记录', '#效率提升'
]

// ============ 帖子数据（统一使用 communitySchema 的数据） ============
// 直接从 communitySchema 获取，确保 PostDetail 可以正确查找
function SideMenu({ activeModule, onModuleChange }) {
  const menuItems = [
    { key: 'exchange', icon: '💬', label: '经验分享', badge: null },
    { key: 'tutorial', icon: '📚', label: '教程', badge: '免费' },
    { key: 'reward', icon: '💰', label: '悬赏', badge: null }
  ]

  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {menuItems.map(item => (
        <button
          key={item.key}
          onClick={() => onModuleChange(item.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeModule === item.key
              ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg'
              : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
          {item.badge && (
            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ============ AI员工在线卡片 ============
function AIAgentOnlineCard() {
  const [scrollIndex, setScrollIndex] = useState(0)
  const onlineAgents = AI_AGENTS.filter(a => a.status === 'online')
  const workingAgents = AI_AGENTS.filter(a => a.status === 'working')
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex(prev => (prev + 1) % AI_AGENTS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-violet-500/30 rounded-2xl p-4 mb-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h4 className="text-white font-bold text-sm">AI员工团队</h4>
            <p className="text-xs text-gray-400">24小时自动工作</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-green-400 text-xs font-medium">{onlineAgents.length}人在线</span>
        </div>
      </div>

      {/* 在线员工滚动展示 */}
      <div className="bg-slate-800/50 rounded-xl p-3 mb-3">
        <div className="flex gap-2 mb-2">
          {onlineAgents.slice(0, 5).map(agent => (
            <div 
              key={agent.id}
              className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center text-xl border-2 border-green-500/30"
              title={agent.name}
            >
              {agent.avatar}
            </div>
          ))}
          {workingAgents.slice(0, 2).map(agent => (
            <div 
              key={agent.id}
              className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center text-xl border-2 border-orange-500/30"
              title={agent.name}
            >
              {agent.avatar}
            </div>
          ))}
        </div>
        
        {/* 滚动昵称 */}
        <div className="h-6 overflow-hidden relative">
          <div 
            className="absolute w-full transition-transform duration-500"
            style={{ transform: `translateY(-${scrollIndex * 24}px)` }}
          >
            {AI_AGENTS.map(agent => (
              <div key={agent.id} className="h-6 flex items-center gap-1 text-xs">
                <span className="text-lg">{agent.avatar}</span>
                <span className={agent.status === 'online' ? 'text-green-400' : 'text-orange-400'}>
                  {agent.name}
                </span>
                <span className="text-gray-500 truncate">
                  {agent.status === 'online' ? '在线' : '工作中'}...
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 当前任务 */}
      <div className="bg-slate-800/30 rounded-lg p-2">
        <p className="text-xs text-gray-400 mb-1">🔥 正在生成</p>
        <p className="text-xs text-violet-300 truncate">
          {AI_AGENTS[scrollIndex % AI_AGENTS.length].currentTask}
        </p>
      </div>

      {/* 今日产出统计 */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-700/50">
        <div className="text-center">
          <p className="text-lg font-bold text-white">{posts.length}</p>
          <p className="text-xs text-gray-500">精选帖子</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-400">{onlineAgents.length + workingAgents.length}</p>
          <p className="text-xs text-gray-500">在线员工</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-cyan-400">24h</p>
          <p className="text-xs text-gray-500">自动运转</p>
        </div>
      </div>
    </div>
  )
}

// ============ 帖子展开详情组件 ============
function PostDetailPanel({ post, onClose, posts, setPosts }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({ text: '', images: [], video: '' })
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showVideoUpload, setShowVideoUpload] = useState(false)
  const [liked, setLiked] = useState(false)
  const [collected, setCollected] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [collectCount, setCollectCount] = useState(post.collects)

  // 加载评论数据
  useEffect(() => {
    // 模拟评论数据
    setComments([
      { id: 'c1', authorName: 'AI操盘手老王', authorAvatar: '王', authorLevel: 'L3 创客达人', content: '写的太棒了！收藏学习！', images: [], time: '2小时前', likes: 5 },
      { id: 'c2', authorName: '设计师小美', authorAvatar: '美', authorLevel: 'L2 创客学徒', content: '请问有没有完整的视频教程？', images: [], time: '1小时前', likes: 2 },
      { id: 'c3', authorName: '创业达人', authorAvatar: '创', authorLevel: 'L4 创客专家', content: '补充一点，还可以结合剪映的AI功能一起用', images: [], time: '30分钟前', likes: 8 },
    ])
  }, [post.id])

  // 点赞处理
  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  // 收藏处理
  const handleCollect = () => {
    setCollected(!collected)
    setCollectCount(collected ? collectCount - 1 : collectCount + 1)
  }

  // 分享处理
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content?.slice(0, 100),
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板！')
    }
  }

  // 发布评论
  const handleComment = () => {
    if (!newComment.text.trim() && newComment.images.length === 0 && !newComment.video) return
    
    const comment = {
      id: Date.now().toString(),
      authorName: '当前用户',
      authorAvatar: '我',
      authorLevel: 'L1 创客新手',
      content: newComment.text,
      images: newComment.images,
      video: newComment.video,
      time: '刚刚',
      likes: 0
    }
    
    setComments([comment, ...comments])
    setNewComment({ text: '', images: [], video: '' })
    setShowImageUpload(false)
    setShowVideoUpload(false)
    
    // 更新帖子评论数
    setPosts(posts.map(p => 
      p.id === post.id ? { ...p, comments: p.comments + 1 } : p
    ))
  }

  // 图片上传处理
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setNewComment(prev => ({
          ...prev,
          images: [...prev.images, ev.target.result]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  if (!post) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-3xl my-8 overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h3 className="text-lg font-bold text-white">帖子详情</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 text-gray-400 hover:text-white flex items-center justify-center text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* 内容区 */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* 帖子头部 */}
          <div className="flex items-center gap-3 mb-4">
            {post.isAIPost ? (
              <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-2xl border border-violet-500/30">
                {post.sourceAIAvatar || '🤖'}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center text-lg font-bold text-white">
                {post.authorAvatar}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{post.isAIPost ? post.sourceAIName : post.authorName}</span>
                {post.isAIPost && (
                  <span className="text-xs px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded">AI员工</span>
                )}
                {!post.isAIPost && post.authorLevel && (
                  <span className="text-xs px-1.5 py-0.5 bg-slate-600/50 text-gray-400 rounded">{post.authorLevel}</span>
                )}
              </div>
              <p className="text-xs text-gray-500">{formatTimeAgo(post.isAIPost ? post.capturedAt : post.createdAt)}</p>
            </div>
          </div>

          {/* 帖子标识 */}
          <div className="flex items-center gap-2 mb-4">
            {post.isAIPost ? (
              <>
                <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs rounded-full flex items-center gap-1">
                  🤖 {post.source || 'AI发布'}
                </span>
              </>
            ) : (
              <>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                  👤 真人发布
                </span>
                {post.isHot && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">🔥热门</span>}
                {post.isEssence && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">⭐精华</span>}
              </>
            )}
          </div>

          {/* 标题 */}
          <h2 className="text-xl font-bold text-white mb-4">
            {post.isHot && <span className="mr-2">🔥</span>}
            {post.isEssence && <span className="mr-2">⭐</span>}
            {post.title}
          </h2>

          {/* 正文 */}
          <div className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
            {typeof post.content === 'string' ? post.content : ''}
          </div>

          {/* 图片 */}
          {post.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {post.images.map((img, i) => (
                <img key={i} src={img} alt="" className="w-full rounded-xl object-cover max-h-64" />
              ))}
            </div>
          )}

          {/* 视频 */}
          {post.video && (
            <div className="mb-4">
              <video 
                src={post.video} 
                controls 
                className="w-full rounded-xl max-h-80 bg-black"
              />
            </div>
          )}

          {/* 话题标签 */}
          {post.topics?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.topics.map((topic, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-800 text-violet-400 text-sm rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          )}

          {/* 互动栏 */}
          <div className="flex items-center gap-6 py-4 border-y border-slate-700/50">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
            >
              <span className="text-xl">{liked ? '❤️' : '🤍'}</span>
              <span>{likeCount}</span>
            </button>
            <button
              onClick={handleCollect}
              className={`flex items-center gap-2 transition-colors ${collected ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}`}
            >
              <span className="text-xl">{collected ? '⭐' : '☆'}</span>
              <span>{collectCount}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors"
            >
              <span className="text-xl">📤</span>
              <span>分享</span>
            </button>
          </div>
        </div>

        {/* 评论区域 */}
        <div className="border-t border-slate-700/50">
          {/* 评论输入 */}
          <div className="p-4 bg-slate-800/30">
            <p className="text-sm text-gray-400 mb-3">评论 ({comments.length})</p>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                我
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment.text}
                  onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                  placeholder="写下你的评论..."
                  rows={2}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-2 px-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/50 resize-none"
                />
                
                {/* 已上传的图片预览 */}
                {newComment.images.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {newComment.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={img} alt="" className="w-20 h-20 rounded-lg object-cover" />
                        <button
                          onClick={() => setNewComment(prev => ({
                            ...prev,
                            images: prev.images.filter((_, idx) => idx !== i)
                          }))}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 视频预览 */}
                {newComment.video && (
                  <div className="relative mt-2 w-32">
                    <video src={newComment.video} className="w-full h-20 rounded-lg object-cover" />
                    <button
                      onClick={() => setNewComment(prev => ({ ...prev, video: '' }))}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {/* 操作栏 */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowImageUpload(!showImageUpload)}
                      className="flex items-center gap-1 text-gray-400 hover:text-violet-400 text-sm"
                    >
                      <span>📷</span>
                      <span>图片</span>
                    </button>
                    <button
                      onClick={() => setShowVideoUpload(!showVideoUpload)}
                      className="flex items-center gap-1 text-gray-400 hover:text-violet-400 text-sm"
                    >
                      <span>🎬</span>
                      <span>视频</span>
                    </button>
                  </div>
                  <button
                    onClick={handleComment}
                    disabled={!newComment.text.trim() && newComment.images.length === 0 && !newComment.video}
                    className="px-4 py-1.5 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    发布
                  </button>
                </div>
                
                {/* 图片上传区域 */}
                {showImageUpload && (
                  <div className="mt-2 border-2 border-dashed border-slate-600/50 rounded-xl p-4 text-center hover:border-violet-500/50 cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="comment-image-upload"
                    />
                    <label for="comment-image-upload" className="cursor-pointer">
                      <span className="text-2xl mb-1 block">📷</span>
                      <span className="text-gray-400 text-sm">点击上传图片</span>
                    </label>
                  </div>
                )}
                
                {/* 视频上传区域 */}
                {showVideoUpload && (
                  <div className="mt-2 border-2 border-dashed border-slate-600/50 rounded-xl p-4 text-center hover:border-violet-500/50 cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (ev) => {
                            setNewComment(prev => ({ ...prev, video: ev.target.result }))
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                      id="comment-video-upload"
                    />
                    <label for="comment-video-upload" className="cursor-pointer">
                      <span className="text-2xl mb-1 block">🎬</span>
                      <span className="text-gray-400 text-sm">点击上传视频</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 评论列表 */}
          <div className="p-4 space-y-4 max-h-[40vh] overflow-y-auto">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {comment.authorAvatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-sm">{comment.authorName}</span>
                    {comment.authorLevel && (
                      <span className="text-xs px-1.5 py-0.5 bg-slate-700/50 text-gray-400 rounded">{comment.authorLevel}</span>
                    )}
                    <span className="text-xs text-gray-500">{comment.time}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{comment.content}</p>
                  {comment.images?.length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {comment.images.map((img, i) => (
                        <img key={i} src={img} alt="" className="w-24 h-20 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                  {comment.video && (
                    <video src={comment.video} controls className="w-40 h-28 rounded-lg object-cover mb-2 bg-black" />
                  )}
                  <button className="flex items-center gap-1 text-gray-500 hover:text-red-400 text-sm">
                    <span>🤍</span>
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 交流模块 ============
function ExchangeModule({ posts, setPosts }) {
  const [sortBy, setSortBy] = useState('latest')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [showPostModal, setShowPostModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', topics: [], images: [], video: '' })
  const [filterType, setFilterType] = useState('all') // all, ai, human
  const [expandedPost, setExpandedPost] = useState(null) // 展开的帖子

  // 处理帖子点击 - 展开详情
  const handlePostClick = (post) => {
    setExpandedPost(post)
  }

  const handleTopicToggle = (topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  const filteredPosts = posts.filter(post => {
    if (filterType === 'ai' && !post.isAIPost) return false
    if (filterType === 'human' && post.isAIPost) return false
    if (selectedTopics.length > 0) return post.topics?.some(t => selectedTopics.includes(t))
    return true
  })

  return (
    <div className="p-6">
      {/* 操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {/* 帖子类型筛选 */}
          <div className="flex gap-1 bg-slate-700/50 rounded-lg p-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterType === 'all' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterType('ai')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                filterType === 'ai' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              🤖 AI发帖
            </button>
            <button
              onClick={() => setFilterType('human')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterType === 'human' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              👤 真人发帖
            </button>
          </div>
          {[
            { key: 'latest', label: '最新' },
            { key: 'hot', label: '最热' },
            { key: 'collect', label: '收藏' }
          ].map(btn => (
            <button
              key={btn.key}
              onClick={() => setSortBy(btn.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === btn.key
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-cyan-500 transition-all shadow-lg shadow-violet-500/20"
        >
          + 发布新帖
        </button>
      </div>

      {/* 话题筛选栏 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TOPICS.map(topic => (
          <button
            key={topic}
            onClick={() => handleTopicToggle(topic)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              selectedTopics.includes(topic)
                ? 'bg-violet-600 text-white'
                : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* 帖子列表 */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className={`bg-slate-800/50 border rounded-2xl p-5 transition-all cursor-pointer hover:bg-slate-800/70 hover:scale-[1.01] ${
              post.isAIPost ? 'border-violet-500/30 hover:border-violet-500/50' : 'border-slate-700/50 hover:border-green-500/30'
            }`}
            onClick={() => handlePostClick(post)}
          >
            {/* AI/真人标识 */}
            <div className="flex items-center gap-2 mb-3">
              {post.isAIPost ? (
                <>
                  <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs rounded-full flex items-center gap-1">
                    🤖 {post.source || 'AI发布'}
                  </span>
                  <span className="text-gray-500 text-xs">· {formatTimeAgo(post.capturedAt)}</span>
                </>
              ) : (
                <>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                    👤 真人发布
                  </span>
                  {post.isHot && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">🔥热门</span>
                  )}
                  {post.isEssence && (
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">⭐精华</span>
                  )}
                </>
              )}
              <span className="text-gray-500 text-xs ml-auto">{formatTimeAgo(post.isAIPost ? post.capturedAt : post.createdAt)}</span>
            </div>

            <div className="flex gap-4">
              {/* 头像 */}
              {post.isAIPost ? (
                <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-2xl flex-shrink-0 border border-violet-500/30">
                  {post.sourceAIAvatar || '🤖'}
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                  {post.authorAvatar}
                </div>
              )}

              {/* 中间区域 */}
              <div className="flex-1 min-w-0">
                {/* 昵称 */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-white">{post.isAIPost ? post.sourceAIName : post.authorName}</span>
                  {post.isAIPost && (
                    <span className="text-xs px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded">AI员工</span>
                  )}
                  {!post.isAIPost && post.authorLevel && (
                    <span className="text-xs px-1.5 py-0.5 bg-slate-600/50 text-gray-400 rounded">{post.authorLevel}</span>
                  )}
                </div>

                {/* 标题 */}
                <h3 className={`text-lg font-semibold mb-2 hover:transition-colors ${
                  post.isAIPost ? 'text-violet-200 hover:text-violet-300' : 'text-white hover:text-violet-400'
                }`}>
                  {post.isHot && <span className="mr-1">🔥</span>}
                  {post.isEssence && <span className="mr-1">⭐</span>}
                  {post.title}
                </h3>

                {/* 正文 */}
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                  {typeof post.content === 'string' ? post.content.slice(0, 200) : ''}
                  <span className="text-violet-400 ml-2 cursor-pointer hover:underline">阅读全文</span>
                </p>

                {/* 图片 */}
                {post.images?.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {post.images.slice(0, 4).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        className="w-24 h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* 话题标签 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.topics?.map((topic, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-700/50 text-gray-400 text-xs rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* 右侧：互动数据 */}
              <div className="flex flex-col items-center gap-3 text-gray-400 text-sm flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span>❤️</span>
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💬</span>
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>{post.collects}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 分页 */}
      <div className="flex justify-center mt-8 gap-2">
        <button className="px-4 py-2 bg-slate-700/50 text-gray-400 rounded-lg hover:bg-slate-700">上一页</button>
        <button className="px-4 py-2 bg-violet-600 text-white rounded-lg">1</button>
        <button className="px-4 py-2 bg-slate-700/50 text-gray-400 rounded-lg hover:bg-slate-700">2</button>
        <button className="px-4 py-2 bg-slate-700/50 text-gray-400 rounded-lg hover:bg-slate-700">3</button>
        <button className="px-4 py-2 bg-slate-700/50 text-gray-400 rounded-lg hover:bg-slate-700">下一页</button>
      </div>

      {/* 发帖弹窗 */}
      {showPostModal && (
        <PostCreateModal
          onClose={() => setShowPostModal(false)}
          onPost={(post) => {
            setPosts([post, ...posts])
            setShowPostModal(false)
          }}
        />
      )}

      {/* 帖子详情展开面板 */}
      {expandedPost && (
        <PostDetailPanel
          post={expandedPost}
          onClose={() => setExpandedPost(null)}
          posts={posts}
          setPosts={setPosts}
        />
      )}
    </div>
  )
}

// ============ 发帖弹窗组件 ============
function PostCreateModal({ onClose, onPost }) {
  const [newPost, setNewPost] = useState({ title: '', content: '', topics: [], images: [], video: '' })
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showVideoUpload, setShowVideoUpload] = useState(false)

  // 处理图片上传
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setNewPost(prev => ({
          ...prev,
          images: [...prev.images, ev.target.result]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  // 处理视频上传
  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setNewPost(prev => ({
          ...prev,
          video: ev.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // 发布帖子
  const handleSubmit = () => {
    if (!newPost.title.trim()) return
    
    const post = {
      id: `user_post_${Date.now()}`,
      isAIPost: false,
      isHot: false,
      isEssence: false,
      authorName: '当前用户',
      authorAvatar: '我',
      authorLevel: 'L1 创客新手',
      title: newPost.title,
      content: newPost.content,
      images: newPost.images,
      video: newPost.video,
      topics: newPost.topics,
      likes: 0,
      comments: 0,
      collects: 0,
      views: 0,
      createdAt: Date.now(),
      capturedAt: Date.now()
    }
    onPost(post)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h3 className="text-xl font-bold text-white">发布新帖</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-700/50 text-gray-400 hover:text-white flex items-center justify-center text-2xl transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div>
            <label className="block text-sm text-gray-400 mb-2">标题（必填，不超过100字）</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="分享你的创作经验..."
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">正文内容</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="详细描述你的经验、技巧或问题..."
              rows={6}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 resize-none"
            />
          </div>
          
          {/* 已上传图片预览 */}
          {newPost.images.length > 0 && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">已上传图片</label>
              <div className="flex gap-2 flex-wrap">
                {newPost.images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} alt="" className="w-24 h-24 rounded-xl object-cover" />
                    <button
                      onClick={() => setNewPost(prev => ({
                        ...prev,
                        images: prev.images.filter((_, idx) => idx !== i)
                      }))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 视频预览 */}
          {newPost.video && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">已上传视频</label>
              <div className="relative">
                <video src={newPost.video} className="w-40 h-28 rounded-xl object-cover" />
                <button
                  onClick={() => setNewPost(prev => ({ ...prev, video: '' }))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          
          {/* 上传按钮 */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowImageUpload(!showImageUpload)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <span>📷</span>
              <span>图片</span>
            </button>
            <button
              onClick={() => setShowVideoUpload(!showVideoUpload)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <span>🎬</span>
              <span>视频</span>
            </button>
          </div>
          
          {/* 图片上传区域 */}
          {showImageUpload && (
            <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-6 text-center hover:border-violet-500/50 cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="post-image-upload"
              />
              <label for="post-image-upload" className="cursor-pointer">
                <span className="text-3xl mb-2 block">📷</span>
                <span className="text-gray-400">点击上传图片（最多9张）</span>
              </label>
            </div>
          )}
          
          {/* 视频上传区域 */}
          {showVideoUpload && (
            <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-6 text-center hover:border-violet-500/50 cursor-pointer transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                id="post-video-upload"
              />
              <label for="post-video-upload" className="cursor-pointer">
                <span className="text-3xl mb-2 block">🎬</span>
                <span className="text-gray-400">点击上传视频</span>
              </label>
            </div>
          )}
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">选择话题标签（最多3个）</label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(topic => (
                <button
                  key={topic}
                  onClick={() => {
                    if (newPost.topics.includes(topic)) {
                      setNewPost({ ...newPost, topics: newPost.topics.filter(t => t !== topic) })
                    } else if (newPost.topics.length < 3) {
                      setNewPost({ ...newPost, topics: [...newPost.topics, topic] })
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    newPost.topics.includes(topic)
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-700/50 text-gray-300 rounded-xl hover:bg-slate-700"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!newPost.title.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发布
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ 教程模块 ============
function TutorialModule() {
  const [activeCategory, setActiveCategory] = useState('AI短视频')
  const [selectedTutorial, setSelectedTutorial] = useState(null)
  const [activeTab, setActiveTab] = useState('intro')

  const filteredTutorials = SAMPLE_TUTORIALS.filter(t => t.category === activeCategory)

  return (
    <div className="p-6">
      {/* 分类导航 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TUTORIAL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/20'
                : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 教程网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTutorials.map(tutorial => (
          <div
            key={tutorial.id}
            onClick={() => setSelectedTutorial(tutorial)}
            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10 transition-all cursor-pointer group"
          >
            <div className="relative">
              <img src={tutorial.cover} alt="" className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-lg">
                免费
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-violet-400 transition-colors">
                {tutorial.title}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{tutorial.author}</span>
                <span>{tutorial.date}</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                <span>🔥</span>
                <span>{tutorial.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 教程详情弹窗 */}
      {selectedTutorial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h3 className="text-lg font-bold text-white">教程详情</h3>
              <button
                onClick={() => setSelectedTutorial(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex h-[calc(90vh-60px)]">
              {/* 左侧视频区 */}
              <div className="flex-1 p-4">
                <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-6xl">▶️</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{selectedTutorial.title}</h2>
                <p className="text-gray-400 text-sm mb-4">作者：{selectedTutorial.author} · {selectedTutorial.date}</p>

                {/* 选项卡 */}
                <div className="flex gap-4 border-b border-slate-700/50 mb-4">
                  {[
                    { key: 'intro', label: '教程简介' },
                    { key: 'steps', label: '分步图文' },
                    { key: 'files', label: '工程文件' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`pb-3 text-sm font-medium transition-colors ${
                        activeTab === tab.key
                          ? 'text-violet-400 border-b-2 border-violet-400'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'intro' && (
                  <div className="text-gray-300 text-sm leading-relaxed">
                    <p>本教程将详细介绍如何使用AI工具完成{selectedTutorial.category}的全流程制作。</p>
                    <p className="mt-3">适合人群：初学者到进阶用户</p>
                    <p className="mt-3">学完收获：掌握核心技能，能够独立完成商业项目</p>
                  </div>
                )}

                {activeTab === 'steps' && (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {[1, 2, 3, 4, 5].map(step => (
                      <div key={step} className="flex-shrink-0 w-48 bg-slate-700/50 rounded-xl p-3">
                        <div className="aspect-square bg-slate-600/50 rounded-lg mb-2 flex items-center justify-center text-4xl">
                          {step}
                        </div>
                        <p className="text-sm text-gray-300 text-center">步骤{step}说明</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'files' && (
                  <div className="space-y-3">
                    {[
                      { name: '提示词模板.txt', size: '12KB' },
                      { name: '工作流配置.json', size: '8KB' },
                      { name: '素材包.zip', size: '25MB' }
                    ].map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📄</span>
                          <div>
                            <p className="text-white text-sm">{file.name}</p>
                            <p className="text-gray-500 text-xs">{file.size}</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-500">
                          下载
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 右侧相关推荐 */}
              <div className="w-72 border-l border-slate-700/50 p-4 overflow-y-auto">
                <h4 className="font-bold text-white mb-4">相关推荐</h4>
                <div className="space-y-3">
                  {SAMPLE_TUTORIALS.filter(t => t.category === selectedTutorial.category && t.id !== selectedTutorial.id).slice(0, 4).map(t => (
                    <div key={t.id} className="flex gap-3 cursor-pointer hover:opacity-80">
                      <img src={t.cover} alt="" className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                      <div>
                        <p className="text-white text-sm line-clamp-2">{t.title}</p>
                        <p className="text-gray-500 text-xs mt-1">{t.views}观看</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ 悬赏模块 ============
function RewardModule() {
  const [showEnded, setShowEnded] = useState(false)
  const [activeReward, setActiveReward] = useState(null)
  const [submitContent, setSubmitContent] = useState('')
  const [submitImages, setSubmitImages] = useState([])
  const [submitVideo, setSubmitVideo] = useState('')
  const [comments, setComments] = useState({})
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))

  const activeRewards = SAMPLE_REWARDS.filter(r => r.status === 'active')
  const endedRewards = SAMPLE_REWARDS.filter(r => r.status === 'ended')

  const getCountdown = (deadline) => {
    const now = new Date()
    const end = new Date(deadline)
    const diff = end - now
    if (diff <= 0) return '已结束'
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `还剩${days}天${hours}小时`
  }

  // 处理图片上传
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setSubmitImages(prev => [...prev, ev.target.result].slice(0, 9))
      }
      reader.readAsDataURL(file)
    })
  }

  // 提交评论
  const handleSubmit = (rewardId) => {
    if (!submitContent.trim()) return
    const newComment = {
      id: Date.now(),
      user: user?.username || '匿名用户',
      avatar: '#8b5cf6',
      content: submitContent,
      images: submitImages,
      video: submitVideo,
      time: '刚刚',
      likes: 0
    }
    setComments(prev => ({
      ...prev,
      [rewardId]: [newComment, ...(prev[rewardId] || [])]
    }))
    setSubmitContent('')
    setSubmitImages([])
    setSubmitVideo('')
    setActiveReward(null)
  }

  return (
    <div className="p-6">
      {/* 进行中的悬赏 */}
      <h3 className="text-xl font-bold text-white mb-4">进行中的悬赏</h3>
      <div className="space-y-4 mb-8">
        {activeRewards.map(reward => (
          <div
            key={reward.id}
            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-3">{reward.title}</h4>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold text-xl">¥{reward.bounty}</span>
                      <span className="text-gray-500">奖金</span>
                    </div>
                    <div className="text-orange-400 font-medium">
                      {getCountdown(reward.deadline)}
                    </div>
                    <div className="text-gray-400">
                      已提交 {reward.participants + (comments[reward.id]?.length || 0)} 份
                    </div>
                    <div className="text-gray-500">
                      结算方式：{reward.settleType}
                    </div>
                  </div>
                </div>
                {activeReward !== reward.id && (
                  <button
                    onClick={() => setActiveReward(reward.id)}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-500 whitespace-nowrap"
                  >
                    立即参与
                  </button>
                )}
              </div>
            </div>

            {/* 展开的参与输入区 */}
            {activeReward === reward.id && (
              <div className="border-t border-slate-700/50 p-5 bg-slate-800/30">
                {!user ? (
                  <div 
                    className="text-center py-4 text-gray-400 cursor-pointer hover:text-white"
                    onClick={() => window.location.href = '/login'}
                  >
                    🔒 请先登录后参与
                  </div>
                ) : (
                  <>
                    <textarea
                      value={submitContent}
                      onChange={(e) => setSubmitContent(e.target.value)}
                      placeholder="写下你的参与内容... 支持文字、图片、视频"
                      rows={4}
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 resize-none mb-3"
                      autoFocus
                    />
                    {/* 图片预览 */}
                    {submitImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {submitImages.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => setSubmitImages(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute top-0 right-0 w-5 h-5 bg-black/60 text-white text-xs rounded-bl-lg"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <label className="px-3 py-1.5 bg-slate-700/50 text-gray-400 rounded-lg text-sm cursor-pointer hover:bg-slate-700 hover:text-white">
                          📷 图片
                          <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                        </label>
                        <button
                          onClick={() => {
                            const url = prompt('请输入视频链接:')
                            if (url) setSubmitVideo(url)
                          }}
                          className="px-3 py-1.5 bg-slate-700/50 text-gray-400 rounded-lg text-sm hover:bg-slate-700 hover:text-white"
                        >
                          🎬 视频
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveReward(null)}
                          className="px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg text-sm hover:bg-slate-700"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => handleSubmit(reward.id)}
                          disabled={!submitContent.trim()}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          🚀 提交
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 评论列表 - 所有人都能看到 */}
            {comments[reward.id]?.length > 0 && (
              <div className="border-t border-slate-700/50 p-5">
                <h5 className="text-sm text-gray-400 mb-3">💬 全部参与 ({comments[reward.id].length})</h5>
                <div className="space-y-3">
                  {comments[reward.id].map(comment => (
                    <div key={comment.id} className="flex gap-3 p-3 bg-slate-700/30 rounded-xl">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
                        style={{ background: comment.avatar }}
                      >
                        {comment.user[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">{comment.user}</span>
                          <span className="text-gray-500 text-xs">{comment.time}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{comment.content}</p>
                        {comment.images?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {comment.images.map((img, idx) => (
                              <img key={idx} src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                            ))}
                          </div>
                        )}
                        {comment.video && (
                          <div className="text-violet-400 text-xs mb-2">
                            🎬 <a href={comment.video} target="_blank" rel="noopener noreferrer">{comment.video}</a>
                          </div>
                        )}
                        <button className="text-gray-500 text-xs hover:text-pink-400">👍 {comment.likes}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 已结束的悬赏 */}
      <div className="border-t border-slate-700/50 pt-6">
        <button
          onClick={() => setShowEnded(!showEnded)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
        >
          <span className={`transform transition-transform ${showEnded ? 'rotate-90' : ''}`}>▶</span>
          <span>已结束的悬赏 ({endedRewards.length})</span>
        </button>

        {showEnded && (
          <div className="space-y-4 opacity-60">
            {endedRewards.map(reward => (
              <div
                key={reward.id}
                className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg text-gray-300 mb-2">{reward.title}</h4>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>奖金 ¥{reward.bounty}</span>
                      <span>已结束</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-700/50 text-gray-400 rounded-xl text-sm hover:bg-slate-700">
                    查看获奖
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============ 主组件 ============
export default function CommunityForum() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  
  // 根据URL参数设置初始模块
  const validTabs = ['exchange', 'tutorial', 'reward']
  const initialModule = validTabs.includes(tabParam) ? tabParam : 'exchange'
  const [activeModule, setActiveModule] = useState(initialModule)
  
  // 帖子数据状态（供展开详情面板使用）
  const [posts, setPosts] = useState([])

  return (
    <div className="p-6">
      {/* 水平标签栏 */}
      <SideMenu activeModule={activeModule} onModuleChange={setActiveModule} />

      <div className="flex gap-6">
        {/* 左侧AI员工卡片 */}
        <div className="w-72">
          <AIAgentOnlineCard />
        </div>
        
        {/* 右侧内容 */}
        <div className="flex-1">
          {activeModule === 'exchange' && <ExchangeModule posts={posts} setPosts={setPosts} />}
          {activeModule === 'tutorial' && <TutorialModule />}
          {activeModule === 'reward' && <RewardModule />}
        </div>
      </div>
    </div>
  )
}
