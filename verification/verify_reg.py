from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:5173/events")
    page.wait_for_timeout(1000)

    if "Sign in" in page.content() or "Login" in page.title():
        if page.get_by_text("Create account").is_visible():
            page.get_by_text("Create account").click()
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/register_page.png")
            print("Screenshot saved to verification/register_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
