import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { allCourses as courses } from '../../data/unifiedCourses'

// 课程分类映射（支持新旧两套分类键）
const categoryMap = {
  // 新统一分类键
  'video': 'AI视频', 'film': 'AI广告电影', 'designer': 'AI设计师',
  'drama': 'AI短剧', 'travel': 'AI文旅', 'mangadrama': 'AI漫剧',
  'commerce': 'AI带货变现',
  // 旧分类键（向后兼容）
  'shortvideo': 'AI视频', 'shortdrama': 'AI短剧',
  'film': 'AI广告电影', 'designer': 'AI设计师', 'commerce': 'AI带货变现'
}

const categoryColorMap = {
  // 新统一分类键
  'video': '#f97316', 'film': '#0891b2', 'designer': '#059669',
  'drama': '#ec4899', 'travel': '#10b981', 'mangadrama': '#db2777',
  'commerce': '#d97706',
  // 旧分类键（向后兼容）
  'shortvideo': '#0891b2', 'shortdrama': '#7c3aed',
  'film': '#ea580c', 'designer': '#059669', 'commerce': '#d97706'
}

// 从localStorage获取用户已购课程和学习进度
const getPurchasedCourses = () => {
  try {
    const purchased = JSON.parse(localStorage.getItem('purchasedCourses') || '[]')
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]')
    const learningProgress = JSON.parse(localStorage.getItem('learningProgress') || '{}')
    
    // 合并purchasedCourses和userOrders中的课程
    const courseIds = new Set(purchased)
    userOrders.forEach(order => {
      if (order.courseId) courseIds.add(order.courseId)
    })
    
    // 将课程ID转换为完整课程数据
    return Array.from(courseIds).map(courseId => {
      const course = courses.find(c => c.id === courseId || c.id === parseInt(courseId))
      if (!course) return null
      
      // 获取学习进度
      const progress = learningProgress[courseId] || { percent: 0, completedLessons: 0, lastStudy: '' }
      
      return {
        id: course.id,
        title: course.title,
        category: categoryMap[course.category] || course.category,
        categoryColor: categoryColorMap[course.category] || '#8b5cf6',
        progress: progress.percent || 0,
        totalLessons: course.lessons || course.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 20,
        completedLessons: progress.completedLessons || 0,
        thumbnail: course.coverImage || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=250&fit=crop',
        lastStudy: progress.lastStudy || '',
        certificate: progress.percent === 100,
        teacher: course.teacher?.name || '平台讲师',
        level: course.level || '入门'
      }
    }).filter(Boolean)
  } catch (e) {
    console.error('获取已购课程失败:', e)
    return []
  }
}

// 推荐课程数据（当用户没有购买任何课程时显示推荐）
const recommendedCourses = [
  {
    id: 101,
    title: 'AI短视频入门：即梦·可灵·Pika 从零到上手',
    category: 'AI短视频',
    categoryColor: '#0891b2',
    progress: 0,
    totalLessons: 20,
    completedLessons: 0,
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=250&fit=crop',
    lastStudy: '',
    certificate: false,
    teacher: '林小影',
    level: '入门',
    isRecommended: true
  },
  {
    id: 201,
    title: 'AI短剧入门：剧本创作·AI生成·首部短剧',
    category: 'AI短剧',
    categoryColor: '#7c3aed',
    progress: 0,
    totalLessons: 24,
    completedLessons: 0,
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=250&fit=crop',
    lastStudy: '',
    certificate: false,
    teacher: '周编剧',
    level: '入门',
    isRecommended: true
  },
  {
    id: 301,
    title: 'AI漫剧入门：漫画分镜·AI绘图·动态漫画',
    category: 'AI漫剧',
    categoryColor: '#db2777',
    progress: 0,
    totalLessons: 20,
    completedLessons: 0,
    thumbnail: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=400&h=250&fit=crop',
    lastStudy: '',
    certificate: false,
    teacher: '漫小七',
    level: '入门',
    isRecommended: true
  },
  {
    id: 401,
    title: 'AI电影入门：剧本·分镜·AI生图·首部微电影',
    category: 'AI电影',
    categoryColor: '#ea580c',
    progress: 0,
    totalLessons: 28,
    completedLessons: 0,
    thumbnail: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=250&fit=crop',
    lastStudy: '',
    certificate: false,
    teacher: '电影小白',
    level: '入门',
    isRecommended: true
  },
  {
    id: 501,
    title: 'AI设计师入门：Logo·品牌视觉·Midjourney商业设计',
    category: 'AI设计师',
    categoryColor: '#059669',
    progress: 0,
    totalLessons: 24,
    completedLessons: 0,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    lastStudy: '',
    certificate: false,
    teacher: '设计小美',
    level: '入门',
    isRecommended: true
  },
  {
    id: 601,
    title: 'AI带货入门：短视频带货底层逻辑·AI快速起号',
    category: 'AI带货变现',
    categoryColor: '#d97706',
    progress: 0,
    totalLessons: 20,
    completedLessons: 0,
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
    lastStudy: '',
    certificate: false,
    teacher: '带货达人',
    level: '入门',
    isRecommended: true
  }
]

// 6大类型导航数据
const categories = [
  { name: '全部', icon: '🌐', color: '#8b5cf6' },
  { name: 'AI短视频', icon: '🎬', color: '#0891b2' },
  { name: 'AI短剧', icon: '🎭', color: '#7c3aed' },
  { name: 'AI漫剧', icon: '📚', color: '#db2777' },
  { name: 'AI电影', icon: '🎥', color: '#ea580c' },
  { name: 'AI设计师', icon: '🎨', color: '#059669' },
  { name: 'AI带货变现', icon: '💰', color: '#d97706' }
]

// 6大类型学习路径
const learningPaths = [
  { name: 'AI短视频', icon: '🎬', color: '#0891b2', steps: ['入门：AI工具基础', '进阶：高阶运镜特效', '专业：批量化生产'] },
  { name: 'AI短剧', icon: '🎭', color: '#7c3aed', steps: ['入门：剧本+AI生成', '进阶：多集+配音', '专业：IP孵化变现'] },
  { name: 'AI漫剧', icon: '📚', color: '#db2777', steps: ['入门：漫画分镜', '进阶：商业漫剧签约', '专业：IP全体系商业化'] },
  { name: 'AI电影', icon: '🎥', color: '#ea580c', steps: ['入门：剧本+微电影', '进阶：专业特效参赛', '专业：AI长片商业制作'] },
  { name: 'AI设计师', icon: '🎨', color: '#059669', steps: ['入门：Logo+品牌VI', '进阶：UI+电商详情', '专业：全案+设计创业'] },
  { name: 'AI带货变现', icon: '💰', color: '#d97706', steps: ['入门：底层逻辑+AI起号', '进阶：选品+批量制作', '专业：团队+直播+百万'] }
]

export default function Learning() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('in-progress')
  const [activeCategory, setActiveCategory] = useState('全部')
  const [toast, setToast] = useState(null)
  const [learningCourses, setLearningCourses] = useState([])
  const [hasPurchased, setHasPurchased] = useState(false)

  // 加载已购课程
  useEffect(() => {
    const loadPurchasedCourses = () => {
      const purchased = getPurchasedCourses()
      setLearningCourses(purchased.length > 0 ? purchased : recommendedCourses)
      setHasPurchased(purchased.length > 0)
    }
    loadPurchasedCourses()
    
    // 监听购买事件
    const handlePurchase = () => loadPurchasedCourses()
    window.addEventListener('coursePurchased', handlePurchase)
    return () => window.removeEventListener('coursePurchased', handlePurchase)
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  // 过滤课程
  const filteredCourses = learningCourses.filter(c => {
    if (activeCategory !== '全部' && c.category !== activeCategory) return false
    if (activeTab === 'in-progress') return c.progress > 0 && c.progress < 100
    if (activeTab === 'completed') return c.progress === 100
    return true
  })

  const inProgressCount = learningCourses.filter(c => c.progress > 0 && c.progress < 100).length
  const completedCount = learningCourses.filter(c => c.progress === 100).length
  const totalHours = learningCourses.reduce((sum, c) => {
    const hours = parseInt(c.totalLessons * 0.5) // 每课时约0.5小时
    return sum + Math.round(c.completedLessons * 0.5)
  }, 0)
  const totalStudents = learningCourses.length

  const handleBrowse = () => navigate('/training')
  const handleContinue = (course) => {
    showToast(`📖 继续学习「${course.title}」`)
    // 获取上次学习的章节和课时
    const progressKey = `course_progress_${course.id}`
    const progress = JSON.parse(localStorage.getItem(progressKey) || '{}')
    const chapterIndex = progress.lastChapterIndex || 0
    const lessonIndex = progress.lastLessonIndex || 0
    // 跳转到课程详情页，并带上播放位置参数
    navigate(`/training/course/${course.id}?chapter=${chapterIndex}&lesson=${lessonIndex}`)
  }
  const handleReview = (course) => {
    showToast(`🔁 复习「${course.title}」`)
    navigate(`/course/${course.id}`)
  }

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(30,41,59,0.95)', color: '#e2e8f0', padding: '10px 24px',
          borderRadius: 24, fontSize: 14, zIndex: 9999,
          border: '1px solid rgba(148,163,184,0.2)',
          backdropFilter: 'blur(12px)',
          animation: 'toast-in 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          {toast}
        </div>
      )}

      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>学习中心</h1>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>继续您的 AIGC 学习之旅</p>
        </div>
        {/* 统计卡片 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#8b5cf6' }}>{inProgressCount}</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>在学课程</p>
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{completedCount}</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>已完成</p>
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{totalHours}h</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>学习时长</p>
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#06b6d4' }}>{totalStudents}</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>课程总数</p>
          </div>
        </div>
      </div>

      {/* 6大类型学习路径 */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.15) 100%)',
        borderRadius: 16, border: '1px solid rgba(139,92,246,0.2)', padding: 20, marginBottom: 24
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 16 }}>🚀 学习路径 - 6大AIGC方向</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {learningPaths.map((path, index) => (
            <div key={path.name} style={{
              background: 'rgba(15,23,42,0.6)', borderRadius: 12, padding: '12px 16px',
              border: `1px solid ${path.color}40`, cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
              onClick={() => { setActiveCategory(path.name); setActiveTab('in-progress'); }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = path.color; e.currentTarget.style.background = `${path.color}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${path.color}40`; e.currentTarget.style.background = 'rgba(15,23,42,0.6)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{path.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{path.name}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>3阶学习路径</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {path.steps.map((step, si) => (
                  <span key={si} style={{
                    fontSize: 11, color: '#94a3b8', background: 'rgba(255,255,255,0.05)',
                    padding: '2px 8px', borderRadius: 8
                  }}>{step}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6大类型导航 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
        {categories.map(cat => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
              borderRadius: 20, border: `1px solid ${activeCategory === cat.name ? cat.color : 'rgba(255,255,255,0.1)'}`,
              background: activeCategory === cat.name ? `${cat.color}25` : 'rgba(15,23,42,0.6)',
              color: activeCategory === cat.name ? '#fff' : '#94a3b8',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease'
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* 标签切换 */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 24 }}>
        {[
          { key: 'in-progress', label: '在学课程', count: inProgressCount, color: '#8b5cf6' },
          { key: 'completed', label: '已完成', count: completedCount, color: '#10b981' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              paddingBottom: 12, paddingLeft: 8, paddingRight: 8, fontWeight: 500,
              background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === tab.key ? tab.color : '#64748b',
              borderBottom: activeTab === tab.key ? `2px solid ${tab.color}` : '2px solid transparent',
              transition: 'all 0.2s ease', fontSize: 14, marginBottom: -1
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* 课程网格 */}
      {filteredCourses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filteredCourses.map(course => (
            <div key={course.id}
              style={{
                background: 'rgba(30,41,59,0.6)', borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.05)',
                overflow: 'hidden', transition: 'all 0.25s ease', cursor: 'pointer'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
            >
              {/* 封面图 */}
              <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 60%)' }}></div>

                {/* 类型标签 */}
                <span style={{
                  position: 'absolute', top: 12, left: 12,
                  padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                  background: `${course.categoryColor}cc`, color: '#fff', backdropFilter: 'blur(8px)'
                }}>
                  {course.category}
                </span>

                {/* 等级标签 */}
                <span style={{
                  position: 'absolute', top: 12, right: 12,
                  padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                  background: 'rgba(0,0,0,0.6)', color: '#fff', backdropFilter: 'blur(8px)'
                }}>
                  {course.level}
                </span>

                {/* 证书徽章 */}
                {course.certificate && (
                  <span style={{
                    position: 'absolute', bottom: 12, right: 12,
                    padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                    background: 'rgba(16,185,129,0.9)', color: '#fff'
                  }}>
                    ✓ 已获证书
                  </span>
                )}

                {/* 进度角标 */}
                <div style={{
                  position: 'absolute', bottom: 12, left: 12,
                  background: 'rgba(0,0,0,0.7)', color: '#fff',
                  padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  backdropFilter: 'blur(8px)'
                }}>
                  {course.progress}% 已学完
                </div>
              </div>

              {/* 内容区 */}
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 8, lineHeight: 1.4 }}>
                  {course.title}
                </h3>

                {/* 讲师 */}
                <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
                  👤 {course.teacher}
                </p>

                {/* 进度条 */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#64748b' }}>学习进度</span>
                    <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{course.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${course.progress}%`, height: '100%',
                      background: `linear-gradient(90deg, ${course.categoryColor}, ${course.categoryColor}aa)`,
                      borderRadius: 3, transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                    {course.completedLessons}/{course.totalLessons} 课时
                  </p>
                </div>

                {/* 底部 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {course.lastStudy ? `📅 最近: ${course.lastStudy}` : '📅 尚未开始'}
                  </span>
                  <button
                    onClick={() => course.progress === 100 ? handleReview(course) : handleContinue(course)}
                    style={{
                      padding: '6px 16px', borderRadius: 8,
                      background: course.progress === 100 ? '#10b981' : '#8b5cf6',
                      color: '#fff', border: 'none', fontSize: 12, fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = 0.85; e.currentTarget.style.transform = 'scale(1.02)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    {course.progress === 100 ? '🔁 复习课程' : '▶ 继续学习'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 空状态 */
        <div style={{ textAlign: 'center', padding: '64px 20px' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>
            {activeTab === 'in-progress' ? '📚' : '🏆'}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>
            {activeTab === 'in-progress'
              ? activeCategory === '全部' ? '还没有在学课程' : `暂无${activeCategory}方向在学课程`
              : activeCategory === '全部' ? '还没有完成课程' : `暂无${activeCategory}已完成课程`
            }
          </h3>
          <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
            {activeTab === 'in-progress'
              ? '去培训学院开始学习吧，6大AIGC方向等你探索'
              : '完成课程学习后即可获得证书'
            }
          </p>
          <button
            onClick={handleBrowse}
            style={{
              padding: '10px 28px', borderRadius: 10, background: '#8b5cf6',
              color: '#fff', border: 'none', fontSize: 14, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#7c3aed'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#8b5cf6'; }}
          >
            🎓 {activeTab === 'in-progress' ? '浏览全部课程' : '去培训学院'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
