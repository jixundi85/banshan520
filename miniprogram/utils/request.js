/**
 * API接口封装
 */

const app = getApp();

// 首页数据
export const getHomeData = () => {
  return app.request({ url: '/home' });
};

// 统计数据
export const getStats = () => {
  return app.request({ url: '/stats' });
};

// ============================================
// 认证相关
// ============================================
export const login = (data) => {
  return app.request({
    url: '/auth/login',
    method: 'POST',
    data
  });
};

export const register = (data) => {
  return app.request({
    url: '/auth/register',
    method: 'POST',
    data
  });
};

export const getUserInfo = () => {
  return app.request({ url: '/auth/me' });
};

export const logout = () => {
  return app.request({ url: '/auth/logout', method: 'POST' });
};

// ============================================
// 用户相关
// ============================================
export const updateProfile = (data) => {
  return app.request({
    url: '/user/profile',
    method: 'PUT',
    data
  });
};

export const getLearningProgress = () => {
  return app.request({ url: '/user/learning/progress' });
};

export const getFavorites = (type) => {
  return app.request({
    url: '/user/favorites',
    data: { type }
  });
};

export const getOrders = (params) => {
  return app.request({
    url: '/user/orders',
    data: params
  });
};

export const getMessages = (params) => {
  return app.request({
    url: '/user/messages',
    data: params
  });
};

// ============================================
// 课程相关
// ============================================
export const getCourses = (params) => {
  return app.request({
    url: '/course',
    data: params
  });
};

export const getCourseDetail = (id) => {
  return app.request({ url: `/course/${id}` });
};

export const purchaseCourse = (id) => {
  return app.request({
    url: `/course/${id}/purchase`,
    method: 'POST'
  });
};

export const learnCourse = (id, data) => {
  return app.request({
    url: `/course/${id}/learn`,
    method: 'POST',
    data
  });
};

export const reviewCourse = (id, data) => {
  return app.request({
    url: `/course/${id}/review`,
    method: 'POST',
    data
  });
};

// ============================================
// 创作者相关
// ============================================
export const getCreators = (params) => {
  return app.request({
    url: '/creator',
    data: params
  });
};

export const getCreatorDetail = (id) => {
  return app.request({ url: `/creator/${id}` });
};

export const applyCreator = (data) => {
  return app.request({
    url: '/creator/apply',
    method: 'POST',
    data
  });
};

// ============================================
// 需求相关
// ============================================
export const getDemands = (params) => {
  return app.request({
    url: '/demand',
    data: params
  });
};

export const getDemandDetail = (id) => {
  return app.request({ url: `/demand/${id}` });
};

export const publishDemand = (data) => {
  return app.request({
    url: '/demand',
    method: 'POST',
    data
  });
};

export const quoteDemand = (id, data) => {
  return app.request({
    url: `/demand/${id}/quote`,
    method: 'POST',
    data
  });
};

// ============================================
// 支付相关
// ============================================
export const createWechatPay = (data) => {
  return app.request({
    url: '/payment/wechat',
    method: 'POST',
    data
  });
};

export const createAlipay = (data) => {
  return app.request({
    url: '/payment/alipay',
    method: 'POST',
    data
  });
};

export const getPaymentStatus = (orderNo) => {
  return app.request({ url: `/payment/status/${orderNo}` });
};

export const applyRefund = (data) => {
  return app.request({
    url: '/payment/refund',
    method: 'POST',
    data
  });
};

// ============================================
// 收藏相关
// ============================================
export const addFavorite = (data) => {
  return app.request({
    url: '/favorite/add',
    method: 'POST',
    data
  });
};

export const removeFavorite = (data) => {
  return app.request({
    url: '/favorite/remove',
    method: 'POST',
    data
  });
};

export const checkFavorite = (type, typeId) => {
  return app.request({ url: `/favorite/check/${type}/${typeId}` });
};

// ============================================
// 社区相关
// ============================================
export const getPosts = (params) => {
  return app.request({
    url: '/community/posts',
    data: params
  });
};

export const getPostDetail = (id) => {
  return app.request({ url: `/community/posts/${id}` });
};

export const publishPost = (data) => {
  return app.request({
    url: '/community/posts',
    method: 'POST',
    data
  });
};

export const commentPost = (id, data) => {
  return app.request({
    url: `/community/posts/${id}/comment`,
    method: 'POST',
    data
  });
};

export const likePost = (id) => {
  return app.request({
    url: `/community/posts/${id}/like`,
    method: 'POST'
  });
};

// ============================================
// 上传相关
// ============================================
export const uploadFile = (filePath, category = 'other') => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: app.globalData.baseUrl + '/upload/file',
      filePath,
      name: 'file',
      header: {
        Authorization: app.globalData.token ? `Bearer ${app.globalData.token}` : ''
      },
      formData: { category },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.success) {
          resolve(data);
        } else {
          reject(data);
        }
      },
      fail: reject
    });
  });
};
