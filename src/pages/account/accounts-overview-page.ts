import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/base-page";
import { Navigator } from "../common/navigator";
import { CustomerMenu } from "../common/customer-menu";
import { AccountsOverviewItem } from "./component/accounts-overview-item";

/**
 * Accounts Overview Page
 */
export class AccountsOverviewPage extends BasePage {
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

  getNavigator(): Navigator {
    return this.navigator;
  }

  getCustomerMenu(): CustomerMenu {
    return this.customerMenu;
  }

  async getAccountsOverviewItemByIndex(
    index: number,
  ): Promise<AccountsOverviewItem> {
    const itemLocator = this.accountsOverviewItemLocator.nth(index);
    return new AccountsOverviewItem(itemLocator);
  }
}
