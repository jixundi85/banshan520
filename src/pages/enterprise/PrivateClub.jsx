import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Crown, Users, Target, TrendingUp, Award, 
  BookOpen, Video, MessageCircle, ChevronRight, Star,
  Zap, Shield, Clock, CheckCircle2
} from 'lucide-react'
import SiteHeader from '../../components/SiteHeader'

// 私董营课程数据
const clubPrograms = [
  {
    id: 1,
    title: 'AI商业操盘手私董营',
    subtitle: '第12期',
    description: '6个月深度陪跑，从0到1打造AI商业闭环',
    price: 29800,
    originalPrice: 39800,
    spots: 20,
    enrolled: 16,
    startDate: '2026-05-15',
    features: ['6个月1v1导师陪跑', '每周线上私董会', '线下闭门会2次', '终身校友资源'],
    tags: ['高阶', '线下+线上'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'AIGC内容变现特训营',
    subtitle: '第8期',
    description: '3个月掌握AI内容创作与商业变现全链路',
    price: 12800,
    originalPrice: 16800,
    spots: 50,
    enrolled: 43,
    startDate: '2026-05-20',
    features: ['3个月系统课程', '实战项目带练', '接单资源对接', '结业认证'],
    tags: ['进阶', '纯线上'],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop'
  }
]

// Boss公开课数据
const bossCourses = [
  {
    id: 1,
    title: 'AI时代企业数字化转型路径',
    instructor: '张明 | 前阿里VP',
    duration: '2小时',
    students: 3280,
    rating: 4.9,
    price: 199,
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'AIGC营销：从概念到落地',
    instructor: '李华 | 某头部MCN创始人',
    duration: '3小时',
    students: 2156,
    rating: 4.8,
    price: 299,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'AI Agent在企业中的实战应用',
    instructor: '王强 | AI独角兽CTO',
    duration: '2.5小时',
    students: 1890,
    rating: 4.9,
    price: 399,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&auto=format&fit=crop'
  },
  {
    id: 4,
    title: '内容团队的AI提效方法论',
    instructor: '陈静 | 千万级账号操盘手',
    duration: '2小时',
    students: 2567,
    rating: 4.7,
    price: 199,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&auto=format&fit=crop'
  }
]

// 学员成果
const studentAchievements = [
  { name: '刘总', company: '某制造业企业', result: '3个月AI降本40%', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop' },
  { name: '张总', company: '某电商公司', result: 'AI客服效率提升300%', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop' },
  { name: '李总', company: '某教育机构', result: 'AI课程月销破百万', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop' },
  { name: '王总', company: '某传媒公司', result: 'AI内容产能提升10倍', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&auto=format&fit=crop' }
]

export default function PrivateClub() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('club')

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
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Crown className="w-4 h-4" />
                企业成长加速计划
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                私董汇 × Boss公开课
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                为企业决策者打造的AI商业进化平台<br/>
                从认知升级到落地实战，全方位助力企业智能转型
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>500+ 企业家学员</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Target className="w-5 h-5 text-green-400" />
                  <span>平均降本增效 35%</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span>认证企业优先派单</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-amber-400 mb-2">98%</div>
                  <div className="text-white/70 text-sm">学员满意度</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
                  <div className="text-white/70 text-sm">项目落地率</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">200+</div>
                  <div className="text-white/70 text-sm">认证企业</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
                  <div className="text-white/70 text-sm">行业导师</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('club')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'club' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                私董特训营
              </div>
            </button>
            <button
              onClick={() => setActiveTab('boss')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'boss' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Boss公开课
              </div>
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'achievements' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                学员成果
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 私董特训营 */}
        {activeTab === 'club' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">私董特训营</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                深度陪跑式学习，小班制教学，每位学员配备专属导师，确保学习效果落地
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {clubPrograms.map(program => (
                <div key={program.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {program.tags.map(tag => (
                        <span key={tag} className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm">
                      <span className="text-orange-600 font-bold">{program.spots - program.enrolled}</span>
                      <span className="text-gray-600"> 个名额</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
                      <span className="text-blue-600 font-medium">{program.subtitle}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-orange-600">¥{program.price.toLocaleString()}</span>
                          <span className="text-gray-400 line-through">¥{program.originalPrice.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-gray-500">开课时间：{program.startDate}</div>
                      </div>
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-shadow">
                        立即报名
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 私董会权益 */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 text-white mt-12">
              <h3 className="text-2xl font-bold mb-6 text-center">私董会专属权益</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-amber-400" />
                  </div>
                  <h4 className="font-bold mb-2">高端人脉圈</h4>
                  <p className="text-white/70 text-sm">与500+企业家建立深度连接</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="font-bold mb-2">优先派单权</h4>
                  <p className="text-white/70 text-sm">智配中心需求优先匹配</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="font-bold mb-2">认证标识</h4>
                  <p className="text-white/70 text-sm">平台认证企业专属标识</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-purple-400" />
                  </div>
                  <h4 className="font-bold mb-2">终身校友</h4>
                  <p className="text-white/70 text-sm">结业后持续资源对接</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Boss公开课 */}
        {activeTab === 'boss' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Boss公开课</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                行业顶尖导师亲授，聚焦AI商业实战，每节课都是可落地的解决方案
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bossCourses.map(course => (
                <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {course.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.students}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400" />
                        {course.rating}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-orange-600">¥{course.price}</span>
                      <button className="text-blue-600 text-sm font-medium hover:underline">
                        立即学习
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 查看更多 */}
            <div className="text-center pt-8">
              <button 
                onClick={() => navigate('/boss-academy')}
                className="inline-flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all"
              >
                查看全部公开课
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* 学员成果 */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">学员成果</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                来自各行各业的企业决策者，通过私董汇实现AI商业突破
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {studentAchievements.map((student, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                  <img 
                    src={student.avatar} 
                    alt={student.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h4 className="font-bold text-gray-900 mb-1">{student.name}</h4>
                  <p className="text-sm text-gray-500 mb-3">{student.company}</p>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                    {student.result}
                  </div>
                </div>
              ))}
            </div>

            {/* 数据展示 */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center">
                <div className="text-5xl font-bold mb-2">¥2.8亿</div>
                <div className="text-blue-100">学员企业累计降本金额</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white text-center">
                <div className="text-5xl font-bold mb-2">350+</div>
                <div className="text-purple-100">AI项目成功落地</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white text-center">
                <div className="text-5xl font-bold mb-2">92%</div>
                <div className="text-orange-100">学员持续复购率</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">开启企业AI进化之旅</h2>
          <p className="text-white/70 mb-8 text-lg">
            加入私董汇，与500+企业家一起，抢占AI时代先机
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setActiveTab('club')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-shadow"
            >
              报名私董营
            </button>
            <button 
              onClick={() => navigate('/enterprise-guide')}
              className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
            >
              企业AI诊断
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
