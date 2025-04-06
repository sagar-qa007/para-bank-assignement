import { Locator, Page } from "@playwright/test";

export class TransferFundsLib {
  readonly page: Page;
  private amountInput: Locator;
  private fromAccountDropdown: Locator;
  private toAccountDropdown: Locator;
  private transferBtn: Locator;
  private successPanel: Locator;
  private resultMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.amountInput = page.locator("#amount");
    this.fromAccountDropdown = page.locator("select#fromAccountId");
    this.toAccountDropdown = page.locator("select#toAccountId");
    this.transferBtn = page.locator('input[type="submit"]');
    this.successPanel = page.locator("#rightPanel:has-text('Transfer Complete!')");
    this.resultMessage = page.locator("#showResult .title");
  }

  async initiateTransfer(amount: string, fromIndex: string, toIndex: string) {
    await this.amountInput.fill(amount);
    const fromOptions = this.fromAccountDropdown.locator("option");
    const toOptions = this.toAccountDropdown.locator("option");
    const fromCount = await fromOptions.count();
    const toCount = await toOptions.count();
    if (parseInt(fromIndex) <= fromCount) {
      await this.fromAccountDropdown.selectOption({ index: parseInt(fromIndex) - 1 });
    }
    if (parseInt(toIndex) <= toCount) {
      await this.toAccountDropdown.selectOption({ index: parseInt(toIndex) - 1 });
    }
    await this.transferBtn.click();
  }

  async waitForTransferConfirmation() {
    await this.successPanel.waitFor({ state: "visible" });
  }

  async getTransferResultText() {
    return await this.resultMessage.allTextContents();
  }
}