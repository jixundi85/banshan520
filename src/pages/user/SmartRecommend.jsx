import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Target, BookOpen, ArrowRight, Star, Clock, Users } from 'lucide-react'
import { allCourses as courses } from '../../data/unifiedCourses'
// 基于诊断报告推荐课程
export default function SmartRecommend() {
  const navigate = useNavigate()
  const [assessment, setAssessment] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    // 加载诊断报告
    const loadAssessment = () => {
      const saved = localStorage.getItem('opcAssessment')
      if (saved) {
        setAssessment(JSON.parse(saved))
      }
      
      // 生成推荐
      generateRecommendations(saved ? JSON.parse(saved) : null)
      setLoading(false)
    }
    loadAssessment()
  }, [])
  // 智能推荐算法
  const generateRecommendations = (assessmentData) => {
    let recommended = []
    
    if (assessmentData?.dimensionScores) {
      const { execution, architecture, coordination, strategy } = assessmentData.dimensionScores
      
      // 根据能力短板推荐
      if (execution < 60) {
        recommended.push(...courses.filter(c => c.tags?.includes('执行力') || c.subCategory === 'agent'))
      }
      if (architecture < 60) {
        recommended.push(...courses.filter(c => c.tags?.includes('架构') || c.subCategory === 'workflow'))
      }
      if (coordination < 60) {
        recommended.push(...courses.filter(c => c.tags?.includes('协调') || c.subCategory === 'platform'))
      }
      if (strategy < 60) {
        recommended.push(...courses.filter(c => c.tags?.includes('战略') || c.mainCategory === 'aigc'))
      }
    }
    
    // 如果没有诊断数据或推荐不足，推荐热门课程
    if (recommended.length < 3) {
      const hotCourses = courses.filter(c => c.featured || c.students > 1000)
      recommended = [...recommended, ...hotCourses]
    }
    
    // 去重并限制数量
    const unique = recommended.filter((course, index, self) => 
      index === self.findIndex(c => c.id === course.id)
    ).slice(0, 6)
    
    setRecommendations(unique)
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">生成推荐中...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-white font-bold text-lg">智能课程推荐</h1>
          </div>
          <button 
            onClick={() => navigate('/training')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            返回课程中心
          </button>
        </div>
      </header>
      <main className="pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* 诊断结果展示 */}
          {assessment && (
            <div className="mb-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-purple-400" />
                <h2 className="text-white font-bold text-xl">基于你的能力诊断报告</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Object.entries(assessment.dimensionScores || {}).map(([key, score]) => (
                  <div key={key} className="bg-slate-900/50 rounded-xl p-4">
                    <p className="text-slate-400 text-sm mb-1">
                      {key === 'execution' && '执行力'}
                      {key === 'architecture' && '架构能力'}
                      {key === 'coordination' && '协调能力'}
                      {key === 'strategy' && '战略能力'}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-white font-bold">{score}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <Sparkles className="w-4 h-4" />
                <span>当前等级：{assessment.level} · 推荐课程已根据你的能力短板定制</span>
              </div>
            </div>
          )}
          {/* 推荐课程列表 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                为你推荐
              </h3>
              <span className="text-slate-400 text-sm">共 {recommendations.length} 门课程</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(course => (
                <div 
                  key={course.id}
                  onClick={() => navigate(`/training/course/${course.id}`)}
                  className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer group"
                >
                  {/* 封面 */}
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={course.coverImage || course.cover} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-purple-500/90 text-white text-xs rounded-lg">
                        {course.mainCategory === 'ai' ? '人工智能' : 'AIGC实战'}
                      </span>
                    </div>
                    {course.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-yellow-500/90 text-white text-xs rounded-lg flex items-center gap-1">
                          <Star className="w-3 h-3" /> 精选
                        </span>
                      </div>
                    )}
                  </div>
                  {/* 内容 */}
                  <div className="p-4">
                    <h4 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{course.subtitle}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {course.students?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">¥{course.price}</span>
                        {course.originalPrice && (
                          <span className="text-slate-500 line-through text-sm">¥{course.originalPrice}</span>
                        )}
                      </div>
                      <button className="flex items-center gap-1 text-purple-400 text-sm hover:text-purple-300">
                        查看详情 <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 去评估按钮 */}
          {!assessment && (
            <div className="text-center py-12 bg-slate-900/50 border border-white/10 rounded-2xl">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">还没有诊断报告？</h3>
              <p className="text-slate-400 mb-6">完成能力评估，获取个性化课程推荐</p>
              <button 
                onClick={() => navigate('/opc-assessment')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                开始能力评估
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
