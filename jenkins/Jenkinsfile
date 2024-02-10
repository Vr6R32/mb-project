pipeline {
    agent any

    tools {
        maven 'Apache Maven'
        jdk 'JDK 17'
    }

    stages {
        stage('Preparation') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        stage('Build') {
            steps {
                echo 'Building the project...'
                sh 'mvn -B clean install'
            }
        }
    }

    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed.'
        }
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
