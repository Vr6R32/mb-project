pipeline {
    agent any

    tools {
        maven "Apache Maven"
        jdk "JDK 17"
    }

    stages {
        stage('Build') {
            steps {
                sh 'mvn clean install'
            }
        }
    }
}