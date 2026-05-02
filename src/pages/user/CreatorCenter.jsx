import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Briefcase, TrendingUp, Users, BookOpen, DollarSign, 
  Plus, Eye, Heart, Settings, BarChart3, Wallet, FileText, Star,
  Edit, Trash2, ToggleLeft, User, Save, CheckCircle, Crown,
  Video, Image, BookMarked, Play, Clock, Lock, Trophy,
  ClipboardList, ArrowRight, CheckCircle2, XCircle, Clock3,
  Sparkles, MessageSquare, Wand2, Users2, Target, ArrowUpRight
} from 'lucide-react';
import './CreatorCenter.css';

// 六大课程/案例分类元数据（与培训孵化板块保持一致）
const CATEGORY_META = {
  shortvideo: { id: 'shortvideo', name: 'AI短视频', icon: '🎬', color: '#22d3ee' },
  shortdrama: { id: 'shortdrama', name: 'AI短剧', icon: '🎭', color: '#a78bfa' },
  mangadrama: { id: 'mangadrama', name: 'AI漫剧', icon: '📚', color: '#f472b6' },
  film: { id: 'film', name: 'AI电影', icon: '🎥', color: '#fb923c' },
  designer: { id: 'designer', name: 'AI设计师', icon: '🎨', color: '#34d399' },
  commerce: { id: 'commerce', name: 'AI带货变现', icon: '💰', color: '#fbbf24' }
};

// OPC等级颜色映射
const levelColors = {
  L1: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', text: 'text-green-400', tag: 'bg-green-500/20 text-green-400' },
  L2: { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', text: 'text-blue-400', tag: 'bg-blue-500/20 text-blue-400' },
  L3: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', text: 'text-purple-400', tag: 'bg-purple-500/20 text-purple-400' },
  L4: { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', text: 'text-amber-400', tag: 'bg-amber-500/20 text-amber-400' }
};

// OPC创作者分类
const CREATOR_CATEGORIES = [
  { id: 'ai_video', name: 'AI视频', icon: '🎬', color: '#22d3ee', desc: 'AI生成视频、短视频制作' },
  { id: 'ai_ad_film', name: 'AI广告电影', icon: '🎥', color: '#f97316', desc: 'AI广告片、企业宣传片' },
  { id: 'ai_designer', name: 'AI设计师', icon: '🎨', color: '#34d399', desc: 'UI设计、品牌视觉、海报' },
  { id: 'ai_shortdrama', name: 'AI短剧漫剧', icon: '🎭', color: '#a78bfa', desc: 'AI短剧、漫画、动漫' },
  { id: 'ai_wenlv', name: 'AI文旅宣传片', icon: '🏛️', color: '#ec4899', desc: '文旅推广、城市宣传' }
];

// OPC咨询专家分类
const CONSULTANT_CATEGORIES = [
  { id: 'strategy', name: '企业战略咨询', icon: '🎯', color: '#6366f1', desc: '战略规划、商业模式设计' },
  { id: 'listing', name: '企业上市咨询', icon: '🏛️', color: '#8b5cf6', desc: 'IPO辅导、上市准备' },
  { id: 'financing', name: '企业融资咨询', icon: '💰', color: '#10b981', desc: '融资规划、投资人对接' },
  { id: 'equity', name: '企业股权架构', icon: '📊', color: '#14b8a6', desc: '股权设计、合伙人机制' },
  { id: 'overseas', name: '企业战略出海', icon: '🌏', color: '#f59e0b', desc: '出海战略、海外市场拓展' },
  { id: 'ai_upgrade', name: '企业AI升级转型', icon: '🤖', color: '#3b82f6', desc: 'AI落地、数字化转型' },
  { id: 'deployment', name: '企业私有化部署', icon: '🔒', color: '#64748b', desc: '私有云、数据安全合规' }
];

// 认证OPC创作者数据
const mockOPCCreators = [
  { id: 'cr_001', name: '林导', avatar: '林', level: 'L4', title: 'AI短剧导演', category: 'ai_shortdrama', skills: ['AI短剧', '分镜设计', '剧本创作'], rating: 4.9, completedProjects: 68, hourlyRate: 1200, availability: '可接单', tags: ['精品创作', '高端定制'], bio: '资深影视导演，专注AI短剧创作，代表作品《觉醒年代》AI版' },
  { id: 'cr_002', name: '张视觉', avatar: '张', level: 'L3', title: 'AI视觉设计师', category: 'ai_designer', skills: ['AI设计', '品牌视觉', '海报'], rating: 4.8, completedProjects: 45, hourlyRate: 800, availability: '可接单', tags: ['品牌升级', '视觉创意'], bio: '前4A设计总监，AI驱动品牌视觉设计专家' },
  { id: 'cr_003', name: '王视频', avatar: '王', level: 'L3', title: 'AI视频制作师', category: 'ai_video', skills: ['AI视频', '特效合成', '剪辑'], rating: 4.7, completedProjects: 52, hourlyRate: 700, availability: '忙碌', tags: ['短视频', '商业视频'], bio: '短视频制作专家，擅长AI生成视频和后期特效' },
  { id: 'cr_004', name: '陈电影', avatar: '陈', level: 'L4', title: 'AI广告电影人', category: 'ai_ad_film', skills: ['广告片', '宣传片', '微电影'], rating: 4.9, completedProjects: 38, hourlyRate: 1500, availability: '可接单', tags: ['大片制作', '顶级资源'], bio: '获金狮奖导演，AI广告电影先驱，服务过阿里、字节' },
  { id: 'cr_005', name: '赵文旅', avatar: '赵', level: 'L2', title: 'AI文旅创意师', category: 'ai_wenlv', skills: ['文旅创意', '城市推广', '景区宣传'], rating: 4.6, completedProjects: 22, hourlyRate: 500, availability: '可接单', tags: ['文旅策划', '创意内容'], bio: '文旅营销专家，专注AI文旅宣传片和城市品牌打造' },
  { id: 'cr_006', name: '刘漫剧', avatar: '刘', level: 'L3', title: 'AI漫剧创作者', category: 'ai_shortdrama', skills: ['AI漫剧', '漫画创作', 'IP孵化'], rating: 4.8, completedProjects: 35, hourlyRate: 750, availability: '可接单', tags: ['IP孵化', '漫剧创作'], bio: '动漫IP创作专家，专注AI漫剧和原创IP孵化' },
  { id: 'cr_007', name: '孙设计', avatar: '孙', level: 'L2', title: 'AI UI设计师', category: 'ai_designer', skills: ['UI设计', 'UX优化', '交互设计'], rating: 4.7, completedProjects: 28, hourlyRate: 600, availability: '可接单', tags: ['互联网产品', '用户体验'], bio: '资深UI设计师，AI赋能数字化产品设计' },
  { id: 'cr_008', name: '周视频', avatar: '周', level: 'L1', title: 'AI短视频达人', category: 'ai_video', skills: ['AI剪辑', '短视频', '内容创作'], rating: 4.5, completedProjects: 15, hourlyRate: 350, availability: '可接单', tags: ['新手友好', '高性价比'], bio: '短视频内容创作者，AI辅助内容生产效率专家' }
];

// 认证OPC咨询专家数据
const mockOPCConsultants = [
  { id: 'cs_001', name: '钱战略', avatar: '钱', level: 'L4', title: '首席战略顾问', category: 'strategy', skills: ['战略规划', '商业模式', '组织架构'], rating: 4.9, completedProjects: 120, hourlyRate: 3000, availability: '可接单', tags: ['顶级智库', '上市公司'], bio: '前麦肯锡合伙人，服务50+上市企业战略规划' },
  { id: 'cs_002', name: '孙上市', avatar: '孙', level: 'L4', title: '上市辅导专家', category: 'listing', skills: ['IPO上市', '合规整改', '市值管理'], rating: 4.9, completedProjects: 85, hourlyRate: 3500, availability: '可接单', tags: ['全程陪跑', '成功率高'], bio: '主导20+企业IPO，深交所、北交所特聘顾问' },
  { id: 'cs_003', name: '周融资', avatar: '周', level: 'L3', title: '融资顾问', category: 'financing', skills: ['融资规划', 'BP优化', '投资人库'], rating: 4.8, completedProjects: 68, hourlyRate: 2000, availability: '可接单', tags: ['资源对接', '高效融资'], bio: '帮助50+企业完成A-C轮融资，对接200+投资机构' },
  { id: 'cs_004', name: '吴股权', avatar: '吴', level: 'L3', title: '股权架构师', category: 'equity', skills: ['股权设计', '合伙人机制', '期权激励'], rating: 4.8, completedProjects: 55, hourlyRate: 1800, availability: '可接单', tags: ['法律合规', '长期顾问'], bio: '股权设计专家，专注创业公司合伙人机制设计' },
  { id: 'cs_005', name: '郑出海', avatar: '郑', level: 'L3', title: '出海战略顾问', category: 'overseas', skills: ['海外市场', '本地化', '跨境合规'], rating: 4.7, completedProjects: 42, hourlyRate: 2200, availability: '忙碌', tags: ['东南亚', '中东市场'], bio: '10年出海经验，成功帮助30+企业布局海外市场' },
  { id: 'cs_006', name: '冯AI', avatar: '冯', level: 'L4', title: 'AI转型专家', category: 'ai_upgrade', skills: ['AI落地', '数字化转型', '流程再造'], rating: 4.9, completedProjects: 78, hourlyRate: 2500, availability: '可接单', tags: ['产业赋能', '实战派'], bio: '前阿里云架构师，专注企业AI升级转型落地' },
  { id: 'cs_007', name: '卫安全', avatar: '卫', level: 'L3', title: '安全部署专家', category: 'deployment', skills: ['私有化部署', '数据安全', '合规认证'], rating: 4.8, completedProjects: 45, hourlyRate: 2000, availability: '可接单', tags: ['安全合规', '等保认证'], bio: '信息安全专家，帮20+企业完成私有化部署和等保认证' }
];

// 套餐对应咨询专家数量
const PACKAGE_CONSULTANT_COUNT = {
  'sail': 1,    // 启航版配1个咨询专家
  'growth': 3,  // 成长版配3个咨询专家
  'premium': 5  // 旗舰版配5个咨询专家
};

// 项目类型选项
const projectTypes = [
  { id: 'ai_short_video', name: 'AI短视频制作', icon: '🎬', price: '¥5,000-20,000' },
  { id: 'digital_human', name: '数字人定制', icon: '👤', price: '¥10,000-50,000' },
  { id: 'ai_customer_service', name: '智能客服搭建', icon: '🤖', price: '¥8,000-30,000' },
  { id: 'content_strategy', name: '内容策略咨询', icon: '📊', price: '¥3,000-10,000' },
  { id: 'ai_training', name: 'AI技能培训', icon: '📚', price: '¥2,000-8,000' },
  { id: 'brand_marketing', name: '品牌营销全案', icon: '🎯', price: '¥20,000-100,000' },
  { id: 'other', name: '其他定制服务', icon: '🔧', price: '面议' }
];

// 预算选项
const budgetRanges = [
  { value: 'below_5k', label: '5,000元以下' },
  { value: '5k_10k', label: '5,000-10,000元' },
  { value: '10k_30k', label: '10,000-30,000元' },
  { value: '30k_50k', label: '30,000-50,000元' },
  { value: 'above_50k', label: '50,000元以上' },
  { value: 'negotiable', label: '面议' }
];

// 时间周期选项
const timelineOptions = [
  { value: 'urgent', label: '紧急（1周内）', icon: '🔥' },
  { value: 'normal', label: '标准（2-4周）', icon: '⏱️' },
  { value: 'relaxed', label: '宽松（1-2月）', icon: '📅' },
  { value: 'flexible', label: '灵活协商', icon: '🤝' }
];

// 创作者资料初始化
const defaultCreatorProfile = {
  name: '林小艺',
  title: 'AI创作导师 | 短视频运营专家',
  avatar: '👩‍💻',
  avatarUrl: '',
  bio: '专注AI内容创作5年，服务过100+品牌客户。擅长AI短视频制作、创意内容策划，帮助1000+学员实现内容变现。',
  skills: ['AI短视频', '内容策划', '流量运营', '变现指导'],
  douyinId: 'aixiaoyi2024',
  douyinFans: '52.3万',
  wechatId: 'AI小艺课堂',
  wechatFans: '18.6万',
  xiaohongshuId: 'aixiaoyi',
  xiaohongshuFans: '8.9万',
  featuredWorks: [], // 代表作品ID列表
  // 新增：讲师身份设置
  isSignedInstructor: true,
  instructorBadge: '签约讲师',
  // 新增：平台粉丝数据（用于课程详情页展示）
  platformFans: {
    douyin: 52.3,
    wechat: 18.6,
    xiaohongshu: 8.9,
    total: 79.8
  },
  totalWorks: 12,
  totalStudents: 3560
}

export default function CreatorCenter() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(defaultCreatorProfile);
  const [toast, setToast] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [user, setUser] = useState(null);
  
  // 真实数据统计
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalFans: 0,
    totalEarnings: 0,
    pendingOrders: 0,
    tutorialsUnlocked: 0,
    casesCount: 0,
    tutorialsCount: 0
  });
  
  // 我的案例和教程（从localStorage读取）
  const [myCases, setMyCases] = useState([]);
  const [myTutorials, setMyTutorials] = useState([]);
  
  // 选择代表作品弹窗
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [selectedFeatured, setSelectedFeatured] = useState([]);

  // 认证申请状态
  const [certification, setCertification] = useState({
    status: 'none', // none: 未申请, pending: 审核中, approved: 已认证, rejected: 未通过
    skills: [], // 擅长的领域
    works: [], // 作品列表 { category, title, url, description }
    applyTime: null,
    rejectReason: ''
  });
  
  // OPC认证状态（来自 /opc-certification）
  const [opcCertification, setOpcCertification] = useState(null);
  
  // 分类ID转名称映射
  const categoryMap = {
    'shortvideo': 'AI短视频',
    'shortdrama': 'AI短剧',
    'mangadrama': 'AI漫剧',
    'film': 'AI电影',
    'designer': 'AI设计师',
    'commerce': 'AI带货变现',
  };

  // 申请表单
  const [applyForm, setApplyForm] = useState({
    skills: [],
    works: []
  });

  // 添加作品临时变量
  const [tempWorkCategory, setTempWorkCategory] = useState('');
  const [tempWorkTitle, setTempWorkTitle] = useState('');
  const [tempWorkUrl, setTempWorkUrl] = useState('');

  // OPC智能匹配中心状态
  const [opcMainTab, setOpcMainTab] = useState('creators'); // creators | consultants
  const [creatorFilter, setCreatorFilter] = useState('all'); // all | {categoryId} | recommended
  const [consultantFilter, setConsultantFilter] = useState('all'); // all | {categoryId} | recommended
  const [selectedOPC, setSelectedOPC] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // 计算OPC推荐度（创作者）
  const calculateCreatorMatchScore = (creator) => {
    const diagnosisResult = JSON.parse(localStorage.getItem('enterprise_diagnosis_result') || '{}');
    if (!diagnosisResult.level) return Math.floor(Math.random() * 30) + 60;
    
    const enterpriseLevel = diagnosisResult.level.split(' ')[0];
    const levelOrder = ['L1', 'L2', 'L3', 'L4'];
    const enterpriseIdx = levelOrder.indexOf(enterpriseLevel) || 0;
    const creatorIdx = levelOrder.indexOf(creator.level) || 0;
    
    const levelDiff = Math.abs(enterpriseIdx - creatorIdx);
    const levelScore = Math.max(0, 50 - levelDiff * 20);
    const ratingScore = (creator.rating / 5) * 30;
    const expScore = Math.min(creator.completedProjects / 50, 1) * 20;
    
    return Math.round(levelScore + ratingScore + expScore);
  };

  // 计算咨询专家推荐度
  const calculateConsultantMatchScore = (consultant) => {
    const consultationIntent = JSON.parse(localStorage.getItem('consultation_intent') || '{}');
    const packageName = consultationIntent.packageName || '';
    
    // 套餐匹配度
    let packageScore = 50;
    if (packageName.includes('旗舰')) packageScore = 100;
    else if (packageName.includes('成长')) packageScore = 75;
    else if (packageName.includes('启航')) packageScore = 60;
    
    // 等级匹配
    const levelOrder = ['L1', 'L2', 'L3', 'L4'];
    const consultantIdx = levelOrder.indexOf(consultant.level) || 0;
    const levelScore = (4 - consultantIdx) * 15;
    
    // 评分
    const ratingScore = (consultant.rating / 5) * 20;
    
    return Math.round(packageScore * 0.4 + levelScore * 0.3 + ratingScore * 0.3);
  };

  // 获取推荐的创作者（基于诊断结果）
  const getRecommendedCreators = () => {
    return mockOPCCreators
      .map(c => ({ ...c, matchScore: calculateCreatorMatchScore(c) }))
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  // 获取推荐的咨询专家（基于套餐）
  const getRecommendedConsultants = () => {
    const consultationIntent = JSON.parse(localStorage.getItem('consultation_intent') || '{}');
    const packageType = consultationIntent.package || 'sail';
    const maxCount = PACKAGE_CONSULTANT_COUNT[packageType] || 1;
    
    return mockOPCConsultants
      .map(c => ({ ...c, matchScore: calculateConsultantMatchScore(c) }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxCount);
  };

  // 打开聊天弹窗
  const openChat = (opc, type) => {
    setSelectedOPC({ ...opc, type }); // type: 'creator' | 'consultant'
    setChatMessages([
      { id: 1, role: 'system', content: `您正在与${opc.name}进行咨询，${opc.type === 'consultant' ? opc.title : 'OPC创作者'}，${opc.bio}` },
      { id: 2, role: 'assistant', content: `您好！我是${opc.name}，${opc.bio}。请问有什么可以帮您的？` }
    ]);
    setShowChatModal(true);
  };

  // 发送消息
  const sendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      role: 'user',
      content: chatInput
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
    
    // 模拟OPC回复
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `感谢您的咨询！基于您的需求，建议我们先详细了解项目背景，然后制定专属方案。请告诉我更多关于您的项目情况？`
      };
      setChatMessages(prev => [...prev, reply]);
    }, 1000);
  };

  // 保存咨询意向
  const saveConsultationIntent = (opc, type) => {
    const existingIntents = JSON.parse(localStorage.getItem('opc_consultation_intents') || '[]');
    const newIntent = {
      id: `intent_${Date.now()}`,
      opcId: opc.id,
      opcName: opc.name,
      opcType: type,
      packageName: JSON.parse(localStorage.getItem('consultation_intent') || '{}').packageName || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('opc_consultation_intents', JSON.stringify([newIntent, ...existingIntents]));
  };

  // 添加作品
  const addWork = () => {
    if (tempWorkCategory && tempWorkTitle) {
      setApplyForm({
        ...applyForm,
        works: [...applyForm.works, {
          category: tempWorkCategory,
          title: tempWorkTitle,
          url: tempWorkUrl
        }]
      })
      setTempWorkCategory('')
      setTempWorkTitle('')
      setTempWorkUrl('')
    }
  };

  // 提交认证申请
  const submitCertification = () => {
    if (applyForm.skills.length === 0 || applyForm.works.length === 0) {
      setToast('请完善认证申请信息')
      return
    }

    const newCert = {
      status: 'pending',
      skills: applyForm.skills,
      works: applyForm.works,
      applyTime: new Date().toISOString(),
      rejectReason: ''
    };

    setCertification(newCert);
    localStorage.setItem('creatorCertification', JSON.stringify(newCert));
    setToast('认证申请已提交，请等待审核');
  };

  // 模拟审核通过（演示用）
  const simulateApprove = () => {
    const approvedCert = { ...certification, status: 'approved' };
    setCertification(approvedCert);
    localStorage.setItem('creatorCertification', JSON.stringify(approvedCert));

    // 更新创作者资料，添加认证标签
    const updatedProfile = {
      ...creatorProfile,
      isCertified: true,
      certifiedSkills: certification.skills
    };
    localStorage.setItem('creatorProfile', JSON.stringify(updatedProfile));
    setCreatorProfile(updatedProfile);
    setToast('恭喜！您已成为认证创作者');
  };

  // 模拟审核拒绝（演示用）
  const simulateReject = () => {
    const rejectedCert = { ...certification, status: 'rejected', rejectReason: '作品链接无法访问，请提供有效的作品链接' };
    setCertification(rejectedCert);
    localStorage.setItem('creatorCertification', JSON.stringify(rejectedCert));
    setToast('认证申请未通过');
  };

  const lastProfileRef = useRef(null);

  // 从 localStorage 加载创作者资料和普通用户信息
  useEffect(() => {
    const loadCreatorProfile = () => {
      // 加载普通用户信息
      const userStr = localStorage.getItem('user')
      if (userStr) {
        setUser(JSON.parse(userStr))
      }

      const saved = localStorage.getItem('creatorProfile')
      if (saved) {
        const parsed = JSON.parse(saved)
        setCreatorProfile(parsed)
        setEditForm(parsed)
        setSelectedFeatured(parsed.featuredWorks || [])
        lastProfileRef.current = saved
      } else {
        // 不自动创建默认资料
        setCreatorProfile(null)
        setEditForm(defaultCreatorProfile)
      }

      // 加载认证状态
      const certSaved = localStorage.getItem('creatorCertification')
      if (certSaved) {
        setCertification(JSON.parse(certSaved))
      }
      
      // 加载OPC认证状态
      const opcCertSaved = localStorage.getItem('opcCertification')
      if (opcCertSaved) {
        setOpcCertification(JSON.parse(opcCertSaved))
      }
    }
    loadCreatorProfile()
    // 监听资料更新事件
    window.addEventListener('creatorProfileUpdated', loadCreatorProfile)
    return () => window.removeEventListener('creatorProfileUpdated', loadCreatorProfile)
  }, [])

  // 自动填充示例数据（如果为空）
  useEffect(() => {
    const checkAndPopulateSampleData = () => {
      const publishedCases = JSON.parse(localStorage.getItem('publishedCases') || '[]');
      const savedTutorials = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
      
      // 如果案例和教程都为空，自动填充示例数据
      if (publishedCases.length === 0 && savedTutorials.length === 0) {
        // 动态导入示例数据
        import('./sampleData').then(module => {
          if (module.populateSampleData) {
            module.populateSampleData();
            // 刷新数据
            setTimeout(() => {
              const newCases = JSON.parse(localStorage.getItem('publishedCases') || '[]');
              const newTutorials = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
              setMyCases(newCases.filter(c => c.status === 'published'));
              setMyTutorials(newTutorials.filter(t => t.status === 'published'));
            }, 100);
          }
        }).catch(() => {
          // 如果导入失败，使用内联数据
          console.log('使用内联示例数据...');
          populateInlineSampleData();
        });
      }
    };
    
    checkAndPopulateSampleData();
  }, []);

  // 从 URL 参数读取 tab 并自动切换到 OPC 智能匹配中心
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'opc-experts') {
      setActiveTab('opc-experts');
      // 如果有套餐信息，自动切换到咨询专家子Tab
      const consultationIntent = JSON.parse(localStorage.getItem('consultation_intent') || '{}');
      if (consultationIntent.package) {
        setOpcMainTab('consultants'); // 默认显示咨询专家
        setConsultantFilter('recommended');
      } else {
        setOpcMainTab('creators'); // 默认显示创作者
        setCreatorFilter('recommended');
      }
    } else if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  
  // 加载真实数据统计
  useEffect(() => {
    const loadRealStats = () => {
      // 从 localStorage 读取案例数据
      const publishedCases = JSON.parse(localStorage.getItem('publishedCases') || '[]');
      // 从 localStorage 读取教程数据
      const savedTutorials = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
      // 从 localStorage 读取订单数据
      const orders = JSON.parse(localStorage.getItem('creatorOrders') || '[]');
      
      // 计算统计数据
      let totalViews = 0;
      let totalLikes = 0;
      let totalEarnings = 0;
      
      // 案例统计（只统计已发布的）
      const myPublishedCases = publishedCases.filter(c => c.status === 'published');
      myPublishedCases.forEach(c => {
        totalViews += c.views || 0;
        totalLikes += c.likes || 0;
        totalEarnings += (c.earnings || 0);
      });
      
      // 教程统计（只统计已发布的）
      const myPublishedTutorials = savedTutorials.filter(t => t.status === 'published');
      myPublishedTutorials.forEach(t => {
        totalViews += t.views || 0;
        totalLikes += t.likes || 0;
        totalEarnings += (t.earnings || 0);
      });
      
      // 进行中的订单
      const pendingOrders = orders.filter(o => o.status === '进行中' || o.status === '待开始').length;
      
      setStats({
        totalViews: totalViews || 25896, // 如果没有数据则显示默认值
        totalLikes: totalLikes || 1568,
        totalFans: creatorProfile ? (parseInt(creatorProfile.douyinFans || 0) * 10000 + parseInt(creatorProfile.wechatFans || 0) * 10000 + parseInt(creatorProfile.xiaohongshuFans || 0) * 10000) : 2580,
        totalEarnings: totalEarnings || 25800,
        pendingOrders: pendingOrders || 3,
        tutorialsUnlocked: myPublishedCases.length + myPublishedTutorials.length || 45,
        casesCount: myPublishedCases.length,
        tutorialsCount: myPublishedTutorials.length
      });
      
      // 设置我的案例和教程
      setMyCases(myPublishedCases);
      setMyTutorials(myPublishedTutorials);
    };
    
    loadRealStats();
    
    // 每秒刷新一次数据
    const interval = setInterval(loadRealStats, 1000);
    return () => clearInterval(interval);
  }, [creatorProfile]);

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSaveProfile = () => {
    console.log('保存资料开始...')
    try {
      // 保存代表作品
      const profileToSave = {
        ...editForm,
        featuredWorks: selectedFeatured
      };
      localStorage.setItem('creatorProfile', JSON.stringify(profileToSave))
      console.log('localStorage保存成功')
      setCreatorProfile({...profileToSave})
      setIsEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
      showToast('资料保存成功！')
      console.log('资料保存完成')
      // 通知其他组件更新
      window.dispatchEvent(new Event('creatorProfileUpdated'))
    } catch (e) {
      console.error('保存失败:', e)
      showToast('保存失败，请重试')
    }
  }

  const handleCancelEdit = () => {
    setEditForm(creatorProfile)
    setSelectedFeatured(creatorProfile.featuredWorks || [])
    setIsEditing(false)
  }

  // 打开选择代表作品弹窗
  const handleSelectFeatured = () => {
    setSelectedFeatured(creatorProfile.featuredWorks || []);
    setShowFeaturedModal(true);
  }
  
  // 切换代表作品选择
  const toggleFeatured = (itemId, itemType) => {
    const key = `${itemType}_${itemId}`;
    setSelectedFeatured(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      } else if (prev.length < 3) {
        return [...prev, key];
      } else {
        showToast('最多选择3个代表作品');
        return prev;
      }
    });
  };
  
  // 保存代表作品选择
  const saveFeaturedWorks = () => {
    setEditForm(prev => ({ ...prev, featuredWorks: selectedFeatured }));
    setCreatorProfile(prev => ({ ...prev, featuredWorks: selectedFeatured }));
    setShowFeaturedModal(false);
    showToast('代表作品已更新');
  };

  const recentOrders = [
    { id: '202604012', title: '品牌LOGO设计', client: '张总', budget: 1200, status: '进行中', progress: 60, deadline: '2026-04-15' },
    { id: '202604011', title: '产品详情页设计', client: '李总', budget: 800, status: '待开始', progress: 0, deadline: '2026-04-20' },
    { id: '202604010', title: '海报设计', client: '王总', budget: 500, status: '验收中', progress: 100, deadline: '2026-04-10' }
  ];

  const tabs = [
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'dashboard', label: '数据中心', icon: BarChart3 },
    { id: 'cases', label: '案例管理', icon: FileText },
    { id: 'tutorials', label: '教程管理', icon: BookOpen },
    { id: 'demands', label: '需求管理', icon: Briefcase },
    { id: 'earnings', label: '收益管理', icon: Wallet },
    { id: 'opc-experts', label: 'OPC咨询', icon: Users },
    { id: 'ai-tools', label: 'AI工具', icon: Sparkles },
    { id: 'circle', label: '交流圈', icon: MessageSquare },
    { id: 'certification', label: '申请认证', icon: CheckCircle }
  ];

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

  // 需求管理组件 - 支持需求方和创作者两种视角
  const DemandManagement = () => {
    const [myBids, setMyBids] = useState([]);
    const [myDemands, setMyDemands] = useState([]);
    const [selectedBid, setSelectedBid] = useState(null);
    const [selectedDemand, setSelectedDemand] = useState(null);
    const [activeView, setActiveView] = useState('published'); // 'published' | 'bids'
    const navigate = useNavigate();
    
    // 判断当前用户是需求方还是创作者
    const isCreator = !!creatorProfile;

    useEffect(() => {
      // 加载当前用户的投标记录
      const loadMyBids = () => {
        const savedBids = localStorage.getItem('bidRecords');
        if (savedBids) {
          const allBids = JSON.parse(savedBids);
          setMyBids(allBids);
        }
      };
      // 加载当前用户发布的需求
      const loadMyDemands = () => {
        const savedDemands = localStorage.getItem('publishedDemands');
        if (savedDemands) {
          const allDemands = JSON.parse(savedDemands);
          setMyDemands(allDemands);
        }
      };
      loadMyBids();
      loadMyDemands();
    }, []);

    const getStatusIcon = (status) => {
      switch (status) {
        case 'accepted': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
        case 'rejected': return <XCircle className="w-4 h-4 text-red-400" />;
        case 'completed': return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
        default: return <Clock3 className="w-4 h-4 text-amber-400" />;
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'accepted': return '已中标';
        case 'rejected': return '未中标';
        case 'completed': return '已完成';
        default: return '审核中';
      }
    };

    const getStatusClass = (status) => {
      switch (status) {
        case 'accepted': return 'status-accepted';
        case 'rejected': return 'status-rejected';
        case 'completed': return 'status-completed';
        default: return 'status-pending';
      }
    };
    
    const getDemandStatusText = (status) => {
      switch (status) {
        case 'pending': return '待接单';
        case 'matching': return '匹配中';
        case 'progress': return '进行中';
        case 'completed': return '已完成';
        default: return '待接单';
      }
    };

    // 需求方视角：查看我发布的需求详情
    if (selectedDemand) {
      return (
        <div className="demand-detail-section">
          <div className="section-header">
            <button className="back-btn" onClick={() => setSelectedDemand(null)}>
              ← 返回列表
            </button>
            <span>需求详情</span>
          </div>
          <div className="bid-detail-card">
            <div className="bid-detail-header">
              <h3>{selectedDemand.title}</h3>
              <span className={`bid-status ${getStatusClass(selectedDemand.status)}`}>
                {getStatusIcon(selectedDemand.status)}
                {getDemandStatusText(selectedDemand.status)}
              </span>
            </div>
            <div className="bid-detail-info">
              <div className="info-row">
                <span className="label">固定定价</span>
                <span className="value price">¥{selectedDemand.budget?.toLocaleString?.() || selectedDemand.budget}</span>
              </div>
              <div className="info-row">
                <span className="label">项目类型</span>
                <span className="value">{selectedDemand.catId}</span>
              </div>
              <div className="info-row">
                <span className="label">截止时间</span>
                <span className="value">{selectedDemand.deadline}</span>
              </div>
              <div className="info-row">
                <span className="label">需求描述</span>
                <span className="value">{selectedDemand.desc}</span>
              </div>
              <div className="info-row">
                <span className="label">投标人数</span>
                <span className="value">{selectedDemand.bids || 0} 人</span>
              </div>
            </div>
            
            {/* 投标列表 */}
            <div className="bids-section">
              <h4>投标列表</h4>
              {selectedDemand.bidList?.length > 0 ? (
                <div className="bids-list">
                  {selectedDemand.bidList.map((bid) => (
                    <div key={bid.id} className="bid-card">
                      <div className="bid-header">
                        <h4 className="bid-title">{bid.creatorName}</h4>
                        <span className={`bid-status ${getStatusClass(bid.status)}`}>
                          {getStatusIcon(bid.status)}
                          {getStatusText(bid.status)}
                        </span>
                      </div>
                      <div className="bid-info">
                        <span className="bid-expertise">擅长：{bid.expertise}</span>
                      </div>
                      <div className="bid-footer">
                        <span className="bid-time">{new Date(bid.createdAt).toLocaleDateString()}</span>
                        {bid.status === 'pending' && (
                          <button className="select-winner-btn" onClick={() => {
                            // 确认中标逻辑
                            const updatedBids = selectedDemand.bidList.map(b => 
                              b.id === bid.id ? { ...b, status: 'accepted' } : { ...b, status: 'rejected' }
                            );
                            setSelectedDemand({ ...selectedDemand, bidList: updatedBids, status: 'progress' });
                            showToast('已确认中标');
                          }}>
                            确认中标
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-text">暂无投标</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 创作者视角：查看投标详情
    if (selectedBid) {
      return (
        <div className="demand-detail-section">
          <div className="section-header">
            <button className="back-btn" onClick={() => setSelectedBid(null)}>
              ← 返回列表
            </button>
            <span>投标详情</span>
          </div>
          <div className="bid-detail-card">
            <div className="bid-detail-header">
              <h3>{selectedBid.demandTitle}</h3>
              <span className={`bid-status ${getStatusClass(selectedBid.status)}`}>
                {getStatusIcon(selectedBid.status)}
                {getStatusText(selectedBid.status)}
              </span>
            </div>
            <div className="bid-detail-info">
              <div className="info-row">
                <span className="label">投标价格</span>
                <span className="value price">¥{selectedBid.price?.toLocaleString?.() || selectedBid.price}</span>
              </div>
              <div className="info-row">
                <span className="label">擅长领域</span>
                <span className="value">{selectedBid.expertise}</span>
              </div>
              <div className="info-row">
                <span className="label">方案说明</span>
                <span className="value">{selectedBid.proposal}</span>
              </div>
              <div className="info-row">
                <span className="label">创意说明</span>
                <span className="value">{selectedBid.creativeConcept}</span>
              </div>
              {selectedBid.portfolioUrls?.length > 0 && (
                <div className="info-row">
                  <span className="label">案例链接</span>
                  <div className="value links">
                    {selectedBid.portfolioUrls.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                        作品{idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {selectedBid.status === 'accepted' && (
                <div className="contact-info-box">
                  <h4>需求方联系方式</h4>
                  <p>中标后可查看需求方联系方式</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="demands-section">
        {/* Tab 切换：需求方显示"我发布的"和"我的投标"，创作者只显示"我的投标" */}
        {!isCreator && (
          <div className="view-tabs">
            <button 
              className={`view-tab ${activeView === 'published' ? 'active' : ''}`}
              onClick={() => setActiveView('published')}
            >
              我发布的需求
            </button>
            <button 
              className={`view-tab ${activeView === 'bids' ? 'active' : ''}`}
              onClick={() => setActiveView('bids')}
            >
              我的投标
            </button>
          </div>
        )}
        
        <div className="section-header">
          <span>{activeView === 'published' && !isCreator ? '我发布的需求' : '我的投标'}</span>
          <Link to="/demand" className="more-btn">
            {activeView === 'published' && !isCreator ? '发布新需求' : '浏览需求大厅'}
          </Link>
        </div>
        
        {/* 我发布的需求列表 */}
        {activeView === 'published' && !isCreator && (
          myDemands.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={48} />
              <p>暂无发布的需求</p>
              <Link to="/demand" className="add-btn">
                <Plus size={16} /> 发布需求
              </Link>
            </div>
          ) : (
            <div className="bids-list">
              {myDemands.map((demand) => (
                <div key={demand.id} className="bid-card" onClick={() => setSelectedDemand(demand)}>
                  <div className="bid-header">
                    <h4 className="bid-title">{demand.title}</h4>
                    <span className={`bid-status ${getStatusClass(demand.status)}`}>
                      {getStatusIcon(demand.status)}
                      {getDemandStatusText(demand.status)}
                    </span>
                  </div>
                  <div className="bid-info">
                    <span className="bid-price">¥{demand.budget?.toLocaleString?.() || demand.budget}</span>
                    <span className="bid-expertise">{demand.bids || 0} 人投标</span>
                  </div>
                  <div className="bid-footer">
                    <span className="bid-time">{demand.deadline}</span>
                    <span className="view-detail">
                      查看详情 <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        
        {/* 我的投标列表 */}
        {(activeView === 'bids' || isCreator) && (
          myBids.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={48} />
              <p>暂无投标记录</p>
              <Link to="/demand" className="add-btn">
                <Plus size={16} /> 去投标
              </Link>
            </div>
          ) : (
            <div className="bids-list">
              {myBids.map((bid) => (
                <div key={bid.id} className="bid-card" onClick={() => setSelectedBid(bid)}>
                  <div className="bid-header">
                    <h4 className="bid-title">{bid.demandTitle}</h4>
                    <span className={`bid-status ${getStatusClass(bid.status)}`}>
                      {getStatusIcon(bid.status)}
                      {getStatusText(bid.status)}
                    </span>
                  </div>
                  <div className="bid-info">
                    <span className="bid-price">¥{bid.price?.toLocaleString?.() || bid.price}</span>
                    <span className="bid-expertise">{bid.expertise}</span>
                  </div>
                  <div className="bid-footer">
                    <span className="bid-time">{new Date(bid.createdAt).toLocaleDateString()}</span>
                    <span className="view-detail">
                      查看详情 <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    );
  };

  // 用户信息显示
  const userName = user?.name || user?.nickname || '用户'
  // 如果 avatar 是 URL，则使用默认 emoji，否则使用 avatar 值
  const userAvatar = user?.avatar?.startsWith('http') ? '👤' : (user?.avatar || '👤')
  
  // 普通用户可用的 tabs（只显示需求管理）
  const userTabs = [
    { id: 'demands', label: '需求管理', icon: Briefcase },
  ];
  
  // 根据是否是创作者决定显示哪些 tabs
  const displayTabs = creatorProfile ? tabs : userTabs;
  // 如果当前 activeTab 不在可用 tabs 中，切换到第一个
  const currentTab = displayTabs.find(t => t.id === activeTab) ? activeTab : displayTabs[0]?.id;

  return (
    <div className="creator-center">
      {/* Header */}
      <div className="creator-header">
        <div className="header-left">
          <div className="header-creator-profile">
            <div className="header-creator-main">
              {creatorProfile?.avatarUrl ? (
                <img src={creatorProfile.avatarUrl} alt={creatorProfile.name} className="header-avatar-img" />
              ) : creatorProfile?.avatar?.startsWith('http') ? (
                <img src={creatorProfile.avatar} alt={creatorProfile.name} className="header-avatar-img" />
              ) : user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={userName} className="header-avatar-img" />
              ) : user?.avatar?.startsWith('http') ? (
                <img src={user.avatar} alt={userName} className="header-avatar-img" />
              ) : (
                <span className="header-avatar">{creatorProfile?.avatar || userAvatar}</span>
              )}
              <div className="header-creator-info">
                <div className="header-creator-name-row">
                  <span className="header-name">{creatorProfile?.name || userName}</span>
                  {/* OPC认证创作者标签 */}
                  {opcCertification?.status === 'approved' && (
                    <div className="flex items-center gap-1">
                      {opcCertification.categories?.slice(0, 2).map(catId => (
                        <span
                          key={catId}
                          className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-violet-300 rounded-full border border-violet-500/30"
                        >
                          {categoryMap[catId] || catId}
                        </span>
                      ))}
                    </div>
                  )}
                  {creatorProfile && (
                    <span className="creator-badge-small">
                      <Star size={12} /> 认证创作者
                    </span>
                  )}
                </div>
                <span className="header-title">{creatorProfile?.title || '普通用户'}</span>
              </div>
            </div>
            {creatorProfile?.skills && (
              <div className="header-skills">
                {creatorProfile.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            )}
          </div>
          <h1>{creatorProfile ? '创作者中心' : '用户中心'}</h1>
          <p>{creatorProfile ? '管理您的作品、教程和订单' : '管理您的需求和订单'}</p>
        </div>
        {creatorProfile && (
          <button type="button" className="publish-btn" onClick={() => setShowPublishModal(true)}>
            <Plus size={20} />
            发布课程
          </button>
        )}
      </div>

      {/* OPC认证审核状态提示 - 全局显示 */}
      {opcCertification && opcCertification.status === 'pending' && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-amber-300 font-semibold">OPC认证审核中</p>
                <p className="text-gray-400 text-sm">保证金¥{opcCertification.depositAmount || 500}已支付，请耐心等待审核</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">申请时间</p>
              <p className="text-gray-300 text-sm">
                {opcCertification.submittedAt ? new Date(opcCertification.submittedAt).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats - 真实数据显示（仅创作者显示） */}
      {creatorProfile && (
        <div className="creator-stats">
          <div className="stat-item">
            <div className="stat-icon views"><Eye size={22} /></div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalViews.toLocaleString()}</div>
              <div className="stat-label">总浏览量</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon likes"><Heart size={22} /></div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalLikes.toLocaleString()}</div>
              <div className="stat-label">总点赞数</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon fans"><Users size={22} /></div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalFans.toLocaleString()}</div>
              <div className="stat-label">粉丝数量</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon earnings"><DollarSign size={22} /></div>
            <div className="stat-info">
              <div className="stat-value green">¥{stats.totalEarnings.toLocaleString()}</div>
              <div className="stat-label">累计收益</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="creator-tabs">
        {displayTabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={`creator-tab ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Toast 通知 */}
      {toast && <div className="cd-toast">{toast}</div>}

      {/* Content */}
      <div className="creator-content">

        {currentTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-header">
              <h2>创作者资料</h2>
              <p className="profile-desc">完善您的个人资料，将展示在课程详情页，帮助学员了解您</p>
            </div>

            <div className="profile-card">
              {/* 基本信息 */}
              <div className="profile-base">
                <div className="profile-avatar-section">
                  {/* 头像预览/编辑 */}
                  <div className="profile-avatar-preview">
                    {isEditing ? (
                      <>
                        {/* 编辑模式：显示图片上传预览 */}
                        {editForm.avatarUrl ? (
                          <img src={editForm.avatarUrl} alt="头像预览" className="avatar-image-preview" />
                        ) : (
                          <div className="avatar-emoji">{editForm.avatar}</div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* 查看模式：显示当前头像 */}
                        {creatorProfile?.avatarUrl ? (
                          <img src={creatorProfile.avatarUrl} alt={creatorProfile.name} className="avatar-image-preview" />
                        ) : (
                          <div className="avatar-emoji">{creatorProfile?.avatar || '👤'}</div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="profile-edit-form">
                    <div className="form-group">
                      <label>上传头像图片</label>
                      <div className="avatar-upload-area">
                        <input
                          type="file"
                          accept="image/*"
                          id="avatar-upload"
                          className="avatar-upload-input"
                          onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setEditForm({...editForm, avatarUrl: reader.result})
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                        <label htmlFor="avatar-upload" className="avatar-upload-btn">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          上传图片
                        </label>
                        <span className="upload-tip">支持 JPG、PNG 格式，建议尺寸 200x200</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>选择头像图标（不上传图片时使用）</label>
                      <div className="avatar-picker">
                        {['👩‍💻', '👨‍💻', '👩‍🎨', '👨‍🎨', '👩‍🏫', '👨‍🏫', '🧑‍💼', '👩‍💼', '🤖', '🎯'].map(emoji => (
                          <span
                            key={emoji}
                            className={`avatar-option ${editForm.avatar === emoji && !editForm.avatarUrl ? 'selected' : ''}`}
                            onClick={() => setEditForm({...editForm, avatar: emoji})}
                          >
                            {emoji}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>昵称</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder="输入您的昵称"
                      />
                    </div>
                    <div className="form-group">
                      <label>头衔/职位</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        placeholder="例如：AI创作导师 | 短视频运营专家"
                      />
                    </div>
                    <div className="form-group">
                      <label>个人简介</label>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        placeholder="介绍一下您的背景、经验和专长..."
                        rows={4}
                      />
                    </div>
                    
                    {/* 新增：讲师身份设置 */}
                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={editForm.isSignedInstructor || false}
                          onChange={(e) => setEditForm({...editForm, isSignedInstructor: e.target.checked})}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <span>设为签约讲师（课程详情页展示签约标识）</span>
                      </label>
                      {editForm.isSignedInstructor && (
                        <input
                          type="text"
                          value={editForm.instructorBadge || ''}
                          onChange={(e) => setEditForm({...editForm, instructorBadge: e.target.value})}
                          placeholder="讲师身份标签，如：签约讲师、金牌讲师"
                          style={{ marginTop: '8px' }}
                        />
                      )}
                    </div>
                    
                    {/* 新增：平台粉丝数据 */}
                    <div className="form-group">
                      <label>全网粉丝数据（用于课程详情页展示）</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b' }}>抖音粉丝（万）</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editForm.platformFans?.douyin || 0}
                            onChange={(e) => setEditForm({
                              ...editForm,
                              platformFans: {
                                ...editForm.platformFans,
                                douyin: parseFloat(e.target.value) || 0,
                                total: (parseFloat(e.target.value) || 0) + (editForm.platformFans?.wechat || 0) + (editForm.platformFans?.xiaohongshu || 0)
                              }
                            })}
                            placeholder="52.3"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b' }}>视频号粉丝（万）</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editForm.platformFans?.wechat || 0}
                            onChange={(e) => setEditForm({
                              ...editForm,
                              platformFans: {
                                ...editForm.platformFans,
                                wechat: parseFloat(e.target.value) || 0,
                                total: (editForm.platformFans?.douyin || 0) + (parseFloat(e.target.value) || 0) + (editForm.platformFans?.xiaohongshu || 0)
                              }
                            })}
                            placeholder="18.6"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b' }}>小红书粉丝（万）</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editForm.platformFans?.xiaohongshu || 0}
                            onChange={(e) => setEditForm({
                              ...editForm,
                              platformFans: {
                                ...editForm.platformFans,
                                xiaohongshu: parseFloat(e.target.value) || 0,
                                total: (editForm.platformFans?.douyin || 0) + (editForm.platformFans?.wechat || 0) + (parseFloat(e.target.value) || 0)
                              }
                            })}
                            placeholder="8.9"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b' }}>总粉丝（万）自动计算</label>
                          <input
                            type="text"
                            value={editForm.platformFans?.total?.toFixed(1) || 0}
                            disabled
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* 新增：作品和学员数 */}
                    <div className="form-group">
                      <label>作品与学员统计</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b' }}>作品数量</label>
                          <input
                            type="number"
                            value={editForm.totalWorks || 0}
                            onChange={(e) => setEditForm({...editForm, totalWorks: parseInt(e.target.value) || 0})}
                            placeholder="12"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b' }}>学员数量</label>
                          <input
                            type="number"
                            value={editForm.totalStudents || 0}
                            onChange={(e) => setEditForm({...editForm, totalStudents: parseInt(e.target.value) || 0})}
                            placeholder="3560"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>擅长领域</label>
                      <div className="skill-input-area">
                        <div className="skill-tags">
                          {editForm.skills.map((skill, i) => (
                            <span key={i} className="skill-tag editable">
                              {skill}
                              <span onClick={() => setEditForm({
                                ...editForm,
                                skills: editForm.skills.filter((_, idx) => idx !== i)
                              })}>×</span>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="输入后按回车添加"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              setEditForm({
                                ...editForm,
                                skills: [...editForm.skills, e.target.value.trim()]
                              })
                              e.target.value = ''
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="profile-info-display">
                    <div className="info-group">
                      <div className="info-label">昵称</div>
                      <div className="info-value">{creatorProfile.name}</div>
                    </div>
                    <div className="info-group">
                      <div className="info-label">头衔</div>
                      <div className="info-value">{creatorProfile.title}</div>
                    </div>
                    <div className="info-group">
                      <div className="info-label">个人简介</div>
                      <div className="info-value bio">{creatorProfile.bio}</div>
                    </div>
                    <div className="info-group">
                      <div className="info-label">擅长领域</div>
                      <div className="skill-tags">
                        {creatorProfile.skills.map((skill, i) => (
                          <span key={i} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 粉丝统计 */}
              <div className="profile-stats-section">
                <h3>全网粉丝统计</h3>
                {isEditing ? (
                  <div className="stats-edit-grid">
                    <div className="stat-edit-item">
                      <div className="platform-icon douyin">📺</div>
                      <label>抖音号</label>
                      <input
                        type="text"
                        value={editForm.douyinId || ''}
                        onChange={(e) => setEditForm({...editForm, douyinId: e.target.value})}
                        placeholder="输入抖音号"
                      />
                      <label>抖音粉丝</label>
                      <input
                        type="text"
                        value={editForm.douyinFans}
                        onChange={(e) => setEditForm({...editForm, douyinFans: e.target.value})}
                        placeholder="例如：52.3万"
                      />
                    </div>
                    <div className="stat-edit-item">
                      <div className="platform-icon wechat">💚</div>
                      <label>视频号名称</label>
                      <input
                        type="text"
                        value={editForm.wechatId || ''}
                        onChange={(e) => setEditForm({...editForm, wechatId: e.target.value})}
                        placeholder="输入视频号名称"
                      />
                      <label>视频号粉丝</label>
                      <input
                        type="text"
                        value={editForm.wechatFans}
                        onChange={(e) => setEditForm({...editForm, wechatFans: e.target.value})}
                        placeholder="例如：18.6万"
                      />
                    </div>
                    <div className="stat-edit-item">
                      <div className="platform-icon xiaohongshu">📕</div>
                      <label>小红书ID</label>
                      <input
                        type="text"
                        value={editForm.xiaohongshuId || ''}
                        onChange={(e) => setEditForm({...editForm, xiaohongshuId: e.target.value})}
                        placeholder="输入小红书ID"
                      />
                      <label>小红书粉丝</label>
                      <input
                        type="text"
                        value={editForm.xiaohongshuFans}
                        onChange={(e) => setEditForm({...editForm, xiaohongshuFans: e.target.value})}
                        placeholder="例如：8.9万"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="stats-display-grid">
                    <div className="platform-stat-item">
                      <div className="platform-icon douyin">📺</div>
                      <div className="platform-info">
                        <span className="platform-name">抖音 {creatorProfile.douyinId ? `@${creatorProfile.douyinId}` : ''}</span>
                        <span className="platform-fans">{creatorProfile.douyinFans}</span>
                      </div>
                    </div>
                    <div className="platform-stat-item">
                      <div className="platform-icon wechat">💚</div>
                      <div className="platform-info">
                        <span className="platform-name">视频号 {creatorProfile.wechatId ? `@${creatorProfile.wechatId}` : ''}</span>
                        <span className="platform-fans">{creatorProfile.wechatFans}</span>
                      </div>
                    </div>
                    <div className="platform-stat-item">
                      <div className="platform-icon xiaohongshu">📕</div>
                      <div className="platform-info">
                        <span className="platform-name">小红书 {creatorProfile.xiaohongshuId ? `@${creatorProfile.xiaohongshuId}` : ''}</span>
                        <span className="platform-fans">{creatorProfile.xiaohongshuFans}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 代表作品 */}
              <div className="profile-featured-section">
                <div className="section-header-row">
                  <h3><Crown size={18} /> 代表作品</h3>
                  <p className="section-desc">选择您最满意的作品展示在个人主页，最多3个</p>
                  {isEditing && (
                    <button type="button" className="select-featured-btn" onClick={handleSelectFeatured}>
                      <Edit size={14} /> 选择代表作品
                    </button>
                  )}
                </div>
                {creatorProfile.featuredWorks && creatorProfile.featuredWorks.length > 0 ? (
                  <div className="featured-works-grid">
                    {creatorProfile.featuredWorks.map((key, idx) => {
                      const work = getFeaturedWork(key);
                      if (!work) return null;
                      const [type] = key.split('_');
                      return (
                        <div key={idx} className="featured-work-item">
                          <div className="featured-work-thumb">
                            <img src={work.thumbnail || work.coverImage} alt={work.title} />
                            <span className="featured-badge"><Crown size={12} /> 代表作</span>
                            <span className="featured-type-badge">
                              {type === 'case' ? <FileText size={12} /> : <BookOpen size={12} />}
                              {type === 'case' ? '案例' : '教程'}
                            </span>
                          </div>
                          <div className="featured-work-info">
                            <div className="featured-work-title">{work.title}</div>
                            <div className="featured-work-meta">
                              <span><Eye size={12} /> {work.views || 0}</span>
                              <span><Heart size={12} /> {work.likes || 0}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="featured-works-empty">
                    <Crown size={32} />
                    <p>暂无代表作品</p>
                    {isEditing && <button type="button" onClick={handleSelectFeatured}>立即添加</button>}
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button type="button" className="profile-save-btn" onClick={handleSaveProfile}>
                      <Save size={18} /> {saveSuccess ? '已保存！' : '保存修改'}
                    </button>
                    <button type="button" className="profile-cancel-btn" onClick={handleCancelEdit}>
                      取消
                    </button>
                  </>
                ) : (
                  <button type="button" className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                    <Edit size={18} /> 编辑资料
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'dashboard' && (
          <div className="dashboard-section">
            <div className="quick-actions-grid">
              <div className="quick-action-card">
                <div className="action-icon blue"><FileText size={24} /></div>
                <div className="action-info">
                  <div className="action-value">{stats.casesCount}</div>
                  <div className="action-label">我的案例</div>
                </div>
              </div>
              <div className="quick-action-card">
                <div className="action-icon purple"><BookOpen size={24} /></div>
                <div className="action-info">
                  <div className="action-value">{stats.tutorialsCount}</div>
                  <div className="action-label">我的教程</div>
                </div>
              </div>
              <div className="quick-action-card">
                <div className="action-icon orange"><Briefcase size={24} /></div>
                <div className="action-info">
                  <div className="action-value">{stats.pendingOrders}</div>
                  <div className="action-label">进行中订单</div>
                </div>
              </div>
              <div className="quick-action-card">
                <div className="action-icon green"><TrendingUp size={24} /></div>
                <div className="action-info">
                  <div className="action-value green">+¥328</div>
                  <div className="action-label">今日收益</div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <span>数据趋势</span>
                <span className="chart-period">近7天</span>
              </div>
              <div className="mini-chart">
                {[40, 65, 45, 80, 70, 90, 85].map((h, i) => (
                  <div key={i} className="mini-bar" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <span>最新订单</span>
                <button type="button" className="more-btn" onClick={() => setActiveTab('orders')}>查看全部</button>
              </div>
              {recentOrders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <div className="order-title">{order.title}</div>
                    <div className="order-meta">
                      <span>{order.client}</span>
                      <span>•</span>
                      <span>¥{order.budget}</span>
                    </div>
                  </div>
                  <div className={`order-status ${order.status}`}>{order.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'cases' && (
          <div className="cases-section">
            <div className="section-header">
              <span>我的案例</span>
              <button type="button" className="add-btn" onClick={() => navigate('/user/publish-case')}>
                <Plus size={16} /> 添加案例
              </button>
            </div>
            {myCases.length > 0 ? (
              <div className="creator-cases-grid">
                {myCases.map((caseItem) => {
                  const catMeta = CATEGORY_META[caseItem.category] || CATEGORY_META.shortvideo;
                  return (
                    <div key={caseItem.id} className="creator-case-card" onClick={() => navigate(`/tutorial/${caseItem.id}`)}>
                      <div className="cc-card-thumb">
                        <img src={caseItem.coverImage || caseItem.thumbnail} alt={caseItem.title} />
                        <div className="cc-card-overlay">
                          <div className="cc-card-play"><Play size={28} /></div>
                          <span className="cc-card-duration">{caseItem.duration || '3:00'}</span>
                          <div className="cc-card-badge">
                            <Video size={11} /> 案例拆解
                          </div>
                          {caseItem.price > 0 && (
                            <div className="cc-card-price-badge"><Lock size={10} /> ¥{caseItem.price}</div>
                          )}
                        </div>
                        {/* 编辑和删除按钮 */}
                        <div className="cc-card-actions" onClick={(e) => e.stopPropagation()}>
                          <button type="button" className="cc-action-btn edit" 
                            onClick={() => navigate('/user/publish-case', { state: { caseData: caseItem, isEdit: true } })}>
                            <Edit size={14} /> 编辑
                          </button>
                          <button type="button" className="cc-action-btn delete"
                            onClick={() => {
                              if (confirm('确定要删除此案例吗？')) {
                                const cases = JSON.parse(localStorage.getItem('publishedCases') || '[]');
                                const filtered = cases.filter(c => c.id !== caseItem.id);
                                localStorage.setItem('publishedCases', JSON.stringify(filtered));
                                setMyCases(filtered.filter(c => c.status === 'published'));
                                showToast('案例已删除');
                              }
                            }}>
                            <Trash2 size={14} /> 删除
                          </button>
                        </div>
                      </div>
                      <div className="cc-card-info">
                        <div className="cc-card-cat-row">
                          <span className="cc-cat-tag" style={{ color: catMeta.color, background: `${catMeta.color}20` }}>
                            {catMeta.icon} {catMeta.name}
                          </span>
                        </div>
                        <h3 className="cc-card-title">{caseItem.title}</h3>
                        <p className="cc-card-desc">{caseItem.description}</p>
                        <div className="cc-card-meta">
                          <div className="cc-card-creator">
                            <div className="cc-case-avatar">{caseItem.creatorName?.[0] || '创'}</div>
                            <span>{caseItem.creatorName || '创作者'}</span>
                          </div>
                          <div className="cc-card-stats">
                            <span><Eye size={13} /> {caseItem.views || 0}</span>
                            <button className="cc-like-btn">
                              <Heart size={13} fill="none" /> {caseItem.likes || 0}
                            </button>
                          </div>
                        </div>
                        <div className="cc-card-tags">
                          {caseItem.tags?.slice(0, 2).map((t, i) => (<span key={i} className="cc-tag">{t}</span>))}
                          {caseItem.isFree ? (
                            <span className="cc-free-tag">免费</span>
                          ) : (
                            <span className="cc-paid-tag"><Lock size={10} /> 图文+视频</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <FileText size={48} />
                <p>暂无发布的案例</p>
                <button type="button" className="add-btn" onClick={() => navigate('/user/publish-case')}>
                  <Plus size={16} /> 发布第一个案例
                </button>
              </div>
            )}
          </div>
        )}

        {currentTab === 'tutorials' && (
          <div className="tutorials-section">
            <div className="section-header">
              <span>我的教程</span>
              <button type="button" className="add-btn" onClick={() => navigate('/user/create-tutorial')}>
                <Plus size={16} /> 创建教程
              </button>
            </div>
            {myTutorials.length > 0 ? (
              <div className="creator-tutorials-grid">
                {myTutorials.map((tutorial) => {
                  const catMeta = CATEGORY_META[tutorial.category] || CATEGORY_META.shortvideo;
                  return (
                    <div key={tutorial.id} className="creator-tutorial-card" onClick={() => navigate(`/training/course/${tutorial.id}`)}>
                      <div className="ct-card-thumb" style={{ background: catMeta.gradient }}>
                        <div className="ct-card-play-wrap">
                          <div className="ct-card-play"><Play size={24} /></div>
                        </div>
                        {tutorial.featured && <div className="ct-featured-badge"><Trophy size={12} /> 精品</div>}
                        <div className="ct-level-badge" style={{ color: '#22d3ee', borderColor: '#22d3ee' }}>创作者</div>
                        {/* 编辑和删除按钮 */}
                        <div className="ct-card-actions" onClick={(e) => e.stopPropagation()}>
                          <button type="button" className="ct-action-btn edit" 
                            onClick={() => navigate('/user/create-tutorial', { state: { tutorial, isEdit: true } })}>
                            <Edit size={14} /> 编辑
                          </button>
                          <button type="button" className="ct-action-btn delete"
                            onClick={() => {
                              if (confirm('确定要删除此教程吗？')) {
                                const tutorials = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
                                const filtered = tutorials.filter(t => t.id !== tutorial.id);
                                localStorage.setItem('savedTutorials', JSON.stringify(filtered));
                                setMyTutorials(filtered.filter(t => t.status === 'published'));
                                showToast('教程已删除');
                              }
                            }}>
                            <Trash2 size={14} /> 删除
                          </button>
                        </div>
                      </div>
                      <div className="ct-card-info">
                        <div className="ct-card-tags">
                          <span className="ct-cat-tag" style={{ color: catMeta.color, background: `${catMeta.color}20` }}>
                            {catMeta.icon} {catMeta.name}
                          </span>
                          {tutorial.tags?.slice(0, 1).map((t, i) => (<span key={i} className="ct-tag">{t}</span>))}
                        </div>
                        <h3 className="ct-card-title">{tutorial.title}</h3>
                        <p className="ct-card-subtitle">{tutorial.description || tutorial.subtitle}</p>
                        <div className="ct-card-meta">
                          <span><Users size={13} /> {tutorial.students || 0}</span>
                          <span><Clock size={13} /> {tutorial.duration || '未知'}</span>
                          <span><BookOpen size={13} /> {tutorial.chapters?.length || 0}章节</span>
                        </div>
                        <div className="ct-card-footer">
                          <div className="ct-card-teacher">
                            <div className="ct-teacher-avatar">{tutorial.creatorName?.[0] || '创'}</div>
                            <span>{tutorial.creatorName || '创作者'}</span>
                          </div>
                          <div className="ct-card-price">
                            {tutorial.originalPrice && tutorial.originalPrice > tutorial.price ? (
                              <>
                                <span className="ct-ori-price">¥{tutorial.originalPrice}</span>
                                <span className="ct-cur-price">¥{tutorial.price || 0}</span>
                              </>
                            ) : tutorial.pointsPrice ? (
                              <span className="ct-cur-price">{tutorial.pointsPrice}积分</span>
                            ) : (
                              <span className="ct-free-price">免费</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <BookOpen size={48} />
                <p>暂无发布的教程</p>
                <button type="button" className="add-btn" onClick={() => navigate('/user/create-tutorial')}>
                  <Plus size={16} /> 创建第一个教程
                </button>
              </div>
            )}
          </div>
        )}

        {currentTab === 'demands' && (
          <DemandManagement />
        )}

        {currentTab === 'earnings' && (
          <div className="earnings-section">
            <div className="section-header"><span>收益管理</span></div>
            <div className="earnings-summary">
              <div className="summary-item">
                <div className="summary-label">可提现</div>
                <div className="summary-value green">¥12,480.50</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">待结算</div>
                <div className="summary-value orange">¥3,200.00</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">累计收益</div>
                <div className="summary-value">¥{stats.totalEarnings.toLocaleString()}</div>
              </div>
            </div>
            <button type="button" className="withdraw-btn">立即提现</button>
            
            <div className="settlement-records">
              <div className="section-title">结算记录</div>
              {[
                { date: '2026-04-01', amount: 2000, status: '已到账' },
                { date: '2026-03-15', amount: 3500, status: '已到账' },
                { date: '2026-03-01', amount: 1800, status: '已到账' }
              ].map((record, i) => (
                <div key={i} className="settlement-item">
                  <div className="settlement-date">{record.date}</div>
                  <div className="settlement-amount">+¥{record.amount.toLocaleString()}</div>
                  <div className="settlement-status">{record.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'certification' && (
          <div className="certification-section">
            <div className="section-header"><span>申请认证创作者</span></div>

            {/* OPC认证创作者标签 */}
            {opcCertification?.status === 'approved' && (
              <div className="mb-6 p-4 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">您已是认证OPC创作者</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {opcCertification.categories?.map(catId => (
                          <span
                            key={catId}
                            className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-violet-300 rounded-full border border-violet-500/30"
                          >
                            {categoryMap[catId] || catId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">认证时间</p>
                    <p className="text-white text-sm">{opcCertification.submittedAt ? new Date(opcCertification.submittedAt).toLocaleDateString() : '-'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* OPC认证审核状态卡片 */}
            {opcCertification && (
              <div className="mb-6 p-5 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl">
                {opcCertification.status === 'pending' && (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">⏳</span>
                      </div>
                      <div>
                        <p className="text-amber-300 font-semibold text-lg">OPC认证审核中</p>
                        <p className="text-gray-400 text-sm">预计1-3个工作日内完成审核</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          <span className="text-gray-300 text-sm">保证金</span>
                        </div>
                        <span className="text-green-400 font-medium">¥{opcCertification.depositAmount || 500} 已支付</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">📋</span>
                          <span className="text-gray-300 text-sm">认证领域</span>
                        </div>
                        <span className="text-gray-300 text-sm">
                          {opcCertification.categories?.map(catId => {
                            const cat = COURSE_CATEGORIES.find(c => c.id === catId)
                            return cat ? cat.name : catId
                          }).join('、') || '未选择'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">📅</span>
                          <span className="text-gray-300 text-sm">申请时间</span>
                        </div>
                        <span className="text-gray-300 text-sm">
                          {opcCertification.submittedAt ? new Date(opcCertification.submittedAt).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                {opcCertification.status === 'approved' && (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🎉</span>
                      </div>
                      <div>
                        <p className="text-green-400 font-semibold text-lg">OPC认证已通过</p>
                        <p className="text-gray-400 text-sm">恭喜！您已成为认证创作者</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          <span className="text-gray-300 text-sm">保证金</span>
                        </div>
                        <span className="text-green-400 font-medium">¥{opcCertification.depositAmount || 500} 已支付</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-violet-400">🏆</span>
                          <span className="text-gray-300 text-sm">认证领域</span>
                        </div>
                        <div className="flex gap-1">
                          {opcCertification.categories?.map(catId => {
                            const cat = COURSE_CATEGORIES.find(c => c.id === catId)
                            return cat ? (
                              <span key={catId} className="px-2 py-0.5 text-xs bg-violet-500/20 text-violet-300 rounded-full border border-violet-500/30">
                                {cat.icon} {cat.name}
                              </span>
                            ) : null
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 认证状态展示 */}
            {certification.status === 'approved' && (
              <div className="cert-approved-card">
                <div className="cert-approved-icon">✅</div>
                <div className="cert-approved-info">
                  <h3>您已是认证创作者</h3>
                  <p>认证领域：{certification.skills.join('、')}</p>
                  <p className="cert-approved-time">认证时间：{new Date(certification.applyTime).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            {certification.status === 'pending' && (
              <div className="cert-pending-card">
                <div className="cert-pending-icon">⏳</div>
                <div className="cert-pending-info">
                  <h3>认证申请审核中</h3>
                  <p>提交时间：{new Date(certification.applyTime).toLocaleDateString()}</p>
                  <p className="cert-pending-tip">预计1-3个工作日内完成审核，请耐心等待</p>
                </div>
                {/* 演示按钮：实际项目中由后台审核 */}
                <div className="cert-demo-actions">
                  <p className="cert-demo-tip">【演示】模拟后台审核操作：</p>
                  <button type="button" className="cert-demo-btn approve" onClick={simulateApprove}>✅ 通过认证</button>
                  <button type="button" className="cert-demo-btn reject" onClick={simulateReject}>❌ 拒绝申请</button>
                </div>
              </div>
            )}

            {certification.status === 'rejected' && (
              <div className="cert-rejected-card">
                <div className="cert-rejected-icon">❌</div>
                <div className="cert-rejected-info">
                  <h3>认证申请未通过</h3>
                  <p>拒绝原因：{certification.rejectReason}</p>
                  <button type="button" className="cert-reapply-btn" onClick={() => setCertification({ ...certification, status: 'none' })}>
                    重新申请
                  </button>
                </div>
              </div>
            )}

            {certification.status === 'none' && (
              <div className="cert-apply-form">
                <div className="cert-form-intro">
                  <h3>为什么要申请认证？</h3>
                  <ul>
                    <li>🏆 获得"认证创作者"专属标识，提升信任度</li>
                    <li>📈 优先推荐，增加曝光机会</li>
                    <li>💰 解锁更高收益分成比例</li>
                    <li>🎯 参与平台官方活动资格</li>
                  </ul>
                </div>

                {/* 第一步：选择擅长领域 */}
                <div className="cert-step">
                  <div className="step-title">
                    <span className="step-num">1</span>
                    <span>选择您擅长的领域（至少选1个）</span>
                  </div>
                  <div className="cert-skills-grid">
                    {Object.entries(CATEGORY_META).map(([key, cat]) => (
                      <div
                        key={key}
                        className={`cert-skill-card ${applyForm.skills.includes(cat.name) ? 'selected' : ''}`}
                        onClick={() => {
                          const skills = applyForm.skills.includes(cat.name)
                            ? applyForm.skills.filter(s => s !== cat.name)
                            : [...applyForm.skills, cat.name]
                          setApplyForm({ ...applyForm, skills })
                        }}
                      >
                        <span className="cert-skill-icon">{cat.icon}</span>
                        <span className="cert-skill-name">{cat.name}</span>
                        {applyForm.skills.includes(cat.name) && <span className="cert-skill-check">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 第二步：上传代表作品 */}
                <div className="cert-step">
                  <div className="step-title">
                    <span className="step-num">2</span>
                    <span>上传代表作品（至少上传1个）</span>
                  </div>
                  <div className="cert-works-area">
                    {applyForm.works.length > 0 && (
                      <div className="cert-works-list">
                        {applyForm.works.map((work, idx) => (
                          <div key={idx} className="cert-work-item">
                            <div className="cert-work-icon">{CATEGORY_META[work.category]?.icon || '📁'}</div>
                            <div className="cert-work-info">
                              <div className="cert-work-title">{work.title}</div>
                              <div className="cert-work-cat">{CATEGORY_META[work.category]?.name}</div>
                            </div>
                            <button type="button" className="cert-work-remove" onClick={() => {
                              setApplyForm({
                                ...applyForm,
                                works: applyForm.works.filter((_, i) => i !== idx)
                              })
                            }}>×</button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="cert-add-work">
                      <select
                        className="cert-work-category"
                        value={tempWorkCategory}
                        onChange={(e) => setTempWorkCategory(e.target.value)}
                      >
                        <option value="">选择领域</option>
                        {Object.entries(CATEGORY_META).map(([key, cat]) => (
                          <option key={key} value={key}>{cat.icon} {cat.name}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className="cert-work-title"
                        placeholder="作品名称"
                        value={tempWorkTitle}
                        onChange={(e) => setTempWorkTitle(e.target.value)}
                      />
                      <input
                        type="text"
                        className="cert-work-url"
                        placeholder="作品链接（抖音/小红书/B站等）"
                        value={tempWorkUrl}
                        onChange={(e) => setTempWorkUrl(e.target.value)}
                      />
                      <button
                        type="button"
                        className="cert-add-work-btn"
                        onClick={addWork}
                        disabled={!tempWorkCategory || !tempWorkTitle}
                      >
                        + 添加作品
                      </button>
                    </div>
                  </div>
                </div>

                {/* 第三步：提交审核 */}
                <div className="cert-step">
                  <div className="step-title">
                    <span className="step-num">3</span>
                    <span>提交审核</span>
                  </div>
                  <div className="cert-submit-area">
                    <p className="cert-submit-tip">
                      请确保您填写的作品链接真实有效，审核团队可能会通过链接验证作品质量。
                    </p>
                    <button
                      type="button"
                      className="cert-submit-btn"
                      onClick={submitCertification}
                      disabled={applyForm.skills.length === 0 || applyForm.works.length === 0}
                    >
                      提交认证申请
                    </button>
                    {applyForm.skills.length === 0 && (
                      <p className="cert-warning">请至少选择1个擅长领域</p>
                    )}
                    {applyForm.works.length === 0 && (
                      <p className="cert-warning">请至少上传1个代表作品</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI工具集 Tab */}
        {currentTab === 'ai-tools' && (
          <div className="ai-tools-section">
            <div className="section-header">
              <span>🛠️ AI创作工具集</span>
              <Link to="/tools" className="section-link">
                完整工具 <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="ai-tools-grid">
              {/* 批量生成 */}
              <div className="ai-tool-card" onClick={() => navigate('/tools?tab=batch&mode=creator')}>
                <div className="tool-icon bg-violet">
                  <Wand2 size={24} />
                </div>
                <div className="tool-info">
                  <h4>批量生成</h4>
                  <p>批量视频/图片/文案/数字人</p>
                </div>
                <ArrowUpRight size={16} className="tool-arrow" />
              </div>
              {/* 智能改稿 */}
              <div className="ai-tool-card" onClick={() => navigate('/tools?tab=smart&mode=creator')}>
                <div className="tool-icon bg-cyan">
                  <Sparkles size={24} />
                </div>
                <div className="tool-info">
                  <h4>智能改稿</h4>
                  <p>脚本改稿/文案改写/风格迁移</p>
                </div>
                <ArrowUpRight size={16} className="tool-arrow" />
              </div>
              {/* 素材管理 */}
              <div className="ai-tool-card" onClick={() => navigate('/tools?tab=materials&mode=creator')}>
                <div className="tool-icon bg-amber">
                  <FileText size={24} />
                </div>
                <div className="tool-info">
                  <h4>素材管理</h4>
                  <p>视频/图片/音乐/模板素材库</p>
                </div>
                <ArrowUpRight size={16} className="tool-arrow" />
              </div>
              {/* 提示词库 */}
              <div className="ai-tool-card" onClick={() => navigate('/tools?tab=prompts&mode=creator')}>
                <div className="tool-icon bg-emerald">
                  <MessageSquare size={24} />
                </div>
                <div className="tool-info">
                  <h4>提示词库</h4>
                  <p>精选视频/图片/文案提示词</p>
                </div>
                <ArrowUpRight size={16} className="tool-arrow" />
              </div>
            </div>
            <div className="ai-tools-tip">
              <Target size={16} />
              <span>认证创作者专属功能，效率提升10倍</span>
            </div>
          </div>
        )}

        {/* 碳硅交流圈 Tab */}
        {currentTab === 'circle' && (
          <div className="circle-section">
            <div className="section-header">
              <span>🌐 碳硅交流圈</span>
              <Link to="/community" className="section-link">
                进入社区 <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="circle-overview">
              <div className="circle-stats">
                <div className="circle-stat">
                  <div className="stat-num">1,234</div>
                  <div className="stat-label">活跃创作者</div>
                </div>
                <div className="circle-stat">
                  <div className="stat-num">5,678</div>
                  <div className="stat-label">今日发帖</div>
                </div>
                <div className="circle-stat">
                  <div className="stat-num">890</div>
                  <div className="stat-label">学习打卡</div>
                </div>
              </div>
              <div className="circle-actions">
                <button className="circle-action-btn primary" onClick={() => navigate('/community')}>
                  <MessageSquare size={18} />
                  话题讨论
                </button>
                <button className="circle-action-btn secondary" onClick={() => navigate('/community')}>
                  <Target size={18} />
                  学习打卡
                </button>
              </div>
            </div>
            <div className="hot-topics">
              <h4>🔥 热门话题</h4>
              <div className="topics-list">
                <div className="topic-item" onClick={() => navigate('/community')}>
                  <Hash size={14} />
                  <span>AI短视频技巧</span>
                  <span className="topic-count">234帖</span>
                </div>
                <div className="topic-item" onClick={() => navigate('/community')}>
                  <Hash size={14} />
                  <span>Midjourney咒语</span>
                  <span className="topic-count">189帖</span>
                </div>
                <div className="topic-item" onClick={() => navigate('/community')}>
                  <Hash size={14} />
                  <span>变现心得</span>
                  <span className="topic-count">156帖</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 认证OPC解决需求智能匹配中心 Tab */}
        {currentTab === 'opc-experts' && (
          <div className="opc-matching-center">
            {/* 顶部标题区 */}
            <div className="opc-center-header">
              <div className="header-title-row">
                <h2>🤖 认证OPC解决需求智能匹配中心</h2>
                <span className="header-badge">智能匹配 · 专业对接 · 高效协作</span>
              </div>
              {/* 诊断结果快捷入口 */}
              {(() => {
                const consultationIntent = JSON.parse(localStorage.getItem('consultation_intent') || '{}');
                const diagnosisResult = JSON.parse(localStorage.getItem('enterprise_diagnosis_result') || '{}');
                if (!consultationIntent.packageName) return (
                  <div className="diagnosis-banner">
                    <div className="banner-icon">💡</div>
                    <div className="banner-content">
                      <span>还未进行企业诊断？</span>
                      <strong>先做诊断，智能匹配更精准</strong>
                    </div>
                    <button className="banner-btn" onClick={() => navigate('/enterprise-diagnosis')}>
                      去做诊断 →
                    </button>
                  </div>
                );
                return (
                  <div className="diagnosis-result-bar">
                    <div className="result-item">
                      <span className="result-label">您已选择</span>
                      <span className="result-value highlight">{consultationIntent.packageName}</span>
                    </div>
                    <div className="result-divider">|</div>
                    <div className="result-item">
                      <span className="result-label">诊断得分</span>
                      <span className="result-value">{diagnosisResult.totalScore}分</span>
                    </div>
                    <div className="result-divider">|</div>
                    <div className="result-item">
                      <span className="result-label">企业等级</span>
                      <span className="result-value level">{diagnosisResult.level}</span>
                    </div>
                    <button className="result-link" onClick={() => navigate('/diagnosis-result')}>
                      查看报告 →
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* 主Tab切换 */}
            <div className="opc-main-tabs">
              <button 
                className={`main-tab ${opcMainTab === 'creators' ? 'active' : ''}`}
                onClick={() => setOpcMainTab('creators')}
              >
                <span className="tab-icon">🎨</span>
                <span className="tab-label">认证OPC创作者</span>
                <span className="tab-count">{mockOPCCreators.length}</span>
              </button>
              <button 
                className={`main-tab ${opcMainTab === 'consultants' ? 'active' : ''}`}
                onClick={() => setOpcMainTab('consultants')}
              >
                <span className="tab-icon">💼</span>
                <span className="tab-label">认证OPC咨询专家</span>
                <span className="tab-count">{mockOPCConsultants.length}</span>
              </button>
            </div>

            {/* 认证OPC创作者板块 */}
            {opcMainTab === 'creators' && (
              <div className="opc-creators-section">
                {/* 分类筛选 */}
                <div className="category-filter-bar">
                  <button 
                    className={`category-btn ${creatorFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setCreatorFilter('all')}
                  >
                    全部创作者
                  </button>
                  <button 
                    className={`category-btn ${creatorFilter === 'recommended' ? 'active' : ''}`}
                    onClick={() => setCreatorFilter('recommended')}
                  >
                    ⭐ 为我推荐
                  </button>
                  {CREATOR_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      className={`category-btn ${creatorFilter === cat.id ? 'active' : ''}`}
                      onClick={() => setCreatorFilter(cat.id)}
                      style={{ '--cat-color': cat.color }}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>

                {/* 智能匹配推荐区 */}
                {creatorFilter === 'recommended' && (
                  <div className="smart-match-section">
                    <div className="match-section-header">
                      <span className="match-title">🎯 智能匹配结果</span>
                      <span className="match-desc">基于您的企业诊断，为您推荐最合适的OPC创作者</span>
                    </div>
                    <div className="recommended-creators-grid">
                      {getRecommendedCreators().slice(0, 3).map(creator => (
                        <div key={creator.id} className="recommended-creator-card highlight">
                          <div className="rc-top">
                            <div className={`rc-avatar ${levelColors[creator.level].bg} border-2 ${levelColors[creator.level].border}`}>
                              {creator.avatar}
                            </div>
                            <div className="rc-level-badge">
                              <span className={`${levelColors[creator.level].text}`}>{creator.level}</span>
                            </div>
                            {creator.availability === '可接单' && <span className="rc-avail">可接单</span>}
                          </div>
                          <div className="rc-info">
                            <h4>{creator.name}</h4>
                            <p className="rc-title">{creator.title}</p>
                            <div className="rc-category-tag" style={{ color: CREATOR_CATEGORIES.find(c => c.id === creator.category)?.color }}>
                              {CREATOR_CATEGORIES.find(c => c.id === creator.category)?.icon} {CREATOR_CATEGORIES.find(c => c.id === creator.category)?.name}
                            </div>
                          </div>
                          <div className="rc-match-score">
                            <div className="score-bar">
                              <div className="score-fill" style={{ width: `${creator.matchScore}%` }}></div>
                            </div>
                            <span>匹配度 {creator.matchScore}%</span>
                          </div>
                          <div className="rc-stats">
                            <span>⭐ {creator.rating}</span>
                            <span>📁 {creator.completedProjects}项目</span>
                            <span>💰 ¥{creator.hourlyRate}/h</span>
                          </div>
                          <button className="rc-chat-btn" onClick={() => openChat(creator, 'creator')}>
                            💬 开始咨询
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 创作者分类列表 */}
                {creatorFilter !== 'recommended' && (
                  <div className="creators-content">
                    {creatorFilter === 'all' ? (
                      <div className="category-grid">
                        {CREATOR_CATEGORIES.map(cat => {
                          const catCreators = mockOPCCreators.filter(c => c.category === cat.id);
                          return (
                            <div key={cat.id} className="category-group">
                              <div className="group-header" style={{ borderColor: cat.color }}>
                                <span className="group-icon" style={{ background: `${cat.color}20`, color: cat.color }}>
                                  {cat.icon}
                                </span>
                                <span className="group-name">{cat.name}</span>
                                <span className="group-count">{catCreators.length}位</span>
                              </div>
                              <div className="group-creators">
                                {catCreators.map(creator => (
                                  <div key={creator.id} className="creator-mini-card">
                                    <div className={`mini-avatar ${levelColors[creator.level].bg}`}>
                                      {creator.avatar}
                                    </div>
                                    <div className="mini-info">
                                      <span className="mini-name">{creator.name}</span>
                                      <span className={`mini-level ${levelColors[creator.level].text}`}>{creator.level}</span>
                                    </div>
                                    <button className="mini-chat-btn" onClick={() => openChat(creator, 'creator')}>
                                      咨询
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="filtered-creators-grid">
                        {mockOPCCreators
                          .filter(c => c.category === creatorFilter)
                          .map(creator => (
                            <div key={creator.id} className="creator-full-card">
                              <div className="cfc-header">
                                <div className={`cfc-avatar ${levelColors[creator.level].bg} border-2 ${levelColors[creator.level].border}`}>
                                  {creator.avatar}
                                </div>
                                <div className="cfc-level">
                                  <span className={`${levelColors[creator.level].text}`}>{creator.level}</span>
                                </div>
                                {creator.availability === '可接单' && <span className="cfc-avail">可接单</span>}
                              </div>
                              <div className="cfc-info">
                                <h4>{creator.name}</h4>
                                <p className="cfc-title">{creator.title}</p>
                                <p className="cfc-bio">{creator.bio}</p>
                              </div>
                              <div className="cfc-skills">
                                {creator.skills.map((skill, i) => (
                                  <span key={i} className="cfc-skill">{skill}</span>
                                ))}
                              </div>
                              <div className="cfc-stats">
                                <span>⭐ {creator.rating}</span>
                                <span>📁 {creator.completedProjects}项目</span>
                                <span>💰 ¥{creator.hourlyRate}/h</span>
                              </div>
                              <div className="cfc-match">
                                <div className="match-bar">
                                  <div className="match-fill" style={{ width: `${calculateCreatorMatchScore(creator)}%` }}></div>
                                </div>
                                <span>匹配度 {calculateCreatorMatchScore(creator)}%</span>
                              </div>
                              <button className="cfc-chat-btn" onClick={() => openChat(creator, 'creator')}>
                                💬 立即咨询
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 认证OPC咨询专家板块 */}
            {opcMainTab === 'consultants' && (
              <div className="opc-consultants-section">
                {/* 分类筛选 */}
                <div className="category-filter-bar">
                  <button 
                    className={`category-btn ${consultantFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setConsultantFilter('all')}
                  >
                    全部专家
                  </button>
                  <button 
                    className={`category-btn ${consultantFilter === 'recommended' ? 'active' : ''}`}
                    onClick={() => setConsultantFilter('recommended')}
                  >
                    ⭐ 套餐匹配
                  </button>
                  {CONSULTANT_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      className={`category-btn ${consultantFilter === cat.id ? 'active' : ''}`}
                      onClick={() => setConsultantFilter(cat.id)}
                      style={{ '--cat-color': cat.color }}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>

                {/* 套餐智能匹配区 */}
                {consultantFilter === 'recommended' && (
                  <div className="smart-match-section">
                    <div className="match-section-header">
                      <span className="match-title">🎯 套餐专属匹配</span>
                      {(() => {
                        const intent = JSON.parse(localStorage.getItem('consultation_intent') || '{}');
                        const packageType = intent.package || 'sail';
                        const count = PACKAGE_CONSULTANT_COUNT[packageType] || 1;
                        return <span className="match-desc">您的{intent.packageName || '启航版'}套餐包含 {count} 位咨询专家</span>;
                      })()}
                    </div>
                    <div className="recommended-consultants-grid">
                      {getRecommendedConsultants().map(consultant => (
                        <div key={consultant.id} className="recommended-consultant-card">
                          <div className="rcc-top">
                            <div className={`rcc-avatar ${levelColors[consultant.level].bg} border-2 ${levelColors[consultant.level].border}`}>
                              {consultant.avatar}
                            </div>
                            <div className="rcc-level-badge">
                              <span className={`${levelColors[consultant.level].text}`}>{consultant.level}</span>
                            </div>
                            {consultant.availability === '可接单' && <span className="rcc-avail">可接单</span>}
                          </div>
                          <div className="rcc-info">
                            <h4>{consultant.name}</h4>
                            <p className="rcc-title">{consultant.title}</p>
                            <div className="rcc-category-tag" style={{ color: CONSULTANT_CATEGORIES.find(c => c.id === consultant.category)?.color }}>
                              {CONSULTANT_CATEGORIES.find(c => c.id === consultant.category)?.icon} {CONSULTANT_CATEGORIES.find(c => c.id === consultant.category)?.name}
                            </div>
                            <p className="rcc-bio">{consultant.bio}</p>
                          </div>
                          <div className="rcc-skills">
                            {consultant.skills.map((skill, i) => (
                              <span key={i} className="rcc-skill">{skill}</span>
                            ))}
                          </div>
                          <div className="rcc-stats">
                            <span>⭐ {consultant.rating}</span>
                            <span>📁 {consultant.completedProjects}案例</span>
                            <span>💰 ¥{consultant.hourlyRate}/h</span>
                          </div>
                          <div className="rcc-match-score">
                            <div className="score-bar">
                              <div className="score-fill" style={{ width: `${consultant.matchScore}%` }}></div>
                            </div>
                            <span>匹配度 {consultant.matchScore}%</span>
                          </div>
                          <button className="rcc-chat-btn" onClick={() => openChat(consultant, 'consultant')}>
                            💬 发起咨询
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 咨询专家分类列表 */}
                {consultantFilter !== 'recommended' && (
                  <div className="consultants-content">
                    {consultantFilter === 'all' ? (
                      <div className="category-grid consultants-grid">
                        {CONSULTANT_CATEGORIES.map(cat => {
                          const catConsultants = mockOPCConsultants.filter(c => c.category === cat.id);
                          return (
                            <div key={cat.id} className="category-group">
                              <div className="group-header" style={{ borderColor: cat.color }}>
                                <span className="group-icon" style={{ background: `${cat.color}20`, color: cat.color }}>
                                  {cat.icon}
                                </span>
                                <span className="group-name">{cat.name}</span>
                                <span className="group-count">{catConsultants.length}位</span>
                              </div>
                              <div className="group-consultants">
                                {catConsultants.map(consultant => (
                                  <div key={consultant.id} className="consultant-mini-card">
                                    <div className={`mini-avatar ${levelColors[consultant.level].bg}`}>
                                      {consultant.avatar}
                                    </div>
                                    <div className="mini-info">
                                      <span className="mini-name">{consultant.name}</span>
                                      <span className={`mini-level ${levelColors[consultant.level].text}`}>{consultant.level}</span>
                                    </div>
                                    <button className="mini-chat-btn consultant" onClick={() => openChat(consultant, 'consultant')}>
                                      咨询
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="filtered-consultants-grid">
                        {mockOPCConsultants
                          .filter(c => c.category === consultantFilter)
                          .map(consultant => (
                            <div key={consultant.id} className="consultant-full-card">
                              <div className="cfc-header">
                                <div className={`cfc-avatar ${levelColors[consultant.level].bg} border-2 ${levelColors[consultant.level].border}`}>
                                  {consultant.avatar}
                                </div>
                                <div className="cfc-level">
                                  <span className={`${levelColors[consultant.level].text}`}>{consultant.level}</span>
                                </div>
                                {consultant.availability === '可接单' && <span className="cfc-avail">可接单</span>}
                              </div>
                              <div className="cfc-info">
                                <h4>{consultant.name}</h4>
                                <p className="cfc-title">{consultant.title}</p>
                                <p className="cfc-bio">{consultant.bio}</p>
                              </div>
                              <div className="cfc-skills">
                                {consultant.skills.map((skill, i) => (
                                  <span key={i} className="cfc-skill">{skill}</span>
                                ))}
                              </div>
                              <div className="cfc-stats">
                                <span>⭐ {consultant.rating}</span>
                                <span>📁 {consultant.completedProjects}案例</span>
                                <span>💰 ¥{consultant.hourlyRate}/h</span>
                              </div>
                              <button className="cfc-chat-btn consultant" onClick={() => openChat(consultant, 'consultant')}>
                                💬 立即咨询
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* OPC咨询聊天弹窗 */}
      {showChatModal && selectedOPC && (
        <div className="chat-modal-overlay" onClick={() => setShowChatModal(false)}>
          <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
            {/* 弹窗头部 */}
            <div className="chat-modal-header">
              <div className="chat-opc-info">
                <div className={`chat-opc-avatar ${levelColors[selectedOPC.level].bg} border-2 ${levelColors[selectedOPC.level].border}`}>
                  {selectedOPC.avatar}
                </div>
                <div className="chat-opc-details">
                  <div className="chat-opc-name-row">
                    <h3>{selectedOPC.name}</h3>
                    <span className={`chat-opc-level ${levelColors[selectedOPC.level].text}`}>{selectedOPC.level}</span>
                  </div>
                  <p className="chat-opc-title">{selectedOPC.title}</p>
                </div>
              </div>
              <div className="chat-header-actions">
                <span className={`chat-type-badge ${selectedOPC.type === 'consultant' ? 'consultant' : 'creator'}`}>
                  {selectedOPC.type === 'consultant' ? '💼 咨询专家' : '🎨 OPC创作者'}
                </span>
                <button className="chat-close" onClick={() => setShowChatModal(false)}>×</button>
              </div>
            </div>

            {/* 聊天内容区 */}
            <div className="chat-messages">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`chat-message ${msg.role}`}>
                  {msg.role === 'assistant' && (
                    <div className="msg-avatar">{selectedOPC.avatar}</div>
                  )}
                  <div className="msg-content">
                    <div className="msg-bubble">{msg.content}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 快速问题区 */}
            <div className="chat-quick-questions">
              <span className="quick-label">快捷问题：</span>
              <button onClick={() => setChatInput('请问您的服务流程是怎样的？')}>服务流程</button>
              <button onClick={() => setChatInput('先做个初步需求沟通')}>需求沟通</button>
              <button onClick={() => setChatInput('有类似案例可以参考吗？')}>参考案例</button>
            </div>

            {/* 输入区 */}
            <div className="chat-input-area">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="输入您的问题..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button className="chat-send-btn" onClick={sendMessage} disabled={!chatInput.trim()}>
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 发布课程弹窗 */}
      {showPublishModal && (
        <div className="modal-overlay" onClick={() => setShowPublishModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>发布课程</h3>
              <button type="button" className="close-btn" onClick={() => setShowPublishModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="publish-type-grid">
                <div 
                  className="publish-type-card incubation" 
                  onClick={() => { setShowPublishModal(false); navigate('/user/create-tutorial?type=incubation'); }}
                >
                  <div className="type-icon">🎓</div>
                  <div className="type-title">发布孵化课程</div>
                  <div className="type-desc">系统化培训课程，帮助学员从零基础到精通</div>
                  <div className="type-tags">
                    <span>AI短视频</span>
                    <span>AI短剧</span>
                    <span>AI电影</span>
                  </div>
                </div>
                <div 
                  className="publish-type-card case-tutorial"
                  onClick={() => { setShowPublishModal(false); navigate('/user/create-tutorial?type=casetutorial'); }}
                >
                  <div className="type-icon">📚</div>
                  <div className="type-title">发布案例教程</div>
                  <div className="type-desc">真实案例拆解教程，分享实战经验和技巧</div>
                  <div className="type-tags">
                    <span>案例拆解</span>
                    <span>实战技巧</span>
                    <span>经验分享</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 选择代表作品弹窗 */}
      {showFeaturedModal && (
        <div className="modal-overlay" onClick={() => setShowFeaturedModal(false)}>
          <div className="modal-content featured-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Crown size={18} /> 选择代表作品</h3>
              <button type="button" className="close-btn" onClick={() => setShowFeaturedModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="featured-tip">最多选择3个代表作品，这些作品将展示在您的个人主页</p>
              
              {/* 案例列表 */}
              {myCases.length > 0 && (
                <div className="featured-category">
                  <h4><FileText size={16} /> 我的案例</h4>
                  <div className="featured-items-grid">
                    {myCases.map((caseItem) => {
                      const key = `case_${caseItem.id}`;
                      const isSelected = selectedFeatured.includes(key);
                      return (
                        <div 
                          key={key}
                          className={`featured-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleFeatured(caseItem.id, 'case')}
                        >
                          <img src={caseItem.thumbnail} alt={caseItem.title} />
                          <div className="featured-item-info">
                            <span className="featured-item-title">{caseItem.title}</span>
                            <span className="featured-item-views"><Eye size={12} /> {caseItem.views || 0}</span>
                          </div>
                          {isSelected && <div className="selected-check"><CheckCircle size={20} /></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* 教程列表 */}
              {myTutorials.length > 0 && (
                <div className="featured-category">
                  <h4><BookOpen size={16} /> 我的教程</h4>
                  <div className="featured-items-grid">
                    {myTutorials.map((tutorial) => {
                      const key = `tutorial_${tutorial.id}`;
                      const isSelected = selectedFeatured.includes(key);
                      return (
                        <div 
                          key={key}
                          className={`featured-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleFeatured(tutorial.id, 'tutorial')}
                        >
                          <img src={tutorial.coverImage} alt={tutorial.title} />
                          <div className="featured-item-info">
                            <span className="featured-item-title">{tutorial.title}</span>
                            <span className="featured-item-views"><Eye size={12} /> {tutorial.views || 0}</span>
                          </div>
                          {isSelected && <div className="selected-check"><CheckCircle size={20} /></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {myCases.length === 0 && myTutorials.length === 0 && (
                <div className="featured-empty">
                  <BookMarked size={48} />
                  <p>您还没有发布任何作品</p>
                  <button type="button" onClick={() => { setShowFeaturedModal(false); setShowPublishModal(true); }}>
                    立即发布作品
                  </button>
                </div>
              )}
              
              <div className="featured-selected-count">
                已选择：{selectedFeatured.length}/3
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={() => setShowFeaturedModal(false)}>取消</button>
              <button type="button" className="confirm-btn" onClick={saveFeaturedWorks}>确认选择</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
