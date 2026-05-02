import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight,
  Heart, Bookmark, Share2, MessageSquare, Eye, Clock, Users, Star,
  Lock, Unlock, Zap, CheckCircle, ArrowLeft, ArrowRight, X,
  ThumbsUp, Award, BookOpen, Copy, AlertCircle, ChevronDown, ChevronUp,
  Video
} from 'lucide-react'
import './CaseStudyDetail.css'

// ==================== 案例数据 ====================
// 从 localStorage 加载创作者发布的案例
const loadPublishedCases = () => {
  try {
    const published = JSON.parse(localStorage.getItem('publishedCases') || '[]');
    return published.filter(c => !c.isDraft && c.status === 'published');
  } catch (e) {
    return [];
  }
};

// 默认案例数据
const defaultCases = [
  {
    id: 1,
    title: 'AI短视频爆款制作全流程拆解',
    subtitle: '从零到一：用即梦+剪映制作一条100万播放的AI短视频',
    creator: { name: '李设计师', avatar: '李', followers: 12300, bio: '资深AI创作者，擅长AI视频制作与变现' },
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1280&h=720&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '18:30',
    views: 12560,
    likes: 890,
    comments: 123,
    tags: ['AI视频', '即梦', '短视频', '爆款'],
    category: 'shortvideo',
    createdAt: '2026-04-05',
    unlockPoints: 200,
    isFree: false,
    rating: 4.9,
    ratingCount: 289,
    // 图文教程内容（分章节）
    tutorial: {
      totalChapters: 6,
      freeChapters: 2, // 前2章免费
      chapters: [
        {
          id: 1,
          title: '第一章：选题与策划',
          duration: '3分钟',
          isFree: true,
          steps: [
            {
              type: 'text',
              content: '## 🎯 爆款短视频的选题逻辑\n\n一条好的AI短视频，选题决定了60%的成败。我们需要找到那些**视觉冲击力强**且**容易用AI实现**的主题。'
            },
            {
              type: 'image',
              src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=450&fit=crop',
              caption: '图1：热门短视频选题分析图 - 从数据中找到爆款规律'
            },
            {
              type: 'text',
              content: '### 三个黄金选题方向：\n\n**1. 视觉奇观类**\n- AI生成的超现实场景（飞天城市、水下古建筑）\n- 时间流逝与风格变换（历史人物现代化）\n- 物品变形与魔法效果\n\n**2. 情感共鸣类**\n- 家乡记忆与AI复原\n- 儿时照片动态化\n- 亲人AI合影\n\n**3. 实用技巧类**\n- AI工具教程（本案例就是这类）\n- 创作过程展示（Behind the scenes）\n- 对比效果展示'
            },
            {
              type: 'tip',
              icon: '💡',
              title: '选题小技巧',
              content: '在抖音/B站搜索"AI"相关关键词，筛选近7天内播放量超50万的视频，分析共同特征。关键看：封面构图、前3秒画面、标题公式。'
            },
            {
              type: 'image',
              src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
              caption: '图2：选题分析框架 - 三维评估选题潜力'
            }
          ]
        },
        {
          id: 2,
          title: '第二章：脚本撰写与分镜设计',
          duration: '4分钟',
          isFree: true,
          steps: [
            {
              type: 'text',
              content: '## 📝 AI短视频脚本公式\n\n爆款短视频的脚本结构非常固定，掌握这个公式，你的视频完播率会大幅提升。'
            },
            {
              type: 'formula',
              title: '爆款公式',
              items: ['0-3秒：视觉钩子（冲击画面或悬念）', '3-8秒：问题呈现（引发共鸣）', '8-30秒：过程展示（干货密度高）', '30秒-结尾：结果展示 + CTA（引导关注）']
            },
            {
              type: 'text',
              content: '### 我的脚本示例（本案例）：\n\n```\n[0-3秒] 震撼开场：一座城市从废墟变成繁华都市的AI视频\n[3-8秒] 旁白："这条视频做了3天，1台电脑，0专业技能"\n[8-15秒] 展示即梦AI界面，输入关键词\n[15-35秒] 展示生成过程，配合剪映转场\n[35-50秒] 最终成片展示，对比原始图片\n[50-60秒] 工具清单 + 关注引导\n```'
            },
            {
              type: 'image',
              src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
              caption: '图3：实际脚本文档截图 - 分镜列表与时间轴'
            },
            {
              type: 'tip',
              icon: '⚡',
              title: 'AI辅助写脚本',
              content: '用ChatGPT或文心一言生成脚本初稿，prompt公式：「我要制作一条关于[主题]的60秒短视频脚本，目标平台是[抖音/B站]，受众是[目标人群]，风格是[风格描述]，请按时间轴格式输出」'
            }
          ]
        },
        {
          id: 3,
          title: '第三章：即梦AI视频生成实战',
          duration: '5分钟',
          isFree: false,
          steps: [
            {
              type: 'text',
              content: '## 🎬 即梦AI实战操作\n\n这是整个流程中最核心的部分。即梦AI是目前国内最好用的AI视频生成工具之一，支持文生视频和图生视频两种模式。'
            },
            {
              type: 'image',
              src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
              caption: '图4：即梦AI操作界面'
            },
            {
              type: 'text',
              content: '### Prompt关键词公式\n\n即梦AI的Prompt写作有固定套路：\n\n```\n[主体描述] + [场景环境] + [运镜方式] + [画面风格] + [特效关键词]\n```\n\n**实际案例Prompt：**\n```\n废弃城市遗迹，破损建筑群，镜头从低处缓慢上升，\n延时摄影效果，城市逐渐重建繁荣，科幻光效，\n4K超清，电影级色调，golden hour光线\n```'
            },
            {
              type: 'tip',
              icon: '🔑',
              title: '关键提示词清单',
              content: '运镜词：缓慢推进/旋转360°/航拍俯视/第一人称移动\n风格词：赛博朋克/新中式/史诗级/治愈系\n质量词：4K超清/电影级/专业摄影/细节丰富'
            }
          ]
        },
        {
          id: 4,
          title: '第四章：剪映剪辑与调色',
          duration: '4分钟',
          isFree: false,
          steps: [
            {
              type: 'text',
              content: '## ✂️ 剪映剪辑完整工作流\n\n有了AI生成的素材，接下来是用剪映进行专业剪辑。\n\n### 剪辑节奏控制：\n- **快节奏段落**（8-25秒）：每个镜头0.8-1.2秒\n- **慢节奏段落**（0-8秒/结尾）：每个镜头2-3秒\n- **转场选择**：光效转场、运镜转场优于普通淡入淡出'
            },
            {
              type: 'image',
              src: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=450&fit=crop',
              caption: '图5：剪映时间轴布局示例'
            },
            {
              type: 'text',
              content: '### LUT调色方案\n\n本案例使用的调色参数：\n```\n亮度：+5\n对比度：+12\n饱和度：+8\n色温：-6（偏冷蓝色）\n暗角：轻微\n```\n\n推荐用剪映内置的「胶片电影」或「复古暖调」LUT作为基础，再微调。'
            }
          ]
        },
        {
          id: 5,
          title: '第五章：AI配音与音效',
          duration: '3分钟',
          isFree: false,
          steps: [
            {
              type: 'text',
              content: '## 🎵 AI配音完整方案\n\n音效占一条短视频体验的40%以上，很多创作者忽视了这一点。\n\n### 三层音效结构：\n1. **背景音乐**：情绪铺垫，音量40%\n2. **AI配音/解说**：主要信息载体，音量100%\n3. **特效音**：增强视觉冲击，音量60%'
            },
            {
              type: 'tip',
              icon: '🎙️',
              title: '免费AI配音工具推荐',
              content: '1. 剪映AI朗读（最方便，直接内置）\n2. 讯飞配音（音色最多，有免费额度）\n3. ElevenLabs（英文最真实，有免费试用）\n4. ChatTTS（开源免费，效果很好）'
            },
            {
              type: 'image',
              src: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=450&fit=crop',
              caption: '图6：音频轨道编排示例'
            }
          ]
        },
        {
          id: 6,
          title: '第六章：发布策略与数据复盘',
          duration: '2分钟',
          isFree: false,
          steps: [
            {
              type: 'text',
              content: '## 📊 发布策略与增长复盘\n\n做好视频只完成了一半，发布策略决定了初始流量池大小。\n\n### 黄金发布时间：\n- **抖音**：07:00-08:30 / 12:00-13:00 / 20:00-22:00\n- **B站**：18:00-20:00（工作日）/ 10:00-12:00（周末）\n- **小红书**：08:00-09:00 / 21:00-23:00\n\n### 标题公式：\n```\n[数字] + [核心关键词] + [反差感词语] + [解决痛点]\n例：3分钟，零基础用AI做出电影级短视频（附完整工具清单）\n```'
            },
            {
              type: 'tip',
              icon: '📈',
              title: '数据复盘维度',
              content: '重点看：完播率（>45%算优秀）、互动率（点赞/播放>5%）、关注转化率。\n如果完播率低：前3秒不够吸引人；如果互动率低：内容价值感不足或CTA不明显。'
            },
            {
              type: 'formula',
              title: '本案例实际数据',
              items: ['发布平台：抖音 + B站同步', '发布时间：周四 20:30', '48小时播放量：102,000', '完播率：52%（行业均值35%）', '粉丝增长：+2,341', '带来变现：课程收入 ¥8,900']
            }
          ]
        }
      ]
    },
    relatedCases: [2, 3, 6]
  },
  // 案例2：科技公司品牌视觉升级
  {
    id: 2,
    title: '科技公司品牌视觉升级',
    subtitle: '从零到一完成科技公司品牌VI设计，包括Logo、色彩、字体等全套设计',
    creator: { name: '林艺涵', avatar: '林', followers: 8900, bio: '资深品牌设计师，服务过50+科技企业' },
    thumbnail: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=1280&h=720&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '25:00',
    views: 8920,
    likes: 567,
    comments: 45,
    tags: ['品牌', 'VI设计', '科技感'],
    category: 'designer',
    createdAt: '2026-04-03',
    unlockPoints: 99,
    price: 99,
    isFree: false,
    rating: 4.8,
    ratingCount: 156,
    tutorial: {
      totalChapters: 5,
      freeChapters: 1,
      chapters: [
        { id: 1, title: '第一章：品牌调研与分析', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 品牌调研基础\n\n在开始设计之前，我们需要对品牌进行全面的调研分析。\n\n### 调研维度：\n- 品牌定位分析\n- 目标用户画像\n- 竞品视觉分析\n- 行业趋势研究' }] },
        { id: 2, title: '第二章：Logo设计思路', duration: '8分钟', isFree: false, steps: [{ type: 'text', content: '## Logo设计核心\n\nLogo是品牌的核心视觉符号。\n\n### 设计要点：\n- 简洁易识别\n- 独特的图形元素\n- 符合品牌调性' }] },
        { id: 3, title: '第三章：色彩体系构建', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 品牌色彩设计\n\n色彩是品牌识别的重要组成部分。\n\n### 色彩选择原则：\n- 符合品牌调性\n- 行业通用性\n- 跨媒体适应性' }] },
        { id: 4, title: '第四章：字体与排版', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 品牌字体设计\n\n字体选择影响品牌的整体感受。' }] },
        { id: 5, title: '第五章：VI手册输出', duration: '7分钟', isFree: false, steps: [{ type: 'text', content: '## VI手册制作\n\n完整的VI手册是品牌资产的核心。' }] }
      ]
    },
    relatedCases: [1, 3, 6]
  },
  // 案例3：国潮风格插画系列
  {
    id: 3,
    title: '国潮风格插画系列',
    subtitle: '用AI工具快速生成国潮风格插画，掌握中国传统元素与现代设计的融合',
    creator: { name: '李思琪', avatar: '李', followers: 15600, bio: '国潮插画师，全网50万粉丝' },
    thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1280&h=720&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '20:00',
    views: 15600,
    likes: 1234,
    comments: 89,
    tags: ['国潮', '插画', '传统文化'],
    category: 'mangadrama',
    createdAt: '2026-04-02',
    unlockPoints: 79,
    price: 79,
    isFree: false,
    rating: 4.9,
    ratingCount: 234,
    tutorial: {
      totalChapters: 4,
      freeChapters: 1,
      chapters: [
        { id: 1, title: '第一章：国潮风格认知', duration: '4分钟', isFree: true, steps: [{ type: 'text', content: '## 国潮风格特点\n\n国潮是中国传统元素与现代设计风格的结合。\n\n### 核心元素：\n- 中国传统纹样\n- 古典配色\n- 现代构图' }] },
        { id: 2, title: '第二章：AI生成国潮插画', duration: '7分钟', isFree: false, steps: [{ type: 'text', content: '## Midjourney国潮提示词\n\n掌握正确的提示词是生成高质量插画的关键。\n\n### 常用提示词模板：\n- 主体描述 + 国潮元素\n- 色彩描述\n- 风格关键词' }] },
        { id: 3, title: '第三章：细节优化技巧', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 后期调整\n\nAI生成的插画需要后期优化才能商用。' }] },
        { id: 4, title: '第四章：系列化产出', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 建立素材库\n\n系统化管理国潮元素，提高产出效率。' }] }
      ]
    },
    relatedCases: [2, 5, 6]
  },
  // 案例4：智能家居APP界面设计
  {
    id: 4,
    title: '智能家居APP界面设计',
    subtitle: '从需求分析到高保真原型，完整掌握智能家居APP设计流程',
    creator: { name: '王雨晨', avatar: '王', followers: 5600, bio: '资深UI设计师，专注智能硬件产品设计' },
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1280&h=720&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '30:00',
    views: 6780,
    likes: 423,
    comments: 34,
    tags: ['APP', 'UI', '智能家居'],
    category: 'designer',
    createdAt: '2026-04-01',
    unlockPoints: 0,
    price: 0,
    isFree: true,
    rating: 4.7,
    ratingCount: 89,
    tutorial: {
      totalChapters: 5,
      freeChapters: 5,
      chapters: [
        { id: 1, title: '第一章：需求分析', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## 需求收集\n\n智能家居APP需要满足用户的核心需求。' }] },
        { id: 2, title: '第二章：信息架构', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 功能模块划分\n\n合理的功能架构是优秀体验的基础。' }] },
        { id: 3, title: '第三章：界面设计', duration: '8分钟', isFree: true, steps: [{ type: 'text', content: '## 设计规范制定\n\n统一的设计规范确保产品一致性。' }] },
        { id: 4, title: '第四章：交互设计', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## 交互流程优化\n\n好的交互让产品更易用。' }] },
        { id: 5, title: '第五章：高保真原型', duration: '7分钟', isFree: true, steps: [{ type: 'text', content: '## 原型制作\n\n高保真原型用于开发参考和用户测试。' }] }
      ]
    },
    relatedCases: [2, 5]
  },
  // 案例5：咖啡品牌包装设计
  {
    id: 5,
    title: '咖啡品牌包装设计',
    subtitle: '从品牌定位到包装设计，完整掌握食品包装设计的要点',
    creator: { name: '陈安然', avatar: '陈', followers: 4200, bio: '包装设计师，服务过多个知名食品品牌' },
    thumbnail: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1280&h=720&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '22:00',
    views: 5430,
    likes: 312,
    comments: 28,
    tags: ['包装', '咖啡', '品牌'],
    category: 'designer',
    createdAt: '2026-03-30',
    unlockPoints: 59,
    price: 59,
    isFree: false,
    rating: 4.6,
    ratingCount: 67,
    tutorial: {
      totalChapters: 4,
      freeChapters: 1,
      chapters: [
        { id: 1, title: '第一章：品牌定位', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 品牌故事\n\n每个成功的包装都有独特的品牌故事。' }] },
        { id: 2, title: '第二章：包装结构设计', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 结构选择\n\n根据产品特性和运输需求选择合适的包装结构。' }] },
        { id: 3, title: '第三章：视觉设计', duration: '7分钟', isFree: false, steps: [{ type: 'text', content: '## 视觉呈现\n\n包装的视觉设计需要考虑印刷工艺和材质。' }] },
        { id: 4, title: '第四章：打样与生产', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 生产流程\n\n从打样到批量生产的完整流程。' }] }
      ]
    },
    relatedCases: [2, 3]
  },
  // 案例6：游戏角色原画设计
  {
    id: 6,
    title: '游戏角色原画设计',
    subtitle: '用AI辅助设计游戏角色，从概念到高精度的完整流程',
    creator: { name: '刘星野', avatar: '刘', followers: 18900, bio: '游戏原画师，参与多个AAA游戏项目' },
    thumbnail: 'https://images.unsplash.com/photo-1612151855475-877969f4a6cc?w=1280&h=720&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '35:00',
    views: 18900,
    likes: 1567,
    comments: 112,
    tags: ['游戏', '原画', '角色设计'],
    category: 'mangadrama',
    createdAt: '2026-03-28',
    unlockPoints: 199,
    price: 199,
    isFree: false,
    rating: 4.9,
    ratingCount: 312,
    tutorial: {
      totalChapters: 6,
      freeChapters: 2,
      chapters: [
        { id: 1, title: '第一章：角色概念设计', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## 角色定位\n\n在设计之前，明确角色的定位和背景故事。\n\n### 设计要素：\n- 角色性格\n- 世界观背景\n- 视觉风格方向' }] },
        { id: 2, title: '第二章：AI辅助草图', duration: '7分钟', isFree: true, steps: [{ type: 'text', content: '## 快速生成\n\n使用AI工具快速生成多个设计方案。\n\n### 工具选择：\n- Midjourney\n- Stable Diffusion\n- ComfyUI工作流' }] },
        { id: 3, title: '第三章：角色细化', duration: '8分钟', isFree: false, steps: [{ type: 'text', content: '## 细节刻画\n\n在AI生成的基础上进行手工细化。' }] },
        { id: 4, title: '第四章：三视图制作', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 规范输出\n\n游戏角色需要标准的三视图。' }] },
        { id: 5, title: '第五章：配色与材质', duration: '7分钟', isFree: false, steps: [{ type: 'text', content: '## 色彩设计\n\n角色的配色方案和材质表现。' }] },
        { id: 6, title: '第六章：展示图制作', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 最终呈现\n\n完整的角色展示图用于项目汇报。' }] }
      ]
    },
    relatedCases: [1, 3]
  }
];

// 合并默认案例和创作者发布的案例
const allCases = [...defaultCases, ...loadPublishedCases()];

// 模拟评论数据
const mockComments = [
  { id: 1, user: '小明同学', avatar: '小', text: '太详细了！按照这个流程做了一条，效果真的很好！', time: '2天前', likes: 45, liked: false },
  { id: 2, user: 'AI创作者', avatar: 'A', text: '第三章的Prompt公式很实用，收藏了！', time: '1天前', likes: 23, liked: false },
  { id: 3, user: '视频小白', avatar: '视', text: '请问即梦AI需要付费吗？每个月多少钱？', time: '5小时前', likes: 8, liked: false },
  { id: 4, user: '老王创作', avatar: '王', text: '跟着做了一遍，B站涨了800粉，感谢分享！', time: '3小时前', likes: 67, liked: false },
]

// ==================== 视频播放器组件 ====================
function VideoPlayer({ videoUrl, thumbnail, freeVideoUrl, isUnlocked, onUnlockNeeded, freeVideoPercent = 80, unlockPoints = 99 }) {
  const videoRef = useRef(null)
  const progressRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const controlsTimer = useRef(null)

  const currentVideoUrl = isUnlocked ? videoUrl : freeVideoUrl
  const freeLimit = isUnlocked ? 100 : freeVideoPercent // 解锁后可以看100%

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    const v = videoRef.current
    if (!v) return
    if (isPlaying) { v.pause() } else { v.play() }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v || isDragging) return
    setCurrentTime(v.currentTime)
    // 免费视频播放到 freeLimit 时，弹出解锁提示
    if (!isUnlocked && v.duration && v.currentTime / v.duration > freeLimit / 100) {
      v.pause()
      setIsPlaying(false)
      onUnlockNeeded && onUnlockNeeded()
    }
  }

  const handleProgressClick = (e) => {
    const v = videoRef.current
    if (!v || !progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const newTime = ratio * duration
    // 免费模式不允许拖到 freeLimit 以后
    if (!isUnlocked && ratio > freeLimit / 100) {
      onUnlockNeeded && onUnlockNeeded()
      return
    }
    v.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000)
  }

  const handleFullscreen = () => {
    const v = videoRef.current
    if (!v) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      v.requestFullscreen?.()
    }
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="csd-video-wrap" onMouseMove={handleMouseMove} onMouseLeave={() => setShowControls(false)}>
      {currentVideoUrl ? (
        <video
          ref={videoRef}
          src={currentVideoUrl}
          poster={thumbnail}
          className="csd-video-el"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          muted={isMuted}
          playsInline
        />
      ) : (
        <div className="csd-video-placeholder">
          <img src={thumbnail} alt="封面" />
        </div>
      )}

      {/* 自定义控制栏 */}
      <div className={`csd-controls ${showControls || !isPlaying ? 'visible' : ''}`}>
        {/* 进度条 */}
        <div className="csd-progress-wrap">
          <div
            ref={progressRef}
            className="csd-progress-bar"
            onClick={handleProgressClick}
          >
            {/* 免费区域标记 */}
            {!isUnlocked && (
              <div className="csd-free-zone" style={{ width: `${freeLimit}%` }}></div>
            )}
            {/* 已播放 */}
            <div className="csd-progress-played" style={{ width: `${progressPercent}%` }}></div>
            {/* 拖动点 */}
            <div className="csd-progress-thumb" style={{ left: `${progressPercent}%` }}></div>
            {/* 解锁线 */}
            {!isUnlocked && (
              <div className="csd-lock-line" style={{ left: `${freeLimit}%` }}>
                <Lock size={10} />
              </div>
            )}
          </div>
          <div className="csd-time-row">
            <span className="csd-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
            {!isUnlocked && <span className="csd-free-tip">前{freeLimit}%免费 · 解锁看全部</span>}
          </div>
        </div>

        {/* 控制按钮行 */}
        <div className="csd-ctrl-row">
          <button className="csd-ctrl-btn" onClick={handlePlayPause}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className="csd-ctrl-btn" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="csd-ctrl-spacer"></div>
          {!isUnlocked && (
            <button className="csd-unlock-ctrl-btn" onClick={() => onUnlockNeeded && onUnlockNeeded()}>
              <Lock size={14} /> 解锁完整视频
            </button>
          )}
          <button className="csd-ctrl-btn" onClick={handleFullscreen}>
            <Maximize size={18} />
          </button>
        </div>
      </div>

      {/* 点击播放/暂停 */}
      <div className="csd-click-area" onClick={handlePlayPause}></div>

      {/* 解锁遮罩（播放到 freeLimit 后出现） */}
      {!isUnlocked && progressPercent >= freeLimit - 0.5 && !isPlaying && (
        <div className="csd-unlock-mask">
          <div className="csd-unlock-content">
            <Lock size={32} className="csd-lock-icon" />
            <h3>后续内容已锁定</h3>
            <p>解锁完整视频，继续观看剩余 {100 - freeLimit}% 精华内容</p>
            <button className="csd-unlock-big-btn" onClick={() => onUnlockNeeded && onUnlockNeeded()}>
              <Zap size={18} /> {unlockPoints}积分 解锁完整版
            </button>
            <span className="csd-or">或</span>
            <button className="csd-vip-btn" onClick={() => onUnlockNeeded && onUnlockNeeded()}>
              开通VIP · 无限解锁全部内容
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== 内容渲染组件 ====================
function TutorialStep({ step }) {
  if (step.type === 'text') {
    return (
      <div className="csd-step-text">
        {step.content.split('\n').map((line, i) => {
          if (line.startsWith('## ')) return <h2 key={i} className="csd-h2">{line.replace('## ', '')}</h2>
          if (line.startsWith('### ')) return <h3 key={i} className="csd-h3">{line.replace('### ', '')}</h3>
          if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={i} className="csd-bold">{line.replace(/\*\*/g, '')}</p>
          }
          if (line.startsWith('```') || line === '```') return null
          if (line.startsWith('- ')) return <li key={i} className="csd-li">{line.replace('- ', '')}</li>
          if (line.trim() === '') return <div key={i} className="csd-spacer"></div>
          return <p key={i} className="csd-p">{line}</p>
        })}
      </div>
    )
  }

  if (step.type === 'image') {
    return (
      <div className="csd-step-image">
        <img src={step.src} alt={step.caption} loading="lazy" />
        <p className="csd-img-caption">{step.caption}</p>
      </div>
    )
  }

  if (step.type === 'tip') {
    return (
      <div className="csd-step-tip">
        <div className="csd-tip-header">
          <span className="csd-tip-icon">{step.icon}</span>
          <span className="csd-tip-title">{step.title}</span>
        </div>
        <p className="csd-tip-content">{step.content}</p>
      </div>
    )
  }

  if (step.type === 'video') {
    return (
      <div className="csd-step-video">
        {step.title && <h4 className="csd-video-title">{step.title}</h4>}
        {step.src ? (
          <div className="csd-video-container">
            <video 
              src={step.src} 
              controls 
              className="csd-tutorial-video"
              preload="metadata"
            />
          </div>
        ) : (
          <div className="csd-video-placeholder">
            <Video size={32} />
            <span>视频内容</span>
          </div>
        )}
      </div>
    )
  }

  if (step.type === 'formula') {
    return (
      <div className="csd-step-formula">
        <div className="csd-formula-title">
          <Award size={16} /> {step.title}
        </div>
        <div className="csd-formula-items">
          {step.items.map((item, i) => (
            <div key={i} className="csd-formula-item">
              <span className="csd-formula-num">{i + 1}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

// ==================== 解锁弹窗 ====================
function UnlockModal({ caseData, onClose, onUnlocked }) {
  const [userPoints, setUserPoints] = useState(() => {
    return parseInt(localStorage.getItem('userPoints') || '350')
  })
  const [unlocking, setUnlocking] = useState(false)
  const [method, setMethod] = useState('buy') // points | vip | buy
  const [toast, setToast] = useState(null)

  // 获取实际的价格
  const actualPoints = caseData.pointsPrice || caseData.unlockPoints || 99
  const actualPrice = caseData.price || 0

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleUnlock = () => {
    if (method === 'points' && userPoints < actualPoints) return
    
    setUnlocking(true)
    
    // 模拟支付处理
    setTimeout(() => {
      if (method === 'points') {
        // 扣除积分
        const newPoints = userPoints - actualPoints
        setUserPoints(newPoints)
        localStorage.setItem('userPoints', newPoints.toString())
      }
      
      // 保存购买记录
      const purchaseKey = `caseUnlocked_${caseData.id}`
      const purchases = JSON.parse(localStorage.getItem('casePurchases') || '[]')
      if (!purchases.includes(caseData.id)) {
        purchases.push(caseData.id)
        localStorage.setItem('casePurchases', JSON.stringify(purchases))
      }
      localStorage.setItem(purchaseKey, 'true')
      
      setUnlocking(false)
      showToast('🎉 购买成功！开始学习吧')
      onUnlocked()
      onClose()
    }, 2000)
  }

  const handleOpenVip = () => {
    showToast('正在跳转到VIP开通页面...')
    setTimeout(() => {
      onClose()
    }, 500)
  }

  const canAfford = userPoints >= actualPoints

  return (
    <>
      {toast && (
        <div className="csd-toast" style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          zIndex: 99999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {toast.message}
        </div>
      )}
      <div className="unlock-modal-bg" onClick={onClose}>
        <div className="unlock-modal-box" onClick={e => e.stopPropagation()}>
          <button className="unlock-close-btn" onClick={onClose}><X size={20} /></button>

          <div className="unlock-header">
            <div className="unlock-lock-icon">
              <Lock size={28} />
            </div>
            <h2>解锁完整内容</h2>
            <p>解锁后可观看完整视频 + 全部{caseData.tutorial?.totalChapters || 6}章图文教程</p>
          </div>

          {/* 解锁方式选择 */}
          <div className="unlock-methods">
            {/* 单独购买（默认） */}
            {actualPrice > 0 && (
              <div
                className={`unlock-method-card ${method === 'buy' ? 'active' : ''}`}
                onClick={() => setMethod('buy')}
              >
                <div className="unlock-method-top">
                  <BookOpen size={20} className="unlock-method-icon" />
                  <span className="unlock-method-name">单独购买</span>
                  {method === 'buy' && <CheckCircle size={16} className="unlock-check" />}
                  <span className="unlock-hot-badge">最划算</span>
                </div>
                <div className="unlock-method-detail">
                  <span className="unlock-buy-price">¥{actualPrice}</span>
                  <span className="unlock-buy-desc">永久解锁本案例</span>
                </div>
              </div>
            )}

            {/* 积分解锁 */}
            <div
              className={`unlock-method-card ${method === 'points' ? 'active' : ''}`}
              onClick={() => setMethod('points')}
            >
              <div className="unlock-method-top">
                <Zap size={20} className="unlock-method-icon" />
                <span className="unlock-method-name">积分解锁</span>
                {method === 'points' && <CheckCircle size={16} className="unlock-check" />}
              </div>
              <div className="unlock-method-detail">
                <span className="unlock-points-needed">{actualPoints} 积分</span>
                <span className="unlock-my-points">我的积分：<strong className={canAfford ? 'enough' : 'notEnough'}>{userPoints}</strong></span>
              </div>
              {!canAfford && method === 'points' && (
                <div className="unlock-lack-tip">
                  <AlertCircle size={14} /> 积分不足，还需 {actualPoints - userPoints} 积分
                  <button className="unlock-buy-points-btn" onClick={() => navigate('/user/points')}>
                    充值积分 →
                  </button>
                </div>
              )}
            </div>

            {/* VIP解锁 */}
            <div
              className={`unlock-method-card vip-card ${method === 'vip' ? 'active' : ''}`}
              onClick={() => setMethod('vip')}
            >
              <div className="unlock-method-top">
                <Award size={20} className="unlock-method-icon vip" />
                <span className="unlock-method-name">VIP会员</span>
                {method === 'vip' && <CheckCircle size={16} className="unlock-check" />}
              </div>
              <div className="unlock-method-detail">
                <span className="unlock-vip-price">¥29/月</span>
                <span className="unlock-vip-benefit">无限解锁所有内容</span>
              </div>
            </div>
          </div>

          {/* 解锁按钮 */}
          <button
            className={`unlock-confirm-btn ${unlocking ? 'loading' : ''} ${method === 'points' && !canAfford ? 'disabled' : ''}`}
            onClick={method === 'vip' ? handleOpenVip : handleUnlock}
            disabled={unlocking || (method === 'points' && !canAfford)}
          >
            {unlocking ? (
              <span className="unlock-loading-text">
                <span className="spinner"></span> 支付中...
              </span>
            ) : method === 'points' ? (
              canAfford ? `✓ 消耗 ${actualPoints} 积分，立即解锁` : '积分不足，请充值'
            ) : method === 'vip' ? (
              '开通VIP，无限解锁 →'
            ) : actualPrice > 0 ? (
              `✓ ¥${actualPrice} 购买完整内容 →`
            ) : (
              `✓ 积分解锁完整内容`
            )}
          </button>

          <p className="unlock-guarantee">
            <CheckCircle size={14} /> 解锁后永久有效 · 支持退款（7天内）
          </p>
        </div>
      </div>
    </>
  )
}

// ==================== 主组件 ====================
export default function CaseStudyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const caseData = allCases.find(c => c.id === parseInt(id)) || allCases[0]

  // 从localStorage加载购买状态
  const [isUnlocked, setIsUnlocked] = useState(() => {
    const purchaseKey = `caseUnlocked_${caseData.id}`
    return localStorage.getItem(purchaseKey) === 'true'
  })
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [activeChapter, setActiveChapter] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(caseData.likes)
  const [bookmarked, setBookmarked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(mockComments)
  const [showShareTip, setShowShareTip] = useState(false)
  const [commentLikes, setCommentLikes] = useState({})
  const [expandedChapters, setExpandedChapters] = useState({ 0: true, 1: true })
  const [showToc, setShowToc] = useState(true) // 目录面板开关
  
  // 章节Refs（用于滚动定位）
  const chapterRefs = useRef({})

  const currentChapter = caseData.tutorial.chapters[activeChapter]
  const isChapterFree = activeChapter < (caseData.freeChapters || caseData.tutorial?.freeChapters || 1)
  
  // 滚动监听，自动高亮当前章节
  useEffect(() => {
    const handleScroll = () => {
      if (!caseData.tutorial?.chapters?.length) return
      
      let currentIndex = 0
      const scrollY = window.scrollY + 200 // 偏移量，考虑顶部导航
      
      for (let i = 0; i < caseData.tutorial.chapters.length; i++) {
        const ref = chapterRefs.current[i]
        if (ref) {
          const rect = ref.getBoundingClientRect()
          if (rect.top <= scrollY) {
            currentIndex = i
          }
        }
      }
      
      if (currentIndex !== activeChapter) {
        setActiveChapter(currentIndex)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [caseData.tutorial?.chapters?.length, activeChapter])
  
  // 滚动到指定章节
  const scrollToChapter = (index) => {
    setActiveChapter(index)
    const ref = chapterRefs.current[index]
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleChapterClick = (index) => {
    const chapter = caseData.tutorial.chapters[index]
    if (!chapter.isFree && !isUnlocked) {
      setShowUnlockModal(true)
      return
    }
    setActiveChapter(index)
    setExpandedChapters(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard?.writeText(url).then(() => {
      setShowShareTip(true)
      setTimeout(() => setShowShareTip(false), 2500)
    })
  }

  const handleComment = () => {
    if (!commentText.trim()) return
    const newComment = {
      id: Date.now(),
      user: '我',
      avatar: '我',
      text: commentText,
      time: '刚刚',
      likes: 0,
      liked: false
    }
    setComments(prev => [newComment, ...prev])
    setCommentText('')
  }

  const handleCommentLike = (id) => {
    setCommentLikes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="csd-page">
      {/* 顶部导航 */}
      <div className="csd-nav">
        <button className="csd-back-btn" onClick={() => navigate('/training')}>
          <ArrowLeft size={18} /> 返回培训孵化
        </button>
        <div className="csd-nav-breadcrumb">
          <Link to="/training">培训孵化</Link>
          <ChevronRight size={14} />
          <span>案例拆解</span>
          <ChevronRight size={14} />
          <span className="csd-nav-current">{caseData.title}</span>
        </div>
      </div>

      {/* ===== 固定目录面板 ===== */}
      <div className={`csd-toc-fixed ${showToc ? 'open' : ''}`}>
        <div className="csd-toc-header">
          <div className="csd-toc-title">
            <BookOpen size={16} />
            <span>目录导航</span>
          </div>
          <button className="csd-toc-toggle" onClick={() => setShowToc(!showToc)}>
            {showToc ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
        
        {showToc && (
          <div className="csd-toc-list">
            {caseData.tutorial?.chapters?.map((chapter, index) => {
              const isFree = chapter.isFree !== undefined ? chapter.isFree : index < (caseData.freeChapters || caseData.tutorial?.freeChapters || 1)
              const isActive = activeChapter === index
              const isAccessible = isFree || isUnlocked
              
              return (
                <div
                  key={chapter.id}
                  className={`csd-toc-item ${isActive ? 'active' : ''} ${!isAccessible ? 'locked' : ''}`}
                  onClick={() => scrollToChapter(index)}
                >
                  <div className="csd-toc-number">{index + 1}</div>
                  <div className="csd-toc-info">
                    <div className="csd-toc-chapter-name">{chapter.title}</div>
                    <div className="csd-toc-chapter-meta">
                      <Clock size={10} /> {chapter.duration}
                    </div>
                  </div>
                  <div className="csd-toc-status">
                    {isFree ? (
                      <Unlock size={12} className="csd-toc-free-icon" />
                    ) : (
                      <Lock size={12} className="csd-toc-lock-icon" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="csd-main">
        {/* ===== 左侧：主内容 ===== */}
        <div className="csd-content-left">
          {/* 视频播放器 */}
          <VideoPlayer
            videoUrl={caseData.videoUrl}
            freeVideoUrl={caseData.freeVideoUrl}
            thumbnail={caseData.thumbnail}
            isUnlocked={isUnlocked}
            onUnlockNeeded={() => setShowUnlockModal(true)}
            freeVideoPercent={caseData.freeVideoPercent || 80}
            unlockPoints={caseData.pointsPrice || caseData.unlockPoints || 99}
          />

          {/* 视频标题区 */}
          <div className="csd-video-info">
            <div className="csd-video-top">
              <h1 className="csd-title">{caseData.title}</h1>
              <p className="csd-subtitle">{caseData.subtitle}</p>
            </div>

            {/* 操作栏 */}
            <div className="csd-action-bar">
              <div className="csd-action-left">
                <div className="csd-meta-item"><Eye size={15} /> {caseData.views.toLocaleString()} 播放</div>
                <div className="csd-meta-item"><Clock size={15} /> {caseData.duration}</div>
                <div className="csd-meta-item"><Star size={15} className="star" /> {caseData.rating} ({caseData.ratingCount}条评价)</div>
              </div>
              <div className="csd-action-btns">
                <button className={`csd-act-btn ${liked ? 'active' : ''}`} onClick={handleLike}>
                  <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
                  <span>{likeCount}</span>
                </button>
                <button className={`csd-act-btn ${bookmarked ? 'active' : ''}`} onClick={() => setBookmarked(!bookmarked)}>
                  <Bookmark size={17} fill={bookmarked ? 'currentColor' : 'none'} />
                  <span>{bookmarked ? '已收藏' : '收藏'}</span>
                </button>
                <button className="csd-act-btn" onClick={handleShare}>
                  <Share2 size={17} />
                  <span>分享</span>
                  {showShareTip && <span className="csd-share-tip">链接已复制！</span>}
                </button>
              </div>
            </div>

            {/* 标签 */}
            <div className="csd-tags">
              {caseData.tags.map((t, i) => (
                <span key={i} className="csd-tag">#{t}</span>
              ))}
              {!isUnlocked && (
                <span className="csd-lock-badge">
                  <Lock size={11} /> 需解锁
                </span>
              )}
              {isUnlocked && (
                <span className="csd-unlocked-badge">
                  <Unlock size={11} /> 已解锁
                </span>
              )}
            </div>
          </div>

          {/* ===== 图文教程区 ===== */}
          <div className="csd-tutorial-section">
            <div className="csd-tutorial-header">
              <h2 className="csd-tutorial-title">
                <BookOpen size={20} /> 图文拆解教程
              </h2>
              {!isUnlocked && caseData.tutorial?.chapters?.length > 0 && (
                <div className="csd-tutorial-lock-info">
                  <Lock size={14} />
                  <span>前 {caseData.freeChapters || caseData.tutorial?.freeChapters || 1} 章免费 · 后续需解锁</span>
                  <button className="csd-quick-unlock-btn" onClick={() => setShowUnlockModal(true)}>
                    <Zap size={13} /> {(caseData.pointsPrice || caseData.unlockPoints || 99)}积分解锁
                  </button>
                </div>
              )}
            </div>

            {/* 没有教程内容时显示提示 */}
            {!caseData.tutorial?.chapters?.length ? (
              <div className="csd-tutorial-empty">
                <div className="csd-empty-icon">📚</div>
                <h3>教程内容待更新</h3>
                <p>创作者正在准备详细的图文教程，敬请期待...</p>
              </div>
            ) : (
            <div className="csd-tutorial-layout">
              {/* 章节目录（左侧） */}
              <div className="csd-chapters-nav">
                <div className="csd-chapters-header">
                  <BookOpen size={16} />
                  <span>章节目录</span>
                  <button className="csd-chapters-collapse-btn" onClick={() => setExpandedChapters({})}>
                    {Object.keys(expandedChapters).length > 0 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
                {Object.keys(expandedChapters).length > 0 && caseData.tutorial.chapters.map((chapter, index) => {
                  // 如果章节没有 isFree 标志，根据索引和 freeChapters 判断
                  const isFree = chapter.isFree !== undefined ? chapter.isFree : index < (caseData.freeChapters || caseData.tutorial?.freeChapters || 1)
                  const isActive = activeChapter === index
                  const isAccessible = isFree || isUnlocked

                  return (
                    <div
                      key={chapter.id}
                      className={`csd-chapter-item ${isActive ? 'active' : ''} ${!isAccessible ? 'locked' : ''}`}
                      onClick={() => {
                        if (!isAccessible) {
                          setShowUnlockModal(true)
                          return
                        }
                        setActiveChapter(index)
                        scrollToChapter(index)
                      }}
                    >
                      <div className="csd-chapter-left">
                        <div className={`csd-chapter-icon ${!isAccessible ? 'lock-icon' : isActive ? 'active-icon' : ''}`}>
                          {!isAccessible ? <Lock size={12} /> : isActive ? <Play size={12} /> : <CheckCircle size={12} />}
                        </div>
                        <div>
                          <div className="csd-chapter-name">{chapter.title}</div>
                          <div className="csd-chapter-meta">
                            <Clock size={11} /> {chapter.duration}
                          </div>
                        </div>
                      </div>
                      {isFree ? (
                        <span className="csd-free-chapter-badge">免费</span>
                      ) : !isUnlocked ? (
                        <span className="csd-lock-chapter-badge"><Lock size={10} /></span>
                      ) : null}
                    </div>
                  )
                })}
              </div>

              {/* 章节内容（右侧） */}
              <div className="csd-chapter-content">
                {/* 章节标题 */}
                <div className="csd-chapter-title-bar">
                  <h3 className="csd-chapter-h3">{currentChapter.title}</h3>
                  <div className="csd-chapter-nav-btns">
                    <button
                      className="csd-chapter-nav-btn"
                      disabled={activeChapter === 0}
                      onClick={() => {
                        const newIndex = Math.max(0, activeChapter - 1)
                        setActiveChapter(newIndex)
                        scrollToChapter(newIndex)
                      }}
                    >
                      <ChevronLeft size={16} /> 上一章
                    </button>
                    <button
                      className="csd-chapter-nav-btn"
                      disabled={activeChapter === caseData.tutorial.chapters.length - 1}
                      onClick={() => {
                        const nextIdx = activeChapter + 1
                        const nextChapter = caseData.tutorial.chapters[nextIdx]
                        const nextIsFree = nextChapter.isFree !== undefined ? nextChapter.isFree : nextIdx < (caseData.freeChapters || caseData.tutorial?.freeChapters || 1)
                        if (!nextIsFree && !isUnlocked) {
                          setShowUnlockModal(true)
                          return
                        }
                        setActiveChapter(nextIdx)
                        scrollToChapter(nextIdx)
                      }}
                    >
                      下一章 <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* 内容（如果不可访问，显示锁定预览） */}
                {(!isChapterFree && !isUnlocked) ? (
                  <div className="csd-chapter-locked">
                    <div className="csd-chapter-lock-icon"><Lock size={36} /></div>
                    <h3>本章内容已锁定</h3>
                    <p>解锁后即可查看完整图文教程，包括实操截图、关键词参数和完整流程。</p>
                    <div className="csd-lock-preview">
                      {currentChapter.steps?.slice(0, 1).map((step, i) => (
                        <div key={i} className="csd-locked-preview-item">
                          <div className="csd-locked-blur">
                            <TutorialStep step={step} />
                          </div>
                          <div className="csd-blur-overlay"></div>
                        </div>
                      ))}
                    </div>
                    <button className="csd-chapter-unlock-btn" onClick={() => setShowUnlockModal(true)}>
                      <Zap size={16} /> 消耗 {(caseData.pointsPrice || caseData.unlockPoints || 99)} 积分 · 解锁全部章节
                    </button>
                    <span className="csd-or-text">或</span>
                    <button className="csd-vip-unlock-btn" onClick={() => setShowUnlockModal(true)}>
                      开通VIP会员，无限解锁
                    </button>
                  </div>
                ) : (
                  <div className="csd-chapter-steps" ref={el => chapterRefs.current[activeChapter] = el}>
                    {currentChapter.steps.map((step, i) => (
                      <TutorialStep key={i} step={step} />
                    ))}
                    {/* 章节完成提示 */}
                    <div className="csd-chapter-done">
                      <CheckCircle size={18} />
                      <span>本章完成 · </span>
                      {activeChapter < caseData.tutorial.chapters.length - 1 ? (
                        <button onClick={() => {
                          const nextIdx = activeChapter + 1
                          const nextChapter = caseData.tutorial.chapters[nextIdx]
                          const nextIsFree = nextChapter.isFree !== undefined ? nextChapter.isFree : nextIdx < (caseData.freeChapters || caseData.tutorial?.freeChapters || 1)
                          if (!nextIsFree && !isUnlocked) {
                            setShowUnlockModal(true)
                            return
                          }
                          setActiveChapter(nextIdx)
                          scrollToChapter(nextIdx)
                        }}>
                          继续下一章 <ChevronRight size={14} />
                        </button>
                      ) : (
                        <span>恭喜你学完了全部内容！</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
          </div>

          {/* ===== 评论区 ===== */}
          <div className="csd-comments-section">
            <h3 className="csd-comments-title">
              <MessageSquare size={20} /> 评论 <span className="csd-comment-count">{comments.length}</span>
            </h3>

            {/* 发评论 */}
            <div className="csd-comment-input-wrap">
              <div className="csd-my-avatar">我</div>
              <div className="csd-input-area">
                <textarea
                  placeholder="写下你的学习心得或问题..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  className="csd-textarea"
                  rows={3}
                />
                <div className="csd-input-footer">
                  <span className="csd-char-count">{commentText.length}/500</span>
                  <button
                    className="csd-send-btn"
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                  >
                    发布评论
                  </button>
                </div>
              </div>
            </div>

            {/* 评论列表 */}
            <div className="csd-comment-list">
              {comments.map(c => (
                <div key={c.id} className="csd-comment-item">
                  <div className="csd-comment-avatar">{c.avatar}</div>
                  <div className="csd-comment-body">
                    <div className="csd-comment-header">
                      <span className="csd-comment-user">{c.user}</span>
                      <span className="csd-comment-time">{c.time}</span>
                    </div>
                    <p className="csd-comment-text">{c.text}</p>
                    <div className="csd-comment-actions">
                      <button
                        className={`csd-comment-like ${commentLikes[c.id] ? 'liked' : ''}`}
                        onClick={() => handleCommentLike(c.id)}
                      >
                        <ThumbsUp size={13} fill={commentLikes[c.id] ? 'currentColor' : 'none'} />
                        {commentLikes[c.id] ? c.likes + 1 : c.likes}
                      </button>
                      <button className="csd-comment-reply">回复</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== 右侧：作者信息 + 解锁卡片 ===== */}
        <div className="csd-sidebar">
          {/* 作者信息 */}
          <div className="csd-author-card">
            <div className="csd-author-top">
              <div className="csd-author-avatar">{caseData.creator.avatar}</div>
              <div className="csd-author-info">
                <div className="csd-author-name">{caseData.creator.name}</div>
                <div className="csd-author-bio">{caseData.creator.bio}</div>
                <div className="csd-author-follow-count">
                  <Users size={13} /> {caseData.creator.followers.toLocaleString()} 关注者
                </div>
              </div>
            </div>
            <button className="csd-follow-btn">+ 关注创作者</button>
          </div>

          {/* 解锁卡片 */}
          {!isUnlocked && (
            <div className="csd-unlock-card">
              <div className="csd-unlock-card-header">
                <Lock size={18} />
                <span>解锁完整内容</span>
              </div>
              <ul className="csd-unlock-benefits">
                <li><CheckCircle size={14} /> 完整视频（前{caseData.freeVideoPercent || 80}%→100%）</li>
                <li><CheckCircle size={14} /> 全部{caseData.tutorial?.totalChapters || 6}章图文教程</li>
                <li><CheckCircle size={14} /> 实操截图 & 参数清单</li>
                <li><CheckCircle size={14} /> 永久查看，随时复习</li>
              </ul>
              <button className="csd-unlock-card-btn" onClick={() => setShowUnlockModal(true)}>
                <Zap size={16} /> {(caseData.pointsPrice || caseData.unlockPoints || 99)} 积分解锁
              </button>
              <div className="csd-unlock-or">或</div>
              <button className="csd-vip-card-btn" onClick={() => setShowUnlockModal(true)}>
                <Award size={15} /> 开通VIP · 无限解锁
              </button>
              <p className="csd-unlock-card-tip">已有 {caseData.views.toLocaleString()} 人学习过这个案例</p>
            </div>
          )}

          {/* 已解锁状态 */}
          {isUnlocked && (
            <div className="csd-unlocked-card">
              <div className="csd-unlocked-icon">
                <Unlock size={24} />
              </div>
              <h4>内容已解锁</h4>
              <p>你已解锁全部视频和图文教程，尽情学习吧！</p>
              <div className="csd-progress-info">
                <span>章节进度</span>
                <span>{activeChapter + 1} / {caseData.tutorial.totalChapters}</span>
              </div>
              <div className="csd-progress-track">
                <div
                  className="csd-progress-fill"
                  style={{ width: `${((activeChapter + 1) / caseData.tutorial.totalChapters) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* 相关案例 */}
          <div className="csd-related-section">
            <h4 className="csd-related-title">相关案例推荐</h4>
            {allCases.filter(c => c.id !== caseData.id).slice(0, 3).map(related => (
              <div
                key={related.id}
                className="csd-related-card"
                onClick={() => navigate(`/training/case/${related.id}`)}
              >
                <div className="csd-related-thumb">
                  <img src={related.thumbnail} alt={related.title} />
                  {!related.isFree && <Lock size={11} className="csd-related-lock" />}
                </div>
                <div className="csd-related-info">
                  <div className="csd-related-title-text">{related.title}</div>
                  <div className="csd-related-meta">
                    <Eye size={11} /> {related.views.toLocaleString()}
                    {!related.isFree && <span className="csd-related-points"><Zap size={11} />{related.unlockPoints}积分</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 解锁弹窗 */}
      {showUnlockModal && (
        <UnlockModal
          caseData={caseData}
          navigate={navigate}
          onClose={() => setShowUnlockModal(false)}
          onUnlocked={() => {
            setIsUnlocked(true)
            setActiveChapter(0)
          }}
        />
      )}
    </div>
  )
}
