import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, BookOpen, Users, UserCog, ShoppingCart, 
  FileText, Settings, LogOut, Bell, Search, Sparkles, Menu, X, Palette, Bot, Copyright,
  MessageSquare
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { path: '/admin/dashboard', label: '数据看板', icon: LayoutDashboard },
  { path: '/admin/course', label: '课程管理', icon: BookOpen },
  { path: '/admin/user', label: '用户管理', icon: Users },
  { path: '/admin/creator', label: '创作者管理', icon: UserCog },
  { path: '/admin/demand', label: '需求管理', icon: ShoppingCart },
  { path: '/admin/copyright', label: '版权管理', icon: Copyright },
  { path: '/admin/community', label: '社区管理', icon: MessageSquare },
  { path: '/admin/order', label: '订单管理', icon: FileText },
  { path: '/admin/content', label: '内容配置', icon: Palette },
  { path: '/admin/ai-assistant', label: 'AI智能客服', icon: Bot },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/admin/login')
  }

  return (
    <>
      <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen bg-dark-800 border-r border-dark-600 z-50 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-600">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AIGC</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg">
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === path
                  ? 'bg-brand-blue/10 text-brand-blue border-l-2 border-brand-blue'
                  : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-600">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:bg-dark-700 hover:text-red-400 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>退出登录</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <header className="h-16 bg-dark-800 border-b border-dark-600 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="搜索..." 
                className="w-64 pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-cyan flex items-center justify-center text-white font-bold">
                管
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">管理员</p>
                <p className="text-xs text-gray-500">超级管理员</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
    </>
  )
}
