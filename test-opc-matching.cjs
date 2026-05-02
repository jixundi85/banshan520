const { chromium } = require('playwright');

async function testOPCExpertMatching() {
  console.log('=== 测试 OPC 咨询专家匹配功能 ===\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 1. 设置测试数据
    await page.goto('http://localhost:8081');
    await page.evaluate(() => {
      localStorage.setItem('enterprise_diagnosis_result', JSON.stringify({
        level: 'L3 认证型',
        totalScore: 68,
        companyName: '测试企业'
      }));
    });
    console.log('✓ 已设置诊断结果数据');

    // 2. 访问诊断结果页
    await page.goto('http://localhost:8081/diagnosis-result');
    await page.waitForTimeout(2000);
    console.log('✓ 访问诊断结果页');

    // 3. 点击推荐OPC标签
    const opcTab = await page.locator('text=推荐OPC').first();
    if (await opcTab.isVisible()) {
      await opcTab.click();
      await page.waitForTimeout(1000);
      console.log('✓ 点击推荐OPC标签');
    }

    // 4. 找到并点击紫色"立即咨询"按钮（OPC咨询专家）
    const clicked = await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const btn of btns) {
        if (btn.textContent.includes('立即咨询') && btn.className.includes('purple')) {
          btn.click();
          return btn.closest('.bg-dark-900')?.querySelector('h4')?.textContent || '未知专家';
        }
      }
      return null;
    });

    if (clicked) {
      console.log(`✓ 点击了 OPC咨询专家 的立即咨询: ${clicked}`);
    } else {
      console.log('✗ 未找到 OPC咨询专家 的立即咨询按钮');
    }

    await page.waitForTimeout(1500);

    // 5. 检查 consultation_intent
    const intent = await page.evaluate(() => {
      const i = localStorage.getItem('consultation_intent');
      return i ? JSON.parse(i) : null;
    });

    if (intent) {
      console.log(`✓ consultation_intent 已设置`);
      console.log(`  - type: ${intent.type}`);
      console.log(`  - 专家: ${intent.opcData?.name}`);
    } else {
      console.log('✗ consultation_intent 未设置');
    }

    // 6. 截图当前状态
    await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-step1.png', fullPage: false });
    console.log('✓ 截图保存: test-step1.png');

    // 7. 等待页面跳转或自动刷新
    const currentUrl = page.url();
    console.log(`\n当前URL: ${currentUrl}`);

    // 如果URL变化，等待导航
    if (currentUrl.includes('creator')) {
      await page.waitForTimeout(2000);
    }

    // 8. 手动访问 CreatorPage 查看效果
    await page.goto('http://localhost:8081/creator?tab=opc-experts');
    await page.waitForTimeout(3000);
    console.log('\n✓ 访问 CreatorPage');

    // 9. 检查智配咨询区的专家数量
    const expertCount = await page.evaluate(() => {
      // 查找 OPC咨询专家展区
      const sections = Array.from(document.querySelectorAll('*')).filter(el =>
        el.textContent.includes('OPC咨询专家展区')
      );

      if (sections.length > 0) {
        const section = sections[0];
        // 查找该区块内的头像数量
        let avatarCount = 0;
        const parent = section.closest('.bg-dark-800') || section.closest('.rounded-xl');
        if (parent) {
          const avatars = parent.querySelectorAll('.rounded-full');
          avatarCount = avatars.length;
        }
        return avatarCount;
      }
      return -1;
    });

    if (expertCount > 0) {
      console.log(`✓ 智配咨询区 OPC咨询专家数量: ${expertCount}`);
      if (expertCount === 1) {
        console.log('✅ 测试通过！只显示1个专家');
      } else {
        console.log(`❌ 测试失败！应该显示1个专家，实际显示 ${expertCount} 个`);
      }
    } else {
      console.log('⚠️ 未找到 OPC咨询专家展区');
    }

    // 10. 截图最终状态
    await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-final.png', fullPage: true });
    console.log('\n✓ 最终截图保存: test-final.png');

    // 11. 检查控制台日志
    const logs = [];
    page.on('console', msg => {
      if (msg.text().includes('已添加') || msg.text().includes('咨询专家')) {
        logs.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForTimeout(1000);

    if (logs.length > 0) {
      console.log('\n控制台日志:');
      logs.forEach(log => console.log(`  - ${log}`));
    }

  } catch (error) {
    console.error('测试出错:', error.message);
  } finally {
    await browser.close();
    console.log('\n=== 测试完成 ===');
  }
}

testOPCExpertMatching();
