/**
 * 小说版权详情页 - 章节列表+阅读试看
 */
import { useState } from 'react'

export default function NovelDetail({ item, onBack }) {
  const [selectedChapter, setSelectedChapter] = useState(item.sampleChapters[0])
  const [selectedLicense, setSelectedLicense] = useState(item.licenseTypes[0])
  const [showFullDesc, setShowFullDesc] = useState(false)

  const handleBuy = () => {
    const order = {
      id: `order_${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      type: 'novel',
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
          {/* 左侧：书籍信息 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 封面 */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80' }}
                />
              </div>
              <div className="absolute -bottom-4 left-4 right-4 bg-gradient-to-t from-slate-900 to-transparent h-20" />
            </div>

            {/* 作者信息 */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <img src={item.ownerAvatar} alt={item.owner} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="text-white font-medium">{item.owner}</div>
                  <div className="text-slate-400 text-sm">版权所有方</div>
                </div>
              </div>
            </div>

            {/* 数据统计 */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">数据概览</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{item.wordCount.toLocaleString()}</div>
                  <div className="text-slate-400">总字数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{item.chapters}</div>
                  <div className="text-slate-400">章节数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{item.views.toLocaleString()}</div>
                  <div className="text-slate-400">阅读量</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">⭐{item.rating}</div>
                  <div className="text-slate-400">评分</div>
                </div>
              </div>
            </div>

            {/* 可交易版权 */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">可交易版权类型</h3>
              <div className="flex flex-wrap gap-2">
                {item.rights.map((r, i) => (
                  <span key={i} className="bg-amber-900/30 text-amber-400 px-3 py-1 rounded-full text-sm">{r}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 中间：书籍详情 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 标题 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded">{item.genre}</span>
                <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">{item.status}</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{item.title}</h1>
              <p className="text-slate-400">作者：{item.author}</p>
            </div>

            {/* 简介 */}
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3">作品简介</h3>
              <p className={`text-slate-300 leading-relaxed ${showFullDesc ? '' : 'line-clamp-3'}`}>{item.description}</p>
              {item.description.length > 150 && (
                <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-amber-400 text-sm mt-2">
                  {showFullDesc ? '收起' : '展开全部'}
                </button>
              )}
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, i) => (
                <span key={i} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">{tag}</span>
              ))}
            </div>

            {/* 章节试读 */}
            <div className="bg-slate-800/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">📖 免费试读章节</h3>
                <span className="text-slate-400 text-sm">共{item.sampleChapters.length}章可预览</span>
              </div>
              
              {/* 章节列表 */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {item.sampleChapters.map((ch, i) => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChapter(ch)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all ${
                      selectedChapter.id === ch.id
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    第{i + 1}章
                  </button>
                ))}
              </div>

              {/* 章节内容 */}
              <div className="bg-slate-900/50 rounded-xl p-6 min-h-[200px]">
                <h4 className="text-white font-medium mb-4 text-lg">{selectedChapter.title}</h4>
                <div className="text-slate-300 leading-loose whitespace-pre-line font-serif">
                  {selectedChapter.content}
                </div>
              </div>
            </div>

            {/* 版权购买 */}
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-xl p-6 space-y-5">
              <h3 className="text-white font-semibold">选择版权购买方案</h3>

              <div className="grid md:grid-cols-2 gap-4">
                {item.licenseTypes.map((lt) => (
                  <button
                    key={lt.id}
                    onClick={() => setSelectedLicense(lt)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedLicense.id === lt.id
                        ? 'border-amber-500 bg-amber-500/20'
                        : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-white font-semibold">{lt.name}</div>
                        <div className="text-slate-400 text-sm mt-1">{lt.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-400">¥{lt.price.toLocaleString()}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div>
                  <span className="text-slate-400">选择方案</span>
                  <div className="text-xl font-bold text-white">{selectedLicense.name}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">总价</span>
                  <div className="text-3xl font-bold text-amber-400">¥{selectedLicense.price.toLocaleString()}</div>
                </div>
              </div>

              <button
                onClick={handleBuy}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                立即购买版权
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
