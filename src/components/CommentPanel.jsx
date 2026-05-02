import { useState, useRef, useEffect } from 'react'
import { X, Heart, Reply, Send } from 'lucide-react'

// 模拟评论数据
const mockComments = [
  {
    id: 1,
    author: { name: '林艺涵', avatar: '林', level: '钻石创作者' },
    content: '这个效果太赞了！ControlNet参数可以分享一下吗？',
    likes: 12,
    time: '10分钟前',
    replies: [
      { id: 11, author: { name: '张明远', avatar: '张', level: '金牌创作者' }, content: '同求！', likes: 3, time: '8分钟前' }
    ]
  },
  {
    id: 2,
    author: { name: '李思琪', avatar: '李', level: '银牌创作者' },
    content: '跟着教程做了一遍，效果不错，感谢分享！',
    likes: 8,
    time: '30分钟前',
    replies: []
  },
  {
    id: 3,
    author: { name: '王财富', avatar: '王', level: '社区用户' },
    content: '新手问一下，这个需要什么配置的电脑才能跑？',
    likes: 5,
    time: '1小时前',
    replies: []
  },
  {
    id: 4,
    author: { name: '赵小雨', avatar: '赵', level: '银牌创作者' },
    content: '收藏了！正好在研究这个方向',
    likes: 3,
    time: '2小时前',
    replies: []
  }
]

export default function CommentPanel({ post, onClose, onCommentAdded }) {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [likedComments, setLikedComments] = useState({})
  const [sending, setSending] = useState(false)
  const [expandedReplies, setExpandedReplies] = useState({})
  const commentEndRef = useRef()
  const replyInputRef = useRef()

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSendComment = async () => {
    if (!newComment.trim()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 400))
    const comment = {
      id: Date.now(),
      author: { name: '当前用户', avatar: '我', level: '社区用户' },
      content: newComment,
      likes: 0,
      time: '刚刚',
      replies: []
    }
    setComments(prev => [comment, ...prev])
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

  const getLevelColor = (level) => {
    if (level === '钻石创作者') return 'text-brand-purple'
    if (level === '金牌创作者') return 'text-yellow-400'
    if (level === '银牌创作者') return 'text-gray-400'
    return 'text-gray-500'
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-md h-full bg-dark-800 border-l border-dark-600 flex flex-col shadow-2xl animate-slide-in-right" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-600 flex-shrink-0">
          <div>
            <h3 className="font-bold text-white">评论</h3>
            <p className="text-xs text-gray-500 mt-0.5">{comments.length + comments.reduce((a, c) => a + c.replies.length, 0)} 条评论</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-dark-700 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Preview */}
        {post && (
          <div className="px-4 py-3 bg-dark-700/30 border-b border-dark-600 flex-shrink-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {post.author.avatar}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-white">{post.author.name}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1 line-clamp-3">{post.content.split('\n')[0]}</p>
              </div>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {comments.map(comment => (
              <div key={comment.id}>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {comment.author.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-white">{comment.author.name}</span>
                      <span className={`text-xs ${getLevelColor(comment.author.level)}`}>{comment.author.level}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2">
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
                        {comment.replies.slice(0, expandedReplies[comment.id] ? undefined : 2).map(reply => (
                          <div key={reply.id} className="flex gap-2">
                            <div className="w-7 h-7 rounded-full bg-dark-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {reply.author.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-semibold text-xs text-white">{reply.author.name}</span>
                              </div>
                              <p className="text-xs text-gray-400">{reply.content}</p>
                              <span className="text-xs text-gray-600 mt-1 block">{reply.time}</span>
                            </div>
                          </div>
                        ))}
                        {comment.replies.length > 2 && !expandedReplies[comment.id] && (
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
                          ref={replyInputRef}
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
              </div>
            ))}
            <div ref={commentEndRef} />
          </div>
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-dark-600 flex-shrink-0">
          <div className="flex gap-2">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="写下你的评论..."
              className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-brand-purple transition-colors"
              rows={2}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment() } }}
            />
            <button
              onClick={handleSendComment}
              disabled={sending || !newComment.trim()}
              className="px-4 py-2 bg-brand-purple rounded-xl text-white hover:bg-brand-purple/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 self-end"
            >
              {sending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
