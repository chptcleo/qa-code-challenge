import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/base-page";
import { getAppConfig } from "../../utils/config-util";
import { RegisterPage } from "./register-page";
import { AccountsOverviewPage } from "../account/accounts-overview-page";

/**
 * Login Page
 */
export class LoginPage extends BasePage {
  private usernameInputLocator: Locator;
  private passwordInputLocator: Locator;
  private submitButtonLocator: Locator;
  private registerLinkLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInputLocator = this.page.locator("input[name='username']");
    this.passwordInputLocator = this.page.locator("input[name='password']");
    this.submitButtonLocator = this.page.locator("input[type='submit']");
    this.registerLinkLocator = this.page.locator("//a[text()='Register']");
  }

  /**
   * Navigate to the login page
   */
  async openLoginPage(): Promise<void> {
    await this.openURL(getAppConfig().baseURL);
  }

  /**
   * Login to the application
   * @param username - The username to login with
   * @param password - The password to login with
   * @returns AccountsOverviewPage after login
   */
  async login(username: string, password: string) {
    await this.fill(this.usernameInputLocator, username);
    await this.fill(this.passwordInputLocator, password);
    await this.click(this.submitButtonLocator);
    return new AccountsOverviewPage(this.page);
  }

  /**
   * Navigate to the Register page
   * @returns RegisterPage after navigating to Register page
   */
  async gotoRegisterPage(): Promise<RegisterPage> {
    await this.click(this.registerLinkLocator);
    return new RegisterPage(this.page);
  }
}
