import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
const courseData = {
  'c1': {
    title: 'AI时代企业生存法则',
    category: '认知跃迁',
    duration: '2小时',
    instructor: '吉老师',
    rating: 4.9,
    students: 1280,
    description: '全面解析AI对企业经营的深远影响，建立AI时代企业生存的核心认知框架',
    chapters: [
      { title: '第一章：AI浪潮下的企业危机', duration: '30分钟', completed: true },
      { title: '第二章：碳硅共生的商业逻辑', duration: '35分钟', completed: true },
      { title: '第三章：企业智能化转型的三大误区', duration: '25分钟', completed: false },
      { title: '第四章：从工具使用到生态构建', duration: '30分钟', completed: false },
    ]
  },
  'c2': {
    title: '企业AI成熟度诊断',
    category: '企业诊断',
    duration: '3小时',
    instructor: '吉老师',
    rating: 4.8,
    students: 856,
    description: '掌握企业AI成熟度评估的完整方法论，精准定位企业所处阶段',
    chapters: [
      { title: '第一章：AI成熟度模型介绍', duration: '20分钟', completed: false },
      { title: '第二章：L1-L4等级详解', duration: '40分钟', completed: false },
      { title: '第三章：诊断工具实操', duration: '45分钟', completed: false },
      { title: '第四章：诊断报告解读', duration: '35分钟', completed: false },
    ]
  },
  'c3': {
    title: 'L1到L4升级路径',
    category: '升级路径',
    duration: '4小时',
    instructor: '吉老师',
    rating: 4.9,
    students: 642,
    description: '详解企业从工具使用到生态构建的四级跃迁路径',
    chapters: [
      { title: '第一章：L1工具使用者特征', duration: '30分钟', completed: false },
      { title: '第二章：L2系统优化者升级', duration: '45分钟', completed: false },
      { title: '第三章：L3智能领航者突破', duration: '50分钟', completed: false },
      { title: '第四章：L4生态构建者布局', duration: '55分钟', completed: false },
    ]
  },
  'c4': {
    title: '平台接入指南',
    category: '进入路径',
    duration: '1.5小时',
    instructor: '吉老师',
    rating: 4.7,
    students: 423,
    description: '快速接入平台，开启智能升级',
    chapters: [
      { title: '第一章：平台注册与认证', duration: '20分钟', completed: false },
      { title: '第二章：发布第一个需求', duration: '25分钟', completed: false },
      { title: '第三章：OPC匹配与协作', duration: '25分钟', completed: false },
      { title: '第四章：项目管理与验收', duration: '20分钟', completed: false },
    ]
  }
}
export default function BossCourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState({})
  useEffect(() => {
    const data = courseData[id]
    if (data) {
      setCourse(data)
      // 获取学习进度
      const saved = localStorage.getItem(`course_progress_${id}`)
      if (saved) {
        setProgress(JSON.parse(saved))
      }
    }
  }, [id])
  if (!course) {
    return (
      
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400">课程不存在</p>
            <button
              onClick={() => navigate('/boss-academy')}
              className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg"
            >
              返回课程列表
            </button>
          </div>
        </div>
      
    )
  }
  const completedCount = course.chapters.filter(c => c.completed).length
  const totalProgress = Math.round((completedCount / course.chapters.length) * 100)
  return (
    
      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 课程头部 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm">
                {course.category}
              </span>
              <span className="text-yellow-400 text-sm">★ {course.rating}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
            <p className="text-gray-400 mb-6">{course.description}</p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>👨‍🏫 {course.instructor}</span>
              <span>⏱ {course.duration}</span>
              <span>👥 {course.students}人学习</span>
              <span>📊 进度 {totalProgress}%</span>
            </div>
          </div>
          {/* 章节列表 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">课程章节</h2>
            <div className="space-y-3">
              {course.chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-violet-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                      chapter.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-400'
                    }`}>
                      {chapter.completed ? '✓' : index + 1}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{chapter.title}</h3>
                      <p className="text-gray-500 text-sm">{chapter.duration}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg text-sm hover:bg-violet-600/30 transition-all">
                    {chapter.completed ? '复习' : '学习'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* 操作按钮 */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate('/boss-academy')}
              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            >
              返回列表
            </button>
            <button
              onClick={() => alert('开始学习功能开发中')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all"
            >
              {totalProgress > 0 ? '继续学习' : '开始学习'}
            </button>
          </div>
        </div>
      </div>
    
  )
}
