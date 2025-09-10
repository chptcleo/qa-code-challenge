# Jenkins Setup Guide for ParaBank Test Automation

This guide provides step-by-step instructions for setting up Jenkins to run Playwright test automation for the ParaBank application.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Jenkins Plugin Installation](#jenkins-plugin-installation)
- [Global Tool Configuration](#global-tool-configuration)
- [Pipeline Job Setup](#pipeline-job-setup)
- [Environment Configuration](#environment-configuration)
- [Agent Configuration](#agent-configuration)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before setting up Jenkins, ensure you have:

- **Jenkins Server** (version 2.400+)
- **Admin access** to Jenkins
- **Linux/Unix Jenkins agents** for running tests
- **Internet connectivity** for downloading Node.js and browsers

## 🔌 Jenkins Plugin Installation

### Required Plugins

Install the following plugins through **Manage Jenkins** → **Manage Plugins**:

#### 1. **NodeJS Plugin**
- **Plugin Name**: NodeJS
- **Purpose**: Manages Node.js installations and environments
- **Installation**:
  1. Go to **Manage Jenkins** → **Manage Plugins**
  2. Click **Available Plugins** tab
  3. Search for "NodeJS"
  4. Select **NodeJS Plugin** by Nikita Ashok
  5. Click **Install without restart**

#### 2. **HTML Publisher Plugin**
- **Plugin Name**: HTML Publisher
- **Purpose**: Publishes HTML reports (Playwright test reports)
- **Installation**:
  1. In **Available Plugins** tab
  2. Search for "HTML Publisher"
  3. Select **HTML Publisher plugin**
  4. Click **Install without restart**

#### 3. **Additional Recommended Plugins**
Install these for enhanced functionality:

```
Pipeline Plugin (usually pre-installed)
Git Plugin (usually pre-installed)
JUnit Plugin (for test result parsing)
Email Extension Plugin (for notifications)
AnsiColor Plugin (for colored console output)
Timestamper Plugin (for build timestamps)
Build Timeout Plugin (for pipeline timeouts)
```

## ⚙️ Global Tool Configuration

### Configure Node.js Tool

1. **Navigate to Global Tool Configuration**:
   ```
   Jenkins Dashboard → Manage Jenkins → Global Tool Configuration
   ```

2. **Add NodeJS Installation**:
   - Scroll down to **NodeJS** section
   - Click **Add NodeJS**

3. **Configure Node22 Tool**:
   ```
   Name: Node22
   Install automatically: ✅ (checked)
   Version: NodeJS 22.17.0
   Global npm packages to install: (leave empty)
   ```

4. **Advanced Configuration** (Optional):
   ```
   Global npm packages refresh hours: 72
   ```

5. **Save Configuration**:
   - Click **Save** at the bottom of the page

## 🚀 Pipeline Job Setup

### Create New Pipeline Job

1. **Create Job**:
   ```
   Jenkins Dashboard → New Item
   Item name: ParaBank-Automation-Tests
   Type: Pipeline
   Click OK
   ```

2. **Configure Pipeline**:
   - **Description**: `Automated testing for ParaBank application using Playwright`
   - **Build Triggers**:
     - ☑️ Poll SCM: `H/15 * * * *` (every 15 minutes)
     - ☑️ GitHub hook trigger for GITScm polling (if using GitHub)

3. **Pipeline Configuration**:
   ```
   Definition: Pipeline script from SCM
   SCM: Git
   Repository URL: [Your repository URL]
   Credentials: [Your Git credentials]
   Branch Specifier: main
   Script Path: Jenkinsfile
   ```

### Pipeline Parameters

The Jenkinsfile includes these build parameters:

| Parameter | Type | Default | Options |
|-----------|------|---------|---------|
| `ENVIRONMENT` | Choice | `qa` | qa, dev, uat, prod |
| `TEST_SUITE` | Choice | `e2e` | e2e, interface, smoke, regression, all |
| `BROWSER` | Choice | `chromium` | chromium, firefox, webkit, all |
| `TEST_FILTER` | String | (empty) | Custom test filters |
| `WORKERS` | Choice | `1` | 1, 2, 4, auto |
| `GENERATE_TRACE` | Boolean | `false` | true, false |

## 🌍 Environment Configuration

### Global Environment Variables

Set these in **Manage Jenkins** → **Configure System** → **Global Properties**:

```bash
# Environment Variables
ENV=qa

# Optional: Notification Settings
EMAIL_RECIPIENTS=qa-team@company.com
```

### Environment Variable Details

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `ENV` | Default test environment | `qa` |
| `EMAIL_RECIPIENTS` | Notification emails | `qa-team@company.com` |

## 📊 Build Triggers and Scheduling

### Automated Triggers

Configure these triggers for automated execution:

#### 1. **SCM Polling**
```
Poll SCM: H/15 * * * *
Description: Check for code changes every 15 minutes
```

#### 2. **Scheduled Builds**
```
Build periodically: H 2 * * *
Description: Daily regression run at 2 AM
```

#### 3. **GitHub Webhooks** (Optional)
- Enable "GitHub hook trigger for GITScm polling"
- Configure webhook in GitHub repository settings

### Manual Build Execution

1. **Navigate to Job**: Click on "ParaBank-Automation-Tests"
2. **Build with Parameters**: Click "Build with Parameters"
3. **Configure Parameters**:
   - Environment: `qa`
   - Test Suite: `smoke`
   - Browser: `chromium`
   - Workers: `2`
4. **Start Build**: Click "Build"

## ✅ Setup Verification Checklist

- [ ] Jenkins plugins installed (NodeJS, HTML Publisher)
- [ ] Node22 tool configured in Global Tool Configuration
- [ ] Pipeline job created with proper SCM configuration
- [ ] Environment variables set in Global Properties
- [ ] Jenkins agent configured with system dependencies
- [ ] Test build executed successfully
- [ ] HTML reports published and accessible
- [ ] Notifications configured and working

**Setup Complete!** 🎉

Your Jenkins environment is now ready for automated Playwright testing!