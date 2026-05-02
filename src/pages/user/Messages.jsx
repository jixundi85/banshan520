import { useState } from 'react'

const conversations = [
  {
    id: 1,
    type: 'system',
    name: '系统通知',
    avatar: '🔔',
    lastMessage: '恭喜您完成了《AI图像生成实战》课程！',
    lastTime: '10:30',
    unread: 1
  },
  {
    id: 2,
    type: 'order',
    name: '订单消息',
    avatar: '📦',
    lastMessage: '您的新订单已被创作者接单',
    lastTime: '09:45',
    unread: 2
  },
  {
    id: 3,
    type: 'user',
    name: '李老师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1',
    lastMessage: '您的作品审核已通过，继续加油！',
    lastTime: '昨天',
    unread: 0
  },
  {
    id: 4,
    type: 'user',
    name: '张客户',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Client1',
    lastMessage: '请问宣传片制作进度如何了？',
    lastTime: '昨天',
    unread: 0
  }
]

const systemMessages = [
  { id: 1, title: '课程完成通知', content: '恭喜您完成了《AI图像生成实战》课程的全部学习！', time: '2026-04-06 10:30' },
  { id: 2, title: '创作者认证通过', content: '您的创作者认证申请已通过审核，现在可以开始接单了！', time: '2026-04-05 15:20' },
  { id: 3, title: '收益到账提醒', content: '您有一笔 ¥3,500 的收益已到账，请注意查收。', time: '2026-04-05 10:00' }
]

const chatMessages = [
  { id: 1, type: 'other', name: '李老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1', content: '你好！看到你提交的作品了，非常棒！', time: '14:30' },
  { id: 2, type: 'mine', content: '谢谢老师！还有很多需要学习的地方', time: '14:31' },
  { id: 3, type: 'other', name: '李老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1', content: '你的色彩运用和构图都很出色，可以尝试更复杂的场景了', time: '14:32' },
  { id: 4, type: 'mine', content: '好的老师！我会继续努力的', time: '14:33' },
  { id: 5, type: 'other', name: '李老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1', content: '您的作品审核已通过，继续加油！', time: '14:35' }
]

export default function Messages() {
  const [activeTab, setActiveTab] = useState('conversations')
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage('')
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">消息中心</h1>
        <p className="text-gray-400">查看和回复您的消息</p>
      </div>

      {/* 标签切换 */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('conversations')}
          className={`pb-3 px-2 font-medium transition-all ${
            activeTab === 'conversations' 
              ? 'text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          对话列表 {totalUnread > 0 && <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{totalUnread}</span>}
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3 px-2 font-medium transition-all ${
            activeTab === 'system' 
              ? 'text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          系统通知
        </button>
      </div>

      {/* 对话列表 */}
      {activeTab === 'conversations' && !selectedConversation && (
        <div className="bg-slate-800/50 rounded-2xl border border-white/5 divide-y divide-white/5">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className="p-4 flex items-center gap-4 hover:bg-white/5 cursor-pointer transition-all"
            >
              <div className="relative">
                {conv.type === 'user' ? (
                  <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
                    {conv.avatar}
                  </div>
                )}
                {conv.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-medium">{conv.name}</h3>
                  <span className="text-sm text-gray-500">{conv.lastTime}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 聊天详情 */}
      {selectedConversation && (
        <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden">
          {/* 聊天头部 */}
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-4">
            <button 
              onClick={() => setSelectedConversation(null)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              ←
            </button>
            {selectedConversation.type === 'user' ? (
              <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl">
                {selectedConversation.avatar}
              </div>
            )}
            <div>
              <h3 className="text-white font-medium">{selectedConversation.name}</h3>
              <p className="text-xs text-gray-400">在线</p>
            </div>
          </div>

          {/* 消息列表 */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.type === 'mine' ? 'flex-row-reverse' : ''}`}>
                {msg.type !== 'mine' && (
                  <img src={msg.avatar} alt={msg.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                )}
                <div className={`max-w-[70%] ${msg.type === 'mine' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl ${
                    msg.type === 'mine' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-md' 
                      : 'bg-white/10 text-white rounded-bl-md'
                  }`}>
                    {msg.content}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 输入框 */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="输入消息..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 系统通知 */}
      {activeTab === 'system' && (
        <div className="space-y-4">
          {systemMessages.map(msg => (
            <div key={msg.id} className="bg-slate-800/50 rounded-2xl border border-white/5 p-5 hover:border-purple-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span>📢</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{msg.title}</h3>
                    <p className="text-xs text-gray-500">{msg.time}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-400">{msg.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
