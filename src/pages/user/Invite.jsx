import { useState } from 'react';
import { Users, Gift, Copy, Share2, ChevronRight, TrendingUp, Check } from 'lucide-react';
import './Invite.css';

export default function Invite() {
  const [copied, setCopied] = useState(false);
  const inviteCode = 'JXD20260407';
  const inviteLink = `https://aigc.platform/invite/${inviteCode}`;

  const stats = {
    totalInvited: 28,
    validInvites: 15,
    totalReward: 2850,
    pendingReward: 320
  };

  const rewards = [
    { threshold: 1, desc: '成功邀请1人', reward: 50 },
    { threshold: 5, desc: '成功邀请5人', reward: 100 },
    { threshold: 10, desc: '成功邀请10人', reward: 300 },
    { threshold: 20, desc: '成功邀请20人', reward: 800 },
    { threshold: 50, desc: '成功邀请50人', reward: 2000 }
  ];

  const inviteRecords = [
    { name: '张***', phone: '138****1234', time: '2026-04-06', status: '已消费', reward: 50 },
    { name: '李***', phone: '139****5678', time: '2026-04-05', status: '已消费', reward: 50 },
    { name: '王***', phone: '137****9012', time: '2026-04-04', status: '注册未消费', reward: 0 },
    { name: '赵***', phone: '136****3456', time: '2026-04-03', status: '已消费', reward: 50 }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    const text = `我在半山AIX发现了一个超棒的学习变现平台！使用我的邀请码 ${inviteCode} 注册，双方都可获得积分奖励哦！`;
    const urls = {
      wechat: 'weixin://',
      weibo: `http://service.weibo.com/share/share.php?title=${encodeURIComponent(text)}`,
      qq: `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(inviteLink)}&title=${encodeURIComponent(text)}`
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="invite-page">
      {/* Header */}
      <div className="invite-header">
        <div className="invite-badge">
          <Gift size={28} />
        </div>
        <h1>邀请好友</h1>
        <p>每邀请一位新用户，双方都可获得积分奖励</p>
      </div>

      {/* Stats */}
      <div className="invite-stats">
        <div className="stat-item">
          <div className="stat-value">{stats.totalInvited}</div>
          <div className="stat-label">邀请人数</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-value">{stats.validInvites}</div>
          <div className="stat-label">有效邀请</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-value green">¥{stats.totalReward}</div>
          <div className="stat-label">已获奖励</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-value orange">¥{stats.pendingReward}</div>
          <div className="stat-label">待生效</div>
        </div>
      </div>

      {/* Invite Code */}
      <div className="invite-code-section">
        <div className="section-title">我的邀请码</div>
        <div className="invite-code-box">
          <div className="code-text">{inviteCode}</div>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? '已复制' : '复制'}</span>
          </button>
        </div>
        <div className="invite-link-box">
          <input type="text" value={inviteLink} readOnly />
          <button onClick={handleCopy}>{copied ? '已复制' : '复制链接'}</button>
        </div>
      </div>

      {/* Share */}
      <div className="share-section">
        <div className="section-title">分享到</div>
        <div className="share-buttons">
          <button className="share-btn wechat" onClick={() => handleShare('wechat')}>
            <div className="share-icon">💬</div>
            <span>微信</span>
          </button>
          <button className="share-btn weibo" onClick={() => handleShare('weibo')}>
            <div className="share-icon">🌐</div>
            <span>微博</span>
          </button>
          <button className="share-btn qq" onClick={() => handleShare('qq')}>
            <div className="share-icon">💬</div>
            <span>QQ</span>
          </button>
          <button className="share-btn more" onClick={handleCopy}>
            <div className="share-icon"><Share2 size={20} /></div>
            <span>更多</span>
          </button>
        </div>
      </div>

      {/* Reward Rules */}
      <div className="reward-rules">
        <div className="section-title">邀请奖励规则</div>
        <div className="rules-intro">
          <p>• 被邀请人注册成功：双方各获得 <strong>50积分</strong></p>
          <p>• 被邀请人完成首单消费：邀请人额外获得订单金额的 <strong>10%</strong> 奖励</p>
          <p>• 仅限一级邀请关系，无多级分销</p>
        </div>
        <div className="reward-levels">
          {rewards.map((item, index) => (
            <div key={index} className={`reward-level ${stats.validInvites >= item.threshold ? 'completed' : ''}`}>
              <div className="level-icon">
                {stats.validInvites >= item.threshold ? <Check size={16} /> : index + 1}
              </div>
              <div className="level-info">
                <div className="level-desc">{item.desc}</div>
                <div className="level-reward">+{item.reward}积分</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Records */}
      <div className="invite-records">
        <div className="section-title">邀请记录</div>
        <div className="records-list">
          {inviteRecords.map((record, index) => (
            <div key={index} className="record-item">
              <div className="record-avatar">
                <Users size={20} />
              </div>
              <div className="record-info">
                <div className="record-name">{record.name}</div>
                <div className="record-phone">{record.phone}</div>
              </div>
              <div className="record-meta">
                <div className="record-time">{record.time}</div>
                <div className="record-status">{record.status}</div>
              </div>
              <div className={`record-reward ${record.reward > 0 ? 'has-reward' : ''}`}>
                {record.reward > 0 ? `+${record.reward}` : '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
