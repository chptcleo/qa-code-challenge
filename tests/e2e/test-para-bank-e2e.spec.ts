import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/user/login-page";
import testData from "./test-para-bank-e2e.json";
import { generateRandomSixDigitString } from "../../src/utils/string-util";
import { globalVars } from "../global-vars";

test.describe.serial("Test Parabank E2E", () => {
  globalVars.username = "qa_user_" + generateRandomSixDigitString();
  globalVars.password = testData.user_info.password;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await expect(page).toHaveTitle(/Welcome/);
  });

  test("Test registration @smoke @regression", async ({ page }) => {
    // Navigate to Register page
    let registerPage = await loginPage.gotoRegisterPage();
    await expect(page).toHaveTitle(/Register/);

    // Fill in registration form and submit
    await registerPage.register(
      testData.user_info.first_name,
      testData.user_info.last_name,
      testData.user_info.address,
      testData.user_info.city,
      testData.user_info.state,
      testData.user_info.zip_code,
      testData.user_info.phone,
      testData.user_info.ssn,
      globalVars.username,
      testData.user_info.password
    );
    await expect(page).toHaveTitle(/Customer Created/);
    expect(await registerPage.getWelcomeMessage()).toBe(`Welcome ${globalVars.username}`);
    expect(await registerPage.getPromptMessage()).toBe(
      "Your account was created successfully. You are now logged in."
    );

    // Logout
    loginPage = await registerPage.getCustomerMenu().logout();
    await expect(page).toHaveTitle(/Welcome/);
  });

  test("Test global navigation menu @smoke @regression", async ({ page }) => {
    // Login first
    let accountsOverviewPage = await loginPage.login(
      globalVars.username,
      testData.user_info.password
    );
    await expect(page).toHaveTitle(/Accounts Overview/);

    // Skip as there is no link for Solutions menu item
    // await accountsOverviewPage.getNavigator().navigateToSolutions();
    // await expect(page).toHaveTitle(/Solutions/);
    // await page.goBack();

    // Navigate through other menu items
    await accountsOverviewPage.getNavigator().navigateToAboutUs();
    await expect(page).toHaveTitle(/About Us/);
    await page.goBack();

    await accountsOverviewPage.getNavigator().navigateToServices();
    await expect(page).toHaveTitle(/Services/);
    await page.goBack();

    await accountsOverviewPage.getNavigator().navigateToProducts();
    await expect(page).toHaveTitle(/Ensure Quality/);
    await page.goBack();

    await accountsOverviewPage.getNavigator().navigateToLocations();
    await expect(page).toHaveTitle(/Solutions For Every Testing Need/);
    await page.goBack();

    await accountsOverviewPage.getNavigator().navigateToAdminPage();
    await expect(page).toHaveTitle(/Administration/);
    await page.goBack();
  });

  test("Test transfer funds and pay bill @regression", async ({ page }) => {
    // Login first
    let accountsOverviewPage = await loginPage.login(
      globalVars.username,
      testData.user_info.password
    );
    await expect(page).toHaveTitle(/Accounts Overview/);

    // Open a new account
    let openNewAccountPage = await accountsOverviewPage
      .getCustomerMenu()
      .gotoOpenNewAccount();
    expect(page).toHaveTitle(/Open Account/);

    await openNewAccountPage.openNewAccount("SAVINGS");
    const newAccountNumber = await openNewAccountPage.getNewAccountNumber();
    expect(newAccountNumber).not.toBeNull();
    globalVars.accountNumber = newAccountNumber;

    // Go to Accounts Overview page
    accountsOverviewPage = await openNewAccountPage
      .getCustomerMenu()
      .gotoAccountsOverview();
    expect(page).toHaveTitle(/Accounts Overview/);

    // Verify there are balance items
    const balanceItems = await accountsOverviewPage.getBalanceItems();
    expect(balanceItems.length).toBeGreaterThan(0);

    // Transfer funds
    let transferFundsPage = await accountsOverviewPage
      .getCustomerMenu()
      .gotoTransferFunds();
    expect(page).toHaveTitle(/Transfer Funds/);

    await transferFundsPage.transferFunds("1", newAccountNumber);
    expect(await transferFundsPage.getTransferCompleteMessage()).toBe(
      "Transfer Complete!"
    );
    expect(await transferFundsPage.getTransferAmountResult()).toBe("$1.00");
    expect(await transferFundsPage.getFromAccountIdResult()).toBe(
      newAccountNumber
    );

    // Pay Bill
    let billPayPage = await transferFundsPage.getCustomerMenu().gotoBillPay();
    expect(page).toHaveTitle(/Bill Pay/);

    await billPayPage.sendPayment(
      testData.payee_info.payee_name,
      testData.payee_info.address,
      testData.payee_info.city,
      testData.payee_info.state,
      testData.payee_info.zip_code,
      testData.payee_info.phone,
      testData.payee_info.account,
      testData.payee_info.amount,
      newAccountNumber
    );
    expect(await billPayPage.getBillPayCompleteMessage()).toBe(
      "Bill Payment Complete"
    );

    expect(await billPayPage.getPayeeNameResult()).toBe(
      testData.payee_info.payee_name
    );
    expect(await billPayPage.getAmountResult()).toBe(
      `$${testData.payee_info.amount}.00`
    );
    expect(await billPayPage.getFromAccountIdResult()).toBe(newAccountNumber);
    globalVars.billAmount = testData.payee_info.amount;
  });
});
