import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// OPC特训营 - 三大模块培训体系
export default function OPCTraining() {
  const [activeModule, setActiveModule] = useState('cognition')
  const [userLevel, setUserLevel] = useState('L1')
  const [enrolledCourses, setEnrolledCourses] = useState([])
  
  useEffect(() => {
    // 获取用户等级
    const result = localStorage.getItem('opc_assessment_result')
    if (result) {
      setUserLevel(JSON.parse(result).level)
    }
    // 获取已报名课程
    const enrolled = localStorage.getItem('enrolled_courses')
    if (enrolled) {
      setEnrolledCourses(JSON.parse(enrolled))
    }
  }, [])
  
  const modules = {
    cognition: {
      title: '认知重塑',
      icon: '🧠',
      description: '建立AI时代创作者的核心认知框架',
      courses: [
        { id: 'cog1', title: 'AI时代创作者生存法则', level: 'L1', duration: '2小时', students: 1200, status: 'open' },
        { id: 'cog2', title: '碳硅共生思维模式', level: 'L1', duration: '3小时', students: 890, status: 'open' },
        { id: 'cog3', title: '从工具使用者到生态构建者', level: 'L2', duration: '4小时', students: 560, status: 'locked' }
      ]
    },
    matrix: {
      title: '矩阵建构',
      icon: '⚡',
      description: '掌握AI内容生产矩阵的搭建方法',
      courses: [
        { id: 'mat1', title: 'AI工具链整合实战', level: 'L2', duration: '6小时', students: 780, status: 'open' },
        { id: 'mat2', title: '内容矩阵设计方法论', level: 'L2', duration: '5小时', students: 650, status: 'open' },
        { id: 'mat3', title: '规模化生产流程优化', level: 'L3', duration: '8小时', students: 420, status: 'locked' }
      ]
    },
    practice: {
      title: '实战操盘',
      icon: '🎯',
      description: '在真实项目中锤炼操盘能力',
      courses: [
        { id: 'pra1', title: '商业项目全流程实战', level: 'L3', duration: '12小时', students: 340, status: 'open' },
        { id: 'pra2', title: '团队协作与资源调配', level: 'L3', duration: '8小时', students: 280, status: 'open' },
        { id: 'pra3', title: '生态构建与商业闭环', level: 'L4', duration: '16小时', students: 120, status: 'locked' }
      ]
    }
  }
  
  const enrollCourse = (courseId) => {
    const newEnrolled = [...enrolledCourses, courseId]
    setEnrolledCourses(newEnrolled)
    localStorage.setItem('enrolled_courses', JSON.stringify(newEnrolled))
    alert('报名成功！')
  }
  
  const currentModule = modules[activeModule]
  
  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">OPC特训营</span>
          </h1>
          <p className="text-gray-400">三大模块，系统提升您的AI创作能力</p>
        </div>
        {/* 模块切换 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {Object.entries(modules).map(([key, module]) => (
            <button
              key={key}
              onClick={() => setActiveModule(key)}
              className={`p-6 rounded-2xl border text-left transition-all ${
                activeModule === key
                  ? 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border-violet-500/50'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-3xl mb-3">{module.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-1">{module.title}</h3>
              <p className="text-gray-400 text-sm">{module.description}</p>
            </button>
          ))}
        </div>
        {/* 课程列表 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">{currentModule.title}</h2>
              <p className="text-gray-400">{currentModule.description}</p>
            </div>
            <span className="px-3 py-1 bg-violet-500/20 text-violet-400 text-sm rounded-full">
              {currentModule.courses.length} 门课程
            </span>
          </div>
          <div className="space-y-4">
            {currentModule.courses.map(course => {
              const isEnrolled = enrolledCourses.includes(course.id)
              const isLocked = course.status === 'locked' || 
                (course.level === 'L2' && userLevel === 'L1') ||
                (course.level === 'L3' && ['L1', 'L2'].includes(userLevel)) ||
                (course.level === 'L4' && userLevel !== 'L4')
              return (
                <div
                  key={course.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    isLocked ? 'border-white/10 opacity-60' : 'border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                      course.level === 'L1' ? 'bg-emerald-500/20 text-emerald-400' :
                      course.level === 'L2' ? 'bg-cyan-500/20 text-cyan-400' :
                      course.level === 'L3' ? 'bg-violet-500/20 text-violet-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {course.level}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{course.title}</h3>
                      <p className="text-gray-400 text-sm">{course.duration} · {course.students}人已学</p>
                    </div>
                  </div>
                  <div>
                    {isLocked ? (
                      <span className="px-4 py-2 bg-white/5 text-gray-500 rounded-lg text-sm">
                        🔒 需 L2/L3/L4
                      </span>
                    ) : isEnrolled ? (
                      <Link
                        to={`/course/${course.id}`}
                        className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors"
                      >
                        继续学习
                      </Link>
                    ) : (
                      <button
                        onClick={() => enrollCourse(course.id)}
                        className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg text-sm hover:from-violet-500 hover:to-cyan-500 transition-all"
                      >
                        立即报名
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {/* 实战项目入口 */}
        <div className="mt-8 p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">🎯 实战项目分配</h3>
              <p className="text-gray-400">完成课程学习后，可申请参与真实商业项目</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all">
              申请项目
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
