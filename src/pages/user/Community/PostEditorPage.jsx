/**
 * 发布经验页面 - 独立页面版
 * 不使用弹窗，直接全屏展示，方便编辑写作
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, Send, Image as ImageIcon, Video, Bold, Italic, Link, Code,
  FileText, Tag, Camera, ArrowLeft, Sparkles, Coins
} from 'lucide-react'
import { TOPICS, getAllPosts } from '../../../data/communitySchema'
import './PostEditorPage.css'

// 分类配置
const POST_CATEGORIES = [
  { id: 'video', name: 'AI视频', icon: Video },
  { id: 'design', name: 'AI设计', icon: ImageIcon },
  { id: 'drama', name: 'AI短剧', icon: FileText },
  { id: 'tool', name: '工具测评', icon: Code },
  { id: 'monetize', name: '变现技巧', icon: Coins },
  { id: 'workflow', name: '工作流', icon: Link },
  { id: 'pitfall', name: '踩坑记录', icon: X },
]

// 积分奖励配置
const POINTS_CONFIG = {
  POST_PUBLISH: 10,
  LIKE_RECEIVED: 2,
  COMMENT_RECEIVED: 1,
  COLLECT_RECEIVED: 3,
  SHARE_RECEIVED: 5,
}

export default function PostEditorPage() {
  const navigate = useNavigate()
  const [postTitle, setPostTitle] = useState('')
  const [postCategory, setPostCategory] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postImages, setPostImages] = useState([])
  const [postVideoUrl, setPostVideoUrl] = useState('')
  const [postTopics, setPostTopics] = useState([])
  const [showVideoInput, setShowVideoInput] = useState(false)

  // 处理图片上传
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (postImages.length + files.length > 9) {
      alert('最多只能上传9张图片')
      return
    }
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPostImages(prev => [...prev, { url: ev.target.result, name: file.name }])
      }
      reader.readAsDataURL(file)
    })
  }

  // 移除图片
  const removeImage = (idx) => {
    setPostImages(prev => prev.filter((_, i) => i !== idx))
  }

  // 提交帖子
  const handleSubmitPost = () => {
    if (!postTitle.trim()) {
      alert('请输入标题')
      return
    }
    if (!postCategory) {
      alert('请选择分类')
      return
    }
    if (!postContent.trim()) {
      alert('请输入正文内容')
      return
    }

    const allPosts = getAllPosts()
    const newPost = {
      id: `post_${Date.now()}`,
      title: postTitle,
      category: postCategory,
      content: postContent,
      images: postImages.map(img => img.url),
      videoUrl: postVideoUrl,
      topics: postTopics.map(t => t.name),
      authorName: '当前用户',
      authorAvatar: '我',
      authorLevel: 'L1 创客新手',
      authorLevelIcon: '🌱',
      authorPostCount: 1,
      authorFollowers: 0,
      likes: 0,
      comments: 0,
      collects: 0,
      views: 0,
      isHot: false,
      isEssence: false,
      isLiked: false,
      isCollected: false,
      createdAt: new Date().toISOString(),
      isAIPost: false
    }

    // 保存到数据层
    const updatedPosts = [newPost, ...allPosts]
    localStorage.setItem('community_posts', JSON.stringify(updatedPosts))
    
    // 更新用户积分
    const userPoints = JSON.parse(localStorage.getItem('user_points') || '{"total":0}')
    userPoints.total += POINTS_CONFIG.POST_PUBLISH
    userPoints.history.push({
      type: 'publish',
      amount: POINTS_CONFIG.POST_PUBLISH,
      description: '发布帖子',
      time: new Date().toISOString()
    })
    userPoints.stats.postsCount = (userPoints.stats.postsCount || 0) + 1
    localStorage.setItem('user_points', JSON.stringify(userPoints))

    alert('发布成功！获得 +' + POINTS_CONFIG.POST_PUBLISH + ' 积分')
    navigate('/community/exchange')
  }

  return (
    <div className="post-editor-page">
      {/* 顶部导航 */}
      <div className="editor-nav">
        <div className="nav-left">
          <button className="back-btn" onClick={() => navigate('/community/exchange')}>
            <ArrowLeft size={20} />
            <span>返回社区</span>
          </button>
        </div>
        <h1 className="nav-title">
          <FileText size={24} />
          发布实战经验
        </h1>
        <div className="nav-right">
          <button className="submit-btn" onClick={handleSubmitPost}>
            <Send size={18} />
            发布经验
            <span className="reward-badge">+{POINTS_CONFIG.POST_PUBLISH}</span>
          </button>
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="editor-container">
        <div className="editor-main">
          {/* 标题输入 */}
          <div className="editor-section title-section">
            <input
              type="text"
              className="title-input"
              placeholder="📝 输入文章标题，简洁有力更吸引人..."
              value={postTitle}
              onChange={e => setPostTitle(e.target.value.slice(0, 100))}
              maxLength={100}
            />
            <span className="title-count">{postTitle.length}/100</span>
          </div>

          {/* 富文本工具栏 */}
          <div className="editor-section toolbar-section">
            <div className="editor-toolbar">
              <button type="button" title="加粗"><Bold size={18} /></button>
              <button type="button" title="斜体"><Italic size={18} /></button>
              <button type="button" title="链接"><Link size={18} /></button>
              <button type="button" title="代码"><Code size={18} /></button>
              <span className="toolbar-divider"></span>
              <button type="button" title="图片" onClick={() => document.getElementById('cover-upload').click()}>
                <ImageIcon size={18} />
              </button>
              <button type="button" title="视频" onClick={() => setShowVideoInput(!showVideoInput)}>
                <Video size={18} />
              </button>
            </div>
          </div>

          {/* 正文编辑器 */}
          <div className="editor-section content-section">
            <textarea
              className="content-textarea"
              placeholder={`📝 开始写作吧...

💡 写作提示：
• 使用工具和提示词分享
• 遇到的问题和解决方案
• 效果对比和心得总结
• 格式清晰更容易获得点赞哦！

支持 Markdown 语法：
**加粗**  *斜体*  [链接](url)  \`代码\``}
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
            />
            <span className="content-count">{postContent.length} 字</span>
          </div>

          {/* 已上传图片预览 */}
          {postImages.length > 0 && (
            <div className="editor-section images-section">
              <h3>已上传图片 ({postImages.length}/9)</h3>
              <div className="images-grid">
                {postImages.map((img, idx) => (
                  <div key={idx} className="image-preview">
                    <img src={img.url} alt="" />
                    <button className="remove-btn" onClick={() => removeImage(idx)}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 视频链接 */}
          {showVideoInput && (
            <div className="editor-section video-section">
              <label>
                <Video size={16} />
                视频链接
              </label>
              <input
                type="url"
                placeholder="粘贴视频URL（如B站、腾讯视频等）"
                value={postVideoUrl}
                onChange={e => setPostVideoUrl(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* 右侧设置面板 */}
        <div className="editor-sidebar">
          {/* 分类选择 */}
          <div className="sidebar-section">
            <h3>
              <Tag size={16} />
              选择分类
            </h3>
            <div className="category-grid">
              {POST_CATEGORIES.map(cat => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    className={`category-btn ${postCategory === cat.id ? 'selected' : ''}`}
                    onClick={() => setPostCategory(postCategory === cat.id ? '' : cat.id)}
                  >
                    <Icon size={16} />
                    <span>{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 添加图片 */}
          <div className="sidebar-section">
            <h3>
              <Camera size={16} />
              添加图片
              <span className="hint">最多9张</span>
            </h3>
            <input
              type="file"
              id="cover-upload"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button 
              className="upload-btn"
              onClick={() => document.getElementById('cover-upload').click()}
              disabled={postImages.length >= 9}
            >
              <Camera size={32} />
              <span>点击上传图片</span>
            </button>
            {postImages.length > 0 && (
              <div className="upload-progress">{postImages.length}/9 已上传</div>
            )}
          </div>

          {/* 话题标签 */}
          <div className="sidebar-section">
            <h3>
              <Tag size={16} />
              话题标签
              <span className="hint">最多选3个</span>
            </h3>
            <div className="topics-grid">
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

          {/* 激励提示 */}
          <div className="sidebar-section reward-section">
            <div className="reward-header">
              <Sparkles size={18} />
              <span>发布激励</span>
            </div>
            <div className="reward-list">
              <div className="reward-item">
                <span>发布帖子</span>
                <span className="reward-value">+{POINTS_CONFIG.POST_PUBLISH}</span>
              </div>
              <div className="reward-item">
                <span>获得点赞</span>
                <span className="reward-value">+{POINTS_CONFIG.LIKE_RECEIVED}/个</span>
              </div>
              <div className="reward-item">
                <span>获得评论</span>
                <span className="reward-value">+{POINTS_CONFIG.COMMENT_RECEIVED}/条</span>
              </div>
              <div className="reward-item">
                <span>被收藏</span>
                <span className="reward-value">+{POINTS_CONFIG.COLLECT_RECEIVED}/次</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
