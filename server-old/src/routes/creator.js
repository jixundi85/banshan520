/**
 * 创作者相关路由
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/mysql');
const { authMiddleware } = require('../middleware/auth');

// 获取创作者列表
router.get('/', async (req, res) => {
  try {
    const { category, keyword, page = 1, limit = 12, sort = 'rating' } = req.query;

    let sql = `
      SELECT c.*, u.nickname, u.avatar, u.bio, u.balance
      FROM creators c
      JOIN users u ON c.user_id = u.id
      WHERE c.contract_status = 'approved'
    `;
    const params = [];

    if (category) {
      sql += ' AND c.expertise LIKE ?';
      params.push(`%${category}%`);
    }

    if (keyword) {
      sql += ' AND (u.nickname LIKE ? OR c.expertise LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 排序
    switch (sort) {
      case 'orders':
        sql += ' ORDER BY c.order_count DESC';
        break;
      case 'earnings':
        sql += ' ORDER BY c.earnings DESC';
        break;
      default:
        sql += ' ORDER BY c.rating DESC';
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const creators = await query(sql, params);
    res.json({ success: true, creators });
  } catch (error) {
    res.status(500).json({ error: '获取创作者列表失败' });
  }
});

// 获取创作者详情
router.get('/:id', async (req, res) => {
  try {
    const creatorId = req.params.id;

    const creators = await query(`
      SELECT c.*, u.nickname, u.avatar, u.bio, u.phone
      FROM creators c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [creatorId]);

    if (creators.length === 0) {
      return res.status(404).json({ error: '创作者不存在' });
    }

    // 获取创作者的课程
    const courses = await query(
      'SELECT * FROM courses WHERE creator_id = ? AND is_published = TRUE ORDER BY student_count DESC LIMIT 10',
      [creatorId]
    );

    res.json({
      success: true,
      creator: creators[0],
      courses
    });
  } catch (error) {
    res.status(500).json({ error: '获取创作者详情失败' });
  }
});

// 申请成为创作者
router.post('/apply', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { realName, idCard, expertise, skills, bankName, bankAccount } = req.body;

    // 检查是否已是创作者
    const existing = await query('SELECT id FROM creators WHERE user_id = ?', [userId]);
    if (existing.length > 0) {
      return res.status(400).json({ error: '您已是创作者' });
    }

    // 创建创作者申请
    await query(`
      INSERT INTO creators (user_id, real_name, id_card, expertise, skills, bank_name, bank_account, contract_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [userId, realName, idCard, expertise, skills ? JSON.stringify(skills) : null, bankName, bankAccount]);

    res.json({ success: true, message: '申请已提交，请等待审核' });
  } catch (error) {
    console.error('申请创作者失败:', error);
    res.status(500).json({ error: '申请失败' });
  }
});

// 获取创作者收入统计
router.get('/stats/earnings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const creators = await query('SELECT id FROM creators WHERE user_id = ?', [userId]);
    if (creators.length === 0) {
      return res.status(403).json({ error: '您还不是创作者' });
    }

    const creatorId = creators[0].id;

    // 获取收入统计
    const totalEarnings = await query(
      'SELECT COALESCE(SUM(actual_amount), 0) as total FROM orders WHERE type = "demand" AND payment_status = "paid"'
    );

    const pendingEarnings = await query(
      'SELECT COALESCE(SUM(amount), 0) as pending FROM demand_quotes WHERE creator_id = ? AND status = "accepted"',
      [creatorId]
    );

    const completedOrders = await query(
      'SELECT COUNT(*) as count FROM orders WHERE type = "demand" AND payment_status = "paid"',
      []
    );

    res.json({
      success: true,
      stats: {
        totalEarnings: totalEarnings[0].total,
        pendingEarnings: pendingEarnings[0].pending,
        completedOrders: completedOrders[0].count
      }
    });
  } catch (error) {
    res.status(500).json({ error: '获取收入统计失败' });
  }
});

module.exports = router;
