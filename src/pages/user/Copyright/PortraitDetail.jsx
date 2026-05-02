import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, ShoppingCart, Star, Eye, Heart, Share2, Check, Camera, Palette, User, Music, Ruler, Info, Sparkles } from 'lucide-react'
import { useCopyrightOrders } from '../../../hooks/useCopyright'
import { SAMPLE_PORTRAITS } from '../../../data/copyrightSchema'
import './PortraitDetail.css'

export default function PortraitDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createOrder, payOrder, checkAuth } = useCopyrightOrders()
  const [portrait, setPortrait] = useState(null)
  const [selectedLicense, setSelectedLicense] = useState(null)
  const [selectedDuration, setSelectedDuration] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [payMethod, setPayMethod] = useState('cash')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    const found = SAMPLE_PORTRAITS.find(p => String(p.id) === String(id))
    if (found) {
      setPortrait(found)
      if (found.licenseTypes?.length > 0) {
        setSelectedLicense(found.licenseTypes[0])
      }
      if (found.licenseDurations?.length > 0) {
        setSelectedDuration(found.licenseDurations[0])
      }
      if (found.regions?.length > 0) {
        setSelectedRegion(found.regions[0])
      }
    }
  }, [id])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!portrait) {
    return (
      <div className="portrait-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  const handlePurchase = async () => {
    alert('1. 开始购买')
    if (!checkAuth()) {
      alert('2. 未登录，跳转登录')
      navigate('/login', { state: { from: `/copyright/detail/${id}` } })
      return
    }
    alert('3. 已登录')
    if (!selectedLicense || !selectedDuration || !selectedRegion) {
      alert('4. 未选择完整方案')
      setMessage({ type: 'error', text: '请选择完整的授权方案' })
      return
    }
    alert('5. 选择完整，开始下单')
    setLoading(true)
    try {
      const orderData = {
        goods_id: portrait.id,
        price_cash: selectedLicense.price,
        price_points: selectedLicense.price * 10,
        pay_type: payMethod,
      }
      alert('6. 创建订单')
      const order = createOrder(orderData)
      alert('7. 订单创建成功: ' + order.id)
      const result = payOrder(order.id, payMethod)
      alert('8. 支付结果: ' + JSON.stringify(result))
      if (result.success) {
        setMessage({ type: 'success', text: '购买成功！授权已生效' })
      } else {
        setMessage({ type: 'error', text: result.message || '购买失败' })
      }
    } catch (err) {
      alert('9. 错误: ' + err.message)
      setMessage({ type: 'error', text: err.message || '购买失败' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="portrait-detail-page">
      {/* 顶部导航 */}
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>返回</span>
        </button>
        <h1 className="page-title">AI演员 · {portrait.name}</h1>
        <div className="header-actions">
          <button className={`action-btn ${isFavorite ? 'active' : ''}`} onClick={() => setIsFavorite(!isFavorite)}>
            <Heart size={18} fill={isFavorite ? '#FF6B6B' : 'none'} />
          </button>
          <button className="action-btn" onClick={() => navigator.share?.({ title: portrait.name, url: window.location.href })}>
            <Share2 size={18} />
          </button>
        </div>
      </header>

      {/* 主内容区 - 三栏布局 */}
      <div className="detail-main">
        
        {/* 左侧栏 - 角色信息 */}
        <aside className="detail-left">
          {/* 角色卡片 */}
          <div className="info-card character-card">
            <div className="character-avatar">
              <img src={portrait.characterSheet || portrait.frontView} alt={portrait.name} />
              <div className="character-badge">
                <Sparkles size={14} />
                <span>AI演员</span>
              </div>
            </div>
            <div className="character-info">
              <h2>{portrait.name}</h2>
              <p className="character-subtitle">{portrait.subtitle || portrait.style || portrait.characterType}</p>
              <div className="character-tags">
                {portrait.tags?.slice(0, 4).map((tag, i) => (
                  <span key={i} className="mini-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 基础档案 */}
          <div className="info-card">
            <div className="card-header">
              <Info size={16} />
              <h3>基础档案</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">年龄范围</span>
                <span className="info-value">{portrait.ageRange || portrait.age || '22-30岁'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">性别</span>
                <span className="info-value">{portrait.gender || portrait.genderType || '不限'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">身高</span>
                <span className="info-value">{portrait.height || '170-185cm'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">体重</span>
                <span className="info-value">{portrait.weight || '55-75kg'}</span>
              </div>
            </div>
          </div>

          {/* 配色方案 */}
          <div className="info-card">
            <div className="card-header">
              <Palette size={16} />
              <h3>配色方案</h3>
            </div>
            <div className="color-palette">
              {portrait.colorPalette?.map((color, i) => (
                <div key={i} className="color-item" title={`${color.name}: ${color.color}`}>
                  <div className="color-swatch" style={{ backgroundColor: color.color }} />
                  <span className="color-name">{color.name}</span>
                </div>
              )) || (
                <>
                  <div className="color-item">
                    <div className="color-swatch" style={{ backgroundColor: '#C9A96E' }} />
                    <span className="color-name">主色</span>
                  </div>
                  <div className="color-item">
                    <div className="color-swatch" style={{ backgroundColor: '#8B7355' }} />
                    <span className="color-name">辅色</span>
                  </div>
                  <div className="color-item">
                    <div className="color-swatch" style={{ backgroundColor: '#2C1810' }} />
                    <span className="color-name">深色</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 外貌特征 */}
          <div className="info-card">
            <div className="card-header">
              <User size={16} />
              <h3>外貌特征</h3>
            </div>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-label">瞳色</span>
                <span className="feature-value">{portrait.eyeColor || '棕色'}</span>
              </div>
              <div className="feature-item">
                <span className="feature-label">发色</span>
                <span className="feature-value">{portrait.hairColor || portrait.hair || '黑色'}</span>
              </div>
              <div className="feature-item">
                <span className="feature-label">肤色</span>
                <span className="feature-value">{portrait.skinTone || '白皙'}</span>
              </div>
            </div>
          </div>

          {/* 性格特点 */}
          <div className="info-card">
            <div className="card-header">
              <Sparkles size={16} />
              <h3>性格特点</h3>
            </div>
            <p className="description-text">{portrait.personality || '性格独特，气质出众，具有独特的个人魅力。'}</p>
          </div>

          {/* 声线特点 */}
          <div className="info-card">
            <div className="card-header">
              <Music size={16} />
              <h3>声线特点</h3>
            </div>
            <p className="description-text">{portrait.voiceSample || portrait.voice || '声音富有磁性，语调自然，适合多种配音场景。'}</p>
          </div>
        </aside>

        {/* 中间栏 - 角色展示 */}
        <main className="detail-center">
          {/* 9:16主图 - 居中展示 */}
          <div className="portrait-hero">
            <img 
              src={portrait.frontView || portrait.faceCloseup} 
              alt={portrait.title}
              className="portrait-hero-img"
            />
            <div className="portrait-hero-info">
              <h2>{portrait.title}</h2>
              <div className="portrait-hero-tags">
                <span>{portrait.ageRange}</span>
                <span>{portrait.style}</span>
              </div>
            </div>
          </div>

          {/* 16:9三视图 */}
          <div className="portrait-views">
            <div className="view-card">
              <img src={portrait.frontView} alt="正面" />
              <div className="view-label">正面</div>
            </div>
            <div className="view-card">
              <img src={portrait.sideView} alt="侧面" />
              <div className="view-label">侧面</div>
            </div>
            <div className="view-card">
              <img src={portrait.backView} alt="背面" />
              <div className="view-label">背面</div>
            </div>
          </div>

          {/* 演员档案 */}
          <div className="portrait-profile">
            <h3>演员档案</h3>
            <div className="profile-grid">
              <div className="profile-item"><span>性别</span><b>{portrait.gender}</b></div>
              <div className="profile-item"><span>年龄</span><b>{portrait.ageRange}</b></div>
              <div className="profile-item"><span>身高</span><b>{portrait.height}</b></div>
              <div className="profile-item"><span>体重</span><b>{portrait.weight}</b></div>
              <div className="profile-item"><span>肤色</span><b>{portrait.skinTone}</b></div>
              <div className="profile-item"><span>眼色</span><b>{portrait.eyeColor}</b></div>
            </div>
            <p className="profile-desc">{portrait.description}</p>
          </div>
          
          {/* 角色简介 */}
          <div className="info-card intro-card">
            <div className="card-header">
              <Info size={16} />
              <h3>角色简介</h3>
            </div>
            <p className="description-text large">{portrait.description || portrait.intro || `一个来自${portrait.ageRange || '22-30岁'}的${portrait.style || portrait.characterType || '魅力角色'}。${portrait.personality || '性格独特，气质出众。'}`}</p>
          </div>

          {/* 适用场景 */}
          <div className="info-card">
            <div className="card-header">
              <Camera size={16} />
              <h3>适用场景</h3>
            </div>
            <div className="tags-cloud">
              {portrait.useCases?.map((scene, i) => (
                <span key={i} className="scene-tag">{scene}</span>
              ))}
            </div>
          </div>

          {/* 细节特写图 */}
          {portrait.detailShots?.length > 0 && (
            <div className="info-card detail-shots-card">
              <div className="card-header">
                <Camera size={16} />
                <h3>细节特写</h3>
              </div>
              <div className="detail-shots-grid">
                {portrait.detailShots.map((shot, i) => (
                  <div key={i} className="detail-shot-item">
                    <img src={shot.image || shot} alt={shot.label || `细节图${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 统计数据 */}
          <div className="stats-row">
            <div className="stat-box">
              <Eye size={20} />
              <span className="stat-num">{portrait.viewCount?.toLocaleString() || 0}</span>
              <span className="stat-label">浏览</span>
            </div>
            <div className="stat-box">
              <Heart size={20} />
              <span className="stat-num">{portrait.soldCount?.toLocaleString() || 0}</span>
              <span className="stat-label">已售</span>
            </div>
            <div className="stat-box">
              <Star size={20} />
              <span className="stat-num">{portrait.rating || 4.8}</span>
              <span className="stat-label">评分</span>
            </div>
            <div className="stat-box">
              <Play size={20} />
              <span className="stat-num">{portrait.videoCount || 0}</span>
              <span className="stat-label">视频</span>
            </div>
          </div>
        </main>

        {/* 右侧栏 - 授权购买 */}
        <aside className="detail-right">
          <div className="purchase-card">
            <h3>授权方案</h3>

            {/* 授权类型 */}
            <div className="purchase-section">
              <label>授权类型</label>
              <div className="option-list">
                {portrait.licenseTypes?.map(license => (
                  <button
                    key={license.id}
                    className={`option-btn ${selectedLicense?.id === license.id ? 'active' : ''}`}
                    onClick={() => setSelectedLicense(license)}
                  >
                    <span className="option-name">{license.name}</span>
                    <span className="option-desc">{license.desc}</span>
                    <span className="option-price">¥{license.price.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 授权时长 */}
            <div className="purchase-section">
              <label>授权时长</label>
              <div className="duration-pills">
                {portrait.licenseDurations?.map(duration => (
                  <button
                    key={duration}
                    className={`pill-btn ${selectedDuration === duration ? 'active' : ''}`}
                    onClick={() => setSelectedDuration(duration)}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>

            {/* 授权地区 */}
            <div className="purchase-section">
              <label>授权地区</label>
              <div className="region-pills">
                {portrait.regions?.map(region => (
                  <button
                    key={region}
                    className={`pill-btn ${selectedRegion === region ? 'active' : ''}`}
                    onClick={() => setSelectedRegion(region)}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* 价格显示 */}
            <div className="price-display">
              <span className="price-label">应付金额</span>
              <span className="price-value">
                {selectedLicense ? `¥${selectedLicense.price.toLocaleString()}` : '—'}
              </span>
            </div>

            {/* 支付方式 */}
            <div className="pay-methods">
              <button
                className={`pay-method-btn ${payMethod === 'cash' ? 'active' : ''}`}
                onClick={() => setPayMethod('cash')}
              >
                余额支付
              </button>
              <button
                className={`pay-method-btn ${payMethod === 'points' ? 'active' : ''}`}
                onClick={() => setPayMethod('points')}
              >
                积分支付
              </button>
            </div>

            {/* 购买按钮 */}
            <button 
              className="buy-btn" 
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  处理中...
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  立即购买
                </>
              )}
            </button>

            <p className="purchase-note">
              授权生效后可在有效期内使用<br/>
              最终解释权归平台所有
            </p>
          </div>
        </aside>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`message-toast ${message.type}`}>
          {message.type === 'success' ? <Check size={20} /> : <span>!</span>}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}
    </div>
  )
}
