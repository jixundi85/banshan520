/**
 * 订单相关路由
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/mysql');
const { authMiddleware } = require('../middleware/auth');

// 获取订单列表 (后台管理)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;

    let sql = 'SELECT o.*, u.nickname, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND o.payment_status = ?';
      params.push(status);
    }

    if (type) {
      sql += ' AND o.type = ?';
      params.push(type);
    }

    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const orders = await query(sql, params);

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM orders o WHERE 1=1';
    const countParams = [];
    if (status) {
      countSql += ' AND o.payment_status = ?';
      countParams.push(status);
    }
    if (type) {
      countSql += ' AND o.type = ?';
      countParams.push(type);
    }
    const [{ total }] = await query(countSql, countParams);

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ error: '获取订单列表失败' });
  }
});

// 获取订单详情
router.get('/:orderNo', authMiddleware, async (req, res) => {
  try {
    const { orderNo } = req.params;

    const orders = await query(`
      SELECT o.*, u.nickname, u.email, u.phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.order_no = ?
    `, [orderNo]);

    if (orders.length === 0) {
      return res.status(404).json({ error: '订单不存在' });
    }

    res.json({ success: true, order: orders[0] });
  } catch (error) {
    res.status(500).json({ error: '获取订单详情失败' });
  }
});

// 取消订单
router.post('/:orderNo/cancel', authMiddleware, async (req, res) => {
  try {
    const { orderNo } = req.params;
    const userId = req.user.userId;

    const orders = await query(
      'SELECT * FROM orders WHERE order_no = ? AND user_id = ? AND payment_status = "pending"',
      [orderNo, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: '订单不存在或无法取消' });
    }

    await query(
      'UPDATE orders SET status = "cancelled", payment_status = "cancelled", updated_at = NOW() WHERE order_no = ?',
      [orderNo]
    );

    res.json({ success: true, message: '订单已取消' });
  } catch (error) {
    res.status(500).json({ error: '取消订单失败' });
  }
});

module.exports = router;
