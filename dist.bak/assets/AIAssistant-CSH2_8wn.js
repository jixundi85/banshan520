import{u as D,o as E,r as n,j as e,d as C,S as U}from"./index-7IOuKYAR.js";import{B as M}from"./brain-BDmhMuIH.js";import{T as R}from"./target-D6eCH6hc.js";import{L as Q}from"./lightbulb-BAxPUzld.js";import{T as B}from"./trending-up-Co7pIkOv.js";import{S as K}from"./settings-Db_LDTuX.js";import{R as L}from"./refresh-cw-Cw84O-Di.js";import{C as P}from"./copy-B1lrLXfp.js";import{T as z}from"./thumbs-up-CtwQZbnz.js";import{T as F}from"./thumbs-down-B4gLZGd3.js";import{C as O}from"./chevron-right-aaIhtBFi.js";const j=[{id:"diagnosis",name:"AI诊断师",icon:M,color:"from-violet-500 to-purple-600",bgColor:"bg-violet-500/10",desc:"深度分析企业AI现状，生成个性化诊断报告",capabilities:["AI成熟度评估","差距分析","升级路线图"],prompt:"你是一位专业的AI转型顾问，擅长分析企业的AI应用现状和潜力。"},{id:"strategy",name:"战略规划师",icon:R,color:"from-cyan-500 to-blue-600",bgColor:"bg-cyan-500/10",desc:"制定AI驱动增长策略，优化商业模式",capabilities:["商业模式优化","增长策略","竞争分析"],prompt:"你是一位经验丰富的商业战略顾问，专注于AI时代的商业创新。"},{id:"creative",name:"创意顾问",icon:Q,color:"from-amber-500 to-orange-600",bgColor:"bg-amber-500/10",desc:"激发创意灵感，优化内容营销策略",capabilities:["创意头脑风暴","内容策略","爆款分析"],prompt:"你是一位资深创意顾问，精通AIGC内容创作和营销传播。"},{id:"ops",name:"运营专家",icon:B,color:"from-emerald-500 to-teal-600",bgColor:"bg-emerald-500/10",desc:"优化运营流程，提升团队协作效率",capabilities:["流程优化","团队管理","效率提升"],prompt:"你是一位卓越的运营管理专家，擅长流程优化和效率提升。"}],X={diagnosis:["分析我们公司目前的AI成熟度","我们和行业领先者差距在哪里？","制定3个月的AI升级计划"],strategy:["如何用AI提升电商转化率？","我们的商业模式有哪些AI升级机会？","分析竞品的AI布局策略"],creative:["帮我策划一个AI短剧营销方案","分析近期爆款内容的共同点","如何用AI提升内容产出效率？"],ops:["优化内容生产团队的工作流程","如何用AI降低运营成本？","建立AI辅助的协作机制"]},l={USER:"user",ASSISTANT:"assistant"};function te(){var g;D();const{showToast:v}=E(),p=n.useRef(null),b=n.useRef(null),[i,N]=n.useState("diagnosis"),[o,d]=n.useState([{id:1,type:l.ASSISTANT,role:"diagnosis",content:`您好！我是半山AIX的专业AI顾问。

我可以帮助您：
• 分析企业的AI现状和升级潜力
• 制定个性化的AI转型策略
• 优化内容创作和运营流程

请告诉我您想了解的具体问题，或者选择一个角色类型获得专业建议。`,timestamp:new Date}]),[r,x]=n.useState(""),[m,u]=n.useState(!1),[y,h]=n.useState(!1),[f,A]=n.useState(.7),t=j.find(s=>s.id===i),I=()=>{var s;(s=p.current)==null||s.scrollIntoView({behavior:"smooth"})};n.useEffect(()=>{I()},[o]);const w=async()=>{if(!r.trim()||m)return;const s={id:Date.now(),type:l.USER,content:r,timestamp:new Date};d(a=>[...a,s]),x(""),u(!0),setTimeout(()=>{const a=S(r,i),c={id:Date.now()+1,type:l.ASSISTANT,role:i,content:a,timestamp:new Date};d($=>[...$,c]),u(!1)},1500+Math.random()*1e3)},S=(s,a)=>({diagnosis:`根据您的问题，我来帮您分析：
**🔍 现状评估**
1. **技术基础** - 需要评估现有的数字化程度
2. **人员能力** - 团队对AI工具的熟悉程度
3. **业务场景** - 哪些环节适合引入AI
**📋 建议路线图**
| 阶段 | 时间 | 目标 |
|------|------|------|
| 基础期 | 1-2周 | 完成诊断+培训 |
| 试点期 | 3-8周 | 2-3个场景落地 |
| 扩展期 | 3-6月 | 全面推广 |
**💡 关键建议**
• 先从高频、低风险场景入手
• 重视员工培训和变革管理
• 建立AI使用规范和数据安全机制
需要我进一步展开哪个方面？`,strategy:`这是一个很好的战略问题！让我来帮您分析：
**🎯 核心机会识别**
1. **内容生产自动化** - AI可以提升内容产出效率300%+
2. **客户洞察智能化** - 通过AI分析用户行为数据
3. **营销精准化** - AI驱动的个性化推荐
**📊 实施优先级**
• P0: 内容生产 + 客服自动化
• P1: 数据分析 + 用户洞察
• P2: 流程自动化 + 决策支持
**⚡ 快速见效案例**
• 某电商：通过AI生成产品描述，效率提升500%
• 某品牌：用AI做社媒内容，流量增长200%
• 某企业：AI客服解决80%常见问题
您目前最想从哪个方向突破？我可以给您更具体的方案。`,creative:`好问题！让我从创意角度帮您分析：
**💡 创意策略**
1. **内容差异化** - 利用AI打造独特风格
2. **规模化生产** - 用AI保证内容质量的同时提升产量
3. **数据驱动** - 通过AI分析爆款规律
**🎬 创意方向建议**
• **竖屏短剧**：3-5分钟，剧情紧凑，适合AI制作
• **种草视频**：产品展示+场景化内容
• **知识科普**：专业内容+AI可视化
**📈 爆款公式**
• 情感共鸣 + 视觉冲击 + 悬念设置 + 价值输出
您想专注于哪个内容方向？我可以帮您策划具体的创意方案。`,ops:`运营优化是AI落地的关键领域！让我来分析：
**⚙️ 流程优化方向**
**1. 内容生产流**
需求 → AI生成 → 人工审核 → 发布 → 数据分析
AI可介入：需求理解、素材生成、初稿撰写
**2. 团队协作流**
• 早会用AI做数据简报
• 任务分配用AI辅助
• 复盘用AI生成报告
**3. 效率提升指标**
• 写稿：2小时 → 20分钟 (6倍提升)
• 设计：3小时 → 30分钟 (6倍提升)
• 数据整理：1小时 → 5分钟 (12倍提升)
**🎯 建议先从哪些环节优化？**
您目前运营中最大的痛点是什么？`})[a]||"感谢您的提问！让我仔细分析后给您回复。",T=s=>{var a;x(s),(a=b.current)==null||a.focus()},k=s=>{navigator.clipboard.writeText(s),v("已复制到剪贴板","success")};return e.jsxs("div",{className:"h-[calc(100vh-64px)] bg-slate-900 flex",children:[e.jsxs("div",{className:"w-80 bg-slate-800/60 border-r border-white/5 p-4 flex flex-col",children:[e.jsxs("div",{className:"mb-6",children:[e.jsxs("h2",{className:"text-lg font-bold text-white mb-2 flex items-center gap-2",children:[e.jsx(C,{className:"w-5 h-5 text-violet-400"}),"专业顾问"]}),e.jsx("p",{className:"text-gray-400 text-sm",children:"选择不同角色获得专业建议"})]}),e.jsx("div",{className:"space-y-3 flex-1 overflow-y-auto",children:j.map(s=>e.jsxs("button",{onClick:()=>N(s.id),className:`w-full p-4 rounded-xl text-left transition-all ${i===s.id?`bg-gradient-to-br ${s.color} shadow-lg`:"bg-white/5 hover:bg-white/10"}`,children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:`w-10 h-10 rounded-xl ${s.bgColor} flex items-center justify-center ${i===s.id?"bg-white/20":""}`,children:e.jsx(s.icon,{className:`w-5 h-5 ${i===s.id?"text-white":"text-violet-400"}`})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:`font-semibold ${i===s.id,"text-white"}`,children:s.name}),e.jsx("p",{className:`text-xs mt-1 ${i===s.id?"text-white/80":"text-gray-400"}`,children:s.desc})]})]}),i===s.id&&e.jsx("div",{className:"mt-3 flex flex-wrap gap-1",children:s.capabilities.map((a,c)=>e.jsx("span",{className:"px-2 py-0.5 bg-white/10 text-white/80 text-xs rounded-full",children:a},c))})]},s.id))}),e.jsxs("button",{onClick:()=>h(!0),className:"mt-4 flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors",children:[e.jsx(K,{className:"w-4 h-4"}),e.jsx("span",{className:"text-sm",children:"设置"})]})]}),e.jsxs("div",{className:"flex-1 flex flex-col",children:[e.jsxs("div",{className:"h-16 px-6 border-b border-white/5 flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:`w-10 h-10 rounded-xl bg-gradient-to-br ${t==null?void 0:t.color} flex items-center justify-center`,children:t&&e.jsx(t.icon,{className:"w-5 h-5 text-white"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold",children:t==null?void 0:t.name}),e.jsxs("p",{className:"text-gray-500 text-xs flex items-center gap-1",children:[e.jsx("span",{className:"w-2 h-2 bg-emerald-400 rounded-full"}),"在线"]})]})]}),e.jsx("div",{className:"flex items-center gap-2",children:e.jsx("button",{onClick:()=>d([{id:Date.now(),type:l.ASSISTANT,role:i,content:`您好！我是半山AIX的${t==null?void 0:t.name}。

${t==null?void 0:t.desc}

请问有什么可以帮您？`,timestamp:new Date}]),className:"p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors",children:e.jsx(L,{className:"w-5 h-5"})})})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-6 space-y-6",children:[o.map(s=>e.jsxs("div",{className:`flex gap-4 ${s.type===l.USER?"justify-end":""}`,children:[s.type===l.ASSISTANT&&e.jsx("div",{className:`w-10 h-10 rounded-xl bg-gradient-to-br ${t==null?void 0:t.color} flex-shrink-0 flex items-center justify-center`,children:t&&e.jsx(t.icon,{className:"w-5 h-5 text-white"})}),e.jsxs("div",{className:`max-w-[70%] ${s.type===l.USER?"text-right":""}`,children:[e.jsx("div",{className:`inline-block p-4 rounded-2xl ${s.type===l.USER?"bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-br-sm":"bg-white/10 text-white rounded-bl-sm"}`,children:e.jsx("div",{className:"whitespace-pre-wrap leading-relaxed",children:s.content})}),s.type===l.ASSISTANT&&e.jsxs("div",{className:"flex items-center gap-2 mt-2",children:[e.jsx("button",{onClick:()=>k(s.content),className:"p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors",children:e.jsx(P,{className:"w-4 h-4"})}),e.jsx("button",{className:"p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors",children:e.jsx(z,{className:"w-4 h-4"})}),e.jsx("button",{className:"p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors",children:e.jsx(F,{className:"w-4 h-4"})})]})]}),s.type===l.USER&&e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold",children:"我"})]},s.id)),m&&e.jsxs("div",{className:"flex gap-4",children:[e.jsx("div",{className:`w-10 h-10 rounded-xl bg-gradient-to-br ${t==null?void 0:t.color} flex-shrink-0 flex items-center justify-center`,children:t&&e.jsx(t.icon,{className:"w-5 h-5 text-white"})}),e.jsx("div",{className:"bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm",children:e.jsxs("div",{className:"flex gap-1",children:[e.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"0ms"}}),e.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"150ms"}}),e.jsx("div",{className:"w-2 h-2 bg-gray-400 rounded-full animate-bounce",style:{animationDelay:"300ms"}})]})})]}),e.jsx("div",{ref:p})]}),!o.length||o.length<=2?e.jsxs("div",{className:"px-6 pb-4",children:[e.jsx("p",{className:"text-gray-500 text-sm mb-3",children:"快捷问题："}),e.jsx("div",{className:"flex flex-wrap gap-2",children:(g=X[i])==null?void 0:g.map((s,a)=>e.jsxs("button",{onClick:()=>T(s),className:"px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors flex items-center gap-2",children:[e.jsx(O,{className:"w-4 h-4"}),s]},a))})]}):null,e.jsxs("div",{className:"p-4 border-t border-white/5",children:[e.jsxs("div",{className:"flex items-end gap-4",children:[e.jsx("div",{className:"flex-1 relative",children:e.jsx("textarea",{ref:b,value:r,onChange:s=>x(s.target.value),onKeyDown:s=>{s.key==="Enter"&&!s.shiftKey&&(s.preventDefault(),w())},placeholder:`向${t==null?void 0:t.name}提问...`,rows:1,className:"w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-violet-500/50"})}),e.jsxs("button",{onClick:w,disabled:!r.trim()||m,className:"px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium rounded-xl hover:from-violet-400 hover:to-fuchsia-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",children:[e.jsx(U,{className:"w-5 h-5"}),"发送"]})]}),e.jsx("p",{className:"text-gray-500 text-xs mt-2 text-center",children:"AI助手仅供参考，实际决策请结合业务情况判断"})]})]}),y&&e.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-md shadow-2xl",children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b border-white/10",children:[e.jsx("h3",{className:"text-xl font-bold text-white",children:"助手设置"}),e.jsx("button",{onClick:()=>h(!1),className:"w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white",children:"✕"})]}),e.jsx("div",{className:"p-6 space-y-6",children:e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("label",{className:"text-white font-medium",children:"创意度"}),e.jsx("span",{className:"text-violet-400 font-mono",children:f.toFixed(1)})]}),e.jsx("input",{type:"range",min:"0",max:"1",step:"0.1",value:f,onChange:s=>A(parseFloat(s.target.value)),className:"w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-violet-500"}),e.jsxs("div",{className:"flex justify-between text-xs text-gray-500 mt-1",children:[e.jsx("span",{children:"精确"}),e.jsx("span",{children:"平衡"}),e.jsx("span",{children:"创意"})]})]})}),e.jsx("div",{className:"px-6 pb-6",children:e.jsx("button",{onClick:()=>h(!1),className:"w-full py-3 bg-violet-500 text-white font-medium rounded-xl hover:bg-violet-400 transition-colors",children:"保存设置"})})]})})]})}export{te as default};
