import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/base-page";
import { CustomerMenu } from "../common/customer-menu";

/**
 * Request Loan Page
 */
export class RequestLoanPage extends BasePage {
  // Page Components
  private customerMenu: CustomerMenu;
  private loanAmountInputLocator: Locator;
  private downPaymentInputLocator: Locator;
  private fromAccountIdSelectLocator: Locator;
  private applyNowButtonLocator: Locator;
  private loanRequestApprovedMsgLocator: Locator;
  private loanProviderNameSpanLocator: Locator;
  private newAccountIdLinkLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.customerMenu = new CustomerMenu(page);
    this.loanAmountInputLocator = this.page.locator("#amount");
    this.downPaymentInputLocator = this.page.locator("#downPayment");
    this.fromAccountIdSelectLocator = this.page.locator("#fromAccountId");
    this.applyNowButtonLocator = this.page.locator("input[value='Apply Now']");
    this.loanRequestApprovedMsgLocator = this.page.locator("#loanStatus");
    this.loanProviderNameSpanLocator = this.page.locator("#loanProviderName");
    this.newAccountIdLinkLocator = this.page.locator("#newAccountId");
  }

  /**
   * Get the Customer Menu
   * @returns CustomerMenu instance
   */
  getCustomerMenu(): CustomerMenu {
    return this.customerMenu;
  }

  /**
   * Fill out the loan request form and submit
   * @param loanAmount The amount to request
   * @param downPayment The down payment amount
   * @param fromAccountId The account ID to use for down payment
   */
  async requestLoan(
    loanAmount: string,
    downPayment: string,
    fromAccountId: string,
  ): Promise<void> {
    await this.fill(this.loanAmountInputLocator, loanAmount);
    await this.fill(this.downPaymentInputLocator, downPayment);
    await this.selectOption(this.fromAccountIdSelectLocator, fromAccountId);
    await this.waitForTimeout(500);
    await this.click(this.applyNowButtonLocator);
  }

  /**
   * Get the loan request status message
   * @returns The loan request status message
   */
  async getLoanStatus(): Promise<string> {
    return this.getText(this.loanRequestApprovedMsgLocator);
  }

  /**
   * Get the loan provider name
   * @returns The loan provider name
   */
  async getLoanProviderName(): Promise<string> {
    return this.getText(this.loanProviderNameSpanLocator);
  }

  /**
   * Get the new account ID created for the loan
   * @returns The new account ID
   */
  async getNewAccountId(): Promise<string> {
    return this.getText(this.newAccountIdLinkLocator);
  }

  /**
   * Check if loan was approved
   * @returns True if approved, false if denied
   */
  async isLoanApproved(): Promise<boolean> {
    const status = await this.getLoanStatus();
    return status.toLowerCase().includes("approved");
  }
}
