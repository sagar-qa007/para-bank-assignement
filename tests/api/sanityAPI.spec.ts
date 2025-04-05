import { test, expect, request } from '@playwright/test';

test('GET account details', async ({}) => {
  const apiContext = await request.newContext({
    baseURL: 'https://parabank.parasoft.com/parabank',
  });

  const response = await apiContext.get('/services/bank/customers/12212/accounts');
  expect(response.ok()).toBeTruthy();

  const responseBody = await response.json();
  expect(responseBody).toBeInstanceOf(Array);
  expect(responseBody.length).toBeGreaterThan(0);
});