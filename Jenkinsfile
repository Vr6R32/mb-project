pipeline {
    agent any

    tools {
        maven "Apache Maven"
        jdk "JDK 17"
    }

    stages {
        stage('Start Database') {
            steps {
                sh 'docker run --name test-db -e POSTGRES_DB=motobudzet -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=dontgotosql -p 5432:5432 -d postgres'
                sh 'docker cp init.sql test-db:/docker-entrypoint-initdb.d/init.sql'
                script {
                    def maxRetries = 30
                    def retryInterval = 10
                    def retries = 0

                    while (retries < maxRetries) {
                        def result = sh(script: 'docker exec test-db pg_isready -h localhost -p 5432', returnStatus: true)
                        if (result == 0) {
                            echo 'DB is ready .'
                            break
                        } else {
                            echo "Waiting for db setup (retry no. ${retries + 1}/${maxRetries})"
                            sleep retryInterval
                            retries++
                        }
                    }

                    if (retries == maxRetries) {
                        error 'DB access is unreachable'
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


