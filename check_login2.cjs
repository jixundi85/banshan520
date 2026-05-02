const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // 强制刷新获取最新代码
    await page.goto('http://localhost:8080/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);  // 等待 HMR 更新
    
    // 截图
    await page.screenshot({ path: '/tmp/login_check2.png', fullPage: false });
    console.log('Screenshot saved to /tmp/login_check2.png');
    
    // 检查页面结构
    const loginDiv = await page.evaluate(() => {
      const root = document.getElementById('root');
      const firstChild = root?.firstElementChild;
      if (firstChild) {
        return {
          tag: firstChild.tagName,
          className: firstChild.className,
          firstChildClass: firstChild.firstElementChild?.className,
          paddingTop: window.getComputedStyle(firstChild).paddingTop
        };
      }
      return null;
    });
    console.log('Login div structure:', JSON.stringify(loginDiv, null, 2));
    
    // 检查第一个div是否有pt
    const hasPadding = await page.evaluate(() => {
      const root = document.getElementById('root');
      const firstDiv = root?.firstElementChild;
      if (firstDiv) {
        const style = window.getComputedStyle(firstDiv);
        return {
          paddingTop: style.paddingTop,
          classList: Array.from(firstDiv.classList)
        };
      }
      return null;
    });
    console.log('First div computed style:', JSON.stringify(hasPadding));
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  await browser.close();
})();
