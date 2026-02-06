from playwright.sync_api import sync_playwright
import time

def run(playwright):
    device = playwright.devices['iPhone 12']
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(**device)
    page = context.new_page()

    # Register directly with unique email
    page.goto("http://localhost:5173/register")
    email = f"screen{int(time.time())}@test.com"

    try:
        page.get_by_label("Full Name").fill("Screen User")
        page.get_by_label("Your email").fill(email)
        page.get_by_label("Your password").fill("password123")
        page.get_by_role("button", name="Create Account").click()
        page.wait_for_timeout(2000)

        # Check if we need to login (if registration redirected to login or failed)
        if "/login" in page.url or "Sign in" in page.content():
             print("Logging in...")
             page.get_by_label("Your email").fill(email)
             page.get_by_label("Your password").fill("password123")
             page.get_by_role("button", name="Login").click()
             page.wait_for_timeout(2000)

    except Exception as e:
        print(f"Registration/Login failed: {e}")

    # 1. Screenshot of Dashboard with Sidebar HIDDEN
    # Ensure we are on dashboard
    if "/login" not in page.url:
        page.screenshot(path="verification/mobile_sidebar_hidden.png")
        print("Screenshot 1 taken: mobile_sidebar_hidden.png")

        # 2. Click Toggle
        # Wait for toggle
        try:
            page.get_by_label("Open sidebar").click()
            page.wait_for_timeout(1000) # Wait for transition

            # 3. Screenshot of Sidebar VISIBLE
            page.screenshot(path="verification/mobile_sidebar_visible.png")
            print("Screenshot 2 taken: mobile_sidebar_visible.png")
        except Exception as e:
            print(f"Failed to click toggle: {e}")
            page.screenshot(path="verification/mobile_error.png")

    else:
        print("Failed to login for screenshot.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
