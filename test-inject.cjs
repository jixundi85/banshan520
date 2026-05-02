const { chromium } = require('playwright');

async function test() {
  console.log('=== 测试 OPC 咨询专家匹配 ===\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. 访问诊断结果页
    await page.goto('http://localhost:8081/diagnosis-result', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);

    // 2. 设置诊断结果
    await page.evaluate(() => {
      localStorage.setItem('enterprise_diagnosis_result', JSON.stringify({
        level: 'L3 认证型',
        totalScore: 68,
        companyName: '测试科技有限公司',
        summary: '企业已有一定AI基础',
        scores: { readiness: 70, data: 65, security: 60, budget: 75 }
      }));
      console.log('诊断结果已设置');
    });

    // 3. 刷新页面
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    console.log('页面已刷新');

    // 4. 检查页面内容
    const content = await page.evaluate(() => document.body.innerText);
    console.log(`页面内容长度: ${content.length}`);

    // 5. 点击推荐OPC标签
    const opcTab = await page.locator('text=推荐OPC');
    if (await opcTab.count() > 0) {
      await opcTab.first().click();
      await page.waitForTimeout(2000);
      console.log('✓ 点击推荐OPC标签');
    } else {
      console.log('⚠️ 未找到推荐OPC标签');
    }

    // 6. 检查是否有 OPC咨询专家 区域
    const consultantsSection = await page.locator('text=为您匹配的OPC咨询专家');
    if (await consultantsSection.count() > 0) {
      console.log('✓ 找到"为您匹配的OPC咨询专家"区域');

      // 7. 点击紫色立即咨询按钮
      const clicked = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const purpleBtn = btns.find(btn => {
          const classes = btn.className || '';
          return (classes.includes('purple') || classes.includes('from-purple')) &&
                 btn.textContent.includes('立即咨询');
        });
        if (purpleBtn) {
          purpleBtn.click();
          return true;
        }
        return false;
      });

      if (clicked) {
        console.log('✓ 点击了紫色立即咨询按钮');
      } else {
        console.log('⚠️ 未找到紫色立即咨询按钮');
      }
      await page.waitForTimeout(2000);
    } else {
      console.log('⚠️ 未找到"为您匹配的OPC咨询专家"区域');
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

    // 9. 截图
    await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-step1.png' });
    console.log('\n截图已保存');

    // 保持浏览器打开，让用户查看
    console.log('\n浏览器保持打开状态...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('错误:', error.message);
  }
}

test();
