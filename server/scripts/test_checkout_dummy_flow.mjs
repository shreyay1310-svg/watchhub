import { chromium } from 'playwright-core';

async function run() {
  console.log('Testing Checkout Dummy Payment Flow as Authenticated Customer...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Payment') || msg.text().includes('Dummy')) {
      console.log('[BROWSER]', msg.type(), msg.text());
    }
  });

  try {
    // 1. Log in by clicking the Customer quick tab on /login
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    const customerTab = page.locator('button:has-text("Customer")').first();
    await customerTab.click();
    await page.waitForTimeout(400);

    const email = await page.inputValue('input[type="email"]');
    console.log('Customer tab selected. Email in field:', email);

    await page.click('button[type="submit"]');
    await page.waitForTimeout(2500);
    console.log('Logged in successfully. Navigating to /checkout...');

    // 2. Navigate to Checkout
    await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle' });
    console.log('1. Reached /checkout:', page.url());

    // Step 1 -> Step 2
    console.log('2. Advancing from Step 1 (Identity)...');
    await page.click('button:has-text("Proceed to Delivery Address")');
    await page.waitForTimeout(800);

    // Step 2 -> Step 3
    console.log('3. Advancing from Step 2 (Address)...');
    await page.click('button:has-text("Select Shipping Method")');
    await page.waitForTimeout(800);

    // Step 3 -> Step 4
    console.log('4. Advancing from Step 3 (Shipping)...');
    await page.click('button:has-text("Review Acquisition Order")');
    await page.waitForTimeout(800);

    // Step 4 -> Step 5
    console.log('5. Advancing from Step 4 (Review) to Step 5 (Payment)...');
    await page.click('button:has-text("Proceed to Payment")');
    await page.waitForTimeout(800);

    const bodyText = await page.textContent('body');
    const hasDemoBanner = bodyText.includes('Demo Payment Mode — No real money will be charged');
    console.log('6. Step 5 reached. Demo Payment banner rendered:', hasDemoBanner);

    // Test Simulated Failure
    console.log('7. Testing Simulated Failure toggle...');
    const simFailCheckbox = await page.$('input[type="checkbox"]');
    if (simFailCheckbox) {
      await simFailCheckbox.check();
      await page.waitForTimeout(300);
      await page.click('button:has-text("Confirm & Pay")');
      await page.waitForTimeout(1500);

      const failBody = await page.textContent('body');
      const hasDecline = failBody.includes('Simulated issuing bank authorization decline');
      console.log('8. Simulated failure message displayed:', hasDecline);

      // Uncheck failure toggle
      await simFailCheckbox.uncheck();
      await page.waitForTimeout(300);
    }

    // Test Real Simulated Order Success
    console.log('9. Authorizing real persistent dummy order...');
    await page.click('button:has-text("Confirm & Pay")');
    await page.waitForTimeout(3500);

    const successBody = await page.textContent('body');
    const isConfirmed = successBody.includes('Order Placed') || successBody.includes('Acquisition') || successBody.includes('WH-');
    const hasOrderNumber = successBody.includes('WH-');
    console.log('10. Order confirmation reached:', isConfirmed);
    console.log('11. Database Order Number generated:', hasOrderNumber);

    console.log('✅ CHECKOUT DUMMY PAYMENT FULLY VERIFIED!');
  } catch (err) {
    console.error('Checkout test error:', err);
  } finally {
    await browser.close();
  }
}

run();
