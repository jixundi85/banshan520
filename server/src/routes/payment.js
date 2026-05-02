/**
 * 支付相关路由
 * 支持微信支付和支付宝
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/mysql');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// ============================================
// 支付功能待接入 - 当前为模拟实现
// ============================================

// 发起支付（模拟）
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { orderNo, paymentMethod } = req.body;
    const userId = req.user.userId;

    // 查找订单
    const orders = await query(
      'SELECT * FROM orders WHERE order_no = ? AND user_id = ? AND payment_status = "pending"',
      [orderNo, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: '订单不存在或已支付' });
    }

    const order = orders[0];

    // 模拟支付参数
    res.json({
      success: true,
      message: '支付参数生成成功（模拟）',
      paymentMethod,
      orderNo,
      amount: order.actual_amount,
      // 实际接入时返回支付SDK参数
      mockPaymentUrl: `/api/payment/mock?orderNo=${orderNo}`
    });
  } catch (error) {
    console.error('创建支付失败:', error);
    res.status(500).json({ error: '创建支付失败' });
  }
});

// 模拟支付回调
router.post('/mock/callback', authMiddleware, async (req, res) => {
  try {
    const { orderNo } = req.body;
    const userId = req.user.userId;

    // 更新订单状态
    await query(
      'UPDATE orders SET payment_status = "paid", payment_time = NOW(), updated_at = NOW() WHERE order_no = ? AND user_id = ?',
      [orderNo, userId]
    );

    // 处理订单成功逻辑
    await processOrderSuccess(orderNo);

    res.json({ success: true, message: '支付成功' });
  } catch (error) {
    console.error('支付回调处理失败:', error);
    res.status(500).json({ error: '支付处理失败' });
  }
});

// 查询支付状态
router.get('/status/:orderNo', authMiddleware, async (req, res) => {
  try {
    const { orderNo } = req.params;
    const userId = req.user.userId;

    const orders = await query(
      'SELECT payment_status, payment_time, transaction_id FROM orders WHERE order_no = ? AND user_id = ?',
      [orderNo, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: '订单不存在' });
    }

    res.json({
      success: true,
      order: orders[0]
    });
  } catch (error) {
    res.status(500).json({ error: '查询失败' });
  }
});

// 申请退款
router.post('/refund', authMiddleware, async (req, res) => {
  try {
    const { orderNo, reason } = req.body;
    const userId = req.user.userId;

    // 查找订单
    const orders = await query(
      'SELECT * FROM orders WHERE order_no = ? AND user_id = ? AND payment_status = "paid"',
      [orderNo, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: '订单不存在或不符合退款条件' });
    }

    const order = orders[0];

    // 检查退款时间（7天内可退款）
    const payTime = new Date(order.payment_time);
    const now = new Date();
    const daysDiff = (now - payTime) / (1000 * 60 * 60 * 24);

    if (daysDiff > 7) {
      return res.status(400).json({ error: '超过7天退款期限' });
    }

    // 创建退款申请
    await query(
      'UPDATE orders SET payment_status = "refunded", status = "cancelled", updated_at = NOW() WHERE order_no = ?',
      [orderNo]
    );

    // 如果是课程，退回学习权限
    if (order.type === 'course') {
      await query(
        'UPDATE courses SET student_count = student_count - 1 WHERE id = ?',
        [order.type_id]
      );
    }

    res.json({ success: true, message: '退款申请已提交' });
  } catch (error) {
    console.error('退款申请失败:', error);
    res.status(500).json({ error: '退款申请失败' });
  }
});

// 处理订单支付成功后的逻辑
async function processOrderSuccess(orderNo) {
  try {
    const orders = await query('SELECT * FROM orders WHERE order_no = ?', [orderNo]);
    if (orders.length === 0) return;

    const order = orders[0];

    switch (order.type) {
      case 'course':
        // 增加课程购买数
        await query('UPDATE courses SET student_count = student_count + 1 WHERE id = ?', [order.type_id]);
        break;
      case 'demand':
        // 更新需求状态为进行中
        await query('UPDATE demands SET status = "in_progress" WHERE id = ?', [order.type_id]);
        break;
    }

    console.log(`订单 ${orderNo} 支付成功处理完成`);
  } catch (error) {
    console.error('处理订单成功逻辑失败:', error);
  }
}

module.exports = router;
