import { Page, Locator, expect } from "@playwright/test";

interface BillPaymentDetails {
  payeeName: string;
  payeeStreet: string;
  payeeCity: string;
  payeeState: string;
  payeeZipCode: string;
  payeePhoneNumber: string;
  payeeAccountNumber: string;
  verifyAccount: string;
  amount: string;
}

export class BillPayLib {
  readonly page: Page;
  private sendPaymentBtn: Locator;
  private nameInput: Locator;
  private streetInput: Locator;
  private cityInput: Locator;
  private stateInput: Locator;
  private zipInput: Locator;
  private phoneInput: Locator;
  private accNumInput: Locator;
  private verifyAccInput: Locator;
  private amountInput: Locator;
  private successMsg: Locator;
  private billPayLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sendPaymentBtn = page.locator(
      'input[type="button"][value="Send Payment"]'
    );
    this.billPayLink = page.locator('a[name="Bill Pay"]');
    this.nameInput = page.locator('input[name="payee.name"]');
    this.streetInput = page.locator('input[name="payee.address.street"]');
    this.cityInput = page.locator('input[name="payee.address.city"]');
    this.stateInput = page.locator('input[name="payee.address.state"]');
    this.zipInput = page.locator('input[name="payee.address.zipCode"]');
    this.phoneInput = page.locator('input[name="payee.phoneNumber"]');
    this.accNumInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.successMsg = page.locator('h1:has-text("Bill Payment Complete")');
  }

  async verifyBillPayPage() {
    console.log("🔎 Verifying Bill Pay page...");
    await expect(this.sendPaymentBtn).toBeVisible();
    console.log("✅ Bill Pay page loaded");
  }

  async fillBillPaymentDetails(payment: BillPaymentDetails) {
    console.log("✍️  Filling out bill payment form...");
    await this.page
      .locator('[name="fromAccountId"]')
      .first()
      .waitFor({ state: "attached" });
    await this.nameInput.click();
    await this.nameInput.fill(payment.payeeName);
    await this.streetInput.fill(payment.payeeStreet);
    await this.cityInput.fill(payment.payeeCity);
    await this.stateInput.fill(payment.payeeState);
    await this.zipInput.fill(payment.payeeZipCode);
    await this.phoneInput.fill(payment.payeePhoneNumber);
    await this.accNumInput.fill(payment.payeeAccountNumber);
    await this.verifyAccInput.fill(payment.verifyAccount);
    await this.amountInput.fill(payment.amount);
    console.log("📨 Submitting bill payment...");
    await this.nameInput.click();
    await this.sendPaymentBtn.click();
    if (await this.sendPaymentBtn.isVisible()) {
      await this.page.mouse.move(10, 20);
      await this.sendPaymentBtn.dblclick({ force: true });
    }
  }

  async verifyPaymentSuccess() {
    console.log("⏳ Waiting for payment success confirmation...");
    await this.successMsg.waitFor();
    const visible = await this.successMsg.isVisible();
    console.log(visible ? "✅ Payment successful" : "❌ Payment failed");
    return visible;
  }

  async getSuccessMessage() {
    const message = await this.successMsg.textContent();
    console.log("📩 Payment success message:", message);
    return message;
  }
}
