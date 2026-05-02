/**
 * 课程购买 Hook
 */

import { useState, useCallback } from 'react'

const getData = (k, def = []) => JSON.parse(localStorage.getItem(k) || JSON.stringify(def))
const setData = (k, v) => localStorage.setItem(k, JSON.stringify(v))

const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('current_user')
    return user ? JSON.parse(user) : null
  } catch { return null }
}

const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`

export const useCourseOrders = () => {
  const [myCourses, setMyCourses] = useState(() => {
    const user = getCurrentUser()
    if (!user) return []
    return getData(`course_orders_${user.id}`, [])
  })

  const isPurchased = useCallback((courseId) => {
    return myCourses.some(c => c.courseId === courseId)
  }, [myCourses])

  const createOrder = useCallback((course) => {
    const user = getCurrentUser()
    if (!user) return null
    const order = {
      id: generateId('course'),
      courseId: course.id,
      title: course.title,
      price: course.price,
      coverImage: course.coverImage,
      purchasedAt: new Date().toISOString(),
    }
    const existing = getData(`course_orders_${user.id}`, [])
    const updated = [order, ...existing]
    setData(`course_orders_${user.id}`, updated)
    setMyCourses(updated)
    return order
  }, [])

  const payOrder = useCallback((orderId) => {
    const user = getCurrentUser()
    if (!user) return { success: false, message: '请先登录' }
    return { success: true, message: '购买成功' }
  }, [])

  return { myCourses, isPurchased, createOrder, payOrder }
}
