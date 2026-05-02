import { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, Download, BarChart3 } from 'lucide-react';
import './EarningsReport.css';

export default function EarningsReport() {
  const [period, setPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  const summary = {
    total: 25800.00,
    thisMonth: 4850.00,
    pending: 3200.00,
    withdrawn: 17500.00
  };

  const monthlyData = [
    { month: '2026-04', orders: 12, amount: 4850, ordersChange: 8.5, amountChange: 15.2 },
    { month: '2026-03', orders: 15, amount: 4210, ordersChange: 25.0, amountChange: 12.3 },
    { month: '2026-02', orders: 8, amount: 3750, ordersChange: -20.0, amountChange: -8.5 },
    { month: '2026-01', orders: 10, amount: 4100, ordersChange: 0, amountChange: 5.2 },
    { month: '2025-12', orders: 11, amount: 3890, ordersChange: 10.0, amountChange: -3.8 }
  ];

  const incomeSources = [
    { source: '订单尾款', amount: 15600, percent: 60.5, color: '#6366f1' },
    { source: '订单预付款', amount: 5200, percent: 20.2, color: '#8b5cf6' },
    { source: '教程解锁分成', amount: 3200, percent: 12.4, color: '#a855f7' },
    { source: '邀请奖励', amount: 1800, percent: 6.9, color: '#ec4899' }
  ];

  const recentOrders = [
    { id: '202604012', title: '品牌LOGO设计', client: '张总', amount: 1200, type: '尾款', status: '已完成', time: '2026-04-07' },
    { id: '202604011', title: '产品详情页设计', client: '李总', amount: 300, type: '预付款', status: '进行中', time: '2026-04-06' },
    { id: '202604010', title: '海报设计', client: '王总', amount: 700, type: '尾款', status: '已完成', time: '2026-04-05' },
    { id: '202604009', title: '包装设计', client: '赵总', amount: 500, type: '尾款', status: '已完成', time: '2026-04-04' },
    { id: '202604008', title: 'UI界面设计', client: '孙总', amount: 300, type: '预付款', status: '进行中', time: '2026-04-03' }
  ];

  return (
    <div className="earnings-report">
      {/* Header */}
      <div className="report-header">
        <div className="header-top">
          <h1>收益报表</h1>
          <button className="export-btn">
            <Download size={18} />
            导出
          </button>
        </div>
        <div className="period-selector">
          <button className={`period-btn ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>本周</button>
          <button className={`period-btn ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>本月</button>
          <button className={`period-btn ${period === 'year' ? 'active' : ''}`} onClick={() => setPeriod('year')}>本年</button>
          <button className={`period-btn ${period === 'all' ? 'active' : ''}`} onClick={() => setPeriod('all')}>全部</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card main">
          <div className="card-label">累计收益</div>
          <div className="card-value">¥{summary.total.toLocaleString()}</div>
          <div className="card-trend up">
            <TrendingUp size={14} />
            <span>+12.5%</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-label">本月收益</div>
          <div className="card-value">¥{summary.thisMonth.toLocaleString()}</div>
          <div className="card-change">较上月 +15.2%</div>
        </div>
        <div className="summary-card">
          <div className="card-label">待结算</div>
          <div className="card-value orange">¥{summary.pending.toLocaleString()}</div>
        </div>
        <div className="summary-card">
          <div className="card-label">已提现</div>
          <div className="card-value green">¥{summary.withdrawn.toLocaleString()}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="report-tabs">
        <button className={`report-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          收益概览
        </button>
        <button className={`report-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          订单明细
        </button>
        <button className={`report-tab ${activeTab === 'sources' ? 'active' : ''}`} onClick={() => setActiveTab('sources')}>
          收入来源
        </button>
      </div>

      {/* Content */}
      <div className="report-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            {/* Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <span className="chart-title">收益趋势</span>
                <BarChart3 size={18} />
              </div>
              <div className="bar-chart">
                {monthlyData.slice(0, 5).reverse().map((item, index) => (
                  <div key={index} className="bar-item">
                    <div 
                      className="bar" 
                      style={{ height: `${(item.amount / 5000) * 100}%` }}
                    >
                      <div className="bar-value">¥{item.amount}</div>
                    </div>
                    <div className="bar-label">{item.month.slice(5)}月</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly List */}
            <div className="monthly-list">
              <div className="list-title">月度明细</div>
              {monthlyData.map((item, index) => (
                <div key={index} className="monthly-item">
                  <div className="month-info">
                    <div className="month-label">{item.month}</div>
                    <div className="month-orders">{item.orders}个订单</div>
                  </div>
                  <div className="month-amount">¥{item.amount.toLocaleString()}</div>
                  {item.amountChange !== 0 && (
                    <div className={`month-change ${item.amountChange > 0 ? 'up' : 'down'}`}>
                      {item.amountChange > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {Math.abs(item.amountChange)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <div className="orders-list">
              {recentOrders.map((order, index) => (
                <div key={index} className="order-item">
                  <div className="order-info">
                    <div className="order-title">{order.title}</div>
                    <div className="order-meta">
                      <span>{order.client}</span>
                      <span>•</span>
                      <span>{order.time}</span>
                    </div>
                  </div>
                  <div className="order-right">
                    <div className="order-amount">+¥{order.amount}</div>
                    <div className={`order-status ${order.status === '已完成' ? 'completed' : 'pending'}`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="sources-section">
            <div className="sources-chart">
              <div className="pie-chart-placeholder">
                <div className="pie-circle">
                  <div className="pie-segment" style={{ '--percent': 60.5, '--color': '#6366f1' }}></div>
                  <div className="pie-segment" style={{ '--percent': 20.2, '--color': '#8b5cf6' }}></div>
                  <div className="pie-segment" style={{ '--percent': 12.4, '--color': '#a855f7' }}></div>
                  <div className="pie-segment" style={{ '--percent': 6.9, '--color': '#ec4899' }}></div>
                </div>
              </div>
              <div className="sources-list">
                {incomeSources.map((source, index) => (
                  <div key={index} className="source-item">
                    <div className="source-color" style={{ backgroundColor: source.color }}></div>
                    <div className="source-info">
                      <div className="source-name">{source.source}</div>
                      <div className="source-amount">¥{source.amount.toLocaleString()}</div>
                    </div>
                    <div className="source-percent">{source.percent}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
