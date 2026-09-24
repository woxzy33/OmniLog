const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', error => console.log('ERROR:', error.message));
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  // Go to history tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const historyBtn = btns.find(b => b.innerText.toLowerCase().includes('history'));
    if(historyBtn) historyBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Toggle to calendar view
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    if(btns.length > 2) btns[2].click(); 
  });
  await new Promise(r => setTimeout(r, 1000));

  // Click a day with a session
  await page.evaluate(() => {
    const days = Array.from(document.querySelectorAll('div')).filter(d => d.style.aspectRatio === '1 / 1');
    const hasSessionDays = days.filter(d => d.style.background === 'var(--primary)');
    if (hasSessionDays.length > 0) {
      console.log('Clicking day with session...');
      hasSessionDays[hasSessionDays.length - 1].click();
    } else {
      console.log('No session days found');
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Check if PostWorkoutSummary is rendered
  const hasSummary = await page.evaluate(() => {
    return document.body.innerText.includes('Post-Workout');
  });
  console.log('Has summary?', hasSummary);

  await browser.close();
})();
