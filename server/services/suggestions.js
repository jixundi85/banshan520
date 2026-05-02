import db from '../db.js'

/**
 * 获取建议问题列表
 */
export function getSuggestions() {
  try {
    // 从设置中获取欢迎语建议
    const settings = db.prepare('SELECT welcome_suggestions FROM ai_settings WHERE id = 1').get()
    if (settings && settings.welcome_suggestions) {
      try {
        return JSON.parse(settings.welcome_suggestions)
      } catch {
        return ['企业AI诊断是什么？', '怎么成为OPC创作者？', '需求广场怎么用？', 'OPC认证流程？']
      }
    }
    return ['企业AI诊断是什么？', '怎么成为OPC创作者？', '需求广场怎么用？', 'OPC认证流程？']
  } catch {
    return ['企业AI诊断是什么？', '怎么成为OPC创作者？', '需求广场怎么用？', 'OPC认证流程？']
  }
}
