import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Building2, Award, Shield, Zap, Crown, Star,
  TrendingUp, Users, CheckCircle2, ChevronRight, Lock,
  Gem, Target, Sparkles, BadgeCheck
} from 'lucide-react'
import SiteHeader from '../../components/SiteHeader'

// 企业等级体系
const enterpriseLevels = [
  {
    level: 1,
    name: '探索企业',
    nameEn: 'Explorer',
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: Building2,
    requirements: ['完成企业AI诊断', '注册企业账号'],
    benefits: [
      '基础AI能力评估报告',
      '公开课程免费学习',
      '社区基础交流权限',
      '每月3次免费咨询'
    ],
    commission: '15%',
    priority: '标准'
  },
  {
    level: 2,
    name: '成长企业',
    nameEn: 'Growth',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: TrendingUp,
    requirements: ['完成Boss公开课学习', '发布3个以上需求', '项目交付满意度≥4.0'],
    benefits: [
      '进阶AI能力评估报告',
      'Boss公开课8折优惠',
      '智配中心优先展示',
      '每月5次免费咨询',
      '专属客服支持'
    ],
    commission: '12%',
    priority: '优先'
  },
  {
    level: 3,
    name: '认证企业',
    nameEn: 'Certified',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: BadgeCheck,
    requirements: ['完成私董营学习', '累计成交10万+', '项目交付满意度≥4.5'],
    benefits: [
      '完整AI能力评估报告',
      'Boss公开课5折优惠',
      '智配中心置顶展示',
      '无限次免费咨询',
      '1v1专属顾问',
      '线下活动优先参与'
    ],
    commission: '10%',
    priority: '高优'
  },
  {
    level: 4,
    name: '标杆企业',
    nameEn: 'Benchmark',
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: Crown,
    requirements: ['私董会成员', '累计成交50万+', '项目交付满意度≥4.8', '行业影响力认证'],
    benefits: [
      '定制化AI战略规划',
      'Boss公开课免费学习',
      '智配中心首页推荐',
      '专属技术团队支持',
      '行业峰会演讲机会',
      '平台资源深度合作'
    ],
    commission: '8%',
    priority: '最高'
  }
]

// 认证流程
const certificationSteps = [
  {
    step: 1,
    title: '提交申请',
    description: '填写企业信息，上传营业执照',
    icon: Building2
  },
  {
    step: 2,
    title: '能力评估',
    description: '完成企业AI诊断问卷',
    icon: Target
  },
  {
    step: 3,
    title: '资质审核',
    description: '平台审核企业资质与需求',
    icon: Shield
  },
  {
    step: 4,
    title: '等级评定',
    description: '系统根据评估结果自动定级',
    icon: Award
  },
  {
    step: 5,
    title: '权益开通',
    description: '享受对应等级的专属权益',
    icon: Sparkles
  }
]

// 标杆企业案例
const benchmarkCases = [
  {
    name: '某制造业集团',
    industry: '智能制造',
    level: 4,
    achievement: 'AI质检降本60%',
    logo: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=200&auto=format&fit=crop'
  },
  {
    name: '某电商平台',
    industry: '电商零售',
    level: 4,
    achievement: 'AI客服效率提升400%',
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&auto=format&fit=crop'
  },
  {
    name: '某教育机构',
    industry: '在线教育',
    level: 3,
    achievement: 'AI课程月销破500万',
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&auto=format&fit=crop'
  },
  {
    name: '某传媒公司',
    industry: '内容创作',
    level: 3,
    achievement: 'AI内容产能提升15倍',
    logo: 'https://images.unsplash.com/photo-1492724441997-9dc5bcdc693a?w=200&auto=format&fit=crop'
  }
]

export default function EnterpriseLevel() {
  const navigate = useNavigate()
  const [selectedLevel, setSelectedLevel] = useState(3)
  const currentLevel = enterpriseLevels.find(l => l.level === selectedLevel)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SiteHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              企业能力认证体系
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              企业等级体系
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              从探索到标杆，四级进阶体系助力企业AI能力全面升级<br/>
              更高等级，更多权益，更强竞争力
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
                <span>官方认证标识</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>优先派单权益</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Gem className="w-5 h-5 text-purple-400" />
                <span>专属服务支持</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Selector */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-2 py-4">
            {enterpriseLevels.map(level => {
              const Icon = level.icon
              return (
                <button
                  key={level.level}
                  onClick={() => setSelectedLevel(level.level)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedLevel === level.level
                      ? `bg-gradient-to-r ${level.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{level.name}</span>
                  <span className="sm:hidden">L{level.level}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Level Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentLevel && (
          <div className={`${currentLevel.bgColor} rounded-3xl p-8 lg:p-12 border-2 ${currentLevel.borderColor}`}>
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left: Level Info */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentLevel.color} flex items-center justify-center shadow-lg`}>
                    <currentLevel.icon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold text-gray-900">{currentLevel.name}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${currentLevel.color} text-white`}>
                        L{currentLevel.level}
                      </span>
                    </div>
                    <p className="text-gray-500 text-lg">{currentLevel.nameEn}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-gray-400" />
                      升级条件
                    </h3>
                    <ul className="space-y-2">
                      {currentLevel.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-500 mb-1">平台服务费</div>
                      <div className="text-2xl font-bold text-gray-900">{currentLevel.commission}</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-500 mb-1">派单优先级</div>
                      <div className="text-2xl font-bold text-gray-900">{currentLevel.priority}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Benefits */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  专属权益
                </h3>
                <div className="space-y-3">
                  {currentLevel.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentLevel.color} flex items-center justify-center flex-shrink-0`}>
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full mt-6 bg-gradient-to-r ${currentLevel.color} text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2`}>
                  {selectedLevel === 1 ? '立即认证' : '申请升级'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Certification Process */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">认证流程</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {certificationSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{step.step}</div>
                  <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
                {idx < certificationSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benchmark Cases */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">标杆企业</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benchmarkCases.map((company, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-gray-900">{company.name}</h4>
                    {company.level === 4 && (
                      <Crown className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{company.industry}</p>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
                    {company.achievement}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">等级权益对比</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left font-bold text-gray-900">权益项目</th>
                    {enterpriseLevels.map(level => (
                      <th key={level.level} className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gradient-to-r ${level.color} text-white`}>
                          <level.icon className="w-3 h-3" />
                          {level.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-6 py-4 text-gray-700">平台服务费</td>
                    {enterpriseLevels.map(level => (
                      <td key={level.level} className="px-6 py-4 text-center font-medium text-gray-900">
                        {level.commission}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">派单优先级</td>
                    {enterpriseLevels.map(level => (
                      <td key={level.level} className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
                          level.priority === '最高' ? 'bg-amber-100 text-amber-700' :
                          level.priority === '高优' ? 'bg-purple-100 text-purple-700' :
                          level.priority === '优先' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {level.priority}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Boss公开课</td>
                    <td className="px-6 py-4 text-center text-gray-500">原价</td>
                    <td className="px-6 py-4 text-center text-blue-600 font-medium">8折</td>
                    <td className="px-6 py-4 text-center text-purple-600 font-medium">5折</td>
                    <td className="px-6 py-4 text-center text-amber-600 font-medium">免费</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">智配中心展示</td>
                    <td className="px-6 py-4 text-center text-gray-500">标准</td>
                    <td className="px-6 py-4 text-center text-blue-600 font-medium">优先</td>
                    <td className="px-6 py-4 text-center text-purple-600 font-medium">置顶</td>
                    <td className="px-6 py-4 text-center text-amber-600 font-medium">首页推荐</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">专属顾问</td>
                    <td className="px-6 py-4 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-6 py-4 text-center text-green-600"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-green-600"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">线下活动</td>
                    <td className="px-6 py-4 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-6 py-4 text-center text-green-600"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-green-600"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">开启企业认证之旅</h2>
          <p className="text-white/70 mb-8 text-lg">
            立即完成企业AI诊断，获取专属等级认证，解锁更多商业机会
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/enterprise-guide')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-shadow"
            >
              开始企业诊断
            </button>
            <button 
              onClick={() => navigate('/private-club')}
              className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
            >
              了解私董汇
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
