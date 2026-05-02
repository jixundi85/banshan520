/**
 * 我要卖版权页面 - 升级版
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCopyrightGoods } from '../../../hooks/useCopyright'
import { COPYRIGHT_CATEGORY_META, COPYRIGHT_TYPE, getCurrentUser } from '../../../data/copyrightSchema'
import { Upload, Image, Video, FileText, X, Check, AlertCircle, ArrowLeft, ArrowRight, Eye } from 'lucide-react'

export default function CopyrightSellPage() {
  const navigate = useNavigate()
  const { publishGoods } = useCopyrightGoods()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const user = getCurrentUser()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
  }, [navigate])

  const [form, setForm] = useState({
    type: COPYRIGHT_TYPE.PORTRAIT,
    subtype: 'digital_human',
    title: '',
    description: '',
    price_points: 0,
    price_cash: 0,
    category: '数字人',
    tags: [],
    cover: '',
    gallery: [],
    video_url: '',
    // 授权信息
    auth_scope: '商用授权',
    auth_duration: '1年',
    auth_region: '中国大陆',
    // 肖像权专属
    portrait_config: {
      usage_scope: [],
      exclusivity: false,
    },
    // 小说版权专属
    novel_config: {
      author: '',
      word_count: 0,
      genre: '',
      episode_count: 0,
    },
    // 影视成品专属
    film_config: {
      duration: 0,
      episodes: 0,
      resolution: '1080P',
      play_count: '',
    },
  })

  // 添加表单验证状态
  const [formErrors, setFormErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const [tagInput, setTagInput] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [coverUrlInput, setCoverUrlInput] = useState('')

  const meta = COPYRIGHT_CATEGORY_META[form.type]

  const subtypeOptions = {
    portrait: [
      { value: 'digital_human', label: 'AI数字人' },
      { value: 'virtual_actor', label: '虚拟演员' },
      { value: 'digital_portrait', label: '数字肖像' },
    ],
    novel: [
      { value: 'web_novel', label: '网络小说' },
      { value: 'short_drama_script', label: '短剧剧本' },
      { value: 'original_literature', label: '原创文学' },
      { value: 'story_ip', label: '故事IP' },
      { value: 'novel_copyright', label: '网文版权' },
    ],
    film: [
      { value: 'ai_short_drama', label: 'AI短剧' },
      { value: 'ai_manga_drama', label: 'AI漫剧' },
      { value: 'ai_micro_film', label: 'AI微电影' },
      { value: 'ai_movie', label: 'AI电影' },
    ],
  }

  const authScopes = ['商用授权', '品牌代言', '改编权', '分销授权', 'IP授权', '全版权']
  const authDurations = ['1年', '2年', '3年', '5年', '永久']
  const authRegions = ['中国大陆', '大中华区', '亚太区', '全球']

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) })
  }

  const handleCoverUpload = () => {
    if (coverUrlInput.trim()) {
      setForm({ ...form, cover: coverUrlInput.trim() })
      setCoverPreview(coverUrlInput.trim())
      setCoverUrlInput('')
    }
  }

  const handleSubmit = () => {
    // 重置错误状态
    setFormErrors({})
    setSubmitError('')

    // 验证必填项
    const errors = {}
    if (!form.title.trim()) errors.title = '请输入商品标题'
    if (!form.description.trim()) errors.description = '请输入商品描述'
    if (!form.cover) errors.cover = '请上传封面图片'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setSubmitError('请完善必填信息后重试')
      // 滚动到第一个错误位置
      const firstError = Object.keys(errors)[0]
      document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    setSubmitError('')

    const subtypeLabel = subtypeOptions[form.type]?.find(o => o.value === form.subtype)?.label || ''
    const userData = user || {}

    const finalData = {
      ...form,
      owner_id: userData.id || 'guest',
      owner_name: userData.name || userData.username || '游客',
      category: subtypeLabel,
    }

    try {
      publishGoods(finalData)
      // 提交成功后跳转
      navigate('/copyright/my-assets')
    } catch (e) {
      setSubmitError('提交失败：' + e.message)
      setSubmitting(false)
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return '选择版权类型'
      case 2: return '填写商品信息'
      case 3: return '设置授权与定价'
      case 4: return '确认并提交'
      default: return ''
    }
  }

  return (
    <div className="pb-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
          {/* 顶部 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">💰</span>
                我要卖版权
              </h1>
              <p className="text-slate-400 mt-2">发布您的版权商品，快速触达买家</p>
            </div>
            <button onClick={() => navigate('/copyright')}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
              返回首页
            </button>
          </div>

          {/* 步骤条 */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  step > s ? 'bg-cyan-500 text-white' :
                  step === s ? 'bg-cyan-500 text-white ring-4 ring-cyan-500/30' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {step > s ? <Check className="w-6 h-6" /> : s}
                </div>
                <div className={`mx-2 text-sm ${step >= s ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {s === 1 && '选择类型'}
                  {s === 2 && '填写信息'}
                  {s === 3 && '授权定价'}
                  {s === 4 && '确认'}
                </div>
                {s < 4 && <div className={`w-12 h-1 mx-2 rounded ${step > s ? 'bg-cyan-500' : 'bg-slate-700'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: 选择类型 */}
          {step === 1 && (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">{getStepTitle()}</h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {Object.entries(COPYRIGHT_CATEGORY_META).map(([key, cat]) => (
                  <div key={key} onClick={() => setForm({ ...form, type: key, subtype: subtypeOptions[key][0].value })}
                    className={`cursor-pointer p-6 rounded-2xl border-2 text-center transition-all hover:scale-105 ${
                      form.type === key ? `border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20` :
                      'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}>
                    <div className={`text-5xl mb-4 bg-gradient-to-br ${cat.gradient} bg-clip-text`}>{cat.icon}</div>
                    <div className="font-bold text-lg text-white mb-1">{cat.name}</div>
                    <div className="text-sm text-slate-400">{cat.desc}</div>
                    {form.type === key && (
                      <div className="mt-3 flex justify-center">
                        <span className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> 已选择
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 子类型 */}
              <div className="bg-slate-700/30 rounded-xl p-4">
                <label className="text-slate-300 text-sm mb-3 block font-medium">具体类型</label>
                <div className="flex flex-wrap gap-2">
                  {subtypeOptions[form.type]?.map(opt => (
                    <button key={opt.value} onClick={() => setForm({ ...form, subtype: opt.value })}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        form.subtype === opt.value ?
                        'bg-cyan-500 text-white' :
                        'bg-slate-600 text-slate-300 hover:bg-slate-500'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={() => setStep(2)}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
                  下一步 <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: 填写信息 */}
          {step === 2 && (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">{getStepTitle()}</h2>

              <div className="space-y-6">
                {/* 封面图 */}
                <div>
                  <label className="text-slate-300 text-sm mb-3 block font-medium flex items-center gap-2">
                    <Image className="w-4 h-4 text-cyan-400" />
                    封面图片 *
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input type="text" value={coverUrlInput}
                        onChange={e => setCoverUrlInput(e.target.value)}
                        placeholder="粘贴图片URL地址..."
                        className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 outline-none ${
                          formErrors.cover ? 'border-red-500' : 'border-slate-600'
                        }`}
                        name="cover"
                      />
                      {formErrors.cover && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.cover}
                        </p>
                      )}
                      <p className="text-slate-500 text-xs mt-2">推荐使用 Unsplash、Pexels 等高清图片链接</p>
                    </div>
                    <button onClick={handleCoverUpload}
                      className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors">
                      确认
                    </button>
                  </div>
                  {coverPreview || form.cover ? (
                    <div className="mt-4 relative w-full aspect-video max-w-md rounded-xl overflow-hidden">
                      <img src={coverPreview || form.cover} alt="封面预览"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://picsum.photos/400/225' }}
                      />
                      <button onClick={() => { setCoverPreview(''); setForm({ ...form, cover: '' }) }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 w-full aspect-video max-w-md border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center">
                      <div className="text-center text-slate-500">
                        <Upload className="w-10 h-10 mx-auto mb-2" />
                        <p>输入URL后点击确认</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 标题 */}
                <div>
                  <label className="text-slate-300 text-sm mb-3 block font-medium">商品标题 *</label>
                  <input type="text" value={form.title}
                    onChange={e => {
                      setForm({ ...form, title: e.target.value })
                      setFormErrors(prev => ({ ...prev, title: '' }))
                    }}
                    placeholder="例如：《重生之我是AI》AI短剧版权"
                    className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 outline-none ${
                      formErrors.title ? 'border-red-500' : 'border-slate-600'
                    }`}
                    name="title"
                  />
                  {formErrors.title && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.title}
                    </p>
                  )}
                </div>

                {/* 描述 */}
                <div>
                  <label className="text-slate-300 text-sm mb-3 block font-medium">商品描述 *</label>
                  <textarea value={form.description}
                    onChange={e => {
                      setForm({ ...form, description: e.target.value })
                      setFormErrors(prev => ({ ...prev, description: '' }))
                    }}
                    placeholder="详细描述商品特点、亮点数据、授权范围、适用场景等，让买家更了解您的商品..."
                    rows={5}
                    className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 outline-none resize-none ${
                      formErrors.description ? 'border-red-500' : 'border-slate-600'
                    }`}
                    name="description"
                  />
                  {formErrors.description && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.description}
                    </p>
                  )}
                </div>

                {/* 标签 */}
                <div>
                  <label className="text-slate-300 text-sm mb-3 block font-medium">标签</label>
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                      placeholder="输入标签后回车"
                      className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                    />
                    <button onClick={handleAddTag}
                      className="px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-500">
                      添加
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full flex items-center gap-1">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 类型专属字段 */}
                {form.type === COPYRIGHT_TYPE.NOVEL && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">作者</label>
                      <input type="text" value={form.novel_config.author}
                        onChange={e => setForm({ ...form, novel_config: { ...form.novel_config, author: e.target.value } })}
                        placeholder="原作者"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">字数</label>
                      <input type="number" value={form.novel_config.word_count}
                        onChange={e => setForm({ ...form, novel_config: { ...form.novel_config, word_count: Number(e.target.value) } })}
                        placeholder="总字数"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                      />
                    </div>
                  </div>
                )}

                {form.type === COPYRIGHT_TYPE.FILM && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">时长(分钟)</label>
                      <input type="number" value={form.film_config.duration}
                        onChange={e => setForm({ ...form, film_config: { ...form.film_config, duration: Number(e.target.value) } })}
                        placeholder="总时长"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">集数</label>
                      <input type="number" value={form.film_config.episodes}
                        onChange={e => setForm({ ...form, film_config: { ...form.film_config, episodes: Number(e.target.value) } })}
                        placeholder="集数"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">播放量</label>
                      <input type="text" value={form.film_config.play_count}
                        onChange={e => setForm({ ...form, film_config: { ...form.film_config, play_count: e.target.value } })}
                        placeholder="如: 5000万+"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)}
                  className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" /> 上一步
                </button>
                <button onClick={() => setStep(3)}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
                  下一步 <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 授权与定价 */}
          {step === 3 && (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">{getStepTitle()}</h2>

              <div className="space-y-6">
                {/* 授权信息 */}
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    授权信息
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-slate-400 text-xs mb-2 block">授权范围</label>
                      <select value={form.auth_scope}
                        onChange={e => setForm({ ...form, auth_scope: e.target.value })}
                        className="w-full bg-slate-600 border border-slate-500 rounded-xl px-4 py-3 text-white">
                        {authScopes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs mb-2 block">授权期限</label>
                      <select value={form.auth_duration}
                        onChange={e => setForm({ ...form, auth_duration: e.target.value })}
                        className="w-full bg-slate-600 border border-slate-500 rounded-xl px-4 py-3 text-white">
                        {authDurations.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs mb-2 block">授权区域</label>
                      <select value={form.auth_region}
                        onChange={e => setForm({ ...form, auth_region: e.target.value })}
                        className="w-full bg-slate-600 border border-slate-500 rounded-xl px-4 py-3 text-white">
                        {authRegions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 价格设置 */}
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">💰</span> 设置价格
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">现金价格 (元)</label>
                      <input type="number" value={form.price_cash}
                        onChange={e => setForm({ ...form, price_cash: Number(e.target.value) })}
                        placeholder="0表示不支持现金"
                        className="w-full bg-slate-600 border border-slate-500 rounded-xl px-4 py-3 text-white text-xl focus:border-cyan-500 outline-none"
                      />
                      <p className="text-slate-500 text-xs mt-2">买家可通过微信/支付宝支付</p>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">积分价格</label>
                      <input type="number" value={form.price_points}
                        onChange={e => setForm({ ...form, price_points: Number(e.target.value) })}
                        placeholder="0表示不支持积分"
                        className="w-full bg-slate-600 border border-slate-500 rounded-xl px-4 py-3 text-white text-xl focus:border-cyan-500 outline-none"
                      />
                      <p className="text-slate-500 text-xs mt-2">1积分 ≈ 0.1元，可用于兑换</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">建议零售价参考：</span>
                      <span className="text-cyan-400">
                        现金 ¥{(form.price_cash || 0).toLocaleString()} / 积分 {(form.price_points || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 提示 */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-amber-400 text-sm">
                      <p className="font-medium mb-1">定价建议</p>
                      <p className="text-amber-400/80">
                        • 独家授权通常比普通授权高50%-100%<br/>
                        • 永久授权通常比限时授权高100%以上<br/>
                        • 建议参考同类商品的市场价格
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(2)}
                  className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" /> 上一步
                </button>
                <button onClick={() => setStep(4)}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
                  下一步 <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: 确认提交 */}
          {step === 4 && (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">{getStepTitle()}</h2>

              {/* 全局错误提示 */}
              {submitError && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-300">{submitError}</span>
                </div>
              )}

              {/* 预览卡片 */}
              <div className="bg-slate-700/30 rounded-2xl overflow-hidden mb-6">
                {form.cover && (
                  <div className="aspect-video">
                    <img src={form.cover} alt="封面预览" className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://picsum.photos/800/450' }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 bg-gradient-to-r ${meta.gradient} text-white text-sm rounded-full`}>
                      {meta.icon} {meta.name}
                    </span>
                    <span className="text-slate-400">{subtypeOptions[form.type]?.find(o => o.value === form.subtype)?.label}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{form.title || '未填写'}</h3>
                  <p className="text-slate-400 mb-4 leading-relaxed">{form.description || '未填写'}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {form.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-700/50 rounded-xl">
                    <div>
                      <div className="text-slate-400 text-xs">授权范围</div>
                      <div className="text-white">{form.auth_scope}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs">授权期限</div>
                      <div className="text-white">{form.auth_duration}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs">授权区域</div>
                      <div className="text-white">{form.auth_region}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-600">
                    <div className="flex gap-4">
                      {form.price_cash > 0 && (
                        <div className="text-2xl font-bold text-cyan-400">¥{form.price_cash.toLocaleString()}</div>
                      )}
                      {form.price_points > 0 && (
                        <div className="text-xl font-bold text-amber-400">⭐ {form.price_points.toLocaleString()}</div>
                      )}
                    </div>
                    <div className="text-slate-400 text-sm">
                      发布者: @{user?.name || user?.username || '游客'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 协议 */}
              <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 w-5 h-5 accent-cyan-500" required />
                  <span className="text-slate-300 text-sm">
                    我已阅读并同意<span className="text-cyan-400">《版权交易平台服务协议》</span>和<span className="text-cyan-400">《版权发布规范》</span>，
                    承诺所发布的版权商品具有合法来源，如有侵权愿承担一切责任。
                  </span>
                </label>
              </div>

              {/* 提示 */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-amber-400 text-sm">
                    <p className="font-medium">审核说明</p>
                    <p className="text-amber-400/80">
                      提交后平台将在24小时内审核，审核通过后商品自动上架。如需加急，请联系客服。
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(3)}
                  className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" /> 修改
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="px-10 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 flex items-center gap-2">
                  {submitting ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      提交中...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      提交审核
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

