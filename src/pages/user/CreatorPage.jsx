import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import {
  Search, Filter, Star, Award, Trophy, Users, Clock,
  Heart, Eye, MessageCircle, CheckCircle, ChevronRight,
  Sparkles, MapPin, Calendar, ArrowRight, Send, X,
  Video, Image, BookMarked, Play, Briefcase, Zap,
  Target, TrendingUp, BarChart3, Crown, Shield, Sparkle,
  User, Building2, DollarSign, Globe, Lock, Rocket,
  ChevronDown, Plus, Check, Users2, MessageSquare, Phone,
  Paperclip, Smile, MoreHorizontal, ArrowLeft, Minus,
  Hash, FileText, Wallet
} from 'lucide-react'

// ============ 分类元数据 ============
const CREATOR_CATEGORIES = [
  { id: 'all', name: '全部', icon: '🎯', color: '#22d3ee', desc: '所有类型' },
  { id: 'ai_video', name: 'AI视频', icon: '🎬', color: '#22d3ee', desc: 'AI生成视频、短视频制作' },
  { id: 'ai_ad_film', name: 'AI广告电影', icon: '🎥', color: '#f97316', desc: 'AI广告片、企业宣传片' },
  { id: 'ai_designer', name: 'AI设计师', icon: '🎨', color: '#34d399', desc: 'UI设计、品牌视觉、海报' },
  { id: 'ai_shortdrama', name: 'AI短剧漫剧', icon: '🎭', color: '#a78bfa', desc: 'AI短剧、漫画、动漫' },
  { id: 'ai_wenlv', name: 'AI文旅宣传片', icon: '🏛️', color: '#ec4899', desc: '文旅推广、城市宣传' },
  { id: 'ui_designer', name: 'UI设计师', icon: '💻', color: '#06b6d4', desc: '界面设计、交互设计' }
]

const CONSULTANT_CATEGORIES = [
  { id: 'all', name: '全部', icon: '🎯', color: '#6366f1', desc: '所有领域' },
  { id: 'strategy', name: '战略咨询', icon: '🎯', color: '#6366f1', desc: '战略规划、商业模式设计' },
  { id: 'listing', name: '上市咨询', icon: '🏛️', color: '#8b5cf6', desc: 'IPO辅导、上市准备' },
  { id: 'financing', name: '融资咨询', icon: '💰', color: '#10b981', desc: '融资规划、投资人对接' },
  { id: 'equity', name: '股权架构', icon: '📊', color: '#14b8a6', desc: '股权设计、合伙人机制' },
  { id: 'overseas', name: '战略出海', icon: '🌏', color: '#f59e0b', desc: '出海战略、海外市场拓展' },
  { id: 'ai_upgrade', name: 'AI升级转型', icon: '🤖', color: '#3b82f6', desc: 'AI落地、数字化转型' },
  { id: 'deployment', name: '私有化部署', icon: '🔒', color: '#64748b', desc: '私有云、数据安全合规' }
]

// ============ 等级颜色映射 ============
const levelColors = {
  L1: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', text: 'text-green-400', tag: 'bg-green-500/20 text-green-400 border border-green-500/30', badge: '绿铜' },
  L2: { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', text: 'text-blue-400', tag: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', badge: '蓝银' },
  L3: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', text: 'text-purple-400', tag: 'bg-purple-500/20 text-purple-400 border border-purple-500/30', badge: '紫金' },
  L4: { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', text: 'text-amber-400', tag: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', badge: '金钻' }
}

// ============ OPC 创作者数据 ============
const opcCreators = [
  { id: 'cr_001', name: '林导', avatar: '林', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', level: 'L4', title: 'AI短剧导演', category: 'ai_shortdrama', skills: ['AI短剧', '分镜设计', '剧本创作'], rating: 4.9, completedProjects: 68, hourlyRate: 1200, availability: '可接单', tags: ['精品创作', '高端定制'], bio: '资深影视导演，专注AI短剧创作，代表作品《觉醒年代》AI版', works: ['https://picsum.photos/400/300?random=101', 'https://picsum.photos/400/300?random=102', 'https://picsum.photos/400/300?random=103'] },
  { id: 'cr_002', name: '张视觉', avatar: '张', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', level: 'L3', title: 'AI视觉设计师', category: 'ai_designer', skills: ['AI设计', '品牌视觉', '海报'], rating: 4.8, completedProjects: 45, hourlyRate: 800, availability: '可接单', tags: ['品牌升级', '视觉创意'], bio: '前4A设计总监，AI驱动品牌视觉设计专家', works: ['https://picsum.photos/400/300?random=201', 'https://picsum.photos/400/300?random=202', 'https://picsum.photos/400/300?random=203'] },
  { id: 'cr_003', name: '王视频', avatar: '王', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', level: 'L3', title: 'AI视频制作师', category: 'ai_video', skills: ['AI视频', '特效合成', '剪辑'], rating: 4.7, completedProjects: 52, hourlyRate: 700, availability: '忙碌', tags: ['短视频', '商业视频'], bio: '短视频制作专家，擅长AI生成视频和后期特效', works: ['https://picsum.photos/400/300?random=301', 'https://picsum.photos/400/300?random=302', 'https://picsum.photos/400/300?random=303'] },
  { id: 'cr_004', name: '陈电影', avatar: '陈', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', level: 'L4', title: 'AI广告电影人', category: 'ai_ad_film', skills: ['广告片', '宣传片', '微电影'], rating: 4.9, completedProjects: 38, hourlyRate: 1500, availability: '可接单', tags: ['大片制作', '顶级资源'], bio: '获金狮奖导演，AI广告电影先驱，服务过阿里、字节', works: ['https://picsum.photos/400/300?random=401', 'https://picsum.photos/400/300?random=402', 'https://picsum.photos/400/300?random=403'] },
  { id: 'cr_005', name: '赵文旅', avatar: '赵', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', level: 'L2', title: 'AI文旅创意师', category: 'ai_wenlv', skills: ['文旅创意', '城市推广', '景区宣传'], rating: 4.6, completedProjects: 22, hourlyRate: 500, availability: '可接单', tags: ['文旅策划', '创意内容'], bio: '文旅营销专家，专注AI文旅宣传片和城市品牌打造', works: ['https://picsum.photos/400/300?random=501', 'https://picsum.photos/400/300?random=502', 'https://picsum.photos/400/300?random=503'] },
  { id: 'cr_006', name: '刘漫剧', avatar: '刘', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', level: 'L3', title: 'AI漫剧创作者', category: 'ai_shortdrama', skills: ['AI漫剧', '漫画创作', 'IP孵化'], rating: 4.8, completedProjects: 35, hourlyRate: 750, availability: '可接单', tags: ['IP孵化', '漫剧创作'], bio: '动漫IP创作专家，专注AI漫剧和原创IP孵化', works: ['https://picsum.photos/400/300?random=601', 'https://picsum.photos/400/300?random=602', 'https://picsum.photos/400/300?random=603'] },
  { id: 'cr_007', name: '孙设计', avatar: '孙', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', level: 'L2', title: 'AI UI设计师', category: 'ai_designer', skills: ['UI设计', 'UX优化', '交互设计'], rating: 4.7, completedProjects: 28, hourlyRate: 600, availability: '可接单', tags: ['互联网产品', '用户体验'], bio: '资深UI设计师，AI赋能数字化产品设计', works: ['https://picsum.photos/400/300?random=701', 'https://picsum.photos/400/300?random=702', 'https://picsum.photos/400/300?random=703'] },
  { id: 'cr_008', name: '周视频', avatar: '周', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face', level: 'L1', title: 'AI短视频达人', category: 'ai_video', skills: ['AI剪辑', '短视频', '内容创作'], rating: 4.5, completedProjects: 15, hourlyRate: 350, availability: '可接单', tags: ['新手友好', '高性价比'], bio: '短视频内容创作者，AI辅助内容生产效率专家', works: ['https://picsum.photos/400/300?random=801', 'https://picsum.photos/400/300?random=802', 'https://picsum.photos/400/300?random=803'] },
  { id: 'cr_009', name: '马UI', avatar: '马', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', level: 'L3', title: '资深UI设计师', category: 'ui_designer', skills: ['UI设计', '视觉设计', 'APP界面'], rating: 4.8, completedProjects: 42, hourlyRate: 850, availability: '可接单', tags: ['APP设计', '界面美学'], bio: '专注移动端UI设计，AI辅助设计效率提升300%', works: ['https://picsum.photos/400/300?random=901', 'https://picsum.photos/400/300?random=902', 'https://picsum.photos/400/300?random=903'] },
  { id: 'cr_010', name: '吴文旅', avatar: '吴', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', level: 'L3', title: '文旅品牌策划师', category: 'ai_wenlv', skills: ['文旅策划', '品牌设计', '推广'], rating: 4.7, completedProjects: 30, hourlyRate: 700, availability: '可接单', tags: ['城市品牌', '文旅推广'], bio: '10年文旅行业经验，服务50+城市旅游品牌', works: ['https://picsum.photos/400/300?random=1001', 'https://picsum.photos/400/300?random=1002', 'https://picsum.photos/400/300?random=1003'] }
]

// ============ OPC 咨询专家数据 ============
const opcConsultants = [
  { id: 'cs_001', name: '钱战略', avatar: '钱', avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face', level: 'L4', title: '首席战略顾问', category: 'strategy', skills: ['战略规划', '商业模式', '组织架构'], rating: 4.9, completedProjects: 120, hourlyRate: 3000, availability: '可接单', tags: ['顶级智库', '上市公司'], bio: '前麦肯锡合伙人，服务50+上市企业战略规划', services: ['战略诊断', '商业模式设计', '组织优化'] },
  { id: 'cs_002', name: '孙上市', avatar: '孙', avatarUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop&crop=face', level: 'L4', title: '上市辅导专家', category: 'listing', skills: ['IPO上市', '合规整改', '市值管理'], rating: 4.9, completedProjects: 85, hourlyRate: 3500, availability: '可接单', tags: ['全程陪跑', '成功率高'], bio: '主导20+企业IPO，深交所、北交所特聘顾问', services: ['IPO诊断', '合规整改', '上市辅导'] },
  { id: 'cs_003', name: '周融资', avatar: '周', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face', level: 'L3', title: '融资顾问', category: 'financing', skills: ['融资规划', 'BP优化', '投资人库'], rating: 4.8, completedProjects: 68, hourlyRate: 2000, availability: '可接单', tags: ['资源对接', '高效融资'], bio: '帮助50+企业完成A-C轮融资，对接200+投资机构', services: ['BP诊断', '路演辅导', '投资对接'] },
  { id: 'cs_004', name: '吴股权', avatar: '吴', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face', level: 'L3', title: '股权架构师', category: 'equity', skills: ['股权设计', '合伙人机制', '期权激励'], rating: 4.8, completedProjects: 55, hourlyRate: 1800, availability: '可接单', tags: ['法律合规', '长期顾问'], bio: '股权设计专家，专注创业公司合伙人机制设计', services: ['股权架构', '期权设计', '合伙人协议'] },
  { id: 'cs_005', name: '郑出海', avatar: '郑', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face', level: 'L3', title: '出海战略顾问', category: 'overseas', skills: ['海外市场', '本地化', '跨境合规'], rating: 4.7, completedProjects: 42, hourlyRate: 2200, availability: '忙碌', tags: ['东南亚', '中东市场'], bio: '10年出海经验，成功帮助30+企业布局海外市场', services: ['市场调研', '本地化策略', '合规咨询'] },
  { id: 'cs_006', name: '冯AI', avatar: '冯', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', level: 'L4', title: 'AI转型专家', category: 'ai_upgrade', skills: ['AI落地', '数字化转型', '流程再造'], rating: 4.9, completedProjects: 78, hourlyRate: 2500, availability: '可接单', tags: ['产业赋能', '实战派'], bio: '前阿里云架构师，专注企业AI升级转型落地', services: ['AI诊断', '转型规划', '落地实施'] },
  { id: 'cs_007', name: '卫安全', avatar: '卫', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', level: 'L3', title: '安全部署专家', category: 'deployment', skills: ['私有化部署', '数据安全', '合规认证'], rating: 4.8, completedProjects: 45, hourlyRate: 2000, availability: '可接单', tags: ['安全合规', '等保认证'], bio: '信息安全专家，帮20+企业完成私有化部署和等保认证', services: ['安全评估', '私有化部署', '等保认证'] },
  { id: 'cs_008', name: '陈战略', avatar: '陈', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', level: 'L2', title: '战略咨询师', category: 'strategy', skills: ['战略分析', '市场洞察', '竞争策略'], rating: 4.6, completedProjects: 35, hourlyRate: 1200, availability: '可接单', tags: ['初创企业', '成长型'], bio: '专注成长型企业战略咨询，5年咨询经验', services: ['战略分析', '竞争分析', '市场定位'] },
  { id: 'cs_009', name: '林融资', avatar: '林', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', level: 'L2', title: '融资规划师', category: 'financing', skills: ['融资规划', '财务模型', '估值'], rating: 4.7, completedProjects: 28, hourlyRate: 1500, availability: '可接单', tags: ['早期融资', 'A轮'], bio: '专注早期项目融资，擅长财务模型和估值分析', services: ['融资规划', '财务顾问', '估值分析'] }
]

// ============ 计算匹配度 ============
const calculateCreatorMatchScore = (creator) => {
  const diagnosisResult = JSON.parse(localStorage.getItem('enterprise_diagnosis_result') || '{}')
  if (!diagnosisResult.level) return Math.floor(Math.random() * 30) + 60

  const enterpriseLevel = diagnosisResult.level.split(' ')[0]
  const levelOrder = ['L1', 'L2', 'L3', 'L4']
  const enterpriseIdx = levelOrder.indexOf(enterpriseLevel) || 0
  const creatorIdx = levelOrder.indexOf(creator.level) || 0
  const levelDiff = Math.abs(enterpriseIdx - creatorIdx)
  const levelScore = Math.max(0, 50 - levelDiff * 20)
  const ratingScore = (creator.rating / 5) * 30
  const expScore = Math.min(creator.completedProjects / 50, 1) * 20
  return Math.round(levelScore + ratingScore + expScore)
}

const calculateConsultantMatchScore = (consultant) => {
  const consultationIntent = JSON.parse(localStorage.getItem('consultation_intent') || '{}')
  const packageName = consultationIntent.packageName || ''
  let packageScore = 50
  if (packageName.includes('旗舰')) packageScore = 100
  else if (packageName.includes('成长')) packageScore = 75
  else if (packageName.includes('启航')) packageScore = 60

  const levelOrder = ['L1', 'L2', 'L3', 'L4']
  const consultantIdx = levelOrder.indexOf(consultant.level) || 0
  const levelScore = (4 - consultantIdx) * 15
  const ratingScore = (consultant.rating / 5) * 20
  return Math.round(packageScore * 0.4 + levelScore * 0.3 + ratingScore * 0.3)
}

// ============ 等级排序 ============
const levelOrder = ['L4', 'L3', 'L2', 'L1']

export default function CreatorPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('opc-experts')
  const location = useLocation()

  // ============ 核心状态 ============
  const [listTab, setListTab] = useState('creators')
  const [creatorFilter, setCreatorFilter] = useState('all')
  const [consultantFilter, setConsultantFilter] = useState('all')

  // 服务组状态
  const [selectedCreators, setSelectedCreators] = useState([])
  const [selectedConsultants, setSelectedConsultants] = useState([])

  // 聊天状态
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef(null)

  // 单独咨询弹窗状态
  const [consultModal, setConsultModal] = useState({ show: false, participant: null, messages: [] })
  const [consultInput, setConsultInput] = useState('')
  const consultEndRef = useRef(null)

  // 智配咨询区折叠状态
  const [consultCollapsed, setConsultCollapsed] = useState(false)

  // 企业信息
  const diagnosisResult = JSON.parse(localStorage.getItem('enterprise_diagnosis_result') || '{}')

  // 统一的初始化逻辑
  useEffect(() => {
    // 处理咨询意图的函数
    const handleIntent = (intentData) => {
      if (intentData?.opcData) {
        const opcData = intentData.opcData
        if (intentData.type === 'creator') {
          setSelectedCreators([opcData])
          setSelectedConsultants([])
          console.log('已添加创作者:', opcData.name)
          return true // 已处理
        } else if (intentData.type === 'consultant') {
          setSelectedConsultants([opcData])
          setSelectedCreators([])
          console.log('已添加咨询专家:', opcData.name)
          return true // 已处理
        }
      }
      return false // 未处理
    }

    // 检查 URL 参数中的意图
    const params = new URLSearchParams(window.location.search)
    const intentParam = params.get('intent')
    const opcParam = params.get('opc')

    let handled = false

    if (intentParam && opcParam) {
      try {
        const opcData = JSON.parse(decodeURIComponent(atob(opcParam)))
        handled = handleIntent({
          type: intentParam,
          opcData: opcData
        })

        // 只有在成功处理后才清除 URL 参数
        if (handled) {
          // 使用 setTimeout 确保在状态更新之后清除 URL 参数
          setTimeout(() => {
            const cleanUrl = window.location.pathname + '?tab=' + (params.get('tab') || 'opc-experts')
            window.history.replaceState({}, '', cleanUrl)
          }, 100)
        }
      } catch (e) {
        console.log('解析 OPC 参数失败', e)
      }
    }

    // 如果 URL 参数未处理，检查 localStorage 中的 consultation_intent（OPC咨询专家使用此方式）
    console.log('检查 consultation_intent, handled:', handled)
    if (!handled) {
      const consultationIntent = localStorage.getItem('consultation_intent')
      console.log('consultation_intent:', consultationIntent ? '存在' : '不存在')
      if (consultationIntent) {
        try {
          const intentData = JSON.parse(consultationIntent)
          console.log('intentData.type:', intentData.type, 'intentData.opcData:', intentData.opcData?.name)
          if (intentData.opcData) {
            if (intentData.type === 'consultant') {
              // 这是咨询专家
              setSelectedConsultants([intentData.opcData])
              setSelectedCreators([])
              console.log('已添加咨询专家:', intentData.opcData.name)
            } else {
              // 这是创作者
              setSelectedCreators([intentData.opcData])
              setSelectedConsultants([])
              console.log('已添加创作者:', intentData.opcData.name)
            }
            handled = true
            // 清除 consultation_intent
            localStorage.removeItem('consultation_intent')
          }
        } catch (e) {
          console.log('解析 consultation_intent 失败', e)
        }
      }
    }

    // 如果没有处理意图，设置默认推荐（空）
    if (!handled) {
      console.log('未处理意图，设置空数组')
      setSelectedCreators([])
      setSelectedConsultants([])
    }

    // 如果没有处理意图，设置默认推荐（空）
    if (!handled) {
      setSelectedCreators([])
      setSelectedConsultants([])
    }
  }, [])

  const getDemandEnterprise = () => {
    const demands = JSON.parse(localStorage.getItem('unified_demands') || '[]')
    const activeDemand = demands.find(d => d.status === 'progress' || d.status === 'matching')
    if (activeDemand) return activeDemand

    if (diagnosisResult.companyName) {
      return {
        id: 'enterprise_' + Date.now(),
        title: diagnosisResult.companyName,
        publisherName: diagnosisResult.companyName,
        demand: diagnosisResult.summary || '企业AI升级转型需求',
        status: 'matching'
      }
    }
    return {
      id: 'guest_enterprise',
      title: '访客企业',
      publisherName: '未认证企业',
      demand: '暂无需求描述',
      status: 'matching'
    }
  }

  const enterprise = getDemandEnterprise()

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'opc-experts') setActiveTab('opc-experts')
    else if (tabParam) setActiveTab(tabParam)
  }, [searchParams])

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages])

  // 单独咨询弹窗滚动
  useEffect(() => {
    if (consultEndRef.current) {
      consultEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [consultModal.messages])

  // 打开单独咨询弹窗
  const openConsultModal = (participant) => {
    const initialMsg = {
      id: 1,
      sender: 'system',
      content: `您正在与 ${participant.name} 进行一对一咨询`,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    const helloMsg = {
      id: 2,
      sender: participant.id,
      senderName: participant.name,
      senderAvatar: participant.avatar,
      senderType: participant.category ? 'creator' : 'consultant',
      senderLevel: participant.level,
      content: `您好！我是${participant.name}，${participant.title}。${participant.bio}\n\n请问您有什么需求需要我帮助？`,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    setConsultModal({ show: true, participant, messages: [initialMsg, helloMsg] })
    setConsultInput('')
  }

  // 关闭咨询弹窗
  const closeConsultModal = () => {
    setConsultModal({ show: false, participant: null, messages: [] })
    setConsultInput('')
  }

  // 发送单独咨询消息
  const sendConsultMessage = () => {
    if (!consultInput.trim()) return

    const newMsg = {
      id: consultModal.messages.length + 1,
      sender: 'user',
      senderName: '我',
      senderAvatar: '我',
      content: consultInput.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }

    const updatedMessages = [...consultModal.messages, newMsg]
    setConsultModal({ ...consultModal, messages: updatedMessages })
    setConsultInput('')

    setTimeout(() => {
      const replies = [
        `好的，我来帮您分析一下。根据您的情况，建议优先考虑...`,
        `这个问题我们可以分几步来处理：\n1. 需求梳理\n2. 方案设计\n3. 落地执行`,
        `感谢您的信任！我有几点建议供您参考...`,
        `收到！根据我们的经验，建议您先从...开始。`,
        `关于这一点，我建议我们先做个深入的需求调研，这样方案会更精准。`
      ]
      const autoReply = {
        id: updatedMessages.length + 1,
        sender: consultModal.participant.id,
        senderName: consultModal.participant.name,
        senderAvatar: consultModal.participant.avatar,
        senderType: consultModal.participant.category ? 'creator' : 'consultant',
        senderLevel: consultModal.participant.level,
        content: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      setConsultModal(prev => ({ ...prev, messages: [...prev.messages, autoReply] }))
    }, 1200)
  }

  // 筛选
  const filteredCreators = creatorFilter === 'all'
    ? [...opcCreators].sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level))
    : opcCreators
        .filter(c => c.category === creatorFilter)
        .sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level))

  const filteredConsultants = consultantFilter === 'all'
    ? [...opcConsultants].sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level))
    : opcConsultants
        .filter(c => c.category === consultantFilter)
        .sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level))

  // 服务组操作
  const addCreatorToService = (creator) => {
    if (!selectedCreators.find(c => c.id === creator.id)) {
      setSelectedCreators([...selectedCreators, creator])
    }
  }

  const removeCreatorFromService = (creatorId) => {
    setSelectedCreators(selectedCreators.filter(c => c.id !== creatorId))
  }

  const addConsultantToService = (consultant) => {
    if (!selectedConsultants.find(c => c.id === consultant.id)) {
      setSelectedConsultants([...selectedConsultants, consultant])
    }
  }

  const removeConsultantFromService = (consultantId) => {
    setSelectedConsultants(selectedConsultants.filter(c => c.id !== consultantId))
  }

  const isCreatorInService = (creatorId) => selectedCreators.some(c => c.id === creatorId)
  const isConsultantInService = (consultantId) => selectedConsultants.some(c => c.id === consultantId)

  // 聊天
  const handleStartChat = () => {
    const allParticipants = [...selectedCreators, ...selectedConsultants]
    if (allParticipants.length === 0) {
      alert('请先在服务组中添加创作者或咨询专家')
      return
    }

    const initialMessages = [
      {
        id: 1,
        sender: 'system',
        content: `已为您组建服务组，共 ${selectedCreators.length} 位创作者、${selectedConsultants.length} 位咨询专家为您服务`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
    ]

    allParticipants.slice(0, 3).forEach((p, idx) => {
      initialMessages.push({
        id: idx + 2,
        sender: p.id,
        senderName: p.name,
        senderAvatar: p.avatar,
        senderType: p.category ? 'creator' : 'consultant',
        senderLevel: p.level,
        content: `您好！我是${p.name}，${p.title}。${p.bio}\n\n请问您有什么需求需要我帮助？`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      })
    })

    setChatMessages(initialMessages)
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const newMsg = {
      id: chatMessages.length + 1,
      sender: 'user',
      senderName: '我',
      senderAvatar: '我',
      content: chatInput.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }

    setChatMessages([...chatMessages, newMsg])
    setChatInput('')

    setTimeout(() => {
      const allParticipants = [...selectedCreators, ...selectedConsultants]
      if (allParticipants.length === 0) return

      const expert = allParticipants[Math.floor(Math.random() * allParticipants.length)]
      const replies = [
        `好的，我来帮您分析一下。根据您的情况，建议优先考虑...`,
        `这个问题我们可以分几步来处理：\n1. 需求梳理\n2. 方案设计\n3. 落地执行`,
        `感谢您的信任！我有几点建议供您参考...`,
        `收到！根据我们的经验，建议您先从...开始。`,
        `关于这一点，我建议我们先做个深入的需求调研，这样方案会更精准。`
      ]
      const autoReply = {
        id: chatMessages.length + 2,
        sender: expert.id,
        senderName: expert.name,
        senderAvatar: expert.avatar,
        senderType: expert.category ? 'creator' : 'consultant',
        senderLevel: expert.level,
        content: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, autoReply])
    }, 1200)
  }

  // ============ 渲染创作者卡片 ============
  const renderCreatorCard = (creator) => {
    const colors = levelColors[creator.level] || levelColors.L1
    const matchScore = calculateCreatorMatchScore(creator)
    const categoryMeta = CREATOR_CATEGORIES.find(c => c.id === creator.category) || CREATOR_CATEGORIES[0]
    const isInService = isCreatorInService(creator.id)

    return (
      <div key={creator.id} className="opc-card glass-card rounded-2xl overflow-hidden card-hover">
        {/* 顶部渐变色条 */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-cyan to-blue-500" />
        <div className="p-5">
          {/* 头部信息：圆形头像 + 昵称 + 擅长标签 */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br ${colors.bg} flex items-center justify-center border-2 ${colors.border} flex-shrink-0`}>
              {creator.avatarUrl ? (
                <img src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xl">{creator.avatar}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-gray-100 truncate">{creator.name}</h4>
                <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 flex-shrink-0">
                  {matchScore}%
                </span>
              </div>
              {/* 擅长标签 */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.tag}`}>
                  {colors.badge} · {creator.level}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-brand-cyan/15 text-brand-cyan/80">
                  {categoryMeta.name}
                </span>
              </div>
              {/* 擅长技能标签 */}
              <div className="flex flex-wrap gap-1">
                {creator.skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-dark-700 text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 个人介绍 */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{creator.bio}</p>

          {/* 操作按钮 - 三按钮横向排列 */}
          <div className="flex items-center gap-2">
            {/* 咨询按钮 - 打开单独对话框 */}
            <button
              onClick={() => openConsultModal(creator)}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/30"
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <span>咨询</span>
            </button>

            {/* 加入服务组按钮 */}
            <button
              onClick={() => isInService ? removeCreatorFromService(creator.id) : addCreatorToService(creator)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                isInService
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-brand-cyan/20 to-blue-500/20 text-brand-cyan border border-brand-cyan/30 hover:from-brand-cyan/30 hover:to-blue-500/30'
              }`}
            >
              {isInService ? (
                <>
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>已加入</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 flex-shrink-0" />
                  <span>加入</span>
                </>
              )}
            </button>

            {/* 详情按钮 */}
            <button
              onClick={() => navigate(`/creator-profile/${creator.id}`, { state: { creator } })}
              className="py-2.5 px-3 rounded-xl text-sm font-medium bg-dark-700 text-gray-300 border border-dark-600 hover:bg-dark-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4 flex-shrink-0" />
              <span>详情</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============ 渲染咨询专家卡片 ============
  const renderConsultantCard = (consultant) => {
    const colors = levelColors[consultant.level] || levelColors.L1
    const matchScore = calculateConsultantMatchScore(consultant)
    const categoryMeta = CONSULTANT_CATEGORIES.find(c => c.id === consultant.category) || CONSULTANT_CATEGORIES[0]
    const isInService = isConsultantInService(consultant.id)

    return (
      <div key={consultant.id} className="opc-card glass-card rounded-2xl overflow-hidden card-hover">
        {/* 顶部渐变色条 */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-purple to-pink-500" />
        <div className="p-5">
          {/* 头部信息：圆形头像 + 昵称 + 擅长标签 */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br ${colors.bg} flex items-center justify-center border-2 ${colors.border} flex-shrink-0`}>
              {consultant.avatarUrl ? (
                <img src={consultant.avatarUrl} alt={consultant.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xl">{consultant.avatar}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-gray-100 truncate">{consultant.name}</h4>
                <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-brand-purple/20 text-brand-purple border border-brand-purple/30 flex-shrink-0">
                  {matchScore}%
                </span>
              </div>
              {/* 擅长标签 */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.tag}`}>
                  {colors.badge} · {consultant.level}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-brand-purple/15 text-brand-purple/80">
                  {categoryMeta.name}
                </span>
              </div>
              {/* 擅长技能标签 */}
              <div className="flex flex-wrap gap-1">
                {consultant.services.slice(0, 3).map((service, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-dark-700 text-gray-300">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 个人介绍 */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{consultant.bio}</p>

          {/* 操作按钮 - 三按钮横向排列 */}
          <div className="flex items-center gap-2">
            {/* 咨询按钮 - 打开单独对话框 */}
            <button
              onClick={() => openConsultModal(consultant)}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/30"
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <span>咨询</span>
            </button>

            {/* 加入服务组按钮 */}
            <button
              onClick={() => isInService ? removeConsultantFromService(consultant.id) : addConsultantToService(consultant)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                isInService
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-brand-purple/20 to-pink-500/20 text-brand-purple border border-brand-purple/30 hover:from-brand-purple/30 hover:to-pink-500/30'
              }`}
            >
              {isInService ? (
                <>
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>已加入</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 flex-shrink-0" />
                  <span>加入</span>
                </>
              )}
            </button>

            {/* 详情按钮 */}
            <button
              onClick={() => navigate(`/creator-profile/${consultant.id}`, { state: { consultant } })}
              className="py-2.5 px-3 rounded-xl text-sm font-medium bg-dark-700 text-gray-300 border border-dark-600 hover:bg-dark-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4 flex-shrink-0" />
              <span>详情</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============ 计算报价 ============
  const calculateQuote = () => {
    let total = 0
    selectedCreators.forEach(c => total += c.hourlyRate * 40)
    selectedConsultants.forEach(c => total += c.hourlyRate * 20)
    return total
  }

  const allParticipants = [...selectedCreators, ...selectedConsultants]

  return (
    <div className="min-h-screen pb-16">
      {/* ========== Hero 区域 ========== */}
      <section className="relative py-8 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-80" />
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-cyan/15 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-purple/20 border border-brand-purple/30 rounded-full text-sm text-brand-purple mb-4">
            <Shield className="w-4 h-4" />
            <span>OPC认证 · 100%平台背书</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            <span className="gradient-text">OPC 智能匹配中心</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-4xl mx-auto mb-4">
            认证AI创作者 + 战略咨询专家，为你提供专业解决方案
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-dark-700/50 rounded-lg border border-dark-600">
              <Users2 className="w-5 h-5 text-brand-cyan" />
              <span className="text-gray-300">{opcCreators.length}位 认证创作者</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-dark-700/50 rounded-lg border border-dark-600">
              <Award className="w-5 h-5 text-brand-purple" />
              <span className="text-gray-300">{opcConsultants.length}位 咨询专家</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TAB切换 ========== */}
      <section className="sticky top-16 lg:top-20 z-40 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-4 py-3">
            <button
              onClick={() => setListTab('creators')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                listTab === 'creators'
                  ? 'bg-gradient-to-r from-brand-cyan to-blue-500 text-white shadow-lg shadow-brand-cyan/20'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              <Sparkle className="w-4 h-4" />
              认证OPC创作者
              <span className={`px-1.5 py-0.5 rounded text-xs ${listTab === 'creators' ? 'bg-white/20' : 'bg-dark-600'}`}>
                {opcCreators.length}
              </span>
            </button>
            <button
              onClick={() => setListTab('consultants')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                listTab === 'consultants'
                  ? 'bg-gradient-to-r from-brand-purple to-pink-500 text-white shadow-lg shadow-brand-purple/20'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              <Crown className="w-4 h-4" />
              认证OPC咨询专家
              <span className={`px-1.5 py-0.5 rounded text-xs ${listTab === 'consultants' ? 'bg-white/20' : 'bg-dark-600'}`}>
                {opcConsultants.length}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ========== 主体内容区 ========== */}
      <div className="container-custom py-6">
        {/* ========== 智配咨询区 - 按照布局图 ========== */}
        <div className={`bg-dark-800/80 border border-dark-600 rounded-2xl overflow-hidden ${consultCollapsed ? 'w-fit mb-0' : 'mb-6'} transition-all duration-300`}>
          {/* 标题栏 - 居中 + 折叠按钮 */}
          <div className={`px-6 py-4 bg-gradient-to-r from-dark-900/80 via-dark-800/80 to-dark-900/80 border-b border-dark-700 ${consultCollapsed ? '!p-0' : ''}`}>
            {/* 折叠状态：只显示小圆圈 */}
            {consultCollapsed ? (
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setConsultCollapsed(false)}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/40 to-orange-500/40 border-2 border-amber-500/60 flex items-center justify-center hover:scale-110 hover:border-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/30"
                >
                  <MessageSquare className="w-6 h-6 text-amber-400" />
                </button>
              </div>
            ) : (
              /* 展开状态：完整标题栏 */
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="gradient-text">智配咨询区</span>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                  </div>
                </h3>
                <button
                  onClick={() => setConsultCollapsed(true)}
                  className="p-2 rounded-lg bg-dark-900/50 border border-dark-600 hover:bg-dark-700/50 hover:border-dark-500 transition-all"
                  title="收起"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400 rotate-180" />
                </button>
              </div>
            )}
          </div>

          {/* 主体内容 - 折叠时隐藏 */}
          {!consultCollapsed && (
            <div className="flex" style={{ minHeight: '400px' }}>
            {/* 左侧：服务组 + 企业信息 + 报价区 */}
            <div className="w-64 border-r border-dark-700 flex flex-col">
              {/* 服务组标签 */}
              <div className="px-4 py-3 bg-dark-900/50 border-b border-dark-700">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Users2 className="w-4 h-4" />
                  服务组
                </div>
              </div>

              {/* 企业信息 */}
              <div className="flex-1 p-4 border-b border-dark-700">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-brand-cyan" />
                  <span className="text-sm font-medium text-white">企业信息</span>
                </div>
                <div className="bg-dark-900/50 rounded-lg p-3">
                  <h4 className="font-bold text-white text-sm mb-2">{enterprise.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-4 mb-2">{enterprise.demand || '暂无需求描述'}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      匹配中
                    </span>
                    {diagnosisResult.level && (
                      <span className="px-2 py-0.5 rounded text-xs bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                        {diagnosisResult.level}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 报价区 */}
              <div className="p-4 bg-dark-900/30">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">企业需求报价区</span>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">预估报价</span>
                    <span className="text-lg font-bold text-green-400">¥{calculateQuote().toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>创作者: {selectedCreators.length}人</span>
                      <span>¥{selectedCreators.reduce((s, c) => s + c.hourlyRate * 40, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>咨询专家: {selectedConsultants.length}人</span>
                      <span>¥{selectedConsultants.reduce((s, c) => s + c.hourlyRate * 20, 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：OPC创作者 + OPC咨询专家 + 聊天区 */}
            <div className="flex-1 flex flex-col">
              {/* 上方：OPC创作者展区 + OPC咨询专家展区（并排） */}
              <div className="flex border-b border-dark-700" style={{ minHeight: '180px' }}>
                {/* OPC创作者展区 */}
                <div className="flex-1 border-r border-dark-700">
                  <div className="px-4 py-2 bg-dark-900/30 border-b border-dark-700">
                    <div className="flex items-center gap-2">
                      <Sparkle className="w-4 h-4 text-brand-cyan" />
                      <span className="text-sm font-medium text-brand-cyan">OPC创作者展区</span>
                      <span className="text-xs text-gray-500">({selectedCreators.length})</span>
                    </div>
                  </div>
                  <div className="p-3 flex flex-wrap gap-2 max-h-[140px] overflow-y-auto">
                    {selectedCreators.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 text-sm w-full">
                        <Users2 className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        暂无创作者
                      </div>
                    ) : (
                      selectedCreators.map(creator => {
                        const colors = levelColors[creator.level] || levelColors.L1
                        return (
                          <div key={creator.id} className="flex items-center gap-2 px-3 py-2 bg-dark-900/50 rounded-lg border border-brand-cyan/20">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center text-white font-bold text-sm border ${colors.border}`}>
                              {creator.avatar}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-white text-sm">{creator.name}</span>
                                <span className={`px-1 rounded text-[10px] ${colors.tag}`}>{creator.level}</span>
                              </div>
                              <span className="text-xs text-gray-500 truncate block">{creator.title}</span>
                            </div>
                            <button
                              onClick={() => removeCreatorFromService(creator.id)}
                              className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-all ml-1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                {/* OPC咨询专家展区 */}
                <div className="flex-1">
                  <div className="px-4 py-2 bg-dark-900/30 border-b border-dark-700">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm font-medium text-brand-purple">OPC咨询专家展区</span>
                      <span className="text-xs text-gray-500">({selectedConsultants.length})</span>
                    </div>
                  </div>
                  <div className="p-3 flex flex-wrap gap-2 max-h-[140px] overflow-y-auto">
                    {selectedConsultants.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 text-sm w-full">
                        <Award className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        暂无专家
                      </div>
                    ) : (
                      selectedConsultants.map(consultant => {
                        const colors = levelColors[consultant.level] || levelColors.L1
                        return (
                          <div key={consultant.id} className="flex items-center gap-2 px-3 py-2 bg-dark-900/50 rounded-lg border border-brand-purple/20">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center text-white font-bold text-sm border ${colors.border} relative`}>
                              {consultant.avatar}
                              <Shield className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-purple rounded-full" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-white text-sm">{consultant.name}</span>
                                <span className={`px-1 rounded text-[10px] ${colors.tag}`}>{consultant.level}</span>
                              </div>
                              <span className="text-xs text-gray-500 truncate block">{consultant.title}</span>
                            </div>
                            <button
                              onClick={() => removeConsultantFromService(consultant.id)}
                              className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-all ml-1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* 下方：聊天区 */}
              <div className="flex-1 flex flex-col">
                <div className="px-4 py-2 bg-dark-900/30 border-b border-dark-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-white">聊天区</span>
                    <span className="text-xs text-gray-500">（加到组的人都可以说话）</span>
                  </div>
                  {allParticipants.length > 0 && chatMessages.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      在线
                    </div>
                  )}
                </div>

                {/* 聊天消息 */}
                <div className="flex-1 p-4 overflow-y-auto max-h-[200px] space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-sm">点击"开始咨询"开始对话</p>
                      <p className="text-xs text-gray-600 mt-1">服务组成员可在此交流</p>
                    </div>
                  ) : (
                    chatMessages.map(msg => {
                      if (msg.sender === 'system') {
                        return (
                          <div key={msg.id} className="flex justify-center">
                            <div className="px-4 py-2 bg-dark-700/50 rounded-full text-xs text-gray-500 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3" />
                              {msg.content}
                            </div>
                          </div>
                        )
                      }
                      const isUser = msg.sender === 'user'
                      const isCreator = msg.senderType === 'creator'
                      const colors = levelColors[msg.senderLevel] || levelColors.L1
                      return (
                        <div key={msg.id} className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                          {!isUser && (
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center text-white font-bold text-xs border ${colors.border} flex-shrink-0 relative`}>
                              {msg.senderAvatar}
                              {!isCreator && (
                                <Shield className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-purple rounded-full" />
                              )}
                            </div>
                          )}
                          <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                            {!isUser && <span className="text-[10px] text-gray-500">{msg.senderName}</span>}
                            <div className={`px-3 py-2 rounded-xl text-sm ${
                              isUser
                                ? 'bg-brand-cyan text-white rounded-tr-sm'
                                : isCreator
                                  ? 'bg-dark-700 text-gray-200 rounded-tl-sm'
                                  : 'bg-brand-purple/20 text-gray-200 rounded-tl-sm border border-brand-purple/20'
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* 输入区 */}
                <div className="p-3 border-t border-dark-700 bg-dark-900/30">
                  {chatMessages.length === 0 ? (
                    <button
                      onClick={handleStartChat}
                      disabled={allParticipants.length === 0}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      开始咨询
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button className="p-2.5 rounded-lg bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 transition-all">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 rounded-lg bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 transition-all">
                        <Image className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 rounded-lg bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 transition-all">
                        <Video className="w-4 h-4" />
                      </button>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="输入消息..."
                        className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-cyan/50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!chatInput.trim()}
                        className="px-5 py-2.5 rounded-lg bg-brand-cyan text-white font-medium hover:bg-brand-cyan/80 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        发送
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* ========== 人员列表区 ========== */}
        <div className={consultCollapsed ? 'pt-4 pb-20' : 'section-padding'}>
          {/* 认证OPC创作者列表 */}
          {listTab === 'creators' && (
            <div>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-6 bg-gradient-to-b from-brand-cyan to-blue-500 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-100">全部认证创作者</h2>
                  <span className="text-gray-500 text-sm">共 {filteredCreators.length} 位</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {CREATOR_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCreatorFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        creatorFilter === cat.id
                          ? 'text-white border-transparent'
                          : 'text-gray-400 bg-dark-700/50 border-dark-600 hover:text-white hover:bg-dark-700 hover:border-dark-500'
                      }`}
                      style={creatorFilter === cat.id ? { background: `linear-gradient(135deg, ${cat.color}25, ${cat.color}10)`, borderColor: `${cat.color}40` } : {}}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      {creatorFilter === cat.id && <Check className="w-3.5 h-3.5" style={{ color: cat.color }} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCreators.map(creator => renderCreatorCard(creator))}
              </div>

              {filteredCreators.length === 0 && (
                <div className="text-center py-16">
                  <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">该分类暂无认证创作者</p>
                </div>
              )}
            </div>
          )}

          {/* 认证OPC咨询专家列表 */}
          {listTab === 'consultants' && (
            <div>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-6 bg-gradient-to-b from-brand-purple to-pink-500 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-100">全部咨询专家</h2>
                  <span className="text-gray-500 text-sm">共 {filteredConsultants.length} 位</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {CONSULTANT_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setConsultantFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        consultantFilter === cat.id
                          ? 'text-white border-transparent'
                          : 'text-gray-400 bg-dark-700/50 border-dark-600 hover:text-white hover:bg-dark-700 hover:border-dark-500'
                      }`}
                      style={consultantFilter === cat.id ? { background: `linear-gradient(135deg, ${cat.color}25, ${cat.color}10)`, borderColor: `${cat.color}40` } : {}}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      {consultantFilter === cat.id && <Check className="w-3.5 h-3.5" style={{ color: cat.color }} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredConsultants.map(consultant => renderConsultantCard(consultant))}
              </div>

              {filteredConsultants.length === 0 && (
                <div className="text-center py-16">
                  <Crown className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">该分类暂无咨询专家</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========== 单独咨询弹窗 ========== */}
      {consultModal.show && consultModal.participant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 背景遮罩 */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeConsultModal} />

          {/* 弹窗内容 */}
          <div className="relative w-full max-w-lg bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '70vh', maxHeight: '600px' }}>
            {/* 头部 */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-b border-dark-700">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                  consultModal.participant.category ? levelColors[consultModal.participant.level]?.bg : 'from-brand-purple/20 to-pink-500/20'
                } flex items-center justify-center text-white font-bold border ${
                  consultModal.participant.category ? levelColors[consultModal.participant.level]?.border : 'border-brand-purple/30'
                } relative`}>
                  {consultModal.participant.avatar}
                  {consultModal.participant.services && (
                    <Shield className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-brand-purple rounded-full" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white">{consultModal.participant.name}</h4>
                  <p className="text-xs text-gray-400">{consultModal.participant.title}</p>
                </div>
              </div>
              <button
                onClick={closeConsultModal}
                className="p-2 rounded-lg bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {consultModal.messages.map(msg => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <div className="px-4 py-2 bg-dark-700/50 rounded-full text-xs text-gray-500 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        {msg.content}
                      </div>
                    </div>
                  )
                }
                const isUser = msg.sender === 'user'
                const isCreator = msg.senderType === 'creator'
                const colors = levelColors[msg.senderLevel] || levelColors.L1
                return (
                  <div key={msg.id} className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                    {!isUser && (
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center text-white font-bold text-xs border ${colors.border} flex-shrink-0 relative`}>
                        {msg.senderAvatar}
                        {!isCreator && (
                          <Shield className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-purple rounded-full" />
                        )}
                      </div>
                    )}
                    <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                      {!isUser && <span className="text-[10px] text-gray-500">{msg.senderName}</span>}
                      <div className={`px-3 py-2 rounded-xl text-sm ${
                        isUser
                          ? 'bg-brand-cyan text-white rounded-tr-sm'
                          : isCreator
                            ? 'bg-dark-700 text-gray-200 rounded-tl-sm'
                            : 'bg-brand-purple/20 text-gray-200 rounded-tl-sm border border-brand-purple/20'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <span className="text-[10px] text-gray-500 mt-1 block">{msg.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={consultEndRef} />
            </div>

            {/* 输入区 */}
            <div className="p-4 border-t border-dark-700 bg-dark-900/50">
              <div className="flex gap-2">
                <button className="p-2.5 rounded-lg bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 transition-all">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-lg bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 transition-all">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-lg bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 transition-all">
                  <Video className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={consultInput}
                  onChange={(e) => setConsultInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendConsultMessage()}
                  placeholder="输入消息..."
                  className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-cyan/50"
                />
                <button
                  onClick={sendConsultMessage}
                  disabled={!consultInput.trim()}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
