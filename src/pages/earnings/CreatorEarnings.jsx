import { useState } from 'react'

import {
  TrendingUp, TrendingDown, DollarSign, Wallet, CreditCard,
  ArrowUpRight, ArrowDownRight, Download, Calendar, Filter,
  ChevronRight, Star, Clock, CheckCircle, AlertCircle,
  BarChart3, PieChart as PieChartIcon, LineChart, Users,
  Gift, Briefcase, TrendingUp as TrendingUpIcon, Eye
} from 'lucide-react'
import './CreatorEarnings.css'

export default function CreatorEarnings() {
  const [period, setPeriod] = useState('month')
  const [activeTab, setActiveTab] = useState('overview')

  // 模拟收益数据
  const summary = {
    totalEarnings: 25800.00,
    thisMonth: 4850.00,
    pendingSettlement: 3200.00,
    withdrawn: 17500.00,
    thisMonthChange: 15.2,
    pendingChange: -8.5
  }

  const monthlyData = [
    { month: '2026-04', orders: 12, amount: 4850, ordersChange: 8.5, amountChange: 15.2 },
    { month: '2026-03', orders: 15, amount: 4210, ordersChange: 25.0, amountChange: 12.3 },
    { month: '2026-02', orders: 8, amount: 3750, ordersChange: -20.0, amountChange: -8.5 },
    { month: '2026-01', orders: 10, amount: 4100, ordersChange: 0, amountChange: 5.2 },
    { month: '2025-12', orders: 11, amount: 3890, ordersChange: 10.0, amountChange: -3.8 }
  ]

  const incomeSources = [
    { source: '订单尾款', amount: 15600, percent: 60.5, color: '#6366f1' },
    { source: '订单预付款', amount: 5200, percent: 20.2, color: '#8b5cf6' },
    { source: '教程解锁分成', amount: 3200, percent: 12.4, color: '#a855f7' },
    { source: '邀请奖励', amount: 1800, percent: 6.9, color: '#ec4899' }
  ]

  const recentOrders = [
    { id: '202604012', title: '品牌LOGO设计', client: '张总', amount: 1200, type: '尾款', status: '已完成', time: '2026-04-07', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { id: '202604011', title: '产品详情页设计', client: '李总', amount: 300, type: '预付款', status: '进行中', time: '2026-04-06', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    { id: '202604010', title: '海报设计', client: '王总', amount: 700, type: '尾款', status: '已完成', time: '2026-04-05', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    { id: '202604009', title: '包装设计', client: '赵总', amount: 500, type: '尾款', status: '已完成', time: '2026-04-04', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
    { id: '202604008', title: 'UI界面设计', client: '孙总', amount: 300, type: '预付款', status: '进行中', time: '2026-04-03', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }
  ]

  const platformStats = {
    totalOrders: 86,
    completedOrders: 78,
    avgRating: 4.8,
    completionRate: 96.5,
    responseRate: 98.2,
    ranking: 128
  }

  return (
    <PageWrapper>
      <div className="creator-earnings">
        {/* 顶部区域 */}
        <div className="earnings-header">
          <div className="header-top">
            <div>
              <h1>收益中心</h1>
              <p>查看您的创作者收益与财务数据</p>
            </div>
            <div className="header-actions">
              <button className="action-btn">
                <Download size={16} />
                导出报表
              </button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="summary-cards">
            <div className="summary-card main">
              <div className="card-label">累计收益</div>
              <div className="card-value">¥{summary.totalEarnings.toLocaleString()}</div>
              <div className="card-trend up">
                <TrendingUp size={14} />
                <span>+12.5%</span>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-label">本月收益</div>
              <div className="card-value">¥{summary.thisMonth.toLocaleString()}</div>
              <div className="card-change up">
                <ArrowUpRight size={12} />
                +{summary.thisMonthChange}%
              </div>
            </div>
            <div className="summary-card">
              <div className="card-label">待结算</div>
              <div className="card-value orange">¥{summary.pendingSettlement.toLocaleString()}</div>
              <div className="card-change down">
                <ArrowDownRight size={12} />
                {summary.pendingChange}%
              </div>
            </div>
            <div className="summary-card">
              <div className="card-label">已提现</div>
              <div className="card-value green">¥{summary.withdrawn.toLocaleString()}</div>
              <div className="card-link">查看明细 <ChevronRight size={12} /></div>
            </div>
          </div>

          {/* 周期选择 */}
          <div className="period-selector">
            <button className={`period-btn ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>本周</button>
            <button className={`period-btn ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>本月</button>
            <button className={`period-btn ${period === 'year' ? 'active' : ''}`} onClick={() => setPeriod('year')}>本年</button>
            <button className={`period-btn ${period === 'all' ? 'active' : ''}`} onClick={() => setPeriod('all')}>全部</button>
          </div>
        </div>

        {/* Tab导航 */}
        <div className="tabs-nav">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <BarChart3 size={18} />
            收益概览
          </button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <Briefcase size={18} />
            订单明细
          </button>
          <button className={`tab-btn ${activeTab === 'sources' ? 'active' : ''}`} onClick={() => setActiveTab('sources')}>
            <PieChartIcon size={18} />
            收入来源
          </button>
          <button className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            <TrendingUpIcon size={18} />
            数据统计
          </button>
        </div>

        {/* Tab内容 */}
        <div className="tabs-content">
          {/* 收益概览 */}
          {activeTab === 'overview' && (
            <div className="overview-section">
              {/* 图表区域 */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>收益趋势</h3>
                  <div className="chart-legend">
                    <span className="legend-item"><span className="dot purple"></span>收益金额</span>
                    <span className="legend-item"><span className="dot blue"></span>订单数量</span>
                  </div>
                </div>
                <div className="chart-area">
                  {/* 简化柱状图 */}
                  <div className="bar-chart">
                    {monthlyData.map((item, index) => (
                      <div key={index} className="bar-group">
                        <div className="bar-wrapper">
                          <div className="bar purple" style={{ height: `${(item.amount / 5000) * 100}%` }}>
                            <span className="bar-value">¥{item.amount}</span>
                          </div>
                          <div className="bar blue" style={{ height: `${(item.orders / 20) * 100}%` }}></div>
                        </div>
                        <span className="bar-label">{item.month.split('-')[1]}月</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 每月明细 */}
              <div className="monthly-list">
                <h3>月度明细</h3>
                {monthlyData.map((item, index) => (
                  <div key={index} className="monthly-item">
                    <div className="month-info">
                      <span className="month-name">{item.month}</span>
                      <span className="order-count">{item.orders} 个订单</span>
                    </div>
                    <div className="month-amount">
                      <span className="amount">¥{item.amount.toLocaleString()}</span>
                      <span className={`change ${item.amountChange >= 0 ? 'up' : 'down'}`}>
                        {item.amountChange >= 0 ? '+' : ''}{item.amountChange}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 订单明细 */}
          {activeTab === 'orders' && (
            <div className="orders-section">
              <div className="orders-table">
                <div className="table-header">
                  <span>订单</span>
                  <span>客户</span>
                  <span>金额</span>
                  <span>类型</span>
                  <span>状态</span>
                  <span>时间</span>
                </div>
                {recentOrders.map((order, index) => (
                  <div key={index} className="table-row">
                    <div className="order-info">
                      <span className="order-id">#{order.id}</span>
                      <span className="order-title">{order.title}</span>
                    </div>
                    <div className="client-info">
                      <img src={order.avatar} alt={order.client} className="client-avatar" />
                      <span>{order.client}</span>
                    </div>
                    <span className="amount">¥{order.amount}</span>
                    <span className={`type-badge ${order.type}`}>{order.type}</span>
                    <span className={`status-badge ${order.status}`}>
                      {order.status === '已完成' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {order.status}
                    </span>
                    <span className="time">{order.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 收入来源 */}
          {activeTab === 'sources' && (
            <div className="sources-section">
              <div className="sources-chart">
                <h3>收入构成</h3>
                {/* 简化饼图 */}
                <div className="pie-chart">
                  <div className="pie-legend">
                    {incomeSources.map((source, index) => (
                      <div key={index} className="legend-row">
                        <span className="legend-color" style={{ background: source.color }}></span>
                        <span className="legend-name">{source.source}</span>
                        <span className="legend-percent">{source.percent}%</span>
                        <span className="legend-amount">¥{source.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sources-detail">
                <h3>来源说明</h3>
                <div className="source-cards">
                  <div className="source-card">
                    <div className="source-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1' }}>
                      <Briefcase size={24} />
                    </div>
                    <h4>订单收入</h4>
                    <p>完成客户需求订单后获得的收入，包括预付款和尾款</p>
                  </div>
                  <div className="source-card">
                    <div className="source-icon" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' }}>
                      <Star size={24} />
                    </div>
                    <h4>内容分成</h4>
                    <p>用户解锁您的教程内容时获得的分成收入</p>
                  </div>
                  <div className="source-card">
                    <div className="source-icon" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}>
                      <Users size={24} />
                    </div>
                    <h4>邀请奖励</h4>
                    <p>成功邀请新用户或新创作者加入平台获得的奖励</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 数据统计 */}
          {activeTab === 'stats' && (
            <div className="stats-section">
              <div className="platform-stats">
                <h3>平台数据</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-icon"><Briefcase size={20} /></div>
                    <div className="stat-content">
                      <span className="stat-value">{platformStats.totalOrders}</span>
                      <span className="stat-label">累计订单</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon success"><CheckCircle size={20} /></div>
                    <div className="stat-content">
                      <span className="stat-value">{platformStats.completedOrders}</span>
                      <span className="stat-label">已完成</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon star"><Star size={20} /></div>
                    <div className="stat-content">
                      <span className="stat-value">{platformStats.avgRating}</span>
                      <span className="stat-label">平均评分</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon purple"><TrendingUpIcon size={20} /></div>
                    <div className="stat-content">
                      <span className="stat-value">{platformStats.completionRate}%</span>
                      <span className="stat-label">完成率</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon blue"><Clock size={20} /></div>
                    <div className="stat-content">
                      <span className="stat-value">{platformStats.responseRate}%</span>
                      <span className="stat-label">响应率</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon gold"><Gift size={20} /></div>
                    <div className="stat-content">
                      <span className="stat-value">#{platformStats.ranking}</span>
                      <span className="stat-label">平台排名</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tips-section">
                <h3>提升建议</h3>
                <div className="tips-list">
                  <div className="tip-item">
                    <AlertCircle size={16} className="tip-icon" />
                    <p>您的响应率达到 <strong>98.2%</strong>，继续保持！</p>
                  </div>
                  <div className="tip-item">
                    <TrendingUp size={16} className="tip-icon success" />
                    <p>本月收益较上月增长 <strong>+15.2%</strong>，表现优异！</p>
                  </div>
                  <div className="tip-item">
                    <Star size={16} className="tip-icon star" />
                    <p>提升评分至 <strong>4.9</strong> 可解锁更多优质订单</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 提现入口 */}
        <div className="withdraw-section">
          <div className="withdraw-info">
            <Wallet size={24} />
            <div>
              <h3>可提现余额</h3>
              <p>¥{summary.pendingSettlement.toLocaleString()}</p>
            </div>
          </div>
          <button className="withdraw-btn">
            立即提现
          </button>
        </div>
      </div>
    </PageWrapper>
  )
}
