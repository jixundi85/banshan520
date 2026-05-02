import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 1题极简预诊断弹窗
 * 
 * 功能：
 * - 首屏加载300ms后弹出
 * - 两道选择题（身份+需求），必选校验
 * - 四种组合跳转逻辑
 * - localStorage记录关闭状态（首次访问才显示）
 * - 移动端适配
 * 
 * 跳转逻辑：
 * - A+A（个人创作者+学AI变现）→ /awakening
 * - A+B（个人创作者+企业需求）→ /awakening  
 * - B+A（企业主+学AI变现）→ /enterprise-guide
 * - B+B（企业主+企业需求）→ /enterprise-diagnosis
 */

const STORAGE_KEY = 'prediagnosis_modal_closed'

export function PrediagnosisModal() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [selectedIdentity, setSelectedIdentity] = useState(null) // 'A' | 'B' | null
  const [selectedNeed, setSelectedNeed] = useState(null) // 'A' | 'B' | null
  const [error, setError] = useState('')
  const [isClosing, setIsClosing] = useState(false)

  // 检查是否需要显示弹窗
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // 处理关闭
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
      localStorage.setItem(STORAGE_KEY, 'true')
    }, 300)
  }

  // 点击遮罩关闭
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  // 确认匹配
  const handleConfirm = () => {
    if (!selectedIdentity || !selectedNeed) {
      setError('请选择你的身份与核心需求')
      return
    }
    setError('')

    // 跳转逻辑
    // A+A → /awakening（小白创作者）
    // A+B → /awakening（专业创作者）
    // B+A → /enterprise-guide（企业学习）
    // B+B → /enterprise-diagnosis（企业诊断）
    
    let targetPath = '/awakening'
    if (selectedIdentity === 'A') {
      targetPath = '/awakening'
    } else {
      // 企业主
      if (selectedNeed === 'A') {
        targetPath = '/enterprise-guide'
      } else {
        targetPath = '/enterprise-diagnosis'
      }
    }

    // 保存选择到localStorage，供后续页面使用
    localStorage.setItem('prediagnosis_choice', JSON.stringify({
      identity: selectedIdentity,
      need: selectedNeed,
      timestamp: Date.now()
    }))

    // 关闭弹窗并跳转
    setIsClosing(true)
    setTimeout(() => {
      navigate(targetPath)
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
    >
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      {/* 弹窗主体 */}
      <div 
        className={`relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-white/10 shadow-2xl shadow-violet-500/20 overflow-hidden transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* 装饰光效 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-500/30 to-blue-500/20 rounded-full blur-3xl"></div>

        {/* 内容区 */}
        <div className="relative p-8">
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl mb-4 shadow-lg shadow-violet-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">请选择你的身份与核心需求</h2>
            <p className="text-gray-400 text-sm">我们将为你精准匹配专属服务</p>
          </div>

          {/* 第一题：身份 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 bg-violet-500 text-white text-xs font-bold rounded-full">1</span>
              <span className="text-white font-medium">你的身份是？</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedIdentity('A')}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedIdentity === 'A'
                    ? 'border-violet-500 bg-violet-500/20 shadow-lg shadow-violet-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedIdentity === 'A' ? 'bg-violet-500' : 'bg-white/10'
                  }`}>
                    <span className="text-xl">🧑‍💻</span>
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${selectedIdentity === 'A' ? 'text-violet-400' : 'text-white'}`}>
                      个人创作者
                    </p>
                    <p className="text-xs text-gray-400">想做超级个体</p>
                  </div>
                </div>
                {selectedIdentity === 'A' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>

              <button
                onClick={() => setSelectedIdentity('B')}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedIdentity === 'B'
                    ? 'border-cyan-500 bg-cyan-500/20 shadow-lg shadow-cyan-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedIdentity === 'B' ? 'bg-cyan-500' : 'bg-white/10'
                  }`}>
                    <span className="text-xl">🏢</span>
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${selectedIdentity === 'B' ? 'text-cyan-400' : 'text-white'}`}>
                      企业主/Boss
                    </p>
                    <p className="text-xs text-gray-400">企业决策者</p>
                  </div>
                </div>
                {selectedIdentity === 'B' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* 第二题：需求 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 bg-fuchsia-500 text-white text-xs font-bold rounded-full">2</span>
              <span className="text-white font-medium">你的核心需求是？</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedNeed('A')}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedNeed === 'A'
                    ? 'border-fuchsia-500 bg-fuchsia-500/20 shadow-lg shadow-fuchsia-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedNeed === 'A' ? 'bg-fuchsia-500' : 'bg-white/10'
                  }`}>
                    <span className="text-xl">📚</span>
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${selectedNeed === 'A' ? 'text-fuchsia-400' : 'text-white'}`}>
                      学AI变现
                    </p>
                    <p className="text-xs text-gray-400">提升创作能力</p>
                  </div>
                </div>
                {selectedNeed === 'A' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-fuchsia-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>

              <button
                onClick={() => setSelectedNeed('B')}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedNeed === 'B'
                    ? 'border-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedNeed === 'B' ? 'bg-amber-500' : 'bg-white/10'
                  }`}>
                    <span className="text-xl">🚀</span>
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${selectedNeed === 'B' ? 'text-amber-400' : 'text-white'}`}>
                      企业AI升级
                    </p>
                    <p className="text-xs text-gray-400">解决企业需求</p>
                  </div>
                </div>
                {selectedNeed === 'B' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* 确认按钮 */}
          <button
            onClick={handleConfirm}
            disabled={!selectedIdentity || !selectedNeed}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              selectedIdentity && selectedNeed
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-500/50 hover:-translate-y-0.5'
                : 'bg-white/10 text-gray-400 cursor-not-allowed'
            }`}
          >
            确认匹配 →
          </button>

          {/* 底部提示 */}
          <p className="mt-4 text-center text-gray-500 text-xs">
            关闭后可在首屏手动选择入口
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrediagnosisModal
