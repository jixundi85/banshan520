// 示例数据填充脚本
// 运行方式：在浏览器控制台粘贴此代码，或在页面加载后自动调用

const sampleCreatorId = 'creator_' + Date.now();
const currentUser = JSON.parse(localStorage.getItem('user') || '{"id":"user_default","name":"林小艺"}');

// 示例案例数据
const sampleCases = [
  {
    id: 'case_001',
    creatorId: sampleCreatorId,
    creatorName: '林小艺',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linxiaoyi',
    title: '用AI工具3分钟生成爆款短视频全攻略',
    description: '从选题到剪辑，手把手教你用AI工具快速制作高质量短视频内容',
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    category: 'shortvideo',
    categoryName: 'AI短视频',
    tags: ['短视频', 'AI工具', '爆款', '涨粉'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '18:32',
    views: 12580,
    likes: 856,
    price: 0,
    pointsPrice: 0,
    isFree: true,
    freeVideoPercent: 100,
    freeChapters: 0,
    unlockPoints: 0,
    status: 'published',
    publishedAt: '2026-04-08',
    featured: true,
    tutorial: {
      title: 'AI短视频制作完整教程',
      chapters: [
        {
          id: 1,
          title: '第一章：AI工具选择与准备',
          duration: '8分钟',
          isFree: true,
          steps: [
            { type: 'text', content: '本章节将介绍最常用的AI视频生成工具，包括：\n\n1. **剪映AI** - 适合新手入门\n2. **Runway** - 专业级视频生成\n3. **Pika** - 动画风格视频\n4. **Sora** - OpenAI最新力作' },
            { type: 'tip', content: '💡 建议新手从剪映AI开始，上手难度最低' }
          ]
        },
        {
          id: 2,
          title: '第二章：文案脚本AI辅助创作',
          duration: '12分钟',
          isFree: true,
          steps: [
            { type: 'text', content: '使用ChatGPT或Claude辅助创作短视频文案：\n\n1. 确定视频主题和目标受众\n2. 让AI生成3-5个创意角度\n3. 选择最佳角度扩展成完整脚本\n4. 优化文案节奏和情绪点' },
            { type: 'image', content: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80' }
          ]
        },
        {
          id: 3,
          title: '第三章：AI视频生成实操',
          duration: '25分钟',
          isFree: false,
          steps: [
            { type: 'text', content: '【核心实操部分】详细演示：\n\n1. 如何写好提示词（Prompt）\n2. 参数设置与画质优化\n3. 多片段拼接技巧\n4. 背景音乐与音效添加\n5. 字幕自动生成与调整' },
            { type: 'image', content: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80' }
          ]
        },
        {
          id: 4,
          title: '第四章：剪辑与发布技巧',
          duration: '15分钟',
          isFree: false,
          steps: [
            { type: 'text', content: '发布前的最后润色：\n\n1. 封面设计的AI辅助方法\n2. 标题优化的5个技巧\n3. 发布时间与频率建议\n4. 数据分析与复盘方法' }
          ]
        }
      ]
    }
  },
  {
    id: 'case_002',
    creatorId: sampleCreatorId,
    creatorName: '林小艺',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linxiaoyi',
    title: 'AI漫剧创作：从零到爆款的实战方法论',
    description: '揭秘如何在抖音、快手上用AI漫剧快速涨粉10万+',
    coverImage: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=800&q=80',
    category: 'mangadrama',
    categoryName: 'AI漫剧',
    tags: ['漫剧', '涨粉', '抖音', '快手'],
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    duration: '22:15',
    views: 8920,
    likes: 623,
    price: 29,
    pointsPrice: 200,
    isFree: false,
    freeVideoPercent: 30,
    freeChapters: 1,
    unlockPoints: 200,
    status: 'published',
    publishedAt: '2026-04-07',
    featured: false,
    tutorial: {
      title: 'AI漫剧制作完整课程',
      chapters: [
        {
          id: 1,
          title: '漫剧赛道分析与定位',
          duration: '10分钟',
          isFree: true,
          steps: [
            { type: 'text', content: '当前漫剧市场分析：\n\n📊 数据洞察：\n- 抖音漫剧类视频平均播放量高于普通视频3倍\n- 快手漫剧完播率达到45%\n- 粉丝转化率是图文内容的2.5倍\n\n🎯 适合人群：\n- 想做副业的上班族\n- 影视剪辑爱好者\n- 内容创业者' }
          ]
        },
        {
          id: 2,
          title: 'AI漫剧制作工具清单',
          duration: '8分钟',
          isFree: true,
          steps: [
            { type: 'text', content: '必备工具推荐：\n\n🎨 图像生成：\n- Midjourney（高质量）\n- Stable Diffusion（免费）\n- Leonardo.ai（性价比高）\n\n🎬 视频处理：\n-剪映专业版\n- CapCut\n- Premiere Pro' }
          ]
        },
        {
          id: 3,
          title: '剧情设计与分镜技巧',
          duration: '20分钟',
          isFree: false,
          steps: [
            { type: 'text', content: '【核心课程】高能预警！\n\n1. 如何设计让人上瘾的剧情钩子\n2. 分镜脚本的标准格式\n3. 对话框样式选择\n4. 情绪氛围营造技巧' }
          ]
        },
        {
          id: 4,
          title: '变现路径与商业合作',
          duration: '15分钟',
          isFree: false,
          steps: [
            { type: 'text', content: '漫剧变现的6种方式：\n\n1. 平台创作激励计划\n2. 广告植入（品牌方合作）\n3. 知识付费专栏\n4. 周边产品销售\n5. 直播打赏\n6. IP授权' }
          ]
        }
      ]
    }
  },
  {
    id: 'case_003',
    creatorId: sampleCreatorId,
    creatorName: '林小艺',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linxiaoyi',
    title: 'AI带货变现全流程：月入过万的秘密',
    description: '从选品到转化，完整拆解AI带货的每一个关键环节',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    category: 'commerce',
    categoryName: 'AI带货变现',
    tags: ['带货', '变现', '电商', 'AI选品'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '35:20',
    views: 15670,
    likes: 1102,
    price: 99,
    pointsPrice: 500,
    isFree: false,
    freeVideoPercent: 20,
    freeChapters: 1,
    unlockPoints: 500,
    status: 'published',
    publishedAt: '2026-04-06',
    featured: true,
    tutorial: {
      title: 'AI带货变现实战课程',
      chapters: [
        {
          id: 1,
          title: 'AI带货入门：了解平台规则',
          duration: '15分钟',
          isFree: true,
          steps: [
            { type: 'text', content: '带货前必须了解的规则：\n\n⚠️ 平台红线：\n- 虚假宣传的处罚\n- 导流到站外的风险\n- 知识产权保护要求\n\n✅ 合规建议：\n- 使用真实用户体验\n- 提供完整售后保障\n- 选择有资质的商品' }
          ]
        },
        {
          id: 2,
          title: 'AI选品：找到高转化产品',
          duration: '18分钟',
          isFree: true,
          steps: [
            { type: 'text', content: '选品是带货成功的关键！\n\n🔍 选品维度：\n1. 佣金比例（优先30%以上）\n2. 转化率（参考同类视频）\n3. 复购率（食品、日用品优先）\n4. 客单价（100-300元最佳）\n\n💡 AI辅助工具：\n- 蝉妈妈\n- 飞瓜数据\n- 新抖' }
          ]
        },
        {
          id: 3,
          title: '脚本创作：让AI帮你写',
          duration: '22分钟',
          isFree: false,
          steps: [
            { type: 'text', content: '【重磅课程】AI脚本生成术：\n\n1. 产品卖点提炼方法\n2. 痛点-解决方案结构\n3. 限时优惠话术设计\n4. 信任背书植入技巧\n5. 行动号召（CTA）写法' }
          ]
        },
        {
          id: 4,
          title: '视频制作与优化',
          duration: '20分钟',
          isFree: false,
          steps: [
            { type: 'text', content: '高转化视频的共同特征：\n\n🎬 前3秒：\n- 抛出惊人数据\n- 提出尖锐问题\n- 展示强烈反差\n\n📊 中间：\n- 产品展示+使用场景\n- 效果对比\n- 用户证言\n\n🔚 结尾：\n- 限时优惠倒计时\n- 库存紧张暗示' }
          ]
        },
        {
          id: 5,
          title: '数据分析与持续优化',
          duration: '12分钟',
          isFree: false,
          steps: [
            { type: 'text', content: '数据复盘的关键指标：\n\n📈 核心指标：\n- 播放量 vs 转化率\n- 完播率分析\n- 互动率（评论、点赞）\n- GMV产出\n\n🔧 优化方向：\n- 封面点击率优化\n- 脚本转化率提升\n- 发布时间调整' }
          ]
        }
      ]
    }
  },
  {
    id: 'case_004',
    creatorId: sampleCreatorId,
    creatorName: '林小艺',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linxiaoyi',
    title: 'AI短剧创作入门：15分钟学会写剧本',
    description: '零基础也能快速上手的AI短剧创作技巧',
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
    category: 'shortdrama',
    categoryName: 'AI短剧',
    tags: ['短剧', '剧本', 'AI创作'],
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    duration: '28:45',
    views: 6340,
    likes: 445,
    price: 19,
    pointsPrice: 150,
    isFree: false,
    freeVideoPercent: 40,
    freeChapters: 1,
    unlockPoints: 150,
    status: 'published',
    publishedAt: '2026-04-05',
    featured: false,
    tutorial: {
      title: 'AI短剧剧本创作教程',
      chapters: [
        {
          id: 1,
          title: '短剧市场现状与机遇',
          duration: '10分钟',
          isFree: true,
          steps: [
            { type: 'text', content: '为什么现在入场AI短剧？\n\n📊 市场数据：\n- 2026年短剧市场规模预计突破500亿\n- 用户日均观看时长超过60分钟\n- AI辅助创作效率提升10倍\n\n🎯 机会点：\n- 平台大力扶持原创内容\n- AI工具降低创作门槛\n- 变现路径清晰' }
          ]
        },
        {
          id: 2,
          title: '短剧类型与选题技巧',
          duration: '12分钟',
          isFree: false,
          steps: [
            { type: 'text', content: '热门短剧类型盘点：\n\n🔥 高流量类型：\n1. 逆袭打脸类（爽文改编）\n2. 甜宠爱情类（年轻女性爱看）\n3. 悬疑推理类（高粘性）\n4. 职场逆袭类（共鸣感强）\n\n💡 选题公式：\n身份反差 + 冲突升级 + 逆袭反转' }
          ]
        }
      ]
    }
  },
  {
    id: 'case_005',
    creatorId: sampleCreatorId,
    creatorName: '林小艺',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linxiaoyi',
    title: '设计师必学：AI辅助品牌设计全流程',
    description: '用AI工具快速完成Logo、海报、包装等设计工作',
    coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
    category: 'designer',
    categoryName: 'AI设计师',
    tags: ['品牌设计', 'Logo', 'AI绘图', '平面设计'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '42:30',
    views: 4520,
    likes: 312,
    price: 49,
    pointsPrice: 300,
    isFree: false,
    freeVideoPercent: 25,
    freeChapters: 1,
    unlockPoints: 300,
    status: 'published',
    publishedAt: '2026-04-04',
    featured: true,
    tutorial: {
      title: 'AI品牌设计实战课程',
      chapters: [
        {
          id: 1,
          title: 'AI设计工具全景图',
          duration: '15分钟',
          isFree: true,
          steps: [
            { type: 'text', content: '设计师必备AI工具：\n\n🎨 图像生成：\n- Midjourney（高质量渲染）\n- DALL-E 3（创意概念）\n- Adobe Firefly（商业设计）\n\n✏️ 辅助设计：\n- Remove.bg（抠图）\n- Remove.bg（调色）\n- Canva AI（快速排版）' }
          ]
        },
        {
          id: 2,
          title: 'Logo设计的AI工作流',
          duration: '25分钟',
          isFree: false,
          steps: [
            { type: 'text', content: '【实战演示】Logo设计完整流程：\n\n1. 需求分析与关键词提炼\n2. AI生成多组方案\n3. 筛选与组合优化\n4. 细节调整与矢量化\n5. 品牌色彩规范导出' }
          ]
        }
      ]
    }
  },
  {
    id: 'case_006',
    creatorId: sampleCreatorId,
    creatorName: '林小艺',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linxiaoyi',
    title: 'AI电影级特效制作：从剧本到成片',
    description: '用AI工具实现好莱坞级别的视觉特效',
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
    category: 'film',
    categoryName: 'AI电影',
    tags: ['电影', '特效', 'AI视频', '视觉艺术'],
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    duration: '55:00',
    views: 3210,
    likes: 289,
    price: 129,
    pointsPrice: 800,
    isFree: false,
    freeVideoPercent: 15,
    freeChapters: 1,
    unlockPoints: 800,
    status: 'published',
    publishedAt: '2026-04-03',
    featured: false,
    tutorial: {
      title: 'AI电影特效制作大师班',
      chapters: [
        {
          id: 1,
          title: 'AI电影制作技术概述',
          duration: '20分钟',
          isFree: true,
          steps: [
            { type: 'text', content: 'AI电影时代的到来：\n\n🚀 技术里程碑：\n- Sora：文生视频先驱\n- Runway Gen-2：专业创作平台\n- Pika：动画风格专家\n- Kling：国产之光\n\n🎬 制作流程：\n剧本 → 分镜 → AI生成 → 剪辑合成 → 后期调色' }
          ]
        },
        {
          id: 2,
          title: '分镜头脚本设计',
          duration: '18分钟',
          isFree: false,
          steps: [
            { type: 'text', content: '专业分镜设计要点：\n\n📋 分镜要素：\n- 镜头编号与时长\n- 画面构图与景别\n- 运镜方式（推、拉、摇、移）\n- 台词与音效标注\n\n💡 AI辅助：\n使用ChatGPT快速生成脚本描述' }
          ]
        },
        {
          id: 3,
          title: 'AI视频生成高级技巧',
          duration: '35分钟',
          isFree: false,
          steps: [
            { type: 'text', content: '【高阶课程】专业级提示词写法：\n\n🎬 镜头语言：\n- 光线描述（cinematic lighting）\n- 色调风格（film grain, teal orange）\n- 运镜描述（slow motion, dolly shot）\n- 情感氛围（dramatic tension）\n\n⚠️ 常见问题与解决方案' }
          ]
        }
      ]
    }
  }
];

// 示例教程数据
const sampleTutorials = [
  {
    id: 'tutorial_001',
    creatorId: sampleCreatorId,
    creatorName: '林小艺',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linxiaoyi',
    title: 'AI短视频创作实战训练营',
    description: '系统学习AI短视频创作，从0到1打造爆款账号',
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    category: 'shortvideo',
    categoryName: 'AI短视频',
    tags: ['系统课', '实战', '涨粉'],
    type: 'course',
    price: 299,
    pointsPrice: 2000,
    originalPrice: 599,
    lessons: 12,
    duration: '8小时',
    students: 856,
    rating: 4.9,
    isFree: false,
    freeChapters: 2,
    unlockPoints: 2000,
    status: 'published',
    publishedAt: '2026-04-08',
    featured: true,
    chapters: [
      {
        id: 1,
        title: 'AI短视频趋势与机遇',
        duration: '45分钟',
        lessons: [
          { id: 1, title: '短视频市场现状分析', duration: '20分钟', isFree: true },
          { id: 2, title: 'AI如何改变内容创作', duration: '25分钟', isFree: true }
        ]
      },
      {
        id: 2,
        title: 'AI工具快速上手',
        duration: '90分钟',
        lessons: [
          { id: 1, title: '主流AI视频工具对比', duration: '30分钟', isFree: false },
          { id: 2, title: '剪映AI实操演示', duration: '35分钟', isFree: false },
          { id: 3, title: 'Runway创作技巧', duration: '25分钟', isFree: false }
        ]
      },
      {
        id: 3,
        title: '爆款内容创作方法论',
        duration: '120分钟',
        lessons: [
          { id: 1, title: '选题策划与竞品分析', duration: '40分钟', isFree: false },
          { id: 2, title: '脚本结构设计', duration: '35分钟', isFree: false },
          { id: 3, title: 'AI辅助文案创作', duration: '45分钟', isFree: false }
        ]
      },
      {
        id: 4,
        title: '账号运营与变现',
        duration: '105分钟',
        lessons: [
          { id: 1, title: '账号定位与人设打造', duration: '40分钟', isFree: false },
          { id: 2, title: '涨粉策略与数据优化', duration: '35分钟', isFree: false },
          { id: 3, title: '多元变现路径', duration: '30分钟', isFree: false }
        ]
      }
    ]
  },
  {
    id: 'tutorial_002',
    creatorId: sampleCreatorId,
    creatorName: '林小艺',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linxiaoyi',
    title: 'AI带货变现精英班',
    description: '月入过万的AI带货实战方法论',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    category: 'commerce',
    categoryName: 'AI带货变现',
    tags: ['带货', '变现', '电商'],
    type: 'course',
    price: 399,
    pointsPrice: 3000,
    originalPrice: 799,
    lessons: 15,
    duration: '10小时',
    students: 623,
    rating: 4.8,
    isFree: false,
    freeChapters: 2,
    unlockPoints: 3000,
    status: 'published',
    publishedAt: '2026-04-07',
    featured: true,
    chapters: [
      {
        id: 1,
        title: '带货基础认知',
        duration: '60分钟',
        lessons: [
          { id: 1, title: '短视频带货市场分析', duration: '30分钟', isFree: true },
          { id: 2, title: '平台规则与禁忌', duration: '30分钟', isFree: true }
        ]
      },
      {
        id: 2,
        title: 'AI选品与供应链',
        duration: '90分钟',
        lessons: [
          { id: 1, title: '高转化产品选择', duration: '35分钟', isFree: false },
          { id: 2, title: 'AI数据分析工具使用', duration: '30分钟', isFree: false },
          { id: 3, title: '供应链对接技巧', duration: '25分钟', isFree: false }
        ]
      },
      {
        id: 3,
        title: '爆款视频制作',
        duration: '150分钟',
        lessons: [
          { id: 1, title: '高转化脚本模板', duration: '40分钟', isFree: false },
          { id: 2, title: 'AI辅助拍摄技巧', duration: '35分钟', isFree: false },
          { id: 3, title: '剪辑与字幕优化', duration: '40分钟', isFree: false },
          { id: 4, title: '评论区运营技巧', duration: '35分钟', isFree: false }
        ]
      },
      {
        id: 4,
        title: '变现放大与团队化',
        duration: '120分钟',
        lessons: [
          { id: 1, title: '多账号矩阵玩法', duration: '40分钟', isFree: false },
          { id: 2, title: '达人分销合作', duration: '35分钟', isFree: false },
          { id: 3, title: '供应链优化', duration: '45分钟', isFree: false }
        ]
      }
    ]
  },
  {
    id: 'tutorial_003',
    creatorId: sampleCreatorId,
    creatorName: '林小艺',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linxiaoyi',
    title: 'AI漫剧创作大师班',
    description: '从剧本到制作，完整掌握AI漫剧创作技能',
    coverImage: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=800&q=80',
    category: 'mangadrama',
    categoryName: 'AI漫剧',
    tags: ['漫剧', '创作', '进阶'],
    type: 'course',
    price: 199,
    pointsPrice: 1500,
    originalPrice: 399,
    lessons: 10,
    duration: '6小时',
    students: 445,
    rating: 4.7,
    isFree: false,
    freeChapters: 2,
    unlockPoints: 1500,
    status: 'published',
    publishedAt: '2026-04-06',
    featured: false,
    chapters: [
      {
        id: 1,
        title: '漫剧创作入门',
        duration: '45分钟',
        lessons: [
          { id: 1, title: '什么是AI漫剧', duration: '20分钟', isFree: true },
          { id: 2, title: '漫剧 vs 其他内容形式', duration: '25分钟', isFree: true }
        ]
      },
      {
        id: 2,
        title: '剧本创作技巧',
        duration: '90分钟',
        lessons: [
          { id: 1, title: '热门漫剧类型分析', duration: '30分钟', isFree: false },
          { id: 2, title: '剧情结构设计', duration: '35分钟', isFree: false },
          { id: 3, title: 'AI辅助剧本创作', duration: '25分钟', isFree: false }
        ]
      },
      {
        id: 3,
        title: 'AI绘图实操',
        duration: '120分钟',
        lessons: [
          { id: 1, title: '人物设定与风格', duration: '40分钟', isFree: false },
          { id: 2, title: 'Midjourney漫剧创作', duration: '45分钟', isFree: false },
          { id: 3, title: 'Stable Diffusion进阶', duration: '35分钟', isFree: false }
        ]
      },
      {
        id: 4,
        title: '后期制作与发布',
        duration: '75分钟',
        lessons: [
          { id: 1, title: '视频剪辑与音效', duration: '40分钟', isFree: false },
          { id: 2, title: '平台发布策略', duration: '35分钟', isFree: false }
        ]
      }
    ]
  }
];

// 设置创作者资料
const creatorProfile = {
  id: sampleCreatorId,
  name: '林小艺',
  title: 'AIGC领域资深导师',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linxiaoyi',
  bio: '深耕AIGC领域5年，专注于AI内容创作与变现研究。已帮助3000+学员实现副业增收，平均月收益提升300%。擅长短视频制作、漫剧创作、带货变现等多个赛道。',
  skills: ['AI短视频', 'AI漫剧', 'AI带货', '内容变现', '账号运营'],
  douyinId: '林小艺AI课堂',
  douyinFans: '52.3万',
  wechatId: 'AIGC-林小艺',
  wechatFans: '8.6万',
  xiaohongshuId: '林小艺的AI课堂',
  xiaohongshuFans: '15.2万',
  verified: true,
  featuredWorks: ['case_001', 'case_003', 'case_005'],
  totalViews: 51440,
  totalLikes: 3527,
  followers: 5230,
  totalEarnings: 285600
};

// 填充数据到 localStorage
function populateSampleData() {
  try {
    // 保存创作者资料
    localStorage.setItem('creatorProfile', JSON.stringify(creatorProfile));

    // 保存案例数据
    const existingCases = JSON.parse(localStorage.getItem('publishedCases') || '[]');
    const newCases = sampleCases.filter(
      newCase => !existingCases.some(existing => existing.id === newCase.id)
    );
    localStorage.setItem('publishedCases', JSON.stringify([...existingCases, ...newCases]));

    // 保存教程数据
    const existingTutorials = JSON.parse(localStorage.getItem('publishedTutorials') || '[]');
    const newTutorials = sampleTutorials.filter(
      newT => !existingTutorials.some(existing => existing.id === newT.id)
    );
    localStorage.setItem('publishedTutorials', JSON.stringify([...existingTutorials, ...newTutorials]));

    console.log('✅ 示例数据填充成功！');
    console.log(`📊 新增案例: ${newCases.length} 个`);
    console.log(`📚 新增教程: ${newTutorials.length} 个`);
    console.log(`👤 创作者ID: ${sampleCreatorId}`);

    return {
      success: true,
      casesCount: newCases.length,
      tutorialsCount: newTutorials.length,
      creatorId: sampleCreatorId
    };
  } catch (error) {
    console.error('❌ 数据填充失败:', error);
    return { success: false, error: error.message };
  }
}

// 清除所有示例数据
function clearSampleData() {
  try {
    localStorage.removeItem('publishedCases');
    localStorage.removeItem('publishedTutorials');
    localStorage.removeItem('creatorProfile');
    console.log('✅ 示例数据已清除');
    return { success: true };
  } catch (error) {
    console.error('❌ 清除失败:', error);
    return { success: false, error: error.message };
  }
}

// 导出到全局
window.populateSampleData = populateSampleData;
window.clearSampleData = clearSampleData;

// 返回结果
populateSampleData();
