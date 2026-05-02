/**
 * 文件上传相关路由
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/mysql');
const { authMiddleware } = require('../middleware/auth');

// 配置上传目录
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = req.body.category || 'other';
    const targetDir = path.join(uploadDir, subDir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4', 'video/webm'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 默认10MB
  }
});

// 上传文件
router.post('/file', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    const file = req.file;
    const category = req.body.category || 'other';
    const userId = req.user.userId;

    // 获取文件URL
    const fileUrl = `/uploads/${category}/${file.filename}`;

    // 保存上传记录
    await query(`
      INSERT INTO uploads (user_id, filename, stored_filename, file_path, file_url, file_type, file_size, mime_type, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      file.originalname,
      file.filename,
      file.path,
      fileUrl,
      file.mimetype.split('/')[0],
      file.size,
      file.mimetype,
      category
    ]);

    res.json({
      success: true,
      url: fileUrl,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    });
  } catch (error) {
    console.error('上传失败:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

// 多文件上传
router.post('/files', authMiddleware, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    const userId = req.user.userId;
    const category = req.body.category || 'other';
    const files = [];

    for (const file of req.files) {
      const fileUrl = `/uploads/${category}/${file.filename}`;
      
      await query(`
        INSERT INTO uploads (user_id, filename, stored_filename, file_path, file_url, file_type, file_size, mime_type, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        file.originalname,
        file.filename,
        file.path,
        fileUrl,
        file.mimetype.split('/')[0],
        file.size,
        file.mimetype,
        category
      ]);

      files.push({
        url: fileUrl,
        filename: file.filename,
        originalname: file.originalname,
        size: file.size
      });
    }

    res.json({ success: true, files });
  } catch (error) {
    console.error('上传失败:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

// 删除文件
router.delete('/:filename', authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const userId = req.user.userId;

    // 查找文件记录
    const uploads = await query(
      'SELECT * FROM uploads WHERE stored_filename = ? AND user_id = ?',
      [filename, userId]
    );

    if (uploads.length === 0) {
      return res.status(404).json({ error: '文件不存在' });
    }

    const upload = uploads[0];

    // 删除物理文件
    if (fs.existsSync(upload.file_path)) {
      fs.unlinkSync(upload.file_path);
    }

    // 删除数据库记录
    await query('DELETE FROM uploads WHERE id = ?', [upload.id]);

    res.json({ success: true, message: '文件已删除' });
  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({ error: '删除失败' });
  }
});

// 获取用户上传的文件列表
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category, page = 1, limit = 20 } = req.query;

    let sql = 'SELECT * FROM uploads WHERE user_id = ?';
    const params = [userId];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const uploads = await query(sql, params);

    res.json({ success: true, uploads });
  } catch (error) {
    res.status(500).json({ error: '获取文件列表失败' });
  }
});

module.exports = router;
