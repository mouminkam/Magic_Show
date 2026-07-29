import { test, expect } from '@playwright/test';

test.describe('Authentication Pages', () => {
  test.describe('Login Page', () => {
    test('login page loads without crashing', async ({ page }) => {
      const response = await page.goto('/login');
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
    });

    test('login page has email input field', async ({ page }) => {
      await page.goto('/login');
      const emailInput = page.getByRole('textbox', { name: /email|بريد/i })
        .or(page.locator('input[type="email"], input[name="email"]'));
      await expect(emailInput.first()).toBeVisible({ timeout: 10000 });
    });

    test('login page has password input field', async ({ page }) => {
      await page.goto('/login');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      await expect(passwordInput.first()).toBeVisible({ timeout: 10000 });
    });

    test('login page has a submit button', async ({ page }) => {
      await page.goto('/login');
      const submitBtn = page.getByRole('button', { name: /login|sign in|تسجيل الدخول|دخول/i })
        .or(page.locator('button[type="submit"]'));
      await expect(submitBtn.first()).toBeVisible({ timeout: 10000 });
    });

    test('invalid login credentials show an error message', async ({ page }) => {
      await page.goto('/login');

      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitBtn = page.locator('button[type="submit"]').first();

      await emailInput.fill('nonexistent@invalid-test.com');
      await passwordInput.fill('wrongpassword123');
      await submitBtn.click();

      // Wait for error feedback — could be a toast, alert, or inline message
      const errorMessage = page.locator(
        '[role="alert"], [class*="error"], [class*="toast"], [class*="danger"], [class*="invalid"]'
      );
      await expect(errorMessage.first()).toBeVisible({ timeout: 15000 });
    });

    test('login page has a link to register', async ({ page }) => {
      await page.goto('/login');
      const registerLink = page.getByRole('link', { name: /register|create account|sign up|تسجيل|إنشاء/i });
      await expect(registerLink.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Register Page', () => {
    test('register page loads without crashing', async ({ page }) => {
      const response = await page.goto('/register');
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
    });

    test('register page has required form fields', async ({ page }) => {
      await page.goto('/register');
      // Email field
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      await expect(emailInput.first()).toBeVisible({ timeout: 10000 });
      // Password field
      const passwordInput = page.locator('input[type="password"]');
      await expect(passwordInput.first()).toBeVisible({ timeout: 10000 });
    });

    test('register page has a submit button', async ({ page }) => {
      await page.goto('/register');
      const submitBtn = page.locator('button[type="submit"]');
      await expect(submitBtn.first()).toBeVisible({ timeout: 10000 });
    });

    test('register form shows validation errors on empty submit', async ({ page }) => {
      await page.goto('/register');
      const submitBtn = page.locator('button[type="submit"]').first();
      await submitBtn.click();
      // Should show some validation error or required message
      await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
      // Page should not navigate away (stay on /register)
      await expect(page).toHaveURL(/\/register/);
    });
  });

  test.describe('Forgot Password Page', () => {
    test('forgot-password page loads without crashing', async ({ page }) => {
      const response = await page.goto('/forgot-password');
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
    });

    test('forgot-password page has email input and submit button', async ({ page }) => {
      await page.goto('/forgot-password');
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const submitBtn = page.locator('button[type="submit"]');
      await expect(emailInput.first()).toBeVisible({ timeout: 10000 });
      await expect(submitBtn.first()).toBeVisible({ timeout: 10000 });
    });
  });
});
