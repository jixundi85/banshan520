import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AIAssistant from './AIAssistant'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

// PageLayout - 统一使用 SiteHeader 和 SiteFooter
export default function PageLayout({ children }) {
  const [showAI, setShowAI] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // 路由变化时关闭移动菜单（通过事件触发）
  useEffect(() => {
    // 通知 SiteHeader 关闭移动菜单
    window.dispatchEvent(new CustomEvent('layoutRouteChange'))
  }, [location])

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* 统一顶部导航 */}
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* 统一底部信息 */}
      <SiteFooter />

      {/* AI 助手 */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
    </div>
  )
}
