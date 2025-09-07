import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/base-page";
import { CustomerMenu } from "../common/customer-menu";

/**
 * Transfer Funds Page
 */
export class TransferFundsPage extends BasePage {
  private customerMenu: CustomerMenu;

  private amountInputLocator: Locator;
  private fromAccountIdSelectLocator: Locator;
  private toAccountIdSelectLocator: Locator;
  private transferButtonLocator: Locator;
  private transferCompleteMsgLocator: Locator;
  private transferAmountResultSpanLocator: Locator;
  private fromAccountIdResultSpanLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInputLocator = this.page.locator("#transferForm #amount");
    this.fromAccountIdSelectLocator = this.page.locator("#transferForm #fromAccountId");
    this.toAccountIdSelectLocator = this.page.locator("#transferForm #toAccountId");
    this.transferButtonLocator = this.page.locator("input[value='Transfer']");
    this.transferCompleteMsgLocator = this.page.locator("#showResult .title");
    this.transferAmountResultSpanLocator = this.page.locator("#showResult #amountResult");
    this.fromAccountIdResultSpanLocator = this.page.locator("#showResult #fromAccountIdResult");
    this.customerMenu = new CustomerMenu(page);
  }

  /**
   * Transfer funds between accounts
   * @param amount The amount to transfer
   * @param fromAccountId The account ID to transfer from
   * @param toAccountId The account ID to transfer to
   */
  async transferFunds(amount: string, fromAccountId: string, toAccountId: string = ""): Promise<void> {
    await this.fill(this.amountInputLocator, amount);
    await this.selectOption(this.fromAccountIdSelectLocator, fromAccountId);
    if (toAccountId.length > 0) {
      await this.selectOption(this.toAccountIdSelectLocator, toAccountId);
    }
    await this.click(this.transferButtonLocator);
  }

  /**
   * Get the transfer complete message
   * @returns The transfer complete message
   */
  async getTransferCompleteMessage(): Promise<string> {
    return this.getText(this.transferCompleteMsgLocator);
  }

  /**
   * Get the transfer amount in the result section
   * @returns The transfer amount in the result section
   */
  async getTransferAmountResult(): Promise<string> {
    return this.getText(this.transferAmountResultSpanLocator);
  }

  /**
   * Get the from account ID in the result section
   * @returns The from account ID in the result section
   */
  async getFromAccountIdResult(): Promise<string> {
    return this.getText(this.fromAccountIdResultSpanLocator);
  }

  getCustomerMenu(): CustomerMenu {
    return this.customerMenu;
  }
}
