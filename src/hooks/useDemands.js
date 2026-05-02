/**
 * 统一需求数据操作 Hook
 * 提供响应式的数据管理能力
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getDemands,
  getMyDemands,
  getMyBids,
  getUserInfo,
  getDemandById,
  createDemand,
  updateDemand,
  deleteDemand,
  addBid,
  updateBidStatus,
  getMyBidDemands,
  getUserPublishedDemands,
  getDemandsByCategory,
  getDemandsByStatus,
  saveUserInfo,
  generateId,
  DEMAND_STATUS,
  CATEGORY_META,
  STATUS_META,
} from '../data/demandSchema'

/**
 * 主 Hook：管理所有需求数据
 */
export const useDemands = () => {
  const [demands, setDemands] = useState([])
  const [loading, setLoading] = useState(true)

  // 加载数据
  const loadDemands = useCallback(() => {
    const data = getDemands()
    setDemands(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadDemands()
    // 监听 storage 变化（跨页面同步）
    const handleStorage = () => loadDemands()
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [loadDemands])

  // 创建需求
  const publishDemand = useCallback((demandData) => {
    const newDemand = createDemand(demandData)
    loadDemands()
    return newDemand
  }, [loadDemands])

  // 更新需求
  const editDemand = useCallback((id, updates) => {
    const updated = updateDemand(id, updates)
    loadDemands()
    return updated
  }, [loadDemands])

  // 删除需求
  const removeDemand = useCallback((id) => {
    deleteDemand(id)
    loadDemands()
  }, [loadDemands])

  // 投标
  const submitBid = useCallback((demandId, bidData) => {
    const bid = addBid(demandId, bidData)
    loadDemands()
    return bid
  }, [loadDemands])

  // 接受投标
  const acceptBid = useCallback((demandId, bidId) => {
    const updated = updateBidStatus(demandId, bidId, 'accepted')
    loadDemands()
    return updated
  }, [loadDemands])

  // 拒绝投标
  const rejectBid = useCallback((demandId, bidId) => {
    const updated = updateBidStatus(demandId, bidId, 'rejected')
    loadDemands()
    return updated
  }, [loadDemands])

  return {
    demands,
    loading,
    publishDemand,
    editDemand,
    removeDemand,
    submitBid,
    acceptBid,
    rejectBid,
    refresh: loadDemands,
  }
}

/**
 * 我的需求 Hook
 */
export const useMyDemands = () => {
  const [myDemands, setMyDemands] = useState([])
  const [loading, setLoading] = useState(true)

  const loadMyDemands = useCallback(() => {
    const data = getMyDemands()
    setMyDemands(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadMyDemands()
    const handleStorage = () => loadMyDemands()
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [loadMyDemands])

  // 按状态分组
  const demandsByStatus = {
    all: myDemands,
    pending: myDemands.filter(d => d.status === DEMAND_STATUS.PENDING),
    matching: myDemands.filter(d => d.status === DEMAND_STATUS.MATCHING),
    progress: myDemands.filter(d => d.status === DEMAND_STATUS.PROGRESS),
    completed: myDemands.filter(d => d.status === DEMAND_STATUS.COMPLETED),
  }

  return {
    myDemands,
    demandsByStatus,
    loading,
    refresh: loadMyDemands,
  }
}

/**
 * 我的投标 Hook
 */
export const useMyBids = () => {
  const [myBids, setMyBids] = useState([])
  const [bidDemands, setBidDemands] = useState([])
  const [loading, setLoading] = useState(true)

  const loadMyBids = useCallback(() => {
    const bids = getMyBids()
    const demands = getMyBidDemands()
    setMyBids(bids)
    setBidDemands(demands)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadMyBids()
    const handleStorage = () => loadMyBids()
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [loadMyBids])

  return {
    myBids,
    bidDemands,
    loading,
    refresh: loadMyBids,
  }
}

/**
 * 单个需求 Hook
 */
export const useDemand = (id) => {
  const [demand, setDemand] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadDemand = useCallback(() => {
    const data = getDemandById(id)
    setDemand(data)
    setLoading(false)
  }, [id])

  useEffect(() => {
    if (id) {
      loadDemand()
      const handleStorage = () => loadDemand()
      window.addEventListener('storage', handleStorage)
      return () => window.removeEventListener('storage', handleStorage)
    }
  }, [id, loadDemand])

  return {
    demand,
    loading,
    refresh: loadDemand,
  }
}

/**
 * 用户信息 Hook
 */
export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null)

  const loadUserInfo = useCallback(() => {
    const data = getUserInfo()
    setUserInfo(data)
  }, [])

  useEffect(() => {
    loadUserInfo()
  }, [loadUserInfo])

  const updateUserInfo = useCallback((info) => {
    const newInfo = { ...userInfo, ...info }
    saveUserInfo(newInfo)
    setUserInfo(newInfo)
  }, [userInfo])

  return {
    userInfo,
    updateUserInfo,
    refresh: loadUserInfo,
  }
}

/**
 * 需求广场 Hook（带筛选）
 */
export const useDemandMarket = (initialCategory = 'all') => {
  const [category, setCategory] = useState(initialCategory)
  const [budgetRange, setBudgetRange] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [demands, setDemands] = useState([])

  const loadDemands = useCallback(() => {
    let data = getDemands()
    
    // 按分类筛选
    if (category !== 'all') {
      data = data.filter(d => d.catId === category)
    }
    
    // 按预算筛选
    if (budgetRange !== 'all') {
      data = data.filter(d => {
        const budget = d.budget || d.budgetMin || 0
        switch (budgetRange) {
          case 'low': return budget < 3000
          case 'mid': return budget >= 3000 && budget < 10000
          case 'high': return budget >= 10000 && budget < 30000
          case 'top': return budget >= 30000
          default: return true
        }
      })
    }
    
    // 排序
    switch (sortBy) {
      case 'latest':
        data.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
        break
      case 'popular':
        data.sort((a, b) => (b.bids?.length || 0) - (a.bids?.length || 0))
        break
      case 'budget':
        data.sort((a, b) => (b.budget || 0) - (a.budget || 0))
        break
    }
    
    setDemands(data)
  }, [category, budgetRange, sortBy])

  useEffect(() => {
    loadDemands()
    const handleStorage = () => loadDemands()
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [loadDemands])

  return {
    demands,
    category,
    setCategory,
    budgetRange,
    setBudgetRange,
    sortBy,
    setSortBy,
    refresh: loadDemands,
  }
}

/**
 * 智配中心 Hook
 */
export const useMatchingCenter = () => {
  const [activeTab, setActiveTab] = useState('experts') // experts | my-demands | my-bids
  const [demands, setDemands] = useState([])
  const [myDemands, setMyDemands] = useState([])
  const [myBids, setMyBids] = useState([])
  const [bidDemands, setBidDemands] = useState([])

  const loadAll = useCallback(() => {
    setDemands(getDemands())
    setMyDemands(getMyDemands())
    const bids = getMyBids()
    setMyBids(bids)
    setBidDemands(getMyBidDemands())
  }, [])

  useEffect(() => {
    loadAll()
    const handleStorage = () => loadAll()
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [loadAll])

  return {
    activeTab,
    setActiveTab,
    demands,
    myDemands,
    myBids,
    bidDemands,
    refresh: loadAll,
  }
}

export default useDemands
