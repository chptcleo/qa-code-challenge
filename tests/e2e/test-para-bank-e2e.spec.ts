import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/user/login-page";
import testData from "./test-para-bank-e2e.json";
import { generateRandomSixDigitString } from "../../src/utils/string-util";
import { globalVars } from "../global-vars";

test.describe.serial("Test Parabank E2E", () => {
  // Generate a unique username for each test run
  const created_username = "qa_user_" + generateRandomSixDigitString();

  // Store created user credentials in globalVars for interface tests
  globalVars.username = created_username;
  globalVars.password = testData.user_info.password;

  // Page Titles
  const WELCOME_PAGE_TITLE = "ParaBank | Welcome | Online Banking";
  const REGISTER_PAGE_TITLE =
    "ParaBank | Register for Free Online Account Access";
  const CUSTOMER_CREATED_PAGE_TITLE = "ParaBank | Customer Created";
  const ACCOUNTS_OVERVIEW_PAGE_TITLE = "ParaBank | Accounts Overview";
  const ABOUT_US_PAGE_TITLE = "ParaBank | About Us";
  const SERVICES_PAGE_TITLE = "ParaBank | Services";
  const PRODUCTS_PAGE_TITLE =
    "Automated Software Testing Tools - Ensure Quality - Parasoft";
  const LOCATIONS_PAGE_TITLE =
    "Automated Software Testing Solutions For Every Testing Need";
  const ADMIN_PAGE_TITLE = "ParaBank | Administration";
  const OPEN_ACCOUNT_PAGE_TITLE = "ParaBank | Open Account";
  const TRANSFER_FUNDS_PAGE_TITLE = "ParaBank | Transfer Funds";
  const BILL_PAY_PAGE_TITLE = "ParaBank | Bill Pay";

  // Page Objects
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.openLoginPage();
    await expect(page).toHaveTitle(WELCOME_PAGE_TITLE);
  });

  test("Test registration @smoke @regression", async ({ page }) => {
    // Navigate to Register page
    let registerPage = await loginPage.gotoRegisterPage();
    await expect(page).toHaveTitle(REGISTER_PAGE_TITLE);

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
      created_username,
      testData.user_info.password,
    );
    await expect(page).toHaveTitle(CUSTOMER_CREATED_PAGE_TITLE);
    expect(await registerPage.getWelcomeMessage()).toBe(
      `Welcome ${created_username}`,
    );
    expect(await registerPage.getPromptMessage()).toBe(
      "Your account was created successfully. You are now logged in.",
    );

    // Logout
    loginPage = await registerPage.getCustomerMenu().logout();
    await expect(page).toHaveTitle(WELCOME_PAGE_TITLE);
  });

  test("Test global navigation menu @smoke @regression", async ({ page }) => {
    // Login first
    let accountsOverviewPage = await loginPage.login(
      created_username,
      testData.user_info.password,
    );
    await expect(page).toHaveTitle(ACCOUNTS_OVERVIEW_PAGE_TITLE);

    // Skip Solutions menu as there is no link with it

    // Navigate through other menu items
    await accountsOverviewPage.getNavigator().navigateToAboutUs();
    await expect(page).toHaveTitle(ABOUT_US_PAGE_TITLE);
    await page.goBack();

    await accountsOverviewPage.getNavigator().navigateToServices();
    await expect(page).toHaveTitle(SERVICES_PAGE_TITLE);
    await page.goBack();

    await accountsOverviewPage.getNavigator().navigateToProducts();
    await expect(page).toHaveTitle(PRODUCTS_PAGE_TITLE);
    await page.goBack();

    await accountsOverviewPage.getNavigator().navigateToLocations();
    await expect(page).toHaveTitle(LOCATIONS_PAGE_TITLE);
    await page.goBack();

    await accountsOverviewPage.getNavigator().navigateToAdminPage();
    await expect(page).toHaveTitle(ADMIN_PAGE_TITLE);
    await page.goBack();
  });

  test("Test transfer funds and pay bill @regression", async ({ page }) => {
    // Login first
    let accountsOverviewPage = await loginPage.login(
      created_username,
      testData.user_info.password,
    );
    await expect(page).toHaveTitle(ACCOUNTS_OVERVIEW_PAGE_TITLE);

    // Open a new account
    let openNewAccountPage = await accountsOverviewPage
      .getCustomerMenu()
      .gotoOpenNewAccount();
    expect(page).toHaveTitle(OPEN_ACCOUNT_PAGE_TITLE);

    await openNewAccountPage.openNewAccount("SAVINGS");
    const newAccountNumber = await openNewAccountPage.getNewAccountNumber();
    expect(newAccountNumber).not.toBeNull();
    globalVars.accountNumber = newAccountNumber;

    // Go to Accounts Overview page
    accountsOverviewPage = await openNewAccountPage
      .getCustomerMenu()
      .gotoAccountsOverview();
    expect(page).toHaveTitle(ACCOUNTS_OVERVIEW_PAGE_TITLE);

    // Verify the balance details
    const newAccountOverviewItem =
      await accountsOverviewPage.getAccountsOverviewItemByIndex(1);
    expect(await newAccountOverviewItem.getAccountNumber()).toBe(
      newAccountNumber,
    );
    expect(await newAccountOverviewItem.getAccountBalance()).toBe("$100.00");
    expect(await newAccountOverviewItem.getAvailableAmount()).toBe("$100.00");

    // Transfer funds
    let transferFundsPage = await accountsOverviewPage
      .getCustomerMenu()
      .gotoTransferFunds();
    expect(page).toHaveTitle(TRANSFER_FUNDS_PAGE_TITLE);

    await transferFundsPage.transferFunds("1", newAccountNumber);
    expect(await transferFundsPage.getTransferCompleteMessage()).toBe(
      "Transfer Complete!",
    );
    expect(await transferFundsPage.getTransferAmountResult()).toBe("$1.00");
    expect(await transferFundsPage.getFromAccountIdResult()).toBe(
      newAccountNumber,
    );

    // Pay Bill
    let billPayPage = await transferFundsPage.getCustomerMenu().gotoBillPay();
    expect(page).toHaveTitle(BILL_PAY_PAGE_TITLE);

    await billPayPage.sendPayment(
      testData.payee_info.payee_name,
      testData.payee_info.address,
      testData.payee_info.city,
      testData.payee_info.state,
      testData.payee_info.zip_code,
      testData.payee_info.phone,
      testData.payee_info.account,
      testData.payee_info.amount,
      newAccountNumber,
    );
    expect(await billPayPage.getBillPayCompleteMessage()).toBe(
      "Bill Payment Complete",
    );

    expect(await billPayPage.getPayeeNameResult()).toBe(
      testData.payee_info.payee_name,
    );
    expect(await billPayPage.getAmountResult()).toBe(
      `$${testData.payee_info.amount}.00`,
    );
    expect(await billPayPage.getFromAccountIdResult()).toBe(newAccountNumber);
    globalVars.billAmount = testData.payee_info.amount;
  });
});
