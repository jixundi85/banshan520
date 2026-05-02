import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { SAMPLE_REWARDS, getCountdown } from './rewardData'
import './RewardDetailPage.css'

const RewardDetailPage = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [reward, setReward] = useState(null)
  const [showRules, setShowRules] = useState(false)
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipAmount, setTipAmount] = useState(10)
  const [comments, setComments] = useState([])
  const [stories, setStories] = useState([])
  const [submitContent, setSubmitContent] = useState('')
  const [submitImages, setSubmitImages] = useState([])
  const [submitVideo, setSubmitVideo] = useState('')
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))

  // 每次进入页面时重置状态并加载数据
  useEffect(() => {
    const found = SAMPLE_REWARDS.find(r => r.id === id)
    if (found) {
      setReward(found)
      setComments([
        { id: 1, user: '星空漫步者', avatar: '#8b5cf6', content: '这个任务很有意思，我已经提交了作品！', likes: 128, time: '2小时前', images: [], video: '' },
        { id: 2, user: 'AI助手', avatar: '#06b6d4', content: '感谢大家的参与！AI会认真阅读每一份投稿。', likes: 89, time: '3小时前', isAI: true, images: [], video: '' },
        { id: 3, user: '月光森林', avatar: '#10b981', content: '已经参加了，推荐给身边的朋友一起参与', likes: 56, time: '5小时前', images: [], video: '' },
      ])
      setStories([
        { id: 1, author: '匿名用户', content: '最大的遗憾是没能见到爷爷最后一面。那天我在准备考试，接到电话时整个人都懵了。', votes: 2856 },
        { id: 2, author: '心语者', content: '我后悔没有勇气说出那句"我喜欢你"。十年了，她现在已经有了幸福的家庭。', votes: 2341 },
        { id: 3, author: '夜行者', content: '选择了安稳的工作，放弃了梦想中的创业机会。有时候在想，如果当初勇敢一点...', votes: 1923 },
        { id: 4, author: '阳光女孩', content: '后悔没有好好珍惜大学时光。那时候觉得时间很多，现在才发现那是最美好的四年。', votes: 1654 },
      ])
    }
    // 如果 URL 有 action=join 参数，自动展开规则
    const action = searchParams.get('action')
    if (action === 'join') {
      setShowRules(true)
    } else {
      setShowRules(false)
    }
    setSubmitContent('')
    setSubmitImages([])
    setSubmitVideo('')
  }, [id, searchParams])

  const handleSubmit = () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!submitContent.trim()) return
    const newC = {
      id: Date.now(),
      user: user.username || '匿名用户',
      avatar: '#8b5cf6',
      content: submitContent,
      likes: 0,
      time: '刚刚',
      images: submitImages,
      video: submitVideo
    }
    setComments([newC, ...comments])
    setSubmitContent('')
    setSubmitImages([])
    setSubmitVideo('')
  }

  const handleLikeComment = (commentId) => {
    if (!user) {
      navigate('/login')
      return
    }
    setComments(comments.map(c =>
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    ))
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

  // 移除已上传图片
  const removeImage = (index) => {
    setSubmitImages(prev => prev.filter((_, i) => i !== index))
  }

  if (!reward) {
    return (
      <div className="reward-detail-loading">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    )
  }

  const isEnded = reward.status === 'ended'
  const amountInfo = {
    total: reward.bounty,
    original: reward.originalBounty || reward.bounty,
    paidOut: reward.paidOut || 0,
    remaining: reward.remaining || reward.bounty
  }

  return (
    <div className="reward-detail-page">
      {/* 顶部导航 - 面包屑 */}
      <div className="detail-nav">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} className="crumb">首页</span>
          <span className="separator">›</span>
          <span onClick={() => navigate('/community?tab=reward')} className="crumb">任务悬赏</span>
          <span className="separator">›</span>
          <span className="crumb current">任务详情</span>
        </div>
        <div className="nav-actions">
          <button className="share-btn" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
            📤 分享
          </button>
        </div>
      </div>

      <div className="detail-layout">
        {/* 左侧主内容 */}
        <div className="detail-main">
          {/* 悬赏金额 */}
          <div className="bounty-section">
            <div className="bounty-amount">
              <span className="currency">¥</span>
              <span className="amount">{amountInfo.total.toFixed(2)}</span>
              <span className="unit">RMB</span>
            </div>
            <div className="bounty-stats">
              <span className="stat-item">💰 {reward.participants.toLocaleString()} 人参与</span>
              <span className={`stat-item ${reward.status}`}>
                {isEnded ? '已结束' : `⏰ ${getCountdown(reward.deadline)}`}
              </span>
            </div>
            <div className="bounty-breakdown">
              <div className="breakdown-item">
                <span className="label">原始</span>
                <span className="value">¥{amountInfo.original.toFixed(2)}</span>
              </div>
              <div className="breakdown-item">
                <span className="label">已发放</span>
                <span className="value paid">¥{amountInfo.paidOut.toFixed(2)}</span>
              </div>
              <div className="breakdown-item">
                <span className="label">当前</span>
                <span className="value">¥{amountInfo.remaining.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 任务信息 */}
          <div className="task-section">
            <div className="task-type-tag">{reward.typeName}</div>
            <h1 className="task-title">{reward.title}</h1>
            <div className="task-desc">
              <p>{reward.description}</p>
            </div>
          </div>

          {/* 参与规则 - 可折叠 */}
          <div className="rules-section">
            <div className="rules-header" onClick={() => setShowRules(!showRules)}>
              <h3 className="section-title">📋 参与规则 {showRules ? '▲' : '▼'}</h3>
            </div>
            
            {/* 折叠内容 */}
            <div className={`rules-content ${showRules ? 'expanded' : ''}`}>
              <ul className="rules-list">
                {reward.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
              <div className="rules-footer">
                <span>📊 {reward.settleName}</span>
                {!isEnded && <span>截止 {new Date(reward.deadline).toLocaleDateString()}</span>}
              </div>

              {/* 参与输入区 */}
              {!isEnded && (
                <div className="join-input-area">
                  {!user ? (
                    <div className="login-prompt" onClick={() => navigate('/login')}>
                      🔒 请先登录后参与
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={submitContent}
                        onChange={(e) => setSubmitContent(e.target.value)}
                        placeholder="写下你的参与内容... 支持文字、图片、视频"
                        rows={5}
                      />
                      {/* 图片预览 */}
                      {submitImages.length > 0 && (
                        <div className="image-preview-list">
                          {submitImages.map((img, idx) => (
                            <div key={idx} className="image-preview-item">
                              <img src={img} alt="" />
                              <button className="remove-image-btn" onClick={() => removeImage(idx)}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* 视频链接 */}
                      {submitVideo && (
                        <div className="video-preview">
                          <span>🎬 视频链接: {submitVideo}</span>
                          <button onClick={() => setSubmitVideo('')}>×</button>
                        </div>
                      )}
                      {/* 操作按钮 */}
                      <div className="join-actions">
                        <div className="media-btns">
                          <label className="media-btn" htmlFor="join-image-upload">
                            📷 图片
                          </label>
                          <input
                            type="file"
                            id="join-image-upload"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                          />
                          <button className="media-btn" onClick={() => {
                            const url = prompt('请输入视频链接:')
                            if (url) setSubmitVideo(url)
                          }}>
                            🎬 视频
                          </button>
                        </div>
                        <button 
                          className="submit-btn"
                          onClick={handleSubmit}
                          disabled={!submitContent.trim()}
                        >
                          🚀 提交
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 已结束 - 结算结果 */}
          {isEnded && reward.winners && (
            <div className="result-section">
              <h3 className="section-title">🏆 获奖名单</h3>
              {reward.settleInfo && <p className="settle-info">{reward.settleInfo}</p>}
              <div className="winners-table">
                {reward.winners.map((winner, idx) => (
                  <div key={idx} className={`winner-row ${idx < 3 ? 'top' : ''}`}>
                    <span className="rank">{idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</span>
                    <span className="name">{winner.name}</span>
                    <span className="votes">👍 {winner.votes.toLocaleString()}</span>
                    <span className="bonus">¥{winner.bonus.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {reward.cheatedCount > 0 && (
                <p className="anti-cheat">🤖 已去除 {reward.cheatedCount} 人作弊数据</p>
              )}
            </div>
          )}

          {/* 评论列表 - 所有人都能看到 */}
          <div className="all-comments-section">
            <h3 className="section-title">💬 全部参与 ({comments.length})</h3>
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar" style={{ background: comment.avatar }}>
                    {comment.user[0]}
                  </div>
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="user">{comment.user}</span>
                      {comment.isAI && <span className="ai-badge">AI</span>}
                      <span className="time">{comment.time}</span>
                    </div>
                    <p className="content">{comment.content}</p>
                    {/* 图片 */}
                    {comment.images && comment.images.length > 0 && (
                      <div className="comment-images">
                        {comment.images.map((img, idx) => (
                          <img key={idx} src={img} alt="" className="comment-img" />
                        ))}
                      </div>
                    )}
                    {/* 视频 */}
                    {comment.video && (
                      <div className="comment-video">
                        🎬 <a href={comment.video} target="_blank" rel="noopener noreferrer">{comment.video}</a>
                      </div>
                    )}
                    <div className="comment-footer">
                      <button className="like-btn" onClick={() => handleLikeComment(comment.id)}>
                        👍 {comment.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧侧边栏 */}
        <div className="detail-sidebar">
          {/* 任务状态卡片 */}
          <div className="sidebar-card">
            <h4>任务状态</h4>
            <div className="status-display">
              <span className={`status-badge ${reward.status}`}>
                {isEnded ? '已结束' : '进行中'}
              </span>
              {!isEnded && (
                <span className="countdown">{getCountdown(reward.deadline)}</span>
              )}
            </div>
          </div>

          {/* 打赏卡片 */}
          <div className="sidebar-card tip-card">
            <h4>💝 支持创作者</h4>
            <p className="tip-desc">打赏鼓励优质内容</p>
            <div className="tip-options">
              {[1, 5, 10, 50].map(amount => (
                <button
                  key={amount}
                  className={`tip-btn-small ${tipAmount === amount ? 'active' : ''}`}
                  onClick={() => setTipAmount(amount)}
                >
                  {amount}
                </button>
              ))}
            </div>
            <button className="tip-action" onClick={() => setShowTipModal(true)}>
              打赏 {tipAmount} Nothing
            </button>
            <p className="tip-hint">分享链接可获得 Nothing</p>
          </div>

          {/* 更多任务 */}
          <div className="sidebar-card">
            <h4>更多悬赏</h4>
            <div className="more-rewards">
              {SAMPLE_REWARDS.filter(r => r.id !== id && r.status === 'active').slice(0, 3).map(r => (
                <div key={r.id} className="reward-mini" onClick={() => navigate(`/reward/${r.id}`)}>
                  <span className="mini-title">{r.title}</span>
                  <span className="mini-bounty">¥{r.bounty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 打赏弹窗 */}
      {showTipModal && (
        <div className="modal-overlay" onClick={() => setShowTipModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>确认打赏</h3>
            <p>打赏 <strong>{tipAmount} Nothing</strong> 给创作者</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowTipModal(false)}>取消</button>
              <button className="btn-primary" onClick={() => {
                alert(`打赏 ${tipAmount} Nothing 成功！`)
                setShowTipModal(false)
              }}>确认</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RewardDetailPage
