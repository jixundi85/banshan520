/**
 * 需求广场相关路由
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/mysql');
const { authMiddleware } = require('../middleware/auth');

// 获取需求列表
router.get('/', async (req, res) => {
  try {
    const { category, status = 'open', keyword, page = 1, limit = 12 } = req.query;

    let sql = `
      SELECT d.*, u.nickname as publisher_name, u.avatar as publisher_avatar
      FROM demands d
      JOIN users u ON d.publisher_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND d.status = ?';
      params.push(status);
    }

    if (category) {
      sql += ' AND d.category = ?';
      params.push(category);
    }

    if (keyword) {
      sql += ' AND (d.title LIKE ? OR d.description LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    sql += ' ORDER BY d.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const demands = await query(sql, params);
    res.json({ success: true, demands });
  } catch (error) {
    res.status(500).json({ error: '获取需求列表失败' });
  }
});

// 获取需求详情
router.get('/:id', async (req, res) => {
  try {
    const demandId = req.params.id;

    const demands = await query(`
      SELECT d.*, u.nickname as publisher_name, u.avatar as publisher_avatar
      FROM demands d
      JOIN users u ON d.publisher_id = u.id
      WHERE d.id = ?
    `, [demandId]);

    if (demands.length === 0) {
      return res.status(404).json({ error: '需求不存在' });
    }

    // 获取报价列表
    const quotes = await query(`
      SELECT q.*, u.nickname as creator_name, u.avatar as creator_avatar
      FROM demand_quotes q
      JOIN creators c ON q.creator_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE q.demand_id = ? AND q.status = 'pending'
      ORDER BY q.created_at DESC
    `, [demandId]);

    // 增加浏览量
    await query('UPDATE demands SET views = views + 1 WHERE id = ?', [demandId]);

    res.json({
      success: true,
      demand: demands[0],
      quotes
    });
  } catch (error) {
    res.status(500).json({ error: '获取需求详情失败' });
  }
});

// 发布需求
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, category, budgetMin, budgetMax, deadline, attachmentUrls } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: '标题和描述为必填项' });
    }

    const result = await query(`
      INSERT INTO demands (title, description, category, budget_min, budget_max, deadline, attachment_urls, publisher_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open')
    `, [title, description, category, budgetMin, budgetMax, deadline, attachmentUrls ? JSON.stringify(attachmentUrls) : null, userId]);

    res.status(201).json({
      success: true,
      message: '需求发布成功',
      demandId: result.insertId
    });
  } catch (error) {
    console.error('发布需求失败:', error);
    res.status(500).json({ error: '发布需求失败' });
  }
});

// 报价
router.post('/:id/quote', authMiddleware, async (req, res) => {
  try {
    const demandId = req.params.id;
    const userId = req.user.userId;
    const { price, deliveryDays, proposal, portfolioUrls } = req.body;

    // 获取创作者ID
    const creators = await query('SELECT id FROM creators WHERE user_id = ? AND contract_status = "approved"', [userId]);
    if (creators.length === 0) {
      return res.status(403).json({ error: '只有认证创作者才能报价' });
    }

    const creatorId = creators[0].id;

    // 检查是否已报价
    const existingQuote = await query(
      'SELECT id FROM demand_quotes WHERE demand_id = ? AND creator_id = ?',
      [demandId, creatorId]
    );
    if (existingQuote.length > 0) {
      return res.status(400).json({ error: '您已报价过该需求' });
    }

    await query(`
      INSERT INTO demand_quotes (demand_id, creator_id, price, delivery_days, proposal, portfolio_urls, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `, [demandId, creatorId, price, deliveryDays, proposal, portfolioUrls ? JSON.stringify(portfolioUrls) : null]);

    res.json({ success: true, message: '报价成功' });
  } catch (error) {
    console.error('报价失败:', error);
    res.status(500).json({ error: '报价失败' });
  }
});

// 接受报价
router.post('/:id/accept/:quoteId', authMiddleware, async (req, res) => {
  try {
    const demandId = req.params.id;
    const quoteId = req.params.quoteId;
    const userId = req.user.userId;

    // 检查是否是需求发布者
    const demands = await query('SELECT * FROM demands WHERE id = ? AND publisher_id = ?', [demandId, userId]);
    if (demands.length === 0) {
      return res.status(403).json({ error: '无权操作' });
    }

    // 更新报价状态
    await query('UPDATE demand_quotes SET status = "accepted" WHERE id = ?', [quoteId]);
    await query('UPDATE demands SET selected_creator_id = (SELECT creator_id FROM demand_quotes WHERE id = ?), status = "in_progress" WHERE id = ?', [quoteId, demandId]);

    // 拒绝其他报价
    await query('UPDATE demand_quotes SET status = "rejected" WHERE demand_id = ? AND id != ?', [demandId, quoteId]);

    res.json({ success: true, message: '已接受报价' });
  } catch (error) {
    console.error('接受报价失败:', error);
    res.status(500).json({ error: '操作失败' });
  }
});

module.exports = router;
