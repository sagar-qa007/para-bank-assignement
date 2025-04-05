import { test, expect } from '@playwright/test';

test('Visit Para Bank homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ParaBank/);
});
