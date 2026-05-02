import db from '../db.js'

/**
 * 搜索知识库
 * @param {string} query - 查询文本
 * @param {number} limit - 返回数量
 * @returns {Array} 匹配的知识
 */
export function searchKnowledge(query, limit = 5) {
  if (!query || query.trim().length === 0) return []

  const searchTerm = `%${query.trim()}%`

  // 优先搜索标题匹配，然后是内容匹配
  const results = db.prepare(`
    SELECT * FROM ai_knowledge
    WHERE status = 'active' AND (
      title LIKE ? OR content LIKE ?
    )
    ORDER BY
      CASE
        WHEN title LIKE ? THEN 1
        ELSE 2
      END,
      updated_at DESC
    LIMIT ?
  `).all(searchTerm, searchTerm, searchTerm, limit)

  return results
}

/**
 * 将知识转换为上下文
 * @param {Array} results - 搜索结果
 * @returns {string} 上下文字符串
 */
export function knowledgeToContext(results) {
  if (!results || results.length === 0) return ''

  return results.map((r, i) =>
    `[知识${i + 1}] ${r.title}\n${r.content}`
  ).join('\n\n')
}

/**
 * 获取建议问题
 * @returns {Array} 建议问题列表
 */
export function getSuggestions() {
  const settings = getSettings()
  try {
    return JSON.parse(settings.welcome_suggestions || '[]')
  } catch {
    return []
  }
}

/**
 * 获取客服设置
 * @returns {Object} 设置对象
 */
export function getSettings() {
  const settings = db.prepare(`
    SELECT widget_name, position, bottom_offset, greeting, welcome_suggestions, hot_topics, enabled
    FROM ai_settings WHERE id = 1
  `).get()

  return {
    widget_name: settings?.widget_name || '半山灵图',
    position: settings?.position || 'right',
    bottom_offset: settings?.bottom_offset || 24,
    icon_size: settings?.icon_size || 'medium',
    greeting: settings?.greeting || '您好，我是半山灵图，有什么可以帮您的？',
    welcome_suggestions: settings?.welcome_suggestions || '["企业AI诊断是什么？", "怎么成为OPC创作者？", "需求广场怎么用？", "OPC认证流程？"]',
    hot_topics: settings?.hot_topics || '[{"icon":"🏛️","title":"了解半山","subtitle":"研究院理念与使命"},{"icon":"💼","title":"OPC项目","subtitle":"超级个体商业计划"},{"icon":"💰","title":"政策补贴","subtitle":"马来AI转型扶持"},{"icon":"🤝","title":"商务合作","subtitle":"共建碳硅生态"}]',
    enabled: settings?.enabled !== 0
  }
}

/**
 * 更新客服设置
 * @param {Object} data - 设置数据
 * @returns {boolean} 是否成功
 */
export function updateSettings(data) {
  const fields = []
  const values = []

  const allowedFields = ['widget_name', 'position', 'bottom_offset', 'icon_size', 'greeting', 'welcome_suggestions', 'hot_topics', 'enabled']

  for (const [key, value] of Object.entries(data)) {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = ?`)
      // 处理 enabled 字段转换为整数
      if (key === 'enabled') {
        values.push(value ? 1 : 0)
      } else {
        values.push(value)
      }
    }
  }

  if (fields.length === 0) return false

  fields.push('updated_at = CURRENT_TIMESTAMP')
  values.push(1) // WHERE id = 1

  const result = db.prepare(`
    UPDATE ai_settings SET ${fields.join(', ')} WHERE id = ?
  `).run(...values)

  return result.changes > 0
}
