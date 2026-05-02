/**
 * 用户中心
 */

const app = getApp();
const { getUserInfo, logout, getMessages } = require('../../utils/request');

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    isCreator: false,
    unreadCount: 0,
    
    // 菜单项
    menus: [
      {
        icon: '/static/icons/profile.png',
        title: '个人资料',
        path: '/pages/user/profile/profile'
      },
      {
        icon: '/static/icons/learning.png',
        title: '我的学习',
        path: '/pages/user/learning/learning'
      },
      {
        icon: '/static/icons/order.png',
        title: '我的订单',
        path: '/pages/user/orders/orders'
      },
      {
        icon: '/static/icons/favorite.png',
        title: '我的收藏',
        path: '/pages/user/favorites/favorites'
      },
      {
        icon: '/static/icons/creator.png',
        title: '创作者中心',
        path: '/pages/creator/creator',
        needAuth: true
      },
      {
        icon: '/static/icons/message.png',
        title: '消息中心',
        path: '',
        badge: 'unreadCount'
      }
    ]
  },

  onLoad() {
    this.checkLogin();
  },

  onShow() {
    this.checkLogin();
    if (app.globalData.token) {
      this.loadUnreadCount();
    }
  },

  onPullDownRefresh() {
    this.checkLogin().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 检查登录状态
  async checkLogin() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.setData({
        userInfo,
        isLoggedIn: true,
        isCreator: userInfo.role === 'creator' || userInfo.role === 'admin'
      });
      
      // 更新用户信息
      try {
        const res = await getUserInfo();
        this.setData({ userInfo: res.user });
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    } else {
      this.setData({
        userInfo: null,
        isLoggedIn: false,
        isCreator: false
      });
    }
  },

  // 加载未读消息数
  async loadUnreadCount() {
    try {
      const res = await getMessages({ is_read: false });
      this.setData({ unreadCount: res.unreadCount });
    } catch (error) {
      console.error('获取未读消息失败:', error);
    }
  },

  // 跳转到登录
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 菜单点击
  onMenuTap(e) {
    const { path, needauth } = e.currentTarget.dataset;
    
    if (needauth && !this.data.isLoggedIn) {
      this.goLogin();
      return;
    }
    
    if (path) {
      wx.navigateTo({ url: path });
    }
  },

  // 成为创作者
  becomeCreator() {
    if (!this.data.isLoggedIn) {
      this.goLogin();
      return;
    }
    
    wx.navigateTo({
      url: '/pages/creator/apply/apply'
    });
  },

  // 退出登录
  async onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await logout();
          } catch (error) {
            // 忽略错误
          }
          
          app.logout();
          this.setData({
            userInfo: null,
            isLoggedIn: false,
            isCreator: false
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  }
});
