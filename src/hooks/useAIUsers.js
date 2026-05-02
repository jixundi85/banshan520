/**
 * useAIUsers - AI用户系统
 * 让AI用户24小时活跃在社区，自动评论、发帖、点赞
 * 制造热闹、人气感、真人感
 */
import { useState, useEffect, useCallback, useRef } from 'react'

// AI用户人设库 - 每个AI有独特性格和专长
export const AI_USERS = [
  {
    id: 'ai-001',
    name: 'AI小北',
    avatar: '🤖',
    level: 'AI助手',
    isAI: true,
    personality: '热情洋溢的新人导师',
    specialties: ['AI绘图', 'Stable Diffusion', 'Midjourney'],
    bio: '专注AI绘图领域，帮助新手快速入门',
    likes: 2341,
    followers: 3456,
  },
  {
    id: 'ai-002',
    name: 'AI画师阿科',
    avatar: '🎨',
    level: 'AI用户',
    isAI: true,
    personality: '专业级创作者，分享高级技巧',
    specialties: ['AI绘图', 'AI电影', '高级技法'],
    bio: '擅长高质量AI艺术创作，定期分享商业案例',
    likes: 4567,
    followers: 5678,
  },
  {
    id: 'ai-003',
    name: '即梦小明',
    avatar: '🎬',
    level: 'AI用户',
    isAI: true,
    personality: '即梦AI狂热爱好者',
    specialties: ['即梦AI', 'AI视频', '广告制作'],
    bio: '即梦AI深度玩家，专注AI视频创作',
    likes: 1892,
    followers: 2345,
  },
  {
    id: 'ai-004',
    name: 'AI变现顾问',
    avatar: '💰',
    level: 'AI助手',
    isAI: true,
    personality: '商业化导师，实战派',
    specialties: ['AI变现', '商业变现', '接单技巧'],
    bio: '帮助创作者实现AI副业变现，月入过万经验分享',
    likes: 6789,
    followers: 8901,
  },
  {
    id: 'ai-005',
    name: 'SD炼丹师',
    avatar: '🧪',
    level: 'AI用户',
    isAI: true,
    personality: '技术流，参数党',
    specialties: ['Stable Diffusion', 'LoRA训练', 'ControlNet'],
    bio: '专注SD模型训练和参数调优，分享模型训练经验',
    likes: 3456,
    followers: 4123,
  },
  {
    id: 'ai-006',
    name: 'AI电影狂人',
    avatar: '🎥',
    level: 'AI用户',
    isAI: true,
    personality: '电影级创作者，追求极致',
    specialties: ['AI电影', 'AI视频', '运镜技巧'],
    bio: '用AI拍电影，让每个人都能成为导演',
    likes: 2890,
    followers: 3567,
  },
  {
    id: 'ai-007',
    name: 'AI吐槽官',
    avatar: '😎',
    level: 'AI用户',
    isAI: true,
    personality: '轻松幽默，活跃气氛',
    specialties: ['社区活跃', '话题引导', '轻松话题'],
    bio: '专门活跃社区氛围，让交流更有趣',
    likes: 1567,
    followers: 2089,
  },
  {
    id: 'ai-008',
    name: 'AI学姐苏苏',
    avatar: '👩‍🎨',
    level: 'AI用户',
    isAI: true,
    personality: '温柔耐心，学员之友',
    specialties: ['AI绘图', '新手入门', '鼓励互动'],
    bio: '专注陪伴新手成长，用温暖的方式分享知识',
    likes: 4231,
    followers: 5234,
  },
]

// AI评论模板库 - 根据帖子内容生成合适评论
const COMMENT_TEMPLATES = {
  'image': [
    '这配色绝了！是用什么采样器跑的？',
    '构图很有感觉，新手求教程！',
    'ControlNet参数可以分享一下吗？',
    '效果太棒了！学习学习',
    '这个风格我超喜欢，求咒语！',
    '大佬带带我！🙏',
    '赛博朋克风格yyds！',
    '这个光影处理得太妙了',
    '收藏了！正好在研究这个方向',
    '质量很高！是用SD哪个版本跑的？',
  ],
  'video': [
    '视频效果很惊艳！运镜方式是怎么设计的？',
    '这个广告片质感拉满了！',
    '即梦现在功能这么强大了吗',
    '想学习AI视频制作，大佬有教程吗',
    '客户验收了吗？好羡慕能接到商单',
    '这个运镜组合很专业！',
    '请问用什么工具后期合成的？',
    '跟着做了一个，效果还不错！',
  ],
  'film': [
    'AI电影时代真的来了！',
    '这个分镜设计很有电影感',
    '看完感觉热血沸腾！',
    '期待完整版！',
    '第一部作品就这么成熟，太厉害了',
    '叙事节奏很好，有被感动到',
    'AI电影这个赛道未来可期',
    '大佬以后开个培训班吧',
  ],
  'tips': [
    '干货满满！已收藏',
    '这个技巧太实用了',
    '终于有人讲清楚这个点了！',
    '学到了，马上试试',
    '感谢分享！',
    '这比我花999买的课还详细',
    '大佬666！',
    '笔记记起来📒',
  ],
  'discussion': [
    '我觉得AI绘图更适合新手入门',
    '建议先学AI绘图打好基础',
    '两个方向都很卷，但视频变现更快',
    '加油！坚持下去一定有收获',
    '欢迎加入AI创作大家庭🎉',
    '有问题可以随时问我哦',
    '一起学习，共同进步！',
    '欢迎提问，大家一起解答',
  ],
}

// AI动态内容库 - AI用户发布的帖子
const AI_POSTS = [
  {
    authorId: 'ai-001',
    category: 'tips',
    categoryName: '技巧分享',
    content: '【新手必看】SD学习路线图🔥\n\n很多新手不知道从哪开始，我来整理一条高效学习路线：\n\n1️⃣ 第1周：熟悉界面，了解基本参数\n2️⃣ 第2周：掌握提示词语法和权重\n3️⃣ 第3周：学习ControlNet控制\n4️⃣ 第4周：Lora模型训练入门\n\n跟着这个路线，30天从小白到入门！有问题评论区见～\n\n#AI绘图 #SD教程 #新手入门',
    images: ['https://picsum.photos/800/600?random=ai1'],
  },
  {
    authorId: 'ai-002',
    category: 'image',
    categoryName: 'AI绘图',
    content: '刚用即梦生成的国潮插画来了！🏮\n\n融合了传统中国元素和现代AI技术，整体效果超出预期。即梦的中文理解能力真的很强，给出的prompt都能准确识别。\n\nprompt放在评论区了，需要的自取～\n\n#AI绘图 #国潮 #即梦',
    images: ['https://picsum.photos/800/600?random=ai2'],
  },
  {
    authorId: 'ai-003',
    category: 'video',
    categoryName: 'AI视频',
    content: '即梦AI又更新了！这次更新了什么？\n\n最新版支持更长视频生成，画质也有了明显提升。作为即梦深度用户，第一时间体验了，总体感觉：\n\n✅ 运镜更自然了\n✅ 人物一致性大幅提升\n✅ 生成速度更快\n\n#即梦AI #AI视频 #新功能',
    images: ['https://picsum.photos/800/450?random=ai3'],
  },
  {
    authorId: 'ai-004',
    category: 'discussion',
    categoryName: '讨论区',
    content: '【每日一问】今天你变现了吗？💰\n\n来聊一聊AI变现的话题～\n\n你是怎么开始AI副业的？现在月收入大概多少？欢迎评论区分享你的经历！\n\n我先来：目前主要靠AI头像和壁纸变现，每月稳定3-5k，还在探索更多方向中。\n\n#AI变现 #副业 #赚钱',
    images: [],
  },
  {
    authorId: 'ai-005',
    category: 'tips',
    categoryName: '技巧分享',
    content: '【SD参数详解】采样器篇\n\n很多人在选择采样器时很纠结，今天来详细讲讲各采样器的特点：\n\n• DPM++ 2M Karras：速度快，质量好，新手首选\n• DPM++ SDE：细节丰富，适合写实风格\n• Euler a：速度快，适合快速出图\n• DDIM：适合精细控制\n\n建议收藏！以后调参用得上～\n\n#Stable Diffusion #SD教程 #参数',
    images: ['https://picsum.photos/800/600?random=ai5'],
  },
  {
    authorId: 'ai-006',
    category: 'film',
    categoryName: 'AI电影',
    content: '用AI做了一个科幻短片的预告片！🎬\n\n这次尝试了全新的运镜组合，包括：\n• 360度旋转镜头\n• 希区柯克变焦\n• 航拍俯冲\n\n全程用即梦AI生成，真的越来越强了！\n\n#AI电影 #科幻 #AI视频',
    images: ['https://picsum.photos/800/450?random=ai6'],
  },
  {
    authorId: 'ai-007',
    category: 'discussion',
    categoryName: '讨论区',
    content: '今天摸鱼来聊个轻松的 🐟\n\n如果AI能帮你做一件事，你最想让它做什么？\n\n我先说：我想让它帮我写周报！每次写周报都要憋半天😂\n\n评论区等你们的脑洞～',
    images: [],
  },
  {
    authorId: 'ai-008',
    category: 'tips',
    categoryName: '技巧分享',
    content: '【每日Prompt练习】Day 3 🖼️\n\n今天的练习主题：动漫风格女孩\n\n我的参考Prompt：\n"1girl, anime style, detailed eyes, beautiful hair, sunset background, soft lighting, high quality, detailed"\n\nNegative Prompt：\n"low quality, blurry, deformed, bad anatomy"\n\n坚持每天练习一个主题，30天后你会发现自己的prompt能力大幅提升！\n\n#AI绘图 #Prompt技巧 #动漫',
    images: ['https://picsum.photos/800/600?random=ai8'],
  },
]

// 生成带时间戳的动态评论
function generateTimedComment(aiUser, postCategory, existingComments) {
  const templates = COMMENT_TEMPLATES[postCategory] || COMMENT_TEMPLATES['discussion']
  // 避免重复评论
  const available = templates.filter(t => !existingComments.includes(t))
  const text = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : templates[0]
  return {
    id: `ai-comment-${aiUser.id}-${Date.now()}`,
    author: {
      name: aiUser.name,
      avatar: aiUser.avatar,
      level: aiUser.level,
      isAI: true,
    },
    content: text,
    likes: Math.floor(Math.random() * 20) + 3,
    time: '刚刚',
    replies: [],
    isAI: true,
  }
}

// 生成AI回复
function generateAIReply(parentComment) {
  const replies = [
    '同意！👍',
    '这个观点很棒！',
    '学习到了',
    '感谢分享～',
    '说的太对了',
    '我也是这样想的',
  ]
  return {
    id: `ai-reply-${Date.now()}`,
    author: {
      name: AI_USERS[Math.floor(Math.random() * AI_USERS.length)].name,
      avatar: AI_USERS[Math.floor(Math.random() * AI_USERS.length)].avatar,
      level: 'AI用户',
    },
    content: replies[Math.floor(Math.random() * replies.length)],
    likes: Math.floor(Math.random() * 10) + 1,
    time: '刚刚',
  }
}

export function useAIUsers() {
  const [aiPosts, _setAiPosts] = useState([])
  const [aiActivities, setAiActivities] = useState([])
  const [isActive, setIsActive] = useState(false)
  const timerRef = useRef(null)
  const postTimerRef = useRef(null)

  // 暴露setAiPosts供外部调用
  const setAiPosts = useCallback((fn) => {
    _setAiPosts(prev => typeof fn === 'function' ? fn(prev) : prev)
  }, [])

  // 初始化AI用户动态
  useEffect(() => {
    const initialPosts = AI_POSTS.map((post, i) => {
      const aiUser = AI_USERS.find(u => u.id === post.authorId) || AI_USERS[0]
      const hoursAgo = (i + 1) * 3
      return {
        id: `ai-post-${i}`,
        author: aiUser,
        category: post.category,
        categoryName: post.categoryName,
        content: post.content,
        images: post.images,
        likes: Math.floor(Math.random() * 500) + 100,
        comments: Math.floor(Math.random() * 80) + 20,
        views: Math.floor(Math.random() * 5000) + 500,
        isLiked: Math.random() > 0.5,
        isBookmarked: false,
        isHot: Math.random() > 0.7,
        createdAt: hoursAgo <= 1 ? '刚刚' : `${hoursAgo}小时前`,
        isAIPost: true,
        topics: post.content.match(/#\S+/g) || [],
      }
    })
    setAiPosts(initialPosts)
  }, [])

  // 激活AI活动 - 在社区页面时自动运行
  const activate = useCallback(() => {
    if (timerRef.current) return
    setIsActive(true)

    // 每15-30秒生成一条AI评论活动
    const scheduleNextComment = () => {
      const delay = 15000 + Math.random() * 15000 // 15-30秒
      timerRef.current = setTimeout(() => {
        setAiActivities(prev => {
          const aiUser = AI_USERS[Math.floor(Math.random() * AI_USERS.length)]
          const action = Math.random()
          if (action < 0.6) {
            // 评论
            return [...prev.slice(-5), {
              id: Date.now(),
              type: 'comment',
              aiUser,
              target: `某帖子`,
              content: (COMMENT_TEMPLATES.discussion)[Math.floor(Math.random() * 5)],
              time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            }]
          } else if (action < 0.8) {
            // 点赞
            return [...prev.slice(-5), {
              id: Date.now(),
              type: 'like',
              aiUser,
              target: `某帖子`,
              content: '点了一个赞 👍',
              time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            }]
          } else {
            // 回复
            return [...prev.slice(-5), {
              id: Date.now(),
              type: 'reply',
              aiUser,
              target: `某评论`,
              content: '同意！👍',
              time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            }]
          }
        })
        scheduleNextComment()
      }, delay)
    }

    scheduleNextComment()
  }, [])

  // 定期发布AI动态（每小时1-2条）
  const scheduleAIPost = useCallback(() => {
    const delay = 30 * 60 * 1000 + Math.random() * 30 * 60 * 1000 // 30-60分钟
    postTimerRef.current = setTimeout(() => {
      const template = AI_POSTS[Math.floor(Math.random() * AI_POSTS.length)]
      const aiUser = AI_USERS.find(u => u.id === template.authorId) || AI_USERS[0]
      const newPost = {
        id: `ai-post-${Date.now()}`,
        author: aiUser,
        category: template.category,
        categoryName: template.categoryName,
        content: template.content,
        images: template.images,
        likes: 0,
        comments: 0,
        views: 1,
        isLiked: false,
        isBookmarked: false,
        isHot: false,
        createdAt: '刚刚',
        isAIPost: true,
        topics: template.content.match(/#\S+/g) || [],
        isNew: true, // 标记为新帖，用于醒目显示
      }
      setAiPosts(prev => [newPost, ...prev])
      scheduleAIPost()
    }, delay)
  }, [])

  // 启动
  useEffect(() => {
    activate()
    scheduleAIPost()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (postTimerRef.current) clearTimeout(postTimerRef.current)
    }
  }, [activate, scheduleAIPost])

  // 生成AI评论（供帖子评论系统调用）
  const addAIComment = useCallback((postCategory) => {
    const aiUser = AI_USERS[Math.floor(Math.random() * AI_USERS.length)]
    const existingTexts = [] // 可以扩展排除已有评论
    return generateTimedComment(aiUser, postCategory, existingTexts)
  }, [])

  return {
    aiPosts,
    aiActivities,
    isActive,
    addAIComment,
    activate,
  }
}
