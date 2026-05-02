/**
 * API 服务层
 * 封装所有后端API调用
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 请求拦截器
async function request(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Token过期，尝试刷新
      if (response.status === 401 && data.code === 401001) {
        const refreshed = await refreshToken();
        if (refreshed) {
          return request(url, options);
        }
      }
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// 刷新Token
async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    logout();
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    if (data.code === 200) {
      localStorage.setItem('token', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return true;
    }
  } catch (error) {
    console.error('Refresh token failed:', error);
  }

  logout();
  return false;
}

// 登出
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// HTTP方法封装
const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, body) => request(url, { method: 'POST', body }),
  put: (url, body) => request(url, { method: 'PUT', body }),
  delete: (url) => request(url, { method: 'DELETE' }),
};

// ==================== 认证模块 ====================
export const authAPI = {
  // 发送短信验证码
  sendSmsCode: (phone) => api.post('/auth/sms-code', { phone }),
  
  // 手机号注册
  register: (data) => api.post('/auth/register', data),
  
  // 密码登录
  login: (phone, password) => api.post('/auth/login', { phone, password }),
  
  // 短信登录
  loginBySms: (phone, code) => api.post('/auth/login-sms', { phone, code }),
  
  // 重置密码
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// ==================== 用户模块 ====================
export const userAPI = {
  // 获取当前用户信息
  getMe: () => api.get('/users/me'),
  
  // 更新用户信息
  updateMe: (data) => api.put('/users/me', data),
  
  // 更新头像
  updateAvatar: (avatarUrl) => api.put('/users/me/avatar', { avatarUrl }),
  
  // 获取用户公开信息
  getUser: (id) => api.get(`/users/${id}`),
};

// ==================== OPC模块 ====================
export const opcAPI = {
  // 获取我的OPC档案
  getProfile: () => api.get('/opc/profile'),
  
  // 更新OPC档案
  updateProfile: (data) => api.put('/opc/profile', data),
  
  // 提交能力评估
  submitAssessment: (scores) => api.post('/opc/assessment', scores),
  
  // 获取评估结果
  getAssessmentResult: () => api.get('/opc/assessment/result'),
  
  // 获取OPC列表
  getList: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/opc/list?${query}`);
  },
  
  // 获取OPC详情
  getDetail: (id) => api.get(`/opc/${id}`),
  
  // 获取作品集
  getPortfolio: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/opc/${id}/portfolio?${query}`);
  },
};

// ==================== 企业模块 ====================
export const enterpriseAPI = {
  // 获取企业档案
  getProfile: () => api.get('/enterprise/profile'),
  
  // 更新企业档案
  updateProfile: (data) => api.put('/enterprise/profile', data),
  
  // 提交诊断问卷
  submitDiagnosis: (scores) => api.post('/enterprise/diagnosis', scores),
  
  // 获取诊断结果
  getDiagnosisResult: () => api.get('/enterprise/diagnosis/result'),
};

// ==================== 需求模块 ====================
export const demandAPI = {
  // 获取需求列表
  getList: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/demands?${query}`);
  },
  
  // 获取需求详情
  getDetail: (id) => api.get(`/demands/${id}`),
  
  // 发布需求
  create: (data) => api.post('/demands', data),
  
  // 更新需求
  update: (id, data) => api.put(`/demands/${id}`, data),
  
  // 关闭需求
  close: (id) => api.delete(`/demands/${id}`),
  
  // 获取我的需求列表
  getMyList: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/demands/my/list?${query}`);
  },
};

// ==================== 项目模块 ====================
export const projectAPI = {
  // 获取项目列表
  getList: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/projects?${query}`);
  },
  
  // 获取项目详情
  getDetail: (id) => api.get(`/projects/${id}`),
  
  // 创建项目
  create: (data) => api.post('/projects', data),
  
  // 更新项目状态
  updateStatus: (id, status, reason) => 
    api.put(`/projects/${id}/status`, { status, reason }),
  
  // 更新里程碑
  updateMilestone: (projectId, milestoneId, data) => 
    api.put(`/projects/${projectId}/milestones/${milestoneId}`, data),
  
  // 上传交付物
  uploadDeliverable: (projectId, data) => 
    api.post(`/projects/${projectId}/deliverables`, data),
  
  // 获取项目消息
  getMessages: (projectId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/projects/${projectId}/messages?${query}`);
  },
  
  // 发送项目消息
  sendMessage: (projectId, content, type = 'TEXT') => 
    api.post(`/projects/${projectId}/messages`, { content, type }),
};

// ==================== 订单模块 ====================
export const orderAPI = {
  // 获取订单列表
  getList: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/orders?${query}`);
  },
  
  // 获取订单详情
  getDetail: (id) => api.get(`/orders/${id}`),
  
  // 创建订单
  create: (data) => api.post('/orders', data),
  
  // 发起支付
  pay: (id, channel, openid) => 
    api.post(`/orders/${id}/pay`, { channel, openid }),
  
  // 申请退款
  refund: (id, reason) => api.post(`/orders/${id}/refund`, { reason }),
};

// ==================== 评价模块 ====================
export const reviewAPI = {
  // 获取评价列表
  getList: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reviews?${query}`);
  },
  
  // 获取评价详情
  getDetail: (id) => api.get(`/reviews/${id}`),
  
  // 提交评价
  create: (data) => api.post('/reviews', data),
  
  // 获取用户收到的评价
  getUserReviews: (userId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reviews/user/${userId}?${query}`);
  },
};

// ==================== 消息模块 ====================
export const messageAPI = {
  // 获取未读消息数
  getUnreadCount: () => api.get('/messages/unread'),
  
  // 获取会话列表
  getConversations: () => api.get('/messages/conversations'),
  
  // 标记消息已读
  markAsRead: (id) => api.put(`/messages/${id}/read`),
  
  // 标记项目所有消息已读
  markProjectAsRead: (projectId) => 
    api.put(`/messages/project/${projectId}/read-all`),
  
  // 删除消息
  delete: (id) => api.delete(`/messages/${id}`),
};

// ==================== 系统模块 ====================
export const systemAPI = {
  // 获取系统配置
  getConfig: () => api.get('/system/config'),
  
  // 获取行业列表
  getIndustries: () => api.get('/system/industries'),
  
  // 获取技能列表
  getSkills: (category) => {
    const query = category ? `?category=${category}` : '';
    return api.get(`/system/skills${query}`);
  },
  
  // 获取需求分类
  getCategories: () => api.get('/system/categories'),
  
  // 获取上传预签名URL
  getUploadUrl: (data) => api.post('/system/upload', data),
};

export default api;
