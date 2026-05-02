/**
 * 悬赏任务模块
 * 模拟真实悬赏场景：AI发布任务，人类完成获取奖励
 * 参考 ai6666.com/tasks/ 功能设计
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Flame, Users, Clock, Trophy, CheckCircle, FileText,
  Image, Video, Palette, Box, Vote, X, Send, Star,
  Bookmark, Share2, Filter, ArrowUpDown, Zap, Crown,
  Medal, ChevronDown, Eye, AlertCircle, RefreshCw,
  ThumbsUp, User, Shield, Gift, DollarSign, Plus,
  ChevronUp, ChevronDown as DownArrow
} from 'lucide-react'
import {
  SAMPLE_REWARDS,
  TASK_TYPES,
  SORT_OPTIONS,
  getCountdown,
  formatBounty,
  getActiveRewards,
  getEndedRewards,
  getHotRewards,
  filterRewards
} from './rewardData'
import './CommunityReward.css'

// ============ 展开式详情区域 ============
function RewardExpandPanel({ reward, onClose, onSubmit, onCollect, isCollected }) {
  const [showSubmitForm, setShowSubmitForm] = useState(reward.showForm || false)
  const [submitData, setSubmitData] = useState({
    title: '',
    content: '',
    files: []
  })
  const [expanded, setExpanded] = useState(true)
  
  if (!reward) return null
  
  const handleSubmit = () => {
    if (!submitData.title.trim() || !submitData.content.trim()) {
      alert('请填写标题和内容')
      return
    }
    onSubmit(reward.id, submitData)
    setShowSubmitForm(false)
  }
  
  return (
    <div className="reward-expand-panel">
      <div className="expand-header" onClick={() => setExpanded(!expanded)}>
        <div className="expand-title">
          <TypeIcon type={reward.type} />
          <span className="task-type">{reward.typeName}</span>
          <h3>{reward.title}</h3>
          {reward.isHot && <span className="hot-badge"><Flame size={12} />爆款</span>}
        </div>
        <div className="expand-actions">
          <button className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <X size={18} />
          </button>
          <button className="toggle-btn">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="expand-content">
          {/* 关键数据 */}
          <div className="detail-stats">
            <div className="stat-item bounty">
              <Flame size={18} />
              <div className="stat-info">
                <span className="stat-value">¥{formatBounty(reward.bounty)}</span>
                <span className="stat-label">奖励金额</span>
              </div>
            </div>
            <div className="stat-item">
              <Users size={18} />
              <div className="stat-info">
                <span className="stat-value">{reward.participants}</span>
                <span className="stat-label">参与人数</span>
              </div>
            </div>
            <div className="stat-item">
              <Clock size={18} />
              <div className="stat-info">
                <span className="stat-value">{getCountdown(reward.deadline)}</span>
                <span className="stat-label">剩余时间</span>
              </div>
            </div>
          </div>
          
          {/* 任务描述 */}
          <div className="detail-section">
            <h4><FileText size={14} /> 任务描述</h4>
            <p className="detail-desc">{reward.description}</p>
          </div>
          
          {/* 参与规则 */}
          <div className="detail-section">
            <h4><AlertCircle size={14} /> 参与规则</h4>
            <ul className="rules-list">
              {reward.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
          
          {/* 结算方式 */}
          <div className="detail-section settle-section">
            <span className="settle-tag"><Vote size={14} /> {reward.settleName}</span>
          </div>
          
          {/* 参与表单 - 默认显示 */}
          <div className="submit-form">
            <div className="form-header">
              <h4>📝 提交你的作品</h4>
              <button className="close-panel-btn" onClick={onClose}>× 关闭</button>
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="作品标题（必填）"
                value={submitData.title}
                onChange={(e) => setSubmitData({ ...submitData, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="详细描述你的作品..."
                rows={6}
                value={submitData.content}
                onChange={(e) => setSubmitData({ ...submitData, content: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={onClose}>取消</button>
              <button className="submit-btn" onClick={handleSubmit}>
                <Send size={14} />
                提交作品
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ 发布任务弹窗 ============
function PublishRewardModal({ onClose, onPublish }) {
  const [taskType, setTaskType] = useState('free') // 'free' | 'paid'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bounty: '',
    type: 'writing',
    deadline: ''
  })
  
  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('请填写任务标题')
      return
    }
    if (!formData.description.trim()) {
      alert('请填写任务描述')
      return
    }
    if (taskType === 'paid' && (!formData.bounty || parseFloat(formData.bounty) <= 0)) {
      alert('请填写有效的奖金金额')
      return
    }
    
    onPublish({
      ...formData,
      bounty: taskType === 'paid' ? parseFloat(formData.bounty) : 0,
      status: 'active',
      participants: 0,
      createdAt: new Date().toISOString()
    })
    onClose()
  }
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="publish-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><Zap size={18} /> 发布任务</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-content">
          {/* 任务类型 */}
          <div className="form-section">
            <label>任务类型</label>
            <div className="type-toggle">
              <button 
                className={`type-btn ${taskType === 'free' ? 'active' : ''}`}
                onClick={() => setTaskType('free')}
              >
                <Gift size={16} />
                免费任务
              </button>
              <button 
                className={`type-btn ${taskType === 'paid' ? 'active' : ''}`}
                onClick={() => setTaskType('paid')}
              >
                <DollarSign size={16} />
                付费任务
              </button>
            </div>
          </div>
          
          {/* 任务标题 */}
          <div className="form-section">
            <label>任务标题</label>
            <input
              type="text"
              placeholder="简明扼要地描述你的任务"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              maxLength={50}
            />
          </div>
          
          {/* 任务描述 */}
          <div className="form-section">
            <label>任务描述</label>
            <textarea
              placeholder="详细描述任务要求、规则、验收标准..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>
          
          {/* 奖金金额 */}
          {taskType === 'paid' && (
            <div className="form-section">
              <label>奖金金额 (RMB)</label>
              <input
                type="number"
                placeholder="输入总奖金金额"
                value={formData.bounty}
                onChange={e => setFormData({ ...formData, bounty: e.target.value })}
                min="1"
                step="0.01"
              />
              <small>奖金将按参与者表现比例分配</small>
            </div>
          )}
          
          {/* 任务分类 */}
          <div className="form-section">
            <label>任务分类</label>
            <div className="category-select">
              {TASK_TYPES.filter(t => t.id !== 'all').map(type => (
                <button
                  key={type.id}
                  className={`category-btn ${formData.type === type.id ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, type: type.id })}
                >
                  {type.icon} {type.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* 截止时间 */}
          <div className="form-section">
            <label>截止时间</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <button className="publish-btn" onClick={handleSubmit}>
            {taskType === 'free' ? '发布免费任务' : `发布付费任务 (¥${formData.bounty || 0})`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ 任务类型图标映射 ============
const TypeIcon = ({ type }) => {
  const icons = {
    writing: <FileText size={14} />,
    voting: <Vote size={14} />,
    design: <Palette size={14} />,
    video: <Video size={14} />,
    other: <Box size={14} />
  }
  return icons[type] || <Box size={14} />
}

// ============ 爆款任务专区 ============
function HotTasksSection({ rewards, onSelect }) {
  const hotRewards = getHotRewards()
  if (hotRewards.length === 0) return null
  
  return (
    <div className="hot-tasks-section">
      <div className="hot-header">
        <Flame className="hot-icon" size={20} />
        <span>任务爆款</span>
        <span className="hot-subtitle">高额悬赏专区</span>
      </div>
      <div className="hot-tasks-grid">
        {hotRewards.slice(0, 3).map(reward => (
          <div
            key={reward.id}
            className="hot-task-card"
            onClick={() => onSelect(reward)}
          >
            <div className="hot-rank">
              {reward.hotRank === 1 && <Crown className="crown-icon" size={16} />}
              TOP {reward.hotRank}
            </div>
            <div className="hot-bounty">
              <Flame size={14} />
              {formatBounty(reward.bounty)} RMB
            </div>
            <h4 className="hot-title">{reward.title}</h4>
            <div className="hot-meta">
              <span><Users size={12} /> {reward.participants}人</span>
              <span><Clock size={12} /> {getCountdown(reward.deadline)}</span>
            </div>
            <button 
              className="hot-join-btn"
              onClick={(e) => {
                e.stopPropagation()
                onSelect({ ...reward, autoJoin: true })
              }}
            >
              立即参与
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============ 筛选排序栏 ============
function FilterBar({ filters, onChange }) {
  return (
    <div className="filter-bar">
      {/* 任务类型筛选 */}
      <div className="filter-group">
        <div className="filter-label">
          <Filter size={14} />
          <span>任务类型</span>
        </div>
        <div className="filter-buttons">
          {TASK_TYPES.map(type => (
            <button
              key={type.id}
              className={`filter-btn ${filters.type === type.id ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, type: type.id })}
            >
              <span>{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 排序方式 */}
      <div className="filter-group">
        <div className="filter-label">
          <ArrowUpDown size={14} />
          <span>排序方式</span>
        </div>
        <div className="filter-buttons">
          {SORT_OPTIONS.map(option => (
            <button
              key={option.id}
              className={`filter-btn ${filters.sort === option.id ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, sort: option.id })}
            >
              <span>{option.icon}</span>
              <span>{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ 任务卡片 ============
function RewardCard({ reward, onSelect, onCollect, isCollected }) {
  const handleJoin = (e) => {
    e.stopPropagation()
    onSelect({ ...reward, showForm: true })
  }
  
  return (
    <div className="reward-card" onClick={() => onSelect(reward)}>
      {/* 卡片头部 */}
      <div className="reward-header">
        <div className="reward-type-badge">
          <TypeIcon type={reward.type} />
          <span>{reward.typeName}</span>
        </div>
        {reward.isHot && (
          <div className="reward-hot-badge">
            <Flame size={12} />
            <span>爆款</span>
          </div>
        )}
      </div>
      
      {/* 任务标题 */}
      <h3 className="reward-title">
        {reward.title}
      </h3>
      
      {/* 任务描述 */}
      <p className="reward-desc">
        {reward.description.length > 80
          ? reward.description.slice(0, 80) + '...'
          : reward.description}
      </p>
      
      {/* 任务信息条 */}
      <div className="reward-info-bar">
        <div className="reward-bounty">
          <Flame className="bounty-icon" size={16} />
          <span className="bounty-amount">¥{formatBounty(reward.bounty)}</span>
        </div>
        <div className="reward-meta">
          <span className="meta-item">
            <Users size={13} />
            {reward.participants}人
          </span>
          <span className="meta-item">
            <Eye size={13} />
            {reward.views}
          </span>
          <span className="meta-item deadline">
            <Clock size={13} />
            {getCountdown(reward.deadline)}
          </span>
        </div>
      </div>
      
      {/* 结算方式 */}
      <div className="reward-settle">
        <span className="settle-label">结算：</span>
        <span className="settle-value">{reward.settleName}</span>
      </div>
      
      {/* 操作按钮 */}
      <div className="reward-actions" onClick={e => e.stopPropagation()}>
        <button
          className={`collect-btn ${isCollected ? 'collected' : ''}`}
          onClick={() => onCollect(reward.id)}
        >
          <Bookmark size={16} fill={isCollected ? 'currentColor' : 'none'} />
          <span>{isCollected ? '已收藏' : '收藏'}</span>
        </button>
        <button
          className="join-btn"
          onClick={handleJoin}
        >
          立即参与
        </button>
      </div>
    </div>
  )
}

// ============ 任务详情弹窗 ============
function RewardDetailModal({ reward, onClose, onSubmit, onCollect, isCollected }) {
  const [showSubmitForm, setShowSubmitForm] = useState(reward.autoJoin || false)
  const [submitData, setSubmitData] = useState({
    title: '',
    content: '',
    files: []
  })
  
  if (!reward) return null
  
  const handleSubmit = () => {
    if (!submitData.title.trim() || !submitData.content.trim()) {
      alert('请填写标题和内容')
      return
    }
    onSubmit(reward.id, submitData)
  }
  
  const handleCollect = () => {
    onCollect(reward.id)
  }
  
  const handleShare = () => {
    const shareData = {
      title: reward.title,
      text: `${reward.bounty}元悬赏任务等你来参与！`,
      url: window.location.origin + '/community'
    }
    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareData.url)
      alert('链接已复制到剪贴板！')
    }
  }
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="reward-detail-modal" onClick={e => e.stopPropagation()}>
        {/* 弹窗头部 */}
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="reward-type-badge large">
              <TypeIcon type={reward.type} />
              <span>{reward.typeName}</span>
            </div>
            {reward.isHot && (
              <div className="reward-hot-badge">
                <Flame size={12} />
                <span>🔥爆款</span>
              </div>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        {/* 弹窗内容 */}
        <div className="modal-content">
          {/* 任务标题 */}
          <h2 className="detail-title">{reward.title}</h2>
          
          {/* 关键数据 */}
          <div className="detail-stats">
            <div className="stat-item bounty">
              <Flame size={20} />
              <div className="stat-info">
                <span className="stat-value">¥{formatBounty(reward.bounty)}</span>
                <span className="stat-label">奖励金额</span>
              </div>
            </div>
            <div className="stat-item">
              <Users size={20} />
              <div className="stat-info">
                <span className="stat-value">{reward.participants}</span>
                <span className="stat-label">参与人数</span>
              </div>
            </div>
            <div className="stat-item">
              <Clock size={20} />
              <div className="stat-info">
                <span className="stat-value">{getCountdown(reward.deadline)}</span>
                <span className="stat-label">剩余时间</span>
              </div>
            </div>
          </div>
          
          {/* 任务描述 */}
          <div className="detail-section">
            <h4><FileText size={16} /> 任务描述</h4>
            <p className="detail-desc">{reward.description}</p>
          </div>
          
          {/* 参与规则 */}
          <div className="detail-section">
            <h4><AlertCircle size={16} /> 参与规则</h4>
            <ul className="rules-list">
              {reward.rules.map((rule, idx) => (
                <li key={idx}>
                  <CheckCircle size={14} />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* 结算方式 */}
          <div className="detail-section">
            <h4><Trophy size={16} /> 结算方式</h4>
            <div className="settle-info">
              <span className="settle-type">{reward.settleName}</span>
              {reward.settleType === 'voting' && (
                <span className="settle-tip">根据投票结果分配奖励</span>
              )}
              {reward.settleType === 'manual' && (
                <span className="settle-tip">由平台评审团人工评选</span>
              )}
              {reward.settleType === 'click' && (
                <span className="settle-tip">根据内容点击量结算</span>
              )}
            </div>
          </div>
          
          {/* 提交表单 */}
          {showSubmitForm ? (
            <div className="submit-form">
              <h4><Send size={16} /> 提交作品</h4>
              <div className="form-item">
                <label>标题</label>
                <input
                  type="text"
                  placeholder="给你的作品起个标题"
                  value={submitData.title}
                  onChange={e => setSubmitData({ ...submitData, title: e.target.value })}
                  maxLength={50}
                />
              </div>
              <div className="form-item">
                <label>内容</label>
                <textarea
                  placeholder="在这里详细描述你的回答或作品..."
                  value={submitData.content}
                  onChange={e => setSubmitData({ ...submitData, content: e.target.value })}
                  rows={6}
                />
              </div>
              <div className="form-actions">
                <button className="cancel-btn" onClick={() => setShowSubmitForm(false)}>
                  返回
                </button>
                <button className="submit-btn" onClick={handleSubmit}>
                  <Send size={16} />
                  提交作品
                </button>
              </div>
            </div>
          ) : (
            <div className="action-buttons">
              <button 
                className={`collect-large-btn ${isCollected ? 'collected' : ''}`}
                onClick={handleCollect}
              >
                <Bookmark size={18} fill={isCollected ? 'currentColor' : 'none'} />
                <span>{isCollected ? '已收藏' : '先收藏'}</span>
              </button>
              <button
                className="join-large-btn"
                onClick={() => setShowSubmitForm(true)}
              >
                立即参与
              </button>
            </div>
          )}
          
          {/* 分享按钮 */}
          <button className="detail-share-btn" onClick={handleShare}>
            <Share2 size={14} />
            <span>分享任务</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ 提交成功弹窗 ============
function SubmitSuccessModal({ reward, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="submit-success-modal" onClick={e => e.stopPropagation()}>
        <div className="success-icon">
          <CheckCircle size={64} />
        </div>
        <h3>提交成功！</h3>
        <p>你的作品已提交，等待审核结果...</p>
        
        <div className="success-info">
          <div className="info-row">
            <span>任务</span>
            <span>{reward?.title}</span>
          </div>
          <div className="info-row">
            <span>奖金</span>
            <span className="bounty-highlight">¥{formatBounty(reward?.bounty || 0)}</span>
          </div>
          <div className="info-row">
            <span>当前排名</span>
            <span>第 {reward?.participants || 0} / {reward?.participants + 100 || 0} 名</span>
          </div>
        </div>
        
        <div className="success-tips">
          <Clock size={14} />
          <span>预计结算时间：任务结束后72小时内</span>
        </div>
        
        <button className="success-btn" onClick={onClose}>
          返回任务列表
        </button>
      </div>
    </div>
  )
}

// ============ 结算详情弹窗 ============
function SettleDetailModal({ reward, onClose }) {
  if (!reward) return null
  
  // 计算总有效点赞数和每票价值
  const totalValidVotes = reward.winners?.reduce((sum, w) => sum + w.votes, 0) || 0
  const valuePerVote = reward.paidOut / totalValidVotes
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settle-detail-modal" onClick={e => e.stopPropagation()}>
        {/* 弹窗头部 */}
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="reward-type-badge large">
              <Trophy size={16} />
              <span>结算详情</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        {/* 弹窗内容 */}
        <div className="modal-content">
          {/* 任务标题 */}
          <h2 className="detail-title">{reward.title}</h2>
          
          {/* 奖金池信息 */}
          <div className="settle-pool-info">
            <div className="pool-item">
              <span className="pool-label">原始奖金</span>
              <span className="pool-value">¥{reward.originalBounty?.toFixed(2) || reward.bounty.toFixed(2)}</span>
            </div>
            <div className="pool-item">
              <span className="pool-label">已发放</span>
              <span className="pool-value paid">¥{reward.paidOut?.toFixed(2)}</span>
            </div>
            <div className="pool-item">
              <span className="pool-label">剩余</span>
              <span className="pool-value remaining">¥{reward.remaining?.toFixed(2)}</span>
            </div>
          </div>
          
          {/* AI反作弊信息 */}
          {reward.cheatedCount > 0 && (
            <div className="anti-cheat-info">
              <Shield size={16} />
              <div className="anti-cheat-text">
                <span className="anti-cheat-title">AI反作弊系统已启动</span>
                <span className="anti-cheat-detail">
                  已去除 {reward.cheatedCount} 人作弊数据（共 {reward.cheatedVotes.toLocaleString()} 个异常点赞）
                </span>
              </div>
            </div>
          )}
          
          {/* 结算说明 */}
          <div className="settle-rule-box">
            <h4><Trophy size={14} /> 结算规则</h4>
            <p>{reward.settleInfo || `按点赞比例分配奖金，每票价值 ¥${valuePerVote.toFixed(4)}`}</p>
          </div>
          
          {/* 获奖名单 */}
          <div className="winners-section">
            <h4><Medal size={14} /> 获奖名单</h4>
            <div className="winners-list">
              {reward.winners?.map((winner, idx) => (
                <div key={idx} className={`winner-row ${idx < 3 ? 'top-winner' : ''}`}>
                  <div className="winner-rank">
                    {idx === 0 && <Crown className="crown" size={16} />}
                    {idx === 1 && <Medal className="silver" size={14} />}
                    {idx === 2 && <Medal className="bronze" size={14} />}
                    {idx > 2 && <span className="rank-num">#{idx + 1}</span>}
                  </div>
                  <div className="winner-info">
                    <span className="winner-name">{winner.name}</span>
                    <span className="winner-votes">
                      <ThumbsUp size={12} />
                      {winner.votes.toLocaleString()} 票
                    </span>
                  </div>
                  <div className="winner-bonus-amount">
                    ¥{winner.bonus.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 底部说明 */}
          <div className="settle-footer">
            <p>获奖者需前往「个人中心」手动提现到微信钱包</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 已结束任务区域 ============
function EndedTasksSection({ rewards }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedReward, setSelectedReward] = useState(null)
  const endedRewards = getEndedRewards()
  
  if (endedRewards.length === 0) return null
  
  return (
    <>
      <div className="ended-section">
        <button
          className="ended-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="toggle-left">
            <Trophy size={16} className="ended-icon" />
            <span>已结束的悬赏 ({endedRewards.length})</span>
          </div>
          <ChevronDown className={`toggle-arrow ${isExpanded ? 'expanded' : ''}`} size={18} />
        </button>
        
        {isExpanded && (
          <div className="ended-list">
            {endedRewards.map(reward => (
              <div key={reward.id} className="ended-card">
                <div className="ended-info">
                  <h4>{reward.title}</h4>
                  <div className="ended-meta">
                    <span>¥{formatBounty(reward.bounty)}</span>
                    <span>{reward.participants}人参与</span>
                    <span className="status-ended">已结算</span>
                  </div>
                </div>
                <div className="ended-actions">
                  <button 
                    className="view-detail-btn"
                    onClick={() => setSelectedReward(reward)}
                  >
                    <Eye size={14} />
                    查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 结算详情弹窗 */}
      {selectedReward && (
        <SettleDetailModal 
          reward={selectedReward} 
          onClose={() => setSelectedReward(null)} 
        />
      )}
    </>
  )
}

// ============ 主组件 ============
export default function CommunityReward() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    type: 'all',
    sort: 'bounty_desc',
    status: 'active'
  })
  const [selectedReward, setSelectedReward] = useState(null)
  const [submittedReward, setSubmittedReward] = useState(null)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [collected, setCollected] = useState(() => {
    const saved = localStorage.getItem('reward_collected')
    return saved ? JSON.parse(saved) : []
  })
  const [countdowns, setCountdowns] = useState({})
  
  // 筛选后的任务列表
  const filteredRewards = filterRewards(getActiveRewards(), filters)
  
  // 倒计时更新
  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns = {}
      SAMPLE_REWARDS.forEach(r => {
        newCountdowns[r.id] = getCountdown(r.deadline)
      })
      setCountdowns(newCountdowns)
    }
    
    updateCountdowns()
    const interval = setInterval(updateCountdowns, 1000)
    return () => clearInterval(interval)
  }, [])
  
  // 收藏任务
  const handleCollect = (rewardId) => {
    const newCollected = collected.includes(rewardId)
      ? collected.filter(id => id !== rewardId)
      : [...collected, rewardId]
    setCollected(newCollected)
    localStorage.setItem('reward_collected', JSON.stringify(newCollected))
  }
  
  // 提交作品
  const handleSubmit = (rewardId, data) => {
    // 保存提交记录
    const submissions = JSON.parse(localStorage.getItem('reward_submissions') || '[]')
    submissions.push({
      rewardId,
      ...data,
      submittedAt: new Date().toISOString()
    })
    localStorage.setItem('reward_submissions', JSON.stringify(submissions))
    
    setSubmittedReward(selectedReward)
    setSelectedReward(null)
  }
  
  // 发布任务
  const handlePublish = (newReward) => {
    const rewardData = JSON.parse(localStorage.getItem('published_rewards') || '[]')
    const reward = {
      ...newReward,
      id: 'r' + Date.now(),
      typeName: TASK_TYPES.find(t => t.id === newReward.type)?.name || '其他',
      settleType: newReward.bounty > 0 ? 'voting' : 'manual',
      settleName: newReward.bounty > 0 ? '投票加权结算' : '人工评审',
      rules: [
        '原创内容，符合主题',
        '积极正面，符合社区规范',
        '禁止抄袭、重复提交'
      ],
      isHot: newReward.bounty >= 200,
      views: 0,
      deadline: newReward.deadline ? newReward.deadline + 'T23:59:59' : new Date(Date.now() + 7 * 86400000).toISOString()
    }
    rewardData.push(reward)
    localStorage.setItem('published_rewards', JSON.stringify(rewardData))
    alert('任务发布成功！')
    window.location.reload()
  }
  
  return (
    <div className="reward-page">
      {/* 页面标题 */}
      <div className="reward-page-header">
        <div className="header-title">
          <Zap size={24} className="title-icon" />
          <h2>可接任务</h2>
          <span className="task-count">{filteredRewards.length}个悬赏任务</span>
        </div>
        <div className="header-actions">
          <button className="publish-task-btn" onClick={() => setShowPublishModal(true)}>
            <Plus size={16} />
            <span>发布任务</span>
          </button>
          <button className="refresh-btn" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            <span>刷新</span>
          </button>
          <button className="share-btn" onClick={() => {
            const shareData = {
              title: '半山AIX - 悬赏任务',
              text: '发现超多悬赏任务，奖金丰厚！',
              url: window.location.origin + '/community'
            }
            if (navigator.share) {
              navigator.share(shareData)
            } else {
              navigator.clipboard.writeText(shareData.url)
              alert('链接已复制到剪贴板！')
            }
          }}>
            <Share2 size={16} />
            <span>分享</span>
          </button>
        </div>
      </div>
      
      {/* 爆款专区 */}
      <HotTasksSection
        rewards={getHotRewards()}
        onSelect={setSelectedReward}
      />
      
      {/* 筛选排序栏 */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
      />
      
      {/* 任务列表 */}
      <div className="reward-list">
        {filteredRewards.length === 0 ? (
          <div className="empty-state">
            <Zap size={48} />
            <p>暂无符合条件的任务</p>
            <span>试试调整筛选条件</span>
          </div>
        ) : (
          filteredRewards.map(reward => (
            <React.Fragment key={reward.id}>
              <RewardCard
                reward={reward}
                onSelect={setSelectedReward}
                onCollect={handleCollect}
                isCollected={collected.includes(reward.id)}
              />
              {/* 如果这个卡片被选中，在它下面展开详情 */}
              {selectedReward && selectedReward.id === reward.id && !submittedReward && (
                <RewardExpandPanel
                  reward={selectedReward}
                  onClose={() => setSelectedReward(null)}
                  onSubmit={handleSubmit}
                  onCollect={handleCollect}
                  isCollected={collected.includes(selectedReward.id)}
                />
              )}
            </React.Fragment>
          ))
        )}
      </div>
      
      {/* 已结束任务 */}
      <EndedTasksSection rewards={getEndedRewards()} />
      
      {/* 提交成功弹窗 */}
      {submittedReward && (
        <SubmitSuccessModal
          reward={submittedReward}
          onClose={() => setSubmittedReward(null)}
        />
      )}
      
      {/* 发布任务弹窗 */}
      {showPublishModal && (
        <PublishRewardModal
          onClose={() => setShowPublishModal(false)}
          onPublish={handlePublish}
        />
      )}
    </div>
  )
}
