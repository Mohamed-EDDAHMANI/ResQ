pipeline {
    agent any
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
        PATH = "${env.PATH};C:\\Program Files\\nodejs"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                bat 'npm run lint'
            }
        }
        
        stage('Test') {
            steps {
                bat 'npm test -- --watchAll=false --passWithNoTests'
            }
        }
        
        stage('Build') {
            steps {
                bat 'npm run build'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                bat '''
                    echo "Deploying to staging environment..."
                    xcopy /E /I /Y dist staging
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                bat '''
                    echo "Deploying to production environment..."
                    xcopy /E /I /Y dist production
                '''
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            emailext (
                subject: "✅ Build Success: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Build completed successfully for ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
        failure {
            emailext (
                subject: "❌ Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Build failed for ${env.JOB_NAME} - ${env.BUILD_NUMBER}. Check console output for details.",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}