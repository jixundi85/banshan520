/**
 * 数据事件系统
 * 统一管理数据变更事件，实现跨组件数据同步
 */

// 事件监听器存储
const listeners = {}

// 数据事件类型
export const DataEvents = {
  // OPC相关
  OPC_PROFILE_UPDATED: 'opc:profile:updated',
  OPC_ASSESSMENT_SAVED: 'opc:assessment:saved',
  OPC_LEVEL_UP: 'opc:level:up',
  
  // 企业相关
  ENTERPRISE_PROFILE_UPDATED: 'enterprise:profile:updated',
  ENTERPRISE_DIAGNOSIS_SAVED: 'enterprise:diagnosis:saved',
  
  // 项目相关
  PROJECT_CREATED: 'project:created',
  PROJECT_UPDATED: 'project:updated',
  PROJECT_COMPLETED: 'project:completed',
  
  // 评价相关
  REVIEW_CREATED: 'review:created',
  CREDIT_SCORE_UPDATED: 'credit:score:updated',
  
  // 交易相关
  PAYMENT_COMPLETED: 'payment:completed',
  WALLET_UPDATED: 'wallet:updated',
}

/**
 * 订阅事件
 * @param {string} event - 事件名称
 * @param {Function} callback - 回调函数
 * @returns {Function} 取消订阅函数
 */
export function subscribe(event, callback) {
  if (!listeners[event]) {
    listeners[event] = []
  }
  listeners[event].push(callback)
  
  // 返回取消订阅函数
  return () => {
    listeners[event] = listeners[event].filter(cb => cb !== callback)
  }
}

/**
 * 发布事件
 * @param {string} event - 事件名称
 * @param {*} data - 事件数据
 */
export function publish(event, data) {
  if (listeners[event]) {
    listeners[event].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error)
      }
    })
  }
}

/**
 * 一次性订阅（只触发一次）
 * @param {string} event - 事件名称
 * @param {Function} callback - 回调函数
 */
export function subscribeOnce(event, callback) {
  const unsubscribe = subscribe(event, (data) => {
    unsubscribe()
    callback(data)
  })
}

/**
 * 清除所有监听器（用于测试）
 */
export function clearAllListeners() {
  Object.keys(listeners).forEach(key => {
    delete listeners[key]
  })
}

// 默认导出
export default {
  subscribe,
  publish,
  subscribeOnce,
  clearAllListeners,
  DataEvents,
}
