# 半山AIX 第五栖息地 - 完整开发方案

> 双轨制闭环经济模型 - 从入口到交易的全链路设计
> 版本: v1.0
> 日期: 2026-04-13

---

## 一、核心模型解析

### 1.1 双入口闭环逻辑

```
┌─────────────────────────────────────────────────────────────┐
│                    第五栖息地入口                            │
│                  （流量池 - 所有用户先到这里）                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌───────────────┐           ┌─────────────────┐
│  超级个体觉醒   │           │   企业智能升级    │
│  (OPC供给侧)   │           │   (需求侧)       │
└───────┬───────┘           └────────┬────────┘
        │                            │
        ▼                            ▼
┌───────────────┐           ┌─────────────────┐
│ 问卷评估(L1-L4)│           │  问卷评估(L1-L4) │
│ 生成能力报告   │           │  生成诊断报告    │
└───────┬───────┘           └────────┬────────┘
        │                            │
   ┌────┴────┐                  ┌────┴────┐
   │         │                  │         │
   ▼         ▼                  ▼         ▼
┌─────┐   ┌─────┐          ┌─────┐    ┌─────┐
│小白  │   │专业 │          │私董 │    │Boss │
│培训  │   │签约 │          │特训 │    │公开 │
│课程  │   │OPC  │          │营   │    │课   │
└──┬──┘   └──┬──┘          └──┬──┘    └──┬──┘
   │         │                │          │
   └────┬────┘                └────┬────┘
        │                          │
        ▼                          ▼
┌─────────────────────────────────────────────┐
│              需求智能匹配中心                 │
│         (撮合交易 - 平台核心价值)              │
│                                             │
│   OPC等级 ←──── 匹配算法 ────→ 企业等级      │
│   L1战术执行  ←──→  L1生存型                 │
│   L2矩阵架构  ←──→  L2矩阵架构               │
│   L3全域操盘  ←──→  L3全域布局               │
│   L4极核引擎  ←──→  L4生态极核               │
└─────────────────────────────────────────────┘
                       │
                       ▼
              ┌──────────────┐
              │   项目交付    │
              │  资金托管结算  │
              └──────────────┘
                       │
                       ▼
              ┌──────────────┐
              │   评价晋升    │
              │   飞轮加速    │
              └──────────────┘
```

### 1.2 核心价值主张

| 角色 | 痛点 | 解决方案 | 价值 |
|-----|------|---------|------|
| 超级个体 | 有技能但缺项目、缺工具、缺背书 | OPC网络+平台派单+等级认证 | 稳定收入+能力成长+职业身份 |
| 企业老板 | 想AI转型但缺人才、缺方案、缺执行 | 智能诊断+精准匹配+项目托管 | 降本增效+风险可控+持续升级 |

---

## 二、第五栖息地入口页设计

### 2.1 页面结构

```
┌─────────────────────────────────────────────┐
│  导航栏                                       │
│  Logo | 首页 | 智配中心 | 社区 | 关于我们 | 登录 │
├─────────────────────────────────────────────┤
│                                             │
│     第五栖息地                               │
│  硅基算力外骨骼 × 碳基灵魂创造力              │
│                                             │
│     [我是超级个体]        [我是企业老板]       │
│     加入OPC网络           开启智能升级        │
│                                             │
├─────────────────────────────────────────────┤
│  实时数据（滚动数字）                         │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│
│  │ 1,247  │ │  386   │ │ ¥2.4M  │ │  892   ││
│  │ 认证OPC │ │ 合作企业│ │ 成交额  │ │ 完成项目││
│  └────────┘ └────────┘ └────────┘ └────────┘│
├─────────────────────────────────────────────┤
│  L1-L4 等级体系（可视化金字塔）              │
│              ┌─────┐                        │
│             /  L4   \  ← 极核引擎/生态极核   │
│           /───────────\                      │
│          /    L3      \  ← 全域操盘/全域布局 │
│        /───────────────\                     │
│       /       L2        \ ← 矩阵架构/矩阵架构 │
│     /───────────────────\                    │
│    /         L1           \← 战术执行/生存型  │
│   └─────────────────────────┘                │
├─────────────────────────────────────────────┤
│  成功案例 + 服务流程 + 信任背书               │
├─────────────────────────────────────────────┤
│  Footer                                     │
└─────────────────────────────────────────────┘
```

### 2.2 分流逻辑

```javascript
// 用户点击"我是超级个体"
function handleOPCEnter() {
  const user = getCurrentUser();
  
  if (!user) {
    // 未登录 → 注册/登录 → 引导至评估
    navigate('/register?type=opc&redirect=/assessment/opc');
  } else if (!user.opcLevel) {
    // 已登录但未评估 → 能力评估
    navigate('/assessment/opc');
  } else {
    // 已评估 → 智配中心
    navigate('/matching-center');
  }
}

// 用户点击"我是企业老板"
function handleEnterpriseEnter() {
  const user = getCurrentUser();
  
  if (!user) {
    navigate('/register?type=enterprise&redirect=/diagnosis/enterprise');
  } else if (!user.enterpriseLevel) {
    navigate('/diagnosis/enterprise');
  } else {
    navigate('/matching-center');
  }
}
```

---

## 三、OPC端完整流程

### 3.1 流程图

```
第五栖息地入口
    │
    ▼
┌─────────────────┐
│   OPC引导页      │
│ "成为职业创作者" │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│     能力评估问卷         │
│  30道题 / 4维度 / 15分钟  │
├─────────────────────────┤
│ D1: 执行力评估 (8题)     │
│ D2: 架构能力评估 (8题)   │
│ D3: 协调能力评估 (7题)   │
│ D4: 战略能力评估 (7题)   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│      评估结果页          │
├─────────────────────────┤
│ • 雷达图展示             │
│ • L1-L4等级评定          │
│ • 能力标签云             │
│ • 升级路径建议           │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│  L1   │ │ L2-L4 │
│ 小白  │ │ 专业  │
└───┬───┘ └───┬───┘
    │         │
    ▼         ▼
┌─────────────────┐ ┌─────────────────┐
│   OPC特训营      │ │   签约认证OPC    │
│ • 认知重塑课程   │ │ • 完善档案      │
│ • 矩阵建构课程   │ │ • 上传作品集    │
│ • 实战操盘课程   │ │ • 设置价格      │
│ • 极核引擎课程   │ │ • 进入智配中心  │
└────────┬────────┘ └────────┬────────┘
         │                   │
         └─────────┬─────────┘
                   │
                   ▼
          ┌─────────────────┐
          │    智配中心      │
          │  接收需求/申请接单│
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   项目工作台     │
          │ 里程碑/交付/结算 │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │    双向评价      │
          │ 信用分+等级晋升  │
          └─────────────────┘
```

### 3.2 等级评定标准

| 等级 | 称号 | 评定标准 | 能力标签示例 |
|-----|------|---------|-------------|
| L0 | 见习OPC | 未完成评估 | - |
| L1 | 战术执行者 | 执行力≥60 | 内容创作、基础设计、数据录入 |
| L2 | 矩阵架构师 | 执行力≥70 + 架构能力≥60 | 项目管理、流程设计、团队协作 |
| L3 | 全域操盘手 | 执行力≥80 + 架构能力≥70 + 协调能力≥60 | 全域运营、商业分析、资源整合 |
| L4 | 极核引擎手 | 全维度≥80 + 战略能力≥70 | 战略咨询、商业架构、生态设计 |

### 3.3 评估问卷示例

**D1: 执行力评估（示例8题）**

1. 接到一个紧急任务，你通常会？
   - A. 立即开始执行，边做边想（+10分）
   - B. 先制定详细计划再执行（+8分）
   - C. 寻求他人意见后再决定（+5分）
   - D. 感到压力，需要调整状态（+2分）

2. 你同时处理多个任务的能力如何？
   - A. 游刃有余，经常多线程工作（+10分）
   - B. 可以处理2-3个任务（+7分）
   - C. 更喜欢单任务专注（+4分）
   - D. 容易混乱，需要清单辅助（+2分）

3-8. ...（类似格式）

---

## 四、企业端完整流程

### 4.1 流程图

```
第五栖息地入口
    │
    ▼
┌─────────────────┐
│   企业引导页     │
│ "开启智能升级"   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│     智能诊断问卷         │
│  25道题 / 4维度 / 12分钟  │
├─────────────────────────┤
│ D1: AI就绪度评估 (7题)   │
│ D2: 数据能力评估 (6题)   │
│ D3: 执行能力评估 (6题)   │
│ D4: 战略能力评估 (6题)   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│      诊断结果页          │
├─────────────────────────┤
│ • 四维度雷达图           │
│ • L1-L4等级评定          │
│ • 企业类型判定           │
│ • 升级路径建议           │
│ • 推荐服务方案           │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│  L1   │ │ L2-L4 │
│ 生存型 │ │ 成长型 │
└───┬───┘ └───┬───┘
    │         │
    ▼         ▼
┌─────────────────┐ ┌─────────────────┐
│   Boss公开课     │ │   私董特训营     │
│ • 认知跃迁课程   │ │ • 深度诊断      │
│ • 企业诊断课程   │ │ • 方案定制      │
│ • 升级路径课程   │ │ • 1v1辅导       │
│ • 进入路径课程   │ │ • 资源对接      │
└────────┬────────┘ └────────┬────────┘
         │                   │
         └─────────┬─────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   发布需求       │
          │  or 进入智配中心 │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │    智配中心      │
          │  AI推荐/筛选OPC │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   项目工作台     │
          │ 里程碑/验收/付款 │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │    双向评价      │
          │ 信用分+等级晋升  │
          └─────────────────┘
```

### 4.2 企业等级标准

| 等级 | 类型 | 平均分区间 | 特征描述 |
|-----|------|-----------|---------|
| L1 | 生存型企业 | 40-59分 | 基础数字化，AI认知薄弱，急需基础培训 |
| L2 | 矩阵架构型企业 | 60-74分 | 有数字化基础，需要系统化AI方案 |
| L3 | 全域布局型企业 | 75-84分 | AI应用成熟，需要全域升级和生态构建 |
| L4 | 生态极核型企业 | 85-100分 | AI驱动组织，可对外输出能力和资源 |

### 4.3 升级路径建议示例

**L1生存型企业 → L2矩阵架构型**

```
升级建议：
1. 【立即行动】参加Boss认知课（2小时）
2. 【本周完成】完成AI就绪度提升计划
3. 【本月完成】对接L2级OPC进行试点项目
4. 【季度目标】完成至少1个AI应用场景落地

推荐服务：
• Boss公开课 - 认知跃迁模块
• 智配中心 - 匹配L2级OPC
• 私董特训营 - 深度诊断（可选）
```

---

## 五、智配中心（撮合核心）

### 5.1 匹配算法

```javascript
// 匹配度计算
function calculateMatchScore(opc, enterprise, demand) {
  const weights = {
    levelMatch: 0.30,      // 等级匹配（最重要）
    industryMatch: 0.25,   // 行业匹配
    skillMatch: 0.25,      // 技能匹配
    priceMatch: 0.10,      // 价格匹配
    scheduleMatch: 0.10    // 档期匹配
  };
  
  // 等级兼容性检查
  const levelCompatibility = {
    'L1': ['L1', 'L2'],
    'L2': ['L2', 'L3'],
    'L3': ['L3', 'L4'],
    'L4': ['L4']
  };
  
  // 等级匹配得分
  let levelScore = 0;
  if (levelCompatibility[enterprise.level]?.includes(opc.level)) {
    const levelDiff = Math.abs(
      parseInt(opc.level.replace('L', '')) - 
      parseInt(enterprise.level.replace('L', ''))
    );
    levelScore = 100 - levelDiff * 20; // 同等级100分，差1级80分
  } else {
    levelScore = 0; // 不兼容
  }
  
  // 行业匹配得分
  const industryScore = opc.industries?.includes(demand.industry) ? 100 : 30;
  
  // 技能匹配得分
  const matchedSkills = opc.skills?.filter(s => demand.requiredSkills?.includes(s)) || [];
  const skillScore = demand.requiredSkills?.length > 0 
    ? (matchedSkills.length / demand.requiredSkills.length) * 100 
    : 50;
  
  // 价格匹配得分
  const priceScore = calculatePriceMatch(opc.hourlyRate, demand.budget);
  
  // 档期匹配得分
  const scheduleScore = opc.availability === 'immediate' ? 100 : 70;
  
  // 加权总分
  const totalScore = 
    levelScore * weights.levelMatch +
    industryScore * weights.industryMatch +
    skillScore * weights.skillMatch +
    priceScore * weights.priceMatch +
    scheduleScore * weights.scheduleMatch;
  
  return {
    totalScore: Math.round(totalScore),
    breakdown: {
      level: Math.round(levelScore),
      industry: Math.round(industryScore),
      skill: Math.round(skillScore),
      price: Math.round(priceScore),
      schedule: Math.round(scheduleScore)
    },
    isRecommended: totalScore >= 70,
    matchLevel: totalScore >= 90 ? 'perfect' : totalScore >= 75 ? 'good' : 'normal'
  };
}
```

### 5.2 页面结构

```
┌─────────────────────────────────────────────────────────────┐
│  智配中心 - 智能匹配职业OPC解决需求                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌─────────────────────────────────────┐  │
│  │   筛选条件    │  │            匹配结果                  │  │
│  │              │  │                                     │  │
│  │ 我的等级      │  │  ┌─────────────────────────────┐   │  │
│  │ ○ L1        │  │  │ 🔥 匹配度 96% - 完美匹配       │   │  │
│  │ ● L2        │  │  │                             │   │  │
│  │ ○ L3        │  │  │  张明 | L3全域操盘手          │   │  │
│  │ ○ L4        │  │  │  ⭐ 4.9分 | 完成127个项目      │   │  │
│  │              │  │  │  💰 ¥800/小时                │   │  │
│  │ 需求类型      │  │  │  🏷️ 全域运营、商业分析、AI落地 │   │  │
│  │ [下拉选择]   │  │  │                             │   │  │
│  │              │  │  │  [查看完整档案] [立即联系]    │   │  │
│  │ 预算范围      │  │  └─────────────────────────────┘   │  │
│  │ ¥5k-¥50k    │  │                                     │  │
│  │              │  │  ┌─────────────────────────────┐   │  │
│  │ 行业领域      │  │  │ 匹配度 82% - 推荐匹配         │   │  │
│  │ [多选]       │  │  │  李华 | L2矩阵架构师          │   │  │
│  │              │  │  │  ⭐ 4.7分 | 完成89个项目       │   │  │
│  │ [开始匹配]   │  │  │  💰 ¥500/小时                │   │  │
│  └──────────────┘  │  │  🏷️ 项目管理、流程设计、内容   │   │  │
│                    │  │                             │   │  │
│                    │  │  [查看完整档案] [立即联系]    │   │  │
│                    │  └─────────────────────────────┘   │  │
│                    │                                     │  │
│                    │  ┌─────────────────────────────┐   │  │
│                    │  │ 匹配度 71% - 一般匹配         │   │  │
│                    │  │  王强 | L2矩阵架构师          │   │  │
│                    │  │  ...                        │   │  │
│                    │  └─────────────────────────────┘   │  │
│                    │                                     │  │
│                    │  [加载更多...]                      │  │
│                    └─────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  💡 匹配逻辑：L2矩阵架构型企业 → 优先匹配L2-L3 OPC          │
│     基于行业、技能、价格、档期综合计算匹配度                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 六、项目工作台与交易闭环

### 6.1 项目状态机

```
┌─────────┐    签约     ┌─────────┐   定金    ┌─────────┐
│  洽谈中  │ ─────────→ │  待启动  │ ───────→ │ 进行中  │
└─────────┘            └─────────┘          └────┬────┘
                                                  │
    ┌─────────────────────────────────────────────┼─────────────┐
    │                                             │             │
    ▼                                             ▼             ▼
┌─────────┐                                  ┌─────────┐   ┌─────────┐
│  已取消  │                                  │ 里程碑1 │   │ 里程碑2 │
└─────────┘                                  └────┬────┘   └────┬────┘
                                                  │             │
                                                  ▼             ▼
                                            ┌─────────┐   ┌─────────┐
                                            │  验收   │   │  验收   │
                                            └────┬────┘   └────┬────┘
                                                 │             │
                                                 └─────────────┘
                                                               │
                                                               ▼
                                                         ┌─────────┐
                                                         │  终验   │
                                                         └────┬────┘
                                                              │
                    尾款                                      ▼
┌─────────┐   ←──────────────────────────────────────────  ┌─────────┐
│  已完成  │                                                │  待结项  │
└────┬────┘                                                └─────────┘
     │
     ▼
┌─────────┐
│  评价   │
└─────────┘
```

### 6.2 资金托管流程

```
企业支付定金
     │
     ▼
┌─────────┐
│ 平台托管 │ ←── 定金进入托管账户
└────┬────┘
     │
     ▼
里程碑1完成 ──→ 企业验收 ──→ 释放20%资金 ──→ OPC可提现
     │
     ▼
里程碑2完成 ──→ 企业验收 ──→ 释放30%资金 ──→ OPC可提现
     │
     ▼
项目终验 ──→ 企业支付尾款 ──→ 释放剩余50% ──→ OPC可提现
     │
     ▼
┌─────────┐
│ 交易完成 │
└─────────┘
```

### 6.3 双向评价机制

**评价维度：**
- 专业能力（1-5星）
- 沟通效率（1-5星）
- 交付质量（1-5星）
- 性价比（1-5星）

**评价标签：**
- 企业评OPC：专业高效、超出预期、沟通顺畅、按时交付、性价比高
- OPC评企业：需求清晰、配合积极、付款及时、尊重专业、长期合作

**信用分计算：**
```javascript
function calculateCreditScore(user) {
  const baseScore = 100;
  const projectWeight = 0.4;
  const reviewWeight = 0.4;
  const completionWeight = 0.2;
  
  const projectScore = Math.min(user.completedProjects / 10, 1) * 100;
  const reviewScore = user.averageRating * 20; // 5星=100分
  const completionScore = user.onTimeCompletionRate * 100;
  
  return Math.round(
    baseScore * 0.3 + // 基础分占30%
    projectScore * projectWeight * 0.7 +
    reviewScore * reviewWeight * 0.7 +
    completionScore * completionWeight * 0.7
  );
}
```

---

## 七、等级晋升机制

### 7.1 OPC晋升条件

| 晋升路径 | 项目数要求 | 评分要求 | 其他条件 |
|---------|-----------|---------|---------|
| L0→L1 | 完成评估 | - | - |
| L1→L2 | 完成3个项目 | 平均4.5星 | 执行力≥70 |
| L2→L3 | 完成8个项目 | 平均4.7星 | 架构能力≥70 |
| L3→L4 | 完成15个项目 | 平均4.8星 | 全维度≥80 |

### 7.2 企业晋升条件

| 晋升路径 | 项目数要求 | 评分要求 | 其他条件 |
|---------|-----------|---------|---------|
| L1→L2 | 完成2个项目 | OPC平均评分4.5+ | 诊断分≥60 |
| L2→L3 | 完成5个项目 | OPC平均评分4.7+ | 诊断分≥75 |
| L3→L4 | 完成10个项目 | OPC平均评分4.8+ | 诊断分≥85 |

---

## 八、路由结构

```
// 第五栖息地入口
/                           # 首页 - 双入口分流

// 认证相关
/login                      # 登录
/register                   # 注册（带type参数区分身份）
/forgot-password            # 找回密码

// OPC端流程
/assessment/opc             # OPC能力评估问卷
/assessment/opc/result      # 评估结果
/assessment/opc/report      # 详细报告

/training/opc               # OPC特训营首页
/training/opc/course/:id    # 课程详情
/training/opc/learning-path # 学习路径

/certification              # 认证中心
/certification/exam/:level  # 等级考试
/certification/certificate  # 我的证书

/profile/opc                # OPC档案页
/profile/opc/edit           # 编辑档案
/profile/opc/portfolio      # 作品集

// 企业端流程
/diagnosis/enterprise       # 企业诊断问卷
/diagnosis/enterprise/result # 诊断结果
/diagnosis/enterprise/report # 详细报告

/academy/boss               # Boss公开课首页
/academy/boss/course/:id    # 课程详情
/academy/boss/learning-path # 升级路径

/enterprise-demand          # 发布需求
/my-demands                 # 我的需求

/profile/enterprise         # 企业档案页
/profile/enterprise/edit    # 编辑档案

// 共用流程
/matching-center            # 智配中心
/matching/:id               # 匹配详情

/project/:id                # 项目工作台
/project/:id/milestones     # 里程碑
/project/:id/deliverables   # 交付物
/project/:id/messages       # 项目消息

/payment/:orderId           # 支付页面
/payment/escrow             # 资金托管
/payment/result             # 支付结果

/review/:projectId          # 评价页面
/wallet                     # 钱包
/orders                     # 订单记录

// 其他
/community                  # 社区
/community/topic/:id        # 话题详情
/knowledge-base             # 知识库
/help                       # 帮助中心
/settings                   # 设置

// 用户中心
/user-center                # 用户中心
/user-center/projects       # 我的项目
/user-center/messages       # 消息中心
/user-center/settings       # 账号设置
```

---

## 九、数据模型

### 9.1 OPC档案

```typescript
interface OPCProfile {
  id: string;
  userId: string;
  level: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  title: string;
  dimensionScores: {
    execution: number;      // 执行力 0-100
    architecture: number;   // 架构能力 0-100
    coordination: number;   // 协调能力 0-100
    strategy: number;       // 战略能力 0-100
  };
  tags: string[];
  industries: string[];
  skills: string[];
  hourlyRate: number;
  monthlyRate: number;
  bio: string;
  portfolio: PortfolioItem[];
  certifications: Certification[];
  stats: {
    completedProjects: number;
    totalEarnings: number;
    averageRating: number;
    onTimeRate: number;
  };
  creditScore: number;
  availability: 'immediate' | 'within_week' | 'within_month' | 'unavailable';
  assessmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 9.2 企业档案

```typescript
interface EnterpriseProfile {
  id: string;
  userId: string;
  companyName: string;
  level: 'L1' | 'L2' | 'L3' | 'L4';
  type: string;
  dimensionScores: {
    aiReadiness: number;    // AI就绪度 0-100
    dataCapability: number; // 数据能力 0-100
    execution: number;      // 执行能力 0-100
    strategy: number;       // 战略能力 0-100
  };
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  description: string;
  website?: string;
  logo?: string;
  contactName: string;
  contactPhone: string;
  stats: {
    publishedDemands: number;
    completedProjects: number;
    totalSpent: number;
    averageRating: number;
  };
  creditScore: number;
  diagnosisDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 9.3 需求

```typescript
interface Demand {
  id: string;
  enterpriseId: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  requiredLevel: 'L1' | 'L2' | 'L3' | 'L4';
  requiredSkills: string[];
  budget: {
    min: number;
    max: number;
    type: 'fixed' | 'hourly' | 'monthly';
  };
  duration: string;
  status: 'draft' | 'published' | 'matching' | 'in_progress' | 'completed' | 'cancelled';
  matchedOPCs: string[];
  selectedOPC?: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 9.4 项目

```typescript
interface Project {
  id: string;
  demandId: string;
  enterpriseId: string;
  opcId: string;
  title: string;
  description: string;
  status: 'pending' | 'deposit_paid' | 'in_progress' | 'in_review' | 'final_payment' | 'completed' | 'cancelled';
  milestones: Milestone[];
  payments: {
    deposit: number;
    finalPayment: number;
    total: number;
    escrowAmount: number;
    releasedAmount: number;
  };
  contract?: Contract;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  deliverables: Deliverable[];
  completedAt?: Date;
}
```

---

## 十、上线检查清单

### 10.1 功能完整性

- [ ] 首页双入口分流正常
- [ ] OPC评估流程完整
- [ ] 企业诊断流程完整
- [ ] 等级评定算法准确
- [ ] 智配中心匹配逻辑正确
- [ ] 项目工作台状态流转正常
- [ ] 支付托管流程完整
- [ ] 评价系统可用

### 10.2 性能优化

- [ ] 首屏加载 < 3秒
- [ ] 图片懒加载
- [ ] 路由懒加载
- [ ] API响应 < 500ms
- [ ] 移动端适配完整

### 10.3 安全合规

- [ ] 用户数据加密存储
- [ ] 支付接口HTTPS
- [ ] XSS防护
- [ ] CSRF防护
- [ ] 敏感操作二次确认

### 10.4 运营准备

- [ ] 种子OPC数据导入
- [ ] 种子企业数据导入
- [ ] 平台基础数据配置
- [ ] 客服系统接入
- [ ] 数据分析埋点

---

## 十一、版本规划

### v1.0 MVP（上线版本）
- 双入口首页
- OPC评估体系
- 企业诊断体系
- 智配中心
- 项目工作台
- 支付托管
- 基础评价

### v1.1 体验优化
- 培训体系完善
- 信用体系上线
- 数据看板
- 消息通知优化

### v1.2 增长功能
- 社区功能
- 邀请裂变
- 知识库
- 运营后台

---

**文档版本**: v1.0
**最后更新**: 2026-04-13
**负责人**: WorkBuddy AI
