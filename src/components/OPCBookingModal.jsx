import { useState } from 'react';
import { X, Calendar, DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';

export default function OPCBookingModal({ isOpen, onClose, opcProfile, creator }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const projectTypes = [
    { id: 'ai_short_video', name: 'AI短视频制作', icon: '🎬', price: '¥5,000-20,000' },
    { id: 'digital_human', name: '数字人定制', icon: '👤', price: '¥10,000-50,000' },
    { id: 'ai_customer_service', name: '智能客服搭建', icon: '🤖', price: '¥8,000-30,000' },
    { id: 'content_strategy', name: '内容策略咨询', icon: '📊', price: '¥3,000-10,000' },
    { id: 'ai_training', name: 'AI技能培训', icon: '📚', price: '¥2,000-8,000' },
    { id: 'other', name: '其他定制服务', icon: '🔧', price: '面议' }
  ];

  const budgetRanges = [
    { value: 'below_5k', label: '5,000元以下' },
    { value: '5k_10k', label: '5,000-10,000元' },
    { value: '10k_30k', label: '10,000-30,000元' },
    { value: '30k_50k', label: '30,000-50,000元' },
    { value: 'above_50k', label: '50,000元以上' },
    { value: 'negotiable', label: '面议' }
  ];

  const timelines = [
    { value: 'urgent', label: '紧急（1周内）', icon: '🔥' },
    { value: 'normal', label: '标准（2-4周）', icon: '⏱️' },
    { value: 'relaxed', label: '宽松（1-2月）', icon: '📅' },
    { value: 'flexible', label: '灵活协商', icon: '🤝' }
  ];

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 保存预约记录到 localStorage
    const booking = {
      id: `booking_${Date.now()}`,
      opcId: creator?.id,
      opcName: creator?.name,
      ...formData,
      status: 'pending', // pending, confirmed, rejected, completed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('opcBookings') || '[]');
    localStorage.setItem('opcBookings', JSON.stringify([booking, ...existingBookings]));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // 3秒后关闭
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setStep(1);
      setFormData({
        projectType: '',
        budget: '',
        timeline: '',
        description: '',
        contactName: '',
        contactPhone: '',
        contactEmail: ''
      });
    }, 3000);
  };

  const canProceed = () => {
    if (step === 1) return formData.projectType;
    if (step === 2) return formData.budget && formData.timeline;
    if (step === 3) return formData.description.length >= 20;
    if (step === 4) return formData.contactName && formData.contactPhone;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-xl">
              {creator?.avatar || '👤'}
            </div>
            <div>
              <h3 className="text-white font-semibold">预约 {creator?.name}</h3>
              <p className="text-white/70 text-sm">{opcProfile?.serviceTags?.[0] || '超级个体服务'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress */}
        {!isSuccess && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: '服务类型' },
                { num: 2, label: '预算时间' },
                { num: 3, label: '需求描述' },
                { num: 4, label: '联系方式' }
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s.num 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.num ? <CheckCircle size={16} /> : s.num}
                  </div>
                  <span className={`ml-2 text-sm ${step >= s.num ? 'text-gray-700' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                  {idx < 3 && (
                    <div className={`w-8 h-0.5 mx-2 ${step > s.num ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSuccess ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">预约提交成功！</h3>
              <p className="text-gray-600 mb-4">
                {creator?.name} 将在 {opcProfile?.responseTime || '2小时内'} 回复您
              </p>
              <p className="text-sm text-gray-500">
                预约编号：{`booking_${Date.now()}`}
              </p>
            </div>
          ) : (
            <>
              {/* Step 1: 服务类型 */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">选择服务类型</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {projectTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setFormData({ ...formData, projectType: type.id })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.projectType === type.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="font-medium text-gray-800">{type.name}</div>
                        <div className="text-sm text-gray-500">{type.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: 预算和时间 */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">预算范围</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {budgetRanges.map(range => (
                        <button
                          key={range.value}
                          onClick={() => setFormData({ ...formData, budget: range.value })}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            formData.budget === range.value
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">期望时间</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {timelines.map(time => (
                        <button
                          key={time.value}
                          onClick={() => setFormData({ ...formData, timeline: time.value })}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            formData.timeline === time.value
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          <span className="mr-2">{time.icon}</span>
                          {time.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: 需求描述 */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">描述您的需求</h4>
                  <p className="text-sm text-gray-500">
                    请详细描述您的项目需求，包括目标、预期效果、参考案例等
                  </p>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="例如：我们需要制作一系列AI短视频用于产品推广，目标受众是25-35岁女性，风格希望是时尚科技感..."
                    className="w-full h-48 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="text-right text-sm text-gray-400">
                    {formData.description.length} / 500 字
                  </div>
                </div>
              )}

              {/* Step 4: 联系方式 */}
              {step === 4 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">联系方式</h4>
                  <p className="text-sm text-gray-500">
                    {creator?.name} 将通过以下方式与您联系
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        联系人姓名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="请输入您的姓名"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        联系电话 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="请输入您的手机号"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        电子邮箱
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="请输入您的邮箱（选填）"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                上一步
              </button>
            ) : (
              <div />
            )}
            
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一步
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    提交中...
                  </>
                ) : (
                  '提交预约'
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
