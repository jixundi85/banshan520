import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, ChevronRight, ChevronDown, BookOpen, Clock, Users,
  Star, Play, Pause, Lock, Zap, CheckCircle, UserPlus, Check, Award,
  Volume2, VolumeX, Maximize, SkipBack, SkipForward, Menu, X
} from 'lucide-react'
import { allCourses } from '../../data/unifiedCourses'
import PaymentModal from '../../components/PaymentModal'


// 封面图片映射
const coverImages = {
  // 新统一分类
  video:    'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&h=600&fit=crop',
  film:     'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=600&fit=crop',
  designer: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
  drama:    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop',
  travel:   'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=600&fit=crop',
  mangadrama:'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=1200&h=600&fit=crop',
  commerce: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
  // OPC特训营课程分类
  aivideo: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&h=600&fit=crop',
  aiadfilm: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=600&fit=crop',
  aidesigner: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
  aishortdrama: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop',
  aitourism: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=600&fit=crop',
  uidesigner: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&h=600&fit=crop',
  strategy: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop',
  ipo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
  financing: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop',
  equity: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
  goingglobal: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&h=600&fit=crop',
  aitransform: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
  privatecloud: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop',
}

const categoryNames = {
  video: 'AI视频',
  film: 'AI广告电影',
  designer: 'AI设计师',
  drama: 'AI短剧',
  travel: 'AI文旅',
  mangadrama: 'AI漫剧',
  commerce: 'AI带货变现',
  aivideo: 'AI视频',
  aiadfilm: 'AI广告电影',
  aidesigner: 'AI设计师',
  aishortdrama: 'AI短剧漫剧',
  aitourism: 'AI文旅宣传片',
  uidesigner: 'UI设计师',
  strategy: '战略咨询',
  ipo: '上市咨询',
  financing: '融资咨询',
  equity: '股权架构咨询',
  goingglobal: '战略出海咨询',
  aitransform: 'AI升级转型咨询',
  privatecloud: '私有化部署咨询',
}

// 分类颜色配置
const categoryMeta = {
  // 新统一分类（对应 unifiedCourses）
  video:    { gradient: 'from-orange-500 to-amber-600', light: 'from-orange-500/15 to-amber-600/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: '🎬', glow: 'shadow-orange-500/20' },
  film:     { gradient: 'from-cyan-500 to-blue-600', light: 'from-cyan-500/15 to-blue-600/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: '🎥', glow: 'shadow-cyan-500/20' },
  designer: { gradient: 'from-emerald-500 to-teal-600', light: 'from-emerald-500/15 to-teal-600/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: '🎨', glow: 'shadow-emerald-500/20' },
  drama:    { gradient: 'from-pink-500 to-rose-600', light: 'from-pink-500/15 to-rose-600/10', border: 'border-pink-500/30', text: 'text-pink-400', icon: '🎭', glow: 'shadow-pink-500/20' },
  travel:   { gradient: 'from-green-500 to-emerald-600', light: 'from-green-500/15 to-emerald-600/10', border: 'border-green-500/30', text: 'text-green-400', icon: '✈️', glow: 'shadow-green-500/20' },
  mangadrama:{ gradient: 'from-pink-500 to-rose-600', light: 'from-pink-500/15 to-rose-600/10', border: 'border-pink-500/30', text: 'text-pink-400', icon: '📚', glow: 'shadow-pink-500/20' },
  commerce: { gradient: 'from-yellow-500 to-orange-500', light: 'from-yellow-500/15 to-orange-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: '💰', glow: 'shadow-yellow-500/20' },
  // OPC特训营
  aivideo: { gradient: 'from-orange-500 to-amber-600', light: 'from-orange-500/15 to-amber-600/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: '🎬', glow: 'shadow-orange-500/20' },
  aiadfilm: { gradient: 'from-red-500 to-rose-600', light: 'from-red-500/15 to-rose-600/10', border: 'border-red-500/30', text: 'text-red-400', icon: '🎥', glow: 'shadow-red-500/20' },
  aidesigner: { gradient: 'from-purple-500 to-violet-600', light: 'from-purple-500/15 to-violet-600/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: '🎨', glow: 'shadow-purple-500/20' },
  aishortdrama: { gradient: 'from-pink-500 to-rose-600', light: 'from-pink-500/15 to-rose-600/10', border: 'border-pink-500/30', text: 'text-pink-400', icon: '🎭', glow: 'shadow-pink-500/20' },
  aitourism: { gradient: 'from-green-500 to-emerald-600', light: 'from-green-500/15 to-emerald-600/10', border: 'border-green-500/30', text: 'text-green-400', icon: '📍', glow: 'shadow-green-500/20' },
  uidesigner: { gradient: 'from-cyan-500 to-blue-600', light: 'from-cyan-500/15 to-blue-600/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: '🖥️', glow: 'shadow-cyan-500/20' },
  strategy: { gradient: 'from-orange-500 to-amber-600', light: 'from-orange-500/15 to-amber-600/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: '🎯', glow: 'shadow-orange-500/20' },
  ipo: { gradient: 'from-green-500 to-emerald-600', light: 'from-green-500/15 to-emerald-600/10', border: 'border-green-500/30', text: 'text-green-400', icon: '📈', glow: 'shadow-green-500/20' },
  financing: { gradient: 'from-cyan-500 to-blue-600', light: 'from-cyan-500/15 to-blue-600/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: '💰', glow: 'shadow-cyan-500/20' },
  equity: { gradient: 'from-purple-500 to-violet-600', light: 'from-purple-500/15 to-violet-600/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: '📊', glow: 'shadow-purple-500/20' },
  goingglobal: { gradient: 'from-orange-500 to-amber-600', light: 'from-orange-500/15 to-amber-600/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: '🌍', glow: 'shadow-orange-500/20' },
  aitransform: { gradient: 'from-purple-500 to-violet-600', light: 'from-purple-500/15 to-violet-600/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: '🤖', glow: 'shadow-purple-500/20' },
  privatecloud: { gradient: 'from-gray-500 to-slate-600', light: 'from-gray-500/15 to-slate-600/10', border: 'border-gray-500/30', text: 'text-gray-400', icon: '🖥️', glow: 'shadow-gray-500/20' },
}

// 示例视频URL
const DEMO_VIDEO = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

// 进度管理
const PROGRESS_KEY = 'opc_course_progress'
const getProgress = () => { try { const s = localStorage.getItem(PROGRESS_KEY); return s ? JSON.parse(s) : {} } catch { return {} } }
const saveLessonProgress = (courseId, chapterIdx, lessonIdx, videoTime) => {
  const p = getProgress()
  if (!p[courseId]) p[courseId] = { lessons: {}, lastPosition: {} }
  p[courseId].lessons[`${chapterIdx}-${lessonIdx}`] = true
  p[courseId].lastPosition[`${chapterIdx}-${lessonIdx}`] = videoTime
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))
}
const getLessonProgress = (courseId, chapterIdx, lessonIdx) => {
  const p = getProgress()
  return p[courseId]?.lastPosition?.[`${chapterIdx}-${lessonIdx}`] || 0
}
const isLessonCompleted = (courseId, chapterIdx, lessonIdx) => {
  const p = getProgress()
  return !!(p[courseId]?.lessons?.[`${chapterIdx}-${lessonIdx}`])
}

// 玻璃拟态卡片组件
function GlassCard({ children, className = '', hover = true }) {
  return (
    <div className={`
      bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
      ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

// ======= 学员评价数据 =======
const courseReviews = {
  101: [
    { id: 1, name: '张学员', avatar: '张', rating: 5, date: '2024-12-15', content: '课程非常实用！老师讲解清晰易懂，跟着做就能出作品。7天就做出了第一条AI短视频！', tags: ['入门友好', '实操性强'] },
    { id: 2, name: '李学员', avatar: '李', rating: 5, date: '2024-12-10', content: '作为完全新手，本来担心学不会，结果老师讲得很细。现在已经能独立用即梦做视频了，强烈推荐！', tags: ['适合新手', '讲解细致'] },
    { id: 3, name: '王学员', avatar: '王', rating: 4, date: '2024-12-05', content: '工具讲得很全面，就是希望能有更多案例分析。不过已经很有收获了！', tags: ['内容全面', '可学习'] }
  ],
  201: [
    { id: 1, name: '陈学员', avatar: '陈', rating: 5, date: '2024-12-12', content: '广告电影制作这课太值了！以前花几千找人做，现在自己就能搞定。ROI直接翻倍！', tags: ['商业价值高', '省成本'] },
    { id: 2, name: '刘学员', avatar: '刘', rating: 5, date: '2024-12-08', content: '张总监讲的都是实战经验，不是理论空谈。学完就能上手用！', tags: ['实战派', '易上手'] }
  ],
  301: [
    { id: 1, name: '赵学员', avatar: '赵', rating: 5, date: '2024-12-14', content: 'UI老王不愧是阿里出来的设计师！学完Midjourney和SD，我接单效率提升了5倍。', tags: ['专业', '效率提升'] },
    { id: 2, name: '孙学员', avatar: '孙', rating: 5, date: '2024-12-11', content: '从完全不会AI绘图，到现在能接Logo设计的单子，这个课程帮了大忙！', tags: ['变现快', '易学'] }
  ],
  401: [
    { id: 1, name: '周学员', avatar: '周', rating: 5, date: '2024-12-13', content: '短剧市场正火，学完这课直接入场。现在单靠短剧每月多赚8000+！', tags: ['变现强', '市场热'] },
    { id: 2, name: '吴学员', avatar: '吴', rating: 4, date: '2024-12-07', content: '课程内容很充实，角色一致性控制讲得特别细。不过希望能多更新一些案例。', tags: ['内容充实', '实用'] }
  ]
}

// 默认评价（用于没有特定评价的课程）
const defaultReviews = [
  { id: 1, name: '学员A', avatar: 'A', rating: 5, date: '2024-12-15', content: '课程内容很实用，老师讲解清晰，学完就能上手操作。', tags: ['实用', '易懂'] },
  { id: 2, name: '学员B', avatar: 'B', rating: 5, date: '2024-12-12', content: '零基础也能学，课程安排循序渐进。强烈推荐！', tags: ['适合新手', '推荐'] },
  { id: 3, name: '学员C', avatar: 'C', rating: 4, date: '2024-12-10', content: '学完感觉收获很大，已经开始接单了，感谢老师！', tags: ['能变现', '好评'] }
]

// ======= 学习路径推荐数据 =======
const learningPaths = {
  shortvideo: {
    name: 'AI短视频创作路径',
    icon: '🎬',
    gradient: 'from-orange-500 to-amber-600',
    steps: [
      { level: '入门', courseId: 101, title: 'AI短视频入门', purpose: '打好基础，掌握工具' },
      { level: '进阶', courseId: 102, title: 'AI视频特效制作', purpose: '提升质量，增加特效' },
      { level: '专业', courseId: null, title: '商业项目实战', purpose: '接单变现，月入过万' }
    ]
  },
  film: {
    name: 'AI广告电影制作路径',
    icon: '🎥',
    gradient: 'from-red-500 to-rose-600',
    steps: [
      { level: '入门', courseId: 201, title: 'AI广告电影入门', purpose: '了解广告制作流程' },
      { level: '进阶', courseId: 202, title: 'AI广告电影进阶', purpose: '掌握分镜与视觉特效' },
      { level: '专业', courseId: null, title: '品牌项目实战', purpose: '服务B端客户' }
    ]
  },
  designer: {
    name: 'AI设计师成长路径',
    icon: '🎨',
    gradient: 'from-purple-500 to-violet-600',
    steps: [
      { level: '入门', courseId: 301, title: 'AI设计师入门', purpose: '掌握MJ和SD基础' },
      { level: '进阶', courseId: 302, title: 'AI设计师进阶', purpose: 'UI设计+品牌视觉' },
      { level: '专业', courseId: null, title: '设计工作室', purpose: '团队协作+创业' }
    ]
  },
  drama: {
    name: 'AI短剧创作路径',
    icon: '🎭',
    gradient: 'from-pink-500 to-rose-600',
    steps: [
      { level: '入门', courseId: 401, title: 'AI短剧入门', purpose: '剧本+角色+场景' },
      { level: '进阶', courseId: 402, title: 'AI短剧进阶', purpose: '高转化+多集连更' },
      { level: '专业', courseId: null, title: '短剧IP打造', purpose: '粉丝经济+变现' }
    ]
  }
}

// 默认学习路径
const defaultPath = {
  name: '系统学习路径',
  icon: '📚',
  gradient: 'from-cyan-500 to-blue-600',
  steps: [
    { level: '第一步', courseId: null, title: '打好基础', purpose: '选择入门课程开始' },
    { level: '第二步', courseId: null, title: '进阶提升', purpose: '学习进阶课程' },
    { level: '第三步', courseId: null, title: '实战变现', purpose: '接单+作品集' }
  ]
}

// 星级评分组件
function StarRating({ rating, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
        />
      ))}
    </div>
  )
}

// 学员评价卡片组件
function ReviewCard({ review, catMeta }) {
  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${catMeta.gradient} flex items-center justify-center text-white font-bold text-sm`}>
            {review.avatar}
          </div>
          <div>
            <div className="text-white font-medium text-sm">{review.name}</div>
            <div className="text-gray-500 text-xs">{review.date}</div>
          </div>
        </div>
        <StarRating rating={review.rating} size={14} />
      </div>
      <p className="text-gray-300 text-sm leading-relaxed mb-3">{review.content}</p>
      <div className="flex flex-wrap gap-2">
        {review.tags?.map((tag, i) => (
          <span key={i} className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

// 学习路径组件
function LearningPath({ path, currentCourseId }) {
  const navigate = useNavigate()
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{path.icon}</span>
        <h4 className="text-white font-semibold">{path.name}</h4>
      </div>
      <div className="relative">
        {/* 连接线 */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500/50 to-cyan-500/50"></div>
        {path.steps.map((step, i) => {
          const isCurrent = step.courseId && step.courseId === currentCourseId
          const isCompleted = step.courseId && step.courseId < currentCourseId
          const isLocked = !step.courseId && i > 0
          
          return (
            <div key={i} className="relative flex items-start gap-4 mb-3">
              <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border-2 ${
                isCurrent ? `bg-gradient-to-br ${path.gradient} text-white border-transparent shadow-lg` :
                isCompleted ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                isLocked ? 'bg-slate-700/50 text-gray-500 border-slate-600/50' :
                'bg-slate-700 text-gray-300 border-slate-600'
              }`}>
                {isCompleted ? '✓' : i + 1}
              </div>
              <div className={`flex-1 p-3 rounded-xl border ${
                isCurrent ? 'bg-violet-500/10 border-violet-500/30' :
                isLocked ? 'bg-slate-700/30 border-slate-700/50 opacity-60' :
                'bg-white/5 border-white/10'
              }`}>
                <div className={`text-sm font-medium ${isCurrent ? 'text-violet-300' : isLocked ? 'text-gray-500' : 'text-white'}`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{step.purpose}</div>
                {isCurrent && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded-full">
                    当前课程
                  </span>
                )}
                {step.courseId && step.courseId !== currentCourseId && (
                  <button
                    onClick={() => navigate(`/course/${step.courseId}`)}
                    className="mt-2 text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    去学习 →
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 浮动光球背景
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/30 to-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-600/25 to-blue-600/15 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  )
}

// 视频播放器组件
function VideoPlayer({ 
  videoUrl, 
  poster, 
  onProgress, 
  initialTime = 0, 
  catMeta,
  chapterIdx,
  lessonIdx
}) {
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const controlsTimer = useRef(null)

  // 初始化
  useEffect(() => {
    if (videoRef.current && initialTime > 0) {
      videoRef.current.currentTime = initialTime
    }
  }, [initialTime, videoUrl])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!videoRef.current) return
      switch(e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          videoRef.current.currentTime -= 10
          break
        case 'ArrowRight':
          videoRef.current.currentTime += 10
          break
        case 'ArrowUp':
          setVolume(v => Math.min(1, v + 0.1))
          break
        case 'ArrowDown':
          setVolume(v => Math.max(0, v - 0.1))
          break
        case 'KeyF':
          toggleFullscreen()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimer.current) clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleFullscreen = () => {
    if (!playerRef.current) return
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      // 每10秒保存一次进度
      if (Math.floor(videoRef.current.currentTime) % 10 === 0) {
        onProgress?.(videoRef.current.currentTime)
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    if (videoRef.current) {
      videoRef.current.currentTime = percent * duration
    }
  }

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    if (newVolume > 0) setIsMuted(false)
  }

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
    setShowSpeedMenu(false)
  }

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const formatTime = (time) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div 
      ref={playerRef}
      className="relative bg-black aspect-video rounded-xl overflow-hidden"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl || DEMO_VIDEO}
        className="w-full h-full"
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* 播放按钮覆盖层 */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${catMeta.gradient} flex items-center justify-center shadow-2xl ${catMeta.glow} hover:scale-110 transition-transform`}>
            <Play size={36} color="#fff" style={{ marginLeft: 4 }} />
          </div>
        </div>
      )}

      {/* 控制栏 */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* 进度条 */}
        <div 
          className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-3 group"
          onClick={handleSeek}
        >
          <div 
            className={`h-full bg-gradient-to-r ${catMeta.gradient} rounded-full relative`}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 播放/暂停 */}
            <button onClick={togglePlay} className="text-white hover:text-gray-300">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* 快退/快进 */}
            <button onClick={() => skip(-10)} className="text-white hover:text-gray-300">
              <SkipBack size={20} />
            </button>
            <button onClick={() => skip(10)} className="text-white hover:text-gray-300">
              <SkipForward size={20} />
            </button>

            {/* 音量 */}
            <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-gray-300">
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 accent-white"
            />

            {/* 时间 */}
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* 倍速 */}
            <div className="relative">
              <button 
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 bg-white/20 rounded text-white text-sm hover:bg-white/30"
              >
                {playbackRate}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-slate-800 rounded-lg overflow-hidden border border-white/20">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 ${playbackRate === rate ? 'text-violet-400 bg-white/10' : 'text-white'}`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 全屏 */}
            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 图文内容渲染组件 - 类似淘宝详情页风格
function RichContent({ content }) {
  if (!content) return null
  
  // 如果content是HTML，直接渲染
  if (content.includes('<') && content.includes('>')) {
    return <div className="course-intro-html" dangerouslySetInnerHTML={{ __html: content }} />
  }
  
  // 如果是JSON字符串，尝试解析
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed)) {
      return (
        <div className="space-y-6">
          {parsed.map((block, i) => (
            <div key={i} className="mb-6">
              {block.type === 'image' && (
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img src={block.src} alt={block.alt || ''} className="w-full" />
                </div>
              )}
              {block.type === 'text' && (
                <p className="text-gray-300 leading-8 text-base">{block.content}</p>
              )}
              {block.type === 'heading' && (
                <div className="flex items-center gap-3 mt-8 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-white">{block.content}</h3>
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }
  } catch (e) {
    // 不是JSON，当作纯文本处理
  }
  
  // 纯文本
  return <p className="text-gray-300 leading-8 text-base">{content}</p>
}

export default function CourseDetail() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [expandedChapters, setExpandedChapters] = useState({})
  const [activeTab, setActiveTab] = useState('outline')
  const [enrolled, setEnrolled] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [toast, setToast] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [currentPlayingLesson, setCurrentPlayingLesson] = useState({ chapterIdx: 0, lessonIdx: 0 })
  const [creatorTutorials, setCreatorTutorials] = useState([])

  // 加载创作者发布的课程
  useEffect(() => {
    const loadCreatorTutorials = () => {
      try {
        const savedTutorials = JSON.parse(localStorage.getItem('savedTutorials') || '[]')
        const publishedTutorials = savedTutorials.filter(t => t.status === 'published')
        const converted = publishedTutorials.map(t => ({
          id: t.id,
          category: t.category,
          categoryName: t.categoryName,
          level: t.level || '创作者',
          levelColor: '#8b5cf6',
          title: t.title,
          subtitle: t.description,
          students: t.students || 0,
          rating: t.rating || 4.8,
          reviews: Math.floor((t.students || 0) / 3),
          duration: t.duration || '未知',
          lessons: t.lessons || 0,
          teacher: {
            name: t.creatorName || '创作者',
            avatar: (t.creatorName || '创')[0],
            title: '平台认证创作者',
            bio: t.creatorBio || '专业内容创作者'
          },
          price: t.price || 0,
          originalPrice: t.originalPrice || 0,
          pointsPrice: t.pointsPrice || 0,
          tags: t.tags || [],
          featured: t.featured || false,
          bgColor: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          highlight: '创作者课程',
          coverImage: t.coverImage,
          chapters: t.chapters || [],
          content: t.detailContent || t.content || '',
          isCreatorTutorial: true
        }))
        setCreatorTutorials(converted)
      } catch (e) {
        console.error('加载创作者教程失败:', e)
      }
    }

    loadCreatorTutorials()
    window.addEventListener('creatorTutorialsUpdated', loadCreatorTutorials)
    return () => window.removeEventListener('creatorTutorialsUpdated', loadCreatorTutorials)
  }, [])

  // 直接使用导入的 allCourses（已合并所有课程数据）找到当前课程
  const allData = [...allCourses, ...creatorTutorials]
  const course = allData.find(c => String(c.id) === String(courseId))
  const catMeta = categoryMeta[course?.category] || categoryMeta.video

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  // 课程报名状态
  useEffect(() => {
    if (!course) return
    const purchasedCourses = JSON.parse(localStorage.getItem('purchasedCourses') || '[]')
    const isPurchased = purchasedCourses.includes(String(course.id))
    const legacyEnrolled = localStorage.getItem('enrolled_' + course.id) === 'true'
    setEnrolled(isPurchased || legacyEnrolled)
    setExpandedChapters({ 0: true })
  }, [course])

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center relative">
        <FloatingOrbs />
        <GlassCard className="p-8 text-center relative z-10 max-w-md mx-4">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-white mb-4">课程不存在</h2>
          <p className="text-gray-400 mb-6">抱歉，您访问的课程不存在或已下架</p>
          <button
            onClick={() => navigate('/training')}
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl hover:from-violet-400 hover:to-purple-400 transition-all shadow-lg shadow-violet-500/20"
          >
            返回培训学院
          </button>
        </GlassCard>
      </div>
    )
  }

  const coverImg = course.coverImage || coverImages[course.category] || coverImages.shortvideo

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleEnroll = () => {
    if (!isLoggedIn) {
      showToast('请先登录')
      setTimeout(() => navigate('/login'), 1500)
      return
    }
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    setEnrolled(true)
    showToast('🎉 购买成功！开始学习吧')
  }

  const handleTrial = () => {
    if (enrolled) {
      // 已购买，直接跳转到播放器
      navigate(`/course/${course.id}`)
    } else {
      // 免费试看第一课
      setCurrentPlayingLesson({ chapterIdx: 0, lessonIdx: 0 })
      setShowVideoPlayer(true)
    }
  }

  const handleFollow = () => {
    setFollowed(!followed)
    showToast(followed ? '已取消关注' : '关注成功！')
  }

  const toggleChapter = (index) => {
    setExpandedChapters(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const handleLessonClick = (ci, li) => {
    if (!enrolled) {
      // 未购买，只能试看
      const lesson = course.chapters[ci]?.lessons?.[li]
      const isFree = typeof lesson === 'object' ? lesson.isFree : false
      if (!isFree) {
        showToast('📖 请先购买课程解锁完整内容')
        return
      }
    }
    setCurrentPlayingLesson({ chapterIdx: ci, lessonIdx: li })
    setShowVideoPlayer(true)
  }

  const handleVideoProgress = (time) => {
    if (course && course.id) {
      saveLessonProgress(course.id, currentPlayingLesson.chapterIdx, currentPlayingLesson.lessonIdx, time)
    }
  }

  const levelClass = course.level === '入门' ? 'bg-green-500/20 text-green-400 border-green-500/30' 
    : course.level === '进阶' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'

  const currentLessonTitle = course.chapters[currentPlayingLesson.chapterIdx]?.lessons?.[currentPlayingLesson.lessonIdx] || '课程内容'
  const savedTime = course && course.id ? getLessonProgress(course.id, currentPlayingLesson.chapterIdx, currentPlayingLesson.lessonIdx) : 0

  return (
    <div className="bg-slate-900 relative">
      <FloatingOrbs />
      
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-green-500/90 backdrop-blur-md text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 animate-bounce">
          {toast}
        </div>
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={course}
        onSuccess={handlePaymentSuccess}
      />

      {/* 视频播放器弹窗 */}
      {showVideoPlayer && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white">
                <span className="text-gray-400">{course.chapters[currentPlayingLesson.chapterIdx]?.title} - </span>
                <span className="font-semibold">{typeof currentLessonTitle === 'string' ? currentLessonTitle : currentLessonTitle.title}</span>
              </div>
              <button 
                onClick={() => setShowVideoPlayer(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                ✕
              </button>
            </div>
            <VideoPlayer
              videoUrl={DEMO_VIDEO}
              poster={coverImg}
              onProgress={handleVideoProgress}
              initialTime={savedTime}
              catMeta={catMeta}
              chapterIdx={currentPlayingLesson.chapterIdx}
              lessonIdx={currentPlayingLesson.lessonIdx}
            />
            {/* 播放控制说明 */}
            <div className="mt-4 text-center text-gray-500 text-sm space-x-4">
              <span>空格键: 播放/暂停</span>
              <span>← →: 快退/快进10秒</span>
              <span>↑ ↓: 调节音量</span>
              <span>F: 全屏</span>
            </div>
          </div>
        </div>
      )}

      {/* 面包屑导航 */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">首页</Link>
          <ChevronRight size={14} />
          <Link to="/training" className="hover:text-white transition-colors">全部课程</Link>
          <ChevronRight size={14} />
          <span className="text-white truncate max-w-[200px]">{course.title}</span>
        </div>
      </div>

      {/* 顶部导航 */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button 
            onClick={() => navigate('/training')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-semibold truncate">{course.title}</h1>
          </div>
          <Link 
            to="/training"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white text-sm transition-all"
          >
            全部课程
          </Link>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧 - 课程信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 视频封面区 - 点击可试看 */}
            <GlassCard className="overflow-hidden" hover={false}>
              <div className="relative aspect-video cursor-pointer group" onClick={handleTrial}>
                <img src={coverImg} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${catMeta.gradient} flex items-center justify-center shadow-2xl ${catMeta.glow} group-hover:scale-110 transition-transform duration-300`}>
                    <Play size={36} color="#fff" style={{ marginLeft: 4 }} />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${catMeta.gradient} text-white text-sm font-medium shadow-lg`}>
                    <span>{catMeta.icon}</span>
                    <span>{categoryNames[course.category]}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {enrolled ? (
                    <span className="px-3 py-1 bg-green-500/90 text-white text-sm font-medium rounded-full flex items-center gap-1.5">
                      <CheckCircle size={14} /> 已购买
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-500/90 text-white text-sm font-medium rounded-full animate-pulse">
                      🔥 限时优惠
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* 课程信息卡片 */}
            <GlassCard className="p-6">
              {/* 标签 */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${levelClass}`}>
                  {course.level}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${catMeta.light} ${catMeta.text} border ${catMeta.border}`}>
                  {catMeta.icon} {categoryNames[course.category]}
                </span>
                {course.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded-full border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>

              {/* 标题 */}
              <h1 className="text-3xl font-bold text-white mb-3">{course.title}</h1>
              <p className="text-gray-400 text-lg mb-6">{course.subtitle}</p>

              {/* 统计信息 */}
              <div className="grid grid-cols-5 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{course.students?.toLocaleString()}</div>
                  <div className="text-gray-500 text-xs">学习人数</div>
                </div>
                <div className="text-center">
                  <div className="text-amber-400 font-bold text-lg flex items-center justify-center gap-1">
                    <Star size={16} fill="#fbbf24" /> {course.rating}
                  </div>
                  <div className="text-gray-500 text-xs">课程评分</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{course.reviews}</div>
                  <div className="text-gray-500 text-xs">评价数量</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{course.lessons}</div>
                  <div className="text-gray-500 text-xs">课程课时</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{course.duration}</div>
                  <div className="text-gray-500 text-xs">总时长</div>
                </div>
              </div>
            </GlassCard>

            {/* Tab切换 */}
            <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab('outline')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'outline'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                📚 课程大纲
              </button>
              <button
                onClick={() => setActiveTab('intro')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'intro'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                ℹ️ 课程介绍
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                ⭐ 学员评价
              </button>
              <button
                onClick={() => setActiveTab('path')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'path'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                🛤️ 学习路径
              </button>
            </div>

            {/* Tab内容 */}
            {activeTab === 'outline' && (
              <div className="space-y-3">
                {(course.chapters || []).map((chapter, ci) => (
                  <GlassCard key={ci} className="overflow-hidden" hover={false}>
                    <div 
                      className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => toggleChapter(ci)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${catMeta.gradient} flex items-center justify-center text-white font-bold shadow-lg ${catMeta.glow}`}>
                            {ci + 1}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{chapter.title}</h3>
                            <p className="text-gray-500 text-sm">{(chapter.lessons || []).length} 课时</p>
                          </div>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 transition-transform duration-300 ${expandedChapters[ci] ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                    
                    {expandedChapters[ci] && (
                      <div className="border-t border-white/10">
                        {(chapter.lessons || []).map((lesson, li) => {
                          const lessonTitle = typeof lesson === 'string' ? lesson : (lesson.title || `第${li + 1}课`)
                          const isFree = typeof lesson === 'object' ? lesson.isFree : false
                          const isCompleted = course && course.id ? isLessonCompleted(course.id, ci, li) : false
                          const canPlay = enrolled || isFree
                          
                          return (
                            <div 
                              key={li} 
                              className={`flex items-center gap-3 px-4 py-3 transition-colors border-b border-white/5 last:border-b-0 ${canPlay ? 'hover:bg-white/5 cursor-pointer' : ''}`}
                              onClick={() => handleLessonClick(ci, li)}
                            >
                              <span className="text-gray-500">
                                {isCompleted ? (
                                  <CheckCircle size={16} className="text-green-400" />
                                ) : canPlay ? (
                                  <Play size={16} className="text-violet-400" />
                                ) : (
                                  <Lock size={16} />
                                )}
                              </span>
                              <span className={`flex-1 text-sm ${canPlay ? 'text-gray-300 hover:text-white' : 'text-gray-500'}`}>
                                {lessonTitle}
                              </span>
                              {isFree && !enrolled && (
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">免费试看</span>
                              )}
                              {isCompleted && (
                                <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs rounded-full">已学完</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </GlassCard>
                ))}
                
                {(!course.chapters || course.chapters.length === 0) && (
                  <GlassCard className="p-12 text-center">
                    <div className="text-5xl mb-4">📖</div>
                    <p className="text-gray-400">暂无课程大纲</p>
                  </GlassCard>
                )}
              </div>
            )}

            {activeTab === 'intro' && (
              <GlassCard className="p-6" hover={false}>
                <h3 className="text-xl font-bold text-white mb-4">课程介绍</h3>
                
                {/* 如果有content字段，渲染图文内容 */}
                {course.content ? (
                  <RichContent content={course.content} />
                ) : (
                  /* 默认介绍内容 */
                  <>
                    <p className="text-gray-400 leading-relaxed mb-6">{course.subtitle}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">🎯</div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">零基础到实战</h4>
                          <p className="text-gray-400 text-sm">从入门到精通，掌握核心技能</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-violet-500/20">🚀</div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">AI工具全流程</h4>
                          <p className="text-gray-400 text-sm">效率提升10倍，快速产出内容</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">💼</div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">商业变现路径</h4>
                          <p className="text-gray-400 text-sm">掌握接单技巧，实现副业增收</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-green-500/20">🏆</div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">结业证书</h4>
                          <p className="text-gray-400 text-sm">获得行业认证，提升竞争力</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </GlassCard>
            )}

            {/* 学员评价 Tab */}
            {activeTab === 'reviews' && (
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">学员评价</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-amber-400">{course.rating}</span>
                    <StarRating rating={Math.floor(course.rating)} size={20} />
                    <span className="text-gray-500 text-sm">({course.reviews}条)</span>
                  </div>
                </div>
                
                {/* 评分分布 */}
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {[5, 4, 3, 2, 1].map(star => {
                    const percent = star === 5 ? 75 : star === 4 ? 20 : star === 3 ? 3 : star === 2 ? 1 : 1
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs w-4">{star}星</span>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* 评价标签筛选 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-violet-500/20 text-violet-300 text-sm rounded-full border border-violet-500/30">
                    全部评价
                  </span>
                  <span className="px-3 py-1 bg-white/5 text-gray-400 text-sm rounded-full border border-white/10 hover:border-white/20 cursor-pointer">
                    入门友好
                  </span>
                  <span className="px-3 py-1 bg-white/5 text-gray-400 text-sm rounded-full border border-white/10 hover:border-white/20 cursor-pointer">
                    实操性强
                  </span>
                  <span className="px-3 py-1 bg-white/5 text-gray-400 text-sm rounded-full border border-white/10 hover:border-white/20 cursor-pointer">
                    变现快
                  </span>
                </div>

                {/* 评价列表 */}
                <div className="space-y-4">
                  {(courseReviews[course.id] || defaultReviews).map(review => (
                    <ReviewCard key={review.id} review={review} catMeta={catMeta} />
                  ))}
                </div>

                {/* 更多评价提示 */}
                <div className="mt-6 text-center text-gray-500 text-sm">
                  展示 {Math.min((courseReviews[course.id] || defaultReviews).length, 3)}/{course.reviews} 条评价
                </div>
              </GlassCard>
            )}

            {/* 学习路径 Tab */}
            {activeTab === 'path' && (
              <GlassCard className="p-6" hover={false}>
                <LearningPath 
                  path={learningPaths[course.category] || defaultPath} 
                  currentCourseId={course.id}
                />
                
                {/* 推荐搭配课程 */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-white font-semibold mb-4">📖 推荐搭配学习</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {allCourses
                      .filter(c => c.category === course.category && c.id !== course.id)
                      .slice(0, 2)
                      .map(c => (
                        <div 
                          key={c.id}
                          onClick={() => navigate(`/course/${c.id}`)}
                          className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${categoryMeta[c.category]?.gradient || 'from-violet-500 to-purple-500'} flex items-center justify-center text-white text-xs font-bold`}>
                              {c.level?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm font-medium truncate">{c.title}</div>
                              <div className="text-gray-500 text-xs">¥{c.price}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 group-hover:text-violet-400 transition-colors">
                            点击查看 →
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* 右侧 - 讲师和购买 */}
          <div className="space-y-6">
            {/* 讲师卡片 */}
            <GlassCard className="overflow-hidden" hover={false}>
              <div className={`h-2 w-full bg-gradient-to-r ${catMeta.gradient}`}></div>
              <div className="p-6">
                {/* 讲师信息 */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${catMeta.gradient} flex items-center justify-center text-2xl font-bold text-white shadow-lg ${catMeta.glow}`}>
                    {course.teacher?.avatar || '👨‍🏫'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{course.teacher?.name || '未知讲师'}</h3>
                    <p className="text-gray-400 text-sm">{course.teacher?.title || '专业讲师'}</p>
                    <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                      <CheckCircle size={12} /> 已认证创作者
                    </div>
                  </div>
                </div>

                {/* 简介 */}
                <div className="mb-6">
                  <h4 className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">个人简介</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{course.teacher?.bio || '专注AI内容创作与教学'}</p>
                </div>

                {/* 粉丝统计 */}
                <div className="mb-6">
                  <h4 className="text-gray-400 text-xs font-medium mb-3 uppercase tracking-wider">全网粉丝</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📺</span>
                        <div>
                          <div className="text-white text-sm font-medium">抖音</div>
                          {course.teacher?.douyinId && (
                            <div className="text-gray-500 text-xs">@{course.teacher.douyinId}</div>
                          )}
                        </div>
                      </div>
                      <span className="text-cyan-400 font-bold">{course.teacher?.douyinFans || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💚</span>
                        <div>
                          <div className="text-white text-sm font-medium">视频号</div>
                          {course.teacher?.wechatId && (
                            <div className="text-gray-500 text-xs">@{course.teacher.wechatId}</div>
                          )}
                        </div>
                      </div>
                      <span className="text-green-400 font-bold">{course.teacher?.wechatFans || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📕</span>
                        <div>
                          <div className="text-white text-sm font-medium">小红书</div>
                          {course.teacher?.xiaohongshuId && (
                            <div className="text-gray-500 text-xs">@{course.teacher.xiaohongshuId}</div>
                          )}
                        </div>
                      </div>
                      <span className="text-pink-400 font-bold">{course.teacher?.xiaohongshuFans || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* 关注按钮 */}
                <button 
                  onClick={handleFollow}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    followed 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' 
                      : `bg-gradient-to-r ${catMeta.gradient} text-white shadow-lg hover:shadow-xl ${catMeta.glow}`
                  }`}
                >
                  {followed ? <><Check size={18} /> 已关注</> : <><UserPlus size={18} /> 关注讲师</>}
                </button>
              </div>
            </GlassCard>

            {/* 价格卡片 */}
            <GlassCard className="p-6" hover={false}>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-4xl font-bold text-white">¥{course.price}</span>
                  {course.originalPrice > 0 && (
                    <span className="text-xl text-gray-500 line-through">¥{course.originalPrice}</span>
                  )}
                </div>
                {course.originalPrice > 0 && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full">
                    <Zap size={14} /> 限时5折优惠
                  </div>
                )}
              </div>

              {/* 购买按钮 */}
              {enrolled ? (
                <button 
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 hover:from-green-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <Play size={20} /> 继续学习
                </button>
              ) : (
                <button 
                  onClick={handleEnroll}
                  className={`w-full py-4 bg-gradient-to-r ${catMeta.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl ${catMeta.glow} transition-all flex items-center justify-center gap-2 mb-3`}
                >
                  <Award size={20} /> 立即购买
                </button>
              )}

              <button 
                onClick={handleTrial}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {enrolled ? '免费试看' : '🆓 免费试看第一课'}
              </button>

              {/* VIP优惠提示 */}
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-amber-400 text-sm">
                  <Zap size={16} />
                  <span>VIP会员享8折优惠，再减¥{Math.round(course.price * 0.2)}</span>
                </div>
              </div>

              {/* 服务保障 */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <CheckCircle size={14} className="text-green-400" />
                  <span>永久观看，随时学习</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <CheckCircle size={14} className="text-green-400" />
                  <span>专业答疑辅导</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <CheckCircle size={14} className="text-green-400" />
                  <span>专属学习社群</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* 底部安全区 */}
      <div className="h-24"></div>
    </div>
  )
}
