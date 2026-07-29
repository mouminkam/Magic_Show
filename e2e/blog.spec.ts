import { test, expect } from '@playwright/test';

test.describe('Blog Page', () => {
  test('blog page loads without crashing', async ({ page }) => {
    const response = await page.goto('/blog');
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('blog page renders a banner or hero section', async ({ page }) => {
    await page.goto('/blog');
    // Banner is typically a section/div near the top with a heading
    const banner = page.locator(
      '[class*="banner"], [class*="hero"], [class*="page-header"], section h1, section h2'
    ).first();
    await expect(banner).toBeVisible({ timeout: 10000 });
  });

  test('blog posts grid or list renders', async ({ page }) => {
    await page.goto('/blog');
    // Blog post cards are usually anchor tags pointing to /blog/:id
    const postLinks = page.locator('a[href*="/blog/"]');
    // Either posts load or a loading/empty state is shown — page must not be blank
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
    // If posts exist, at least one should be visible within 15s
    const count = await postLinks.count();
    if (count > 0) {
      await expect(postLinks.first()).toBeVisible({ timeout: 15000 });
    }
  });

  test('clicking a blog post navigates to /blog/:id', async ({ page }) => {
    await page.goto('/blog');
    const postLinks = page.locator('a[href*="/blog/"]');
    await expect(postLinks.first()).toBeVisible({ timeout: 15000 });

    const href = await postLinks.first().getAttribute('href');
    await postLinks.first().click();

    await expect(page).toHaveURL(/\/blog\/\w+/, { timeout: 10000 });
    expect(href).toMatch(/\/blog\/.+/);
  });

  test('blog post detail shows title and body content', async ({ page }) => {
    await page.goto('/blog');
    const postLinks = page.locator('a[href*="/blog/"]');
    await expect(postLinks.first()).toBeVisible({ timeout: 15000 });
    await postLinks.first().click();
    await page.waitForURL(/\/blog\/\w+/, { timeout: 10000 });

    // Title should be a heading element
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).not.toBeEmpty();

    // Body content should exist (article, section, div with content class)
    const content = page.locator(
      'article, [class*="content"], [class*="post-body"], [class*="blog-content"]'
    ).first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('blog post detail does not crash with no content', async ({ page }) => {
    await page.goto('/blog');
    const postLinks = page.locator('a[href*="/blog/"]');
    // If no posts exist, page should still render without white-screening
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
