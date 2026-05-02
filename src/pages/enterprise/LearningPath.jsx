import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// 企业升级路径规划 - 根据诊断结果生成学习路线
export default function LearningPath() {
  const [currentLevel, setCurrentLevel] = useState('L1')
  const [pathData, setPathData] = useState(null)
  useEffect(() => {
    // 获取企业诊断结果
    const diagnosisResult = localStorage.getItem('enterprise_diagnosis_result')
    if (diagnosisResult) {
      const result = JSON.parse(diagnosisResult)
      setCurrentLevel(result.level)
      generatePath(result)
    } else {
      // 默认L1路径
      generatePath({ level: 'L1', dimensions: { toolUsage: 50, workflow: 45, integration: 40, strategy: 35 } })
    }
  }, [])
  const generatePath = (diagnosis) => {
    const paths = {
      L1: {
        current: '工具使用者',
        target: '系统优化者',
        targetLevel: 'L2',
        duration: '3个月',
        milestones: [
          {
            phase: '第1阶段',
            title: 'AI工具入门',
            duration: '2周',
            courses: ['AI工具基础操作', '提示词工程入门', '内容生成实战'],
            tasks: ['完成3个工具的基础操作', '产出10条AI生成内容'],
            completed: diagnosis.dimensions.toolUsage >= 60
          },
          {
            phase: '第2阶段',
            title: '工作流搭建',
            duration: '4周',
            courses: ['工作流设计原理', 'AI内容矩阵构建', '效率优化技巧'],
            tasks: ['搭建1个完整工作流', '实现内容批量生产'],
            completed: diagnosis.dimensions.workflow >= 60
          },
          {
            phase: '第3阶段',
            title: '实战项目',
            duration: '6周',
            courses: ['项目管理基础', '团队协作方法', '质量把控体系'],
            tasks: ['完成2个实战项目', '获得项目验收通过'],
            completed: false
          }
        ]
      },
      L2: {
        current: '系统优化者',
        target: '智能领航者',
        targetLevel: 'L3',
        duration: '6个月',
        milestones: [
          {
            phase: '第1阶段',
            title: '系统集成',
            duration: '4周',
            courses: ['系统集成方法论', 'API对接实战', '数据中台建设'],
            tasks: ['完成3个系统对接', '建立数据中台'],
            completed: diagnosis.dimensions.integration >= 60
          },
          {
            phase: '第2阶段',
            title: '流程优化',
            duration: '8周',
            courses: ['业务流程再造', 'AI原生流程设计', '效率度量体系'],
            tasks: ['优化5个核心流程', '效率提升50%以上'],
            completed: diagnosis.dimensions.workflow >= 75
          },
          {
            phase: '第3阶段',
            title: '团队赋能',
            duration: '12周',
            courses: ['AI团队建设', '培训体系搭建', '知识管理'],
            tasks: ['培训20+员工', '建立内部知识库'],
            completed: false
          }
        ]
      },
      L3: {
        current: '智能领航者',
        target: '生态构建者',
        targetLevel: 'L4',
        duration: '12个月',
        milestones: [
          {
            phase: '第1阶段',
            title: '战略规划',
            duration: '8周',
            courses: ['AI战略规划', '数字化转型蓝图', '组织变革管理'],
            tasks: ['制定AI战略', '完成组织诊断'],
            completed: diagnosis.dimensions.strategy >= 70
          },
          {
            phase: '第2阶段',
            title: '生态布局',
            duration: '16周',
            courses: ['生态合作模式', '平台化运营', '价值链重构'],
            tasks: ['建立3+合作伙伴', '启动平台项目'],
            completed: false
          },
          {
            phase: '第3阶段',
            title: '行业引领',
            duration: '24周',
            courses: ['行业标准制定', '创新方法论', '生态治理'],
            tasks: ['输出行业标准', '举办生态大会'],
            completed: false
          }
        ]
      }
    }
    setPathData(paths[diagnosis.level] || paths.L1)
  }
  if (!pathData) return null
  const completedCount = pathData.milestones.filter(m => m.completed).length
  const progress = (completedCount / pathData.milestones.length) * 100
  return (
    
      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* 头部 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">升级路径规划</span>
            </h1>
            <p className="text-gray-400">基于诊断结果，为您定制的升级路线</p>
          </div>
          {/* 当前状态 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-2xl">
                  🏢
                </div>
                <div>
                  <p className="text-gray-400 text-sm">当前等级</p>
                  <p className="text-2xl font-bold text-white">{currentLevel} · {pathData.current}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-4xl">
                <span>→</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-2xl">
                  🚀
                </div>
                <div>
                  <p className="text-gray-400 text-sm">目标等级</p>
                  <p className="text-2xl font-bold text-white">{pathData.targetLevel} · {pathData.target}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">预计周期</p>
                <p className="text-xl font-bold text-amber-400">{pathData.duration}</p>
              </div>
            </div>
            {/* 总进度 */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">升级进度</span>
                <span className="text-white">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          {/* 阶段里程碑 */}
          <div className="space-y-6">
            {pathData.milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative bg-white/5 border rounded-2xl p-6 transition-all ${
                  milestone.completed
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : index === completedCount
                    ? 'border-violet-500/30'
                    : 'border-white/10 opacity-60'
                }`}
              >
                {/* 完成标记 */}
                {milestone.completed && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                )}
                {/* 进行中标记 */}
                {index === completedCount && !milestone.completed && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-violet-500/20 text-violet-400 text-sm rounded-full">
                    进行中
                  </div>
                )}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                    milestone.completed
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-violet-500/20 text-violet-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-semibold text-white">{milestone.title}</h3>
                      <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-xs rounded">
                        {milestone.duration}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{milestone.phase}</p>
                  </div>
                </div>
                {/* 课程内容 */}
                <div className="mb-4">
                  <p className="text-gray-500 text-sm mb-2">必修课程：</p>
                  <div className="flex flex-wrap gap-2">
                    {milestone.courses.map((course, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-lg">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
                {/* 任务清单 */}
                <div>
                  <p className="text-gray-500 text-sm mb-2">阶段任务：</p>
                  <div className="space-y-2">
                    {milestone.tasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                          milestone.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-500'
                        }`}>
                          {milestone.completed ? '✓' : i + 1}
                        </span>
                        <span className={milestone.completed ? 'text-gray-300 line-through' : 'text-gray-300'}>
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 操作按钮 */}
                {!milestone.completed && index === completedCount && (
                  <div className="mt-4 flex gap-3">
                    <Link
                      to="/boss-academy"
                      className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm rounded-lg"
                    >
                      开始学习
                    </Link>
                    <button className="px-4 py-2 bg-white/5 text-gray-300 text-sm rounded-lg hover:bg-white/10">
                      查看详情
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* 底部提示 */}
          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-amber-400 text-sm">
              <span className="font-semibold">💡 提示：</span>
              完成每个阶段的学习和任务后，系统会自动更新您的进度。达到L2等级后，您将解锁更多平台权益和项目机会。
            </p>
          </div>
        </div>
      </div>
    
  )
}
