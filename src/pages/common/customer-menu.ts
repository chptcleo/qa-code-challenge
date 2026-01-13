import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";
import { LoginPage } from "../user/login-page";
import { OpenNewAccountPage } from "../account/open-new-account-page";
import { AccountsOverviewPage } from "../account/accounts-overview-page";
import { TransferFundsPage } from "../business/transfer-funds-page";
import { BillPayPage } from "../business/bill-pay-page";

/**
 * Customer Menu component
 */
export class CustomerMenu extends BasePage {
  // Menu Links
  private logoutLinkLocator: Locator;
  private openNewAccountLinkLocator: Locator;
  private accountsOverviewLinkLocator: Locator;
  private transferFundsLinkLocator: Locator;
  private billPayLinkLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.logoutLinkLocator = this.page.locator("//a[text()='Log Out']");
    this.openNewAccountLinkLocator = this.page.locator(
      "//a[text()='Open New Account']",
    );
    this.accountsOverviewLinkLocator = this.page.locator(
      "//a[text()='Accounts Overview']",
    );
    this.transferFundsLinkLocator = this.page.locator(
      "//a[text()='Transfer Funds']",
    );
    this.billPayLinkLocator = this.page.locator("//a[text()='Bill Pay']");
  }

  /**
   * Log out the current user
   * @returns LoginPage after logging out
   */
  async logout(): Promise<LoginPage> {
    await this.click(this.logoutLinkLocator);
    return new LoginPage(this.page);
  }

  /**
   * Navigate to the Open New Account page
   * @returns OpenNewAccountPage after navigating to Open New Account page
   */
  async gotoOpenNewAccount(): Promise<OpenNewAccountPage> {
    await this.click(this.openNewAccountLinkLocator);
    return new OpenNewAccountPage(this.page);
  }

  /**
   * Navigate to the Accounts Overview page
   * @returns AccountsOverviewPage after navigating to Accounts Overview page
   */
  async gotoAccountsOverview(): Promise<AccountsOverviewPage> {
    await this.click(this.accountsOverviewLinkLocator);
    return new AccountsOverviewPage(this.page);
  }

  /**
   * Navigate to the Transfer Funds page
   * @returns TransferFundsPage after navigating to Transfer Funds page
   */
  async gotoTransferFunds(): Promise<TransferFundsPage> {
    await this.click(this.transferFundsLinkLocator);
    return new TransferFundsPage(this.page);
  }

  /**
   * Navigate to the Bill Pay page
   * @returns BillPayPage after navigating to Bill Pay page
   */
  async gotoBillPay(): Promise<BillPayPage> {
    await this.click(this.billPayLinkLocator);
    return new BillPayPage(this.page);
  }
}
