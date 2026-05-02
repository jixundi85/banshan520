import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, Calendar, Clock, Users, CheckCircle, 
  Star, Award, Gift, Sparkles, ChevronRight, Check,
  ZoomIn, Heart, Share2, ChevronLeft, ChevronRight as ChevRight
} from 'lucide-react'
import UserLayout from '../../components/UserLayout'

// 特训营数据
const CAMPS_DATA = {
  // 线下特训
  'offline-1': {
    id: 'offline-1',
    title: 'AIGC短视频实战特训营',
    subtitle: '3天2夜现场集训',
    description: '三天两夜高强度实战训练，导师面对面指导，完成商业级AI短视频作品',
    location: '深圳·南山科技园',
    date: '2026年5月15-17日',
    duration: '3天2夜',
    price: 9999,
    originalPrice: 19999,
    spots: 30,
    enrolled: 18,
    gradient: 'from-orange-500 to-red-500',
    coverImage: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&h=450&fit=crop',
    features: ['导师面授', '现场实操', '作品点评', '资源对接'],
    highlight: '前10名报名立减2000元',
    trainer: {
      name: '王导',
      title: '资深AI视频导演',
      avatar: '王',
      bio: '10年影视制作经验，专注于AI视频创作与教学，累计培养学员5000+',
      achievements: ['抖音千万级账号操盘手', '多部AI短片入围国际电影节']
    },
    schedule: [
      { day: 'Day 1', title: 'AI视频基础与工具入门', content: 'AI视频原理、主流工具对比、基础操作实战' },
      { day: 'Day 2', title: '商业视频创作全流程', content: '脚本策划、AI生成、后期剪辑、调色包装' },
      { day: 'Day 3', title: '作品打磨与发布运营', content: '作品点评优化、平台算法、流量变现策略' }
    ],
    includes: ['3天2夜线下培训', '专业导师1v1指导', '完整项目实战', '结业证书', '终身学习社群', '就业推荐机会'],
    faq: [
      { q: '零基础可以参加吗？', a: '可以，课程从基础讲起，适合零基础学员。' },
      { q: '需要自带电脑吗？', a: '建议自带笔记本电脑，现场也提供设备租赁服务。' },
      { q: '培训后有什么支持？', a: '结业后进入终身学习社群，导师持续答疑，定期组织线下交流活动。' }
    ]
  },
  'offline-2': {
    id: 'offline-2',
    title: 'AI广告电影制作特训营',
    subtitle: '5天4夜影视级特训',
    description: '五天四夜沉浸式学习，从创意到成片，产出专业级AI广告电影作品',
    location: '杭州·西湖区',
    date: '2026年6月20-24日',
    duration: '5天4夜',
    price: 25999,
    originalPrice: 39999,
    spots: 20,
    enrolled: 8,
    gradient: 'from-purple-500 to-pink-500',
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop',
    features: ['导演指导', '专业设备', '项目实战', '作品发布'],
    highlight: '含2个月后期指导',
    trainer: {
      name: '李导',
      title: '知名广告导演',
      avatar: '李',
      bio: '15年广告导演经验，服务过众多知名品牌，AI广告领域先驱者',
      achievements: ['戛纳广告节获奖导演', 'AI广告作品播放量破亿']
    },
    schedule: [
      { day: 'Day 1-2', title: 'AI广告创意与策划', content: '品牌洞察、创意发想、脚本撰写、分镜设计' },
      { day: 'Day 3-4', title: 'AI视频制作实战', content: 'AI生成高级技巧、实拍结合、特效合成' },
      { day: 'Day 5', title: '后期与发布策略', content: '剪辑调色、音效设计、平台投放策略' }
    ],
    includes: ['5天4夜线下培训', '专业拍摄设备使用', '完整广告项目实战', '结业证书', '2个月后期指导', '优秀作品直推品牌方'],
    faq: [
      { q: '需要有拍摄经验吗？', a: '建议有基础视频制作经验，但AI部分从零教学。' },
      { q: '作品版权归谁？', a: '学员作品版权归学员所有，可用于个人作品集。' }
    ]
  },
  'offline-3': {
    id: 'offline-3',
    title: 'AI短剧创作特训营',
    subtitle: '4天3夜编剧实战',
    description: '四天三夜编剧与拍摄实战，完整体验AI短剧从创意到上线的全流程',
    location: '北京·朝阳CBD',
    date: '2026年5月28-31日',
    duration: '4天3夜',
    price: 15999,
    originalPrice: 29999,
    spots: 25,
    enrolled: 12,
    gradient: 'from-blue-500 to-cyan-500',
    coverImage: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&h=450&fit=crop',
    features: ['剧本打磨', 'AI分镜', '后期制作', '发行指导'],
    highlight: '优秀作品直接签约',
    trainer: {
      name: '张编剧',
      title: '知名短剧编剧',
      avatar: '张',
      bio: '多部爆款短剧编剧，深谙短剧创作规律与AI应用',
      achievements: ['单部短剧播放量破10亿', 'AI短剧开创者']
    },
    schedule: [
      { day: 'Day 1', title: '短剧市场与剧本创作', content: '市场分析、人物塑造、情节设计、AI辅助编剧' },
      { day: 'Day 2', title: 'AI分镜与视觉设计', content: '分镜绘制、AI场景生成、角色设计' },
      { day: 'Day 3', title: '拍摄与制作实战', content: '拍摄技巧、AI合成、剪辑节奏' },
      { day: 'Day 4', title: '上线与运营策略', content: '平台选择、推广策略、变现模式' }
    ],
    includes: ['4天3夜线下培训', '剧本1v1指导', '完整短剧项目实战', '结业证书', '平台发行对接', '优秀作品签约机会'],
    faq: [
      { q: '需要有编剧基础吗？', a: '欢迎零基础，课程从故事原理讲起。' }
    ]
  },
  // 线上特训
  'online-1': {
    id: 'online-1',
    title: 'AI视频创作线上特训营',
    subtitle: '21天系统训练营',
    description: '21天系统学习，从入门到精通，掌握AI视频创作核心技能',
    startDate: '2026年5月20日开课',
    duration: '21天',
    price: 2999,
    originalPrice: 5999,
    enrolled: '2,580',
    gradient: 'from-emerald-500 to-teal-500',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
    features: ['直播授课', '作业点评', '社群答疑', '永久回放'],
    highlight: '早鸟价限时优惠',
    trainer: {
      name: '陈老师',
      title: 'AI视频教育专家',
      avatar: '陈',
      bio: '8年在线教育经验，AI视频课程累计学员10万+',
      achievements: ['畅销书《AI视频创作指南》作者']
    },
    schedule: [
      { day: 'Week 1', title: 'AI视频基础入门', content: '工具选择、基础操作、简单项目实战' },
      { day: 'Week 2', title: '进阶技巧与创意', content: '高级参数、风格化创作、商业应用' },
      { day: 'Week 3', title: '项目实战与变现', content: '完整项目、作品集打造、接单技巧' }
    ],
    includes: ['21天系统课程', '每周直播答疑', '作业1v1点评', '永久回放权限', '学习社群', '接单资源对接'],
    faq: [
      { q: '错过直播怎么办？', a: '所有课程提供永久回放，可随时观看。' }
    ]
  },
  'online-2': {
    id: 'online-2',
    title: 'AI设计师线上特训营',
    subtitle: '14天速成训练营',
    description: '14天快速掌握AI设计工具，做出高质量商业设计作品',
    startDate: '2026年5月25日开课',
    duration: '14天',
    price: 1999,
    originalPrice: 3999,
    enrolled: '1,890',
    gradient: 'from-violet-500 to-purple-500',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop',
    features: ['案例教学', '实战作业', '导师点评', '就业指导'],
    highlight: '结业送作品集模板',
    trainer: {
      name: '林设计',
      title: '资深视觉设计师',
      avatar: '林',
      bio: '10年设计经验，服务过腾讯、阿里等知名企业',
      achievements: ['红点设计奖获得者']
    },
    schedule: [
      { day: 'Week 1', title: 'AI设计工具精通', content: 'Midjourney、Stable Diffusion深度使用' },
      { day: 'Week 2', title: '商业设计实战', content: '海报、包装、UI设计项目实战' }
    ],
    includes: ['14天系统课程', '商业案例拆解', '作品集指导', '结业证书', '就业推荐'],
    faq: []
  },
  'online-3': {
    id: 'online-3',
    title: 'AI短剧编剧线上特训营',
    subtitle: '30天编剧进阶营',
    description: '30天系统学习短剧编剧，掌握AI辅助创作，产出完整剧本',
    startDate: '2026年6月1日开课',
    duration: '30天',
    price: 3999,
    originalPrice: 7999,
    enrolled: '980',
    gradient: 'from-rose-500 to-pink-500',
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f58b8c0?w=800&h=450&fit=crop',
    features: ['剧本工坊', 'AI编剧', '投稿指导', '平台对接'],
    highlight: '优秀剧本直推平台',
    trainer: {
      name: '赵编剧',
      title: '爆款短剧编剧',
      avatar: '赵',
      bio: '多部短剧编剧作品，深谙短剧创作与平台规则',
      achievements: ['编剧作品累计播放量50亿+']
    },
    schedule: [
      { day: 'Week 1-2', title: '短剧编剧基础', content: '故事结构、人物塑造、情节设计' },
      { day: 'Week 3', title: 'AI辅助创作', content: 'AI编剧工具、效率提升技巧' },
      { day: 'Week 4', title: '剧本打磨与投稿', content: '剧本修改、平台投稿、签约谈判' }
    ],
    includes: ['30天系统课程', '剧本1v1指导', '平台投稿对接', '结业证书', '签约机会'],
    faq: []
  }
}

export default function CampDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [camp, setCamp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('intro')
  const [showPayment, setShowPayment] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [liked, setLiked] = useState(false)

  // 模拟多图展示（实际可用camp中的多图）
  const galleryImages = camp ? [
    camp.coverImage,
    camp.coverImage.replace('w=800', 'w=1200').replace('fit=crop', 'fit=fill'),
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop',
  ] : []

  useEffect(() => {
    const campData = CAMPS_DATA[id]
    if (campData) {
      setCamp(campData)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white">加载中...</div>
        </div>
      </UserLayout>
    )
  }

  if (!camp) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-xl mb-4">特训营不存在</div>
            <button 
              onClick={() => navigate('/training')}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg"
            >
              返回特训营
            </button>
          </div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#0f172a]">
        {/* 顶部导航 - 暗色玻璃 */}
        <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
            <button 
              onClick={() => navigate('/training')}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-semibold truncate">{camp.title}</h1>
            </div>
          </div>
        </div>

        {/* ========== 商品展示区 - 淘宝风格（暗色） ========== */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* ========== 左侧：主图 ========== */}
            <div className="lg:w-[450px] flex-shrink-0">
              {/* 主图 - 玻璃卡片 */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <div 
                  className="relative aspect-square cursor-zoom-in"
                  onClick={() => setShowFullscreen(true)}
                >
                  <img 
                    src={galleryImages[activeImage]} 
                    alt={camp.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* 标签 */}
                  <div className={`absolute top-4 left-4 px-4 py-2 bg-gradient-to-r ${camp.gradient} rounded-lg text-sm font-bold text-white shadow-lg`}>
                    {camp.subtitle}
                  </div>
                  {/* 数量 */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-lg">
                    {activeImage + 1}/{galleryImages.length}
                  </div>
                  {/* 放大提示 */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                    <div className="bg-black/70 backdrop-blur-sm rounded-full p-4">
                      <ZoomIn size={32} className="text-white" />
                    </div>
                  </div>
                </div>
                
                {/* 左右切换 */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev > 0 ? prev - 1 : galleryImages.length - 1) }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-white/10"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev < galleryImages.length - 1 ? prev + 1 : 0) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-white/10"
                >
                  <ChevRight size={20} className="text-white" />
                </button>
              </div>

              {/* 缩略图 */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex-shrink-0 w-[72px] h-[72px] rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx 
                        ? 'border-purple-500 shadow-md shadow-purple-500/30' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={img} alt={`${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* 操作 */}
              <div className="flex items-center gap-4 mt-4 text-white/50">
                <button 
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-1.5 text-sm hover:text-pink-400 transition-colors ${liked ? 'text-pink-400' : ''}`}
                >
                  <Heart size={16} className={liked ? 'fill-pink-400' : ''} />
                  <span>{liked ? '已收藏' : '收藏'}</span>
                </button>
                <span className="text-white/20">|</span>
                <button className="flex items-center gap-1.5 text-sm hover:text-white transition-colors">
                  <Share2 size={16} />
                  <span>分享</span>
                </button>
              </div>
            </div>

            {/* ========== 右侧：商品信息 ========== */}
            <div className="flex-1 min-w-0">
              
              {/* 标题 */}
              <div className="mb-5">
                <h1 className="text-2xl font-bold text-white leading-snug mb-2">
                  {camp.title}
                </h1>
                <p className="text-white/50">{camp.description}</p>
              </div>

              {/* 价格 - 暗色卡片 */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 mb-5 border border-white/10">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-white/50">活动价</span>
                  <span className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">¥{camp.price.toLocaleString()}</span>
                  <span className="text-white/30 line-through text-xl">¥{camp.originalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded">特惠</span>
                  <span className="text-pink-400 text-sm">节省 ¥{(camp.originalPrice - camp.price).toLocaleString()}</span>
                </div>
              </div>

              {/* 规格 - 玻璃卡片 */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-5 overflow-hidden">
                {camp.location && (
                  <div className="flex items-center px-5 py-4 border-b border-white/5">
                    <span className="w-20 text-white/40 text-sm flex-shrink-0">培训地点</span>
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin size={14} className="text-purple-400" />
                      <span>{camp.location}</span>
                    </div>
                  </div>
                )}
                {camp.date && (
                  <div className="flex items-center px-5 py-4 border-b border-white/5">
                    <span className="w-20 text-white/40 text-sm flex-shrink-0">培训时间</span>
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar size={14} className="text-purple-400" />
                      <span>{camp.date}</span>
                    </div>
                  </div>
                )}
                {camp.startDate && (
                  <div className="flex items-center px-5 py-4 border-b border-white/5">
                    <span className="w-20 text-white/40 text-sm flex-shrink-0">开课时间</span>
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar size={14} className="text-purple-400" />
                      <span>{camp.startDate}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center px-5 py-4 border-b border-white/5">
                  <span className="w-20 text-white/40 text-sm flex-shrink-0">培训周期</span>
                  <div className="flex items-center gap-2 text-white/90">
                    <Clock size={14} className="text-purple-400" />
                    <span>{camp.duration}</span>
                  </div>
                </div>
                {camp.spots && (
                  <div className="flex items-center px-5 py-4">
                    <span className="w-20 text-white/40 text-sm flex-shrink-0">剩余名额</span>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[140px]">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                          style={{ width: `${(camp.enrolled / camp.spots) * 100}%` }}
                        />
                      </div>
                      <span className="text-pink-400 font-medium">{camp.spots - camp.enrolled}人</span>
                      <span className="text-white/30 text-sm">/ 共{camp.spots}人</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 特色 - 玻璃卡片 */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 mb-5">
                <div className="flex flex-wrap gap-2">
                  {camp.features.map(f => (
                    <span key={f} className="px-3 py-1.5 bg-white/5 text-white/70 text-sm rounded-lg flex items-center gap-1.5 border border-white/5">
                      <Check size={13} className="text-purple-400" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* 亮点 */}
              {camp.highlight && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl px-5 py-3 mb-5 border border-purple-500/20 flex items-center gap-2">
                  <Gift size={16} className="text-purple-400" />
                  <span className="text-purple-300 text-sm font-medium">{camp.highlight}</span>
                </div>
              )}

              {/* 导师 - 玻璃卡片 */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 mb-5">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${camp.gradient} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                    {camp.trainer.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold">{camp.trainer.name}</div>
                    <div className="text-white/50 text-sm">{camp.trainer.title}</div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white text-sm rounded-lg transition-all font-medium border border-pink-500/50">
                    关注
                  </button>
                </div>
                <p className="mt-4 text-white/50 text-sm leading-relaxed">{camp.trainer.bio}</p>
              </div>

              {/* 购买 - 玻璃卡片 */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sticky top-[68px]">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-white/40 text-xs">支付金额</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">¥{camp.price.toLocaleString()}</div>
                  </div>
                  <button 
                    onClick={() => setShowPayment(true)}
                    className={`flex-1 py-4 bg-gradient-to-r ${camp.gradient} text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all shadow-lg`}
                  >
                    立即报名
                  </button>
                </div>
                <div className="flex items-center justify-center gap-4 mt-3 text-white/40 text-xs">
                  <span>支付宝</span>
                  <span>|</span>
                  <span>微信支付</span>
                  <span>|</span>
                  <span>报名后不支持退款</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== 商品详情区 - 暗色 ========== */}
        <div className="bg-slate-900/50 border-t border-white/10 mt-8">
          {/* Tab - 暗色玻璃 */}
          <div className="sticky top-[68px] z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex gap-12">
                {[
                  { id: 'intro', label: '课程介绍' },
                  { id: 'schedule', label: '课程安排' },
                  { id: 'includes', label: '包含服务' },
                  { id: 'faq', label: '常见问题' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 text-base font-medium border-b-2 transition-all ${
                      activeTab === tab.id 
                        ? 'text-purple-400 border-purple-400' 
                        : 'text-white/50 border-transparent hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 内容 */}
          <div className="max-w-7xl mx-auto px-4 py-10">
            {activeTab === 'intro' && (
              <div className="space-y-8">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-4">课程简介</h2>
                  <p className="text-white/60 leading-loose text-lg">{camp.description}</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-6">导师介绍</h2>
                  <div className="flex items-start gap-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${camp.gradient} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                      {camp.trainer.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">{camp.trainer.name}</h3>
                      <p className="text-purple-400 font-medium mb-3">{camp.trainer.title}</p>
                      <p className="text-white/50 mb-4 leading-relaxed">{camp.trainer.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {camp.trainer.achievements.map(a => (
                          <span key={a} className="px-3 py-1.5 bg-purple-500/10 text-purple-300 text-sm rounded-lg flex items-center gap-1 border border-purple-500/20">
                            <Award size={14} />
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-white mb-6">课程安排</h2>
                {camp.schedule.map((item, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex gap-6 hover:bg-white/10 transition-all">
                    <div className={`w-24 h-24 rounded-xl bg-gradient-to-r ${camp.gradient} flex flex-col items-center justify-center text-white font-bold shadow-lg flex-shrink-0`}>
                      <span className="text-xs opacity-80">DAY</span>
                      <span className="text-xl">{item.day.replace('Day ', '').replace('Week ', 'W')}</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-white/50 leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'includes' && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-white mb-6">包含服务</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {camp.includes.map((item, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${camp.gradient} flex items-center justify-center shadow-lg`}>
                        <Check size={22} className="text-white" />
                      </div>
                      <span className="text-white/90 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'faq' && camp.faq.length > 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-white mb-6">常见问题</h2>
                {camp.faq.map((item, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="w-7 h-7 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">Q</span>
                      {item.q}
                    </h3>
                    <p className="text-white/50 leading-relaxed pl-9">A: {item.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 全屏图片 */}
        {showFullscreen && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setShowFullscreen(false)}
          >
            <button 
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl"
              onClick={() => setShowFullscreen(false)}
            >
              ✕
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev > 0 ? prev - 1 : galleryImages.length - 1) }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev < galleryImages.length - 1 ? prev + 1 : 0) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
            >
              <ChevRight size={28} />
            </button>
            <img 
              src={galleryImages[activeImage]} 
              alt={camp.title} 
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 text-white text-lg">
              {activeImage + 1} / {galleryImages.length}
            </div>
          </div>
        )}

        {/* 支付 */}
        {showPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowPayment(false)}>
            <div className="bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">确认报名</h3>
                <button onClick={() => setShowPayment(false)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white/70">✕</button>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                <div className="flex gap-4">
                  <img src={camp.coverImage} alt="" className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="text-white/40 text-sm mb-1">课程名称</div>
                    <div className="text-white font-medium mb-2">{camp.title}</div>
                    <div className="text-white/40 text-sm mb-1">支付金额</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">¥{camp.price.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all text-lg border border-blue-500/50">
                  支付宝支付
                </button>
                <button className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all text-lg border border-green-500/50">
                  微信支付
                </button>
              </div>
              <p className="text-center text-white/40 text-sm">报名后不支持退款，请确认后再支付</p>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  )
}
