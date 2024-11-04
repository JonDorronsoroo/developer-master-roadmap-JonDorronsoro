import { test, expect } from '@playwright/test';

test('homepage test', async ({ page }) => {
  await page.goto('/home');

  await expect(page).toHaveScreenshot({ fullPage: true });
});
