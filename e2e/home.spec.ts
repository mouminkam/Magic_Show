import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows main content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Magic Show/i);
  });

  test('has navigation links', async ({ page }) => {
    await page.goto('/');
    const shopLink = page.getByRole('link', { name: /shop/i }).first();
    await expect(shopLink).toBeVisible();
  });

  test('newsletter section exists', async ({ page }) => {
    await page.goto('/');
    // The site's default locale is Arabic; match both languages, same convention
    // used by the other e2e specs (e.g. auth.spec.ts's login-button matcher).
    const subscribeButton = page.getByRole('button', { name: /subscribe|اشترك/i });
    await expect(subscribeButton).toBeVisible({ timeout: 10000 });
  });
});
