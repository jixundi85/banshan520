import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Sparkles, ShoppingCart, LogOut, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import AIAssistant from './AIAssistant'
import apiDataService from '../services/apiDataService'

// 默认导航配置（与后台导航配置保持一致）
const defaultNavItems = [
  { id: 'home', label: '首页', path: '/', icon: '🏠', status: 'visible', order: 1 },
  {
    id: 'training', label: '智力值认证', path: null, icon: '🎓', status: 'visible', order: 2,
    children: [
      { id: 'training-sub', label: 'OPC特训营中心', path: '/training', icon: '📚', desc: '' },
      { id: 'creator-sub', label: '咨询智配中心', path: '/creator', icon: '🏅', desc: '查看认证OPC人才库' },
    ]
  },
  { id: 'demand', label: '企业需求仓', path: '/demand', icon: '💼', status: 'visible', order: 3 },
  {
    id: 'community', label: '碳硅共振圈', path: null, icon: '👥', status: 'visible', order: 4,
    children: [
      { id: 'community-sub', label: '碳硅交流', path: '/community', icon: '💬', desc: '人机协同，碳硅共鸣交流社区' },
      { id: 'event-sub', label: '赛事论坛', path: '/event', icon: '🏆', desc: 'AI赛事资讯与论坛讨论' },
    ]
  },
  { id: 'tools', label: '创作者工具', path: '/tools', icon: '🛠️', status: 'visible', order: 5 },
  { id: 'copyright', label: '版权交易中心', path: '/copyright', icon: '🏛️', status: 'visible', order: 6 },
]

export default function UserLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  // 检查登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [creatorProfile, setCreatorProfile] = useState(null)
  const lastProfileRef = useRef(null)

  // 导航配置状态
  const [navItems, setNavItems] = useState(defaultNavItems)

  // 加载导航配置
  const loadNavConfig = () => {
    try {
      const navConfigStr = localStorage.getItem('admin_navConfig')
      if (navConfigStr) {
        const navConfig = JSON.parse(navConfigStr)
        if (navConfig.items && Array.isArray(navConfig.items) && navConfig.items.length > 0) {
          const validIds = new Set(defaultNavItems.map(i => i.id))
          const cleanedItems = navConfig.items.filter(i => validIds.has(i.id))
          const mergedItems = defaultNavItems.map(def => {
            const saved = cleanedItems.find(i => i.id === def.id)
            if (saved) {
              return { ...def, order: saved.order ?? def.order, status: saved.status ?? def.status }
            }
            return def
          })
          const extraItems = cleanedItems.filter(i => !validIds.has(i.id))
          const items = [...mergedItems, ...extraItems]
          localStorage.setItem('admin_navConfig', JSON.stringify({ items }))
          const sortedItems = items
            .filter(item => item.status === 'visible')
            .sort((a, b) => a.order - b.order)
          setNavItems(sortedItems)
        } else {
          setNavItems(defaultNavItems)
        }
      } else {
        localStorage.setItem('admin_navConfig', JSON.stringify({ items: defaultNavItems }))
        setNavItems(defaultNavItems)
      }
    } catch (e) {
      console.error('[UserLayout] 加载导航配置失败:', e)
      setNavItems(defaultNavItems)
    }
  }

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      if (token && userStr) {
        setIsLoggedIn(true)
        setUser(JSON.parse(userStr))
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    }

    const loadCreatorProfile = () => {
      const saved = localStorage.getItem('creatorProfile')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setCreatorProfile({...parsed})
          lastProfileRef.current = parsed
        } catch (e) {
          console.error('Failed to parse creatorProfile:', e)
          setCreatorProfile(null)
        }
      } else {
        setCreatorProfile(null)
      }
    }

    checkLogin()
    loadCreatorProfile()
    loadNavConfig()

    window.addEventListener('storage', checkLogin)
    window.addEventListener('loginSuccess', checkLogin)
    window.addEventListener('creatorProfileUpdated', loadCreatorProfile)
    window.addEventListener('navConfigUpdated', loadNavConfig)
    const handleStorageChange = (e) => {
      if (e.key === 'admin_navConfig') {
        loadNavConfig()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    const pollInterval = setInterval(loadCreatorProfile, 100)

    return () => {
      window.removeEventListener('storage', checkLogin)
      window.removeEventListener('loginSuccess', checkLogin)
      window.removeEventListener('creatorProfileUpdated', loadCreatorProfile)
      window.removeEventListener('navConfigUpdated', loadNavConfig)
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(pollInterval)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await apiDataService.auth.logout()
    } catch (e) {
      console.error('Logout error:', e)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    setUserDropdownOpen(false)
    navigate('/')
    window.dispatchEvent(new Event('logout'))
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/images/navbar-logo.png" 
                alt="半山AIX" 
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                item.children ? (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        item.children.some(c => location.pathname === c.path)
                          ? 'text-brand-blue bg-brand-blue/10'
                          : 'text-gray-400 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-52 py-2 rounded-xl border border-white/10 shadow-2xl transition-all duration-200 z-50 ${
                      activeDropdown === item.id
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                    style={{ background: 'linear-gradient(135deg, rgba(15,15,30,0.97) 0%, rgba(30,15,50,0.97) 100%)', backdropFilter: 'blur(20px)' }}>
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-l border-t border-white/10" style={{ background: 'rgba(15,15,30,0.97)' }} />
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.path}
                          className={`flex items-start gap-3 px-4 py-3 mx-1 rounded-lg transition-all duration-150 group ${
                            location.pathname === child.path
                              ? 'bg-brand-blue/15 text-brand-blue'
                              : 'text-gray-300 hover:bg-white/8 hover:text-white'
                          }`}
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span className="text-lg mt-0.5 flex-shrink-0">{child.icon}</span>
                          <div>
                            <div className="font-medium text-sm">{child.label}</div>
                            {child.desc && <div className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-400">{child.desc}</div>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-brand-blue bg-brand-blue/10'
                        : 'text-gray-400 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple"
                    />
                    <span className="text-white font-medium">{user.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 py-2 bg-dark-700 rounded-xl border border-dark-600 shadow-xl">
                      <div className="px-4 py-2 border-b border-dark-600">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.phone}</p>
                      </div>
                      <Link
                        to="/user/creator"
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Sparkles className="w-4 h-4" />
                        个人中心
                      </Link>
                      <Link
                        to="/user/orders"
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        我的订单
                      </Link>
                      <Link
                        to="/user/wallet"
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Sparkles className="w-4 h-4" />
                        我的钱包
                      </Link>
                      <div className="border-t border-dark-600 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:bg-dark-600 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          退出登录
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost">登录</Link>
                  <Link to="/register" className="btn-primary">立即开始</Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden glass border-t border-dark-600">
            <div className="container-custom py-4 space-y-2">
              {navItems.map((item) => (
                item.children ? (
                  <div key={item.id}>
                    <button
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                        item.children.some(c => location.pathname === c.path)
                          ? 'text-brand-blue bg-brand-blue/10'
                          : 'text-gray-400 hover:text-white hover:bg-dark-700'
                      }`}
                      onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === item.id && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-brand-blue/30 pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            to={child.path}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              location.pathname === child.path
                                ? 'text-brand-blue bg-brand-blue/10'
                                : 'text-gray-400 hover:text-white hover:bg-dark-700'
                            }`}
                            onClick={() => { setMobileOpen(false); setActiveDropdown(null); }}
                          >
                            <span>{child.icon}</span>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                      location.pathname === item.path
                        ? 'text-brand-blue bg-brand-blue/10'
                        : 'text-gray-400 hover:text-white hover:bg-dark-700'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <div className="pt-4 border-t border-dark-600 space-y-2">
                {isLoggedIn && user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-dark-700 rounded-lg">
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple"
                      />
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.phone}</p>
                      </div>
                    </div>
                    <Link to="/user/creator" className="w-full btn-secondary text-center" onClick={() => setMobileOpen(false)}>个人中心</Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full py-3 text-red-400 hover:bg-dark-700 rounded-lg transition-colors">
                      退出登录
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="w-full btn-secondary text-center">登录</Link>
                    <Link to="/register" className="w-full btn-primary text-center">立即开始</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16 lg:pt-20">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-dark-800 border-t border-dark-600 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/images/navbar-logo.png" 
                  alt="半山AIX" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                东盟首个致力于中小企业<br />智能建构与智产沉淀的<br />中国式解决方案
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">产品服务</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {navItems.filter(item => item.status === 'visible').map(item => (
                  <li key={item.id}>
                    <Link to={item.path} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">关于我们</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">公司介绍</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">加入我们</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">联系方式</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">帮助中心</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">关注我们</h4>
              <div className="flex gap-3">
                <Link to="/community" className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-blue/20 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </Link>
                <Link to="/chat" className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-purple/20 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-dark-600 text-center">
            <p className="text-gray-500 text-sm mb-2">东盟出海样板：半山AIX实验室</p>
            <p className="text-gray-500 text-sm">© 2026 半山AIX. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 半山灵图 - 智能助手 */}
      <AIAssistant />
    </div>
  )
}
