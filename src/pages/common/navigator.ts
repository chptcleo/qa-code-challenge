import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * Navigator component
 */
export class Navigator extends BasePage {
  private solutionsLinkLocator: Locator;
  private aboutUsLinkLocator: Locator;
  private servicesLinkLocator: Locator;
  private productsLinkLocator: Locator;
  private locationsLinkLocator: Locator;
  private adminPageLinkLocator: Locator;
  private billPayLinkLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.solutionsLinkLocator = this.page.locator(
      "//ul[@class='leftmenu']/li[text()='Solutions']",
    );
    this.aboutUsLinkLocator = this.page.locator(
      "//ul[@class='leftmenu']/li/a[text()='About Us']",
    );
    this.servicesLinkLocator = this.page.locator(
      "//ul[@class='leftmenu']/li/a[text()='Services']",
    );
    this.productsLinkLocator = this.page.locator(
      "//ul[@class='leftmenu']/li/a[text()='Products']",
    );
    this.locationsLinkLocator = this.page.locator(
      "//ul[@class='leftmenu']/li/a[text()='Locations']",
    );
    this.adminPageLinkLocator = this.page.locator(
      "//ul[@class='leftmenu']/li/a[text()='Admin Page']",
    );
    this.billPayLinkLocator = this.page.locator(
      "//ul[@class='leftmenu']/li/a[text()='Bill Pay']",
    );
  }

  /**
   * Navigate to Solutions page
   */
  async navigateToSolutions(): Promise<void> {
    await this.click(this.solutionsLinkLocator);
  }

  /**
   * Navigate to About Us page
   */
  async navigateToAboutUs(): Promise<void> {
    await this.click(this.aboutUsLinkLocator);
  }

  /**
   * Navigate to Services page
   */
  async navigateToServices(): Promise<void> {
    await this.click(this.servicesLinkLocator);
  }

  /**
   * Navigate to Products page
   */
  async navigateToProducts(): Promise<void> {
    await this.click(this.productsLinkLocator);
  }

  /**
   * Navigate to Locations page
   */
  async navigateToLocations(): Promise<void> {
    await this.click(this.locationsLinkLocator);
  }

  /**
   * Navigate to Admin Page
   */
  async navigateToAdminPage(): Promise<void> {
    await this.click(this.adminPageLinkLocator);
  }

  /**
   * Navigate to Bill Pay page
   */
  async navigateToBillPay(): Promise<void> {
    await this.click(this.billPayLinkLocator);
  }
}
