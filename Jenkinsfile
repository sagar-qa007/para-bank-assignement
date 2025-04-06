pipeline {
    agent any

    environment {
        NODE_VERSION = '22.14.0'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 60, unit: 'MINUTES')
    }

    parameters {
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit', 'all'], description: 'Browser to run tests on')
        booleanParam(name: 'API_ONLY', defaultValue: false, description: 'Run only API tests')
        booleanParam(name: 'UI_ONLY', defaultValue: false, description: 'Run only UI tests')
        booleanParam(name: 'MOBILE', defaultValue: false, description: 'Run tests on mobile viewports')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo '✅ Code checkout completed'
            }
        }

        stage('Setup Node.js') {
            steps {
                bat 'node --version || echo Node.js not found'
                bat 'npm --version || echo npm not found'
                bat 'where node || echo Node.js path not found'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install --with-deps'
                echo '✅ Dependencies installed'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def testCommand = 'npx playwright test'

                    if (params.API_ONLY) {
                        testCommand = 'npx playwright test tests/api-cases'
                    } else if (params.UI_ONLY) {
                        testCommand = 'npx playwright test tests/ui-cases'
                    }

                    if (params.BROWSER != 'all') {
                        if (params.MOBILE && params.BROWSER in ['chromium', 'webkit']) {
                            testCommand += ' --project="Mobile Safari - iPhone 12"'
                        } else {
                            testCommand += " --project=${params.BROWSER}"
                        }
                    }

                    try {
                        bat "${testCommand}"
                    } catch (e) {
                        echo "⚠️ Tests failed: ${e.message}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }

    post {
        always {
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])

            archiveArtifacts artifacts: 'playwright-report/**/*.*,test-results/**/*.*', allowEmptyArchive: true
        }

        success {
            echo '✅ Tests completed successfully'
        }

        unstable {
            echo '⚠️ Tests completed with some failures'
        }

        failure {
            echo '❌ Build failed'
        }

        cleanup {
            cleanWs(
                cleanWhenNotBuilt: true,
                deleteDirs: true,
                disableDeferredWipeout: true,
                patterns: [[pattern: 'test-results', type: 'INCLUDE']]
            )
        }
    }
}