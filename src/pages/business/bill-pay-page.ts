import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/base-page";

/**
 * Bill Pay Page
 */
export class BillPayPage extends BasePage {
  // Page Components
  private payeeNameInputLocator: Locator;
  private addressInputLocator: Locator;
  private cityInputLocator: Locator;
  private stateInputLocator: Locator;
  private zipCodeInputLocator: Locator;
  private phoneInputLocator: Locator;
  private accountInputLocator: Locator;
  private verifyAccountInputLocator: Locator;
  private amountInputLocator: Locator;
  private fromAccountIdSelectLocator: Locator;
  private sendPaymentButtonLocator: Locator;
  private billPayCompleteMsgLocator: Locator;
  private payeeNameResultSpanLocator: Locator;
  private amountResultSpanLocator: Locator;
  private fromAccountIdResultSpanLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.payeeNameInputLocator = this.page.locator("input[name='payee.name']");
    this.addressInputLocator = this.page.locator(
      "input[name='payee.address.street']",
    );
    this.cityInputLocator = this.page.locator(
      "input[name='payee.address.city']",
    );
    this.stateInputLocator = this.page.locator(
      "input[name='payee.address.state']",
    );
    this.zipCodeInputLocator = this.page.locator(
      "input[name='payee.address.zipCode']",
    );
    this.phoneInputLocator = this.page.locator(
      "input[name='payee.phoneNumber']",
    );
    this.accountInputLocator = this.page.locator(
      "input[name='payee.accountNumber']",
    );
    this.verifyAccountInputLocator = this.page.locator(
      "input[name='verifyAccount']",
    );
    this.amountInputLocator = this.page.locator("input[name='amount']");
    this.fromAccountIdSelectLocator = this.page.locator(
      "select[name='fromAccountId']",
    );
    this.sendPaymentButtonLocator = this.page.locator(
      "input[value='Send Payment']",
    );
    this.billPayCompleteMsgLocator = this.page.locator("#billpayResult .title");
    this.payeeNameResultSpanLocator = this.page.locator(
      "#billpayResult #payeeName",
    );
    this.amountResultSpanLocator = this.page.locator("#billpayResult #amount");
    this.fromAccountIdResultSpanLocator = this.page.locator(
      "#billpayResult #fromAccountId",
    );
  }

  /**
   * Fill out the bill pay form and submit
   * @param payeeName The name of the payee
   * @param address The address of the payee
   * @param city The city of the payee
   * @param state The state of the payee
   * @param zipCode The zip code of the payee
   * @param phone The phone number of the payee
   * @param account The account number of the payee
   * @param amount The amount to pay
   * @param fromAccountId The account ID to pay from
   */
  async sendPayment(
    payeeName: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phone: string,
    account: string,
    amount: string,
    fromAccountId: string,
  ): Promise<void> {
    await this.fill(this.payeeNameInputLocator, payeeName);
    await this.fill(this.addressInputLocator, address);
    await this.fill(this.cityInputLocator, city);
    await this.fill(this.stateInputLocator, state);
    await this.fill(this.zipCodeInputLocator, zipCode);
    await this.fill(this.phoneInputLocator, phone);
    await this.fill(this.accountInputLocator, account);
    await this.fill(this.verifyAccountInputLocator, account);
    await this.fill(this.amountInputLocator, amount);
    await this.selectOption(this.fromAccountIdSelectLocator, fromAccountId);
    await this.waitForTimeout(500);
    await this.click(this.sendPaymentButtonLocator);
  }

  /**
   * Get the bill pay complete message
   * @returns The bill pay complete message
   */
  async getBillPayCompleteMessage(): Promise<string> {
    return this.getText(this.billPayCompleteMsgLocator);
  }

  /**
   * Get the payee name in the result section
   * @returns The payee name in the result section
   */
  async getPayeeNameResult(): Promise<string> {
    return this.getText(this.payeeNameResultSpanLocator);
  }

  /**
   * Get the amount in the result section
   * @returns The amount in the result section
   */
  async getAmountResult(): Promise<string> {
    return this.getText(this.amountResultSpanLocator);
  }

  /**
   * Get the from account ID in the result section
   * @returns The from account ID in the result section
   */
  async getFromAccountIdResult(): Promise<string> {
    return this.getText(this.fromAccountIdResultSpanLocator);
  }
}
