import { test, expect } from '@playwright/test';

test('app loads core layout', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('AOI Creator')).toBeVisible();
  await expect(page.getByTestId('sidebar')).toBeVisible();
  await expect(page.getByTestId('map-panel')).toBeVisible();
  await expect(page.getByTestId('right-panel')).toBeVisible();
});
