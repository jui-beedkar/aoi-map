import { test, expect } from '@playwright/test';

test('selecting an AOI updates the details panel', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('right-panel')).toContainText('AOI 1');

  await page.getByTestId('aoi-item-aoi-2').click();
  await expect(page.getByTestId('right-panel')).toContainText('AOI 2');

  await page.getByTestId('aoi-item-aoi-3').click();
  await expect(page.getByTestId('right-panel')).toContainText('AOI 3');
});
