/**
 * AI影视成品详情页 - 视频播放器+剧集列表
 */
import { useState } from 'react'

export default function FilmDetail({ item, onBack }) {
  const [playingTrailer, setPlayingTrailer] = useState(false)
  const [selectedEpisode, setSelectedEpisode] = useState(item.episodesList[0])
  const [selectedLicense, setSelectedLicense] = useState(item.licenseTypes[0])

  const handleBuy = () => {
    const order = {
      id: `order_${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      type: 'film',
      licenseType: selectedLicense.name,
      price: selectedLicense.price,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    const orders = JSON.parse(localStorage.getItem('copyright_orders') || '[]')
    orders.push(order)
    localStorage.setItem('copyright_orders', JSON.stringify(orders))
    alert(`订单已创建！\n商品：${item.title}\n版权类型：${selectedLicense.name}\n总价：¥${selectedLicense.price.toLocaleString()}`)
  }

  return (
    <div className="pb-12">
      {/* 顶部导航 */}
      <div className="bg-slate-800/50 border-b border-slate-700 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2">
            ← 返回版权中心
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧：主视频 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 视频播放器 */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
              {playingTrailer ? (
                <video
                  src={item.trailerUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : (
                <>
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1200&q=80' }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button
                      onClick={() => setPlayingTrailer(true)}
                      className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                    >
                      <span className="text-3xl text-slate-900 ml-1">▶</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 标题和基本信息 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded">{item.genre}</span>
                <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">{item.resolution}</span>
                <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">{item.duration}</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">{item.title}</h1>
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-2">
                  <img src={item.ownerAvatar} alt={item.owner} className="w-8 h-8 rounded-full" />
                  <span>{item.owner}</span>
                </div>
                <span>•</span>
                <span>⭐ {item.rating}</span>
                <span>•</span>
                <span>👁️ {item.views.toLocaleString()}</span>
              </div>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, i) => (
                <span key={i} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">{tag}</span>
              ))}
            </div>

            {/* 简介 */}
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3">剧情简介</h3>
              <p className="text-slate-300 leading-relaxed">{item.description}</p>
            </div>

            {/* 演职员 */}
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">主创信息</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-slate-700 rounded-lg p-3 mb-2">
                    <span className="text-2xl">🎬</span>
                  </div>
                  <div className="text-white font-medium">导演</div>
                  <div className="text-slate-400 text-sm">{item.director}</div>
                </div>
                <div className="text-center">
                  <div className="bg-slate-700 rounded-lg p-3 mb-2">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="text-white font-medium">演员</div>
                  <div className="text-slate-400 text-sm">{item.cast.length}位AI演员</div>
                </div>
                <div className="text-center">
                  <div className="bg-slate-700 rounded-lg p-3 mb-2">
                    <span className="text-2xl">📺</span>
                  </div>
                  <div className="text-white font-medium">集数</div>
                  <div className="text-slate-400 text-sm">{item.episodes}集</div>
                </div>
                <div className="text-center">
                  <div className="bg-slate-700 rounded-lg p-3 mb-2">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <div className="text-white font-medium">总时长</div>
                  <div className="text-slate-400 text-sm">{item.totalDuration}</div>
                </div>
              </div>
              
              {/* 演员列表 */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="text-slate-400 text-sm mb-2">演员阵容</div>
                <div className="flex flex-wrap gap-2">
                  {item.cast.map((c, i) => (
                    <span key={i} className="bg-pink-900/30 text-pink-400 px-3 py-1 rounded-full text-sm">{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 剧集列表 */}
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">📺 剧集列表</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {item.episodesList.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEpisode(ep)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                      selectedEpisode.id === ep.id
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedEpisode.id === ep.id ? 'bg-white/20' : 'bg-slate-600'
                    }`}>
                      <span className="text-lg">{ep.free ? '▶' : '🔒'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{ep.title}</div>
                      <div className={`text-sm ${selectedEpisode.id === ep.id ? 'text-white/70' : 'text-slate-400'}`}>
                        {ep.duration}
                      </div>
                    </div>
                    {ep.free && (
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">免费</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：版权购买 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 数据统计 */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-pink-400">{item.episodes}</div>
                    <div className="text-slate-400 text-sm">集数</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-400">{item.views.toLocaleString()}</div>
                    <div className="text-slate-400 text-sm">播放量</div>
                  </div>
                </div>
              </div>

              {/* 授权方案 */}
              <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 border border-pink-500/30 rounded-xl p-6 space-y-5">
                <h3 className="text-white font-semibold">选择版权授权方案</h3>

                <div className="space-y-3">
                  {item.licenseTypes.map((lt) => (
                    <button
                      key={lt.id}
                      onClick={() => setSelectedLicense(lt)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        selectedLicense.id === lt.id
                          ? 'border-pink-500 bg-pink-500/20'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-white font-semibold">{lt.name}</div>
                          <div className="text-slate-400 text-sm mt-1">{lt.desc}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-pink-400">¥{lt.price.toLocaleString()}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 使用场景 */}
                <div>
                  <div className="text-slate-400 text-sm mb-2">授权使用场景</div>
                  <div className="flex flex-wrap gap-2">
                    {item.useCases.map((uc, i) => (
                      <span key={i} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">{uc}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div>
                    <span className="text-slate-400">选择方案</span>
                    <div className="text-white font-semibold">{selectedLicense.name}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">总价</span>
                    <div className="text-2xl font-bold text-pink-400">¥{selectedLicense.price.toLocaleString()}</div>
                  </div>
                </div>

                <button
                  onClick={handleBuy}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                >
                  立即购买版权
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
