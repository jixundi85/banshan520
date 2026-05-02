const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8081');
  await page.waitForTimeout(500);
  
  // 设置诊断结果
  await page.evaluate(() => {
    localStorage.setItem('enterprise_diagnosis_result', JSON.stringify({
      level: 'L3 认证型',
      totalScore: 68,
      scores: { readiness: 70, data: 65, security: 60, budget: 75 }
    }));
  });
  
  // 访问诊断结果页面
  await page.goto('http://localhost:8081/diagnosis-result');
  await page.waitForTimeout(2000);
  
  // 点击推荐OPC标签
  await page.click('text=推荐OPC');
  await page.waitForTimeout(1000);
  
  // 点击紫色立即咨询按钮
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('立即咨询') && btn.className.includes('purple')) {
        btn.click();
        console.log('Clicked purple button');
        break;
      }
    }
  });
  
  await page.waitForTimeout(1500);
  
  // 检查 consultation_intent
  const intent = await page.evaluate(() => {
    const i = localStorage.getItem('consultation_intent');
    return i;
  });
  
  if (intent) {
    const data = JSON.parse(intent);
    console.log('✓ consultation_intent 已设置');
    console.log('  type:', data.type);
    console.log('  name:', data.opcData?.name);
    console.log('  category:', data.opcData?.category);
  } else {
    console.log('✗ consultation_intent 未设置');
  }
  
  // 截图
  await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-result.png' });
  console.log('Screenshot saved');
  
  await browser.close();
}

test().catch(e => console.error('Error:', e.message));
