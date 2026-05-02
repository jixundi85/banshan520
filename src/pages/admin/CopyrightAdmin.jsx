/**
 * 版权商品后台管理
 * 支持：肖像权、小说、影视 三种类型
 * 功能：添加、编辑、删除、上传图片
 */

import { useState, useEffect, useRef } from 'react'
import { Plus, Edit2, Trash2, Search, X, Upload, Image as ImageIcon, Check } from 'lucide-react'

const STORAGE_KEY = 'copyright_goods'

// ============ 初始示例数据 ============
const INITIAL_PORTRAITS = [
  {
    id: 'port_001',
    type: 'portrait',
    title: '苏晴 - 青春偶像演员',
    owner: '数字工坊工作室',
    ownerAvatar: 'https://i.pravatar.cc/100?img=1',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    frontView: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop&q=80',
    sideView: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop&q=80',
    backView: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&h=1200&fit=crop&q=80',
    seatedView: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb5a4?w=800&h=1200&fit=crop&q=80',
    faceCloseup: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    description: '25岁青春偶像风格女演员，拥有清新甜美的外形，适合校园剧、爱情剧、偶像剧等。面部表情丰富，可生成自然流畅的对话视频。',
    tags: ['青春偶像', '甜美', '校园剧', '爱情剧'],
    ageRange: '20-30岁',
    style: '清新自然',
    gender: '女',
    height: '165cm',
    weight: '48kg',
    skinTone: '白皙',
    eyeColor: '棕色',
    hairColor: '黑色长发',
    personality: '开朗活泼，镜头感强',
    price_cash: 28000,
    price_points: 280000,
    status: 'active',
    soldCount: 89,
    rating: 4.9
  }
]

const INITIAL_NOVELS = [
  {
    id: 'nov_001',
    type: 'novel',
    title: '星际流浪者：银河纪元',
    owner: '星河文学社',
    ownerAvatar: 'https://i.pravatar.cc/100?img=11',
    coverImage: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80',
    description: '地球文明毁灭后最后一批人类乘坐"诺亚号"星际飞船寻找新家园的故事。',
    tags: ['科幻', '星际', '冒险'],
    genre: '科幻小说',
    wordCount: 2000000,
    author: '星河作家',
    price_cash: 15000,
    price_points: 150000,
    status: 'active',
    soldCount: 45
  }
]

const INITIAL_FILMS = [
  {
    id: 'film_001',
    type: 'film',
    title: '《星际迷途》第一季',
    owner: '星际影视工坊',
    ownerAvatar: 'https://i.pravatar.cc/100?img=20',
    coverImage: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=60',
    description: '人类首次遭遇外星文明的科幻巨制。全程使用AI生成技术打造震撼视觉效果。',
    tags: ['科幻', '星际', 'AI制作'],
    director: '张导演',
    duration: '120分钟',
    year: 2024,
    price_cash: 58000,
    price_points: 580000,
    status: 'active',
    soldCount: 23
  }
]

const INITIAL_DATA = [...INITIAL_PORTRAITS, ...INITIAL_NOVELS, ...INITIAL_FILMS]

// ============ 工具函数 ============
const typeConfig = {
  portrait: { label: '👤 肖像权', color: '#f59e0b' },
  novel: { label: '📚 小说', color: '#10b981' },
  film: { label: '🎬 影视', color: '#8b5cf6' }
}

// ============ 组件 ============
export default function CopyrightAdmin() {
  const [goods, setGoods] = useState([])
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' | 'edit'
  const [editingItem, setEditingItem] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })

  // 初始化加载
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setGoods(JSON.parse(stored))
      } catch {
        setGoods(INITIAL_DATA)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA))
      }
    } else {
      setGoods(INITIAL_DATA)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA))
    }
  }, [])

  // 保存到localStorage
  const saveToStorage = (newGoods) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGoods))
    setGoods(newGoods)
  }

  // 显示消息
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 2500)
  }

  // 筛选
  const filteredGoods = goods.filter(item => {
    const matchType = filterType === 'all' || item.type === filterType
    const matchSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchType && matchSearch
  })

  // 打开添加弹窗
  const openAddModal = (type) => {
    const baseItem = {
      id: `${type}_${Date.now()}`,
      type,
      title: '',
      owner: '',
      ownerAvatar: '',
      coverImage: '',
      description: '',
      tags: [],
      price_cash: 0,
      price_points: 0,
      status: 'active',
      soldCount: 0,
      rating: 5.0
    }

    if (type === 'portrait') {
      Object.assign(baseItem, {
        frontView: '',
        sideView: '',
        backView: '',
        seatedView: '',
        faceCloseup: '',
        ageRange: '',
        style: '',
        gender: '',
        height: '',
        weight: '',
        skinTone: '',
        eyeColor: '',
        hairColor: '',
        personality: ''
      })
    } else if (type === 'novel') {
      Object.assign(baseItem, {
        thumbnail: '',
        genre: '',
        wordCount: 0,
        author: ''
      })
    } else if (type === 'film') {
      Object.assign(baseItem, {
        thumbnail: '',
        director: '',
        duration: '',
        year: new Date().getFullYear()
      })
    }

    setEditingItem(baseItem)
    setModalMode('add')
    setShowModal(true)
  }

  // 打开编辑弹窗
  const openEditModal = (item) => {
    setEditingItem({ ...item })
    setModalMode('edit')
    setShowModal(true)
  }

  // 关闭弹窗
  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  // 更新字段
  const updateField = (field, value) => {
    setEditingItem(prev => ({ ...prev, [field]: value }))
  }

  // 处理图片上传
  const handleImageUpload = (field, e) => {
    const file = e.target.files[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      console.log('Image loaded, updating field:', field)
      updateField(field, event.target.result)
    }
    reader.onerror = () => {
      console.error('FileReader error')
      showMessage('图片上传失败', 'error')
    }
    reader.readAsDataURL(file)
  }

  // 保存
  const handleSave = () => {
    console.log('Save clicked, title:', editingItem.title)
    if (!editingItem.title.trim()) {
      showMessage('请填写商品名称', 'error')
      return
    }

    const existsIndex = goods.findIndex(g => g.id === editingItem.id)
    let newGoods

    if (existsIndex >= 0) {
      newGoods = [...goods]
      newGoods[existsIndex] = editingItem
    } else {
      newGoods = [...goods, editingItem]
    }

    saveToStorage(newGoods)
    showMessage(modalMode === 'edit' ? '修改成功' : '添加成功')
    closeModal()
  }

  // 删除
  const handleDelete = (id) => {
    if (!confirm('确定要删除这个商品吗？')) return
    const newGoods = goods.filter(g => g.id !== id)
    saveToStorage(newGoods)
    showMessage('删除成功')
  }

  // ==================== 渲染 ====================
  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      {/* 标题 */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 8 }}>
          版权商品管理
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          管理肖像权、小说、影视等版权商品，支持添加、编辑、删除和图片上传
        </p>
      </div>

      {/* 消息提示 */}
      {message.text && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 8,
          marginBottom: 16,
          backgroundColor: message.type === 'error' ? '#ef4444' : '#10b981',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          {message.type === 'error' ? <X size={18} /> : <Check size={18} />}
          {message.text}
        </div>
      )}

      {/* 工具栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        gap: 16,
        flexWrap: 'wrap'
      }}>
        {/* 筛选 */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'all', label: '全部' },
            { key: 'portrait', label: '👤 肖像权' },
            { key: 'novel', label: '📚 小说' },
            { key: 'film', label: '🎬 影视' }
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setFilterType(t.key)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filterType === t.key ? '#06b6d4' : '#334155',
                color: 'white',
                fontSize: 14
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 搜索 + 添加 */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="搜索商品..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px 8px 40px',
                borderRadius: 6,
                border: '1px solid #475569',
                backgroundColor: '#1e293b',
                color: 'white',
                width: 200,
                fontSize: 14
              }}
            />
          </div>

          <button onClick={() => openAddModal('portrait')} style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#f59e0b',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14
          }}>
            <Plus size={18} /> 肖像权
          </button>
          <button onClick={() => openAddModal('novel')} style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#10b981',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14
          }}>
            <Plus size={18} /> 小说
          </button>
          <button onClick={() => openAddModal('film')} style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#8b5cf6',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14
          }}>
            <Plus size={18} /> 影视
          </button>
        </div>
      </div>

      {/* 商品列表 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 16
      }}>
        {filteredGoods.map(item => (
          <div key={item.id} style={{
            backgroundColor: '#1e293b',
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid #334155'
          }}>
            {/* 封面 */}
            <div style={{ height: 160, backgroundColor: '#0f172a', position: 'relative' }}>
              {item.coverImage ? (
                <img src={item.coverImage} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569' }}>
                  <ImageIcon size={48} />
                </div>
              )}
              <span style={{
                position: 'absolute', top: 8, left: 8,
                padding: '4px 8px', borderRadius: 4, fontSize: 12,
                backgroundColor: typeConfig[item.type].color, color: 'white'
              }}>
                {typeConfig[item.type].label}
              </span>
            </div>

            {/* 信息 */}
            <div style={{ padding: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 6 }}>
                {item.title || '(未命名)'}
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
                {item.owner || '未知版权方'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 'bold', color: '#f59e0b' }}>
                  ¥{item.price_cash?.toLocaleString() || 0}
                </span>
                <span style={{
                  fontSize: 12, padding: '2px 8px', borderRadius: 4,
                  backgroundColor: item.status === 'active' ? '#10b981' : '#64748b', color: 'white'
                }}>
                  {item.status === 'active' ? '上架' : '下架'}
                </span>
              </div>

              {/* 操作 */}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => openEditModal(item)} style={{
                  flex: 1, padding: '8px', borderRadius: 6, border: 'none',
                  cursor: 'pointer', backgroundColor: '#334155', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 13
                }}>
                  <Edit2 size={14} /> 编辑
                </button>
                <button onClick={() => handleDelete(item.id)} style={{
                  flex: 1, padding: '8px', borderRadius: 6, border: 'none',
                  cursor: 'pointer', backgroundColor: '#ef4444', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 13
                }}>
                  <Trash2 size={14} /> 删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {filteredGoods.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
          <p>暂无商品</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>点击上方按钮添加新商品</p>
        </div>
      )}

      {/* 编辑弹窗 */}
      {showModal && editingItem && (
        <EditModal
          item={editingItem}
          mode={modalMode}
          onClose={closeModal}
          onSave={handleSave}
          onUpdate={updateField}
          onImageUpload={handleImageUpload}
        />
      )}
    </div>
  )
}

// ============ 编辑弹窗组件 ============
function EditModal({ item, mode, onClose, onSave, onUpdate, onImageUpload }) {
  const config = typeConfig[item.type]

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      zIndex: 1000, padding: 24, overflow: 'auto'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: 12,
        width: '100%',
        maxWidth: 700,
        marginTop: 24
      }}>
        {/* 头部 */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', borderBottom: '1px solid #334155'
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 'bold', color: '#f1f5f9' }}>
            {config.label} - {mode === 'edit' ? '编辑' : '添加'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={24} />
          </button>
        </div>

        {/* 内容 */}
        <div style={{ padding: 24, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>

          {/* 基础信息 */}
          <Section title="基础信息">
            <FormRow>
              <FormInput label="商品名称 *" required value={item.title} onChange={v => onUpdate('title', v)} placeholder="请输入商品名称" />
              <FormInput label="版权方" value={item.owner} onChange={v => onUpdate('owner', v)} placeholder="如：数字工坊" />
            </FormRow>
            <FormRow>
              <FormInput label="现金价格 (¥)" type="number" value={item.price_cash} onChange={v => onUpdate('price_cash', Number(v))} />
              <FormInput label="积分价格" type="number" value={item.price_points} onChange={v => onUpdate('price_points', Number(v))} />
            </FormRow>
            <FormRow>
              <FormSelect label="状态" value={item.status} onChange={v => onUpdate('status', v)}
                options={[{ value: 'active', label: '上架' }, { value: 'inactive', label: '下架' }]} />
              <FormInput label="标签" value={item.tags?.join('、') || ''} onChange={v => onUpdate('tags', v.split('、').filter(t => t.trim()))} placeholder="用顿号分隔" />
            </FormRow>
            <FormTextarea label="商品描述" value={item.description} onChange={v => onUpdate('description', v)} rows={3} />
          </Section>

          {/* 封面图 */}
          <Section title="封面图">
            <ImageUploadField label="封面图（列表展示）" value={item.coverImage} onChange={v => onUpdate('coverImage', v)} onUpload={e => onImageUpload('coverImage', e)} />
          </Section>

          {/* 肖像权特有 */}
          {item.type === 'portrait' && (
            <>
              <Section title="演员图片（5张）">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                  <ImageUploadField label="正面" value={item.frontView} onChange={v => onUpdate('frontView', v)} onUpload={e => onImageUpload('frontView', e)} />
                  <ImageUploadField label="侧面" value={item.sideView} onChange={v => onUpdate('sideView', v)} onUpload={e => onImageUpload('sideView', e)} />
                  <ImageUploadField label="背面" value={item.backView} onChange={v => onUpdate('backView', v)} onUpload={e => onImageUpload('backView', e)} />
                  <ImageUploadField label="坐姿" value={item.seatedView} onChange={v => onUpdate('seatedView', v)} onUpload={e => onImageUpload('seatedView', e)} />
                  <ImageUploadField label="特写" value={item.faceCloseup} onChange={v => onUpdate('faceCloseup', v)} onUpload={e => onImageUpload('faceCloseup', e)} />
                </div>
              </Section>

              <Section title="外貌特征">
                <FormRow>
                  <FormInput label="瞳色" value={item.eyeColor} onChange={v => onUpdate('eyeColor', v)} />
                  <FormInput label="发色" value={item.hairColor} onChange={v => onUpdate('hairColor', v)} />
                  <FormInput label="肤色" value={item.skinTone} onChange={v => onUpdate('skinTone', v)} />
                </FormRow>
                <FormRow>
                  <FormInput label="性别" value={item.gender} onChange={v => onUpdate('gender', v)} />
                  <FormInput label="年龄段" value={item.ageRange} onChange={v => onUpdate('ageRange', v)} />
                  <FormInput label="风格" value={item.style} onChange={v => onUpdate('style', v)} />
                </FormRow>
                <FormRow>
                  <FormInput label="身高" value={item.height} onChange={v => onUpdate('height', v)} />
                  <FormInput label="体重" value={item.weight} onChange={v => onUpdate('weight', v)} />
                </FormRow>
                <FormInput label="性格特点" value={item.personality} onChange={v => onUpdate('personality', v)} />
              </Section>
            </>
          )}

          {/* 小说特有 */}
          {item.type === 'novel' && (
            <Section title="小说信息">
              <FormRow>
                <FormInput label="作者" value={item.author} onChange={v => onUpdate('author', v)} />
                <FormInput label="类型" value={item.genre} onChange={v => onUpdate('genre', v)} />
              </FormRow>
              <FormRow>
                <FormInput label="字数" type="number" value={item.wordCount} onChange={v => onUpdate('wordCount', Number(v))} />
              </FormRow>
            </Section>
          )}

          {/* 影视特有 */}
          {item.type === 'film' && (
            <Section title="影视信息">
              <FormRow>
                <FormInput label="导演" value={item.director} onChange={v => onUpdate('director', v)} />
                <FormInput label="时长" value={item.duration} onChange={v => onUpdate('duration', v)} />
                <FormInput label="年份" type="number" value={item.year} onChange={v => onUpdate('year', Number(v))} />
              </FormRow>
              <ImageUploadField label="缩略图" value={item.thumbnail} onChange={v => onUpdate('thumbnail', v)} onUpload={e => onImageUpload('thumbnail', e)} />
            </Section>
          )}
        </div>

        {/* 底部 */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 12,
          padding: '16px 24px', borderTop: '1px solid #334155'
        }}>
          <button onClick={onClose} style={{
            padding: '10px 24px', borderRadius: 6, border: '1px solid #475569',
            cursor: 'pointer', backgroundColor: 'transparent', color: '#94a3b8'
          }}>
            取消
          </button>
          <button onClick={onSave} style={{
            padding: '10px 24px', borderRadius: 6, border: 'none',
            cursor: 'pointer', backgroundColor: '#06b6d4', color: 'white', fontWeight: 'bold'
          }}>
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ 子组件 ============
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#06b6d4', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #334155' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function FormRow({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: children.length === 2 ? '1fr 1fr' : children.length === 3 ? '1fr 1fr 1fr' : '1fr', gap: 16, marginBottom: 16 }}>
      {children}
    </div>
  )
}

function FormInput({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, color: required ? '#f87171' : '#94a3b8', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 6,
          border: '1px solid #475569', backgroundColor: '#0f172a',
          color: 'white', fontSize: 14, outline: 'none'
        }}
      />
    </div>
  )
}

function FormTextarea({ label, value, onChange, rows = 3 }) {
  return (
    <div style={{ marginTop: 16 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>{label}</label>
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 6,
          border: '1px solid #475569', backgroundColor: '#0f172a',
          color: 'white', fontSize: 14, outline: 'none', resize: 'vertical'
        }}
      />
    </div>
  )
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>{label}</label>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 6,
          border: '1px solid #475569', backgroundColor: '#0f172a',
          color: 'white', fontSize: 14, outline: 'none'
        }}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  )
}

function ImageUploadField({ label, value, onChange, onUpload }) {
  const fileRef = useRef(null)

  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>{label}</label>}

      {value ? (
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <img src={value} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6 }} />
          <button onClick={() => fileRef.current?.click()} style={{
            position: 'absolute', top: 4, right: 36, width: 24, height: 24,
            borderRadius: '50%', border: 'none', backgroundColor: '#3b82f6',
            color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ImageIcon size={14} />
          </button>
          <button onClick={() => onChange('')} style={{
            position: 'absolute', top: 4, right: 4, width: 24, height: 24,
            borderRadius: '50%', border: 'none', backgroundColor: '#ef4444',
            color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: 8 }}>
          <button onClick={() => fileRef.current?.click()} style={{
            width: '100%', height: 100, border: '2px solid #3b82f6', borderRadius: 6,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#3b82f6', gap: 4
          }}>
            <ImageIcon size={28} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>选择本地图片</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>点击此区域上传</span>
          </button>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} style={{ display: 'none' }} />
    </div>
  )
}
