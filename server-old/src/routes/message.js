/**
 * 消息相关路由
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/mysql');
const { authMiddleware } = require('../middleware/auth');

// 获取聊天会话列表
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // 获取用户的所有会话
    const sessions = await query(`
      SELECT cs.*, 
             u.nickname as other_name, 
             u.avatar as other_avatar,
             CASE WHEN cs.user_id = ? THEN cr.id ELSE cs.creator_id END as other_id
      FROM chat_sessions cs
      JOIN users u ON (cs.user_id = ? AND cs.creator_id IN (SELECT user_id FROM creators WHERE id = cs.creator_id)) 
                 OR (cs.creator_id IN (SELECT id FROM creators WHERE user_id = cs.user_id) AND cs.user_id != ?)
      JOIN creators cr ON cs.creator_id = cr.id
      WHERE cs.user_id = ? OR cr.user_id = ?
      ORDER BY cs.last_message_at DESC
    `, [userId, userId, userId, userId, userId]);

    res.json({ success: true, sessions });
  } catch (error) {
    console.error('获取会话列表失败:', error);
    res.status(500).json({ error: '获取会话列表失败' });
  }
});

// 获取聊天记录
router.get('/history/:sessionId', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50, before } = req.query;

    let sql = 'SELECT * FROM chat_messages WHERE session_id = ?';
    const params = [sessionId];

    if (before) {
      sql += ' AND id < ?';
      params.push(parseInt(before));
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const messages = await query(sql, params);

    // 标记消息已读
    await query(
      'UPDATE chat_messages SET is_read = TRUE WHERE session_id = ? AND sender_id != ?',
      [sessionId, req.user.userId]
    );

    res.json({ success: true, messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ error: '获取聊天记录失败' });
  }
});

// 发送消息
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { recipientId, content, type = 'text' } = req.body;

    // 查找或创建会话
    let sessions = await query(
      'SELECT * FROM chat_sessions WHERE user_id = ? AND creator_id IN (SELECT id FROM creators WHERE user_id = ?)',
      [userId, recipientId]
    );

    let sessionId;
    if (sessions.length === 0) {
      // 查找创作者ID
      const creators = await query('SELECT id FROM creators WHERE user_id = ?', [recipientId]);
      if (creators.length === 0) {
        return res.status(404).json({ error: '用户不存在' });
      }

      const result = await query(
        'INSERT INTO chat_sessions (user_id, creator_id) VALUES (?, ?)',
        [userId, creators[0].id]
      );
      sessionId = result.insertId;
    } else {
      sessionId = sessions[0].id;
    }

    // 发送消息
    const result = await query(
      'INSERT INTO chat_messages (session_id, sender_id, content, type) VALUES (?, ?, ?, ?)',
      [sessionId, userId, content, type]
    );

    // 更新会话最后消息
    await query(
      'UPDATE chat_sessions SET last_message = ?, last_message_at = NOW(), unread_count = unread_count + 1 WHERE id = ?',
      [content, sessionId]
    );

    // 创建消息记录
    await query(
      'INSERT INTO messages (from_user_id, to_user_id, type, content) VALUES (?, ?, "chat", ?)',
      [userId, recipientId, content]
    );

    res.json({
      success: true,
      messageId: result.insertId,
      sessionId
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    res.status(500).json({ error: '发送消息失败' });
  }
});

// 发送系统消息
router.post('/system', authMiddleware, async (req, res) => {
  try {
    const { userId, title, content, type = 'system', data } = req.body;

    await query(
      'INSERT INTO messages (from_user_id, to_user_id, type, title, content, data) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.userId, userId, type, title, content, data ? JSON.stringify(data) : null]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '发送消息失败' });
  }
});

module.exports = router;
