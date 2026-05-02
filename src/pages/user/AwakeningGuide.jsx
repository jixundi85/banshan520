import { useNavigate } from 'react-router-dom'
import { Brain, ArrowRight, Sparkles, Target, Zap, Users } from 'lucide-react'

export default function AwakeningGuide() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'AI工作站赋能',
      desc: '调用云端硅基工具链'
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: '全球需求匹配',
      desc: '对接企业真实需求'
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: '链上确权分润',
      desc: '创作成果永久归属'
    }
  ]

  const steps = [
    { num: '01', title: '能力诊断', desc: '3分钟评估你的创作潜能' },
    { num: '02', title: '智能匹配', desc: '系统推荐最适合的学习路径' },
    { num: '03', title: '签约变现', desc: '成为认证OPC开始接单' }
  ]

  const handleStartAssessment = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/register?type=opc&redirect=/opc-assessment')
    } else {
      navigate('/opc-assessment')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm">超级个体觉醒计划</span>
          </div>
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            开始你的
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              {' '}觉醒之旅
            </span>
          </h1>
          {/* Subtitle */}
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            加入OPC网络，调用云端硅基工具链，让你的灵魂密度成为最强印钞机
          </p>
          {/* CTA Button */}
          <button
            onClick={handleStartAssessment}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
          >
            <span>开始觉醒诊断</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-4 text-slate-500 text-sm">预计用时 3 分钟 · 30道评估题目</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">觉醒三步曲</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-purple-500/30 transition-colors"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                  <span className="text-white font-bold text-xl">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">1,247</div>
              <div className="text-slate-400 text-sm">认证OPC</div>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">¥2.4M</div>
              <div className="text-slate-400 text-sm">累计变现</div>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">892</div>
              <div className="text-slate-400 text-sm">完成项目</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">准备好开始了吗？</h2>
          <p className="text-slate-400 mb-8">3分钟完成诊断，发现你的创作潜能</p>
          <button
            onClick={handleStartAssessment}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5"
          >
            <Users className="w-5 h-5" />
            <span>立即开始觉醒诊断</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  )
}
