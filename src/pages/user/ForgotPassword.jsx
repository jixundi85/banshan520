import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendCode = async () => {
    if (!phone || phone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setError('');
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('密码至少6位');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      alert('密码重置成功，请使用新密码登录');
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>找回密码</h1>
          <p>通过手机号验证身份</p>
        </div>

        {step === 1 && (
          <div className="auth-step">
            <div className="form-group">
              <label>手机号</label>
              <input
                type="tel"
                placeholder="请输入注册手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
              />
            </div>
            <div className="form-group">
              <label>验证码</label>
              <div className="code-input">
                <input
                  type="text"
                  placeholder="请输入验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                />
                <button
                  className="send-code-btn"
                  onClick={sendCode}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `${countdown}s` : '发送验证码'}
                </button>
              </div>
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button
              className="primary-btn"
              onClick={() => {
                if (code === '123456' || code.length === 6) {
                  setStep(2);
                  setError('');
                } else {
                  setError('请输入正确的验证码');
                }
              }}
            >
              下一步
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="auth-step">
            <div className="form-group">
              <label>新密码</label>
              <input
                type="password"
                placeholder="请输入新密码（至少6位）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>确认密码</label>
              <input
                type="password"
                placeholder="请再次输入新密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button
              className="primary-btn"
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? '重置中...' : '重置密码'}
            </button>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/login">返回登录</Link>
        </div>
      </div>
    </div>
  );
}
