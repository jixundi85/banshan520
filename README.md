# 微信小程序页面结构

## 项目概述
AIGC内容供需平台微信小程序，为用户提供移动端服务。

## 页面结构

### 页面列表

1. **首页 (pages/index/index)**
   - 快捷入口（课程、需求、创作者、社区）
   - Banner轮播
   - 热门课程推荐
   - 认证创作者展示
   - 最新需求列表

2. **课程页 (pages/course/index)**
   - 课程分类
   - 课程列表
   - 课程筛选
   - 课程详情

3. **需求广场 (pages/demand/index)**
   - 需求列表
   - 发布需求
   - 需求详情
   - 提案管理

4. **社区 (pages/community/index)**
   - 帖子列表
   - 发布帖子
   - 帖子详情
   - 评论互动

5. **创作者 (pages/creator/index)**
   - 创作者列表
   - 创作者主页
   - 作品展示

6. **个人中心 (pages/user/index)**
   - 个人资料
   - 学习进度
   - 我的订单
   - 我的收藏
   - 创作者中心
   - 设置

7. **登录/注册 (pages/auth/index)**
   - 手机号登录
   - 微信授权登录
   - 用户注册

## 技术栈
- 微信小程序原生开发
- TDesign 组件库
- Vant Weapp UI

## 开发命令

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 预览项目
npm run dev

# 上传代码
npm run upload
```

## 目录结构

```
├── miniprogram/
│   ├── pages/
│   │   ├── index/          # 首页
│   │   ├── course/         # 课程
│   │   ├── demand/         # 需求
│   │   ├── community/      # 社区
│   │   ├── creator/        # 创作者
│   │   ├── user/           # 个人中心
│   │   └── auth/           # 登录注册
│   ├── components/         # 组件
│   ├── utils/              # 工具函数
│   ├── api/                # API接口
│   ├── styles/             # 样式文件
│   └── app.js              # 应用入口
├── project.config.json     # 项目配置
└── package.json
```

## API接口

### 认证模块
- POST /api/auth/login - 用户登录
- POST /api/auth/register - 用户注册
- GET /api/auth/me - 获取当前用户信息

### 课程模块
- GET /api/courses - 获取课程列表
- GET /api/courses/:id - 获取课程详情

### 创作者模块
- GET /api/creators - 获取创作者列表
- GET /api/creators/:id - 获取创作者详情

### 需求模块
- GET /api/demands - 获取需求列表
- POST /api/demands - 发布需求

### 社区模块
- GET /api/posts - 获取帖子列表
- POST /api/posts - 发布帖子

### 数据模块
- GET /api/stats - 获取统计数据

## 配置说明

### app.json
```json
{
  "pages": [
    "pages/index/index",
    "pages/course/index",
    "pages/demand/index",
    "pages/community/index",
    "pages/creator/index",
    "pages/user/index",
    "pages/auth/index"
  ],
  "window": {
    "navigationBarBackgroundColor": "#0f172a",
    "navigationBarTextStyle": "white",
    "backgroundColor": "#0f172a"
  },
  "tabBar": {
    "color": "#64748b",
    "selectedColor": "#a855f7",
    "backgroundColor": "#0f172a",
    "borderStyle": "black",
    "list": [
      { "pagePath": "pages/index/index", "text": "首页", "iconPath": "assets/tabbar/home.png", "selectedIconPath": "assets/tabbar/home-active.png" },
      { "pagePath": "pages/course/index", "text": "课程", "iconPath": "assets/tabbar/course.png", "selectedIconPath": "assets/tabbar/course-active.png" },
      { "pagePath": "pages/demand/index", "text": "需求", "iconPath": "assets/tabbar/demand.png", "selectedIconPath": "assets/tabbar/demand-active.png" },
      { "pagePath": "pages/community/index", "text": "社区", "iconPath": "assets/tabbar/community.png", "selectedIconPath": "assets/tabbar/community-active.png" },
      { "pagePath": "pages/user/index", "text": "我的", "iconPath": "assets/tabbar/user.png", "selectedIconPath": "assets/tabbar/user-active.png" }
    ]
  }
}
```

## 注意事项

1. 需要在微信公众平台配置合法域名
2. 用户隐私保护指引需要在小程序中配置
3. 部分功能需要用户授权（如位置、摄像头等）
