import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/base-page";
import { CustomerMenu } from "../common/customer-menu";

/**
 * Open New Account Page
 */
export class OpenNewAccountPage extends BasePage {
  // Page Components
  private accountTypeSelectLocator: Locator;
  private fromAccountIdSelectLocator: Locator;
  private firstFromAccountIdSelectOptionLocator: Locator;
  private openNewAccountButtonLocator: Locator;
  private newAccountNumberLocator: Locator;
  private customerMenu: CustomerMenu;

  constructor(page: Page) {
    super(page);
    this.accountTypeSelectLocator = this.page.locator("#openAccountForm #type");
    this.fromAccountIdSelectLocator = this.page.locator(
      "#openAccountForm #fromAccountId",
    );
    this.firstFromAccountIdSelectOptionLocator = this.page.locator(
      "#openAccountForm #fromAccountId option:first-child",
    );
    this.openNewAccountButtonLocator = this.page.locator(
      "input[value='Open New Account']",
    );
    this.newAccountNumberLocator = this.page.locator(
      "#openAccountResult #newAccountId",
    );
    this.customerMenu = new CustomerMenu(page);
  }

  /**
   * Open a new account
   * @param accountType The type of account to open
   * @param fromAccountId The account ID to transfer funds from
   */
  async openNewAccount(
    accountType: string,
    fromAccountId: string = "",
  ): Promise<void> {
    await this.selectOption(this.accountTypeSelectLocator, accountType);
    await this.waitUntilAttached(this.firstFromAccountIdSelectOptionLocator);
    if (fromAccountId.length > 0) {
      await this.selectOption(this.fromAccountIdSelectLocator, fromAccountId);
    }
    await this.click(this.openNewAccountButtonLocator);
  }

  /**
   * Get the new account number
   * @returns The new account number
   */
  async getNewAccountNumber(): Promise<string> {
    return this.getText(this.newAccountNumberLocator);
  }

  /**
   * Get the Customer Menu
   * @returns CustomerMenu instance
   */
  getCustomerMenu(): CustomerMenu {
    return this.customerMenu;
  }
}
