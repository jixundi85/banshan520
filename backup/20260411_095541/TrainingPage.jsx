import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Play, Clock, Users, Star, CheckCircle, ArrowRight,
  BookOpen, Trophy, Video, Eye, Heart, MessageSquare,
  Search, X, ChevronDown, ChevronUp, Zap, Lock,
  Share2, Bookmark, TrendingUp, Award, Film,
  Sparkles, ShoppingCart, Palette, Clapperboard,
  Megaphone, TrendingDown
} from 'lucide-react'
import './TrainingPage.css'

// ======= 六大课程类型 =======
const CATEGORY_META = {
  shortvideo: {
    id: 'shortvideo', name: 'AI短视频', icon: '🎬', color: '#22d3ee',
    gradient: 'linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)',
    desc: '用AI工具快速生成高质量短视频内容，涵盖即梦、可灵、Pika等主流工具'
  },
  shortdrama: {
    id: 'shortdrama', name: 'AI短剧', icon: '🎭', color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    desc: 'AI生成完整短剧内容，从剧本到成片全流程讲解'
  },
  mangadrama: {
    id: 'mangadrama', name: 'AI漫剧', icon: '📚', color: '#f472b6',
    gradient: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)',
    desc: '将漫画与AI视频结合，创造独特的动态漫画内容'
  },
  film: {
    id: 'film', name: 'AI电影', icon: '🎥', color: '#fb923c',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
    desc: 'AI赋能影视制作，从剧本到成片的完整电影制作教程'
  },
  designer: {
    id: 'designer', name: 'AI设计师', icon: '🎨', color: '#34d399',
    gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
    desc: '用AI工具提升设计效率，商业Logo、UI界面、产品设计全解析'
  },
  commerce: {
    id: 'commerce', name: 'AI带货变现', icon: '💰', color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
    desc: 'AI+短视频带货全攻略，从0到日销破万的实战方法'
  }
}

// ======= 完整课程数据（6类型 × 3级，共18门课）=======
const courses = [
  // ---------- AI短视频 ----------
  {
    id: 101, category: 'shortvideo', level: '入门', levelColor: '#4ade80',
    title: 'AI短视频入门：即梦·可灵·Pika 从零到上手',
    subtitle: '零基础学会3大AI视频工具，7天产出第一条AI短视频',
    students: 1856, rating: 4.9, reviews: 456, duration: '10小时', lessons: 20,
    teacher: { name: '林小影', avatar: '林', title: 'AI短视频导师', bio: '全网50万粉丝AI视频创作者' },
    price: 199, originalPrice: 599,
    tags: ['即梦', '可灵', 'Pika', '入门'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)',
    highlight: '最适合新手入门',
    chapters: [
      { title: '第一章：AI视频工具认知（4课时）', lessons: ['AI视频发展史与行业趋势', '即梦注册与基础操作', '可灵注册与基础操作', 'Pika注册与基础操作'] },
      { title: '第二章：文生视频实战（5课时）', lessons: ['提示词基础：动作+场景+风格', '即梦文生视频实操演示', '可灵文生视频实操演示', '运镜控制与时长选择', '学员作业点评与答疑'] },
      { title: '第三章：图生视频（4课时）', lessons: ['图生视频原理与适用场景', '即梦图生视频实操', '可灵图生视频实操', '如何生成连续性镜头'] },
      { title: '第四章：成片剪辑与发布（4课时）', lessons: ['剪映基础剪辑操作', 'AI素材拼接与节奏把控', '字幕、配乐与转场', '如何发布获得更多流量'] },
      { title: '第五章：作品发布实战（3课时）', lessons: ['选题与爆款规律', '发布标题与封面技巧', '全网多平台分发策略'] },
    ]
  },
  {
    id: 102, category: 'shortvideo', level: '进阶', levelColor: '#f59e0b',
    title: 'AI短视频进阶：高阶运镜·特效合成·商业变现',
    subtitle: '掌握运镜控制、视频合成、特效叠加，月入过万实战方法',
    students: 1234, rating: 4.8, reviews: 312, duration: '16小时', lessons: 32,
    teacher: { name: '陈导', avatar: '陈', title: 'AI视频创作达人', bio: '单条视频播放量破千万的专业创作者' },
    price: 499, originalPrice: 1299,
    tags: ['运镜控制', '视频合成', '特效', '变现'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)',
    highlight: '商业变现核心课程',
    chapters: [
      { title: '第一章：运镜高级控制（6课时）', lessons: ['运镜方向深度解析（推拉摇移）', '即梦运镜参数详解', '可灵运镜参数详解', '镜头时长与节奏关系', '如何生成一致性角色', '镜头衔接与过渡技巧'] },
      { title: '第二章：多段视频合成（6课时）', lessons: ['AI视频片段规划与脚本拆分', 'Premiere Pro多轨道合成', '达芬奇调色基础', 'AI片段与实拍素材融合', '音效与背景音乐配合', '案例：一条完整AI短视频制作'] },
      { title: '第三章：特效与风格化处理（6课时）', lessons: ['慢动作与快进效果', '光效与粒子特效叠加', '风格迁移与色彩分级', '如何在AI视频中加入文字动画', '商业级调色思路', '如何做出电影感'] },
      { title: '第四章：商业变现路径（6课时）', lessons: ['AI短视频变现5大模式', '如何接品牌广告单', '平台创作者激励计划详解', '私域引流与粉丝变现', '建立个人IP的方法', '月入过万实战复盘'] },
      { title: '第五章：高阶作业实战（8课时）', lessons: ['实操作业1：生成一条完整广告片', '实操作业2：制作连续性剧情短视频', '实操作业3：产品展示视频', '作业1点评与修改', '作业2点评与修改', '作业3点评与修改', '系列作品规划', '如何批量生产高质量内容'] },
    ]
  },
  {
    id: 103, category: 'shortvideo', level: '专业', levelColor: '#ef4444',
    title: 'AI短视频专业营：批量化生产·品牌级制作·团队运营',
    subtitle: '企业级AI视频生产方案，打造可持续产出体系',
    students: 567, rating: 5.0, reviews: 134, duration: '24小时', lessons: 48,
    teacher: { name: '张总监', avatar: '张', title: 'AI视频工作室主理人', bio: '服务过20+品牌的AI视频供应商' },
    price: 1299, originalPrice: 3999,
    tags: ['批量生产', '品牌制作', '团队运营', '企业级'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #164e63 0%, #0891b2 100%)',
    highlight: '企业/工作室必学',
    chapters: [
      { title: '第一章：AI视频批量化生产体系（8课时）', lessons: ['需求管理与任务分配', 'AI工具选型与成本核算', '提示词库建设与管理', '模板化生产流程设计', '质量控制与审核标准', '版本管理与素材归档', '效率工具链整合', '生产效率优化实战'] },
      { title: '第二章：品牌级视频制作（10课时）', lessons: ['品牌视觉体系与调性把控', '商业视频脚本写作', '多角色一致性生成技巧', '品牌色与视觉识别融入', 'Logo演绎与品牌故事', '竞品分析与差异化', '客户需求沟通与提案', '修改迭代与交付标准', '客户反馈处理技巧', '品牌合作案例复盘'] },
      { title: '第三章：团队搭建与管理（6课时）', lessons: ['AI视频工作室人员配置', '岗位职责与KPI设计', '工具使用规范与培训', '内部协作流程', '外包与兼职团队管理', '财务管理与报价体系'] },
      { title: '第四章：商业案例全流程（12课时）', lessons: ['案例1：电商品牌视频全流程（从提案到交付）', '案例2：知识付费宣传片制作', '案例3：餐饮品牌特色展示', '案例4：汽车品牌概念视频', '案例5：美妆产品使用视频', '案例6：科技产品发布会视频', '案例7：地产行业项目展示', '案例8：教育机构招生视频', '各行业报价参考', '如何开拓B端客户', '长期合作客户维护', '年收入百万工作室运营复盘'] },
      { title: '第五章：未来趋势与扩展（12课时）', lessons: ['AI视频技术发展预测', '如何保持技术领先', '多模态AI工具整合', 'AI+真人协同创作模式', '国际化内容生产', '虚拟偶像与数字人应用', 'AIGC版权与合规', 'AI视频商业伦理', '竞争策略与护城河', '融资与规模化发展', '行业资源整合', '职业发展规划指导'] },
    ]
  },

  // ---------- AI短剧 ----------
  {
    id: 201, category: 'shortdrama', level: '入门', levelColor: '#4ade80',
    title: 'AI短剧入门：剧本创作·AI生成·首部短剧',
    subtitle: '用AI工具从0到1制作第一部AI短剧，无需拍摄即可完成',
    students: 982, rating: 4.8, reviews: 234, duration: '12小时', lessons: 24,
    teacher: { name: '周编剧', avatar: '周', title: 'AI短剧创作导师', bio: '编剧出身，首批AI短剧创作者' },
    price: 299, originalPrice: 799,
    tags: ['剧本写作', 'AI生成', '短剧制作', '入门'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    highlight: '首部AI短剧必学',
    chapters: [
      { title: '第一章：AI短剧认知与选题（4课时）', lessons: ['AI短剧行业发展现状', '短剧与短视频的区别', '热门短剧题材分析', '如何选择适合自己的题材'] },
      { title: '第二章：AI短剧剧本创作（6课时）', lessons: ['短剧剧本结构（起承转合）', '如何设计钩子与反转', '人物设定与对白写作', '冲突构建与情绪节奏', 'AI辅助剧本写作工具', '学员剧本作业辅导'] },
      { title: '第三章：AI生成短剧画面（6课时）', lessons: ['即梦/可灵生成连续镜头', '分镜脚本制作方法', '角色一致性与场景连贯', '运镜与转场设计', '音效与配音合成', '学员作品实战'] },
      { title: '第四章：剪辑与成片发布（5课时）', lessons: ['Final Cut Pro短剧剪辑', '字幕与片头片尾设计', 'BGM与情绪配乐', '短剧发布平台选择', '如何让短剧获得传播'] },
      { title: '第五章：首部作品发布（3课时）', lessons: ['首部AI短剧发布计划', '如何获取第一批观众', '短剧账号运营基础', '互动引导与粉丝维护'] },
    ]
  },
  {
    id: 202, category: 'shortdrama', level: '进阶', levelColor: '#f59e0b',
    title: 'AI短剧进阶：多集连拍·专业配音·爆款打造',
    subtitle: '制作多集连续AI短剧，掌握专业配音合成与流量密码',
    students: 678, rating: 4.9, reviews: 189, duration: '18小时', lessons: 36,
    teacher: { name: '赵导演', avatar: '赵', title: 'AI短剧制作人', bio: '制作AI短剧30+部，全网播放破亿' },
    price: 599, originalPrice: 1599,
    tags: ['多集制作', '配音合成', '爆款', '进阶'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
    highlight: '多集连续剧制作',
    chapters: [
      { title: '第一章：多集短剧制作规划（5课时）', lessons: ['系列短剧的故事架构', '集与集之间的钩子设计', '人物成长弧线设计', '如何保持角色一致性', '多集制作的效率管理'] },
      { title: '第二章：AI配音与声音合成（8课时）', lessons: ['声音克隆技术详解', '如何用AI生成不同角色声音', '配音脚本与时间轴对齐', '情绪化配音处理技巧', '背景音与音效设计', '多角色对话场景处理', '专业配音流程演示', '配音后期修整技巧'] },
      { title: '第三章：后期制作全流程（7课时）', lessons: ['Premiere Pro多集剪辑管理', '集与集之间转场设计', '色调统一与风格化', '字幕翻译与多语言版本', '原创音乐与版权音乐', '多版本导出设置', '成片质量审核标准'] },
      { title: '第四章：爆款短剧打造方法论（8课时）', lessons: ['爆款短剧的结构拆解', '如何写出让人停不下来的剧情', '情绪调动技巧', '短视频平台算法解析', '如何在前3秒留住观众', '付费短剧的转化设计', '完播率与复播率优化', '学员作品诊断与优化'] },
      { title: '第五章：短剧变现全攻略（8课时）', lessons: ['短剧变现6大路径', '平台分账模式详解', '付费短剧制作与投放', '品牌定制短剧接单', '短剧IP授权与衍生', '私域粉丝变现', '如何月入3万+', '进阶变现案例复盘'] },
    ]
  },
  {
    id: 203, category: 'shortdrama', level: '专业', levelColor: '#ef4444',
    title: 'AI短剧大师营：IP孵化·系列开发·商业帝国',
    subtitle: '从单个短剧到系列IP，打造可持续盈利的内容商业帝国',
    students: 234, rating: 5.0, reviews: 67, duration: '28小时', lessons: 56,
    teacher: { name: '李掌门', avatar: '李', title: '内容创业导师', bio: '孵化10+个短剧IP，年收入千万级' },
    price: 1999, originalPrice: 5999,
    tags: ['IP孵化', '系列开发', '商业变现', '大师'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
    highlight: '打造个人IP必学',
    chapters: [
      { title: '第一章：AI短剧IP打造（10课时）', lessons: ['IP定位与差异化策略', '角色设计方法论', '世界观构建技巧', 'IP核心价值观提炼', '多平台IP布局', 'IP视觉形象设计', 'IP声音与人设统一', 'IP粉丝社群建设', 'IP商业价值评估', 'IP成长路径规划'] },
      { title: '第二章：系列化内容开发（10课时）', lessons: ['系列内容世界观扩展', '主线与支线剧情设计', '季与季之间的过渡', '衍生内容创作', '跨类型IP联动', '系列内容排期管理', '内容质量保障体系', '粉丝反馈与内容迭代', 'IP版权保护策略', 'IP授权谈判技巧'] },
      { title: '第三章：商业化运营体系（12课时）', lessons: ['短剧IP多元化变现', '品牌合作报价体系', 'IP联名产品开发', 'IP授权费计算方法', '电商+内容双驱动', '私域高价值变现', 'IP粉丝会员体系', '线下活动与见面会', 'IP融资与资本化', 'MCN机构合作策略', '内容出海与国际化', '年度收入规划与执行'] },
      { title: '第四章：大师级案例全拆解（14课时）', lessons: ['爆款IP案例1深度拆解', '爆款IP案例2深度拆解', '爆款IP案例3深度拆解', '失败IP案例分析与教训', '海外AI短剧案例借鉴', '跨平台运营成功案例', 'IP与品牌合作经典案例', 'IP授权变现成功案例', '学员项目1诊断辅导', '学员项目2诊断辅导', '学员项目3诊断辅导', '学员项目4诊断辅导', '年度运营计划制定', '个人IP发展路线图'] },
      { title: '第五章：AI短剧未来趋势（10课时）', lessons: ['AI短剧技术前沿', '交互式短剧设计', 'AI虚拟演员应用', '多语言AI短剧全球分发', 'VR/AR+短剧探索', 'AI短剧行业预测', '技术变革应对策略', '内容监管与合规', 'AI短剧伦理与责任', '大师班毕业答辩'] },
    ]
  },

  // ---------- AI漫剧 ----------
  {
    id: 301, category: 'mangadrama', level: '入门', levelColor: '#4ade80',
    title: 'AI漫剧入门：漫画分镜·AI绘图·动态漫画',
    subtitle: '用AI工具快速生成漫画分镜，制作动态漫画视频',
    students: 745, rating: 4.7, reviews: 178, duration: '10小时', lessons: 20,
    teacher: { name: '漫小七', avatar: '漫', title: 'AI漫画创作师', bio: '全网连载AI漫画作品20+部' },
    price: 249, originalPrice: 699,
    tags: ['漫画分镜', 'AI绘图', '动态漫画', '入门'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)',
    highlight: '漫画创作者入门',
    chapters: [
      { title: '第一章：AI漫画认知（3课时）', lessons: ['AI漫剧行业现状', '静态漫画vs动态漫剧', '主流AI绘图工具选择'] },
      { title: '第二章：漫画分镜与剧本（5课时）', lessons: ['漫画分镜基础知识', '分镜头脚本设计', '对白框与效果字设计', 'AI辅助分镜生成', '漫画剧本写作入门'] },
      { title: '第三章：AI生成漫画画面（6课时）', lessons: ['Midjourney生成漫画风格', 'Stable Diffusion + ControlNet分镜', '角色一致性技巧', '场景与背景生成', '光效与氛围营造', '多图生成与筛选'] },
      { title: '第四章：动态漫画制作（4课时）', lessons: ['动态漫画原理与工具', '剪映动态化处理', '口型同步与表情动画', 'BGM与音效配合'] },
      { title: '第五章：作品发布与运营（2课时）', lessons: ['漫画平台发布攻略', '动态漫画账号运营'] },
    ]
  },
  {
    id: 302, category: 'mangadrama', level: '进阶', levelColor: '#f59e0b',
    title: 'AI漫剧进阶：商业漫剧·系列开发·平台签约',
    subtitle: '制作高质量商业漫剧内容，与平台签约获得稳定收益',
    students: 456, rating: 4.9, reviews: 123, duration: '16小时', lessons: 32,
    teacher: { name: '漫威老师', avatar: '威', title: '商业漫画制作人', bio: '签约快看、腾讯漫画平台，月收入3万+' },
    price: 599, originalPrice: 1599,
    tags: ['商业漫剧', '系列开发', '平台签约', '进阶'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #be185d 0%, #ec4899 100%)',
    highlight: '平台签约实战',
    chapters: [
      { title: '第一章：商业漫剧制作规范（6课时）', lessons: ['商业漫画平台要求', '分辨率与输出规范', '分镜节奏与阅读体验', '商业漫画的故事结构', '对白与叙事平衡', '质量审核标准解读'] },
      { title: '第二章：AI辅助漫画高效生产（8课时）', lessons: ['ComfyUI批量生成漫画分镜', 'Lora训练角色一致性', 'AI生成+人工精修流程', '不同风格漫画制作方案', '批量生成效率优化', '素材管理与版本控制', 'AI+手绘结合技法', '工作室生产流程设计'] },
      { title: '第三章：系列漫剧开发（6课时）', lessons: ['系列故事架构设计', '角色成长体系', '多线叙事技巧', '伏笔与悬念设计', '系列更新排期管理', '粉丝运营与互动'] },
      { title: '第四章：平台签约实战（6课时）', lessons: ['快看/腾讯漫画平台分析', '签约流程与注意事项', '分成模式与收益计算', '如何通过编辑审核', '连载更新策略', '作品推广与曝光'] },
      { title: '第五章：漫剧多元化变现（6课时）', lessons: ['付费阅读变现', '广告植入与品牌合作', '周边产品开发', 'IP改编授权', '漫剧+带货组合变现', '月入过万案例分享'] },
    ]
  },
  {
    id: 303, category: 'mangadrama', level: '专业', levelColor: '#ef4444',
    title: 'AI漫剧大师班：从创作到商业化的完整体系',
    subtitle: '打造具有商业价值的漫剧IP，建立完整的创作-变现闭环',
    students: 189, rating: 5.0, reviews: 45, duration: '22小时', lessons: 44,
    teacher: { name: '漫总裁', avatar: '总', title: 'AI漫画CEO', bio: '从0到1孵化3个头部漫剧IP，年收入500万+' },
    price: 1699, originalPrice: 4999,
    tags: ['IP打造', '商业化', '全体系', '大师'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #9d174d 0%, #db2777 100%)',
    highlight: '漫剧创业系统课',
    chapters: [
      { title: '第一章：AI漫剧IP战略定位（8课时）', lessons: ['IP市场调研方法', '差异化定位策略', '目标受众画像构建', '竞品分析与蓝海机会', 'IP核心价值主张', 'IP视觉识别系统设计', 'IP声音设计', 'IP世界观深度构建'] },
      { title: '第二章：AI漫剧工业化生产体系（10课时）', lessons: ['漫画工作室搭建', 'AI工具链整合方案', '角色Lora定制训练', '场景与道具资产库建设', '批量生产质量管理', '多风格制作能力建设', '团队分工与协作流程', '效率工具全整合', '成本控制与利润优化', '产能扩张策略'] },
      { title: '第三章：全平台运营与粉丝经济（8课时）', lessons: ['快看/腾讯/B站差异化运营', '短视频漫剧引流策略', '私域粉丝体系建设', '会员订阅模式设计', '粉丝社群活跃技巧', 'KOL合作与传播裂变', '跨平台内容矩阵搭建', '数据分析与内容优化'] },
      { title: '第四章：商业化全链路（10课时）', lessons: ['漫剧IP多元化变现地图', '付费订阅体系设计', '广告变现策略与报价', '品牌联名与授权', '周边产品开发与销售', '影视改编授权', '游戏改编授权', '出海与全球化', '融资路演与资本对接', '年入百万运营复盘'] },
      { title: '第五章：大师案例与毕业答辩（8课时）', lessons: ['头部IP全拆解案例1', '头部IP全拆解案例2', '新兴IP快速崛起案例', '失败案例深度分析', '学员项目路演', '导师一对一指导', '毕业作品评审', '行业资源对接会'] },
    ]
  },

  // ---------- AI电影 ----------
  {
    id: 401, category: 'film', level: '入门', levelColor: '#4ade80',
    title: 'AI电影入门：剧本·分镜·AI生图·首部微电影',
    subtitle: '零基础用AI工具制作第一部AI微电影，感受AI影视的魅力',
    students: 1123, rating: 4.9, reviews: 298, duration: '14小时', lessons: 28,
    teacher: { name: '电影小白', avatar: '影', title: 'AI电影创作导师', bio: '用AI工具制作20+部短片，电影节入选' },
    price: 299, originalPrice: 899,
    tags: ['剧本创作', '分镜设计', 'AI生图', '微电影'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
    highlight: 'AI电影入门首选',
    chapters: [
      { title: '第一章：AI电影认知（3课时）', lessons: ['AI电影发展历史', '当前AI电影制作能力边界', '主流AI影视工具全景图'] },
      { title: '第二章：AI电影剧本创作（6课时）', lessons: ['电影剧本结构（经典三幕式）', '微电影剧本写作特点', 'AI辅助剧本生成工具', '如何用ChatGPT辅助编剧', '剧本修改与打磨', '学员剧本作业点评'] },
      { title: '第三章：AI分镜与画面生成（8课时）', lessons: ['分镜头脚本设计原理', 'AI生成分镜画面（Midjourney）', 'AI生成分镜画面（SD）', '角色一致性与场景连贯', '光影与色调设计', '运镜分镜表达', '分镜素材整理与管理', '学员分镜作业'] },
      { title: '第四章：后期合成与成片（7课时）', lessons: ['Premiere Pro基础操作', 'AI分镜片段剪辑', '音效设计与配乐', '色彩调级与风格化', '字幕与片头制作', '达芬奇调色入门', '首部AI微电影发布'] },
      { title: '第五章：作品发布与反馈（4课时）', lessons: ['视频平台发布策略', '如何撰写吸引人的简介', '如何获取第一批观众', '作品反馈分析与改进'] },
    ]
  },
  {
    id: 402, category: 'film', level: '进阶', levelColor: '#f59e0b',
    title: 'AI电影进阶：专业级制作·特效合成·参赛获奖',
    subtitle: '制作具有电影质感的AI短片，掌握专业特效合成技术',
    students: 567, rating: 4.9, reviews: 167, duration: '20小时', lessons: 40,
    teacher: { name: '李导演', avatar: '李', title: '资深影视导演', bio: '执导院线电影2部，AI短片获国际电影节奖项' },
    price: 799, originalPrice: 2299,
    tags: ['专业制作', '特效合成', '调色', '参赛'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1472718084807-1b1f7dc5bbb5?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
    highlight: '冲击电影节奖项',
    chapters: [
      { title: '第一章：AI电影高级制作流程（6课时）', lessons: ['AI电影制作全流程梳理', '镜头规划与脚本拆解', 'AI工具链最优组合', '效率与质量平衡', '团队协作流程', '制作时间规划'] },
      { title: '第二章：电影级画面生成（8课时）', lessons: ['Midjourney电影感参数设置', 'ComfyUI专业工作流', '光影与氛围精确控制', '角色情感表达生成', '复杂场景生成技巧', '如何保持镜头连贯性', '电影风格参考与学习', '生成素材筛选与精修'] },
      { title: '第三章：专业级特效合成（8课时）', lessons: ['After Effects特效合成基础', 'AI素材与实拍融合', '绿幕抠像与合成', '光效与粒子特效', '动态追踪与稳定', '3D元素与AI素材结合', '电影级特效案例演示', '专业级输出设置'] },
      { title: '第四章：电影调色与声音设计（6课时）', lessons: ['达芬奇专业调色流程', '电影色调风格分析', 'AI辅助自动调色', '声音设计基础理论', 'AI配音与音效合成', '环绕声与沉浸式音频'] },
      { title: '第五章：参赛作品打造（6课时）', lessons: ['AI短片参赛渠道汇总', '评委看重的核心要素', '作品创意与主题表达', '如何制作高质量参赛作品', '参赛报名与材料准备', '获奖作品案例分析'] },
      { title: '第六章：实战作业（6课时）', lessons: ['作业1：制作一部2分钟剧情短片', '作业2：制作一部特效短片', '作业3：制作一部参赛作品', '作业1点评与修改', '作业2点评与修改', '作业3点评与修改'] },
    ]
  },
  {
    id: 403, category: 'film', level: '专业', levelColor: '#ef4444',
    title: 'AI电影大师营：从短片到长片·商业制作·行业领航',
    subtitle: 'AI电影制作的最高境界，打造商业级AI电影作品',
    students: 178, rating: 5.0, reviews: 45, duration: '32小时', lessons: 64,
    teacher: { name: '张大师', avatar: '张', title: 'AI影视制作人', bio: '制作AI长片2部，AI电影行业先驱' },
    price: 2999, originalPrice: 8999,
    tags: ['AI长片', '商业制作', '行业领袖', '大师'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)',
    highlight: 'AI电影最高殿堂',
    chapters: [
      { title: '第一章：AI长片制作体系（10课时）', lessons: ['AI长片叙事结构', '长片剧本创作方法', '100+镜头的一致性管理', 'AI长片制作排期', '长片制作成本控制', '团队配置与分工', '素材管理与版本控制', '长片质量管理体系', 'AI长片技术前沿', '制作流程SOP文档'] },
      { title: '第二章：AI电影工业化（10课时）', lessons: ['AI影视工业化体系', '制作管线设计', 'AI工具迭代与升级', '数据资产管理', '自动化生产方案', '质量控制体系', '版本管理协作工具', '内容安全与审核', '版权与法律合规', 'AI影视制作标准制定'] },
      { title: '第三章：商业AI电影项目（12课时）', lessons: ['商业AI广告电影制作', '品牌故事微电影', '公益AI短片', '教育AI内容', '纪录片AI化', '音乐MV AI制作', '城市宣传片', '产品发布会视频', '电视剧AI化探索', '院线AI电影可能性', '商业报价与合同', '客户服务与交付'] },
      { title: '第四章：AI电影行业生态（10课时）', lessons: ['全球AI电影行业现状', '头部公司案例分析', 'AI影视投资逻辑', '创业机会与赛道选择', '个人品牌与行业影响力', '行业会议与资源对接', 'AI影视人才需求', '教育与培训市场', '内容监管趋势', '未来10年AI电影预测'] },
      { title: '第五章：大师项目实战与毕业（22课时）', lessons: ['学员项目立项指导', '项目创意研讨会', '剧本工作坊', '分镜设计评审', '制作过程跟踪', '中期审查与调整', '后期制作指导', '调色与音效指导', '成片评审会', '毕业作品发布', '行业资源对接', '创业孵化支持', '持续成长社群'] },
    ]
  },

  // ---------- AI设计师 ----------
  {
    id: 501, category: 'designer', level: '入门', levelColor: '#4ade80',
    title: 'AI设计师入门：Logo·品牌视觉·Midjourney商业设计',
    subtitle: '用AI工具快速完成Logo设计、品牌视觉、品牌VI基础',
    students: 2341, rating: 4.8, reviews: 567, duration: '12小时', lessons: 24,
    teacher: { name: '设计小美', avatar: '美', title: 'AI商业设计师', bio: '服务品牌100+，AI设计作品获奖' },
    price: 199, originalPrice: 599,
    tags: ['Logo设计', '品牌视觉', 'Midjourney', '入门'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
    highlight: '设计师入门必学',
    chapters: [
      { title: '第一章：AI设计认知与工具（4课时）', lessons: ['AI设计行业发展现状', 'Midjourney注册与基础操作', 'Stable Diffusion商业设计优势', 'AI设计工具选择与组合'] },
      { title: '第二章：Logo设计实战（7课时）', lessons: ['Logo设计基础理论', 'Midjourney生成Logo的提示词', '不同类型Logo生成技巧（科技/餐饮/文创）', 'Logo矢量化的AI辅助方法', '色彩搭配与品牌色选择', 'Logo版权与原创保护', '学员Logo作品点评'] },
      { title: '第三章：品牌视觉基础（6课时）', lessons: ['品牌视觉识别系统（VI）概述', '主KV（主视觉）AI生成', '品牌色彩体系设计', '品牌字体选择建议', '社交媒体头像与封面设计', '品牌视觉一致性原则'] },
      { title: '第四章：商业设计接单入门（4课时）', lessons: ['设计平台接单渠道', '如何与客户高效沟通需求', '设计报价与合同签订', 'AI设计交付标准与格式'] },
      { title: '第五章：作品集搭建（3课时）', lessons: ['设计师作品集制作', 'Behance/Dribbble展示技巧', '如何用AI设计作品集展示'] },
    ]
  },
  {
    id: 502, category: 'designer', level: '进阶', levelColor: '#f59e0b',
    title: 'AI设计师进阶：UI设计·电商详情·高客单设计',
    subtitle: '掌握AI辅助UI设计、电商视觉、产品设计，高客单价接单',
    students: 1567, rating: 4.9, reviews: 389, duration: '18小时', lessons: 36,
    teacher: { name: 'UI老王', avatar: '王', title: '资深UI设计师', bio: '阿里/字节设计师，AI设计布道师' },
    price: 599, originalPrice: 1699,
    tags: ['UI设计', '电商详情', '高客单', '进阶'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
    highlight: '高收入设计技能',
    chapters: [
      { title: '第一章：AI+UI设计（8课时）', lessons: ['AI在UI设计中的应用场景', 'Midjourney生成App界面概念', 'Stable Diffusion + ControlNet生成UI', 'AI生成图标与插画', '深色/浅色主题设计', '响应式设计AI辅助', 'AI生成插画风格指南', 'UI设计AI提效实战'] },
      { title: '第二章：AI+电商视觉设计（8课时）', lessons: ['电商详情页结构设计', 'AI生成主图与场景图', '产品卖点视觉化呈现', 'AI生成模特与场景', '电商Banner设计技巧', 'AI生成营销海报', '详情页排版与文案配合', '高转化详情页设计案例'] },
      { title: '第三章：AI+产品设计（6课时）', lessons: ['AI生成产品外观设计', '包装设计AI辅助', '工业设计概念生成', '家具/家居产品AI设计', 'AI设计+3D建模结合', '产品设计提案制作'] },
      { title: '第四章：高客单价设计接单（6课时）', lessons: ['如何定价3000+的设计单', '品牌设计提案制作', '设计合同模板与签订', '客户需求挖掘与引导', '设计修改谈判技巧', '月入3万设计工作室案例'] },
      { title: '第五章：AI设计效率提升（8课时）', lessons: ['ComfyUI设计工作流', '批量生成设计方案', 'Lora训练品牌风格', 'AI+PS高效配合', '设计素材AI管理', '团队AI设计协作', 'AI设计质量审核', '设计师AI工具链全整合'] },
    ]
  },
  {
    id: 503, category: 'designer', level: '专业', levelColor: '#ef4444',
    title: 'AI设计大师营：全案设计·团队管理·设计创业',
    subtitle: '从个人设计师到设计公司老板的完整成长路径',
    students: 345, rating: 5.0, reviews: 89, duration: '26小时', lessons: 52,
    teacher: { name: '设计总监', avatar: '总', title: '设计公司CEO', bio: '从设计师到创办年收入500万设计公司' },
    price: 1999, originalPrice: 5999,
    tags: ['全案设计', '团队管理', '设计创业', '大师'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
    highlight: '设计创业系统课',
    chapters: [
      { title: '第一章：全案品牌设计体系（10课时）', lessons: ['品牌战略与设计定位', '品牌调研方法论', '品牌概念发展', 'Logo系统设计', 'VI视觉识别系统', '品牌应用设计（办公/物料/数字）', '品牌手册制作', '品牌设计交付标准', '品牌设计案例复盘', '全案设计报价体系'] },
      { title: '第二章：AI设计工作室搭建（8课时）', lessons: ['AI设计工作室定位', '工具链配置方案', '人员招聘与培训', '设计流程标准化', '质量管理体系', '客户管理体系', '财务与成本控制', '工作室品牌建设'] },
      { title: '第三章：大型商业项目实战（12课时）', lessons: ['项目1：连锁品牌全套VI设计', '项目2：科技公司产品设计', '项目3：餐饮品牌全案', '项目4：电商平台视觉升级', '项目5：政府/公益组织设计', '项目6：个人IP品牌设计', '项目7：App产品整套UI', '项目8：地产项目全套视觉', '大型项目管理方法', '多项目并行管理', '危机处理与客户维护', '项目复盘与经验沉淀'] },
      { title: '第四章：设计创业与规模化（10课时）', lessons: ['设计公司商业模式', '如何获得第一批客户', '口碑传播与案例营销', '设计公司股权与激励', '融资与规模化发展', '收购与并购策略', '设计行业未来趋势', '设计师职业发展路径', '个人IP与公司品牌', '年入百万设计公司运营'] },
      { title: '第五章：大师班毕业（12课时）', lessons: ['学员项目立项', '导师团队项目诊断', '品牌设计方案评审', '商业模式梳理', '行业资源对接', '融资指导', '法律合规指导', '毕业作品发布会', '优秀学员颁奖', '创业导师对接', '学员互助社群', '毕业后持续成长计划'] },
    ]
  },

  // ---------- AI带货变现 ----------
  {
    id: 601, category: 'commerce', level: '入门', levelColor: '#4ade80',
    title: 'AI带货入门：短视频带货底层逻辑·AI快速起号',
    subtitle: '搞懂短视频带货的底层逻辑，用AI工具快速启动带货账号',
    students: 3421, rating: 4.7, reviews: 876, duration: '10小时', lessons: 20,
    teacher: { name: '带货达人', avatar: '达', title: 'AI带货实战导师', bio: '单场直播带货破百万，AI带货方法论创始人' },
    price: 199, originalPrice: 599,
    tags: ['带货逻辑', 'AI起号', '选品', '入门'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
    highlight: '最适合新手入门带货',
    chapters: [
      { title: '第一章：短视频带货底层逻辑（4课时）', lessons: ['短视频带货 vs 图文带货', '平台算法与流量分发', '带货账号定位方法', '什么样的账号能带货成功'] },
      { title: '第二章：AI工具快速起号（5课时）', lessons: ['AI生成账号头像与背景图', 'AI生成账号简介视觉', 'AI辅助账号定位分析', '竞品账号AI分析工具', '起号时间规划与执行'] },
      { title: '第三章：AI生成带货内容（6课时）', lessons: ['AI辅助选品策略', 'ChatGPT生成带货脚本', '即梦/可灵生成产品展示视频', 'AI生成产品对比视频', 'AI生成种草图文', '批量生成内容的方法'] },
      { title: '第四章：账号运营基础（3课时）', lessons: ['账号冷启动运营', '如何获得初始流量', '粉丝互动与转化引导'] },
      { title: '第五章：首次带货实战（2课时）', lessons: ['首次带货选品建议', '如何迈出带货第一步'] },
    ]
  },
  {
    id: 602, category: 'commerce', level: '进阶', levelColor: '#f59e0b',
    title: 'AI带货进阶：选品矩阵·AI批量制作·月入过万',
    subtitle: '建立选品矩阵，用AI批量制作高质量带货视频，实现稳定收益',
    students: 2341, rating: 4.8, reviews: 623, duration: '16小时', lessons: 32,
    teacher: { name: '带货王', avatar: '王', title: 'AI带货操盘手', bio: '操盘30+带货账号，月GMV破500万' },
    price: 599, originalPrice: 1699,
    tags: ['选品矩阵', 'AI批量制作', '月入过万', '进阶'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
    highlight: '月入过万实战课',
    chapters: [
      { title: '第一章：选品策略与矩阵搭建（6课时）', lessons: ['带货选品底层逻辑', '如何发现高佣金产品', '应季选品时间规划', '爆款选品数据工具', '建立个人选品库', '选品风险控制'] },
      { title: '第二章：AI批量制作带货视频（10课时）', lessons: ['AI生成带货视频工作流', '即梦/可灵产品展示技巧', 'AI生成对比测评视频', 'AI生成种草安利视频', 'AI生成剧情带货视频', '批量生成脚本的方法', '批量生成的效率优化', '素材管理与版本控制', '多平台内容适配', 'AI视频质量把控'] },
      { title: '第三章：高转化带货脚本（6课时）', lessons: ['带货脚本结构拆解', 'AI快速生成100+脚本', '如何写让人忍不住下单的脚本', '不同品类带货脚本模板', '脚本A/B测试方法', '脚本迭代优化策略'] },
      { title: '第四章：账号矩阵运营（5课时）', lessons: ['为什么要做账号矩阵', 'AI辅助多账号管理', '不同账号差异化定位', '矩阵账号内容协同', '矩阵账号数据监控'] },
      { title: '第五章：月入过万实战复盘（5课时）', lessons: ['账号数据诊断方法', 'ROI计算与优化', '如何提升转化率', '月入过万账号拆解', '月入过万进阶路线图'] },
    ]
  },
  {
    id: 603, category: 'commerce', level: '专业', levelColor: '#ef4444',
    title: 'AI带货大师营：团队矩阵·直播带货·年入百万',
    subtitle: 'AI赋能带货全链路，从个人到团队，打造百万级带货体系',
    students: 567, rating: 5.0, reviews: 178, duration: '24小时', lessons: 48,
    teacher: { name: '带货总裁', avatar: '总', title: 'AI带货公司CEO', bio: '从0到1搭建AI带货团队，年GMV破千万' },
    price: 1999, originalPrice: 5999,
    tags: ['团队矩阵', '直播带货', '年入百万', '大师'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=450&fit=crop',
    bgColor: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
    highlight: '带货创业终极课',
    chapters: [
      { title: '第一章：AI带货团队搭建（8课时）', lessons: ['AI带货商业模式画布', '团队架构与岗位设置', 'AI工具链配置', '人员招聘与培训', '绩效考核体系设计', '团队协作流程', '成本控制与ROI', '创业启动资金规划'] },
      { title: '第二章：账号矩阵规模化（8课时）', lessons: ['矩阵账号战略规划', 'AI批量账号注册与运营', '账号差异化策略', '内容工厂模式', '质量与效率平衡', '矩阵数据监控系统', '账号淘汰与迭代', '规模化运营SOP'] },
      { title: '第三章：AI+直播带货（10课时）', lessons: ['AI直播趋势分析', 'AI虚拟主播搭建', 'AI直播脚本生成', 'AI实时互动应答', 'AI直播数据分析', '直播选品策略', '直播话术设计', '直播复盘与优化', 'AI+真人混合直播', '直播带货完整案例'] },
      { title: '第四章：高客单高佣金产品（6课时）', lessons: ['高客单产品选择', '高佣金产品渠道', 'AI生成高端感内容', '高客单转化话术', '高客单客户私域运营', '高客单复购策略'] },
      { title: '第五章：年入百万实战（16课时）', lessons: ['百万GMV拆解', '年度目标规划', 'Q1-Q4运营节奏', '爆款打造方法论', '淡旺季运营策略', '供应链管理', '仓储与物流', '客服团队建设', '私域变现体系', '合伙人模式', '融资与扩张', '行业资源整合', '法律合规经营', '品牌化发展路径', '退出机制规划', '大师班毕业答辩'] },
    ]
  },
]

// ======= 案例拆解数据（6类型 × 3-4个案例）=======
const caseStudies = [
  // AI短视频
  {
    id: 1, category: 'shortvideo', categoryName: 'AI短视频',
    title: '【AI短视频】科技公司品牌宣传片全流程拆解',
    desc: '从脚本策划到后期剪辑，用AI工具制作专业品牌宣传片，即梦生图+剪映剪辑完整流程。',
    creator: { name: '林小影', avatar: '林', followers: 1230 },
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop',
    videoUrl: '', duration: '18:30', views: 3256, likes: 189, comments: 45,
    tags: ['品牌宣传', 'AI视频', '即梦'],
    createdAt: '2026-04-06', price: 0
  },
  {
    id: 2, category: 'shortvideo', categoryName: 'AI短视频',
    title: '【AI短视频】电商直播预告片 AI 制作全攻略',
    desc: '10分钟掌握爆款直播预告片制作，AI生图+AI视频+AI配音一条龙演示。',
    creator: { name: '带货达人', avatar: '达', followers: 890 },
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop',
    videoUrl: '', duration: '14:45', views: 1892, likes: 112, comments: 28,
    tags: ['电商', '直播预告', 'AI制作'],
    createdAt: '2026-04-04', price: 0
  },
  {
    id: 3, category: 'shortvideo', categoryName: 'AI短视频',
    title: '【AI短视频】产品功能展示视频 AI 生成实战',
    desc: '用AI工具批量生成产品功能展示视频，日产100条不同角度的产品视频。',
    creator: { name: '陈导', avatar: '陈', followers: 2100 },
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    videoUrl: '', duration: '16:00', views: 2567, likes: 167, comments: 38,
    tags: ['产品展示', '批量生成', '电商'],
    createdAt: '2026-04-02', price: 9.9
  },
  {
    id: 4, category: 'shortvideo', categoryName: 'AI短视频',
    title: '【AI短视频】城市宣传片 AI 制作全流程复盘',
    desc: '用AI工具低成本制作城市宣传片，完整复盘从创意到成片的全过程。',
    creator: { name: '周编剧', avatar: '周', followers: 1567 },
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop',
    videoUrl: '', duration: '22:00', views: 4102, likes: 278, comments: 56,
    tags: ['城市宣传', '文旅', 'AI电影感'],
    createdAt: '2026-03-30', price: 19.9
  },

  // AI短剧
  {
    id: 5, category: 'shortdrama', categoryName: 'AI短剧',
    title: '【AI短剧】都市情感AI短剧《第101次心动》第一集',
    desc: '完整拆解AI生成都市情感短剧的全流程，剧本+分镜+AI画面+配音+剪辑。',
    creator: { name: '周编剧', avatar: '周', followers: 1567 },
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop',
    videoUrl: '', duration: '08:30', views: 8921, likes: 567, comments: 123,
    tags: ['都市情感', '短剧', '剧情'],
    createdAt: '2026-04-05', price: 0
  },
  {
    id: 6, category: 'shortdrama', categoryName: 'AI短剧',
    title: '【AI短剧】穿越悬疑AI短剧《时光旅人》制作揭秘',
    desc: '穿越题材AI短剧制作全解析，时间线一致性处理、角色多年龄段生成技巧。',
    creator: { name: '赵导演', avatar: '赵', followers: 3200 },
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=400&fit=crop',
    videoUrl: '', duration: '12:45', views: 6789, likes: 423, comments: 89,
    tags: ['穿越悬疑', '角色一致', '技巧'],
    createdAt: '2026-04-03', price: 29.9
  },
  {
    id: 7, category: 'shortdrama', categoryName: 'AI短剧',
    title: '【AI短剧】霸总题材短剧5集连拍制作复盘',
    desc: '霸总题材AI短剧从剧本到成片的完整制作过程，一次性生成5集内容。',
    creator: { name: '李掌门', avatar: '李', followers: 4500 },
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop',
    videoUrl: '', duration: '45:00', views: 12450, likes: 892, comments: 234,
    tags: ['霸总', '系列', '批量制作'],
    createdAt: '2026-04-01', price: 49.9
  },

  // AI漫剧
  {
    id: 8, category: 'mangadrama', categoryName: 'AI漫剧',
    title: '【AI漫剧】《星际猎人》动态漫画第一季全5集',
    desc: '科幻题材动态AI漫剧，Midjourney生成漫画分镜+剪映动态化完整流程。',
    creator: { name: '漫小七', avatar: '漫', followers: 2800 },
    thumbnail: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=600&h=400&fit=crop',
    videoUrl: '', duration: '30:00', views: 5678, likes: 389, comments: 78,
    tags: ['科幻', '动态漫', 'Midjourney'],
    createdAt: '2026-04-04', price: 19.9
  },
  {
    id: 9, category: 'mangadrama', categoryName: 'AI漫剧',
    title: '【AI漫剧】古风玄幻《九州录》制作全流程拆解',
    desc: '古风玄幻动态漫剧，从角色Lora训练到批量生成漫画分镜的完整教程。',
    creator: { name: '漫威老师', avatar: '威', followers: 3600 },
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop',
    videoUrl: '', duration: '25:30', views: 7891, likes: 521, comments: 112,
    tags: ['古风', '玄幻', 'Lora'],
    createdAt: '2026-04-01', price: 29.9
  },
  {
    id: 10, category: 'mangadrama', categoryName: 'AI漫剧',
    title: '【AI漫剧】少女漫画风格动态漫制作技巧分享',
    desc: '日系少女漫画风格动态漫剧AI制作，从分镜到配音全流程教学。',
    creator: { name: '漫总裁', avatar: '总', followers: 1890 },
    thumbnail: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=600&h=400&fit=crop',
    videoUrl: '', duration: '20:15', views: 4321, likes: 312, comments: 67,
    tags: ['少女漫', '日系', '风格'],
    createdAt: '2026-03-28', price: 0
  },

  // AI电影
  {
    id: 11, category: 'film', categoryName: 'AI电影',
    title: '【AI电影】科幻短片《最后的人类》制作全解析',
    desc: '用AI工具制作院线级科幻短片，Midjourney+ComfyUI+达芬奇完整流程。',
    creator: { name: '李导演', avatar: '李', followers: 5200 },
    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop',
    videoUrl: '', duration: '28:00', views: 15670, likes: 1234, comments: 345,
    tags: ['科幻', '电影级', '完整流程'],
    createdAt: '2026-04-06', price: 99.9
  },
  {
    id: 12, category: 'film', categoryName: 'AI电影',
    title: '【AI电影】温情短片《父亲的AI情书》创作分享',
    desc: '感人至深的温情AI短片，用AI表达人类最真挚的情感，适合新手入门。',
    creator: { name: '电影小白', avatar: '影', followers: 3400 },
    thumbnail: 'https://images.unsplash.com/photo-1472718084807-1b1f7dc5bbb5?w=600&h=400&fit=crop',
    videoUrl: '', duration: '15:30', views: 8923, likes: 678, comments: 189,
    tags: ['温情', '情感', '新手入门'],
    createdAt: '2026-04-03', price: 0
  },
  {
    id: 13, category: 'film', categoryName: 'AI电影',
    title: '【AI电影】悬疑短片《消失的记忆》制作技术揭秘',
    desc: '高难度悬疑AI短片，多时间线叙事、角色变化、AI特效合成全解析。',
    creator: { name: '张大师', avatar: '张', followers: 7800 },
    thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=400&fit=crop',
    videoUrl: '', duration: '35:00', views: 11234, likes: 890, comments: 267,
    tags: ['悬疑', '特效', '高级技巧'],
    createdAt: '2026-04-01', price: 79.9
  },

  // AI设计师
  {
    id: 14, category: 'designer', categoryName: 'AI设计师',
    title: '【AI设计】科技公司Logo+全套VI设计案例',
    desc: '用Midjourney为科技创业公司设计Logo，并完成整套VI视觉识别系统。',
    creator: { name: '设计小美', avatar: '美', followers: 4500 },
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop',
    videoUrl: '', duration: '22:00', views: 6789, likes: 456, comments: 98,
    tags: ['Logo设计', 'VI系统', '科技'],
    createdAt: '2026-04-05', price: 19.9
  },
  {
    id: 15, category: 'designer', categoryName: 'AI设计师',
    title: '【AI设计】电商详情页批量生成工作流',
    desc: '用ComfyUI搭建自动化工作流，日产200+张高质量电商详情页图。',
    creator: { name: 'UI老王', avatar: '王', followers: 6100 },
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    videoUrl: '', duration: '18:00', views: 8901, likes: 567, comments: 134,
    tags: ['电商详情', '批量生成', 'ComfyUI'],
    createdAt: '2026-04-02', price: 29.9
  },
  {
    id: 16, category: 'designer', categoryName: 'AI设计师',
    title: '【AI设计】App UI界面概念设计 AI 全流程',
    desc: 'AI辅助App UI概念设计，从用户研究到高保真原型图的完整流程。',
    creator: { name: '设计总监', avatar: '总', followers: 8900 },
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    videoUrl: '', duration: '25:30', views: 11230, likes: 723, comments: 178,
    tags: ['UI设计', 'App', '原型'],
    createdAt: '2026-03-30', price: 39.9
  },
  {
    id: 17, category: 'designer', categoryName: 'AI设计师',
    title: '【AI设计】产品包装设计 AI 全案制作',
    desc: '从产品外观到包装设计的AI全案制作，服务真实客户案例。',
    creator: { name: '设计小美', avatar: '美', followers: 4500 },
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
    videoUrl: '', duration: '20:00', views: 5678, likes: 389, comments: 87,
    tags: ['包装设计', '产品', '全案'],
    createdAt: '2026-03-25', price: 0
  },

  // AI带货变现
  {
    id: 18, category: 'commerce', categoryName: 'AI带货变现',
    title: '【AI带货】美妆产品带货短视频 月销破万实操',
    desc: '用AI工具批量制作美妆带货视频，拆解从选品到发布的完整流程。',
    creator: { name: '带货达人', avatar: '达', followers: 12300 },
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
    videoUrl: '', duration: '16:00', views: 18900, likes: 1234, comments: 345,
    tags: ['美妆', '带货', '月销破万'],
    createdAt: '2026-04-06', price: 29.9
  },
  {
    id: 19, category: 'commerce', categoryName: 'AI带货变现',
    title: '【AI带货】食品类短视频带货 AI制作全攻略',
    desc: '食品类带货视频如何用AI做出食欲感？完整制作流程与选品策略。',
    creator: { name: '带货王', avatar: '王', followers: 9800 },
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    videoUrl: '', duration: '14:30', views: 15670, likes: 987, comments: 234,
    tags: ['食品', '食欲感', '选品'],
    createdAt: '2026-04-03', price: 19.9
  },
  {
    id: 20, category: 'commerce', categoryName: 'AI带货变现',
    title: '【AI带货】3C数码产品带货视频 AI制作复盘',
    desc: '高客单价3C数码产品如何用AI做出科技感带货视频，含投放策略。',
    creator: { name: '带货总裁', avatar: '总', followers: 15600 },
    thumbnail: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop',
    videoUrl: '', duration: '18:45', views: 12340, likes: 756, comments: 189,
    tags: ['3C数码', '高客单', '投放'],
    createdAt: '2026-04-01', price: 49.9
  },
  {
    id: 21, category: 'commerce', categoryName: 'AI带货变现',
    title: '【AI带货】服装穿搭带货 账号从0到月入过万',
    desc: 'AI工具辅助服装带货账号全流程，选品+脚本+AI制作+运营完整复盘。',
    creator: { name: '带货达人', avatar: '达', followers: 12300 },
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    videoUrl: '', duration: '22:00', views: 20150, likes: 1567, comments: 412,
    tags: ['服装', '穿搭', '月入过万'],
    createdAt: '2026-03-28', price: 39.9
  },
]

// ======= 分类数据 =======
const courseCategories = [
  { id: 'all', name: '全部', icon: '📚', color: '#94a3b8' },
  { id: 'shortvideo', name: 'AI短视频', icon: '🎬', color: '#22d3ee' },
  { id: 'shortdrama', name: 'AI短剧', icon: '🎭', color: '#a78bfa' },
  { id: 'mangadrama', name: 'AI漫剧', icon: '📚', color: '#f472b6' },
  { id: 'film', name: 'AI电影', icon: '🎥', color: '#fb923c' },
  { id: 'designer', name: 'AI设计师', icon: '🎨', color: '#34d399' },
  { id: 'commerce', name: 'AI带货变现', icon: '💰', color: '#fbbf24' },
]

const caseCategories = [
  { id: 'all', name: '全部', icon: '🎯', color: '#94a3b8' },
  { id: 'shortvideo', name: 'AI短视频', icon: '🎬', color: '#22d3ee' },
  { id: 'shortdrama', name: 'AI短剧', icon: '🎭', color: '#a78bfa' },
  { id: 'mangadrama', name: 'AI漫剧', icon: '📚', color: '#f472b6' },
  { id: 'film', name: 'AI电影', icon: '🎥', color: '#fb923c' },
  { id: 'designer', name: 'AI设计师', icon: '🎨', color: '#34d399' },
  { id: 'commerce', name: 'AI带货变现', icon: '💰', color: '#fbbf24' },
]

// ======= 视频播放弹窗 =======
function VideoModal({ video, onClose, onSwitch }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(video.likes)
  const [bookmarked, setBookmarked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([
    { id: 1, user: 'AI小北', avatar: '🤖', text: '这个案例太棒了，学到了很多！', time: '2小时前', likes: 12 },
    { id: 2, user: '设计师阿科', avatar: '🎨', text: '请问用的哪个AI工具生成的？', time: '1小时前', likes: 5 },
    { id: 3, user: '带货新手', avatar: '💰', text: '跟着做了一遍，效果很好！', time: '30分钟前', likes: 3 },
  ])
  const [activeTab, setActiveTab] = useState('info')

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  const handleComment = () => {
    if (!commentText.trim()) return
    setComments(prev => [{ id: Date.now(), user: '我', avatar: '👤', text: commentText, time: '刚刚', likes: 0 }, ...prev])
    setCommentText('')
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      alert('链接已复制到剪贴板！')
    })
  }

  return (
    <div className="video-modal-bg" onClick={onClose}>
      <div className="video-modal-box" onClick={e => e.stopPropagation()}>
        <div className="vm-header">
          <h3 className="vm-title">{video.title}</h3>
          <button className="vm-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="vm-body">
          <div className="vm-left">
            <div className="vm-player">
              <div className="vm-placeholder">
                <img src={video.thumbnail} alt={video.title} className="vm-poster" />
                <div className="vm-no-video">
                  <div className="vm-play-icon"><Play size={32} /></div>
                  <p>AI案例演示视频</p>
                  <span>上传真实视频后可直接播放</span>
                </div>
              </div>
            </div>

            <div className="vm-actions">
              <div className="vm-creator-info">
                <div className="vm-avatar">{video.creator.avatar}</div>
                <div>
                  <div className="vm-creator-name">{video.creator.name}</div>
                  <div className="vm-date">{video.createdAt} · {video.duration}</div>
                </div>
              </div>
              <div className="vm-btns">
                <button className={`vm-btn ${liked ? 'active' : ''}`} onClick={handleLike}>
                  <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                  <span>{likeCount}</span>
                </button>
                <button className={`vm-btn ${bookmarked ? 'active' : ''}`} onClick={() => setBookmarked(!bookmarked)}>
                  <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
                  <span>{bookmarked ? '已收藏' : '收藏'}</span>
                </button>
                <button className="vm-btn" onClick={handleShare}>
                  <Share2 size={18} /><span>分享</span>
                </button>
              </div>
            </div>

            <div className="vm-tabs">
              <button className={`vm-tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>简介</button>
              <button className={`vm-tab ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>评论 {comments.length}</button>
            </div>

            {activeTab === 'info' && (
              <div className="vm-info-panel">
                <p className="vm-desc">{video.desc}</p>
                <div className="vm-stats-row">
                  <span><Eye size={14} /> {video.views} 次观看</span>
                  <span><Heart size={14} /> {likeCount} 点赞</span>
                  <span><MessageSquare size={14} /> {comments.length} 评论</span>
                </div>
                <div className="vm-tags">
                  <span className="vm-cat-tag" style={{ background: `${CATEGORY_META[video.category]?.color}20`, color: CATEGORY_META[video.category]?.color }}>
                    {CATEGORY_META[video.category]?.icon} {CATEGORY_META[video.category]?.name}
                  </span>
                  {video.tags.map((t, i) => (<span key={i} className="vm-tag">{t}</span>))}
                </div>
                {video.price > 0 && (
                  <div className="vm-price-notice">
                    <span>💡 此案例需付费解锁完整视频内容</span>
                    <button className="vm-buy-btn" onClick={() => alert('💰 支付功能即将上线，请联系客服购买')}>
                      ¥{video.price} 立即解锁
                    </button>
                  </div>
                )}
                {video.price === 0 && (
                  <div className="vm-price-notice" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)' }}>
                    <span>✅ 此案例为免费内容，可直接学习</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="vm-comments-panel">
                <div className="vm-comment-input">
                  <div className="vm-input-avatar">👤</div>
                  <input type="text" placeholder="写下你的想法..." value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleComment()}
                    className="vm-input" />
                  <button className="vm-send-btn" onClick={handleComment} disabled={!commentText.trim()}>发送</button>
                </div>
                <div className="vm-comment-list">
                  {comments.map(c => (
                    <div key={c.id} className="vm-comment-item">
                      <div className="vm-comment-avatar">{c.avatar}</div>
                      <div className="vm-comment-body">
                        <div className="vm-comment-header">
                          <span className="vm-comment-user">{c.user}</span>
                          <span className="vm-comment-time">{c.time}</span>
                        </div>
                        <p className="vm-comment-text">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="vm-right">
            <h4 className="vm-related-title">相关案例</h4>
            {caseStudies.filter(c => c.id !== video.id && c.category === video.category).slice(0, 4).map(c => (
              <div key={c.id} className="vm-related-item" onClick={() => onSwitch && onSwitch(c)}>
                <div className="vm-related-thumb">
                  <img src={c.thumbnail} alt={c.title} />
                  <span className="vm-related-duration">{c.duration}</span>
                  {c.price > 0 && <span className="vm-related-price">¥{c.price}</span>}
                </div>
                <div className="vm-related-info">
                  <p className="vm-related-title-text">{c.title}</p>
                  <span className="vm-related-creator">{c.creator.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ======= 课程详情弹窗 =======
function CourseModal({ course, onClose }) {
  const navigate = useNavigate()
  const [expandedChapter, setExpandedChapter] = useState(0)
  const [buying, setBuying] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [buySuccess, setBuySuccess] = useState(false)

  const handleBuy = () => {
    setBuying(true)
    setTimeout(() => {
      setBuying(false)
      setEnrolled(true)
      setBuySuccess(true)
      localStorage.setItem('enrolled_' + course.id, 'true')
      setTimeout(() => {
        navigate(`/course/${course.id}`)
      }, 1500)
    }, 1500)
  }

  const handleLearn = () => {
    navigate(`/course/${course.id}`)
  }

  return (
    <div className="video-modal-bg" onClick={onClose}>
      <div className="course-modal-box" onClick={e => e.stopPropagation()}>
        <div className="cm-cover" style={{ background: course.bgColor }}>
          <button className="vm-close cm-close" onClick={onClose}><X size={20} /></button>
          <div className="cm-cover-content">
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div className="cm-level" style={{ background: course.levelColor }}>{course.level}</div>
              {course.highlight && (
                <div className="cm-level" style={{ background: 'rgba(255,255,255,0.25)' }}>{course.highlight}</div>
              )}
            </div>
            <h2 className="cm-title">{course.title}</h2>
            <p className="cm-subtitle">{course.subtitle}</p>
            <div className="cm-stats">
              <span><Users size={14} /> {course.students.toLocaleString()} 学员</span>
              <span><Star size={14} fill="#f59e0b" className="star-icon" /> {course.rating} ({course.reviews}条评价)</span>
              <span><Clock size={14} /> {course.duration}</span>
              <span><BookOpen size={14} /> {course.lessons} 课时</span>
            </div>
          </div>
        </div>

        <div className="cm-body">
          <div className="cm-left">
            <div className="cm-teacher-card">
              <div className="cm-teacher-avatar">{course.teacher.avatar}</div>
              <div>
                <div className="cm-teacher-name">{course.teacher.name}</div>
                <div className="cm-teacher-title">{course.teacher.title}</div>
              </div>
              <button className="cm-follow-btn">+ 关注</button>
            </div>

            <h4 className="cm-section-title">课程目录（共{course.chapters.length}章 · {course.lessons}课时）</h4>
            <div className="cm-chapters">
              {course.chapters.map((chapter, ci) => (
                <div key={ci} className="cm-chapter">
                  <button
                    className={`cm-chapter-header ${expandedChapter === ci ? 'active' : ''}`}
                    onClick={() => setExpandedChapter(expandedChapter === ci ? -1 : ci)}
                  >
                    <span>{chapter.title}</span>
                    <div className="cm-chapter-right">
                      <span className="cm-lesson-count">{chapter.lessons.length}课时</span>
                      {expandedChapter === ci ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  {expandedChapter === ci && (
                    <div className="cm-lessons">
                      {chapter.lessons.map((lesson, li) => (
                        <div key={li} className="cm-lesson-item">
                          <div className="cm-lesson-icon">
                            {li === 0 && ci === 0 ? <Play size={12} /> : enrolled ? <Play size={12} /> : <span className="cm-lock">🔒</span>}
                          </div>
                          <span className="cm-lesson-name">{lesson}</span>
                          {li === 0 && ci === 0 && <span className="cm-free-badge">免费试看</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="cm-tags">
              {course.tags.map((t, i) => (<span key={i} className="cm-tag">{t}</span>))}
            </div>
          </div>

          <div className="cm-right">
            <div className="cm-buy-card">
              {enrolled ? (
                <>
                  <div className="cm-enrolled-badge"><CheckCircle size={20} /> {buySuccess ? '🎉 购买成功！' : '已购买'}</div>
                  <button className="cm-learn-btn" onClick={handleLearn}><Play size={18} /> {buySuccess ? '🎓 进入课程学习' : '立即学习'}</button>
                  {buySuccess && <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 4 }}>页面即将跳转...</p>}
                  <button className="cm-trial-btn" style={{ marginTop: 8 }} onClick={onClose}>→ 查看更多课程</button>
                </>
              ) : (
                <>
                  <div className="cm-price-area">
                    <span className="cm-current-price">¥{course.price}</span>
                    <span className="cm-original-price">¥{course.originalPrice}</span>
                    <span className="cm-discount">{Math.round(course.price / course.originalPrice * 10)}折</span>
                  </div>
                  <div className="cm-price-tips">
                    <span>✓ 永久有效</span>
                    <span>✓ 课件下载</span>
                    <span>✓ 答疑服务</span>
                    <span>✓ 结业证书</span>
                  </div>
                  <button className={`cm-buy-btn ${buying ? 'loading' : ''}`} onClick={handleBuy} disabled={buying}>
                    {buying ? '⏳ 处理中...' : `¥${course.price} 立即购买`}
                  </button>
                  <button className="cm-trial-btn" onClick={() => alert(`📖 免费试看：${course.chapters[0]?.lessons[0] || '第一节课'}\n\n请先购买课程解锁完整内容！`)}>
                    🆓 免费试看第一课
                  </button>
                  <div className="cm-vip-tip"><Zap size={14} /> VIP会员享8折优惠，再减¥{Math.round(course.price * 0.2)}</div>
                </>
              )}

              <div className="cm-stats-list">
                <div className="cm-stat-item"><Users size={16} /><span>{course.students.toLocaleString()} 人已报名</span></div>
                <div className="cm-stat-item"><Star size={16} style={{ color: '#f59e0b' }} /><span>评分 {course.rating} / 5.0</span></div>
                <div className="cm-stat-item"><Clock size={16} /><span>共 {course.duration}</span></div>
                <div className="cm-stat-item"><BookOpen size={16} /><span>{course.lessons} 节课</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ======= 主页面 =======
export default function TrainingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const caseStudyRef = useRef(null)
  const [activeTab, setActiveTab] = useState('courses')
  const [activeCaseCategory, setActiveCaseCategory] = useState('all')
  const [activeCourseCategory, setActiveCourseCategory] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [playingVideo, setPlayingVideo] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [sortBy, setSortBy] = useState('popular')
  const [caseLikes, setCaseLikes] = useState({})
  const [toast, setToast] = useState(null)
  // 创作者发布的教程（从localStorage加载）
  const [creatorTutorials, setCreatorTutorials] = useState([])

  // 加载创作者发布的教程
  useEffect(() => {
    const loadCreatorTutorials = () => {
      try {
        const savedTutorials = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
        const publishedTutorials = savedTutorials.filter(t => t.status === 'published');
        // 转换为课程格式
        const convertedTutorials = publishedTutorials.map(t => ({
          id: t.id,
          category: t.category,
          categoryName: t.categoryName,
          level: '创作者',
          levelColor: '#8b5cf6',
          title: t.title,
          subtitle: t.description,
          students: t.students || 0,
          rating: t.rating || 4.8,
          reviews: Math.floor((t.students || 0) / 3),
          duration: t.duration || '未知',
          lessons: t.lessons || 0,
          teacher: { 
            name: t.creatorName || '创作者', 
            avatar: (t.creatorName || '创')[0], 
            title: '平台认证创作者', 
            bio: '专业内容创作者' 
          },
          price: t.price || 0,
          originalPrice: t.originalPrice || 0,
          pointsPrice: t.pointsPrice || 0,
          tags: t.tags || [],
          featured: t.featured || false,
          bgColor: CATEGORY_META[t.category]?.gradient || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          highlight: '创作者课程',
          coverImage: t.coverImage,
          chapters: t.chapters || [],
          isCreatorTutorial: true // 标记为创作者教程
        }));
        setCreatorTutorials(convertedTutorials);
      } catch (error) {
        console.error('加载创作者教程失败:', error);
      }
    };
    
    loadCreatorTutorials();
    
    // 监听教程更新事件
    const handleUpdate = () => loadCreatorTutorials();
    window.addEventListener('creatorProfileUpdated', handleUpdate);
    window.addEventListener('tutorialPublished', handleUpdate);
    
    // 每5秒刷新一次
    const interval = setInterval(loadCreatorTutorials, 5000);
    
    return () => {
      window.removeEventListener('creatorProfileUpdated', handleUpdate);
      window.removeEventListener('tutorialPublished', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  // 处理从案例详情页返回
  useEffect(() => {
    if (location.state?.scrollTo === 'cases') {
      setActiveTab('cases')
      setTimeout(() => {
        caseStudyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
    // 清除 state 避免重复触发
    return () => {
      if (location.state) {
        window.history.replaceState({}, document.title)
      }
    }
  }, [location])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  // 过滤案例
  const filteredCases = caseStudies.filter(c => {
    if (activeCaseCategory !== 'all' && c.category !== activeCaseCategory) return false
    if (searchText) {
      const q = searchText.toLowerCase()
      return c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q)) || c.categoryName.toLowerCase().includes(q)
    }
    return true
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'popular') return b.views - a.views
    return 0
  })

  // 过滤课程（合并默认课程和创作者教程）
  const allCourses = [...courses, ...creatorTutorials];
  const filteredCourses = allCourses.filter(course => {
    if (activeCourseCategory !== 'all' && course.category !== activeCourseCategory) return false
    if (searchText) {
      const q = searchText.toLowerCase()
      return course.title.toLowerCase().includes(q) || course.tags.some(t => t.toLowerCase().includes(q))
    }
    return true
  }).sort((a, b) => {
    // 创作者课程优先显示
    if (a.isCreatorTutorial && !b.isCreatorTutorial) return -1;
    if (!a.isCreatorTutorial && b.isCreatorTutorial) return 1;
    if (sortBy === 'popular') return b.students - a.students
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  // 按类型分组课程（用于分类Tab展示）
  const allCoursesForCount = [...courses, ...creatorTutorials];
  const categoryCourseCount = courseCategories.reduce((acc, cat) => {
    if (cat.id === 'all') {
      acc[cat.id] = allCoursesForCount.length
    } else {
      acc[cat.id] = allCoursesForCount.filter(c => c.category === cat.id).length
    }
    return acc
  }, {})

  const categoryCaseCount = caseCategories.reduce((acc, cat) => {
    if (cat.id === 'all') {
      acc[cat.id] = caseStudies.length
    } else {
      acc[cat.id] = caseStudies.filter(c => c.category === cat.id).length
    }
    return acc
  }, {})

  const handleCaseLike = (e, caseId) => {
    e.stopPropagation()
    setCaseLikes(prev => ({ ...prev, [caseId]: !prev[caseId] }))
    showToast(caseLikes[caseId] ? '已取消收藏' : '已收藏案例')
  }

  return (
    <div className="training-page">
      {/* Toast */}
      {toast && (
        <div className="tp-toast">{toast}</div>
      )}

      {/* Hero */}
      <section className="tp-hero">
        <div className="tp-hero-bg"></div>
        <div className="container-custom tp-hero-content">
          <div className="tp-hero-badge"><TrendingUp size={14} /><span>每日更新优质教程</span></div>
          <h1 className="tp-hero-title"><span className="gradient-text">AIGC创作者孵化</span> 中心</h1>
          <p className="tp-hero-desc">
            头部AIGC博主老师亲自授课，0基础也可以成为AI职业创作者
          </p>

          <div className="tp-search">
            <Search size={18} className="tp-search-icon" />
            <input type="text" placeholder={activeTab === 'cases' ? '搜索案例、创作者、标签...' : '搜索课程、讲师、技能...'}
              value={searchText} onChange={e => setSearchText(e.target.value)} className="tp-search-input" />
            {searchText && <button className="tp-search-clear" onClick={() => setSearchText('')}><X size={16} /></button>}
          </div>

          <div className="tp-hero-stats">
            <div className="tp-stat"><span className="tp-stat-num">{caseStudies.length}</span><span className="tp-stat-label">实战案例</span></div>
            <div className="tp-stat-divider"></div>
            <div className="tp-stat"><span className="tp-stat-num">{courses.length}</span><span className="tp-stat-label">精品课程</span></div>
            <div className="tp-stat-divider"></div>
            <div className="tp-stat"><span className="tp-stat-num">{Object.keys(CATEGORY_META).length}</span><span className="tp-stat-label">专业方向</span></div>
            <div className="tp-stat-divider"></div>
            <div className="tp-stat"><span className="tp-stat-num">8000+</span><span className="tp-stat-label">学员</span></div>
          </div>


        </div>
      </section>

      {/* 居中大Tab切换 */}
      <section className="tp-main-tabs">
        <div className="container-custom">
          <div className="tp-tabs-center">
            <button 
              className={`tp-tab-main ${activeTab === 'courses' ? 'active' : ''}`} 
              onClick={() => setActiveTab('courses')}
            >
              <div className="tp-tab-icon-wrap">
                <BookOpen size={24} />
              </div>
              <div className="tp-tab-text">
                <span className="tp-tab-title">孵化课程</span>
                <span className="tp-tab-subtitle">{courses.length} 门精品课程</span>
              </div>
            </button>
            <button 
              className={`tp-tab-main ${activeTab === 'cases' ? 'active' : ''}`} 
              onClick={() => setActiveTab('cases')}
            >
              <div className="tp-tab-icon-wrap">
                <Video size={24} />
              </div>
              <div className="tp-tab-text">
                <span className="tp-tab-title">AIGC案例教程</span>
                <span className="tp-tab-subtitle">{caseStudies.length} 个实战案例</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 板块介绍 */}
      <section className="tp-section-intro">
        <div className="container-custom">
          {activeTab === 'courses' ? (
            <div className="tp-intro-card">
              <div className="tp-intro-content">
                <div className="tp-intro-header">
                  <div className="tp-intro-icon">
                    <Sparkles size={32} />
                  </div>
                  <div className="tp-intro-title-wrap">
                    <h2 className="tp-intro-title">AIGC创作者孵化课程</h2>
                    <p className="tp-intro-subtitle">从零基础到职业创作者，系统化培养你的AI创作能力</p>
                  </div>
                </div>
                <div className="tp-intro-features">
                  <div className="tp-intro-feature">
                    <div className="tp-feature-icon">🎯</div>
                    <div className="tp-feature-text">
                      <span className="tp-feature-label">体系化学习</span>
                      <span className="tp-feature-desc">入门→进阶→专业，循序渐进</span>
                    </div>
                  </div>
                  <div className="tp-intro-feature">
                    <div className="tp-feature-icon">👨‍🏫</div>
                    <div className="tp-feature-text">
                      <span className="tp-feature-label">名师授课</span>
                      <span className="tp-feature-desc">头部AIGC博主亲自教学</span>
                    </div>
                  </div>
                  <div className="tp-intro-feature">
                    <div className="tp-feature-icon">💼</div>
                    <div className="tp-feature-text">
                      <span className="tp-feature-label">就业导向</span>
                      <span className="tp-feature-desc">学完即可接单变现</span>
                    </div>
                  </div>
                  <div className="tp-intro-feature">
                    <div className="tp-feature-icon">🔄</div>
                    <div className="tp-feature-text">
                      <span className="tp-feature-label">持续更新</span>
                      <span className="tp-feature-desc">紧跟AI工具最新动态</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tp-intro-decoration">
                <div className="tp-deco-circle"></div>
                <div className="tp-deco-dots"></div>
              </div>
            </div>
          ) : (
            <div className="tp-intro-card tp-intro-cases">
              <div className="tp-intro-content">
                <div className="tp-intro-header">
                  <div className="tp-intro-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}>
                    <Film size={32} />
                  </div>
                  <div className="tp-intro-title-wrap">
                    <h2 className="tp-intro-title">AIGC案例教程库</h2>
                    <p className="tp-intro-subtitle">海量实战案例拆解，跟着做就能出作品</p>
                  </div>
                </div>
                <div className="tp-intro-features">
                  <div className="tp-intro-feature">
                    <div className="tp-feature-icon">🎬</div>
                    <div className="tp-feature-text">
                      <span className="tp-feature-label">完整拆解</span>
                      <span className="tp-feature-desc">从创意到成品的全流程</span>
                    </div>
                  </div>
                  <div className="tp-intro-feature">
                    <div className="tp-feature-icon">⚡</div>
                    <div className="tp-feature-text">
                      <span className="tp-feature-label">即学即用</span>
                      <span className="tp-feature-desc">每个案例都有详细步骤</span>
                    </div>
                  </div>
                  <div className="tp-intro-feature">
                    <div className="tp-feature-icon">🔥</div>
                    <div className="tp-feature-text">
                      <span className="tp-feature-label">热门选题</span>
                      <span className="tp-feature-desc">紧跟平台爆款趋势</span>
                    </div>
                  </div>
                  <div className="tp-intro-feature">
                    <div className="tp-feature-icon">📱</div>
                    <div className="tp-feature-text">
                      <span className="tp-feature-label">多平台适配</span>
                      <span className="tp-feature-desc">抖音/小红书/B站全覆盖</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tp-intro-decoration">
                <div className="tp-deco-circle" style={{ background: 'linear-gradient(135deg, #f59e0b20 0%, #fbbf2420 100%)' }}></div>
                <div className="tp-deco-dots" style={{ backgroundImage: 'radial-gradient(#f59e0b40 1.5px, transparent 1.5px)' }}></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 主内容 */}
      <div className="container-custom tp-content">
        {activeTab === 'courses' && (
          <div>
            <div className="tp-filter-bar">
              <div className="tp-category-btns">
                {courseCategories.map(cat => (
                  <button key={cat.id} className={`tp-cat-btn ${activeCourseCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCourseCategory(cat.id)}>
                    <span>{cat.icon}</span> {cat.name}
                    {cat.id !== 'all' && <span className="tp-cat-count">{categoryCourseCount[cat.id]}</span>}
                  </button>
                ))}
              </div>
              <div className="tp-sort">
                <span className="tp-sort-label">排序：</span>
                <button className={`tp-sort-btn ${sortBy === 'popular' ? 'active' : ''}`} onClick={() => setSortBy('popular')}>最热</button>
                <button className={`tp-sort-btn ${sortBy === 'rating' ? 'active' : ''}`} onClick={() => setSortBy('rating')}>评分高</button>
                <button className={`tp-sort-btn ${sortBy === 'price' ? 'active' : ''}`} onClick={() => setSortBy('price')}>价格低→高</button>
              </div>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="tp-empty"><BookOpen size={48} /><p>暂无符合条件的课程</p>
                <button onClick={() => { setActiveCourseCategory('all'); setSearchText('') }}>清除筛选</button>
              </div>
            ) : (
              <div className="tp-course-grid">
                {filteredCourses.map(course => (
                  <div key={course.id} className="tp-course-card" onClick={() => navigate(`/training/course/${course.id}`)}>
                    <div className="tp-course-thumb" style={{ background: course.coverImage ? `url(${course.coverImage}) center/cover no-repeat` : course.bgColor }}>
                      <div className="tp-course-play-wrap">
                        <div className="tp-course-play"><Play size={24} /></div>
                      </div>
                      {course.featured && <div className="tp-featured-badge"><Trophy size={12} /> 精品</div>}
                      <div className="tp-level-badge" style={{ color: course.levelColor, borderColor: course.levelColor }}>{course.level}</div>
                    </div>
                    <div className="tp-course-info">
                      <div className="tp-course-tags">
                        <span className="tp-cat-tag-sm" style={{ color: CATEGORY_META[course.category]?.color, background: `${CATEGORY_META[course.category]?.color}20` }}>
                          {CATEGORY_META[course.category]?.icon} {CATEGORY_META[course.category]?.name}
                        </span>
                        {course.tags.slice(0, 1).map((t, i) => (<span key={i} className="tp-tag">{t}</span>))}
                      </div>
                      <h3 className="tp-course-title">{course.title}</h3>
                      <p className="tp-course-subtitle">{course.subtitle}</p>
                      <div className="tp-course-meta">
                        <span><Users size={13} /> {course.students.toLocaleString()}</span>
                        <span><Star size={13} style={{ color: '#f59e0b' }} /> {course.rating}</span>
                        <span><Clock size={13} /> {course.duration}</span>
                      </div>
                      <div className="tp-course-footer">
                        <div className="tp-course-teacher">
                          <div className="tp-teacher-avatar">{course.teacher.avatar}</div>
                          <span>{course.teacher.name}</span>
                        </div>
                        <div className="tp-course-price">
                          <span className="tp-ori-price">¥{course.originalPrice}</span>
                          <span className="tp-cur-price">¥{course.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cases' && (
          <div ref={caseStudyRef}>
            <div className="tp-filter-bar">
              <div className="tp-category-btns">
                {caseCategories.map(cat => (
                  <button key={cat.id} className={`tp-cat-btn ${activeCaseCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCaseCategory(cat.id)}>
                    <span>{cat.icon}</span> {cat.name}
                    {cat.id !== 'all' && <span className="tp-cat-count">{categoryCaseCount[cat.id]}</span>}
                  </button>
                ))}
              </div>
              <span className="tp-result-count">共 {filteredCases.length} 个案例</span>
            </div>

            {filteredCases.length === 0 ? (
              <div className="tp-empty"><Video size={48} /><p>暂无符合条件的案例</p>
                <button onClick={() => { setActiveCaseCategory('all'); setSearchText('') }}>清除筛选</button>
              </div>
            ) : (
              <div className="tp-case-grid">
                {filteredCases.map(c => (
                  <div key={c.id} className="tp-case-card" onClick={() => navigate(`/tutorial/${c.id}`, { state: { from: 'case-study' } })}>
                    <div className="tp-case-thumb">
                      <img src={c.thumbnail} alt={c.title} />
                      <div className="tp-case-overlay">
                        <div className="tp-case-play"><Play size={28} /></div>
                        <span className="tp-case-duration">{c.duration}</span>
                        <div className="tp-case-badge">
                          <Video size={11} /> 案例拆解
                        </div>
                        {c.price > 0 && (
                          <div className="tp-case-price-badge"><Lock size={10} /> ¥{c.price}</div>
                        )}
                      </div>
                    </div>
                    <div className="tp-case-info">
                      <div className="tp-case-cat-row">
                        <span className="tp-cat-tag-sm" style={{ color: CATEGORY_META[c.category]?.color, background: `${CATEGORY_META[c.category]?.color}20` }}>
                          {CATEGORY_META[c.category]?.icon} {c.categoryName}
                        </span>
                      </div>
                      <h3 className="tp-case-title">{c.title}</h3>
                      <p className="tp-case-desc">{c.desc}</p>
                      <div className="tp-case-meta">
                        <div className="tp-case-creator">
                          <div className="tp-case-avatar">{c.creator.avatar}</div>
                          <span>{c.creator.name}</span>
                        </div>
                        <div className="tp-case-stats">
                          <span><Eye size={13} /> {c.views.toLocaleString()}</span>
                          <button className={`tp-like-btn ${caseLikes[c.id] ? 'liked' : ''}`}
                            onClick={e => handleCaseLike(e, c.id)}>
                            <Heart size={13} fill={caseLikes[c.id] ? 'currentColor' : 'none'} />
                            {caseLikes[c.id] ? c.likes + 1 : c.likes}
                          </button>
                        </div>
                      </div>
                      <div className="tp-case-tags">
                        {c.tags.slice(0, 2).map((t, i) => (<span key={i} className="tp-tag">{t}</span>))}
                        {c.price === 0 ? (
                          <span className="tp-free-tag">免费</span>
                        ) : (
                          <span className="tp-paid-tag"><Lock size={10} /> 图文+视频</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 成为创作者 CTA */}
      <div className="tp-cta">
        <div className="container-custom tp-cta-inner">
          <div className="tp-cta-icon"><Award size={40} /></div>
          <div>
            <h3>成为内容创作者，分享你的 AI 经验</h3>
            <p>上传案例或教程，帮助更多人成长，同时赚取收益</p>
          </div>
          <Link to="/user/creator" className="tp-cta-btn">进入创作者中心 <ArrowRight size={16} /></Link>
        </div>
      </div>

      {playingVideo && (
        <VideoModal video={playingVideo} onClose={() => setPlayingVideo(null)} onSwitch={(v) => setPlayingVideo(v)} />
      )}
      {selectedCourse && (
        <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  )
}
