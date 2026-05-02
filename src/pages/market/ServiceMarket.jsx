import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, Filter, Plus, Star, Clock, Users, ShoppingBag,
  ChevronRight, Crown, Award, TrendingUp, MapPin,
  Video, Palette, Film, Megaphone, Clapperboard, Sparkles,
  CheckCircle, MessageCircle, Heart, Share2, Eye, MoreVertical,
  Briefcase, Zap, Shield, ArrowUp, ArrowDown
} from 'lucide-react'
import './ServiceMarket.css'
// 模拟服务数据
const mockServices = [
  {
    id: 'SVC001',
    creator: {
      id: 'C001',
      name: '林导',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      title: 'AI电影导演 · 高级OPC',
      level: 'senior'
    },
    service: {
      title: '企业品牌AI宣传片定制',
      subtitle: '从创意到成片全流程服务',
      category: 'video',
      tags: ['AI宣传片', '品牌故事', '高端定制'],
      deliverables: ['30秒成片', '完整脚本', '分镜设计', '后期配乐'],
      timeline: '7个工作日',
      revisions: 3
    },
    pricing: {
      base: 5800,
      express: 8800,
      rating: 4.9,
      orders: 128,
      views: 2560
    },
    featured: true
  },
  {
    id: 'SVC002',
    creator: {
      id: 'C002',
      name: '陈设计',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      title: 'AI视觉设计师 · 中级OPC',
      level: 'middle'
    },
    service: {
      title: 'AI商业插画与IP设计',
      subtitle: '打造独特品牌视觉语言',
      category: 'design',
      tags: ['商业插画', 'IP设计', '品牌视觉'],
      deliverables: ['5张主图', '延展素材', '源文件', '使用手册'],
      timeline: '5个工作日',
      revisions: 2
    },
    pricing: {
      base: 2800,
      express: 4200,
      rating: 4.8,
      orders: 86,
      views: 1820
    },
    featured: false
  },
  {
    id: 'SVC003',
    creator: {
      id: 'C003',
      name: '王导演',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      title: 'AI短剧制作人 · 高级OPC',
      level: 'senior'
    },
    service: {
      title: 'AI短剧/微电影制作',
      subtitle: '完整短剧策划+制作+发布指导',
      category: 'film',
      tags: ['AI短剧', '微电影', '内容策划'],
      deliverables: ['3集短剧', '完整策划案', '运营建议'],
      timeline: '15个工作日',
      revisions: 2
    },
    pricing: {
      base: 12800,
      express: 18800,
      rating: 5.0,
      orders: 42,
      views: 980
    },
    featured: true
  },
  {
    id: 'SVC004',
    creator: {
      id: 'C004',
      name: '张创意',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      title: 'AI广告导演 · 中级OPC',
      level: 'middle'
    },
    service: {
      title: '电商AI广告制作',
      subtitle: '产品视频+种草图文全套方案',
      category: 'advert',
      tags: ['电商视频', '种草内容', '产品种草'],
      deliverables: ['30秒主视频', '3条图文笔记', '配乐素材'],
      timeline: '5个工作日',
      revisions: 3
    },
    pricing: {
      base: 3800,
      express: 5800,
      rating: 4.7,
      orders: 156,
      views: 3200
    },
    featured: false
  },
  {
    id: 'SVC005',
    creator: {
      id: 'C005',
      name: '刘文旅',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      title: 'AI文旅策划师 · 初级OPC',
      level: 'junior'
    },
    service: {
      title: '文旅项目AI宣传片策划',
      subtitle: '景区/酒店/城市宣传片全案',
      category: 'travel',
      tags: ['文旅宣传', '景区推广', '城市名片'],
      deliverables: ['策划案', '分镜脚本', '成片指导'],
      timeline: '10个工作日',
      revisions: 2
    },
    pricing: {
      base: 6800,
      express: 9800,
      rating: 4.9,
      orders: 35,
      views: 720
    },
    featured: false
  },
  {
    id: 'SVC006',
    creator: {
      id: 'C006',
      name: '李漫剧',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      title: 'AI漫剧创作者 · 中级OPC',
      level: 'middle'
    },
    service: {
      title: '品牌IP动漫短剧定制',
      subtitle: '企业IP化内容解决方案',
      category: 'comic',
      tags: ['动漫短剧', 'IP孵化', '品牌内容'],
      deliverables: ['5集短剧', '角色设定', '世界观设定'],
      timeline: '20个工作日',
      revisions: 3
    },
    pricing: {
      base: 15800,
      express: 22800,
      rating: 4.8,
      orders: 28,
      views: 560
    },
    featured: false
  }
]
// 分类配置
const CATEGORIES = [
  { id: 'all', name: '全部服务', icon: ShoppingBag },
  { id: 'video', name: 'AI视频制作', icon: Video },
  { id: 'design', name: 'AI设计服务', icon: Palette },
  { id: 'film', name: 'AI短剧漫剧', icon: Film },
  { id: 'advert', name: 'AI广告电影', icon: Megaphone },
  { id: 'travel', name: 'AI文旅宣传', icon: Clapperboard }
]
// 排序选项
const SORT_OPTIONS = [
  { id: 'recommend', name: '推荐排序' },
  { id: 'popular', name: '热门优先' },
  { id: 'rating', name: '评分最高' },
  { id: 'price_low', name: '价格从低到高' },
  { id: 'price_high', name: '价格从高到低' }
]
export default function ServiceMarket() {
  const navigate = useNavigate()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeSort, setActiveSort] = useState('recommend')
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState([])
  // 获取用户认证状态（模拟）
  const userLevel = 'senior' // senior | middle | junior
  // 筛选服务
  const filteredServices = mockServices.filter(service => {
    // 分类筛选
    if (activeCategory !== 'all' && service.service.category !== activeCategory) {
      return false
    }
    // 价格筛选
    if (service.pricing.base < priceRange[0] || service.pricing.base > priceRange[1]) {
      return false
    }
    // 关键词搜索
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      return (
        service.service.title.toLowerCase().includes(keyword) ||
        service.service.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
        service.creator.name.toLowerCase().includes(keyword)
      )
    }
    return true
  }).sort((a, b) => {
    switch (activeSort) {
      case 'popular':
        return b.pricing.orders - a.pricing.orders
      case 'rating':
        return b.pricing.rating - a.pricing.rating
      case 'price_low':
        return a.pricing.base - b.pricing.base
      case 'price_high':
        return b.pricing.base - a.pricing.base
      default:
        return b.featured - a.featured
    }
  })
  const toggleFavorite = (serviceId) => {
    setFavorites(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }
  const getLevelBadge = (level) => {
    const badges = {
      senior: { text: '高级OPC', color: 'bg-purple-500' },
      middle: { text: '中级OPC', color: 'bg-blue-500' },
      junior: { text: '初级OPC', color: 'bg-green-500' }
    }
    return badges[level] || badges.junior
  }
  return (
    
      <div className="service-market">
        {/* 顶部区域 */}
        <div className="market-header">
          <div className="header-top">
            <div>
              <h1>OPC服务广场</h1>
              <p>精选AI创作服务，快速匹配您的需求</p>
            </div>
            <Link to="/publish-service" className="publish-btn">
              <Plus size={18} />
              发布服务
            </Link>
          </div>
          {/* 搜索栏 */}
          <div className="search-bar">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="搜索服务名称、标签或创作者..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <button
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              筛选
            </button>
          </div>
          {/* 筛选面板 */}
          {showFilters && (
            <div className="filter-panel">
              <div className="filter-section">
                <label>价格区间</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="最低价"
                    value={priceRange[0] || ''}
                    onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                  />
                  <span>至</span>
                  <input
                    type="number"
                    placeholder="最高价"
                    value={priceRange[1] || ''}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 50000])}
                  />
                  <span>元</span>
                </div>
              </div>
              <button
                className="reset-btn"
                onClick={() => {
                  setPriceRange([0, 50000])
                  setSearchKeyword('')
                  setActiveCategory('all')
                }}
              >
                重置筛选
              </button>
            </div>
          )}
          {/* 分类导航 */}
          <div className="category-nav">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon size={18} />
                  {cat.name}
                </button>
              )
            })}
          </div>
          {/* 排序 */}
          <div className="sort-bar">
            <span className="result-count">共 {filteredServices.length} 个服务</span>
            <div className="sort-options">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.id}
                  className={`sort-btn ${activeSort === option.id ? 'active' : ''}`}
                  onClick={() => setActiveSort(option.id)}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* 服务列表 */}
        <div className="services-grid">
          {filteredServices.map(service => {
            const levelBadge = getLevelBadge(service.creator.level)
            return (
              <div
                key={service.id}
                className={`service-card ${service.featured ? 'featured' : ''}`}
              >
                {/* 精选标识 */}
                {service.featured && (
                  <div className="featured-badge">
                    <Sparkles size={14} />
                    精选推荐
                  </div>
                )}
                {/* 创作者信息 */}
                <div className="card-creator">
                  <img src={service.creator.avatar} alt={service.creator.name} className="creator-avatar" />
                  <div className="creator-info">
                    <div className="creator-name">
                      {service.creator.name}
                      <span className={`level-badge ${levelBadge.color}`}>
                        {levelBadge.text}
                      </span>
                    </div>
                    <div className="creator-title">{service.creator.title}</div>
                  </div>
                </div>
                {/* 服务信息 */}
                <div className="card-service">
                  <h3 className="service-title">{service.service.title}</h3>
                  <p className="service-subtitle">{service.service.subtitle}</p>
                  {/* 标签 */}
                  <div className="service-tags">
                    {service.service.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                  {/* 交付物 */}
                  <div className="deliverables">
                    {service.service.deliverables.map((item, i) => (
                      <span key={i} className="deliverable-item">
                        <CheckCircle size={12} />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                {/* 统计数据 */}
                <div className="card-stats">
                  <div className="stat-item">
                    <Star size={14} className="text-yellow-400" />
                    <span>{service.pricing.rating}</span>
                  </div>
                  <div className="stat-item">
                    <Users size={14} className="text-blue-400" />
                    <span>{service.pricing.orders}单</span>
                  </div>
                  <div className="stat-item">
                    <Clock size={14} className="text-gray-400" />
                    <span>{service.service.timeline}</span>
                  </div>
                </div>
                {/* 价格与操作 */}
                <div className="card-footer">
                  <div className="price-info">
                    <span className="price-label">起拍价</span>
                    <span className="price">¥{service.pricing.base.toLocaleString()}</span>
                  </div>
                  <div className="card-actions">
                    <button
                      className={`action-btn favorite ${favorites.includes(service.id) ? 'active' : ''}`}
                      onClick={() => toggleFavorite(service.id)}
                    >
                      <Heart size={18} fill={favorites.includes(service.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button className="action-btn contact">
                      <MessageCircle size={18} />
                    </button>
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/service/${service.id}`)}
                    >
                      查看详情
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {/* 空状态 */}
        {filteredServices.length === 0 && (
          <div className="empty-state">
            <ShoppingBag size={64} className="empty-icon" />
            <h3>暂无符合条件的服务</h3>
            <p>试试调整筛选条件，或发布您的第一个服务</p>
            <Link to="/publish-service" className="publish-btn">
              <Plus size={18} />
              立即发布
            </Link>
          </div>
        )}
        {/* 底部浮动按钮（移动端） */}
        <div className="mobile-actions">
          <Link to="/publish-service" className="mobile-publish-btn">
            <Plus size={20} />
            发布服务
          </Link>
        </div>
      </div>
    
  )
}
