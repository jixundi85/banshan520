import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function ChatRoom() {
  const navigate = useNavigate()
  const location = useLocation()
  const messagesEndRef = useRef(null)
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  // 模拟聊天数据
  const chatInfo = location.state?.chat || {
    id: 1,
    name: '李老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1',
    type: 'course',
    title: 'AI 图像生成实战'
  }

  const [messages, setMessages] = useState([
    { id: 1, type: 'other', name: chatInfo.name, avatar: chatInfo.avatar, content: '你好！看到你对AI课程感兴趣，有什么问题吗？', time: '10:00' },
    { id: 2, type: 'mine', content: '老师你好！我想问一下这门课程适合零基础学习吗？', time: '10:01' },
    { id: 3, type: 'other', name: chatInfo.name, avatar: chatInfo.avatar, content: '当然适合！我们的课程从最基础的内容开始讲解，逐步深入。即使你是完全的初学者，也能跟上学习节奏。', time: '10:02' },
    { id: 4, type: 'mine', content: '太好了！那学完之后能达到什么水平？', time: '10:03' },
    { id: 5, type: 'other', name: chatInfo.name, avatar: chatInfo.avatar, content: '学完之后，你可以独立完成商业级别的AI绘画作品，具备接单赚钱的能力。我们很多学员都已经开始接单了！', time: '10:04' }
  ])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now(),
          type: 'mine',
          content: message,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        }
      ])
      setMessage('')
      
      // 模拟对方回复
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            type: 'other',
            name: chatInfo.name,
            avatar: chatInfo.avatar,
            content: '收到你的消息了，我会尽快回复你～',
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          }
        ])
      }, 1500)
    }
  }

  const quickReplies = [
    '课程多少钱？',
    '有试听课吗？',
    '怎么报名？',
    '学完能接单吗？'
  ]

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center px-4 h-14">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-400 hover:text-white"
          >
            ←
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <img src={chatInfo.avatar} alt={chatInfo.name} className="w-8 h-8 rounded-full" />
            <div>
              <p className="font-semibold text-white">{chatInfo.name}</p>
              <p className="text-xs text-gray-400">在线</p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-white">
            ⋮
          </button>
        </div>
      </header>

      {/* 聊天背景 */}
      <div className="flex-1 overflow-y-auto p-4 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]">
        {/* 日期分隔 */}
        <div className="flex justify-center mb-4">
          <span className="px-3 py-1 bg-white/10 text-gray-400 text-xs rounded-full">
            今天 {new Date().toLocaleDateString('zh-CN')}
          </span>
        </div>

        {/* 消息列表 */}
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`flex gap-3 mb-4 ${msg.type === 'mine' ? 'flex-row-reverse' : ''}`}
          >
            {msg.type !== 'mine' && (
              <img src={msg.avatar} alt={msg.name} className="w-10 h-10 rounded-full flex-shrink-0" />
            )}
            <div className={`max-w-[75%] ${msg.type === 'mine' ? 'text-right' : ''}`}>
              {msg.type !== 'mine' && (
                <p className="text-xs text-gray-500 mb-1">{msg.name}</p>
              )}
              <div className={`inline-block px-4 py-3 rounded-2xl ${
                msg.type === 'mine' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-md' 
                  : 'bg-white/10 text-white rounded-bl-md'
              }`}>
                <p className="text-left whitespace-pre-wrap">{msg.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 快捷回复 */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-slate-800/50">
        {quickReplies.map(reply => (
          <button
            key={reply}
            onClick={() => setMessage(reply)}
            className="flex-shrink-0 px-3 py-1.5 bg-white/10 text-gray-300 text-sm rounded-full hover:bg-white/20 transition-all"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* 输入框 */}
      <div className="p-4 bg-slate-800/95 border-t border-white/5">
        <div className="flex items-end gap-3">
          <div className="flex-1 flex items-end gap-2">
            <button className="p-2 text-gray-400 hover:text-white">
              📷
            </button>
            <button className="p-2 text-gray-400 hover:text-white">
              🖼️
            </button>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="输入消息..."
              rows={1}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}
