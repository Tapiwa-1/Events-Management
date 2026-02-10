from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login
    page.goto("http://localhost:5173/login")
    page.wait_for_timeout(1000)

    # Just try to login with a known user or skip if already logged in (unlikely in new context)
    # Since we can't easily persist auth across runs without saving state, we login every time.
    # Assuming "test@example.com" exists from previous run, or register.
    # Let's try to register a fresh one to be safe.
    page.goto("http://localhost:5173/register")
    email = f"test{time.time()}@example.com"
    page.get_by_label("Full Name").fill("Test User")
    page.get_by_label("Your email").fill(email)
    page.get_by_label("Your password").fill("password123")
    page.get_by_role("button", name="Create Account").click()
    page.wait_for_timeout(2000)

    # Should be redirected to / (Dashboard) or /login
    if "Sign in" in page.content():
         page.get_by_label("Your email").fill(email)
         page.get_by_label("Your password").fill("password123")
         page.get_by_role("button", name="Login to your account").click()
         page.wait_for_timeout(2000)

    # Events Page
    page.goto("http://localhost:5173/events")
    page.wait_for_timeout(2000)

    # Check for "Create New Event" button
    create_btn = page.get_by_role("button", name="Create New Event")
    if create_btn.is_visible():
        create_btn.click()
        page.wait_for_selector("text=Create New Event", state="visible")
        # Check inputs in modal (Status is only for edit)
        expect(page.get_by_label("Event Name")).to_be_visible()

        page.get_by_role("button", name="Cancel").click()
    else:
        print("Create New Event button NOT visible.")

    # Business Page
    page.goto("http://localhost:5173/business")
    page.wait_for_timeout(2000)

    expect(page.get_by_label("Select Book")).to_be_visible()

    if page.get_by_role("button", name="Add Expense").is_visible():
            page.get_by_role("button", name="Add Expense").click()
            page.wait_for_selector("text=Add New Expense", state="visible")
            # Close via X button
            page.get_by_role("button", name="Close modal").click()

    # Inventory Page
    page.goto("http://localhost:5173/inventory")
    page.wait_for_timeout(2000)

    expect(page.get_by_label("Select Inventory")).to_be_visible()
    if page.get_by_role("button", name="Add Item").is_visible():
        page.get_by_role("button", name="Add Item").click()
        page.wait_for_selector("text=Add New Item", state="visible")
        page.get_by_role("button", name="Cancel").click()

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
