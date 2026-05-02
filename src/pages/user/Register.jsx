import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiDataService from '../../services/apiDataService'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    agreeTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [smsCode, setSmsCode] = useState('')
  const [countdown, setCountdown] = useState(0)

  // 一键填充测试账号
  const fillTestAccount = (type) => {
    const accounts = {
      opc: { name: '测试OPC', phone: '13800138001', password: 'opc123456', confirmPassword: 'opc123456', role: 'OPC', agreeTerms: true },
      enterprise: { name: '测试企业', phone: '13800138002', password: 'enterprise123456', confirmPassword: 'enterprise123456', role: 'ENTERPRISE', agreeTerms: true },
      admin: { name: '测试管理员', phone: '13800138003', password: 'admin123456', confirmPassword: 'admin123456', role: 'ADMIN', agreeTerms: true },
      user: { name: '测试用户', phone: '13800138004', password: 'user123456', confirmPassword: 'user123456', role: 'USER', agreeTerms: true }
    }
    setFormData(accounts[type])
    setSmsCode('123456')
    setStep(2)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const sendSmsCode = async () => {
    if (!formData.phone || formData.phone.length !== 11) {
      alert('请输入正确的手机号')
      return
    }
    try {
      const result = await apiDataService.auth.sendSmsCode(formData.phone)
      alert(result.message || '验证码已发送（测试码：123456）')
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      alert(error.message || '发送验证码失败')
    }
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    if (step === 1) {
      if (!formData.name || !formData.phone) {
        alert('请填写完整信息')
        return
      }
      setStep(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('两次输入的密码不一致')
      return
    }
    if (!formData.agreeTerms) {
      alert('请同意用户协议')
      return
    }
    if (!smsCode) {
      alert('请输入验证码')
      return
    }
    
    setIsLoading(true)
    
    try {
      // 使用真实API注册
      await apiDataService.auth.register({
        phone: formData.phone,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        smsCode: smsCode
      })
      
      alert('注册成功！')
      navigate('/user/creator')
    } catch (error) {
      console.error('注册失败:', error)
      alert(error.message || '注册失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              半山AIX
            </span>
          </Link>
        </div>

        {/* 注册卡片 */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">创建账号</h1>
            <p className="text-gray-400">加入半山AIX社区，开启您的旅程</p>
          </div>

          {/* 步骤指示器 */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-purple-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-500 text-white' : 'bg-white/10'}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span className="text-sm">基本信息</span>
            </div>
            <div className="w-12 h-px bg-white/20"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-purple-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-500 text-white' : 'bg-white/10'}`}>
                2
              </div>
              <span className="text-sm">设置密码</span>
            </div>
          </div>

          <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                {/* 姓名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">真实姓名</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="请输入您的真实姓名"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  />
                </div>

                {/* 手机号 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">手机号码</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="请输入手机号码"
                    required
                    maxLength={11}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  />
                </div>

                {/* 角色选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">注册身份</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.role === 'USER' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5'}`}>
                      <input
                        type="radio"
                        name="role"
                        value="USER"
                        checked={formData.role === 'USER'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-white">普通用户</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.role === 'OPC' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5'}`}>
                      <input
                        type="radio"
                        name="role"
                        value="OPC"
                        checked={formData.role === 'OPC'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-white">OPC合伙人</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                >
                  下一步
                </button>
              </>
            )}

            {step === 2 && (
              <>
                {/* 密码 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">设置密码</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="请设置登录密码（至少8位）"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  />
                </div>

                {/* 确认密码 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">确认密码</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="请再次输入密码"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  />
                </div>

                {/* 验证码 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">验证码</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                      placeholder="请输入验证码"
                      required
                      maxLength={6}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={sendSmsCode}
                      disabled={countdown > 0}
                      className="px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white text-sm hover:bg-white/20 transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </button>
                  </div>
                </div>

                {/* 用户协议 */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-white/5 text-purple-500 focus:ring-purple-500/50"
                  />
                  <span className="text-sm text-gray-400">
                    我已阅读并同意
                    <Link to="/terms" className="text-purple-400 hover:text-purple-300 mx-1">《用户服务协议》</Link>
                    和
                    <Link to="/privacy" className="text-purple-400 hover:text-purple-300 mx-1">《隐私政策》</Link>
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
                  >
                    上一步
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        注册中...
                      </>
                    ) : '立即注册'}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* 测试账号提示 */}
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400">🧪</span>
              <span className="text-green-400 font-medium">一键注册测试账号（点击自动填充）</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => fillTestAccount('opc')}
                className="py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs rounded-lg transition-colors"
              >
                OPC用户
              </button>
              <button
                onClick={() => fillTestAccount('enterprise')}
                className="py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs rounded-lg transition-colors"
              >
                企业用户
              </button>
              <button
                onClick={() => fillTestAccount('admin')}
                className="py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs rounded-lg transition-colors"
              >
                管理员
              </button>
              <button
                onClick={() => fillTestAccount('user')}
                className="py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs rounded-lg transition-colors"
              >
                普通用户
              </button>
            </div>
            <p className="mt-3 text-xs text-green-400/80 text-center">验证码固定为：123456</p>
          </div>

          {/* 登录链接 */}
          <p className="mt-6 text-center text-gray-400">
            已有账号？
            <Link to="/login" className="text-purple-400 hover:text-purple-300 ml-1 transition-colors">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
