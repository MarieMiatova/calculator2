import { test, expect } from '@playwright/test';

test.describe('Home Page Snapshot Test', () => {
  test('should display the home page correctly', async ({ page }) => {
    await page.goto('https://calculatormanefabulent.netlify.app/'); 
await page.waitForLoadState('networkidle');

await expect(page).toHaveScreenshot('home-page.png', {
  maxDiffPixelRatio: 0.01, 
});
  });
});