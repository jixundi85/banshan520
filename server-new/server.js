import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');

// ============ IN-MEMORY DATABASE ============
let db = {
  users: [],
  admins: [],
  requirements: [],
  orders: [],
  courses: [],
  enrollments: [],
  learning_progress: [],
  posts: [],
  post_likes: [],
  comments: [],
  transactions: []
};

// Load data from file
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      db = JSON.parse(data);
      // Migrate old orders to new format if needed
      migrateOrders();
      console.log('Data loaded from file');
    } else {
      seedData();
    }
  } catch (e) {
    console.log('Starting with fresh data');
    seedData();
  }
}

// Migrate old orders to new format
function migrateOrders() {
  db.orders = db.orders.map(order => ({
    ...order,
    // New fields for escrow payment flow
    creator_quote: order.amount || 0,
    creator_message: order.creator_message || '',
    quote_status: order.quote_status || 'pending',
    escrow_amount: order.escrow_amount || order.amount || 0,
    escrow_status: order.escrow_status || 'pending',
    deposit_amount: order.deposit_amount || Math.floor((order.amount || 0) * 0.3),
    deposit_paid: order.deposit_paid || false,
    deposit_paid_at: order.deposit_paid_at || null,
    balance_amount: order.balance_amount || Math.floor((order.amount || 0) * 0.7),
    balance_paid: order.balance_paid || false,
    balance_paid_at: order.balance_paid_at || null,
    client_confirmed_at: order.client_confirmed_at || null,
  }));
}

// Save data to file
function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

// Seed initial data
function seedData() {
  db.admins = [
    { id: uuidv4(), username: 'admin', password: 'admin123', name: '超级管理员', role: 'admin' }
  ];

  const userIds = {
    creator1: uuidv4(),
    creator2: uuidv4(),
    creator3: uuidv4(),
    client1: uuidv4(),
    client2: uuidv4(),
  };

  db.users = [
    { id: userIds.creator1, username: 'creator1', password: '123456', name: '创作者小明', role: 'creator', balance: 12580, verified: true, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator1', skills: 'AI视频,剪辑,特效', bio: '专注AI影视创作5年', created_at: new Date().toISOString() },
    { id: userIds.creator2, username: 'creator2', password: '123456', name: '影视达人', role: 'creator', balance: 8900, verified: true, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator2', skills: 'Sora,Kling,AI生成', bio: 'AI视频工具研究者', created_at: new Date().toISOString() },
    { id: userIds.creator3, username: 'creator3', password: '123456', name: '新人小白', role: 'creator', balance: 500, verified: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator3', skills: 'PR,AE', bio: '学习剪辑中', created_at: new Date().toISOString() },
    { id: userIds.client1, password: '123456', username: 'client1', name: '李总', role: 'client', balance: 50000, verified: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client1', skills: '', bio: '企业主', created_at: new Date().toISOString() },
    { id: userIds.client2, username: 'client2', password: '123456', name: '张经理', role: 'client', balance: 30000, verified: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client2', skills: '', bio: '市场经理', created_at: new Date().toISOString() },
  ];

  const reqIds = {
    req1: uuidv4(),
    req2: uuidv4(),
    req3: uuidv4(),
    req4: uuidv4(),
    req5: uuidv4(),
  };

  db.requirements = [
    { 
      id: reqIds.req1, 
      title: '企业年会宣传片制作', 
      description: '需要制作一个15分钟左右的年会宣传片，展示公司发展历程和团队风采。要求AI辅助生成部分场景画面，整体风格大气磅礴。', 
      type: '宣传片', 
      budget_min: 5000, 
      budget_max: 8000, 
      deadline_days: 7, 
      tags: 'AI生成,4K,商务风', 
      urgent: true, 
      status: 'published', 
      user_id: userIds.client1, 
      assignee_id: null,
      quotes: [], // 存储所有报价
      views: 1256, 
      created_at: new Date().toISOString() 
    },
    { 
      id: reqIds.req2, 
      title: '产品短视频广告', 
      description: '为新品发布会制作30秒预告片，需要快速剪辑、产品特写、动效字幕。', 
      type: '广告片', 
      budget_min: 3000, 
      budget_max: 5000, 
      deadline_days: 5, 
      tags: '剪辑,配音,字幕', 
      urgent: false, 
      status: 'published', 
      user_id: userIds.client2, 
      assignee_id: null,
      quotes: [],
      views: 892, 
      created_at: new Date().toISOString() 
    },
    { 
      id: reqIds.req3, 
      title: 'AI虚拟主播形象制作', 
      description: '打造公司专属AI虚拟主播，用于直播带货和品牌宣传。需要角色设计、声音克隆、口播视频制作。', 
      type: 'AI生成', 
      budget_min: 8000, 
      budget_max: 12000, 
      deadline_days: 14, 
      tags: 'AI角色,口播,场景', 
      urgent: true, 
      status: 'quoted', // 有报价待确认
      user_id: userIds.client1, 
      assignee_id: userIds.creator1,
      quotes: [
        { id: uuidv4(), creator_id: userIds.creator1, creator_name: '创作者小明', quote: 10000, message: '包含角色设计、声音克隆和5个口播视频', created_at: new Date().toISOString() }
      ],
      views: 2341, 
      created_at: new Date().toISOString() 
    },
    { 
      id: reqIds.req4, 
      title: '电商产品展示视频', 
      description: '为天猫店铺制作产品展示视频，要求高清画质、动态展示、配背景音乐。', 
      type: '电商视频', 
      budget_min: 2000, 
      budget_max: 4000, 
      deadline_days: 3, 
      tags: '产品展示,背景音乐', 
      urgent: false, 
      status: 'published', 
      user_id: userIds.client2, 
      assignee_id: null,
      quotes: [],
      views: 567, 
      created_at: new Date().toISOString() 
    },
    { 
      id: reqIds.req5, 
      title: '品牌故事纪录片', 
      description: '拍摄制作公司品牌故事纪录片，时长10分钟，需要航拍素材和大量实景拍摄。', 
      type: '宣传片', 
      budget_min: 15000, 
      budget_max: 20000, 
      deadline_days: 21, 
      tags: '纪录片,4K,航拍', 
      urgent: false, 
      status: 'published', 
      user_id: userIds.client1, 
      assignee_id: null,
      quotes: [],
      views: 345, 
      created_at: new Date().toISOString() 
    },
  ];

  // Create order with new escrow format
  const orderAmount = 10000;
  db.orders = [
    { 
      id: uuidv4(), 
      requirement_id: reqIds.req3, 
      requirement_title: 'AI虚拟主播形象制作',
      client_id: userIds.client1, 
      creator_id: userIds.creator1, 
      // 报价信息
      creator_quote: 10000,
      creator_message: '包含角色设计、声音克隆和5个口播视频',
      quote_status: 'accepted', // 报价已确认
      // 托管信息
      escrow_amount: 10000,
      escrow_status: 'funded', // 已托管
      // 预付款 30%
      deposit_amount: 3000,
      deposit_paid: true,
      deposit_paid_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      // 尾款 70%
      balance_amount: 7000,
      balance_paid: false,
      balance_paid_at: null,
      // 交付信息
      deliverable_url: '', 
      deliverable_desc: '', 
      deliverable_at: null, 
      client_confirmed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      accepted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() 
    }
  ];

  db.courses = [
    { id: uuidv4(), title: 'AI视频生成完全指南', description: '从零开始，系统学习Sora、Kling、Runway等主流AI视频工具，掌握提示词技巧和实战应用。', instructor_id: userIds.creator1, instructor_name: '张老师', price: 299, original_price: 599, rating: 4.9, students: 1234, lessons: 48, duration: '12小时', category: 'AI视频', chapters: JSON.stringify([{title: '第一章：AI视频基础', lessons: [{title: '1.1 AI视频概述', video_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'}, {title: '1.2 主流工具介绍', video_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'}]}, {title: '第二章：Sora使用', lessons: [{title: '2.1 Sora注册与界面', video_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'}, {title: '2.2 提示词技巧', video_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'}]}]), status: 'published', created_at: new Date().toISOString() },
    { id: uuidv4(), title: 'Sora+Kling实战案例', description: '通过10+实战案例，深入讲解Sora和Kling的配合使用，打造专业级AI影视作品。', instructor_id: userIds.creator2, instructor_name: '李讲师', price: 499, original_price: 899, rating: 4.8, students: 892, lessons: 36, duration: '20小时', category: 'AI视频', chapters: JSON.stringify([{title: '第一章：案例概述', lessons: [{title: '1.1 案例介绍', video_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'}]}]), status: 'published', created_at: new Date().toISOString() },
    { id: uuidv4(), title: 'AI宣传片从0到1', description: '完整企业宣传片制作流程，从需求分析到AI生成，再到后期剪辑，全流程实战。', instructor_id: userIds.creator1, instructor_name: '王导', price: 399, original_price: 699, rating: 4.7, students: 567, lessons: 28, duration: '16小时', category: 'AI视频', chapters: JSON.stringify([{title: '第一章：需求分析', lessons: [{title: '1.1 客户需求沟通', video_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'}]}]), status: 'published', created_at: new Date().toISOString() },
    { id: uuidv4(), title: '商业视频创作变现', description: '教你如何通过视频创作实现副业变现，接单技巧、客户沟通、报价策略全揭秘。', instructor_id: userIds.creator2, instructor_name: '陈老师', price: 199, original_price: 399, rating: 4.6, students: 2341, lessons: 18, duration: '8小时', category: '营销变现', chapters: JSON.stringify([]), status: 'published', created_at: new Date().toISOString() },
  ];

  db.posts = [
    { id: uuidv4(), user_id: userIds.creator1, content: '刚完成了一个AI影视大片的创作，分享一下制作心得... #AI影视', images: '', topic: '#AI影视', likes: 128, comments_count: 2, views: 1200, status: 'published', created_at: new Date().toISOString() },
    { id: uuidv4(), user_id: userIds.creator2, content: '最近研究了几款AI视频生成工具，Sora和Kling各有千秋... #工具评测', images: '', topic: '#工具评测', likes: 89, comments_count: 1, views: 890, status: 'published', created_at: new Date().toISOString() },
    { id: uuidv4(), user_id: userIds.creator3, content: '请问AI生成视频如何保持角色一致性？求大神指教... #技术问答', images: '', topic: '#技术问答', likes: 45, comments_count: 0, views: 560, status: 'published', created_at: new Date().toISOString() },
  ];

  db.comments = [
    { id: uuidv4(), post_id: db.posts[0].id, user_id: userIds.creator2, content: '太厉害了，能分享一下提示词吗？', created_at: new Date().toISOString() },
    { id: uuidv4(), post_id: db.posts[0].id, user_id: userIds.creator3, content: '学习到了！', created_at: new Date().toISOString() },
    { id: uuidv4(), post_id: db.posts[1].id, user_id: userIds.creator1, content: 'Kling的运镜效果确实更自然', created_at: new Date().toISOString() },
  ];

  db.enrollments = [];
  db.post_likes = [];
  db.learning_progress = [];
  db.transactions = [];

  saveData();
  console.log('Initial data seeded');
}

// Helper functions
function findUser(id) {
  return db.users.find(u => u.id === id);
}

function findAdmin(id) {
  return db.admins.find(a => a.id === id);
}

function getUserInfo(user) {
  if (!user) return null;
  const { password, ...info } = user;
  return info;
}

// Initialize
loadData();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// ============ AUTH ROUTES ============

// User login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  res.json(getUserInfo(user));
});

// User register
app.post('/api/auth/register', (req, res) => {
  const { username, password, name, role = 'creator' } = req.body;
  const existing = db.users.find(u => u.username === username);
  if (existing) {
    return res.status(400).json({ error: '用户名已存在' });
  }
  const user = {
    id: uuidv4(),
    username,
    password,
    name,
    role,
    balance: 0,
    verified: false,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    skills: role === 'creator' ? '' : '',
    bio: '',
    created_at: new Date().toISOString()
  };
  db.users.push(user);
  saveData();
  const { password: _, ...info } = user;
  res.json(info);
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '未登录' });
  const user = findUser(userId);
  if (!user) return res.status(401).json({ error: '用户不存在' });
  res.json(getUserInfo(user));
});

// ============ REQUIREMENTS ROUTES ============

// Get all requirements
app.get('/api/requirements', (req, res) => {
  let results = [...db.requirements];
  
  // Filter by status
  if (req.query.status) {
    results = results.filter(r => r.status === req.query.status);
  }
  
  // Filter by type
  if (req.query.type) {
    results = results.filter(r => r.type === req.query.type);
  }
  
  // Filter by user (my requirements)
  const userId = req.headers['x-user-id'];
  if (req.query.my === 'true' && userId) {
    results = results.filter(r => r.user_id === userId);
  }
  
  // Sort
  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  // Add creator info
  results = results.map(r => {
    const user = findUser(r.user_id);
    const assignee = r.assignee_id ? findUser(r.assignee_id) : null;
    return {
      ...r,
      user_name: user?.name || '未知',
      user_avatar: user?.avatar || '',
      assignee_name: assignee?.name || null,
      quote_count: r.quotes?.length || 0
    };
  });
  
  res.json(results);
});

// Get single requirement
app.get('/api/requirements/:id', (req, res) => {
  const req_data = db.requirements.find(r => r.id === req.params.id);
  if (!req_data) return res.status(404).json({ error: '需求不存在' });
  
  const user = findUser(req_data.user_id);
  const assignee = req_data.assignee_id ? findUser(req_data.assignee_id) : null;
  
  // Get creator info for quotes
  const quotesWithCreator = (req_data.quotes || []).map(q => {
    const creator = findUser(q.creator_id);
    return {
      ...q,
      creator_avatar: creator?.avatar || '',
      creator_skills: creator?.skills || ''
    };
  });
  
  res.json({
    ...req_data,
    user_name: user?.name || '未知',
    user_avatar: user?.avatar || '',
    assignee_name: assignee?.name || null,
    assignee_avatar: assignee?.avatar || null,
    quotes: quotesWithCreator
  });
});

// Create requirement
app.post('/api/requirements', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const user = findUser(userId);
  if (user?.role !== 'client') return res.status(403).json({ error: '只有需求方可以发布需求' });
  
  const requirement = {
    id: uuidv4(),
    ...req.body,
    user_id: userId,
    assignee_id: null,
    status: 'published',
    quotes: [],
    views: 0,
    created_at: new Date().toISOString()
  };
  
  db.requirements.push(requirement);
  saveData();
  res.json(requirement);
});

// Creator quotes on a requirement
app.post('/api/requirements/:id/quote', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const user = findUser(userId);
  if (user?.role !== 'creator') return res.status(403).json({ error: '只有创作者可以报价' });
  
  const req_data = db.requirements.find(r => r.id === req.params.id);
  if (!req_data) return res.status(404).json({ error: '需求不存在' });
  
  if (req_data.status === 'in_progress' || req_data.status === 'completed') {
    return res.status(400).json({ error: '该需求已无法报价' });
  }
  
  const { quote, message } = req.body;
  
  // Check if creator already quoted
  const existingQuote = req_data.quotes?.find(q => q.creator_id === userId);
  if (existingQuote) {
    // Update existing quote
    existingQuote.quote = quote;
    existingQuote.message = message;
    existingQuote.created_at = new Date().toISOString();
  } else {
    // Add new quote
    if (!req_data.quotes) req_data.quotes = [];
    req_data.quotes.push({
      id: uuidv4(),
      creator_id: userId,
      creator_name: user.name,
      quote,
      message: message || '',
      created_at: new Date().toISOString()
    });
  }
  
  req_data.status = 'quoted';
  saveData();
  
  res.json({ success: true, quotes: req_data.quotes });
});

// Client accepts a quote -> creates order and funds escrow
app.post('/api/requirements/:id/accept-quote', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const req_data = db.requirements.find(r => r.id === req.params.id);
  if (!req_data) return res.status(404).json({ error: '需求不存在' });
  
  if (req_data.user_id !== userId) {
    return res.status(403).json({ error: '只有需求方可以确认报价' });
  }
  
  const { quoteId } = req.body;
  const quote = req_data.quotes?.find(q => q.id === quoteId);
  if (!quote) return res.status(404).json({ error: '报价不存在' });
  
  const creator = findUser(quote.creator_id);
  const client = findUser(userId);
  
  const totalAmount = quote.quote;
  const depositAmount = Math.floor(totalAmount * 0.3);
  const balanceAmount = totalAmount - depositAmount;
  
  // Check if client has enough balance
  if (client.balance < totalAmount) {
    return res.status(400).json({ error: `余额不足，需要 ${totalAmount} 元托管全款，您当前余额 ${client.balance} 元` });
  }
  
  // Deduct from client balance (escrow)
  client.balance -= totalAmount;
  
  // Create order
  const order = {
    id: uuidv4(),
    requirement_id: req_data.id,
    requirement_title: req_data.title,
    client_id: userId,
    creator_id: quote.creator_id,
    // 报价信息
    creator_quote: totalAmount,
    creator_message: quote.message,
    quote_status: 'accepted',
    // 托管信息
    escrow_amount: totalAmount,
    escrow_status: 'funded',
    // 预付款 30%
    deposit_amount: depositAmount,
    deposit_paid: true,
    deposit_paid_at: new Date().toISOString(),
    // 尾款 70%
    balance_amount: balanceAmount,
    balance_paid: false,
    balance_paid_at: null,
    // 交付信息
    deliverable_url: '',
    deliverable_desc: '',
    deliverable_at: null,
    client_confirmed_at: new Date().toISOString(),
    accepted_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };
  
  db.orders.push(order);
  
  // Update requirement
  req_data.assignee_id = quote.creator_id;
  req_data.status = 'in_progress';
  req_data.quotes = req_data.quotes.map(q => ({
    ...q,
    status: q.id === quoteId ? 'accepted' : 'rejected'
  }));
  
  // Record transaction
  db.transactions.push({
    id: uuidv4(),
    type: 'escrow_funded',
    order_id: order.id,
    client_id: userId,
    creator_id: quote.creator_id,
    amount: totalAmount,
    description: `托管全款 ${totalAmount} 元（预付款 ${depositAmount} + 尾款 ${balanceAmount}）`,
    created_at: new Date().toISOString()
  });
  
  db.transactions.push({
    id: uuidv4(),
    type: 'deposit_paid',
    order_id: order.id,
    creator_id: quote.creator_id,
    amount: depositAmount,
    description: `收到订单预付款 ${depositAmount} 元（30%）`,
    created_at: new Date().toISOString()
  });
  
  // Add deposit to creator's withdrawable balance
  creator.balance += depositAmount;
  
  saveData();
  
  res.json({ success: true, order });
});

// Client rejects a quote
app.post('/api/requirements/:id/reject-quote', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const req_data = db.requirements.find(r => r.id === req.params.id);
  if (!req_data) return res.status(404).json({ error: '需求不存在' });
  
  if (req_data.user_id !== userId) {
    return res.status(403).json({ error: '只有需求方可以拒绝报价' });
  }
  
  const { quoteId } = req.body;
  req_data.quotes = req_data.quotes?.map(q => 
    q.id === quoteId ? { ...q, status: 'rejected' } : q
  );
  
  // If all quotes rejected, go back to published
  const pendingQuotes = req_data.quotes?.filter(q => q.status !== 'rejected');
  if (!pendingQuotes || pendingQuotes.length === 0) {
    req_data.status = 'published';
    req_data.quotes = [];
  }
  
  saveData();
  res.json({ success: true });
});

// ============ ORDERS ROUTES ============

// Get orders
app.get('/api/orders', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  let orders = [...db.orders];
  
  // Filter by role
  if (req.query.role === 'creator') {
    orders = orders.filter(o => o.creator_id === userId);
  } else if (req.query.role === 'client') {
    orders = orders.filter(o => o.client_id === userId);
  } else {
    orders = orders.filter(o => o.creator_id === userId || o.client_id === userId);
  }
  
  // Add user info
  orders = orders.map(o => {
    const client = findUser(o.client_id);
    const creator = findUser(o.creator_id);
    return {
      ...o,
      client_name: client?.name || '未知',
      client_avatar: client?.avatar || '',
      creator_name: creator?.name || '未知',
      creator_avatar: creator?.avatar || '',
      // 可提现金额：只有全款结清后才能提现
      withdrawable_amount: (o.deposit_paid && o.balance_paid) ? o.escrow_amount : 0
    };
  });
  
  orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  res.json(orders);
});

// Get single order
app.get('/api/orders/:id', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: '订单不存在' });
  
  const client = findUser(order.client_id);
  const creator = findUser(order.creator_id);
  
  res.json({
    ...order,
    client_name: client?.name || '未知',
    client_avatar: client?.avatar || '',
    creator_name: creator?.name || '未知',
    creator_avatar: creator?.avatar || '',
    withdrawable_amount: (order.deposit_paid && order.balance_paid) ? order.escrow_amount : 0
  });
});

// Creator delivers work
app.post('/api/orders/:id/deliver', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: '订单不存在' });
  
  if (order.creator_id !== userId) {
    return res.status(403).json({ error: '只有创作者可以提交作品' });
  }
  
  if (!order.deposit_paid) {
    return res.status(400).json({ error: '请等待需求方托管全款' });
  }
  
  if (order.deliverable_at) {
    return res.status(400).json({ error: '作品已提交，请等待验收' });
  }
  
  const { deliverable_url, deliverable_desc } = req.body;
  order.deliverable_url = deliverable_url || '';
  order.deliverable_desc = deliverable_desc || '';
  order.deliverable_at = new Date().toISOString();
  
  saveData();
  res.json({ success: true, order });
});

// Client accepts and pays balance
app.post('/api/orders/:id/accept', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: '订单不存在' });
  
  if (order.client_id !== userId) {
    return res.status(403).json({ error: '只有需求方可以验收' });
  }
  
  if (!order.deliverable_at) {
    return res.status(400).json({ error: '创作者还未提交作品' });
  }
  
  // Check if balance already paid
  if (order.balance_paid) {
    return res.status(400).json({ error: '尾款已结清' });
  }
  
  // Mark balance as paid (money was already in escrow)
  order.balance_paid = true;
  order.balance_paid_at = new Date().toISOString();
  
  const creator = findUser(order.creator_id);
  
  // Add balance to creator's withdrawable balance
  creator.balance += order.balance_amount;
  
  // Record transaction
  db.transactions.push({
    id: uuidv4(),
    type: 'balance_paid',
    order_id: order.id,
    creator_id: order.creator_id,
    amount: order.balance_amount,
    description: `收到订单尾款 ${order.balance_amount} 元（70%）`,
    created_at: new Date().toISOString()
  });
  
  saveData();
  res.json({ success: true, order });
});

// Client rejects
app.post('/api/orders/:id/reject', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: '订单不存在' });
  
  if (order.client_id !== userId) {
    return res.status(403).json({ error: '只有需求方可以驳回' });
  }
  
  // Clear delivery
  order.deliverable_url = '';
  order.deliverable_desc = '';
  order.deliverable_at = null;
  
  // Record rejection
  db.transactions.push({
    id: uuidv4(),
    type: 'work_rejected',
    order_id: order.id,
    client_id: userId,
    creator_id: order.creator_id,
    amount: 0,
    description: `需求方驳回作品，要求重新修改`,
    created_at: new Date().toISOString()
  });
  
  saveData();
  res.json({ success: true, order });
});

// ============ COURSES ROUTES ============

app.get('/api/courses', (req, res) => {
  let courses = db.courses.filter(c => c.status === 'published');
  if (req.query.category) {
    courses = courses.filter(c => c.category === req.query.category);
  }
  res.json(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: '课程不存在' });
  
  // Check if user enrolled
  const userId = req.headers['x-user-id'];
  const enrollment = userId ? db.enrollments.find(e => e.course_id === req.params.id && e.user_id === userId) : null;
  
  res.json({
    ...course,
    chapters: JSON.parse(course.chapters || '[]'),
    is_enrolled: !!enrollment
  });
});

app.post('/api/courses/:id/enroll', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: '课程不存在' });
  
  const user = findUser(userId);
  
  // Check if already enrolled
  const existing = db.enrollments.find(e => e.course_id === req.params.id && e.user_id === userId);
  if (existing) return res.status(400).json({ error: '已购买过该课程' });
  
  // Check balance (simplified - in production would integrate payment)
  if (user.balance < course.price) {
    return res.status(400).json({ error: `余额不足，课程价格 ${course.price} 元` });
  }
  
  // Deduct balance
  user.balance -= course.price;
  
  // Create enrollment
  db.enrollments.push({
    id: uuidv4(),
    course_id: course.id,
    user_id: userId,
    enrolled_at: new Date().toISOString()
  });
  
  // Update course students count
  course.students = (course.students || 0) + 1;
  
  // Record transaction
  db.transactions.push({
    id: uuidv4(),
    type: 'course_purchase',
    course_id: course.id,
    user_id: userId,
    amount: course.price,
    description: `购买课程《${course.title}》`,
    created_at: new Date().toISOString()
  });
  
  saveData();
  res.json({ success: true });
});

app.get('/api/my-courses', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const enrollments = db.enrollments.filter(e => e.user_id === userId);
  const courses = enrollments.map(e => {
    const course = db.courses.find(c => c.id === e.course_id);
    const progress = db.learning_progress.filter(p => p.enrollment_id === e.id);
    return {
      ...course,
      chapters: JSON.parse(course?.chapters || '[]'),
      enrollment_id: e.id,
      enrolled_at: e.enrolled_at,
      progress: progress.length > 0 ? Math.max(...progress.map(p => p.progress || 0)) : 0
    };
  });
  
  res.json(courses);
});

app.post('/api/courses/:id/progress', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const { lessonIndex, progress } = req.body;
  
  const enrollment = db.enrollments.find(e => e.course_id === req.params.id && e.user_id === userId);
  if (!enrollment) return res.status(400).json({ error: '未购买该课程' });
  
  // Update or create progress
  const existing = db.learning_progress.find(p => p.enrollment_id === enrollment.id && p.lesson_index === lessonIndex);
  if (existing) {
    existing.progress = progress;
    existing.updated_at = new Date().toISOString();
  } else {
    db.learning_progress.push({
      id: uuidv4(),
      enrollment_id: enrollment.id,
      course_id: req.params.id,
      lesson_index: lessonIndex,
      progress,
      updated_at: new Date().toISOString()
    });
  }
  
  saveData();
  res.json({ success: true });
});

// ============ POSTS ROUTES ============

app.get('/api/posts', (req, res) => {
  let posts = db.posts.filter(p => p.status === 'published');
  if (req.query.topic) posts = posts.filter(p => p.topic === req.query.topic);
  
  posts = posts.map(p => {
    const user = findUser(p.user_id);
    const liked = req.headers['x-user-id'] ? !!db.post_likes.find(l => l.post_id === p.id && l.user_id === req.headers['x-user-id']) : false;
    return {
      ...p,
      user_name: user?.name || '未知',
      user_avatar: user?.avatar || '',
      liked
    };
  });
  
  posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: '帖子不存在' });
  
  const user = findUser(post.user_id);
  const comments = db.comments.filter(c => c.post_id === post.id).map(c => {
    const commentUser = findUser(c.user_id);
    return { ...c, user_name: commentUser?.name || '未知', user_avatar: commentUser?.avatar || '' };
  });
  
  const liked = req.headers['x-user-id'] ? !!db.post_likes.find(l => l.post_id === post.id && l.user_id === req.headers['x-user-id']) : false;
  
  res.json({ ...post, user_name: user?.name || '未知', user_avatar: user?.avatar || '', comments, liked });
});

app.post('/api/posts', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const post = {
    id: uuidv4(),
    user_id: userId,
    content: req.body.content,
    images: req.body.images || '',
    topic: req.body.topic || '',
    likes: 0,
    comments_count: 0,
    views: 0,
    status: 'published',
    created_at: new Date().toISOString()
  };
  
  db.posts.push(post);
  saveData();
  res.json(post);
});

app.post('/api/posts/:id/like', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: '帖子不存在' });
  
  const existing = db.post_likes.find(l => l.post_id === post.id && l.user_id === userId);
  if (existing) {
    db.post_likes = db.post_likes.filter(l => l !== existing);
    post.likes--;
  } else {
    db.post_likes.push({ id: uuidv4(), post_id: post.id, user_id: userId });
    post.likes++;
  }
  
  saveData();
  res.json({ liked: !existing, likes: post.likes });
});

app.post('/api/posts/:id/comments', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: '帖子不存在' });
  
  const comment = {
    id: uuidv4(),
    post_id: post.id,
    user_id: userId,
    content: req.body.content,
    created_at: new Date().toISOString()
  };
  
  db.comments.push(comment);
  post.comments_count++;
  
  saveData();
  
  const user = findUser(userId);
  res.json({ ...comment, user_name: user?.name || '未知', user_avatar: user?.avatar || '' });
});

// ============ USER ROUTES ============

app.get('/api/users/:id', (req, res) => {
  const user = findUser(req.params.id);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json(getUserInfo(user));
});

app.put('/api/profile', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const user = findUser(userId);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  
  const { name, bio, skills, avatar } = req.body;
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (skills !== undefined) user.skills = skills;
  if (avatar) user.avatar = avatar;
  
  saveData();
  res.json(getUserInfo(user));
});

app.get('/api/earnings', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const user = findUser(userId);
  
  // Get creator orders
  const orders = db.orders.filter(o => o.creator_id === userId);
  
  // Calculate earnings
  const totalEarnings = orders.reduce((sum, o) => sum + o.escrow_amount, 0);
  const withdrawable = user.balance; // Current balance is withdrawable
  const withdrawn = orders.reduce((sum, o) => {
    // In real system, track withdrawals separately
    return sum;
  }, 0);
  
  // Recent transactions
  const recentTx = db.transactions
    .filter(t => t.creator_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);
  
  res.json({
    total_earnings: totalEarnings,
    withdrawable,
    withdrawn: 0,
    pending_clearance: totalEarnings - withdrawable,
    recent_transactions: recentTx
  });
});

app.post('/api/withdraw', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: '请先登录' });
  
  const user = findUser(userId);
  const { amount } = req.body;
  
  if (amount <= 0) return res.status(400).json({ error: '提现金额必须大于0' });
  
  // Check if user has withdrawable balance
  // Balance is already withdrawable after escrow is fully released
  if (user.balance < amount) {
    return res.status(400).json({ error: `余额不足，可提现 ${user.balance} 元` });
  }
  
  // Check if all orders are fully paid (escrow released)
  const creatorOrders = db.orders.filter(o => o.creator_id === userId);
  const incompleteOrders = creatorOrders.filter(o => !o.balance_paid);
  if (incompleteOrders.length > 0) {
    return res.status(400).json({ 
      error: `有 ${incompleteOrders.length} 个订单尾款未结清，需全部验收完成后才能提现`,
      incomplete_orders: incompleteOrders.map(o => ({ id: o.id, title: o.requirement_title }))
    });
  }
  
  user.balance -= amount;
  
  // Record withdrawal
  db.transactions.push({
    id: uuidv4(),
    type: 'withdrawal',
    user_id: userId,
    amount: -amount,
    description: `提现 ${amount} 元`,
    created_at: new Date().toISOString()
  });
  
  saveData();
  res.json({ success: true, new_balance: user.balance });
});

// ============ STATS ROUTES ============

app.get('/api/stats', (req, res) => {
  res.json({
    total_users: db.users.length,
    total_requirements: db.requirements.length,
    total_orders: db.orders.length,
    total_courses: db.courses.length,
    total_posts: db.posts.length,
    total_revenue: db.transactions.filter(t => t.type === 'course_purchase').reduce((sum, t) => sum + t.amount, 0)
  });
});

// ============ ADMIN ROUTES ============

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.admins.find(a => a.username === username && a.password === password);
  if (!admin) return res.status(401).json({ error: '管理员账号或密码错误' });
  res.json(getUserInfo(admin));
});

app.get('/api/admin/users', (req, res) => {
  res.json(db.users.map(u => getUserInfo(u)));
});

app.put('/api/admin/requirements/:id', (req, res) => {
  const requirement = db.requirements.find(r => r.id === req.params.id);
  if (!requirement) return res.status(404).json({ error: '需求不存在' });
  
  Object.assign(requirement, req.body);
  saveData();
  res.json(requirement);
});

app.put('/api/admin/users/:id/verify', (req, res) => {
  const user = findUser(req.params.id);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  
  user.verified = req.body.verified;
  saveData();
  res.json(getUserInfo(user));
});

app.put('/api/admin/courses/:id', (req, res) => {
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: '课程不存在' });
  
  Object.assign(course, req.body);
  saveData();
  res.json(course);
});

app.delete('/api/admin/posts/:id', (req, res) => {
  db.posts = db.posts.filter(p => p.id !== req.params.id);
  saveData();
  res.json({ success: true });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
