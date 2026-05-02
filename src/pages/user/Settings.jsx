import { useState, useEffect } from 'react'

export default function Settings() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      push: false,
      orderUpdates: true,
      courseUpdates: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      worksVisible: true,
      showEmail: false,
      showPhone: false
    },
    preferences: {
      theme: 'dark',
      language: 'zh-CN'
    }
  })

  const handleToggle = (category, key) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">账号安全设置</h1>
        <p className="text-gray-400">管理您的账号安全和隐私选项</p>
      </div>

      {/* 账号安全设置 */}
      <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">账号安全设置</h2>
        </div>
        <div className="divide-y divide-white/5">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">登录密码</p>
              <p className="text-sm text-gray-400">定期更换密码可以保护账号安全</p>
            </div>
            <button
              onClick={() => alert('密码修改功能开发中')}
              className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all"
            >
              修改密码
            </button>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">绑定邮箱</p>
              <p className="text-sm text-gray-400">{user?.email || '未绑定'}</p>
            </div>
            <button
              onClick={() => alert('邮箱更换功能开发中')}
              className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all"
            >
              更换邮箱
            </button>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">绑定手机</p>
              <p className="text-sm text-gray-400">{user?.phone || '未绑定'}</p>
            </div>
            <button
              onClick={() => alert('手机更换功能开发中')}
              className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all"
            >
              更换手机
            </button>
          </div>
        </div>
      </div>

      {/* 通知设置 */}
      <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">通知设置</h2>
        </div>
        <div className="divide-y divide-white/5">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white">邮件通知</p>
              <p className="text-sm text-gray-400">接收重要邮件通知</p>
            </div>
            <button 
              onClick={() => handleToggle('notifications', 'email')}
              className={`w-12 h-6 rounded-full transition-colors ${settings.notifications.email ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications.email ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white">短信通知</p>
              <p className="text-sm text-gray-400">接收短信提醒</p>
            </div>
            <button 
              onClick={() => handleToggle('notifications', 'sms')}
              className={`w-12 h-6 rounded-full transition-colors ${settings.notifications.sms ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications.sms ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white">推送通知</p>
              <p className="text-sm text-gray-400">接收浏览器推送</p>
            </div>
            <button 
              onClick={() => handleToggle('notifications', 'push')}
              className={`w-12 h-6 rounded-full transition-colors ${settings.notifications.push ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications.push ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white">订单更新</p>
              <p className="text-sm text-gray-400">订单状态变化时通知</p>
            </div>
            <button 
              onClick={() => handleToggle('notifications', 'orderUpdates')}
              className={`w-12 h-6 rounded-full transition-colors ${settings.notifications.orderUpdates ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications.orderUpdates ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white">课程更新</p>
              <p className="text-sm text-gray-400">新课程上线和更新通知</p>
            </div>
            <button 
              onClick={() => handleToggle('notifications', 'courseUpdates')}
              className={`w-12 h-6 rounded-full transition-colors ${settings.notifications.courseUpdates ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications.courseUpdates ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white">营销通知</p>
              <p className="text-sm text-gray-400">接收优惠活动通知</p>
            </div>
            <button 
              onClick={() => handleToggle('notifications', 'marketing')}
              className={`w-12 h-6 rounded-full transition-colors ${settings.notifications.marketing ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications.marketing ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* 隐私设置 */}
      <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">隐私设置</h2>
        </div>
        <div className="divide-y divide-white/5">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white">个人资料可见性</p>
              <p className="text-sm text-gray-400">其他用户可以看到您的资料</p>
            </div>
            <button 
              onClick={() => handleToggle('privacy', 'profileVisible')}
              className={`w-12 h-6 rounded-full transition-colors ${settings.privacy.profileVisible ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.privacy.profileVisible ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white">作品可见性</p>
              <p className="text-sm text-gray-400">其他用户可以看到您的作品</p>
            </div>
            <button 
              onClick={() => handleToggle('privacy', 'worksVisible')}
              className={`w-12 h-6 rounded-full transition-colors ${settings.privacy.worksVisible ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.privacy.worksVisible ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white">显示邮箱</p>
              <p className="text-sm text-gray-400">在个人页面显示邮箱</p>
            </div>
            <button 
              onClick={() => handleToggle('privacy', 'showEmail')}
              className={`w-12 h-6 rounded-full transition-colors ${settings.privacy.showEmail ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.privacy.showEmail ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white">显示手机号</p>
              <p className="text-sm text-gray-400">在个人页面显示手机号</p>
            </div>
            <button 
              onClick={() => handleToggle('privacy', 'showPhone')}
              className={`w-12 h-6 rounded-full transition-colors ${settings.privacy.showPhone ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.privacy.showPhone ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* 偏好设置 */}
      <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">偏好设置</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">界面主题</label>
            <select 
              value={settings.preferences.theme}
              onChange={(e) => setSettings(prev => ({ ...prev, preferences: { ...prev.preferences, theme: e.target.value } }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="dark">深色模式</option>
              <option value="light">浅色模式</option>
              <option value="auto">跟随系统</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">语言</label>
            <select 
              value={settings.preferences.language}
              onChange={(e) => setSettings(prev => ({ ...prev, preferences: { ...prev.preferences, language: e.target.value } }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* 危险区域 */}
      <div className="bg-red-500/10 rounded-2xl border border-red-500/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-500/30">
          <h2 className="text-lg font-semibold text-red-400">危险区域</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white">注销账号</p>
              <p className="text-sm text-gray-400">永久删除您的账号和所有数据</p>
            </div>
            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all">
              注销账号
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
