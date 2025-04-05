import {
    request,
    APIRequestContext,
    Browser,
    BrowserContext,
    Page,
    expect
  } from "@playwright/test";
  
  const username = process.env.USERNAME!;
  const password = process.env.PASSWORD!;
  
  export async function apiLogin(browser: Browser, baseURL: string): Promise<{ page: Page; cookies: any }> {
    const context: BrowserContext = await browser.newContext();
    const page: Page = await context.newPage();
  
    console.log("🔐 Logging in via UI form...");
    await page.goto(`${baseURL}/parabank/index.htm`);
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('input[type="submit"]');
  
    await page.waitForURL('**/overview.htm');
    console.log("✅ Logged in and redirected to Overview");
  
    const cookies = await context.cookies();
    const jsessionCookie = cookies.find((c) => c.name === "JSESSIONID");
  
    if (!jsessionCookie) throw new Error("❌ Login failed: JSESSIONID not found");
  
    return { page, cookies };
  }