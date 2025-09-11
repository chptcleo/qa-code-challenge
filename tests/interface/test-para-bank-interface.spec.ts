import { test, expect, request, APIRequestContext } from "@playwright/test";
import { getAppConfig } from "../../src/utils/config-util";
import { globalVars } from "../global-vars";

test.describe.serial("Test Parabank Interface", () => {
  let apiContext: APIRequestContext;
  let jsessionId: string | undefined;
  
  test.beforeAll(async () => {
    apiContext = await request.newContext({
      baseURL: getAppConfig().baseURL,
    });

    const loginResponse = await apiContext.post(
      `/parabank/login.htm?username=${globalVars.username}&password=${globalVars.password}`
    );
    expect(loginResponse.ok()).toBeTruthy();

    const storage = await apiContext.storageState();
    jsessionId = storage.cookies[0].value;
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test("Test find transactions @regression", async () => {
    apiContext = await request.newContext({
      baseURL: getAppConfig().baseURL,
      extraHTTPHeaders: {
        Accept: "application/json",
        Cookie: `JSESSIONID=${jsessionId}`,
      },
    });
    const response = await apiContext.get(
      `/parabank/services_proxy/bank/accounts/${globalVars.accountNumber}/transactions/amount/${globalVars.billAmount}?timeout=30000`
    );
    expect(response.ok()).toBeTruthy();

    // Sometimes the interface returns an empty array even if response status code is 200
    const body = await response.json();
    body.forEach((transaction: any) => {
      expect(String(transaction.accountId)).toEqual(globalVars.accountNumber);
      expect(String(transaction.amount)).toEqual(globalVars.billAmount);
    });
  });
});
