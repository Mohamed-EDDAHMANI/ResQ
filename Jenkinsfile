pipeline {
    agent {
        docker {
            image 'node:20'
        }
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }
}