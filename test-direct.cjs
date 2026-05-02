const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 1. 直接设置诊断结果到 localStorage
  await page.goto('http://localhost:8080');
  await page.waitForTimeout(500);
  
  await page.evaluate(() => {
    const diagnosisResult = {
      id: 'diag_' + Date.now(),
      companyName: '测试科技有限公司',
      industry: '科技互联网',
      level: 'L3 认证型',
      totalScore: 68,
      scores: {
        readiness: 70,
        data: 65,
        security: 60,
        budget: 75
      },
      painPoints: ['内容生产效率低', '营销获客困难'],
      summary: '企业已有一定AI基础，正在寻求规模化应用',
      recommendations: ['AIGC内容工厂', 'AI精准营销'],
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('enterprise_diagnosis_result', JSON.stringify(diagnosisResult));
    console.log('诊断结果已设置');
  });
  
  // 2. 访问诊断结果页
  await page.goto('http://localhost:8080/diagnosis-result');
  await page.waitForTimeout(3000);
  
  // 3. 检查页面内容
  const content = await page.evaluate(() => document.body.innerText.substring(0, 800));
  console.log('页面内容:\n', content);
  
  // 4. 点击推荐OPC标签
  const tabs = await page.evaluate(() => {
    const tabs = document.querySelectorAll('[class*="tab"], button');
    return Array.from(tabs).map(t => t.textContent.trim()).filter(t => t.length > 0).slice(0, 10);
  });
  console.log('\n页面标签:', tabs);
  
  // 5. 尝试点击推荐OPC
  try {
    await page.click('text=推荐OPC', { timeout: 5000 });
    console.log('✓ 点击推荐OPC成功');
  } catch (e) {
    console.log('✗ 点击推荐OPC失败:', e.message);
  }
  
  await page.waitForTimeout(1000);
  
  // 6. 点击紫色立即咨询按钮
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    console.log('所有按钮:', btns.map(b => b.textContent.trim().substring(0, 20)));
    
    for (const btn of btns) {
      const text = btn.textContent;
      const cls = btn.className;
      if (text.includes('立即咨询') && cls.includes('purple')) {
        btn.click();
        return '点击了: ' + text;
      }
    }
    
    // 找不到紫色，看看有没有其他立即咨询按钮
    for (const btn of btns) {
      if (btn.textContent.includes('立即咨询')) {
        btn.click();
        return '点击了普通: ' + btn.className;
      }
    }
    return '未找到按钮';
  });
  
  console.log('按钮点击:', clicked);
  await page.waitForTimeout(2000);
  
  // 7. 检查 consultation_intent
  const intent = await page.evaluate(() => localStorage.getItem('consultation_intent'));
  console.log('\nconsultation_intent:', intent ? '已设置' : '未设置');
  if (intent) {
    const data = JSON.parse(intent);
    console.log('  type:', data.type);
    console.log('  name:', data.opcData?.name);
  }
  
  // 8. 截图
  await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-result.png', fullPage: true });
  console.log('\n截图已保存: test-result.png');
  
  await browser.close();
  console.log('测试完成');
})().catch(e => console.error('Error:', e.message));
