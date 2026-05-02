const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 设置 localStorage
  await page.goto('http://localhost:8080');
  await page.waitForTimeout(500);
  
  await page.evaluate(() => {
    const diagnosisResult = {
      companyName: '测试科技有限公司',
      industry: '科技互联网',
      level: 'L3 认证型',
      totalScore: 68,
      scores: { readiness: 70, data: 65, security: 60, budget: 75 }
    };
    localStorage.setItem('enterprise_diagnosis_result', JSON.stringify(diagnosisResult));
  });
  
  // 直接导航
  await page.goto('http://localhost:8080/diagnosis-result');
  await page.waitForTimeout(3000);
  
  // 截图
  await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-page.png' });
  
  // 获取页面内容
  const text = await page.evaluate(() => document.body.innerText);
  console.log('页面文本:', text.substring(0, 300));
  
  await browser.close();
})().catch(e => console.error(e.message));
