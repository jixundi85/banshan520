import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/Toast'
import {
  Sparkles, Wand2, Image, Video, FileText, Music,
  Download, Upload, Copy, Trash2, Star, Clock,
  FolderOpen, Layers, Zap, Palette, Type, MessageSquare,
  ChevronRight, Search, Filter, Grid, List, MoreVertical,
  Check, AlertCircle, RefreshCw, Settings, Bookmark,
  Mic, ImageIcon, Film, PenTool, Sparkle, Workflow, Code, ExternalLink, Star as StarIcon, Zap as ZapIcon
} from 'lucide-react'
import './AIToolsPage.css'

// ======= 大模型工具数据（复用原来的完整数据）=======
const toolCategories = [
  { id: 'all', label: '全部', icon: '🌐' },
  { id: 'llm', label: '大语言模型', icon: '🧠' },
  { id: 'image', label: 'AI 绘图', icon: '🎨' },
  { id: 'video', label: 'AI 视频', icon: '🎬' },
  { id: 'audio', label: 'AI 音频', icon: '🎵' },
  { id: 'code', label: 'AI 编程', icon: '💻' },
  { id: 'write', label: 'AI 写作', icon: '✍️' },
  { id: 'design', label: 'AI 设计', icon: '🖌️' },
  { id: 'agent', label: 'AI Agent', icon: '🤖' },
]

const tools = [
  // ===== 大语言模型 =====
  { id: 1, category: 'llm', hot: true, star: true, name: 'ChatGPT', nameEn: 'ChatGPT', desc: 'OpenAI 旗舰对话 AI，全球最广泛使用的大语言模型，支持 GPT-4o 多模态能力。', url: 'https://chat.openai.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png', tags: ['OpenAI', 'GPT-4o', '多模态'], color: 'from-green-500 to-emerald-600' },
  { id: 2, category: 'llm', hot: true, name: 'Claude', nameEn: 'Claude', desc: 'Anthropic 开发的 AI 助手，以超长上下文窗口和安全对齐著称，擅长写作与分析。', url: 'https://claude.ai', logo: 'https://storage.googleapis.com/anthropic-website/icon-186px.png', tags: ['Anthropic', '长上下文', '代码'], color: 'from-orange-400 to-amber-500' },
  { id: 3, category: 'llm', hot: true, name: 'Gemini', nameEn: 'Gemini', desc: 'Google DeepMind 出品，最强多模态模型之一，深度整合 Google 搜索与 Workspace。', url: 'https://gemini.google.com', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg', tags: ['Google', '多模态', '实时搜索'], color: 'from-blue-500 to-indigo-600' },
  { id: 4, category: 'llm', name: '通义千问', nameEn: 'Qwen', desc: '阿里云推出的大语言模型，中文理解能力突出，支持多轮对话和多模态交互。', url: 'https://tongyi.aliyun.com', logo: 'https://img.alicdn.com/imgextra/i1/O1CN01FNHhcL1BLAH7oVRUZ_!!6000000000104-55-tps-256-256.svg', tags: ['阿里云', '中文优化', '免费'], color: 'from-orange-500 to-red-500' },
  { id: 5, category: 'llm', name: '豆包', nameEn: 'Doubao', desc: '字节跳动出品，抖音旗下 AI 助手，免费使用，中文理解能力强。', url: 'https://www.doubao.com', logo: 'https://lf-web-assets.douyin.com/obj/douyin-web-objects-us/static/favicon.ico', tags: ['字节', '免费', '中文'], color: 'from-red-500 to-pink-600' },
  { id: 6, category: 'llm', name: 'Kimi', nameEn: 'Kimi', desc: '月之暗面出品，超长上下文 AI，支持 200 万字文档处理，文件分析能力极强。', url: 'https://kimi.moonshot.cn', logo: 'https://statics.moonshot.cn/kimi-chat/favicon.ico', tags: ['月之暗面', '超长上下文', '文档'], color: 'from-violet-500 to-purple-600' },
  { id: 7, category: 'llm', hot: true, name: 'DeepSeek', nameEn: 'DeepSeek', desc: '深度求索推出的开源大模型，推理能力超强，成本极低，国内外广泛关注。', url: 'https://chat.deepseek.com', logo: 'https://chat.deepseek.com/favicon.svg', tags: ['开源', '推理强', '国产'], color: 'from-sky-500 to-blue-600' },
  { id: 8, category: 'llm', name: 'Grok', nameEn: 'Grok', desc: 'xAI（马斯克）出品，接入实时 X 平台数据，幽默风趣，无审查限制。', url: 'https://grok.com', logo: 'https://grok.com/favicon.ico', tags: ['xAI', '实时数据', 'X平台'], color: 'from-slate-600 to-slate-800' },

  // ===== AI 绘图 =====
  { id: 9, category: 'image', hot: true, star: true, name: 'Midjourney', nameEn: 'Midjourney', desc: '目前最强美学 AI 绘画工具，生成效果惊艳，广泛用于商业设计与创意视觉。', url: 'https://www.midjourney.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png', tags: ['商业设计', '高质量', '氛围感'], color: 'from-indigo-600 to-violet-700' },
  { id: 10, category: 'image', hot: true, name: 'Stable Diffusion', nameEn: 'Stable Diffusion', desc: '最流行的开源 AI 绘画模型，可本地部署，有丰富的社区模型和插件生态。', url: 'https://stability.ai', logo: 'https://stability.ai/favicon.ico', tags: ['开源', '本地部署', 'LoRA'], color: 'from-yellow-500 to-orange-500' },
  { id: 11, category: 'image', name: 'DALL·E 3', nameEn: 'DALL·E 3', desc: 'OpenAI 出品图像生成模型，与 ChatGPT 深度集成，文字转图片指令理解准确。', url: 'https://openai.com/dall-e-3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png', tags: ['OpenAI', '文字指令', '精准'], color: 'from-green-600 to-teal-500' },
  { id: 12, category: 'image', name: 'Adobe Firefly', nameEn: 'Adobe Firefly', desc: 'Adobe 官方 AI 生成工具，版权安全，深度集成 Photoshop / Illustrator。', url: 'https://firefly.adobe.com', logo: 'https://www.adobe.com/favicon.ico', tags: ['Adobe', '版权安全', 'PS集成'], color: 'from-red-500 to-rose-600' },
  { id: 13, category: 'image', name: 'Ideogram', nameEn: 'Ideogram', desc: '擅长在图像中精准渲染文字的 AI 绘图工具，非常适合海报、品牌设计。', url: 'https://ideogram.ai', logo: 'https://ideogram.ai/favicon.ico', tags: ['文字渲染', '海报', '品牌'], color: 'from-pink-500 to-rose-500' },
  { id: 14, category: 'image', hot: true, name: '通义万象', nameEn: 'Tongyi Wanxiang', desc: '阿里云 AI 绘图工具，中文描述效果好，支持人像、风景、国风等多种风格。', url: 'https://tongyi.aliyun.com/wan', logo: 'https://img.alicdn.com/imgextra/i1/O1CN01FNHhcL1BLAH7oVRUZ_!!6000000000104-55-tps-256-256.svg', tags: ['阿里云', '国风', '中文'], color: 'from-amber-400 to-yellow-500' },
  { id: 15, category: 'image', hot: true, name: '即梦', nameEn: 'Jimeng', desc: '字节跳动 AI 绘画工具，文生图、图生视频效果出色，中文理解精准。', url: 'https://jimeng.jianying.com', logo: 'https://lf-web-assets.douyin.com/obj/douyin-web-objects-us/static/favicon.ico', tags: ['字节', '文生图', '视频'], color: 'from-purple-500 to-pink-600' },
  { id: 16, category: 'image', hot: true, name: '海螺AI', nameEn: 'Hailuo AI', desc: '字节跳动视频生成 AI，支持文生视频、图生视频，生成效果细腻流畅。', url: 'https://hailuoai.video', logo: 'https://lf-web-assets.douyin.com/obj/douyin-web-objects-us/static/favicon.ico', tags: ['字节', '视频生成', '流畅'], color: 'from-cyan-500 to-blue-600' },
  { id: 17, category: 'image', hot: true, name: '可灵AI', nameEn: 'Kling AI', desc: '快手可灵 AI 视频生成模型，支持长达 3 分钟视频生成，效果惊艳。', url: 'https://klingai.com', logo: 'https://klingai.com/favicon.ico', tags: ['快手', '长视频', '高质量'], color: 'from-pink-500 to-rose-600' },

  // ===== AI 视频 =====
  { id: 18, category: 'video', hot: true, star: true, name: 'Sora', nameEn: 'Sora', desc: 'OpenAI 视频生成模型，能生成最长 60 秒的逼真视频，开启视频生成新时代。', url: 'https://openai.com/sora', logo: 'https://openai.com/favicon.ico', tags: ['OpenAI', '60秒', '逼真'], color: 'from-emerald-500 to-teal-600' },
  { id: 19, category: 'video', hot: true, name: 'Runway', nameEn: 'Runway', desc: 'AI 视频创作平台标杆，Gen-3 模型效果惊艳好莱坞级别，广泛用于影视制作。', url: 'https://runwayml.com', logo: 'https://runwayml.com/favicon.ico', tags: ['Gen-3', '好莱坞', '影视'], color: 'from-violet-600 to-purple-700' },
  { id: 20, category: 'video', hot: true, name: 'Pika', nameEn: 'Pika', desc: '创新 AI 视频生成工具，操作简单效果出色，社区活跃，AI 视频新势力。', url: 'https://pika.art', logo: 'https://pika.art/favicon.ico', tags: ['创新', '易用', '社区'], color: 'from-pink-500 to-rose-500' },
  { id: 21, category: 'video', hot: true, name: 'Luma Dream Machine', nameEn: 'Luma AI', desc: 'Luma AI 视频生成模型，生成效果细腻，支持摄像机运动控制。', url: 'https://lumalabs.ai/dream-machine', logo: 'https://lumalabs.ai/favicon.ico', tags: ['摄像机控制', '高质量', '细腻'], color: 'from-amber-500 to-orange-600' },
  { id: 22, category: 'video', name: '智谱清影', nameEn: 'CogVideoX', desc: '智谱 AI 视频生成模型，国产开源视频生成方案，支持中文提示词。', url: 'https://chatglm.cn/video', logo: 'https://www.zhipuai.cn/favicon.ico', tags: ['国产', '开源', '中文'], color: 'from-blue-500 to-cyan-600' },
  { id: 23, category: 'video', name: '腾讯混元', nameEn: 'HunyuanVideo', desc: '腾讯混元视频生成模型，支持中英文提示词，生成效果稳定可靠。', url: 'https://hunyuan.tencent.com', logo: 'https://www.tencent.com/favicon.ico', tags: ['腾讯', '稳定', '中英'], color: 'from-red-500 to-orange-600' },

  // ===== AI 音频 =====
  { id: 24, category: 'audio', hot: true, name: 'Suno', nameEn: 'Suno', desc: 'AI 音乐生成神器，输入歌词或风格描述即可生成完整歌曲，支持多语言。', url: 'https://suno.ai', logo: 'https://suno.ai/favicon.ico', tags: ['音乐生成', '歌词', '多语言'], color: 'from-pink-500 to-purple-600' },
  { id: 25, category: 'audio', hot: true, name: 'ElevenLabs', nameEn: 'ElevenLabs', desc: '最强 AI 语音合成平台，支持上千种声音克隆，音质自然逼真。', url: 'https://elevenlabs.io', logo: 'https://elevenlabs.io/favicon.ico', tags: ['语音合成', '声音克隆', '自然'], color: 'from-blue-500 to-indigo-600' },
  { id: 26, category: 'audio', name: 'Fish Audio', nameEn: 'Fish Audio', desc: '国产开源语音合成工具，支持中文声音克隆，效果出色。', url: 'https://fish.audio', logo: 'https://fish.audio/favicon.ico', tags: ['开源', '中文', '克隆'], color: 'from-cyan-500 to-teal-600' },
  { id: 27, category: 'audio', name: 'CosyVoice', nameEn: 'CosyVoice', desc: '阿里通义开源语音合成项目，支持语音克隆、情感控制。', url: 'https://github.com/ShawnXief/CosyVoice', logo: 'https://img.alicdn.com/imgextra/i1/O1CN01FNHhcL1BLAH7oVRUZ_!!6000000000104-55-tps-256-256.svg', tags: ['阿里', '开源', '情感'], color: 'from-orange-400 to-amber-500' },
  { id: 28, category: 'audio', name: '剪映语音', nameEn: 'Jianying TTS', desc: '字节剪映内置 AI 语音合成，支持多种音色，一键生成配音。', url: 'https://www.capcut.com', logo: 'https://lf-web-assets.douyin.com/obj/douyin-web-objects-us/static/favicon.ico', tags: ['字节', '剪映', '配音'], color: 'from-sky-500 to-blue-600' },

  // ===== AI 编程 =====
  { id: 29, category: 'code', hot: true, star: true, name: 'GitHub Copilot', nameEn: 'Copilot', desc: '微软/GitHub 出品，AI 编程助手标杆，代码补全准确率极高，全球开发者首选。', url: 'https://github.com/features/copilot', logo: 'https://github.githubassets.com/favicons/favicon.svg', tags: ['微软', '代码补全', '全球'], color: 'from-slate-600 to-zinc-700' },
  { id: 30, category: 'code', hot: true, name: 'Cursor', nameEn: 'Cursor', desc: 'AI 代码编辑器，深度集成 GPT-4/Claude，代码生成和重构能力极强。', url: 'https://cursor.sh', logo: 'https://cursor.sh/favicon.ico', tags: ['编辑器', 'GPT-4', '重构'], color: 'from-violet-600 to-purple-700' },
  { id: 31, category: 'code', name: 'Claude Code', nameEn: 'Claude Code', desc: 'Anthropic 官方 CLI 编程工具，深度理解代码库，执行复杂编程任务。', url: 'https://claude.ai/code', logo: 'https://storage.googleapis.com/anthropic-website/icon-186px.png', tags: ['Anthropic', 'CLI', '代码库'], color: 'from-orange-400 to-amber-500' },
  { id: 32, category: 'code', name: 'Replit', nameEn: 'Replit', desc: '在线 AI 编程平台，零配置即开即用，支持 AI 生成完整项目并一键部署。', url: 'https://replit.com', logo: 'https://replit.com/public/icons/favicon-196.png', tags: ['在线IDE', '一键部署', '零配置'], color: 'from-orange-500 to-red-500' },

  // ===== AI 写作 =====
  { id: 33, category: 'write', hot: true, name: 'Notion AI', nameEn: 'Notion AI', desc: 'Notion 内置 AI 写作助手，直接在文档中使用，支持续写、润色、摘要、翻译。', url: 'https://www.notion.so', logo: 'https://www.notion.so/favicon.ico', tags: ['文档', '润色', '摘要'], color: 'from-gray-600 to-zinc-700' },
  { id: 34, category: 'write', name: 'Jasper', nameEn: 'Jasper', desc: '专注营销文案的 AI 写作平台，内置数百种模板，适合广告、邮件、社媒内容创作。', url: 'https://www.jasper.ai', logo: 'https://www.jasper.ai/favicon.ico', tags: ['营销文案', '模板', '团队'], color: 'from-violet-500 to-purple-600' },
  { id: 35, category: 'write', name: '秘塔写作猫', nameEn: 'Mita Writer', desc: '国内领先 AI 写作工具，提供文章写作、改写降重、论文优化等功能，中文最佳。', url: 'https://xiezuocat.com', logo: 'https://xiezuocat.com/favicon.ico', tags: ['中文', '论文', '降重'], color: 'from-teal-500 to-cyan-600' },
  { id: 36, category: 'write', name: '讯飞写作', nameEn: 'iFLYTEK Write', desc: '科大讯飞 AI 写作工具，支持多种文体，中文写作能力强。', url: 'https://xinghuo.xfyun.cn', logo: 'https://www.iflytek.com/favicon.ico', tags: ['讯飞', '中文', '多文体'], color: 'from-blue-500 to-cyan-600' },

  // ===== AI 设计 =====
  { id: 37, category: 'design', hot: true, name: 'Figma AI', nameEn: 'Figma AI', desc: 'Figma 内置 AI 设计功能，支持文字生成 UI 组件、智能自动布局、设计稿翻译。', url: 'https://www.figma.com', logo: 'https://www.figma.com/favicon.ico', tags: ['UI设计', '组件生成', '协作'], color: 'from-pink-500 to-purple-600' },
  { id: 38, category: 'design', name: 'Canva AI', nameEn: 'Canva AI', desc: '全球最大在线设计平台，内置 AI 图像生成、背景移除、智能动效等强大功能。', url: 'https://www.canva.com', logo: 'https://static.canva.com/web/images/8439b51bb7a19f6e65ce1064bc37c908.svg', tags: ['在线设计', '模板', '一键成图'], color: 'from-cyan-500 to-teal-600' },
  { id: 39, category: 'design', name: 'Looka', nameEn: 'Looka', desc: 'AI Logo 设计工具，输入品牌名称和偏好风格，几秒生成专业 Logo 和品牌视觉。', url: 'https://looka.com', logo: 'https://looka.com/favicon.ico', tags: ['Logo设计', '品牌视觉', '简单'], color: 'from-amber-400 to-orange-500' },

  // ===== AI Agent =====
  { id: 40, category: 'agent', hot: true, star: true, name: 'Manus', nameEn: 'Manus', desc: '首个通用 AI Agent，能自主完成复杂任务，操作电脑、浏览网页、写代码一体化。', url: 'https://manus.im', logo: 'https://manus.im/favicon.ico', tags: ['通用Agent', '自主任务', '全能'], color: 'from-violet-600 to-indigo-700' },
  { id: 41, category: 'agent', name: 'AutoGPT', nameEn: 'AutoGPT', desc: '最早的开源 AI Agent 项目，能自主规划子任务并执行，GitHub 百万星项目。', url: 'https://agpt.co', logo: 'https://agpt.co/favicon.ico', tags: ['开源', '自主执行', '任务链'], color: 'from-green-600 to-emerald-700' },
  { id: 42, category: 'agent', name: 'Dify', nameEn: 'Dify', desc: '开源 LLM 应用开发平台，可视化 AI 工作流，快速搭建 RAG 知识库和 AI Agent。', url: 'https://dify.ai', logo: 'https://dify.ai/favicon.ico', tags: ['开源', 'RAG', '工作流'], color: 'from-blue-500 to-cyan-600' },
  { id: 43, category: 'agent', hot: true, name: 'Coze', nameEn: 'Coze', desc: '字节跳动推出的 AI Bot 搭建平台，零代码搭建 AI 助手，可发布到抖音等平台。', url: 'https://www.coze.cn', logo: 'https://www.coze.cn/favicon.ico', tags: ['字节', 'Bot搭建', '无代码'], color: 'from-purple-500 to-violet-600' },
  // ===== Seedance 视频生成 =====
  { id: 44, category: 'video', hot: true, name: 'Seedance 2.0', nameEn: 'Seedance 2.0', desc: '字节跳动Seedance视频生成模型2.0版本，支持4K超清、60fps流畅视频生成，画质与运动细节大幅提升。', url: 'https://seed.bytedance.com/zh/seedance2_0', logo: 'https://lf-web-assets.douyin.com/obj/douyin-web-objects-us/static/favicon.ico', tags: ['字节', 'Seedance', '4K'], color: 'from-pink-500 to-rose-600' },
]

// 热门排行榜
const hotTools = tools.filter(t => t.hot).slice(0, 8)

// ======= 工作流数据 =======
const WORKFLOWS = [
  { id: 'canvas', name: '画布工作流', icon: Sparkles, color: 'from-blue-500 to-cyan-600', url: '/ai-workflow/canvas-free', desc: '可视化编排AI任务，灵活组合多种AI能力' },
  { id: 'drama', name: '短剧漫剧生产流水线', icon: Film, color: 'from-red-500 to-pink-600', url: '/ai-workflow/drama', desc: '一键生成AI短剧全流程，剧本→分镜→角色→视频' },
  { id: 'ad', name: '广告自动生成工作流', icon: ImageIcon, color: 'from-purple-500 to-violet-600', url: '/ai-workflow/ad', desc: '智能生成广告文案、图片、视频，快速产出营销素材' },
  { id: 'avatar', name: '数字人工作流', icon: Video, color: 'from-amber-500 to-orange-600', url: '/ai-workflow/human-clone', desc: '克隆爆款视频风格，生成专属数字人形象与内容' },
]

// 热门提示词数据
const HOT_PROMPTS = [
  { id: 1, title: '电影级风景', prompt: 'Cinematic landscape photography, golden hour, dramatic clouds, 8K, ultra detailed', category: '图像', uses: 12500, rating: 4.9, favorited: false },
  { id: 2, title: '产品展示', prompt: 'Professional product photography, minimalist white background, studio lighting, commercial quality', category: '图像', uses: 8900, rating: 4.8, favorited: true },
  { id: 3, title: '电商主图', prompt: 'E-commerce product hero image, clean composition, lifestyle context, conversion optimized', category: '图像', uses: 15600, rating: 4.7, favorited: false },
  { id: 4, title: '人像写真', prompt: 'Professional portrait photography, soft natural lighting, shallow depth of field, magazine quality', category: '图像', uses: 9800, rating: 4.9, favorited: false },
  { id: 5, title: 'Logo设计', prompt: 'Minimalist logo design, vector style, white background, professional brand identity', category: '图像', uses: 7200, rating: 4.6, favorited: false },
  { id: 6, title: '儿童绘本', prompt: 'Children illustration book style, watercolor, cute characters, vibrant colors, storytelling', category: '图像', uses: 5600, rating: 4.8, favorited: false },
]

export default function CreatorTools() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [selectedTool, setSelectedTool] = useState(null)
  const [showToolModal, setShowToolModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredId, setHoveredId] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [workflowModal, setWorkflowModal] = useState({ show: false, type: null })

  // 筛选工具
  const filteredTools = tools.filter(tool => {
    const matchCategory = activeCategory === 'all' || tool.category === activeCategory
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || tool.name.toLowerCase().includes(q) || tool.desc.toLowerCase().includes(q) || tool.tags.some(t => t.toLowerCase().includes(q))
    return matchCategory && matchSearch
  })

  // 打开工具
  const handleOpenTool = (tool) => {
    setSelectedTool(tool)
    setShowToolModal(true)
  }

  // 打开工作流
  const handleOpenWorkflow = (workflow) => {
    window.open(workflow.url, '_blank')
  }

  // 复制提示词
  const handleCopyPrompt = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast('提示词已复制到剪贴板', 'success')
    } catch {
      showToast('复制失败，请重试', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* 顶部背景 */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-800/50 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-blue-500/5" />
        <div className="container mx-auto px-4 pt-12 pb-8 relative z-10">
          {/* 标题区 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>创作者工具平台</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                AI 创作工具
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              可视化编排AI任务 · 精选全球43款AIGC工具 · 一键直达官网
            </p>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mt-6 max-w-3xl mx-auto">
            {[
              { label: '工作流', value: '4', icon: Sparkles, color: 'text-pink-400' },
              { label: 'AI工具', value: '43', icon: StarIcon, color: 'text-purple-400' },
              { label: '提示词', value: '2,300+', icon: MessageSquare, color: 'text-blue-400' },
              { label: '本月使用', value: '156次', icon: ZapIcon, color: 'text-emerald-400' },
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold">{stat.value}</p>
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-7xl">

        {/* ===== 工作流区域 ===== */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">🎨 AI 工作流</h2>
            <span className="px-2 py-0.5 text-xs bg-pink-500/20 text-pink-400 rounded-full">内置功能</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORKFLOWS.map((workflow) => (
              <div
                key={workflow.id}
                onClick={() => handleOpenWorkflow(workflow)}
                className="relative group cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${workflow.color} opacity-20 blur-xl rounded-2xl group-hover:opacity-30 transition-opacity`} />
                <div className="relative bg-slate-800/80 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${workflow.color} flex items-center justify-center mb-4`}>
                    <workflow.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{workflow.name}</h3>
                  <p className="text-gray-400 text-sm">{workflow.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-pink-400">
                    <span>立即使用</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 大模型导航区域 ===== */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">🌐 全球 AI 大模型中心</h2>
              <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">44款精选</span>
            </div>
            {/* 搜索框 */}
            <div className="tools-search">
              <Search className="tools-search-icon" />
              <input
                className="tools-search-input"
                placeholder="搜索工具名称、标签..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 热门视频大模型横滚 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-400">🎬</span>
              <h3 className="text-white font-semibold">热门视频大模型</h3>
              <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full">TOP视频生成</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {/* 按固定顺序展示 */}
              {['Seedance 2.0', '通义万象', '可灵AI', '海螺AI', 'Sora', 'Runway', 'Pika', 'Luma Dream Machine'].map(name => {
                const tool = tools.find(t => t.name === name)
                if (!tool) return null
                return (
                  <a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-56 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-xl p-4 hover:border-blue-500/40 transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center overflow-hidden`}>
                        <img src={tool.logo} alt={tool.name} className="w-6 h-6 object-contain" onError={e => e.target.style.display='none'} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate">{tool.name}</p>
                        <p className="text-gray-500 text-xs truncate">{tool.nameEn}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs line-clamp-2">{tool.desc}</p>
                    <div className="flex gap-1 mt-3">
                      {tool.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-xs bg-white/5 text-gray-400 rounded">{tag}</span>
                      ))}
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* 分类 Tab */}
          <div className="tools-category-tabs mb-8">
            {toolCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`tools-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {activeCategory === cat.id && (
                  <span className="tools-category-count">
                    {cat.id === 'all' ? tools.length : tools.filter(t => t.category === cat.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 工具卡片网格（全部展示） */}
          <div className="tools-grid">
            {filteredTools.map((tool) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tool-card"
                onMouseEnter={() => setHoveredId(tool.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`tool-card-glow bg-gradient-to-r ${tool.color}`} />
                <div className="tool-card-header">
                  <div className={`tool-card-logo bg-gradient-to-br ${tool.color}`}>
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-9 h-9 object-contain rounded-lg"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="tool-card-name">{tool.name}</h3>
                      {tool.hot && <span className="tool-badge hot">🔥 热门</span>}
                      {tool.star && <span className="tool-badge star">⭐ 精选</span>}
                    </div>
                    <p className="tool-card-name-en">{tool.nameEn}</p>
                  </div>
                  <ExternalLink className={`w-4 h-4 text-gray-600 transition-all duration-200 ${hoveredId === tool.id ? 'text-blue-400 scale-110' : ''}`} />
                </div>
                <p className="tool-card-desc">{tool.desc}</p>
                <div className="tool-card-tags">
                  {tool.tags.map(tag => (
                    <span key={tag} className="tool-tag">{tag}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>

          {/* 无结果 */}
          {filteredTools.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl mb-2">没有找到相关工具</p>
              <p className="text-gray-600 text-sm">换个关键词试试？</p>
            </div>
          )}
        </section>

        {/* ===== 热门提示词 ===== */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">💬 热门提示词库</h2>
            <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">精选模板</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOT_PROMPTS.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/60 border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded">{item.category}</span>
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{item.rating}</span>
                  </div>
                </div>
                <h4 className="text-white font-medium mb-2">{item.title}</h4>
                <p className="text-gray-500 text-xs mb-4 line-clamp-2">{item.prompt}</p>
                <button
                  onClick={() => handleCopyPrompt(item.prompt)}
                  className="w-full py-2 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-gray-400 hover:text-emerald-400 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Copy className="w-4 h-4" />
                  <span>复制提示词</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  )
}
