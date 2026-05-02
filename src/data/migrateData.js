/**
 * 数据迁移脚本
 * 将旧数据结构迁移到新的统一需求模型
 * 
 * 旧数据 keys:
 * - enterpriseDemands (企业需求)
 * - publishedDemands (发布需求)
 * - demands (需求广场)
 * - myDemands (我的需求)
 */

import {
  STORAGE_KEYS,
  getDemands,
  saveDemands,
  getMyDemands,
  saveMyDemands,
  generateId,
  DEMAND_STATUS,
} from './demandSchema'

// 旧字段映射
const FIELD_MAPPINGS = {
  // EnterpriseDemand.jsx
  companyName: 'companyName',
  projectType: 'catId',
  projectDesc: 'desc',
  timeline: 'timeline',
  // DemandPage.jsx
  publisher: 'publisherName',
  catId: 'catId',
  deadline: 'deadline',
  title: 'title',
  desc: 'desc',
  publisherAvatar: 'publisherAvatar',
  company: 'companyName',
  budgetMin: 'budgetMin',
  budgetMax: 'budgetMax',
}

/**
 * 迁移单个需求
 */
const migrateDemand = (oldDemand) => {
  const now = new Date().toISOString()
  
  return {
    id: oldDemand.id || generateId(),
    type: oldDemand.companyName ? 'enterprise' : 'personal',
    
    // 基本信息
    title: oldDemand.title || '',
    desc: oldDemand.desc || oldDemand.projectDesc || '',
    catId: oldDemand.catId || oldDemand.projectType || 'shortvideo',
    
    // 发布方信息
    publisherId: oldDemand.publisherId || 'migrated',
    publisherName: oldDemand.publisherName || oldDemand.publisher || '迁移用户',
    publisherAvatar: oldDemand.publisherAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Migrated',
    companyName: oldDemand.companyName || oldDemand.company || '',
    
    // 预算与周期
    budget: oldDemand.budget || oldDemand.budgetMin || 0,
    budgetMin: oldDemand.budgetMin || oldDemand.budget || 0,
    budgetMax: oldDemand.budgetMax || oldDemand.budget || 0,
    budgetType: oldDemand.budgetMin && oldDemand.budgetMax ? 'range' : 'fixed',
    deadline: oldDemand.deadline || oldDemand.timeline || '',
    timeline: oldDemand.timeline || '',
    
    // 需求规格
    tags: oldDemand.tags || [],
    requirements: oldDemand.requirements || [],
    attachments: oldDemand.attachments || [],
    
    // 状态
    status: oldDemand.status || DEMAND_STATUS.PENDING,
    
    // 投标信息
    bids: oldDemand.bids || [],
    winnerId: oldDemand.winnerId || null,
    winnerName: oldDemand.winnerName || null,
    
    // 统计
    views: oldDemand.views || 0,
    likes: oldDemand.likes || 0,
    collected: oldDemand.collected || false,
    
    // 时间戳
    createdAt: oldDemand.createdAt || now,
    updatedAt: oldDemand.updatedAt || now,
    publishTime: oldDemand.publishTime || oldDemand.createdAt || now,
    
    // 迁移标记
    migrated: true,
    migratedAt: now,
  }
}

/**
 * 执行迁移
 */
export const migrateData = () => {
  console.log('开始数据迁移...')
  
  const results = {
    enterpriseDemands: 0,
    publishedDemands: 0,
    demands: 0,
    myDemands: 0,
    errors: [],
  }
  
  const migratedIds = new Set()
  const allMigratedDemands = []
  const allMyDemands = []
  
  // 1. 迁移 enterpriseDemands
  try {
    const enterpriseData = localStorage.getItem('enterpriseDemands')
    if (enterpriseData) {
      const demands = JSON.parse(enterpriseData)
      if (Array.isArray(demands)) {
        demands.forEach(d => {
          const migrated = migrateDemand(d)
          if (!migratedIds.has(migrated.id)) {
            allMigratedDemands.push(migrated)
            allMyDemands.push({ ...migrated, isOwner: true })
            migratedIds.add(migrated.id)
            results.enterpriseDemands++
          }
        })
        console.log(`迁移了 ${results.enterpriseDemands} 条企业需求`)
      }
    }
  } catch (e) {
    results.errors.push(`enterpriseDemands: ${e.message}`)
  }
  
  // 2. 迁移 publishedDemands
  try {
    const publishedData = localStorage.getItem('publishedDemands')
    if (publishedData) {
      const demands = JSON.parse(publishedData)
      if (Array.isArray(demands)) {
        demands.forEach(d => {
          const migrated = migrateDemand(d)
          if (!migratedIds.has(migrated.id)) {
            allMigratedDemands.push(migrated)
            allMyDemands.push({ ...migrated, isOwner: true })
            migratedIds.add(migrated.id)
            results.publishedDemands++
          }
        })
        console.log(`迁移了 ${results.publishedDemands} 条发布需求`)
      }
    }
  } catch (e) {
    results.errors.push(`publishedDemands: ${e.message}`)
  }
  
  // 3. 迁移 demands（需求广场）
  try {
    const demandsData = localStorage.getItem('demands')
    if (demandsData) {
      const demands = JSON.parse(demandsData)
      if (Array.isArray(demands)) {
        demands.forEach(d => {
          const migrated = migrateDemand(d)
          if (!migratedIds.has(migrated.id)) {
            allMigratedDemands.push(migrated)
            migratedIds.add(migrated.id)
            results.demands++
          }
        })
        console.log(`迁移了 ${results.demands} 条需求广场需求`)
      }
    }
  } catch (e) {
    results.errors.push(`demands: ${e.message}`)
  }
  
  // 4. 迁移 myDemands
  try {
    const myDemandsData = localStorage.getItem('myDemands')
    if (myDemandsData) {
      const demands = JSON.parse(myDemandsData)
      if (Array.isArray(demands)) {
        demands.forEach(d => {
          const migrated = migrateDemand(d)
          // 检查是否已存在于 allMyDemands
          if (!allMyDemands.find(m => m.id === migrated.id)) {
            allMyDemands.push({ ...migrated, isOwner: true })
            results.myDemands++
          }
        })
        console.log(`迁移了 ${results.myDemands} 条我的需求`)
      }
    }
  } catch (e) {
    results.errors.push(`myDemands: ${e.message}`)
  }
  
  // 保存迁移结果
  saveDemands(allMigratedDemands)
  saveMyDemands(allMyDemands)
  
  // 标记迁移完成
  localStorage.setItem('migration_completed', new Date().toISOString())
  
  console.log('迁移完成！', results)
  console.log(`总共迁移 ${allMigratedDemands.length} 条需求到统一存储`)
  
  return results
}

/**
 * 检查是否需要迁移
 */
export const needsMigration = () => {
  const migrationCompleted = localStorage.getItem('migration_completed')
  if (migrationCompleted) return false
  
  // 检查旧数据是否存在
  const oldKeys = ['enterpriseDemands', 'publishedDemands', 'demands', 'myDemands']
  return oldKeys.some(key => localStorage.getItem(key))
}

/**
 * 清除旧数据（确认迁移成功后调用）
 */
export const clearOldData = () => {
  const oldKeys = ['enterpriseDemands', 'publishedDemands', 'demands', 'myDemands']
  oldKeys.forEach(key => {
    localStorage.removeItem(key)
  })
  console.log('旧数据已清除')
}

// 如果需要迁移，自动执行
if (needsMigration()) {
  migrateData()
}
