const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 0. 先设置诊断数据
  await page.goto('http://localhost:8080');
  await page.waitForTimeout(1000);
  
  await page.evaluate(() => {
    localStorage.setItem('enterprise_diagnosis_result', JSON.stringify({
      level: 'L3 认证型',
      totalScore: 68,
      scores: { readiness: 70, data: 65, security: 60, budget: 75 }
    }));
    console.log('诊断数据已设置');
  });
  
  // 1. 访问诊断结果页
  await page.goto('http://localhost:8080/diagnosis-result');
  await page.waitForTimeout(2000);
  
  // 检查页面内容
  const content = await page.evaluate(() => document.body.innerText.substring(0, 500));
  console.log('页面内容:', content);
  
  // 2. 点击推荐OPC
  const opcTab = await page.$('text=推荐OPC');
  if (opcTab) {
    await opcTab.click();
    console.log('✓ 点击了推荐OPC');
  } else {
    console.log('✗ 未找到推荐OPC标签');
  }
  await page.waitForTimeout(1000);
  
  // 3. 点击紫色立即咨询按钮
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    console.log('找到按钮数:', btns.length);
    for (const btn of btns) {
      if (btn.textContent.includes('立即咨询')) {
        console.log('按钮class:', btn.className);
        if (btn.className.includes('purple')) {
          btn.click();
          return true;
        }
      }
    }
    return false;
  });
  
  if (clicked) {
    console.log('✓ 点击了紫色立即咨询按钮');
  } else {
    console.log('✗ 未找到紫色按钮');
  }
  
  await page.waitForTimeout(2000);
  
  // 4. 检查URL和consultation_intent
  console.log('URL:', page.url());
  
  const intent = await page.evaluate(() => localStorage.getItem('consultation_intent'));
  console.log('consultation_intent:', intent ? '已设置' : '未设置');
  
  if (intent) {
    const data = JSON.parse(intent);
    console.log('  type:', data.type);
    console.log('  name:', data.opcData?.name);
  }
  
  // 5. 截图
  await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-result.png', fullPage: true });
  console.log('截图已保存');
  
  await browser.close();
})().catch(e => console.error('Error:', e.message));
