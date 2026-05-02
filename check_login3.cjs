const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8080/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);
    
    // 截图
    await page.screenshot({ path: '/tmp/login_final.png', fullPage: true });
    console.log('Full page screenshot saved to /tmp/login_final.png');
    
    // 检查 SiteHeader 和 登录卡片的相对位置
    const positions = await page.evaluate(() => {
      const header = document.querySelector('.site-header');
      const loginCard = document.querySelector('.backdrop-blur-xl');
      if (header && loginCard) {
        const headerRect = header.getBoundingClientRect();
        const cardRect = loginCard.getBoundingClientRect();
        return {
          headerBottom: headerRect.bottom,
          cardTop: cardRect.top,
          gap: cardRect.top - headerRect.bottom
        };
      }
      return null;
    });
    console.log('Positions:', JSON.stringify(positions));
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  await browser.close();
})();
