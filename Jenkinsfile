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
                        sh 'mkdir -p $WORKSPACE/logs'
                        sh 'chmod 777 $WORKSPACE/logs'
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
