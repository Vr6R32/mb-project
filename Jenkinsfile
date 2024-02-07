pipeline {
    agent any

    tools {
        maven "Apache Maven"
        jdk "JDK 17"
    }

    stages {
        stage('Setup Docker Network') {
            steps {
                script {
                    sh 'docker ps'
//                     sh 'docker network create jenkins_network || true'
                }
            }
        }
        stage('Start Database') {
            steps {
//                 sh 'docker run --name postgres-db --network jenkins_network -e POSTGRES_DB=motobudzet -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=dontgotosql -p 5432:5432 -d postgres'
                // sh 'docker cp ../../mb/db-init.sql test-db:/docker-entrypoint-initdb.d/db-init.sql'
                script {
                    def maxRetries = 30
                    def retryInterval = 10
                    def retries = 0

                    while (retries < maxRetries) {
                        def result = sh(script: 'docker exec postgres-db pg_isready -h postgres-db -p 5432', returnStatus: true)
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
    post {
        always {
            // cleanWs()
            // sh 'docker stop test-db && docker rm test-db'
            sh 'docker ps'
        }
    }
}
