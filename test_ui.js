const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to new category page...");
    await page.goto('http://localhost:3001/dashboard/catalog/categories/new', { waitUntil: 'networkidle0' });
    
    // Category 1
    console.log("Filling Category 1...");
    await page.type('input[name="nameAr"]', 'حلويات');
    await page.type('input[name="nameEn"]', 'Desserts');
    await page.click('button[type="submit"]');
    
    console.log("Waiting for Category 1 submission...");
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log("Category 1 created successfully, navigated to:", page.url());

    console.log("Navigating to new category page again...");
    await page.goto('http://localhost:3001/dashboard/catalog/categories/new', { waitUntil: 'networkidle0' });

    // Category 2
    console.log("Filling Category 2...");
    await page.type('input[name="nameAr"]', 'أطباق رئيسية');
    await page.type('input[name="nameEn"]', 'Main Dishes');
    
    // Check network for the action request
    page.on('response', async (response) => {
      if (response.request().method() === 'POST') {
        const url = response.url();
        console.log(`POST to ${url} finished with status ${response.status()}`);
        try {
          const text = await response.text();
          console.log(`Response text: ${text.substring(0, 500)}`);
        } catch(e) {}
      }
    });

    await page.click('button[type="submit"]');
    console.log("Waiting for Category 2 submission...");
    
    // Wait for the success or error UI
    await page.waitForSelector('.admin-alert', { timeout: 10000 });
    const alertText = await page.$eval('.admin-alert', el => el.textContent);
    console.log("Alert visible:", alertText);

  } catch (err) {
    console.error("Test Error:", err);
  } finally {
    await browser.close();
  }
}

run();
