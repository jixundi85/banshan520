const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8080/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    
    // 截图
    await page.screenshot({ path: '/tmp/login_check.png', fullPage: false });
    console.log('Screenshot saved');
    
    // 检查header
    const header = await page.$('.site-header');
    console.log('SiteHeader exists:', !!header);
    
    // 检查header位置
    const headerStyle = await page.evaluate(() => {
      const h = document.querySelector('.site-header');
      if (h) {
        const rect = h.getBoundingClientRect();
        const style = window.getComputedStyle(h);
        return { 
          top: rect.top, 
          height: rect.height,
          position: style.position,
          zIndex: style.zIndex
        };
      }
      return null;
    });
    console.log('Header style:', JSON.stringify(headerStyle));
    
    // 检查body背景
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).background;
    });
    console.log('Body background:', bodyBg);
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  await browser.close();
})();
