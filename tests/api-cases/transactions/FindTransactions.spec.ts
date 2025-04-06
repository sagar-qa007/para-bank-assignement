import { test, expect, request } from "@playwright/test";
import {
  registerViaAPI,
  loginViaAPI,
  getTransactionAccounts,
  fundTransfer,
  findTransactionByAmount,
} from "../../../pages/ApisLib";

test("💸 Search for fund transfer transaction by amount", async ({
  browser,
}) => {
  const amount = "199";
  const { username, password } = await registerViaAPI();
  const page = await loginViaAPI(browser, username, password);

  const context = page.context();
  const cookies = await context.cookies();
  const jsession = cookies.find((c) => c.name === "JSESSIONID");

  const apiContext = await request.newContext({
    baseURL: "/parabank",
    extraHTTPHeaders: {
      Cookie: `JSESSIONID=${jsession?.value}`,
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  const accounts = await getTransactionAccounts(apiContext);
  const fromAccountId = accounts[0].id.toString();
  const toAccountId = accounts[0].id.toString();

  await fundTransfer(apiContext, fromAccountId, toAccountId, amount);

  const transactions = await findTransactionByAmount(
    apiContext,
    fromAccountId,
    amount
  );

  console.log("🔍 Matching transactions:");
  for (const tx of transactions) {
    console.log(
      `   ID: ${tx.id}, Type: ${tx.type}, Amount: ${tx.amount}, Description: ${tx.description}`
    );
  }

  expect(
    transactions.some(
      (t) => t.amount === 199 && t.description.includes("Transfer")
    )
  ).toBe(true);
});
