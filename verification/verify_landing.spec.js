import { test, expect } from '@playwright/test';

const baseUrl = 'http://localhost:5173';

test.describe('Landing Page', () => {
  test('renders correctly', async ({ page }) => {
    await page.goto(baseUrl + '/');
    await expect(page.locator('text=RS Events | Where Every Moment Comes Alive')).toBeVisible();
    await expect(page.locator('text=Delivering exceptional events')).toBeVisible();
    await expect(page.locator('nav').locator('text=Log in')).toBeVisible();
    await expect(page.locator('text=Discover Our Services')).toBeVisible();
  });

  test('navigation to login works', async ({ page }) => {
    await page.goto(baseUrl + '/');
    // Mobile menu might be closed, but on desktop it's visible.
    // Let's try to click the one in the footer or nav if visible.
    const loginLink = page.locator('footer >> text=Staff Portal');
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
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
  });
});
