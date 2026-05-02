/**
 * 社区相关路由
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/mysql');
const { authMiddleware } = require('../middleware/auth');

// 获取帖子列表
router.get('/posts', async (req, res) => {
  try {
    const { category, keyword, page = 1, limit = 20, sort = 'latest' } = req.query;

    let sql = `
      SELECT p.*, u.nickname, u.avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'published'
    `;
    const params = [];

    if (category) {
      sql += ' AND p.category = ?';
      params.push(category);
    }

    if (keyword) {
      sql += ' AND (p.title LIKE ? OR p.content LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    switch (sort) {
      case 'hot':
        sql += ' ORDER BY p.like_count + p.comment_count DESC';
        break;
      case 'views':
        sql += ' ORDER BY p.view_count DESC';
        break;
      default:
        sql += ' ORDER BY p.is_pinned DESC, p.created_at DESC';
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const posts = await query(sql, params);
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ error: '获取帖子列表失败' });
  }
});

// 获取帖子详情
router.get('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    const posts = await query(`
      SELECT p.*, u.nickname, u.avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [postId]);

    if (posts.length === 0) {
      return res.status(404).json({ error: '帖子不存在' });
    }

    // 获取评论
    const comments = await query(`
      SELECT c.*, u.nickname, u.avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at
    `, [postId]);

    // 增加浏览量
    await query('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [postId]);

    res.json({
      success: true,
      post: posts[0],
      comments
    });
  } catch (error) {
    res.status(500).json({ error: '获取帖子详情失败' });
  }
});

// 发布帖子
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, content, category, tags, images } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容为必填项' });
    }

    const result = await query(`
      INSERT INTO posts (user_id, title, content, category, tags, images, status)
      VALUES (?, ?, ?, ?, ?, ?, 'published')
    `, [userId, title, content, category, tags ? JSON.stringify(tags) : null, images ? JSON.stringify(images) : null]);

    res.status(201).json({
      success: true,
      message: '帖子发布成功',
      postId: result.insertId
    });
  } catch (error) {
    console.error('发布帖子失败:', error);
    res.status(500).json({ error: '发布帖子失败' });
  }
});

// 评论帖子
router.post('/posts/:id/comment', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const { content, parentId } = req.body;

    if (!content) {
      return res.status(400).json({ error: '评论内容不能为空' });
    }

    await query(
      'INSERT INTO comments (post_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)',
      [postId, userId, parentId || 0, content]
    );

    // 更新评论数
    await query('UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?', [postId]);

    res.json({ success: true, message: '评论成功' });
  } catch (error) {
    res.status(500).json({ error: '评论失败' });
  }
});

// 点赞/取消点赞
router.post('/posts/:id/like', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    // 检查是否已点赞
    const existing = await query(
      'SELECT id FROM likes WHERE user_id = ? AND type = "post" AND type_id = ?',
      [userId, postId]
    );

    if (existing.length > 0) {
      // 取消点赞
      await query('DELETE FROM likes WHERE id = ?', [existing[0].id]);
      await query('UPDATE posts SET like_count = like_count - 1 WHERE id = ?', [postId]);
      res.json({ success: true, liked: false });
    } else {
      // 添加点赞
      await query('INSERT INTO likes (user_id, type, type_id) VALUES (?, ?, ?)', [userId, 'post', postId]);
      await query('UPDATE posts SET like_count = like_count + 1 WHERE id = ?', [postId]);
      res.json({ success: true, liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: '操作失败' });
  }
});

// 删除帖子
router.delete('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const posts = await query('SELECT user_id FROM posts WHERE id = ?', [postId]);
    if (posts.length === 0) {
      return res.status(404).json({ error: '帖子不存在' });
    }

    if (posts[0].user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: '无权删除' });
    }

    await query('UPDATE posts SET status = "deleted" WHERE id = ?', [postId]);

    res.json({ success: true, message: '帖子已删除' });
  } catch (error) {
    res.status(500).json({ error: '删除失败' });
  }
});

module.exports = router;
