// 需求广场 API 服务
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// 获取需求列表
export async function getDemands(params = {}) {
  const query = new URLSearchParams()
  if (params.category && params.category !== 'all') query.set('category', params.category)
  if (params.status) query.set('status', params.status)
  if (params.keyword) query.set('keyword', params.keyword)
  if (params.budget_min) query.set('budget_min', params.budget_min)
  if (params.budget_max) query.set('budget_max', params.budget_max)
  query.set('page', params.page || 1)
  query.set('limit', params.limit || 20)

  const response = await fetch(`${API_BASE_URL}/demands?${query}`)
  if (!response.ok) throw new Error('获取需求列表失败')
  return response.json()
}

// 获取需求详情
export async function getDemandById(id) {
  const response = await fetch(`${API_BASE_URL}/demands/${id}`)
  if (!response.ok) throw new Error('获取需求详情失败')
  return response.json()
}

// 发布需求
export async function createDemand(data) {
  const response = await fetch(`${API_BASE_URL}/demands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('发布需求失败')
  return response.json()
}

// 更新需求
export async function updateDemand(id, data) {
  const response = await fetch(`${API_BASE_URL}/demands/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('更新需求失败')
  return response.json()
}

// 删除需求
export async function deleteDemand(id) {
  const response = await fetch(`${API_BASE_URL}/demands/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('删除需求失败')
  return response.json()
}

// 投标/接单
export async function bidDemand(demandId, bidData) {
  const response = await fetch(`${API_BASE_URL}/demands/${demandId}/bid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bidData)
  })
  if (!response.ok) throw new Error('投标失败')
  return response.json()
}

// 获取投标列表
export async function getBids(demandId) {
  const response = await fetch(`${API_BASE_URL}/demands/${demandId}/bids`)
  if (!response.ok) throw new Error('获取投标列表失败')
  return response.json()
}

// 收藏需求
export async function toggleCollect(demandId, userId) {
  const response = await fetch(`${API_BASE_URL}/demands/${demandId}/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  })
  if (!response.ok) throw new Error('操作失败')
  return response.json()
}

// 获取统计数据
export async function getDemandStats() {
  const response = await fetch(`${API_BASE_URL}/demands/stats/summary`)
  if (!response.ok) throw new Error('获取统计数据失败')
  return response.json()
}
