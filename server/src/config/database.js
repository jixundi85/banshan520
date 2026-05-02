/**
 * JSON文件数据库 - 使用原生fs模块
 */

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data/database.json');

// 确保数据目录存在
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 默认数据结构
const defaultData = {
  users: [],
  creators: [],
  tutorials: [],
  orders: [],
  userCourses: [],
  comments: [],
  notifications: [],
  posts: [],
  events: [],
  demands: [],
  messages: [],
  favorites: [],
  follows: []
};

// 初始化数据库
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

// 获取数据库
function getDB() {
  initDB();
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

// 保存数据库
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  getDB,
  saveDB,
  initDB
};
