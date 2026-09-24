const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText)
  );

  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Clicking profile tab...");
  await page.evaluate(() => {
    // Assuming bottom nav has buttons
    const btns = Array.from(document.querySelectorAll('button'));
    const profileBtn = btns.find(b => b.innerText.toLowerCase().includes('profile'));
    if(profileBtn) profileBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
