import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

// 初始化数据库
import './db.js'
import aiRouter from './routes/ai.js'
import demandRouter from './routes/demand.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors({
  origin: '*',  // 允许所有来源
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// API 路由
app.use('/api/ai', aiRouter)
app.use('/api/demands', demandRouter)

// 前端静态文件服务（dist目录）
const distPath = join(__dirname, '..', 'dist')
app.use(express.static(distPath))

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// 测试接口
app.post('/api/test/chat', async (req, res) => {
  const { message } = req.body
  res.json({ 
    reply: `收到您的消息: "${message}"\n\n这是测试回复，实际对话请使用 /api/ai/chat`,
    session_id: 'test-session',
    source: 'test'
  })
})

// SPA 路由兜底 - 所有未匹配的路由返回index.html
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'))
})

// 启动服务
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🤖 半山AIX 后端服务                                 ║
║                                                       ║
║   服务地址: http://localhost:${PORT}                     ║
║                                                       ║
║   API 接口:                                           ║
║   ────────────────────────                            ║
║   AI对话:                                             ║
║   - POST /api/ai/chat        对话                    ║
║   - GET  /api/ai/suggestions 建议问题                ║
║   - GET  /api/ai/settings     获取设置                ║
║   - GET  /api/ai/knowledge   知识库列表               ║
║   - POST /api/ai/knowledge   添加知识                ║
║                                                       ║
║   需求广场:                                           ║
║   - GET  /api/demands        需求列表                ║
║   - GET  /api/demands/:id    需求详情                ║
║   - POST /api/demands        发布需求                ║
║   - PUT  /api/demands/:id    更新需求                ║
║   - DELETE /api/demands/:id  删除需求                ║
║   - POST /api/demands/:id/bid 投标                  ║
║                                                       ║
║   健康检查: http://localhost:${PORT}/api/health         ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `)
})
