import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/base-page";
import { Navigator } from "../common/navigator";
import { CustomerMenu } from "../common/customer-menu";

/**
 * Accounts Overview Page
 */
export class AccountsOverviewPage extends BasePage {
  private navigator: Navigator;
  private customerMenu: CustomerMenu;
  private balanceItemLocator: Locator;
  private firstBalanceItemLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.navigator = new Navigator(page);
    this.customerMenu = new CustomerMenu(page);
    this.balanceItemLocator = this.page.locator(
      "#showOverview #accountTable tbody tr",
    );
    this.firstBalanceItemLocator = this.page.locator(
      "#showOverview #accountTable tbody tr:first-child",
    );
  }

  getNavigator(): Navigator {
    return this.navigator;
  }

  getCustomerMenu(): CustomerMenu {
    return this.customerMenu;
  }

  /**
   * Get all balance items
   * @returns all balance items
   */
  async getBalanceItems(): Promise<Locator[]> {
    await this.waitUntilVisible(this.firstBalanceItemLocator);
    return await this.balanceItemLocator.all();
  }
}
