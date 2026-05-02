import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const db = new Database(join(__dirname, 'chat.db'))

// 创建表
db.exec(`
  -- 知识库表
  CREATE TABLE IF NOT EXISTS ai_knowledge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT '通用',
    source TEXT,
    token_count INTEGER,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 对话历史表
  CREATE TABLE IF NOT EXISTS ai_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 客服设置表
  CREATE TABLE IF NOT EXISTS ai_settings (
    id INTEGER PRIMARY KEY CHECK(id = 1),
    widget_name TEXT DEFAULT '半山灵图',
    position TEXT DEFAULT 'right' CHECK(position IN ('left', 'right')),
    icon_size TEXT DEFAULT 'medium' CHECK(icon_size IN ('small', 'medium', 'large')),
    bottom_offset INTEGER DEFAULT 24,
    greeting TEXT DEFAULT '您好，我是半山灵图，有什么可以帮您的？',
    welcome_suggestions TEXT DEFAULT '["企业AI诊断是什么？", "怎么成为OPC创作者？", "需求广场怎么用？", "OPC认证流程？"]',
    hot_topics TEXT DEFAULT '[{"icon":"🏛️","title":"了解半山","subtitle":"研究院理念与使命"},{"icon":"💼","title":"OPC项目","subtitle":"超级个体商业计划"},{"icon":"💰","title":"政策补贴","subtitle":"马来AI转型扶持"},{"icon":"🤝","title":"商务合作","subtitle":"共建碳硅生态"}]',
    enabled INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 创建索引
  CREATE INDEX IF NOT EXISTS idx_conversations_session ON ai_conversations(session_id);
  CREATE INDEX IF NOT EXISTS idx_knowledge_category ON ai_knowledge(category);
  CREATE INDEX IF NOT EXISTS idx_knowledge_status ON ai_knowledge(status);

  -- 需求表
  CREATE TABLE IF NOT EXISTS demands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    budget INTEGER NOT NULL,
    budget_min INTEGER,
    budget_max INTEGER,
    deadline TEXT,
    requirements TEXT,
    contact TEXT NOT NULL,
    company TEXT NOT NULL,
    company_desc TEXT,
    cover_image TEXT,
    reference_images TEXT,
    tags TEXT,
    is_urgent INTEGER DEFAULT 0,
    publisher_id TEXT,
    publisher_name TEXT,
    publisher_avatar TEXT,
    status TEXT DEFAULT 'pending',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    bids INTEGER DEFAULT 0,
    collected INTEGER DEFAULT 0,
    is_certified INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 需求投标表
  CREATE TABLE IF NOT EXISTS demand_bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    demand_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT,
    user_avatar TEXT,
    proposal TEXT,
    price INTEGER,
    timeline TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (demand_id) REFERENCES demands(id)
  );

  -- 需求收藏表
  CREATE TABLE IF NOT EXISTS demand_collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    demand_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(demand_id, user_id)
  );
`)

// 初始化默认设置
const initSettings = db.prepare(`
  INSERT OR IGNORE INTO ai_settings (id, widget_name, greeting, welcome_suggestions)
  VALUES (1, '半山灵图', '您好！我是半山AI助手，有什么可以帮您的吗？', '["企业AI诊断是什么？", "怎么成为OPC创作者？", "需求广场怎么用？", "OPC认证流程？"]')
`)
initSettings.run()

// 初始化知识库数据
const count = db.prepare('SELECT COUNT(*) as cnt FROM ai_knowledge').get()
if (count.cnt === 0) {
  const insertKnowledge = db.prepare(`
    INSERT INTO ai_knowledge (title, content, category, source)
    VALUES (?, ?, ?, ?)
  `)

  const knowledgeData = [
    // 平台介绍
    ['半山AIX是什么', '半山AIX实验室是半山碳硅共生研究院旗下专注于AI企业诊断、OPC智能匹配、创作者孵化的核心平台。致力于帮助企业实现AI升级转型，连接优质OPC创作者与咨询专家。', '平台介绍', '官方'],
    ['平台是做什么的', '半山AIX是一个AI企业诊断与OPC智能匹配平台。我们提供：100位超级个体创作者入驻、100款全球领先AI工具挂载、1000家会员企业需求对接、1267+累计交付任务经验。核心功能：企业AI诊断、OPC认证、需求广场、创作者孵化。', '平台介绍', '官方'],
    
    // 企业AI诊断
    ['企业AI诊断是什么', '企业AI诊断是通过多维度评估（AI就绪度、数据成熟度、安全敏感度、投入意愿度），帮助企业了解自身AI应用现状，生成个性化升级方案和OPC推荐的服务。访问 /enterprise-diagnosis 开始诊断。', '核心功能', '官方'],
    ['怎么进行企业诊断', '1. 访问 /enterprise-diagnosis 页面\n2. 填写企业基本信息\n3. 回答AI应用相关问题\n4. 系统生成诊断报告\n5. 获取OPC推荐方案\n6. 开始AI升级之旅', '核心功能', '官方'],
    ['诊断费用多少', '企业AI诊断服务目前限时免费。企业可获得完整的AI就绪度评估报告和专属OPC匹配方案。', '核心功能', '官方'],
    
    // OPC认证
    ['OPC是什么', 'OPC（Original Producer Creator）是原创内容生产者创作者。半山AIX平台汇聚了AI视频创作、AI广告电影、AI设计、AI短剧漫剧、AI文旅宣传片等领域的专业OPC创作者。', 'OPC认证', '官方'],
    ['怎么成为OPC创作者', '成为OPC创作者步骤：\n1. 访问 /opc-assessment 进行OPC能力评估\n2. 通过评估后提交认证申请\n3. 提交作品集审核\n4. 获得OPC认证\n\n或访问 /opc-certification 了解更多。', 'OPC认证', '官方'],
    ['OPC认证流程', 'OPC认证流程：\n1. OPC能力评估（/opc-assessment）\n2. 提交申请资料（/opc-certification-apply）\n3. 作品集审核\n4. 认证通过公示\n5. 入驻平台接单', 'OPC认证', '官方'],
    ['OPC创作者类型', 'OPC创作者分为两类：\n1. 认证OPC创作者：AI视频、AI广告电影、AI设计师、AI短剧漫剧、AI文旅宣传片\n2. 认证OPC咨询专家：企业战略咨询、企业上市咨询、企业融资咨询、企业股权架构咨询、企业战略出海咨询、企业AI升级转型咨询、企业私有化部署咨询', 'OPC认证', '官方'],
    
    // 需求广场
    ['需求广场是什么', '需求广场（/demand）是连接企业与创作者的需求对接平台。企业可以发布AI创作需求，创作者可以投标接单。访问 /demand 体验。', '需求广场', '官方'],
    ['怎么发布需求', '发布需求步骤：\n1. 访问 /demand 需求广场\n2. 点击"发布需求"\n3. 填写需求详情（标题、描述、类型、预算、时间）\n4. 提交审核\n5. 等待创作者投标', '需求广场', '官方'],
    ['怎么投标需求', '投标需求步骤：\n1. 访问 /demand 浏览需求列表\n2. 点击感兴趣的需求\n3. 查看需求详情\n4. 点击"我要投标"\n5. 填写报价和服务方案\n6. 等待企业确认', '需求广场', '官方'],
    ['需求类型有哪些', '需求类型包括：AI视频制作、AI广告电影、AI设计（logo/VI/海报）、AI短剧漫剧、AI文旅宣传片、企业咨询等各类AI创作和咨询服务。', '需求广场', '官方'],
    
    // 培训课程
    ['有哪些培训课程', '培训课程包括：\n- OPC培训孵化（/opc-training）\n- OPC训练营（/opc-training-camp）\n- 企业Boss学院（/boss-academy）\n\n涵盖AI视频、AI设计、AI写作等各类技能培训。', '培训课程', '官方'],
    ['OPC培训是什么', 'OPC培训孵化（/opc-training）是平台的核心培训体系，包括：\n- AI基础入门\n- AI绘画进阶\n- AI视频制作\n- AI电影创作\n\n系统化学习路径+实战项目驱动+导师指导。', '培训课程', '官方'],
    
    // 创作者中心
    ['创作者中心', '创作者中心（/user/creator）是认证创作者的专属工作台：\n- 数据中心：浏览量、点赞、粉丝、收益\n- 内容管理：案例、教程、需求\n- 收益管理：收入明细、提现申请\n- 申请认证：升级创作者等级', '个人中心', '官方'],
    
    // 社区
    ['碳硅共振圈', '碳硅共振圈（/community）是平台的学习交流社区，包含：\n- 碳硅交流：创作者经验分享、AI技术讨论、作品展示\n- 赛事论坛：创作大赛、行业赛事信息\n\n加入我们，与创作者一起共振！', '社区', '官方'],
    ['社区论坛', '社区论坛（/community-forum）提供：\n- 创作者经验分享\n- AI技术讨论\n- 作品展示互评\n- 行业资讯交流\n\n点击 /community 进入碳硅共振圈。', '社区', '官方'],
    
    // 工具导航
    ['AI工具导航', 'AI工具导航（/tools）覆盖8大类别：\n- 大语言模型：ChatGPT、Claude、Gemini、DeepSeek\n- AI绘图：Midjourney、Stable Diffusion、Flux\n- AI视频：Sora、可灵、Runway\n- AI音频：Suno、Udio\n- AI编程：Cursor、GitHub Copilot\n- AI写作：Notion AI、Jasper\n- AI设计：Figma AI、Canva AI\n- AI Agent：Dify、Coze', '工具导航', '官方'],
    
    // 套餐价格
    ['启航版套餐', '启航版适合初创企业，包含：\n- AI就绪度诊断\n- 1个OPC咨询专家\n- 基础学习资源\n- 邮件支持', '价格套餐', '官方'],
    ['成长版套餐', '成长版适合成长期企业，包含：\n- 深度诊断报告\n- 3个OPC咨询专家\n- 优先匹配权\n- 专属顾问支持', '价格套餐', '官方'],
    ['旗舰版套餐', '旗舰版适合规模化企业，包含：\n- 全面战略诊断\n- 5个OPC咨询专家\n- 全优先级匹配\n- 7x24专属服务\n- 定制化AI升级方案', '价格套餐', '官方'],
    
    // 联系方式
    ['怎么联系客服', '联系半山AIX客服：\n- 邮箱：contact@banshan520.com\n- 微信：banshan520\n\n或点击右下角「半山灵图」智能助手！', '联系方式', '官方'],
    ['总部在哪里', '半山碳硅共生研究院总部位于吉隆坡，在深圳设有分支机构，为全球华人企业提供AI升级服务。', '联系方式', '官方'],
    
    // 常见问题
    ['需要多久完成诊断', '企业AI诊断通常需要10-15分钟完成问卷填写，系统将在5分钟内生成诊断报告。', '常见问题', '官方'],
    ['诊断结果有效期', '诊断结果有效期为3个月。企业AI应用情况变化时，建议重新诊断以获得最新方案。', '常见问题', '官方'],
    ['支持哪些语言', '目前支持简体中文、繁体中文、英文服务。其他语言需求可联系客服定制。', '常见问题', '官方']
  ]

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insertKnowledge.run(...item)
    }
  })
  insertMany(knowledgeData)
  console.log(`✅ 知识库初始化完成，导入 ${knowledgeData.length} 条数据`)
}

// 初始化需求数据
const demandCount = db.prepare('SELECT COUNT(*) as cnt FROM demands').get()
if (demandCount.cnt === 0) {
  const insertDemand = db.prepare(`
    INSERT INTO demands (
      title, description, category, budget, budget_min, budget_max,
      deadline, requirements, contact, company, company_desc,
      is_urgent, publisher_name, publisher_avatar, tags, status, views, likes, bids, is_certified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, 1)
  `)

  const demandData = [
    // AI短视频
    ['科技公司品牌宣传片制作', '需要制作一条30秒的品牌宣传片，突出新能源、智能驾驶、科技感等元素。', 'shortvideo', 6500, 6500, 6500, '7天内', '["有汽车类视频制作经验","能提供航拍素材","熟悉AE/PR后期制作"]', '138****8888', '某新能源汽车科技公司', '专注于新能源汽车研发与生产', 0, '张先生', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangSir', 342, 18, 12, '["品牌宣传","科技风","60秒"]'],
    ['房地产楼盘航拍宣传视频', '为高端楼盘制作航拍宣传视频，展示园林景观、户型优势和周边配套。', 'shortvideo', 10000, 10000, 10000, '10天内', '["具备无人机航拍资质","有地产项目经验"]', '微信：realty2024', '某地产开发集团', '国内知名地产开发商', 1, '李经理', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiMgr', 218, 11, 7, '["航拍风格","高端楼盘","3分钟"]'],
    ['互联网公司年会开场视频', '制作年会开场视频，需大气震撼，体现企业文化与未来愿景，3分钟。', 'shortvideo', 12500, 12500, 12500, '3天内', '["有企业年会视频案例","MG动画","可配音"]', '邮箱：hr@tech.com', '某互联网上市公司', '互联网科技巨头', 1, '王HR总', 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangHR', 589, 33, 20, '["年会","开场视频","震撼"]'],
    ['餐饮连锁品牌短视频合集', '制作15条餐饮短视频，突出食欲感和品牌调性，适合小红书传播。', 'shortvideo', 5000, 5000, 5000, '5天内', '["熟悉美食拍摄","快速交付"]', '手机：136****5678', '某餐饮管理公司', '连锁餐饮品牌', 0, '林老板', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LinBoss', 156, 7, 9, '["美食视频","小红书","15条"]'],
    
    // AI短剧
    ['AI短剧《总裁的心尖宠》5集制作', '制作都市总裁短剧全5集，每集3-5分钟，女主角要符合甜宠人设。', 'shortdrama', 15000, 15000, 15000, '20天内', '["有AI短剧制作经验","可竖屏输出","角色生成稳定"]', '微信：drama2024', '某短剧制作公司', '专业短剧制作公司', 0, '王编剧', 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangScript', 423, 26, 5, '["都市爱情","5集","竖屏"]'],
    ['悬疑推理短剧《消失的证人》3集', '制作悬疑推理短剧3集，氛围感强，镜头语言专业，横屏输出。', 'shortdrama', 12000, 12000, 12000, '15天内', '["有悬疑题材经验","场景转换流畅"]', '邮箱：studio@cinema.cn', '某影视孵化工作室', '专注悬疑推理题材', 1, '陈导演', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChenDir', 312, 19, 9, '["悬疑推理","3集","横屏"]'],
    ['古风武侠AI短剧《江湖令》全集', '制作古风武侠短剧《江湖令》全10集，角色造型要符合古风审美。', 'shortdrama', 27500, 27500, 27500, '30天内', '["古风角色设计能力强","有武侠题材经验"]', '138****9999', '武侠传媒科技', '专注古风武侠内容', 0, '武侠工作室', 'https://api.dicebear.com/7.x/avataaars/svg?seed=WuxiaStudio', 678, 41, 6, '["古风武侠","全集","竖屏"]'],
    
    // AI漫剧
    ['国风漫剧《倾城·长安》漫画分镜', '为国漫IP制作50话连载漫画，国风古装，需要稳定的角色一致性。', 'mangadrama', 8000, 8000, 8000, '12天内', '["国风美术能力","角色一致性控制"]', '微信：guofeng2024', '国风创意工作室', '专注国风漫画创作', 0, '赵漫画师', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhaoManga', 287, 15, 4, '["国风","古风","50话"]'],
    ['都市校园漫剧角色设计+分镜稿', '设计4个主角的校园漫剧角色，提供表情包、不同姿势的分镜稿。', 'mangadrama', 5500, 5500, 5500, '8天内', '["熟悉AI绘画角色一致性","可提供表情包"]', '手机：135****2233', '个人漫画创作者', '独立漫画创作者', 0, '周同学', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhouXTD', 194, 9, 6, '["校园","青春","角色设计"]'],
    
    // AI电影
    ['科幻短片《星际流浪者》10分钟', '制作科幻短片，设定在2150年，需要高质量CGI特效和专业配乐。', 'film', 40000, 40000, 40000, '30天内', '["电影级画面质量","特效经验丰富"]', '微信：indiefilm', '某独立电影公司', '独立电影制作公司', 0, '刘制片人', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiuProd', 892, 67, 3, '["科幻","10分钟","电影级"]'],
    ['公益微电影《回家的路》5分钟', '制作留守儿童主题公益微电影，温情写实风格，需感人至深。', 'film', 20000, 20000, 20000, '25天内', '["有公益题材经验","情感叙事能力"]', '邮箱：heart@public.org', '某公益基金会', '专注儿童公益', 1, '孙公益', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunPubGood', 456, 38, 8, '["公益","温情","5分钟"]'],
    
    // AI设计师
    ['新茶饮品牌全套VI设计', '设计新茶饮品牌全套VI，包含Logo、色彩体系、字体、包装、门店物料。', 'designer', 10000, 10000, 10000, '10天内', '["有餐饮品牌设计经验","可提供全套AI稿"]', '微信：teamarkt', '某新茶饮连锁品牌', '新兴茶饮品牌', 0, '茶颜老板', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChaYanBoss', 567, 42, 15, '["品牌VI","茶饮","全套"]'],
    ['游戏APP界面UI/UX设计20屏', '为国风手游设计20屏核心UI，包括主界面、战斗界面、商城等。', 'designer', 16000, 16000, 16000, '15天内', '["熟悉游戏UI设计规范","有实际游戏上线经验"]', '邮箱：game@studio.cn', '某手游开发公司', '游戏开发公司', 1, '吴游戏', 'https://api.dicebear.com/7.x/avataaars/svg?seed=WuGame', 423, 31, 11, '["UI设计","游戏","20屏"]'],
    ['电商节日海报系列设计（10张）', '设计618大促系列海报10张，风格活泼、颜色鲜明，适合站内Banner。', 'designer', 4000, 4000, 4000, '5天内', '["有电商海报案例","快速交付"]', '手机：137****4411', '某电商服饰品牌', '电商服饰品牌', 1, '郑电商', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhengEC', 312, 14, 22, '["海报设计","节日","电商"]'],
    
    // AI带货变现
    ['美妆品牌带货短视频20条', '制作20条美妆带货短视频，突出产品效果，适合抖音和TikTok投放。', 'commerce', 6500, 6500, 6500, '7天内', '["有美妆视频制作经验","了解带货转化逻辑"]', '微信：beautyshop', '某美妆集合品牌', '美妆集合品牌', 0, '林美妆', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LinMakeup', 678, 55, 18, '["美妆带货","20条","TikTok"]'],
    ['保健品直播话术脚本+视觉素材', '撰写保健品直播话术脚本并制作配套视觉素材，提升转化率。', 'commerce', 5000, 5000, 5000, '6天内', '["有直播运营经验","了解保健品合规要求"]', '手机：136****8866', '某保健品电商公司', '保健品电商头部', 0, '徐健康', 'https://api.dicebear.com/7.x/avataaars/svg?seed=XuHealth', 234, 12, 9, '["直播脚本","保健品","素材"]'],
    ['宠物食品小红书种草视频15条', '制作宠物食品种草视频15条，萌宠出镜，配合产品卖点文案。', 'commerce', 7500, 7500, 7500, '8天内', '["有宠物类内容经验","萌宠视频制作"]', '邮箱：pet@brand.cn', '某宠物食品品牌', '宠物食品品牌', 1, '何宠物', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HePet', 445, 37, 13, '["小红书","宠物","15条"]'],
  ]

  const insertManyDemands = db.transaction((items) => {
    for (const item of items) {
      insertDemand.run(...item)
    }
  })
  insertManyDemands(demandData)
  console.log(`✅ 需求广场初始化完成，导入 ${demandData.length} 条数据`)
}

console.log('✅ 数据库初始化完成')
export default db
