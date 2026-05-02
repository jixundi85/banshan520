import { useNavigate } from 'react-router-dom'
import { Building2, ArrowRight, TrendingUp, Shield, Users, CheckCircle2 } from 'lucide-react'

export default function EnterpriseGuide() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: '智能诊断评估',
      desc: '全面评估企业AI就绪度'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: '私有化部署方案',
      desc: '定制化AI解决方案'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'OPC人才匹配',
      desc: '精准匹配专业创作者'
    }
  ]

  const paths = [
    {
      title: '路径一：去提升',
      subtitle: '私董汇 · 成长为先',
      desc: '通过Boss公开课、私董特训营系统提升企业AI能力，成为认证企业',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-blue-600 to-cyan-600',
    },
    {
      title: '路径二：解决需求',
      subtitle: '智配中心 · 立即匹配',
      desc: '直接发布需求，智能匹配认证OPC，快速解决企业AI落地问题',
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600',
    }
  ]

  const handleStartDiagnosis = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/register?type=enterprise&redirect=/enterprise-diagnosis')
    } else {
      navigate('/enterprise-diagnosis')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-8">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm">企业智能升级计划</span>
          </div>
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            开启企业
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {' '}智能升级
            </span>
          </h1>
          {/* Subtitle */}
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            AI私有化部署方案定制，降本增效一站式解决，让硅基算力成为你的核心竞争力
          </p>
          {/* CTA Button */}
          <button
            onClick={handleStartDiagnosis}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-semibold text-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
          >
            <span>立即智能诊断</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-4 text-slate-500 text-sm">预计用时 5 分钟 · 25道诊断题目</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 transition-all backdrop-blur-sm"
              >
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Paths Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-4">诊断后，你将获得专属升级路径</h2>
          <p className="text-slate-400 text-center mb-12">根据诊断结果，系统自动推荐最适合你的方案</p>

          <div className="grid md:grid-cols-2 gap-6">
            {paths.map((path, index) => (
              <div
                key={index}
                className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${path.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {path.icon}
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{path.title}</h3>
                <p className="text-blue-400 text-sm mb-4">{path.subtitle}</p>
                <p className="text-slate-400 mb-6 leading-relaxed">{path.desc}</p>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span>诊断后自动进入</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">386</div>
              <div className="text-slate-400 text-sm">合作企业</div>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">30%</div>
              <div className="text-slate-400 text-sm">平均降本</div>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">98%</div>
              <div className="text-slate-400 text-sm">满意度</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">准备好升级了吗？</h2>
          <p className="text-slate-400 mb-8">5分钟完成诊断，获取专属升级方案</p>
          <button
            onClick={handleStartDiagnosis}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-semibold text-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            <Building2 className="w-5 h-5" />
            <span>立即开始智能诊断</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  )
}
