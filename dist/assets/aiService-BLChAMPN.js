const g={imageGen:{provider:"pollinations"}},w={async chat(e,t="glm-4"){return{choices:[{message:{content:v(e)}}]}},async creativeWrite(e,t="story"){var l,i,n;const a={story:`请根据以下主题写一个引人入胜的短篇故事（800-1500字）：

主题：${e}

要求：
1. 有清晰的故事线和人物动机
2. 情节有冲突和转折
3. 结尾有惊喜或深意
4. 适合AI视频制作`,drama:`请根据以下主题创作一个短剧剧本：

主题：${e}

要求：
1. 包含完整的场景描述
2. 有人物对白和动作指示
3. 适合1-3分钟的短视频
4. 有明确的情感高潮`,advertisement:`请根据以下产品特点创作一个广告文案：

产品：${e}

要求：
1. 前3秒有强力钩子
2. 突出产品核心卖点
3. 有情感共鸣点
4. 结尾有明确的行动号召`};return((n=(i=(l=(await this.chat([{role:"user",content:a[t]||a.story}])).choices)==null?void 0:l[0])==null?void 0:i.message)==null?void 0:n.content)||""}},u={async generatePollinations(e,t={}){const{width:a=1024,height:c=1024,model:l="flux",seed:i=Math.floor(Math.random()*1e6)}=t;return{imageUrl:`https://image.pollinations.ai/${new URLSearchParams({prompt:e,width:a.toString(),height:c.toString(),model:l,seed:i.toString(),nolog:"true"}).toString()}`,seed:i,prompt:e}},async generate(e,t={}){const a=g.imageGen.provider;try{switch(a){case"pollinations":return await this.generatePollinations(e,t);case"stability":return await this.generateStability(e,t);case"dall-e":return await this.generateDalle(e,t);default:return await this.generatePollinations(e,t)}}catch(c){return console.error("图像生成失败，尝试备选方案:",c),await this.generatePollinations(e,t)}},async generateStability(e,t={}){return await this.generatePollinations(e,t)},async generateDalle(e,t={}){return await this.generatePollinations(e,t)}},f={async synthesizeXunfei(e,t={}){return this.generateMockAudio(e,t)},async synthesize(e,t={}){try{return await this.synthesizeXunfei(e,t)}catch{return this.generateMockAudio(e,t)}},generateMockAudio(e,t={}){return{audioUrl:null,duration:Math.max(5,Math.ceil(e.length/5)),text:e,mock:!0}}},U={async imageGeneration(e,t){const{prompt:a,width:c=1024,height:l=1024,style:i="realistic"}=e;t==null||t({step:"preparing",progress:10,message:"正在准备生成参数..."}),t==null||t({step:"generating",progress:30,message:"正在调用AI图像生成模型..."});const n=await u.generate(a,{width:c,height:l,style:i});return t==null||t({step:"processing",progress:70,message:"正在处理生成结果..."}),t==null||t({step:"completed",progress:100,message:"生成完成!"}),{type:"image",imageUrl:n.imageUrl,prompt:a,width:c,height:l,seed:n.seed}},async videoGeneration(e,t){const{prompt:a,duration:c=5,style:l="cinematic"}=e;t==null||t({step:"analyzing",progress:10,message:"正在分析视频场景..."}),t==null||t({step:"generating",progress:40,message:"正在生成关键帧..."});const i=await u.generate(`${a}, high quality, key frame for video generation`,{width:1280,height:720});return t==null||t({step:"interpolating",progress:70,message:"正在进行帧间插值..."}),t==null||t({step:"encoding",progress:90,message:"正在编码视频..."}),t==null||t({step:"completed",progress:100,message:"视频生成完成!"}),{type:"video",videoUrl:i.imageUrl,thumbnailUrl:i.imageUrl,prompt:a,duration:c,mock:!0}},async audioSynthesis(e,t){const{text:a,voice:c="female_youthful",speed:l=1}=e;t==null||t({step:"analyzing",progress:15,message:"正在分析文本内容..."}),t==null||t({step:"synthesizing",progress:50,message:"正在进行语音合成..."});const i=await f.synthesize(a,{voice:c,speed:l});return t==null||t({step:"processing",progress:85,message:"正在优化音频质量..."}),t==null||t({step:"completed",progress:100,message:"音频生成完成!"}),{type:"audio",audioUrl:i.audioUrl,duration:i.duration,text:a,mock:i.mock}},async scriptGeneration(e,t){const{theme:a,genre:c="drama",duration:l=60}=e;t==null||t({step:"analyzing",progress:10,message:"正在分析主题方向..."});const i=await w.creativeWrite(a,c);t==null||t({step:"structuring",progress:40,message:"正在构建剧本结构..."});const n=S(i);t==null||t({step:"generating",progress:70,message:"正在生成场景分镜..."});const m=await Promise.all(n.slice(0,3).map(async(p,h)=>{const s=await u.generate(`${p.description}, cinematic, storyboard style`,{width:640,height:360});return{...p,imageUrl:s.imageUrl}}));return t==null||t({step:"completed",progress:100,message:"剧本生成完成!"}),{type:"script",content:i,scenes:m,totalScenes:n.length,estimatedDuration:n.length*15}},async adGeneration(e,t){const{productName:a,productDesc:c,style:l="modern",formats:i=["1:1"]}=e;t==null||t({step:"analyzing",progress:10,message:"正在分析产品特点..."});const n=`${a}, ${c}, ${l} style, professional product photography`,m=[];for(const p of i){const[h,s]=p.split(":").map(Number),d=Math.max(h,s)*512,y=Math.min(h,s)*512;t==null||t({step:"generating",progress:30+i.indexOf(p)/i.length*50,message:`正在生成${p}尺寸广告图...`});const r=await u.generate(n,{width:d,height:y});m.push({format:p,imageUrl:r.imageUrl,width:d,height:y})}return t==null||t({step:"completed",progress:100,message:"广告素材生成完成!"}),{type:"ad",productName:a,images:m,formats:i}}};function v(e){var a;const t=((a=e[e.length-1])==null?void 0:a.content)||"";return t.includes("剧本")||t.includes("故事")?`【AI创作助手 - 短剧剧本】

🎬 第一幕：开场
场景：现代都市，日内

（咖啡厅内，白领小林独自坐在角落，神情落寞）

小林：（叹气）每天都是这样，两点一线的生活，什么时候是个头...

（手机响起，一条神秘短信）

短信：想知道人生另一种可能吗？今晚22:00，旧工厂见。

（小林犹豫片刻，眼神中闪过一丝好奇）

小林：（自语）反正也没什么可失去的...

🎬 第二幕：转折
场景：废弃工厂，夜外

（昏暗的灯光下，一个神秘的箱子）

（小林走近，发现箱子里是一面古老的镜子）

（镜面泛起涟漪，小林伸手触碰——）

旁白：你永远不知道，下一秒会遇见什么。

🎬 第三幕：高潮
场景：镜子中的异世界

（小林发现自己置身于一个奇幻空间，周围是流动的数字代码）

神秘人：欢迎来到第五栖息地，这里是碳与硅共生的新世界。

（小林惊讶地环顾四周）

小林：这是...什么地方？

神秘人：这是你内心深处的另一个自己，等待被唤醒。

【未完待续...】

——剧本由AI辅助生成，可根据实际需求调整`:t.includes("广告")||t.includes("产品")?`【AI广告文案】

📺 产品广告脚本（30秒）

【开场 - 3秒】
🎬 画面：清晨第一缕阳光照进窗户
💬 旁白：每一天，都是全新的开始

【痛点 - 5秒】
🎬 画面：上班族手忙脚乱找东西
💬 旁白：还在为琐事烦恼？

【产品展示 - 10秒】
🎬 画面：产品特写+使用场景
💬 旁白：XX智能助手，帮你规划每一步

【卖点 - 8秒】
🎬 画面：用户满意笑容
💬 旁白：省时、省力、更省心

【收尾 - 4秒】
💬 旁白：即刻体验，限时优惠！
📱 扫码下载：xxx.com`:`【AI回复助手】

您好！感谢您的提问。

根据您提供的信息，我为您整理了以下内容：

1. **核心要点**
   - 重点突出第一个关键信息
   - 强调第二个重要内容
   - 补充第三个细节说明

2. **建议方案**
   - 方案A：适合注重效率的用户
   - 方案B：适合追求品质的用户
   - 方案C：适合预算有限的用户

3. **下一步行动**
   - 立即开始 vs 持续观望
   - 具体执行步骤
   - 预期效果评估

如有其他问题，欢迎继续咨询！`}function S(e){const t=[],a=/🎬\s*第[一二三四五六七八九十]+[幕章集]：[^\n]+/g,c=e.match(a)||["第一幕：开场","第二幕：发展","第三幕：高潮","第四幕：结尾"],l=["都市白领在咖啡厅沉思，阳光透过玻璃洒在脸上","神秘短信打破平静，手机屏幕发出微光","夜色中来到废弃工厂，环境阴森神秘","发现古老的镜子，镜面泛起奇异光芒","镜中出现另一个世界，数字代码流动","与神秘人对话，揭示新世界的秘密","主角下定决心，走向未知","完美的结局，呼应开头"];return c.forEach((i,n)=>{const m=i.replace("🎬 ","").trim();t.push({id:n+1,title:m,description:l[n]||`场景${n+1}`,duration:15+Math.floor(Math.random()*10),dialogue:`（场景${n+1}对话内容）`})}),t}export{u as i,U as w,w as z};
