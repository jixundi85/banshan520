import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { opcService, reviewService } from '../../services/dataService'
// 认证分类映射
const CATEGORY_MAP = {
  shortvideo: 'AI短视频',
  shortdrama: 'AI短剧',
  mangadrama: 'AI漫剧',
  film: 'AI电影',
  designer: 'AI设计师',
  commerce: 'AI带货变现'
}
export default function OPCProfile() {
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [levelUpInfo, setLevelUpInfo] = useState(null)
  const [creditScore, setCreditScore] = useState(null)
  const [opcCert, setOpcCert] = useState(null)
  useEffect(() => {
    // 使用新的数据服务获取档案
    const opcProfile = opcService.getProfile()
    const assessment = opcService.getAssessmentResult()
    
    if (assessment) {
      setProfile({
        ...assessment,
        name: opcProfile.name,
        creditScore: opcProfile.creditScore,
      })
    } else if (opcProfile.level !== 'L0') {
      // 有档案但没有评估结果
      setProfile({
        level: opcProfile.level,
        levelName: opcProfile.levelName,
        name: opcProfile.name,
        creditScore: opcProfile.creditScore,
        tags: opcProfile.tags || [],
      })
    }
    // 获取项目履历
    const opcProjects = opcService.getProjects()
    setProjects(opcProjects)
    // 检查是否可以升级
    const levelUpCheck = opcService.checkLevelUp()
    if (levelUpCheck.canLevelUp) {
      setLevelUpInfo(levelUpCheck)
    }
    // 获取信用分
    const score = reviewService.getCreditScore(opcProfile.id, 'opc')
    setCreditScore(score)
    // 获取OPC认证数据
    const certData = localStorage.getItem('opcCertification')
    if (certData) {
      setOpcCert(JSON.parse(certData))
    }
  }, [])
  if (!profile) {
    return (
      
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto">
              📝
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">尚未完成能力评估</h1>
            <p className="text-gray-400 mb-6">完成评估后即可查看您的OPC档案</p>
            <Link
              to="/opc-assessment"
              className="inline-block px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-xl"
            >
              开始评估
            </Link>
          </div>
        </div>
      
    )
  }
  const handleLevelUp = () => {
    const result = opcService.performLevelUp(levelUpInfo.nextLevel)
    if (result.success) {
      alert(`🎉 恭喜！您已晋升为 ${result.levelName}(${result.newLevel})`)
      window.location.reload()
    }
  }
  const levelColors = {
    'L1': 'from-emerald-400 to-teal-500',
    'L2': 'from-cyan-400 to-blue-500',
    'L3': 'from-purple-400 to-violet-500',
    'L4': 'from-amber-400 to-yellow-500'
  }
  return (
    
      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 等级晋升提示 */}
          {levelUpInfo && (
            <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">🎉 恭喜！您可以升级了</h3>
                  <p className="text-gray-300">
                    当前已完成 {levelUpInfo.currentProjects} 个项目，平均评分 {levelUpInfo.currentRating} 分
                  </p>
                  <p className="text-amber-400 text-sm mt-1">
                    满足 {levelUpInfo.nextLevel} 升级条件（需 {levelUpInfo.requiredProjects} 个项目，{levelUpInfo.requiredRating} 分评分）
                  </p>
                </div>
                <button
                  onClick={handleLevelUp}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all"
                >
                  立即升级
                </button>
              </div>
            </div>
          )}
          {/* 档案头部 */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* 等级徽章 */}
              <div className={`w-32 h-32 bg-gradient-to-br ${levelColors[profile.level] || levelColors['L1']} rounded-3xl flex items-center justify-center shadow-2xl flex-shrink-0`}>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{profile.level}</div>
                  <div className="text-white/80 text-xs">{profile.levelName}</div>
                </div>
              </div>
              {/* 基本信息 */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{profile.name || '我的OPC档案'}</h1>
                <p className="text-gray-400 mb-4">
                  {profile.completedAt ? `认证时间：${new Date(profile.completedAt).toLocaleDateString('zh-CN')}` : '尚未完成能力评估'}
                </p>
                
                {/* 信用分 */}
                {creditScore && (
                  <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                    <span className="text-gray-400">信用分：</span>
                    <span className={`font-bold ${creditScore.score >= 80 ? 'text-emerald-400' : creditScore.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {creditScore.score}
                    </span>
                    <span className="text-gray-500 text-sm">({creditScore.totalReviews}条评价)</span>
                  </div>
                )}
                
                {/* 能力标签 + OPC认证标签 */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {profile.tags?.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-violet-400 text-sm">
                      {tag}
                    </span>
                  ))}
                  {/* OPC认证通过的分类头衔 */}
                  {opcCert?.status === 'approved' && opcCert.categories?.map((catId, i) => (
                    <span 
                      key={`cert-${i}`} 
                      className="px-3 py-1 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/40 rounded-full text-cyan-300 text-sm font-medium"
                    >
                      {CATEGORY_MAP[catId] || catId}
                    </span>
                  ))}
                </div>
              </div>
              {/* 操作按钮 */}
              <div className="flex flex-col gap-3">
                <Link
                  to="/opc-assessment"
                  className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all text-center"
                >
                  重新评估
                </Link>
                <Link
                  to="/certification"
                  className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all text-center"
                >
                  认证中心
                </Link>
                <Link
                  to="/learning-path"
                  className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all text-center"
                >
                  升级路径
                </Link>
                <button
                  onClick={() => alert('证书下载功能开发中')}
                  className="px-6 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg hover:from-violet-500 hover:to-cyan-500 transition-all"
                >
                  下载证书
                </button>
              </div>
            </div>
          </div>
          {/* 能力雷达图区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* 四维度得分 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">能力维度</h2>
              <div className="space-y-4">
                {profile.scores ? [
                  { key: 'execution', name: '执行力', score: profile.scores.execution },
                  { key: 'architecture', name: '架构能力', score: profile.scores.architecture },
                  { key: 'coordination', name: '协调能力', score: profile.scores.coordination },
                  { key: 'strategy', name: '战略能力', score: profile.scores.strategy },
                ].map(item => (
                  <div key={item.key}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">{item.name}</span>
                      <span className="text-white font-semibold">{item.score}分</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-1000"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">尚未完成能力评估</p>
                    <Link
                      to="/opc-assessment"
                      className="inline-block px-6 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg"
                    >
                      去评估
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {/* 认证证书预览 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">认证证书</h2>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-violet-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">半山AIX认证</h3>
                <p className={`text-2xl font-bold bg-gradient-to-r ${levelColors[profile.level]} bg-clip-text text-transparent mb-2`}>
                  {profile.levelName}
                </p>
                <p className="text-gray-400 text-sm mb-4">碳硅共生平台 · OPC能力认证</p>
                <div className="text-xs text-gray-500">
                  证书编号：OPC-{profile.level}-{Date.now().toString().slice(-8)}
                </div>
              </div>
            </div>
          </div>
          {/* 项目履历 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">项目履历</h2>
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div>
                      <h3 className="text-white font-medium">{project.name}</h3>
                      <p className="text-gray-400 text-sm">{project.type} · {project.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-violet-400 font-semibold">¥{project.budget}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${project.status === '已完成' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {project.status}
                        </span>
                        {project.rating && (
                          <span className="text-yellow-400 text-xs">{'★'.repeat(project.rating)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">暂无项目履历</p>
                <Link
                  to="/demand"
                  className="inline-block px-6 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg"
                >
                  去接单
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    
  )
}
