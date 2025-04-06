import { Locator, Page, expect } from "@playwright/test";

export class LoginLib {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly logoutLink: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.logoutLink = page.locator("text=Log Out");
    this.registerButton = page.locator("text=Register");
  }

  async openApp(url: string): Promise<void> {
    console.log(`Navigating to URL: ${url}`);
    await this.page.goto(url, { timeout: 300000 });
    await this.page.waitForLoadState("networkidle");
  }

  async performLogin(username: string, password: string) {
    console.log(`Attempting login with username: ${username}`);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.page.getByRole("button", { name: "Log In" }).click();
  }

  async isLoginSuccessful(): Promise<boolean> {
    console.log("Verifying login success...");
    await this.page.waitForLoadState("networkidle");
    return this.logoutLink.isVisible();
  }

  async navigateToRegister() {
    console.log("Navigating to registration page");
    await this.registerButton.isVisible();
    await this.registerButton.click();
  }

  async performLogout() {
    console.log("Clicking on Log Out");
    await this.logoutLink.click();
  }
}