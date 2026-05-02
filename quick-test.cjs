const { chromium } = require('playwright');
(async()=>{
  const b = await chromium.launch({headless: false});
  const p = await b.newPage();
  await p.goto('http://localhost:8080');
  await p.waitForTimeout(500);
  
  // 设置诊断结果
  await p.evaluate(()=>{
    localStorage.setItem('enterprise_diagnosis_result', JSON.stringify({
      level:'L3 认证型',
      totalScore:68,
      companyName:'测试公司'
    }));
  });
  
  // 访问诊断结果页
  await p.goto('http://localhost:8080/diagnosis-result');
  await p.waitForTimeout(2000);
  
  // 点击推荐OPC标签
  const opcTab = await p.$('text=推荐OPC');
  if(opcTab) await opcTab.click();
  await p.waitForTimeout(1000);
  
  // 点击紫色立即咨询按钮
  await p.evaluate(()=>{
    const btns = Array.from(document.querySelectorAll('button'));
    for(const btn of btns){
      if(btn.textContent.includes('立即咨询') && btn.className.includes('purple')){
        btn.click();
        return true;
      }
    }
  });
  
  await p.waitForTimeout(2000);
  
  // 检查 consultation_intent
  const intent = await p.evaluate(()=>localStorage.getItem('consultation_intent'));
  if(intent){
    const d = JSON.parse(intent);
    console.log('OK - type:', d.type, 'name:', d.opcData?.name);
  } else {
    console.log('FAIL - consultation_intent is null');
  }
  
  await p.screenshot({path:'/Users/jxd85/WorkBuddy/20260413132001/result.png'});
  await b.close();
})().catch(e=>console.error(e.message));
