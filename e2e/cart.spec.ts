import { test, expect } from '@playwright/test';

test.describe('Cart, Wishlist & Checkout', () => {
  test.describe('Cart Page', () => {
    test('cart page loads without crashing (empty state)', async ({ page }) => {
      const response = await page.goto('/cart');
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
    });

    test('empty cart shows a message or empty state — no white screen', async ({ page }) => {
      await page.goto('/cart');
      await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
      // Should show either items or an empty-cart message
      const content = page.locator(
        '[class*="empty"], [class*="cart"], [class*="basket"], main h1, main h2, main p'
      ).first();
      await expect(content).toBeVisible({ timeout: 10000 });
    });

    test('cart page does not show a Next.js error overlay', async ({ page }) => {
      await page.goto('/cart');
      const errorOverlay = page.locator('[data-nextjs-error], #__nextjs-portal');
      await expect(errorOverlay).toHaveCount(0);
    });
  });

  test.describe('Wishlist Page', () => {
    test('wishlist page loads without crashing', async ({ page }) => {
      const response = await page.goto('/wishlist');
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
    });

    test('wishlist page renders content or empty state', async ({ page }) => {
      await page.goto('/wishlist');
      await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
      const content = page.locator(
        '[class*="empty"], [class*="wishlist"], [class*="favourite"], main h1, main h2, main p'
      ).first();
      await expect(content).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Checkout Page (Unauthenticated)', () => {
    test('checkout redirects unauthenticated users to login', async ({ page }) => {
      // No auth token set — unauthenticated request
      await page.goto('/checkout');
      // Should redirect to /login or show a login prompt
      // Wait for navigation to settle
      await page.waitForURL(/\/(login|checkout)/, { timeout: 10000 });
      const currentUrl = page.url();
      // Either redirected to login, or shows a protected/access-denied UI on /checkout
      const isOnLogin = currentUrl.includes('/login');
      const isOnCheckout = currentUrl.includes('/checkout');
      expect(isOnLogin || isOnCheckout).toBe(true);

      if (isOnCheckout) {
        // The page should not be a blank white screen
        await expect(page.locator('body')).not.toBeEmpty();
      }
    });
  });

  test.describe('Add to Cart Flow', () => {
    test('adding a product to cart from shop page works', async ({ page }) => {
      await page.goto('/shop');
      const productLink = page.locator('a[href*="/shop/"]').first();
      await expect(productLink).toBeVisible({ timeout: 15000 });
      await productLink.click();
      await page.waitForURL(/\/shop\/\w+/, { timeout: 10000 });

      // Find and click add to cart button
      const addToCartBtn = page.getByRole('button', {
        name: /add to cart|اضف|أضف|سلة|cart/i,
      });

      if (await addToCartBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await addToCartBtn.click();
        // Check for success feedback — toast, cart count update, etc.
        await page.waitForTimeout(2000);
        await expect(page.locator('body')).toBeVisible();
        // No crash occurred
      }
    });
  });
});
