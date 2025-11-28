import { test, expect } from '@playwright/test';

test('Leaflet map container is rendered', async ({ page }) => {
  await page.goto('/');

  const leafletContainer = page.locator('.leaflet-container');
  await expect(leafletContainer).toBeVisible();
});
