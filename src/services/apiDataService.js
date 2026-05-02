/**
 * API数据服务层
 * 替代原有的localStorage数据服务，使用真实API
 */

import {
  authAPI, userAPI, opcAPI, enterpriseAPI,
  demandAPI, projectAPI, orderAPI, reviewAPI,
  messageAPI, systemAPI
} from './api';

import authService from './authService';

// ==================== 认证模块 ====================
export const authDataService = {
  async login(credentials) {
    const response = await authService.login(credentials.phone, credentials.password);
    return response.data;
  },

  async loginBySms(phone, code) {
    const response = await authService.loginBySms(phone, code);
    return response.data;
  },

  async register(data) {
    const response = await authService.register(data);
    return response.data;
  },

  async sendSmsCode(phone) {
    const response = await authAPI.sendSmsCode(phone);
    return response;
  },

  logout() {
    authService.logout();
  },

  getCurrentUser() {
    return authService.getCurrentUser();
  },

  isAuthenticated() {
    return authService.isAuthenticated();
  },

  getUserRole() {
    return authService.getUserRole();
  },
};

// ==================== 用户模块 ====================
export const userDataService = {
  async getCurrentUser() {
    const response = await userAPI.getMe();
    if (response.code === 200) {
      authService.updateLocalUser(response.data);
    }
    return response.data;
  },

  async updateUser(data) {
    const response = await userAPI.updateMe(data);
    if (response.code === 200) {
      authService.updateLocalUser(response.data);
    }
    return response.data;
  },

  async updateAvatar(avatarUrl) {
    const response = await userAPI.updateAvatar(avatarUrl);
    if (response.code === 200) {
      authService.updateLocalUser({ avatar: avatarUrl });
    }
    return response.data;
  },

  async getUserById(id) {
    const response = await userAPI.getUser(id);
    return response.data;
  },
};

// ==================== OPC模块 ====================
export const opcDataService = {
  async getProfile() {
    const response = await opcAPI.getProfile();
    return response.data;
  },

  async updateProfile(data) {
    const response = await opcAPI.updateProfile(data);
    return response.data;
  },

  async submitAssessment(scores) {
    const response = await opcAPI.submitAssessment(scores);
    return response.data;
  },

  async getAssessmentResult() {
    const response = await opcAPI.getAssessmentResult();
    return response.data;
  },

  async getOPCList(filters = {}) {
    const response = await opcAPI.getList(filters);
    return response.data;
  },

  async getOPCDetail(id) {
    const response = await opcAPI.getDetail(id);
    return response.data;
  },

  async getPortfolio(id, params = {}) {
    const response = await opcAPI.getPortfolio(id, params);
    return response.data;
  },
};

// ==================== 企业模块 ====================
export const enterpriseDataService = {
  async getProfile() {
    const response = await enterpriseAPI.getProfile();
    return response.data;
  },

  async updateProfile(data) {
    const response = await enterpriseAPI.updateProfile(data);
    return response.data;
  },

  async submitDiagnosis(scores) {
    const response = await enterpriseAPI.submitDiagnosis(scores);
    return response.data;
  },

  async getDiagnosisResult() {
    const response = await enterpriseAPI.getDiagnosisResult();
    return response.data;
  },
};

// ==================== 需求模块 ====================
export const demandDataService = {
  async getList(filters = {}) {
    const response = await demandAPI.getList(filters);
    return response.data;
  },

  async getDetail(id) {
    const response = await demandAPI.getDetail(id);
    return response.data;
  },

  async create(data) {
    const response = await demandAPI.create(data);
    return response.data;
  },

  async update(id, data) {
    const response = await demandAPI.update(id, data);
    return response.data;
  },

  async close(id) {
    const response = await demandAPI.close(id);
    return response.data;
  },

  async getMyList(params = {}) {
    const response = await demandAPI.getMyList(params);
    return response.data;
  },
};

// ==================== 项目模块 ====================
export const projectDataService = {
  async getList(params = {}) {
    const response = await projectAPI.getList(params);
    return response.data;
  },

  async getDetail(id) {
    const response = await projectAPI.getDetail(id);
    return response.data;
  },

  async create(data) {
    const response = await projectAPI.create(data);
    return response.data;
  },

  async updateStatus(id, status, reason) {
    const response = await projectAPI.updateStatus(id, status, reason);
    return response.data;
  },

  async updateMilestone(projectId, milestoneId, data) {
    const response = await projectAPI.updateMilestone(projectId, milestoneId, data);
    return response.data;
  },

  async uploadDeliverable(projectId, data) {
    const response = await projectAPI.uploadDeliverable(projectId, data);
    return response.data;
  },

  async getMessages(projectId, params = {}) {
    const response = await projectAPI.getMessages(projectId, params);
    return response.data;
  },

  async sendMessage(projectId, content, type = 'TEXT') {
    const response = await projectAPI.sendMessage(projectId, content, type);
    return response.data;
  },
};

// ==================== 订单模块 ====================
export const orderDataService = {
  async getList(params = {}) {
    const response = await orderAPI.getList(params);
    return response.data;
  },

  async getDetail(id) {
    const response = await orderAPI.getDetail(id);
    return response.data;
  },

  async create(data) {
    const response = await orderAPI.create(data);
    return response.data;
  },

  async pay(id, channel, openid) {
    const response = await orderAPI.pay(id, channel, openid);
    return response.data;
  },

  async refund(id, reason) {
    const response = await orderAPI.refund(id, reason);
    return response.data;
  },
};

// ==================== 评价模块 ====================
export const reviewDataService = {
  async getList(params = {}) {
    const response = await reviewAPI.getList(params);
    return response.data;
  },

  async getDetail(id) {
    const response = await reviewAPI.getDetail(id);
    return response.data;
  },

  async create(data) {
    const response = await reviewAPI.create(data);
    return response.data;
  },

  async getUserReviews(userId, params = {}) {
    const response = await reviewAPI.getUserReviews(userId, params);
    return response.data;
  },
};

// ==================== 消息模块 ====================
export const messageDataService = {
  async getUnreadCount() {
    const response = await messageAPI.getUnreadCount();
    return response.data;
  },

  async getConversations() {
    const response = await messageAPI.getConversations();
    return response.data;
  },

  async markAsRead(id) {
    const response = await messageAPI.markAsRead(id);
    return response.data;
  },

  async markProjectAsRead(projectId) {
    const response = await messageAPI.markProjectAsRead(projectId);
    return response.data;
  },

  async delete(id) {
    const response = await messageAPI.delete(id);
    return response.data;
  },
};

// ==================== 系统模块 ====================
export const systemDataService = {
  async getConfig() {
    const response = await systemAPI.getConfig();
    return response.data;
  },

  async getIndustries() {
    const response = await systemAPI.getIndustries();
    return response.data;
  },

  async getSkills(category) {
    const response = await systemAPI.getSkills(category);
    return response.data;
  },

  async getCategories() {
    const response = await systemAPI.getCategories();
    return response.data;
  },

  async getUploadUrl(data) {
    const response = await systemAPI.getUploadUrl(data);
    return response.data;
  },
};

// ==================== 统一导出 ====================
const apiDataService = {
  auth: authDataService,
  user: userDataService,
  opc: opcDataService,
  enterprise: enterpriseDataService,
  demand: demandDataService,
  project: projectDataService,
  order: orderDataService,
  review: reviewDataService,
  message: messageDataService,
  system: systemDataService,
};

export default apiDataService;
