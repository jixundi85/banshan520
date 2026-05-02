const { chromium } = require('playwright');
(async()=>{
  const b = await chromium.launch();
  const p = await b.newPage();
  const logs = [];
  p.on('console', m => logs.push(m.text()));
  
  await p.goto('http://localhost:8081/diagnosis-result');
  await p.waitForTimeout(2000);
  await p.click('text=推荐OPC');
  await p.waitForTimeout(500);
  await p.evaluate(()=>{
    const btns = document.querySelectorAll('button');
    for(const btn of btns){
      if(btn.textContent.includes('立即咨询') && btn.className.includes('purple')){
        btn.click();
        break;
      }
    }
  });
  await p.waitForTimeout(2000);
  
  console.log('URL:', p.url());
  const intent = await p.evaluate(() => localStorage.getItem('consultation_intent'));
  console.log('consultation_intent:', intent ? JSON.parse(intent) : null);
  
  await p.screenshot({path: '/Users/jxd85/WorkBuddy/20260413132001/test-result.png'});
  await b.close();
})().catch(e => console.error(e.message));
