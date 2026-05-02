import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Lock, Unlock, Zap, CheckCircle, 
  ArrowLeft, ChevronRight, ChevronLeft, X, Eye, Heart, Share2, Bookmark,
  Clock, Users, Star, Award, BookOpen, AlertCircle, MessageSquare, ThumbsUp
} from 'lucide-react';
import './TutorialDetail.css';
// ==================== 加载案例数据 ====================
const loadPublishedCases = () => {
  try {
    const published = JSON.parse(localStorage.getItem('publishedCases') || '[]');
    return published.filter(c => !c.isDraft && c.status === 'published');
  } catch (e) {
    return [];
  }
};
// 培训孵化案例数据（与 TrainingPage.jsx 同步）
const trainingCases = [
  { id: 1, category: 'shortvideo', categoryName: 'AI短视频', title: '【AI短视频】科技公司品牌宣传片全流程拆解', subtitle: '从脚本策划到后期剪辑，用AI工具制作专业品牌宣传片', creator: { name: '林小影', avatar: '林', followers: 1230, bio: 'AI视频创作达人' }, thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '18:30', views: 3256, likes: 189, comments: 45, tags: ['品牌宣传', 'AI视频', '即梦'], createdAt: '2026-04-06', price: 0, isFree: true, freeVideoPercent: 100, freeChapters: 3, pointsPrice: 0, unlockPoints: 0, rating: 4.8, ratingCount: 89, tutorial: { totalChapters: 4, freeChapters: 3, chapters: [{ id: 1, title: '第一章：项目需求分析与脚本策划', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 项目需求分析\n\n拿到客户需求后，首先进行竞品分析和目标受众调研。' }] }, { id: 2, title: '第二章：即梦AI生成品牌视觉素材', duration: '8分钟', isFree: true, steps: [{ type: 'text', content: '## 即梦AI实操\n\n使用即梦生成科技感十足的视觉素材。' }] }, { id: 3, title: '第三章：剪映剪辑与调色技巧', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## 剪映剪辑\n\n专业剪辑技巧让品牌片更有质感。' }] }, { id: 4, title: '第四章：成片输出与交付标准', duration: '4分钟', isFree: false, steps: [{ type: 'text', content: '## 成片交付\n\n了解品牌视频的交付标准和格式要求。' }] }] } },
  { id: 2, category: 'shortvideo', categoryName: 'AI短视频', title: '【AI短视频】电商直播预告片 AI 制作全攻略', subtitle: '10分钟掌握爆款直播预告片制作', creator: { name: '带货达人', avatar: '达', followers: 890, bio: '电商带货专家' }, thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '14:45', views: 1892, likes: 112, comments: 28, tags: ['电商', '直播预告', 'AI制作'], createdAt: '2026-04-04', price: 0, isFree: true, freeVideoPercent: 100, freeChapters: 2, pointsPrice: 0, unlockPoints: 0, rating: 4.7, ratingCount: 56, tutorial: { totalChapters: 3, freeChapters: 2, chapters: [{ id: 1, title: '第一章：直播预告片脚本设计', duration: '4分钟', isFree: true, steps: [{ type: 'text', content: '## 脚本设计\n\n好的脚本是成功的一半。' }] }, { id: 2, title: '第二章：AI生图+AI视频制作', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## AI制作流程\n\nAI工具快速生成高质量素材。' }] }, { id: 3, title: '第三章：配音与字幕处理', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 后期处理\n\n专业的配音和字幕提升观感。' }] }] } },
  { id: 3, category: 'shortvideo', categoryName: 'AI短视频', title: '【AI短视频】产品功能展示视频 AI 生成实战', subtitle: '用AI工具批量生成产品功能展示视频', creator: { name: '陈导', avatar: '陈', followers: 2100, bio: 'AI视频制作人' }, thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '16:00', views: 2567, likes: 167, comments: 38, tags: ['产品展示', '批量生成', '电商'], createdAt: '2026-04-02', price: 9.9, isFree: false, freeVideoPercent: 50, freeChapters: 1, pointsPrice: 99, unlockPoints: 99, rating: 4.9, ratingCount: 78, tutorial: { totalChapters: 4, freeChapters: 1, chapters: [{ id: 1, title: '第一章：产品视频拍摄思路', duration: '4分钟', isFree: true, steps: [{ type: 'text', content: '## 拍摄思路\n\n产品视频的核心是展示卖点。' }] }, { id: 2, title: '第二章：AI生成产品展示素材', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## AI素材生成\n\n用AI快速生成多种角度展示素材。' }] }, { id: 3, title: '第三章：批量生产工作流搭建', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 批量生产\n\n建立高效的AI批量生产流程。' }] }, { id: 4, title: '第四章：剪辑与发布技巧', duration: '4分钟', isFree: false, steps: [{ type: 'text', content: '## 剪辑发布\n\n快速剪辑并多平台分发。' }] }] } },
  { id: 4, category: 'shortvideo', categoryName: 'AI短视频', title: '【AI短视频】城市宣传片 AI 制作全流程复盘', subtitle: '用AI工具低成本制作城市宣传片', creator: { name: '周编剧', avatar: '周', followers: 1567, bio: '文旅视频创作者' }, thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '22:00', views: 4102, likes: 278, comments: 56, tags: ['城市宣传', '文旅', 'AI电影感'], createdAt: '2026-03-30', price: 19.9, isFree: false, freeVideoPercent: 40, freeChapters: 1, pointsPrice: 199, unlockPoints: 199, rating: 4.8, ratingCount: 112, tutorial: { totalChapters: 5, freeChapters: 1, chapters: [{ id: 1, title: '第一章：城市宣传片策划', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 策划阶段\n\n确定城市特色和展示重点。' }] }, { id: 2, title: '第二章：AI生成城市风光素材', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## AI素材生成\n\n用AI生成各种城市风光镜头。' }] }, { id: 3, title: '第三章：配乐与旁白设计', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 声音设计\n\n选择合适的背景音乐和旁白。' }] }, { id: 4, title: '第四章：电影感调色技巧', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 调色技巧\n\n达芬奇调色打造电影感。' }] }, { id: 5, title: '第五章：成片输出与投放', duration: '4分钟', isFree: false, steps: [{ type: 'text', content: '## 成片交付\n\n输出高质量成片并多平台投放。' }] }] } },
  { id: 5, category: 'shortdrama', categoryName: 'AI短剧', title: '【AI短剧】都市情感AI短剧《第101次心动》第一集', subtitle: '完整拆解AI生成都市情感短剧的全流程', creator: { name: '周编剧', avatar: '周', followers: 1567, bio: 'AI短剧编剧' }, thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '08:30', views: 8921, likes: 567, comments: 123, tags: ['都市情感', '短剧', '剧情'], createdAt: '2026-04-05', price: 0, isFree: true, freeVideoPercent: 100, freeChapters: 2, pointsPrice: 0, unlockPoints: 0, rating: 4.9, ratingCount: 234, tutorial: { totalChapters: 3, freeChapters: 2, chapters: [{ id: 1, title: '第一章：情感短剧剧本创作', duration: '4分钟', isFree: true, steps: [{ type: 'text', content: '## 剧本创作\n\n都市情感短剧的剧本结构设计。' }] }, { id: 2, title: '第二章：分镜设计与AI画面生成', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## AI画面生成\n\n分镜转化为AI生成的视频画面。' }] }, { id: 3, title: '第三章：配音与后期剪辑', duration: '4分钟', isFree: false, steps: [{ type: 'text', content: '## 后期制作\n\n完整的配音和剪辑流程。' }] }] } },
  { id: 6, category: 'shortdrama', categoryName: 'AI短剧', title: '【AI短剧】穿越悬疑AI短剧《时光旅人》制作揭秘', subtitle: '穿越题材AI短剧制作全解析', creator: { name: '赵导演', avatar: '赵', followers: 3200, bio: 'AI短剧导演' }, thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '12:45', views: 6789, likes: 423, comments: 89, tags: ['穿越悬疑', '角色一致', '技巧'], createdAt: '2026-04-03', price: 29.9, isFree: false, freeVideoPercent: 40, freeChapters: 1, pointsPrice: 299, unlockPoints: 299, rating: 4.8, ratingCount: 156, tutorial: { totalChapters: 4, freeChapters: 1, chapters: [{ id: 1, title: '第一章：穿越题材剧本设计', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 剧本设计\n\n穿越短剧的剧本结构与时间线设计。' }] }, { id: 2, title: '第二章：角色一致性处理技巧', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 角色一致性\n\nAI生成中保持角色外貌一致的方法。' }] }, { id: 3, title: '第三章：多年龄段角色生成', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 年龄变化\n\n同一角色不同年龄段的AI生成技巧。' }] }, { id: 4, title: '第四章：悬疑氛围营造与剪辑', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 悬疑剪辑\n\n营造悬疑氛围的后期剪辑技巧。' }] }] } },
  { id: 7, category: 'shortdrama', categoryName: 'AI短剧', title: '【AI短剧】霸总题材短剧5集连拍制作复盘', subtitle: '霸总题材AI短剧从剧本到成片的完整制作过程', creator: { name: '李掌门', avatar: '李', followers: 4500, bio: '短剧制作人' }, thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '45:00', views: 12450, likes: 892, comments: 234, tags: ['霸总', '系列', '批量制作'], createdAt: '2026-04-01', price: 49.9, isFree: false, freeVideoPercent: 30, freeChapters: 1, pointsPrice: 499, unlockPoints: 499, rating: 4.9, ratingCount: 345, tutorial: { totalChapters: 5, freeChapters: 1, chapters: [{ id: 1, title: '第一章：霸总短剧剧本公式', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## 剧本公式\n\n霸总短剧的经典剧本结构。' }] }, { id: 2, title: '第二章：5集连拍的分镜规划', duration: '8分钟', isFree: false, steps: [{ type: 'text', content: '## 分镜规划\n\n一次性生成多集内容的分镜技巧。' }] }, { id: 3, title: '第三章：批量AI画面生成', duration: '10分钟', isFree: false, steps: [{ type: 'text', content: '## 批量生成\n\n高效AI批量生成多集画面。' }] }, { id: 4, title: '第四章：多集剪辑管理', duration: '8分钟', isFree: false, steps: [{ type: 'text', content: '## 剪辑管理\n\nPremiere Pro多集项目管理。' }] }, { id: 5, title: '第五章：系列发布与运营', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 发布运营\n\n短剧系列的发布和运营策略。' }] }] } },
  { id: 8, category: 'mangadrama', categoryName: 'AI漫剧', title: '【AI漫剧】《星际猎人》动态漫画第一季全5集', subtitle: '科幻题材动态AI漫剧完整制作流程', creator: { name: '漫小七', avatar: '漫', followers: 2800, bio: 'AI漫画创作者' }, thumbnail: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '30:00', views: 5678, likes: 389, comments: 78, tags: ['科幻', '动态漫', 'Midjourney'], createdAt: '2026-04-04', price: 19.9, isFree: false, freeVideoPercent: 40, freeChapters: 1, pointsPrice: 199, unlockPoints: 199, rating: 4.7, ratingCount: 123, tutorial: { totalChapters: 4, freeChapters: 1, chapters: [{ id: 1, title: '第一章：科幻漫剧世界观设计', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 世界观设计\n\n科幻动态漫的世界观构建。' }] }, { id: 2, title: '第二章：Midjourney生成漫画分镜', duration: '8分钟', isFree: false, steps: [{ type: 'text', content: '## MJ分镜\n\n用Midjourney高效生成漫画分镜。' }] }, { id: 3, title: '第三章：角色Lora训练技巧', duration: '7分钟', isFree: false, steps: [{ type: 'text', content: '## Lora训练\n\n训练角色一致性Lora模型。' }] }, { id: 4, title: '第四章：剪映动态化处理', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 动态化\n\n剪映将静态漫画动态化。' }] }] } },
  { id: 9, category: 'mangadrama', categoryName: 'AI漫剧', title: '【AI漫剧】古风玄幻《九州录》制作全流程拆解', subtitle: '古风玄幻动态漫剧完整教程', creator: { name: '漫威老师', avatar: '威', followers: 3600, bio: '古风插画师' }, thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '25:30', views: 7891, likes: 521, comments: 112, tags: ['古风', '玄幻', 'Lora'], createdAt: '2026-04-01', price: 29.9, isFree: false, freeVideoPercent: 40, freeChapters: 1, pointsPrice: 299, unlockPoints: 299, rating: 4.8, ratingCount: 167, tutorial: { totalChapters: 5, freeChapters: 1, chapters: [{ id: 1, title: '第一章：古风角色设计', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 角色设计\n\n古风角色的设计要点。' }] }, { id: 2, title: '第二章：AI生成古风分镜', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## AI分镜\n\n古风漫画分镜的AI生成方法。' }] }, { id: 3, title: '第三章：Lora角色训练', duration: '7分钟', isFree: false, steps: [{ type: 'text', content: '## Lora训练\n\n古风角色一致性Lora训练。' }] }, { id: 4, title: '第四章：批量生成工作流', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 批量生产\n\n高效的古风漫剧批量生成。' }] }, { id: 5, title: '第五章：动态化与发布', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 动态发布\n\n动态漫画的后期和发布。' }] }] } },
  { id: 10, category: 'mangadrama', categoryName: 'AI漫剧', title: '【AI漫剧】少女漫画风格动态漫制作技巧分享', subtitle: '日系少女漫画风格动态漫剧AI制作', creator: { name: '漫总裁', avatar: '总', followers: 1890, bio: '少女漫达人' }, thumbnail: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '20:15', views: 4321, likes: 312, comments: 67, tags: ['少女漫', '日系', '风格'], createdAt: '2026-03-28', price: 0, isFree: true, freeVideoPercent: 100, freeChapters: 2, pointsPrice: 0, unlockPoints: 0, rating: 4.6, ratingCount: 89, tutorial: { totalChapters: 3, freeChapters: 2, chapters: [{ id: 1, title: '第一章：少女漫风格特点', duration: '4分钟', isFree: true, steps: [{ type: 'text', content: '## 风格特点\n\n日系少女漫画的风格特征。' }] }, { id: 2, title: '第二章：AI生成日系分镜', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## AI分镜\n\n用AI生成日系少女风分镜。' }] }, { id: 3, title: '第三章：动态化处理技巧', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 动态处理\n\n日系风格的动态化处理技巧。' }] }] } },
  { id: 11, category: 'film', categoryName: 'AI电影', title: '【AI电影】科幻短片《最后的人类》制作全解析', subtitle: '用AI工具制作院线级科幻短片', creator: { name: '李导演', avatar: '李', followers: 5200, bio: 'AI电影导演' }, thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '28:00', views: 15670, likes: 1234, comments: 345, tags: ['科幻', '电影级', '完整流程'], createdAt: '2026-04-06', price: 99.9, isFree: false, freeVideoPercent: 30, freeChapters: 1, pointsPrice: 999, unlockPoints: 999, rating: 5.0, ratingCount: 456, tutorial: { totalChapters: 6, freeChapters: 1, chapters: [{ id: 1, title: '第一章：科幻剧本创作', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## 剧本创作\n\n科幻短片的剧本结构设计。' }] }, { id: 2, title: '第二章：Midjourney生成概念图', duration: '8分钟', isFree: false, steps: [{ type: 'text', content: '## 概念图\n\n用Midjourney生成电影概念图。' }] }, { id: 3, title: '第三章：ComfyUI工作流搭建', duration: '10分钟', isFree: false, steps: [{ type: 'text', content: '## 工作流\n\nComfyUI电影级工作流搭建。' }] }, { id: 4, title: '第四章：达芬奇调色', duration: '8分钟', isFree: false, steps: [{ type: 'text', content: '## 调色\n\n达芬奇电影级调色技巧。' }] }, { id: 5, title: '第五章：音效与配乐', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 音效\n\n电影音效和配乐设计。' }] }, { id: 6, title: '第六章：成片输出标准', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 输出\n\n院线级成片输出标准。' }] }] } },
  { id: 12, category: 'film', categoryName: 'AI电影', title: '【AI电影】温情短片《父亲的AI情书》创作分享', subtitle: '感人至深的温情AI短片', creator: { name: '电影小白', avatar: '影', followers: 3400, bio: '温情短片创作者' }, thumbnail: 'https://images.unsplash.com/photo-1472718084807-1b1f7dc5bbb5?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '15:30', views: 8923, likes: 678, comments: 189, tags: ['温情', '情感', '新手入门'], createdAt: '2026-04-03', price: 0, isFree: true, freeVideoPercent: 100, freeChapters: 2, pointsPrice: 0, unlockPoints: 0, rating: 4.9, ratingCount: 234, tutorial: { totalChapters: 3, freeChapters: 2, chapters: [{ id: 1, title: '第一章：情感短片剧本', duration: '4分钟', isFree: true, steps: [{ type: 'text', content: '## 剧本\n\n温情短剧的剧本创作要点。' }] }, { id: 2, title: '第二章：AI生成情感画面', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## AI画面\n\n用AI表达细腻情感。' }] }, { id: 3, title: '第三章：剪辑与配乐', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 剪辑\n\n情感节奏的剪辑技巧。' }] }] } },
  { id: 13, category: 'film', categoryName: 'AI电影', title: '【AI电影】悬疑短片《消失的记忆》制作技术揭秘', subtitle: '高难度悬疑AI短片制作全解析', creator: { name: '张大师', avatar: '张', followers: 7800, bio: '悬疑片专家' }, thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '35:00', views: 11234, likes: 890, comments: 267, tags: ['悬疑', '特效', '高级技巧'], createdAt: '2026-04-01', price: 79.9, isFree: false, freeVideoPercent: 35, freeChapters: 1, pointsPrice: 799, unlockPoints: 799, rating: 4.9, ratingCount: 312, tutorial: { totalChapters: 5, freeChapters: 1, chapters: [{ id: 1, title: '第一章：悬疑剧本结构', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## 剧本\n\n悬疑短剧的多时间线叙事。' }] }, { id: 2, title: '第二章：角色变化AI处理', duration: '8分钟', isFree: false, steps: [{ type: 'text', content: '## 角色变化\n\n同一角色的不同状态生成。' }] }, { id: 3, title: '第三章：悬疑氛围营造', duration: '7分钟', isFree: false, steps: [{ type: 'text', content: '## 氛围\n\n悬疑氛围的光影和色调。' }] }, { id: 4, title: '第四章：AI特效合成', duration: '8分钟', isFree: false, steps: [{ type: 'text', content: '## 特效\n\n悬疑场景的AI特效合成。' }] }, { id: 5, title: '第五章：剪辑与结局设计', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 结局\n\n悬疑片结局的反转设计。' }] }] } },
  { id: 14, category: 'designer', categoryName: 'AI设计师', title: '【AI设计】科技公司Logo+全套VI设计案例', subtitle: '用Midjourney为科技创业公司设计Logo', creator: { name: '设计小美', avatar: '美', followers: 4500, bio: '品牌设计师' }, thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '22:00', views: 6789, likes: 456, comments: 98, tags: ['Logo设计', 'VI系统', '科技'], createdAt: '2026-04-05', price: 19.9, isFree: false, freeVideoPercent: 45, freeChapters: 1, pointsPrice: 199, unlockPoints: 199, rating: 4.8, ratingCount: 178, tutorial: { totalChapters: 4, freeChapters: 1, chapters: [{ id: 1, title: '第一章：品牌调研与定位', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 品牌调研\n\n科技公司的品牌定位分析。' }] }, { id: 2, title: '第二章：Midjourney生成Logo', duration: '7分钟', isFree: false, steps: [{ type: 'text', content: '## Logo设计\n\n用MJ生成科技感Logo。' }] }, { id: 3, title: '第三章：VI系统延展', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## VI延展\n\n完整的VI视觉系统设计。' }] }, { id: 4, title: '第四章：品牌手册输出', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 手册\n\n品牌手册的制作与交付。' }] }] } },
  { id: 15, category: 'designer', categoryName: 'AI设计师', title: '【AI设计】电商详情页批量生成工作流', subtitle: '用ComfyUI搭建自动化工作流', creator: { name: 'UI老王', avatar: '王', followers: 6100, bio: '电商设计专家' }, thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '18:00', views: 8901, likes: 567, comments: 134, tags: ['电商详情', '批量生成', 'ComfyUI'], createdAt: '2026-04-02', price: 29.9, isFree: false, freeVideoPercent: 40, freeChapters: 1, pointsPrice: 299, unlockPoints: 299, rating: 4.9, ratingCount: 234, tutorial: { totalChapters: 4, freeChapters: 1, chapters: [{ id: 1, title: '第一章：电商详情页结构', duration: '4分钟', isFree: true, steps: [{ type: 'text', content: '## 结构\n\n电商详情页的模块设计。' }] }, { id: 2, title: '第二章：ComfyUI工作流搭建', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 工作流\n\nComfyUI批量生成工作流。' }] }, { id: 3, title: '第三章：产品图批量生成', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 批量\n\n日产200+张高质量图片。' }] }, { id: 4, title: '第四章：质量控制与输出', duration: '4分钟', isFree: false, steps: [{ type: 'text', content: '## 输出\n\n质量控制与批量输出。' }] }] } },
  { id: 16, category: 'designer', categoryName: 'AI设计师', title: '【AI设计】App UI界面概念设计 AI 全流程', subtitle: 'AI辅助App UI概念设计', creator: { name: '设计总监', avatar: '总', followers: 8900, bio: 'UI设计总监' }, thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '25:30', views: 11230, likes: 723, comments: 178, tags: ['UI设计', 'App', '原型'], createdAt: '2026-03-30', price: 39.9, isFree: false, freeVideoPercent: 35, freeChapters: 1, pointsPrice: 399, unlockPoints: 399, rating: 4.9, ratingCount: 289, tutorial: { totalChapters: 5, freeChapters: 1, chapters: [{ id: 1, title: '第一章：用户研究与需求分析', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 用户研究\n\nApp设计的用户调研方法。' }] }, { id: 2, title: '第二章：信息架构设计', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 信息架构\n\nApp的信息结构设计。' }] }, { id: 3, title: '第三章：AI生成界面概念图', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## AI概念图\n\n用AI快速生成界面概念。' }] }, { id: 4, title: '第四章：高保真原型制作', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 原型\n\nFigma高保真原型制作。' }] }, { id: 5, title: '第五章：设计规范输出', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 规范\n\n完整设计规范的输出。' }] }] } },
  { id: 17, category: 'designer', categoryName: 'AI设计师', title: '【AI设计】产品包装设计 AI 全案制作', subtitle: '从产品外观到包装设计的AI全案制作', creator: { name: '设计小美', avatar: '美', followers: 4500, bio: '品牌设计师' }, thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '20:00', views: 5678, likes: 389, comments: 87, tags: ['包装设计', '产品', '全案'], createdAt: '2026-03-25', price: 0, isFree: true, freeVideoPercent: 100, freeChapters: 2, pointsPrice: 0, unlockPoints: 0, rating: 4.7, ratingCount: 123, tutorial: { totalChapters: 3, freeChapters: 2, chapters: [{ id: 1, title: '第一章：包装设计需求分析', duration: '4分钟', isFree: true, steps: [{ type: 'text', content: '## 需求分析\n\n包装设计的客户需求理解。' }] }, { id: 2, title: '第二章：AI生成包装设计', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## AI设计\n\n用AI生成包装设计稿。' }] }, { id: 3, title: '第三章：三维效果展示', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 3D效果\n\n包装的三维效果展示。' }] }] } },
  { id: 18, category: 'commerce', categoryName: 'AI带货变现', title: '【AI带货】美妆产品带货短视频 月销破万实操', subtitle: '用AI工具批量制作美妆带货视频', creator: { name: '带货达人', avatar: '达', followers: 12300, bio: '美妆带货专家' }, thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '16:00', views: 18900, likes: 1234, comments: 345, tags: ['美妆', '带货', '月销破万'], createdAt: '2026-04-06', price: 29.9, isFree: false, freeVideoPercent: 40, freeChapters: 1, pointsPrice: 299, unlockPoints: 299, rating: 4.9, ratingCount: 456, tutorial: { totalChapters: 4, freeChapters: 1, chapters: [{ id: 1, title: '第一章：美妆带货选品策略', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 选品\n\n美妆带货的选品技巧。' }] }, { id: 2, title: '第二章：AI生成产品展示素材', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## AI素材\n\n用AI生成高质量产品展示。' }] }, { id: 3, title: '第三章：带货脚本设计', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 脚本\n\n有效的带货脚本设计。' }] }, { id: 4, title: '第四章：批量生产与发布', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 发布\n\n批量生产与多平台发布。' }] }] } },
  { id: 19, category: 'commerce', categoryName: 'AI带货变现', title: '【AI带货】食品类短视频带货 AI制作全攻略', subtitle: '食品类带货视频如何用AI做出食欲感', creator: { name: '带货王', avatar: '王', followers: 9800, bio: '食品带货专家' }, thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '14:30', views: 15670, likes: 987, comments: 234, tags: ['食品', '食欲感', '选品'], createdAt: '2026-04-03', price: 19.9, isFree: false, freeVideoPercent: 45, freeChapters: 1, pointsPrice: 199, unlockPoints: 199, rating: 4.8, ratingCount: 312, tutorial: { totalChapters: 3, freeChapters: 1, chapters: [{ id: 1, title: '第一章：食品带货选品', duration: '4分钟', isFree: true, steps: [{ type: 'text', content: '## 选品\n\n食品带货的选品要点。' }] }, { id: 2, title: '第二章：AI生成食欲感素材', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 食欲感\n\n用AI生成让人食欲大增的素材。' }] }, { id: 3, title: '第三章：剪辑与发布策略', duration: '4分钟', isFree: false, steps: [{ type: 'text', content: '## 剪辑\n\n食品视频的剪辑技巧与发布。' }] }] } },
  { id: 20, category: 'commerce', categoryName: 'AI带货变现', title: '【AI带货】3C数码产品带货视频 AI制作复盘', subtitle: '高客单价3C数码产品如何用AI做出科技感带货视频', creator: { name: '带货总裁', avatar: '总', followers: 15600, bio: '数码带货达人' }, thumbnail: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '18:45', views: 12340, likes: 756, comments: 189, tags: ['3C数码', '高客单', '投放'], createdAt: '2026-04-01', price: 49.9, isFree: false, freeVideoPercent: 35, freeChapters: 1, pointsPrice: 499, unlockPoints: 499, rating: 4.9, ratingCount: 267, tutorial: { totalChapters: 4, freeChapters: 1, chapters: [{ id: 1, title: '第一章：3C产品卖点提炼', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 卖点\n\n3C数码产品的核心卖点。' }] }, { id: 2, title: '第二章：AI生成科技感素材', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 科技感\n\n用AI生成高科技感展示。' }] }, { id: 3, title: '第三章：高客单转化技巧', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 转化\n\n高客单产品的转化技巧。' }] }, { id: 4, title: '第四章：投放策略优化', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 投放\n\n付费投放的策略优化。' }] }] } },
  { id: 21, category: 'commerce', categoryName: 'AI带货变现', title: '【AI带货】服装穿搭带货 账号从0到月入过万', subtitle: 'AI工具辅助服装带货账号全流程', creator: { name: '带货达人', avatar: '达', followers: 12300, bio: '服装带货专家' }, thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1280&h=720&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '22:00', views: 20150, likes: 1567, comments: 412, tags: ['服装', '穿搭', '月入过万'], createdAt: '2026-03-28', price: 39.9, isFree: false, freeVideoPercent: 35, freeChapters: 1, pointsPrice: 399, unlockPoints: 399, rating: 5.0, ratingCount: 534, tutorial: { totalChapters: 5, freeChapters: 1, chapters: [{ id: 1, title: '第一章：服装账号定位', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 定位\n\n服装带货账号的定位策略。' }] }, { id: 2, title: '第二章：AI生成穿搭展示', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## AI穿搭\n\n用AI生成多样化的穿搭展示。' }] }, { id: 3, title: '第三章：选品与供应链', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 选品\n\n服装选品与供应链管理。' }] }, { id: 4, title: '第四章：账号运营与涨粉', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 运营\n\n账号运营与粉丝增长。' }] }, { id: 5, title: '第五章：月入过万实战复盘', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 复盘\n\n月入过万的完整复盘。' }] }] } }
];
// 备用案例数据（默认）
const defaultCases = [
  {
    id: 1,
    title: 'AI短视频爆款制作全流程拆解',
    subtitle: '从零到一：用即梦+剪映制作一条100万播放的AI短视频',
    creator: { name: '李设计师', avatar: '李', followers: 12300, bio: '资深AI创作者' },
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1280&h=720&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '18:30',
    views: 12560,
    likes: 890,
    tags: ['AI视频', '即梦', '短视频', '爆款'],
    category: 'shortvideo',
    createdAt: '2026-04-05',
    unlockPoints: 200,
    pointsPrice: 200,
    price: 0,
    isFree: false,
    freeVideoPercent: 80,
    freeChapters: 2,
    rating: 4.9,
    ratingCount: 289,
    tutorial: {
      totalChapters: 6,
      freeChapters: 2,
      chapters: [
        { id: 1, title: '第一章：选题与策划', duration: '3分钟', isFree: true, steps: [{ type: 'text', content: '## 🎯 爆款短视频的选题逻辑\n\n一条好的AI短视频，选题决定了60%的成败。' }] },
        { id: 2, title: '第二章：脚本撰写与分镜设计', duration: '4分钟', isFree: true, steps: [{ type: 'text', content: '## 📝 AI短视频脚本公式\n\n爆款短视频的脚本结构非常固定。' }] },
        { id: 3, title: '第三章：即梦AI视频生成实战', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 🎬 即梦AI实战操作\n\n这是整个流程中最核心的部分。' }] },
        { id: 4, title: '第四章：剪映剪辑与调色', duration: '4分钟', isFree: false, steps: [{ type: 'text', content: '## ✂️ 剪映剪辑完整工作流' }] },
        { id: 5, title: '第五章：AI配音与音效', duration: '3分钟', isFree: false, steps: [{ type: 'text', content: '## 🎵 AI配音完整方案' }] },
        { id: 6, title: '第六章：发布策略与数据复盘', duration: '2分钟', isFree: false, steps: [{ type: 'text', content: '## 📊 发布策略与增长复盘' }] }
      ]
    }
  },
  {
    id: 2,
    title: '科技公司品牌视觉升级',
    subtitle: '从零到一完成科技公司品牌VI设计',
    creator: { name: '林艺涵', avatar: '林', followers: 8900, bio: '资深品牌设计师' },
    thumbnail: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=1280&h=720&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '25:00',
    views: 8920,
    likes: 567,
    tags: ['品牌', 'VI设计', '科技感'],
    category: 'designer',
    createdAt: '2026-04-03',
    unlockPoints: 99,
    pointsPrice: 99,
    price: 99,
    isFree: false,
    freeVideoPercent: 50,
    freeChapters: 1,
    rating: 4.8,
    ratingCount: 156,
    tutorial: {
      totalChapters: 5,
      freeChapters: 1,
      chapters: [
        { id: 1, title: '第一章：品牌调研与分析', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 品牌调研基础' }] },
        { id: 2, title: '第二章：Logo设计思路', duration: '8分钟', isFree: false, steps: [{ type: 'text', content: '## Logo设计核心' }] },
        { id: 3, title: '第三章：色彩体系构建', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 品牌色彩设计' }] },
        { id: 4, title: '第四章：字体与排版', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 品牌字体设计' }] },
        { id: 5, title: '第五章：VI手册输出', duration: '7分钟', isFree: false, steps: [{ type: 'text', content: '## VI手册制作' }] }
      ]
    }
  },
  {
    id: 3,
    title: '国潮风格插画系列',
    subtitle: '用AI工具快速生成国潮风格插画',
    creator: { name: '李思琪', avatar: '李', followers: 15600, bio: '国潮插画师' },
    thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1280&h=720&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '20:00',
    views: 15600,
    likes: 1234,
    tags: ['国潮', '插画', '传统文化'],
    category: 'mangadrama',
    createdAt: '2026-04-02',
    unlockPoints: 79,
    pointsPrice: 79,
    price: 79,
    isFree: false,
    freeVideoPercent: 60,
    freeChapters: 1,
    rating: 4.9,
    ratingCount: 234,
    tutorial: {
      totalChapters: 4,
      freeChapters: 1,
      chapters: [
        { id: 1, title: '第一章：国潮风格认知', duration: '4分钟', isFree: true, steps: [{ type: 'text', content: '## 国潮风格特点' }] },
        { id: 2, title: '第二章：AI生成国潮插画', duration: '7分钟', isFree: false, steps: [{ type: 'text', content: '## Midjourney国潮提示词' }] },
        { id: 3, title: '第三章：细节优化技巧', duration: '5分钟', isFree: false, steps: [{ type: 'text', content: '## 后期调整' }] },
        { id: 4, title: '第四章：系列化产出', duration: '6分钟', isFree: false, steps: [{ type: 'text', content: '## 建立素材库' }] }
      ]
    }
  },
  {
    id: 4,
    title: '智能家居APP界面设计',
    subtitle: '从需求分析到高保真原型',
    creator: { name: '王雨晨', avatar: '王', followers: 5600, bio: '资深UI设计师' },
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1280&h=720&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    freeVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '30:00',
    views: 6780,
    likes: 423,
    tags: ['APP', 'UI', '智能家居'],
    category: 'designer',
    createdAt: '2026-04-01',
    unlockPoints: 0,
    pointsPrice: 0,
    price: 0,
    isFree: true,
    freeVideoPercent: 100,
    freeChapters: 5,
    rating: 4.7,
    ratingCount: 89,
    tutorial: {
      totalChapters: 5,
      freeChapters: 5,
      chapters: [
        { id: 1, title: '第一章：需求分析', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## 需求收集' }] },
        { id: 2, title: '第二章：信息架构', duration: '5分钟', isFree: true, steps: [{ type: 'text', content: '## 功能模块划分' }] },
        { id: 3, title: '第三章：界面设计', duration: '8分钟', isFree: true, steps: [{ type: 'text', content: '## 设计规范制定' }] },
        { id: 4, title: '第四章：交互设计', duration: '6分钟', isFree: true, steps: [{ type: 'text', content: '## 交互流程优化' }] },
        { id: 5, title: '第五章：高保真原型', duration: '7分钟', isFree: true, steps: [{ type: 'text', content: '## 原型制作' }] }
      ]
    }
  }
];
// 合并所有案例数据：创作者发布 > 培训案例 > 默认案例
const allCases = [...loadPublishedCases(), ...trainingCases, ...defaultCases];
// ==================== 视频播放器组件 ====================
function VideoPlayer({ videoUrl, thumbnail, freeVideoUrl, isUnlocked, onUnlockNeeded, freeVideoPercent = 80, unlockPoints = 99 }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimer = useRef(null);
  const currentVideoUrl = isUnlocked ? videoUrl : freeVideoUrl;
  const freeLimit = isUnlocked ? 100 : freeVideoPercent;
  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  const handlePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); } else { v.play(); }
    setIsPlaying(!isPlaying);
  };
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    // 免费视频播放到 freeLimit 时，弹出解锁提示
    if (!isUnlocked && v.duration && v.currentTime / v.duration > freeLimit / 100) {
      v.pause();
      setIsPlaying(false);
      onUnlockNeeded && onUnlockNeeded();
    }
  };
  const handleProgressClick = (e) => {
    const v = videoRef.current;
    if (!v || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    // 免费模式不允许拖到 freeLimit 以后
    if (!isUnlocked && ratio > freeLimit / 100) {
      onUnlockNeeded && onUnlockNeeded();
      return;
    }
    v.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };
  const handleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      v.requestFullscreen?.();
    }
  };
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  return (
    <div className="td-video-wrap" onMouseMove={handleMouseMove} onMouseLeave={() => setShowControls(false)}>
      {currentVideoUrl ? (
        <video
          ref={videoRef}
          src={currentVideoUrl}
          poster={thumbnail}
          className="td-video-el"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          muted={isMuted}
          playsInline
        />
      ) : (
        <div className="td-video-placeholder">
          <img src={thumbnail} alt="封面" />
        </div>
      )}
      {/* 控制栏 */}
      <div className={`td-controls ${showControls || !isPlaying ? 'visible' : ''}`}>
        <div className="td-progress-wrap">
          <div ref={progressRef} className="td-progress-bar" onClick={handleProgressClick}>
            {!isUnlocked && <div className="td-free-zone" style={{ width: `${freeLimit}%` }}></div>}
            <div className="td-progress-played" style={{ width: `${progressPercent}%` }}></div>
            <div className="td-progress-thumb" style={{ left: `${progressPercent}%` }}></div>
            {!isUnlocked && (
              <div className="td-lock-line" style={{ left: `${freeLimit}%` }}>
                <Lock size={10} />
              </div>
            )}
          </div>
          <div className="td-time-row">
            <span className="td-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
            {!isUnlocked && <span className="td-free-tip">前{freeLimit}%免费 · 解锁看全部</span>}
          </div>
        </div>
        <div className="td-ctrl-row">
          <button className="td-ctrl-btn" onClick={handlePlayPause}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className="td-ctrl-btn" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="td-ctrl-spacer"></div>
          {!isUnlocked && (
            <button className="td-unlock-ctrl-btn" onClick={() => onUnlockNeeded && onUnlockNeeded()}>
              <Lock size={14} /> 解锁完整视频
            </button>
          )}
          <button className="td-ctrl-btn" onClick={handleFullscreen}>
            <Maximize size={18} />
          </button>
        </div>
      </div>
      {/* 点击播放/暂停 */}
      <div className="td-click-area" onClick={handlePlayPause}></div>
      {/* 解锁遮罩 */}
      {!isUnlocked && progressPercent >= freeLimit - 0.5 && !isPlaying && (
        <div className="td-unlock-mask">
          <div className="td-unlock-content">
            <Lock size={32} className="td-lock-icon" />
            <h3>后续内容已锁定</h3>
            <p>解锁完整视频，继续观看剩余 {100 - freeLimit}% 精华内容</p>
            <button className="td-unlock-big-btn" onClick={() => onUnlockNeeded && onUnlockNeeded()}>
              <Zap size={18} /> {unlockPoints}积分 解锁完整版
            </button>
            <span className="td-or">或</span>
            <button className="td-vip-btn" onClick={() => onUnlockNeeded && onUnlockNeeded()}>
              开通VIP · 无限解锁全部内容
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
// ==================== 解锁弹窗 ====================
function UnlockModal({ caseData, onClose, onUnlocked, navigate }) {
  const [userPoints, setUserPoints] = useState(() => {
    return parseInt(localStorage.getItem('userPoints') || '350');
  });
  const [unlocking, setUnlocking] = useState(false);
  const [method, setMethod] = useState('buy');
  const [toast, setToast] = useState(null);
  const actualPoints = caseData.pointsPrice || caseData.unlockPoints || 99;
  const actualPrice = caseData.price || 0;
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const handleUnlock = () => {
    if (method === 'points' && userPoints < actualPoints) return;
    
    setUnlocking(true);
    
    setTimeout(() => {
      if (method === 'points') {
        const newPoints = userPoints - actualPoints;
        setUserPoints(newPoints);
        localStorage.setItem('userPoints', newPoints.toString());
      }
      
      const purchaseKey = `caseUnlocked_${caseData.id}`;
      const purchases = JSON.parse(localStorage.getItem('casePurchases') || '[]');
      if (!purchases.includes(caseData.id)) {
        purchases.push(caseData.id);
        localStorage.setItem('casePurchases', JSON.stringify(purchases));
      }
      localStorage.setItem(purchaseKey, 'true');
      
      setUnlocking(false);
      showToast('🎉 购买成功！开始学习吧');
      onUnlocked();
      onClose();
    }, 2000);
  };
  const handleOpenVip = () => {
    showToast('正在跳转到VIP开通页面...');
    setTimeout(() => {
      onClose();
    }, 500);
  };
  const canAfford = userPoints >= actualPoints;
  return (
    <>
      {toast && (
        <div className="td-toast" style={{
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
      <div className="td-unlock-modal-bg" onClick={onClose}>
        <div className="td-unlock-modal-box" onClick={e => e.stopPropagation()}>
          <button className="td-unlock-close-btn" onClick={onClose}><X size={20} /></button>
          <div className="td-unlock-header">
            <div className="td-unlock-lock-icon">
              <Lock size={28} />
            </div>
            <h2>解锁完整内容</h2>
            <p>解锁后可观看完整视频 + 全部{caseData.tutorial?.totalChapters || 6}章图文教程</p>
          </div>
          <div className="td-unlock-methods">
            {actualPrice > 0 && (
              <div className={`td-unlock-method-card ${method === 'buy' ? 'active' : ''}`} onClick={() => setMethod('buy')}>
                <div className="td-unlock-method-top">
                  <BookOpen size={20} className="td-unlock-method-icon" />
                  <span className="td-unlock-method-name">单独购买</span>
                  {method === 'buy' && <CheckCircle size={16} className="td-unlock-check" />}
                  <span className="td-unlock-hot-badge">最划算</span>
                </div>
                <div className="td-unlock-method-detail">
                  <span className="td-unlock-buy-price">¥{actualPrice}</span>
                  <span className="td-unlock-buy-desc">永久解锁本案例</span>
                </div>
              </div>
            )}
            <div className={`td-unlock-method-card ${method === 'points' ? 'active' : ''}`} onClick={() => setMethod('points')}>
              <div className="td-unlock-method-top">
                <Zap size={20} className="td-unlock-method-icon" />
                <span className="td-unlock-method-name">积分解锁</span>
                {method === 'points' && <CheckCircle size={16} className="td-unlock-check" />}
              </div>
              <div className="td-unlock-method-detail">
                <span className="td-unlock-points-needed">{actualPoints} 积分</span>
                <span className="td-unlock-my-points">我的积分：<strong className={canAfford ? 'enough' : 'notEnough'}>{userPoints}</strong></span>
              </div>
              {!canAfford && method === 'points' && (
                <div className="td-unlock-lack-tip">
                  <AlertCircle size={14} /> 积分不足，还需 {actualPoints - userPoints} 积分
                  <button className="td-unlock-buy-points-btn" onClick={() => navigate('/user/points')}>
                    充值积分 →
                  </button>
                </div>
              )}
            </div>
            <div className={`td-unlock-method-card vip-card ${method === 'vip' ? 'active' : ''}`} onClick={() => setMethod('vip')}>
              <div className="td-unlock-method-top">
                <Award size={20} className="td-unlock-method-icon vip" />
                <span className="td-unlock-method-name">VIP会员</span>
                {method === 'vip' && <CheckCircle size={16} className="td-unlock-check" />}
              </div>
              <div className="td-unlock-method-detail">
                <span className="td-unlock-vip-price">¥29/月</span>
                <span className="td-unlock-vip-benefit">无限解锁所有内容</span>
              </div>
            </div>
          </div>
          <button
            className={`td-unlock-confirm-btn ${unlocking ? 'loading' : ''} ${method === 'points' && !canAfford ? 'disabled' : ''}`}
            onClick={method === 'vip' ? handleOpenVip : handleUnlock}
            disabled={unlocking || (method === 'points' && !canAfford)}
          >
            {unlocking ? (
              <span className="td-unlock-loading-text">
                <span className="td-spinner"></span> 支付中...
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
          <p className="td-unlock-guarantee">
            <CheckCircle size={14} /> 解锁后永久有效 · 支持退款（7天内）
          </p>
        </div>
      </div>
    </>
  );
}
// ==================== 步骤渲染组件 ====================
function TutorialStep({ step }) {
  if (step.type === 'text') {
    return (
      <div className="td-step-text">
        {step.content.split('\n').map((line, i) => {
          if (line.startsWith('## ')) return <h2 key={i} className="td-h2">{line.replace('## ', '')}</h2>;
          if (line.startsWith('### ')) return <h3 key={i} className="td-h3">{line.replace('### ', '')}</h3>;
          if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={i} className="td-bold">{line.replace(/\*\*/g, '')}</p>;
          }
          if (line.startsWith('```') || line === '```') return null;
          if (line.startsWith('- ')) return <li key={i} className="td-li">{line.replace('- ', '')}</li>;
          if (line.trim() === '') return <div key={i} className="td-spacer"></div>;
          return <p key={i} className="td-p">{line}</p>;
        })}
      </div>
    );
  }
  if (step.type === 'image') {
    return (
      <div className="td-step-image">
        <img src={step.src} alt={step.caption} loading="lazy" />
        <p className="td-img-caption">{step.caption}</p>
      </div>
    );
  }
  if (step.type === 'tip') {
    return (
      <div className="td-step-tip">
        <div className="td-tip-header">
          <span className="td-tip-icon">{step.icon}</span>
          <span className="td-tip-title">{step.title}</span>
        </div>
        <p className="td-tip-content">{step.content}</p>
      </div>
    );
  }
  return null;
}
// ==================== 主组件 ====================
export default function TutorialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromState = location.state?.from || 'training';
  
  // 加载案例数据
  const caseData = allCases.find(c => c.id === parseInt(id)) || allCases[0];
  
  // 从localStorage加载购买状态
  const [isUnlocked, setIsUnlocked] = useState(() => {
    const purchaseKey = `caseUnlocked_${caseData?.id}`;
    return localStorage.getItem(purchaseKey) === 'true';
  });
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(caseData?.likes || 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareTip, setShowShareTip] = useState(false);
  // 获取免费章节数
  const freeChapters = caseData?.freeChapters || caseData?.tutorial?.freeChapters || 1;
  const freeVideoPercent = caseData?.freeVideoPercent || 80;
  const unlockPoints = caseData?.pointsPrice || caseData?.unlockPoints || 99;
  const price = caseData?.price || 0;
  // 当前章节是否免费
  const isChapterFree = activeChapter < freeChapters;
  const handleChapterClick = (index) => {
    if (index >= freeChapters && !isUnlocked) {
      setShowUnlockModal(true);
      return;
    }
    setActiveChapter(index);
  };
  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => {
      setShowShareTip(true);
      setTimeout(() => setShowShareTip(false), 2500);
    });
  };
  if (!caseData) {
    return (
      <div className="td-page">
        <div className="td-loading">加载中...</div>
      </div>
    );
  }
  return (
    <div className="td-page">
      {/* 顶部导航 */}
      <div className="td-nav">
        <button className="td-back-btn" onClick={() => {
          if (fromState === 'cases') {
            navigate('/training', { state: { scrollTo: 'cases' } });
          } else {
            navigate('/training');
          }
        }}>
          <ArrowLeft size={18} /> {fromState === 'cases' ? '返回案例拆解' : '返回培训孵化'}
        </button>
        <div className="td-nav-breadcrumb">
          <Link to="/training">培训孵化</Link>
          <ChevronRight size={14} />
          <span>案例详情</span>
          <ChevronRight size={14} />
          <span className="td-nav-current">{caseData.title}</span>
        </div>
      </div>
      <div className="td-main">
        {/* 左侧主内容 */}
        <div className="td-content-left">
          {/* 视频播放器 */}
          <VideoPlayer
            videoUrl={caseData.videoUrl}
            freeVideoUrl={caseData.freeVideoUrl}
            thumbnail={caseData.thumbnail}
            isUnlocked={isUnlocked}
            onUnlockNeeded={() => setShowUnlockModal(true)}
            freeVideoPercent={freeVideoPercent}
            unlockPoints={unlockPoints}
          />
          {/* 视频标题区 */}
          <div className="td-video-info">
            <div className="td-video-top">
              <h1 className="td-title">{caseData.title}</h1>
              <p className="td-subtitle">{caseData.subtitle}</p>
            </div>
            <div className="td-action-bar">
              <div className="td-action-left">
                <div className="td-meta-item"><Eye size={15} /> {caseData.views?.toLocaleString() || 0} 播放</div>
                <div className="td-meta-item"><Clock size={15} /> {caseData.duration}</div>
                <div className="td-meta-item"><Star size={15} className="star" /> {caseData.rating || 4.8} ({caseData.ratingCount || 0}条评价)</div>
              </div>
              <div className="td-action-btns">
                <button className={`td-act-btn ${liked ? 'active' : ''}`} onClick={handleLike}>
                  <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
                  <span>{likeCount}</span>
                </button>
                <button className={`td-act-btn ${bookmarked ? 'active' : ''}`} onClick={() => setBookmarked(!bookmarked)}>
                  <Bookmark size={17} fill={bookmarked ? 'currentColor' : 'none'} />
                  <span>{bookmarked ? '已收藏' : '收藏'}</span>
                </button>
                <button className="td-act-btn" onClick={handleShare}>
                  <Share2 size={17} />
                  <span>分享</span>
                  {showShareTip && <span className="td-share-tip">链接已复制！</span>}
                </button>
              </div>
            </div>
            <div className="td-tags">
              {caseData.tags?.map((t, i) => (
                <span key={i} className="td-tag">#{t}</span>
              ))}
              {!isUnlocked && price > 0 && (
                <span className="td-lock-badge"><Lock size={11} /> 需解锁</span>
              )}
              {isUnlocked && (
                <span className="td-unlocked-badge"><Unlock size={11} /> 已解锁</span>
              )}
            </div>
          </div>
          {/* 图文教程区 */}
          <div className="td-tutorial-section">
            <div className="td-tutorial-header">
              <h2 className="td-tutorial-title">
                <BookOpen size={20} /> 图文拆解教程
              </h2>
              {!isUnlocked && caseData.tutorial?.chapters?.length > 0 && (
                <div className="td-tutorial-lock-info">
                  <Lock size={14} />
                  <span>前 {freeChapters} 章免费 · 后续需解锁</span>
                  <button className="td-quick-unlock-btn" onClick={() => setShowUnlockModal(true)}>
                    <Zap size={13} /> {unlockPoints}积分解锁
                  </button>
                </div>
              )}
            </div>
            {!caseData.tutorial?.chapters?.length ? (
              <div className="td-tutorial-empty">
                <div className="td-empty-icon">📚</div>
                <h3>教程内容待更新</h3>
                <p>创作者正在准备详细的图文教程，敬请期待...</p>
              </div>
            ) : (
              <div className="td-tutorial-layout">
                {/* 章节目录 */}
                <div className="td-chapters-nav">
                  <div className="td-chapters-header">章节目录</div>
                  {caseData.tutorial.chapters.map((chapter, index) => {
                    const isFree = index < freeChapters;
                    const isActive = activeChapter === index;
                    const isAccessible = isFree || isUnlocked;
                    return (
                      <div
                        key={chapter.id}
                        className={`td-chapter-item ${isActive ? 'active' : ''} ${!isAccessible ? 'locked' : ''}`}
                        onClick={() => handleChapterClick(index)}
                      >
                        <div className="td-chapter-left">
                          <div className={`td-chapter-icon ${!isAccessible ? 'lock-icon' : isActive ? 'active-icon' : ''}`}>
                            {!isAccessible ? <Lock size={12} /> : isActive ? <Play size={12} /> : <CheckCircle size={12} />}
                          </div>
                          <div>
                            <div className="td-chapter-name">{chapter.title}</div>
                            <div className="td-chapter-meta">
                              <Clock size={11} /> {chapter.duration}
                            </div>
                          </div>
                        </div>
                        {isFree ? (
                          <span className="td-free-chapter-badge">免费</span>
                        ) : !isUnlocked ? (
                          <span className="td-lock-chapter-badge"><Lock size={10} /></span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                {/* 章节内容 */}
                <div className="td-chapter-content">
                  <div className="td-chapter-title-bar">
                    <h3 className="td-chapter-h3">{caseData.tutorial.chapters[activeChapter]?.title}</h3>
                    <div className="td-chapter-nav-btns">
                      <button
                        className="td-chapter-nav-btn"
                        disabled={activeChapter === 0}
                        onClick={() => setActiveChapter(prev => Math.max(0, prev - 1))}
                      >
                        <ChevronLeft size={16} /> 上一章
                      </button>
                      <button
                        className="td-chapter-nav-btn"
                        disabled={activeChapter === caseData.tutorial.chapters.length - 1}
                        onClick={() => {
                          const nextIdx = activeChapter + 1;
                          if (nextIdx >= freeChapters && !isUnlocked) {
                            setShowUnlockModal(true);
                            return;
                          }
                          setActiveChapter(nextIdx);
                        }}
                      >
                        下一章 <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  {/* 锁定内容预览 */}
                  {!isChapterFree && !isUnlocked ? (
                    <div className="td-chapter-locked">
                      <div className="td-chapter-lock-icon"><Lock size={36} /></div>
                      <h3>本章内容已锁定</h3>
                      <p>解锁后即可查看完整图文教程，包括实操截图、关键词参数和完整流程。</p>
                      <div className="td-lock-preview">
                        {caseData.tutorial.chapters[activeChapter]?.steps?.slice(0, 1).map((step, i) => (
                          <div key={i} className="td-locked-preview-item">
                            <div className="td-locked-blur">
                              <TutorialStep step={step} />
                            </div>
                            <div className="td-blur-overlay"></div>
                          </div>
                        ))}
                      </div>
                      <button className="td-chapter-unlock-btn" onClick={() => setShowUnlockModal(true)}>
                        <Zap size={16} /> 消耗 {unlockPoints} 积分 · 解锁全部章节
                      </button>
                      <span className="td-or-text">或</span>
                      <button className="td-vip-unlock-btn" onClick={() => setShowUnlockModal(true)}>
                        开通VIP会员，无限解锁
                      </button>
                    </div>
                  ) : (
                    <div className="td-chapter-steps">
                      {caseData.tutorial.chapters[activeChapter]?.steps?.map((step, i) => (
                        <TutorialStep key={i} step={step} />
                      ))}
                      <div className="td-chapter-done">
                        <CheckCircle size={18} />
                        <span>本章完成 · </span>
                        {activeChapter < caseData.tutorial.chapters.length - 1 ? (
                          <button onClick={() => {
                            const nextIdx = activeChapter + 1;
                            if (nextIdx >= freeChapters && !isUnlocked) {
                              setShowUnlockModal(true);
                              return;
                            }
                            setActiveChapter(nextIdx);
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
        </div>
        {/* 右侧边栏 */}
        <div className="td-sidebar">
          {/* 作者信息 */}
          <div className="td-author-card">
            <div className="td-author-top">
              <div className="td-author-avatar">{caseData.creator?.avatar || '创'}</div>
              <div className="td-author-info">
                <div className="td-author-name">{caseData.creator?.name || '创作者'}</div>
                <div className="td-author-bio">{caseData.creator?.bio || ''}</div>
                <div className="td-author-follow-count">
                  <Users size={13} /> {caseData.creator?.followers?.toLocaleString() || 0} 关注者
                </div>
              </div>
            </div>
            <button className="td-follow-btn">+ 关注创作者</button>
          </div>
          {/* 解锁卡片 */}
          {!isUnlocked && (
            <div className="td-unlock-card">
              <div className="td-unlock-card-header">
                <Lock size={18} />
                <span>解锁完整内容</span>
              </div>
              <ul className="td-unlock-benefits">
                <li><CheckCircle size={14} /> 完整视频（前{freeVideoPercent}%→100%）</li>
                <li><CheckCircle size={14} /> 全部{caseData.tutorial?.totalChapters || 6}章图文教程</li>
                <li><CheckCircle size={14} /> 实操截图 & 参数清单</li>
                <li><CheckCircle size={14} /> 永久查看，随时复习</li>
              </ul>
              <button className="td-unlock-card-btn" onClick={() => setShowUnlockModal(true)}>
                <Zap size={16} /> {unlockPoints} 积分解锁
              </button>
              <div className="td-unlock-or">或</div>
              <button className="td-vip-card-btn" onClick={() => setShowUnlockModal(true)}>
                <Award size={15} /> 开通VIP · 无限解锁
              </button>
              <p className="td-unlock-card-tip">已有 {caseData.views?.toLocaleString() || 0} 人学习过这个案例</p>
            </div>
          )}
          {/* 已解锁状态 */}
          {isUnlocked && (
            <div className="td-unlocked-card">
              <div className="td-unlocked-icon">
                <Unlock size={24} />
              </div>
              <h4>内容已解锁</h4>
              <p>你已解锁全部视频和图文教程，尽情学习吧！</p>
              <div className="td-progress-info">
                <span>章节进度</span>
                <span>{activeChapter + 1} / {caseData.tutorial?.totalChapters || 6}</span>
              </div>
              <div className="td-progress-track">
                <div
                  className="td-progress-fill"
                  style={{ width: `${((activeChapter + 1) / (caseData.tutorial?.totalChapters || 6)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          {/* 相关案例 */}
          <div className="td-related-section">
            <h4 className="td-related-title">相关案例推荐</h4>
            {allCases.filter(c => c.id !== caseData.id).slice(0, 3).map(related => (
              <div
                key={related.id}
                className="td-related-card"
                onClick={() => navigate(`/tutorial/${related.id}`)}
              >
                <div className="td-related-thumb">
                  <img src={related.thumbnail} alt={related.title} />
                  {!related.isFree && <Lock size={11} className="td-related-lock" />}
                </div>
                <div className="td-related-info">
                  <div className="td-related-title-text">{related.title}</div>
                  <div className="td-related-meta">
                    <Eye size={11} /> {related.views?.toLocaleString() || 0}
                    {!related.isFree && <span className="td-related-points"><Zap size={11} />{related.unlockPoints || 99}积分</span>}
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
            setIsUnlocked(true);
            setActiveChapter(0);
          }}
        />
      )}
    </div>
  );
}
