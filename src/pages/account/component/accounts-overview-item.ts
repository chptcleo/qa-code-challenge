import { Locator } from "@playwright/test";

/**
 * Account Overview Item Component
 */

export class AccountsOverviewItem {
  // Locators for the account overview item
  private itemLocator: Locator;
  private accountNumberLocator: Locator;
  private accountBalanceLocator: Locator;
  private availableAmountLocator: Locator;

  constructor(itemLocator: Locator) {
    this.itemLocator = itemLocator;
    this.accountNumberLocator = this.itemLocator.locator("td:nth-child(1)");
    this.accountBalanceLocator = this.itemLocator.locator("td:nth-child(2)");
    this.availableAmountLocator = this.itemLocator.locator("td:nth-child(3)");
  }

  /**
   * Gets the account number text
   * @returns The account number as a string
   */
  async getAccountNumber(): Promise<string> {
    return (await this.accountNumberLocator.textContent())?.trim() ?? "";
  }

  /**
   * Gets the account balance text
   * @returns The account balance as a string
   */
  async getAccountBalance(): Promise<string> {
    return (await this.accountBalanceLocator.textContent())?.trim() ?? "";
  }

  /**
   * Gets the available amount text
   * @returns The available amount as a string
   */
  async getAvailableAmount(): Promise<string> {
    return (await this.availableAmountLocator.textContent())?.trim() ?? "";
  }
}
