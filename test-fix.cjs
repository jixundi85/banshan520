const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8081');
  await page.waitForTimeout(500);
  
  // 设置诊断结果
  await page.evaluate(() => {
    localStorage.setItem('enterprise_diagnosis_result', JSON.stringify({level: 'L3 认证型', totalScore: 68}));
  });
  
  // 访问诊断结果页面
  await page.goto('http://localhost:8081/diagnosis-result');
  await page.waitForTimeout(2000);
  
  // 点击推荐OPC标签
  await page.click('text=推荐OPC');
  await page.waitForTimeout(500);
  
  // 点击紫色立即咨询按钮
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('立即咨询') && btn.className.includes('purple')) {
        btn.click();
        break;
      }
    }
  });
  
  await page.waitForTimeout(1000);
  
  // 检查 consultation_intent
  const intent = await page.evaluate(() => {
    const i = localStorage.getItem('consultation_intent');
    if (i) {
      const data = JSON.parse(i);
      return { type: data.type, name: data.opcData?.name };
    }
    return null;
  });
  console.log('consultation_intent:', JSON.stringify(intent));
  
  await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-fixed.png' });
  console.log('截图已保存');
  
  await browser.close();
  console.log('测试完成');
}

test().catch(e => console.error(e.message));
