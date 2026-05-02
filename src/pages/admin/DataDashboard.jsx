import { useState, useEffect } from 'react'
import PageWrapper from '../../components/PageWrapper'

// 数据看板 - 平台运营数据
export default function DataDashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const [stats, setStats] = useState({
    users: { total: 12847, new: 234, growth: 12.5 },
    orders: { total: 3421, new: 89, growth: 8.3 },
    revenue: { total: 5684200, new: 128000, growth: 15.2 },
    projects: { total: 2847, active: 156, completion: 94.2 }
  })

  const chartData = [
    { date: '01-01', users: 120, orders: 45, revenue: 28000 },
    { date: '01-02', users: 132, orders: 52, revenue: 32000 },
    { date: '01-03', users: 101, orders: 38, revenue: 21000 },
    { date: '01-04', users: 154, orders: 61, revenue: 45000 },
    { date: '01-05', users: 190, orders: 78, revenue: 52000 },
    { date: '01-06', users: 230, orders: 89, revenue: 68000 },
    { date: '01-07', users: 210, orders: 82, revenue: 61000 },
  ]

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">数据看板</h1>
            <p className="text-gray-400">平台运营数据实时监控</p>
          </div>
          <div className="flex gap-2">
            {['24h', '7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  timeRange === range
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {range === '24h' ? '今日' : range === '7d' ? '近7天' : range === '30d' ? '近30天' : '近90天'}
              </button>
            ))}
          </div>
        </div>

        {/* 核心指标卡 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="总用户数"
            value={stats.users.total.toLocaleString()}
            change={`+${stats.users.new}`}
            growth={stats.users.growth}
            icon="👥"
            color="from-violet-500 to-purple-500"
          />
          <StatCard
            title="总订单数"
            value={stats.orders.total.toLocaleString()}
            change={`+${stats.orders.new}`}
            growth={stats.orders.growth}
            icon="📋"
            color="from-cyan-500 to-blue-500"
          />
          <StatCard
            title="总成交额"
            value={`¥${(stats.revenue.total / 10000).toFixed(1)}万`}
            change={`+¥${(stats.revenue.new / 10000).toFixed(1)}万`}
            growth={stats.revenue.growth}
            icon="💰"
            color="from-amber-500 to-orange-500"
          />
          <StatCard
            title="项目完成率"
            value={`${stats.projects.completion}%`}
            change={`${stats.projects.active}进行中`}
            growth={2.1}
            icon="✅"
            color="from-emerald-500 to-teal-500"
          />
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 趋势图 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-6">用户增长趋势</h3>
            <div className="h-64 flex items-end gap-2">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-violet-500 to-violet-400 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(d.users / 250) * 100}%` }}
                  />
                  <span className="text-gray-500 text-xs">{d.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 收入构成 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-6">收入构成</h3>
            <div className="space-y-4">
              {[
                { name: 'AI短视频', value: 35, color: 'bg-violet-500' },
                { name: 'AI短剧', value: 25, color: 'bg-cyan-500' },
                { name: 'AI设计', value: 20, color: 'bg-amber-500' },
                { name: '其他', value: 20, color: 'bg-gray-500' },
              ].map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{item.name}</span>
                    <span className="text-white">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 等级分布 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-6">OPC等级分布</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { level: 'L1', name: '战术执行者', count: 45, color: 'from-emerald-400 to-teal-500' },
              { level: 'L2', name: '矩阵架构师', count: 38, color: 'from-cyan-400 to-blue-500' },
              { level: 'L3', name: '全域操盘手', count: 32, color: 'from-purple-400 to-violet-500' },
              { level: 'L4', name: '极核引擎手', count: 13, color: 'from-amber-400 to-yellow-500' },
            ].map(item => (
              <div key={item.level} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                  {item.level}
                </div>
                <h4 className="text-white font-medium text-sm">{item.name}</h4>
                <p className="text-gray-400 text-2xl font-bold mt-2">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, growth, icon, color }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <span className={`text-sm ${growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}%
        </span>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white mb-2">{value}</p>
      <p className="text-gray-500 text-xs">{change}</p>
    </div>
  )
}
