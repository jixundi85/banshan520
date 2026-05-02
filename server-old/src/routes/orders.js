const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data/database.json');

// 保存数据库辅助函数
function saveDBData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// 创建订单
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { courseId, courseTitle, price, paymentMethod = 'alipay' } = req.body;
    const userId = req.user.userId;

    if (!courseId || !price) {
      return res.status(400).json({ success: false, error: '缺少必要参数' });
    }

    const db = getDB();
    
    // 检查是否已购买
    const existingOrder = db.orders?.find(
      o => o.userId === userId && o.courseId === courseId && o.status === 'paid'
    );
    
    if (existingOrder) {
      return res.status(400).json({ success: false, error: '您已购买该课程' });
    }

    // 创建新订单
    const order = {
      id: uuidv4(),
      userId,
      courseId,
      courseTitle: courseTitle || '未知课程',
      price: parseFloat(price),
      paymentMethod,
      status: 'pending', // pending, paid, cancelled
      createdAt: new Date().toISOString(),
      paidAt: null,
      transactionId: null
    };

    db.orders = db.orders || [];
    db.orders.push(order);
    saveDBData(db);

    res.json({
      success: true,
      order: {
        id: order.id,
        courseTitle: order.courseTitle,
        price: order.price,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    res.status(500).json({ success: false, error: '创建订单失败' });
  }
});

// 模拟支付（实际项目中这里调用支付宝/微信支付API）
router.post('/pay', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.userId;

    const db = getDB();
    const order = db.orders?.find(o => o.id === orderId && o.userId === userId);

    if (!order) {
      return res.status(404).json({ success: false, error: '订单不存在' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ success: false, error: '订单已支付' });
    }

    // 模拟支付成功
    order.status = 'paid';
    order.paidAt = new Date().toISOString();
    order.transactionId = 'SIM' + Date.now();

    // 添加到用户已购课程
    db.userCourses = db.userCourses || [];
    db.userCourses.push({
      userId,
      courseId: order.courseId,
      orderId: order.id,
      purchasedAt: order.paidAt,
      progress: 0
    });

    saveDBData(db);

    res.json({
      success: true,
      message: '支付成功',
      order: {
        id: order.id,
        status: order.status,
        paidAt: order.paidAt
      }
    });
  } catch (error) {
    console.error('支付失败:', error);
    res.status(500).json({ success: false, error: '支付失败' });
  }
});

// 获取用户订单列表
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDB();
    
    const orders = db.orders?.filter(o => o.userId === userId) || [];
    
    res.json({
      success: true,
      orders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('获取订单失败:', error);
    res.status(500).json({ success: false, error: '获取订单失败' });
  }
});

// 获取用户已购课程
router.get('/my-courses', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDB();
    
    const userCourses = db.userCourses?.filter(uc => uc.userId === userId) || [];
    
    res.json({
      success: true,
      courses: userCourses.sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt))
    });
  } catch (error) {
    console.error('获取课程失败:', error);
    res.status(500).json({ success: false, error: '获取课程失败' });
  }
});

// 检查课程是否已购买
router.get('/check/:courseId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;
    const db = getDB();
    
    const purchased = db.userCourses?.some(
      uc => uc.userId === userId && uc.courseId === courseId
    );
    
    res.json({
      success: true,
      purchased
    });
  } catch (error) {
    console.error('检查购买状态失败:', error);
    res.status(500).json({ success: false, error: '检查失败' });
  }
});

module.exports = router;
