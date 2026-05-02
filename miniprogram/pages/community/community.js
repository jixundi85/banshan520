/**
 * 社区页
 */

const app = getApp();
const { getPosts, publishPost, likePost } = require('../../utils/request');

Page({
  data: {
    posts: [],
    page: 1,
    limit: 10,
    hasMore: true,
    loading: false,
    
    // 发布弹窗
    showPublishModal: false,
    publishForm: {
      title: '',
      content: '',
      category: ''
    }
  },

  onLoad() {
    this.loadPosts();
  },

  onPullDownRefresh() {
    this.resetData();
    this.loadPosts().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadPosts(true);
    }
  },

  resetData() {
    this.setData({
      posts: [],
      page: 1,
      hasMore: true
    });
  },

  async loadPosts(append = false) {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const params = {
        page: append ? this.data.page + 1 : 1,
        limit: this.data.limit
      };
      
      const res = await getPosts(params);
      
      this.setData({
        posts: append ? [...this.data.posts, ...res.posts] : res.posts,
        page: params.page,
        hasMore: res.posts.length >= this.data.limit
      });
    } catch (error) {
      console.error('加载帖子失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  // 显示发布弹窗
  showPublish() {
    if (!app.globalData.token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    this.setData({ showPublishModal: true });
  },

  // 隐藏发布弹窗
  hidePublish() {
    this.setData({ 
      showPublishModal: false,
      publishForm: { title: '', content: '', category: '' }
    });
  },

  // 输入处理
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`publishForm.${field}`]: e.detail.value
    });
  },

  // 发布帖子
  async onPublish() {
    const { title, content, category } = this.data.publishForm;
    
    if (!title || !content) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    
    app.loading();
    
    try {
      await publishPost({ title, content, category });
      wx.showToast({ title: '发布成功', icon: 'success' });
      this.hidePublish();
      this.resetData();
      this.loadPosts();
    } catch (error) {
      wx.showToast({ title: '发布失败', icon: 'none' });
    } finally {
      app.hideLoading();
    }
  },

  // 点赞
  async onLike(e) {
    if (!app.globalData.token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    
    const { id } = e.currentTarget.dataset;
    
    try {
      await likePost(id);
      this.loadPosts();
    } catch (error) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  // 查看详情
  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: '/pages/community/detail/detail?id=' + id });
  }
});
