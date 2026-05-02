/**
 * 创作者申请页
 */

const app = getApp();
const { applyCreator, uploadFile } = require('../../utils/request');

Page({
  data: {
    formData: {
      realName: '',
      idCard: '',
      expertise: '',
      bankName: '',
      bankAccount: ''
    }
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  async onSubmit() {
    const { realName, idCard, expertise, bankName, bankAccount } = this.data.formData;
    
    if (!realName || !idCard || !expertise) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    
    app.loading();
    
    try {
      await applyCreator({
        realName,
        idCard,
        expertise,
        bankName,
        bankAccount
      });
      
      wx.showToast({ title: '申请已提交', icon: 'success' });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      wx.showToast({ title: '申请失败', icon: 'none' });
    } finally {
      app.hideLoading();
    }
  }
});
