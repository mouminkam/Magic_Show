import { test, expect } from '@playwright/test';

test.describe('Stores Page', () => {
  test('stores page loads without crashing', async ({ page }) => {
    const response = await page.goto('/stores');
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('stores page renders a banner or hero section', async ({ page }) => {
    await page.goto('/stores');
    const banner = page.locator(
      '[class*="banner"], [class*="hero"], [class*="page-header"], section h1, section h2'
    ).first();
    await expect(banner).toBeVisible({ timeout: 10000 });
  });

  test('stores list section or map renders', async ({ page }) => {
    await page.goto('/stores');
    // The stores section has id="stores" per the StoresListSection component
    const storesSection = page.locator('#stores, [class*="store-list"], [class*="stores"]').first();
    await expect(storesSection).toBeVisible({ timeout: 15000 });
  });

  test('map container renders when stores have coordinates', async ({ page }) => {
    await page.goto('/stores');
    // Leaflet map renders inside a div with class "leaflet-container"
    // It may or may not render depending on whether stores have lat/lng
    // We only verify the page doesn't crash — map is optional
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
    const mapContainer = page.locator('.leaflet-container');
    const mapCount = await mapContainer.count();
    // If map is present it should be visible; if not, the page should still be fine
    if (mapCount > 0) {
      await expect(mapContainer.first()).toBeVisible();
    }
  });

  test('shows content or empty state — no white screen', async ({ page }) => {
    await page.goto('/stores');
    await expect(page.locator('body')).not.toBeEmpty();
    // Verify no Next.js error overlay is shown
    const errorOverlay = page.locator('#__next-build-watcher, [data-nextjs-error]');
    await expect(errorOverlay).toHaveCount(0);
  });
});
