import { useState, useEffect } from 'react'
import {
  Settings, Image, Type, Palette, Save,
  Plus, Edit, Trash2, Eye, RefreshCw, GripVertical, ArrowUp, ArrowDown
} from 'lucide-react'
import dataService from './dataService'

export default function Content() {
  const [navConfig, setNavConfig] = useState([])
  const [homeConfig, setHomeConfig] = useState(null)
  const [activeTab, setActiveTab] = useState('nav')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // 直接使用 localStorage 读取，key 为 admin_navConfig（与前端一致）
    const navConfigStr = localStorage.getItem('admin_navConfig')
    if (navConfigStr) {
      try {
        const nav = JSON.parse(navConfigStr)
        if (nav && nav.items && nav.items.length > 0) {
          setNavConfig(nav.items)
        } else {
          initDefaultNav()
        }
      } catch {
        initDefaultNav()
      }
    } else {
      initDefaultNav()
    }

    const home = dataService.loadData('homeConfig')
    if (home) setHomeConfig(home)
  }

  const initDefaultNav = () => {
    // 如果没有配置，使用默认配置
    const defaultNavItems = [
      { id: 'home', label: '首页', path: '/', icon: '🏠', status: 'visible', order: 1 },
      { id: 'training', label: 'AIGC课程', path: '/training', icon: '🎓', status: 'visible', order: 2 },
      { id: 'demand', label: '需求广场', path: '/demand', icon: '💼', status: 'visible', order: 3 },
      { id: 'community', label: '交流社区', path: '/community', icon: '👥', status: 'visible', order: 4 },
      { id: 'event', label: '赛事论坛', path: '/event', icon: '🏆', status: 'visible', order: 5 },
      { id: 'creator', label: '签约创作者', path: '/creator', icon: '✨', status: 'visible', order: 6 },
    ]
    setNavConfig(defaultNavItems)
    localStorage.setItem('admin_navConfig', JSON.stringify({ items: defaultNavItems }))
  }

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const saveNavConfig = (items) => {
    // 直接使用 localStorage 保存，key 为 admin_navConfig（与前端一致）
    localStorage.setItem('admin_navConfig', JSON.stringify({ items }))
    setNavConfig(items)
    showToast('导航配置已保存')
    // 通知前端页面刷新导航配置
    window.dispatchEvent(new Event('navConfigUpdated'))
  }

  const handleEditNav = (item) => {
    setEditItem({ ...item })
    setShowEditModal(true)
  }

  const handleSaveNav = () => {
    // 检查是新增还是编辑
    const isNewItem = !navConfig.find(item => item.id === editItem.id)

    let newItems
    if (isNewItem) {
      // 新增：添加到列表末尾
      newItems = [...navConfig, { ...editItem, order: navConfig.length + 1 }]
    } else {
      // 编辑：更新现有项
      newItems = navConfig.map(item =>
        item.id === editItem.id ? editItem : item
      )
    }
    saveNavConfig(newItems)
    setShowEditModal(false)
    setEditItem(null)
  }

  const handleAddNav = () => {
    const newItem = {
      id: `nav_${Date.now()}`,
      label: '新菜单',
      path: '/',
      icon: '📄',
      status: 'visible',
      order: navConfig.length + 1
    }
    console.log('[Content] 添加新导航项:', newItem)
    setEditItem(newItem)
    setShowEditModal(true)
  }

  const handleDeleteNav = (item) => {
    if (window.confirm(`确定要删除导航项 "${item.label}" 吗？`)) {
      const newItems = navConfig.filter(i => i.id !== item.id)
      console.log('[Content] 删除导航项:', item.label, '剩余项数:', newItems.length)
      saveNavConfig(newItems)
    }
  }

  const handleMoveNav = (item, direction) => {
    const currentItems = [...navConfig]
    const index = currentItems.findIndex(i => i.id === item.id)

    if (direction === 'up' && index > 0) {
      // 上移：与上一个交换
      const temp = currentItems[index - 1]
      currentItems[index - 1] = currentItems[index]
      currentItems[index] = temp
      console.log('[Content] 上移导航项:', item.label, '到位置', index)
    } else if (direction === 'down' && index < currentItems.length - 1) {
      // 下移：与下一个交换
      const temp = currentItems[index + 1]
      currentItems[index + 1] = currentItems[index]
      currentItems[index] = temp
      console.log('[Content] 下移导航项:', item.label, '到位置', index + 2)
    } else {
      return // 无法移动
    }

    // 重新计算 order
    const reorderedItems = currentItems.map((i, idx) => ({ ...i, order: idx + 1 }))
    console.log('[Content] 新顺序:', reorderedItems.map(i => i.label))
    saveNavConfig(reorderedItems)
  }

  const handleToggleNavStatus = (item) => {
    const newStatus = item.status === 'visible' ? 'hidden' : 'visible'
    const newItems = navConfig.map(i =>
      i.id === item.id ? { ...i, status: newStatus } : i
    )
    saveNavConfig(newItems)
    showToast(`导航项已${newStatus === 'visible' ? '显示' : '隐藏'}`)
  }

  // 恢复导航默认配置
  const handleResetNav = () => {
    if (window.confirm('确定要恢复导航默认配置吗？这将重置所有导航项。')) {
      const defaultNavItems = [
        { id: 'home', label: '首页', path: '/', icon: '🏠', status: 'visible', order: 1 },
        { id: 'training', label: 'AIGC课程', path: '/training', icon: '🎓', status: 'visible', order: 2 },
        { id: 'demand', label: '需求广场', path: '/demand', icon: '💼', status: 'visible', order: 3 },
        { id: 'community', label: '交流社区', path: '/community', icon: '👥', status: 'visible', order: 4 },
        { id: 'event', label: '赛事论坛', path: '/event', icon: '🏆', status: 'visible', order: 5 },
        { id: 'creator', label: '签约创作者', path: '/creator', icon: '✨', status: 'visible', order: 6 },
      ]
      saveNavConfig(defaultNavItems)
      showToast('导航配置已恢复默认')
      window.dispatchEvent(new Event('navConfigUpdated'))
    }
  }

  const saveHomeConfig = (updates) => {
    const newConfig = { ...homeConfig, ...updates }
    dataService.saveData('homeConfig', newConfig)
    setHomeConfig(newConfig)
    showToast('首页配置已保存')
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-green-500 text-white">
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">内容配置</h1>
          <p className="text-gray-400">配置首页展示内容、导航栏等</p>
        </div>
        <button onClick={loadData} className="btn-secondary flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          刷新
        </button>
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-xl">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('nav')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'nav'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            导航配置
          </button>
          <button
            onClick={() => setActiveTab('banner')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'banner'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Image className="w-4 h-4 inline mr-2" />
            Banner配置
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'stats'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4 inline mr-2" />
            数据配置
          </button>
        </div>

        {/* Navigation Config */}
        {activeTab === 'nav' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">顶部导航栏</h3>
                <p className="text-sm text-gray-400">拖拽调整顺序，点击编辑详细内容</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleResetNav} className="btn-secondary flex items-center gap-2 text-orange-400 border-orange-400/30 hover:border-orange-400">
                  <RefreshCw className="w-4 h-4" />
                  恢复默认
                </button>
                <button onClick={handleAddNav} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  添加菜单
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {navConfig.sort((a, b) => a.order - b.order).map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <GripVertical className="w-5 h-5 text-gray-500 cursor-move" />
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.path}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'visible'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {item.status === 'visible' ? '显示' : '隐藏'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleMoveNav(item, 'up')} disabled={index === 0} className="p-1.5 hover:bg-white/10 rounded disabled:opacity-30">
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleMoveNav(item, 'down')} disabled={index === navConfig.length - 1} className="p-1.5 hover:bg-white/10 rounded disabled:opacity-30">
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEditNav(item)} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleNavStatus(item)} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteNav(item)} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Banner Config */}
        {activeTab === 'banner' && homeConfig && (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-medium">首页Banner</h3>
              <p className="text-sm text-gray-400">管理首页轮播图展示</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {homeConfig.banners.map((banner, index) => (
                <div key={banner.id} className="bg-white/5 rounded-xl overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-4xl text-white/50">📷</span>
                  </div>
                  <div className="p-4">
                    <div className="font-medium mb-1">{banner.title}</div>
                    <div className="text-sm text-gray-400 mb-2">{banner.subtitle}</div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        banner.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {banner.status === 'active' ? '启用' : '禁用'}
                      </span>
                      <span className="text-xs text-gray-500">排序: {banner.order}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Config */}
        {activeTab === 'stats' && homeConfig && (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-medium">首页数据统计</h3>
              <p className="text-sm text-gray-400">修改首页展示的统计数据</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <label className="block text-sm text-gray-400 mb-2">总用户数</label>
                <input
                  type="number"
                  value={homeConfig.stats?.usersCount || 0}
                  onChange={(e) => saveHomeConfig({
                    stats: { ...homeConfig.stats, usersCount: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <label className="block text-sm text-gray-400 mb-2">课程数量</label>
                <input
                  type="number"
                  value={homeConfig.stats?.coursesCount || 0}
                  onChange={(e) => saveHomeConfig({
                    stats: { ...homeConfig.stats, coursesCount: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <label className="block text-sm text-gray-400 mb-2">认证创作者</label>
                <input
                  type="number"
                  value={homeConfig.stats?.creatorsCount || 0}
                  onChange={(e) => saveHomeConfig({
                    stats: { ...homeConfig.stats, creatorsCount: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-2.5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <label className="block text-sm text-gray-400 mb-2">需求总数</label>
                <input
                  type="number"
                  value={homeConfig.stats?.demandsCount || 0}
                  onChange={(e) => saveHomeConfig({
                    stats: { ...homeConfig.stats, demandsCount: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-slate-800/95 rounded-2xl border border-white/10 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold">编辑导航项</h3>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400">
                ×
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">菜单名称</label>
                <input
                  type="text"
                  value={editItem.label || ''}
                  onChange={(e) => setEditItem({ ...editItem, label: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">链接路径</label>
                <input
                  type="text"
                  value={editItem.path || ''}
                  onChange={(e) => setEditItem({ ...editItem, path: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">图标 (emoji)</label>
                <input
                  type="text"
                  value={editItem.icon || ''}
                  onChange={(e) => setEditItem({ ...editItem, icon: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">状态</label>
                <select
                  value={editItem.status || 'visible'}
                  onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="visible">显示</option>
                  <option value="hidden">隐藏</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">排序</label>
                <input
                  type="number"
                  value={editItem.order || 1}
                  onChange={(e) => setEditItem({ ...editItem, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400">
                取消
              </button>
              <button onClick={handleSaveNav} className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white font-medium">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
