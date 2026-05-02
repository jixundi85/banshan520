/**
 * 用户相关路由
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/mysql');
const { authMiddleware } = require('../middleware/auth');

// 获取用户详情
router.get('/:id', async (req, res) => {
  try {
    const users = await query(
      'SELECT id, nickname, avatar, role, bio, created_at FROM users WHERE id = ? AND status = "active"',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ success: true, user: users[0] });
  } catch (error) {
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 更新用户资料
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { nickname, avatar, phone, bio } = req.body;
    const userId = req.user.userId;

    await query(
      'UPDATE users SET nickname = ?, avatar = ?, phone = ?, bio = ?, updated_at = NOW() WHERE id = ?',
      [nickname, avatar, phone, bio, userId]
    );

    const users = await query('SELECT * FROM users WHERE id = ?', [userId]);
    res.json({ success: true, user: users[0] });
  } catch (error) {
    res.status(500).json({ error: '更新资料失败' });
  }
});

// 获取用户学习进度
router.get('/learning/progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const progress = await query(`
      SELECT lp.*, c.title as course_title, c.cover_image, c.price,
             cc.title as chapter_title
      FROM learning_progress lp
      JOIN courses c ON lp.course_id = c.id
      LEFT JOIN course_chapters cc ON lp.chapter_id = cc.id
      WHERE lp.user_id = ?
      ORDER BY lp.updated_at DESC
    `, [userId]);

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: '获取学习进度失败' });
  }
});

// 获取用户收藏
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type } = req.query;

    let sql = `
      SELECT f.*, 
             CASE 
               WHEN f.type = 'course' THEN c.title
               WHEN f.type = 'creator' THEN u.nickname
               WHEN f.type = 'demand' THEN d.title
             END as title,
             CASE 
               WHEN f.type = 'course' THEN c.cover_image
               WHEN f.type = 'creator' THEN u.avatar
               WHEN f.type = 'demand' THEN NULL
             END as cover_image
      FROM favorites f
      LEFT JOIN courses c ON f.type = 'course' AND f.type_id = c.id
      LEFT JOIN users u ON f.type = 'creator' AND f.type_id = u.id
      LEFT JOIN demands d ON f.type = 'demand' AND f.type_id = d.id
      WHERE f.user_id = ?
    `;
    const params = [userId];

    if (type) {
      sql += ' AND f.type = ?';
      params.push(type);
    }

    sql += ' ORDER BY f.created_at DESC';

    const favorites = await query(sql, params);
    res.json({ success: true, favorites });
  } catch (error) {
    res.status(500).json({ error: '获取收藏失败' });
  }
});

// 获取用户订单
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

    let sql = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [userId];

    if (status) {
      sql += ' AND payment_status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const orders = await query(sql, params);

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM orders WHERE user_id = ?';
    const countParams = [userId];
    if (status) {
      countSql += ' AND payment_status = ?';
      countParams.push(status);
    }
    const [{ total }] = await query(countSql, countParams);

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: '获取订单失败' });
  }
});

// 获取用户消息列表
router.get('/messages', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, is_read } = req.query;

    let sql = 'SELECT * FROM messages WHERE to_user_id = ?';
    const params = [userId];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    if (is_read !== undefined) {
      sql += ' AND is_read = ?';
      params.push(is_read === 'true' ? 1 : 0);
    }

    sql += ' ORDER BY created_at DESC LIMIT 50';

    const messages = await query(sql, params);

    // 获取未读数
    const [{ unreadCount }] = await query(
      'SELECT COUNT(*) as unreadCount FROM messages WHERE to_user_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({
      success: true,
      messages,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ error: '获取消息失败' });
  }
});

// 标记消息已读
router.post('/messages/read', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageIds } = req.body;

    if (messageIds && messageIds.length > 0) {
      await query(
        'UPDATE messages SET is_read = TRUE WHERE id IN (?) AND to_user_id = ?',
        [messageIds, userId]
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '标记已读失败' });
  }
});

module.exports = router;
