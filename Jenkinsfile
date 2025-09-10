pipeline {
    agent any

    tools {
        nodejs "Node22"
    }
    
    environment {
        // Node.js version
        NODE_VERSION = '22.17.0'
        
        // Environment configuration
        ENV = "${params.ENVIRONMENT ?: 'qa'}"

        EMAIL_RECIPIENTS = 'chptcleo@hotmail.com'
    }
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['qa', 'dev', 'uat', 'prod'],
            description: 'Target environment for test execution'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'e2e', 'interface', 'smoke', 'regression'],
            description: 'Test suite to execute'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Browser for test execution'
        )
        string(
            name: 'TEST_FILTER',
            defaultValue: '',
            description: 'Filter tests by name or tag (e.g., "registration" or "@smoke")'
        )
        choice(
            name: 'WORKERS',
            choices: ['1', '2', '4', 'auto'],
            description: 'Number of parallel workers'
        )
        booleanParam(
            name: 'GENERATE_TRACE',
            defaultValue: false,
            description: 'Generate trace files for debugging'
        )
    }
    
    options {
        // Build options
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        // Retry failed builds
        // retry(1)
    }
    
    stages {
        stage('Environment Info') {
            steps {
                script {
                    echo "🚀 Starting ParaBank Test Automation Pipeline"
                    echo "======================================"
                    echo "Environment: ${params.ENVIRONMENT}"
                    echo "Test Suite: ${params.TEST_SUITE}"
                    echo "Browser: ${params.BROWSER}"
                    echo "Workers: ${params.WORKERS}"
                    echo "Test Filter: ${params.TEST_FILTER}"
                    echo "Generate Trace: ${params.GENERATE_TRACE}"
                    echo "======================================"
                    
                    // Display system info
                    sh '''
                        echo "System Information:"
                        uname -a
                        echo "Available disk space:"
                        df -h
                        echo "Memory usage:"
                        free -h || echo "Memory info not available"
                    '''
                }
            }
        }
        
        stage('Checkout Code') {
            steps {
                echo "📁 Checking out source code..."
                checkout scm
                
                script {
                    // Get commit information
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                    env.GIT_BRANCH_NAME = sh(
                        script: "git rev-parse --abbrev-ref HEAD",
                        returnStdout: true
                    ).trim()
                    
                    echo "Git Commit: ${env.GIT_COMMIT_SHORT}"
                    echo "Git Branch: ${env.GIT_BRANCH_NAME}"
                }
            }
        }
        
        stage('Setup Node.js') {
            steps {
                echo "⚙️ Setting up Node.js environment..."
                script {
                    try {
                        sh '''
                            # Check if Node.js is available
                            node --version
                            npm --version
                            
                            # Verify Node.js version
                            NODE_CURRENT=$(node --version | sed 's/v//')
                            echo "Current Node.js version: $NODE_CURRENT"
                        '''
                    } catch (Exception e) {
                        error "❌ Node.js not found. Please install Node.js version ${NODE_VERSION} or higher."
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm dependencies..."
                script {
                    try {
                        sh '''
                            # Clean npm cache if needed
                            npm cache clean --force || true
                            
                            # Install dependencies
                            npm install
                            
                            # Verify Playwright installation
                            npx playwright --version
                            
                            # List installed packages
                            npm list --depth=0
                        '''
                    } catch (Exception e) {
                        error "❌ Failed to install dependencies: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                echo "🌐 Installing Playwright browsers..."
                script {
                    def browsersToInstall = params.BROWSER == 'all' ? 'chromium firefox webkit' : params.BROWSER
                    
                    try {
                        sh """
                            # Install specific browsers based on selection
                            npx playwright install ${browsersToInstall}
                            
                            # Install system dependencies (Linux)
                            npx playwright install-deps ${browsersToInstall}
                            
                            # Verify browser installation
                            npx playwright install --dry-run
                        """
                    } catch (Exception e) {
                        echo "⚠️ Browser installation warning: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Code Quality Checks') {
            parallel {
                stage('TypeScript Compilation') {
                    steps {
                        echo "🔍 Running TypeScript compilation check..."
                        script {
                            try {
                                sh 'npx tsc --noEmit'
                                echo "✅ TypeScript compilation successful"
                            } catch (Exception e) {
                                echo "⚠️ TypeScript compilation issues found: ${e.getMessage()}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                    }
                }
            }
        }
        
        stage('Execute Tests') {
            steps {
                echo "🧪 Executing Playwright tests..."
                script {
                    // Build test command based on parameters
                    def testCommand = buildTestCommand()
                    
                    echo "Executing command: ${testCommand}"
                    
                    try {
                        sh """
                            export ENV=${params.ENVIRONMENT}
                            
                            # Run tests
                            ${testCommand}
                        """
                        
                        echo "✅ Test execution completed successfully"
                        
                    } catch (Exception e) {
                        echo "❌ Test execution failed: ${e.getMessage()}"
                        currentBuild.result = 'FAILURE'
                        
                        // Archive failed test artifacts
                        archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                        throw e
                    }
                }
            }
            post {
                always {
                    script {
                        // Archive test artifacts
                        echo "📊 Archiving test artifacts..."
                        
                        if (fileExists('playwright-report')) {
                            archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true
                        }
                        
                        if (fileExists('test-results')) {
                            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                        }
                        
                    }
                }
            }
        }
        
        stage('Generate Reports') {
            steps {
                echo "📈 Generating and publishing test reports..."
                script {
                    try {
                        // Publish HTML reports
                        if (fileExists('playwright-report/index.html')) {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'playwright-report',
                                reportFiles: 'index.html',
                                reportName: 'Playwright Test Report',
                                reportTitles: "ParaBank Test Results - ${params.ENVIRONMENT}",
                                includes: '**/*'
                            ])
                            echo "✅ HTML report published successfully"
                        } else {
                            echo "⚠️ No HTML report found to publish"
                        }
                        
                        // Generate test summary
                        generateTestSummary()
                        
                    } catch (Exception e) {
                        echo "⚠️ Failed to publish reports: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }
    
    post {
        always {

            publishHTML(target: [
                reportName : 'Playwright Report',
                reportDir  : 'playwright-report',
                reportFiles: 'index.html',
                keepAll    : true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])

            script {
                echo "🏁 Pipeline execution completed"
                
                // Cleanup workspace if configured
                if (env.CLEAN_WORKSPACE == 'true') {
                    echo "🧹 Cleaning workspace..."
                    cleanWs()
                }
            }
        }
        
        success {
            script {
                echo "✅ All tests passed successfully!"
                
                // Send success notification
                sendNotification('SUCCESS', '✅ ParaBank tests passed successfully')
                
                // Update build description
                currentBuild.description = "✅ Tests passed on ${params.ENVIRONMENT} using ${params.BROWSER}"
            }
        }
        
        failure {
            script {
                echo "❌ Test execution failed!"
                
                // Send failure notification
                sendNotification('FAILURE', '❌ ParaBank tests failed')
                
                // Update build description
                currentBuild.description = "❌ Tests failed on ${params.ENVIRONMENT} using ${params.BROWSER}"
            }
        }
        
        unstable {
            script {
                echo "⚠️ Tests completed with warnings"
                
                // Send unstable notification
                sendNotification('UNSTABLE', '⚠️ ParaBank tests completed with warnings')
                
                // Update build description
                currentBuild.description = "⚠️ Tests unstable on ${params.ENVIRONMENT} using ${params.BROWSER}"
            }
        }
        
        aborted {
            script {
                echo "🚫 Pipeline execution was aborted"
                
                // Send abort notification
                sendNotification('ABORTED', '🚫 ParaBank test execution was aborted')
                
                // Update build description
                currentBuild.description = "🚫 Execution aborted"
            }
        }
    }
}

// Helper function to build test command
def buildTestCommand() {
    def command = "npx playwright test"
    
    // Add test suite filter
    switch(params.TEST_SUITE) {
        case 'e2e':
            command += " tests/e2e"
            break
        case 'interface':
            command += " tests/interface"
            break
        case 'smoke':
            command += " --grep='@smoke'"
            break
        case 'regression':
            command += " --grep='@regression'"
            break
        case 'all':
        default:
            // Run all tests
            break
    }
    
    // Add browser filter
    if (params.BROWSER && params.BROWSER != 'all') {
        command += " --project=${params.BROWSER}"
    }
    
    // Add test filter
    if (params.TEST_FILTER) {
        command += " --grep='${params.TEST_FILTER}'"
        
    }
    
    // Add workers
    if (params.WORKERS && params.WORKERS != 'auto') {
        command += " --workers=${params.WORKERS}"
    }
    
    // Add trace generation
    if (params.GENERATE_TRACE) {
        command += " --trace=on"
    }

    return command
}

// Helper function to generate test summary
def generateTestSummary() {
    try {
        def summary = """
        📊 Test Execution Summary
        ========================
        Environment: ${params.ENVIRONMENT}
        Test Suite: ${params.TEST_SUITE}
        Browser: ${params.BROWSER}
        Build Number: ${env.BUILD_NUMBER}
        Git Commit: ${env.GIT_COMMIT_SHORT}
        Execution Time: ${currentBuild.durationString}
        Status: ${currentBuild.result ?: 'SUCCESS'}
        
        📁 Artifacts:
        - HTML Report: Available in build artifacts
        - Screenshots: Available for failed tests
        - Videos: Available for failed tests
        ${params.GENERATE_TRACE ? '- Trace Files: Available for debugging' : ''}
        """
        
        writeFile file: 'test-summary.txt', text: summary
        archiveArtifacts artifacts: 'test-summary.txt', fingerprint: true
        
    } catch (Exception e) {
        echo "Failed to generate test summary: ${e.getMessage()}"
    }
}

// Helper function to send notifications
def sendNotification(status, message) {
    try {
        
        // Email notification (if configured)
        if (env.EMAIL_RECIPIENTS) {
            emailext (
                subject: "ParaBank Tests ${status} - Build #${env.BUILD_NUMBER}",
                body: """
                    ${message}
                    
                    Build Details:
                    - Environment: ${params.ENVIRONMENT}
                    - Test Suite: ${params.TEST_SUITE}
                    - Browser: ${params.BROWSER}
                    - Build URL: ${env.BUILD_URL}
                    
                    Check the build artifacts for detailed results.
                """,
                to: "${env.EMAIL_RECIPIENTS}"
            )
        }
        
    } catch (Exception e) {
        echo "Failed to send notification: ${e.getMessage()}"
    }
}