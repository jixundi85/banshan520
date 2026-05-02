import { useState, useEffect } from 'react'
// 信用分体系 - 展示用户信用评级和评分明细
export default function CreditSystem() {
  const [creditScore, setCreditScore] = useState(0)
  const [creditLevel, setCreditLevel] = useState('')
  const [history, setHistory] = useState([])
  useEffect(() => {
    // 计算信用分
    calculateCreditScore()
  }, [])
  const calculateCreditScore = () => {
    // 从localStorage获取数据
    const projects = JSON.parse(localStorage.getItem('userProjects') || '[]')
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]')
    const payments = JSON.parse(localStorage.getItem('payments') || '[]')
    let score = 500 // 基础分
    const history = []
    // 项目完成加分
    const completedProjects = projects.filter(p => p.status === '已完成')
    score += completedProjects.length * 20
    if (completedProjects.length > 0) {
      history.push({ type: 'project', desc: `完成${completedProjects.length}个项目`, score: completedProjects.length * 20, date: '近期' })
    }
    // 评价加分
    const goodReviews = reviews.filter(r => r.rating >= 4)
    score += goodReviews.length * 15
    if (goodReviews.length > 0) {
      history.push({ type: 'review', desc: `获得${goodReviews.length}条好评`, score: goodReviews.length * 15, date: '近期' })
    }
    // 按时付款加分
    const onTimePayments = payments.filter(p => p.onTime)
    score += onTimePayments.length * 10
    // 上限1000分
    score = Math.min(score, 1000)
    setCreditScore(score)
    setCreditLevel(getCreditLevel(score))
    setHistory(history)
    // 保存到localStorage
    localStorage.setItem('creditScore', JSON.stringify({ score, level: getCreditLevel(score), updatedAt: new Date().toISOString() }))
  }
  const getCreditLevel = (score) => {
    if (score >= 900) return { name: '钻石', color: 'from-amber-400 to-yellow-500', benefits: ['优先匹配', '手续费减免', '专属客服'] }
    if (score >= 800) return { name: '铂金', color: 'from-cyan-400 to-blue-500', benefits: ['优先匹配', '手续费9折'] }
    if (score >= 700) return { name: '黄金', color: 'from-yellow-400 to-amber-500', benefits: ['优先展示'] }
    if (score >= 600) return { name: '白银', color: 'from-gray-400 to-gray-500', benefits: ['基础权益'] }
    return { name: '青铜', color: 'from-orange-400 to-red-500', benefits: ['新手保护'] }
  }
  const level = creditLevel || getCreditLevel(creditScore)
  return (
    
      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 头部 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">信用中心</span>
            </h1>
            <p className="text-gray-400">良好的信用记录将为您带来更多机会</p>
          </div>
          {/* 信用分卡片 */}
          <div className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/30 rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* 分数 */}
              <div className="text-center">
                <p className="text-gray-400 mb-2">当前信用分</p>
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#creditGradient)" strokeWidth="3" strokeDasharray={`${creditScore / 10}, 100`} />
                    <defs>
                      <linearGradient id="creditGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{creditScore}</span>
                  </div>
                </div>
              </div>
              {/* 等级 */}
              <div className="text-center">
                <p className="text-gray-400 mb-2">信用等级</p>
                <div className={`inline-block px-6 py-3 bg-gradient-to-r ${level.color} rounded-xl text-white font-bold text-xl`}>
                  {level.name}
                </div>
              </div>
              {/* 权益 */}
              <div>
                <p className="text-gray-400 mb-3">当前权益</p>
                <div className="space-y-2">
                  {level.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300">
                      <span className="text-emerald-400">✓</span>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* 评分维度 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">项目完成率</p>
              <p className="text-2xl font-bold text-emerald-400">98%</p>
              <p className="text-gray-500 text-xs mt-1">+20分/项目</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">好评率</p>
              <p className="text-2xl font-bold text-yellow-400">4.9</p>
              <p className="text-gray-500 text-xs mt-1">+15分/好评</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">按时付款</p>
              <p className="text-2xl font-bold text-cyan-400">100%</p>
              <p className="text-gray-500 text-xs mt-1">+10分/次</p>
            </div>
          </div>
          {/* 积分变动记录 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">积分变动</h2>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暂无积分变动记录</p>
            ) : (
              <div className="space-y-3">
                {history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">+</span>
                      <div>
                        <p className="text-white">{item.desc}</p>
                        <p className="text-gray-500 text-xs">{item.date}</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-semibold">+{item.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    
  )
}
