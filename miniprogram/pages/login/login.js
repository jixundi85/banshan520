/**
 * 登录页面
 */

const app = getApp();
const { login, register } = require('../../utils/request');

Page({
  data: {
    // 登录模式: login | register
    mode: 'login',
    
    // 表单数据
    formData: {
      email: '',
      password: '',
      nickname: '',
      confirmPassword: ''
    },
    
    // 错误信息
    error: '',
    
    // 加载状态
    loading: false
  },

  onLoad() {
    // 检查是否已登录
    if (app.globalData.token) {
      wx.navigateBack();
    }
  },

  // 切换登录/注册模式
  switchMode() {
    this.setData({
      mode: this.data.mode === 'login' ? 'register' : 'login',
      error: '',
      formData: {
        email: '',
        password: '',
        nickname: '',
        confirmPassword: ''
      }
    });
  },

  // 输入处理
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value,
      error: ''
    });
  },

  // 表单验证
  validate() {
    const { email, password, nickname, confirmPassword } = this.data.formData;
    
    if (!email) {
      this.setData({ error: '请输入邮箱' });
      return false;
    }
    
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.setData({ error: '请输入正确的邮箱格式' });
      return false;
    }
    
    if (!password) {
      this.setData({ error: '请输入密码' });
      return false;
    }
    
    if (password.length < 6) {
      this.setData({ error: '密码长度不能少于6位' });
      return false;
    }
    
    if (this.data.mode === 'register') {
      if (!nickname) {
        this.setData({ error: '请输入昵称' });
        return false;
      }
      
      if (password !== confirmPassword) {
        this.setData({ error: '两次输入的密码不一致' });
        return false;
      }
    }
    
    return true;
  },

  // 提交表单
  async onSubmit() {
    if (!this.validate()) return;
    
    this.setData({ loading: true, error: '' });
    
    try {
      const { email, password, nickname } = this.data.formData;
      
      let res;
      if (this.data.mode === 'login') {
        res = await login({ email, password });
      } else {
        res = await register({ email, password, nickname });
      }
      
      // 保存登录信息
      await app.login(res.user);
      
      wx.showToast({
        title: this.data.mode === 'login' ? '登录成功' : '注册成功',
        icon: 'success'
      });
      
      // 跳转到首页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      
    } catch (error) {
      this.setData({ error: error.error || '操作失败' });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 微信登录
  onWechatLogin() {
    wx.showToast({
      title: '微信登录功能开发中',
      icon: 'none'
    });
  },

  // 忘记密码
  onForgotPassword() {
    wx.showToast({
      title: '请联系客服重置密码',
      icon: 'none'
    });
  }
});
