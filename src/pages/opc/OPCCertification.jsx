import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from '../../components/UserLayout'

// 创作中心课程分类
const COURSE_CATEGORIES = [
  { id: 'shortvideo', name: 'AI短视频', icon: '🎬' },
  { id: 'shortdrama', name: 'AI短剧', icon: '🎭' },
  { id: 'mangadrama', name: 'AI漫剧', icon: '📚' },
  { id: 'film', name: 'AI电影', icon: '🎥' },
  { id: 'designer', name: 'AI设计师', icon: '🎨' },
  { id: 'commerce', name: 'AI带货变现', icon: '💰' },
]

export default function OPCCertification() {
  const navigate = useNavigate()
  
  // 表单状态
  const [formData, setFormData] = useState({
    categories: [],
    experience: '',
    works: [],
    agreeProtocol: false,
  })
  
  // 上传预览
  const [uploadPreview, setUploadPreview] = useState(null)
  
  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 保证金付款弹窗
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [paySuccess, setPaySuccess] = useState(false)
  
  // 分类选择
  const toggleCategory = (catId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter(id => id !== catId)
        : [...prev.categories, catId]
    }))
  }
  
  // 处理作品上传
  const handleWorkUpload = (e) => {
    const files = Array.from(e.target.files)
    const newWorks = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type.startsWith('video') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      file,
    }))
    setFormData(prev => ({
      ...prev,
      works: [...prev.works, ...newWorks].slice(0, 10) // 最多10个
    }))
  }
  
  // 删除作品
  const removeWork = (workId) => {
    setFormData(prev => ({
      ...prev,
      works: prev.works.filter(w => w.id !== workId)
    }))
  }
  
  // 预览作品
  const previewWork = (work) => {
    setUploadPreview(work)
  }
  
  // 提交认证
  const handleSubmit = () => {
    // 校验
    if (formData.categories.length === 0) {
      alert('请至少选择一个擅长领域')
      return
    }
    if (!formData.experience.trim()) {
      alert('请填写创作经验')
      return
    }
    if (!formData.agreeProtocol) {
      alert('请阅读并同意相关协议')
      return
    }
    
    // 显示保证金付款弹窗
    setShowDepositModal(true)
  }
  
  // 处理保证金付款
  const handleDepositPay = () => {
    setIsPaying(true)
    
    // 模拟付款
    setTimeout(() => {
      setIsPaying(false)
      setPaySuccess(true)
      
      // 付款成功后保存认证数据
      localStorage.setItem('opcCertification', JSON.stringify({
        ...formData,
        status: 'pending',
        depositPaid: true,
        depositAmount: 500,
        submittedAt: new Date().toISOString(),
      }))
      
      // 1.5秒后关闭弹窗并跳转
      setTimeout(() => {
        setShowDepositModal(false)
        setPaySuccess(false)
        // 跳转到个人中心
        navigate('/user/creator')
      }, 1500)
    }, 2000)
  }

  return (
    <UserLayout>
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              OPC职业创作者认证
            </span>
          </h1>
          <p className="text-gray-400">完成认证，即可入驻OPC认证池，开启智能接单之旅</p>
        </div>

        {/* 保证金说明 */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💰</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                认证保证金说明
                <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full">必读</span>
              </h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>• 入驻OPC认证池需缴纳 <span className="text-amber-400 font-semibold">¥500</span> 保证金</p>
                <p>• 保证金用于保障服务质量与订单交付</p>
                <p>• 审核通过后，保证金将在您退出OPC时退还</p>
                <p>• 认证审核预计 <span className="text-cyan-400">1-3个工作日</span> 完成</p>
              </div>
              <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-white/5">
                <p className="text-amber-400 font-medium">
                  💡 提交认证申请后，将跳转至保证金支付页面
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 认证权益 */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🎁</span> 认证权益
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/8">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">入驻OPC认证池</h4>
                <p className="text-gray-400 text-sm">开通智能推荐接单权限，直接对接平台订单需求</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/8">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">解锁高级创作者功能</h4>
                <p className="text-gray-400 text-sm">提升创作效率、曝光度与变现能力</p>
              </div>
            </div>
          </div>
        </div>

        {/* 认证表单 */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            
            {/* 擅长领域选择 */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-3">
                <span className="text-red-400 mr-1">*</span>
                创作中心课程分类（可多选）
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {COURSE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      formData.categories.includes(cat.id)
                        ? 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border-violet-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                    {formData.categories.includes(cat.id) && (
                      <span className="ml-auto text-violet-400">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-2">选择您擅长的领域，作为认证资质核心依据</p>
            </div>

            {/* 创作经验 */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-3">
                <span className="text-red-400 mr-1">*</span>
                创作经验
              </label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="请填写您的个人创作经历、从业年限、核心技能、服务案例等内容..."
                className="w-full h-40 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none"
              />
              <p className="text-gray-500 text-sm mt-2">{formData.experience.length}/500字</p>
            </div>

            {/* 作品上传 */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-3">
                作品上传（图片/视频）
              </label>
              
              {/* 上传区域 */}
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-violet-500/30 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleWorkUpload}
                  className="hidden"
                  id="work-upload"
                />
                <label htmlFor="work-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📤</span>
                  </div>
                  <p className="text-white font-medium mb-1">点击上传作品</p>
                  <p className="text-gray-500 text-sm">支持 JPG、PNG、GIF、MP4 格式，最多上传10个作品</p>
                </label>
              </div>
              
              {/* 作品列表 */}
              {formData.works.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {formData.works.map(work => (
                    <div key={work.id} className="relative group">
                      <div 
                        className="aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/10 cursor-pointer"
                        onClick={() => previewWork(work)}
                      >
                        {work.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
                            <span className="text-3xl">🎬</span>
                          </div>
                        ) : (
                          <img src={work.url} alt={work.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <button
                        onClick={() => removeWork(work.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                      <p className="text-gray-400 text-xs mt-1 truncate">{work.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 协议同意 */}
            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeProtocol}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeProtocol: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/50"
                />
                <span className="text-gray-300 text-sm leading-relaxed">
                  我已阅读并同意<span className="text-violet-400">《OPC创作者认证协议》</span>、
                  <span className="text-violet-400">《作品上传规则》</span>及
                  <span className="text-violet-400">《平台服务条款》</span>
                </span>
              </label>
            </div>

            {/* 提交按钮 */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isSubmitting
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-500 hover:to-cyan-500 shadow-lg shadow-violet-500/30'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  提交中...
                </span>
              ) : '申请认证'}
            </button>

          {/* 保证金付款弹窗 */}
          {showDepositModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                {paySuccess ? (
                  // 付款成功状态
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-5xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">付款成功！</h3>
                    <p className="text-gray-400 mb-4">保证金 ¥500 已支付</p>
                    <p className="text-violet-400 animate-pulse">正在跳转个人中心...</p>
                  </div>
                ) : (
                  // 付款页面
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">💰</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">缴纳认证保证金</h3>
                      <p className="text-gray-400 text-sm">完成认证需缴纳保证金，用于保障服务质量</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400">认证类型</span>
                        <span className="text-white font-medium">OPC创作者</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400">擅长领域</span>
                        <div className="flex gap-1">
                          {formData.categories.slice(0, 2).map(catId => {
                            const cat = COURSE_CATEGORIES.find(c => c.id === catId)
                            return cat ? (
                              <span key={catId} className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded-full">
                                {cat.icon} {cat.name}
                              </span>
                            ) : null
                          })}
                          {formData.categories.length > 2 && (
                            <span className="text-gray-400 text-sm">+{formData.categories.length - 2}</span>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">保证金</span>
                          <span className="text-2xl font-bold text-amber-400">¥500</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-500 text-xs mb-6 text-center">
                      保证金将在认证审核通过后持续有效<br/>
                      如有违规将扣除保证金并取消认证资格
                    </p>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDepositModal(false)}
                        className="flex-1 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleDepositPay}
                        disabled={isPaying}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50"
                      >
                        {isPaying ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            支付中...
                          </span>
                        ) : '立即支付 ¥500'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {/* 预览弹窗 */}
          {uploadPreview && (
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setUploadPreview(null)}
            >
              <div 
                className="relative max-w-4xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setUploadPreview(null)}
                  className="absolute -top-10 right-0 text-white/60 hover:text-white"
                >
                  关闭预览
                </button>
                {uploadPreview.type === 'video' ? (
                  <video 
                    src={uploadPreview.url} 
                    controls 
                    className="max-h-[80vh] rounded-lg"
                  />
                ) : (
                  <img 
                    src={uploadPreview.url} 
                    alt={uploadPreview.name} 
                    className="max-h-[80vh] rounded-lg"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </UserLayout>
  )
}
