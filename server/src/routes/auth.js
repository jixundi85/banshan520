/**
 * 认证相关路由
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB, saveDB } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// 注册
router.post('/register', async (req, res) => {
  try {
    const { email, password, nickname, phone } = req.body;

    // 验证必填字段
    if (!email || !password || !nickname) {
      return res.status(400).json({ error: '邮箱、密码和昵称为必填项' });
    }

    const db = getDB();

    // 检查邮箱是否已存在
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const newUser = {
      id: Date.now(),
      email,
      password: hashedPassword,
      nickname,
      phone: phone || null,
      role: 'user',
      status: 'active',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`,
      balance: 0,
      created_at: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDB(db);

    // 生成JWT
    const token = jwt.sign(
      { userId: newUser.id, role: 'user' },
      process.env.JWT_SECRET || 'aigc-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      token,
      user: {
        id: newUser.id,
        email,
        nickname,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ error: '注册失败' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码为必填项' });
    }

    const db = getDB();

    // 查询用户
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 检查账号状态
    if (user.status !== 'active') {
      return res.status(403).json({ error: '账号已被禁用' });
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 更新最后登录时间
    user.last_login_at = new Date().toISOString();
    saveDB(db);

    // 生成JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'aigc-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
        phone: user.phone,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// 获取当前用户信息
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const user = db.users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 不返回密码
    const { password, ...userWithoutPassword } = user;

    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 修改密码
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: '请填写完整信息' });
    }

    const db = getDB();
    const user = db.users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 验证旧密码
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: '原密码错误' });
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    saveDB(db);

    res.json({ success: true, message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({ error: '修改密码失败' });
  }
});

// 退出登录 (前端清除token即可，这里可以做日志记录)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ success: true, message: '退出成功' });
});

module.exports = router;
