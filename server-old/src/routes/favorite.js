/**
 * 收藏相关路由
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/mysql');
const { authMiddleware } = require('../middleware/auth');

// 添加收藏
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, typeId } = req.body;

    if (!type || !typeId) {
      return res.status(400).json({ error: '参数不完整' });
    }

    // 检查是否已收藏
    const existing = await query(
      'SELECT id FROM favorites WHERE user_id = ? AND type = ? AND type_id = ?',
      [userId, type, typeId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: '已收藏' });
    }

    await query(
      'INSERT INTO favorites (user_id, type, type_id) VALUES (?, ?, ?)',
      [userId, type, typeId]
    );

    res.json({ success: true, message: '收藏成功' });
  } catch (error) {
    res.status(500).json({ error: '收藏失败' });
  }
});

// 取消收藏
router.post('/remove', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, typeId } = req.body;

    await query(
      'DELETE FROM favorites WHERE user_id = ? AND type = ? AND type_id = ?',
      [userId, type, typeId]
    );

    res.json({ success: true, message: '已取消收藏' });
  } catch (error) {
    res.status(500).json({ error: '取消收藏失败' });
  }
});

// 检查收藏状态
router.get('/check/:type/:typeId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, typeId } = req.params;

    const existing = await query(
      'SELECT id FROM favorites WHERE user_id = ? AND type = ? AND type_id = ?',
      [userId, type, typeId]
    );

    res.json({ success: true, isFavorite: existing.length > 0 });
  } catch (error) {
    res.status(500).json({ error: '查询失败' });
  }
});

module.exports = router;
