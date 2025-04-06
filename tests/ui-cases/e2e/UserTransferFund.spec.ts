import { expect, test } from "@playwright/test";
import { LoginLib } from "../../../Pages/LoginLib";
import { RegisterLib } from "../../../Pages/RegisterLib";
import { HomePageLib } from "../../../Pages/HomePageLib";
import { OpenAccountLib } from "../../../Pages/OpenAccountLib";
import { AccountsOverviewLib } from "../../../Pages/AccountsOverviewLib";
import { TransferFundsLib } from "../../../Pages/TransferFundsLib";
import { BillPayLib } from "../../../Pages/BillPayLib";
import readJsonFile from "../../../Utils";

const generateRandomUsername = (): string =>
  `user_${Math.floor(Math.random() * 1_000_000)}`;

test("PBTC-All | End-to-End Para Bank Flow", async ({ page }) => {
  const libs = {
    login: new LoginLib(page),
    register: new RegisterLib(page),
    home: new HomePageLib(page),
    openAccount: new OpenAccountLib(page),
    accounts: new AccountsOverviewLib(page),
    transfer: new TransferFundsLib(page),
    billPay: new BillPayLib(page),
  };

  const expectedData = readJsonFile("./fixture/json/response-1.json");
  const billPayData = readJsonFile(
    "./fixture/json/test-bill-payments-data.json"
  );
  const registrationData = {
    ...readJsonFile("./fixture/json/register-data.json"),
    username: generateRandomUsername(),
    password: "test@123",
  };

  let createdAccountNumber = "";

  await test.step("1. Navigate to Para bank application", async () => {
    await libs.login.openApp("/parabank/index.htm");
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/parabank/index.htm");
  });

  await test.step("2. Register new user", async () => {
    await libs.login.navigateToRegister();
    await libs.register.fillRegistrationForm(registrationData);
    await libs.register.submitForm();
    await libs.login.performLogout();
  });

  await test.step("3. Login with newly registered user", async () => {
    await libs.login.performLogin(
      registrationData.username,
      registrationData.password
    );
    expect(await libs.login.isLoginSuccessful()).toBe(true);
    expect(page.url()).toContain("/parabank/overview.htm");
  });

  await test.step("4. Verify Global Navigation works", async () => {
    await libs.home.navigateToAccountsOverview();
    expect(page.url()).toContain("overview.htm");

    await libs.home.navigateToTransferFunds();
    expect(page.url()).toContain("transfer.htm");

    await libs.home.navigateToOpenAccount();
    expect(page.url()).toContain("openaccount.htm");

    await libs.home.navigateToBillPay();
    expect(page.url()).toContain("billpay.htm");
  });

  await test.step("5. Create Savings Account and capture account number", async () => {
    await libs.home.navigateToOpenAccount();
    await libs.openAccount.openNewAccount("1");
    await libs.openAccount.waitForAccountOpened();

    expect(await libs.openAccount.getSuccessMessage()).toContain(
      expectedData.accountoverview
    );
    createdAccountNumber = await libs.openAccount.getNewAccountNumber();
    expect(createdAccountNumber).not.toBe("");
  });

  await test.step("6. Validate Accounts Overview balance details", async () => {
    await libs.home.navigateToAccountsOverview();

    const rows = await libs.accounts.getAllRows();
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const cells = await libs.accounts.getRowData(i);
      if (cells[0] === "Total") continue;

      expect(cells[0]).toBeDefined();
      expect(isNaN(Number(cells[0]))).toBe(false);
      expect(cells[1].trim()).not.toBe("");
      expect(cells[2].trim()).not.toBe("");
    }

    const footer = await libs.accounts.getFooter();
    expect(footer).toContain(expectedData.message);
  });

  await test.step("7. Transfer funds to another account", async () => {
    await libs.home.navigateToTransferFunds();
    await libs.transfer.initiateTransfer(
      "1000",
      createdAccountNumber,
      createdAccountNumber
    );
    await libs.transfer.waitForTransferConfirmation();

    expect(await libs.transfer.getTransferResultText()).toContain(
      expectedData.transferFunds
    );
  });

  await test.step("8. Pay bill using created account", async () => {
    await libs.home.navigateToBillPay();
    await libs.billPay.verifyBillPayPage();

    billPayData.fromAccount = createdAccountNumber;
    await libs.billPay.fillBillPaymentDetails(billPayData);
    await libs.billPay.verifyPaymentSuccess();

    expect(await libs.billPay.getSuccessMessage()).toBe(
      expectedData.successMessageBills
    );
  });
});
