const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERR:', err.message));
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 1000));
  const buttons = await page.('button');
  for(let b of buttons) {
    const text = await page.evaluate(el => el.innerText, b);
    if(text.includes('History') || text.includes('Profile')) {
      console.log('Clicking', text);
      await b.click();
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  await browser.close();
})();