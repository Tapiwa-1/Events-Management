from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:5173/events")
    page.wait_for_timeout(1000)

    if "Sign in" in page.content() or "Login" in page.title():
        if page.get_by_text("Create account").is_visible():
            page.get_by_text("Create account").click()
            page.wait_for_url("**/register")

            page.get_by_label("Full Name").fill("Test User")
            page.get_by_label("Your email").fill("test" + str(time.time()) + "@example.com")
            page.get_by_label("Your password").fill("password123")
            page.get_by_role("button", name="Create Account").click()

            page.wait_for_timeout(3000)

            # Check for error
            if page.locator(".text-red-500").is_visible():
                print("Registration Error:", page.locator(".text-red-500").text_content())

            page.screenshot(path="verification/after_registration.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
