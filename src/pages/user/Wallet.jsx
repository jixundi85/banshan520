import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIcon, TrendingUp, TrendingDown, ChevronRight, Banknote, AlertCircle, Lock, CheckCircle, Loader2 } from 'lucide-react';
import './Wallet.css';

export default function Wallet() {
  const [activeTab, setActiveTab] = useState('balance');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState({
    balance: 0,
    frozen: 0,
    totalEarned: 0,
    withdrawable: 0,
    completedOrders: 0
  });
  const [withdrawRecords, setWithdrawRecords] = useState([]);
  const navigate = useNavigate();

  // 加载钱包数据
  useEffect(() => {
    const loadWalletData = () => {
      // 从 localStorage 加载创作者钱包数据
      const creatorWallet = localStorage.getItem('creatorWallet');
      if (creatorWallet) {
        setWalletData(JSON.parse(creatorWallet));
      }

      // 加载提现记录
      const records = localStorage.getItem('withdrawRecords');
      if (records) {
        setWithdrawRecords(JSON.parse(records));
      }

      setLoading(false);
    };
    loadWalletData();
  }, []);

  // 计算实际到账金额（扣除10%手续费）
  const calculateActualAmount = (amount) => {
    return Math.floor(amount * 0.9 * 100) / 100;
  };

  // 计算手续费
  const calculateFee = (amount) => {
    return Math.floor(amount * 0.1 * 100) / 100;
  };

  const recentTransactions = [
    { type: 'income', desc: '订单#202604001 尾款', amount: 7000.00, time: '2026-04-07 15:30', status: 'completed' },
    { type: 'income', desc: '订单#202604001 预付款', amount: 3000.00, time: '2026-04-05 14:45', status: 'completed' },
    { type: 'outcome', desc: '提现到账', amount: -9000.00, time: '2026-04-06 10:20', status: 'completed' },
    { type: 'income', desc: '订单#202604000 尾款', amount: 5600.00, time: '2026-04-03 16:30', status: 'completed' },
    { type: 'income', desc: '订单#202604000 预付款', amount: 2400.00, time: '2026-04-01 10:00', status: 'completed' }
  ];

  const earningsStats = [
    { label: '今日收益', value: walletData.todayEarned || 0, change: 12.5 },
    { label: '本周收益', value: walletData.weekEarned || 0, change: 8.3 },
    { label: '本月收益', value: walletData.monthEarned || 0, change: 15.2 },
    { label: '累计收益', value: walletData.totalEarned || 0, change: null }
  ];

  // 是否可以提现
  const canWithdraw = walletData.withdrawable > 0 && walletData.completedOrders > 0;

  if (loading) {
    return (
      <div className="wallet">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="wallet">
      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-header">
          <WalletIcon size={24} />
          <span>我的钱包</span>
        </div>
        <div className="balance-main">
          <div className="balance-amount">
            <span className="currency">¥</span>
            <span className="number">{walletData.balance.toLocaleString()}</span>
          </div>
          <div className="balance-desc">
            可提现余额 
            {!canWithdraw && <span className="text-amber-400 text-xs ml-2">（有进行中订单）</span>}
          </div>
        </div>
        <div className="balance-details">
          <div className="balance-item">
            <span className="label">冻结中（进行中）</span>
            <span className="value">¥{walletData.frozen.toLocaleString()}</span>
          </div>
          <div className="balance-item">
            <span className="label">累计收益</span>
            <span className="value green">¥{walletData.totalEarned.toLocaleString()}</span>
          </div>
          <div className="balance-item">
            <span className="label">已完成订单</span>
            <span className="value">{walletData.completedOrders} 单</span>
          </div>
        </div>
        <div className="balance-actions">
          <button 
            className="action-btn withdraw"
            onClick={() => {
              if (!localStorage.getItem('token')) {
                navigate('/login');
                return;
              }
              setActiveTab('withdraw');
            }}
          >
            提现
          </button>
          <button 
            className="action-btn recharge"
            onClick={() => {
              if (!localStorage.getItem('token')) {
                navigate('/login');
                return;
              }
              navigate('/user/points');
            }}
          >
            充值
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="wallet-tabs">
        <button 
          className={`wallet-tab ${activeTab === 'balance' ? 'active' : ''}`}
          onClick={() => setActiveTab('balance')}
        >
          收支明细
        </button>
        <button 
          className={`wallet-tab ${activeTab === 'earnings' ? 'active' : ''}`}
          onClick={() => setActiveTab('earnings')}
        >
          收益统计
        </button>
        <button 
          className={`wallet-tab ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          提现记录
        </button>
      </div>

      {/* Content */}
      <div className="wallet-content">
        {activeTab === 'balance' && (
          <div className="transaction-list">
            {recentTransactions.map((item, index) => (
              <div key={index} className="transaction-item">
                <div className={`transaction-icon ${item.type}`}>
                  {item.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div className="transaction-info">
                  <div className="transaction-desc">{item.desc}</div>
                  <div className="transaction-time">{item.time}</div>
                </div>
                <div className={`transaction-amount ${item.type}`}>
                  {item.amount > 0 ? '+' : ''}{item.amount >= 0 ? '¥' : '¥'}{Math.abs(item.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="earnings-stats">
            <div className="stats-grid">
              {earningsStats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value">¥{stat.value.toLocaleString()}</div>
                  {stat.change !== null && (
                    <div className="stat-change positive">
                      ↑ {stat.change}%
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="earnings-chart-placeholder">
              <div className="chart-title">收益趋势</div>
              <div className="chart-bars">
                {[40, 65, 45, 80, 70, 90, 85].map((h, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="chart-labels">
                <span>周一</span>
                <span>周二</span>
                <span>周三</span>
                <span>周四</span>
                <span>周五</span>
                <span>周六</span>
                <span>周日</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="withdraw-section">
            {!canWithdraw ? (
              <div className="withdraw-info-card" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                <Lock size={20} color="#f59e0b" />
                <div className="withdraw-info">
                  <div className="info-title" style={{ color: '#f59e0b' }}>提现受限</div>
                  <ul className="info-list">
                    <li>您有进行中的订单，暂不可提现</li>
                    <li>仅订单状态为"已完成"时可发起提现</li>
                    <li>完成所有进行中的订单后即可提现</li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <div className="withdraw-info-card">
                  <AlertCircle size={20} />
                  <div className="withdraw-info">
                    <div className="info-title">提现说明</div>
                    <ul className="info-list">
                      <li>最低提现额度：100元</li>
                      <li>平台技术服务费：10%</li>
                      <li>实际到账金额 = 提现金额 × 90%</li>
                      <li>提现将在1-3个工作日到账</li>
                    </ul>
                  </div>
                </div>
                <div className="withdraw-form">
                  <div className="form-item">
                    <label>提现金额</label>
                    <input 
                      type="number" 
                      placeholder="请输入提现金额" 
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <div className="form-tip">可提现 ¥{walletData.withdrawable.toLocaleString()}</div>
                  </div>
                  
                  {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
                    <div className="form-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>提现金额</span>
                        <span style={{ color: '#fff', fontSize: '14px' }}>¥{parseFloat(withdrawAmount).toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>平台服务费 (10%)</span>
                        <span style={{ color: '#ef4444', fontSize: '14px' }}>-¥{calculateFee(parseFloat(withdrawAmount)).toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: 500 }}>实际到账</span>
                        <span style={{ color: '#10b981', fontSize: '16px', fontWeight: 600 }}>¥{calculateActualAmount(parseFloat(withdrawAmount)).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="form-item">
                    <label>到账账户</label>
                    <div className="account-selector">
                      <Banknote size={20} />
                      <span>微信钱包</span>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                  <button 
                    className="withdraw-submit"
                    disabled={!canWithdraw}
                    onClick={() => {
                      const amount = parseFloat(withdrawAmount);
                      if (!amount || amount < 100) {
                        alert('最低提现金额为100元！');
                        return;
                      }
                      if (amount > walletData.withdrawable) {
                        alert('提现金额不能超过可提现余额！');
                        return;
                      }
                      
                      const actualAmount = calculateActualAmount(amount);
                      const fee = calculateFee(amount);
                      
                      // 保存提现记录
                      const record = {
                        id: Date.now(),
                        amount: amount,
                        fee: fee,
                        actualAmount: actualAmount,
                        status: 'processing',
                        createdAt: new Date().toISOString(),
                        account: '微信钱包'
                      };
                      
                      const newRecords = [record, ...withdrawRecords];
                      localStorage.setItem('withdrawRecords', JSON.stringify(newRecords));
                      setWithdrawRecords(newRecords);
                      
                      // 更新钱包余额
                      const newWallet = {
                        ...walletData,
                        balance: walletData.balance - amount,
                        withdrawable: walletData.withdrawable - amount
                      };
                      localStorage.setItem('creatorWallet', JSON.stringify(newWallet));
                      setWalletData(newWallet);
                      
                      alert(`提现申请已提交！\n提现金额：¥${amount.toLocaleString()}\n平台服务费：¥${fee.toLocaleString()}\n实际到账：¥${actualAmount.toLocaleString()}\n\n预计1-3个工作日到账`);
                      setWithdrawAmount('');
                    }}
                  >
                    立即提现
                  </button>
                </div>
                
                {/* 提现记录 */}
                {withdrawRecords.length > 0 && (
                  <div style={{ marginTop: '32px' }}>
                    <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>提现记录</h3>
                    <div className="transaction-list">
                      {withdrawRecords.map((record) => (
                        <div key={record.id} className="transaction-item">
                          <div className="transaction-icon outcome">
                            <TrendingDown size={20} />
                          </div>
                          <div className="transaction-info">
                            <div className="transaction-desc">提现到{record.account}</div>
                            <div className="transaction-time">{new Date(record.createdAt).toLocaleString('zh-CN')}</div>
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                              服务费 ¥{record.fee.toLocaleString()} | 实到 ¥{record.actualAmount.toLocaleString()}
                            </div>
                          </div>
                          <div className="transaction-amount outcome">
                            -¥{record.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
