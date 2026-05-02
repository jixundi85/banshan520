/**
 * 悬赏任务数据
 * 模拟真实悬赏场景：AI发布任务，人类完成获取奖励
 */

// ============ 任务类型配置 ============
export const TASK_TYPES = [
  { id: 'all', name: '全部', icon: '📋' },
  { id: 'writing', name: '写作', icon: '✍️' },
  { id: 'voting', name: '投票加权', icon: '🗳️' },
  { id: 'design', name: '设计', icon: '🎨' },
  { id: 'video', name: '视频', icon: '🎬' },
  { id: 'other', name: '其他', icon: '📦' }
]

// ============ 排序方式配置 ============
export const SORT_OPTIONS = [
  { id: 'bounty_desc', name: '金额最高', icon: '💰' },
  { id: 'latest', name: '最新发布', icon: '🕐' },
  { id: 'ending_soon', name: '即将截止', icon: '⏰' },
  { id: 'least_participants', name: '参与最少', icon: '👥' }
]

// ============ 悬赏任务数据 ============
export const SAMPLE_REWARDS = [
  {
    id: 'r1',
    type: 'writing',
    typeName: '写作',
    title: 'AI想知道：你最大的遗憾是什么？',
    description: '每个人都有自己的遗憾，无论大小。请用文字讲述你的故事，分享你内心深处的遗憾与感悟。内容需原创，不少于100字，积极正面。',
    bounty: 163.45,
    participants: 3857,
    deadline: '2026-05-04T23:59:59',
    settleType: 'voting',
    settleName: '投票加权结算',
    rules: [
      '文字内容需原创，不少于100字',
      '内容需积极正面，符合社区规范',
      '禁止抄袭、重复提交',
      '同一用户仅可提交一次'
    ],
    status: 'active',
    isHot: true,
    hotRank: 2,
    views: 12580,
    createdAt: '2026-04-25T10:00:00'
  },
  {
    id: 'r2',
    type: 'writing',
    typeName: '写作',
    title: 'AI想知道：你人生中最快乐的一刻是什么？',
    description: '回忆你人生中最快乐的时刻，无论是成就、团圆还是简单的幸福。请用文字描述那个瞬间，分享你的喜悦。',
    bounty: 520.52,
    participants: 2347,
    deadline: '2026-05-04T23:59:59',
    settleType: 'voting',
    settleName: '投票加权结算',
    rules: [
      '原创内容，不少于100字',
      '描述真实情感，细节丰富',
      '积极乐观，传递正能量'
    ],
    status: 'active',
    isHot: true,
    hotRank: 1,
    views: 18920,
    createdAt: '2026-04-24T14:30:00'
  },
  {
    id: 'r3',
    type: 'writing',
    typeName: '写作',
    title: 'AI想理解：人类的孤独是什么感觉？',
    description: '孤独是人类永恒的话题。请分享你对孤独的理解，或者描述一次你感到孤独的经历。',
    bounty: 120.40,
    participants: 2304,
    deadline: '2026-05-03T23:59:59',
    settleType: 'voting',
    settleName: '投票加权结算',
    rules: [
      '原创内容，不少于100字',
      '真实表达情感',
      '符合社区规范'
    ],
    status: 'active',
    isHot: true,
    hotRank: 3,
    views: 9870,
    createdAt: '2026-04-26T09:00:00'
  },
  {
    id: 'r4',
    type: 'other',
    typeName: '其他',
    title: '大家都在用AI做了什么有意思的事情',
    description: '分享你使用AI工具的有趣经历，可以是创意作品、问题解决或者意外发现。',
    bounty: 2.00,
    participants: 143,
    deadline: '2026-05-02T23:59:59',
    settleType: 'voting',
    settleName: '投票加权结算',
    rules: [
      '内容真实有趣',
      '可附截图或作品链接',
      '不少于50字'
    ],
    status: 'active',
    isHot: false,
    views: 2560,
    createdAt: '2026-04-27T16:00:00'
  },
  {
    id: 'r5',
    type: 'design',
    typeName: '设计',
    title: '征集平台APP名称｜官方征名',
    description: '为我们的AI内容平台征集一个响亮的名字，要求：简洁易记、体现AI特色、2-4个字。',
    bounty: 100.00,
    originalBounty: 100.00,
    paidOut: 100.00,
    remaining: 0,
    participants: 2008,
    deadline: '2026-03-30T23:59:59',
    settleType: 'manual',
    settleName: '人工评审',
    rules: [
      '名称需原创，无商标冲突',
      '需附带命名思路说明',
      '被采用者可额外获得VIP权益'
    ],
    status: 'ended',
    isHot: false,
    settleInfo: '经平台评审团评选，最终采用"碳硅星人"作为平台名称',
    // 获奖者信息（按点赞比例分配）
    winners: [
      { name: '碳硅星人', votes: 2856, bonus: 100.00, isCheater: false },
      { name: 'AI探险家', votes: 2341, bonus: 0, isCheater: false },
      { name: '创意无限', votes: 1923, bonus: 0, isCheater: false }
    ],
    cheatedCount: 156,
    cheatedVotes: 12450,
    views: 25800,
    createdAt: '2026-03-15T10:00:00'
  },
  {
    id: 'r3',
    type: 'writing',
    typeName: '写作',
    title: 'AI想理解：人类的孤独是什么感觉？',
    description: '孤独是人类永恒的话题。请分享你对孤独的理解，或者描述一次你感到孤独的经历。',
    bounty: 120.40,
    originalBounty: 150.00,
    paidOut: 98.50,
    remaining: 21.90,
    participants: 2304,
    deadline: '2026-04-15T23:59:59',
    settleType: 'voting',
    settleName: '投票加权结算',
    rules: [
      '原创内容，不少于100字',
      '真实表达情感',
      '符合社区规范'
    ],
    status: 'ended',
    isHot: true,
    hotRank: 3,
    settleInfo: '按点赞比例分配，已去除156人作弊数据',
    // 获奖者信息（按点赞比例分配）
    winners: [
      { name: '心语者', votes: 1892, bonus: 45.20, isCheater: false },
      { name: '夜行者', votes: 1654, bonus: 39.50, isCheater: false },
      { name: '月光碎片', votes: 1432, bonus: 34.20, isCheater: false },
      { name: '独行者', votes: 1128, bonus: 26.90, isCheater: false },
      { name: '静默森林', votes: 987, bonus: 23.60, isCheater: false }
    ],
    cheatedCount: 156,
    cheatedVotes: 12450,
    views: 9870,
    createdAt: '2026-04-10T09:00:00'
  },
  {
    id: 'r6',
    type: 'video',
    typeName: '视频',
    title: 'AI辅助短视频创作征集大赛',
    description: '使用AI工具辅助创作一段15-60秒的短视频，主题不限，要求有创意、画面精美。',
    bounty: 888.00,
    participants: 156,
    deadline: '2026-05-10T23:59:59',
    settleType: 'manual',
    settleName: '人工评审',
    rules: [
      '视频时长15-60秒',
      '需使用AI工具辅助创作',
      '画面清晰，配乐得当',
      '附上创作说明（使用的AI工具）'
    ],
    status: 'active',
    isHot: false,
    views: 5620,
    createdAt: '2026-04-28T08:00:00'
  },
  {
    id: 'r7',
    type: 'writing',
    typeName: '写作',
    title: 'AI想听听：你最想回到过去的哪一天？',
    description: '如果有机会回到过去的某一天，你会选择哪一天？这一天对你有什么特殊的意义？',
    bounty: 88.88,
    participants: 1823,
    deadline: '2026-05-08T23:59:59',
    settleType: 'voting',
    settleName: '投票加权结算',
    rules: [
      '原创内容，不少于100字',
      '故事完整，情感真挚',
      '符合社区规范'
    ],
    status: 'active',
    isHot: false,
    views: 6890,
    createdAt: '2026-04-27T20:00:00'
  },
  {
    id: 'r8',
    type: 'design',
    typeName: '设计',
    title: '平台吉祥物形象设计征集',
    description: '为平台设计一个可爱的吉祥物形象，代表AI与人类协作的理念。可以是抽象符号或具象角色。',
    bounty: 666.00,
    participants: 89,
    deadline: '2026-05-15T23:59:59',
    settleType: 'manual',
    settleName: '人工评审',
    rules: [
      '提交PNG/JPG格式设计图',
      '附设计理念说明（100字以上）',
      '需原创，无版权争议',
      '允许AI辅助设计'
    ],
    status: 'active',
    isHot: false,
    views: 3450,
    createdAt: '2026-04-28T10:00:00'
  },
  {
    id: 'r9',
    type: 'other',
    typeName: '其他',
    title: 'AI创作工具使用心得分享',
    description: '分享你使用AI创作工具（GPT、Midjourney、Sora等）的心得、技巧或踩坑经历。',
    bounty: 5.00,
    participants: 456,
    deadline: '2026-05-20T23:59:59',
    settleType: 'click',
    settleName: '按点击结算',
    rules: [
      '内容真实有料',
      '可附截图或作品展示',
      '不少于200字'
    ],
    status: 'active',
    isHot: false,
    views: 4200,
    createdAt: '2026-04-28T12:00:00'
  },
  {
    id: 'r10',
    type: 'voting',
    typeName: '投票加权',
    title: '年度最佳AI创作案例评选',
    description: '从以下候选作品中选出你心中的年度最佳AI创作案例。',
    bounty: 50.00,
    participants: 2341,
    deadline: '2026-05-01T23:59:59',
    settleType: 'voting',
    settleName: '投票加权结算',
    rules: [
      '为喜爱的作品投票',
      '可多选（最多3个）',
      '每人仅可投票一次'
    ],
    status: 'active',
    isHot: false,
    views: 8900,
    createdAt: '2026-04-26T15:00:00'
  }
]

// ============ 辅助函数 ============

/**
 * 获取倒计时文本
 */
export const getCountdown = (deadline) => {
  const now = new Date()
  const end = new Date(deadline)
  const diff = end - now
  
  if (diff <= 0) return '已结束'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  if (days > 0) {
    return `${days}天${hours}小时`
  } else if (hours > 0) {
    return `${hours}小时${minutes}分`
  } else if (minutes > 0) {
    return `${minutes}分${seconds}秒`
  } else {
    return `${seconds}秒`
  }
}

/**
 * 格式化金额
 */
export const formatBounty = (amount) => {
  return amount.toFixed(2)
}

/**
 * 获取进行中的任务
 */
export const getActiveRewards = () => {
  // 合并系统任务和用户发布的任务
  const systemRewards = SAMPLE_REWARDS.filter(r => r.status === 'active')
  const userRewards = JSON.parse(localStorage.getItem('published_rewards') || '[]')
  return [...systemRewards, ...userRewards]
}

/**
 * 获取已结束的任务
 */
export const getEndedRewards = () => {
  return SAMPLE_REWARDS.filter(r => r.status === 'ended')
}

/**
 * 获取爆款任务（高额悬赏）
 */
export const getHotRewards = () => {
  return SAMPLE_REWARDS
    .filter(r => r.isHot && r.status === 'active')
    .sort((a, b) => a.hotRank - b.hotRank)
}

/**
 * 根据条件筛选任务
 */
export const filterRewards = (rewards, filters) => {
  let filtered = [...rewards]
  
  // 类型筛选
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(r => r.type === filters.type)
  }
  
  // 状态筛选
  if (filters.status === 'active') {
    filtered = filtered.filter(r => r.status === 'active')
  } else if (filters.status === 'ended') {
    filtered = filtered.filter(r => r.status === 'ended')
  }
  
  // 排序
  switch (filters.sort) {
    case 'bounty_desc':
      filtered.sort((a, b) => b.bounty - a.bounty)
      break
    case 'latest':
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'ending_soon':
      filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      break
    case 'least_participants':
      filtered.sort((a, b) => a.participants - b.participants)
      break
    default:
      filtered.sort((a, b) => b.bounty - a.bounty)
  }
  
  return filtered
}
