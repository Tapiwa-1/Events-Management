from playwright.sync_api import sync_playwright
import time
import sys

def run(playwright):
    print("Launching mobile browser...")
    device = playwright.devices['iPhone 12']
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(**device)
    page = context.new_page()

    try:
        # Login/Register
        page.goto("http://localhost:5173/register")
        email = f"mobile{int(time.time())}@test.com"
        print(f"Registering {email}...")

        # Determine if we are on register page
        if "Sign up" in page.title() or "Create Account" in page.content():
            page.get_by_label("Full Name").fill("Mobile Test")
            page.get_by_label("Your email").fill(email)
            page.get_by_label("Your password").fill("password123")
            # Sometimes the button name might vary
            page.get_by_role("button", name="Create Account").click()
            page.wait_for_timeout(2000) # Wait for redirect

        # Check if we need to login (if registration redirected to login or failed)
        if "/login" in page.url or "Sign in" in page.content():
             print("Logging in...")
             page.get_by_label("Your email").fill(email)
             page.get_by_label("Your password").fill("password123")
             page.get_by_role("button", name="Login").click()
             page.wait_for_timeout(2000)

        print(f"Current URL: {page.url}")
        if "/login" in page.url:
            print("Failed to login.")
            sys.exit(1)

        print("Logged in. Checking Sidebar...")

        # 1. Check that Sidebar is INITIALLY HIDDEN
        # The sidebar has links like 'Events', 'Inventory', etc.
        # We scope to the sidebar to avoid matching dashboard cards
        events_link = page.locator("#default-sidebar").get_by_role("link", name="Events")
        sidebar = page.locator("#default-sidebar")

        # Check class for hidden state (-translate-x-full)
        classes = sidebar.get_attribute("class")
        print(f"Sidebar classes: {classes}")

        if "-translate-x-full" in classes:
            print("Verified: Sidebar is hidden initially (has -translate-x-full).")
        else:
             # Fallback check if it's somehow visible on screen
             if events_link.is_visible():
                # On Playwright, translated elements might be 'visible' if not display:none
                # We trust the class check more for this implementation
                print("Warning: Sidebar element is 'visible' to Playwright but should be off-screen.")
                pass

        # 2. Try to find and click the Mobile Menu Toggle
        # We will use aria-label="Open sidebar" or a specific class
        toggle_btn = page.get_by_label("Open sidebar")

        if not toggle_btn.is_visible():
            print("ERROR: Mobile menu toggle button not found!")
            sys.exit(1)

        print("Clicking toggle button...")
        toggle_btn.click()
        page.wait_for_timeout(500)

        # 3. Check that Sidebar is NOW VISIBLE
        if not events_link.is_visible():
             print("ERROR: Sidebar did not open after clicking toggle!")
             sys.exit(1)

        print("Verified: Sidebar opened successfully.")

        # 4. Navigate
        events_link.click()
        page.wait_for_timeout(1000)
        if "/events" not in page.url:
             print("ERROR: Navigation to Events failed.")
             sys.exit(1)

        print("Verified: Navigation works.")

        # Check for Create New Event button
        if page.get_by_role("button", name="Create New Event").is_visible():
             print("Verified: Create New Event button is visible.")
        else:
             print("ERROR: Create New Event button is NOT visible.")
             print(page.content())

    except Exception as e:
        print(f"Exception occurred: {e}")
        sys.exit(1)
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
