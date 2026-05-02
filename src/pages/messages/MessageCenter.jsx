import { useState, useRef, useEffect } from 'react'
import {
  MessageCircle, Bell, Users, Settings, Search, Send, Phone, Video,
  MoreVertical, CheckCircle, Clock, AlertCircle, FileText, Image,
  Paperclip, Smile, ArrowLeft, Pin, Volume2, VolumeX, PhoneOff
} from 'lucide-react'
import './MessageCenter.css'
// 模拟消息数据
const mockConversations = [
  {
    id: 1,
    type: 'order',
    title: '订单消息',
    icon: '📦',
    unread: 3,
    lastMessage: '您的订单已被创作者接单',
    lastTime: '10:30',
    messages: [
      { id: 1, type: 'system', content: '您发布的需求已被创作者"林导"查看', time: '09:15' },
      { id: 2, type: 'system', content: '创作者"林导"提交了服务方案', time: '09:45' },
      { id: 3, type: 'system', content: '您已选择"林导"作为服务方，订单正式创建', time: '10:00' },
      { id: 4, type: 'system', content: '订单已进入制作阶段', time: '10:30' }
    ]
  },
  {
    id: 2,
    type: 'consult',
    title: '咨询消息',
    icon: '💬',
    unread: 1,
    lastMessage: '请问宣传片制作进度如何了？',
    lastTime: '09:45',
    client: {
      name: '张总',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      company: '某某科技有限公司',
      level: 'vip'
    },
    messages: [
      { id: 1, type: 'other', sender: '张总', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', content: '您好，看了您的作品集很感兴趣', time: '昨天 14:30' },
      { id: 2, type: 'mine', content: '您好，感谢关注！有什么可以帮您的吗？', time: '昨天 14:35' },
      { id: 3, type: 'other', sender: '张总', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', content: '我有一个企业宣传片的需求，想了解一下服务和价格', time: '昨天 14:40' },
      { id: 4, type: 'mine', content: '好的，我们提供多种套餐，从基础版到专业版都有。请问您有什么具体要求吗？', time: '昨天 15:00' },
      { id: 5, type: 'other', sender: '张总', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', content: '我们想要30秒左右的品牌宣传片，突出科技感和国际化', time: '昨天 15:10' },
      { id: 6, type: 'mine', content: '明白了，我这边有几个类似的案例可以发给您参考一下。基础版5800，专业版8800含加急服务。', time: '昨天 15:30' },
      { id: 7, type: 'other', sender: '张总', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', content: '请问宣传片制作进度如何了？', time: '09:45' }
    ]
  },
  {
    id: 3,
    type: 'system',
    title: '系统通知',
    icon: '🔔',
    unread: 2,
    lastMessage: '恭喜您完成了《AI图像生成实战》课程！',
    lastTime: '昨天',
    messages: [
      { id: 1, type: 'system', title: '创作者认证通过', content: '您的创作者认证申请已通过审核，现在可以开始接单了！', time: '2026-04-05 15:20' },
      { id: 2, type: 'system', title: '收益到账提醒', content: '您有一笔 ¥3,500 的收益已到账，请注意查收。', time: '2026-04-05 10:00' },
      { id: 3, type: 'system', title: '课程完成通知', content: '恭喜您完成了《AI图像生成实战》课程的全部学习！', time: '2026-04-06 10:30' }
    ]
  },
  {
    id: 4,
    type: 'project',
    title: '项目协作',
    icon: '🤝',
    unread: 0,
    lastMessage: '王总监已提交了第3版修改稿',
    lastTime: '昨天',
    project: {
      name: '品牌宣传片项目',
      progress: 60,
      deadline: '2026-04-25'
    },
    messages: [
      { id: 1, type: 'system', content: '项目已创建，目标：企业品牌AI宣传片', time: '2026-04-10 10:00' },
      { id: 2, type: 'other', sender: '王总监', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', content: '收到需求了，我先出几个创意方向给您选择', time: '2026-04-10 10:30' },
      { id: 3, type: 'mine', content: '好的，期待您的创意方案！', time: '2026-04-10 10:35' },
      { id: 4, type: 'other', sender: '王总监', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', content: '第一版创意方案已提交，请查看附件', time: '2026-04-11 16:00', attachments: [{ name: '创意方案_v1.pptx', size: '2.3MB' }] },
      { id: 5, type: 'mine', content: '方案B方向我很喜欢，色调和节奏都很棒！', time: '2026-04-11 16:30' },
      { id: 6, type: 'other', sender: '王总监', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', content: '好的，我按照方案B继续细化，3天后出分镜和初剪', time: '2026-04-11 16:45' },
      { id: 7, type: 'system', content: '王总监已提交了第3版修改稿', time: '昨天 18:00' }
    ]
  }
]
const notificationSettings = {
  orderUpdate: { label: '订单状态更新', enabled: true },
  newInquiry: { label: '新咨询消息', enabled: true },
  systemNotice: { label: '系统通知', enabled: true },
  earningsAlert: { label: '收益到账提醒', enabled: true },
  courseUpdate: { label: '课程更新通知', enabled: false },
  promotionInfo: { label: '活动与优惠信息', enabled: false }
}
export default function MessageCenter() {
  const [activeTab, setActiveTab] = useState('conversations')
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [pinnedConversations, setPinnedConversations] = useState([2])
  const messagesEndRef = useRef(null)
  const filteredConversations = mockConversations.filter(conv =>
    conv.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchKeyword.toLowerCase())
  )
  const totalUnread = mockConversations.reduce((sum, c) => sum + c.unread, 0)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedConversation])
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // 发送消息逻辑
      setNewMessage('')
    }
  }
  const togglePin = (convId) => {
    if (pinnedConversations.includes(convId)) {
      setPinnedConversations(pinnedConversations.filter(id => id !== convId))
    } else {
      setPinnedConversations([...pinnedConversations, convId])
    }
  }
  return (
    
      <div className="message-center">
        {/* 左侧会话列表 */}
        <div className="conversations-panel">
          {/* 头部 */}
          <div className="panel-header">
            <h1>消息中心</h1>
            <div className="header-actions">
              <button className="icon-btn" onClick={() => setSoundEnabled(!soundEnabled)}>
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button className="icon-btn" onClick={() => setShowSettings(true)}>
                <Settings size={18} />
              </button>
            </div>
          </div>
          {/* 搜索 */}
          <div className="search-bar">
            <Search size={16} />
            <input
              type="text"
              placeholder="搜索消息..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          {/* 会话列表 */}
          <div className="conversations-list">
            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''} ${pinnedConversations.includes(conv.id) ? 'pinned' : ''}`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="conv-avatar">
                  <span className="avatar-icon">{conv.icon}</span>
                  {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                </div>
                <div className="conv-content">
                  <div className="conv-header">
                    <span className="conv-title">{conv.title}</span>
                    <span className="conv-time">{conv.lastTime}</span>
                  </div>
                  <p className="conv-preview">{conv.lastMessage}</p>
                </div>
                <button className="pin-btn" onClick={(e) => { e.stopPropagation(); togglePin(conv.id) }}>
                  <Pin size={14} className={pinnedConversations.includes(conv.id) ? 'active' : ''} />
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* 右侧消息区域 */}
        <div className="messages-panel">
          {selectedConversation ? (
            <>
              {/* 消息头部 */}
              <div className="message-header">
                <button className="back-btn" onClick={() => setSelectedConversation(null)}>
                  <ArrowLeft size={20} />
                </button>
                <div className="header-info">
                  <h2>{selectedConversation.title}</h2>
                  {selectedConversation.client && (
                    <span className="client-info">{selectedConversation.client.company}</span>
                  )}
                  {selectedConversation.project && (
                    <div className="project-progress">
                      <span>进度 {selectedConversation.project.progress}%</span>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${selectedConversation.project.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="header-actions">
                  {selectedConversation.type === 'consult' && (
                    <>
                      <button className="action-btn"><Phone size={18} /></button>
                      <button className="action-btn"><Video size={18} /></button>
                    </>
                  )}
                  <button className="action-btn"><MoreVertical size={18} /></button>
                </div>
              </div>
              {/* 消息列表 */}
              <div className="messages-list">
                {selectedConversation.messages.map(msg => (
                  <div key={msg.id} className={`message ${msg.type}`}>
                    {msg.type === 'system' ? (
                      <div className="system-message">
                        <Bell size={14} />
                        <div className="system-content">
                          {msg.title && <span className="system-title">{msg.title}</span>}
                          <p>{msg.content}</p>
                        </div>
                        <span className="message-time">{msg.time}</span>
                      </div>
                    ) : msg.type === 'other' ? (
                      <div className="other-message">
                        <img src={msg.avatar} alt={msg.sender} className="message-avatar" />
                        <div className="message-bubble">
                          <span className="sender-name">{msg.sender}</span>
                          <div className="bubble-content">
                            <p>{msg.content}</p>
                            {msg.attachments && (
                              <div className="attachments">
                                {msg.attachments.map((att, i) => (
                                  <div key={i} className="attachment">
                                    <FileText size={16} />
                                    <span>{att.name}</span>
                                    <span className="att-size">{att.size}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="message-time">{msg.time}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mine-message">
                        <div className="message-bubble">
                          <div className="bubble-content">
                            <p>{msg.content}</p>
                          </div>
                          <span className="message-time">{msg.time}</span>
                          <CheckCircle size={14} className="read-status" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              {/* 消息输入 */}
              {selectedConversation.type !== 'system' && (
                <div className="message-input">
                  <button className="attach-btn"><Paperclip size={18} /></button>
                  <button className="attach-btn"><Image size={18} /></button>
                  <input
                    type="text"
                    placeholder="输入消息..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button className="emoji-btn"><Smile size={18} /></button>
                  <button className="send-btn" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-conversation">
              <MessageCircle size={64} />
              <h3>选择会话开始聊天</h3>
              <p>从左侧列表选择一个会话，或开始新的对话</p>
            </div>
          )}
        </div>
        {/* 设置弹窗 */}
        {showSettings && (
          <div className="modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="modal-content settings-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>消息设置</h2>
                <button className="close-btn" onClick={() => setShowSettings(false)}>×</button>
              </div>
              <div className="modal-body">
                <h4>通知设置</h4>
                <div className="settings-list">
                  {Object.entries(notificationSettings).map(([key, setting]) => (
                    <div key={key} className="setting-item">
                      <span>{setting.label}</span>
                      <label className="toggle">
                        <input type="checkbox" checked={setting.enabled} onChange={() => {}} />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    
  )
}
