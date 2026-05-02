import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Star, Gift, Zap, Shield, ChevronRight, Check } from 'lucide-react';
import './VIPCenter.css';

export default function VIPCenter() {
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [isVip, setIsVip] = useState(true);
  const vipLevel = 2;
  const navigate = useNavigate();

  const plans = [
    {
      id: 0,
      name: '普通用户',
      price: 0,
      duration: '永久',
      features: [
        '浏览免费案例',
        '参与社区讨论',
        '基础学习功能',
        '普通接单权限'
      ]
    },
    {
      id: 1,
      name: '月度会员',
      price: 29,
      duration: '30天',
      popular: false,
      features: [
        '每月赠送500积分',
        '课程享受9折优惠',
        '优先接单权',
        '免广告体验',
        '专属客服支持',
        '会员专属活动'
      ]
    },
    {
      id: 2,
      name: '年度会员',
      price: 199,
      duration: '365天',
      popular: true,
      features: [
        '每年赠送8000积分',
        '课程享受7折优惠',
        '优先接单权',
        '免广告体验',
        '专属客服支持',
        '会员专属活动',
        '线下沙龙优先参加',
        '专属标识展示'
      ]
    }
  ];

  const vipBenefits = [
    { icon: <Gift size={24} />, title: '积分赠送', desc: '会员期间持续获得积分' },
    { icon: <Zap size={24} />, title: '课程折扣', desc: '全场课程最高7折' },
    { icon: <Shield size={24} />, title: '优先接单', desc: '需求大厅优先展示' },
    { icon: <Star size={24} />, title: '专属活动', desc: '线下沙龙优先权' }
  ];

  return (
    <div className="vip-center">
      {/* Header */}
      <div className="vip-header">
        <div className="vip-badge-large">
          <Crown size={32} />
          <span>VIP {vipLevel}</span>
        </div>
        <div className="vip-status">
          {isVip ? (
            <>
              <span className="status-text">会员有效期至 2027-04-07</span>
              <button 
                className="renew-btn"
                onClick={() => {
                  if (!localStorage.getItem('token')) {
                    navigate('/login');
                    return;
                  }
                  const plan = plans.find(p => p.id === vipLevel);
                  navigate('/payment', {
                    state: {
                      type: 'vip',
                      plan: plan,
                      title: `${plan.name} 续费`,
                      amount: plan.price
                    }
                  });
                }}
              >
                续费会员
              </button>
            </>
          ) : (
            <span className="status-text">开通会员享更多权益</span>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div className="benefits-section">
        <div className="section-title">会员专属权益</div>
        <div className="benefits-grid">
          {vipBenefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <div className="benefit-title">{benefit.title}</div>
              <div className="benefit-desc">{benefit.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="plans-section">
        <div className="section-title">选择会员套餐</div>
        <div className="plans-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && <div className="popular-tag">最受欢迎</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">
                {plan.price === 0 ? '免费' : (
                  <>
                    <span className="currency">¥</span>
                    <span className="amount">{plan.price}</span>
                  </>
                )}
              </div>
              <div className="plan-duration">{plan.duration}</div>
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <Check size={14} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                className={`plan-btn ${selectedPlan === plan.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (plan.price === 0) {
                    alert('您已经是普通用户！');
                  } else if (isVip && plan.id <= vipLevel) {
                    alert('您已拥有此会员等级或更高等级！');
                  } else {
                    if (!localStorage.getItem('token')) {
                      navigate('/login');
                      return;
                    }
                    navigate('/payment', {
                      state: {
                        type: 'vip',
                        plan: plan,
                        title: `${plan.name} ${plan.duration}`,
                        amount: plan.price
                      }
                    });
                  }
                }}
              >
                {isVip && plan.id <= vipLevel ? '当前方案' : '立即开通'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <div className="section-title">常见问题</div>
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-question">会员可以退款吗？</div>
            <div className="faq-answer">会员服务一经开通不支持退款，请谨慎购买。</div>
          </div>
          <div className="faq-item">
            <div className="faq-question">积分会过期吗？</div>
            <div className="faq-answer">会员期间获得的积分在会员到期后365天内有效。</div>
          </div>
          <div className="faq-item">
            <div className="faq-question">如何取消会员？</div>
            <div className="faq-answer">会员到期后自动取消，无需手动操作。</div>
          </div>
        </div>
      </div>
    </div>
  );
}
