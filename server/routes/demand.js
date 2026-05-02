import express from 'express'
import { randomUUID } from 'crypto'
import db from '../db.js'

const router = express.Router()

// 获取所有需求
router.get('/', (req, res) => {
  try {
    const { category, status, budget_min, budget_max, keyword, page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit

    let sql = 'SELECT * FROM demands WHERE 1=1'
    const params = []

    if (category && category !== 'all') {
      sql += ' AND category = ?'
      params.push(category)
    }
    if (status) {
      sql += ' AND status = ?'
      params.push(status)
    }
    if (budget_min) {
      sql += ' AND budget >= ?'
      params.push(parseInt(budget_min))
    }
    if (budget_max) {
      sql += ' AND budget <= ?'
      params.push(parseInt(budget_max))
    }
    if (keyword) {
      sql += ' AND (title LIKE ? OR description LIKE ? OR company LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
    }

    // 统计总数
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total')
    const totalResult = db.prepare(countSql).get(...params)
    const total = totalResult?.total || 0

    // 分页查询
    sql += ' ORDER BY is_urgent DESC, created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const items = db.prepare(sql).all(...params)

    // 转换数据格式以匹配前端
    const formattedItems = items.map(item => ({
      id: item.id,
      catId: item.category,
      title: item.title,
      desc: item.description,
      budget: item.budget,
      budgetMin: item.budget_min,
      budgetMax: item.budget_max,
      deadline: item.deadline,
      status: item.status,
      bids: item.bids || 0,
      views: item.views || 0,
      likes: item.likes || 0,
      collected: !!item.collected,
      publisher: item.publisher_name,
      publisherAvatar: item.publisher_avatar,
      company: item.company,
      companyDesc: item.company_desc,
      tags: item.tags ? JSON.parse(item.tags) : [],
      urgent: !!item.is_urgent,
      requirements: item.requirements ? JSON.parse(item.requirements) : [],
      contact: item.contact,
      createdAt: formatTimeAgo(item.created_at),
      publishTime: item.created_at,
      coverImage: item.cover_image,
      referenceImages: item.reference_images ? JSON.parse(item.reference_images) : [],
      isCertified: !!item.is_certified,
      publisherId: item.publisher_id
    }))

    res.json({
      items: formattedItems,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('[Demands List Error]', error.message)
    res.status(500).json({ error: '获取需求列表失败' })
  }
})

// 获取单个需求详情
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params

    // 增加浏览量
    db.prepare('UPDATE demands SET views = views + 1 WHERE id = ?').run(id)

    const item = db.prepare('SELECT * FROM demands WHERE id = ?').get(id)

    if (!item) {
      return res.status(404).json({ error: '需求不存在' })
    }

    // 获取投标列表
    const bids = db.prepare('SELECT * FROM demand_bids WHERE demand_id = ? ORDER BY created_at DESC').all(id)

    res.json({
      ...item,
      bids: bids.length,
      tags: item.tags ? JSON.parse(item.tags) : [],
      requirements: item.requirements ? JSON.parse(item.requirements) : [],
      referenceImages: item.reference_images ? JSON.parse(item.reference_images) : [],
      bidList: bids
    })
  } catch (error) {
    console.error('[Demand Detail Error]', error.message)
    res.status(500).json({ error: '获取需求详情失败' })
  }
})

// 发布需求
router.post('/', (req, res) => {
  try {
    const {
      title, description, category, budget, budget_min, budget_max,
      deadline, requirements, contact, company, company_desc,
      cover_image, reference_images, is_urgent, publisher_id,
      publisher_name, publisher_avatar
    } = req.body

    if (!title || !description || !category || !budget || !contact || !company) {
      return res.status(400).json({ error: '缺少必填字段' })
    }

    const result = db.prepare(`
      INSERT INTO demands (
        title, description, category, budget, budget_min, budget_max,
        deadline, requirements, contact, company, company_desc,
        cover_image, reference_images, is_urgent, publisher_id,
        publisher_name, publisher_avatar, status, views, likes, bids, collected, is_certified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, 0, 0, 0, 1)
    `).run(
      title, description, category, budget,
      budget_min || budget, budget_max || budget,
      deadline || '7天内',
      JSON.stringify(requirements || []),
      contact, company, company_desc || '',
      cover_image || null,
      JSON.stringify(reference_images || []),
      is_urgent ? 1 : 0,
      publisher_id || 'anonymous',
      publisher_name || '匿名用户',
      publisher_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomUUID().slice(0,8)}`
    )

    res.json({
      success: true,
      id: result.lastInsertRowid,
      message: '需求发布成功'
    })
  } catch (error) {
    console.error('[Create Demand Error]', error.message)
    res.status(500).json({ error: '发布需求失败' })
  }
})

// 更新需求
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params
    const { title, description, budget, deadline, requirements, status } = req.body

    const fields = []
    const values = []

    if (title) { fields.push('title = ?'); values.push(title) }
    if (description) { fields.push('description = ?'); values.push(description) }
    if (budget) { fields.push('budget = ?'); values.push(budget) }
    if (deadline) { fields.push('deadline = ?'); values.push(deadline) }
    if (requirements) { fields.push('requirements = ?'); values.push(JSON.stringify(requirements)) }
    if (status) { fields.push('status = ?'); values.push(status) }

    if (fields.length === 0) {
      return res.status(400).json({ error: '没有要更新的字段' })
    }

    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    const result = db.prepare(`UPDATE demands SET ${fields.join(', ')} WHERE id = ?`).run(...values)

    if (result.changes > 0) {
      res.json({ success: true, message: '更新成功' })
    } else {
      res.status(404).json({ error: '需求不存在' })
    }
  } catch (error) {
    console.error('[Update Demand Error]', error.message)
    res.status(500).json({ error: '更新需求失败' })
  }
})

// 删除需求
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params
    const result = db.prepare('DELETE FROM demands WHERE id = ?').run(id)

    if (result.changes > 0) {
      // 同时删除关联的投标
      db.prepare('DELETE FROM demand_bids WHERE demand_id = ?').run(id)
      res.json({ success: true, message: '删除成功' })
    } else {
      res.status(404).json({ error: '需求不存在' })
    }
  } catch (error) {
    console.error('[Delete Demand Error]', error.message)
    res.status(500).json({ error: '删除需求失败' })
  }
})

// 投标/接单
router.post('/:id/bid', (req, res) => {
  try {
    const { id } = req.params
    const { user_id, user_name, user_avatar, proposal, price, timeline } = req.body

    // 检查需求是否存在
    const demand = db.prepare('SELECT * FROM demands WHERE id = ?').get(id)
    if (!demand) {
      return res.status(404).json({ error: '需求不存在' })
    }

    // 检查是否已投过标
    const existingBid = db.prepare(
      'SELECT * FROM demand_bids WHERE demand_id = ? AND user_id = ?'
    ).get(id, user_id)

    if (existingBid) {
      return res.status(400).json({ error: '您已经投过标了' })
    }

    const result = db.prepare(`
      INSERT INTO demand_bids (demand_id, user_id, user_name, user_avatar, proposal, price, timeline)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, user_id, user_name, user_avatar, proposal, price, timeline)

    // 更新需求的投标数
    db.prepare('UPDATE demands SET bids = bids + 1 WHERE id = ?').run(id)

    res.json({
      success: true,
      bid_id: result.lastInsertRowid,
      message: '投标成功'
    })
  } catch (error) {
    console.error('[Bid Error]', error.message)
    res.status(500).json({ error: '投标失败' })
  }
})

// 获取投标列表
router.get('/:id/bids', (req, res) => {
  try {
    const { id } = req.params
    const bids = db.prepare(
      'SELECT * FROM demand_bids WHERE demand_id = ? ORDER BY created_at DESC'
    ).all(id)

    res.json({ bids })
  } catch (error) {
    console.error('[Get Bids Error]', error.message)
    res.status(500).json({ error: '获取投标列表失败' })
  }
})

// 收藏需求
router.post('/:id/collect', (req, res) => {
  try {
    const { id } = req.params
    const { user_id } = req.body

    const existing = db.prepare(
      'SELECT * FROM demand_collections WHERE demand_id = ? AND user_id = ?'
    ).get(id, user_id)

    if (existing) {
      // 取消收藏
      db.prepare('DELETE FROM demand_collections WHERE demand_id = ? AND user_id = ?').run(id, user_id)
      db.prepare('UPDATE demands SET collected = 0 WHERE id = ?').run(id)
      res.json({ success: true, collected: false })
    } else {
      // 添加收藏
      db.prepare('INSERT INTO demand_collections (demand_id, user_id) VALUES (?, ?)').run(id, user_id)
      db.prepare('UPDATE demands SET collected = 1 WHERE id = ?').run(id)
      res.json({ success: true, collected: true })
    }
  } catch (error) {
    console.error('[Collect Error]', error.message)
    res.status(500).json({ error: '操作失败' })
  }
})

// 获取统计数据
router.get('/stats/summary', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM demands').get()
    const pending = db.prepare("SELECT COUNT(*) as count FROM demands WHERE status = 'pending'").get()
    const matching = db.prepare("SELECT COUNT(*) as count FROM demands WHERE status = 'matching'").get()
    const totalBudget = db.prepare('SELECT SUM(budget) as total FROM demands').get()

    res.json({
      total: total?.count || 0,
      pending: pending?.count || 0,
      matching: matching?.count || 0,
      totalBudget: totalBudget?.total || 0
    })
  } catch (error) {
    console.error('[Stats Error]', error.message)
    res.status(500).json({ error: '获取统计数据失败' })
  }
})

// 辅助函数：格式化时间
function formatTimeAgo(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

export default router
