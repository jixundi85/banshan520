import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Calendar, Users, Eye, Heart,
  BookOpen, FileText, Crown, Award, CheckCircle, MessageCircle,
  Lock, Unlock, Play, ChevronRight, Video, Image,
  Plus, X, ExternalLink, RefreshCw, Trash2,
  Briefcase, Clock, DollarSign, Zap, Shield, Globe,
  TrendingUp, Target, Sparkles, Wallet, Camera
} from 'lucide-react';
import './CreatorProfile.css';
import OPCBookingModal from '../../components/OPCBookingModal';
// 根据等级返回中文名称
function getLevelName(level) {
  const levelMap = {
    L1: '初级认证',
    L2: '中级认证',
    L3: '高级认证',
    L4: '顶级认证',
    diamond: '认证创作者',
    gold: '金牌创作者',
    silver: '银牌创作者'
  };
  return levelMap[level] || '认证创作者';
}
export default function CreatorProfile() {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('works');
  const [creator, setCreator] = useState(null);
  const [myCases, setMyCases] = useState([]);
  const [myTutorials, setMyTutorials] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState([]);
  
  // 代表作管理状态
  const [featuredWorks, setFeaturedWorks] = useState([]);
  const [showWorkSelector, setShowWorkSelector] = useState(false);
  const [selectedWorkForModal, setSelectedWorkForModal] = useState(null);
  const [showWorkModal, setShowWorkModal] = useState(false);
  
  // 平台同步状态
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    douyin: false,
    wechat: false
  });
  const [syncingPlatform, setSyncingPlatform] = useState(null);
  
  // OPC服务档案状态
  const [opcProfile, setOpcProfile] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activePricingTab, setActivePricingTab] = useState('project');
  // 头像上传状态
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  useEffect(() => {
    // 加载创作者资料
    const loadCreator = () => {
      // 优先使用从 OPC 智能匹配中心 传入的数据
      const passedData = location.state?.creator || location.state?.consultant;
      if (passedData) {
        setCreator({
          id: passedData.id,
          name: passedData.name,
          avatar: passedData.avatar,
          avatarUrl: passedData.avatarUrl,
          title: passedData.title,
          bio: passedData.bio,
          skills: passedData.skills || [],
          level: passedData.level,
          levelName: passedData.levelName || getLevelName(passedData.level),
          location: passedData.location || '中国',
          joinDate: passedData.joinDate || '2024-01',
          followers: passedData.followers || passedData.completedProjects * 100,
          featuredWorks: passedData.works?.map((url, i) => ({ url, title: `作品 ${i + 1}` })) || [],
          rating: passedData.rating,
          completedProjects: passedData.completedProjects,
          hourlyRate: passedData.hourlyRate,
          tags: passedData.tags,
          category: passedData.category,
          availability: passedData.availability,
          services: passedData.services,
          // 标记为外部创作者（不可编辑）
          isExternal: true
        });
        return;
      }
      // 如果是当前登录的创作者，使用 localStorage 中的资料
      const savedProfile = localStorage.getItem('creatorProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setCreator({
          id: creatorId || 'current',
          name: profile.name,
          avatar: profile.avatar,
          avatarUrl: profile.avatarUrl,
          title: profile.title,
          bio: profile.bio,
          skills: profile.skills || [],
          level: 'diamond',
          levelName: '认证创作者',
          location: '中国',
          joinDate: '2024-01',
          featuredWorks: profile.featuredWorks || [],
          // 粉丝数基于各平台数据
          followers: Math.round(
            (parseFloat(profile.douyinFans) || 0) * 10000 +
            (parseFloat(profile.wechatFans) || 0) * 10000 +
            (parseFloat(profile.xiaohongshuFans) || 0) * 10000
          ) || 2580,
          isExternal: false
        });
      } else {
        // 使用默认资料
        setCreator({
          id: creatorId || 'default',
          name: '林小艺',
          avatar: '👩‍💻',
          title: 'AI创作导师 | 短视频运营专家',
          bio: '专注AI内容创作5年，服务过100+品牌客户。',
          skills: ['AI短视频', '内容策划', '流量运营', '变现指导'],
          level: 'diamond',
          levelName: '认证创作者',
          location: '中国',
          joinDate: '2024-01',
          followers: 2580,
          featuredWorks: [],
          isExternal: false
        });
      }
    };
    
    // 加载OPC服务档案
    const loadOpcProfile = () => {
      // 优先使用从 OPC 智能匹配中心 传入的咨询专家数据
      const passedData = location.state?.consultant;
      if (passedData) {
        setOpcProfile({
          isActive: true,
          status: passedData.availability === '可接单' ? 'available' : passedData.availability === '忙碌' ? 'busy' : 'available',
          statusText: passedData.availability,
          nextAvailable: passedData.availability === '忙碌' ? '3天后' : '即时',
          serviceTags: passedData.skills || [],
          carbonTraits: ['专业能力', '行业经验', '资源整合'],
          siliconTraits: ['高效执行', '数据驱动', '流程优化'],
          pricing: {
            project: passedData.services?.map(s => ({ type: s, min: 5000, max: 20000, unit: '次', desc: '定制服务' })) || [],
            hourly: [{ type: '专家咨询', price: passedData.hourlyRate || 1000, unit: '小时', desc: '专业咨询' }]
          },
          availability: passedData.availability,
          responseTime: '2小时内',
          workHours: '工作日 9:00-21:00',
          completedProjects: passedData.completedProjects,
          rating: passedData.rating,
          reviewCount: Math.floor(passedData.completedProjects * 0.3),
          onTimeRate: 95,
          repeatHireRate: 40,
          specialties: passedData.skills || [],
          industries: ['各行业企业'],
          tools: ['企业咨询工具'],
          description: passedData.bio || '',
          recentWorks: [],
          isExternal: true
        });
        return;
      }
      const savedOpc = localStorage.getItem('opcProfile');
      if (savedOpc) {
        setOpcProfile({ ...JSON.parse(savedOpc), isExternal: false });
      } else {
        // 默认OPC档案 - 增强版
        setOpcProfile({
          isActive: true,
          status: 'available', // available, busy, full, vacation
          statusText: '可接单',
          nextAvailable: '即时',
          serviceTags: ['AI短视频制作', '数字人定制', '智能客服搭建', 'AI策略咨询'],
          carbonTraits: ['创意爆发', '审美把控', '情感共鸣', '策略判断', '商业敏锐'],
          siliconTraits: ['工具精通', '效率极致', '数据驱动', '流程标准化'],
          pricing: {
            project: [
              { type: 'AI短视频制作', min: 5000, max: 20000, unit: '条', desc: '含脚本+拍摄+后期' },
              { type: '数字人定制', min: 10000, max: 50000, unit: '个', desc: '形象设计+声音克隆+动作库' },
              { type: '智能客服搭建', min: 8000, max: 30000, unit: '套', desc: '知识库+工作流+部署' },
              { type: 'AI策略咨询', min: 3000, max: 10000, unit: '次', desc: '2小时深度诊断' }
            ],
            hourly: [
              { type: '标准咨询', price: 800, unit: '小时', desc: '日常咨询答疑' },
              { type: '深度陪跑', price: 1500, unit: '小时', desc: '项目全程跟进' },
              { type: '企业内训', price: 5000, unit: '场', desc: '2小时定制培训' }
            ],
            package: [
              { type: '月度顾问', price: 30000, unit: '月', desc: '不限次咨询+优先响应' },
              { type: '季度托管', price: 80000, unit: '季度', desc: '全流程托管交付' }
            ]
          },
          availability: '即时响应',
          responseTime: '2小时内',
          workHours: '工作日 9:00-21:00',
          completedProjects: 23,
          rating: 4.9,
          reviewCount: 18,
          onTimeRate: 98,
          repeatHireRate: 65,
          specialties: ['电商带货', '品牌宣传', '教育培训', '金融保险'],
          industries: ['消费品', '教育', '科技', '医疗'],
          tools: ['Midjourney', 'Runway', 'HeyGen', 'ChatGPT', 'Claude', 'Stable Diffusion', 'ComfyUI'],
          description: '提供端到端的AI内容生产服务，从策略到交付全流程把控。擅长将复杂的AI技术转化为可落地的商业方案，帮助企业实现智能化转型。',
          recentWorks: [
            { title: '某美妆品牌AI短视频矩阵', result: '播放量500万+，转化率提升35%' },
            { title: '教育平台数字人讲师', result: '课程完课率提升42%' },
            { title: '金融机构智能客服升级', result: '客服成本降低60%' }
          ]
        });
      }
    };
    // 处理头像上传
    const handleAvatarUpload = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      // 验证文件大小（最大2MB）
      if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过2MB');
        return;
      }
      setUploadingAvatar(true);
      try {
        // 转换为 base64
        const reader = new FileReader();
        reader.onload = (event) => {
          const avatarUrl = event.target?.result;
          if (avatarUrl) {
            // 更新本地状态
            if (creator) {
              setCreator(prev => ({ ...prev, avatarUrl }));
            }
            // 保存到 localStorage
            const savedProfile = localStorage.getItem('creatorProfile');
            if (savedProfile) {
              const profile = JSON.parse(savedProfile);
              profile.avatarUrl = avatarUrl;
              localStorage.setItem('creatorProfile', JSON.stringify(profile));
            } else {
              // 如果没有 profile，创建一个
              localStorage.setItem('creatorProfile', JSON.stringify({
                name: creator?.name || '创作者',
                avatarUrl,
                avatar: creator?.name?.[0] || '创'
              }));
            }
            // 通知其他组件更新
            window.dispatchEvent(new Event('creatorProfileUpdated'));
          }
        };
        reader.onerror = () => {
          alert('头像上传失败，请重试');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        alert('头像上传失败，请重试');
      } finally {
        setUploadingAvatar(false);
      }
    };
    loadCreator();
    loadOpcProfile();
    // 监听资料更新
    window.addEventListener('creatorProfileUpdated', loadCreator);
    return () => window.removeEventListener('creatorProfileUpdated', loadCreator);
  }, [creatorId]);
  // 加载案例和教程数据
  useEffect(() => {
    const loadData = () => {
      // 从 localStorage 读取案例数据
      const publishedCases = JSON.parse(localStorage.getItem('publishedCases') || '[]');
      const myCasesData = publishedCases.filter(c => c.status === 'published');
      
      // 从 localStorage 读取教程数据
      const savedTutorials = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
      const myTutorialsData = savedTutorials.filter(t => t.status === 'published');
      
      // 已购买的项目
      const purchased = JSON.parse(localStorage.getItem('purchasedItems') || '[]');
      setPurchasedItems(purchased);
      
      setMyCases(myCasesData);
      setMyTutorials(myTutorialsData);
      
      // 加载已设置的代表作品
      const savedProfile = localStorage.getItem('creatorProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.featuredWorks) {
          setFeaturedWorks(profile.featuredWorks);
        }
      }
      
      // 加载平台连接状态
      const platforms = JSON.parse(localStorage.getItem('connectedPlatforms') || '{}');
      setConnectedPlatforms(platforms);
    };
    
    loadData();
    
    // 定期刷新
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);
  // 计算统计数据
  const stats = {
    totalWorks: myCases.length + myTutorials.length,
    totalViews: [...myCases, ...myTutorials].reduce((sum, item) => sum + (item.views || 0), 0),
    totalLikes: [...myCases, ...myTutorials].reduce((sum, item) => sum + (item.likes || 0), 0),
  };
  // 获取代表作品详情
  const getFeaturedWork = (key) => {
    const [type, id] = key.split('_');
    if (type === 'case') {
      return myCases.find(c => c.id === parseInt(id));
    } else if (type === 'tutorial') {
      return myTutorials.find(t => t.id === parseInt(id));
    }
    return null;
  };
  // 检查项目是否已购买
  const isPurchased = (itemId, type) => {
    return purchasedItems.some(item => item.id === itemId && item.type === type);
  };
  // 添加作品到代表作
  const addToFeatured = (item, type) => {
    if (featuredWorks.length >= 6) {
      alert('最多只能设置6个代表作品');
      return;
    }
    
    const workData = {
      id: `${type}_${item.id}`,
      title: item.title,
      cover: item.thumbnail || item.coverImage,
      type: type === 'case' ? 'local' : 'tutorial',
      desc: type === 'case' ? '精选案例作品' : '精品课程',
      itemId: item.id,
      itemType: type
    };
    
    const updated = [...featuredWorks, workData];
    setFeaturedWorks(updated);
    
    // 保存到创作者资料
    const savedProfile = localStorage.getItem('creatorProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      profile.featuredWorks = updated;
      localStorage.setItem('creatorProfile', JSON.stringify(profile));
    }
    
    setShowWorkSelector(false);
  };
  // 从代表作中移除
  const removeFromFeatured = (workId) => {
    const updated = featuredWorks.filter(w => w.id !== workId);
    setFeaturedWorks(updated);
    
    const savedProfile = localStorage.getItem('creatorProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      profile.featuredWorks = updated;
      localStorage.setItem('creatorProfile', JSON.stringify(profile));
    }
  };
  // 同步平台作品
  const syncPlatformWorks = async (platform) => {
    setSyncingPlatform(platform);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟获取平台作品
    const mockWorks = platform === 'douyin' ? [
      { id: 'dy_1', title: 'AI短视频爆款制作教程', cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=150&fit=crop', platform: 'douyin', views: '12.5万' },
      { id: 'dy_2', title: 'Midjourney商业设计实战', cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=150&fit=crop', platform: 'douyin', views: '8.3万' },
    ] : [
      { id: 'wx_1', title: '视频号运营全攻略', cover: 'https://images.unsplash.com/photo-1614728263952-4ea3f273e5f7?w=200&h=150&fit=crop', platform: 'wechat', views: '5.2万' },
      { id: 'wx_2', title: 'AI内容变现指南', cover: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=150&fit=crop', platform: 'wechat', views: '3.8万' },
    ];
    
    // 更新平台连接状态
    const updatedPlatforms = { ...connectedPlatforms, [platform]: true };
    setConnectedPlatforms(updatedPlatforms);
    localStorage.setItem('connectedPlatforms', JSON.stringify(updatedPlatforms));
    
    // 将平台作品添加到代表作（可选）
    const platformWorks = mockWorks.map(w => ({
      id: `${platform}_${w.id}`,
      title: w.title,
      cover: w.cover,
      type: platform,
      desc: `${platform === 'douyin' ? '抖音' : '视频号'}精选作品`,
      platformUrl: `https://${platform === 'douyin' ? 'douyin.com' : 'channels.weixin.qq.com'}/video/${w.id}`,
      views: w.views
    }));
    
    // 合并到代表作（去重）
    const existingIds = new Set(featuredWorks.map(w => w.id));
    const newWorks = platformWorks.filter(w => !existingIds.has(w.id));
    
    if (newWorks.length > 0) {
      const updated = [...featuredWorks, ...newWorks].slice(0, 6);
      setFeaturedWorks(updated);
      
      const savedProfile = localStorage.getItem('creatorProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        profile.featuredWorks = updated;
        localStorage.setItem('creatorProfile', JSON.stringify(profile));
      }
    }
    
    setSyncingPlatform(null);
    alert(`${platform === 'douyin' ? '抖音' : '视频号'}作品同步成功！`);
  };
  // 打开作品播放
  const openWorkModal = (work) => {
    setSelectedWorkForModal(work);
    setShowWorkModal(true);
  };
  const levelColors = {
    diamond: 'from-yellow-400 to-orange-400',
    gold: 'from-yellow-500 to-yellow-600',
    silver: 'from-gray-300 to-gray-400',
    bronze: 'from-amber-600 to-amber-700'
  };
  if (!creator) {
    return (
      <div className="creator-profile-page loading">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }
  return (
    <div className="creator-profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="header-bg">
          <div className="bg-gradient"></div>
        </div>
        
        <div className="header-content profile-container">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            
            <div className="creator-info">
              <div className={`avatar-container bg-gradient-to-br ${levelColors[creator.level]}`}>
                {creator.avatarUrl ? (
                  <img src={creator.avatarUrl} alt={creator.name} className="avatar-img" />
                ) : (
                  <span className="avatar-emoji">{creator.avatar}</span>
                )}
                <span className="verified-badge">
                  <CheckCircle size={14} />
                </span>
                {/* 上传头像按钮 - 仅当前用户可见 */}
                {!creator.isExternal && (
                  <label className="avatar-upload-btn">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                    <Camera size={16} />
                    {uploadingAvatar ? '上传中...' : '上传'}
                  </label>
                )}
              </div>
              
              <div className="info-main">
                <div className="name-row">
                  <h1>{creator.name}</h1>
                  <span className={`level-badge bg-gradient-to-r ${levelColors[creator.level]}`}>
                    <Award size={12} /> {creator.levelName}
                  </span>
                </div>
                <p className="title">{creator.title}</p>
                
                <div className="meta-row">
                  <span><MapPin size={14} /> {creator.location}</span>
                  <span><Calendar size={14} /> 加入于 {creator.joinDate}</span>
                  <span><Users size={14} /> {creator.followers.toLocaleString()} 粉丝</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className="header-actions">
              <button 
                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? (
                  <>
                    <CheckCircle size={16} /> 已关注
                  </>
                ) : (
                  <>
                    <Users size={16} /> 关注
                  </>
                )}
              </button>
              <button className="message-btn" onClick={() => navigate('/demand')}>
                <MessageCircle size={16} /> 咨询
              </button>
              {opcProfile?.isActive && (
                <button 
                  className="hire-btn"
                  onClick={() => setShowServiceModal(true)}
                >
                  <Briefcase size={16} /> 发起项目
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Stats Bar */}
      <div className="profile-container">
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-value">{stats.totalWorks}</div>
            <div className="stat-label">作品</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.totalViews.toLocaleString()}</div>
            <div className="stat-label">浏览</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.totalLikes.toLocaleString()}</div>
            <div className="stat-label">点赞</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{creator.followers.toLocaleString()}</div>
            <div className="stat-label">粉丝</div>
          </div>
          {opcProfile?.isActive && (
            <>
              <div className="stat-item opc-stat">
                <div className="stat-value">{opcProfile.completedProjects}</div>
                <div className="stat-label">交付项目</div>
              </div>
              <div className="stat-item opc-stat">
                <div className="stat-value">{opcProfile.rating}</div>
                <div className="stat-label">评分</div>
              </div>
            </>
          )}
          {/* 信用档案快捷入口 */}
          <div className="stat-item cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => navigate('/credit-profile')}>
            <div className="stat-value flex items-center gap-1">
              <Shield size={16} className="text-cyan-400" />
              <span>查看</span>
            </div>
            <div className="stat-label">信用档案</div>
          </div>
        </div>
        
        {/* 主内容区域 - 左右两栏布局 */}
        <div className="profile-content">
          {/* 左侧：Tabs + 内容 */}
          <div className="main-column">
            {/* Tabs */}
            <div className="profile-tabs">
              <button 
                className={`tab ${activeTab === 'works' ? 'active' : ''}`}
                onClick={() => setActiveTab('works')}
              >
                <FileText size={16} /> 作品
              </button>
              <button 
                className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                <BookOpen size={16} /> 课程
              </button>
              <button 
                className={`tab ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                <Crown size={16} /> 关于
              </button>
            </div>
            
            {/* Content */}
            {/* 代表作品 */}
            {activeTab === 'works' && (
              <div className="works-section">
                {/* 代表作品管理 */}
                <div className="featured-section">
                  <div className="featured-header">
                    <h3><Crown size={16} /> 代表作品</h3>
                    <div className="featured-actions">
                      {/* 平台同步按钮 */}
                      <button 
                        className={`sync-btn ${connectedPlatforms.douyin ? 'connected' : ''} ${syncingPlatform === 'douyin' ? 'syncing' : ''}`}
                        onClick={() => syncPlatformWorks('douyin')}
                        disabled={syncingPlatform !== null}
                      >
                        {syncingPlatform === 'douyin' ? (
                          <><RefreshCw size={14} className="spin" /> 同步中...</>
                        ) : connectedPlatforms.douyin ? (
                          <><CheckCircle size={14} /> 抖音已同步</>
                        ) : (
                          <><RefreshCw size={14} /> 同步抖音</>
                        )}
                      </button>
                      <button 
                        className={`sync-btn wechat ${connectedPlatforms.wechat ? 'connected' : ''} ${syncingPlatform === 'wechat' ? 'syncing' : ''}`}
                        onClick={() => syncPlatformWorks('wechat')}
                        disabled={syncingPlatform !== null}
                      >
                        {syncingPlatform === 'wechat' ? (
                          <><RefreshCw size={14} className="spin" /> 同步中...</>
                        ) : connectedPlatforms.wechat ? (
                          <><CheckCircle size={14} /> 视频号已同步</>
                        ) : (
                          <><RefreshCw size={14} /> 同步视频号</>
                        )}
                      </button>
                      <button 
                        className="add-featured-btn"
                        onClick={() => setShowWorkSelector(true)}
                        disabled={featuredWorks.length >= 6}
                      >
                        <Plus size={14} /> 添加 ({featuredWorks.length}/6)
                      </button>
                    </div>
                  </div>
                  
                  {featuredWorks.length > 0 ? (
                    <div className="featured-grid">
                      {featuredWorks.map((work, idx) => (
                        <div 
                          key={idx} 
                          className="featured-card"
                          onClick={() => openWorkModal(work)}
                        >
                          <div className="card-thumb">
                            <img src={work.cover} alt={work.title} />
                            <div className="thumb-overlay">
                              <Play size={24} />
                            </div>
                            {work.type === 'douyin' && <span className="platform-badge douyin">抖音</span>}
                            {work.type === 'wechat' && <span className="platform-badge wechat">视频号</span>}
                          </div>
                          <div className="card-info">
                            <h4>{work.title}</h4>
                            <p className="card-desc">{work.desc}</p>
                          </div>
                          <button 
                            className="remove-featured-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromFeatured(work.id);
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="featured-empty">
                      <p>暂无代表作品</p>
                      <span>点击右上角添加或同步平台作品</span>
                    </div>
                  )}
                </div>
                {/* 全部案例 */}
                {myCases.length > 0 && (
                  <div className="category-section">
                    <h3><FileText size={16} /> 案例作品 ({myCases.length})</h3>
                    <div className="works-grid">
                      {myCases.map((caseItem) => (
                        <div 
                          key={caseItem.id} 
                          className="work-card"
                          onClick={() => navigate(`/training/case/${caseItem.id}`)}
                        >
                          <div className="card-thumb">
                            <img src={caseItem.thumbnail} alt={caseItem.title} />
                            {caseItem.videoUrl && (
                              <div className="play-overlay">
                                <Play size={24} />
                              </div>
                            )}
                            <div className="price-tag">
                              {caseItem.isFree ? '免费' : `¥${caseItem.price || caseItem.pointsPrice || 0}`}
                            </div>
                          </div>
                          <div className="card-info">
                            <h4>{caseItem.title}</h4>
                            <p className="card-desc">{caseItem.subtitle || caseItem.description}</p>
                            <div className="card-stats">
                              <span><Eye size={12} /> {caseItem.views || 0}</span>
                              <span><Heart size={12} /> {caseItem.likes || 0}</span>
                              {caseItem.tutorial?.chapters?.length && (
                                <span><BookOpen size={12} /> {caseItem.tutorial.chapters.length}章节</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {myCases.length === 0 && (
                  <div className="empty-state">
                    <FileText size={48} />
                    <p>暂无案例作品</p>
                  </div>
                )}
              </div>
            )}
            {/* 课程 */}
            {activeTab === 'courses' && (
              <div className="courses-section">
                {myTutorials.length > 0 ? (
                  <div className="courses-grid">
                    {myTutorials.map((tutorial) => {
                      const purchased = isPurchased(tutorial.id, 'tutorial');
                      return (
                        <div 
                          key={tutorial.id} 
                          className="course-card"
                          onClick={() => {
                            if (purchased) {
                              navigate(`/training/course/${tutorial.id}`);
                            } else {
                              navigate(`/training/course/${tutorial.id}`);
                            }
                          }}
                        >
                          <div className="card-thumb">
                            <img src={tutorial.coverImage} alt={tutorial.title} />
                            {!purchased && tutorial.isPaid && (
                              <div className="lock-overlay">
                                <Lock size={24} />
                                <span>购买后可见</span>
                              </div>
                            )}
                            <div className="price-tag">
                              {tutorial.isPaid ? `${tutorial.price}积分` : '免费'}
                            </div>
                            {tutorial.chapters?.length > 0 && (
                              <div className="chapters-count">
                                <BookOpen size={12} /> {tutorial.chapters.length}章节
                              </div>
                            )}
                          </div>
                          <div className="card-info">
                            <h4>{tutorial.title}</h4>
                            {tutorial.subtitle && <p className="card-desc">{tutorial.subtitle}</p>}
                            {purchased ? (
                              <div className="purchased-badge">
                                <Unlock size={12} /> 已购买 - 点击学习
                              </div>
                            ) : (
                              <div className="card-stats">
                                <span><Eye size={12} /> {tutorial.views || 0}</span>
                                <span><Heart size={12} /> {tutorial.likes || 0}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <BookOpen size={48} />
                    <p>暂无课程</p>
                  </div>
                )}
              </div>
            )}
            {/* 关于 */}
            {activeTab === 'about' && (
              <div className="about-section">
                <div className="about-card">
                  <h3>个人简介</h3>
                  <p>{creator.bio}</p>
                </div>
                
                <div className="about-card">
                  <h3>擅长领域</h3>
                  <div className="skills-list">
                    {creator.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="about-card">
                  <h3>平台认证</h3>
                  <div className="certifications">
                    <div className="cert-item">
                      <Award size={20} />
                      <span>认证创作者</span>
                    </div>
                    <div className="cert-item">
                      <CheckCircle size={20} />
                      <span>身份认证</span>
                    </div>
                  </div>
                </div>
                
                <button className="contact-btn" onClick={() => navigate('/demand')}>
                  <MessageCircle size={18} /> 联系创作者
                </button>
              </div>
            )}
          </div>
          {/* 右侧：OPC服务档案卡片 */}
          <div className="sidebar-column">
            {opcProfile?.isActive && (
              <div className="opc-profile-card">
                <div className="opc-header">
                  <div className="opc-title">
                    <Zap size={20} className="opc-icon" />
                    <span>超级个体服务档案</span>
                  </div>
                  <div className="opc-actions">
              <button 
                className="edit-opc-btn"
                onClick={() => setEditingService(true)}
              >
                编辑档案
              </button>
            </div>
          </div>
          {/* 档期状态 */}
          
          {/* 档期状态 */}
          <div className="opc-availability-section">
            <div className={`availability-status ${opcProfile.status}`}>
              <div className="status-indicator">
                <span className={`status-dot ${opcProfile.status}`}></span>
                <span className="status-text">
                  {opcProfile.status === 'available' ? '可接单' : 
                   opcProfile.status === 'busy' ? '忙碌中' : 
                   opcProfile.status === 'full' ? '已满档' : '休假中'}
                </span>
              </div>
              <div className="availability-details">
                <span><Clock size={14} /> {opcProfile.responseTime}响应</span>
                <span>·</span>
                <span>下次可约：{opcProfile.nextAvailable}</span>
              </div>
            </div>
            <button 
              className="book-btn"
              onClick={() => setShowBookingModal(true)}
              disabled={opcProfile.status === 'full' || opcProfile.status === 'vacation'}
            >
              <Calendar size={16} />
              {opcProfile.status === 'full' ? '已满档' : 
               opcProfile.status === 'vacation' ? '休假中' : '立即预约'}
            </button>
          </div>
          
          <div className="opc-content">
            {/* 碳基特质 + 硅基能力 */}
            <div className="opc-section traits-section">
              <div className="traits-column">
                <h4><Sparkles size={14} className="carbon-icon" /> 碳基特质</h4>
                <div className="trait-tags">
                  {opcProfile.carbonTraits?.map((trait, idx) => (
                    <span key={idx} className="trait-tag carbon">{trait}</span>
                  ))}
                </div>
              </div>
              <div className="traits-column">
                <h4><Zap size={14} className="silicon-icon" /> 硅基能力</h4>
                <div className="trait-tags">
                  {opcProfile.siliconTraits?.map((trait, idx) => (
                    <span key={idx} className="trait-tag silicon">{trait}</span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 服务标签 */}
            <div className="opc-section">
              <h4><Briefcase size={14} /> 核心服务</h4>
              <div className="service-tags">
                {opcProfile.serviceTags?.map((tag, idx) => (
                  <span key={idx} className="service-tag">{tag}</span>
                ))}
              </div>
            </div>
            
            {/* 服务报价表 */}
            <div className="opc-section pricing-section">
              <h4><DollarSign size={14} /> 服务报价</h4>
              
              {/* 报价类型切换 */}
              <div className="pricing-tabs">
                <button 
                  className={activePricingTab === 'project' ? 'active' : ''}
                  onClick={() => setActivePricingTab('project')}
                >
                  按项目
                </button>
                <button 
                  className={activePricingTab === 'hourly' ? 'active' : ''}
                  onClick={() => setActivePricingTab('hourly')}
                >
                  按时间
                </button>
                <button 
                  className={activePricingTab === 'package' ? 'active' : ''}
                  onClick={() => setActivePricingTab('package')}
                >
                  套餐包
                </button>
              </div>
              
              {/* 报价表 */}
              <div className="pricing-table">
                {opcProfile.pricing?.[activePricingTab]?.map((item, idx) => (
                  <div key={idx} className="pricing-row">
                    <div className="pricing-info">
                      <span className="pricing-type">{item.type}</span>
                      <span className="pricing-desc">{item.desc}</span>
                    </div>
                    <div className="pricing-price">
                      {activePricingTab === 'project' ? (
                        <span>¥{item.min.toLocaleString()}-{item.max.toLocaleString()}/{item.unit}</span>
                      ) : (
                        <span>¥{item.price.toLocaleString()}/{item.unit}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 擅长领域 + 服务行业 */}
            <div className="opc-section specialties-section">
              <div className="specialty-column">
                <h4><Target size={14} /> 擅长领域</h4>
                <div className="specialty-tags">
                  {opcProfile.specialties?.map((spec, idx) => (
                    <span key={idx} className="specialty-tag">{spec}</span>
                  ))}
                </div>
              </div>
              <div className="specialty-column">
                <h4><Globe size={14} /> 服务行业</h4>
                <div className="specialty-tags">
                  {opcProfile.industries?.map((ind, idx) => (
                    <span key={idx} className="industry-tag">{ind}</span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 工具栈 */}
            <div className="opc-section">
              <h4><Shield size={14} /> 工具栈</h4>
              <div className="tools-list">
                {opcProfile.tools?.map((tool, idx) => (
                  <span key={idx} className="tool-tag">{tool}</span>
                ))}
              </div>
            </div>
            
            {/* 服务说明 */}
            <p className="opc-description">{opcProfile.description}</p>
            
            {/* 最近案例 */}
            {opcProfile.recentWorks && opcProfile.recentWorks.length > 0 && (
              <div className="opc-section recent-works">
                <h4><TrendingUp size={14} /> 近期交付成果</h4>
                <div className="works-list">
                  {opcProfile.recentWorks.map((work, idx) => (
                    <div key={idx} className="work-item">
                      <span className="work-title">{work.title}</span>
                      <span className="work-result">{work.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 数据指标 */}
            <div className="opc-metrics">
              <div className="metric-item">
                <span className="metric-value">{opcProfile.completedProjects}</span>
                <span className="metric-label">交付项目</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">{opcProfile.rating}</span>
                <span className="metric-label">评分 ({opcProfile.reviewCount}评价)</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">{opcProfile.onTimeRate}%</span>
                <span className="metric-label">准时交付</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">{opcProfile.repeatHireRate}%</span>
                <span className="metric-label">复购率</span>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
      {/* 预约弹窗 */}
      <OPCBookingModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        opcProfile={opcProfile}
        creator={creator}
      />
      {/* 作品选择弹窗 */}
      {showWorkSelector && (
        <div className="work-selector-modal" onClick={() => setShowWorkSelector(false)}>
          <div className="work-selector-content" onClick={e => e.stopPropagation()}>
            <div className="work-selector-header">
              <h3>选择代表作品</h3>
              <button onClick={() => setShowWorkSelector(false)}><X size={20} /></button>
            </div>
            <div className="work-selector-body">
              {/* 案例作品 */}
              {myCases.length > 0 && (
                <div className="selector-section">
                  <h4><FileText size={14} /> 我的案例</h4>
                  <div className="selector-grid">
                    {myCases.map(item => (
                      <div 
                        key={`case_${item.id}`}
                        className="selector-item"
                        onClick={() => addToFeatured(item, 'case')}
                      >
                        <img src={item.thumbnail} alt={item.title} />
                        <span>{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 课程作品 */}
              {myTutorials.length > 0 && (
                <div className="selector-section">
                  <h4><BookOpen size={14} /> 我的课程</h4>
                  <div className="selector-grid">
                    {myTutorials.map(item => (
                      <div 
                        key={`tutorial_${item.id}`}
                        className="selector-item"
                        onClick={() => addToFeatured(item, 'tutorial')}
                      >
                        <img src={item.coverImage} alt={item.title} />
                        <span>{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {myCases.length === 0 && myTutorials.length === 0 && (
                <div className="selector-empty">
                  <p>暂无作品可添加</p>
                  <span>先发布案例或课程后再来设置代表作</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 作品播放弹窗 */}
      {showWorkModal && selectedWorkForModal && (
        <div className="work-play-modal" onClick={() => setShowWorkModal(false)}>
          <div className="work-play-content" onClick={e => e.stopPropagation()}>
            <div className="work-play-header">
              <h3>{selectedWorkForModal.title}</h3>
              <button onClick={() => setShowWorkModal(false)}><X size={20} /></button>
            </div>
            <div className="work-play-body">
              {/* 本地作品直接播放 */}
              {selectedWorkForModal.type === 'local' && (
                <div className="work-player-placeholder">
                  <Play size={48} />
                  <p>本地作品播放区域</p>
                  <p className="hint">实际项目中使用视频播放器组件</p>
                </div>
              )}
              
              {/* 抖音作品 */}
              {selectedWorkForModal.type === 'douyin' && (
                <div className="work-player-placeholder douyin">
                  <div className="platform-icon">🎵</div>
                  <p>抖音视频播放区域</p>
                  <p className="hint">通过抖音开放平台嵌入播放器</p>
                  <a 
                    href={selectedWorkForModal.platformUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="platform-link"
                  >
                    <ExternalLink size={14} /> 在抖音中打开
                  </a>
                </div>
              )}
              
              {/* 视频号作品 */}
              {selectedWorkForModal.type === 'wechat' && (
                <div className="work-player-placeholder wechat">
                  <div className="platform-icon">💬</div>
                  <p>视频号播放区域</p>
                  <p className="hint">通过微信视频号组件嵌入</p>
                  <a 
                    href={selectedWorkForModal.platformUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="platform-link"
                  >
                    <ExternalLink size={14} /> 在视频号中打开
                  </a>
                </div>
              )}
              
              <div className="work-play-info">
                <p>{selectedWorkForModal.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
