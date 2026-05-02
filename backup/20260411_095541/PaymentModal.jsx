import { useState } from 'react'
import { X, CreditCard, CheckCircle, Loader2 } from 'lucide-react'

export default function PaymentModal({ isOpen, onClose, course, onSuccess }) {
  const [step, setStep] = useState('confirm') // confirm, processing, success
  const [paymentMethod, setPaymentMethod] = useState('alipay')
  const [error, setError] = useState('')

  if (!isOpen || !course) return null

  const handleCreateOrder = async () => {
    setStep('processing')
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('请先登录')
        setStep('confirm')
        return
      }

      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      if (!user) {
        setError('用户信息异常，请重新登录')
        setStep('confirm')
        return
      }

      // 模拟支付处理延迟
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 生成订单ID
      const orderId = 'order_' + Date.now()
      const orderData = {
        id: orderId,
        courseId: String(course.id),
        courseTitle: course.title,
        price: course.price,
        paymentMethod,
        userId: user.id || user.email,
        userName: user.name,
        status: 'paid',
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString()
      }

      // 保存订单到 localStorage
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]')
      existingOrders.push(orderData)
      localStorage.setItem('userOrders', JSON.stringify(existingOrders))

      // 标记课程为已购买
      const purchasedCourses = JSON.parse(localStorage.getItem('purchasedCourses') || '[]')
      if (!purchasedCourses.includes(String(course.id))) {
        purchasedCourses.push(String(course.id))
        localStorage.setItem('purchasedCourses', JSON.stringify(purchasedCourses))
      }

      setStep('success')
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      console.error('支付错误:', err)
      setError('支付失败，请重试')
      setStep('confirm')
    }
  }

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : price
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-dark-800 rounded-2xl border border-dark-600 shadow-2xl overflow-hidden">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-10"
          disabled={step === 'processing'}
        >
          <X size={20} />
        </button>

        {step === 'confirm' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">确认订单</h2>

            {/* 课程信息 */}
            <div className="bg-dark-700 rounded-xl p-4 mb-6">
              <h3 className="text-white font-medium mb-2">{course.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{course.subtitle}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">课程价格</span>
                <span className="text-2xl font-bold text-brand-purple">¥{formatPrice(course.price)}</span>
              </div>
            </div>

            {/* 支付方式 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">选择支付方式</label>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'alipay' 
                    ? 'border-brand-purple bg-brand-purple/10' 
                    : 'border-dark-600 hover:border-dark-500'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="alipay"
                    checked={paymentMethod === 'alipay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-brand-purple"
                  />
                  <span className="text-2xl">💙</span>
                  <span className="text-white">支付宝</span>
                </label>
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'wechat' 
                    ? 'border-brand-purple bg-brand-purple/10' 
                    : 'border-dark-600 hover:border-dark-500'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="wechat"
                    checked={paymentMethod === 'wechat'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-brand-purple"
                  />
                  <span className="text-2xl">💚</span>
                  <span className="text-white">微信支付</span>
                </label>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* 支付按钮 */}
            <button
              onClick={handleCreateOrder}
              className="w-full py-3.5 bg-gradient-to-r from-brand-purple to-brand-blue text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              确认支付 ¥{formatPrice(course.price)}
            </button>

            <p className="text-center text-gray-500 text-xs mt-4">
              点击支付即表示您同意《服务协议》
            </p>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-brand-purple/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
              <Loader2 className="absolute inset-0 m-auto text-brand-purple animate-spin" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">正在处理支付...</h3>
            <p className="text-gray-400">请稍候，正在处理您的订单</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">🎉 支付成功！</h3>
            <p className="text-gray-400 mb-4">您已成功购买该课程</p>
            <p className="text-sm text-gray-500">正在跳转到学习页面...</p>
          </div>
        )}
      </div>
    </div>
  )
}
