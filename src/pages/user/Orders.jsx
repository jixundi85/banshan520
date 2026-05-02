import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const orders = [
  {
    id: 'ORD20260405001',
    type: 'course',
    title: 'AI 图像生成实战',
    subtitle: '进阶课程 · 永久有效',
    price: 599,
    status: 'completed',
    date: '2026-04-05 14:30',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop'
  },
  {
    id: 'ORD20260404002',
    type: 'course',
    title: 'AI 视频创作入门',
    subtitle: '基础课程 · 永久有效',
    price: 399,
    status: 'completed',
    date: '2026-04-04 09:15',
    thumbnail: 'https://images.unsplash.com/photo-1677852431493-5d1b0d92e000?w=200&h=200&fit=crop'
  },
  {
    id: 'ORD20260401003',
    type: 'demand',
    title: '企业品牌宣传片制作',
    subtitle: '需求订单 · 进行中',
    price: 5000,
    status: 'processing',
    date: '2026-04-01 16:45',
    thumbnail: null
  },
  {
    id: 'ORD20260328004',
    type: 'course',
    title: 'AI 电影制作高级教程',
    subtitle: '高级课程 · 永久有效',
    price: 1299,
    status: 'completed',
    date: '2026-03-28 20:00',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=200&fit=crop'
  }
]

const statusMap = {
  completed: { text: '已完成', color: 'text-green-400', bg: 'bg-green-500/20' },
  processing: { text: '进行中', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  pending: { text: '待支付', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  cancelled: { text: '已取消', color: 'text-gray-400', bg: 'bg-gray-500/20' }
}

export default function Orders() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [showDetail, setShowDetail] = useState(null)

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(o => o.type === activeTab)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">我的订单</h1>
        <p className="text-gray-400">查看和管理您的所有订单</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">总订单数</p>
          <p className="text-2xl font-bold text-white">4</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">已完成</p>
          <p className="text-2xl font-bold text-green-400">3</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">进行中</p>
          <p className="text-2xl font-bold text-blue-400">1</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">总消费</p>
          <p className="text-2xl font-bold text-purple-400">¥7,697</p>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-2 font-medium transition-all ${
            activeTab === 'all' 
              ? 'text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          全部订单
        </button>
        <button
          onClick={() => setActiveTab('course')}
          className={`pb-3 px-2 font-medium transition-all ${
            activeTab === 'course' 
              ? 'text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          课程订单
        </button>
        <button
          onClick={() => setActiveTab('demand')}
          className={`pb-3 px-2 font-medium transition-all ${
            activeTab === 'demand' 
              ? 'text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          需求订单
        </button>
      </div>

      {/* 订单列表 */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div 
            key={order.id}
            className="bg-slate-800/50 rounded-2xl border border-white/5 p-5 hover:border-purple-500/30 transition-all"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* 缩略图 */}
              <div className="flex-shrink-0">
                {order.thumbnail ? (
                  <img 
                    src={order.thumbnail}
                    alt={order.title}
                    className="w-full md:w-32 h-32 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-full md:w-32 h-32 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <span className="text-4xl">🎬</span>
                  </div>
                )}
              </div>

              {/* 信息 */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{order.title}</h3>
                      <p className="text-sm text-gray-400">{order.subtitle}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${statusMap[order.status].bg} ${statusMap[order.status].color}`}>
                      {statusMap[order.status].text}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-400">
                    <span>订单号: {order.id}</span>
                    <span className="mx-2">·</span>
                    <span>{order.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-white">¥{order.price.toLocaleString()}</span>
                    <button 
                      onClick={() => setShowDetail(order)}
                      className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-all"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-white mb-2">暂无订单</h3>
          <p className="text-gray-400 mb-6">快去选购课程或发布需求吧</p>
        </div>
      )}

      {/* 订单详情弹窗 */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">订单详情</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-gray-400">订单编号</span>
                <span className="text-white">{showDetail.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-gray-400">订单类型</span>
                <span className="text-white">{showDetail.type === 'course' ? '课程购买' : '需求订单'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-gray-400">下单时间</span>
                <span className="text-white">{showDetail.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-gray-400">订单金额</span>
                <span className="text-xl font-bold text-purple-400">¥{showDetail.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">订单状态</span>
                <span className={`px-3 py-1 rounded-full text-sm ${statusMap[showDetail.status].bg} ${statusMap[showDetail.status].color}`}>
                  {statusMap[showDetail.status].text}
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setShowDetail(null)}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
              >
                关闭
              </button>
              {showDetail.status === 'completed' && (
                <button 
                  onClick={() => alert('感谢您的评价！')}
                  className="flex-1 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all"
                >
                  评价订单
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
