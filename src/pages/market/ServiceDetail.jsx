import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Star, Clock, Users, CheckCircle, MessageCircle, Heart, Share2,
  ArrowLeft, Shield, Award, Eye, Sparkles, Briefcase
} from 'lucide-react'
import './ServiceDetail.css'
// 模拟服务详情数据
const mockService = {
  id: 'SVC001',
  creator: {
    id: 'C001',
    name: '林导',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    title: 'AI电影导演 · 高级OPC',
    level: 'senior',
    rating: 4.9,
    orders: 128,
    responseTime: '<1小时',
    certified: true
  },
  service: {
    title: '企业品牌AI宣传片定制',
    subtitle: '从创意到成片全流程服务，打造高品质品牌视觉内容',
    category: 'video',
    tags: ['AI宣传片', '品牌故事', '高端定制', '全流程服务'],
    description: '专业AI电影导演，为企业提供从创意策划到成片交付的全流程服务。运用先进的AI视频生成技术，结合传统影视制作经验，为您打造独具品牌调性的高质量宣传片。',
    deliverables: ['30秒-2分钟成片', '完整策划案', '分镜脚本', '配乐素材', '源文件交付'],
    process: [
      { step: 1, title: '需求沟通', desc: '深入了解品牌调性和宣传需求', duration: '1天' },
      { step: 2, title: '创意策划', desc: '完成策划案和分镜脚本设计', duration: '2天' },
      { step: 3, title: '视频制作', desc: 'AI素材生成与后期制作', duration: '3天' },
      { step: 4, title: '交付修改', desc: '成片交付，支持2次免费修改', duration: '1天' }
    ],
    timeline: '7个工作日',
    revisions: 3
  },
  pricing: {
    base: 5800,
    express: 8800,
    expressTimeline: '3个工作日'
  },
  reviews: [
    { id: 1, client: '张总', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', rating: 5, content: '非常专业！林导对品牌调性的把握非常精准，出来的成片效果超出预期。', service: '企业品牌AI宣传片定制', date: '2026-04-10' },
    { id: 2, client: '李总', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', rating: 5, content: '已经是第二次合作了，品质一如既往地好。', service: '产品宣传片制作', date: '2026-04-05' },
    { id: 3, client: '王总', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', rating: 4.8, content: '整体很满意，AI技术的应用让制作周期大大缩短。', service: '企业品牌AI宣传片定制', date: '2026-03-28' }
  ],
  similarServices: [
    { id: 'SVC002', creator: '陈设计', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', title: 'AI商业插画与IP设计', price: 2800, rating: 4.8, orders: 86 },
    { id: 'SVC003', creator: '王导演', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', title: 'AI短剧/微电影制作', price: 12800, rating: 5.0, orders: 42 },
    { id: 'SVC004', creator: '张创意', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', title: '电商AI广告制作', price: 3800, rating: 4.7, orders: 156 }
  ],
  stats: { views: 2560, favorites: 328, orders: 128 }
}
export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedPackage, setSelectedPackage] = useState('base')
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const service = mockService
  const levelBadge = { senior: { text: '高级OPC', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' }, middle: { text: '中级OPC', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' }, junior: { text: '初级OPC', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' } }[service.creator.level]
  return (
    
      <div className="service-detail">
        <div className="breadcrumb">
          <Link to="/service-market" className="back-link"><ArrowLeft size={16} />返回服务广场</Link>
        </div>
        <div className="detail-layout">
          <div className="detail-main">
            {/* 创作者信息卡片 */}
            <div className="info-card">
              <div className="creator-section">
                <img src={service.creator.avatar} alt={service.creator.name} className="creator-avatar" />
                <div className="creator-info">
                  <div className="creator-name">
                    {service.creator.name}
                    <span className="level-badge" style={{ background: levelBadge.bg, color: levelBadge.color }}>{levelBadge.text}</span>
                    {service.creator.certified && <span className="certified-badge"><Shield size={12} />已认证</span>}
                  </div>
                  <div className="creator-title">{service.creator.title}</div>
                  <div className="creator-stats">
                    <span><Star size={14} className="star" /> {service.creator.rating}</span>
                    <span><Briefcase size={14} /> {service.creator.orders}单</span>
                    <span><Clock size={14} /> {service.creator.responseTime}回复</span>
                  </div>
                </div>
              </div>
              <div className="service-header">
                <h1>{service.service.title}</h1>
                <p>{service.service.subtitle}</p>
                <div className="service-tags">
                  {service.service.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
                </div>
              </div>
              <div className="service-stats">
                <div className="stat-item"><Eye size={16} /><span>{service.stats.views} 次浏览</span></div>
                <div className="stat-item"><Heart size={16} /><span>{service.stats.favorites} 收藏</span></div>
                <div className="stat-item"><CheckCircle size={16} /><span>{service.stats.orders} 成功交付</span></div>
              </div>
            </div>
            {/* 服务介绍 */}
            <div className="section-card">
              <h2>服务介绍</h2>
              <div className="description"><p>{service.service.description}</p></div>
            </div>
            {/* 交付物 */}
            <div className="section-card">
              <h2>交付物清单</h2>
              <div className="deliverables">
                {service.service.deliverables.map((item, i) => <div key={i} className="deliverable-item"><CheckCircle size={18} className="icon" /><span>{item}</span></div>)}
              </div>
            </div>
            {/* 服务流程 */}
            <div className="section-card">
              <h2>服务流程</h2>
              <div className="process-timeline">
                {service.service.process.map((step, i) => (
                  <div key={i} className="process-step">
                    <div className="step-number">{step.step}</div>
                    <div className="step-content">
                      <div className="step-header"><span className="step-title">{step.title}</span><span className="step-duration">{step.duration}</span></div>
                      <p className="step-desc">{step.desc}</p>
                    </div>
                    {i < service.service.process.length - 1 && <div className="step-connector"></div>}
                  </div>
                ))}
              </div>
            </div>
            {/* 评价 */}
            <div className="section-card">
              <h2>用户评价 <span className="rating-summary"><Star size={14} fill="#f59e0b" stroke="#f59e0b" /> {service.creator.rating} ({service.reviews.length}条)</span></h2>
              <div className="reviews">
                {service.reviews.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <img src={review.avatar} alt={review.client} className="review-avatar" />
                      <div className="review-info"><span className="review-name">{review.client}</span><div className="review-meta"><span className="review-service">{review.service}</span><span className="review-date">{review.date}</span></div></div>
                      <div className="review-rating">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? '#f59e0b' : '#334155'} stroke={i < review.rating ? '#f59e0b' : '#334155'} />)}</div>
                    </div>
                    <p className="review-content">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* 相似服务 */}
            <div className="section-card">
              <h2>相似服务推荐</h2>
              <div className="similar-services">
                {service.similarServices.map(similar => (
                  <div key={similar.id} className="similar-item" onClick={() => navigate(`/service/${similar.id}`)}>
                    <img src={similar.avatar} alt={similar.creator} className="similar-avatar" />
                    <div className="similar-info"><span className="similar-creator">{similar.creator}</span><span className="similar-title">{similar.title}</span><div className="similar-meta"><span className="similar-rating"><Star size={12} fill="#f59e0b" stroke="#f59e0b" /> {similar.rating}</span><span className="similar-orders">{similar.orders}单</span></div></div>
                    <span className="similar-price">¥{similar.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 定价卡片 */}
          <div className="detail-sidebar">
            <div className="pricing-card">
              <h3>选择服务套餐</h3>
              <div className="package-options">
                <div className={`package-option ${selectedPackage === 'base' ? 'selected' : ''}`} onClick={() => setSelectedPackage('base')}>
                  <div className="package-header"><span className="package-name">基础版</span><span className="package-price">¥{service.pricing.base.toLocaleString()}</span></div>
                  <div className="package-timeline"><Clock size={14} />预计 {service.service.timeline} 完成</div>
                  <ul className="package-features">
                    <li className="included"><CheckCircle size={14} />30秒-1分钟成片</li>
                    <li className="included"><CheckCircle size={14} />完整策划案</li>
                    <li className="included"><CheckCircle size={14} />1次免费修改</li>
                  </ul>
                </div>
                <div className={`package-option express ${selectedPackage === 'express' ? 'selected' : ''}`} onClick={() => setSelectedPackage('express')}>
                  <div className="express-badge"><Sparkles size={12} />加急服务</div>
                  <div className="package-header"><span className="package-name">专业版</span><span className="package-price">¥{service.pricing.express.toLocaleString()}</span></div>
                  <div className="package-timeline"><Clock size={14} />预计 {service.pricing.expressTimeline} 完成</div>
                  <ul className="package-features">
                    <li className="included"><CheckCircle size={14} />1-2分钟成片</li>
                    <li className="included"><CheckCircle size={14} />完整策划案+分镜</li>
                    <li className="included"><CheckCircle size={14} />3次免费修改</li>
                    <li className="included"><CheckCircle size={14} />优先处理</li>
                  </ul>
                </div>
              </div>
              <div className="action-buttons">
                <button className="btn primary" onClick={() => navigate(`/order/create/${service.id}?package=${selectedPackage}`)}>立即购买</button>
                <button className="btn secondary" onClick={() => setShowContactModal(true)}><MessageCircle size={16} />咨询详情</button>
              </div>
              <div className="interaction-buttons">
                <button className={`interaction-btn ${isFavorite ? 'active' : ''}`} onClick={() => setIsFavorite(!isFavorite)}><Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />{isFavorite ? '已收藏' : '收藏'}</button>
                <button className="interaction-btn"><Share2 size={18} />分享</button>
              </div>
              <div className="guarantees">
                <div className="guarantee-item"><Shield size={16} /><span>平台资金托管</span></div>
                <div className="guarantee-item"><CheckCircle size={16} /><span>不满意可退款</span></div>
                <div className="guarantee-item"><Award size={16} /><span>OPC认证保障</span></div>
              </div>
            </div>
          </div>
        </div>
        {showContactModal && (
          <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
            <div className="modal-content contact-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h2>联系创作者</h2><button className="close-btn" onClick={() => setShowContactModal(false)}>×</button></div>
              <div className="modal-body">
                <div className="contact-creator"><img src={service.creator.avatar} alt={service.creator.name} /><div><span className="name">{service.creator.name}</span><span className="title">{service.creator.title}</span></div></div>
                <div className="contact-form"><textarea placeholder="请输入您想咨询的问题..." rows={4}></textarea><button className="btn primary">发送咨询</button></div>
              </div>
            </div>
          </div>
        )}
      </div>
    
  )
}
