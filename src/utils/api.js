// API 配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Token 管理
const tokenKey = 'token'

export const auth = {
  getToken: () => localStorage.getItem(tokenKey),
  setToken: (token) => localStorage.setItem(tokenKey, token),
  removeToken: () => localStorage.removeItem(tokenKey),
  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('user'),
  isAuthenticated: () => !!localStorage.getItem(tokenKey)
}

// 通用请求方法
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = auth.getToken()

  const defaultHeaders = {
    'Content-Type': 'application/json'
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        auth.removeToken()
        auth.removeUser()
        window.location.href = '/login'
      }
      throw new Error(data.message || '请求失败')
    }

    return data
  } catch (error) {
    console.error('API请求错误:', error)
    throw error
  }
}

// GET 请求
export const get = (endpoint, params = {}) => {
  const searchParams = new URLSearchParams(params)
  const query = searchParams.toString()
  const url = query ? `${endpoint}?${query}` : endpoint
  return request(url, { method: 'GET' })
}

// POST 请求
export const post = (endpoint, data) => {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// PUT 请求
export const put = (endpoint, data) => {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// DELETE 请求
export const del = (endpoint) => {
  return request(endpoint, { method: 'DELETE' })
}

// API 模块
export const api = {
  // 认证
  auth: {
    login: (data) => post('/auth/login', data),
    register: (data) => post('/auth/register', data),
    me: () => get('/auth/me')
  },

  // 课程
  courses: {
    list: (params) => get('/courses', params),
    detail: (id) => get(`/courses/${id}`),
    categories: () => get('/courses/categories')
  },

  // 创作者
  creators: {
    list: (params) => get('/creators', params),
    detail: (id) => get(`/creators/${id}`)
  },

  // 需求
  demands: {
    list: (params) => get('/demands', params),
    detail: (id) => get(`/demands/${id}`),
    create: (data) => post('/demands', data)
  },

  // 社区
  posts: {
    list: (params) => get('/posts', params),
    detail: (id) => get(`/posts/${id}`),
    create: (data) => post('/posts', data)
  },

  // 统计数据
  stats: {
    get: () => get('/stats')
  }
}

export default api
