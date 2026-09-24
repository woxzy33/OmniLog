const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Clicking history tab...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const historyBtn = btns.find(b => b.innerText.toLowerCase().includes('history'));
    if(historyBtn) historyBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));

  console.log("Clicking a session summary...");
  await page.evaluate(() => {
    // any div that looks like a session card
    const cards = Array.from(document.querySelectorAll('div')).filter(d => d.style.background === 'var(--card-bg)');
    if(cards.length > 0) cards[1].click(); // click second card to open summary
  });

  await new Promise(r => setTimeout(r, 2000));

  await browser.close();
})();
