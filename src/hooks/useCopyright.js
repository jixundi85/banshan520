/**
 * 版权交易中心 Hook
 */

import { useState, useEffect, useCallback } from 'react'
import {
  SAMPLE_COPYRIGHT_GOODS,
  getCopyrightGoods,
  getCopyrightDetail,
} from '../data/copyrightSchema'

// localStorage 辅助函数
const getData = (k, def = []) => JSON.parse(localStorage.getItem(k) || JSON.stringify(def))
const setData = (k, v) => localStorage.setItem(k, JSON.stringify(v))

// 获取当前用户
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('current_user')
    return user ? JSON.parse(user) : null
  } catch { return null }
}

// 获取用户积分
const getUserPoints = (userId) => {
  const points = localStorage.getItem(`points_${userId}`) || '10000'
  return parseInt(points) || 10000
}

// 扣除积分
const deductPoints = (userId, amount) => {
  const current = getUserPoints(userId)
  localStorage.setItem(`points_${userId}`, String(current - amount))
}

// 添加积分
const addPoints = (userId, amount) => {
  const current = getUserPoints(userId)
  localStorage.setItem(`points_${userId}`, String(current + amount))
}

// 状态常量
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const COPYRIGHT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SOLD: 'sold',
}

// 生成ID
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`

/**
 * 版权商品 Hook
 */
export const useCopyrightGoods = (type) => {
  const [goods, setGoods] = useState([])
  const [loading, setLoading] = useState(true)

  const loadGoods = useCallback(() => {
    // 确保数据已初始化
    const stored = getData('copyright_goods', [])
    if (stored.length === 0) {
      setData('copyright_goods', SAMPLE_COPYRIGHT_GOODS)
      setGoods(type ? SAMPLE_COPYRIGHT_GOODS.filter(g => g.type === type) : SAMPLE_COPYRIGHT_GOODS)
    } else {
      setGoods(type ? stored.filter(g => g.type === type) : stored)
    }
    setLoading(false)
  }, [type])

  useEffect(() => {
    loadGoods()
  }, [loadGoods])

  // 发布商品
  const publishGoods = useCallback((goodsData) => {
    const newGoods = {
      ...goodsData,
      id: generateId('goods'),
      status: 'approved',
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const allGoods = getData('copyright_goods', SAMPLE_COPYRIGHT_GOODS)
    allGoods.unshift(newGoods)
    setData('copyright_goods', allGoods)
    loadGoods()
    return newGoods
  }, [loadGoods])

  return { goods, loading, reload: loadGoods, publishGoods }
}

/**
 * 单个商品详情 Hook
 */
export const useCopyrightGoodsDetail = (id) => {
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      // 先确保数据存在
      const stored = getData('copyright_goods', [])
      if (stored.length === 0) {
        setData('copyright_goods', SAMPLE_COPYRIGHT_GOODS)
      }
      const data = getCopyrightDetail(id)
      setItem(data)
      setLoading(false)
    }
  }, [id])

  return { item, loading }
}

/**
 * 版权订单 Hook
 */
export const useCopyrightOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = useCallback(() => {
    const user = getCurrentUser()
    const allOrders = getData('copyright_orders', [])
    if (user) {
      const myOrders = allOrders.filter(o => o.buyer_id === user.id || o.seller_id === user.id)
      setOrders(myOrders)
    } else {
      setOrders([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const createOrder = useCallback((orderData) => {
    const user = getCurrentUser()
    const goods = getCopyrightDetail(orderData.goods_id)
    const newOrder = {
      id: generateId('order'),
      goods_id: orderData.goods_id,
      goods_title: goods?.title || '未知商品',
      goods_cover: goods?.coverImage || '',
      buyer_id: user?.id || 'guest',
      buyer_name: user?.name || user?.phone || '游客',
      seller_id: goods?.seller_id || 'system',
      seller_name: goods?.seller_name || '系统',
      price_cash: orderData.price_cash || goods?.price_cash || 0,
      price_points: orderData.price_points || goods?.price_points || 0,
      pay_type: orderData.pay_type || 'cash',
      status: ORDER_STATUS.PENDING,
      created_at: new Date().toISOString(),
    }
    const allOrders = getData('copyright_orders', [])
    allOrders.push(newOrder)
    setData('copyright_orders', allOrders)
    loadOrders()
    return newOrder
  }, [loadOrders])

  const payOrder = useCallback((orderId, payType) => {
    const allOrders = getData('copyright_orders', [])
    const orderIndex = allOrders.findIndex(o => o.id === orderId)
    if (orderIndex === -1) return { success: false, message: '订单不存在' }

    const order = allOrders[orderIndex]

    if (payType === 'points') {
      const user = getCurrentUser()
      if (!user) return { success: false, message: '请先登录' }
      const userPoints = getUserPoints(user.id)
      if (userPoints < order.price_points) {
        return { success: false, message: '积分不足' }
      }
      deductPoints(user.id, order.price_points)
    }

    // 更新订单状态
    allOrders[orderIndex].status = ORDER_STATUS.PAID
    allOrders[orderIndex].paid_at = new Date().toISOString()
    allOrders[orderIndex].pay_type = payType
    setData('copyright_orders', allOrders)

    // 创建授权记录
    const licenses = getData('copyright_licenses', [])
    licenses.push({
      id: generateId('lic'),
      order_id: orderId,
      goods_id: order.goods_id,
      goods_title: order.goods_title,
      licensee_id: order.buyer_id,
      licensee_name: order.buyer_name,
      licensor_id: order.seller_id,
      licensor_name: order.seller_name,
      price: payType === 'points' ? order.price_points : order.price_cash,
      created_at: new Date().toISOString(),
    })
    setData('copyright_licenses', licenses)

    // 给卖家加积分
    addPoints(order.seller_id, order.price_points || 0)

    loadOrders()
    return { success: true, message: '支付成功' }
  }, [loadOrders])

  return { orders, loading, reload: loadOrders, createOrder, payOrder }
}

/**
 * 用户积分 Hook
 */
export const useUserPoints = () => {
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setPoints(getUserPoints(user.id))
    }
  }, [])

  return { points }
}

/**
 * 授权记录 Hook
 */
export const useCopyrightLicenses = () => {
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    const allLicenses = getData('copyright_licenses', [])
    if (user) {
      const myLicenses = allLicenses.filter(l => l.licensee_id === user.id || l.licensor_id === user.id)
      setLicenses(myLicenses)
    } else {
      setLicenses([])
    }
    setLoading(false)
  }, [])

  return { licenses, loading }
}

/**
 * 版权统计 Hook
 */
export const useCopyrightStats = () => {
  const [stats, setStats] = useState({
    totalGoods: 0,
    totalOrders: 0,
    totalValue: 0,
    portraitCount: 0,
    novelCount: 0,
    filmCount: 0,
  })

  useEffect(() => {
    // 确保数据初始化
    const goods = getData('copyright_goods', [])
    if (goods.length === 0) {
      setData('copyright_goods', SAMPLE_COPYRIGHT_GOODS)
    }

    const allGoods = getData('copyright_goods', SAMPLE_COPYRIGHT_GOODS)
    const orders = getData('copyright_orders', [])

    setStats({
      totalGoods: allGoods.length,
      totalOrders: orders.length,
      totalValue: orders.reduce((sum, o) => sum + (o.price_cash || 0), 0),
      portraitCount: allGoods.filter(g => g.type === 'portrait').length,
      novelCount: allGoods.filter(g => g.type === 'novel').length,
      filmCount: allGoods.filter(g => g.type === 'film').length,
    })
  }, [])

  return stats
}
