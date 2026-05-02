import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, ChevronRight, ChevronDown, BookOpen, Clock, Users,
  Star, Play, Lock, Zap, CheckCircle, UserPlus, Check
} from 'lucide-react'
import './CourseDetail.css'
import { courses } from '../../data/coursesData'
import PaymentModal from '../../components/PaymentModal'

// 封面图片映射
const coverImages = {
  shortvideo: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=450&fit=crop',
  shortdrama: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop',
  mangadrama: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=800&h=450&fit=crop',
  film: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop',
  designer: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop',
  commerce: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop',
}

const categoryNames = {
  shortvideo: 'AI短视频',
  shortdrama: 'AI短剧',
  mangadrama: 'AI漫剧',
  film: 'AI电影',
  designer: 'AI设计师',
  commerce: 'AI带货变现'
}

// 课程老师信息映射（用于展示对应的创作者信息）
const getTeacherInfo = (course) => {
  // 如果课程有自己的 teacher 信息，直接使用
  if (course && course.teacher) {
    return {
      name: course.teacher.name,
      title: course.teacher.title,
      avatar: course.teacher.avatar,
      avatarUrl: course.teacher.avatarUrl || '',
      bio: course.teacher.bio || `资深${categoryNames[course.category] || 'AI创作'}专家，专注于AI内容创作与教学`,
      skills: course.teacher.skills || [categoryNames[course.category] || 'AI创作'],
      douyinId: course.teacher.douyinId || '',
      douyinFans: course.teacher.douyinFans || '',
      wechatId: course.teacher.wechatId || '',
      wechatFans: course.teacher.wechatFans || '',
      xiaohongshuId: course.teacher.xiaohongshuId || '',
      xiaohongshuFans: course.teacher.xiaohongshuFans || ''
    }
  }
  return null
}

export default function CourseDetail() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [expandedChapters, setExpandedChapters] = useState({})
  const [activeTab, setActiveTab] = useState('outline')
  const [enrolled, setEnrolled] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [toast, setToast] = useState(null)
  const [allCourses, setAllCourses] = useState(courses) // 初始为内置课程
  const [isLoading, setIsLoading] = useState(true) // 添加加载状态
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 加载所有课程（包括内置课程和创作者教程）
  useEffect(() => {
    // 从 localStorage 加载创作者教程
    const loadCreatorTutorials = () => {
      try {
        const savedTutorials = JSON.parse(localStorage.getItem('savedTutorials') || '[]')
        const publishedTutorials = savedTutorials.filter(t => t.status === 'published')
        const convertedTutorials = publishedTutorials.map(t => ({
          id: t.id,
          category: t.category,
          categoryName: t.categoryName,
          level: '创作者',
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
            bio: '专业内容创作者'
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
          isCreatorTutorial: true
        }))
        // 合并内置课程和创作者教程
        setAllCourses([...courses, ...convertedTutorials])
      } catch (error) {
        console.error('加载创作者教程失败:', error)
        // 保持内置课程不变
      } finally {
        setIsLoading(false)
      }
    }

    loadCreatorTutorials()

    // 监听教程更新事件
    window.addEventListener('creatorTutorialsUpdated', loadCreatorTutorials)
    const interval = setInterval(loadCreatorTutorials, 3000)

    return () => {
      window.removeEventListener('creatorTutorialsUpdated', loadCreatorTutorials)
      clearInterval(interval)
    }
  }, [])

  // 支持数字ID和字符串ID的匹配
  const course = allCourses.find(c => {
    // 直接比较，支持数字ID和字符串ID
    return String(c.id) === String(courseId)
  })

  // 获取课程对应的老师信息
  const teacherInfo = getTeacherInfo(course)

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  // 课程报名状态 - 从 localStorage 读取
  useEffect(() => {
    if (!course) return
    
    // 从 localStorage 检查购买状态
    const purchasedCourses = JSON.parse(localStorage.getItem('purchasedCourses') || '[]')
    const isPurchased = purchasedCourses.includes(String(course.id))
    
    // 兼容旧版标记方式
    const legacyEnrolled = localStorage.getItem('enrolled_' + course.id) === 'true'
    
    setEnrolled(isPurchased || legacyEnrolled)
    
    // 默认展开第一章
    setExpandedChapters({ 0: true })
  }, [course])

  // 加载中状态
  if (isLoading) {
    return (
      <div className="cd-page">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid rgba(139, 92, 246, 0.3)',
            borderTop: '3px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#94a3b8' }}>加载课程中...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="cd-page">
        <div className="cd-nav">
          <button className="cd-back-btn" onClick={() => navigate('/training')}>
            <ArrowLeft size={18} /> 返回培训孵化
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ color: '#e2e8f0', marginBottom: 16 }}>课程不存在</h2>
          <button
            onClick={() => navigate('/training')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            返回培训学院
          </button>
        </div>
      </div>
    )
  }

  const coverImg = coverImages[course.category] || coverImages.shortvideo

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
    setTimeout(() => {
      navigate(`/course/${course.id}`)
    }, 1500)
  }

  const handleTrial = () => {
    if (enrolled) {
      navigate(`/course/${course.id}`)
    } else {
      showToast('📖 请先购买课程解锁完整内容')
    }
  }

  const handleFollow = () => {
    setFollowed(!followed)
    showToast(followed ? '已取消关注' : '关注成功！')
  }

  const toggleChapter = (index) => {
    setExpandedChapters(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const levelClass = course.level === '入门' ? '' : course.level === '进阶' ? 'intermediate' : 'advanced'

  return (
    <div className="cd-page">
      {toast && <div className="cd-toast">{toast}</div>}
      
      {/* 支付弹窗 */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={course}
        onSuccess={handlePaymentSuccess}
      />

      {/* 顶部导航 */}
      <div className="cd-nav">
        <button className="cd-back-btn" onClick={() => navigate('/training', { state: { scrollTo: 'courses' } })}>
          <ArrowLeft size={18} /> 返回培训孵化
        </button>
        <div className="cd-nav-divider"></div>
        <p className="cd-nav-title">{course.title}</p>
      </div>

      {/* 主内容区 - 左右布局 */}
      <div className="cd-main-content">
        {/* 左侧 - 授课老师信息（显示该课程的授课老师） */}
        <div className="cd-creator-card">
          <div className="cd-creator-header">
            <div className="cd-creator-avatar">
              {teacherInfo && teacherInfo.avatarUrl ? (
                <img src={teacherInfo.avatarUrl} alt={teacherInfo.name} className="cd-creator-avatar-img" />
              ) : (
                teacherInfo?.avatar || '👨‍🏫'
              )}
            </div>
            <div className="cd-creator-name">{teacherInfo?.name || '未知讲师'}</div>
            <div className="cd-creator-title">{teacherInfo?.title || '专业讲师'}</div>
            <div className="cd-creator-verified">
              <CheckCircle size={12} /> 已认证创作者
            </div>
          </div>

          {/* 简介 */}
          <div style={{ marginBottom: 20 }}>
            <div className="cd-creator-section-title">个人简介</div>
            <div className="cd-creator-bio">{teacherInfo?.bio || '专注AI内容创作与教学'}</div>
          </div>

          {/* 擅长领域 */}
          <div className="cd-creator-skills">
            <div className="cd-creator-section-title">擅长领域</div>
            <div className="cd-skill-tags">
              {(teacherInfo?.skills || ['AI创作']).map((skill, i) => (
                <span key={i} className="cd-skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          {/* 粉丝统计 */}
          <div className="cd-creator-stats">
            <div className="cd-creator-section-title">全网粉丝</div>
            <div className="cd-platform-stats">
              <div className="cd-platform-item">
                <div className="cd-platform-left">
                  <div className="cd-platform-icon douyin">📺</div>
                  <div className="cd-platform-info">
                    <span className="cd-platform-name">抖音</span>
                    {teacherInfo?.douyinId && (
                      <span className="cd-platform-id">@{teacherInfo.douyinId}</span>
                    )}
                  </div>
                </div>
                <span className="cd-platform-fans">{teacherInfo?.douyinFans || '-'}</span>
              </div>
              <div className="cd-platform-item">
                <div className="cd-platform-left">
                  <div className="cd-platform-icon wechat">💚</div>
                  <div className="cd-platform-info">
                    <span className="cd-platform-name">视频号</span>
                    {teacherInfo?.wechatId && (
                      <span className="cd-platform-id">@{teacherInfo.wechatId}</span>
                    )}
                  </div>
                </div>
                <span className="cd-platform-fans">{teacherInfo?.wechatFans || '-'}</span>
              </div>
              <div className="cd-platform-item">
                <div className="cd-platform-left">
                  <div className="cd-platform-icon xiaohongshu">📕</div>
                  <div className="cd-platform-info">
                    <span className="cd-platform-name">小红书</span>
                    {teacherInfo?.xiaohongshuId && (
                      <span className="cd-platform-id">@{teacherInfo.xiaohongshuId}</span>
                    )}
                  </div>
                </div>
                <span className="cd-platform-fans">{teacherInfo?.xiaohongshuFans || '-'}</span>
              </div>
            </div>
          </div>

          {/* 关注按钮 */}
          <button className={`cd-follow-btn ${followed ? 'followed' : ''}`} onClick={handleFollow}>
            {followed ? (
              <>
                <Check size={18} /> 已关注
              </>
            ) : (
              <>
                <UserPlus size={18} /> 关注讲师
              </>
            )}
          </button>
        </div>

        {/* 右侧 - 课程信息 */}
        <div className="cd-course-content">
          {/* 视频播放器 */}
          <div className="cd-video-section">
            <div className="cd-video-container">
              <div className="cd-video-placeholder" onClick={handleTrial}>
                <img src={coverImg} alt="" className="cd-video-bg" />
                <div className="cd-video-overlay"></div>
                <div className="cd-play-btn">
                  <Play size={36} color="#fff" style={{ marginLeft: 4 }} />
                </div>
                <span className="cd-play-text">
                  {enrolled ? '继续学习第一节' : '免费试看第一节'}
                </span>
              </div>
            </div>
          </div>

          {/* 课程信息卡片 */}
          <div className="cd-course-info">
            {/* 标签和标题 */}
            <div className="cd-tags">
              <span className={`cd-tag cd-level-tag ${levelClass}`}>{course.level}</span>
              <span className="cd-tag cd-category-tag">{categoryNames[course.category]}</span>
            </div>
            <h1 className="cd-title">{course.title}</h1>
            <p className="cd-subtitle">{course.subtitle}</p>

            {/* 统计信息 */}
            <div className="cd-stats">
              <div className="cd-stat-item">
                <Users size={14} className="icon" />
                <span className="value">{course.students.toLocaleString()}</span>
                <span>人学习</span>
              </div>
              <div className="cd-stat-item">
                <Star size={14} className="icon" style={{ color: '#fbbf24' }} />
                <span className="value">{course.rating}</span>
                <span>分</span>
              </div>
              <div className="cd-stat-item">
                <span>💬</span>
                <span className="value">{course.reviews}</span>
                <span>条评价</span>
              </div>
              <div className="cd-stat-item">
                <BookOpen size={14} className="icon" />
                <span className="value">{course.lessons}</span>
                <span>课时</span>
              </div>
              <div className="cd-stat-item">
                <Clock size={14} className="icon" />
                <span className="value">{course.duration}</span>
              </div>
            </div>

            {/* 价格和购买 */}
            <div className="cd-purchase-section">
              <div className="cd-price-row">
                <span className="cd-price">¥{course.price}</span>
                <span className="cd-price-original">¥{course.price * 2}</span>
              </div>
              <div className="cd-purchase-buttons">
                {enrolled ? (
                  <button className="cd-buy-btn primary" onClick={() => navigate(`/course/${course.id}`)}>
                    继续学习
                  </button>
                ) : (
                  <button className="cd-buy-btn primary" onClick={handleEnroll}>
                    立即购买
                  </button>
                )}
                <button className="cd-trial-btn" onClick={handleTrial}>
                  {enrolled ? '免费试看' : '🆓 免费试看第一课'}
                </button>
              </div>
              <div className="cd-vip-tip">
                <Zap size={14} />
                VIP会员享8折优惠，再减¥{Math.round(course.price * 0.2)}
              </div>
            </div>
          </div>

          {/* Tab切换 */}
          <div className="cd-tabs">
            <button
              className={`cd-tab-btn ${activeTab === 'outline' ? 'active' : ''}`}
              onClick={() => setActiveTab('outline')}
            >
              课程大纲
            </button>
            <button
              className={`cd-tab-btn ${activeTab === 'intro' ? 'active' : ''}`}
              onClick={() => setActiveTab('intro')}
            >
              课程介绍
            </button>
          </div>

          {/* Tab内容 */}
          {activeTab === 'outline' && (
            <div className="cd-chapter-list">
              {(course.chapters || []).map((chapter, ci) => (
                <div key={ci} className="cd-chapter-item">
                  <div className="cd-chapter-header" onClick={() => toggleChapter(ci)}>
                    <div className="cd-chapter-info">
                      <div className="cd-chapter-num">{ci + 1}</div>
                      <div className="cd-chapter-title">{chapter.title}</div>
                    </div>
                    <div className="cd-chapter-meta">
                      <span className="cd-chapter-count">{(chapter.lessons || []).length}课时</span>
                      <ChevronDown
                        size={18}
                        className={`cd-chapter-toggle ${expandedChapters[ci] ? 'expanded' : ''}`}
                      />
                    </div>
                  </div>
                  <div className={`cd-chapter-lessons ${expandedChapters[ci] ? 'expanded' : ''}`}>
                    {(chapter.lessons || []).map((lesson, li) => {
                      // 兼容字符串和对象两种 lesson 格式
                      const lessonTitle = typeof lesson === 'string' ? lesson : (lesson.title || `第${li + 1}课`)
                      const isFree = typeof lesson === 'object' ? lesson.isFree : false
                      return (
                        <div key={li} className="cd-lesson-item">
                          <span className="cd-lesson-icon">
                            {enrolled || isFree ? <CheckCircle size={14} style={{ color: '#10b981' }} /> : <Lock size={14} className="cd-lesson-lock" />}
                          </span>
                          <span className="cd-lesson-title">
                            {enrolled || isFree ? (
                              <span
                                style={{ cursor: 'pointer', color: '#94a3b8' }}
                                onClick={() => navigate(`/course/${course.id}`)}
                              >
                                第{li + 1}课：{lessonTitle}
                              </span>
                            ) : (
                              <>第{li + 1}课：{lessonTitle}</>
                            )}
                          </span>
                          {isFree && !enrolled && (
                            <span style={{ fontSize: 11, color: '#10b981', marginLeft: 6, padding: '1px 6px', background: 'rgba(16,185,129,0.1)', borderRadius: 4 }}>免费</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              {(!course.chapters || course.chapters.length === 0) && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  暂无课程大纲
                </div>
              )}
            </div>
          )}

          {activeTab === 'intro' && (
            <div className="cd-tab-content">
              <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 20 }}>
                {course.subtitle}
              </p>
              <div className="cd-highlights">
                <div className="cd-highlight-item">
                  <div className="cd-highlight-icon">🎯</div>
                  <div className="cd-highlight-text">零基础到实战，月入过万方法</div>
                </div>
                <div className="cd-highlight-item">
                  <div className="cd-highlight-icon">🚀</div>
                  <div className="cd-highlight-text">AI工具全流程，效率提升10倍</div>
                </div>
                <div className="cd-highlight-item">
                  <div className="cd-highlight-icon">💼</div>
                  <div className="cd-highlight-text">商业变现路径，接单赚钱</div>
                </div>
                <div className="cd-highlight-item">
                  <div className="cd-highlight-icon">🏆</div>
                  <div className="cd-highlight-text">结业证书，提升竞争力</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
