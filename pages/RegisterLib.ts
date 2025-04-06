import { Locator, Page } from "@playwright/test";

export class RegisterLib {
  readonly page: Page;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private streetInput: Locator;
  private cityInput: Locator;
  private stateInput: Locator;
  private zipCodeInput: Locator;
  private phoneNumberInput: Locator;
  private ssnInput: Locator;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private repeatedPasswordInput: Locator;
  private submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="customer.firstName"]');
    this.lastNameInput = page.locator('input[name="customer.lastName"]');
    this.streetInput = page.locator('input[name="customer.address.street"]');
    this.cityInput = page.locator('input[name="customer.address.city"]');
    this.stateInput = page.locator('input[name="customer.address.state"]');
    this.zipCodeInput = page.locator('input[name="customer.address.zipCode"]');
    this.phoneNumberInput = page.locator('input[name="customer.phoneNumber"]');
    this.ssnInput = page.locator('input[name="customer.ssn"]');
    this.usernameInput = page.locator('input[name="customer.username"]');
    this.passwordInput = page.locator('input[name="customer.password"]');
    this.repeatedPasswordInput = page.locator('input[name="repeatedPassword"]');
    this.submitButton = page.locator('input[type="submit"][value="Register"]');
  }

  async fillRegistrationForm(data: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    ssn: string;
    username: string;
    password: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.streetInput.fill(data.street);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipCodeInput.fill(data.zipCode);
    await this.phoneNumberInput.fill(data.phoneNumber);
    await this.ssnInput.fill(data.ssn);
    await this.usernameInput.fill(data.username);
    await this.passwordInput.fill(data.password);
    await this.repeatedPasswordInput.fill(data.password);
  }

  async submitForm() {
    await this.submitButton.click();
  }
}