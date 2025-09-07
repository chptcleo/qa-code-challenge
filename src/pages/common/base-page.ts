import { Page, Locator } from "@playwright/test";

/**
 * Base Page containing common methods and properties
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Open a specific url
   * @param url - The url to open
   */
  async openURL(url: string = ""): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Wait for a locator to be visible and click it
   * @param locator - The locator to click
   */
  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  /**
   * Wait for a locator to be visible and fill it with text
   * @param locator - The locator to fill
   * @param text - The text to fill
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.fill(text);
  }

  /**
   * Get text content from a locator
   * @param locator - The locator to get text from
   * @returns The text content
   */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: "visible" });
    return (await locator.textContent()) ?? "";
  }

  /**
   * Wait for a certain amount of time
   * @param ms - Time in milliseconds
   */
  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Check if a locator is visible
   * @param locator - The locator to check
   * @returns True if visible, false otherwise
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait until a locator is visible
   * @param locator - The locator to wait for
   * @param timeout - Maximum time to wait in milliseconds (default: 10000)
   */
  async waitUntilVisible(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  /**
   * Wait until a locator is attached to the DOM
   * @param locator - The locator to wait for
   * @param timeout - Maximum time to wait in milliseconds (default: 10000)
   */
  async waitUntilAttached(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: "attached", timeout });
  }

  /**
   * Select an option from a dropdown
   * @param locator - The locator of the select element
   * @param optionValue - The value of the option to select
   */
  async selectOption(locator: Locator, optionValue: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.selectOption(optionValue);
  }
}
