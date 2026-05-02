/**
 * AIGC内容供需平台 - 微信小程序入口文件
 */

// app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    baseUrl: 'http://localhost:3000/api',
    // 小程序ID
    appId: 'wx_your_appid'
  },

  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus();
    
    // 获取系统信息
    this.getSystemInfo();
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
    }
  },

  // 获取系统信息
  getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;
    this.globalData.navBarHeight = 44;
    this.globalData.screenWidth = systemInfo.screenWidth;
    this.globalData.screenHeight = systemInfo.screenHeight;
  },

  // 登录
  login(userInfo) {
    return new Promise((resolve, reject) => {
      wx.setStorageSync('token', userInfo.token);
      wx.setStorageSync('userInfo', userInfo);
      this.globalData.token = userInfo.token;
      this.globalData.userInfo = userInfo;
      resolve();
    });
  },

  // 登出
  logout() {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    this.globalData.token = null;
    this.globalData.userInfo = null;
  },

  // 检查登录，未登录则跳转登录页
  checkAuth(callback) {
    if (this.globalData.token) {
      callback && callback();
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            });
          }
        }
      });
    }
  },

  // 封装请求方法
  request(options) {
    return new Promise((resolve, reject) => {
      const header = {
        'Content-Type': 'application/json'
      };

      // 添加token
      if (this.globalData.token) {
        header['Authorization'] = `Bearer ${this.globalData.token}`;
      }

      wx.request({
        url: this.globalData.baseUrl + options.url,
        method: options.method || 'GET',
        data: options.data,
        header,
        success: (res) => {
          if (res.statusCode === 200) {
            if (res.data.success) {
              resolve(res.data);
            } else {
              wx.showToast({
                title: res.data.error || '请求失败',
                icon: 'none'
              });
              reject(res.data);
            }
          } else if (res.statusCode === 401) {
            // token过期，重新登录
            this.logout();
            wx.navigateTo({
              url: '/pages/login/login'
            });
            reject({ error: '请重新登录' });
          } else {
            wx.showToast({
              title: '网络错误',
              icon: 'none'
            });
            reject({ error: '网络错误' });
          }
        },
        fail: (err) => {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          });
          reject(err);
        }
      });
    });
  },

  // 封装showToast
  toast(title, icon = 'success') {
    wx.showToast({
      title,
      icon
    });
  },

  // 封装loading
  loading(title = '加载中...') {
    wx.showLoading({
      title,
      mask: true
    });
  },

  // 关闭loading
  hideLoading() {
    wx.hideLoading();
  }
});
