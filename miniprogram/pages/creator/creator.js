/**
 * 创作者中心页
 */

const app = getApp();
const { getCreatorDetail, getUserInfo } = require('../../utils/request');

Page({
  data: {
    creator: null,
    courses: [],
    isOwner: false,
    loading: true
  },

  onLoad(options) {
    const creatorId = options.id;
    if (creatorId) {
      this.loadCreator(creatorId);
    } else {
      // 加载当前用户创作者信息
      this.loadMyCreator();
    }
  },

  async loadCreator(id) {
    try {
      const res = await getCreatorDetail(id);
      this.setData({
        creator: res.creator,
        courses: res.courses || []
      });
    } catch (error) {
      console.error('加载创作者信息失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  async loadMyCreator() {
    if (!app.globalData.token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }

    try {
      // 获取当前用户信息
      const userRes = await getUserInfo();
      const userInfo = userRes.user;

      if (userInfo.role !== 'creator' && userInfo.role !== 'admin') {
        // 提示申请成为创作者
        wx.showModal({
          title: '提示',
          content: '您还不是认证创作者，是否申请成为创作者？',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({ url: '/pages/creator/apply/apply' });
            } else {
              wx.navigateBack();
            }
          }
        });
        return;
      }

      this.setData({
        isOwner: true
      });

      // 加载创作者信息
      this.loadCreator(userInfo.creatorId);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  // 查看课程详情
  goCourseDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: '/pages/training/detail/detail?id=' + id });
  }
});
