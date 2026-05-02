/**
 * 碳硅工程交流群 - 顶部固定栏
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, User, Bookmark, Settings, LogOut } from 'lucide-react'
import './CommunityHeader.css'

export default function CommunityHeader({ title = '碳硅交流社区' }) {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [user, setUser] = useState(null)
  const [unreadCount] = useState(3)
  const menuRef = useRef(null)

  // 检查登录状态
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }
  }, [])

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchText.trim()) {
      navigate(`/community/exchange?search=${encodeURIComponent(searchText)}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('current_user')
    setUser(null)
    setShowUserMenu(false)
    navigate('/login')
    window.dispatchEvent(new Event('logout'))
  }

  return (
    <header className="community-header">
      {/* 左侧Logo */}
      <div className="header-left">
        <div className="header-logo">
          <span className="logo-text">{title}</span>
        </div>
      </div>

      {/* 中间搜索 */}
      <form className="header-search" onSubmit={handleSearch}>
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="搜索帖子、教程、话题..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit" className="search-btn">搜索</button>
      </form>

      {/* 右侧操作 */}
      <div className="header-right">
        {/* 消息通知 */}
        <button className="header-btn notification-btn" onClick={() => navigate('/messages')}>
          <Bell size={20} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>

        {/* 用户菜单 */}
        <div className="user-menu-container" ref={menuRef}>
          <button 
            className="user-avatar-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.name?.[0] || user?.phone?.[0] || '游'}
            </div>
            <ChevronDown size={14} className={`arrow-icon ${showUserMenu ? 'open' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              {user ? (
                <>
                  <div className="user-info">
                    <div className="user-name">{user.name || user.phone}</div>
                    <div className="user-level">
                      {user.level || '社区用户'}
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <button 
                    className="dropdown-item"
                    onClick={() => { navigate('/user-center'); setShowUserMenu(false) }}
                  >
                    <User size={16} />
                    <span>个人中心</span>
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => { navigate('/favorites'); setShowUserMenu(false) }}
                  >
                    <Bookmark size={16} />
                    <span>我的收藏</span>
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => { navigate('/settings'); setShowUserMenu(false) }}
                  >
                    <Settings size={16} />
                    <span>账号设置</span>
                  </button>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>退出登录</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="dropdown-item"
                    onClick={() => { navigate('/login'); setShowUserMenu(false) }}
                  >
                    <User size={16} />
                    <span>登录</span>
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => { navigate('/register'); setShowUserMenu(false) }}
                  >
                    <User size={16} />
                    <span>注册</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
