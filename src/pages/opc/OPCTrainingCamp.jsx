import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Brain, Network, Target, Users, Trophy, Clock, 
  ChevronRight, Star, Zap, CheckCircle, Play,
  Award, Briefcase, MessageSquare, ArrowRight,
  Lightbulb, Layers, Rocket, GraduationCap
} from 'lucide-react'
import { useToast } from '../../components/Toast.jsx'
import { PageLoading, SkeletonCard } from '../../components/Skeleton.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'

// ======= 三大培训模块 =======
const TRAINING_MODULES = [
  {
    id: 'cognition',
    key: 'cognition',
    name: '认知重塑',
    subtitle: 'Cognitive Reshaping',
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    desc: '重构AI时代思维模型，建立碳硅共生认知体系',
    duration: '2周',
    lessons: 12,
    level: 'L1-L2',
    topics: [
      'AI时代商业逻辑变革',
      '碳基创造力 × 硅基算力',
      '从工具使用者到AI指挥家',
      '超级个体崛起路径',
      '东盟市场AI应用前景'
    ],
    outcomes: ['建立AI原生思维', '掌握提示词工程基础', '完成认知升级测评']
  },
  {
    id: 'matrix',
    key: 'matrix',
    name: '矩阵建构',
    subtitle: 'Matrix Construction', 
    icon: Network,
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    desc: '搭建个人AI工具矩阵，构建高效工作流系统',
    duration: '3周',
    lessons: 18,
    level: 'L2-L3',
    topics: [
      'AI工具选型与组合策略',
      '即梦/可灵/Pika深度应用',
      'Midjourney商业级出图',
      'ChatGPT/Claude工作流',
      '自动化脚本与批处理',
      '个人知识管理系统'
    ],
    outcomes: ['掌握10+核心AI工具', '建立3套工作流模板', '完成矩阵搭建认证']
  },
  {
    id: 'practice',
    key: 'practice',
    name: '实战操盘',
    subtitle: 'Practical Operations',
    icon: Target,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    desc: '真实项目实战演练，从接单到交付完整闭环',
    duration: '4周',
    lessons: 24,
    level: 'L3-L4',
    topics: [
      '客户需求分析与报价',
      '项目拆解与里程碑设定',
      'AI内容生产SOP',
      '质量把控与修改迭代',
      '客户沟通与关系维护',
      '案例包装与作品集打造'
    ],
    outcomes: ['完成2个真实项目', '建立个人作品集', '获得L3等级认证']
  }
]

// ======= 导师数据 =======
const MENTORS = [
  {
    id: 1,
    name: '林小影',
    avatar: '林',
    title: 'AI短视频导师',
    level: 'L4',
    expertise: ['AI短视频', '商业变现', '矩阵运营'],
    students: 1856,
    rating: 4.9,
    projects: 200,
    bio: '全网50万粉丝AI视频创作者，操盘过100+商业项目',
    available: true,
    module: 'practice'
  },
  {
    id: 2,
    name: '周编剧',
    avatar: '周',
    title: 'AI短剧导演',
    level: 'L4',
    expertise: ['剧本创作', 'AI生成', 'IP孵化'],
    students: 982,
    rating: 4.8,
    projects: 150,
    bio: '编剧出身，制作AI短剧30+部，全网播放破亿',
    available: true,
    module: 'practice'
  },
  {
    id: 3,
    name: '设计小美',
    avatar: '美',
    title: 'AI设计专家',
    level: 'L3',
    expertise: ['品牌设计', 'UI/UX', 'Midjourney'],
    students: 2341,
    rating: 4.8,
    projects: 300,
    bio: '服务品牌100+，AI设计作品获奖',
    available: false,
    module: 'matrix'
  },
  {
    id: 4,
    name: '带货达人',
    avatar: '达',
    title: 'AI带货导师',
    level: 'L4',
    expertise: ['短视频带货', 'AI起号', '直播运营'],
    students: 3421,
    rating: 4.8,
    projects: 500,
    bio: '单场直播带货破百万，AI带货方法论创始人',
    available: true,
    module: 'cognition'
  }
]

// ======= 实战项目池 =======
const PRACTICE_PROJECTS = [
  {
    id: 'proj_001',
    title: '科技公司品牌宣传片制作',
    type: 'shortvideo',
    difficulty: '中级',
    duration: '7天',
    reward: '¥3000-5000',
    requirements: ['掌握即梦/可灵基础', '了解品牌调性把控', '能独立完成剪辑'],
    description: '为一家科技初创公司制作3条品牌宣传片，展示产品功能与企业文化',
    mentor: '林小影',
    slots: 5,
    applied: 3
  },
  {
    id: 'proj_002',
    title: '电商产品详情页设计',
    type: 'designer',
    difficulty: '初级',
    duration: '5天',
    reward: '¥1500-2500',
    requirements: ['熟练使用Midjourney', '了解电商设计规范', '有审美基础'],
    description: '为美妆品牌设计10张产品详情页图片，突出产品卖点',
    mentor: '设计小美',
    slots: 8,
    applied: 6
  },
  {
    id: 'proj_003',
    title: 'AI短剧剧本创作',
    type: 'shortdrama',
    difficulty: '高级',
    duration: '14天',
    reward: '¥8000-15000',
    requirements: ['有编剧基础', '熟悉AI短剧形式', '能独立完成剧本'],
    description: '创作一部10集AI短剧剧本，都市情感题材，每集3-5分钟',
    mentor: '周编剧',
    slots: 3,
    applied: 2
  },
  {
    id: 'proj_004',
    title: '餐饮品牌短视频矩阵搭建',
    type: 'commerce',
    difficulty: '中级',
    duration: '30天',
    reward: '¥10000-20000',
    requirements: ['有账号运营经验', '熟悉本地生活赛道', '能持续产出内容'],
    description: '为连锁餐饮品牌搭建抖音/小红书账号矩阵，日更3条短视频',
    mentor: '带货达人',
    slots: 2,
    applied: 1
  }
]

// ======= 用户培训进度 =======
function getUserProgress() {
  const saved = localStorage.getItem('opc_training_progress')
  if (saved) return JSON.parse(saved)
  return {
    currentModule: null,
    completedModules: [],
    currentLesson: 0,
    totalLessons: 54,
    practiceProjects: [],
    mentorId: null,
    startDate: null
  }
}

function saveUserProgress(progress) {
  localStorage.setItem('opc_training_progress', JSON.stringify(progress))
}

export default function OPCTrainingCamp() {
  const navigate = useNavigate()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('modules')
  const [selectedModule, setSelectedModule] = useState(null)
  const [progress, setProgress] = useState(getUserProgress())
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [showMentorModal, setShowMentorModal] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoading(false), 800)
  }, [])

  // 开始模块学习
  const handleStartModule = (module) => {
    if (progress.currentModule && progress.currentModule !== module.id) {
      toast.warning('请完成当前模块后再开始新模块')
      return
    }
    
    const newProgress = {
      ...progress,
      currentModule: module.id,
      startDate: progress.startDate || new Date().toISOString()
    }
    setProgress(newProgress)
    saveUserProgress(newProgress)
    setSelectedModule(module)
    toast.success(`已加入「${module.name}」模块`)
  }

  // 申请实战项目
  const handleApplyProject = (project) => {
    if (!progress.currentModule) {
      toast.warning('请先加入实战操盘模块')
      return
    }
    if (progress.currentModule !== 'practice') {
      toast.warning('请先完成前两个模块')
      return
    }
    setSelectedProject(project)
    setShowProjectModal(true)
  }

  // 确认申请项目
  const confirmApplyProject = () => {
    const newProgress = {
      ...progress,
      practiceProjects: [...progress.practiceProjects, selectedProject.id]
    }
    setProgress(newProgress)
    saveUserProgress(newProgress)
    setShowProjectModal(false)
    toast.success('申请成功！导师将在24小时内联系你')
  }

  // 选择导师
  const handleSelectMentor = (mentor) => {
    setSelectedMentor(mentor)
    setShowMentorModal(true)
  }

  // 确认选择导师
  const confirmSelectMentor = () => {
    const newProgress = {
      ...progress,
      mentorId: selectedMentor.id
    }
    setProgress(newProgress)
    saveUserProgress(newProgress)
    setShowMentorModal(false)
    toast.success(`已成功选择导师：${selectedMentor.name}`)
  }

  // 计算总体进度
  const calculateProgress = () => {
    if (progress.completedModules.length === 0) return 0
    return Math.round((progress.completedModules.length / 3) * 100)
  }

  if (loading) {
    return <PageLoading message="加载特训营数据..." />
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.3)} 50%{box-shadow:0 0 40px rgba(99,102,241,0.5)} }
        .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .mesh-bg {
          background-image: 
            radial-gradient(at 0% 0%, rgba(99,102,241,0.15) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(139,92,246,0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(168,85,247,0.1) 0px, transparent 50%);
        }
        .glass-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .glass-card:hover {
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
      `}</style>

      {/* Hero区 */}
      <section className="relative overflow-hidden pt-16 pb-8">
        <div className="absolute inset-0 mesh-bg"></div>
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[150px] animate-float"></div>
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-violet-500/15 rounded-full blur-[120px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-full text-violet-300 text-sm mb-6">
              <GraduationCap className="w-4 h-4" />
              OPC特训营
            </div>
            <h1 className="text-5xl font-bold gradient-text mb-4">
              从新手到L4极核引擎手
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              认知重塑 → 矩阵建构 → 实战操盘，三步打造超级个体
            </p>
          </div>

          {/* 进度概览 */}
          {progress.currentModule && (
            <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">当前进度</p>
                    <p className="text-white font-bold">
                      {TRAINING_MODULES.find(m => m.id === progress.currentModule)?.name || '未开始'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-violet-400">{calculateProgress()}%</p>
                  <p className="text-gray-500 text-sm">总体完成度</p>
                </div>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-3 text-sm text-gray-500">
                <span>已完成模块: {progress.completedModules.length}/3</span>
                <span>实战项目: {progress.practiceProjects.length}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tab导航 */}
      <section className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            {[
              { id: 'modules', label: '三大模块', icon: Layers, desc: '系统化学习' },
              { id: 'projects', label: '实战项目', icon: Briefcase, desc: '真实项目演练' },
              { id: 'mentors', label: '导师匹配', icon: Users, desc: '1对1指导' },
              { id: 'certification', label: '认证考试', icon: Award, desc: '等级认证' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-white border border-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-violet-400' : ''}`} />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-semibold">{tab.label}</span>
                  <span className={`text-xs ${activeTab === tab.id ? 'text-violet-300' : 'text-gray-500'}`}>{tab.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 内容区 */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* 三大模块 */}
        {activeTab === 'modules' && (
          <div className="space-y-8">
            {!selectedModule ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">选择你的学习路径</h2>
                  <p className="text-gray-400">建议按顺序完成三个模块，循序渐进提升能力</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {TRAINING_MODULES.map((module, idx) => {
                    const isCompleted = progress.completedModules.includes(module.id)
                    const isCurrent = progress.currentModule === module.id
                    const isLocked = idx > 0 && !progress.completedModules.includes(TRAINING_MODULES[idx-1].id) && progress.currentModule !== TRAINING_MODULES[idx-1].id
                    
                    return (
                      <div 
                        key={module.id}
                        className={`glass-card rounded-3xl p-8 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                          isCompleted ? 'border-emerald-500/30' : 
                          isCurrent ? 'border-violet-500/30 pulse-glow' : 
                          isLocked ? 'opacity-60' : ''
                        }`}
                      >
                        {/* 状态标签 */}
                        {isCompleted && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            已完成
                          </div>
                        )}
                        {isCurrent && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-violet-500/20 text-violet-400 text-xs rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            进行中
                          </div>
                        )}
                        {isLocked && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                            🔒 需解锁
                          </div>
                        )}

                        {/* 图标 */}
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-6`}>
                          <module.icon className="w-8 h-8 text-white" />
                        </div>

                        {/* 内容 */}
                        <h3 className="text-2xl font-bold text-white mb-2">{module.name}</h3>
                        <p className="text-gray-500 text-sm mb-4">{module.subtitle}</p>
                        <p className="text-gray-400 text-sm mb-6">{module.desc}</p>

                        {/* 元信息 */}
                        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {module.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Play className="w-4 h-4" />
                            {module.lessons}课时
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${module.bgColor} ${module.borderColor} border`}>
                            {module.level}
                          </span>
                        </div>

                        {/* 学习主题 */}
                        <div className="space-y-2 mb-6">
                          {module.topics.slice(0, 3).map((topic, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${module.color}`}></div>
                              {topic}
                            </div>
                          ))}
                          {module.topics.length > 3 && (
                            <p className="text-sm text-gray-500">+{module.topics.length - 3} 更多主题</p>
                          )}
                        </div>

                        {/* 按钮 */}
                        <button
                          onClick={() => handleStartModule(module)}
                          disabled={isLocked || isCompleted}
                          className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                              : isLocked
                              ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                              : isCurrent
                              ? 'bg-violet-500 text-white hover:bg-violet-600'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {isCompleted ? (
                            <><CheckCircle className="w-4 h-4" /> 已完成</>
                          ) : isLocked ? (
                            '🔒 请先完成前置模块'
                          ) : isCurrent ? (
                            <><Play className="w-4 h-4" /> 继续学习</>
                          ) : (
                            <><ArrowRight className="w-4 h-4" /> 开始学习</>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <ModuleDetail 
                module={selectedModule} 
                onBack={() => setSelectedModule(null)}
                progress={progress}
                setProgress={setProgress}
              />
            )}
          </div>
        )}

        {/* 实战项目 */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">实战项目池</h2>
                <p className="text-gray-400">完成实战操盘模块后，可申请参与真实项目</p>
              </div>
              {progress.practiceProjects.length > 0 && (
                <div className="px-4 py-2 bg-violet-500/20 text-violet-400 rounded-xl text-sm">
                  已参与 {progress.practiceProjects.length} 个项目
                </div>
              )}
            </div>

            {progress.currentModule !== 'practice' ? (
              <div className="glass-card rounded-3xl p-12 text-center">
                <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-12 h-12 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">需要先完成前置模块</h3>
                <p className="text-gray-400 mb-6">请先完成「认知重塑」和「矩阵建构」模块，解锁实战项目</p>
                <button 
                  onClick={() => setActiveTab('modules')}
                  className="px-8 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-all"
                >
                  前往学习模块
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PRACTICE_PROJECTS.map((project, idx) => {
                  const hasApplied = progress.practiceProjects.includes(project.id)
                  const isFull = project.applied >= project.slots
                  
                  return (
                    <div key={project.id} className="glass-card rounded-2xl p-6 hover:border-violet-500/30 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.difficulty === '初级' ? 'bg-emerald-500/20 text-emerald-400' :
                            project.difficulty === '中级' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {project.difficulty}
                          </span>
                          <h3 className="text-lg font-bold text-white mt-2">{project.title}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-amber-400 font-bold">{project.reward}</p>
                          <p className="text-gray-500 text-sm">{project.duration}</p>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.requirements.map((req, i) => (
                          <span key={i} className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded">
                            {req}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-sm">
                            {MENTORS.find(m => m.name === project.mentor)?.avatar || '导'}
                          </div>
                          <span className="text-gray-400 text-sm">导师: {project.mentor}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-sm">
                            名额: {project.applied}/{project.slots}
                          </span>
                          <button
                            onClick={() => handleApplyProject(project)}
                            disabled={hasApplied || isFull}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              hasApplied
                                ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                                : isFull
                                ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                                : 'bg-violet-500 text-white hover:bg-violet-600'
                            }`}
                          >
                            {hasApplied ? '已申请' : isFull ? '已满员' : '申请项目'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* 导师匹配 */}
        {activeTab === 'mentors' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">导师广场</h2>
                <p className="text-gray-400">选择适合你的导师，获得1对1指导</p>
              </div>
              {progress.mentorId && (
                <div className="px-4 py-2 bg-violet-500/20 text-violet-400 rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  已选择导师: {MENTORS.find(m => m.id === progress.mentorId)?.name}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MENTORS.map((mentor, idx) => (
                <div key={mentor.id} className="glass-card rounded-2xl p-6 hover:border-violet-500/30 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl text-white">
                      {mentor.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{mentor.name}</h3>
                      <p className="text-gray-400 text-sm">{mentor.title}</p>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        mentor.level === 'L4' ? 'bg-amber-500/20 text-amber-400' : 'bg-violet-500/20 text-violet-400'
                      }`}>
                        {mentor.level}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{mentor.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.expertise.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-violet-500/10 text-violet-300 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {mentor.students}学员
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400" />
                      {mentor.rating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className={`px-2 py-1 rounded text-xs ${
                      mentor.available 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {mentor.available ? '🟢 可预约' : '⚪ 暂无档期'}
                    </span>
                    <button
                      onClick={() => handleSelectMentor(mentor)}
                      disabled={!mentor.available || progress.mentorId === mentor.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        progress.mentorId === mentor.id
                          ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                          : !mentor.available
                          ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                          : 'bg-violet-500 text-white hover:bg-violet-600'
                      }`}
                    >
                      {progress.mentorId === mentor.id ? '当前导师' : '选择导师'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 认证考试 */}
        {activeTab === 'certification' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">等级认证考试</h2>
              <p className="text-gray-400">完成培训后参加认证考试，获得官方等级认证</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { level: 'L1', name: '战术执行者', desc: '掌握基础AI工具使用', requirements: ['完成认知重塑模块', '通过L1理论考试'], color: 'from-gray-500 to-gray-600' },
                { level: 'L2', name: '矩阵架构师', desc: '建立个人AI工具矩阵', requirements: ['完成矩阵建构模块', '通过L2实操考核'], color: 'from-blue-500 to-cyan-600' },
                { level: 'L3', name: '全域操盘手', desc: '独立完成商业项目', requirements: ['完成实战操盘模块', '完成2个实战项目'], color: 'from-violet-500 to-purple-600' },
                { level: 'L4', name: '极核引擎手', desc: '引领团队与行业标准', requirements: ['完成10个商业项目', '通过L4综合评审'], color: 'from-amber-500 to-orange-600' },
              ].map((cert, idx) => {
                const isUnlocked = cert.level === 'L1' || 
                  (cert.level === 'L2' && progress.completedModules.includes('cognition')) ||
                  (cert.level === 'L3' && progress.completedModules.length >= 2) ||
                  (cert.level === 'L4' && progress.completedModules.length >= 3)
                
                return (
                  <div key={cert.level} className={`glass-card rounded-2xl p-6 ${!isUnlocked ? 'opacity-60' : ''}`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center mb-4`}>
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{cert.level}</h3>
                    <p className="text-gray-400 text-sm mb-4">{cert.name}</p>
                    <p className="text-gray-500 text-sm mb-4">{cert.desc}</p>
                    
                    <div className="space-y-2 mb-6">
                      {cert.requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                          <div className={`w-1.5 h-1.5 rounded-full ${isUnlocked ? 'bg-emerald-400' : 'bg-gray-500'}`}></div>
                          {req}
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={!isUnlocked}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                        isUnlocked
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isUnlocked ? '参加考试' : '🔒 未解锁'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* 项目申请弹窗 */}
      {showProjectModal && selectedProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">确认申请项目</h3>
            <p className="text-gray-400 mb-6">
              你正在申请「{selectedProject.title}」项目，导师将在24小时内审核你的申请。
            </p>
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">项目收益</span>
                <span className="text-amber-400 font-bold">{selectedProject.reward}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">项目周期</span>
                <span className="text-white">{selectedProject.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">指导导师</span>
                <span className="text-white">{selectedProject.mentor}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowProjectModal(false)}
                className="flex-1 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all"
              >
                取消
              </button>
              <button
                onClick={confirmApplyProject}
                className="flex-1 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-all"
              >
                确认申请
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 导师选择弹窗 */}
      {showMentorModal && selectedMentor && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">确认选择导师</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl text-white">
                {selectedMentor.avatar}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{selectedMentor.name}</h4>
                <p className="text-gray-400">{selectedMentor.title}</p>
                <span className="text-amber-400 text-sm flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {selectedMentor.rating} · {selectedMentor.students}学员
                </span>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              选择导师后，你将获得该导师的1对1指导，导师将跟踪你的学习进度并提供个性化建议。
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowMentorModal(false)}
                className="flex-1 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all"
              >
                取消
              </button>
              <button
                onClick={confirmSelectMentor}
                className="flex-1 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-all"
              >
                确认选择
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 模块详情组件
function ModuleDetail({ module, onBack, progress, setProgress }) {
  const toast = useToast()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState([])

  const handleCompleteLesson = (lessonIndex) => {
    if (!completedLessons.includes(lessonIndex)) {
      const newCompleted = [...completedLessons, lessonIndex]
      setCompletedLessons(newCompleted)
      
      // 检查是否完成所有课程
      if (newCompleted.length >= module.topics.length) {
        const newProgress = {
          ...progress,
          completedModules: [...progress.completedModules, module.id],
          currentModule: null
        }
        setProgress(newProgress)
        saveUserProgress(newProgress)
        toast.success(`🎉 恭喜完成「${module.name}」模块！`)
      } else {
        toast.success('课程完成！继续下一课')
      }
    }
  }

  return (
    <div className="space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        返回模块列表
      </button>

      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-start gap-6 mb-8">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center flex-shrink-0`}>
            <module.icon className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{module.name}</h2>
            <p className="text-gray-400 mb-4">{module.desc}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {module.duration}
              </span>
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4" />
                {module.lessons}课时
              </span>
              <span className={`px-2 py-0.5 rounded text-xs ${module.bgColor} ${module.borderColor} border`}>
                {module.level}
              </span>
            </div>
          </div>
        </div>

        {/* 课程列表 */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">课程内容</h3>
          {module.topics.map((topic, idx) => {
            const isCompleted = completedLessons.includes(idx)
            const isCurrent = currentLesson === idx
            
            return (
              <div 
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : isCurrent
                    ? 'bg-violet-500/10 border-violet-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : isCurrent
                        ? 'bg-violet-500/20 text-violet-400'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className={`font-medium ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                        {idx + 1}. {topic}
                      </p>
                      <p className="text-sm text-gray-500">
                        {isCompleted ? '已完成' : isCurrent ? '正在学习' : '待学习'}
                      </p>
                    </div>
                  </div>
                  {!isCompleted && (
                    <button
                      onClick={() => handleCompleteLesson(idx)}
                      className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm hover:bg-violet-600 transition-all"
                    >
                      {isCurrent ? '完成学习' : '开始学习'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 学习成果 */}
        <div className="mt-8 p-6 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl border border-violet-500/20">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-violet-400" />
            完成本模块你将获得
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {module.outcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-violet-400" />
                </div>
                <span className="text-gray-300 text-sm">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
