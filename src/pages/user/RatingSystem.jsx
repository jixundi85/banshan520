import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reviewService } from '../../services/dataService'
// 评价信用系统
export default function RatingSystem() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending') // pending, given, received
  const [reviews, setReviews] = useState([])
  useEffect(() => {
    // 模拟评价数据
    const mockReviews = [
      { id: 1, type: 'pending', project: '科技公司品牌宣传片', target: '创意工坊', rating: 0, comment: '', date: '2024-01-15' },
      { id: 2, type: 'given', project: '电商产品展示视频', target: '视觉大师', rating: 5, comment: '非常专业，交付准时，质量超出预期！', date: '2024-01-10' },
      { id: 3, type: 'received', project: 'AI短剧制作', from: '某科技公司', rating: 5, comment: '创作者很专业，沟通顺畅，推荐合作', date: '2024-01-08' },
    ]
    setReviews(mockReviews)
  }, [])
  const handleSubmitReview = (reviewId, rating, comment) => {
    const review = reviews.find(r => r.id === reviewId)
    if (!review) return
    // 调用 reviewService 保存评价并更新信用分
    reviewService.create({
      projectId: reviewId,
      projectName: review.project,
      fromId: 'current_user', // 实际应从登录状态获取
      fromType: 'enterprise',
      toId: review.target,
      toType: 'opc',
      rating,
      comment,
    })
    alert(`评价提交成功！\n评分：${rating}星\n评价：${comment}`)
    // 更新本地状态
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, type: 'given', rating, comment } : r))
  }
  const filteredReviews = reviews.filter(r => r.type === activeTab)
  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform ${
              star <= rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    )
  }
  return (
    
      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">评价中心</h1>
            <p className="text-gray-400">构建可信的碳硅共生生态</p>
          </div>
          {/* 信用评分卡 */}
          <div className="bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold mb-1">我的信用评分</h2>
                <p className="text-gray-400 text-sm">基于历史交易和评价计算</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-violet-400">98</div>
                <div className="text-gray-400 text-sm">优秀</div>
              </div>
            </div>
            <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[98%] bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
            </div>
          </div>
          {/* Tab切换 */}
          <div className="flex gap-2 mb-6">
            {[
              { key: 'pending', label: '待评价', count: reviews.filter(r => r.type === 'pending').length },
              { key: 'given', label: '已评价', count: reviews.filter(r => r.type === 'given').length },
              { key: 'received', label: '收到的评价', count: reviews.filter(r => r.type === 'received').length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          {/* 评价列表 */}
          <div className="space-y-4">
            {activeTab === 'pending' && filteredReviews.map(review => (
              <PendingReviewCard key={review.id} review={review} onSubmit={handleSubmitReview} renderStars={renderStars} />
            ))}
            {activeTab === 'given' && filteredReviews.map(review => (
              <GivenReviewCard key={review.id} review={review} renderStars={renderStars} />
            ))}
            {activeTab === 'received' && filteredReviews.map(review => (
              <ReceivedReviewCard key={review.id} review={review} renderStars={renderStars} />
            ))}
            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">暂无数据</p>
              </div>
            )}
          </div>
        </div>
      </div>
    
  )
}
// 待评价卡片
function PendingReviewCard({ review, onSubmit, renderStars }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-medium">{review.project}</h3>
          <p className="text-gray-400 text-sm">合作方：{review.target}</p>
        </div>
        <span className="text-gray-500 text-sm">{review.date}</span>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">点击评分</p>
        {renderStars(rating, true, setRating)}
      </div>
      
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="写下您的评价..."
        className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 resize-none mb-4"
      />
      
      <button
        onClick={() => onSubmit(review.id, rating, comment)}
        className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all"
      >
        提交评价
      </button>
    </div>
  )
}
// 已评价卡片
function GivenReviewCard({ review, renderStars }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-medium">{review.project}</h3>
          <p className="text-gray-400 text-sm">评价对象：{review.target}</p>
        </div>
        <span className="text-gray-500 text-sm">{review.date}</span>
      </div>
      <div className="mb-2">{renderStars(review.rating)}</div>
      <p className="text-gray-300">{review.comment}</p>
    </div>
  )
}
// 收到的评价卡片
function ReceivedReviewCard({ review, renderStars }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-medium">{review.project}</h3>
          <p className="text-gray-400 text-sm">来自：{review.from}</p>
        </div>
        <span className="text-gray-500 text-sm">{review.date}</span>
      </div>
      <div className="mb-2">{renderStars(review.rating)}</div>
      <p className="text-gray-300">{review.comment}</p>
    </div>
  )
}
