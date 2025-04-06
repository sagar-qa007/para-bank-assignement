import {
  APIRequestContext,
  Browser,
  BrowserContext,
  Page,
  request,
  expect,
} from "@playwright/test";

export async function loginViaAPI(
  browser: Browser,
  username: string,
  password: string
): Promise<Page> {
  const API_URL = "https://parabank.parasoft.com/parabank/login.htm";
  const UI_URL = "https://parabank.parasoft.com/parabank";

  const context: APIRequestContext = await request.newContext();

  const response = await context.post(API_URL, {
    form: {
      username,
      password,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: "https://parabank.parasoft.com",
      Referer: "https://parabank.parasoft.com/parabank/index.htm?ConnType=JDBC",
    },
  });

  if (!response.ok()) {
    const body = await response.text();
    console.error(`❌ Login failed: ${response.status()}`);
    console.log("📄 Body:", body.slice(0, 300));
    throw new Error("Login via API failed");
  }

  const storageState = await context.storageState();
  const browserContext: BrowserContext = await browser.newContext({
    storageState,
  });
  const page: Page = await browserContext.newPage();
  await page.goto(UI_URL);

  console.log(`✅ Logged in successfully as "${username}"`);
  return page;
}

export async function registerViaAPI(): Promise<{
  context: APIRequestContext;
  username: string;
  password: string;
}> {
  const registrationUrl = "https://parabank.parasoft.com/parabank/register.htm";
  const context = await request.newContext();

  // 1️⃣ Fetch JSESSIONID by visiting registration page
  const pageResponse = await context.get(registrationUrl);
  const cookies = await context.storageState();
  const jsessionid = cookies.cookies.find(
    (c) => c.name === "JSESSIONID"
  )?.value;

  if (!jsessionid) {
    throw new Error("❌ Failed to fetch JSESSIONID cookie");
  }

  const random = Math.floor(Math.random() * 1_000_000);
  const username = `user_${random}`;
  const password = "Test@1234";

  const formData = {
    "customer.firstName": "Test",
    "customer.lastName": "User",
    "customer.address.street": "123 Pine St",
    "customer.address.city": "Austin",
    "customer.address.state": "TX",
    "customer.address.zipCode": "78701",
    "customer.phoneNumber": "9999999999",
    "customer.ssn": "123-45-6789",
    "customer.username": username,
    "customer.password": password,
    repeatedPassword: password,
  };

  const response = await context.post(registrationUrl, {
    form: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: "https://parabank.parasoft.com",
      Referer: registrationUrl,
      Cookie: `JSESSIONID=${jsessionid}`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
      "Upgrade-Insecure-Requests": "1",
    },
  });

  const body = await response.text();
  if (!response.ok()) {
    console.error("❌ Registration failed");
    console.log("📄 Response snippet:", body.slice(0, 500));
    throw new Error("Registration via API failed");
  }

  console.log(`✅ Registered user: ${username}`);
  return { context, username, password };
}

export async function getTransactionAccounts(
  apiContext: APIRequestContext,
  customerId: number = 12545
) {
  const endpoint = `https://parabank.parasoft.com/parabank/services_proxy/bank/customers/${customerId}/accounts`;
  console.log("📤 Sending GET request to:", endpoint);

  const res = await apiContext.get(endpoint);

  const status = res.status();
  const headers = res.headers();
  const responseBody = await res.text();

  console.log("📥 Status Code:", status);
  console.log("📥 Response Headers:", headers);
  console.log("📥 Raw Response Body (first 300 chars):\n", responseBody.slice(0, 300), "...");

  expect(res.ok()).toBeTruthy();

  let accounts;
  try {
    accounts = JSON.parse(responseBody);
  } catch (e) {
    console.error("❌ Failed to parse accounts JSON:", e);
    throw e;
  }

  expect(accounts.length).toBeGreaterThan(0);
  console.log("✅ Accounts retrieved:", accounts);

  return accounts;
}

export async function fundTransfer(
  apiContext: APIRequestContext,
  fromAccountId: string,
  toAccountId: string,
  amount: string
) {
  const res = await apiContext.post(
    `https://parabank.parasoft.com/parabank/services_proxy/bank/transfer?fromAccountId=${fromAccountId}&toAccountId=${toAccountId}&amount=${amount}`,
    { headers: { "Content-Length": "0" } }
  );

  expect(res.ok()).toBeTruthy();
  const message = await res.text();
  expect(message).toContain(`Successfully transferred $${amount}`);
}

export async function findTransactionByAmount(
  apiContext: APIRequestContext,
  accountId: string,
  amount: string
) {
  const res = await apiContext.get(
    `https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountId}/transactions/amount/${amount}?timeout=30000`
  );

  expect(res.ok()).toBeTruthy();

  const transactions = await res.json();
  expect(transactions.length).toBeGreaterThan(0);

  return transactions;
}
