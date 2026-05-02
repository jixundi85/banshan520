const { chromium } = require('playwright');

async function test() {
  console.log('=== 开始完整测试 ===\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. 先完成企业诊断
    console.log('1. 访问首页...');
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(2000);
    
    // 2. 设置诊断结果
    console.log('2. 设置诊断数据...');
    await page.evaluate(() => {
      localStorage.setItem('enterprise_diagnosis_result', JSON.stringify({
        companyName: '测试科技有限公司',
        industry: '科技互联网',
        level: 'L3 认证型',
        totalScore: 68,
        scores: { readiness: 70, data: 65, security: 60, budget: 75 },
        summary: '企业已有一定AI基础，正在寻求规模化应用'
      }));
    });
    
    // 3. 访问诊断结果页
    console.log('3. 访问诊断结果页...');
    await page.goto('http://localhost:8080/diagnosis-result');
    await page.waitForTimeout(3000);
    
    // 4. 检查页面是否显示推荐OPC
    const pageText = await page.evaluate(() => document.body.innerText);
    if (pageText.includes('推荐OPC')) {
      console.log('4. 点击推荐OPC标签...');
      await page.click('text=推荐OPC');
      await page.waitForTimeout(2000);
    } else {
      console.log('4. 页面未找到推荐OPC，截图查看...');
      await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/step1.png' });
    }
    
    // 5. 检查是否有紫色立即咨询按钮
    console.log('5. 检查OPC咨询专家区域...');
    const consultBtns = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const purpleBtns = btns.filter(btn => {
        return btn.textContent.includes('立即咨询') && 
               (btn.className.includes('purple') || btn.className.includes('from-purple'));
      });
      return purpleBtns.map(btn => ({
        text: btn.textContent.trim(),
        className: btn.className.substring(0, 100)
      }));
    });
    
    if (consultBtns.length > 0) {
      console.log('找到紫色按钮:', consultBtns.length, '个');
      console.log('点击第一个紫色立即咨询按钮...');
      
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        for (const btn of btns) {
          if (btn.textContent.includes('立即咨询') && 
              (btn.className.includes('purple') || btn.className.includes('from-purple'))) {
            btn.click();
            break;
          }
        }
      });
      
      await page.waitForTimeout(3000);
      console.log('6. 跳转后URL:', page.url());
    } else {
      console.log('未找到紫色立即咨询按钮');
    }
    
    // 7. 检查结果
    console.log('\n7. 检查测试结果...');
    const intent = await page.evaluate(() => localStorage.getItem('consultation_intent'));
    if (intent) {
      const data = JSON.parse(intent);
      console.log('✓ consultation_intent 已设置');
      console.log('  type:', data.type);
      console.log('  专家:', data.opcData?.name);
    } else {
      console.log('✗ consultation_intent 未设置');
    }
    
    // 8. 截图保存最终结果
    await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/final-result.png', fullPage: true });
    console.log('\n8. 截图已保存: final-result.png');
    
    console.log('\n=== 测试完成 ===');
    
  } catch (error) {
    console.error('测试出错:', error.message);
    await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/error.png' });
  }
  
  await browser.close();
}

test();
