/**
 * 经验分享板块 - 升级版
 * 支持图文视频发布、积分激励、评论互动
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Clock, TrendingUp, Star, Plus, Heart, MessageCircle, Bookmark,
  Image as ImageIcon, ChevronRight, Search, X, Send, Reply, ThumbsUp,
  Share2, Eye, Award, Trophy, Zap, Sparkles, DollarSign,
  Bold, Italic, Link, Code, Video, FileText, Camera, Tag, Workflow,
  Coins, Crown, Flame, ArrowUp, Bell, ChevronDown
} from 'lucide-react'
import { SAMPLE_POSTS, SAMPLE_COMMENTS, TOPICS, formatTimeAgo, getAllPosts } from '../../../data/communitySchema'
import './CommunityExchange.css'

// ============ AI员工24小时动态配置 ============
const AI_STAFF_DYNAMICS = [
  { id: 'd1', name: '碳硅小助手', avatar: '🤖', action: '发布了教程', title: '即梦3.0一键做广告片', time: '刚刚' },
  { id: 'd2', name: 'AI情报员', avatar: '🔍', action: '抓取了资讯', title: 'Runway Gen-4内测曝光', time: '2分钟前' },
  { id: 'd3', name: '爆款分析师', avatar: '📊', action: '分析了数据', title: '本周TOP10爆款元素', time: '5分钟前' },
  { id: 'd4', name: '素材猎手', avatar: '🎬', action: '精选了素材', title: '本月最火AI广告案例', time: '8分钟前' },
  { id: 'd5', name: '趋势预报员', avatar: '📈', action: '发布了预测', title: 'Q2四大趋势分析', time: '12分钟前' },
  { id: 'd6', name: '通义千问', avatar: '❓', action: '解答了问题', title: '如何用AI做带货视频', time: '15分钟前' },
  { id: 'd7', name: 'Claude', avatar: '🎨', action: '分享了技巧', title: 'Midjourney灯光咒语', time: '20分钟前' },
  { id: 'd8', name: 'Midjourney', avatar: '🖼️', action: '生成了素材', title: '品牌视觉素材包v2', time: '25分钟前' },
]

// ============ AI员工统计数据 ============
const AI_STAFF_STATS = {
  totalPosts: 1289,
  activeStaff: 15,
  dailyViews: 45678,
  tutorials: 236,
}

// ============ 积分奖励配置 ============
export const POINTS_CONFIG = {
  POST_PUBLISH: 10,        // 发布帖子
  LIKE_RECEIVED: 2,        // 获得点赞
  COMMENT_RECEIVED: 1,     // 获得评论
  COLLECT_RECEIVED: 3,     // 被收藏
  SHARE_RECEIVED: 5,       // 被分享
  HOT_BADGE: 50,           // 获得热门标签
  ESSENCE_BADGE: 30,       // 获得精华标签
  VIP_BADGE: 100,          // 获得VIP推荐
}

// ============ 等级配置 ============
export const LEVEL_CONFIG = {
  1: { name: 'L1 创客新手', minPoints: 0, color: '#94a3b8', icon: '🌱' },
  2: { name: 'L2 创客学徒', minPoints: 100, color: '#22c55e', icon: '📖' },
  3: { name: 'L3 创客达人', minPoints: 500, color: '#3b82f6', icon: '🎯' },
  4: { name: 'L4 创客专家', minPoints: 2000, color: '#8b5cf6', icon: '⭐' },
  5: { name: 'L5 创客大师', minPoints: 5000, color: '#f59e0b', icon: '👑' },
  6: { name: 'L6 合伙人', minPoints: 10000, color: '#ef4444', icon: '💎' },
}

// 获取等级
export const getLevel = (points) => {
  const levels = Object.entries(LEVEL_CONFIG).reverse()
  for (const [level, config] of levels) {
    if (points >= config.minPoints) {
      return { level: parseInt(level), ...config, points }
    }
  }
  return { level: 1, ...LEVEL_CONFIG[1], points }
}

// 计算到下一级需要的积分
export const getPointsToNextLevel = (points) => {
  const currentLevel = getLevel(points)
  if (currentLevel.level >= 6) return null
  const nextLevelConfig = LEVEL_CONFIG[currentLevel.level + 1]
  return nextLevelConfig.minPoints - points
}

// ============ 用户积分状态管理 ============
const useUserPoints = () => {
  const [userPoints, setUserPoints] = useState(() => {
    const saved = localStorage.getItem('user_points')
    return saved ? JSON.parse(saved) : {
      total: 0,
      history: [],
      stats: {
        postsCount: 0,
        likesReceived: 0,
        commentsReceived: 0,
        collectsReceived: 0,
        hotBadges: 0,
        essenceBadges: 0
      }
    }
  })

  useEffect(() => {
    localStorage.setItem('user_points', JSON.stringify(userPoints))
  }, [userPoints])

  const addPoints = (type, amount, description) => {
    setUserPoints(prev => ({
      ...prev,
      total: prev.total + amount,
      history: [{ type, amount, description, time: new Date().toISOString() }, ...prev.history.slice(0, 49)],
      stats: {
        ...prev.stats,
        ...(type === 'post' ? { postsCount: prev.stats.postsCount + 1 } : {}),
        ...(type === 'like' ? { likesReceived: prev.stats.likesReceived + 1 } : {}),
        ...(type === 'comment' ? { commentsReceived: prev.stats.commentsReceived + 1 } : {}),
        ...(type === 'collect' ? { collectsReceived: prev.stats.collectsReceived + 1 } : {}),
      }
    }))
  }

  const getMonthlyEarnings = () => {
    const now = new Date()
    const thisMonth = userPoints.history.filter(h => {
      const hDate = new Date(h.time)
      return hDate.getMonth() === now.getMonth() && hDate.getFullYear() === now.getFullYear()
    })
    return thisMonth.reduce((sum, h) => sum + h.amount, 0)
  }

  return { userPoints, addPoints, getMonthlyEarnings }
}

// ============ 排序选项 ============
const sortOptions = [
  { id: 'latest', name: '最新', icon: Clock },
  { id: 'hot', name: '最热', icon: TrendingUp },
  { id: 'essence', name: '精选', icon: Star },
]

// ============ 帖子类型 ============
const POST_CATEGORIES = [
  { id: 'ai_video', name: 'AI视频', icon: Video },
  { id: 'ai_design', name: 'AI设计', icon: Sparkles },
  { id: 'ai_shortplay', name: 'AI短剧', icon: FileText },
  { id: 'tool测评', name: '工具测评', icon: Code },
  { id: '变现技巧', name: '变现技巧', icon: DollarSign },
  { id: '工作流', name: '工作流', icon: Workflow },
  { id: '踩坑记录', name: '踩坑记录', icon: Tag },
]

// ============ 主组件 ============
export default function CommunityExchange() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState(getAllPosts()) // 包含AI抓取的帖子
  const [sortBy, setSortBy] = useState('latest')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showPostModal, setShowPostModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMyStats, setShowMyStats] = useState(false)
  
  // 发帖表单
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postTopics, setPostTopics] = useState([])
  const [postImages, setPostImages] = useState([])
  const [postVideoUrl, setPostVideoUrl] = useState('')
  const [postCategory, setPostCategory] = useState('')
  
  // 积分系统
  const { userPoints, addPoints, getMonthlyEarnings } = useUserPoints()
  
  // 积分动画
  const [pointAnimation, setPointAnimation] = useState(null)
  
  // AI帖子动态更新效果
  const [newPostsCount, setNewPostsCount] = useState(0)
  const [showNewPostToast, setShowNewPostToast] = useState(false)
  const [latestNewPost, setLatestNewPost] = useState(null)

  // AI员工模拟发帖
  const generateAIDynamicPosts = () => {
    const aiStaff = [
      { name: '碳硅小助手', avatar: '🤖', titles: ['即梦3.0新功能使用技巧', 'AI短剧制作入门教程', '如何用AI快速生成脚本'] },
      { name: 'AI情报员', avatar: '🔍', titles: ['最新AI工具情报', 'Runway新功能抢先看', 'AI视频生成技术突破'] },
      { name: '爆款分析师', avatar: '📊', titles: ['本周爆款视频分析', '什么样的内容最受欢迎', '爆款视频规律总结'] },
      { name: '素材猎手', avatar: '🎬', titles: ['免费素材网站推荐', 'AI视频素材整理', '优质素材使用技巧'] },
      { name: '趋势预报员', avatar: '📈', titles: ['下月AI创作趋势', '短视频平台风向分析', '变现机会预测'] },
      { name: '通义千问', avatar: '❓', titles: ['常见问题解答', 'AI使用技巧分享', '高效使用AI工具'] },
      { name: 'Claude', avatar: '🎨', titles: ['Midjourney提示词技巧', 'AI设计灵感分享', '视觉设计趋势'] },
      { name: 'Midjourney', avatar: '🖼️', titles: ['最新风格参考', '如何生成高质量图片', 'AI绘画技巧'] },
    ]
    
    const randomStaff = aiStaff[Math.floor(Math.random() * aiStaff.length)]
    const randomTitle = randomStaff.titles[Math.floor(Math.random() * randomStaff.titles.length)]
    
    return {
      id: `ai_live_${Date.now()}`,
      isAIPost: true,
      sourceAIName: randomStaff.name,
      sourceAIAvatar: randomStaff.avatar,
      authorName: randomStaff.name,
      authorAvatar: randomStaff.avatar,
      authorLevel: 'AI员工',
      title: `【实时】${randomTitle}`,
      content: `${randomStaff.name}正在为您整理最新内容，请稍候...\n\n💡 提示：关注我们，第一时间获取AI创作干货！`,
      images: [`https://picsum.photos/800/450?random=${Date.now()}`],
      topics: ['#效率提升', '#工具流'],
      likes: Math.floor(Math.random() * 100) + 50,
      comments: Math.floor(Math.random() * 30) + 10,
      collects: Math.floor(Math.random() * 50) + 20,
      views: Math.floor(Math.random() * 1000) + 500,
      capturedAt: new Date().toISOString(),
      source: '实时更新',
      isLive: true,
    }
  }

  // 模拟AI员工不断发布新帖子
  useEffect(() => {
    const interval = setInterval(() => {
      // 随机决定是否添加新帖子
      if (Math.random() > 0.5) {
        const newPost = generateAIDynamicPosts()
        setLatestNewPost(newPost)
        setNewPostsCount(prev => prev + 1)
        setShowNewPostToast(true)
        
        // 添加到帖子列表顶部
        setPosts(prev => [newPost, ...prev.slice(0, 19)]) // 最多保留20条实时帖子
        
        // 3秒后隐藏提示
        setTimeout(() => setShowNewPostToast(false), 3000)
      }
    }, 8000) // 每8秒可能产生一条新帖子

    return () => clearInterval(interval)
  }, [])

  // 显示积分动画
  const showPointsAnimation = (amount, reason) => {
    setPointAnimation({ amount, reason })
    setTimeout(() => setPointAnimation(null), 2000)
  }

  // 加载数据
  useEffect(() => {
    // 合并AI帖子和人类帖子，AI帖子排在前面
    let filtered = [...getAllPosts()]
    
    // 分类筛选 - 基于话题标签匹配
    if (selectedCategory) {
      filtered = filtered.filter(post => {
        // 先匹配话题标签
        const topicMatch = post.topics.some(t => 
          t.includes(selectedCategory) || 
          selectedCategory.includes(t.replace('#', ''))
        )
        // 也匹配标题和内容中的关键词
        const contentMatch = 
          post.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          post.content.toLowerCase().includes(selectedCategory.toLowerCase())
        return topicMatch || contentMatch
      })
    }
    
    // 话题筛选
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(post => 
        selectedTopics.some(topic => post.topics.includes(topic.name))
      )
    }
    
    // 搜索筛选
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // 排序
    if (sortBy === 'latest') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.capturedAt || a.createdAt)
        const dateB = new Date(b.capturedAt || b.createdAt)
        return dateB - dateA
      })
    } else if (sortBy === 'hot') {
      filtered.sort((a, b) => (b.likes + b.comments * 2 + b.collects * 3) - (a.likes + a.comments * 2 + a.collects * 3))
    } else if (sortBy === 'essence') {
      filtered.sort((a, b) => (b.isEssence ? 1 : 0) - (a.isEssence ? 1 : 0))
    }
    
    setPosts(filtered)
  }, [sortBy, selectedTopics, selectedCategory, searchQuery])

  const toggleTopic = (topic) => {
    setSelectedTopics(prev =>
      prev.find(t => t.id === topic.id)
        ? prev.filter(t => t.id !== topic.id)
        : [...prev, topic]
    )
  }

  const handleLike = (postId) => {
    const post = posts.find(p => p.id === postId)
    if (!post) return
    
    // 获取当前用户
    const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    // 如果是取消点赞，检查是否是自己的帖子
    if (!post.isLiked && post.authorId === currentUser.id) {
      // 不能给自己点赞
      return
    }
    
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isNowLiked = !p.isLiked
        const newLikes = isNowLiked ? p.likes + 1 : p.likes - 1
        
        // 如果是给自己的帖子获赞，添加积分
        if (isNowLiked && post.authorId === currentUser.id) {
          addPoints('like', POINTS_CONFIG.LIKE_RECEIVED, `帖子获得点赞：${p.title.slice(0, 20)}...`)
          showPointsAnimation(POINTS_CONFIG.LIKE_RECEIVED, '获得点赞')
        }
        
        return {
          ...p,
          isLiked: isNowLiked,
          likes: newLikes
        }
      }
      return p
    }))
  }

  const handleCollect = (postId) => {
    const post = posts.find(p => p.id === postId)
    if (!post) return
    
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isNowCollected = !p.isCollected
        const newCollects = isNowCollected ? p.collects + 1 : p.collects - 1
        return {
          ...p,
          isCollected: isNowCollected,
          collects: newCollects
        }
      }
      return p
    }))
  }

  // 处理图片上传
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPostImages(prev => [...prev, { url: event.target.result, name: file.name }])
      }
      reader.readAsDataURL(file)
    })
  }

  // 移除图片
  const removeImage = (index) => {
    setPostImages(prev => prev.filter((_, i) => i !== index))
  }

  // 发布帖子
  const handleSubmitPost = () => {
    if (!postTitle.trim() || !postContent.trim()) {
      alert('请填写标题和内容')
      return
    }
    
    const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : { name: '游客', id: 'guest' }
    const userLevel = getLevel(userPoints.total)
    
    const newPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name || '游客',
      authorAvatar: (currentUser.name || '游').charAt(0),
      authorLevel: userLevel.name,
      authorLevelIcon: userLevel.icon,
      authorPostCount: userPoints.stats.postsCount + 1,
      authorFollowers: 0,
      title: postTitle,
      content: postContent,
      category: postCategory,
      images: postImages.map(img => img.url),
      videoUrl: postVideoUrl,
      topics: postTopics.map(t => t.name),
      likes: 0,
      comments: 0,
      collects: 0,
      views: 1,
      isLiked: false,
      isCollected: false,
      isHot: false,
      isEssence: false,
      createdAt: new Date().toISOString(),
    }
    
    setPosts(prev => [newPost, ...prev])
    setShowPostModal(false)
    setPostTitle('')
    setPostContent('')
    setPostTopics([])
    setPostImages([])
    setPostVideoUrl('')
    setPostCategory('')
    
    // 添加发布积分
    addPoints('post', POINTS_CONFIG.POST_PUBLISH, `发布帖子：${postTitle.slice(0, 20)}...`)
    showPointsAnimation(POINTS_CONFIG.POST_PUBLISH, '发布帖子')
  }

  // 计算预计奖励
  const getEstimatedReward = (post) => {
    const likesReward = post.likes * POINTS_CONFIG.LIKE_RECEIVED
    const commentReward = post.comments * POINTS_CONFIG.COMMENT_RECEIVED
    const collectReward = post.collects * POINTS_CONFIG.COLLECT_RECEIVED
    return likesReward + commentReward + collectReward
  }

  // 分享帖子
  const handleShare = async (post) => {
    const shareUrl = `${window.location.origin}/community/exchange/${post.id}`
    const shareText = `${post.title} - 来自碳硅共生社区`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: shareUrl
        })
      } catch (err) {
        // 用户取消分享
      }
    } else {
      // 复制链接
      navigator.clipboard.writeText(shareUrl)
      alert('链接已复制到剪贴板')
    }
  }

  const currentLevel = getLevel(userPoints.total)
  const monthlyEarnings = getMonthlyEarnings()

  return (
    <div className="exchange-page">
      {/* 积分动画 */}
      {pointAnimation && (
        <div className="points-animation">
          <div className="points-popup">
            <Coins className="coin-icon" />
            <span className="points-amount">+{pointAnimation.amount}</span>
            <span className="points-reason">{pointAnimation.reason}</span>
          </div>
        </div>
      )}

      <div className="exchange-content">
        {/* AI员工24小时动态栏 */}
        <div className="ai-staff-dynamics-bar">
          <div className="dynamics-header">
            <div className="dynamics-title">
              <span className="dynamics-badge">🤖 AI员工</span>
              <span className="dynamics-subtitle">24小时不间断工作 · 发布AIGC实战教程</span>
            </div>
            <div className="dynamics-stats">
              <span className="stat-pill"><Zap size={12} />{AI_STAFF_STATS.activeStaff}名在线</span>
              <span className="stat-pill"><FileText size={12} />{AI_STAFF_STATS.totalPosts}篇内容</span>
              <span className="stat-pill"><Eye size={12} />{AI_STAFF_STATS.dailyViews}浏览</span>
            </div>
          </div>
          <div className="dynamics-scroll">
            <div className="dynamics-track">
              {/* 复制两份实现无缝滚动 */}
              {[...AI_STAFF_DYNAMICS, ...AI_STAFF_DYNAMICS].map((dyn, idx) => (
                <div key={`${dyn.id}-${idx}`} className="dynamic-item">
                  <span className="dynamic-avatar">{dyn.avatar}</span>
                  <span className="dynamic-name">{dyn.name}</span>
                  <span className="dynamic-action">{dyn.action}</span>
                  <span className="dynamic-title">{dyn.title}</span>
                  <span className="dynamic-time">{dyn.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 有新帖子提示 */}
        {showNewPostToast && latestNewPost && (
          <div className="new-post-toast" onClick={() => {
            setShowNewPostToast(false)
          }}>
            <div className="toast-content">
              <span className="toast-avatar">{latestNewPost.sourceAIAvatar}</span>
              <span className="toast-text">
                <span className="toast-name">{latestNewPost.sourceAIName}</span>
                <span className="toast-action">发布了新教程</span>
              </span>
            </div>
            <span className="toast-title">{latestNewPost.title}</span>
            <div className="toast-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}

        {/* 顶部：用户积分状态 */}
        <div className="user-points-bar" onClick={() => setShowMyStats(!showMyStats)}>
          <div className="points-left">
            <div className="current-level">
              <span className="level-icon">{currentLevel.icon}</span>
              <span className="level-name">{currentLevel.name}</span>
            </div>
            <div className="points-info">
              <Coins className="coins-icon" />
              <span className="points-value">{userPoints.total}</span>
              <span className="points-label">积分</span>
            </div>
          </div>
          <div className="points-right">
            <div className="monthly-earnings">
              <TrendingUp className="trend-icon" />
              <span>本月 +{monthlyEarnings}</span>
            </div>
            <ChevronDown className={`chevron ${showMyStats ? 'up' : ''}`} />
          </div>
        </div>

        {/* 积分详情面板 */}
        {showMyStats && (
          <div className="stats-panel">
            <div className="stats-header">
              <h3>📊 我的创作收益</h3>
              <button className="close-stats" onClick={() => setShowMyStats(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="stats-summary">
              <div className="stat-main">
                <span className="stat-number">{monthlyEarnings}</span>
                <span className="stat-unit">本月积分</span>
              </div>
              <div className="stat-goal">
                <span>距离{LEVEL_CONFIG[currentLevel.level + 1]?.name || '最高级'}还差</span>
                <span className="goal-points">{getPointsToNextLevel(userPoints.total) || 0}积分</span>
              </div>
            </div>

            <div className="level-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min(100, (userPoints.total / (LEVEL_CONFIG[currentLevel.level + 1]?.minPoints || userPoints.total)) * 100)}%` 
                  }}
                />
              </div>
              <div className="progress-labels">
                <span>{currentLevel.name}</span>
                <span>{LEVEL_CONFIG[currentLevel.level + 1]?.name || '最高'}</span>
              </div>
            </div>

            <div className="stats-details">
              <h4>积分明细</h4>
              <div className="detail-row">
                <span>📝 发布帖子</span>
                <span>+{userPoints.stats.postsCount * POINTS_CONFIG.POST_PUBLISH} ({userPoints.stats.postsCount}篇)</span>
              </div>
              <div className="detail-row">
                <span>👍 获赞奖励</span>
                <span>+{userPoints.stats.likesReceived * POINTS_CONFIG.LIKE_RECEIVED} ({userPoints.stats.likesReceived}赞)</span>
              </div>
              <div className="detail-row">
                <span>💬 评论奖励</span>
                <span>+{userPoints.stats.commentsReceived * POINTS_CONFIG.COMMENT_RECEIVED} ({userPoints.stats.commentsReceived}条)</span>
              </div>
              <div className="detail-row">
                <span>⭐ 收藏奖励</span>
                <span>+{userPoints.stats.collectsReceived * POINTS_CONFIG.COLLECT_RECEIVED} ({userPoints.stats.collectsReceived}次)</span>
              </div>
            </div>

            <div className="stats-tips">
              <Sparkles size={16} />
              <span>多发布优质内容获得更多积分和曝光！</span>
            </div>
          </div>
        )}

        {/* 操作栏 */}
        <div className="operation-bar">
          <div className="sort-tabs">
            {sortOptions.map(option => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  className={`sort-btn ${sortBy === option.id ? 'active' : ''}`}
                  onClick={() => setSortBy(option.id)}
                >
                  <Icon size={16} />
                  <span>{option.name}</span>
                </button>
              )
            })}
          </div>
          
          <button className="post-btn" onClick={() => {
            const user = localStorage.getItem('user')
            if (!user) {
              navigate('/login')
              return
            }
            // 跳转到独立发布页面
            navigate('/community/publish')
          }}>
            <Plus size={18} />
            <span>发布经验</span>
            <span className="post-reward">+{POINTS_CONFIG.POST_PUBLISH}积分</span>
          </button>
        </div>

        {/* 分类筛选栏 */}
        <div className="category-bar">
          <button
            className={`category-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            全部
          </button>
          {POST_CATEGORIES.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              >
                <Icon size={14} />
                <span>{cat.name}</span>
              </button>
            )
          })}
        </div>

        {/* 话题筛选栏 */}
        <div className="topics-bar">
          {TOPICS.map(topic => (
            <button
              key={topic.id}
              className={`topic-tag ${selectedTopics.find(t => t.id === topic.id) ? 'active' : ''}`}
              onClick={() => toggleTopic(topic)}
              style={{ '--topic-color': topic.color }}
            >
              {topic.name}
            </button>
          ))}
          {selectedTopics.length > 0 && (
            <button className="clear-topics" onClick={() => setSelectedTopics([])}>
              清除
            </button>
          )}
        </div>

        {/* 帖子列表 */}
        <div className="posts-list">
          {posts.length === 0 ? (
            <div className="empty-state">
              <Sparkles size={48} />
              <p>暂无相关帖子</p>
              <span>成为第一个分享者吧！</span>
            </div>
          ) : (
            posts.map(post => {
              const estimatedReward = getEstimatedReward(post)
              return (
                <div 
                  key={post.id} 
                  className={`post-card ${post.isAIPost ? 'ai-employee-post' : ''}`}
                  onClick={() => navigate(`/community/exchange/${post.id}`)}
                >
                  {/* 左侧头像 + 等级 */}
                  <div className="post-avatar">
                    {post.isAIPost ? (
                      // AI帖子特殊样式
                      <div className="avatar-circle ai-avatar" title="AI自动抓取">
                        {post.sourceAIAvatar || '🤖'}
                      </div>
                    ) : (
                      // 人类帖子
                      <div className="avatar-circle">{post.authorAvatar}</div>
                    )}
                    {post.authorLevelIcon && (
                      <div className="avatar-level" title={post.authorLevel}>
                        {post.authorLevelIcon}
                      </div>
                    )}
                  </div>

                  {/* 中间内容 */}
                  <div className="post-main">
                    <div className="post-header">
                      <div className="author-info">
                        {post.isAIPost ? (
                          // AI员工帖子显示来源
                          <span className="author-name ai-post-name">
                            {post.sourceAIName || 'AI情报员'}
                            <span className="ai-employee-badge">
                              <span className="ai-employee-icon">🤖</span>
                              <span className="ai-employee-text">AI员工</span>
                              <span className="ai-online-dot"></span>
                            </span>
                          </span>
                        ) : (
                          <>
                            <span className="author-name">{post.authorName}</span>
                            <span className="author-level">{post.authorLevel}</span>
                          </>
                        )}
                      </div>
                      <span className="post-time">
                        {post.isAIPost 
                          ? <span className="ai-time"><Zap size={12} />{formatTimeAgo(post.capturedAt)} · {post.source || '全网'}</span>
                          : formatTimeAgo(post.createdAt)
                        }
                      </span>
                    </div>
                    
                    <h3 className="post-title">
                      {post.isHot && <Flame className="hot-icon" />}
                      {post.isEssence && <Star className="essence-icon" />}
                      {post.isAIPost && <span className="ai-tutorial-badge"><Sparkles size={14} />AIGC教程</span>}
                      {post.title}
                    </h3>
                    
                    <p className="post-content">
                      {post.content.length > 150 ? post.content.slice(0, 150) + '...' : post.content}
                    </p>
                    
                    {/* 图片/视频 */}
                    {post.images?.length > 0 && (
                      <div className={`post-images ${post.images.length === 1 ? 'single' : ''}`}>
                        {post.images.slice(0, 4).map((img, idx) => (
                          <div key={idx} className="post-image">
                            <img src={img} alt="" loading="lazy" />
                            {idx === 3 && post.images.length > 4 && (
                              <div className="more-images">+{post.images.length - 4}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* 视频 */}
                    {post.videoUrl && (
                      <div className="post-video">
                        <video src={post.videoUrl} controls />
                        <div className="video-overlay">
                          <Video size={32} />
                        </div>
                      </div>
                    )}
                    
                    {/* 话题标签 */}
                    <div className="post-topics">
                      {post.topics.map((topic, idx) => (
                        <span key={idx} className="post-topic">{topic}</span>
                      ))}
                    </div>
                    
                    {/* 底部互动 + 奖励 */}
                    <div className="post-bottom">
                      <div className="post-stats" onClick={(e) => e.stopPropagation()}>
                        <div 
                          className={`stat-item like ${post.isLiked ? 'liked' : ''}`}
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart 
                            size={16} 
                            fill={post.isLiked ? '#ef4444' : 'none'}
                          />
                          <span>{post.likes}</span>
                        </div>
                        <div className="stat-item">
                          <MessageCircle size={16} />
                          <span>{post.comments}</span>
                        </div>
                        <div 
                          className={`stat-item collect ${post.isCollected ? 'collected' : ''}`}
                          onClick={() => handleCollect(post.id)}
                        >
                          <Bookmark 
                            size={16} 
                            fill={post.isCollected ? '#eab308' : 'none'}
                          />
                          <span>{post.collects}</span>
                        </div>
                        <div className="stat-item share" onClick={() => handleShare(post)}>
                          <Share2 size={16} />
                        </div>
                      </div>

                      {/* 奖励预估 */}
                      <div className="reward-estimate">
                        <Coins size={12} />
                        <span>预计 +{estimatedReward}</span>
                      </div>
                    </div>
                  </div>

                  {/* 右侧热门/精选标签 */}
                  <div className="post-right">
                    {/* 热门/精选标签 */}
                    {post.isHot && (
                      <div className="badge hot-badge">
                        <Flame size={12} />
                        <span>热门</span>
                      </div>
                    )}
                    {post.isEssence && (
                      <div className="badge essence-badge">
                        <Star size={12} />
                        <span>精选</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* 发帖弹窗 */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="post-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FileText size={20} />
                发布实战经验
              </h3>
              <button className="close-btn" onClick={() => setShowPostModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {/* 标题 */}
              <div className="form-item">
                <label>
                  <FileText size={14} />
                  标题
                </label>
                <input
                  type="text"
                  placeholder="分享你最近的AI创作经验（必填，不超过100字）"
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value.slice(0, 100))}
                  maxLength={100}
                />
                <span className="char-count">{postTitle.length}/100</span>
              </div>
              
              {/* 分类 */}
              <div className="form-item">
                <label>
                  <Tag size={14} />
                  分类
                </label>
                <div className="category-selector">
                  {POST_CATEGORIES.map(cat => {
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.id}
                        className={`cat-btn ${postCategory === cat.id ? 'selected' : ''}`}
                        onClick={() => setPostCategory(postCategory === cat.id ? '' : cat.id)}
                      >
                        <Icon size={14} />
                        <span>{cat.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {/* 富文本编辑器 */}
              <div className="form-item">
                <label>
                  <FileText size={14} />
                  正文
                </label>
                <div className="editor-toolbar">
                  <button type="button" title="加粗"><Bold size={16} /></button>
                  <button type="button" title="斜体"><Italic size={16} /></button>
                  <button type="button" title="链接"><Link size={16} /></button>
                  <button type="button" title="图片" onClick={() => document.getElementById('cover-upload').click()}>
                    <ImageIcon size={16} />
                  </button>
                  <button type="button" title="视频" onClick={() => setShowVideoInput(true)}>
                    <Video size={16} /></button>
                  <button type="button" title="代码"><Code size={16} /></button>
                </div>
                <textarea
                  placeholder={`📝 分享你的创作经验...\n\n例如：\n• 使用的工具和提示词\n• 遇到的问题和解决方案\n• 效果对比和心得总结\n\n格式越清晰，获得的阅读和点赞越多！`}
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  rows={10}
                />
                <span className="char-count">{postContent.length}字</span>
              </div>
              
              {/* 已上传图片预览 */}
              {postImages.length > 0 && (
                <div className="uploaded-images">
                  <label>已上传图片 ({postImages.length}/9)</label>
                  <div className="images-preview">
                    {postImages.map((img, idx) => (
                      <div key={idx} className="preview-item">
                        <img src={img.url} alt="" />
                        <button className="remove-btn" onClick={() => removeImage(idx)}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 上传图片 */}
              <div className="form-item">
                <label>
                  <ImageIcon size={14} />
                  添加图片
                  <span className="upload-hint">（最多9张）</span>
                </label>
                <div className="image-upload-area">
                  <input
                    type="file"
                    id="cover-upload"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="upload-btn"
                    onClick={() => document.getElementById('cover-upload').click()}
                    disabled={postImages.length >= 9}
                  >
                    <Camera size={24} />
                    <span>点击上传图片</span>
                  </button>
                </div>
              </div>
              
              {/* 视频链接 */}
              <div className="form-item">
                <label>
                  <Video size={14} />
                  视频链接
                  <span className="upload-hint">（可选）</span>
                </label>
                <input
                  type="url"
                  placeholder="粘贴视频URL（如B站、腾讯视频等）"
                  value={postVideoUrl}
                  onChange={e => setPostVideoUrl(e.target.value)}
                />
              </div>
              
              {/* 话题标签 */}
              <div className="form-item">
                <label>
                  <Tag size={14} />
                  话题标签（最多选3个）
                </label>
                <div className="topic-selector">
                  {TOPICS.map(topic => (
                    <button
                      key={topic.id}
                      className={`topic-btn ${postTopics.find(t => t.id === topic.id) ? 'selected' : ''} ${postTopics.length >= 3 && !postTopics.find(t => t.id === topic.id) ? 'disabled' : ''}`}
                      onClick={() => {
                        if (postTopics.find(t => t.id === topic.id)) {
                          setPostTopics(prev => prev.filter(t => t.id !== topic.id))
                        } else if (postTopics.length < 3) {
                          setPostTopics(prev => [...prev, topic])
                        }
                      }}
                      style={{ '--topic-color': topic.color }}
                    >
                      {topic.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 激励提示 */}
            <div className="reward-tips">
              <Sparkles size={16} />
              <span>发布奖励：+{POINTS_CONFIG.POST_PUBLISH}积分 | 每赞+{POINTS_CONFIG.LIKE_RECEIVED}积分 | 每评论+{POINTS_CONFIG.COMMENT_RECEIVED}积分</span>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowPostModal(false)}>
                取消
              </button>
              <button className="submit-btn" onClick={handleSubmitPost}>
                <Send size={16} />
                发布经验
                <span className="submit-reward">+{POINTS_CONFIG.POST_PUBLISH}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
