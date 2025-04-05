import { test, expect, request } from "@playwright/test";
import { apiLogin } from "../../../pages/apiLib";

test.describe("🔍 Find Transactions By Amount", () => {
  let apiContext;
  const amountToSearch = "500";

  test.beforeAll(async ({ browser, baseURL }) => {
    const { cookies } = await apiLogin(browser, baseURL!);
    const jsession = cookies.find((c) => c.name === "JSESSIONID");

    apiContext = await request.newContext({
      baseURL: `${baseURL}/parabank`,
      extraHTTPHeaders: {
        Cookie: `JSESSIONID=${jsession.value}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    });
  });

  test("Search transactions by amount and validate response", async () => {
    console.log(`🔍 Searching for transactions by amount: ${amountToSearch}`);

    const res = await apiContext.get(`/services_proxy/bank/findTransByAmount?amount=${amountToSearch}`);
    console.log(`📦 API Response Status: ${res.status()}`);
    expect(res.ok()).toBeTruthy();

    const body = await res.text();
    console.log("📄 Raw Response:", body.substring(0, 200) + "...");

    expect(body).toContain(amountToSearch);
  });
});