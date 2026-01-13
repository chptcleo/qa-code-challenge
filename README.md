# QA Code Challenge Test Automation Framework

A comprehensive end-to-end test automation framework built with Playwright and TypeScript for testing the ParaBank web application.

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running Tests](#running-tests)
- [Reporting](#reporting)
- [Configuration](#configuration)
- [Jenkins Pipeline](#jenkins-pipeline)

## Project Overview

This test automation framework is designed to provide comprehensive testing coverage for the ParaBank banking application. It follows the Page Object Model (POM) design pattern and includes support for multiple test environments, browsers, and test execution modes.

### Target Application

- **Application**: ParaBank (Parasoft's Demo Banking Application)
- **URL**: https://parabank.parasoft.com
- **Purpose**: Banking application testing and demonstration

## Core Features

- **TypeScript & Page Object Model** - Type-safe, maintainable test architecture
- **Multi-Environment Support** - Test across dev, qa, uat, and prod environments
- **Cross-Browser Testing** - Chromium, Firefox, and WebKit support
- **Comprehensive Test Types** - E2E, Interface, Smoke, and Regression tests
- **Smart Test Data** - Random data generation for reliable test execution
- **Rich Reporting** - Screenshots, videos, and traces for debugging
- **CI/CD Ready** - Jenkins integration with automated pipelines
- **Code Quality** - ESLint and Prettier for consistent code standards

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:chptcleo/qa-code-challenge.git
cd qa-code-challenge
```

### 2. Install Dependencies

```bash
# Install npm dependencies
npm ci

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

## Running Tests

### Test Execution

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

## Reporting

### HTML Reports

After test execution, view detailed reports:

```bash
# Open latest report
npm run test:report
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

## Configuration

### Environment Configuration

Environment-specific settings are stored in `src/config/`:

```json
{
  "baseURL": "https://parabank.parasoft.com"
}
```

## Jenkins Pipeline

The project includes a Jenkins pipeline (`Jenkinsfile`) for automated test execution with configurable parameters.

### Execution Methods

1. Navigate to your Jenkins job
2. Click **"Build with Parameters"**
3. Configure parameters and click **"Build"**

### Pipeline Parameters

| Parameter | Options | Description |
|-----------|---------|-------------|
| **ENVIRONMENT** | `qa`, `dev`, `uat`, `prod` | Target test environment |
| **TEST_SUITE** | `e2e`, `interface`, `smoke`, `regression`, `all` | Which tests to run |
| **BROWSER** | `chromium`, `firefox`, `webkit`, `all` | Browser selection |
| **WORKERS** | `1`, `2`, `4`, `auto` | Parallel execution workers |
| **GENERATE_TRACE** | `true`, `false` | Enable debugging traces |

### Results & Reports

- **HTML Report**: Published as "Playwright Test Report"
- **Artifacts**: Screenshots, videos, and traces archived
- **Email Notifications**: Sent for all build outcomes
- **Build Status**: Displays environment and browser used
