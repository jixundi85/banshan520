import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, User, Sparkles, ChevronDown, ChevronUp, RotateCcw, Zap } from 'lucide-react'

// 半山灵图 - 智能员工 (Powered by Groq LLM + RAG)
const API_BASE = ''  // 同源，使用相对路径

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [settings, setSettings] = useState({
    widget_name: '半山灵图',
    position: 'right',
    bottom_offset: 20,
    widget_size: 'medium',
    greeting: '你好！我是半山灵图，有什么可以帮你的吗？',
    suggestions: [],
    topics: [
      { icon: '🏛️', title: '了解半山', subtitle: '研究院理念与使命' },
      { icon: '💼', title: 'OPC项目', subtitle: '超级个体商业计划' },
      { icon: '💰', title: '政策补贴', subtitle: '马来AI转型扶持' },
      { icon: '🤝', title: '商务合作', subtitle: '共建碳硅生态' }
    ],
    enabled: true
  })
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // 加载后端设置
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ai/settings`)
      const data = await res.json()
      setSettings(prev => ({
        ...prev,
        ...data,
        // 强制转换 enabled 为布尔值
        enabled: data.enabled === true || data.enabled === 'true' || data.enabled === 1 || data.enabled === '1',
        // 兼容新旧格式 - hot_topics可能是字符串或数组
        topics: (() => {
          try {
            if (Array.isArray(data.hot_topics)) return data.hot_topics
            if (typeof data.hot_topics === 'string') return JSON.parse(data.hot_topics)
            return prev.topics
          } catch { return prev.topics }
        })(),
        suggestions: (() => {
          try {
            if (Array.isArray(data.welcome_suggestions)) return data.welcome_suggestions
            if (typeof data.welcome_suggestions === 'string') return JSON.parse(data.welcome_suggestions)
            return prev.suggestions
          } catch { return prev.suggestions }
        })()
      }))
      setMessages([{
        id: 1,
        role: 'assistant',
        content: data.greeting || '你好！我是半山灵图，有什么可以帮你的吗？',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }])
    } catch (err) {
      setMessages([{
        id: 1,
        role: 'assistant',
        content: '你好！我是半山灵图，有什么可以帮你的吗？',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }])
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 如果 enabled 为 false，不渲染组件
  if (settings.enabled === false || settings.enabled === 'false' || settings.enabled === 0 || settings.enabled === '0') {
    return null
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  // 调用后端 AI 对话接口
  const callAI = async (userMessage) => {
    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, session_id: sessionId })
      })
      if (!response.ok) throw new Error(`请求失败: ${response.status}`)
      const data = await response.json()
      if (data.session_id && !sessionId) setSessionId(data.session_id)
      return { reply: data.reply, source: data.source, references: data.references }
    } catch (err) {
      console.error('AI 调用失败:', err)
      throw err
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return
    const userMessage = inputValue.trim()
    const userMsgObj = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMsgObj])
    setInputValue('')
    setIsTyping(true)

    try {
      const result = await callAI(userMessage)
      const assistantMsgObj = {
        id: Date.now() + 1,
        role: 'assistant',
        content: result.reply,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, assistantMsgObj])
    } catch (err) {
      const errorMsgObj = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '抱歉，服务暂时不可用，请稍后再试。你也可以直接联系客服：contact@banshan520.com',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMsgObj])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    setMessages([{
      id: 1,
      role: 'assistant',
      content: settings.greeting || '对话已清空！我是半山灵图，有什么可以帮你的吗？',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }])
    setSessionId(null)
  }

  const handleTopicClick = (topicText) => {
    setInputValue(topicText)
    inputRef.current?.focus()
  }

  // 图标大小样式
  const sizeStyles = {
    small: { button: 'text-sm px-3 py-2', icon: 'w-6 h-6' },
    medium: { button: 'text-base px-4 py-3', icon: 'w-8 h-8' },
    large: { button: 'text-lg px-5 py-4', icon: 'w-10 h-10' }
  }
  const currentSize = sizeStyles[settings.widget_size] || sizeStyles.medium

  // 窗口大小样式
  const windowSizes = {
    small: 'w-80 h-[400px]',
    medium: 'w-96 h-[520px]',
    large: 'w-[450px] h-[600px]'
  }
  const currentWindowSize = windowSizes[settings.widget_size] || windowSizes.medium

  // 热门话题
  const hotTopics = settings.topics || []

  // 位置样式
  const positionClass = settings.position === 'left' ? 'left-6' : 'right-6'

  if (settings.enabled === false) return null

  // 位置样式
  const positionStyle = {
    position: 'fixed',
    [settings.position === 'left' ? 'left' : 'right']: '24px',
    bottom: `${settings.bottom_offset || 24}px`,
    zIndex: 50
  }

  if (!isOpen) {
    return (
      <div style={positionStyle}>
        <button
          onClick={() => setIsOpen(true)}
          className={`group flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white ${currentSize.button} rounded-full shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105`}
        >
          <div className={`${currentSize.icon} bg-white/20 rounded-full flex items-center justify-center`}>
            <Bot className={settings.widget_size === 'small' ? 'w-4 h-4' : 'w-5 h-5'} />
          </div>
          <span className="font-medium">{settings.widget_name}</span>
          <Sparkles className="w-4 h-4 animate-pulse" />
        </button>
      </div>
    )
  }

  return (
    <div style={positionStyle}>
      <div className={`bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col ${isMinimized ? 'w-72 h-14' : currentWindowSize}`}>
        {/* 头部 */}
        <div className="bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`${currentSize.icon} bg-white/20 rounded-full flex items-center justify-center flex-shrink-0`}>
              <Bot className={settings.widget_size === 'small' ? 'w-4 h-4' : 'w-5 h-5'} text-white />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">{settings.widget_name}</h3>
              <p className="text-white/70 text-xs truncate">智能助手 · Powered by Groq</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleClear} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="清空对话">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* 热门话题卡片 - 首次打开时显示 */}
            {messages.length === 1 && hotTopics.length > 0 && (
              <div className="px-4 py-3 bg-slate-800/50 border-b border-white/5">
                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" />热门话题</p>
                <div className="grid grid-cols-2 gap-2">
                  {hotTopics.slice(0, 4).map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => handleTopicClick(topic.title)}
                      className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 rounded-xl px-3 py-2.5 transition-colors"
                    >
                      <span className="text-xl">{topic.icon}</span>
                      <div className="text-left min-w-0">
                        <p className="text-xs font-medium text-slate-200 truncate">{topic.title}</p>
                        <p className="text-xs text-slate-500 truncate">{topic.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900 min-h-0">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'assistant' ? 'bg-gradient-to-br from-violet-500 to-cyan-500' : 'bg-slate-700'}`}>
                    {message.role === 'assistant' ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[75%] ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${message.role === 'assistant' ? 'bg-slate-800 text-gray-200 rounded-tl-none border border-white/5' : 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-tr-none'}`}>
                      {message.content}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-800 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="p-4 bg-slate-800 border-t border-white/5">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入问题，半山灵图为你解答..."
                  className="flex-1 bg-slate-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
