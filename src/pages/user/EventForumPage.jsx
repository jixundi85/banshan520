import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Trophy, Clock, Users, Video, Play, Award,
  Calendar, MapPin, ChevronRight, Star, Heart,
  Share2, Eye, CheckCircle, AlertCircle, Sparkles,
  TrendingUp, Medal, Ticket, ArrowRight, MessageSquare,
  Image
} from 'lucide-react'
import './EventForumPage.css'

// ======= 赞助企业数据 =======
const SPONSOR_COMPANIES = [
  {
    id: 1,
    name: '星耀科技',
    brand: 'STARLIGHT TECH',
    logo: '⭐',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    brief: '全球领先的AI影像技术公司',
    tagline: '用AI重新定义影像创作',
    requirements: [
      '突出产品的AI智能化特点',
      '展示真实应用场景',
      '时长控制在2-4分钟',
      '画面质量需达到4K标准'
    ],
    participants: 156,
    minParticipants: 10,
    status: 'open',
    videos: [
      { id: 1, title: '星耀AI产品宣传片', author: '创作者小王', views: 12580, duration: '3:25' },
      { id: 2, title: 'AI改变生活', author: '视频达人阿明', views: 8960, duration: '2:58' },
      { id: 3, title: '智能影像新时代', author: '科技评测师', views: 7230, duration: '3:12' }
    ]
  },
  {
    id: 2,
    name: '云创数字',
    brand: 'YUNCHUANG DIGITAL',
    logo: '☁️',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    brief: '数字化转型解决方案专家',
    tagline: '数字化转型，从云创开始',
    requirements: [
      '体现企业服务的专业性',
      '展示数字化应用场景',
      '时长控制在2-4分钟',
      '需要有数据可视化元素'
    ],
    participants: 89,
    minParticipants: 10,
    status: 'open',
    videos: [
      { id: 1, title: '云创数字化解决方案', author: '数字营销官', views: 9800, duration: '3:45' }
    ]
  },
  {
    id: 3,
    name: '未来智造',
    brand: 'FUTURE MAKER',
    logo: '🤖',
    gradient: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
    brief: '智能制造与工业自动化',
    tagline: '智造未来，引领变革',
    requirements: [
      '展示智能制造场景',
      '体现科技感与未来感',
      '时长控制在2-4分钟',
      '需要有工厂实拍素材'
    ],
    participants: 67,
    minParticipants: 10,
    status: 'open',
    videos: []
  },
  {
    id: 4,
    name: '蓝海创意',
    brand: 'BLUEOCEAN CREATIVE',
    logo: '🌊',
    gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    brief: '品牌营销与创意内容',
    tagline: '创意无界，蓝海无垠',
    requirements: [
      '突出创意与美感',
      '展现品牌价值主张',
      '时长控制在2-4分钟',
      '需要有强烈的视觉冲击'
    ],
    participants: 134,
    minParticipants: 10,
    status: 'open',
    videos: [
      { id: 1, title: '蓝海品牌故事', author: '品牌策划师', views: 15200, duration: '2:30' },
      { id: 2, title: '创意的力量', author: '视觉设计师', views: 11000, duration: '3:05' }
    ]
  },
  {
    id: 5,
    name: '智慧生活',
    brand: 'SMART LIFE',
    logo: '🏠',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    brief: '智能家居与智慧生活解决方案',
    tagline: '让家更智慧，让生活更美好',
    requirements: [
      '展示智能家居应用场景',
      '体现便捷与舒适',
      '时长控制在2-4分钟',
      '需要有生活化元素'
    ],
    participants: 98,
    minParticipants: 10,
    status: 'open',
    videos: []
  },
  {
    id: 6,
    name: '数字艺术',
    brand: 'DIGITAL ART',
    logo: '🎨',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    brief: '数字艺术创作与NFT平台',
    tagline: '艺术数字化，创意永留存',
    requirements: [
      '突出艺术创意',
      '展示数字艺术魅力',
      '时长控制在2-4分钟',
      '需要有独特视觉风格'
    ],
    participants: 45,
    minParticipants: 10,
    status: 'open',
    videos: []
  },
  {
    id: 7,
    name: '绿色能源',
    brand: 'GREEN ENERGY',
    logo: '⚡',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    brief: '新能源与可持续发展',
    tagline: '绿色地球，从能源开始',
    requirements: [
      '体现绿色环保理念',
      '展示新能源应用',
      '时长控制在2-4分钟',
      '需要有科技感元素'
    ],
    participants: 72,
    minParticipants: 10,
    status: 'open',
    videos: []
  },
  {
    id: 8,
    name: '健康科技',
    brand: 'HEALTH TECH',
    logo: '💊',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    brief: '医疗健康与生物科技',
    tagline: '科技守护健康，创新引领未来',
    requirements: [
      '体现科技与人文关怀',
      '展示健康科技产品',
      '时长控制在2-4分钟',
      '需要有温暖感元素'
    ],
    participants: 58,
    minParticipants: 10,
    status: 'open',
    videos: []
  },
  {
    id: 9,
    name: '教育未来',
    brand: 'EDU FUTURE',
    logo: '📚',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    brief: '在线教育与智慧学习',
    tagline: '让学习更高效，让未来更美好',
    requirements: [
      '突出教育创新',
      '展示学习场景',
      '时长控制在2-4分钟',
      '需要有趣味性元素'
    ],
    participants: 112,
    minParticipants: 10,
    status: 'open',
    videos: []
  },
  {
    id: 10,
    name: '元宇宙空间',
    brand: 'META SPACE',
    logo: '🌐',
    gradient: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    brief: '元宇宙与虚拟现实',
    tagline: '连接现实与虚拟，探索无限可能',
    requirements: [
      '体现元宇宙概念',
      '展示VR/AR应用',
      '时长控制在2-4分钟',
      '需要有未来科技感'
    ],
    participants: 89,
    minParticipants: 10,
    status: 'open',
    videos: []
  }
]

// ======= OPC 评委数据 =======
const JUDGES = [
  {
    id: 1,
    name: '张明远',
    avatar: '/images/judges/Professional_headshot_photo_of_2026-04-09T12-26-52.png',
    title: '首席创意官',
    company: '国际4A广告公司',
    bio: '从业20年，服务过上百个国际品牌，创意作品多次获得戛纳金狮奖'
  },
  {
    id: 2,
    name: '李艺涵',
    avatar: '/images/judges/Chinese_woman_40_years_old_pro_2026-04-09T12-38-17.png',
    title: 'AI影像专家',
    company: '清华大学人工智能研究院',
    bio: '深耕AI影像生成领域，发表SCI论文20余篇，专利10余项'
  },
  {
    id: 3,
    name: '王海涛',
    avatar: '/images/judges/Asian_male_executive_portrait__2026-04-09T12-40-16.png',
    title: '短视频营销导师',
    company: '头部MCN机构',
    bio: '操盘多个爆款账号，全网粉丝超过5000万，月GMV破亿'
  },
  {
    id: 4,
    name: '陈思琪',
    avatar: '/images/judges/Chinese_woman_40_years_old_pro_2026-04-09T12-38-17.png',
    title: '品牌策略总监',
    company: '世界500强企业',
    bio: '15年品牌营销经验，擅长品牌定位与创意传播'
  },
  {
    id: 5,
    name: '刘文博',
    avatar: '/images/judges/Asian_male_executive_portrait__2026-04-09T12-40-16.png',
    title: '视频创作达人',
    company: '头部视频平台',
    bio: '全网TOP10视频创作者，单条视频播放量突破5亿'
  }
]

// ======= 奖项设置数据 =======
const AWARDS = [
  {
    id: 'champion',
    rank: '冠军',
    rankEn: 'CHAMPION',
    count: 1,
    prize: '500000',
    color: 'gold',
    icon: '🏆',
    title: '半山AI年度金牌创作者',
    benefits: [
      '颁发官方冠军荣誉证书',
      '平台首页置顶推荐一年',
      '优先签约平台独家合作',
      '直通OPC大会颁奖盛典并上台领奖',
      '获得平台全年流量扶持与商业变现对接'
    ]
  },
  {
    id: 'runnerup',
    rank: '亚军',
    rankEn: 'RUNNER-UP',
    count: 1,
    prize: '200000',
    color: 'silver',
    icon: '🥈',
    title: '半山AI年度银牌创作者',
    benefits: [
      '颁发官方亚军荣誉证书',
      '平台首页重点推荐半年',
      '优先参与平台商业项目合作',
      '获得半年流量扶持包'
    ]
  },
  {
    id: 'third',
    rank: '季军',
    rankEn: 'THIRD PLACE',
    count: 1,
    prize: '100000',
    color: 'bronze',
    icon: '🥉',
    title: '半山AI年度铜牌创作者',
    benefits: [
      '颁发官方季军荣誉证书',
      '平台重点推荐三个月',
      '获得商业合作优先对接权'
    ]
  },
  {
    id: 'excellent',
    rank: '优秀奖',
    rankEn: 'EXCELLENT',
    count: 10,
    prize: '10000',
    color: 'purple',
    icon: '⭐',
    title: '半山AI优秀创作者',
    benefits: [
      '授予电子荣誉证书',
      '获得平台官方认证标识',
      '获得精品课程与学习资源礼包'
    ]
  },
  {
    id: 'participation',
    rank: '人气参与奖',
    rankEn: 'PARTICIPATION',
    count: '若干',
    prize: null,
    color: 'blue',
    icon: '🎖️',
    title: '赛事参与荣誉证书',
    benefits: [
      '颁发参与荣誉证书',
      '获得平台积分与新手变现课程',
      '优秀作品将在赛事专区展示'
    ]
  }
]

// ======= 入围名单数据 =======
const FINALISTS = [
  {
    category: '年度最佳创意奖',
    nominees: [
      { name: 'AI视界', author: '创意先锋', work: '《智能未来》', highlight: '视觉震撼，创意满分' },
      { name: '数字梦工厂', author: '影视达人', work: '《虚拟人生》', highlight: 'AI技术与艺术完美结合' },
      { name: '光影工坊', author: '视觉艺术家', work: '《平行世界》', highlight: '独特的视觉叙事风格' }
    ]
  },
  {
    category: '年度最佳商业价值奖',
    nominees: [
      { name: '带货王', author: '电商老王', work: '《品牌故事》', highlight: '单条视频带来百万GMV' },
      { name: '营销新势力', author: '小李', work: '《新品发布》', highlight: '精准触达目标用户' }
    ]
  },
  {
    category: '年度最佳技术应用奖',
    nominees: [
      { name: 'AI极客', author: '技术宅', work: '《AI实验室》', highlight: '创新运用多种AI工具' },
      { name: '技术派', author: '程序媛', work: '《未来工厂》', highlight: 'AI与工业完美融合' }
    ]
  }
]

// ======= 时间轴数据 =======
const TIMELINE = [
  { date: '2026-04-01', title: '作品征集启动', desc: '开放作品提交通道' },
  { date: '2026-04-15', title: '作品征集截止', desc: '所有作品提交结束' },
  { date: '2026-04-16-20', title: '作品评审期', desc: '评委进行专业评审' },
  { date: '2026-04-21', title: '入围名单公示', desc: '公布各奖项入围名单' },
  { date: '2026-04-25', title: '年度盛典', desc: 'OPC创作者颁奖大会' }
]

// ======= 往届回顾数据 =======
const PAST_EVENTS = [
  {
    year: '2025',
    theme: '首届OPC创作者盛典',
    highlights: ['参会人数突破5000+', '获奖作品200+', '线上观看1亿+'],
    images: 3,
    videos: 12
  },
  {
    year: '2024',
    theme: 'AI创意峰会',
    highlights: ['参会人数3000+', '获奖作品150+', '线上观看5000万+'],
    images: 2,
    videos: 8
  }
]

// ======= 倒计时组件 =======
function CountdownTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isEnded, setIsEnded] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const deadlineTime = new Date(deadline).getTime()
      const difference = deadlineTime - now

      if (difference <= 0) {
        setIsEnded(true)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  if (isEnded) {
    return <div className="ef-countdown-ended">投稿已截止</div>
  }

  return (
    <div className="ef-countdown">
      <div className="ef-countdown-label">距离投稿截止仅剩</div>
      <div className="ef-countdown-numbers">
        <div className="ef-countdown-item">
          <span className="ef-countdown-num">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="ef-countdown-unit">天</span>
        </div>
        <span className="ef-countdown-sep">:</span>
        <div className="ef-countdown-item">
          <span className="ef-countdown-num">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="ef-countdown-unit">时</span>
        </div>
        <span className="ef-countdown-sep">:</span>
        <div className="ef-countdown-item">
          <span className="ef-countdown-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="ef-countdown-unit">分</span>
        </div>
        <span className="ef-countdown-sep">:</span>
        <div className="ef-countdown-item">
          <span className="ef-countdown-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="ef-countdown-unit">秒</span>
        </div>
      </div>
    </div>
  )
}

// ======= 企业卡片组件 =======
function CompanyCard({ company, isRegistered, onRegister, onUpload }) {
  const [showAllVideos, setShowAllVideos] = useState(false)

  const displayedVideos = showAllVideos ? company.videos : company.videos.slice(0, 3)

  return (
    <div className="ef-company-card">
      <div className="ef-company-header" style={{ background: company.gradient }}>
        <div className="ef-company-logo">{company.logo}</div>
        <div className="ef-company-info">
          <h3 className="ef-company-name">{company.name}</h3>
          <p className="ef-company-brand">{company.brand}</p>
        </div>
      </div>

      <div className="ef-company-body">
        <p className="ef-company-brief">{company.brief}</p>

        <div className="ef-company-tagline">
          <Sparkles size={14} />
          <span>"{company.tagline}"</span>
        </div>

        <div className="ef-company-requirements">
          <h4>广告制作要求</h4>
          <ul>
            {company.requirements.map((req, idx) => (
              <li key={idx}><ChevronRight size={14} /> {req}</li>
            ))}
          </ul>
        </div>

        <div className="ef-company-stats">
          <div className="ef-stat-item">
            <Users size={16} />
            <span>已参与 <strong>{company.participants}</strong> 人</span>
          </div>
          <div className="ef-stat-divider">|</div>
          <div className="ef-stat-item">
            <Video size={16} />
            <span><strong>{company.videos.length}</strong> 部作品</span>
          </div>
        </div>

        <div className="ef-company-actions">
          {isRegistered ? (
            <>
              <button className="ef-btn ef-btn-success">
                <CheckCircle size={16} />
                已报名参与
              </button>
              <button className="ef-btn ef-btn-primary" onClick={onUpload}>
                <Upload size={16} />
                上传作品
              </button>
            </>
          ) : (
            <button className="ef-btn ef-btn-primary" onClick={onRegister}>
              <Trophy size={16} />
              参与该企业广告创作
            </button>
          )}
        </div>

        {company.videos.length > 0 && (
          <div className="ef-company-videos">
            <h4>参赛作品展示</h4>
            <div className="ef-video-list">
              {displayedVideos.map(video => (
                <div key={video.id} className="ef-video-item">
                  <div className="ef-video-thumb">
                    <Video size={24} />
                    <span className="ef-video-duration">{video.duration}</span>
                  </div>
                  <div className="ef-video-info">
                    <p className="ef-video-title">{video.title}</p>
                    <p className="ef-video-author">@{video.author}</p>
                    <div className="ef-video-views">
                      <Eye size={12} /> {video.views.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {company.videos.length > 3 && (
              <button className="ef-show-more" onClick={() => setShowAllVideos(!showAllVideos)}>
                {showAllVideos ? '收起' : `查看全部 ${company.videos.length} 部作品`}
                <ChevronRight size={14} className={showAllVideos ? 'rotate-90' : ''} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ======= 评委卡片组件 =======
function JudgeCard({ judge }) {
  return (
    <div className="ef-judge-card">
      <div className="ef-judge-avatar">
        {judge.avatar.startsWith('/') ? (
          <img src={judge.avatar} alt={judge.name} />
        ) : (
          judge.avatar
        )}
      </div>
      <div className="ef-judge-info">
        <h4>{judge.name}</h4>
        <p className="ef-judge-title">{judge.title}</p>
        <p className="ef-judge-company">{judge.company}</p>
        <p className="ef-judge-bio">{judge.bio}</p>
      </div>
    </div>
  )
}

// ======= 奖项卡片组件 =======
function AwardCard({ award, isChampion }) {
  const colorClass = {
    gold: 'ef-award-gold',
    silver: 'ef-award-silver',
    bronze: 'ef-award-bronze',
    purple: 'ef-award-purple',
    blue: 'ef-award-blue'
  }[award.color] || 'ef-award-purple'

  return (
    <div className={`ef-award-card ${colorClass} ${isChampion ? 'ef-award-champion' : ''}`}>
      {isChampion && <div className="ef-award-crown">👑</div>}
      <div className="ef-award-header">
        <span className="ef-award-icon">{award.icon}</span>
        <div className="ef-award-rank">
          <span className="ef-award-rank-zh">{award.rank}</span>
          <span className="ef-award-rank-en">{award.rankEn}</span>
        </div>
        <span className="ef-award-count">×{award.count}</span>
      </div>

      {award.prize && (
        <div className="ef-award-prize">
          <span className="ef-award-prize-symbol">¥</span>
          <span className="ef-award-prize-amount">{parseInt(award.prize).toLocaleString()}</span>
        </div>
      )}

      <div className="ef-award-title">{award.title}</div>

      <div className="ef-award-benefits">
        {award.benefits.map((benefit, index) => (
          <div key={index} className="ef-award-benefit">
            <CheckCircle size={14} />
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ======= 入围名单组件 =======
function NomineeCard({ nominee }) {
  return (
    <div className="ef-nominee-card">
      <div className="ef-nominee-avatar">{nominee.name.charAt(0)}</div>
      <div className="ef-nominee-info">
        <h4>{nominee.name}</h4>
        <p className="ef-nominee-author">@{nominee.author}</p>
        <p className="ef-nominee-work">作品：{nominee.work}</p>
        <p className="ef-nominee-highlight">{nominee.highlight}</p>
      </div>
    </div>
  )
}

// ======= 时间轴组件 =======
function TimelineItem({ item, isLast }) {
  return (
    <div className="ef-timeline-item">
      <div className="ef-timeline-dot"></div>
      {!isLast && <div className="ef-timeline-line"></div>}
      <div className="ef-timeline-content">
        <div className="ef-timeline-date">{item.date}</div>
        <h4>{item.title}</h4>
        <p>{item.desc}</p>
      </div>
    </div>
  )
}

// ======= 往届回顾组件 =======
function PastEventCard({ event }) {
  return (
    <div className="ef-past-card">
      <div className="ef-past-year">{event.year}</div>
      <h3>{event.theme}</h3>
      <div className="ef-past-highlights">
        {event.highlights.map((h, idx) => (
          <span key={idx} className="ef-past-tag">{h}</span>
        ))}
      </div>
      <div className="ef-past-stats">
        <span><Image size={14} /> {event.images} 组图片</span>
        <span><Video size={14} /> {event.videos} 个视频</span>
      </div>
    </div>
  )
}

// ======= 主页面组件 =======
export default function EventForumPage() {
  const [activeTab, setActiveTab] = useState('contest')
  const [registeredCompanies, setRegisteredCompanies] = useState([])
  const [toast, setToast] = useState(null)

  // 截止日期：15天后
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + 15)
  const deadlineStr = deadline.toISOString().split('T')[0]

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleRegister = (companyId) => {
    if (!registeredCompanies.includes(companyId)) {
      setRegisteredCompanies([...registeredCompanies, companyId])
      showToast('报名成功！开始您的15天创作周期吧！', 'success')
    }
  }

  const handleUpload = (companyId) => {
    showToast('作品上传功能开发中...', 'info')
  }

  return (
    <div className="ef-page">
      {toast && (
        <div className={`ef-toast ef-toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Hero */}
      <section className="ef-hero">
        <div className="ef-hero-bg"></div>
        <div className="container-custom ef-hero-content">
          {/* Tab 切换 */}
          <div className="ef-tabs">
            <button
              className={`ef-tab ${activeTab === 'contest' ? 'active' : ''}`}
              onClick={() => setActiveTab('contest')}
            >
              <Trophy size={18} />
              创作者大赛
            </button>
            <button
              className={`ef-tab ${activeTab === 'opc' ? 'active' : ''}`}
              onClick={() => setActiveTab('opc')}
            >
              <Award size={18} />
              OPC 大会
            </button>
          </div>

          {/* 创作者大赛内容 */}
          {activeTab === 'contest' && (
            <>
              <div className="ef-hero-badge">
                <Sparkles size={14} />
                <span>第一期 · AI创意广告大赛</span>
              </div>

              <h1 className="ef-hero-title">
                <span className="gradient-text">半山AIX 创作者大赛</span>
              </h1>

              <CountdownTimer deadline={deadline} />
            </>
          )}

          {/* OPC 大会内容 */}
          {activeTab === 'opc' && (
            <>
              <div className="ef-hero-badge ef-hero-badge-opc">
                <Award size={14} />
                <span>年度顶级创作者盛会</span>
              </div>

              <h1 className="ef-hero-title">
                <span className="gradient-text">OPC 年度创作者盛典</span>
                <span className="ef-title-sub">暨颁奖大会</span>
              </h1>
            </>
          )}
        </div>
      </section>

      {/* 创作者大赛内容区 */}
      {activeTab === 'contest' && (
        <div className="ef-content">
          <div className="container-custom">
            {/* 赛事介绍 */}
            <section className="ef-section">
              <h2 className="ef-section-title">
                <Trophy size={20} />
                赛事介绍
              </h2>
              <div className="ef-intro-card">
                <p>
                  本次大赛以<strong>AI 创意广告</strong>为核心主题，面向全平台创作者开放参赛。
                  大赛联合<strong>10家企业</strong>共同赞助，每家企业均提供专属品牌介绍、官方广告词
                  及广告宣传片制作要求。创作者需运用AI工具，围绕对应企业品牌开展创意广告宣传片创作，
                  以创意彰显品牌价值，借助AI提升内容创作效率。
                </p>
              </div>
            </section>

            {/* 奖项设置 */}
            <section className="ef-section">
              <h2 className="ef-section-title">
                <Medal size={20} />
                奖项设置
                <span className="ef-section-subtitle">总奖金池 ¥1,000,000</span>
              </h2>

              {/* 前三名 - 突出展示 */}
              <div className="ef-awards-top3">
                {AWARDS.slice(0, 3).map((award, index) => (
                  <AwardCard key={award.id} award={award} isChampion={index === 0} />
                ))}
              </div>

              {/* 其他奖项 */}
              <div className="ef-awards-others">
                {AWARDS.slice(3).map(award => (
                  <AwardCard key={award.id} award={award} />
                ))}
              </div>
            </section>

            {/* 参与规则 */}
            <section className="ef-section">
              <h2 className="ef-section-title">
                <CheckCircle size={20} />
                参与规则
              </h2>
              <div className="ef-rules-grid">
                <div className="ef-rule-card">
                  <div className="ef-rule-icon"><Users size={24} /></div>
                  <h3>自由选择</h3>
                  <p>创作者可选择任意一家或多家企业参与广告创作，支持多企业联合参赛</p>
                </div>
                <div className="ef-rule-card">
                  <div className="ef-rule-icon"><TrendingUp size={24} /></div>
                  <h3>人数门槛</h3>
                  <p>每家企业需至少10名及以上创作者参与投稿，不足人数时该企业参赛通道暂不开放评审</p>
                </div>
                <div className="ef-rule-card">
                  <div className="ef-rule-icon"><Clock size={24} /></div>
                  <h3>时长要求</h3>
                  <p>广告宣传片时长需控制在<strong>2分钟～4分钟</strong>区间内</p>
                </div>
                <div className="ef-rule-card">
                  <div className="ef-rule-icon"><Calendar size={24} /></div>
                  <h3>创作周期</h3>
                  <p>整体创作周期为<strong>15天</strong>，需在截止前完成作品上传</p>
                </div>
                <div className="ef-rule-card">
                  <div className="ef-rule-icon"><Star size={24} /></div>
                  <h3>原创保证</h3>
                  <p>参赛作品须为原创内容，严禁抄袭、搬运、侵权行为</p>
                </div>
                <div className="ef-rule-card">
                  <div className="ef-rule-icon"><AlertCircle size={24} /></div>
                  <h3>违规处理</h3>
                  <p>一经核实违规行为，直接取消参赛资格，并保留追究责任的权利</p>
                </div>
              </div>
            </section>

            {/* 赞助企业 */}
            <section className="ef-section">
              <h2 className="ef-section-title">
                <Medal size={20} />
                赞助企业展示区
                <span className="ef-section-sub">共 {SPONSOR_COMPANIES.length} 家企业</span>
              </h2>

              <div className="ef-companies-grid">
                {SPONSOR_COMPANIES.map(company => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    isRegistered={registeredCompanies.includes(company.id)}
                    onRegister={() => handleRegister(company.id)}
                    onUpload={() => handleUpload(company.id)}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* OPC 大会内容区 */}
      {activeTab === 'opc' && (
        <div className="ef-content">
          <div className="container-custom">
            {/* 大会介绍 */}
            <section className="ef-section">
              <h2 className="ef-section-title">
                <Award size={20} />
                大会介绍
              </h2>
              <div className="ef-intro-card ef-intro-card-opc">
                <p>
                  <strong>OPC 大会</strong>是平台年度顶级创作者盛会，专为平台年度优质创作者打造，
                  是平台最高规格的颁奖活动。大会将通过专业评委评审流程，评选<strong>年度优秀作品、
                  年度优秀创作者</strong>，并在盛典现场为获奖对象颁发荣誉证书与对应奖励。
                </p>
              </div>
            </section>

            {/* 评委阵容 */}
            <section className="ef-section">
              <h2 className="ef-section-title">
                <Star size={20} />
                评委阵容
              </h2>
              <div className="ef-judges-grid">
                {JUDGES.map(judge => (
                  <JudgeCard key={judge.id} judge={judge} />
                ))}
              </div>
            </section>

            {/* 入围名单 */}
            <section className="ef-section">
              <h2 className="ef-section-title">
                <Trophy size={20} />
                年度优质创作者入围名单
              </h2>
              <div className="ef-finalists-container">
                {FINALISTS.map((category, idx) => (
                  <div key={idx} className="ef-finalist-category">
                    <h3 className="ef-category-title">{category.category}</h3>
                    <div className="ef-nominees-grid">
                      {category.nominees.map((nominee, nIdx) => (
                        <NomineeCard key={nIdx} nominee={nominee} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 颁奖流程 */}
            <section className="ef-section">
              <h2 className="ef-section-title">
                <Calendar size={20} />
                颁奖流程与时间安排
              </h2>
              <div className="ef-timeline">
                {TIMELINE.map((item, idx) => (
                  <TimelineItem
                    key={idx}
                    item={item}
                    isLast={idx === TIMELINE.length - 1}
                  />
                ))}
              </div>
            </section>

            {/* 往届回顾 */}
            <section className="ef-section">
              <h2 className="ef-section-title">
                <Clock size={20} />
                往届盛典回顾
              </h2>
              <div className="ef-past-grid">
                {PAST_EVENTS.map((event, idx) => (
                  <PastEventCard key={idx} event={event} />
                ))}
              </div>
            </section>

            {/* 报名入口 */}
            <section className="ef-section ef-section-cta">
              <div className="ef-cta-card">
                <div className="ef-cta-icon"><Ticket size={48} /></div>
                <h2>报名参会</h2>
                <p>受邀创作者专属报名通道，开启您的年度荣耀之旅</p>
                <button className="ef-btn ef-btn-primary ef-btn-large">
                  <ArrowRight size={20} />
                  立即报名参会
                </button>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
