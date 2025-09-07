# QA Code Challenge Test Automation Framework

A comprehensive end-to-end test automation framework built with Playwright and TypeScript for testing the ParaBank web application.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup Instructions](#-setup-instructions)
- [Running Tests](#-running-tests)
- [Reporting](#-reporting)
- [Contributing](#-contributing)

## 🚀 Project Overview

This test automation framework is designed to provide comprehensive testing coverage for the ParaBank banking application. It follows the Page Object Model (POM) design pattern and includes support for multiple test environments, browsers, and test execution modes.

### Target Application
- **Application**: ParaBank (Parasoft's Demo Banking Application)
- **URL**: https://parabank.parasoft.com
- **Purpose**: Banking application testing and demonstration

## ✨ Core Features

### 🏗️ **Architecture & Design Patterns**
- **Page Object Model (POM)** - Organized, maintainable page classes
- **TypeScript** - Type-safe test development
- **Modular Design** - Reusable components and utilities
- **Environment Configuration** - Multi-environment support (dev, qa, uat, prod)

### 🧪 **Test Coverage**
- **End-to-End (E2E) Tests** - Complete user workflows
- **Interface Tests** - Backend service validation
- **Smoke Tests** - Critical functionality validation
- **Regression Tests** - Full application regression testing

### 🌐 **Browser Support**
- **Chromium** (Chrome, Edge)
- **Firefox**
- **WebKit** (Safari)

### 🔧 **Testing Features**
- **Random Test Data Generation** - Dynamic usernames and data
- **Multi-Environment Configuration** - Easy environment switching
- **Screenshot & Video Capture** - On test failures
- **Parallel Test Execution** - Faster test runs
- **Test Tagging** - Selective test execution (@smoke, @regression)

## 📁 Project Structure

```
qa-code-challenge/
├── src/                          # Source code
│   ├── config/                   # Environment configurations
│   │   ├── dev.json             # Development environment
│   │   ├── qa.json              # QA environment
│   │   ├── uat.json             # UAT environment
│   │   └── prod.json            # Production environment
│   ├── pages/                    # Page Object Model classes
│   │   ├── account/             # Account-related pages
│   │   │   ├── accounts-overview-page.ts
│   │   │   └── open-new-account-page.ts
│   │   ├── business/            # Business transaction pages
│   │   │   ├── bill-pay-page.ts
│   │   │   └── transfer-funds-page.ts
│   │   ├── common/              # Shared components
│   │   │   ├── base-page.ts     # Base page class
│   │   │   ├── customer-menu.ts # Customer navigation
│   │   │   └── navigator.ts     # Main navigation
│   │   └── user/                # User management pages
│   │       ├── login-page.ts
│   │       └── register-page.ts
│   └── utils/                    # Utility functions
│       ├── config-util.ts       # Configuration management
│       └── string-util.ts       # String manipulation utilities
├── tests/                        # Test suites
│   ├── e2e/                     # End-to-end tests
│   │   ├── test-para-bank-e2e.spec.ts
│   │   └── test-para-bank-e2e.json
│   ├── interface/               # Interface tests
│   │   └── test-para-bank-interface.spec.ts
│   └── global-vars.ts           # Global test variables
├── playwright-report/            # Generated test reports
├── test-results/                # Test execution artifacts
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone git@github.com:chptcleo/qa-code-challenge.git
cd qa-code-challenge
```

### 2. Install Dependencies
```bash
# Install npm dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install system dependencies (Linux only)
npx playwright install-deps
```

### 3. Verify Installation
```bash
# Check Playwright installation
npx playwright --version

# Verify TypeScript compilation
npx tsc --noEmit

# Run a quick test to verify setup
npm run test:smoke
```

### 4. Environment Configuration
The framework supports multiple environments. Set your target environment:

```bash
# Set environment variable (optional, defaults to 'qa')
export ENV=qa  # or dev, uat, prod
```

## 🏃 Running Tests

### Basic Test Execution

```bash
# Run all tests
npm run test

# Run tests with visible browser
npm run test:headed

# Run specific test suite
npm run test:e2e        # End-to-end tests
npm run test:interface  # Interface tests

# Run tests by tags
npm run test:smoke      # Smoke tests only
npm run test:regression # Regression tests only
```

### Advanced Test Execution

```bash
# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run specific test file
npx playwright test tests/e2e/test-para-bank-e2e.spec.ts

# Run tests with custom grep pattern
npx playwright test --grep="registration"

# Debug mode (step-by-step execution)
npx playwright test --debug
```

### Test Execution Examples

```bash
# Example 1: Run smoke tests in QA environment
ENV=qa npm run test:smoke

# Example 2: Run regression tests with headed browser
npm run test:regression -- --headed

# Example 3: Run specific test with debug mode
npx playwright test tests/e2e/test-para-bank-e2e.spec.ts --debug

# Example 4: Run tests with custom timeout
npx playwright test --timeout=60000
```

## ⚙️ Configuration

### Environment Configuration
Environment-specific settings are stored in `src/config/`:

```json
{
  "baseURL": "https://parabank.parasoft.com"
}
```

### Playwright Configuration
Main configuration in `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: getAppConfig().baseURL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  }
});
```

## 📊 Reporting

### HTML Reports
After test execution, view detailed reports:

```bash
# Open latest report
npx playwright show-report

# Report location
open playwright-report/index.html
```

### Report Features
- **Test Results**: Pass/fail status with details
- **Screenshots**: Visual evidence of failures
- **Videos**: Test execution recordings
- **Traces**: Step-by-step debugging information
- **Performance Metrics**: Test execution timings

### Artifacts
- **Reports**: `playwright-report/`
- **Screenshots**: `test-results/`
- **Videos**: `test-results/`
- **Traces**: `test-results/`

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Write tests following existing patterns
3. Run tests locally
4. Submit pull request

### Code Standards
- Follow TypeScript best practices
- Use Page Object Model pattern
- Add meaningful test descriptions
- Include appropriate test tags
- Write clean, maintainable code

### Adding New Tests
1. Create page objects in `src/pages/`
2. Add test files in appropriate `tests/` subdirectory
3. Update configuration if needed
4. Add test tags for categorization

### Documentation Links
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ParaBank Application](https://parabank.parasoft.com)

### Support
For questions or issues:
1. Check existing documentation
2. Review test execution logs
3. Check Playwright troubleshooting guide
4. Create issue in project repository

---

**Happy Testing! 🎯**
