from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:5173/events")
    page.wait_for_timeout(1000)

    email = "test" + str(time.time()) + "@example.com"
    password = "password123"

    if "Sign in" in page.content() or "Login" in page.title():
        print("Login page detected.")
        if page.get_by_text("Create account").is_visible():
            print("Registering new user...")
            page.get_by_text("Create account").click()
            page.wait_for_url("**/register")

            page.get_by_label("Full Name").fill("Test User")
            page.get_by_label("Your email").fill(email)
            page.get_by_label("Your password").fill(password)

            page.get_by_role("button", name="Create Account").click()
            page.wait_for_timeout(3000)
            print("Registration submitted.")

            if "Sign in" in page.content():
                print("Logging in...")
                page.get_by_label("Your email").fill(email)
                page.get_by_label("Your password").fill(password)
                page.get_by_role("button", name="Login to your account").click()
                page.wait_for_timeout(3000)

    # Events Page
    page.goto("http://localhost:5173/events")
    page.wait_for_timeout(2000)
    page.screenshot(path="verification/events_page_logged_in.png")

    try:
        create_btn = page.get_by_role("button", name="Create New Event")
        if create_btn.is_visible():
            print("Create New Event button visible.")
            create_btn.click()
            page.wait_for_selector("text=Create New Event", state="visible")
            page.screenshot(path="verification/events_modal.png")
            print("Modal opened.")

            # Check inputs in modal
            expect(page.get_by_label("Event Name")).to_be_visible()
            expect(page.get_by_label("Status")).to_be_visible()

            page.get_by_role("button", name="Cancel").click()
            print("Modal closed.")
        else:
            print("Create New Event button NOT visible.")
    except Exception as e:
        print(f"Error checking Events page: {e}")

    # Business Page
    page.goto("http://localhost:5173/business")
    page.wait_for_timeout(2000)
    page.screenshot(path="verification/business_page_logged_in.png")

    try:
        expect(page.get_by_label("Select Book")).to_be_visible()

        if page.get_by_role("button", name="Add Expense").is_visible():
             page.get_by_role("button", name="Add Expense").click()
             page.wait_for_selector("text=Add New Expense", state="visible")
             page.screenshot(path="verification/expense_modal.png")
             print("Expense Modal opened.")
             # Close via X button
             page.get_by_role("button", name="Close modal").click()
    except Exception as e:
        print(f"Error checking Business page: {e}")

    # Inventory Page
    page.goto("http://localhost:5173/inventory")
    page.wait_for_timeout(2000)
    page.screenshot(path="verification/inventory_page.png")

    try:
        expect(page.get_by_label("Select Inventory")).to_be_visible()
        if page.get_by_role("button", name="Add Item").is_visible():
            print("Add Item button visible.")
            page.get_by_role("button", name="Add Item").click()
            page.wait_for_selector("text=Add New Item", state="visible")
            page.screenshot(path="verification/inventory_modal.png")
            # Close via Cancel button (Inventory modals have Cancel)
            page.get_by_role("button", name="Cancel").click()
    except Exception as e:
        print(f"Error checking Inventory page: {e}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
