const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 1. 访问首页，开始诊断
  await page.goto('http://localhost:8080');
  await page.waitForTimeout(1000);
  
  // 点击开始诊断
  const startBtn = await page.$('text=开始AI诊断');
  if (startBtn) {
    await startBtn.click();
    await page.waitForTimeout(500);
    console.log('✓ 点击开始诊断');
  }
  
  // 填写诊断表单
  await page.evaluate(() => {
    // 填写公司名称
    const inputs = document.querySelectorAll('input');
    if (inputs[0]) inputs[0].value = '测试科技有限公司';
    
    // 选择行业
    const radios = document.querySelectorAll('input[type="radio"]');
    if (radios.length > 0) radios[0].click();
  });
  
  await page.waitForTimeout(500);
  
  // 点击下一步
  const nextBtn = await page.$('text=下一步');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(500);
    console.log('✓ 点击下一步');
  }
  
  // 选择所有痛点
  await page.evaluate(() => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.click());
  });
  await page.waitForTimeout(500);
  
  // 点击提交诊断
  const submitBtn = await page.$('text=提交诊断');
  if (submitBtn) {
    await submitBtn.click();
    await page.waitForTimeout(2000);
    console.log('✓ 提交诊断');
  }
  
  // 检查诊断结果
  const result = await page.evaluate(() => {
    return localStorage.getItem('enterprise_diagnosis_result');
  });
  console.log('诊断结果:', result ? '已设置' : '未设置');
  
  if (result) {
    const data = JSON.parse(result);
    console.log('  level:', data.level);
  }
  
  // 截图
  await page.screenshot({ path: '/Users/jxd85/WorkBuddy/20260413132001/test-diagnosis.png', fullPage: true });
  console.log('截图已保存');
  
  await browser.close();
})().catch(e => console.error('Error:', e.message));
