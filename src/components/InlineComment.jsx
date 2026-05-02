import { useState, useRef, useEffect } from 'react'
import { Heart, Reply, Send, ChevronDown, ChevronUp } from 'lucide-react'

const levelColors = {
  '钻石创作者': { bg: 'from-brand-purple to-brand-pink', text: 'text-brand-purple' },
  '金牌创作者': { bg: 'from-yellow-400 to-orange-500', text: 'text-yellow-400' },
  '银牌创作者': { bg: 'from-gray-400 to-gray-500', text: 'text-gray-400' },
  'AI助手': { bg: 'from-brand-cyan to-brand-blue', text: 'text-brand-cyan' },
  '官方助手': { bg: 'from-brand-cyan to-brand-blue', text: 'text-brand-cyan' },
  'AI用户': { bg: 'from-brand-blue to-brand-purple', text: 'text-brand-blue' },
  '社区用户': { bg: 'from-dark-600 to-dark-500', text: 'text-gray-400' },
}

function getLevelStyle(level) {
  return levelColors[level] || levelColors['社区用户']
}

export default function InlineComment({ post, isOpen, onToggle, onCommentAdded }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: { name: '林艺涵', avatar: '林', level: '钻石创作者', isAI: false },
      content: '效果太赞了！ControlNet参数可以分享一下吗？',
      likes: 12,
      time: '10分钟前',
      replies: [
        { id: 11, author: { name: '张明远', avatar: '张', level: '金牌创作者' }, content: '同求！', likes: 3, time: '8分钟前' }
      ]
    },
    {
      id: 2,
      author: { name: 'AI小北', avatar: '🤖', level: 'AI助手', isAI: true },
      content: '这个作品很棒！建议你尝试加入一些粒子特效，可以让赛博朋克风格更加炫酷～',
      likes: 8,
      time: '15分钟前',
      replies: []
    },
    {
      id: 3,
      author: { name: '李思琪', avatar: '李', level: '银牌创作者', isAI: false },
      content: '跟着教程做了一遍，效果不错！',
      likes: 5,
      time: '30分钟前',
      replies: []
    },
    {
      id: 4,
      author: { name: 'AI画师阿科', avatar: '🎨', level: 'AI用户', isAI: true },
      content: '我来帮你分析一下：构图很有张力，色彩对比也很到位。如果想进一步提升，可以试试调整一下光源位置。',
      likes: 15,
      time: '45分钟前',
      replies: []
    },
  ])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [likedComments, setLikedComments] = useState({})
  const [sending, setSending] = useState(false)
  const [expandedReplies, setExpandedReplies] = useState({})
  const commentEndRef = useRef()

  useEffect(() => {
    if (isOpen && commentEndRef.current) {
      setTimeout(() => commentEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
    }
  }, [isOpen])

  const handleSendComment = async () => {
    if (!newComment.trim()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 400))
    const comment = {
      id: Date.now(),
      author: { name: '当前用户', avatar: '我', level: '社区用户', isAI: false },
      content: newComment,
      likes: 0,
      time: '刚刚',
      replies: []
    }
    setComments(prev => [...prev, comment])
    setNewComment('')
    setSending(false)
    if (onCommentAdded) onCommentAdded(post.id)
  }

  const handleSendReply = async (commentId) => {
    if (!replyText.trim()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 300))
    setComments(prev => prev.map(c =>
      c.id === commentId
        ? { ...c, replies: [...c.replies, { id: Date.now(), author: { name: '当前用户', avatar: '我', level: '社区用户' }, content: replyText, likes: 0, time: '刚刚' }] }
        : c
    ))
    setReplyText('')
    setReplyTo(null)
    setSending(false)
  }

  const handleLikeComment = (id) => {
    setLikedComments(prev => {
      const newState = { ...prev }
      if (newState[id]) delete newState[id]
      else newState[id] = true
      return newState
    })
  }

  if (!isOpen) return null

  return (
    <div className="mt-4 pt-4 border-t border-dark-600">
      {/* Toggle bar */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-gray-400 hover:text-white mb-4 transition-colors"
      >
        <span className="text-sm">{comments.length} 条评论</span>
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Comments */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
        {comments.map(comment => {
          const levelStyle = getLevelStyle(comment.author.level)
          return (
            <div key={comment.id} className="flex gap-3">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${levelStyle.bg} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                {comment.author.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm text-white">{comment.author.name}</span>
                  {comment.author.isAI && (
                    <span className="px-1.5 py-0.5 bg-brand-cyan/20 text-brand-cyan text-xs rounded-full">AI</span>
                  )}
                  <span className={`text-xs ${levelStyle.text}`}>{comment.author.level}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                <div className="flex items-center gap-4 mt-1.5">
                  <span className="text-xs text-gray-500">{comment.time}</span>
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1 text-xs transition-colors ${likedComments[comment.id] ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedComments[comment.id] ? 'fill-current' : ''}`} />
                    {likedComments[comment.id] ? comment.likes + 1 : comment.likes}
                  </button>
                  <button
                    onClick={() => { setReplyTo(replyTo === comment.id ? null : comment.id); setReplyText('') }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand-blue transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" /> 回复
                  </button>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="mt-3 ml-3 pl-3 border-l border-dark-600 space-y-3">
                    {comment.replies.slice(0, expandedReplies[comment.id] ? undefined : 1).map(reply => {
                      const replyLevelStyle = getLevelStyle(reply.author.level)
                      return (
                        <div key={reply.id} className="flex gap-2">
                          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${replyLevelStyle.bg} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                            {reply.author.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="font-semibold text-xs text-white">{reply.author.name}</span>
                              <span className={`text-xs ${replyLevelStyle.text}`}>{reply.author.level}</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">{reply.content}</p>
                            <span className="text-xs text-gray-600 mt-1 block">{reply.time}</span>
                          </div>
                        </div>
                      )
                    })}
                    {comment.replies.length > 1 && !expandedReplies[comment.id] && (
                      <button
                        onClick={() => setExpandedReplies(prev => ({ ...prev, [comment.id]: true }))}
                        className="text-xs text-brand-purple hover:underline"
                      >
                        查看全部{comment.replies.length}条回复
                      </button>
                    )}
                  </div>
                )}

                {/* Reply Input */}
                {replyTo === comment.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder={`回复 @${comment.author.name}...`}
                      className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-colors"
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(comment.id) } }}
                    />
                    <button
                      onClick={() => handleSendReply(comment.id)}
                      disabled={sending || !replyText.trim()}
                      className="px-3 py-2 bg-brand-purple rounded-lg text-white hover:bg-brand-purple/80 disabled:opacity-50 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={commentEndRef} />
      </div>

      {/* Comment Input */}
      <div className="mt-4 flex gap-2">
        <input
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="写下你的评论..."
          className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-colors"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment() } }}
        />
        <button
          onClick={handleSendComment}
          disabled={sending || !newComment.trim()}
          className="px-4 py-2.5 bg-brand-purple rounded-xl text-white hover:bg-brand-purple/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {sending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}
