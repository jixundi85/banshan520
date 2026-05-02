/**
 * 后台数据管理服务
 * 统一管理所有后台数据，实现前后端数据同步
 */

// 数据版本号 - 更新此数字可以强制刷新所有数据
const DATA_VERSION = '1.0.6'

// 初始化数据
const initData = {
  users: [
    { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '13812345678', avatar: '张', role: 'user', status: 'active', points: 500, balance: 120.50, registeredAt: '2024-03-15', lastLogin: '2026-04-09 10:30' },
    { id: 2, name: '李四', email: 'lisi@example.com', phone: '13912345678', avatar: '李', role: 'creator', status: 'active', points: 2000, balance: 3500.00, registeredAt: '2024-02-20', lastLogin: '2026-04-09 09:15' },
    { id: 3, name: '王五', email: 'wangwu@example.com', phone: '13612345678', avatar: '王', role: 'user', status: 'active', points: 100, balance: 0, registeredAt: '2024-04-01', lastLogin: '2026-04-08 18:20' },
    { id: 4, name: '林小艺', email: 'linxiaoyi@example.com', phone: '13712345678', avatar: '林', role: 'creator', status: 'active', points: 5000, balance: 12500.00, isCertified: true, certifiedSkills: ['AI短视频', '内容策划'], registeredAt: '2024-01-10', lastLogin: '2026-04-09 11:00' },
    { id: 5, name: '赵六', email: 'zhaoliu@example.com', phone: '13512345678', avatar: '赵', role: 'user', status: 'inactive', points: 0, balance: 0, registeredAt: '2024-03-25', lastLogin: '2026-03-28 09:15' },
  ],

  creatorApplications: [
    { id: 1, userId: 2, name: '李四', avatar: '李', skills: ['AI短视频', 'AI电影'], works: [{title: '科技公司宣传片', url: 'https://douyin.com/xxx'}], status: 'approved', applyTime: '2024-02-15', reviewTime: '2024-02-17', reviewBy: 'admin' },
    { id: 2, userId: 4, name: '林小艺', avatar: '林', skills: ['AI短视频', '内容策划', '流量运营'], works: [{title: '品牌营销案例集', url: 'https://xiaohongshu.com/xxx'}], status: 'approved', applyTime: '2024-01-05', reviewTime: '2024-01-07', reviewBy: 'admin' },
  ],

  courses: [
    { id: 1, title: 'AI短视频创作实战', category: 'AI短视频', teacher: '林小艺', teacherId: 4, price: 299, students: 1234, rating: 4.8, thumbnail: '', featured: true, status: 'published', createdAt: '2024-03-01' },
    { id: 2, title: 'AI短剧制作全攻略', category: 'AI短剧', teacher: '李思琪', teacherId: 2, price: 399, students: 856, rating: 4.9, thumbnail: '', featured: true, status: 'published', createdAt: '2024-03-05' },
    { id: 3, title: 'AI漫剧创作入门', category: 'AI漫剧', teacher: '张明远', teacherId: 2, price: 199, students: 2341, rating: 4.7, thumbnail: '', featured: false, status: 'published', createdAt: '2024-03-10' },
    { id: 4, title: 'AI电影特效制作', category: 'AI电影', teacher: '林小艺', teacherId: 4, price: 599, students: 567, rating: 4.9, thumbnail: '', featured: true, status: 'published', createdAt: '2024-03-15' },
    { id: 5, title: 'AI设计师实战课', category: 'AI设计师', teacher: '王浩宇', teacherId: 2, price: 349, students: 1892, rating: 4.6, thumbnail: '', featured: true, status: 'published', createdAt: '2024-03-20' },
    { id: 6, title: 'AI带货变现指南', category: 'AI带货变现', teacher: '陈雨萱', teacherId: 2, price: 299, students: 3456, rating: 4.8, thumbnail: '', featured: true, status: 'published', createdAt: '2024-03-25' },
  ],

  cases: [
    { id: 1, title: '用AI工具3分钟生成爆款短视频', category: 'AI短视频', author: '林小艺', price: 0, views: 12580, likes: 856, status: 'published', createdAt: '2024-03-01' },
    { id: 2, title: 'AI漫剧创作：从零到爆款', category: 'AI漫剧', author: '李思琪', price: 29, views: 8960, likes: 623, status: 'published', createdAt: '2024-03-05' },
    { id: 3, title: '科技公司品牌宣传片制作', category: 'AI电影', author: '张明远', price: 0, views: 15230, likes: 1024, status: 'published', createdAt: '2024-03-10' },
  ],

  demands: [
    { id: 1, title: '科技公司品牌宣传片制作', category: 'AI短视频', client: '王总', budget: 5000, bids: 12, status: 'open', urgent: false, createdAt: '2024-04-01' },
    { id: 2, title: '房地产楼盘航拍视频', category: 'AI短视频', client: '李总', budget: 3000, bids: 8, status: 'open', urgent: true, createdAt: '2024-04-02' },
    { id: 3, title: '悬疑推理短剧10集', category: 'AI短剧', client: '张导', budget: 15000, bids: 5, status: 'open', urgent: false, createdAt: '2024-04-03' },
  ],

  orders: [
    { id: 'ORD202604090001', userId: 1, userName: '张三', type: 'course', itemId: 1, itemTitle: 'AI短视频创作实战', amount: 299, status: 'completed', createTime: '2026-04-09 10:30' },
    { id: 'ORD202604090002', userId: 3, userName: '王五', type: 'case', itemId: 2, itemTitle: 'AI漫剧创作入门', amount: 29, status: 'completed', createTime: '2026-04-09 11:15' },
    { id: 'ORD202604090003', userId: 1, userName: '张三', type: 'demand_bid', itemId: 1, itemTitle: '科技公司品牌宣传片', amount: 5000, status: 'pending', createTime: '2026-04-09 12:00' },
  ],

  homeConfig: {
    banners: [
      { id: 1, image: '', title: 'AI创作时代', subtitle: '开启你的创意之旅', link: '/training', order: 1, status: 'active' },
      { id: 2, image: '', title: '成为认证创作者', subtitle: '优质创作者招募中', link: '/creator', order: 2, status: 'active' },
      { id: 3, image: '', title: '需求大厅', subtitle: '海量需求等你来接', link: '/demand', order: 3, status: 'active' },
    ],
    stats: {
      usersCount: 10234,
      coursesCount: 48,
      creatorsCount: 532,
      demandsCount: 1567,
    }
  },

  navConfig: {
    items: [
      { id: 'home', label: '首页', path: '/', icon: '🏠', status: 'visible', order: 1 },
      { id: 'training', label: '智力值认证', path: '/training', icon: '🎓', status: 'visible', order: 2 },
      { id: 'demand', label: '企业需求仓', path: '/demand', icon: '💼', status: 'visible', order: 3 },
      { id: 'community', label: '碳硅共振圈', path: '/community', icon: '👥', status: 'visible', order: 4 },
      { id: 'creator', label: '认证OPC池', path: '/creator', icon: '✨', status: 'visible', order: 5 },
      { id: 'event', label: '赛事论坛', path: '/event', icon: '🏆', status: 'visible', order: 6 },
    ]
  },

  operationLogs: [
    { id: 1, admin: 'admin', action: '审核通过创作者认证', target: '李四', time: '2024-02-17 14:30', ip: '192.168.1.100' },
    { id: 2, admin: 'admin', action: '上架新课程', target: 'AI短视频创作实战', time: '2024-03-01 10:00', ip: '192.168.1.100' },
    { id: 3, admin: 'admin', action: '修改首页Banner', target: 'Banner #1', time: '2024-03-05 16:45', ip: '192.168.1.100' },
  ]
}

// 从localStorage加载数据
function loadData(key) {
  const stored = localStorage.getItem(`admin_${key}`)
  const storedVersion = localStorage.getItem(`admin_dataVersion`)

  // 检查数据版本，如果版本不匹配或关键数据缺失，使用初始化数据
  if (stored) {
    try {
      const parsed = JSON.parse(stored)

      // 对于 navConfig，检查版本号或关键字段
      if (key === 'navConfig' && parsed.items) {
        // 检查版本号是否匹配，不匹配则刷新
        if (storedVersion !== DATA_VERSION) {
          console.log('[dataService] 导航配置版本更新，使用新数据')
          localStorage.setItem(`admin_${key}`, JSON.stringify(initData[key]))
          return initData[key]
        }
      }

      return parsed
    } catch {
      return stored
    }
  }

  if (initData[key]) {
    localStorage.setItem(`admin_${key}`, JSON.stringify(initData[key]))
    return initData[key]
  }
  return null
}

// 保存数据到localStorage
function saveData(key, data) {
  localStorage.setItem(`admin_${key}`, JSON.stringify(data))
  // 更新版本号
  localStorage.setItem(`admin_dataVersion`, DATA_VERSION)
  window.dispatchEvent(new CustomEvent('adminDataUpdated', { detail: { key, data } }))
  return true
}

// 获取所有数据
function getAllData() {
  const data = {}
  Object.keys(initData).forEach(key => {
    data[key] = loadData(key)
  })
  return data
}

// 添加记录
function addRecord(key, record) {
  const data = loadData(key)
  if (Array.isArray(data)) {
    const newRecord = { ...record, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }
    data.unshift(newRecord)
    saveData(key, data)
    addLog('添加记录', record.name || record.title || `ID: ${newRecord.id}`)
    return newRecord
  }
  return null
}

// 更新记录
function updateRecord(key, id, updates) {
  const data = loadData(key)
  if (Array.isArray(data)) {
    const index = data.findIndex(item => item.id === id)
    if (index !== -1) {
      data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString().split('T')[0] }
      saveData(key, data)
      addLog('更新记录', data[index].name || data[index].title || `ID: ${id}`)
      return data[index]
    }
  }
  return null
}

// 删除记录
function deleteRecord(key, id) {
  const data = loadData(key)
  if (Array.isArray(data)) {
    const item = data.find(item => item.id === id)
    const newData = data.filter(item => item.id !== id)
    saveData(key, newData)
    addLog('删除记录', item?.name || item?.title || `ID: ${id}`)
    return true
  }
  return false
}

// 添加操作日志
function addLog(action, target) {
  const logs = loadData('operationLogs') || []
  const newLog = {
    id: Date.now(),
    admin: 'admin',
    action,
    target,
    time: new Date().toLocaleString(),
    ip: '127.0.0.1'
  }
  logs.unshift(newLog)
  saveData('operationLogs', logs.slice(0, 100))
  return newLog
}

// 重置所有数据
function resetAllData() {
  Object.keys(initData).forEach(key => {
    localStorage.setItem(`admin_${key}`, JSON.stringify(initData[key]))
  })
  window.dispatchEvent(new CustomEvent('adminDataUpdated', { detail: { reset: true } }))
  return true
}

// 获取统计数据
function getStats() {
  const users = loadData('users') || []
  const courses = loadData('courses') || []
  const orders = loadData('orders') || []
  const demands = loadData('demands') || []

  return {
    totalUsers: users.length,
    totalCreators: users.filter(u => u.role === 'creator').length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.status === 'published').length,
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0),
    totalDemands: demands.length,
    openDemands: demands.filter(d => d.status === 'open').length,
  }
}

export {
  loadData,
  saveData,
  getAllData,
  addRecord,
  updateRecord,
  deleteRecord,
  addLog,
  resetAllData,
  getStats
}

const dataService = {
  loadData,
  saveData,
  getAllData,
  addRecord,
  updateRecord,
  deleteRecord,
  addLog,
  resetAllData,
  getStats
}

export default dataService
