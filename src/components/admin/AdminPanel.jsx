import { useState, useEffect } from 'react'
import { Bot, Database, Layout, MessageSquare, Save, Plus, Trash2, Search, X, Check, AlertCircle, RefreshCw, Eye, Upload, Download, Sparkles } from 'lucide-react'

const API_BASE = '/api'

export default function AIAssistantAdmin() {
  const [activeTab, setActiveTab] = useState('knowledge')
  const [settings, setSettings] = useState(null)
  const [knowledge, setKnowledge] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importText, setImportText] = useState('')
  const [newKnowledge, setNewKnowledge] = useState({ title: '', content: '', category: '通用' })
  const [totalTokens, setTotalTokens] = useState(0)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [settingsRes, knowledgeRes] = await Promise.all([
        fetch(`${API_BASE}/api/ai/settings`),
        fetch(`${API_BASE}/api/ai/knowledge`)
      ])
      const settingsData = await settingsRes.json()
      const knowledgeData = await knowledgeRes.json()
      
      setSettings(settingsData)
      setKnowledge(knowledgeData.items || [])
      setCategories([...new Set((knowledgeData.items || []).map(k => k.category))])
      setTotalTokens((knowledgeData.items || []).reduce((sum, k) => sum + (k.token_count || 0), 0))
    } catch (err) { showMessage('加载数据失败', 'error') }
    setLoading(false)
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/api/ai/settings`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings)
      })
      res.ok ? showMessage('设置保存成功！') : showMessage('保存失败', 'error')
    } catch { showMessage('保存失败', 'error') }
    setSaving(false)
  }

  const addKnowledge = async () => {
    if (!newKnowledge.title || !newKnowledge.content) {
      showMessage('标题和内容不能为空', 'error')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/ai/knowledge`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newKnowledge)
      })
      if (res.ok) {
        showMessage('添加成功')
        setShowAddModal(false)
        setNewKnowledge({ title: '', content: '', category: '通用' })
        loadData()
      }
    } catch { showMessage('添加失败', 'error') }
  }

  const deleteKnowledge = async (id) => {
    if (!confirm('确定删除这条知识？')) return
    try {
      const res = await fetch(`${API_BASE}/api/ai/knowledge/${id}`, { method: 'DELETE' })
      if (res.ok) { showMessage('删除成功'); loadData() }
    } catch { showMessage('删除失败', 'error') }
  }

  const handleImport = async () => {
    if (!importText.trim()) {
      showMessage('请输入导入内容', 'error')
      return
    }
    try {
      // 解析百问百答格式 Q1...A1...
      const items = []
      const lines = importText.split('\n')
      let currentQ = null
      let currentA = ''
      
      for (const line of lines) {
        const qMatch = line.match(/^Q\d+[\.\s]*(.+)$/i)
        const aMatch = line.match(/^A\d+[\.\s]*(.+)$/i)
        
        if (qMatch) {
          if (currentQ) {
            items.push({ question: currentQ, answer: currentA.trim(), category: '批量导入' })
          }
          currentQ = qMatch[1]
          currentA = ''
        } else if (aMatch) {
          currentA += aMatch[1] + '\n'
        } else if (currentQ && line.trim()) {
          currentA += line + '\n'
        }
      }
      if (currentQ) {
        items.push({ question: currentQ, answer: currentA.trim(), category: '批量导入' })
      }

      const res = await fetch(`${API_BASE}/api/ai/knowledge/import-qa`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items })
      })
      if (res.ok) {
        showMessage(`成功导入 ${items.length} 条知识`)
        setShowImportModal(false)
        setImportText('')
        loadData()
      }
    } catch { showMessage('导入失败', 'error') }
  }

  const updateSetting = (key, value) => setSettings(prev => ({ ...prev, [key]: value }))
  
  const updateTopic = (index, field, value) => {
    const topics = JSON.parse(settings.hot_topics || '[]')
    topics[index] = { ...topics[index], [field]: value }
    updateSetting('hot_topics', JSON.stringify(topics))
  }

  const addTopic = () => {
    const topics = JSON.parse(settings.hot_topics || '[]')
    if (topics.length < 4) {
      topics.push({ icon: '💡', title: '新话题', subtitle: '副标题' })
      updateSetting('hot_topics', JSON.stringify(topics))
    }
  }

  const removeTopic = (index) => {
    const topics = JSON.parse(settings.hot_topics || '[]')
    topics.splice(index, 1)
    updateSetting('hot_topics', JSON.stringify(topics))
  }

  const filteredKnowledge = knowledge.filter(k => {
    const matchSearch = !searchTerm || k.title.toLowerCase().includes(searchTerm.toLowerCase()) || k.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = !categoryFilter || k.category === categoryFilter
    return matchSearch && matchCat
  })

  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = knowledge.filter(k => k.category === cat).length
    return acc
  }, {})

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center"><RefreshCw className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-4" /><p className="text-slate-500">加载中...</p></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200">
      {/* 顶部导航 */}
      <div className="border-b border-slate-800/50 bg-[#0f0f15] sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">AI 知识库管理</h1>
                <p className="text-xs text-slate-500">管理「半山灵图」的智能知识库，支持导入百问百答</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-slate-800/50 rounded-lg text-sm">
                <span className="text-slate-500">知识条目：</span>
                <span className="text-violet-400 font-medium">{knowledge.length}</span>
                <span className="text-slate-500 ml-4">Token：</span>
                <span className="text-cyan-400 font-medium">{(totalTokens / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 ${message.type === 'error' ? 'bg-red-500/90' : 'bg-green-500/90'} text-white`}>
          {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="px-6 py-6">
        {/* Tab 切换 */}
        <div className="flex gap-1 mb-6 border-b border-slate-800/50">
          {[
            { id: 'knowledge', label: '知识条目' },
            { id: 'import', label: '批量导入' },
            { id: 'widget', label: '悬浮组件设置' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id 
                  ? 'text-violet-400' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500" />
              )}
            </button>
          ))}
        </div>

        {/* 知识条目 Tab */}
        {activeTab === 'knowledge' && (
          <div className="space-y-4">
            {/* 分类筛选 */}
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setCategoryFilter('')}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  !categoryFilter 
                    ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' 
                    : 'border-slate-700 text-slate-500 hover:border-slate-600'
                }`}
              >
                全部 ({knowledge.length})
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    categoryFilter === cat 
                      ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' 
                      : 'border-slate-700 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  {cat}：{categoryCounts[cat]}
                </button>
              ))}
            </div>

            {/* 添加新知识 */}
            <div className="bg-[#0f0f15] border border-slate-800/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-violet-400 mb-3">添加新知识条目</h3>
              <div className="flex gap-3 mb-3">
                <input 
                  type="text" 
                  value={newKnowledge.title}
                  onChange={e => setNewKnowledge({...newKnowledge, title: e.target.value})}
                  placeholder="标题（如：超级个体OPC是什么）"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50"
                />
                <select 
                  value={newKnowledge.category}
                  onChange={e => setNewKnowledge({...newKnowledge, category: e.target.value})}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50"
                >
                  <option value="通用">通用</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button 
                  onClick={addKnowledge}
                  className="px-5 py-2.5 bg-violet-500 hover:bg-violet-600 rounded-lg text-sm font-medium transition-colors"
                >
                  添加
                </button>
              </div>
              <textarea 
                value={newKnowledge.content}
                onChange={e => setNewKnowledge({...newKnowledge, content: e.target.value})}
                placeholder="输入详细知识内容（不限字数）..."
                rows={4}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 resize-none"
              />
            </div>

            {/* 知识列表 */}
            <div className="space-y-2">
              {filteredKnowledge.map(item => (
                <div key={item.id} className="bg-[#0f0f15] border border-slate-800/50 rounded-xl p-4 group hover:border-slate-700 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-xs rounded-full border border-violet-500/20">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="font-medium text-slate-200 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2">{item.content}</p>
                    </div>
                    <button 
                      onClick={() => deleteKnowledge(item.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 批量导入 Tab */}
        {activeTab === 'import' && (
          <div className="bg-[#0f0f15] border border-slate-800/50 rounded-xl p-6">
            <h3 className="text-sm font-medium text-violet-400 mb-2">批量导入百问百答</h3>
            <p className="text-xs text-slate-500 mb-4">直接粘贴完整百问百答内容，系统将按"Q数字"分隔自动解析成独立知识条目。</p>
            <textarea 
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="粘贴百问百答全文内容..."
              rows={15}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 resize-none font-mono"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-slate-500">当前字数：{importText.length} 字</span>
              <button 
                onClick={handleImport}
                className="px-6 py-2.5 bg-violet-500 hover:bg-violet-600 rounded-lg text-sm font-medium transition-colors"
              >
                开始导入
              </button>
            </div>
          </div>
        )}

        {/* 悬浮组件设置 Tab */}
        {activeTab === 'widget' && settings && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧设置 */}
            <div className="space-y-4">
              {/* 基础设置 */}
              <div className="bg-[#0f0f15] border border-slate-800/50 rounded-xl p-5">
                <h3 className="text-sm font-medium text-violet-400 mb-4 flex items-center gap-2">
                  <Layout className="w-4 h-4" />基础设置
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">悬浮名称</label>
                    <input 
                      type="text" 
                      value={settings.widget_name || '半山灵图'}
                      onChange={e => updateSetting('widget_name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">悬浮位置</label>
                    <div className="flex gap-2">
                      {['right', 'left'].map(pos => (
                        <button
                          key={pos}
                          onClick={() => updateSetting('position', pos)}
                          className={`flex-1 py-2.5 rounded-lg text-sm border transition-colors ${
                            settings.position === pos 
                              ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' 
                              : 'border-slate-800 text-slate-500 hover:border-slate-700'
                          }`}
                        >
                          {pos === 'right' ? '右侧' : '左侧'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">距底部距离 (px)</label>
                    <input 
                      type="number" 
                      value={settings.bottom_offset || 80}
                      onChange={e => updateSetting('bottom_offset', parseInt(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">欢迎语</label>
                    <textarea 
                      value={settings.greeting || ''}
                      onChange={e => updateSetting('greeting', e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 resize-none"
                    />
                  </div>
                  
                  {/* 显示/隐藏开关 */}
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                    <div>
                      <h4 className="font-medium text-slate-200">前台显示悬浮按钮</h4>
                      <p className="text-xs text-slate-500">关闭后前台不显示智能客服入口</p>
                    </div>
                    <button
                      onClick={() => updateSetting('enabled', settings.enabled ? 0 : 1)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${settings.enabled ? 'bg-gradient-to-r from-violet-500 to-cyan-500' : 'bg-slate-700'}`}
                    >
                      <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${settings.enabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={saveSettings}
                    disabled={saving}
                    className="w-full py-2.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? '保存中...' : '保存设置'}
                  </button>
                </div>
              </div>

              {/* 热门话题卡片 */}
              <div className="bg-[#0f0f15] border border-slate-800/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-violet-400">热门话题卡片（2-4个）</h3>
                  {(() => {
                    const topics = JSON.parse(settings.hot_topics || '[]')
                    return topics.length < 4 && (
                      <button onClick={addTopic} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                        <Plus className="w-3 h-3" />添加
                      </button>
                    )
                  })()}
                </div>
                <p className="text-xs text-slate-500 mb-4">对话窗口顶部显示的热门话题卡片，帮助用户快速了解网站核心价值，促成交易合作。</p>
                <div className="space-y-3">
                  {(() => {
                    const topics = JSON.parse(settings.hot_topics || '[]')
                    return topics.map((topic, index) => (
                      <div key={index} className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              const icon = prompt('输入emoji图标:', topic.icon)
                              if (icon) updateTopic(index, 'icon', icon)
                            }}
                            className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl hover:bg-slate-700 transition-colors"
                          >
                            {topic.icon}
                          </button>
                          <input 
                            type="text" 
                            value={topic.title}
                            onChange={e => updateTopic(index, 'title', e.target.value)}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50"
                            placeholder="话题标题"
                          />
                          <button 
                            onClick={() => removeTopic(index)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input 
                          type="text" 
                          value={topic.subtitle}
                          onChange={e => updateTopic(index, 'subtitle', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50"
                          placeholder="副标题"
                        />
                      </div>
                    ))
                  })()}
                </div>
                <button 
                  onClick={saveSettings}
                  disabled={saving}
                  className="w-full mt-4 py-2.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
                >
                  保存话题
                </button>
              </div>
            </div>

            {/* 右侧预览 */}
            <div className="space-y-4">
              <div className="bg-[#0f0f15] border border-slate-800/50 rounded-xl p-5">
                <h3 className="text-sm font-medium text-violet-400 mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4" />效果预览
                </h3>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50">
                  {/* 预览窗口 */}
                  <div className="bg-[#0a0a0f] rounded-xl overflow-hidden border border-slate-800">
                    {/* 头部 */}
                    <div className="bg-gradient-to-r from-violet-500/20 to-cyan-500/20 px-4 py-3 border-b border-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">{settings.widget_name}</p>
                          <p className="text-xs text-slate-500">半山碳硅共生研究院</p>
                        </div>
                      </div>
                    </div>
                    {/* 热门话题 */}
                    {(() => {
                      const topics = JSON.parse(settings.hot_topics || '[]')
                      return topics.length > 0 && (
                        <div className="p-3 border-b border-slate-800/50">
                          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />热门话题
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {topics.map((topic, i) => (
                              <div key={i} className="bg-slate-800/50 rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{topic.icon}</span>
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-200 truncate">{topic.title}</p>
                                    <p className="text-xs text-slate-500 truncate">{topic.subtitle}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })()}
                    {/* 欢迎语 */}
                    <div className="p-3">
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="bg-slate-800/50 rounded-lg px-3 py-2">
                          <p className="text-xs text-slate-300">{settings.greeting}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
