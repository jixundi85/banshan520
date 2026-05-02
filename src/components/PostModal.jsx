import { useState, useRef } from 'react'
import { X, Image, Send, Hash } from 'lucide-react'

const categories = [
  { id: 'image', name: 'AI绘图', color: 'bg-brand-purple/20 text-brand-purple' },
  { id: 'video', name: 'AI视频', color: 'bg-brand-blue/20 text-brand-blue' },
  { id: 'film', name: 'AI电影', color: 'bg-brand-orange/20 text-brand-orange' },
  { id: 'tips', name: '技巧分享', color: 'bg-brand-cyan/20 text-brand-cyan' },
  { id: 'discussion', name: '讨论区', color: 'bg-gray-500/20 text-gray-400' },
]

const topicSuggestions = ['#AI绘图', '#即梦教程', '#Stable Diffusion', '#AI变现', '#Midjourney', '#AI视频', '#AI电影']

export default function PostModal({ onClose, onPost }) {
  const [content, setContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('tips')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [posting, setPosting] = useState(false)
  const fileRef = useRef()

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 9) {
      alert('最多上传9张图片')
      return
    }
    const newImages = [...images, ...files]
    setImages(newImages)
    const newPreviews = newImages.map(f => URL.createObjectURL(f))
    setPreviews(newPreviews)
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = newImages.map(f => URL.createObjectURL(f))
    setImages(newImages)
    setPreviews(newPreviews)
  }

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic))
    } else if (selectedTopics.length < 5) {
      setSelectedTopics([...selectedTopics, topic])
    }
  }

  const handlePost = async () => {
    if (!content.trim()) {
      alert('请输入内容')
      return
    }
    setPosting(true)
    // 模拟发布延迟
    await new Promise(r => setTimeout(r, 800))
    const newPost = {
      id: Date.now(),
      author: { name: '当前用户', avatar: '我', isAI: false, level: '社区用户' },
      category: selectedCategory,
      categoryName: categories.find(c => c.id === selectedCategory)?.name || '',
      content: content + (selectedTopics.length ? '\n\n' + selectedTopics.join(' ') : ''),
      images: previews.length ? [previews[0] + `?random=${Date.now()}`] : [],
      likes: 0,
      comments: 0,
      views: 1,
      isLiked: false,
      isBookmarked: false,
      isHot: false,
      createdAt: '刚刚',
    }
    onPost(newPost)
    setPosting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-600">
          <h2 className="text-lg font-bold text-white">发布内容</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-dark-700 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Category */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">选择分类</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? cat.color + ' ring-2 ring-offset-1 ring-offset-dark-900'
                      : 'bg-dark-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="分享你的创作心得、技巧或想法..."
              className="w-full bg-dark-700/50 border border-dark-600 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-brand-purple transition-colors"
              rows={6}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {content.length}/2000
            </div>
          </div>

          {/* Topics */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block flex items-center gap-1">
              <Hash className="w-3 h-3" /> 添加话题（最多5个）
            </label>
            <div className="flex flex-wrap gap-2">
              {topicSuggestions.map(topic => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedTopics.includes(topic)
                      ? 'bg-brand-purple/30 text-brand-purple ring-1 ring-brand-purple/50'
                      : 'bg-dark-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block flex items-center gap-1">
              <Image className="w-4 h-4" /> 添加图片（最多9张）
            </label>
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {previews.length < 9 && (
                <button
                  onClick={() => fileRef.current.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-dark-600 flex items-center justify-center text-gray-500 hover:border-brand-purple hover:text-brand-purple transition-all"
                >
                  <Image className="w-6 h-6" />
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-dark-600 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            发布即表示同意
            <button className="text-brand-purple hover:underline ml-1">社区公约</button>
          </div>
          <button
            onClick={handlePost}
            disabled={posting || !content.trim()}
            className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              posting || !content.trim()
                ? 'bg-dark-600 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:shadow-lg hover:shadow-purple-500/30'
            }`}
          >
            {posting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                发布中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                发布
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
