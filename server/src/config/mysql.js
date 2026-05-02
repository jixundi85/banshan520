/**
 * MySQL数据库连接池配置
 * 支持连接真实MySQL数据库
 */

const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'aigc_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// 创建连接池
let pool = null;

const createPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    console.log('MySQL连接池已创建');
  }
  return pool;
};

// 获取连接池
const getPool = () => {
  if (!pool) {
    createPool();
  }
  return pool;
};

// 执行SQL查询（Promise封装）
const query = async (sql, params = []) => {
  const connection = await getPool().getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
};

// 执行带事务的查询
const transaction = async (callback) => {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// 测试连接
const testConnection = async () => {
  try {
    const connection = await getPool().getConnection();
    await connection.ping();
    connection.release();
    console.log('MySQL数据库连接正常');
    return true;
  } catch (error) {
    console.error('MySQL数据库连接失败:', error.message);
    return false;
  }
};

// 关闭连接池
const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('MySQL连接池已关闭');
  }
};

module.exports = {
  createPool,
  getPool,
  query,
  transaction,
  testConnection,
  closePool
};
