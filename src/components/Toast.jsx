import { useEffect, useState, useCallback, createContext, useContext } from 'react'

// Toast 上下文
const ToastContext = createContext(null)

// Toast 单条组件
function ToastItem({ message, type = 'info', onClose, duration = 3000 }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const styles = {
    success: 'bg-emerald-500/90 border-emerald-400/50',
    error: 'bg-red-500/90 border-red-400/50',
    warning: 'bg-amber-500/90 border-amber-400/50',
    info: 'bg-blue-500/90 border-blue-400/50',
  }

  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
  }

  return (
    <div 
      className={`
        px-6 py-3 rounded-xl border ${styles[type]} text-white shadow-lg backdrop-blur-sm
        transform transition-all duration-300
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold">{icons[type]}</span>
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}

// Toast 容器组件
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <ToastItem
            key={t.id}
            message={t.message}
            type={t.type}
            duration={t.duration}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Hook 使用 Toast
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// 兼容旧版默认导出
export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  return (
    <ToastItem 
      message={message} 
      type={type} 
      onClose={onClose} 
      duration={duration} 
    />
  )
}
