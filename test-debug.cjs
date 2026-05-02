const { chromium } = require('playwright');

async function test() {
  console.log('=== 测试 OPC 咨询专家匹配 ===\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 1. 设置数据
    await page.goto('http://localhost:8081', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      localStorage.setItem('enterprise_diagnosis_result', JSON.stringify({
        level: 'L3 认证型',
        totalScore: 68,
        companyName: '测试企业'
      }));
    });
    console.log('✓ 已设置诊断结果');

    // 2. 访问诊断结果页
    await page.goto('http://localhost:8081/diagnosis-result', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(3000);

    // 检查页面是否加载
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 200));
    console.log(`页面内容: ${bodyText.substring(0, 100)}...`);

    // 3. 点击推荐OPC标签
    try {
      await page.locator('text=推荐OPC').click({ timeout: 5000 });
      await page.waitForTimeout(1500);
      console.log('✓ 点击推荐OPC标签');
    } catch (e) {
      console.log('⚠️ 点击推荐OPC失败:', e.message);
    }

    // 4. 找到 OPC咨询专家 区域
    const sectionVisible = await page.locator('text=为您匹配的OPC咨询专家').isVisible().catch(() => false);
    console.log(`✓ "为您匹配的OPC咨询专家" 区域可见: ${sectionVisible}`);

    // 5. 点击第一个紫色立即咨询按钮
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const purpleBtn = btns.find(btn => {
        const classes = btn.className || '';
        return (classes.includes('purple') || classes.includes('from-purple')) && btn.textContent.includes('立即咨询');
      });
      if (purpleBtn) {
        purpleBtn.click();
        console.log(`✓ 点击了紫色立即咨询按钮`);
      } else {
        console.log('⚠️ 未找到紫色立即咨询按钮');
      }
    });
    await page.waitForTimeout(1500);

    // 6. 检查 consultation_intent
    const intent = await page.evaluate(() => localStorage.getItem('consultation_intent'));
    if (intent) {
      const data = JSON.parse(intent);
      console.log(`\n✓ consultation_intent 已设置`);
      console.log(`  type: ${data.type}`);
      console.log(`  专家: ${data.opcData?.name}`);
    } else {
      console.log(`\n✗ consultation_intent 未设置`);
    }

    // 7. 访问 CreatorPage
    await page.goto('http://localhost:8081/creator?tab=opc-experts', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(3000);
    console.log('\n✓ 访问 CreatorPage');

    // 8. 检查专家数量
    const expertInfo = await page.evaluate(() => {
      // 找到 "为您匹配的OPC咨询专家" 区域
      const sections = Array.from(document.querySelectorAll('div')).filter(el =>
        el.textContent === '为您匹配的OPC咨询专家'
      );

      if (sections.length > 0) {
        const section = sections[0];
        const parent = section.closest('.bg-dark-800') || section.parentElement?.parentElement;
        if (parent) {
          const avatars = parent.querySelectorAll('.rounded-full');
          return avatars.length;
        }
      }
      return -1;
    });

    console.log(`\n智配咨询区专家头像数量: ${expertInfo}`);
    if (expertInfo === 1) {
      console.log('✅ 测试通过！');
    } else if (expertInfo > 1) {
      console.log(`❌ 测试失败！期望 1 个，实际 ${expertInfo} 个`);
    }

    // 9. 截图
    await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-result.png', fullPage: true });
    console.log('\n✓ 截图已保存: test-result.png');

  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await browser.close();
  }
}

test();
