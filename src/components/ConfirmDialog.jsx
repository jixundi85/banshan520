import { useState, createContext, useContext, useCallback } from 'react'

// 确认对话框上下文
const ConfirmContext = createContext(null)

// 确认对话框组件
export function ConfirmProvider({ children }) {
  const [dialogs, setDialogs] = useState([])

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      const id = Date.now() + Math.random()
      setDialogs(prev => [...prev, { id, ...options, resolve }])
    })
  }, [])

  const handleConfirm = (id, result) => {
    setDialogs(prev => {
      const dialog = prev.find(d => d.id === id)
      if (dialog) {
        dialog.resolve(result)
      }
      return prev.filter(d => d.id !== id)
    })
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialogs.map(dialog => (
        <ConfirmDialog 
          key={dialog.id} 
          {...dialog} 
          onConfirm={() => handleConfirm(dialog.id, true)}
          onCancel={() => handleConfirm(dialog.id, false)}
        />
      ))}
    </ConfirmContext.Provider>
  )
}

function ConfirmDialog({ 
  title = '确认操作', 
  message = '确定要执行此操作吗？',
  confirmText = '确定',
  cancelText = '取消',
  type = 'warning',
  onConfirm, 
  onCancel 
}) {
  const typeStyles = {
    danger: 'border-red-500/50 bg-red-500/10',
    warning: 'border-amber-500/50 bg-amber-500/10',
    info: 'border-blue-500/50 bg-blue-500/10',
  }

  const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-500',
    warning: 'bg-amber-600 hover:bg-amber-500',
    info: 'bg-blue-600 hover:bg-blue-500',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md p-6 rounded-2xl border ${typeStyles[type]} bg-[#0a0a0a]`}>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/70 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-all ${buttonStyles[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook 使用确认对话框
export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }
  return context.confirm
}

// 快捷方法
export function useConfirmActions() {
  const confirm = useConfirm()

  return {
    confirmDelete: (itemName = '此项') => confirm({
      title: '确认删除',
      message: `确定要删除 ${itemName} 吗？此操作不可撤销。`,
      confirmText: '删除',
      type: 'danger',
    }),
    confirmCancel: (itemName = '此操作') => confirm({
      title: '确认取消',
      message: `确定要取消 ${itemName} 吗？`,
      confirmText: '确认取消',
      type: 'warning',
    }),
    confirmSubmit: (itemName = '提交') => confirm({
      title: '确认提交',
      message: `确定要${itemName}吗？`,
      confirmText: '确认',
      type: 'info',
    }),
    confirmLogout: () => confirm({
      title: '确认退出',
      message: '确定要退出登录吗？',
      confirmText: '退出',
      type: 'warning',
    }),
  }
}
