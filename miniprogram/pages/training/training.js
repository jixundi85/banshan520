/**
 * 培训课程页
 */

const app = getApp();
const { getCourses, getCourseDetail } = require('../../utils/request');

Page({
  data: {
    // 分类
    categories: [
      { id: '', name: '全部' },
      { id: 'AI绘画', name: 'AI绘画' },
      { id: 'AI视频', name: 'AI视频' },
      { id: 'AI工具', name: 'AI工具' },
      { id: 'AI写作', name: 'AI写作' },
      { id: '创业指导', name: '创业指导' }
    ],
    currentCategory: '',
    
    // 排序
    sorts: [
      { id: 'latest', name: '最新' },
      { id: 'popular', name: '最热' },
      { id: 'rating', name: '评分' },
      { id: 'price_low', name: '价格低' },
      { id: 'price_high', name: '价格高' }
    ],
    currentSort: 'latest',
    showSortPicker: false,
    
    // 课程列表
    courses: [],
    page: 1,
    limit: 12,
    hasMore: true,
    loading: false,
    
    // 关键词
    keyword: ''
  },

  onLoad(options) {
    if (options.keyword) {
      this.setData({ keyword: options.keyword });
    }
    this.loadCourses();
  },

  onShow() {
    if (app.globalData.token) {
      this.setData({ isLoggedIn: true });
    }
  },

  onPullDownRefresh() {
    this.resetData();
    this.loadCourses().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadCourses(true);
    }
  },

  // 重置数据
  resetData() {
    this.setData({
      courses: [],
      page: 1,
      hasMore: true
    });
  },

  // 加载课程
  async loadCourses(append = false) {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const params = {
        page: append ? this.data.page + 1 : 1,
        limit: this.data.limit,
        sort: this.data.currentSort
      };
      
      if (this.data.currentCategory) {
        params.category = this.data.currentCategory;
      }
      
      if (this.data.keyword) {
        params.keyword = this.data.keyword;
      }
      
      const res = await getCourses(params);
      
      this.setData({
        courses: append ? [...this.data.courses, ...res.courses] : res.courses,
        page: params.page,
        hasMore: res.courses.length >= this.data.limit
      });
    } catch (error) {
      console.error('加载课程失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  // 选择分类
  selectCategory(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ currentCategory: id });
    this.resetData();
    this.loadCourses();
  },

  // 显示排序选择器
  showSortPicker() {
    this.setData({ showSortPicker: true });
  },

  // 隐藏排序选择器
  hideSortPicker() {
    this.setData({ showSortPicker: false });
  },

  // 选择排序
  selectSort(e) {
    const { id } = e.currentTarget.dataset;
    const sort = this.data.sorts.find(s => s.id === id);
    this.setData({
      currentSort: id,
      showSortPicker: false
    });
    this.resetData();
    this.loadCourses();
  },

  // 搜索
  onSearch(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });
    this.resetData();
    this.loadCourses();
  },

  // 跳转到课程详情
  goCourseDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/training/detail/detail?id=' + id
    });
  }
});
