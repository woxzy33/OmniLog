const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 }); // iPhone X size
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', error => console.log('ERROR:', error.message));
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  // Click the profile button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const profileBtn = btns.find(b => b.innerText.includes('Default Gym') || b.innerText.includes('Active Gym Profile'));
    if(profileBtn) profileBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 'scratch/profile_modal.png' });
  
  await browser.close();
})();
