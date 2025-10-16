import * as fs from "fs";

/**
 * Get application configuration for the specified environment
 * @param environment - The environment name (qa, dev, prod, uat). Defaults to current ENV or "qa"
 * @returns The application configuration object
 */
export function getAppConfig(environment?: string): any {
  const targetEnv = environment || process.env.ENV || "qa";
  const configPath = `src/config/${targetEnv}.json`;

  try {
    const configData = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(configData);
  } catch (error) {
    throw new Error(
      `Failed to load configuration for environment: ${targetEnv}. Error: ${error}`,
    );
  }
}
