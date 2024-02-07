pipeline {
    agent any

    tools {
        maven "Apache Maven"
        jdk "JDK 17"
    }

    stages {
        stage('Preparation') {
            steps {
                script {
                    if (isUnix()) {
                    sh 'mkdir -p /var/log/spring'
                    sh 'chmod 777 /var/log/spring'
                    }
                }
            }
        }
        stage('Build') {
            steps {
                sh 'mvn clean install'
            }
        }
    }
}
