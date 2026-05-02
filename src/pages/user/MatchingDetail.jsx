import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Building2, 
  Target, 
  Clock, 
  DollarSign, 
  Zap, 
  CheckCircle2, 
  MessageSquare,
  Share2,
  Bookmark,
  Users,
  Calendar,
  FileText,
  Sparkles,
  Briefcase,
  TrendingUp,
  Shield,
  Award,
  Star,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Clock3,
  Wallet,
  BadgeCheck
} from 'lucide-react'

// 模拟需求数据 - 完全独立的数据结构
const MOCK_DEMANDS = [
  {
    id: 'd-001',
    title: '房地产楼盘航拍宣传视频',
    category: 'AI短视频',
    subCategory: '航拍风格',
    budget: 10000,
    budgetRange: '8k-12k',
    duration: '3分钟',
    deadline: '10天内',
    urgency: 'normal',
    status: 'matching',
    matchScore: 85,
    matchReasons: ['行业匹配', '预算合适', '档期充裕'],
    company: {
      name: '星河地产集团',
      industry: '房地产',
      size: '大型企业',
      location: '深圳',
      verified: true,
      projects: 12,
      rating: 4.9
    },
    description: `我们需要制作一部高端楼盘的航拍宣传视频，用于新盘开盘推广。

【项目背景】
星河湾三期即将开盘，需要一部能够展现楼盘整体规划、周边配套、户型亮点的宣传片。

【具体要求】
1. 航拍镜头：楼盘全景、园林景观、周边商业配套
2. 时长：3分钟左右
3. 风格：高端大气，符合豪宅定位
4. 配音：专业男声，沉稳大气
5. 字幕：中英双语

【参考案例】
可参考万科、碧桂园等头部房企的宣传片风格。`,
    requirements: [
      { icon: Clock, label: '交付周期', value: '10天内' },
      { icon: DollarSign, label: '预算范围', value: '¥8,000 - ¥12,000' },
      { icon: Briefcase, label: '项目类型', value: '航拍宣传片' },
      { icon: Target, label: '目标平台', value: '抖音/视频号/售楼处' }
    ],
    skills: ['航拍', '视频剪辑', '调色', '配音', '字幕制作'],
    milestones: [
      { stage: '脚本确认', days: 2, desc: '确定拍摄脚本和分镜' },
      { stage: '拍摄制作', days: 5, desc: '航拍拍摄及后期剪辑' },
      { stage: '修改完善', days: 2, desc: '根据反馈修改调整' },
      { stage: '最终交付', days: 1, desc: '交付成片及源文件' }
    ],
    applications: 3,
    views: 156,
    publishTime: '2天前',
    tags: ['航拍', '房地产', '高端', '急单']
  },
  {
    id: 'd-002',
    title: '互联网公司年会开场视频',
    category: 'AI短视频',
    subCategory: '年会视频',
    budget: 12500,
    budgetRange: '10k-15k',
    duration: '5分钟',
    deadline: '3天内',
    urgency: 'urgent',
    status: 'open',
    matchScore: 92,
    matchReasons: ['档期匹配', '技能高度契合', '预算充足'],
    company: {
      name: '云智科技',
      industry: '互联网',
      size: '中型企业',
      location: '杭州',
      verified: true,
      projects: 8,
      rating: 4.8
    },
    description: `年会开场视频制作，需要结合AI元素展现公司科技感。

【项目背景】
公司年会将于下周举行，需要一部震撼的开场视频。

【核心需求】
1. 融入AI生成内容（AI绘画、AI动画）
2. 展现公司发展历程和里程碑
3. 员工照片/视频混剪
4. 科技感、未来感强烈
5. 配合现场灯光音效`,
    requirements: [
      { icon: Clock, label: '交付周期', value: '3天内（急单）' },
      { icon: DollarSign, label: '预算范围', value: '¥10,000 - ¥15,000' },
      { icon: Briefcase, label: '项目类型', value: '年会开场视频' },
      { icon: Target, label: '目标平台', value: '年会现场/内部传播' }
    ],
    skills: ['AI绘画', '视频剪辑', '动效设计', '音乐剪辑', '现场配合'],
    milestones: [
      { stage: '需求确认', days: 0.5, desc: '确认素材和风格' },
      { stage: '脚本分镜', days: 0.5, desc: '快速出分镜脚本' },
      { stage: '制作剪辑', days: 1.5, desc: '高强度制作' },
      { stage: '修改定稿', days: 0.5, desc: '微调完善' }
    ],
    applications: 5,
    views: 234,
    publishTime: '5小时前',
    tags: ['年会', '急单', 'AI生成', '科技感']
  },
  {
    id: 'd-003',
    title: 'AI短剧《总裁的心尖宠》5集制作',
    category: 'AI短剧',
    subCategory: '都市爱情',
    budget: 15000,
    budgetRange: '12k-18k',
    duration: '5集',
    deadline: '20天内',
    urgency: 'normal',
    status: 'open',
    matchScore: 78,
    matchReasons: ['类型匹配', '预算合适'],
    company: {
      name: '微剧文化',
      industry: '文化传媒',
      size: '小型企业',
      location: '北京',
      verified: true,
      projects: 15,
      rating: 4.7
    },
    description: `都市爱情题材AI短剧，共5集，每集3-5分钟。

【剧本概要】
霸道总裁与职场小白花的甜宠故事，融入职场奋斗元素。

【制作要求】
1. AI角色形象设计（2-3个主要角色）
2. 场景设计（办公室、豪宅、咖啡厅等）
3. 分镜脚本细化
4. 配音及音效
5. 字幕及特效

【参考风格】
类似《闪婚老公是豪门》等爆款短剧`,
    requirements: [
      { icon: Clock, label: '交付周期', value: '20天内' },
      { icon: DollarSign, label: '预算范围', value: '¥12,000 - ¥18,000' },
      { icon: Briefcase, label: '项目类型', value: 'AI短剧系列' },
      { icon: Target, label: '目标平台', value: '抖音/快手/视频号' }
    ],
    skills: ['AI绘画', '角色设计', '分镜', '剪辑', '配音'],
    milestones: [
      { stage: '角色设计', days: 3, desc: '确定角色形象和风格' },
      { stage: '分镜制作', days: 4, desc: '完成全部分镜' },
      { stage: '画面生成', days: 8, desc: 'AI生成所有画面' },
      { stage: '后期合成', days: 4, desc: '剪辑配音特效' },
      { stage: '修改交付', days: 1, desc: '根据反馈调整' }
    ],
    applications: 2,
    views: 189,
    publishTime: '1天前',
    tags: ['短剧', '系列', '都市爱情', 'AI生成']
  },
  {
    id: 'd-004',
    title: '悬疑推理短剧《消失的证人》3集',
    category: 'AI短剧',
    subCategory: '悬疑推理',
    budget: 12000,
    budgetRange: '10k-15k',
    duration: '3集',
    deadline: '15天内',
    urgency: 'normal',
    status: 'matching',
    matchScore: 82,
    matchReasons: ['技能匹配', '档期合适'],
    company: {
      name: '谜影工作室',
      industry: '影视制作',
      size: '小型企业',
      location: '上海',
      verified: false,
      projects: 5,
      rating: 4.5
    },
    description: `悬疑推理题材，法医破案主题，3集试播。

【故事梗概】
年轻法医通过蛛丝马迹破解连环案件，每集一个独立案件。

【视觉要求】
1. 暗调风格，悬疑氛围
2. 法医实验室、案发现场等场景
3. 角色表情细腻，情绪到位
4. 适当的惊悚元素处理`,
    requirements: [
      { icon: Clock, label: '交付周期', value: '15天内' },
      { icon: DollarSign, label: '预算范围', value: '¥10,000 - ¥15,000' },
      { icon: Briefcase, label: '项目类型', value: '悬疑短剧试播' },
      { icon: Target, label: '目标平台', value: 'B站/抖音' }
    ],
    skills: ['AI绘画', '氛围营造', '悬疑剪辑', '音效设计'],
    milestones: [
      { stage: '风格确定', days: 2, desc: '确定视觉风格' },
      { stage: '分镜脚本', days: 3, desc: '细化分镜' },
      { stage: '画面制作', days: 7, desc: '生成全部画面' },
      { stage: '后期合成', days: 3, desc: '剪辑配音' }
    ],
    applications: 4,
    views: 267,
    publishTime: '3天前',
    tags: ['悬疑', '推理', '试播', '氛围感']
  },
  {
    id: 'd-005',
    title: '公益微电影《回家的路》5分钟',
    category: 'AI电影',
    subCategory: '公益',
    budget: 20000,
    budgetRange: '15k-25k',
    duration: '5分钟',
    deadline: '25天内',
    urgency: 'low',
    status: 'open',
    matchScore: 75,
    matchReasons: ['预算充足', '时间充裕'],
    company: {
      name: '爱心基金会',
      industry: '公益组织',
      size: '中型机构',
      location: '广州',
      verified: true,
      projects: 3,
      rating: 5.0
    },
    description: `关注留守儿童主题的公益微电影。

【故事主题】
讲述一个留守儿童等待父母回家的温情故事，引发社会关注。

【制作标准】
1. 电影级画面质感
2. 情感细腻，催人泪下
3. 适合院线贴片及网络传播
4. 可能需要实拍+AI结合`,
    requirements: [
      { icon: Clock, label: '交付周期', value: '25天内' },
      { icon: DollarSign, label: '预算范围', value: '¥15,000 - ¥25,000' },
      { icon: Briefcase, label: '项目类型', value: '公益微电影' },
      { icon: Target, label: '目标平台', value: '院线/网络/公益展映' }
    ],
    skills: ['电影质感', '情感表达', 'AI+实拍', '调色'],
    milestones: [
      { stage: '创意策划', days: 3, desc: '深化创意和脚本' },
      { stage: '分镜设计', days: 4, desc: '电影级分镜' },
      { stage: '制作拍摄', days: 12, desc: 'AI生成/实拍' },
      { stage: '后期精剪', days: 5, desc: '精细剪辑调色' },
      { stage: '最终交付', days: 1, desc: '多版本输出' }
    ],
    applications: 1,
    views: 312,
    publishTime: '5天前',
    tags: ['公益', '微电影', '高品质', '温情']
  },
  {
    id: 'd-006',
    title: '新茶饮品牌全套VI设计',
    category: 'AI设计师',
    subCategory: '品牌VI',
    budget: 10000,
    budgetRange: '8k-12k',
    duration: '全套',
    deadline: '10天内',
    urgency: 'normal',
    status: 'open',
    matchScore: 80,
    matchReasons: ['设计能力匹配', '预算合适'],
    company: {
      name: '茶语时光',
      industry: '餐饮',
      size: '小型企业',
      location: '成都',
      verified: false,
      projects: 2,
      rating: 4.6
    },
    description: `新中式茶饮品牌，需要完整的VI视觉识别系统。

【品牌定位】
新中式茶饮，主打"东方茶韵，现代演绎"，目标客群18-35岁都市白领。

【设计内容】
1. Logo设计及标准制图
2. 品牌色彩系统
3. 字体规范
4. 辅助图形
5. 应用场景展示（门店、包装、周边）`,
    requirements: [
      { icon: Clock, label: '交付周期', value: '10天内' },
      { icon: DollarSign, label: '预算范围', value: '¥8,000 - ¥12,000' },
      { icon: Briefcase, label: '项目类型', value: '品牌VI设计' },
      { icon: Target, label: '应用场景', value: '门店/包装/线上' }
    ],
    skills: ['品牌设计', 'AI绘图', 'VI系统', '中式美学'],
    milestones: [
      { stage: '品牌调研', days: 1, desc: '了解品牌定位' },
      { stage: '概念设计', days: 3, desc: '2-3个设计方向' },
      { stage: '深化设计', days: 4, desc: '确定方向深化' },
      { stage: '系统完善', days: 2, desc: '完成VI手册' }
    ],
    applications: 6,
    views: 423,
    publishTime: '12小时前',
    tags: ['VI设计', '品牌', '新中式', '茶饮']
  }
]

// 推荐创作者数据
const RECOMMENDED_CREATORS = [
  {
    id: 'c-001',
    name: '张子涵',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    title: '资深视频导演',
    skills: ['航拍', '商业视频', '调色'],
    matchScore: 95,
    price: '¥3,000/分钟',
    available: true,
    works: 47,
    rating: 4.9,
    tags: ['房地产专家', '航拍达人']
  },
  {
    id: 'c-002',
    name: '李思远',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    title: 'AI短剧制作人',
    skills: ['AI绘画', '短剧', '分镜'],
    matchScore: 88,
    price: '¥2,500/集',
    available: true,
    works: 32,
    rating: 4.8,
    tags: ['甜宠专业户', '出片快']
  },
  {
    id: 'c-003',
    name: '王艺萌',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    title: '品牌视觉设计师',
    skills: ['VI设计', 'Logo', '包装'],
    matchScore: 92,
    price: '¥8,000/套',
    available: false,
    works: 56,
    rating: 4.9,
    tags: ['新中式风格', '细节控']
  }
]

export default function MatchingDetail() {
  const { demandId } = useParams()
  const navigate = useNavigate()
  const [demand, setDemand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [applyForm, setApplyForm] = useState({
    message: '',
    price: '',
    timeline: ''
  })

  useEffect(() => {
    // 模拟API请求
    setTimeout(() => {
      const found = MOCK_DEMANDS.find(d => d.id === demandId)
      setDemand(found || MOCK_DEMANDS[0])
      setLoading(false)
    }, 500)
  }, [demandId])

  const handleApply = () => {
    // 检查登录状态
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { state: { from: `/demand/${demandId}` } })
      return
    }
    setShowApplyModal(true)
  }

  const submitApplication = () => {
    // 创建项目
    const projectId = `P${Date.now()}`
    const newProject = {
      id: projectId,
      name: demand.title,
      type: demand.category || 'AI内容创作',
      budget: `¥${demand.budget?.toLocaleString() || '10,000'}`,
      price: demand.budget || 10000,
      duration: demand.duration || '30天',
      startDate: new Date().toISOString().split('T')[0],
      client: demand.company?.name || '未知企业',
      company: demand.company?.name || '未知企业',
      opc: { name: '待分配', title: 'OPC创作者' },
      status: '待启动',
      progress: 0,
      description: demand.description,
      milestones: demand.milestones || [
        { stage: '项目启动', days: 3, desc: '确认需求，启动项目' },
        { stage: '初稿交付', days: 15, desc: '提交初稿，客户审核' },
        { stage: '终稿验收', days: 12, desc: '修改完善，最终交付' }
      ],
      deliverables: [],
      createdAt: new Date().toISOString()
    }
    
    // 保存到项目列表
    const myProjects = JSON.parse(localStorage.getItem('myProjects') || '[]')
    myProjects.push(newProject)
    localStorage.setItem('myProjects', JSON.stringify(myProjects))
    
    // 同时保存申请记录
    const applications = JSON.parse(localStorage.getItem('myApplications') || '[]')
    applications.push({
      id: Date.now(),
      demandId: demand.id,
      demandTitle: demand.title,
      projectId: projectId,
      status: 'approved',
      applyTime: new Date().toISOString(),
      ...applyForm
    })
    localStorage.setItem('myApplications', JSON.stringify(applications))
    
    setShowApplyModal(false)
    
    // 跳转到资金托管支付页面
    navigate(`/escrow-payment/${projectId}`)
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'text-red-400 bg-red-400/10 border-red-400/30'
      case 'normal': return 'text-amber-400 bg-amber-400/10 border-amber-400/30'
      default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
    }
  }

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 'urgent': return '紧急'
      case 'normal': return '正常'
      default: return '宽松'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'matching': return 'text-blue-400 bg-blue-400/10'
      case 'open': return 'text-emerald-400 bg-emerald-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'matching': return '匹配中'
      case 'open': return '待接单'
      default: return '已关闭'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex items-center gap-3 text-violet-400">
          <div className="w-8 h-8 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
          <span>加载中...</span>
        </div>
      </div>
    )
  }

  if (!demand) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">需求不存在或已下架</p>
          <button
            onClick={() => navigate('/demand')}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors"
          >
            返回智配中心
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/demand')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回智配中心</span>
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'bg-violet-500/20 text-violet-400' : 'hover:bg-white/5 text-gray-400'}`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 需求标题区 */}
            <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 rounded-2xl p-6 border border-violet-500/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm font-medium">
                    {demand.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(demand.urgency)}`}>
                    {getUrgencyText(demand.urgency)}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(demand.status)}`}>
                  {getStatusText(demand.status)}
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {demand.title}
              </h1>
              
              {/* 匹配度展示 */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{demand.matchScore}%</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">匹配度</p>
                    <p className="text-violet-400 font-medium">
                      {demand.matchScore >= 90 ? '极高匹配' : demand.matchScore >= 80 ? '高度匹配' : '中度匹配'}
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                  {demand.matchReasons.map((reason, idx) => (
                    <span key={idx} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                      <CheckCircle2 className="w-3 h-3 inline mr-1" />
                      {reason}
                    </span>
                  ))}
                </div>
              </div>

              {/* 关键信息 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {demand.requirements.map((req, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4">
                    <req.icon className="w-5 h-5 text-violet-400 mb-2" />
                    <p className="text-xs text-gray-400 mb-1">{req.label}</p>
                    <p className="text-sm font-medium text-white">{req.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab导航 */}
            <div className="flex gap-1 bg-white/5 rounded-xl p-1">
              {[
                { id: 'overview', label: '需求详情', icon: FileText },
                { id: 'company', label: '企业信息', icon: Building2 },
                { id: 'milestones', label: '项目里程碑', icon: Calendar },
                { id: 'creators', label: '推荐创作者', icon: Users }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-violet-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab内容 */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-violet-400" />
                      需求描述
                    </h3>
                    <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {demand.description}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-violet-400" />
                      技能要求
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {demand.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-violet-500/10 text-violet-300 rounded-lg text-sm border border-violet-500/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-violet-400" />
                      标签
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {demand.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/5 text-gray-400 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                      {demand.company.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold text-white">{demand.company.name}</h3>
                        {demand.company.verified && (
                          <BadgeCheck className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {demand.company.industry}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {demand.company.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {demand.company.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">{demand.company.projects}</p>
                      <p className="text-sm text-gray-400">发布项目</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-amber-400 fill-current" />
                        <span className="text-2xl font-bold text-white">{demand.company.rating}</span>
                      </div>
                      <p className="text-sm text-gray-400">企业评分</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">100%</p>
                      <p className="text-sm text-gray-400">按时付款</p>
                    </div>
                  </div>

                  <div className="bg-violet-500/10 rounded-xl p-4 border border-violet-500/20">
                    <h4 className="font-medium text-violet-300 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      平台保障
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        企业资质已审核
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        项目资金已托管
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        平台全程担保交易
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'milestones' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">项目执行计划</h3>
                  {demand.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                        {idx < demand.milestones.length - 1 && (
                          <div className="w-0.5 h-full bg-violet-500/20 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white">{milestone.stage}</h4>
                          <span className="text-sm text-violet-400">{milestone.days}天</span>
                        </div>
                        <p className="text-sm text-gray-400">{milestone.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'creators' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">为您推荐的创作者</h3>
                  {RECOMMENDED_CREATORS.map((creator) => (
                    <div key={creator.id} className="bg-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
                      <img src={creator.avatar} alt={creator.name} className="w-14 h-14 rounded-full bg-violet-500/20" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white">{creator.name}</h4>
                          <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-xs">
                            匹配度 {creator.matchScore}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{creator.title}</p>
                        <div className="flex flex-wrap gap-1">
                          {creator.skills.map((skill, idx) => (
                            <span key={idx} className="text-xs text-gray-500">{skill}{idx < creator.skills.length - 1 ? ' · ' : ''}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-violet-400 font-medium">{creator.price}</p>
                        <p className="text-xs text-gray-500">{creator.works}个作品</p>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-xs text-gray-400">{creator.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右侧操作区 */}
          <div className="space-y-6">
            {/* 报价卡片 */}
            <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-2xl p-6 border border-violet-500/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">项目预算</span>
                <span className="text-sm text-gray-500">{demand.budgetRange}</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                ¥{demand.budget.toLocaleString()}
              </div>
              <p className="text-sm text-gray-400 mb-6">平台托管，验收后放款</p>
              
              <button
                onClick={handleApply}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                立即申请
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  {demand.views} 浏览
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {demand.applications} 申请
                </span>
              </div>
            </div>

            {/* 项目统计 */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <h3 className="font-medium text-white mb-4">项目信息</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">发布时间</span>
                  <span className="text-white">{demand.publishTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">项目编号</span>
                  <span className="text-white font-mono">{demand.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">需求类型</span>
                  <span className="text-white">{demand.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">作品时长</span>
                  <span className="text-white">{demand.duration}</span>
                </div>
              </div>
            </div>

            {/* 平台服务 */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <h3 className="font-medium text-white mb-4">平台服务</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: '资金托管保障' },
                  { icon: MessageSquare, text: '专属项目顾问' },
                  { icon: Award, text: '质量验收标准' },
                  { icon: TrendingUp, text: '纠纷仲裁服务' }
                ].map((service, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                    <service.icon className="w-4 h-4 text-violet-400" />
                    {service.text}
                  </div>
                ))}
              </div>
            </div>

            {/* 联系客服 */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
              <h3 className="font-medium text-amber-300 mb-2">需要帮助？</h3>
              <p className="text-sm text-gray-400 mb-4">对项目有疑问或需要协助</p>
              <button className="w-full py-2 border border-amber-500/30 text-amber-400 rounded-lg hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                联系平台顾问
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 申请弹窗 */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a24] rounded-2xl p-6 max-w-md w-full border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">申请项目</h3>
            <p className="text-gray-400 mb-6">{demand.title}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">您的报价</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
                  <input
                    type="number"
                    value={applyForm.price}
                    onChange={(e) => setApplyForm({...applyForm, price: e.target.value})}
                    placeholder="输入您的报价"
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-8 pr-4 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">预算范围: {demand.budgetRange}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">预计交付时间</label>
                <select
                  value={applyForm.timeline}
                  onChange={(e) => setApplyForm({...applyForm, timeline: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="">选择交付时间</option>
                  <option value="3天内">3天内</option>
                  <option value="5天内">5天内</option>
                  <option value="7天内">7天内</option>
                  <option value="10天内">10天内</option>
                  <option value="15天内">15天内</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">申请留言</label>
                <textarea
                  value={applyForm.message}
                  onChange={(e) => setApplyForm({...applyForm, message: e.target.value})}
                  placeholder="介绍您的优势和相关经验..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 py-2 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors"
              >
                取消
              </button>
              <button
                onClick={submitApplication}
                className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 辅助组件
function EyeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}
