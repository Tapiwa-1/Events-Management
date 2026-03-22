import { test, expect } from '@playwright/test';

const baseUrl = 'http://localhost:5173';

test.describe('Landing Page', () => {
  test('renders correctly', async ({ page }) => {
    await page.goto(baseUrl + '/');
    await expect(page.locator('text=Manage Your Events with Ease')).toBeVisible();
    await expect(page.locator('text=Everything you need to succeed')).toBeVisible();
    await expect(page.locator('nav').locator('text=Log in')).toBeVisible();
    await expect(page.locator('nav').locator('text=Get started')).toBeVisible();
  });

  test('navigation to login works', async ({ page }) => {
    await page.goto(baseUrl + '/');
    await page.click('nav >> text=Log in');
    await expect(page).toHaveURL(/\/login/);
  });

  test('navigation to register works', async ({ page }) => {
    await page.goto(baseUrl + '/');
    await page.click('nav >> text=Get started');
    await expect(page).toHaveURL(/\/register/);
  });

  test('authenticated users are redirected from landing to dashboard', async ({ page }) => {
    // Mock the checkAuth API to simulate an authenticated user
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        })
      });
    });

    await page.goto(baseUrl + '/');

    // The navigation guard should redirect to /dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    // Use first() to avoid strict mode violation if there are multiple occurrences
    await expect(page.locator('text=Admin User').first()).toBeVisible();
  });
});
