import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const [paymentMethod, setPaymentMethod] = useState('alipay')
  const [isProcessing, setIsProcessing] = useState(false)

  // 模拟课程数据
  const course = location.state?.course || {
    id: 1,
    title: 'AI 图像生成实战',
    subtitle: '从零基础到商业变现',
    price: 599,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop'
  }

  const paymentMethods = [
    { id: 'alipay', name: '支付宝', icon: '💙', desc: '推荐使用' },
    { id: 'wechat', name: '微信支付', icon: '💚', desc: '' },
    { id: 'bankcard', name: '银行卡', icon: '💳', desc: '' }
  ]

  const handlePayment = () => {
    setIsProcessing(true)
    
    // 模拟支付流程
    setTimeout(() => {
      setIsProcessing(false)
      // 支付成功后跳转
      navigate('/user/learning', { 
        state: { 
          success: true, 
          course 
        } 
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center px-4 h-14">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-400 hover:text-white"
          >
            ←
          </button>
          <h1 className="flex-1 text-center font-semibold text-white">确认订单</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* 商品信息 */}
        <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-5 mb-6">
          <div className="flex gap-4">
            <img 
              src={course.thumbnail}
              alt={course.title}
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{course.title}</h3>
              <p className="text-sm text-gray-400 mb-2">{course.subtitle}</p>
              <p className="text-xl font-bold text-purple-400">¥{course.price}</p>
            </div>
          </div>
        </div>

        {/* 订单信息 */}
        <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-5 mb-6">
          <h3 className="text-white font-medium mb-4">订单信息</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">订单编号</span>
              <span className="text-white">ORD{Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">下单时间</span>
              <span className="text-white">{new Date().toLocaleString('zh-CN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">商品类型</span>
              <span className="text-white">在线课程</span>
            </div>
          </div>
        </div>

        {/* 支付方式 */}
        <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-5 mb-6">
          <h3 className="text-white font-medium mb-4">支付方式</h3>
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <label 
                key={method.id}
                className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === method.id 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                  className="sr-only"
                />
                <span className="text-2xl mr-3">{method.icon}</span>
                <div className="flex-1">
                  <p className="text-white font-medium">{method.name}</p>
                  {method.desc && <p className="text-xs text-purple-400">{method.desc}</p>}
                </div>
                {paymentMethod === method.id && (
                  <span className="text-purple-400">✓</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* 优惠券 */}
        <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🎫</span>
              <div>
                <p className="text-white">优惠券</p>
                <p className="text-xs text-gray-400">暂无可用优惠券</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">选择 →</button>
          </div>
        </div>

        {/* 金额明细 */}
        <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-5 mb-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">商品金额</span>
              <span className="text-white">¥{course.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">优惠金额</span>
              <span className="text-green-400">-¥0</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-white/10">
              <span className="text-white font-medium">应付金额</span>
              <span className="text-2xl font-bold text-purple-400">¥{course.price}</span>
            </div>
          </div>
        </div>

        {/* 协议 */}
        <p className="text-xs text-gray-500 text-center mb-6">
          购买即表示同意
          <Link to="/terms" className="text-purple-400">《用户服务协议》</Link>
          和
          <Link to="/refund" className="text-purple-400">《退款政策》</Link>
        </p>

        {/* 支付按钮 */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              支付中...
            </>
          ) : (
            `确认支付 ¥${course.price}`
          )}
        </button>
      </div>

      {/* 支付成功弹窗（模拟） */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 text-center max-w-xs mx-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-purple-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">正在唤起支付...</h3>
            <p className="text-sm text-gray-400">请在支付页面完成付款</p>
          </div>
        </div>
      )}
    </div>
  )
}
