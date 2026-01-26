import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/user/login-page";
import payeeTestData from "./test-para-bank-payee.json";
import userTestData from "./test-para-bank-user.json";
import { generateTimestampString } from "../../src/utils/string-util";
import { globalVars } from "../global-vars";

test.describe.serial("Test Parabank E2E", () => {
  // Generate a unique username for each test run
  const created_username = "qa_u_" + generateTimestampString();
  // Store created user credentials in globalVars for interface tests
  globalVars.username = created_username;
  globalVars.password = userTestData.user_info.password;

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

  test("Test registration @smoke @regression @payee", async ({ page }) => {
    // Navigate to Register page
    let registerPage = await loginPage.gotoRegisterPage();
    await expect(page).toHaveTitle(REGISTER_PAGE_TITLE);

    // Fill in registration form and submit
    await registerPage.register(
      userTestData.user_info.first_name,
      userTestData.user_info.last_name,
      userTestData.user_info.address,
      userTestData.user_info.city,
      userTestData.user_info.state,
      userTestData.user_info.zip_code,
      userTestData.user_info.phone,
      userTestData.user_info.ssn,
      created_username,
      userTestData.user_info.password,
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

  test("Test global navigation menu @smoke @regression @payee", async ({
    page,
  }) => {
    // Login first
    let accountsOverviewPage = await loginPage.login(
      created_username,
      userTestData.user_info.password,
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

  test("Test transfer funds and pay bill @regression @payee", async ({
    page,
  }) => {
    // Login first
    let accountsOverviewPage = await loginPage.login(
      created_username,
      userTestData.user_info.password,
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
    expect(await newAccountOverviewItem.getAccountBalance()).toBe("$10.00");
    expect(await newAccountOverviewItem.getAvailableAmount()).toBe("$10.00");

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
      payeeTestData.payee_info.payee_name,
      payeeTestData.payee_info.address,
      payeeTestData.payee_info.city,
      payeeTestData.payee_info.state,
      payeeTestData.payee_info.zip_code,
      payeeTestData.payee_info.phone,
      payeeTestData.payee_info.account,
      payeeTestData.payee_info.amount,
      newAccountNumber,
    );
    expect(await billPayPage.getBillPayCompleteMessage()).toBe(
      "Bill Payment Complete",
    );

    expect(await billPayPage.getPayeeNameResult()).toBe(
      payeeTestData.payee_info.payee_name,
    );
    expect(await billPayPage.getAmountResult()).toBe(
      `$${payeeTestData.payee_info.amount}.00`,
    );
    expect(await billPayPage.getFromAccountIdResult()).toBe(newAccountNumber);
    globalVars.billAmount = payeeTestData.payee_info.amount;
  });
});
