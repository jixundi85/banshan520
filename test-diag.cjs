const { chromium } = require('playwright');

async function test() {
  console.log('=== 测试诊断结果页 ===\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. 先访问诊断页
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);

    // 2. 手动设置 localStorage
    await page.evaluate(() => {
      localStorage.setItem('enterprise_diagnosis_result', JSON.stringify({
        level: 'L3 认证型',
        totalScore: 68,
        companyName: '测试企业',
        summary: '测试摘要'
      }));
    });
    console.log('✓ 已设置诊断结果到 localStorage');

    // 3. 访问诊断结果页
    await page.goto('http://localhost:8081/diagnosis-result', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);

    // 4. 检查页面内容
    const content = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log(`\n页面内容预览:\n${content.substring(0, 200)}...`);

    // 5. 检查是否有推荐OPC区域
    const hasOPCSection = content.includes('推荐OPC');
    console.log(`\n✓ 包含"推荐OPC": ${hasOPCSection}`);

    // 6. 检查是否有 OPC咨询专家 区域
    const hasConsultants = content.includes('为您匹配的OPC咨询专家');
    console.log(`✓ 包含"为您匹配的OPC咨询专家": ${hasConsultants}`);

    if (hasConsultants) {
      // 7. 点击紫色立即咨询按钮
      const clicked = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const purpleBtn = btns.find(btn => {
          const classes = btn.className || '';
          return (classes.includes('purple') || classes.includes('from-purple')) && btn.textContent.includes('立即咨询');
        });
        if (purpleBtn) {
          purpleBtn.click();
          return purpleBtn.closest('.bg-dark-900')?.querySelector('h4, h3, [class*="name"]')?.textContent || '未知';
        }
        return null;
      });

      if (clicked) {
        console.log(`✓ 点击了紫色立即咨询按钮: ${clicked}`);
      } else {
        console.log('⚠️ 未找到紫色立即咨询按钮');
      }
      await page.waitForTimeout(2000);
    }

    // 8. 检查 consultation_intent
    const intent = await page.evaluate(() => localStorage.getItem('consultation_intent'));
    if (intent) {
      const data = JSON.parse(intent);
      console.log(`\n✓ consultation_intent 已设置`);
      console.log(`  type: ${data.type}`);
      console.log(`  专家: ${data.opcData?.name}`);
    } else {
      console.log(`\n✗ consultation_intent 未设置`);
    }

    // 9. 访问 CreatorPage
    await page.goto('http://localhost:8081/creator?tab=opc-experts', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);

    // 10. 检查专家数量
    const creatorContent = await page.evaluate(() => document.body.innerText);
    const expertSection = creatorContent.includes('为您匹配的OPC咨询专家');
    console.log(`\nCreatorPage 包含专家区域: ${expertSection}`);

    // 11. 截图
    await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-final.png', fullPage: true });
    console.log('\n✓ 截图已保存: test-final.png');

  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await browser.close();
  }
}

test();
