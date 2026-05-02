import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
const courses = [
  { id: 'c1', title: 'AI时代企业生存法则', category: '认知跃迁', duration: '2小时', students: 1280, rating: 4.9, icon: '🎯', color: 'from-violet-500 to-purple-500' },
  { id: 'c2', title: '企业AI成熟度诊断', category: '企业诊断', duration: '3小时', students: 856, rating: 4.8, icon: '🔍', color: 'from-cyan-500 to-blue-500' },
  { id: 'c3', title: 'L1到L4升级路径', category: '升级路径', duration: '4小时', students: 642, rating: 4.9, icon: '🚀', color: 'from-amber-500 to-orange-500' },
  { id: 'c4', title: '平台接入指南', category: '进入路径', duration: '1.5小时', students: 423, rating: 4.7, icon: '🚪', color: 'from-emerald-500 to-teal-500' },
]
const modules = [
  { id: 'all', title: '全部课程', icon: '📚', count: 4 },
  { id: '认知跃迁', title: '认知跃迁', icon: '🧠', count: 1 },
  { id: '企业诊断', title: '企业诊断', icon: '🔍', count: 1 },
  { id: '升级路径', title: '升级路径', icon: '🚀', count: 1 },
  { id: '进入路径', title: '进入路径', icon: '🚪', count: 1 },
]
export default function BossAcademy() {
  const [activeModule, setActiveModule] = useState('all')
  
  const filteredCourses = activeModule === 'all' ? courses : courses.filter(c => c.category === activeModule)
  return (
    
      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Boss公开课</span>
            </h1>
            <p className="text-gray-400">企业智能升级必修课</p>
          </div>
          {/* Modules */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {modules.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeModule === m.id ? 'bg-white/10 border-violet-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-2xl mb-2">{m.icon}</div>
                <div className="text-white text-sm font-medium">{m.title}</div>
                <div className="text-gray-500 text-xs">{m.count}门课程</div>
              </button>
            ))}
          </div>
          {/* Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map(course => (
              <Link
                key={course.id}
                to={`/boss-course/${course.id}`}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                    {course.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400">{course.category}</span>
                      <span className="text-yellow-400 text-xs">★ {course.rating}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2 group-hover:text-violet-400 transition-colors">{course.title}</h3>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <span>⏱ {course.duration}</span>
                      <span>👥 {course.students}人学习</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    
  )
}
