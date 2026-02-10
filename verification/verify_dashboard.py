from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login
    print("Navigating to Login...")
    page.goto("http://localhost:5173/login")
    email = "test_dash_" + str(time.time()) + "@example.com"
    password = "password123"

    # Register
    print("Clicking Create Account link...")
    page.get_by_role("link", name="Create account").click()

    print("Waiting for Register page...")
    page.wait_for_url("**/register")

    print("Filling Register Form...")
    page.fill("input[name='full_name']", "Test User") # Name
    page.fill("input[name='email']", email)
    page.fill("input[name='password']", password)
    page.get_by_role("button", name="Create Account").click()

    # Wait for redirect to login
    print("Waiting for Login page...")
    page.wait_for_url("**/login")

    # Login
    print("Logging in...")
    page.fill("input[name='email']", email)
    page.fill("input[name='password']", password)
    page.get_by_role("button", name="Login to your account").click()

    print("Waiting for Dashboard...")
    page.wait_for_url("http://localhost:5173/")

    # Go to Dashboard (should be there already, but to be safe)
    page.wait_for_timeout(2000)

    # Take screenshot
    page.screenshot(path="verification/dashboard_charts.png")
    print("Screenshot taken.")

    # Check for Filter Buttons
    expect(page.get_by_role("button", name="1 Week")).to_be_visible()
    expect(page.get_by_role("button", name="1 Month")).to_be_visible()
    expect(page.get_by_role("button", name="Custom")).to_be_visible()

    # Check for Canvas elements (Charts)
    canvases = page.locator("canvas")
    count = canvases.count()
    print(f"Found {count} canvas elements (Charts).")

    if count >= 4:
        print("PASS: All 4 charts are present.")
    else:
        print(f"FAIL: Expected at least 4 charts, found {count}.")
        exit(1)

    # Click Custom and check inputs
    page.get_by_role("button", name="Custom").click()
    expect(page.locator("input[type='date']").first).to_be_visible()
    print("PASS: Custom date inputs visible.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
