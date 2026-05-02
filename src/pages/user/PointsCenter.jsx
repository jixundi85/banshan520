import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Gift, History, ChevronRight, Zap, ShoppingBag, Calendar, Check } from 'lucide-react';
import './PointsCenter.css';

export default function PointsCenter() {
  const [activeTab, setActiveTab] = useState('earn');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();

  const userPoints = 2580;
  
  const earnWays = [
    { icon: '💰', title: '积分充值', desc: '直接购买积分包', color: '#6366f1' },
    { icon: '📅', title: '每日签到', desc: '连续签到额外奖励', color: '#10b981' },
    { icon: '🎁', title: '任务中心', desc: '完成任务获取积分', color: '#f59e0b' },
    { icon: '👥', title: '邀请返利', desc: '邀请好友获得积分', color: '#ec4899' },
    { icon: '📚', title: '购买课程', desc: '学习课程获积分', color: '#8b5cf6' },
    { icon: '⭐', title: '评价奖励', desc: '评价案例/教程', color: '#06b6d4' }
  ];

  const useWays = [
    { icon: '🔓', title: '解锁教程', desc: '查看完整拆解教程' },
    { icon: '📖', title: '解锁课程', desc: '学习培训课程' },
    { icon: '🎯', title: '平台服务', desc: '使用平台增值服务' },
    { icon: '💵', title: '积分提现', desc: '满100积分可提现' }
  ];

  const transactions = [
    { type: 'earn', desc: '解锁教程奖励', amount: '+50', time: '2026-04-07 14:30' },
    { type: 'spend', desc: '解锁《AI绘图进阶》', amount: '-200', time: '2026-04-07 10:20' },
    { type: 'earn', desc: '每日签到', amount: '+10', time: '2026-04-07 09:00' },
    { type: 'earn', desc: '邀请好友奖励', amount: '+100', time: '2026-04-06 16:45' },
    { type: 'spend', desc: '解锁《Midjourney教程》', amount: '-150', time: '2026-04-06 11:30' }
  ];

  const pointsPackages = [
    { amount: 100, price: 10, bonus: 0 },
    { amount: 500, price: 45, bonus: 25 },
    { amount: 1000, price: 80, bonus: 80 },
    { amount: 2000, price: 150, bonus: 200 }
  ];

  // 积分包购买处理
  const handleBuyPackage = (pkg) => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    navigate('/payment', { 
      state: { 
        type: 'points',
        package: pkg,
        title: `积分包 ${pkg.amount} 积分`,
        amount: pkg.price
      }
    });
  };

  // 积分获取方式点击处理
  const handleEarnClick = (title) => {
    if (title === '积分充值') {
      // 滚动到积分包购买区域
      document.querySelector('.package-grid')?.scrollIntoView({ behavior: 'smooth' });
    } else if (title === '邀请返利') {
      navigate('/user/invite');
    } else if (title === '每日签到') {
      alert('签到功能开发中，连续签到可获得额外积分奖励！');
    } else if (title === '任务中心') {
      alert('任务中心开发中，完成任务可获得积分奖励！');
    } else if (title === '购买课程') {
      navigate('/training');
    } else if (title === '评价奖励') {
      alert('评价功能开发中，评价教程可获得积分奖励！');
    }
  };

  // 积分使用方式点击处理
  const handleUseClick = (title) => {
    if (title === '解锁教程') {
      navigate('/training');
    } else if (title === '解锁课程') {
      navigate('/training');
    } else if (title === '平台服务') {
      alert('平台服务开发中！');
    } else if (title === '积分提现') {
      alert('积分提现功能开发中，满100积分可申请提现！');
    }
  };

  return (
    <div className="points-center">
      {/* Header */}
      <div className="points-header">
        <div className="points-balance">
          <span className="balance-label">我的积分</span>
          <span className="balance-value">{userPoints.toLocaleString()}</span>
        </div>
        <Link to="/user/wallet" className="recharge-btn">充值积分</Link>
      </div>

      {/* Tabs */}
      <div className="points-tabs">
        <button 
          className={`tab-btn ${activeTab === 'earn' ? 'active' : ''}`}
          onClick={() => setActiveTab('earn')}
        >
          获取积分
        </button>
        <button 
          className={`tab-btn ${activeTab === 'use' ? 'active' : ''}`}
          onClick={() => setActiveTab('use')}
        >
          使用积分
        </button>
        <button 
          className={`tab-btn ${activeTab === 'record' ? 'active' : ''}`}
          onClick={() => setActiveTab('record')}
        >
          积分明细
        </button>
      </div>

      {/* Content */}
      <div className="points-content">
        {activeTab === 'earn' && (
          <div className="earn-section">
            <div className="section-title">积分获取方式</div>
            <div className="earn-grid">
              {earnWays.map((item, index) => (
                <div 
                  key={index} 
                  className="earn-item cursor-pointer" 
                  style={{ borderColor: item.color }}
                  onClick={() => handleEarnClick(item.title)}
                >
                  <div className="earn-icon" style={{ backgroundColor: `${item.color}20` }}>
                    <span style={{ fontSize: '24px' }}>{item.icon}</span>
                  </div>
                  <div className="earn-info">
                    <div className="earn-title">{item.title}</div>
                    <div className="earn-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-title">购买积分包</div>
            <div className="package-grid">
              {pointsPackages.map((pkg, index) => (
                <div key={index} className={`package-card ${pkg.bonus > 0 ? 'popular' : ''}`}>
                  {pkg.bonus > 0 && <div className="popular-tag">赠送{pkg.bonus}</div>}
                  <div className="package-amount">{pkg.amount}</div>
                  <div className="package-label">积分</div>
                  <div className="package-price">¥{pkg.price}</div>
                  <button className="package-btn" onClick={() => handleBuyPackage(pkg)}>购买</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'use' && (
          <div className="use-section">
            <div className="section-title">积分用途</div>
            <div className="use-list">
              {useWays.map((item, index) => (
                <div 
                  key={index} 
                  className="use-item cursor-pointer"
                  onClick={() => handleUseClick(item.title)}
                >
                  <div className="use-icon">
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  </div>
                  <div className="use-info">
                    <div className="use-title">{item.title}</div>
                    <div className="use-desc">{item.desc}</div>
                  </div>
                  <ChevronRight size={20} className="use-arrow" />
                </div>
              ))}
            </div>

            <div className="tips-box">
              <div className="tips-title">💡 积分使用小贴士</div>
              <ul className="tips-list">
                <li>积分可用于解锁所有付费教程和课程</li>
                <li>积分有效期为获得后365天内</li>
                <li>积分可兑换平台周边礼品</li>
                <li>满100积分可申请提现</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'record' && (
          <div className="record-section">
            <div className="section-title">积分明细</div>
            <div className="record-list">
              {transactions.map((item, index) => (
                <div key={index} className="record-item">
                  <div className={`record-icon ${item.type}`}>
                    {item.type === 'earn' ? <Zap size={20} /> : <ShoppingBag size={20} />}
                  </div>
                  <div className="record-info">
                    <div className="record-desc">{item.desc}</div>
                    <div className="record-time">{item.time}</div>
                  </div>
                  <div className={`record-amount ${item.type}`}>
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
