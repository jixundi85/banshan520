import { useState } from 'react'
import {
  Search, Bell, Clock, TrendingUp, Star as StarIcon,
  Plus, MessageCircle, Heart, Bookmark, BookOpen, Bot, Gift,
  Image, FileText, Play, ThumbsUp, Calendar, Users, Award,
  CheckCircle, Flame, Upload, RefreshCw
} from 'lucide-react'

// 数据
const TOPICS = ['#工具流', '#工作流', '#提示词', '#模型调优', '#AI短视频', '#AI广告', '#VI设计', '#AI设计', '#影视漫剧', '#踩坑记录', '#效率提升']
const TUTORIAL_CATEGORIES = ['AI短视频', 'AI广告', 'VI设计师', 'AI设计师', '影视漫剧']

const SAMPLE_POSTS = [
  { id: 'p1', author: { name: 'AI操盘手老王', avatar: '王' }, title: '分享一个我用了3个月的AI视频工作流', content: '经过半年摸索，我总结出了一套高效的视频制作流程...', topics: ['#工作流', '#AI短视频'], likes: 128, comments: 34, collects: 56, time: '2小时前' },
  { id: 'p2', author: { name: '设计师小美', avatar: '美' }, title: 'Midjourney提示词进阶技巧', content: '很多新手不知道，提示词不只是写描述...', topics: ['#提示词', '#AI设计'], likes: 256, comments: 89, collects: 134, time: '5小时前' }
]

const SAMPLE_TUTORIALS = [
  { id: 't1', title: 'AI视频剪辑入门到精通', author: '张老师', views: 2341, cover: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=225&fit=crop', category: 'AI短视频' },
  { id: 't2', title: '商业广告AI制作全流程', author: '李导', views: 1892, cover: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=225&fit=crop', category: 'AI广告' },
  { id: 't3', title: 'VI系统设计与AI融合', author: '王设计', views: 1234, cover: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=225&fit=crop', category: 'VI设计师' },
  { id: 't4', title: 'Midjourney实战案例解析', author: '陈设计', views: 3456, cover: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=225&fit=crop', category: 'AI设计师' }
]

const SAMPLE_AI_CONTENT = [
  { id: 'a1', type: 'daily', typeIcon: '📰', typeName: '每日AI经验简报', title: '[简报] 4月28日AI短视频创作热点', summary: 'AI抓取了127篇最新文章，提炼3个核心技巧...', date: '2026-04-28', likes: 89, collects: 34 },
  { id: 'a2', type: 'card', typeIcon: '🃏', typeName: '专题知识卡片', title: '如何让AI视频没有"AI味"', summary: '1. 增加随机性 2. 加入真实纹理...', date: '2026-04-27', likes: 156, collects: 78 }
]

const SAMPLE_REWARDS = [
  { id: 'r1', title: '悬赏500元：拍一组室内家居场景照片', bounty: 500, participants: 12, settleType: '人工评审' },
  { id: 'r2', title: '悬赏1000元：AI视频脚本模板设计', bounty: 1000, participants: 8, settleType: '按点击结算' }
]

// 顶部栏
function TopBar({ searchKeyword, onSearchChange }) {
  return (
    <header className="h-16 bg-slate-800/90 backdrop-blur-lg border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white">碳</div>
        <div>
          <div className="text-white font-bold">阿炭硅工程交流群</div>
          <div className="text-xs text-gray-400">碳硅共生 · 创作者社区</div>
        </div>
      </div>
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <input type="text" value={searchKeyword} onChange={(e) => onSearchChange(e.target.value)} placeholder="搜索话题、教程、悬赏任务..." className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-2.5 px-4 pl-11 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white"><Bell className="w-5 h-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">创</div>
      </div>
    </header>
  )
}

// 左侧菜单
function SideMenu({ activeModule, onModuleChange }) {
  const menuItems = [
    { key: 'exchange', icon: MessageCircle, label: '交流', desc: '经验分享广场' },
    { key: 'tutorial', icon: BookOpen, label: '教程', desc: '免费案例拆解' },
    { key: 'ai-agent', icon: Bot, label: 'AI员工', desc: '智能抓取学习' },
    { key: 'reward', icon: Gift, label: '悬赏', desc: '发布悬赏任务' }
  ]

  return (
    <aside className="w-60 bg-slate-800/50 border-r border-slate-700/50 min-h-[calc(100vh-64px)] p-4 flex flex-col">
      <nav className="flex-1 space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon
          return (
            <button key={item.key} onClick={() => onModuleChange(item.key)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all ${activeModule === item.key ? 'bg-gradient-to-r from-violet-600/20 to-cyan-600/20 text-white border border-violet-500/30' : 'text-gray-400 hover:bg-slate-700/50 hover:text-gray-200'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeModule === item.key ? 'bg-gradient-to-br from-violet-500 to-cyan-500 text-white' : 'bg-slate-700/50'}`}><Icon className="w-5 h-5" /></div>
              <div><div className="font-medium">{item.label}</div><div className="text-xs text-gray-500">{item.desc}</div></div>
            </button>
          )
        })}
      </nav>
      <div className="pt-4 border-t border-slate-700/50">
        <div className="bg-slate-700/30 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">👥</div>
          <div className="text-white font-medium">1,234</div>
          <div className="text-xs text-gray-400">在线创作者</div>
        </div>
      </div>
    </aside>
  )
}

// 交流模块
function ExchangeModule() {
  const [sortBy, setSortBy] = useState('latest')
  const [likedPosts, setLikedPosts] = useState({})
  const [collectedPosts, setCollectedPosts] = useState({})

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button onClick={() => setSortBy('latest')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${sortBy === 'latest' ? 'bg-violet-600 text-white' : 'bg-slate-700/50 text-gray-400'}`}><Clock className="w-4 h-4" />最新</button>
          <button onClick={() => setSortBy('hot')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${sortBy === 'hot' ? 'bg-violet-600 text-white' : 'bg-slate-700/50 text-gray-400'}`}><TrendingUp className="w-4 h-4" />最热</button>
          <button onClick={() => setSortBy('collect')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${sortBy === 'collect' ? 'bg-violet-600 text-white' : 'bg-slate-700/50 text-gray-400'}`}><StarIcon className="w-4 h-4" />收藏</button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm hover:bg-violet-500"><Plus className="w-4 h-4" />发布帖子</button>
      </div>
      <div className="space-y-4">
        {SAMPLE_POSTS.map(post => (
          <div key={post.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-violet-500/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">{post.author.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2"><span className="font-medium text-white">{post.author.name}</span><span className="text-gray-500 text-sm">{post.time}</span></div>
                <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{post.content}</p>
                <div className="flex flex-wrap gap-2 mb-3">{post.topics.map(t => <span key={t} className="text-xs px-2 py-1 bg-violet-600/20 text-violet-400 rounded-lg">{t}</span>)}</div>
                <div className="flex items-center gap-6 text-gray-400 text-sm">
                  <button className={`flex items-center gap-1 ${likedPosts[post.id] ? 'text-red-400' : 'hover:text-red-400'}`} onClick={() => setLikedPosts(prev => ({ ...prev, [post.id]: !prev[post.id] }))}><ThumbsUp className="w-4 h-4" />{post.likes + (likedPosts[post.id] ? 1 : 0)}</button>
                  <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{post.comments}</span>
                  <button className={`flex items-center gap-1 ${collectedPosts[post.id] ? 'text-yellow-400' : 'hover:text-yellow-400'}`} onClick={() => setCollectedPosts(prev => ({ ...prev, [post.id]: !prev[post.id] }))}><Bookmark className="w-4 h-4" />{post.collects + (collectedPosts[post.id] ? 1 : 0)}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 教程模块
function TutorialModule() {
  const [activeCategory, setActiveCategory] = useState('AI短视频')
  const filteredTutorials = SAMPLE_TUTORIALS.filter(t => t.category === activeCategory)

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TUTORIAL_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-xl text-sm whitespace-nowrap ${activeCategory === cat ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white' : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'}`}>{cat}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTutorials.map(tutorial => (
          <div key={tutorial.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all cursor-pointer group">
            <div className="relative"><img src={tutorial.cover} alt="" className="w-full aspect-video object-cover" /><span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-lg">免费</span></div>
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2 line-clamp-1">{tutorial.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-400"><span>{tutorial.author}</span><span className="flex items-center gap-1"><Flame className="w-3 h-3" />{tutorial.views}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// AI员工模块
function AIAgentModule() {
  const [likedContent, setLikedContent] = useState({})
  const [collectedContent, setCollectedContent] = useState({})
  const getTypeColor = (type) => ({ daily: 'bg-blue-500/20 text-blue-400', card: 'bg-green-500/20 text-green-400', path: 'bg-orange-500/20 text-orange-400' }[type] || 'bg-slate-700/50 text-gray-400')

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/20 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-3xl">🤖</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">24小时自动抓取全网AIGC经验</h3>
            <p className="text-gray-400">AI提炼后分享给你 · 持续更新中</p>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500"><RefreshCw className="w-4 h-4" /><span>更新于 2026-04-28 10:23</span></div>
          </div>
          <button className="px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700 flex items-center gap-2"><RefreshCw className="w-4 h-4" />手动刷新</button>
        </div>
      </div>
      <div className="space-y-4">
        {SAMPLE_AI_CONTENT.map(content => (
          <div key={content.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-violet-500/30 transition-all">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-2xl">{content.typeIcon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2"><span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(content.type)}`}>{content.typeName}</span><span className="text-gray-500 text-sm">· {content.date}</span></div>
                <h3 className="text-lg font-semibold text-white mb-2">{content.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{content.summary}</p>
                <div className="flex items-center gap-4">
                  <button className={`flex items-center gap-1 text-sm ${likedContent[content.id] ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`} onClick={() => setLikedContent(prev => ({ ...prev, [content.id]: !prev[content.id] }))}><ThumbsUp className="w-4 h-4" />{content.likes + (likedContent[content.id] ? 1 : 0)}</button>
                  <button className={`flex items-center gap-1 text-sm ${collectedContent[content.id] ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`} onClick={() => setCollectedContent(prev => ({ ...prev, [content.id]: !prev[content.id] }))}><Bookmark className="w-4 h-4" />{content.collects + (collectedContent[content.id] ? 1 : 0)}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 悬赏模块
function RewardModule() {
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Gift className="w-6 h-6 text-green-400" />进行中的悬赏</h3>
        <span className="text-sm text-gray-400">{SAMPLE_REWARDS.length} 个任务</span>
      </div>
      <div className="space-y-4">
        {SAMPLE_REWARDS.map(reward => (
          <div key={reward.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-green-500/30 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-3">{reward.title}</h4>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2"><span className="text-red-500 font-bold text-2xl">¥{reward.bounty}</span><span className="text-gray-500">奖金</span></div>
                  <div className="flex items-center gap-1 text-gray-400"><Users className="w-4 h-4" />已提交 {reward.participants} 份</div>
                </div>
              </div>
              <button onClick={() => setShowSubmitModal(true)} className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-500 shadow-lg shadow-green-500/20">立即参与</button>
            </div>
          </div>
        ))}
      </div>
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><Upload className="w-5 h-5" />提交作品</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm text-gray-400 mb-2">作品描述</label><textarea rows={5} placeholder="详细描述你的作品..." className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-500 resize-none" /></div>
              <div><label className="block text-sm text-gray-400 mb-2">上传文件</label><div className="border-2 border-dashed border-slate-600/50 rounded-xl p-8 text-center"><Upload className="w-8 h-8 mx-auto mb-2 text-gray-500" /><span className="text-gray-400">点击上传图片或视频文件</span></div></div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-slate-700/50">
              <button onClick={() => setShowSubmitModal(false)} className="px-6 py-2.5 bg-slate-700/50 text-gray-300 rounded-xl">取消</button>
              <button onClick={() => { alert('提交成功！'); setShowSubmitModal(false) }} className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl">提交作品</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 主组件
export default function CommunityPage() {
  const [activeModule, setActiveModule] = useState('exchange')
  const [searchKeyword, setSearchKeyword] = useState('')

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <TopBar searchKeyword={searchKeyword} onSearchChange={setSearchKeyword} />
      <div className="flex flex-1">
        <SideMenu activeModule={activeModule} onModuleChange={setActiveModule} />
        <main className="flex-1 overflow-auto min-w-0">
          {activeModule === 'exchange' && <ExchangeModule />}
          {activeModule === 'tutorial' && <TutorialModule />}
          {activeModule === 'ai-agent' && <AIAgentModule />}
          {activeModule === 'reward' && <RewardModule />}
        </main>
      </div>
    </div>
  )
}
