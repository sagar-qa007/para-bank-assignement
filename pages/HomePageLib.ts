import { Locator, Page } from "@playwright/test";

export class HomePageLib {
  readonly page: Page;
  readonly btnOpenAccount: Locator;
  readonly btnUpdateProfile: Locator;
  readonly btnAccountsOverview: Locator;
  readonly btnBillPay: Locator;
  readonly btnRequestLoan: Locator;
  readonly btnLogout: Locator;
  readonly btnTransferFunds: Locator;

  constructor(page: Page) {
    this.page = page;
    this.btnUpdateProfile = page.getByRole("link", {
      name: "Update Contact Info",
    });
    this.btnOpenAccount = page.getByRole("link", { name: "Open New Account" });
    this.btnAccountsOverview = page.getByRole("link", {
      name: "Accounts Overview",
    });
    this.btnBillPay = page.getByRole("link", { name: "Bill Pay" });
    this.btnRequestLoan = page.getByRole("link", { name: "Request Loan" });
    this.btnLogout = page.getByRole("link", { name: "Log Out" });
    this.btnTransferFunds = page.getByRole("link", { name: "Transfer Funds" });
  }

  async navigateToUpdateProfile() {
    console.log("Navigating to Update Profile");
    await this.btnUpdateProfile.click();
  }

  async navigateToOpenAccount() {
    console.log("Navigating to Open New Account");
    await this.btnOpenAccount.click();
  }

  async navigateToAccountsOverview() {
    console.log("Navigating to Accounts Overview");
    await this.btnAccountsOverview.click();
  }

  async navigateToBillPay() {
    console.log("Navigating to Bill Pay");
    await this.btnBillPay.click();
  }

  async navigateToRequestLoan() {
    console.log("Navigating to Request Loan");
    await this.btnRequestLoan.click();
  }

  async navigateToTransferFunds() {
    console.log("Navigating to Transfer Funds");
    await this.btnTransferFunds.click();
    await this.page
      .locator("#fromAccountId option")
      .first()
      .waitFor({ state: "attached" });
  }

  async performLogout() {
    console.log("Logging out of the application");
    await this.btnLogout.click();
  }
}
