import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/base-page";
import { Navigator } from "../common/navigator";
import { CustomerMenu } from "../common/customer-menu";
import { AccountsOverviewItem } from "./component/accounts-overview-item";

/**
 * Accounts Overview Page
 */
export class AccountsOverviewPage extends BasePage {
  // Page Components
  private navigator: Navigator;
  private customerMenu: CustomerMenu;
  private accountsOverviewItemLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.navigator = new Navigator(page);
    this.customerMenu = new CustomerMenu(page);
    this.accountsOverviewItemLocator = this.page.locator(
      "#showOverview #accountTable tbody tr",
    );
  }

  /**
   * Get the Navigator
   * @returns Navigator instance
   */
  getNavigator(): Navigator {
    return this.navigator;
  }

  /**
   * Get the Customer Menu
   * @returns CustomerMenu instance
   */
  getCustomerMenu(): CustomerMenu {
    return this.customerMenu;
  }

  /**
   * Get an Accounts Overview Item by its index
   * @param index Index of the account overview item
   * @returns AccountsOverviewItem instance
   */
  async getAccountsOverviewItemByIndex(
    index: number,
  ): Promise<AccountsOverviewItem> {
    const itemLocator = this.accountsOverviewItemLocator.nth(index);
    return new AccountsOverviewItem(itemLocator);
  }
}
