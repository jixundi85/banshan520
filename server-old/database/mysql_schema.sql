-- ============================================
-- AIGC内容供需平台 - MySQL数据库表结构
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS aigc_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aigc_platform;

-- ============================================
-- 1. 用户表
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱/登录账号',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
    nickname VARCHAR(50) NOT NULL COMMENT '昵称',
    avatar VARCHAR(255) DEFAULT '/avatar/default.jpg' COMMENT '头像URL',
    phone VARCHAR(20) COMMENT '手机号',
    role ENUM('user', 'creator', 'admin') DEFAULT 'user' COMMENT '用户角色',
    status ENUM('active', 'banned', 'inactive') DEFAULT 'active' COMMENT '账号状态',
    bio TEXT COMMENT '个人简介',
    balance DECIMAL(10, 2) DEFAULT 0.00 COMMENT '账户余额',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    last_login_at TIMESTAMP COMMENT '最后登录时间',
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ============================================
-- 2. 创作者信息表
-- ============================================
CREATE TABLE IF NOT EXISTS creators (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '创作者ID',
    user_id INT NOT NULL UNIQUE COMMENT '用户ID',
    real_name VARCHAR(50) COMMENT '真实姓名',
    id_card VARCHAR(20) COMMENT '身份证号',
    id_card_front VARCHAR(255) COMMENT '身份证正面照',
    id_card_back VARCHAR(255) COMMENT '身份证背面照',
    bank_name VARCHAR(100) COMMENT '开户银行',
    bank_account VARCHAR(50) COMMENT '银行账号',
    expertise TEXT COMMENT '专业领域',
    skills JSON COMMENT '擅长技能列表',
    portfolio TEXT COMMENT '作品集链接',
    contract_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '签约状态',
    contract_at TIMESTAMP COMMENT '签约时间',
    earnings DECIMAL(10, 2) DEFAULT 0.00 COMMENT '累计收益',
    rating DECIMAL(3, 2) DEFAULT 5.00 COMMENT '平均评分',
    order_count INT DEFAULT 0 COMMENT '完成订单数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (contract_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='创作者信息表';

-- ============================================
-- 3. 课程表
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '课程ID',
    title VARCHAR(200) NOT NULL COMMENT '课程标题',
    description TEXT COMMENT '课程描述',
    cover_image VARCHAR(255) COMMENT '封面图片',
    video_url VARCHAR(500) COMMENT '视频URL',
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '课程价格',
    original_price DECIMAL(10, 2) COMMENT '原价',
    category VARCHAR(50) COMMENT '分类',
    tags JSON COMMENT '标签',
    duration INT COMMENT '时长（分钟）',
    level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner' COMMENT '难度级别',
    creator_id INT COMMENT '创作者ID',
    student_count INT DEFAULT 0 COMMENT '学习人数',
    rating DECIMAL(3, 2) DEFAULT 5.00 COMMENT '平均评分',
    review_count INT DEFAULT 0 COMMENT '评价数量',
    is_published BOOLEAN DEFAULT FALSE COMMENT '是否发布',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_price (price),
    INDEX idx_published (is_published),
    INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程表';

-- ============================================
-- 4. 课程章节表
-- ============================================
CREATE TABLE IF NOT EXISTS course_chapters (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '章节ID',
    course_id INT NOT NULL COMMENT '课程ID',
    title VARCHAR(200) NOT NULL COMMENT '章节标题',
    description TEXT COMMENT '章节描述',
    video_url VARCHAR(500) COMMENT '视频URL',
    duration INT COMMENT '时长（分钟）',
    sort_order INT DEFAULT 0 COMMENT '排序',
    is_free BOOLEAN DEFAULT FALSE COMMENT '是否免费试看',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程章节表';

-- ============================================
-- 5. 课程评价表
-- ============================================
CREATE TABLE IF NOT EXISTS course_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '评价ID',
    course_id INT NOT NULL COMMENT '课程ID',
    user_id INT NOT NULL COMMENT '用户ID',
    rating TINYINT NOT NULL COMMENT '评分 1-5',
    content TEXT COMMENT '评价内容',
    images JSON COMMENT '评价图片',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程评价表';

-- ============================================
-- 6. 学习记录表
-- ============================================
CREATE TABLE IF NOT EXISTS learning_progress (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    course_id INT NOT NULL COMMENT '课程ID',
    chapter_id INT COMMENT '章节ID',
    progress INT DEFAULT 0 COMMENT '进度百分比 0-100',
    last_position INT DEFAULT 0 COMMENT '上次播放位置（秒）',
    completed BOOLEAN DEFAULT FALSE COMMENT '是否完成',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '开始学习时间',
    completed_at TIMESTAMP COMMENT '完成时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES course_chapters(id) ON DELETE SET NULL,
    UNIQUE KEY uk_user_course (user_id, course_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学习记录表';

-- ============================================
-- 7. 需求广场表
-- ============================================
CREATE TABLE IF NOT EXISTS demands (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '需求ID',
    title VARCHAR(200) NOT NULL COMMENT '需求标题',
    description TEXT NOT NULL COMMENT '需求描述',
    category VARCHAR(50) COMMENT '需求分类',
    budget_min DECIMAL(10, 2) COMMENT '预算下限',
    budget_max DECIMAL(10, 2) COMMENT '预算上限',
    deadline DATE COMMENT '截止日期',
    attachment_urls JSON COMMENT '附件URL列表',
    publisher_id INT NOT NULL COMMENT '发布者ID',
    status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open' COMMENT '状态',
    selected_creator_id INT COMMENT '选中的创作者ID',
    views INT DEFAULT 0 COMMENT '浏览量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (publisher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (selected_creator_id) REFERENCES creators(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_publisher (publisher_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='需求广场表';

-- ============================================
-- 8. 需求报价表
-- ============================================
CREATE TABLE IF NOT EXISTS demand_quotes (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '报价ID',
    demand_id INT NOT NULL COMMENT '需求ID',
    creator_id INT NOT NULL COMMENT '创作者ID',
    price DECIMAL(10, 2) NOT NULL COMMENT '报价金额',
    delivery_days INT NOT NULL COMMENT '交付天数',
    proposal TEXT COMMENT '方案说明',
    portfolio_urls JSON COMMENT '相关作品链接',
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (demand_id) REFERENCES demands(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE,
    UNIQUE KEY uk_demand_creator (demand_id, creator_id),
    INDEX idx_demand_id (demand_id),
    INDEX idx_creator_id (creator_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='需求报价表';

-- ============================================
-- 9. 订单表
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    order_no VARCHAR(50) UNIQUE NOT NULL COMMENT '订单号',
    user_id INT NOT NULL COMMENT '用户ID',
    type ENUM('course', 'demand', 'service') NOT NULL COMMENT '订单类型',
    type_id INT NOT NULL COMMENT '关联类型ID（课程ID/需求ID等）',
    title VARCHAR(200) NOT NULL COMMENT '订单标题',
    amount DECIMAL(10, 2) NOT NULL COMMENT '订单金额',
    discount DECIMAL(10, 2) DEFAULT 0.00 COMMENT '优惠金额',
    actual_amount DECIMAL(10, 2) NOT NULL COMMENT '实付金额',
    payment_method ENUM('wechat', 'alipay', 'balance') COMMENT '支付方式',
    payment_status ENUM('pending', 'paid', 'refunded', 'cancelled') DEFAULT 'pending' COMMENT '支付状态',
    payment_time TIMESTAMP COMMENT '支付时间',
    transaction_id VARCHAR(100) COMMENT '支付流水号',
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending' COMMENT '订单状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_order_no (order_no),
    INDEX idx_user_id (user_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- ============================================
-- 10. 支付记录表
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '支付记录ID',
    order_id INT NOT NULL COMMENT '订单ID',
    payment_method ENUM('wechat', 'alipay') NOT NULL COMMENT '支付渠道',
    amount DECIMAL(10, 2) NOT NULL COMMENT '支付金额',
    status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending' COMMENT '支付状态',
    trade_no VARCHAR(100) COMMENT '渠道交易号',
    prepay_id VARCHAR(100) COMMENT '预支付ID',
    callback_data JSON COMMENT '回调原始数据',
    paid_at TIMESTAMP COMMENT '支付成功时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_trade_no (trade_no),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付记录表';

-- ============================================
-- 11. 收藏表
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '收藏ID',
    user_id INT NOT NULL COMMENT '用户ID',
    type ENUM('course', 'creator', 'demand') NOT NULL COMMENT '收藏类型',
    type_id INT NOT NULL COMMENT '关联类型ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_type_id (user_id, type, type_id),
    INDEX idx_user_id (user_id),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- ============================================
-- 12. 社区帖子表
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '帖子ID',
    user_id INT NOT NULL COMMENT '发布者ID',
    title VARCHAR(200) NOT NULL COMMENT '帖子标题',
    content TEXT NOT NULL COMMENT '帖子内容',
    images JSON COMMENT '图片列表',
    category VARCHAR(50) COMMENT '分类',
    tags JSON COMMENT '标签',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    view_count INT DEFAULT 0 COMMENT '浏览量',
    is_pinned BOOLEAN DEFAULT FALSE COMMENT '是否置顶',
    status ENUM('published', 'hidden', 'deleted') DEFAULT 'published' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区帖子表';

-- ============================================
-- 13. 帖子评论表
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '评论ID',
    post_id INT NOT NULL COMMENT '帖子ID',
    user_id INT NOT NULL COMMENT '评论者ID',
    parent_id INT DEFAULT 0 COMMENT '父评论ID（0为顶级评论）',
    content TEXT NOT NULL COMMENT '评论内容',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帖子评论表';

-- ============================================
-- 14. 点赞记录表
-- ============================================
CREATE TABLE IF NOT EXISTS likes (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '点赞ID',
    user_id INT NOT NULL COMMENT '用户ID',
    type ENUM('post', 'comment', 'course_review') NOT NULL COMMENT '点赞类型',
    type_id INT NOT NULL COMMENT '关联类型ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_type_id (user_id, type, type_id),
    INDEX idx_type (type, type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞记录表';

-- ============================================
-- 15. 消息表
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '消息ID',
    from_user_id INT NOT NULL COMMENT '发送者ID',
    to_user_id INT NOT NULL COMMENT '接收者ID',
    type ENUM('system', 'chat', 'order', 'activity') NOT NULL COMMENT '消息类型',
    title VARCHAR(200) COMMENT '消息标题',
    content TEXT NOT NULL COMMENT '消息内容',
    data JSON COMMENT '附加数据',
    is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_to_user (to_user_id, is_read),
    INDEX idx_from_user (from_user_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- ============================================
-- 16. 聊天会话表
-- ============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '会话ID',
    user_id INT NOT NULL COMMENT '用户ID',
    creator_id INT NOT NULL COMMENT '创作者ID',
    last_message TEXT COMMENT '最后一条消息',
    last_message_at TIMESTAMP COMMENT '最后消息时间',
    unread_count INT DEFAULT 0 COMMENT '未读消息数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE,
    UNIQUE KEY uk_users (user_id, creator_id),
    INDEX idx_user_id (user_id),
    INDEX idx_creator_id (creator_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天会话表';

-- ============================================
-- 17. 聊天消息表
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '消息ID',
    session_id INT NOT NULL COMMENT '会话ID',
    sender_id INT NOT NULL COMMENT '发送者ID',
    content TEXT NOT NULL COMMENT '消息内容',
    type ENUM('text', 'image', 'file') DEFAULT 'text' COMMENT '消息类型',
    is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_sender_id (sender_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天消息表';

-- ============================================
-- 18. 文件上传记录表
-- ============================================
CREATE TABLE IF NOT EXISTS uploads (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '上传记录ID',
    user_id INT NOT NULL COMMENT '上传者ID',
    filename VARCHAR(255) NOT NULL COMMENT '原始文件名',
    stored_filename VARCHAR(255) NOT NULL COMMENT '存储文件名',
    file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
    file_url VARCHAR(500) NOT NULL COMMENT '访问URL',
    file_type VARCHAR(50) NOT NULL COMMENT '文件类型',
    file_size INT NOT NULL COMMENT '文件大小（字节）',
    mime_type VARCHAR(100) COMMENT 'MIME类型',
    category ENUM('avatar', 'course', 'portfolio', 'id_card', 'attachment', 'other') DEFAULT 'other' COMMENT '分类',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件上传记录表';

-- ============================================
-- 19. 操作日志表
-- ============================================
CREATE TABLE IF NOT EXISTS operation_logs (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
    user_id INT COMMENT '操作用户ID',
    action VARCHAR(50) NOT NULL COMMENT '操作类型',
    target_type VARCHAR(50) COMMENT '目标类型',
    target_id INT COMMENT '目标ID',
    detail JSON COMMENT '操作详情',
    ip_address VARCHAR(50) COMMENT 'IP地址',
    user_agent TEXT COMMENT 'User Agent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_target (target_type, target_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- ============================================
-- 初始数据
-- ============================================

-- 插入管理员账号 (密码: 123456, bcrypt加密)
INSERT INTO users (email, password, nickname, role, status) VALUES
('admin@aigc.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '平台管理员', 'admin', 'active');

-- 插入示例课程
INSERT INTO courses (title, description, cover_image, price, category, level, is_published, is_featured) VALUES
('AI绘画实战入门', '从零开始学习AI绘画工具，掌握Midjourney和Stable Diffusion', '/images/course-ai-painting.jpg', 299.00, 'AI绘画', 'beginner', TRUE, TRUE),
('ChatGPT提示词工程', '深入学习如何编写有效的ChatGPT提示词，提升AI交互效率', '/images/course-prompt.jpg', 199.00, 'AI工具', 'beginner', TRUE, TRUE),
('AI视频创作进阶', '使用AI工具制作专业级视频内容，包含剪辑和特效', '/images/course-video.jpg', 499.00, 'AI视频', 'intermediate', TRUE, FALSE),
('AIGC商业变现指南', '如何利用AIGC技能实现副业收入，打造个人品牌', '/images/course-monetize.jpg', 399.00, '创业指导', 'beginner', TRUE, TRUE);
