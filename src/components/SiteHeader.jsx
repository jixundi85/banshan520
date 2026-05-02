import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Sparkles, ChevronDown, LogOut, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import './SiteHeader.css'
import apiDataService from '../services/apiDataService'

// 默认导航配置 - 与首页保持一致（无emoji、无highlight）
const defaultNavItems = [
  { id: 'nav_1', label: '首页', path: '/', status: 'visible', order: 1 },
  { 
    id: 'nav_2', label: '智力值认证', path: null, status: 'visible', order: 2,
    children: [
      { id: 'nav_2_1', label: 'OPC特训营中心', path: '/training', desc: '系统化培训课程' },
      { id: 'nav_2_2', label: '咨询智配中心', path: '/creator', desc: '查看认证OPC人才库' },
    ]
  },
  { id: 'nav_6', label: '企业需求仓', path: '/demand', status: 'visible', order: 3 },
  { 
    id: 'nav_7', label: '碳硅共振圈', path: null, status: 'visible', order: 4,
    children: [
      { id: 'nav_7_1', label: '碳硅交流', path: '/community', desc: '人机协同，碳硅共鸣交流社区' },
      { id: 'nav_7_2', label: '赛事论坛', path: '/event', desc: 'AI赛事资讯与论坛讨论' },
    ]
  },
  { id: 'nav_8', label: '创作者工具', path: '/tools', status: 'visible', order: 5 },
  { id: 'nav_9', label: '版权交易中心', path: '/copyright', status: 'visible', order: 6 },
]

function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const [navItems, setNavItems] = useState(defaultNavItems)

  const loadNavConfig = () => {
    try {
      const navConfigStr = localStorage.getItem('admin_navConfig')
      if (navConfigStr) {
        const navConfig = JSON.parse(navConfigStr)
        if (navConfig.items && Array.isArray(navConfig.items)) {
          // 合并配置，保留children
          const mergedItems = defaultNavItems.map(def => {
            const saved = navConfig.items.find(i => i.id === def.id)
            if (saved) {
              return { ...def, order: saved.order ?? def.order, status: saved.status ?? def.status }
            }
            return def
          })
          const sortedItems = mergedItems
            .filter(item => item.status === 'visible')
            .sort((a, b) => a.order - b.order)
          setNavItems(sortedItems)
        }
      }
    } catch (e) {
      console.error('[SiteHeader] 加载导航配置失败:', e)
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

    checkLogin()
    loadNavConfig()

    window.addEventListener('storage', checkLogin)
    window.addEventListener('loginSuccess', checkLogin)
    window.addEventListener('navConfigUpdated', loadNavConfig)

    return () => {
      window.removeEventListener('storage', checkLogin)
      window.removeEventListener('loginSuccess', checkLogin)
      window.removeEventListener('navConfigUpdated', loadNavConfig)
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
    <header className="site-header">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center no-hover-scale">
            <img 
              src="/images/navbar-logo.png" 
              alt="半山AIX" 
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation - 带下拉菜单 */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              item.children ? (
                // 有子菜单的导航项
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      item.children.some(c => location.pathname === c.path)
                        ? 'text-violet-400 bg-violet-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* 下拉菜单 */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 py-2 rounded-xl border border-white/10 shadow-2xl transition-all duration-200 z-50 ${
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
                            ? 'bg-violet-500/15 text-violet-400'
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
                // 普通导航项
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'text-violet-400 bg-violet-500/10'
                      : item.highlight
                        ? 'text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`}
>
                  <span>{item.label}</span>
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
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500"
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
              <div key={item.id}>
                {item.children ? (
                  // 有子菜单
                  <div>
                    <div className="px-4 py-3 text-gray-400 font-medium flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.path}
                          className={`block px-4 py-2 rounded-lg transition-all ${
                            location.pathname === child.path
                              ? 'text-violet-400 bg-violet-500/10'
                              : 'text-gray-400 hover:text-white hover:bg-dark-700'
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="mr-2">{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      location.pathname === item.path
                        ? 'text-violet-400 bg-violet-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-dark-700'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-dark-600 space-y-2">
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-dark-700 rounded-lg">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500"
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
  )
}

export default SiteHeader
