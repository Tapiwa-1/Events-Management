from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login Logic
    try:
        page.goto("http://localhost:5173/login")
        page.wait_for_timeout(1000)

        if "Sign in" in page.content() or "Login" in page.title():
            print("Logging in...")
            page.get_by_label("Your email").fill("admin@example.com")
            page.get_by_label("Your password").fill("password123")
            page.get_by_role("button", name="Login to your account").click()
            page.wait_for_timeout(3000)

        # Inventory Page
        page.goto("http://localhost:5173/inventory")
        page.wait_for_timeout(2000)

        print("Checking Inventory Page...")

        # Register Tab is default active.
        page.screenshot(path="verification/inventory_filters_register.png")
        print("Screenshot taken: verification/inventory_filters_register.png")

        # Switch to Movement Tab
        # Note: The tabs are buttons.
        page.get_by_role("button", name="Movement Log").click()
        page.wait_for_timeout(1000)

        # Screenshot
        page.screenshot(path="verification/inventory_filters_movement.png")
        print("Screenshot taken: verification/inventory_filters_movement.png")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
