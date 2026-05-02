import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, ChevronRight, Menu, X, CheckCircle, Lock
} from 'lucide-react'
import { allCourses as courses } from '../../data/unifiedCourses'

// 分类颜色配置
const categoryMeta = {
  video: { gradient: 'from-orange-500 to-amber-600', text: 'text-orange-400' },
  film: { gradient: 'from-cyan-500 to-blue-600', text: 'text-cyan-400' },
  designer: { gradient: 'from-emerald-500 to-teal-600', text: 'text-emerald-400' },
  drama: { gradient: 'from-pink-500 to-rose-600', text: 'text-pink-400' },
  travel: { gradient: 'from-green-500 to-emerald-600', text: 'text-green-400' },
  mangadrama: { gradient: 'from-pink-500 to-rose-600', text: 'text-pink-400' },
  commerce: { gradient: 'from-yellow-500 to-orange-500', text: 'text-yellow-400' },
}

// 示例视频URL（可替换为真实视频源）
const DEMO_VIDEO = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

// ============ 本地进度管理 ============
const STORAGE_KEY = 'course_progress_v3'
const getProgress = () => { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : {} } catch { return {} } }
const saveProgress = (courseId, chapterIdx, lessonIdx) => {
  const p = getProgress()
  if (!p[courseId]) p[courseId] = { chapters: {} }
  p[courseId].chapters[chapterIdx + '-' + lessonIdx] = true
  p[courseId].current = { chapter: chapterIdx, lesson: lessonIdx }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}
const isDone = (courseId, chapterIdx, lessonIdx) => {
  const p = getProgress()
  return !!(p[courseId]?.chapters?.[chapterIdx + '-' + lessonIdx])
}
const getCourseProgress = (courseId, totalLessons) => {
  const p = getProgress()
  if (!p[courseId]) return 0
  return Math.round((Object.values(p[courseId].chapters || {}).filter(Boolean).length / totalLessons) * 100)
}
const isEnrolled = (courseId) => {
  const purchased = JSON.parse(localStorage.getItem('purchasedCourses') || '[]')
  return purchased.includes(String(courseId)) || localStorage.getItem('enrolled_' + courseId) === 'true'
}
const enrollCourse = (courseId) => {
  localStorage.setItem('enrolled_' + courseId, 'true')
  const p = getProgress()
  if (!p[courseId]) p[courseId] = { chapters: {} }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
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

export default function CoursePlayer() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const course = courses.find(c => String(c.id) === String(courseId))
  
  const [enrolled, setEnrolled] = useState(false)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [toast, setToast] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // 播放器状态
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [showChapterOverlay, setShowChapterOverlay] = useState(false)
  const [chapterOverlayPos, setChapterOverlayPos] = useState({ x: 20, y: 20, dragging: false })
  
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const controlsTimer = useRef(null)
  const catMeta = categoryMeta[course?.category] || categoryMeta.video

  // 加载数据
  useEffect(() => {
    if (course) {
      setEnrolled(isEnrolled(course.id))
      const p = getProgress()
      if (p[course.id]?.current) {
        setCurrentChapter(p[course.id].current.chapter)
        setCurrentLesson(p[course.id].current.lesson)
      }
    }
  }, [course])

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
        case 'KeyM':
          setIsMuted(m => !m)
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleEnroll = () => {
    enrollCourse(course.id)
    setEnrolled(true)
    showToast('🎉 购买成功！开始学习吧')
  }

  const handleLessonSelect = (ci, li) => {
    setCurrentChapter(ci)
    setCurrentLesson(li)
    setIsPlaying(false)
    setCurrentTime(0)
    saveProgress(course.id, ci, li)
  }

  const handleComplete = () => {
    saveProgress(course.id, currentChapter, currentLesson)
    showToast('✅ 已完成本课时！')
    const chapters = course.chapters
    if (currentLesson + 1 < chapters[currentChapter].lessons.length) {
      handleLessonSelect(currentChapter, currentLesson + 1)
    } else if (currentChapter + 1 < chapters.length) {
      handleLessonSelect(currentChapter + 1, 0)
      showToast('📖 进入下一章：' + chapters[currentChapter + 1].title)
    } else {
      showToast('🎊 恭喜！本课程全部学完！')
    }
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

  // 拖拽课程大纲浮窗
  const handleOverlayMouseDown = (e) => {
    setChapterOverlayPos({ ...chapterOverlayPos, dragging: true, startX: e.clientX, startY: e.clientY })
  }

  const handleOverlayMouseMove = (e) => {
    if (chapterOverlayPos.dragging) {
      setChapterOverlayPos(prev => ({
        ...prev,
        x: prev.x + e.clientX - prev.startX,
        y: prev.y + e.clientY - prev.startY,
        startX: e.clientX,
        startY: e.clientY
      }))
    }
  }

  const handleOverlayMouseUp = () => {
    setChapterOverlayPos({ ...chapterOverlayPos, dragging: false })
  }

  if (!course) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl text-white mb-4">课程不存在</h2>
        <button 
          onClick={() => navigate('/training')} 
          className="px-6 py-3 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-400 transition-colors"
        >
          返回培训学院
        </button>
      </div>
    </div>
  )

  const coverImages = {
    video: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&h=675&fit=crop',
    film: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=675&fit=crop',
    designer: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=675&fit=crop',
    drama: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=675&fit=crop',
    travel: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=675&fit=crop',
    mangadrama: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=1200&h=675&fit=crop',
    commerce: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=675&fit=crop',
  }

  const coverImg = coverImages[course.category] || coverImages.video
  const lessonTitle = course.chapters[currentChapter]?.lessons[currentLesson] || ''
  const chapterTitle = course.chapters[currentChapter]?.title || ''
  const coursePct = getCourseProgress(course.id, course.lessons)
  const totalDone = Object.values(getProgress()[course.id]?.chapters || {}).filter(Boolean).length

  return (
    <div 
      className="min-h-screen bg-slate-900 text-white relative"
      onMouseMove={handleOverlayMouseMove}
      onMouseUp={handleOverlayMouseUp}
    >
      <FloatingOrbs />
      
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-green-500/90 backdrop-blur-md text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 animate-bounce">
          {toast}
        </div>
      )}

      {/* 顶部导航 */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button 
            onClick={() => navigate('/training/course/' + course.id)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-semibold truncate">{course.title}</h1>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all" style={{ width: coursePct + '%' }}></div>
            </div>
            <span className="text-gray-400 text-sm">{coursePct}%</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(s => !s)} 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
            title="切换目录"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 主内容 */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto relative z-10">
        {/* 视频区域 */}
        <div className="flex-1" ref={playerRef}>
          {/* 视频播放器 */}
          <div 
            className="relative bg-black aspect-video"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            {enrolled ? (
              <>
                <video
                  ref={videoRef}
                  src={DEMO_VIDEO}
                  className="w-full h-full"
                  poster={coverImg}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => {
                    setIsPlaying(false)
                    handleComplete()
                  }}
                  onClick={togglePlay}
                />
                
                {/* 视频封面（未播放时显示） */}
                {!isPlaying && (
                  <div 
                    className="absolute inset-0 cursor-pointer"
                    onClick={togglePlay}
                    style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${catMeta.gradient} flex items-center justify-center shadow-2xl hover:scale-110 transition-transform`}>
                        <Play size={36} fill="white" className="text-white ml-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 控制栏 */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                  {/* 进度条 */}
                  <div 
                    className="h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group"
                    onClick={handleSeek}
                  >
                    <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* 播放/暂停 */}
                      <button onClick={togglePlay} className="text-white hover:text-violet-400 transition-colors">
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                      </button>
                      
                      {/* 快退/快进 */}
                      <button onClick={() => skip(-10)} className="text-white hover:text-violet-400 transition-colors">
                        <SkipBack size={20} />
                      </button>
                      <button onClick={() => skip(10)} className="text-white hover:text-violet-400 transition-colors">
                        <SkipForward size={20} />
                      </button>

                      {/* 音量 */}
                      <div className="flex items-center gap-2 group">
                        <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-violet-400 transition-colors">
                          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-0 group-hover:w-20 transition-all duration-300 accent-violet-500"
                        />
                      </div>

                      {/* 时间 */}
                      <span className="text-white/80 text-sm">
                        {formatTime(currentTime)} / {formatTime(duration || course.duration * 60)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* 课程大纲浮窗开关 */}
                      <button 
                        onClick={() => setShowChapterOverlay(!showChapterOverlay)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          showChapterOverlay 
                            ? 'bg-violet-500 text-white' 
                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                        title="课程大纲"
                      >
                        📋 大纲
                      </button>

                      {/* 倍速 */}
                      <div className="relative">
                        <button 
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
                        >
                          {playbackRate}x
                        </button>
                        {showSpeedMenu && (
                          <div className="absolute bottom-full right-0 mb-2 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                              <button
                                key={rate}
                                onClick={() => handleSpeedChange(rate)}
                                className={`w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${
                                  playbackRate === rate ? 'bg-violet-500/30 text-violet-400' : 'text-white'
                                }`}
                              >
                                {rate}x {rate === 1 && '(正常)'}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 全屏 */}
                      <button onClick={toggleFullscreen} className="text-white hover:text-violet-400 transition-colors">
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* 未购买状态 */
              <div className="absolute inset-0">
                <img src={coverImg} alt="" className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center flex-col gap-4">
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-4xl">🔒</div>
                  <h2 className="text-xl text-white font-semibold text-center max-w-md">购买课程后即可观看全部内容</h2>
                  <p className="text-gray-400">包含 {course.lessons} 课时 · {course.duration}</p>
                  <button 
                    onClick={handleEnroll} 
                    className={`mt-2 px-8 py-3 bg-gradient-to-r ${catMeta.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all`}
                  >
                    ¥{course.price} 立即购买
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 课程信息 */}
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${catMeta.gradient} text-white`}>
                {course.level}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-white/5 text-gray-400 border border-white/10">
                {chapterTitle}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">{lessonTitle}</h1>
            <p className="text-gray-400 mb-6">第 {currentChapter + 1} 章第 {currentLesson + 1} 课 · 共 {course.lessons} 课时</p>

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3">
              {enrolled && (
                <>
                  <button 
                    onClick={togglePlay}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      isPlaying 
                        ? 'bg-red-500 hover:bg-red-400 text-white' 
                        : `bg-gradient-to-r ${catMeta.gradient} hover:shadow-lg text-white`
                    }`}
                  >
                    {isPlaying ? <><Pause size={18} /> 暂停</> : <><Play size={18} /> 播放课程</>}
                  </button>
                  <button 
                    onClick={handleComplete}
                    className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                  >
                    <CheckCircle size={18} /> 标记已完成
                  </button>
                </>
              )}
            </div>

            {/* 学习进度 */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">学习进度</span>
                <span className="text-violet-400 font-semibold">{totalDone}/{course.lessons} 课时已完成</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all" style={{ width: coursePct + '%' }}></div>
              </div>
            </div>

            {/* 课程简介 */}
            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-2">课程简介</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">{course.subtitle}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>👤 {course.teacher?.name || '讲师'}</span>
                <span>⭐ {course.rating}分</span>
                <span>📚 {course.lessons}课时</span>
                <span>⏱ {course.duration}</span>
              </div>
            </div>

            {/* 上下课 */}
            <div className="flex justify-between mt-6 gap-4">
              <button 
                onClick={() => { if (currentLesson > 0) handleLessonSelect(currentChapter, currentLesson - 1); else if (currentChapter > 0) handleLessonSelect(currentChapter - 1, course.chapters[currentChapter - 1].lessons.length - 1) }}
                disabled={currentChapter === 0 && currentLesson === 0}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                ← 上一课
              </button>
              <button 
                onClick={() => { if (currentLesson + 1 < course.chapters[currentChapter].lessons.length) handleLessonSelect(currentChapter, currentLesson + 1); else if (currentChapter + 1 < course.chapters.length) handleLessonSelect(currentChapter + 1, 0) }}
                disabled={currentChapter === course.chapters.length - 1 && currentLesson === course.chapters[currentChapter].lessons.length - 1}
                className="px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                下一课 →
              </button>
            </div>
          </div>
        </div>

        {/* 课程目录侧边栏 */}
        {sidebarOpen && (
          <div className="w-full lg:w-80 bg-slate-900/80 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/10 lg:max-h-[calc(100vh-56px)] lg:sticky lg:top-14 overflow-y-auto">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-semibold">课程目录</h3>
              <p className="text-gray-500 text-sm">{course.chapters.length}章 · {course.lessons}课时</p>
            </div>
            {course.chapters.map((chapter, ci) => (
              <div key={ci} className="border-b border-white/5">
                <div 
                  className={`p-3 px-4 border-l-2 ${
                    currentChapter === ci ? 'bg-violet-500/10 border-violet-500' : 'border-transparent'
                  }`}
                >
                  <p className={`text-sm font-medium ${currentChapter === ci ? 'text-violet-400' : 'text-gray-400'}`}>
                    {chapter.title}
                  </p>
                </div>
                {chapter.lessons.map((lesson, li) => {
                  const done = isDone(course.id, ci, li)
                  const active = currentChapter === ci && currentLesson === li
                  return (
                    <div 
                      key={li} 
                      onClick={() => enrolled && handleLessonSelect(ci, li)}
                      className={`p-3 pl-8 cursor-pointer transition-colors flex items-center gap-3 ${
                        enrolled ? 'hover:bg-white/5' : ''
                      } ${active ? 'bg-violet-500/15' : ''}`}
                    >
                      <span className={`text-xs w-5 text-center ${done ? 'text-green-400' : active ? 'text-violet-400' : 'text-gray-600'}`}>
                        {done ? '✓' : li + 1}
                      </span>
                      <span className={`text-sm flex-1 line-clamp-1 ${active ? 'text-white' : done ? 'text-gray-500' : 'text-gray-400'}`}>
                        {lesson}
                      </span>
                      {active && <Play size={12} className="text-violet-400" />}
                    </div>
                  )
                })}
              </div>
            ))}
            <div className="h-8"></div>
          </div>
        )}
      </div>

      {/* 全屏时悬浮课程大纲 */}
      {isFullscreen && showChapterOverlay && (
        <div 
          className="fixed bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
          style={{ 
            left: `${Math.min(chapterOverlayPos.x, window.innerWidth - 320)}px`, 
            top: `${Math.max(chapterOverlayPos.y, 60)}px`,
            width: 300,
            maxHeight: 'calc(100vh - 120px)'
          }}
          onMouseDown={handleOverlayMouseDown}
        >
          <div className="p-3 bg-slate-800/80 border-b border-white/10 flex items-center justify-between cursor-move">
            <span className="text-white font-semibold text-sm">课程大纲</span>
            <button 
              onClick={() => setShowChapterOverlay(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[400px]">
            {course.chapters.map((chapter, ci) => (
              <div key={ci}>
                <div className={`p-2 px-3 text-xs font-medium ${currentChapter === ci ? 'bg-violet-500/20 text-violet-400' : 'text-gray-500'}`}>
                  {ci + 1}. {chapter.title}
                </div>
                {chapter.lessons.map((lesson, li) => {
                  const done = isDone(course.id, ci, li)
                  const active = currentChapter === ci && currentLesson === li
                  return (
                    <div 
                      key={li}
                      onClick={() => {
                        handleLessonSelect(ci, li)
                        setShowChapterOverlay(false)
                      }}
                      className={`p-2 px-4 cursor-pointer flex items-center gap-2 text-sm ${
                        active ? 'bg-violet-500/20 text-white' : 'hover:bg-white/5 text-gray-400'
                      }`}
                    >
                      <span className={`w-4 text-center text-xs ${done ? 'text-green-400' : active ? 'text-violet-400' : 'text-gray-600'}`}>
                        {done ? '✓' : li + 1}
                      </span>
                      <span className="flex-1 line-clamp-1">{lesson}</span>
                      {active && <Play size={10} className="text-violet-400" />}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 视频上悬浮半透明课程内容（全屏时） */}
      {isFullscreen && (
        <div 
          className="fixed bottom-20 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 pointer-events-auto z-40"
          onMouseEnter={() => setShowControls(true)}
        >
          <div className="flex items-center gap-4 text-sm">
            <span className="text-violet-400 font-semibold">
              {course.chapters[currentChapter]?.title}
            </span>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-white">{lessonTitle}</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ta { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .animate-bounce { animation: ta 0.3s ease; }
        /* 全屏时隐藏滚动条 */
        :fullscreen::-webkit-scrollbar { display: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
      `}</style>
    </div>
  )
}
