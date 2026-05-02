import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// 企业档案页 - 展示企业等级、需求历史、合作记录等
export default function EnterpriseProfile() {
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalSpent: 0,
    avgRating: 0
  })
  useEffect(() => {
    // 获取企业诊断结果
    const diagnosisResult = localStorage.getItem('enterprise_diagnosis_result')
    if (diagnosisResult) {
      setProfile(JSON.parse(diagnosisResult))
    } else {
      // 模拟数据
      setProfile({
        level: 'L2',
        levelName: '系统优化者',
        score: 72,
        dimensions: {
          toolUsage: 75,
          workflow: 70,
          integration: 68,
          strategy: 65
        },
        tags: ['AI工具使用者', '流程优化需求', '中等预算']
      })
    }
    // 获取项目历史
    const savedProjects = localStorage.getItem('enterprise_projects')
    if (savedProjects) {
      const projects = JSON.parse(savedProjects)
      setProjects(projects)
      setStats({
        totalProjects: projects.length,
        completedProjects: projects.filter(p => p.status === '已完成').length,
        totalSpent: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
        avgRating: 4.8
      })
    } else {
      // 模拟数据
      const mockProjects = [
        { id: 1, name: '品牌宣传片制作', type: 'AI视频', budget: 15000, status: '已完成', opc: '创意工坊', rating: 5, date: '2024-01' },
        { id: 2, name: '产品展示视频', type: 'AI短视频', budget: 8000, status: '进行中', opc: '视觉大师', rating: null, date: '2024-02' },
        { id: 3, name: 'AI客服系统部署', type: 'AI工具', budget: 25000, status: '已完成', opc: '智能方案', rating: 4.5, date: '2024-01' },
      ]
      setProjects(mockProjects)
      setStats({
        totalProjects: 3,
        completedProjects: 2,
        totalSpent: 48000,
        avgRating: 4.8
      })
    }
  }, [])
  if (!profile) {
    return (
      
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto">
              🏢
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">尚未完成企业诊断</h1>
            <p className="text-gray-400 mb-6">完成诊断后即可查看企业档案</p>
            <Link
              to="/enterprise-diagnosis"
              className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl"
            >
              开始诊断
            </Link>
          </div>
        </div>
      
    )
  }
  const levelColors = {
    L1: 'from-emerald-400 to-teal-500',
    L2: 'from-cyan-400 to-blue-500',
    L3: 'from-purple-400 to-violet-500',
    L4: 'from-amber-400 to-yellow-500'
  }
  return (
    
      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 头部信息 */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-20 h-20 bg-gradient-to-br ${levelColors[profile.level]} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                🏢
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-white">某科技有限公司</h1>
                  <span className={`px-3 py-1 bg-gradient-to-r ${levelColors[profile.level]} text-white text-sm font-bold rounded-full`}>
                    {profile.level}
                  </span>
                </div>
                <p className="text-gray-400">{profile.levelName} · 诊断得分 {profile.score}分</p>
              </div>
            </div>
            {/* 标签 */}
            <div className="flex flex-wrap gap-2">
              {profile.tags?.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {/* 统计卡片 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">总项目数</p>
              <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">已完成</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.completedProjects}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">总支出</p>
              <p className="text-2xl font-bold text-amber-400">¥{(stats.totalSpent / 10000).toFixed(1)}万</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">平均评分</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.avgRating}</p>
            </div>
          </div>
          {/* 能力雷达 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">AI成熟度评估</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profile.dimensions && Object.entries(profile.dimensions).map(([key, value]) => {
                const labels = {
                  toolUsage: '工具使用',
                  workflow: '流程优化',
                  integration: '系统集成',
                  strategy: '战略规划'
                }
                return (
                  <div key={key} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-2">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="3"
                          strokeDasharray={`${value}, 100`}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{value}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{labels[key]}</p>
                  </div>
                )
              })}
            </div>
          </div>
          {/* 项目历史 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">项目历史</h2>
              <Link
                to="/my-demands"
                className="text-cyan-400 text-sm hover:underline"
              >
                查看全部 →
              </Link>
            </div>
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-xl">
                    📋
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{project.name}</h3>
                    <p className="text-gray-400 text-sm">{project.opc} · {project.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-semibold">¥{project.budget?.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      project.status === '已完成' ? 'bg-emerald-500/20 text-emerald-400' :
                      project.status === '进行中' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    
  )
}
