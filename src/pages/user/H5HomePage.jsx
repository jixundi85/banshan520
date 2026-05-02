import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// H5 移动端首页
export default function H5HomePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-sm">⚡</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AIGC
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400">
              🔔
            </button>
            <Link to="/login" className="px-4 py-1.5 bg-purple-500 text-white text-sm rounded-full">
              登录
            </Link>
          </div>
        </div>
      </header>

      {/* 首页内容 */}
      <div className="px-4 py-4">
        {/* 搜索栏 */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索课程、创作者..."
              className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Banner轮播 */}
        <div className="mb-6">
          <div className="h-40 rounded-2xl bg-gradient-to-r from-purple-500/30 to-blue-500/30 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white text-lg font-semibold mb-2">AIGC 创作新时代</p>
              <p className="text-gray-300 text-sm mb-4">零基础学习 AI 创作，开启创收之路</p>
              <button className="px-6 py-2 bg-purple-500 text-white text-sm rounded-full">
                立即学习
              </button>
            </div>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: '📚', label: '课程' },
            { icon: '💼', label: '需求' },
            { icon: '👨‍🎨', label: '创作者' },
            { icon: '💬', label: '社区' }
          ].map(item => (
            <Link
              key={item.label}
              to={`/${item.label === '课程' ? 'training' : item.label === '需求' ? 'demand' : item.label === '创作者' ? 'creator' : 'community'}`}
              className="flex flex-col items-center p-3 bg-white/5 rounded-xl"
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs text-gray-400">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* 热门课程 */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">热门课程</h2>
            <Link to="/training" className="text-sm text-purple-400">查看全部</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-shrink-0 w-48 bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
                <div className="h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-white mb-1 line-clamp-1">AI 图像生成实战</h3>
                  <p className="text-xs text-gray-400 mb-2">¥599</p>
                  <button className="w-full py-1.5 bg-purple-500 text-white text-xs rounded-lg">
                    立即学习
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 认证创作者 */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">认证创作者</h2>
            <Link to="/creator" className="text-sm text-purple-400">查看全部</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-shrink-0 w-28 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 mb-2"></div>
                <p className="text-xs text-white font-medium">创意工坊</p>
                <p className="text-xs text-gray-500">4.9分</p>
              </div>
            ))}
          </div>
        </section>

        {/* 热门需求 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">最新需求</h2>
            <Link to="/demand" className="text-sm text-purple-400">查看全部</Link>
          </div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white">企业品牌宣传片制作</h3>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">进行中</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">预算: ¥5,000-10,000</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">3个提案</span>
                  <button className="px-3 py-1 bg-white/10 text-white text-xs rounded-lg">
                    查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/5 z-50">
        <div className="flex justify-around py-2">
          {[
            { icon: '🏠', label: '首页', active: true },
            { icon: '📚', label: '课程', active: false },
            { icon: '💼', label: '需求', active: false },
            { icon: '💬', label: '社区', active: false },
            { icon: '👤', label: '我的', active: false }
          ].map(item => (
            <Link
              key={item.label}
              to={item.label === '首页' ? '/' : `/${item.label === '课程' ? 'training' : item.label === '需求' ? 'demand' : item.label === '社区' ? 'community' : item.label === '我的' ? '/user/creator' : '/'}`}
              className={`flex flex-col items-center py-1 px-3 ${item.active ? 'text-purple-400' : 'text-gray-500'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
