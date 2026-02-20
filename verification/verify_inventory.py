from playwright.sync_api import sync_playwright, expect
import json

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Mock API responses
    # 1. Auth
    page.route("**/api/auth/me", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps({"id": 1, "name": "Admin", "role": "admin", "email": "admin@example.com"})
    ))

    # 2. Inventory Items
    page.route("**/api/inventory?type=pa", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps([{"id": 1, "name": "Speaker", "category": "Fixed Asset", "total_quantity": 10, "condition": "Good", "location": "Store", "last_checked": "2024-01-01"}])
    ))
    # Catch-all for inventory calls
    page.route("**/api/inventory", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='[]'
    ))


    # 3. Movement Log
    page.route("**/api/inventory/movement", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps([{"id": 1, "event_name": "Event 1", "item_name": "Speaker", "qty_out": 2, "qty_back": 2, "event_date": "2024-01-01", "missing": 0, "condition_return": "Good", "event_id": 1}])
    ))

    # 4. Maintenance
    page.route("**/api/inventory/maintenance", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps([{"id": 1, "item_name": "Speaker", "issue": "Broken", "status": "Pending", "date": "2024-01-01", "action": "None", "cost": 0, "item_id": 1}])
    ))

    # 5. Events (for filter)
    page.route("**/api/events", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps([{"id": 1, "name": "Event 1", "date": "2024-01-01"}])
    ))

    # 6. Consumables
    page.route("**/api/inventory/consumables", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='[]'
    ))

    print("Navigating to /inventory...")
    page.goto("http://localhost:5173/inventory")
    # Wait for Vue to render and API calls to complete
    page.wait_for_timeout(2000)

    # Verify we are on inventory page
    if "Sign in" in page.content():
        print("Still on login page! Mock might have failed or redirect logic is tricky.")

    print(f"Current URL: {page.url}")
    page.screenshot(path="verification/inventory_mocked.png")

    # Verify Register Tab Filter
    print("Checking Register Tab filter...")
    try:
        # Check for BaseSelect presence via its option
        select = page.locator("select").filter(has_text="All Categories")
        expect(select).to_be_visible()
        print("Register filter found.")
    except Exception as e:
        print(f"Register filter check failed: {e}")

    # Click Movement Log Tab
    print("Switching to Movement Log tab...")
    try:
        page.get_by_role("button", name="Movement Log").click()
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/inventory_tab_movement.png")

        # Verify Movement Log Filter ("All Events")
        print("Checking Movement Log filter...")
        select = page.locator("select").filter(has_text="All Events")
        expect(select).to_be_visible()
        print("Movement filter found.")

        count = select.count()
        if count == 1:
            print("Movement filter count is 1 (Correct).")
        else:
            print(f"Movement filter count is {count} (Incorrect).")
    except Exception as e:
         print(f"Movement log tab check failed: {e}")

    # Click Maintenance Tab
    print("Switching to Maintenance tab...")
    try:
        page.get_by_role("button", name="Maintenance").click()
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/inventory_tab_maintenance.png")

        # Verify Maintenance Filter ("All Statuses")
        print("Checking Maintenance filter...")
        select = page.locator("select").filter(has_text="All Statuses")
        expect(select).to_be_visible()
        print("Maintenance filter found.")
    except Exception as e:
        print(f"Maintenance tab check failed: {e}")

    browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
