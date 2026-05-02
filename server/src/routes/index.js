/**
 * API路由入口
 */

const express = require('express');
const router = express.Router();

// 认证相关路由
const authRoutes = require('./auth');
// 用户相关路由
const userRoutes = require('./user');
// 课程相关路由
const courseRoutes = require('./course');
// 创作者相关路由
const creatorRoutes = require('./creator');
// 需求相关路由
const demandRoutes = require('./demand');
// 订单相关路由
const orderRoutes = require('./order');
// 新的订单路由（使用JSON数据库）
const ordersRoutes = require('./orders');
// 支付相关路由
const paymentRoutes = require('./payment');
// 消息相关路由
const messageRoutes = require('./message');
// 社区相关路由
const communityRoutes = require('./community');
// 文件上传相关路由
const uploadRoutes = require('./upload');
// 收藏相关路由
const favoriteRoutes = require('./favorite');

// 挂载路由
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/course', courseRoutes);
router.use('/creator', creatorRoutes);
router.use('/demand', demandRoutes);
router.use('/order', orderRoutes);
router.use('/orders', ordersRoutes);
router.use('/payment', paymentRoutes);
router.use('/message', messageRoutes);
router.use('/community', communityRoutes);
router.use('/upload', uploadRoutes);
router.use('/favorite', favoriteRoutes);

// 统计接口
router.get('/stats', async (req, res) => {
  try {
    const { query } = require('../config/mysql');
    
    const [userCount] = await query('SELECT COUNT(*) as count FROM users');
    const [courseCount] = await query('SELECT COUNT(*) as count FROM courses WHERE is_published = TRUE');
    const [creatorCount] = await query('SELECT COUNT(*) as count FROM creators WHERE contract_status = "approved"');
    const [orderCount] = await query('SELECT COUNT(*) as count FROM orders WHERE payment_status = "paid"');
    const [todayOrderCount] = await query('SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE() AND payment_status = "paid"');
    const [todayRevenue] = await query('SELECT COALESCE(SUM(actual_amount), 0) as total FROM orders WHERE DATE(created_at) = CURDATE() AND payment_status = "paid"');
    
    res.json({
      success: true,
      data: {
        userCount: userCount[0].count,
        courseCount: courseCount[0].count,
        creatorCount: creatorCount[0].count,
        orderCount: orderCount[0].count,
        todayOrderCount: todayOrderCount[0].count,
        todayRevenue: todayRevenue[0].total
      }
    });
  } catch (error) {
    res.status(500).json({ error: '获取统计数据失败' });
  }
});

// 首页数据
router.get('/home', async (req, res) => {
  try {
    const { query } = require('../config/mysql');
    
    // 获取推荐课程
    const featuredCourses = await query(
      'SELECT * FROM courses WHERE is_published = TRUE AND is_featured = TRUE LIMIT 6'
    );
    
    // 获取最新课程
    const latestCourses = await query(
      'SELECT * FROM courses WHERE is_published = TRUE ORDER BY created_at DESC LIMIT 8'
    );
    
    // 获取热门创作者
    const topCreators = await query(`
      SELECT c.*, u.nickname, u.avatar 
      FROM creators c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.contract_status = 'approved' 
      ORDER BY c.order_count DESC LIMIT 6
    `);
    
    // 获取热门需求
    const hotDemands = await query(
      'SELECT * FROM demands WHERE status = "open" ORDER BY views DESC LIMIT 6'
    );
    
    res.json({
      success: true,
      data: {
        featuredCourses,
        latestCourses,
        topCreators,
        hotDemands
      }
    });
  } catch (error) {
    console.error('获取首页数据失败:', error);
    res.status(500).json({ error: '获取首页数据失败' });
  }
});

module.exports = router;
