import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://localhost:5173');
  
  try {
    await page.waitForSelector('input[type="email"]', { timeout: 3000 });
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const regBtn = btns.find(b => b.innerText.includes('Create an account'));
      if (regBtn) regBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    
    // Register
    const email = 'testuser_' + Date.now() + '@test.com';
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  } catch (e) {}

  try {
    // Wait for Onboarding Screen
    await page.waitForXPath("//button[contains(., 'Complete Setup')]", { timeout: 5000 });
    const completeBtn = await page.waitForXPath("//button[contains(., 'Complete Setup')]");
    await completeBtn.click();
  } catch (e) {}

  await page.waitForSelector('.app', { timeout: 8000 });
  console.log("Logged in and onboarded!");

  // Try to start and finish empty workout
  try {
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.innerText.includes('Start Empty Workout'));
      if (startBtn) startBtn.click();
    });
    console.log("Clicked Start Empty Workout");
    
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const finBtn = btns.find(b => b.innerText.includes('Finish'));
      if (finBtn) finBtn.click();
    });
    console.log("Clicked Finish");
    
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const fin2Btn = btns.find(b => b.innerText.includes('Yes, Finish'));
      if (fin2Btn) fin2Btn.click();
    });
    console.log("Clicked Yes, Finish");
  } catch (e) {
    console.log("Failed to start/finish workout:", e.message);
  }

  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();
