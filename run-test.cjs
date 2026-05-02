const { chromium } = require('playwright');

(async () => {
  console.log('=== 开始测试 OPC 咨询专家匹配 ===\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. 访问诊断结果页
    console.log('1. 访问诊断结果页...');
    await page.goto('http://localhost:8080/diagnosis-result');
    await page.waitForTimeout(2000);

    // 2. 设置诊断数据
    console.log('2. 设置诊断数据...');
    await page.evaluate(() => {
      localStorage.setItem('enterprise_diagnosis_result', JSON.stringify({
        companyName: '测试公司',
        industry: '科技互联网',
        level: 'L3 认证型',
        totalScore: 68,
        scores: { readiness: 70, data: 65, security: 60, budget: 75 }
      }));
    });
    await page.reload();
    await page.waitForTimeout(2000);
    console.log('   诊断数据已设置并刷新页面');

    // 3. 点击推荐OPC标签
    console.log('3. 点击"推荐OPC"标签...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    
    const tabClicked = await page.evaluate(() => {
      const tabs = document.querySelectorAll('button, div[role="tab"], .cursor-pointer');
      for (const tab of tabs) {
        if (tab.textContent.includes('推荐OPC')) {
          tab.click();
          return true;
        }
      }
      return false;
    });
    
    if (tabClicked) {
      console.log('   已点击推荐OPC');
    } else {
      console.log('   未找到推荐OPC标签，尝试其他方式...');
      await page.evaluate(() => {
        const allBtns = document.querySelectorAll('button');
        console.log('页面按钮:', Array.from(allBtns).map(b => b.textContent).join(', '));
      });
    }
    await page.waitForTimeout(1000);

    // 4. 点击 OPC咨询专家 的紫色立即咨询按钮
    console.log('4. 点击 OPC咨询专家 的"立即咨询"按钮...');
    const clicked = await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const btn of btns) {
        if (btn.textContent.includes('立即咨询') && btn.className.includes('purple')) {
          btn.click();
          return true;
        }
      }
      return false;
    });

    if (clicked) {
      console.log('   按钮已点击');
    } else {
      console.log('   未找到紫色立即咨询按钮');
    }

    // 5. 等待页面跳转
    await page.waitForTimeout(2000);
    console.log('5. 当前URL:', page.url());

    // 6. 检查 consultation_intent
    console.log('6. 检查 consultation_intent...');
    const intent = await page.evaluate(() => {
      const i = localStorage.getItem('consultation_intent');
      if (i) {
        const data = JSON.parse(i);
        return { type: data.type, name: data.opcData?.name };
      }
      return null;
    });

    if (intent) {
      console.log('   ✓ consultation_intent 已设置');
      console.log('     type:', intent.type);
      console.log('     专家:', intent.name);
    } else {
      console.log('   ✗ consultation_intent 未设置');
    }

    // 7. 截图
    await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-result.png', fullPage: true });
    console.log('\n7. 截图已保存: test-result.png');

    console.log('\n=== 测试完成 ===');

  } catch (error) {
    console.error('错误:', error.message);
  }

  await page.waitForTimeout(5000);
  await browser.close();
})();
