const { chromium } = require('playwright');

async function test() {
  console.log('=== 测试 OPC 咨询专家匹配 ===\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const diagnosisData = {
    companyName: '测试科技有限公司',
    industry: '科技互联网',
    level: 'L3 认证型',
    totalScore: 68,
    scores: { readiness: 70, data: 65, security: 60, budget: 75 },
    summary: '企业已有一定AI基础，正在寻求规模化应用'
  };
  
  try {
    // 1. 先访问首页设置 localStorage
    console.log('1. 访问首页并设置诊断数据...');
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(2000);
    
    await page.evaluate((data) => {
      localStorage.setItem('enterprise_diagnosis_result', JSON.stringify(data));
    }, diagnosisData);
    
    // 2. 访问诊断结果页
    console.log('2. 访问诊断结果页...');
    await page.goto('http://localhost:8080/diagnosis-result');
    await page.waitForTimeout(3000);
    
    // 检查页面文本
    const text = await page.evaluate(() => document.body.innerText);
    
    if (text.includes('推荐OPC')) {
      console.log('✓ 找到推荐OPC标签，点击...');
      await page.click('text=推荐OPC');
      await page.waitForTimeout(2000);
      
      // 检查紫色立即咨询按钮
      const hasPurple = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.some(btn => 
          btn.textContent.includes('立即咨询') && 
          btn.className.includes('purple')
        );
      });
      
      if (hasPurple) {
        console.log('✓ 找到紫色立即咨询按钮，点击...');
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          for (const btn of btns) {
            if (btn.textContent.includes('立即咨询') && btn.className.includes('purple')) {
              btn.click();
              break;
            }
          }
        });
        await page.waitForTimeout(3000);
        console.log('✓ 跳转完成，当前URL:', page.url());
      }
    } else {
      console.log('⚠ 页面未显示诊断结果');
      // 检查 localStorage
      const stored = await page.evaluate(() => localStorage.getItem('enterprise_diagnosis_result'));
      console.log('localStorage:', stored ? '已设置' : '未设置');
    }
    
    // 3. 检查 consultation_intent
    const intent = await page.evaluate(() => localStorage.getItem('consultation_intent'));
    if (intent) {
      const data = JSON.parse(intent);
      console.log('\n✓ consultation_intent 已设置');
      console.log('  type:', data.type);
      console.log('  专家:', data.opcData?.name);
    } else {
      console.log('\n✗ consultation_intent 未设置');
    }
    
    // 4. 截图
    await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-result.png', fullPage: true });
    console.log('\n截图已保存');
    
  } catch (error) {
    console.error('错误:', error.message);
  }
  
  await browser.close();
  console.log('\n=== 测试完成 ===');
}

test();
