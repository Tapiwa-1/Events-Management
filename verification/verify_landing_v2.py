import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        # Increase the timeout for slower environments
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Build and serve the app
        print("Starting dev server...")
        process = await asyncio.create_subprocess_shell(
            "npm run dev -- --port 5173",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        # Wait for the server to be ready
        await asyncio.sleep(5)

        try:
            print("Navigating to landing page...")
            await page.goto("http://localhost:5173/")

            # Check for RS Events content
            await page.wait_for_selector("text=RS Events", timeout=5000)

            # Take screenshot
            screenshot_path = "/home/jules/verification/landing_rs_v2.png"
            await page.screenshot(path=screenshot_path, full_page=True)
            print(f"Screenshot saved to {screenshot_path}")

            # Verify some text
            title = await page.inner_text("h1")
            print(f"Page title: {title}")

            if "RS Events" in title:
                print("Verification SUCCESS: Landing page content found.")
            else:
                print(f"Verification FAILURE: Expected 'RS Events' in title, got '{title}'")
                exit(1)

        except Exception as e:
            print(f"An error occurred: {e}")
            exit(1)
        finally:
            process.terminate()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
