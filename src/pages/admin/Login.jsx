import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sparkles, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // 模拟登录
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-purple mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">半山AIX 管理后台</h1>
        </div>

        {/* Login Form */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 text-center">管理员登录</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="admin@aigc.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-12"
                  placeholder="请输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-dark-700 text-brand-blue" />
                记住我
              </label>
              <Link to="/forgot-password" className="text-sm text-brand-blue hover:underline">忘记密码？</Link>
            </div>

            <button type="submit" className="w-full btn-primary py-3">
              登录
            </button>
          </form>

          {/* 测试账号提示 */}
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400">🧪</span>
              <span className="text-green-400 font-medium">测试账号</span>
            </div>
            <div className="space-y-1 text-sm text-gray-400">
              <p><span className="text-gray-300">管理员：</span>admin@aigc.com / admin123</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@aigc.com')
                setPassword('admin123')
              }}
              className="mt-3 w-full py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm rounded-lg transition-colors"
            >
              一键填充测试账号
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
