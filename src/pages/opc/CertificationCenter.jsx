import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Award, Shield, Zap, Star, CheckCircle, Clock, 
  ChevronRight, Users, TrendingUp, Gift, Lock, 
  BarChart3, Target, Briefcase, BookOpen, FileCheck
} from 'lucide-react'
// 认证等级配置
const CERTIFICATION_LEVELS = {
  junior: {
    id: 'junior',
    name: '初级OPC',
    title: 'OPC认证创作者',
    color: '#22c55e', // 绿色
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-500/10 to-emerald-600/5',
    borderColor: 'border-green-500/30',
    badgeColor: 'bg-green-500',
    requirements: [
      { text: '完成特训营基础课程', icon: BookOpen },
      { text: '通过基础技能考核（线上答题）', icon: FileCheck },
      { text: '提交至少1个代表作品', icon: Star },
      { text: '无不良记录', icon: Shield }
    ],
    benefits: [
      { text: '平台基础流量扶持', icon: TrendingUp },
      { text: '可接取5万元以下需求订单', icon: Briefcase },
      { text: '15%平台抽佣', icon: BarChart3 },
      { text: '基础工具集使用权限', icon: Zap }
    ],
    upgradeConditions: [
      '完成10单以上订单交付',
      '客户满意度≥90%',
      '通过进阶技能考核'
    ]
  },
  middle: {
    id: 'middle',
    name: '中级OPC',
    title: '资深OPC创作者',
    color: '#3b82f6', // 蓝色
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-500/10 to-indigo-600/5',
    borderColor: 'border-blue-500/30',
    badgeColor: 'bg-blue-500',
    requirements: [
      { text: '持有初级OPC认证', icon: Award },
      { text: '累计完成10单以上订单', icon: CheckCircle },
      { text: '客户满意度≥90%', icon: Star },
      { text: '通过进阶技能考核', icon: FileCheck }
    ],
    benefits: [
      { text: '平台优质流量扶持', icon: TrendingUp },
      { text: '可接取20万元以下需求订单', icon: Briefcase },
      { text: '12%平台抽佣', icon: BarChart3 },
      { text: '高级工具集使用权限', icon: Zap },
      { text: '优先推荐资格', icon: Target }
    ],
    upgradeConditions: [
      '完成50单以上订单交付',
      '客户满意度≥95%',
      '3个以上优质企业案例',
      '通过专家评审'
    ]
  },
  senior: {
    id: 'senior',
    name: '高级OPC',
    title: '专家OPC创作者',
    color: '#a855f7', // 紫色
    gradient: 'from-purple-500 to-violet-600',
    bgGradient: 'from-purple-500/10 to-violet-600/5',
    borderColor: 'border-purple-500/30',
    badgeColor: 'bg-purple-500',
    requirements: [
      { text: '持有中级OPC认证', icon: Award },
      { text: '累计完成50单以上订单', icon: CheckCircle },
      { text: '客户满意度≥95%', icon: Star },
      { text: '3个以上优质企业案例', icon: Briefcase },
      { text: '通过专家评审', icon: FileCheck }
    ],
    benefits: [
      { text: '平台核心流量扶持', icon: TrendingUp },
      { text: '可接取任意金额需求订单', icon: Briefcase },
      { text: '8%平台抽佣', icon: BarChart3 },
      { text: '全功能工具集使用权限', icon: Zap },
      { text: '首页推荐位展示', icon: Star },
      { text: '专属客服支持', icon: Users },
      { text: '线下活动邀请资格', icon: Gift }
    ],
    upgradeConditions: []
  }
}
// 模拟用户认证数据
const getUserCertificationData = () => {
  const stored = localStorage.getItem('opc_certification_data')
  if (stored) {
    return JSON.parse(stored)
  }
  // 默认初级认证
  return {
    currentLevel: 'junior',
    completedOrders: 0,
    satisfactionRate: 0,
    caseCount: 0,
    examPassed: [],
    isPending: false,
    certificationDate: null,
    lastUpgradeRequest: null
  }
}
export default function CertificationCenter() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(getUserCertificationData())
  const [activeTab, setActiveTab] = useState('levels')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeSuccess, setUpgradeSuccess] = useState(false)
  useEffect(() => {
    // 刷新用户数据
    setUserData(getUserCertificationData())
  }, [])
  const currentLevelConfig = CERTIFICATION_LEVELS[userData.currentLevel]
  
  // 检查升级条件
  const checkUpgradeAvailable = () => {
    if (userData.currentLevel === 'senior') return false
    
    const nextLevel = userData.currentLevel === 'junior' ? 'middle' : 'senior'
    const conditions = CERTIFICATION_LEVELS[nextLevel].upgradeConditions
    
    // 简化判断：至少完成对应订单数
    const requiredOrders = nextLevel === 'middle' ? 10 : 50
    return userData.completedOrders >= requiredOrders
  }
  const canUpgrade = checkUpgradeAvailable()
  // 申请升级
  const handleUpgradeRequest = () => {
    // 模拟升级申请
    const updatedData = {
      ...userData,
      isPending: true,
      pendingLevel: userData.currentLevel === 'junior' ? 'middle' : 'senior',
      lastUpgradeRequest: new Date().toISOString()
    }
    localStorage.setItem('opc_certification_data', JSON.stringify(updatedData))
    setUserData(updatedData)
    setUpgradeSuccess(true)
  }
  // 重置成功状态
  const closeUpgradeModal = () => {
    setShowUpgradeModal(false)
    setUpgradeSuccess(false)
  }
  return (
    
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 头部 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-4">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">OPC认证体系</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                OPC认证中心
              </span>
            </h1>
            <p className="text-gray-400">通过等级认证，解锁更多平台权益，开启变现之旅</p>
          </div>
          {/* 当前认证状态卡片 */}
          <div className={`mb-8 bg-gradient-to-br ${currentLevelConfig.bgGradient} border ${currentLevelConfig.borderColor} rounded-3xl p-8`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* 认证徽章 */}
              <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${currentLevelConfig.gradient} flex items-center justify-center shadow-lg`}>
                <div className="text-center">
                  <Award className="w-12 h-12 text-white mx-auto mb-2" />
                  <span className="text-white font-bold text-lg">{currentLevelConfig.name}</span>
                </div>
              </div>
              {/* 认证信息 */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{currentLevelConfig.title}</h2>
                <p className="text-gray-400 mb-4">认证时间：{userData.certificationDate || '2026-04-16'}</p>
                
                {/* 统计信息 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{userData.completedOrders}</div>
                    <div className="text-gray-400 text-sm">完成订单</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{userData.satisfactionRate}%</div>
                    <div className="text-gray-400 text-sm">客户满意度</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{userData.caseCount}</div>
                    <div className="text-gray-400 text-sm">优质案例</div>
                  </div>
                </div>
              </div>
              {/* 升级按钮 */}
              <div className="flex flex-col gap-3">
                {userData.currentLevel !== 'senior' && (
                  canUpgrade ? (
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className={`px-6 py-3 bg-gradient-to-r ${CERTIFICATION_LEVELS[userData.currentLevel === 'junior' ? 'middle' : 'senior'].gradient} text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2`}
                    >
                      申请升级
                      <ChevronRight size={18} />
                    </button>
                  ) : (
                    <div className="px-6 py-3 bg-white/5 text-gray-400 rounded-xl flex items-center gap-2">
                      <Lock size={18} />
                      升级条件未满足
                    </div>
                  )
                )}
                <Link
                  to="/training"
                  className="px-6 py-3 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-all text-center"
                >
                  学习课程
                </Link>
              </div>
            </div>
            {/* 待审核提示 */}
            {userData.isPending && (
              <div className="mt-6 p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300">
                  您的升级申请正在审核中，预计3个工作日内完成
                </span>
              </div>
            )}
          </div>
          {/* Tab切换 */}
          <div className="flex justify-center gap-4 mb-8">
            {[
              { key: 'levels', label: '认证等级', icon: Award },
              { key: 'benefits', label: '权益说明', icon: Gift },
              { key: 'upgrade', label: '升级通道', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
          {/* 认证等级 Tab */}
          {activeTab === 'levels' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.values(CERTIFICATION_LEVELS).map(level => {
                const isCurrentLevel = userData.currentLevel === level.id
                const isLocked = 
                  (level.id === 'middle' && userData.currentLevel === 'junior') ||
                  (level.id === 'senior' && userData.currentLevel !== 'middle' && userData.currentLevel !== 'senior')
                
                return (
                  <div
                    key={level.id}
                    className={`relative bg-white/5 border rounded-2xl p-6 transition-all ${
                      isCurrentLevel
                        ? `${level.borderColor} shadow-lg`
                        : isLocked
                        ? 'border-white/10 opacity-60'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* 当前等级标识 */}
                    {isCurrentLevel && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full">
                        当前等级
                      </div>
                    )}
                    {/* 锁定标识 */}
                    {isLocked && (
                      <div className="absolute top-4 right-4">
                        <Lock className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    {/* 等级徽章 */}
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${level.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white text-center mb-2">{level.name}</h3>
                    <p className="text-gray-400 text-center text-sm mb-6">{level.title}</p>
                    {/* 认证要求 */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">认证要求</h4>
                      <div className="space-y-2">
                        {level.requirements.map((req, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <req.icon className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span className="text-gray-400">{req.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* 权益 */}
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">等级权益</h4>
                      <div className="space-y-2">
                        {level.benefits.slice(0, 3).map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                            <span className="text-gray-400">{benefit.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {/* 权益说明 Tab */}
          {activeTab === 'benefits' && (
            <div className="space-y-6">
              {Object.values(CERTIFICATION_LEVELS).map(level => (
                <div key={level.id} className={`bg-gradient-to-br ${level.bgGradient} border ${level.borderColor} rounded-2xl p-6`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.gradient} flex items-center justify-center`}>
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{level.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {level.benefits.map((benefit, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4">
                        <benefit.icon className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-300">{benefit.text}</p>
                      </div>
                    ))}
                  </div>
                  {level.upgradeConditions.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">升级条件</h4>
                      <div className="flex flex-wrap gap-2">
                        {level.upgradeConditions.map((condition, i) => (
                          <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-400">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* 升级通道 Tab */}
          {activeTab === 'upgrade' && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">当前升级通道</h3>
                
                {userData.currentLevel === 'junior' && (
                  <div className="space-y-4">
                    <UpgradePath
                      from={CERTIFICATION_LEVELS.junior}
                      to={CERTIFICATION_LEVELS.middle}
                      currentProgress={{
                        orders: userData.completedOrders,
                        targetOrders: 10,
                        satisfaction: userData.satisfactionRate,
                        targetSatisfaction: 90
                      }}
                      canUpgrade={canUpgrade}
                      onUpgrade={() => setShowUpgradeModal(true)}
                    />
                  </div>
                )}
                
                {userData.currentLevel === 'middle' && (
                  <div className="space-y-4">
                    <UpgradePath
                      from={CERTIFICATION_LEVELS.middle}
                      to={CERTIFICATION_LEVELS.senior}
                      currentProgress={{
                        orders: userData.completedOrders,
                        targetOrders: 50,
                        satisfaction: userData.satisfactionRate,
                        targetSatisfaction: 95,
                        cases: userData.caseCount,
                        targetCases: 3
                      }}
                      canUpgrade={canUpgrade}
                      onUpgrade={() => setShowUpgradeModal(true)}
                    />
                  </div>
                )}
                {userData.currentLevel === 'senior' && (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">您已达到最高等级</h4>
                    <p className="text-gray-400">感谢您为平台做出的贡献，继续保持！</p>
                  </div>
                )}
              </div>
              {/* 快速通道 */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Zap className="w-8 h-8 text-amber-400" />
                  <div>
                    <h3 className="text-lg font-bold text-white">绿色签约通道</h3>
                    <p className="text-gray-400 text-sm">专业创作者可一键申请签约</p>
                  </div>
                </div>
                <Link
                  to="/opc-certification"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all text-center block"
                >
                  立即申请签约
                </Link>
              </div>
            </div>
          )}
        </div>
        {/* 升级确认弹窗 */}
        {showUpgradeModal && (
          <UpgradeModal
            level={userData.currentLevel === 'junior' ? 'middle' : 'senior'}
            onConfirm={handleUpgradeRequest}
            onClose={closeUpgradeModal}
            success={upgradeSuccess}
          />
        )}
      </div>
    
  )
}
// 升级路径组件
function UpgradePath({ from, to, currentProgress, canUpgrade, onUpgrade }) {
  return (
    <div className="bg-white/5 rounded-xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${from.gradient} text-white font-bold`}>
          {from.name}
        </div>
        <ChevronRight className="w-6 h-6 text-gray-400" />
        <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${to.gradient} text-white font-bold`}>
          {to.name}
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">完成订单数</span>
            <span className="text-white">{currentProgress.orders} / {currentProgress.targetOrders}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${from.gradient} transition-all`}
              style={{ width: `${Math.min(100, (currentProgress.orders / currentProgress.targetOrders) * 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">客户满意度</span>
            <span className="text-white">{currentProgress.satisfaction}% / {currentProgress.targetSatisfaction}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${from.gradient} transition-all`}
              style={{ width: `${Math.min(100, (currentProgress.satisfaction / currentProgress.targetSatisfaction) * 100)}%` }}
            />
          </div>
        </div>
        {currentProgress.cases !== undefined && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">优质案例数</span>
              <span className="text-white">{currentProgress.cases} / {currentProgress.targetCases}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full ${from.gradient} transition-all`}
                style={{ width: `${Math.min(100, (currentProgress.cases / currentProgress.targetCases) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
      {canUpgrade ? (
        <button
          onClick={onUpgrade}
          className={`w-full py-3 bg-gradient-to-r ${to.gradient} text-white font-bold rounded-xl hover:opacity-90 transition-all`}
        >
          申请升级至{to.name}
        </button>
      ) : (
        <div className="text-center py-3 text-gray-400 text-sm">
          继续完成更多订单，满足升级条件后可申请升级
        </div>
      )}
    </div>
  )
}
// 升级确认弹窗
function UpgradeModal({ level, onConfirm, onClose, success }) {
  const levelConfig = CERTIFICATION_LEVELS[level]
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-md">
        {success ? (
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">升级申请已提交</h3>
              <p className="text-gray-400 mb-6">
                您的升级申请已提交，审核结果将在3个工作日内通过站内消息和短信通知您
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-all"
            >
              我知道了
            </button>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${levelConfig.gradient} flex items-center justify-center mb-4`}>
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">确认升级至{levelConfig.name}</h3>
              <p className="text-gray-400 text-sm">升级后将享受更多平台权益和更低的抽佣比例</p>
            </div>
            <div className={`bg-gradient-to-br ${levelConfig.bgGradient} border ${levelConfig.borderColor} rounded-xl p-4 mb-6`}>
              <h4 className="text-sm font-medium text-gray-300 mb-3">升级后新增权益</h4>
              <div className="space-y-2">
                {levelConfig.benefits.slice(0, 3).map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-white/10 text-gray-300 font-medium rounded-xl hover:bg-white/20 transition-all"
              >
                取消
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-3 bg-gradient-to-r ${levelConfig.gradient} text-white font-bold rounded-xl hover:opacity-90 transition-all`}
              >
                确认升级
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
