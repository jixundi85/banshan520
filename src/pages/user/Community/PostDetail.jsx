/**
 * 帖子详情页 - 增强版
 * 支持图文视频评论、分享、互动
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Clock, Heart, MessageCircle, Bookmark, Share2, Eye, 
  ArrowLeft, Send, Reply, MoreHorizontal, Sparkles, Coins,
  Flame, Star, ThumbsUp, ChevronLeft, Image as ImageIcon, 
  Video, X, ZoomIn, Bold, Italic, Link, Code
} from 'lucide-react'
import { SAMPLE_POSTS, getPostComments, formatTimeAgo, getAllPosts } from '../../../data/communitySchema'
import './PostDetail.css'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [commentImages, setCommentImages] = useState([])
  const [commentVideoUrl, setCommentVideoUrl] = useState('')
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showVideoInput, setShowVideoInput] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [replyImages, setReplyImages] = useState([])
  const [replyVideoUrl, setReplyVideoUrl] = useState('')
  const [showReplyImageUpload, setShowReplyImageUpload] = useState(false)
  const [showReplyVideoInput, setShowReplyVideoInput] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [commentLikes, setCommentLikes] = useState({})
  const [showShareMenu, setShowShareMenu] = useState(false)
  
  useEffect(() => {
    // 查找帖子（支持AI帖子和人类帖子）
    const allPosts = getAllPosts()
    const foundPost = allPosts.find(p => p.id === id)
    if (foundPost) {
      setPost(foundPost)
      // 获取评论数据
      setComments(getPostComments(id).slice(0, 10))
      // 模拟已有一些评论
      if (getPostComments(id).length === 0) {
        setComments([
          {
            id: 'c1',
            authorName: 'AI学习者',
            authorAvatar: '🤖',
            content: '这个教程太实用了！已收藏 👍',
            likes: 23,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            replies: []
          },
          {
            id: 'c2',
            authorName: '创作者小王',
            authorAvatar: '王',
            content: '终于有人整理这些了，我之前找了好久',
            likes: 15,
            createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            replies: []
          }
        ])
      }
    }
  }, [id])
  
  if (!post) {
    return (
      <div className="post-detail-error">
        <div className="error-content">
          <h2>帖子不存在或已被删除</h2>
          <button onClick={() => navigate('/community')} className="back-btn">
            <ArrowLeft size={18} />
            返回社区
          </button>
        </div>
      </div>
    )
  }
  
  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }))
  }
  
  const handleCollect = () => {
    setPost(prev => ({
      ...prev,
      isCollected: !prev.isCollected,
      collects: prev.isCollected ? prev.collects - 1 : prev.collects + 1
    }))
  }
  
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/community/exchange/${post.id}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `${post.title} - 来自碳硅共生社区`,
          url: shareUrl
        })
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('链接已复制')
    }
  }
  
  const handleSubmitComment = () => {
    if (!newComment.trim() && commentImages.length === 0 && !commentVideoUrl) return
    const comment = {
      id: `comment_${Date.now()}`,
      postId: post.id,
      authorId: 'current_user',
      authorName: '当前用户',
      authorAvatar: '我',
      content: newComment,
      images: commentImages,
      videoUrl: commentVideoUrl,
      likes: 0,
      createdAt: new Date().toISOString(),
      replies: []
    }
    setComments(prev => [comment, ...prev])
    setNewComment('')
    setCommentImages([])
    setCommentVideoUrl('')
    setShowImageUpload(false)
    setShowVideoInput(false)
    alert('评论发布成功！')
  }
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setCommentImages(prev => [...prev, { url: ev.target.result, name: file.name }])
      }
      reader.readAsDataURL(file)
    })
    setShowImageUpload(false)
  }
  
  const handleVideoUpload = (url) => {
    if (url.trim()) {
      setCommentVideoUrl(url)
      setShowVideoInput(false)
    }
  }
  
  const removeCommentImage = (idx) => {
    setCommentImages(prev => prev.filter((_, i) => i !== idx))
  }
  
  const handleReply = (comment) => {
    if (!replyContent.trim() && replyImages.length === 0 && !replyVideoUrl) return
    const reply = {
      id: `reply_${Date.now()}`,
      postId: post.id,
      authorId: 'current_user',
      authorName: '当前用户',
      authorAvatar: '我',
      content: replyContent,
      images: replyImages,
      videoUrl: replyVideoUrl,
      likes: 0,
      createdAt: new Date().toISOString(),
      replyTo: comment.authorName
    }
    setComments(prev => prev.map(c => {
      if (c.id === comment.id) {
        return { ...c, replies: [...(c.replies || []), reply] }
      }
      return c
    }))
    setReplyTo(null)
    setReplyContent('')
    setReplyImages([])
    setReplyVideoUrl('')
    setShowReplyImageUpload(false)
    setShowReplyVideoInput(false)
  }
  
  const handleCommentLike = (commentId) => {
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }
  
  const handleShareTo = (platform) => {
    const shareUrl = `${window.location.origin}/community/exchange/${post.id}`
    const shareText = `${post.title} - 来自碳硅共生社区`
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl)
      alert('链接已复制')
    } else if (platform === 'wechat') {
      // 模拟微信分享
      alert('请截图分享到微信群')
    }
    setShowShareMenu(false)
  }
  
  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        {/* 返回按钮 */}
        <button className="back-button" onClick={() => navigate('/community')}>
          <ChevronLeft size={20} />
          返回社区
        </button>
        
        {/* 帖子内容 */}
        <article className="post-detail-article">
          {/* 头部信息 */}
          <div className="article-header">
            <div className="author-row">
              <div className="author-avatar-large">
                {post.authorAvatar}
                {post.authorLevelIcon && (
                  <span className="level-badge">{post.authorLevelIcon}</span>
                )}
              </div>
              <div className="author-info">
                <div className="author-name-row">
                  <span className="author-name">{post.authorName}</span>
                  <span className="author-level">{post.authorLevel}</span>
                </div>
                <div className="author-stats">
                  <span>发帖 {post.authorPostCount}</span>
                  <span>粉丝 {post.authorFollowers}</span>
                </div>
              </div>
              <button className="follow-btn">+ 关注</button>
            </div>
          </div>
          
          {/* 标题 */}
          <h1 className="article-title">
            {post.isHot && <Flame className="title-icon hot" />}
            {post.isEssence && <Star className="title-icon essence" />}
            {post.title}
          </h1>
          
          {/* 标签 */}
          <div className="article-tags">
            {post.topics.map((topic, idx) => (
              <span key={idx} className="topic-tag">{topic}</span>
            ))}
          </div>
          
          {/* 正文 */}
          <div className="article-content">
            {post.content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          
          {/* 图片 */}
          {post.images?.length > 0 && (
            <div className={`article-images ${post.images.length === 1 ? 'single' : ''}`}>
              {post.images.map((img, idx) => (
                <div key={idx} className="article-image">
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          )}
          
          {/* 视频 */}
          {post.videoUrl && (
            <div className="article-video">
              <video src={post.videoUrl} controls />
            </div>
          )}
          
          {/* 底部信息 */}
          <div className="article-footer">
            <div className="article-meta">
              {post.isAIPost ? (
                <span className="ai-source"><Sparkles size={14} /> {formatTimeAgo(post.capturedAt)} · {post.source || '全网'}</span>
              ) : (
                <span><Clock size={14} /> {formatTimeAgo(post.createdAt)}</span>
              )}
              <span><Eye size={14} /> {post.views} 阅读</span>
            </div>
            
            <div className="article-actions">
              <button className={`action-btn ${post.isLiked ? 'liked' : ''}`} onClick={handleLike}>
                <Heart size={18} fill={post.isLiked ? '#ef4444' : 'none'} />
                <span>{post.likes}</span>
              </button>
              <button className={`action-btn ${post.isCollected ? 'collected' : ''}`} onClick={handleCollect}>
                <Bookmark size={18} fill={post.isCollected ? '#eab308' : 'none'} />
                <span>{post.collects}</span>
              </button>
              <div className="share-wrapper">
                <button className="action-btn" onClick={() => setShowShareMenu(!showShareMenu)}>
                  <Share2 size={18} />
                  <span>分享</span>
                </button>
                {showShareMenu && (
                  <div className="share-menu">
                    <button onClick={() => handleShareTo('copy')}>复制链接</button>
                    <button onClick={() => handleShareTo('wechat')}>分享到微信</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 奖励信息 */}
          <div className="reward-info">
            <Coins size={16} />
            <span>预计获得 +{post.likes * 2 + post.comments * 1 + post.collects * 3} 积分</span>
          </div>
        </article>
        
        {/* 评论区 */}
        <section className="comments-section">
          <h3 className="comments-title">
            <MessageCircle size={20} />
            评论 ({comments.length})
          </h3>
          
          {/* 发表评论 */}
          <div className="comment-input-area">
            <textarea
              placeholder="写下你的评论，支持图文视频分享..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              rows={4}
            />
            
            {/* 已上传图片预览 */}
            {commentImages.length > 0 && (
              <div className="uploaded-images-preview">
                {commentImages.map((img, idx) => (
                  <div key={idx} className="uploaded-image-item">
                    <img src={img.url} alt="" />
                    <button className="remove-image-btn" onClick={() => removeCommentImage(idx)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* 视频预览 */}
            {commentVideoUrl && (
              <div className="uploaded-video-preview">
                <video src={commentVideoUrl} controls />
                <button className="remove-video-btn" onClick={() => setCommentVideoUrl('')}>
                  <X size={16} />
                </button>
              </div>
            )}
            
            {/* 工具栏 */}
            <div className="comment-toolbar">
              <div className="toolbar-left">
                <button className="tool-btn" onClick={() => setShowImageUpload(!showImageUpload)} title="添加图片">
                  <ImageIcon size={18} />
                </button>
                <button className="tool-btn" onClick={() => setShowVideoInput(!showVideoInput)} title="添加视频">
                  <Video size={18} />
                </button>
                <span className="char-count">{newComment.length}/500</span>
              </div>
              <button className="submit-comment-btn" onClick={handleSubmitComment}>
                <Send size={16} />
                发布评论
              </button>
            </div>
            
            {/* 图片上传选项 */}
            {showImageUpload && (
              <div className="upload-options">
                <label className="upload-option">
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                  <ImageIcon size={20} />
                  <span>上传图片</span>
                </label>
                <input 
                  type="text" 
                  placeholder="或输入图片URL" 
                  className="image-url-input"
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      setCommentImages(prev => [...prev, { url: e.target.value, name: 'url_image' }])
                      e.target.value = ''
                    }
                  }}
                />
              </div>
            )}
            
            {/* 视频URL输入 */}
            {showVideoInput && (
              <div className="video-url-input">
                <input 
                  type="text" 
                  placeholder="输入视频链接"
                  onBlur={(e) => handleVideoUpload(e.target.value)}
                />
              </div>
            )}
          </div>
          
          {/* 评论列表 */}
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">{comment.authorAvatar}</div>
                <div className="comment-body">
                  <div className="comment-header">
                    <span className="comment-author">{comment.authorName}</span>
                    <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                  
                  {/* 评论图片 */}
                  {comment.images?.length > 0 && (
                    <div className="comment-images">
                      {comment.images.map((img, idx) => (
                        <div key={idx} className="comment-image" onClick={() => setLightboxImage(img.url)}>
                          <img src={img.url} alt="" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 评论视频 */}
                  {comment.videoUrl && (
                    <div className="comment-video">
                      <video src={comment.videoUrl} controls />
                    </div>
                  )}
                  
                  <div className="comment-actions">
                    <button 
                      className={`comment-action ${commentLikes[comment.id] ? 'liked' : ''}`}
                      onClick={() => handleCommentLike(comment.id)}
                    >
                      <ThumbsUp size={14} fill={commentLikes[comment.id] ? '#ef4444' : 'none'} /> 
                      {comment.likes + (commentLikes[comment.id] ? 1 : 0)}
                    </button>
                    <button 
                      className="comment-action"
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    >
                      <Reply size={14} /> 回复
                    </button>
                  </div>
                  
                  {/* 回复输入 */}
                  {replyTo === comment.id && (
                    <div className="reply-input-area">
                      <textarea
                        placeholder={`回复 @${comment.authorName}...`}
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        rows={2}
                      />
                      
                      {/* 回复工具栏 */}
                      <div className="reply-toolbar">
                        <button className="tool-btn" onClick={() => setShowReplyImageUpload(!showReplyImageUpload)}>
                          <ImageIcon size={16} />
                        </button>
                        <button className="tool-btn" onClick={() => setShowReplyVideoInput(!showReplyVideoInput)}>
                          <Video size={16} />
                        </button>
                        <button className="submit-reply-btn" onClick={() => handleReply(comment)}>
                          <Send size={14} /> 发送
                        </button>
                      </div>
                      
                      {/* 回复图片上传 */}
                      {showReplyImageUpload && (
                        <div className="upload-options compact">
                          <label className="upload-option">
                            <input type="file" accept="image/*" onChange={(e) => {
                              const file = e.target.files[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onload = (ev) => {
                                  setReplyImages(prev => [...prev, { url: ev.target.result }])
                                }
                                reader.readAsDataURL(file)
                              }
                            }} />
                            <ImageIcon size={16} />
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 回复列表 */}
                  {comment.replies?.length > 0 && (
                    <div className="replies-list">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="reply-item">
                          <div className="reply-header">
                            <span className="reply-avatar">{reply.authorAvatar}</span>
                            <span className="reply-author">{reply.authorName}</span>
                            {reply.replyTo && <span className="reply-to">@{reply.replyTo}</span>}
                          </div>
                          <p className="reply-content">{reply.content}</p>
                          
                          {/* 回复图片 */}
                          {reply.images?.length > 0 && (
                            <div className="comment-images small">
                              {reply.images.map((img, idx) => (
                                <div key={idx} className="comment-image" onClick={() => setLightboxImage(img.url)}>
                                  <img src={img.url} alt="" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {comments.length === 0 && (
              <div className="no-comments">
                <MessageCircle size={32} />
                <p>暂无评论，快来抢沙发！</p>
                <span>分享你的想法，和大家一起交流</span>
              </div>
            )}
          </div>
        </section>
        
        {/* 图片放大镜 */}
        {lightboxImage && (
          <div className="lightbox" onClick={() => setLightboxImage(null)}>
            <img src={lightboxImage} alt="" />
            <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
              <X size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
