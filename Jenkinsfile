pipeline {
    agent any

    triggers {
        // Run at 2:30 AM every day
        cron('30 2 * * *')
    }

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
            choices: ['e2e', 'interface', 'smoke', 'regression', 'all'],
            description: 'Test suite to execute'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Browser for test execution'
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
                    echo "Starting ParaBank Test Automation Pipeline"
                    echo "======================================"
                    echo "Environment: ${params.ENVIRONMENT}"
                    echo "Test Suite: ${params.TEST_SUITE}"
                    echo "Browser: ${params.BROWSER}"
                    echo "Workers: ${params.WORKERS}"
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
                echo "Checking out source code..."
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
                echo "Setting up Node.js environment..."
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
                        error "Node.js not found. Please install Node.js version ${NODE_VERSION} or higher."
                    }
                }
            }
        }
        
        // stage('Install Dependencies') {
        //     steps {
        //         echo "Installing npm dependencies..."
        //         script {
        //             try {
        //                 sh '''
        //                     # Clean npm cache if needed
        //                     npm cache clean --force || true
                            
        //                     # Install dependencies
        //                     npm ci
                            
        //                     # Verify Playwright installation
        //                     npx playwright --version
                            
        //                     # List installed packages
        //                     npm list --depth=0
        //                 '''
        //             } catch (Exception e) {
        //                 error "Failed to install dependencies: ${e.getMessage()}"
        //             }
        //         }
        //     }
        // }
        
        // stage('Install Playwright Browsers') {
        //     steps {
        //         echo "Installing Playwright browsers..."
        //         script {
        //             def browsersToInstall = params.BROWSER == 'all' ? 'chromium firefox webkit' : params.BROWSER
                    
        //             try {
        //                 sh """
        //                     # Install specific browsers based on selection
        //                     npx playwright install ${browsersToInstall}
                            
        //                     # Install system dependencies (Linux)
        //                     npx playwright install-deps ${browsersToInstall}
                            
        //                     # Verify browser installation
        //                     npx playwright install --dry-run
        //                 """
        //             } catch (Exception e) {
        //                 echo "Browser installation warning: ${e.getMessage()}"
        //             }
        //         }
        //     }
        // }
        
        // stage('Code Quality Checks') {
        //     parallel {
        //         stage('TypeScript Compilation') {
        //             steps {
        //                 echo "Running TypeScript compilation check..."
        //                 script {
        //                     try {
        //                         sh 'npx tsc --noEmit'
        //                         echo "TypeScript compilation successful"
        //                     } catch (Exception e) {
        //                         echo "TypeScript compilation issues found: ${e.getMessage()}"
        //                         currentBuild.result = 'UNSTABLE'
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        
        // stage('Execute Tests') {
        //     steps {
        //         echo "Executing Playwright tests..."
        //         script {
        //             // Build test command based on parameters
        //             def testCommand = buildTestCommand()
                    
        //             echo "Executing command: ${testCommand}"
                    
        //             try {
        //                 sh """
        //                     export ENV=${params.ENVIRONMENT}
                            
        //                     # Run tests
        //                     ${testCommand}
        //                 """
                        
        //                 echo "Test execution completed successfully"
                        
        //             } catch (Exception e) {
        //                 echo "Test execution failed: ${e.getMessage()}"
        //                 currentBuild.result = 'FAILURE'
        //             }
        //         }
        //     }
        // }
        
    }
    
    post {
        always {
            // script {
            //     // Archive test artifacts first
            //     echo "Archiving test artifacts..."
                
            //     if (fileExists('playwright-report')) {
            //         echo "Playwright report found, archiving..."
            //         archiveArtifacts artifacts: 'playwright-report/**/*', keepLongStdio: true
            //     }
                
            //     if (fileExists('test-results')) {
            //         archiveArtifacts artifacts: 'test-results/**/*', keepLongStdio: true
            //     }
                
            // }

            // Publish HTML Report with enhanced configuration for Playwright
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'PlaywrightTestReport',
                includeResources: true
            ])
            
        }
        
        // success {
        //     script {
        //         echo "All tests passed successfully!"
                
        //         // Send success notification with report link
        //         def reportUrl = "${env.BUILD_URL}Playwright_Test_Report/"
        //         sendNotification('SUCCESS', "ParaBank tests passed successfully!\n View Report: ${reportUrl}")
                
        //         // Update build description with success status and report link
        //         def baseDesc = "Tests passed on ${params.ENVIRONMENT} using ${params.BROWSER}"
        //         currentBuild.description = baseDesc
        //     }
        // }
        
        // failure {
        //     script {
        //         echo "Test execution failed!"
                
        //         // Send failure notification with report link
        //         def reportUrl = "${env.BUILD_URL}Playwright_Test_Report/"
        //         sendNotification('FAILURE', "ParaBank tests failed!\n📊 View Report: ${reportUrl}")
                
        //         // Update build description with failure status
        //         def baseDesc = "Tests failed on ${params.ENVIRONMENT} using ${params.BROWSER}"
        //         currentBuild.description = baseDesc
        //     }
        // }
        
        // unstable {
        //     script {
        //         echo "Tests completed with warnings"
                
        //         // Send unstable notification
        //         sendNotification('UNSTABLE', 'ParaBank tests completed with warnings')
                
        //         // Update build description
        //         currentBuild.description = "Tests unstable on ${params.ENVIRONMENT} using ${params.BROWSER}"
        //     }
        // }
        
        // aborted {
        //     script {
        //         echo "Pipeline execution was aborted"
                
        //         // Send abort notification
        //         sendNotification('ABORTED', 'ParaBank test execution was aborted')
                
        //         // Update build description
        //         currentBuild.description = "Execution aborted"
        //     }
        // }
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