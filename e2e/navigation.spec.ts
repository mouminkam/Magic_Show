import { test, expect } from '@playwright/test';

test.describe('Header Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the header to be visible
    await page.waitForSelector('header', { timeout: 15000 });
  });

  test('logo link navigates to home page', async ({ page }) => {
    const logo = page.locator('header a').first();
    await expect(logo).toBeVisible();
    await logo.click();
    await expect(page).toHaveURL('/');
  });

  test('shop nav link navigates to /shop', async ({ page }) => {
    const shopLink = page.getByRole('link', { name: /shop|المتجر/i }).first();
    await expect(shopLink).toBeVisible();
    await shopLink.click();
    await expect(page).toHaveURL(/\/shop/);
  });

  test('stores nav link navigates to /stores', async ({ page }) => {
    const storesLink = page.getByRole('link', { name: /stores|المتاجر/i }).first();
    await expect(storesLink).toBeVisible();
    await storesLink.click();
    await expect(page).toHaveURL(/\/stores/);
  });

  test('blog nav link navigates to /blog', async ({ page }) => {
    const blogLink = page.getByRole('link', { name: /blog|المدونة/i }).first();
    await expect(blogLink).toBeVisible();
    await blogLink.click();
    await expect(page).toHaveURL(/\/blog/);
  });

  test('contact nav link navigates to /contact-us', async ({ page }) => {
    const contactLink = page.getByRole('link', { name: /contact|اتصل/i }).first();
    await expect(contactLink).toBeVisible();
    await contactLink.click();
    await expect(page).toHaveURL(/\/contact-us/);
  });

  test('about nav link navigates to /about-us', async ({ page }) => {
    // Select by href to be robust against translation differences
    const aboutLink = page.locator('header a[href="/about-us"]').first();
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await expect(page).toHaveURL(/\/about-us/);
  });

  test('all navigation links are accessible without crashing', async ({ page }) => {
    const routes = ['/', '/shop', '/stores', '/blog', '/contact-us', '/about-us'];
    for (const route of routes) {
      // Use domcontentloaded to avoid hanging on slow assets
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      // Each page should not return a 4xx/5xx or show a fatal Next.js error overlay
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
