// AIGC实战课程 - 统一数据源（由 CourseDetail.jsx 的 unifiedCourses 提取）
const unifiedCourses = [
  // ---------- AI视频 ----------
  {
    id: 101, category: 'video', categoryName: 'AI视频', level: '入门', levelColor: '#4ade80',
    title: 'AI短视频创作实战：从脚本到爆款的完整链路',
    subtitle: '掌握AI生成视频全流程，打造百万播放爆款内容',
    students: 2456, rating: 4.9, reviews: 623, duration: '26小时', lessons: 52,
    teacher: { name: '王导', avatar: '导', title: 'AI视频创作导师' },
    price: 699, originalPrice: 1999, bgColor: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    highlight: '最适合新手入门', featured: true,
    tags: ['AI视频', '短视频', '爆款', '变现'],
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：AI工具认知与选择', lessons: ['主流AI视频工具对比', '即梦·可灵·Pika选择', '工具注册与基础操作', '如何选择适合自己的工具'] },
      { title: '第二章：提示词工程核心技巧', lessons: ['提示词基础语法', '动作+场景+风格', '如何让AI精准理解创意', '进阶提示词模板'] },
      { title: '第三章：脚本结构与选题策划', lessons: ['爆款选题方法', '脚本结构设计', '黄金3秒开头技巧', '如何留住观众'] },
      { title: '第四章：AI视频生成实战', lessons: ['文生视频实操', '图生视频实操', '运镜控制技巧', '多片段拼接方法'] },
      { title: '第五章：剪辑与后期处理', lessons: ['剪映基础操作', '字幕与配音', '转场与特效', '封面制作技巧'] },
      { title: '第六章：爆款内容分析与复盘', lessons: ['数据指标分析', '爆款视频拆解', '迭代优化策略', '持续产出方法论'] }
    ]
  },
  {
    id: 102, category: 'video', categoryName: 'AI视频', level: '进阶', levelColor: '#f59e0b',
    title: 'AI视频特效制作：让你的作品脱颖而出',
    subtitle: 'AI特效与实拍结合，创造视觉冲击力',
    students: 1567, rating: 4.7, reviews: 389, duration: '20小时', lessons: 40,
    teacher: { name: '李特效', avatar: '效', title: '资深特效师' },
    price: 599, originalPrice: 1699, bgColor: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
    highlight: '特效制作核心课', featured: false,
    tags: ['特效', 'AI', '视觉', '创意'],
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：特效基础认知', lessons: ['AI特效原理', '工具选择', '基础操作', '效果预览'] },
      { title: '第二章：视觉特效实战', lessons: ['光效叠加', '粒子特效', '风格迁移', '色彩分级'] },
      { title: '第三章：商业级调色', lessons: ['达芬奇调色', 'lut预设', '肤色保护', '输出设置'] }
    ]
  },
  // ---------- AI广告电影 ----------
  {
    id: 201, category: 'film', categoryName: 'AI广告电影', level: '入门', levelColor: '#4ade80',
    title: 'AI广告电影入门：从创意到成片的完整流程',
    subtitle: '用AI工具制作专业级广告电影，无需传统拍摄设备',
    students: 1823, rating: 4.8, reviews: 456, duration: '22小时', lessons: 44,
    teacher: { name: '陈导', avatar: '导', title: 'AI广告导演' },
    price: 799, originalPrice: 1999, bgColor: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
    highlight: 'B端客户开发神器', featured: true,
    tags: ['AI广告', 'AI电影', '商业', '导演'],
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：AI广告认知', lessons: ['AI广告行业趋势', '与传统广告对比', '工具生态', '案例分析'] },
      { title: '第二章：创意脚本', lessons: ['广告脚本结构', 'AI辅助写作', '分镜设计', '预算规划'] },
      { title: '第三章：AI生成成片', lessons: ['即梦生成广告', '可灵广告实操', '镜头拼接', '音效配合'] },
      { title: '第四章：后期精修', lessons: ['Premiere Pro', '达芬奇调色', '音效设计', '成片输出'] }
    ]
  },
  {
    id: 202, category: 'film', categoryName: 'AI广告电影', level: '进阶', levelColor: '#f59e0b',
    title: 'AI广告电影进阶：品牌级商业广告实战',
    subtitle: '从单条广告到系列广告，打造品牌视觉体系',
    students: 1234, rating: 4.9, reviews: 312, duration: '28小时', lessons: 56,
    teacher: { name: '张总监', avatar: '总', title: 'AI视频工作室主理人' },
    price: 1299, originalPrice: 2999, bgColor: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    highlight: 'B端高客单价课', featured: false,
    tags: ['品牌', '商业', '高客单', '系列'],
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：品牌视觉体系', lessons: ['品牌调性把控', '视觉识别融入', '风格一致性', '品牌故事'] },
      { title: '第二章：多角色生成', lessons: ['角色一致性', '多角色场景', '品牌色运用', '细节打磨'] },
      { title: '第三章：提案与交付', lessons: ['客户沟通', '提案技巧', '修改迭代', '交付标准'] }
    ]
  },
  // ---------- AI设计师 ----------
  {
    id: 301, category: 'designer', categoryName: 'AI设计师', level: '入门', levelColor: '#4ade80',
    title: 'AI设计师入门：Midjourney与Stable Diffusion',
    subtitle: '0基础掌握两大AI绘图神器，实现设计效率10倍提升',
    students: 4892, rating: 4.9, reviews: 1234, duration: '18小时', lessons: 36,
    teacher: { name: '林画师', avatar: '林', title: 'AI绘画专家' },
    price: 399, originalPrice: 999, bgColor: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    highlight: '设计效率提升10倍', featured: true,
    tags: ['MJ', 'SD', 'AI绘画', '设计师'],
    coverImage: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：AI绘画工具认知', lessons: ['Midjourney注册与基础', 'Stable Diffusion部署', '工具选择策略', '提示词基础'] },
      { title: '第二章：MJ进阶技巧', lessons: ['参数控制', '风格化', '角色一致', '商业应用'] },
      { title: '第三章：SD进阶技巧', lessons: ['ComfyUI工作流', 'Lora模型训练', 'ControlNet控制', '高清放大'] },
      { title: '第四章：商业设计实战', lessons: ['电商主图', '品牌海报', 'IP形象', '包装设计'] }
    ]
  },
  {
    id: 302, category: 'designer', categoryName: 'AI设计师', level: '进阶', levelColor: '#f59e0b',
    title: 'AI设计师进阶：UI设计+品牌视觉实战',
    subtitle: '用AI完成品牌视觉体系全案设计，服务B端客户',
    students: 2341, rating: 4.8, reviews: 567, duration: '24小时', lessons: 48,
    teacher: { name: '赵设计', avatar: '赵', title: '品牌设计总监' },
    price: 699, originalPrice: 1699, bgColor: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    highlight: 'B端设计接单', featured: false,
    tags: ['UI设计', '品牌', 'B端', '接单'],
    coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：AI辅助UI设计', lessons: ['APP界面AI生成', '交互稿快速迭代', '图标设计', '原型输出'] },
      { title: '第二章：品牌视觉全案', lessons: ['Logo设计', 'VI系统', '包装设计', '品牌手册'] },
      { title: '第三章：B端客户开发', lessons: ['客户定位', '报价体系', '提案技巧', '长期维护'] }
    ]
  },
  // ---------- AI短剧 ----------
  {
    id: 401, category: 'drama', categoryName: 'AI短剧', level: '入门', levelColor: '#4ade80',
    title: 'AI短剧创作入门：从剧本到爆款短剧的完整流程',
    subtitle: '用AI工具从0到1制作短剧，无需拍摄即可完成',
    students: 3567, rating: 4.9, reviews: 892, duration: '20小时', lessons: 40,
    teacher: { name: '周编剧', avatar: '周', title: 'AI短剧创作导师' },
    price: 299, originalPrice: 799, bgColor: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    highlight: '短剧变现入门首选', featured: true,
    tags: ['AI短剧', '剧本', '短视频', '变现'],
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：AI短剧认知', lessons: ['AI短剧行业发展', '平台规则', '热门题材', '变现路径'] },
      { title: '第二章：剧本创作', lessons: ['短剧结构', '钩子设计', '对白写作', 'AI辅助剧本'] },
      { title: '第三章：AI生成画面', lessons: ['即梦生成短剧', '分镜设计', '角色一致性', '运镜控制'] },
      { title: '第四章：剪辑与发布', lessons: ['Final Cut Pro', '字幕与配乐', '发布技巧', '数据复盘'] }
    ]
  },
  {
    id: 402, category: 'drama', categoryName: 'AI短剧', level: '进阶', levelColor: '#f59e0b',
    title: 'AI短剧进阶：多集连更·专业配音·爆款打造',
    subtitle: '制作多集连续AI短剧，掌握流量密码与变现全攻略',
    students: 2134, rating: 4.8, reviews: 534, duration: '26小时', lessons: 52,
    teacher: { name: '赵导演', avatar: '赵', title: 'AI短剧制作人' },
    price: 599, originalPrice: 1599, bgColor: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    highlight: '短剧进阶实战课', featured: false,
    tags: ['多集', '配音', '变现', '高转化'],
    coverImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：多集制作规划', lessons: ['系列架构', '集间钩子', '角色弧线', '效率管理'] },
      { title: '第二章：AI配音合成', lessons: ['声音克隆', '情绪化配音', '多角色处理', '专业流程'] },
      { title: '第三章：爆款方法论', lessons: ['爆款结构', '情绪调动', '算法解析', '完播率优化'] },
      { title: '第四章：变现全攻略', lessons: ['平台分账', '付费短剧', '品牌定制', '月入3万+'] }
    ]
  },
  // ---------- AI文旅 ----------
  {
    id: 501, category: 'travel', categoryName: 'AI文旅', level: '入门', levelColor: '#4ade80',
    title: 'AI文旅宣传片制作：从创意到城市名片的完整链路',
    subtitle: '用AI工具制作城市、景区、品牌文旅宣传片',
    students: 1456, rating: 4.8, reviews: 367, duration: '18小时', lessons: 36,
    teacher: { name: '马导', avatar: '马', title: '文旅视频导演' },
    price: 499, originalPrice: 1299, bgColor: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    highlight: '文旅赛道必备', featured: true,
    tags: ['文旅', '宣传片', '城市', '景区'],
    coverImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：文旅视频认知', lessons: ['文旅行业发展', '视频类型', '平台选择', '变现路径'] },
      { title: '第二章：AI生成文旅画面', lessons: ['城市风光', '景区航拍', '文化元素', '季节效果'] },
      { title: '第三章：宣传片剪辑', lessons: ['叙事结构', '配乐选择', '字幕设计', '输出格式'] }
    ]
  },
  {
    id: 502, category: 'travel', categoryName: 'AI文旅', level: '进阶', levelColor: '#f59e0b',
    title: 'AI文旅进阶：政府与企业宣传片全案制作',
    subtitle: '从单条视频到年度宣传方案，服务政府与企业客户',
    students: 876, rating: 4.9, reviews: 218, duration: '22小时', lessons: 44,
    teacher: { name: '李制片', avatar: '李', title: '资深文旅制片人' },
    price: 899, originalPrice: 2299, bgColor: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
    highlight: '高客单价课', featured: false,
    tags: ['政府', '企业', '全案', '高客单'],
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：政府宣传片', lessons: ['需求沟通', '方案撰写', '执行流程', '验收标准'] },
      { title: '第二章：企业宣传片', lessons: ['品牌理解', '脚本策划', '多版本输出', '长期合作'] },
      { title: '第三章：高客单开发', lessons: ['客户渠道', '报价策略', '合同签订', '回款管理'] }
    ]
  },
  // ---------- OPC咨询课程 ----------
  {
    id: 701, category: 'strategy', categoryName: '战略咨询', level: '旗舰', levelColor: '#c9a84c',
    title: '企业战略咨询：AI时代的商业增长方案',
    subtitle: 'AI赋能企业战略规划，找到第二增长曲线',
    students: 234, rating: 4.9, reviews: 58, duration: '16小时', lessons: 32,
    teacher: { name: '战略顾问', avatar: '战', title: '企业战略专家' },
    price: 2999, originalPrice: 9999, bgColor: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
    highlight: 'OPC咨询师必修', featured: true,
    tags: ['战略', '增长', 'AI', '咨询'],
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：战略规划', lessons: ['行业分析', '竞争格局', '增长路径', 'AI赋能'] },
      { title: '第二章：落地实施', lessons: ['执行路径', '资源整合', '风险管控', '效果评估'] }
    ]
  },
  {
    id: 702, category: 'listing', categoryName: '上市咨询', level: '旗舰', levelColor: '#c9a84c',
    title: '企业上市咨询：IPO全流程与合规要点',
    subtitle: '从上市准备到成功挂牌的完整咨询方案',
    students: 156, rating: 4.8, reviews: 39, duration: '20小时', lessons: 40,
    teacher: { name: '上市顾问', avatar: '上', title: '资深投行专家' },
    price: 3999, originalPrice: 12999, bgColor: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    highlight: '高价值咨询课', featured: false,
    tags: ['上市', 'IPO', '合规', '投行'],
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：上市准备', lessons: ['上市路径选择', '财务规范', '法律合规', '中介机构'] },
      { title: '第二章：审核流程', lessons: ['上市辅导', '材料准备', '审核问询', '发行上市'] }
    ]
  },
  {
    id: 703, category: 'financing', categoryName: '融资咨询', level: '旗舰', levelColor: '#c9a84c',
    title: '企业融资咨询：从种子轮到IPO的资本路径',
    subtitle: 'AI赋能融资规划，精准对接投资人',
    students: 189, rating: 4.9, reviews: 47, duration: '18小时', lessons: 36,
    teacher: { name: '融资顾问', avatar: '融', title: '知名VC投资人' },
    price: 2999, originalPrice: 8999, bgColor: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    highlight: '资本运作必修', featured: false,
    tags: ['融资', 'VC', '资本', '投资'],
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：融资规划', lessons: ['融资阶段选择', '估值方法', '商业计划书', '路演准备'] },
      { title: '第二章：投资人对接', lessons: ['投资人画像', '对接渠道', '尽调配合', '条款谈判'] }
    ]
  },
  {
    id: 704, category: 'equity', categoryName: '股权架构', level: '旗舰', levelColor: '#c9a84c',
    title: '股权架构咨询：设计最优企业控制权结构',
    subtitle: '从股权设计到合伙人机制，打造稳定股权结构',
    students: 201, rating: 4.8, reviews: 51, duration: '14小时', lessons: 28,
    teacher: { name: '股权顾问', avatar: '股', title: '股权设计专家' },
    price: 1999, originalPrice: 5999, bgColor: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
    highlight: '合伙人制度设计', featured: false,
    tags: ['股权', '合伙人', '控制权', '激励'],
    coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：股权设计', lessons: ['股权结构', '控制权设计', '动态股权', '退出机制'] },
      { title: '第二章：合伙人机制', lessons: ['合伙人筛选', '权责划分', '激励机制', '冲突处理'] }
    ]
  },
  {
    id: 705, category: 'overseas', categoryName: '战略出海', level: '旗舰', levelColor: '#c9a84c',
    title: '企业战略出海：从0到1的全球化路径',
    subtitle: 'AI赋能出海战略，精准进入国际市场',
    students: 178, rating: 4.9, reviews: 44, duration: '20小时', lessons: 40,
    teacher: { name: '出海顾问', avatar: '海', title: '全球化战略专家' },
    price: 2999, originalPrice: 8999, bgColor: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
    highlight: '出海战略必修', featured: false,
    tags: ['出海', '全球化', '国际化', '本地化'],
    coverImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：出海规划', lessons: ['市场选择', '进入模式', '合规准备', '团队搭建'] },
      { title: '第二章：本地化运营', lessons: ['产品本地化', '营销本地化', '团队管理', '资源整合'] }
    ]
  },
  {
    id: 706, category: 'ai-upgrade', categoryName: 'AI升级转型', level: '旗舰', levelColor: '#c9a84c',
    title: '企业AI升级转型与落地实施',
    subtitle: '从AI认知到落地应用，实现企业智能化转型',
    students: 567, rating: 4.9, reviews: 145, duration: '24小时', lessons: 48,
    teacher: { name: 'AI顾问', avatar: 'A', title: 'AI转型咨询专家' },
    price: 1999, originalPrice: 5999, bgColor: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    highlight: '企业AI必修课', featured: true,
    tags: ['AI转型', '智能化', '数字化', '升级'],
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：AI认知', lessons: ['AI基础', '行业趋势', '场景识别', '价值评估'] },
      { title: '第二章：落地实施', lessons: ['供应商选择', '项目实施', '效果评估', '持续优化'] }
    ]
  },
  {
    id: 707, category: 'deployment', categoryName: '私有化部署', level: '旗舰', levelColor: '#c9a84c',
    title: '企业AI私有化部署与数据安全',
    subtitle: '私有化部署AI能力，保障企业数据安全与合规',
    students: 234, rating: 4.8, reviews: 67, duration: '20小时', lessons: 40,
    teacher: { name: '技术顾问', avatar: '技', title: 'AI架构专家' },
    price: 2999, originalPrice: 8999, bgColor: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
    highlight: '技术负责人必修', featured: false,
    tags: ['私有化', '部署', '安全', '合规'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    chapters: [
      { title: '第一章：方案选型', lessons: ['需求分析', '方案对比', '成本评估', '供应商选择'] },
      { title: '第二章：部署实施', lessons: ['环境搭建', '模型部署', '性能优化', '安全加固'] }
    ]
  }
]

// ========== coursesData 补充课程（合并到统一数据源，使用新ID避免冲突）==========

// shortvideo 第3课专业级（id 103 → 801，category: video）
const extraVideo = {
  id: 801, category: 'video', categoryName: 'AI视频', level: '专业', levelColor: '#ef4444',
  title: 'AI短视频专业营：批量化生产·品牌级制作·团队运营',
  subtitle: '企业级AI视频生产方案，打造可持续产出体系',
  students: 567, rating: 5.0, reviews: 134, duration: '24小时', lessons: 48,
  teacher: { name: '张总监', avatar: '张', title: 'AI视频工作室主理人' },
  price: 1299, originalPrice: 3999, bgColor: 'linear-gradient(135deg, #164e63 0%, #0891b2 100%)',
  highlight: '企业/工作室必学', featured: false,
  tags: ['批量生产', '品牌制作', '团队运营', '企业级'],
  coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=450&fit=crop',
  detailImages: [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=600&fit=crop'
  ],
  chapters: [
    { title: '第一章：AI视频批量化生产体系（8课时）', lessons: ['需求管理与任务分配','AI工具选型与成本核算','提示词库建设与管理','模板化生产流程设计','质量控制与审核标准','版本管理与素材归档','效率工具链整合','生产效率优化实战'] },
    { title: '第二章：品牌级视频制作（10课时）', lessons: ['品牌视觉体系与调性把控','商业视频脚本写作','多角色一致性生成技巧','品牌色与视觉识别融入','Logo演绎与品牌故事','竞品分析与差异化','客户需求沟通与提案','修改迭代与交付标准','客户反馈处理技巧','品牌合作案例复盘'] },
    { title: '第三章：团队搭建与管理（6课时）', lessons: ['AI视频工作室人员配置','岗位职责与KPI设计','工具使用规范与培训','内部协作流程','外包与兼职团队管理','财务管理与报价体系'] },
    { title: '第四章：商业案例全流程（12课时）', lessons: ['案例1：电商品牌视频全流程','案例2：知识付费宣传片制作','案例3：餐饮品牌特色展示','案例4：汽车品牌概念视频','案例5：美妆产品使用视频','案例6：科技产品发布会视频','各行业报价参考','如何开拓B端客户','长期合作客户维护','年收入百万工作室运营复盘'] },
    { title: '第五章：未来趋势与扩展（12课时）', lessons: ['AI视频技术发展预测','如何保持技术领先','多模态AI工具整合','AI+真人协同创作模式','国际化内容生产','虚拟偶像与数字人应用','AIGC版权与合规','AI视频商业伦理','竞争策略与护城河','融资与规模化发展','行业资源整合','职业发展规划指导'] }
  ]
}

// drama 第3课专业级（id 203 → 802，category: drama）
const extraDrama = {
  id: 802, category: 'drama', categoryName: 'AI短剧', level: '专业', levelColor: '#ef4444',
  title: 'AI短剧大师营：IP孵化·系列开发·商业帝国',
  subtitle: '从单个短剧到系列IP，打造可持续盈利的内容商业帝国',
  students: 234, rating: 5.0, reviews: 67, duration: '28小时', lessons: 56,
  teacher: { name: '李掌门', avatar: '李', title: '内容创业导师' },
  price: 1999, originalPrice: 5999, bgColor: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
  highlight: '打造个人IP必学', featured: false,
  tags: ['IP孵化', '系列开发', '商业变现', '大师'],
  coverImage: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=450&fit=crop',
  detailImages: [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=600&fit=crop'
  ],
  chapters: [
    { title: '第一章：AI短剧IP打造（10课时）', lessons: ['IP定位与差异化策略','角色设计方法论','世界观构建技巧','IP核心价值观提炼','多平台IP布局','IP视觉形象设计','IP声音与人设统一','IP粉丝社群建设','IP商业价值评估','IP成长路径规划'] },
    { title: '第二章：系列化内容开发（10课时）', lessons: ['系列内容世界观扩展','主线与支线剧情设计','季与季之间的过渡','衍生内容创作','跨类型IP联动','系列内容排期管理','内容质量保障体系','粉丝反馈与内容迭代','IP版权保护策略','IP授权谈判技巧'] },
    { title: '第三章：商业化运营体系（12课时）', lessons: ['短剧IP多元化变现','品牌合作报价体系','IP联名产品开发','IP授权费计算方法','电商+内容双驱动','私域高价值变现','IP粉丝会员体系','线下活动与见面会','IP融资与资本化','MCN机构合作策略','内容出海与国际化','年度收入规划与执行'] },
    { title: '第四章：大师级案例全拆解（14课时）', lessons: ['爆款IP案例1深度拆解','爆款IP案例2深度拆解','爆款IP案例3深度拆解','失败IP案例分析与教训','海外AI短剧案例借鉴','跨平台运营成功案例','IP与品牌合作经典案例','IP授权变现成功案例','学员项目1诊断辅导','学员项目2诊断辅导','学员项目3诊断辅导','学员项目4诊断辅导','年度运营计划制定','个人IP发展路线图'] },
    { title: '第五章：AI短剧未来趋势（10课时）', lessons: ['AI短剧技术前沿','交互式短剧设计','AI虚拟演员应用','多语言AI短剧全球分发','VR/AR+短剧探索','AI短剧行业预测','技术变革应对策略','内容监管与合规','AI短剧伦理与责任','大师班毕业答辩'] }
  ]
}

// film 第3课专业级（id 403 → 806，category: film）
const extraFilm3 = {
  id: 806, category: 'film', categoryName: 'AI广告电影', level: '专业', levelColor: '#ef4444',
  title: 'AI电影大师营：从短片到长片·商业制作·行业领航',
  subtitle: 'AI电影制作的最高境界，打造商业级AI电影作品',
  students: 178, rating: 5.0, reviews: 45, duration: '32小时', lessons: 64,
  teacher: { name: '张大师', avatar: '张', title: 'AI影视制作人' },
  price: 2999, originalPrice: 8999, bgColor: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)',
  highlight: 'AI电影最高殿堂', featured: false,
  tags: ['AI长片', '商业制作', '行业领袖', '大师'],
  coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=450&fit=crop',
  detailImages: [
    'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=600&fit=crop'
  ],
  chapters: [
    { title: '第一章：AI长片制作体系（10课时）', lessons: ['AI长片叙事结构','长片剧本创作方法','100+镜头的一致性管理','AI长片制作排期','长片制作成本控制','团队配置与分工','素材管理与版本控制','长片质量管理体系','AI长片技术前沿','制作流程SOP文档'] },
    { title: '第二章：AI电影工业化（10课时）', lessons: ['AI影视工业化体系','制作管线设计','AI工具迭代与升级','数据资产管理','自动化生产方案','质量控制体系','版本管理协作工具','内容安全与审核','版权与法律合规','AI影视制作标准制定'] },
    { title: '第三章：商业AI电影项目（12课时）', lessons: ['商业AI广告电影制作','品牌故事微电影','公益AI短片','教育AI内容','纪录片AI化','音乐MV AI制作','城市宣传片','产品发布会视频','电视剧AI化探索','院线AI电影可能性','商业报价与合同','客户服务与交付'] },
    { title: '第四章：AI电影行业生态（10课时）', lessons: ['全球AI电影行业现状','头部公司案例分析','AI影视投资逻辑','创业机会与赛道选择','个人品牌与行业影响力','行业会议与资源对接','AI影视人才需求','教育与培训市场','内容监管趋势','未来10年AI电影预测'] },
    { title: '第五章：大师项目实战与毕业（22课时）', lessons: ['学员项目立项指导','项目创意研讨会','剧本工作坊','分镜设计评审','制作过程跟踪','中期审查与调整','后期制作指导','调色与音效指导','成片评审会','毕业作品发布','行业资源对接','创业孵化支持','持续成长社群'] }
  ]
}

// designer 第3课专业级（id 503 → 807，category: designer）
const extraDesigner3 = {
  id: 807, category: 'designer', categoryName: 'AI设计师', level: '专业', levelColor: '#ef4444',
  title: 'AI设计大师营：全案设计·团队管理·设计创业',
  subtitle: '从个人设计师到设计公司老板的完整成长路径',
  students: 345, rating: 5.0, reviews: 89, duration: '26小时', lessons: 52,
  teacher: { name: '设计总监', avatar: '总', title: '设计公司CEO' },
  price: 1999, originalPrice: 5999, bgColor: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
  highlight: '设计创业系统课', featured: false,
  tags: ['全案设计', '团队管理', '设计创业', '大师'],
  coverImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=450&fit=crop',
  detailImages: [
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=600&fit=crop'
  ],
  chapters: [
    { title: '第一章：全案品牌设计体系（10课时）', lessons: ['品牌战略与设计定位','品牌调研方法论','品牌概念发展','Logo系统设计','VI视觉识别系统','品牌应用设计（办公/物料/数字）','品牌手册制作','品牌设计交付标准','品牌设计案例复盘','全案设计报价体系'] },
    { title: '第二章：AI设计工作室搭建（8课时）', lessons: ['AI设计工作室定位','工具链配置方案','人员招聘与培训','设计流程标准化','质量管理体系','客户管理体系','财务与成本控制','工作室品牌建设'] },
    { title: '第三章：大型商业项目实战（12课时）', lessons: ['项目1：连锁品牌全套VI设计','项目2：科技公司产品设计','项目3：餐饮品牌全案','项目4：电商平台视觉升级','项目5：政府/公益组织设计','项目6：个人IP品牌设计','项目7：App产品整套UI','项目8：地产项目全套视觉','大型项目管理方法','多项目并行管理','危机处理与客户维护','项目复盘与经验沉淀'] },
    { title: '第四章：设计创业与规模化（10课时）', lessons: ['设计公司商业模式','如何获得第一批客户','口碑传播与案例营销','设计公司股权与激励','融资与规模化发展','收购与并购策略','设计行业未来趋势','设计师职业发展路径','个人IP与公司品牌','年入百万设计公司运营'] },
    { title: '第五章：大师班毕业（12课时）', lessons: ['学员项目立项','导师团队项目诊断','品牌设计方案评审','商业模式梳理','行业资源对接','融资指导','法律合规指导','毕业作品发布会','优秀学员颁奖','创业导师对接','学员互助社群','毕业后持续成长计划'] }
  ]
}

// mangadrama 漫剧课程（新增 category，ids 301/302/303 → 803/804/805）
const mangadramaCourses = [
  {
    id: 803, category: 'mangadrama', categoryName: 'AI漫剧', level: '入门', levelColor: '#4ade80',
    title: 'AI漫剧入门：漫画分镜·AI绘图·动态漫画',
    subtitle: '用AI工具快速生成漫画分镜，制作动态漫画视频',
    students: 745, rating: 4.7, reviews: 178, duration: '10小时', lessons: 20,
    teacher: { name: '漫小七', avatar: '漫', title: 'AI漫画创作师' },
    price: 249, originalPrice: 699, bgColor: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)',
    highlight: '漫画创作者入门', featured: true,
    tags: ['漫画分镜', 'AI绘图', '动态漫画', '入门'],
    coverImage: 'https://images.unsplash.com/photo-1560972550-aba3456b5564?w=800&h=450&fit=crop',
    detailImages: [
      'https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&h=600&fit=crop'
    ],
    chapters: [
      { title: '第一章：AI漫画认知（3课时）', lessons: ['AI漫剧行业现状','静态漫画vs动态漫剧','主流AI绘图工具选择'] },
      { title: '第二章：漫画分镜与剧本（5课时）', lessons: ['漫画分镜基础知识','分镜头脚本设计','对白框与效果字设计','AI辅助分镜生成','漫画剧本写作入门'] },
      { title: '第三章：AI生成漫画画面（6课时）', lessons: ['Midjourney生成漫画风格','Stable Diffusion + ControlNet分镜','角色一致性技巧','场景与背景生成','光效与氛围营造','多图生成与筛选'] },
      { title: '第四章：动态漫画制作（4课时）', lessons: ['动态漫画原理与工具','剪映动态化处理','口型同步与表情动画','BGM与音效配合'] },
      { title: '第五章：作品发布与运营（2课时）', lessons: ['漫画平台发布攻略','动态漫画账号运营'] }
    ]
  },
  {
    id: 804, category: 'mangadrama', categoryName: 'AI漫剧', level: '进阶', levelColor: '#f59e0b',
    title: 'AI漫剧进阶：商业漫剧·系列开发·平台签约',
    subtitle: '制作高质量商业漫剧内容，与平台签约获得稳定收益',
    students: 456, rating: 4.9, reviews: 123, duration: '16小时', lessons: 32,
    teacher: { name: '漫威老师', avatar: '威', title: '商业漫画制作人' },
    price: 599, originalPrice: 1599, bgColor: 'linear-gradient(135deg, #be185d 0%, #ec4899 100%)',
    highlight: '平台签约实战', featured: true,
    tags: ['商业漫剧', '系列开发', '平台签约', '进阶'],
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=450&fit=crop',
    detailImages: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=600&fit=crop'
    ],
    chapters: [
      { title: '第一章：商业漫剧制作规范（6课时）', lessons: ['商业漫画平台要求','分辨率与输出规范','分镜节奏与阅读体验','商业漫画的故事结构','对白与叙事平衡','质量审核标准解读'] },
      { title: '第二章：AI辅助漫画高效生产（8课时）', lessons: ['ComfyUI批量生成漫画分镜','Lora训练角色一致性','AI生成+人工精修流程','不同风格漫画制作方案','批量生成效率优化','素材管理与版本控制','AI+手绘结合技法','工作室生产流程设计'] },
      { title: '第三章：系列漫剧开发（6课时）', lessons: ['系列故事架构设计','角色成长体系','多线叙事技巧','伏笔与悬念设计','系列更新排期管理','粉丝运营与互动'] },
      { title: '第四章：平台签约实战（6课时）', lessons: ['快看/腾讯漫画平台分析','签约流程与注意事项','分成模式与收益计算','如何通过编辑审核','连载更新策略','作品推广与曝光'] },
      { title: '第五章：漫剧多元化变现（6课时）', lessons: ['付费阅读变现','广告植入与品牌合作','周边产品开发','IP改编授权','漫剧+带货组合变现','月入过万案例分享'] }
    ]
  },
  {
    id: 805, category: 'mangadrama', categoryName: 'AI漫剧', level: '专业', levelColor: '#ef4444',
    title: 'AI漫剧大师班：从创作到商业化的完整体系',
    subtitle: '打造具有商业价值的漫剧IP，建立完整的创作-变现闭环',
    students: 189, rating: 5.0, reviews: 45, duration: '22小时', lessons: 44,
    teacher: { name: '漫总裁', avatar: '总', title: 'AI漫画CEO' },
    price: 1699, originalPrice: 4999, bgColor: 'linear-gradient(135deg, #9d174d 0%, #db2777 100%)',
    highlight: '漫剧创业系统课', featured: false,
    tags: ['IP打造', '商业化', '全体系', '大师'],
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=450&fit=crop',
    detailImages: [
      'https://images.unsplash.com/photo-1560972550-aba3456b5564?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=1200&h=600&fit=crop'
    ],
    chapters: [
      { title: '第一章：AI漫剧IP战略定位（8课时）', lessons: ['IP市场调研方法','差异化定位策略','目标受众画像构建','竞品分析与蓝海机会','IP核心价值主张','IP视觉识别系统设计','IP声音设计','IP世界观深度构建'] },
      { title: '第二章：AI漫剧工业化生产体系（10课时）', lessons: ['漫画工作室搭建','AI工具链整合方案','角色Lora定制训练','场景与道具资产库建设','批量生产质量管理','多风格制作能力建设','团队分工与协作流程','效率工具全整合','成本控制与利润优化','产能扩张策略'] },
      { title: '第三章：全平台运营与粉丝经济（8课时）', lessons: ['快看/腾讯/B站差异化运营','短视频漫剧引流策略','私域粉丝体系建设','会员订阅模式设计','粉丝社群活跃技巧','KOL合作与传播裂变','跨平台内容矩阵搭建','数据分析与内容优化'] },
      { title: '第四章：商业化全链路（10课时）', lessons: ['漫剧IP多元化变现地图','付费订阅体系设计','广告变现策略与报价','品牌联名与授权','周边产品开发与销售','影视改编授权','游戏改编授权','出海与全球化','融资路演与资本对接','年入百万运营复盘'] },
      { title: '第五章：大师案例与毕业答辩（8课时）', lessons: ['头部IP全拆解案例1','头部IP全拆解案例2','新兴IP快速崛起案例','失败案例深度分析','学员项目路演','导师一对一指导','毕业作品评审','行业资源对接会'] }
    ]
  }
]

// commerce 带货变现课程（新增 category，ids 601/602/603 → 808/809/810）
const commerceCourses = [
  {
    id: 808, category: 'commerce', categoryName: 'AI带货变现', level: '入门', levelColor: '#4ade80',
    title: 'AI带货入门：短视频带货底层逻辑·AI快速起号',
    subtitle: '搞懂短视频带货的底层逻辑，用AI工具快速启动带货账号',
    students: 3421, rating: 4.7, reviews: 876, duration: '10小时', lessons: 20,
    teacher: { name: '带货达人', avatar: '达', title: 'AI带货实战导师' },
    price: 199, originalPrice: 599, bgColor: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
    highlight: '最适合新手入门带货', featured: true,
    tags: ['带货逻辑', 'AI起号', '选品', '入门'],
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop',
    detailImages: [
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=600&fit=crop'
    ],
    chapters: [
      { title: '第一章：短视频带货底层逻辑（4课时）', lessons: ['短视频带货 vs 图文带货','平台算法与流量分发','带货账号定位方法','什么样的账号能带货成功'] },
      { title: '第二章：AI工具快速起号（5课时）', lessons: ['AI生成账号头像与背景图','AI生成账号简介视觉','AI辅助账号定位分析','竞品账号AI分析工具','起号时间规划与执行'] },
      { title: '第三章：AI生成带货内容（6课时）', lessons: ['AI辅助选品策略','ChatGPT生成带货脚本','即梦/可灵生成产品展示视频','AI生成产品对比视频','AI生成种草图文','批量生成内容的方法'] },
      { title: '第四章：账号运营基础（3课时）', lessons: ['账号冷启动运营','如何获得初始流量','粉丝互动与转化引导'] },
      { title: '第五章：首次带货实战（2课时）', lessons: ['首次带货选品建议','如何迈出带货第一步'] }
    ]
  },
  {
    id: 809, category: 'commerce', categoryName: 'AI带货变现', level: '进阶', levelColor: '#f59e0b',
    title: 'AI带货进阶：选品矩阵·AI批量制作·月入过万',
    subtitle: '建立选品矩阵，用AI批量制作高质量带货视频，实现稳定收益',
    students: 2341, rating: 4.8, reviews: 623, duration: '16小时', lessons: 32,
    teacher: { name: '带货王', avatar: '王', title: 'AI带货操盘手' },
    price: 599, originalPrice: 1699, bgColor: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
    highlight: '月入过万实战课', featured: true,
    tags: ['选品矩阵', 'AI批量制作', '月入过万', '进阶'],
    coverImage: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=450&fit=crop',
    detailImages: [
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop'
    ],
    chapters: [
      { title: '第一章：选品策略与矩阵搭建（6课时）', lessons: ['带货选品底层逻辑','如何发现高佣金产品','应季选品时间规划','爆款选品数据工具','建立个人选品库','选品风险控制'] },
      { title: '第二章：AI批量制作带货视频（10课时）', lessons: ['AI生成带货视频工作流','即梦/可灵产品展示技巧','AI生成对比测评视频','AI生成种草安利视频','AI生成剧情带货视频','批量生成脚本的方法','批量生成的效率优化','素材管理与版本控制','多平台内容适配','AI视频质量把控'] },
      { title: '第三章：高转化带货脚本（6课时）', lessons: ['带货脚本结构拆解','AI快速生成100+脚本','如何写让人忍不住下单的脚本','不同品类带货脚本模板','脚本A/B测试方法','脚本迭代优化策略'] },
      { title: '第四章：账号矩阵运营（5课时）', lessons: ['为什么要做账号矩阵','AI辅助多账号管理','不同账号差异化定位','矩阵账号内容协同','矩阵账号数据监控'] },
      { title: '第五章：月入过万实战复盘（5课时）', lessons: ['账号数据诊断方法','ROI计算与优化','如何提升转化率','月入过万账号拆解','月入过万进阶路线图'] }
    ]
  },
  {
    id: 810, category: 'commerce', categoryName: 'AI带货变现', level: '专业', levelColor: '#ef4444',
    title: 'AI带货大师营：团队矩阵·直播带货·年入百万',
    subtitle: 'AI赋能带货全链路，从个人到团队，打造百万级带货体系',
    students: 567, rating: 5.0, reviews: 178, duration: '24小时', lessons: 48,
    teacher: { name: '带货总裁', avatar: '总', title: 'AI带货公司CEO' },
    price: 1999, originalPrice: 5999, bgColor: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
    highlight: '带货创业终极课', featured: false,
    tags: ['团队矩阵', '直播带货', '年入百万', '大师'],
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop',
    detailImages: [
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&h=600&fit=crop'
    ],
    chapters: [
      { title: '第一章：AI带货团队搭建（8课时）', lessons: ['AI带货商业模式画布','团队架构与岗位设置','AI工具链配置','人员招聘与培训','绩效考核体系设计','团队协作流程','成本控制与ROI','创业启动资金规划'] },
      { title: '第二章：账号矩阵规模化（8课时）', lessons: ['矩阵账号战略规划','AI批量账号注册与运营','账号差异化策略','内容工厂模式','质量与效率平衡','矩阵数据监控系统','账号淘汰与迭代','规模化运营SOP'] },
      { title: '第三章：AI+直播带货（10课时）', lessons: ['AI直播趋势分析','AI虚拟主播搭建','AI直播脚本生成','AI实时互动应答','AI直播数据分析','直播选品策略','直播话术设计','直播复盘与优化','AI+真人混合直播','直播带货完整案例'] },
      { title: '第四章：高客单高佣金产品（6课时）', lessons: ['高客单产品选择','高佣金产品渠道','AI生成高端感内容','高客单转化话术','高客单客户私域运营','高客单复购策略'] },
      { title: '第五章：年入百万实战（16课时）', lessons: ['百万GMV拆解','年度目标规划','Q1-Q4运营节奏','爆款打造方法论','淡旺季运营策略','供应链管理','仓储与物流','客服团队建设','私域变现体系','合伙人模式','融资与扩张','行业资源整合','法律合规经营','品牌化发展路径','退出机制规划','大师班毕业答辩'] }
    ]
  }
]

// 合并后的完整课程数据
const allCourses = [
  ...unifiedCourses,
  extraVideo,
  extraDrama,
  extraFilm3,
  extraDesigner3,
  ...mangadramaCourses,
  ...commerceCourses
]

export { unifiedCourses, allCourses }
