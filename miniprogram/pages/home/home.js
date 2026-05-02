/**
 * 首页
 */

const app = getApp();
const { getHomeData, getStats } = require('../../utils/request');

Page({
  data: {
    // 轮播图
    banners: [
      { id: 1, image: '/static/banner/banner1.jpg', url: '' },
      { id: 2, image: '/static/banner/banner2.jpg', url: '' },
      { id: 3, image: '/static/banner/banner3.jpg', url: '' }
    ],
    
    // 统计数据
    stats: {
      userCount: 0,
      courseCount: 0,
      creatorCount: 0,
      orderCount: 0
    },
    
    // 推荐课程
    featuredCourses: [],
    
    // 最新课程
    latestCourses: [],
    
    // 热门创作者
    topCreators: [],
    
    // 热门需求
    hotDemands: [],
    
    // 加载状态
    loading: true
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    // 检查登录状态
    if (app.globalData.token) {
      this.setData({ isLoggedIn: true });
    }
  },

  onPullDownRefresh() {
    this.loadData().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载数据
  async loadData() {
    try {
      app.loading();
      
      const [homeRes, statsRes] = await Promise.all([
        getHomeData(),
        getStats()
      ]);
      
      this.setData({
        featuredCourses: homeRes.data.featuredCourses || [],
        latestCourses: homeRes.data.latestCourses || [],
        topCreators: homeRes.data.topCreators || [],
        hotDemands: homeRes.data.hotDemands || [],
        stats: statsRes.data || {}
      });
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      app.hideLoading();
      this.setData({ loading: false });
    }
  },

  // 跳转到课程详情
  goCourseDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/training/detail/detail?id=' + id
    });
  },

  // 跳转到创作者主页
  goCreatorPage(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/creator/creator?id=' + id
    });
  },

  // 跳转到需求详情
  goDemandDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/demand/detail/detail?id=' + id
    });
  },

  // 跳转到登录
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 跳转到培训页
  goTraining() {
    wx.switchTab({
      url: '/pages/training/training'
    });
  },

  // 跳转到需求页
  goDemand() {
    wx.switchTab({
      url: '/pages/demand/demand'
    });
  },

  // 跳转到社区
  goCommunity() {
    wx.switchTab({
      url: '/pages/community/community'
    });
  },

  // 搜索
  onSearch(e) {
    const keyword = e.detail.value;
    if (!keyword.trim()) return;
    
    wx.navigateTo({
      url: `/pages/training/training?keyword=${encodeURIComponent(keyword)}`
    });
  }
});
