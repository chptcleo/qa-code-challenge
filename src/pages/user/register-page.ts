import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/base-page";
import { CustomerMenu } from "../common/customer-menu";

/**
 * Register Page
 */
export class RegisterPage extends BasePage {
  private firstNameInputLocator: Locator;
  private lastNameInputLocator: Locator;
  private addressInputLocator: Locator;
  private cityInputLocator: Locator;
  private stateInputLocator: Locator;
  private zipCodeInputLocator: Locator;
  private phoneInputLocator: Locator;
  private ssnInputLocator: Locator;
  private usernameInputLocator: Locator;
  private passwordInputLocator: Locator;
  private repeatPasswordInputLocator: Locator;
  private registerButtonLocator: Locator;

  private welcomeMsgLocator: Locator;
  private promptMsgLocator: Locator;

  private customerMenu: CustomerMenu;

  constructor(page: Page) {
    super(page);
    this.firstNameInputLocator = this.page.locator("[id='customer.firstName']");
    this.lastNameInputLocator = this.page.locator("[id='customer.lastName']");
    this.addressInputLocator = this.page.locator(
      "[id='customer.address.street']"
    );
    this.cityInputLocator = this.page.locator("[id='customer.address.city']");
    this.stateInputLocator = this.page.locator("[id='customer.address.state']");
    this.zipCodeInputLocator = this.page.locator(
      "[id='customer.address.zipCode']"
    );
    this.phoneInputLocator = this.page.locator("[id='customer.phoneNumber']");
    this.ssnInputLocator = this.page.locator("[id='customer.ssn']");
    this.usernameInputLocator = this.page.locator("[id='customer.username']");
    this.passwordInputLocator = this.page.locator("[id='customer.password']");
    this.repeatPasswordInputLocator = this.page.locator(
      "[id='repeatedPassword']"
    );
    this.registerButtonLocator = this.page.locator("input[value='Register']");

    this.welcomeMsgLocator = this.page.locator("#rightPanel .title");
    this.promptMsgLocator = this.page.locator("#rightPanel p");

    this.customerMenu = new CustomerMenu(page);    
  }

  /**
   * Fill in the registration form
   * @param firstName - The first name of the customer
   * @param lastName - The last name of the customer
   * @param address - The address of the customer
   * @param city - The city of the customer
   * @param state - The state of the customer
   * @param zipCode - The zip code of the customer
   * @param phone - The phone number of the customer
   * @param ssn - The social security number of the customer
   * @param username - The username for the customer account
   * @param password - The password for the customer account
   */
  async register(
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phone: string,
    ssn: string,
    username: string,
    password: string
  ): Promise<void> {
    await this.fill(this.firstNameInputLocator, firstName);
    await this.fill(this.lastNameInputLocator, lastName);
    await this.fill(this.addressInputLocator, address);
    await this.fill(this.cityInputLocator, city);
    await this.fill(this.stateInputLocator, state);
    await this.fill(this.zipCodeInputLocator, zipCode);
    await this.fill(this.phoneInputLocator, phone);
    await this.fill(this.ssnInputLocator, ssn);
    await this.fill(this.usernameInputLocator, username);
    await this.fill(this.passwordInputLocator, password);
    await this.fill(this.repeatPasswordInputLocator, password);
    await this.click(this.registerButtonLocator);
  }

  /**
   * Get the welcome message after registration
   * @returns The welcome message text after registration
   */
  async getWelcomeMessage(): Promise<string> {
    return this.getText(this.welcomeMsgLocator);
  }

  /**
   * Get the prompt message after registration
   * @returns The prompt message text after registration
   */
  async getPromptMessage(): Promise<string> {
    return this.getText(this.promptMsgLocator);
  }

  getCustomerMenu(): CustomerMenu {
    return this.customerMenu;
  }
}
