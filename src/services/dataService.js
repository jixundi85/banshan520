/**
 * 统一数据服务层
 * 管理所有业务数据的CRUD操作和关联逻辑
 */

import { publish, DataEvents } from './dataEvents.js'

// ==================== 数据存储键名 ====================
const STORAGE_KEYS = {
  // 用户相关
  USER: 'user',
  TOKEN: 'token',
  
  // OPC相关
  OPC_PROFILE: 'opc_profile',
  OPC_ASSESSMENT: 'opc_assessment_result',
  OPC_PROJECTS: 'opc_projects',
  
  // 企业相关
  ENTERPRISE_PROFILE: 'enterprise_profile',
  ENTERPRISE_DIAGNOSIS: 'enterprise_diagnosis_result',
  
  // 项目相关
  PROJECTS: 'projects',
  PROJECT_WORKSPACE: 'project_workspace',
  
  // 匹配相关
  MATCHING_RESULTS: 'matching_results',
  
  // 交易相关
  ORDERS: 'orders',
  PAYMENTS: 'payments',
  WALLET: 'wallet',
  
  // 评价相关
  REVIEWS: 'reviews',
  CREDIT_SCORES: 'credit_scores',
  
  // 课程相关
  COURSES: 'courses',
  LEARNING_PROGRESS: 'learning_progress',
  
  // 社区相关
  POSTS: 'posts',
  KNOWLEDGE_BASE: 'knowledge_base',
}

// ==================== 基础工具函数 ====================

/**
 * 从localStorage读取数据
 */
const getData = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (error) {
    console.error(`Error reading ${key}:`, error)
    return defaultValue
  }
}

/**
 * 写入数据到localStorage
 */
const setData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error writing ${key}:`, error)
    return false
  }
}

/**
 * 带事件发布的写入
 * @param {string} key - 存储键
 * @param {*} value - 存储值
 * @param {string} event - 事件名称
 * @param {*} eventData - 事件数据
 */
const setDataWithEvent = (key, value, event, eventData) => {
  const success = setData(key, value)
  if (success && event) {
    publish(event, eventData)
  }
  return success
}

/**
 * 生成唯一ID
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 获取当前时间戳
 */
const getTimestamp = () => {
  return new Date().toISOString()
}

// ==================== OPC服务 ====================

export const opcService = {
  /**
   * 获取OPC档案
   */
  getProfile() {
    return getData(STORAGE_KEYS.OPC_PROFILE, {
      id: generateId(),
      name: '未命名创作者',
      level: 'L1',
      levelName: '战术执行者',
      tags: [],
      skills: [],
      completedProjects: 0,
      rating: 0,
      creditScore: 100,
      createdAt: getTimestamp(),
    })
  },

  /**
   * 更新OPC档案
   */
  updateProfile(profile) {
    const current = this.getProfile()
    const updated = { ...current, ...profile, updatedAt: getTimestamp() }
    setDataWithEvent(STORAGE_KEYS.OPC_PROFILE, updated, DataEvents.OPC_PROFILE_UPDATED, updated)
    return updated
  },

  /**
   * 保存评估结果
   */
  saveAssessmentResult(result) {
    const assessment = {
      id: generateId(),
      ...result,
      createdAt: getTimestamp(),
    }
    setDataWithEvent(STORAGE_KEYS.OPC_ASSESSMENT, assessment, DataEvents.OPC_ASSESSMENT_SAVED, assessment)
    
    // 更新档案等级
    this.updateProfile({
      level: result.level,
      levelName: result.levelName,
      dimensions: result.dimensions,
      tags: result.tags,
    })
    
    return assessment
  },

  /**
   * 获取评估结果
   */
  getAssessmentResult() {
    return getData(STORAGE_KEYS.OPC_ASSESSMENT)
  },

  /**
   * 计算等级
   */
  calculateLevel(dimensions) {
    const { execution, architecture, coordination, strategy } = dimensions
    
    // L4: 全维度≥80，战略≥70
    if (execution >= 80 && architecture >= 80 && coordination >= 80 && strategy >= 70) {
      return { level: 'L4', levelName: '极核引擎手' }
    }
    
    // L3: 执行≥80，架构≥70，协调≥60
    if (execution >= 80 && architecture >= 70 && coordination >= 60) {
      return { level: 'L3', levelName: '全域操盘手' }
    }
    
    // L2: 执行≥70，架构≥60
    if (execution >= 70 && architecture >= 60) {
      return { level: 'L2', levelName: '矩阵架构师' }
    }
    
    // L1: 执行≥60
    if (execution >= 60) {
      return { level: 'L1', levelName: '战术执行者' }
    }
    
    return { level: 'L0', levelName: '未认证' }
  },

  /**
   * 检查等级晋升
   */
  checkLevelUp() {
    const profile = this.getProfile()
    const projects = this.getProjects()
    const reviews = reviewService.getReceivedReviews(profile.id)
    
    const completedProjects = projects.filter(p => p.status === 'completed').length
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0
    
    // 晋升条件
    const conditions = {
      L1: { projects: 3, rating: 4.0 },
      L2: { projects: 10, rating: 4.2 },
      L3: { projects: 25, rating: 4.5 },
      L4: { projects: 50, rating: 4.8 },
    }
    
    const nextLevel = {
      'L0': 'L1', 'L1': 'L2', 'L2': 'L3', 'L3': 'L4'
    }[profile.level]
    
    if (nextLevel && conditions[nextLevel]) {
      const condition = conditions[nextLevel]
      if (completedProjects >= condition.projects && avgRating >= condition.rating) {
        return {
          canLevelUp: true,
          nextLevel,
          currentProjects: completedProjects,
          currentRating: avgRating,
          requiredProjects: condition.projects,
          requiredRating: condition.rating,
        }
      }
    }
    
    return { canLevelUp: false }
  },

  /**
   * 获取项目列表
   */
  getProjects() {
    return getData(STORAGE_KEYS.OPC_PROJECTS, [])
  },

  /**
   * 添加项目
   */
  addProject(project) {
    const projects = this.getProjects()
    const newProject = {
      id: generateId(),
      ...project,
      createdAt: getTimestamp(),
    }
    projects.push(newProject)
    setData(STORAGE_KEYS.OPC_PROJECTS, projects)
    return newProject
  },

  /**
   * 更新项目状态
   */
  updateProjectStatus(projectId, status) {
    const projects = this.getProjects()
    const index = projects.findIndex(p => p.id === projectId)
    if (index !== -1) {
      projects[index] = { ...projects[index], status, updatedAt: getTimestamp() }
      const updated = projects[index]
      
      // 发布项目更新事件
      const event = status === 'completed' ? DataEvents.PROJECT_COMPLETED : DataEvents.PROJECT_UPDATED
      setDataWithEvent(STORAGE_KEYS.OPC_PROJECTS, projects, event, updated)
      
      // 检查是否需要升级
      const levelUpCheck = this.checkLevelUp()
      if (levelUpCheck.canLevelUp) {
        // 触发升级逻辑
        this.performLevelUp(levelUpCheck.nextLevel)
      }
      
      return updated
    }
    return null
  },

  /**
   * 执行等级升级
   */
  performLevelUp(newLevel) {
    const levelNames = {
      'L1': '战术执行者',
      'L2': '矩阵架构师',
      'L3': '全域操盘手',
      'L4': '极核引擎手',
    }
    
    const result = { 
      success: true, 
      newLevel, 
      levelName: levelNames[newLevel],
      levelUpAt: getTimestamp(),
    }
    
    this.updateProfile({
      level: newLevel,
      levelName: levelNames[newLevel],
      levelUpAt: getTimestamp(),
    })
    
    // 发布等级提升事件
    publish(DataEvents.OPC_LEVEL_UP, result)
    
    return result
  },
}

// ==================== 企业服务 ====================

export const enterpriseService = {
  /**
   * 获取企业档案
   */
  getProfile() {
    return getData(STORAGE_KEYS.ENTERPRISE_PROFILE, {
      id: generateId(),
      name: '未命名企业',
      level: 'L1',
      levelName: '工具使用者',
      industry: '',
      size: '',
      createdAt: getTimestamp(),
    })
  },

  /**
   * 更新企业档案
   */
  updateProfile(profile) {
    const current = this.getProfile()
    const updated = { ...current, ...profile, updatedAt: getTimestamp() }
    setDataWithEvent(STORAGE_KEYS.ENTERPRISE_PROFILE, updated, DataEvents.ENTERPRISE_PROFILE_UPDATED, updated)
    return updated
  },

  /**
   * 保存诊断结果
   */
  saveDiagnosisResult(result) {
    const diagnosis = {
      id: generateId(),
      ...result,
      createdAt: getTimestamp(),
    }
    setDataWithEvent(STORAGE_KEYS.ENTERPRISE_DIAGNOSIS, diagnosis, DataEvents.ENTERPRISE_DIAGNOSIS_SAVED, diagnosis)
    
    // 更新企业等级
    this.updateProfile({
      level: result.level,
      levelName: result.levelName,
      dimensions: result.dimensions,
    })
    
    return diagnosis
  },

  /**
   * 获取诊断结果
   */
  getDiagnosisResult() {
    return getData(STORAGE_KEYS.ENTERPRISE_DIAGNOSIS)
  },

  /**
   * 计算企业等级
   */
  calculateLevel(dimensions) {
    const { toolUsage, systemIntegration, intelligence, ecosystem } = dimensions
    
    // L4: 全维度≥80，生态≥70
    if (toolUsage >= 80 && systemIntegration >= 80 && intelligence >= 80 && ecosystem >= 70) {
      return { level: 'L4', levelName: '生态构建者' }
    }
    
    // L3: 工具≥80，系统≥70，智能≥60
    if (toolUsage >= 80 && systemIntegration >= 70 && intelligence >= 60) {
      return { level: 'L3', levelName: '智能领航者' }
    }
    
    // L2: 工具≥70，系统≥60
    if (toolUsage >= 70 && systemIntegration >= 60) {
      return { level: 'L2', levelName: '系统优化者' }
    }
    
    // L1: 工具≥60
    if (toolUsage >= 60) {
      return { level: 'L1', levelName: '工具使用者' }
    }
    
    return { level: 'L0', levelName: '未评估' }
  },
}

// ==================== 项目服务 ====================

export const projectService = {
  /**
   * 获取所有项目
   */
  getAll() {
    return getData(STORAGE_KEYS.PROJECTS, [])
  },

  /**
   * 获取项目详情
   */
  getById(projectId) {
    const projects = this.getAll()
    return projects.find(p => p.id === projectId) || null
  },

  /**
   * 创建项目
   */
  create(projectData) {
    const projects = this.getAll()
    const newProject = {
      id: generateId(),
      ...projectData,
      status: 'pending', // pending, in_progress, completed, cancelled
      milestones: projectData.milestones || [],
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
    }
    projects.push(newProject)
    setData(STORAGE_KEYS.PROJECTS, projects)
    return newProject
  },

  /**
   * 更新项目
   */
  update(projectId, updates) {
    const projects = this.getAll()
    const index = projects.findIndex(p => p.id === projectId)
    if (index !== -1) {
      projects[index] = { 
        ...projects[index], 
        ...updates, 
        updatedAt: getTimestamp() 
      }
      setData(STORAGE_KEYS.PROJECTS, projects)
      return projects[index]
    }
    return null
  },

  /**
   * 更新里程碑状态
   */
  updateMilestone(projectId, milestoneId, status) {
    const project = this.getById(projectId)
    if (project && project.milestones) {
      const milestone = project.milestones.find(m => m.id === milestoneId)
      if (milestone) {
        milestone.status = status
        milestone.completedAt = status === 'completed' ? getTimestamp() : null
        this.update(projectId, { milestones: project.milestones })
        return milestone
      }
    }
    return null
  },

  /**
   * 获取用户/企业的项目列表
   */
  getByUser(userId, userType) {
    const projects = this.getAll()
    if (userType === 'opc') {
      return projects.filter(p => p.opcId === userId)
    } else {
      return projects.filter(p => p.enterpriseId === userId)
    }
  },
}

// ==================== 匹配服务 ====================

export const matchingService = {
  /**
   * 计算匹配度
   */
  calculateMatchScore(enterprise, opc) {
    // 权重配置
    const weights = {
      industry: 0.30,  // 行业匹配 30%
      skill: 0.40,     // 技能匹配 40%
      level: 0.20,     // 等级匹配 20%
      availability: 0.10, // 档期匹配 10%
    }

    // 行业匹配度
    const industryMatch = this.calculateIndustryMatch(
      enterprise.industry, 
      opc.tags || []
    )

    // 技能匹配度
    const skillMatch = this.calculateSkillMatch(
      enterprise.requirements || [], 
      opc.skills || []
    )

    // 等级匹配度
    const levelMatch = this.calculateLevelMatch(
      enterprise.level, 
      opc.level
    )

    // 档期匹配度（简化处理）
    const availabilityMatch = opc.availability !== 'busy' ? 1 : 0.5

    // 综合得分
    const score = 
      industryMatch * weights.industry +
      skillMatch * weights.skill +
      levelMatch * weights.level +
      availabilityMatch * weights.availability

    return {
      total: Math.round(score * 100),
      breakdown: {
        industry: Math.round(industryMatch * 100),
        skill: Math.round(skillMatch * 100),
        level: Math.round(levelMatch * 100),
        availability: Math.round(availabilityMatch * 100),
      },
      reasons: this.generateMatchReasons(enterprise, opc, {
        industry: industryMatch,
        skill: skillMatch,
        level: levelMatch,
      }),
    }
  },

  /**
   * 行业匹配计算
   */
  calculateIndustryMatch(enterpriseIndustry, opcTags) {
    if (!enterpriseIndustry || !opcTags.length) return 0.5
    
    const industryKeywords = {
      '电商': ['电商', '零售', '营销', '运营'],
      '科技': ['科技', '互联网', '软件', 'AI'],
      '教育': ['教育', '培训', '课程', '知识'],
      '金融': ['金融', '投资', '理财', '银行'],
      '医疗': ['医疗', '健康', '医药', '养生'],
    }
    
    const keywords = industryKeywords[enterpriseIndustry] || [enterpriseIndustry]
    const matchCount = opcTags.filter(tag => 
      keywords.some(kw => tag.includes(kw))
    ).length
    
    return Math.min(matchCount / 2, 1)
  },

  /**
   * 技能匹配计算
   */
  calculateSkillMatch(requirements, skills) {
    if (!requirements.length || !skills.length) return 0.5
    
    const matches = requirements.filter(req => 
      skills.some(skill => 
        skill.toLowerCase().includes(req.toLowerCase()) ||
        req.toLowerCase().includes(skill.toLowerCase())
      )
    )
    
    return matches.length / Math.max(requirements.length, 1)
  },

  /**
   * 等级匹配计算
   */
  calculateLevelMatch(enterpriseLevel, opcLevel) {
    const levelMap = { 'L0': 0, 'L1': 1, 'L2': 2, 'L3': 3, 'L4': 4 }
    const enterpriseScore = levelMap[enterpriseLevel] || 0
    const opcScore = levelMap[opcLevel] || 0
    
    // 企业L1 → OPC L1-L2
    // 企业L2 → OPC L2-L3
    // 企业L3 → OPC L3-L4
    // 企业L4 → OPC L4
    
    const minOpcLevel = enterpriseScore
    const maxOpcLevel = enterpriseScore + 1
    
    if (opcScore >= minOpcLevel && opcScore <= maxOpcLevel) {
      return 1
    } else if (opcScore > maxOpcLevel) {
      return 0.8 // OPC等级过高，可能性价比不高
    } else {
      return 0.5 // OPC等级不足
    }
  },

  /**
   * 生成匹配理由
   */
  generateMatchReasons(enterprise, opc, scores) {
    const reasons = []
    
    if (scores.industry > 0.7) {
      reasons.push('行业经验丰富')
    }
    if (scores.skill > 0.7) {
      reasons.push('技能高度匹配')
    }
    if (scores.level > 0.8) {
      reasons.push('等级适配')
    }
    if (opc.rating >= 4.5) {
      reasons.push('好评率高')
    }
    if (opc.completedProjects >= 10) {
      reasons.push('项目经验丰富')
    }
    
    return reasons.length > 0 ? reasons : ['基础匹配']
  },

  /**
   * 为企业匹配OPC
   */
  matchForEnterprise(enterpriseId) {
    const enterprise = enterpriseService.getProfile()
    const allOpcProfiles = this.getAllOpcProfiles() // 需要从某处获取
    
    const matches = allOpcProfiles.map(opc => ({
      opc,
      score: this.calculateMatchScore(enterprise, opc),
    }))
    
    // 按匹配度排序
    matches.sort((a, b) => b.score.total - a.score.total)
    
    // 保存匹配结果
    setData(STORAGE_KEYS.MATCHING_RESULTS, {
      enterpriseId,
      matches: matches.slice(0, 10), // 前10个
      generatedAt: getTimestamp(),
    })
    
    return matches.slice(0, 10)
  },

  /**
   * 获取所有OPC档案（模拟）
   */
  getAllOpcProfiles() {
    // 从localStorage获取所有OPC，或者返回模拟数据
    const mockProfiles = [
      {
        id: 'opc1',
        name: '创意工坊',
        level: 'L3',
        tags: ['电商', '短视频', 'AI视频'],
        skills: ['Midjourney', 'Runway', '剪辑'],
        rating: 4.8,
        completedProjects: 25,
        availability: 'available',
      },
      {
        id: 'opc2',
        name: '视觉大师',
        level: 'L2',
        tags: ['设计', '品牌', 'UI'],
        skills: ['Photoshop', 'Illustrator', 'Figma'],
        rating: 4.5,
        completedProjects: 15,
        availability: 'available',
      },
    ]
    return mockProfiles
  },
}

// ==================== 评价服务 ====================

export const reviewService = {
  /**
   * 获取所有评价
   */
  getAll() {
    return getData(STORAGE_KEYS.REVIEWS, [])
  },

  /**
   * 创建评价
   */
  create(reviewData) {
    const reviews = this.getAll()
    const newReview = {
      id: generateId(),
      ...reviewData,
      createdAt: getTimestamp(),
    }
    reviews.push(newReview)
    setDataWithEvent(STORAGE_KEYS.REVIEWS, reviews, DataEvents.REVIEW_CREATED, newReview)
    
    // 更新被评价者的信用分
    const creditUpdate = this.updateCreditScore(reviewData.toId, reviewData.toType, reviewData.rating)
    
    // 发布信用分更新事件
    publish(DataEvents.CREDIT_SCORE_UPDATED, creditUpdate)
    
    return newReview
  },

  /**
   * 获取收到的评价
   */
  getReceivedReviews(userId) {
    const reviews = this.getAll()
    return reviews.filter(r => r.toId === userId)
  },

  /**
   * 获取发出的评价
   */
  getGivenReviews(userId) {
    const reviews = this.getAll()
    return reviews.filter(r => r.fromId === userId)
  },

  /**
   * 更新信用分
   */
  updateCreditScore(userId, userType, newRating) {
    const scores = getData(STORAGE_KEYS.CREDIT_SCORES, {})
    const key = `${userType}_${userId}`
    
    if (!scores[key]) {
      scores[key] = {
        userId,
        userType,
        score: 100,
        totalReviews: 0,
        avgRating: 0,
      }
    }
    
    const current = scores[key]
    const newTotal = current.totalReviews + 1
    const newAvg = (current.avgRating * current.totalReviews + newRating) / newTotal
    
    // 信用分计算：基础分 + 评价加权
    const ratingBonus = (newAvg - 3) * 10 // 3分以上加分，以下减分
    const newScore = Math.min(100, Math.max(0, 100 + ratingBonus))
    
    const updated = {
      ...current,
      score: Math.round(newScore),
      totalReviews: newTotal,
      avgRating: Math.round(newAvg * 10) / 10,
      updatedAt: getTimestamp(),
    }
    
    scores[key] = updated
    setData(STORAGE_KEYS.CREDIT_SCORES, scores)
    return updated
  },

  /**
   * 获取信用分
   */
  getCreditScore(userId, userType) {
    const scores = getData(STORAGE_KEYS.CREDIT_SCORES, {})
    const key = `${userType}_${userId}`
    return scores[key] || {
      userId,
      userType,
      score: 100,
      totalReviews: 0,
      avgRating: 0,
    }
  },
}

// ==================== 钱包服务 ====================

export const walletService = {
  /**
   * 获取钱包
   */
  getWallet(userId) {
    const wallets = getData(STORAGE_KEYS.WALLET, {})
    if (!wallets[userId]) {
      wallets[userId] = {
        userId,
        balance: 0,
        frozen: 0,
        transactions: [],
        createdAt: getTimestamp(),
      }
      setData(STORAGE_KEYS.WALLET, wallets)
    }
    return wallets[userId]
  },

  /**
   * 充值
   */
  deposit(userId, amount, description = '充值') {
    const wallets = getData(STORAGE_KEYS.WALLET, {})
    if (!wallets[userId]) {
      wallets[userId] = this.getWallet(userId)
    }
    
    wallets[userId].balance += amount
    wallets[userId].transactions.push({
      id: generateId(),
      type: 'deposit',
      amount,
      description,
      createdAt: getTimestamp(),
    })
    
    setDataWithEvent(STORAGE_KEYS.WALLET, wallets, DataEvents.WALLET_UPDATED, wallets[userId])
    return wallets[userId]
  },

  /**
   * 冻结资金（托管）
   */
  freeze(userId, amount, projectId) {
    const wallets = getData(STORAGE_KEYS.WALLET, {})
    if (!wallets[userId]) return { success: false, error: '钱包不存在' }
    
    if (wallets[userId].balance < amount) {
      return { success: false, error: '余额不足' }
    }
    
    wallets[userId].balance -= amount
    wallets[userId].frozen += amount
    wallets[userId].transactions.push({
      id: generateId(),
      type: 'freeze',
      amount: -amount,
      projectId,
      description: '项目资金托管',
      createdAt: getTimestamp(),
    })
    
    setDataWithEvent(STORAGE_KEYS.WALLET, wallets, DataEvents.WALLET_UPDATED, wallets[userId])
    return { success: true, wallet: wallets[userId] }
  },

  /**
   * 释放资金（里程碑完成）
   */
  release(toUserId, amount, projectId, milestoneId) {
    const wallets = getData(STORAGE_KEYS.WALLET, {})
    
    // 找到托管方并扣减冻结金额
    for (const userId in wallets) {
      const tx = wallets[userId].transactions.find(
        t => t.projectId === projectId && t.type === 'freeze'
      )
      if (tx) {
        wallets[userId].frozen -= amount
        break
      }
    }
    
    // 给收款方增加余额
    if (!wallets[toUserId]) {
      wallets[toUserId] = this.getWallet(toUserId)
    }
    wallets[toUserId].balance += amount
    wallets[toUserId].transactions.push({
      id: generateId(),
      type: 'income',
      amount,
      projectId,
      milestoneId,
      description: '里程碑款项释放',
      createdAt: getTimestamp(),
    })
    
    setDataWithEvent(STORAGE_KEYS.WALLET, wallets, DataEvents.PAYMENT_COMPLETED, { 
      toUserId, amount, projectId, milestoneId 
    })
    return { success: true }
  },
}

// ==================== 默认导出 ====================

export default {
  opc: opcService,
  enterprise: enterpriseService,
  project: projectService,
  matching: matchingService,
  review: reviewService,
  wallet: walletService,
  utils: {
    generateId,
    getTimestamp,
    getData,
    setData,
  },
}
