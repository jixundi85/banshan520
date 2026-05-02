import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

// 包装组件：为独立页面添加统一布局（顶部导航 + 底部信息）
function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-dark-900">
      <SiteHeader />
      <main className="site-main" style={{ minHeight: 'calc(100vh - 72px)', paddingTop: '72px' }}>
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}

export default PageWrapper
