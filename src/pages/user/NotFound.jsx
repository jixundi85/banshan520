import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 数字 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 blur-[80px] rounded-full"></div>
        </div>

        {/* 标题 */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          页面不存在
        </h2>

        {/* 描述 */}
        <p className="text-gray-400 mb-8">
          抱歉，您访问的页面可能已被移除或地址有误
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/20"
          >
            <Home className="w-5 h-5" />
            返回首页
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            返回上页
          </button>
        </div>

        {/* 搜索提示 */}
        <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-gray-400 text-sm mb-2">或者试试搜索</p>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-white/10">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索您需要的内容..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
            />
          </div>
        </div>

        {/* 快捷链接 */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            { label: '首页', path: '/' },
            { label: '智力值认证', path: '/training' },
            { label: '企业需求仓', path: '/demand' },
            { label: '创作者工具', path: '/tools' },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
