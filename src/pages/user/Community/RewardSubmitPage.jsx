import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SAMPLE_REWARDS } from './rewardData'
import './RewardDetailPage.css'

const RewardSubmitPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reward, setReward] = useState(null)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))

  useEffect(() => {
    const found = SAMPLE_REWARDS.find(r => r.id === id)
    if (found) {
      setReward(found)
    }
  }, [id])

  const handleSubmit = () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!content.trim()) {
      alert('请填写参与内容')
      return
    }
    if (content.length < 50) {
      alert('内容至少需要50个字')
      return
    }

    setSubmitting(true)
    
    // 模拟提交
    setTimeout(() => {
      alert('提交成功！等待结算...')
      navigate(`/reward/${id}`)
    }, 1000)
  }

  if (!reward) {
    return (
      <div className="reward-detail-loading">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <div className="reward-detail-page">
      {/* 顶部导航 */}
      <div className="detail-nav">
        <div className="nav-left">
          <button className="back-btn" onClick={() => navigate(`/reward/${id}`)}>
            ← 返回详情
          </button>
        </div>
        <div className="nav-right">
          <span className="nav-title">参与任务</span>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          {/* 任务信息 */}
          <div className="task-section">
            <div className="task-type-tag">{reward.typeName}</div>
            <h1 className="task-title">{reward.title}</h1>
            <div className="task-desc">
              <p>{reward.description}</p>
            </div>
          </div>

          {/* 参与表单 */}
          <div className="rules-section">
            <h3 className="section-title">📝 提交你的回答</h3>
            <div className="submit-form">
              {!user ? (
                <div className="login-prompt" onClick={() => navigate('/login')}>
                  🔒 请先登录后参与
                </div>
              ) : (
                <>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="在这里写下你的回答..."
                    rows={10}
                  />
                  <div className="form-footer">
                    <span className="char-count">{content.length} 字</span>
                    <button 
                      className="submit-btn"
                      onClick={handleSubmit}
                      disabled={submitting || content.length < 50}
                    >
                      {submitting ? '提交中...' : '🚀 提交'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 右侧 */}
        <div className="detail-sidebar">
          {/* 悬赏卡片 */}
          <div className="sidebar-card">
            <h4>悬赏金额</h4>
            <div className="bounty-mini">
              <span className="currency">¥</span>
              <span className="amount">{reward.bounty.toFixed(2)}</span>
            </div>
            <p className="bounty-hint">按点赞比例分配给所有参与者</p>
          </div>

          {/* 规则卡片 */}
          <div className="sidebar-card">
            <h4>📋 规则提醒</h4>
            <ul className="rules-mini">
              {reward.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RewardSubmitPage
