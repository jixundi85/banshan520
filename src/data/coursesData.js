// coursesData.js 已迁移至 unifiedCourses.js 作为唯一数据源
// 此文件保留用于向后兼容，所有课程数据已合并到 unifiedCourses
import { allCourses } from './unifiedCourses'

export const courses = allCourses

export const categoryMap = {
  video: 'AI视频',
  film: 'AI广告电影',
  designer: 'AI设计师',
  drama: 'AI短剧',
  travel: 'AI文旅',
  mangadrama: 'AI漫剧',
  commerce: 'AI带货变现',
  strategy: '战略咨询',
  listing: '上市咨询',
  financing: '融资咨询',
  equity: '股权架构咨询',
  overseas: '战略出海',
  'ai-upgrade': 'AI升级转型',
  deployment: '私有化部署',
}

export default courses
