import { Locator, Page } from "@playwright/test";

export class OpenAccountLib {
  readonly page: Page;
  private accountOpenedMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountOpenedMsg = page.locator("#openAccountResult .title");
  }

  async openNewAccount(accountType: string) {
    console.log(`Opening new account with type: ${accountType}`);
    await this.page.locator("#type").selectOption(accountType);
    await this.page.locator('#fromAccountId option').first().waitFor({ state: 'attached' });
    await this.page.locator('input[type="button"][value="Open New Account"]').dblclick();
  }

  async waitForAccountOpened() {
    console.log("Waiting for account to be opened...");
    await this.page.waitForSelector("#newAccountId", { timeout: 30000 });
    await this.page.waitForSelector('h1:has-text("Account Opened!")', { timeout: 30000 });
  }

  async getSuccessMessage() {
    const msg = await this.accountOpenedMsg.allTextContents();
    console.log("Success message:", msg);
    return msg;
  }

  async getNewAccountNumber(): Promise<string> {
    const accountNumberLocator = this.page.locator('#newAccountId');
    await accountNumberLocator.waitFor({ state: 'visible' });
    return await accountNumberLocator.textContent() ?? '';
  }
}