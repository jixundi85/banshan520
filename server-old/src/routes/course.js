/**
 * 课程相关路由
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/mysql');
const { authMiddleware } = require('../middleware/auth');

// 获取课程列表
router.get('/', async (req, res) => {
  try {
    const { category, level, keyword, page = 1, limit = 12, sort = 'latest' } = req.query;

    let sql = 'SELECT c.*, u.nickname as creator_name, u.avatar as creator_avatar FROM courses c';
    sql += ' LEFT JOIN creators cr ON c.creator_id = cr.id';
    sql += ' LEFT JOIN users u ON cr.user_id = u.id';
    sql += ' WHERE c.is_published = TRUE';
    const params = [];

    if (category) {
      sql += ' AND c.category = ?';
      params.push(category);
    }

    if (level) {
      sql += ' AND c.level = ?';
      params.push(level);
    }

    if (keyword) {
      sql += ' AND (c.title LIKE ? OR c.description LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 排序
    switch (sort) {
      case 'popular':
        sql += ' ORDER BY c.student_count DESC';
        break;
      case 'rating':
        sql += ' ORDER BY c.rating DESC';
        break;
      case 'price_low':
        sql += ' ORDER BY c.price ASC';
        break;
      case 'price_high':
        sql += ' ORDER BY c.price DESC';
        break;
      default:
        sql += ' ORDER BY c.created_at DESC';
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const courses = await query(sql, params);

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM courses WHERE is_published = TRUE';
    if (category) countSql += ' AND category = ?';
    if (level) countSql += ' AND level = ?';
    if (keyword) countSql += ' AND (title LIKE ? OR description LIKE ?)';

    res.json({
      success: true,
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: courses.length
      }
    });
  } catch (error) {
    console.error('获取课程列表失败:', error);
    res.status(500).json({ error: '获取课程列表失败' });
  }
});

// 获取课程详情
router.get('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;

    // 获取课程信息
    const courses = await query(`
      SELECT c.*, u.nickname as creator_name, u.avatar as creator_avatar, u.bio as creator_bio,
             cr.expertise as creator_expertise, cr.rating as creator_rating, cr.order_count as creator_orders
      FROM courses c
      LEFT JOIN creators cr ON c.creator_id = cr.id
      LEFT JOIN users u ON cr.user_id = u.id
      WHERE c.id = ?
    `, [courseId]);

    if (courses.length === 0) {
      return res.status(404).json({ error: '课程不存在' });
    }

    // 获取章节列表
    const chapters = await query(
      'SELECT * FROM course_chapters WHERE course_id = ? ORDER BY sort_order',
      [courseId]
    );

    // 获取评价列表
    const reviews = await query(`
      SELECT r.*, u.nickname, u.avatar
      FROM course_reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.course_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [courseId]);

    // 增加浏览量
    await query('UPDATE courses SET views = views + 1 WHERE id = ?', [courseId]);

    res.json({
      success: true,
      course: courses[0],
      chapters,
      reviews
    });
  } catch (error) {
    console.error('获取课程详情失败:', error);
    res.status(500).json({ error: '获取课程详情失败' });
  }
});

// 购买课程
router.post('/:id/purchase', authMiddleware, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.userId;

    // 检查课程是否存在
    const courses = await query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (courses.length === 0) {
      return res.status(404).json({ error: '课程不存在' });
    }

    const course = courses[0];

    // 检查是否已购买
    const existingOrder = await query(
      'SELECT id FROM orders WHERE user_id = ? AND type = "course" AND type_id = ? AND payment_status = "paid"',
      [userId, courseId]
    );
    if (existingOrder.length > 0) {
      return res.status(400).json({ error: '您已购买过该课程' });
    }

    // 创建订单
    const { v4: uuidv4 } = require('uuid');
    const orderNo = 'C' + Date.now() + uuidv4().slice(0, 8).toUpperCase();

    await query(
      'INSERT INTO orders (order_no, user_id, type, type_id, title, amount, actual_amount, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [orderNo, userId, 'course', courseId, course.title, course.price, course.price, 'pending']
    );

    res.json({
      success: true,
      message: '订单创建成功',
      orderNo,
      amount: course.price
    });
  } catch (error) {
    console.error('购买课程失败:', error);
    res.status(500).json({ error: '购买失败' });
  }
});

// 开始学习（记录进度）
router.post('/:id/learn', authMiddleware, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.userId;
    const { chapterId, progress, lastPosition } = req.body;

    // 检查是否已购买
    const order = await query(
      'SELECT id FROM orders WHERE user_id = ? AND type = "course" AND type_id = ? AND payment_status = "paid"',
      [userId, courseId]
    );

    if (order.length === 0) {
      return res.status(403).json({ error: '请先购买课程' });
    }

    // 更新或创建学习进度
    await query(`
      INSERT INTO learning_progress (user_id, course_id, chapter_id, progress, last_position, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        chapter_id = VALUES(chapter_id),
        progress = VALUES(progress),
        last_position = VALUES(last_position),
        updated_at = NOW()
    `, [userId, courseId, chapterId || null, progress || 0, lastPosition || 0]);

    // 如果进度达到100%，标记完成
    if (progress >= 100) {
      await query(
        'UPDATE learning_progress SET completed = TRUE, completed_at = NOW() WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
      );
    }

    res.json({ success: true, message: '进度已保存' });
  } catch (error) {
    console.error('保存学习进度失败:', error);
    res.status(500).json({ error: '保存进度失败' });
  }
});

// 评价课程
router.post('/:id/review', authMiddleware, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.userId;
    const { rating, content, images } = req.body;

    // 检查是否已购买
    const order = await query(
      'SELECT id FROM orders WHERE user_id = ? AND type = "course" AND type_id = ? AND payment_status = "paid"',
      [userId, courseId]
    );

    if (order.length === 0) {
      return res.status(403).json({ error: '请先购买课程后再评价' });
    }

    // 检查是否已评价
    const existingReview = await query(
      'SELECT id FROM course_reviews WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (existingReview.length > 0) {
      return res.status(400).json({ error: '您已评价过该课程' });
    }

    // 创建评价
    await query(
      'INSERT INTO course_reviews (course_id, user_id, rating, content, images) VALUES (?, ?, ?, ?, ?)',
      [courseId, userId, rating, content, images ? JSON.stringify(images) : null]
    );

    // 更新课程平均评分
    const [{ avgRating, reviewCount }] = await query(
      'SELECT AVG(rating) as avgRating, COUNT(*) as reviewCount FROM course_reviews WHERE course_id = ?',
      [courseId]
    );
    await query(
      'UPDATE courses SET rating = ?, review_count = ? WHERE id = ?',
      [avgRating.toFixed(2), reviewCount, courseId]
    );

    res.json({ success: true, message: '评价成功' });
  } catch (error) {
    console.error('评价课程失败:', error);
    res.status(500).json({ error: '评价失败' });
  }
});

// 获取课程分类
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await query(
      'SELECT category, COUNT(*) as count FROM courses WHERE is_published = TRUE GROUP BY category ORDER BY count DESC'
    );
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ error: '获取分类失败' });
  }
});

module.exports = router;
