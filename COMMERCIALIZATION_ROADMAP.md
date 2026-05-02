# 半山AIX 碳硅共生平台 - 商业化路线图

**目标**：3个月内完成商业化上线  
**负责人**：WorkBuddy AI  
**最后更新**：2026-04-13

---

## 项目里程碑

```
Month 1 (4.13-5.13)    Month 2 (5.14-6.13)    Month 3 (6.14-7.13)
    ┌─────────┐           ┌─────────┐           ┌─────────┐
    │ Phase 1 │    →     │ Phase 2 │    →     │ Phase 3 │
    │ 基础设施 │           │ 核心强化 │           │ 商业化  │
    └─────────┘           └─────────┘           └─────────┘
         ↓                      ↓                      ↓
    后端API上线            功能完善               正式上线
    数据库搭建             算法部署               运营启动
```

---

## Phase 1: 基础设施（Week 1-4）

### Week 1: 架构设计 + 环境搭建

**Day 1-2: 技术选型确认**
- [ ] 后端框架：Node.js(Express/Nest.js) vs Java(Spring Boot)
- [ ] 数据库：PostgreSQL(主) + Redis(缓存) + MongoDB(日志)
- [ ] 云服务：阿里云/腾讯云选型
- [ ] 部署方案：Docker + Kubernetes

**Day 3-4: 开发环境搭建**
- [ ] 代码仓库初始化（GitLab/GitHub私有）
- [ ] CI/CD流水线（GitHub Actions/Jenkins）
- [ ] 开发/测试/生产环境配置
- [ ] API文档工具（Swagger/Postman集合）

**Day 5-7: 数据库设计**
```sql
-- 核心表结构
users (用户表)
├── id, phone, email, password_hash
├── role (opc/enterprise/admin)
├── level (L1-L4)
├── status, created_at, updated_at
├── profile (JSON扩展字段)

opc_profiles (OPC档案)
├── user_id, dimension_scores (四维度分数)
├── tags (能力标签数组)
├── certifications (认证数组)
├── rating, projects_count, earnings

enterprise_profiles (企业档案)
├── user_id, company_name, industry
├── level, dimension_scores
├── diagnosis_result (诊断结果JSON)

demands (需求表)
├── id, publisher_id, title, description
├── category, budget_min, budget_max
├── status, match_score, created_at

projects (项目表)
├── id, demand_id, opc_id, enterprise_id
├── status, milestones (里程碑JSON)
├── payments (支付记录JSON)
├── start_date, end_date

orders (订单表)
├── id, project_id, amount, status
├── payment_method, transaction_id
├── paid_at, created_at

reviews (评价表)
├── id, project_id, reviewer_id, target_id
├── rating, tags, comment
├── created_at
```

### Week 2: 用户认证 + 基础API

**Day 8-10: 认证体系**
- [ ] 手机号注册/登录（短信验证码）
- [ ] JWT Token机制（access/refresh）
- [ ] 密码加密（bcrypt）
- [ ] 权限中间件（RBAC）
- [ ] 第三方登录（微信扫码）

**Day 11-14: 基础CRUD API**
- [ ] 用户信息管理
- [ ] OPC档案CRUD
- [ ] 企业档案CRUD
- [ ] 文件上传接口（预签名URL）

### Week 3: 支付系统

**Day 15-17: 支付接入**
- [ ] 微信支付（JSAPI/Native）
- [ ] 支付宝（PC/移动端）
- [ ] 资金托管逻辑（定金-尾款）
- [ ] 退款流程
- [ ] 支付回调处理

**Day 18-21: 订单系统**
- [ ] 订单创建/查询
- [ ] 订单状态机
- [ ] 财务流水记录
- [ ] 对账接口

### Week 4: 前端改造

**Day 22-25: API对接**
- [ ] 封装axios请求层
- [ ] 统一错误处理
- [ ] Token刷新机制
- [ ] 前端路由守卫

**Day 26-28: 数据迁移**
- [ ] localStorage → API迁移
- [ ] 离线缓存策略
- [ ] 数据同步机制

---

## Phase 2: 核心功能强化（Week 5-8）

### Week 5: 即时通讯

**Day 29-32: WebSocket服务**
- [ ] Socket.io服务搭建
- [ ] 消息持久化（MongoDB）
- [ ] 未读消息计数
- [ ] 消息撤回/删除

**Day 33-35: 前端集成**
- [ ] 聊天组件重构
- [ ] 实时消息推送
- [ ] 消息列表分页
- [ ] 文件消息支持

### Week 6: 搜索与推荐

**Day 36-38: 搜索系统**
- [ ] Elasticsearch搭建
- [ ] 全文索引（OPC/需求/内容）
- [ ] 搜索建议（自动补全）
- [ ] 筛选器（多维度）

**Day 39-42: 推荐算法**
- [ ] 协同过滤（用户相似度）
- [ ] 内容推荐（标签匹配）
- [ ] 热门排序算法
- [ ] A/B测试框架

### Week 7: 内容审核

**Day 43-45: 审核系统**
- [ ] 敏感词过滤
- [ ] 图片内容审核（阿里云绿网）
- [ ] 人工审核后台
- [ ] 举报处理流程

**Day 46-49: 安全加固**
- [ ] API限流（Rate Limiting）
- [ ] SQL注入防护
- [ ] XSS防护
- [ ] CSRF防护

### Week 8: 入驻流程

**Day 50-53: OPC入驻**
- [ ] 实名认证（身份证OCR）
- [ ] 作品集上传
- [ ] 能力评估接口
- [ ] 审核流程

**Day 54-56: 企业入驻**
- [ ] 企业认证（营业执照OCR）
- [ ] 对公账户验证
- [ ] 企业档案完善

---

## Phase 3: 商业化准备（Week 9-12）

### Week 9: 数据运营

**Day 57-60: 数据埋点**
- [ ] 用户行为埋点（神策/GrowingIO）
- [ ] 转化漏斗分析
- [ ] 关键指标看板
- [ ] 实时数据监控

### Week 10: 客服系统

**Day 61-64: 客服接入**
- [ ] 智能客服（机器人）
- [ ] 人工客服系统
- [ ] 工单系统
- [ ] 常见问题FAQ

### Week 11: 合规与法务

**Day 65-70: 法律文件**
- [ ] 用户服务协议
- [ ] 隐私政策
- [ ] 创作者入驻协议
- [ ] 企业入驻协议
- [ ] 版权声明

**Day 71-74: 合规审查**
- [ ] ICP备案
- [ ] 等保测评（二级）
- [ ] 支付牌照核查
- [ ] 数据合规（GDPR/个人信息保护法）

### Week 12: 上线准备

**Day 75-78: 性能优化**
- [ ] CDN加速
- [ ] 数据库索引优化
- [ ] 缓存策略（Redis）
- [ ] 图片压缩/懒加载

**Day 79-82: 压力测试**
- [ ] 并发测试（1000+用户）
- [ ] 接口性能测试
- [ ] 支付流程压测
- [ ] 故障演练

**Day 83-84: 上线部署**
- [ ] 生产环境部署
- [ ] 域名配置 + SSL
- [ ] 监控告警配置
- [ ] 数据备份策略

---

## 技术栈选型建议

### 后端
```
语言: Node.js (TypeScript)
框架: Nest.js
数据库: PostgreSQL (主) + Redis (缓存) + MongoDB (日志)
ORM: Prisma
消息队列: RabbitMQ
搜索: Elasticsearch
文件存储: 阿里云OSS
部署: Docker + Kubernetes
```

### 前端（保持现有）
```
框架: React 18 + Vite
状态管理: Zustand/Redux Toolkit
UI库: Tailwind CSS + Headless UI
图表: ECharts/Recharts
```

### 云服务（推荐阿里云）
```
ECS: 4核8G × 2（主备）
RDS: PostgreSQL 8核16G
Redis: 4G主从
OSS: 500GB存储包
CDN: 1TB流量包
短信服务: 阿里云短信
支付: 微信支付 + 支付宝
```

---

## 预算估算

| 项目 | 月费用 | 说明 |
|------|--------|------|
| 云服务器 | ¥800 | ECS 4核8G × 2 |
| 数据库 | ¥1200 | RDS + Redis |
| 存储/CDN | ¥500 | OSS + CDN |
| 短信服务 | ¥300 | 按量付费 |
| 支付手续费 | - | 微信0.6% + 支付宝0.6% |
| 第三方服务 | ¥500 | 内容审核、OCR等 |
| **合计** | **¥3300/月** | 首年约4万 |

---

## 风险与应对

| 风险 | 概率 | 影响 | 应对 |
|------|------|------|------|
| 开发延期 | 中 | 高 | 每周站会，及时调整范围 |
| 支付审核不通过 | 低 | 高 | 提前准备资质材料 |
| 等保测评不通过 | 中 | 中 | 预留2周整改时间 |
| 用户增长不及预期 | 中 | 中 | MVP验证后再投入 |

---

## 下一步行动

**今天（Day 0）**
1. 确认技术选型（Node.js vs Java）
2. 注册阿里云账号，购买域名
3. 创建后端代码仓库

**本周（Week 1）**
1. 完成数据库设计文档
2. 搭建开发环境
3. 完成用户认证API

---

**吉老师，确认几个关键决策：**

1. **后端技术栈**：Node.js(Nest.js) vs Java(Spring Boot)？
   - Node.js：开发快，适合初创团队
   - Java：稳定，适合大规模并发

2. **云服务**：阿里云 vs 腾讯云？
   - 阿里云：生态全，文档好
   - 腾讯云：微信生态整合好

3. **域名**：准备用什么域名？

4. **团队**：后端开发是你自己搞还是招人？

确认了这些，我立即开始Phase 1的执行。
