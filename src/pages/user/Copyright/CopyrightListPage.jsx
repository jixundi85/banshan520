/**
 * 版权商品列表页（通用）
 */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCopyrightGoods } from '../../../hooks/useCopyright'
import { COPYRIGHT_CATEGORY_META } from '../../../data/copyrightSchema'
import UserLayout from '../../../components/UserLayout'
import { Search, Filter, Grid, List, Star, Eye, ShoppingCart } from 'lucide-react'

export default function CopyrightListPage() {
  const { type } = useParams()
  const navigate = useNavigate()
  const { goods, loading } = useCopyrightGoods(type)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('latest')
  const [searchTerm, setSearchTerm] = useState('')
  const [hoveredId, setHoveredId] = useState(null)

  const meta = COPYRIGHT_CATEGORY_META[type] || COPYRIGHT_CATEGORY_META.portrait

  const typeLabels = {
    portrait: { digital_human: '数字人', virtual_actor: '虚拟演员', digital_portrait: '数字肖像' },
    novel: { web_novel: '网络小说', original_literature: '原创文学', short_drama_script: '短剧剧本', story_ip: '故事IP', novel_copyright: '网文版权' },
    film: { ai_movie: 'AI微电影', ai_short_drama: 'AI短剧', ai_manga_drama: 'AI漫剧', ai_micro_film: 'AI微电影' },
  }

  // 过滤和排序
  const filteredGoods = goods.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
    if (sortBy === 'latest') return b.created_at - a.created_at
    if (sortBy === 'popular') return b.views - a.views
    if (sortBy === 'price_low') return (a.price_cash || 0) - (b.price_cash || 0)
    if (sortBy === 'price_high') return (b.price_cash || 0) - (a.price_cash || 0)
    return 0
  })

  const getPrice = (item) => {
    if (item.price_points > 0 && item.price_cash > 0) {
      return { points: item.price_points, cash: item.price_cash }
    }
    if (item.price_points > 0) return { points: item.price_points }
    return { cash: item.price_cash }
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        {/* 动态渐变背景 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-10`} />

        {/* Header */}
        <div className={`relative bg-gradient-to-r ${meta.gradient} py-16`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{meta.icon}</span>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{meta.name}</h1>
                <p className="text-white/80 text-lg">{meta.desc}</p>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-white">
                <span className="font-bold">{goods.length}</span> 个商品
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-white">
                <span className="font-bold">{goods.reduce((sum, g) => sum + (g.downloads || 0), 0)}</span> 次交易
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="max-w-7xl mx-auto px-4 py-6 relative">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索商品名称、描述或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* 排序 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="latest">最新上架</option>
              <option value="popular">最受欢迎</option>
              <option value="price_low">价格从低到高</option>
              <option value="price_high">价格从高到低</option>
            </select>

            {/* 视图切换 */}
            <div className="flex bg-slate-800/80 border border-slate-700 rounded-xl p-1">
              <button onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                <Grid className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* 发布按钮 */}
            <button
              onClick={() => navigate('/copyright/sell')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
            >
              <span>发布版权</span>
            </button>
          </div>

          {/* 标签筛选 */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-full text-sm hover:bg-cyan-500/30 transition-all">
              全部
            </button>
            {typeLabels[type] && Object.entries(typeLabels[type]).map(([key, label]) => (
              <button key={key}
                className="px-3 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-full text-sm hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
                {label}
              </button>
            ))}
          </div>

          {/* 商品列表 */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400">加载中...</p>
            </div>
          ) : filteredGoods.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-7xl mb-4 opacity-50">{meta.icon}</div>
              <p className="text-2xl text-slate-400 mb-2">暂无相关商品</p>
              <p className="text-slate-500 mb-6">试试其他关键词，或者发布你的版权</p>
              <button onClick={() => navigate('/copyright/sell')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl">
                立即发布
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGoods.map((item) => (
                <div key={item.id}
                  onClick={() => navigate(`/copyright/detail/${item.id}`)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* 封面 - 1:1正方形人脸区域 */}
                  <div className="relative aspect-square max-h-80 overflow-hidden">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/400/400` }}
                    />
                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

                    {/* 标签 */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-cyan-500/90 text-white text-xs px-2 py-1 rounded-full">
                        {typeLabels[type]?.[item.subtype] || item.category}
                      </span>
                      {item.play_count && (
                        <span className="bg-red-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          🔥 {item.play_count}
                        </span>
                      )}
                    </div>

                    {/* 预览按钮 */}
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${hoveredId === item.id ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>查看详情</span>
                      </div>
                    </div>

                    {/* 底部信息 */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-2 text-white/80 text-xs">
                        <Eye className="w-3 h-3" />
                        <span>{item.views?.toLocaleString() || 0}</span>
                        <span className="mx-2">|</span>
                        <span>@{item.owner_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* 内容 */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* 价格 */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                      <div>
                        {getPrice(item).cash && (
                          <div className="text-xl font-bold text-cyan-400">
                            ¥{getPrice(item).cash?.toLocaleString()}
                          </div>
                        )}
                        {getPrice(item).points && (
                          <div className="text-sm text-amber-400">
                            ⭐ {getPrice(item).points?.toLocaleString()} 积分
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/copyright/detail/${item.id}`) }}
                        className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-1"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>购买</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 列表视图 */
            <div className="space-y-4">
              {filteredGoods.map((item) => (
                <div key={item.id}
                  onClick={() => navigate(`/copyright/detail/${item.id}`)}
                  className="group bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-all p-4 flex gap-6"
                >
                  <div className="w-48 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/400/225` }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-white mb-1 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                        <p className="text-slate-400 text-sm mb-2">{item.description}</p>
                        <div className="flex gap-2 text-xs text-slate-500">
                          <span className="bg-slate-700 px-2 py-1 rounded">{typeLabels[type]?.[item.subtype] || item.category}</span>
                          <span>👁️ {item.views?.toLocaleString() || 0}</span>
                          <span>@{item.owner_name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {getPrice(item).cash && <div className="text-xl font-bold text-cyan-400">¥{getPrice(item).cash?.toLocaleString()}</div>}
                        {getPrice(item).points && <div className="text-sm text-amber-400">⭐ {getPrice(item).points?.toLocaleString()}</div>}
                        <button className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm">查看详情</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  )
}
