/**
 * 需求广场页
 */

const app = getApp();
const { getDemands, publishDemand } = require('../../utils/request');

Page({
  data: {
    // 状态筛选
    statusList: [
      { id: '', name: '全部' },
      { id: 'open', name: '进行中' },
      { id: 'in_progress', name: '进行中' },
      { id: 'completed', name: '已完成' }
    ],
    currentStatus: '',
    
    // 需求列表
    demands: [],
    page: 1,
    limit: 10,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadDemands();
  },

  onShow() {
    if (app.globalData.token) {
      this.setData({ isLoggedIn: true });
    }
  },

  onPullDownRefresh() {
    this.resetData();
    this.loadDemands().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadDemands(true);
    }
  },

  resetData() {
    this.setData({
      demands: [],
      page: 1,
      hasMore: true
    });
  },

  async loadDemands(append = false) {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const params = {
        page: append ? this.data.page + 1 : 1,
        limit: this.data.limit,
        status: this.data.currentStatus || 'open'
      };
      
      const res = await getDemands(params);
      
      this.setData({
        demands: append ? [...this.data.dands, ...res.demands] : res.demands,
        page: params.page,
        hasMore: res.demands.length >= this.data.limit
      });
    } catch (error) {
      console.error('加载需求失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  selectStatus(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ currentStatus: id });
    this.resetData();
    this.loadDemands();
  },

  // 发布需求
  publishDemand() {
    if (!this.data.isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    
    wx.navigateTo({ url: '/pages/demand/publish/publish' });
  },

  // 查看详情
  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: '/pages/demand/detail/detail?id=' + id });
  }
});
