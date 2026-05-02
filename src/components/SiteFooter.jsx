import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

// 默认导航配置
const defaultNavItems = [
  { id: 'home', label: '首页', path: '/', icon: '🏠', status: 'visible', order: 1 },
  { id: 'training', label: '智力值认证', path: null, icon: '🎓', status: 'visible', order: 2 },
  { id: 'demand', label: '企业需求仓', path: '/demand', icon: '💼', status: 'visible', order: 3 },
  { id: 'community', label: '碳硅共振圈', path: null, icon: '👥', status: 'visible', order: 4 },
  { id: 'tools', label: '创作者工具', path: '/tools', icon: '🛠️', status: 'visible', order: 5 },
]

export default function SiteFooter() {
  const [navItems, setNavItems] = useState(defaultNavItems)

  useEffect(() => {
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
          const sortedItems = items
            .filter(item => item.status === 'visible')
            .sort((a, b) => a.order - b.order)
          setNavItems(sortedItems)
        }
      }
    } catch (e) {
      console.error('[SiteFooter] 加载导航配置失败:', e)
    }
  }, [])

  return (
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
              {navItems.map(item => (
                <li key={item.id}>
                  <Link to={item.path || '/'} className="hover:text-white transition-colors">
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
  )
}
