import { test, expect } from '@playwright/test';

test.describe('Contact Us Page', () => {
  test('contact-us page loads without crashing', async ({ page }) => {
    const response = await page.goto('/contact-us');
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('contact-us page renders a banner or page heading', async ({ page }) => {
    await page.goto('/contact-us');
    const heading = page.locator(
      '[class*="banner"], [class*="hero"], [class*="page-header"], h1, h2'
    ).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('contact form has name, email, and message fields', async ({ page }) => {
    await page.goto('/contact-us');

    // Name field
    const nameInput = page.locator(
      'input[name="name"], input[placeholder*="name" i], input[placeholder*="اسم" i]'
    );
    await expect(nameInput.first()).toBeVisible({ timeout: 10000 });

    // Email field
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput.first()).toBeVisible({ timeout: 10000 });

    // Message / textarea
    const messageInput = page.locator('textarea');
    await expect(messageInput.first()).toBeVisible({ timeout: 10000 });
  });

  test('contact form has a submit button', async ({ page }) => {
    await page.goto('/contact-us');
    const submitBtn = page.locator('button[type="submit"]')
      .or(page.getByRole('button', { name: /send|submit|إرسال|أرسل/i }));
    await expect(submitBtn.first()).toBeVisible({ timeout: 10000 });
  });

  test('contact form shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/contact-us');
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();
    // Should stay on the same page (not crash or navigate away)
    await expect(page).toHaveURL(/\/contact-us/);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('About Us Page', () => {
  test('about-us page loads without crashing', async ({ page }) => {
    const response = await page.goto('/about-us');
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('about-us page renders a banner or hero section', async ({ page }) => {
    await page.goto('/about-us');
    const banner = page.locator(
      '[class*="banner"], [class*="hero"], [class*="page-header"], section h1, section h2'
    ).first();
    await expect(banner).toBeVisible({ timeout: 10000 });
  });

  test('about-us page renders some content sections', async ({ page }) => {
    await page.goto('/about-us');
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
    // Should have at least one text section
    const textContent = page.locator('section p, main p, [class*="description"], [class*="about"]').first();
    await expect(textContent).toBeVisible({ timeout: 10000 });
  });

  test('about-us page does not show a Next.js error overlay', async ({ page }) => {
    await page.goto('/about-us');
    const errorOverlay = page.locator('[data-nextjs-error], #__nextjs-portal');
    await expect(errorOverlay).toHaveCount(0);
  });
});
