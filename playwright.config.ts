import { defineConfig, devices } from "@playwright/test";
import { getAppConfig } from "./src/utils/config-util";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: 1,
  reporter: "html",
  use: {
    trace: "on-first-retry",

    baseURL: getAppConfig().baseURL,
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
