import { useState, useEffect } from 'react'
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom'

const menuItems = [
  { path: '/user/creator', label: '创作者中心', icon: '✨' },
  { path: '/user/projects', label: '我的项目', icon: '📁' },
  { path: '/user/demands', label: '我的需求', icon: '📋' },
  { path: '/user/learning', label: '学习中心', icon: '📚' },
  { path: '/user/points', label: '积分中心', icon: '💎' },
  { path: '/user/wallet', label: '我的钱包', icon: '💰' },
  { path: '/user/vip', label: 'VIP会员', icon: '👑' },
  { path: '/user/invite', label: '邀请好友', icon: '🎁' },
  { path: '/user/orders', label: '我的订单', icon: '📦' },
  { path: '/user/favorites', label: '我的收藏', icon: '❤️' },
  { path: '/user/messages', label: '消息中心', icon: '💬' },
  { path: '/user/settings', label: '账号安全设置', icon: '⚙️' }
]

// 默认创作者资料
const defaultCreatorProfile = {
  name: '林小艺',
  title: 'AI创作导师 | 短视频运营专家',
  avatar: '👩‍💻',
  avatarUrl: '',
  bio: '专注AI内容创作5年，服务过100+品牌客户。',
  skills: ['AI短视频', '内容策划', '流量运营', '变现指导'],
}

export default function UserCenter() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [creatorProfile, setCreatorProfile] = useState(null)
  const [opcCertification, setOpcCertification] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 分类ID转名称映射
  const categoryMap = {
    'shortvideo': 'AI短视频',
    'shortdrama': 'AI短剧',
    'mangadrama': 'AI漫剧',
    'film': 'AI电影',
    'designer': 'AI设计师',
    'commerce': 'AI带货变现',
  }

  useEffect(() => {
    // 获取用户信息
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      navigate('/login')
    }

    // 加载创作者资料
    const loadCreatorProfile = () => {
      const saved = localStorage.getItem('creatorProfile')
      if (saved) {
        try {
          setCreatorProfile(JSON.parse(saved))
        } catch (e) {
          console.error('Failed to parse creatorProfile:', e)
          setCreatorProfile(null)
        }
      } else {
        // 不自动创建默认资料
        setCreatorProfile(null)
      }
    }

    // 加载OPC认证状态
    const loadOpcCertification = () => {
      const saved = localStorage.getItem('opcCertification')
      if (saved) {
        try {
          setOpcCertification(JSON.parse(saved))
        } catch (e) {
          setOpcCertification(null)
        }
      } else {
        setOpcCertification(null)
      }
    }

    loadCreatorProfile()
    loadOpcCertification()

    // 监听创作者资料更新
    const handleUpdate = () => {
      loadCreatorProfile()
      loadOpcCertification()
    }
    window.addEventListener('creatorProfileUpdated', handleUpdate)
    
    // 轮询检查创作者资料变化
    const pollInterval = setInterval(handleUpdate, 100)
    
    return () => {
      window.removeEventListener('creatorProfileUpdated', handleUpdate)
      clearInterval(pollInterval)
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) return null

  // 优先使用创作者资料，否则使用用户资料
  const displayProfile = creatorProfile || user

  return (
    <div className="min-h-screen bg-slate-900">
      {/* 顶部导航栏 */}
      <header className="bg-slate-800/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/images/navbar-logo.png" alt="半山AIX" className="h-10" />
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/user/messages" className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <span className="text-xl">💬</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            <div className="flex items-center gap-3">
              {displayProfile.avatar?.startsWith('http') ? (
                <img 
                  src={displayProfile.avatar} 
                  alt={displayProfile.name}
                  className="w-9 h-9 rounded-full border-2 border-purple-500/50 object-cover bg-slate-700"
                />
              ) : displayProfile.avatarUrl ? (
                <img 
                  src={displayProfile.avatarUrl} 
                  alt={displayProfile.name}
                  className="w-9 h-9 rounded-full border-2 border-purple-500/50 object-cover bg-slate-700"
                />
              ) : (
                <div className="w-9 h-9 rounded-full border-2 border-purple-500/50 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg">
                  {displayProfile.avatar || displayProfile.name?.[0] || '👤'}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-white font-medium hidden sm:block">{displayProfile.name}</span>
                {/* OPC认证状态 */}
                {opcCertification?.status === 'approved' ? (
                  <div className="flex items-center gap-1.5">
                    {opcCertification.categories?.map(catId => (
                      <span 
                        key={catId}
                        className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-violet-300 rounded-full border border-violet-500/30"
                      >
                        {categoryMap[catId] || catId}
                      </span>
                    ))}
                  </div>
                ) : opcCertification?.status === 'pending' ? (
                  <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                    审核中
                  </span>
                ) : opcCertification?.status === 'rejected' ? (
                  <Link 
                    to="/opc-certification"
                    className="px-2 py-0.5 text-xs bg-red-500/20 text-red-300 rounded-full border border-red-500/30 hover:bg-red-500/30 transition-colors"
                  >
                    认证被拒，重新申请
                  </Link>
                ) : (
                  <Link 
                    to="/opc-certification"
                    className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-colors flex items-center gap-1"
                  >
                    <span>申请OPC认证</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏 */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* 移动端菜单按钮 */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-full mb-4 px-4 py-3 bg-slate-800 rounded-xl text-white flex items-center justify-between"
            >
              <span>菜单</span>
              <span>{isMobileMenuOpen ? '▲' : '▼'}</span>
            </button>

            {/* 菜单列表 */}
            <nav className={`bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-6 py-4 text-gray-300 hover:bg-white/5 hover:text-white transition-all ${
                    location.pathname === item.path ? 'bg-purple-500/10 text-purple-400 border-l-2 border-purple-500' : ''
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-4 text-red-400 hover:bg-red-500/10 transition-all border-t border-white/5"
              >
                <span className="text-lg">🚪</span>
                <span>退出登录</span>
              </button>
            </nav>
          </aside>

          {/* 主内容区 */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
