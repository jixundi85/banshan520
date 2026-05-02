/**
 * 统一需求数据模型
 * 解决多页面数据不一致的问题
 */

// ============ 常量定义 ============

// 需求状态
export const DEMAND_STATUS = {
  PENDING: 'pending',      // 待接单
  MATCHING: 'matching',    // 匹配中
  PROGRESS: 'progress',    // 进行中
  COMPLETED: 'completed',  // 已完成
  CANCELLED: 'cancelled',  // 已取消
}

// 需求类型
export const DEMAND_TYPE = {
  ENTERPRISE: 'enterprise', // 企业需求
  PERSONAL: 'personal',       // 个人需求
}

// 投标状态
export const BID_STATUS = {
  PENDING: 'pending',    // 待选择
  ACCEPTED: 'accepted',  // 已接受
  REJECTED: 'rejected',  // 已拒绝
}

// 分类元数据（统一配置）
export const CATEGORY_META = {
  shortvideo: { 
    id: 'shortvideo', 
    name: 'AI短视频', 
    icon: '🎬', 
    gradient: 'from-cyan-500 to-blue-600',
    light: 'from-cyan-500/15 to-blue-600/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/20'
  },
  shortdrama: { 
    id: 'shortdrama', 
    name: 'AI短剧', 
    icon: '🎭', 
    gradient: 'from-violet-500 to-purple-600',
    light: 'from-violet-500/15 to-purple-600/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    glow: 'shadow-violet-500/20'
  },
  mangadrama: { 
    id: 'mangadrama', 
    name: 'AI漫剧', 
    icon: '📚', 
    gradient: 'from-pink-500 to-rose-600',
    light: 'from-pink-500/15 to-rose-600/10',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    glow: 'shadow-pink-500/20'
  },
  film: { 
    id: 'film', 
    name: 'AI电影', 
    icon: '🎥', 
    gradient: 'from-orange-500 to-amber-600',
    light: 'from-orange-500/15 to-amber-600/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    glow: 'shadow-orange-500/20'
  },
  designer: { 
    id: 'designer', 
    name: 'AI设计师', 
    icon: '🎨', 
    gradient: 'from-emerald-500 to-teal-600',
    light: 'from-emerald-500/15 to-teal-600/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/20'
  },
  commerce: { 
    id: 'commerce', 
    name: 'AI带货变现', 
    icon: '💰', 
    gradient: 'from-yellow-500 to-orange-500',
    light: 'from-yellow-500/15 to-orange-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/20'
  },
  uidesign: { 
    id: 'uidesign', 
    name: 'UI设计', 
    icon: '🖥️', 
    gradient: 'from-blue-500 to-indigo-600',
    light: 'from-blue-500/15 to-indigo-600/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/20'
  },
  advideo: { 
    id: 'advideo', 
    name: '广告片', 
    icon: '📺', 
    gradient: 'from-amber-500 to-yellow-600',
    light: 'from-amber-500/15 to-yellow-600/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/20'
  },
}

// 状态元数据
export const STATUS_META = {
  [DEMAND_STATUS.PENDING]: { 
    label: '待接单', 
    bg: 'bg-amber-500/15', 
    text: 'text-amber-400', 
    border: 'border-amber-500/30', 
    dot: 'bg-amber-400' 
  },
  [DEMAND_STATUS.MATCHING]: { 
    label: '匹配中', 
    bg: 'bg-blue-500/15', 
    text: 'text-blue-400', 
    border: 'border-blue-500/30', 
    dot: 'bg-blue-400 animate-pulse' 
  },
  [DEMAND_STATUS.PROGRESS]: { 
    label: '进行中', 
    bg: 'bg-emerald-500/15', 
    text: 'text-emerald-400', 
    border: 'border-emerald-500/30', 
    dot: 'bg-emerald-400' 
  },
  [DEMAND_STATUS.COMPLETED]: { 
    label: '已完成', 
    bg: 'bg-gray-500/15', 
    text: 'text-gray-400', 
    border: 'border-gray-500/30', 
    dot: 'bg-gray-400' 
  },
  [DEMAND_STATUS.CANCELLED]: { 
    label: '已取消', 
    bg: 'bg-red-500/15', 
    text: 'text-red-400', 
    border: 'border-red-500/30', 
    dot: 'bg-red-400' 
  },
}

// localStorage keys（统一）
export const STORAGE_KEYS = {
  DEMANDS: 'unified_demands',        // 统一需求列表
  MY_DEMANDS: 'unified_my_demands',  // 我的需求
  MY_BIDS: 'unified_my_bids',        // 我的投标
  USER_INFO: 'user_info',            // 用户信息
}

// ============ 数据操作工具函数 ============

/**
 * 生成唯一ID
 */
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 获取需求列表
 */
export const getDemands = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DEMANDS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * 保存需求列表
 */
export const saveDemands = (demands) => {
  localStorage.setItem(STORAGE_KEYS.DEMANDS, JSON.stringify(demands))
}

/**
 * 获取我的需求
 */
export const getMyDemands = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MY_DEMANDS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * 保存我的需求
 */
export const saveMyDemands = (demands) => {
  localStorage.setItem(STORAGE_KEYS.MY_DEMANDS, JSON.stringify(demands))
}

/**
 * 获取我的投标
 */
export const getMyBids = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MY_BIDS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * 保存我的投标
 */
export const saveMyBids = (bids) => {
  localStorage.setItem(STORAGE_KEYS.MY_BIDS, JSON.stringify(bids))
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_INFO)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

/**
 * 保存用户信息
 */
export const saveUserInfo = (userInfo) => {
  localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
}

/**
 * 根据ID获取需求
 */
export const getDemandById = (id) => {
  const demands = getDemands()
  return demands.find(d => d.id === id) || null
}

/**
 * 创建新需求（统一入口）
 */
export const createDemand = (demandData) => {
  const userInfo = getUserInfo()
  const now = new Date().toISOString()
  
  const newDemand = {
    id: generateId(),
    type: demandData.type || DEMAND_TYPE.PERSONAL,
    
    // 基本信息
    title: demandData.title || '',
    desc: demandData.desc || '',
    catId: demandData.catId || 'shortvideo',
    
    // 发布方信息
    publisherId: userInfo?.id || 'anonymous',
    publisherName: userInfo?.name || demandData.publisherName || '匿名用户',
    publisherAvatar: userInfo?.avatar || demandData.publisherAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous',
    companyName: demandData.companyName || '',
    
    // 预算与周期
    budget: demandData.budget || 0,
    budgetMin: demandData.budgetMin || demandData.budget || 0,
    budgetMax: demandData.budgetMax || demandData.budget || 0,
    budgetType: demandData.budgetType || 'fixed',
    deadline: demandData.deadline || '',
    timeline: demandData.timeline || '',
    
    // 需求规格
    tags: demandData.tags || [],
    requirements: demandData.requirements || [],
    attachments: demandData.attachments || [],
    
    // 状态与流程
    status: DEMAND_STATUS.PENDING,
    
    // 投标信息
    bids: [],
    winnerId: null,
    winnerName: null,
    
    // 统计
    views: 0,
    likes: 0,
    collected: false,
    
    // 时间戳
    createdAt: now,
    updatedAt: now,
    publishTime: now,
  }
  
  // 添加到统一需求列表
  const demands = getDemands()
  demands.unshift(newDemand)
  saveDemands(demands)
  
  // 添加到我的需求
  const myDemands = getMyDemands()
  myDemands.unshift({ ...newDemand, isOwner: true })
  saveMyDemands(myDemands)
  
  return newDemand
}

/**
 * 更新需求
 */
export const updateDemand = (id, updates) => {
  const demands = getDemands()
  const index = demands.findIndex(d => d.id === id)
  
  if (index === -1) return null
  
  demands[index] = {
    ...demands[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  saveDemands(demands)
  
  // 同步更新我的需求
  const myDemands = getMyDemands()
  const myIndex = myDemands.findIndex(d => d.id === id)
  if (myIndex !== -1) {
    myDemands[myIndex] = {
      ...myDemands[myIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    saveMyDemands(myDemands)
  }
  
  return demands[index]
}

/**
 * 删除需求
 */
export const deleteDemand = (id) => {
  // 从统一需求列表删除
  let demands = getDemands()
  demands = demands.filter(d => d.id !== id)
  saveDemands(demands)
  
  // 从我的需求删除
  let myDemands = getMyDemands()
  myDemands = myDemands.filter(d => d.id !== id)
  saveMyDemands(myDemands)
}

/**
 * 添加投标
 */
export const addBid = (demandId, bidData) => {
  const userInfo = getUserInfo()
  const now = new Date().toISOString()
  
  const bid = {
    id: generateId(),
    demandId,
    opcId: userInfo?.id || 'anonymous',
    opcName: userInfo?.name || bidData.opcName || '匿名OPC',
    opcAvatar: userInfo?.avatar || bidData.opcAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=OPC',
    price: bidData.price || 0,
    days: bidData.days || 0,
    proposal: bidData.proposal || '',
    contactWechat: bidData.contactWechat || '',
    contactPhone: bidData.contactPhone || '',
    status: BID_STATUS.PENDING,
    createdAt: now,
  }
  
  // 更新需求
  const demands = getDemands()
  const index = demands.findIndex(d => d.id === demandId)
  
  if (index !== -1) {
    demands[index].bids.push(bid)
    demands[index].updatedAt = now
    saveDemands(demands)
  }
  
  // 添加到我的投标
  const myBids = getMyBids()
  myBids.unshift({ ...bid, isMyBid: true })
  saveMyBids(myBids)
  
  return bid
}

/**
 * 更新投标状态（接受/拒绝）
 */
export const updateBidStatus = (demandId, bidId, status) => {
  const demands = getDemands()
  const index = demands.findIndex(d => d.id === demandId)
  
  if (index === -1) return null
  
  const bidIndex = demands[index].bids.findIndex(b => b.id === bidId)
  if (bidIndex === -1) return null
  
  // 更新所有投标状态
  demands[index].bids.forEach((b, i) => {
    if (i === bidIndex) {
      demands[index].bids[i].status = status
      if (status === BID_STATUS.ACCEPTED) {
        demands[index].winnerId = b.opcId
        demands[index].winnerName = b.opcName
        demands[index].status = DEMAND_STATUS.PROGRESS
      }
    } else if (status === BID_STATUS.ACCEPTED) {
      demands[index].bids[i].status = BID_STATUS.REJECTED
    }
  })
  
  demands[index].updatedAt = new Date().toISOString()
  saveDemands(demands)
  
  // 同步更新我的需求
  const myDemands = getMyDemands()
  const myIndex = myDemands.findIndex(d => d.id === demandId)
  if (myIndex !== -1) {
    myDemands[myIndex] = { ...demands[index] }
    saveMyDemands(myDemands)
  }
  
  return demands[index]
}

/**
 * 获取用户投标的需求
 */
export const getMyBidDemands = () => {
  const myBids = getMyBids()
  const bidDemandIds = [...new Set(myBids.map(b => b.demandId))]
  
  const demands = getDemands()
  return demands.filter(d => bidDemandIds.includes(d.id))
}

/**
 * 获取用户的需求（发布的）
 */
export const getUserPublishedDemands = () => {
  const userInfo = getUserInfo()
  const userId = userInfo?.id || 'anonymous'
  
  const demands = getDemands()
  return demands.filter(d => d.publisherId === userId)
}

/**
 * 获取指定分类的需求
 */
export const getDemandsByCategory = (catId) => {
  const demands = getDemands()
  if (catId === 'all') return demands
  return demands.filter(d => d.catId === catId)
}

/**
 * 获取指定状态的需求
 */
export const getDemandsByStatus = (status) => {
  const demands = getDemands()
  if (status === 'all') return demands
  return demands.filter(d => d.status === status)
}

/**
 * 格式化预算显示
 */
export const formatBudget = (demand) => {
  if (demand.budgetType === 'range') {
    return `¥${demand.budgetMin?.toLocaleString() || 0} - ¥${demand.budgetMax?.toLocaleString() || 0}`
  }
  return `¥${(demand.budget || 0).toLocaleString()}`
}

/**
 * 格式化时间
 */
export const formatTimeAgo = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

/**
 * 获取分类元数据
 */
export const getCategoryMeta = (catId) => {
  return CATEGORY_META[catId] || CATEGORY_META.shortvideo
}

/**
 * 获取状态元数据
 */
export const getStatusMeta = (status) => {
  return STATUS_META[status] || STATUS_META[DEMAND_STATUS.PENDING]
}

/**
 * 是否为设计类分类
 */
export const isDesignCategory = (catId) => {
  return ['designer', 'mangadrama', 'uidesign', 'logodesign'].includes(catId)
}
