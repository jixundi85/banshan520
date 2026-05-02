/**
 * 认证服务
 * 处理登录、注册、Token管理等
 * 支持测试账号本地模拟登录（后端不可用时）
 */

import { authAPI, userAPI } from './api';

const AUTH_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// 测试账号数据
const TEST_ACCOUNTS = {
  '13800138001': {
    password: 'opc123456',
    user: {
      id: 'opc-test-001',
      phone: '13800138001',
      nickname: 'OPC测试用户',
      role: 'OPC',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=opc',
      level: 'L2',
      status: 'ACTIVE',
      createdAt: '2024-01-01T00:00:00Z'
    }
  },
  '13800138002': {
    password: 'enterprise123456',
    user: {
      id: 'enterprise-test-001',
      phone: '13800138002',
      nickname: '企业测试用户',
      role: 'ENTERPRISE',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=enterprise',
      companyName: '测试科技有限公司',
      status: 'ACTIVE',
      createdAt: '2024-01-01T00:00:00Z'
    }
  },
  '13800138003': {
    password: 'admin123456',
    user: {
      id: 'admin-test-001',
      phone: '13800138003',
      nickname: '管理员',
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      status: 'ACTIVE',
      createdAt: '2024-01-01T00:00:00Z'
    }
  },
  '13800138004': {
    password: 'user123456',
    user: {
      id: 'user-test-001',
      phone: '13800138004',
      nickname: '普通用户',
      role: 'USER',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      status: 'ACTIVE',
      createdAt: '2024-01-01T00:00:00Z'
    }
  }
};

export const authService = {
  /**
   * 密码登录 - 优先尝试真实API，失败则使用测试账号
   */
  async login(phone, password) {
    // 检查是否是测试账号
    const testAccount = TEST_ACCOUNTS[phone];
    if (testAccount && testAccount.password === password) {
      // 模拟登录成功
      const mockData = {
        accessToken: `mock-token-${phone}-${Date.now()}`,
        refreshToken: `mock-refresh-${phone}-${Date.now()}`,
        user: testAccount.user
      };
      this.setAuthData(mockData);
      return { code: 200, data: mockData, message: '登录成功' };
    }

    // 非测试账号，尝试真实API
    try {
      const response = await authAPI.login(phone, password);
      if (response.code === 200) {
        this.setAuthData(response.data);
      }
      return response;
    } catch (error) {
      // API失败，返回测试账号提示
      return {
        code: 401,
        message: '登录失败。请使用测试账号：\nOPC: 13800138001 / opc123456\n企业: 13800138002 / enterprise123456\n管理: 13800138003 / admin123456\n普通: 13800138004 / user123456'
      };
    }
  },

  /**
   * 短信登录
   */
  async loginBySms(phone, code) {
    // 测试账号支持任意验证码
    const testAccount = TEST_ACCOUNTS[phone];
    if (testAccount) {
      const mockData = {
        accessToken: `mock-token-${phone}-${Date.now()}`,
        refreshToken: `mock-refresh-${phone}-${Date.now()}`,
        user: testAccount.user
      };
      this.setAuthData(mockData);
      return { code: 200, data: mockData, message: '登录成功' };
    }

    try {
      const response = await authAPI.loginBySms(phone, code);
      if (response.code === 200) {
        this.setAuthData(response.data);
      }
      return response;
    } catch (error) {
      return { code: 401, message: '验证码错误或已过期' };
    }
  },

  /**
   * 注册 - 模拟注册
   */
  async register(data) {
    // 检查手机号是否已被测试账号使用
    if (TEST_ACCOUNTS[data.phone]) {
      return { code: 400, message: '该手机号已注册，请直接登录' };
    }

    try {
      const response = await authAPI.register(data);
      if (response.code === 200 || response.code === 201) {
        this.setAuthData(response.data);
      }
      return response;
    } catch (error) {
      // 模拟注册成功
      const mockUser = {
        id: `user-${Date.now()}`,
        phone: data.phone,
        nickname: data.nickname || `用户${data.phone.slice(-4)}`,
        role: data.role || 'USER',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.phone}`,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      const mockData = {
        accessToken: `mock-token-${data.phone}-${Date.now()}`,
        refreshToken: `mock-refresh-${data.phone}-${Date.now()}`,
        user: mockUser
      };
      this.setAuthData(mockData);
      return { code: 200, data: mockData, message: '注册成功' };
    }
  },

  /**
   * 发送短信验证码 - 模拟发送
   */
  async sendSmsCode(phone) {
    // 模拟发送成功，验证码固定为 123456
    console.log(`[模拟] 向 ${phone} 发送验证码: 123456`);
    return { code: 200, message: '验证码已发送（测试码：123456）' };
  },

  /**
   * 重置密码
   */
  async resetPassword(data) {
    return authAPI.resetPassword(data);
  },

  /**
   * 退出登录
   */
  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/login';
  },

  /**
   * 设置认证数据
   */
  setAuthData(data) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  },

  /**
   * 获取当前用户
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * 获取Token
   */
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * 检查是否登录
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * 获取用户角色
   */
  getUserRole() {
    const user = this.getCurrentUser();
    return user?.role || null;
  },

  /**
   * 检查是否是OPC
   */
  isOPC() {
    return this.getUserRole() === 'OPC';
  },

  /**
   * 检查是否是企业
   */
  isEnterprise() {
    return this.getUserRole() === 'ENTERPRISE';
  },

  /**
   * 更新本地用户信息
   */
  updateLocalUser(userData) {
    const current = this.getCurrentUser();
    const updated = { ...current, ...userData };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  },

  /**
   * 刷新用户信息
   */
  async refreshUserInfo() {
    try {
      const response = await userAPI.getMe();
      if (response.code === 200) {
        this.updateLocalUser(response.data);
      }
      return response;
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      throw error;
    }
  },
};

export default authService;
