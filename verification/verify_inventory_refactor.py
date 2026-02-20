from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    print("Navigating to login...")
    page.goto("http://localhost:5173/login")

    print("Logging in as admin...")
    page.get_by_label("Your email").fill("admin@example.com")
    page.get_by_label("Your password").fill("password123")
    page.get_by_role("button", name="Login to your account").click()

    # Wait for navigation or some dashboard element
    try:
        page.wait_for_url("**/dashboard", timeout=5000)
        print("Logged in successfully.")
    except:
        print("Login might have failed or redirect is slow.")
        page.screenshot(path="verification/login_fail.png")

    print("Navigating to Inventory...")
    page.goto("http://localhost:5173/inventory")

    try:
        # Check for header
        expect(page.get_by_text("Manage Inventory")).to_be_visible()
        print("Inventory page loaded.")

        # Check for table
        # Since we use BaseTable, it wraps a standard table.
        # We can check for specific headers to be sure the slot injection worked.
        expect(page.get_by_role("columnheader", name="Item Name")).to_be_visible()
        expect(page.get_by_role("columnheader", name="Category")).to_be_visible()

        print("Table headers found. Refactor seems successful.")

        page.screenshot(path="verification/inventory_refactor_success.png")
    except Exception as e:
        print(f"Verification failed: {e}")
        page.screenshot(path="verification/inventory_refactor_fail.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
