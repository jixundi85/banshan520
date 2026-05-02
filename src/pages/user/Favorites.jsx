import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const favorites = [
  {
    id: 1,
    type: 'course',
    title: 'Midjourney 商业变现指南',
    category: 'AI绘画',
    author: '李明老师',
    price: 299,
    rating: 4.9,
    students: 1256,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    addedAt: '2026-04-05'
  },
  {
    id: 2,
    type: 'course',
    title: 'AI 动画制作实战',
    category: 'AI视频',
    author: '王芳老师',
    price: 699,
    rating: 4.8,
    students: 892,
    thumbnail: 'https://images.unsplash.com/photo-1677852431493-5d1b0d92e000?w=400&h=250&fit=crop',
    addedAt: '2026-04-03'
  },
  {
    id: 3,
    type: 'demand',
    title: '寻求AI产品宣传片制作团队',
    category: '视频制作',
    budget: '¥5,000-10,000',
    deadline: '2026-04-20',
    proposals: 3,
    thumbnail: null,
    addedAt: '2026-04-01'
  },
  {
    id: 4,
    type: 'creator',
    name: '创意工坊',
    specialty: 'AI视频 · 特效制作',
    works: 45,
    followers: '2.3k',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator1',
    addedAt: '2026-03-28'
  }
]

export default function Favorites() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [favoritesList, setFavoritesList] = useState(favorites)

  const filteredFavorites = activeTab === 'all' 
    ? favoritesList 
    : favoritesList.filter(f => f.type === activeTab)

  const removeFavorite = (id) => {
    setFavoritesList(favoritesList.filter(f => f.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">我的收藏</h1>
        <p className="text-gray-400">管理您收藏的课程、需求和创作者</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => setActiveTab('all')}
          className={`bg-slate-800/50 rounded-xl p-4 border transition-all ${activeTab === 'all' ? 'border-purple-500' : 'border-white/5 hover:border-white/20'}`}
        >
          <p className="text-gray-400 text-sm mb-1">全部收藏</p>
          <p className="text-2xl font-bold text-white">{favoritesList.length}</p>
        </button>
        <button 
          onClick={() => setActiveTab('course')}
          className={`bg-slate-800/50 rounded-xl p-4 border transition-all ${activeTab === 'course' ? 'border-purple-500' : 'border-white/5 hover:border-white/20'}`}
        >
          <p className="text-gray-400 text-sm mb-1">课程</p>
          <p className="text-2xl font-bold text-blue-400">{favoritesList.filter(f => f.type === 'course').length}</p>
        </button>
        <button 
          onClick={() => setActiveTab('demand')}
          className={`bg-slate-800/50 rounded-xl p-4 border transition-all ${activeTab === 'demand' ? 'border-purple-500' : 'border-white/5 hover:border-white/20'}`}
        >
          <p className="text-gray-400 text-sm mb-1">需求</p>
          <p className="text-2xl font-bold text-green-400">{favoritesList.filter(f => f.type === 'demand').length}</p>
        </button>
        <button 
          onClick={() => setActiveTab('creator')}
          className={`bg-slate-800/50 rounded-xl p-4 border transition-all ${activeTab === 'creator' ? 'border-purple-500' : 'border-white/5 hover:border-white/20'}`}
        >
          <p className="text-gray-400 text-sm mb-1">创作者</p>
          <p className="text-2xl font-bold text-purple-400">{favoritesList.filter(f => f.type === 'creator').length}</p>
        </button>
      </div>

      {/* 收藏列表 */}
      <div className="space-y-4">
        {filteredFavorites.map(item => (
          <div 
            key={item.id}
            className="bg-slate-800/50 rounded-2xl border border-white/5 p-5 hover:border-purple-500/30 transition-all group"
          >
            {item.type === 'course' && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-shrink-0">
                  <img 
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full md:w-48 h-32 rounded-xl object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-1 bg-purple-500/80 text-white text-xs rounded-lg">
                    {item.category}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">讲师: {item.author}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-yellow-400">★ {item.rating}</span>
                      <span className="text-gray-400">{item.students.toLocaleString()} 学员</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-purple-400">¥{item.price}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => removeFavorite(item.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        🗑️
                      </button>
                      <button 
                        onClick={() => navigate('/training')}
                        className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        立即学习
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {item.type === 'demand' && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">💼</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg">{item.category}</span>
                    <span>预算: {item.budget}</span>
                    <span>截止: {item.deadline}</span>
                    <span>{item.proposals} 个提案</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">收藏于 {item.addedAt}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => removeFavorite(item.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        🗑️
                      </button>
                      <button 
                        onClick={() => navigate('/demand')}
                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {item.type === 'creator' && (
              <div className="flex flex-col md:flex-row gap-4">
                <img 
                  src={item.avatar}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{item.specialty}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{item.works} 作品</span>
                    <span>{item.followers} 粉丝</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-500">收藏于 {item.addedAt}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => removeFavorite(item.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        🗑️
                      </button>
                      <button 
                        onClick={() => navigate('/creator')}
                        className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        关注
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {filteredFavorites.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-white mb-2">暂无收藏</h3>
          <p className="text-gray-400 mb-6">去发现感兴趣的内容吧</p>
          <button 
            onClick={() => navigate('/training')}
            className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          >
            浏览课程
          </button>
        </div>
      )}
    </div>
  )
}
