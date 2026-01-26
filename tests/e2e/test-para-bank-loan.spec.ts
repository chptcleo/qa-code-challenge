import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/user/login-page";
import loanTestData from "./test-para-bank-loan.json";
import userTestData from "./test-para-bank-user.json";
import { generateTimestampString } from "../../src/utils/string-util";

test.describe.serial("Test Parabank Loan Application", () => {
  // Generate a unique username for each test run
  const created_username = "qa_u_" + generateTimestampString();
  // Page Titles
  const WELCOME_PAGE_TITLE = "ParaBank | Welcome | Online Banking";
  const REGISTER_PAGE_TITLE =
    "ParaBank | Register for Free Online Account Access";
  const CUSTOMER_CREATED_PAGE_TITLE = "ParaBank | Customer Created";
  const ACCOUNTS_OVERVIEW_PAGE_TITLE = "ParaBank | Accounts Overview";
  const REQUEST_LOAN_PAGE_TITLE = "ParaBank | Loan Request";

  // Page Objects
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.openLoginPage();
    await expect(page).toHaveTitle(WELCOME_PAGE_TITLE);
  });

  test("Test apply for a loan @smoke @regression @loan", async ({ page }) => {
    // Register a new user
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

    // Navigate to Accounts Overview to get the default account
    let accountsOverviewPage = await registerPage
      .getCustomerMenu()
      .gotoAccountsOverview();
    await expect(page).toHaveTitle(ACCOUNTS_OVERVIEW_PAGE_TITLE);

    // Get the first account number (default account created on registration)
    const accountOverviewItem =
      await accountsOverviewPage.getAccountsOverviewItemByIndex(0);
    const defaultAccountNumber = await accountOverviewItem.getAccountNumber();
    expect(defaultAccountNumber).not.toBeNull();

    // Navigate to Request Loan page
    let requestLoanPage = await accountsOverviewPage
      .getCustomerMenu()
      .gotoRequestLoan();
    await expect(page).toHaveTitle(REQUEST_LOAN_PAGE_TITLE);

    // Apply for a loan
    await requestLoanPage.requestLoan(
      loanTestData.loan_info.loan_amount,
      loanTestData.loan_info.down_payment,
      defaultAccountNumber,
    );

    // Verify loan approval
    expect(await requestLoanPage.isLoanApproved()).toBe(true);
    const loanStatus = await requestLoanPage.getLoanStatus();
    expect(loanStatus.toLowerCase()).toContain("approved");

    // Verify loan provider exists
    const loanProvider = await requestLoanPage.getLoanProviderName();
    expect(loanProvider).not.toBe("");

    // Verify new loan account was created
    const newLoanAccountId = await requestLoanPage.getNewAccountId();
    expect(newLoanAccountId).not.toBe("");
    expect(parseInt(newLoanAccountId)).toBeGreaterThan(0);

    // Logout
    loginPage = await requestLoanPage.getCustomerMenu().logout();
    await expect(page).toHaveTitle(WELCOME_PAGE_TITLE);
  });
});
