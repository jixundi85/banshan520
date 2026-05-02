import express from 'express'
import { randomUUID } from 'crypto'
import { callAI, createSystemPrompt } from '../services/llm.js'
import { searchKnowledge, knowledgeToContext, getSuggestions, getSettings, updateSettings } from '../services/rag.js'
import db from '../db.js'

const router = express.Router()

// 生成会话ID
function getSessionId(existingSessionId) {
  if (existingSessionId && existingSessionId.length > 10) {
    return existingSessionId
  }
  return randomUUID()
}

// 获取对话历史
function getConversationHistory(sessionId, limit = 10) {
  return db.prepare(`
    SELECT role, content FROM ai_conversations 
    WHERE session_id = ? 
    ORDER BY created_at DESC 
    LIMIT ?
  `).all(sessionId, limit).reverse()
}

/**
 * POST /api/ai/chat
 * 对话接口
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, session_id } = req.body

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: '消息不能为空' })
    }

    const sessionId = getSessionId(session_id)

    // 1. 检索知识库
    const knowledgeResults = searchKnowledge(message, 5)
    const context = knowledgeToContext(knowledgeResults)

    // 2. 获取对话历史
    const history = getConversationHistory(sessionId, 6)

    // 3. 构建消息数组
    const systemPrompt = createSystemPrompt(context)
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ]

    // 4. 调用大模型
    console.log(`[Chat] Session: ${sessionId}, Query: ${message.substring(0, 50)}...`)
    const reply = await callAI(messages)

    // 5. 保存对话历史
    const saveConversation = db.transaction(() => {
      db.prepare('INSERT INTO ai_conversations (session_id, role, content) VALUES (?, ?, ?)')
        .run(sessionId, 'user', message)
      db.prepare('INSERT INTO ai_conversations (session_id, role, content) VALUES (?, ?, ?)')
        .run(sessionId, 'assistant', reply)
    })
    saveConversation()

    // 6. 记录来源
    const source = knowledgeResults.length > 0 ? 'knowledge' : 'general'

    res.json({
      reply,
      session_id: sessionId,
      source,
      references: knowledgeResults.map(k => ({
        title: k.title,
        content: k.content.substring(0, 100) + '...'
      }))
    })

  } catch (error) {
    console.error('[Chat Error]', error.message)
    res.status(500).json({ 
      error: '服务暂时不可用，请稍后再试',
      details: error.message 
    })
  }
})

/**
 * GET /api/ai/suggestions
 * 获取建议问题
 */
router.get('/suggestions', (req, res) => {
  try {
    const suggestions = getSuggestions()
    res.json(suggestions)
  } catch (error) {
    console.error('[Suggestions Error]', error.message)
    res.status(500).json({ error: '获取建议失败' })
  }
})

/**
 * GET /api/ai/settings
 * 获取客服设置
 */
router.get('/settings', (req, res) => {
  try {
    const settings = getSettings()
    res.json(settings)
  } catch (error) {
    console.error('[Settings Error]', error.message)
    res.status(500).json({ error: '获取设置失败' })
  }
})

/**
 * PUT /api/ai/settings
 * 更新客服设置
 */
router.put('/settings', (req, res) => {
  try {
    const success = updateSettings(req.body)
    if (success) {
      res.json({ success: true, settings: getSettings() })
    } else {
      res.status(400).json({ error: '更新失败' })
    }
  } catch (error) {
    console.error('[Settings Update Error]', error.message)
    res.status(500).json({ error: '更新设置失败' })
  }
})

/**
 * GET /api/ai/knowledge
 * 获取知识库列表
 */
router.get('/knowledge', (req, res) => {
  try {
    const { category, status, page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit

    let sql = 'SELECT * FROM ai_knowledge WHERE 1=1'
    const params = []

    if (category) {
      sql += ' AND category = ?'
      params.push(category)
    }
    if (status) {
      sql += ' AND status = ?'
      params.push(status)
    }

    sql += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const items = db.prepare(sql).all(...params)
    const total = db.prepare('SELECT COUNT(*) as cnt FROM ai_knowledge').get()

    res.json({
      items,
      total: total.cnt,
      page: parseInt(page),
      limit: parseInt(limit)
    })
  } catch (error) {
    console.error('[Knowledge List Error]', error.message)
    res.status(500).json({ error: '获取知识库失败' })
  }
})

/**
 * POST /api/ai/knowledge
 * 添加知识
 */
router.post('/knowledge', (req, res) => {
  try {
    const { title, content, category, source } = req.body

    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容不能为空' })
    }

    const result = db.prepare(`
      INSERT INTO ai_knowledge (title, content, category, source)
      VALUES (?, ?, ?, ?)
    `).run(title, content, category || '通用', source || '手动添加')

    res.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    console.error('[Knowledge Add Error]', error.message)
    res.status(500).json({ error: '添加知识失败' })
  }
})

/**
 * PUT /api/ai/knowledge/:id
 * 更新知识
 */
router.put('/knowledge/:id', (req, res) => {
  try {
    const { id } = req.params
    const { title, content, category, source, status } = req.body

    const fields = []
    const values = []

    if (title) { fields.push('title = ?'); values.push(title) }
    if (content) { fields.push('content = ?'); values.push(content) }
    if (category) { fields.push('category = ?'); values.push(category) }
    if (source) { fields.push('source = ?'); values.push(source) }
    if (status) { fields.push('status = ?'); values.push(status) }

    if (fields.length === 0) {
      return res.status(400).json({ error: '没有要更新的字段' })
    }

    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    const result = db.prepare(`UPDATE ai_knowledge SET ${fields.join(', ')} WHERE id = ?`).run(...values)

    if (result.changes > 0) {
      res.json({ success: true })
    } else {
      res.status(404).json({ error: '知识不存在' })
    }
  } catch (error) {
    console.error('[Knowledge Update Error]', error.message)
    res.status(500).json({ error: '更新知识失败' })
  }
})

/**
 * DELETE /api/ai/knowledge/:id
 * 删除知识
 */
router.delete('/knowledge/:id', (req, res) => {
  try {
    const { id } = req.params
    const result = db.prepare('DELETE FROM ai_knowledge WHERE id = ?').run(id)

    if (result.changes > 0) {
      res.json({ success: true })
    } else {
      res.status(404).json({ error: '知识不存在' })
    }
  } catch (error) {
    console.error('[Knowledge Delete Error]', error.message)
    res.status(500).json({ error: '删除知识失败' })
  }
})

/**
 * POST /api/ai/knowledge/import-qa
 * 批量导入问答
 */
router.post('/knowledge/import-qa', (req, res) => {
  try {
    const { items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: '请提供有效的问答数据' })
    }

    const insert = db.prepare(`
      INSERT INTO ai_knowledge (title, content, category, source)
      VALUES (?, ?, ?, ?)
    `)

    const importData = db.transaction(() => {
      let success = 0
      for (const item of items) {
        if (item.title && item.content) {
          insert.run(item.title, item.content, item.category || '导入', item.source || '批量导入')
          success++
        }
      }
      return success
    })

    const count = importData()
    res.json({ success: true, count })
  } catch (error) {
    console.error('[Knowledge Import Error]', error.message)
    res.status(500).json({ error: '导入失败' })
  }
})

/**
 * POST /api/ai/knowledge/import-qa-text
 * 批量导入百问百答文本（按"Q数字"分隔）
 */
router.post('/knowledge/import-qa-text', (req, res) => {
  try {
    const { text } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({ error: '请提供要导入的文本内容' })
    }

    // 按 "Q数字" 或 "Q:数字" 分隔
    const pattern = /Q\s*[.:：]?\s*(\d+)[.：:]\s*([\s\S]*?)(?=Q\s*[.:：]?\s*(?:\d+)|$)/gi
    const matches = [...text.matchAll(pattern)]

    const insert = db.prepare(`
      INSERT INTO ai_knowledge (title, content, category, source)
      VALUES (?, ?, ?, ?)
    `)

    const importData = db.transaction(() => {
      let success = 0
      for (const match of matches) {
        const q = match[1]?.trim()
        const a = match[2]?.trim()
        if (q && a && a.length > 5) {
          insert.run(`Q${q}`, a, '百问百答', '批量导入')
          success++
        }
      }
      return success
    })

    const count = importData()
    res.json({ success: true, count })
  } catch (error) {
    console.error('[Knowledge Import Text Error]', error.message)
    res.status(500).json({ error: '导入失败' })
  }
})

/**
 * DELETE /api/ai/conversations/:sessionId
 * 清除会话历史
 */
router.delete('/conversations/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params
    const result = db.prepare('DELETE FROM ai_conversations WHERE session_id = ?').run(sessionId)
    res.json({ success: true, deleted: result.changes })
  } catch (error) {
    console.error('[Conversation Delete Error]', error.message)
    res.status(500).json({ error: '清除会话失败' })
  }
})

/**
 * GET /api/ai/conversations
 * 获取所有对话记录
 */
router.get('/conversations', (req, res) => {
  try {
    const items = db.prepare(`
      SELECT * FROM ai_conversations
      ORDER BY created_at DESC
      LIMIT 200
    `).all()
    res.json({ items })
  } catch (error) {
    console.error('[Conversations List Error]', error.message)
    res.status(500).json({ error: '获取对话记录失败' })
  }
})

export default router
