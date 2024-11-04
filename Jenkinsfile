pipeline {
    agent {
        label "zuvmljenson02"
    }
    environment {
        IMAGE_SONAR = 'registry.lksnext.com/node-20:1.0'
        SONAR_HOST_URL = 'http://zuvmljenson01/sonar/'
        SONAR_TOKEN = credentials('sonar-analysis-token')
    }
    stages {
        stage('Dependency-check task') {
            when {
                    environment name: 'JOB_ACTION', value: 'sonar'
            }
            steps {
                script {
                    sh '''
                    docker run --rm \
                    -v "$(pwd)":/app \
                    -w /app \
                    -u $(id -u):$(id -g) \
                    -e npm_config_cache=/tmp \
                    registry.lksnext.com/node:20.11.1 \
                    npm ci
                    '''

                sh '''
                    docker run --rm \
                    -v "$(pwd)":/app \
                    -u 1000:$(id -g) \
                    registry.lksnext.com/owasp/dependency-check:10.0.4 \
                   --nvdDatafeed https://vulnz.devops.lksnext.com/ \
                   --scan /app \
                   --project "developer-roadmap" \
                   --out /app \
                   -f ALL \
                   --disablePnpmAudit
                    '''
                }
            }
        }
        stage('Sonar') {
            when {
                environment name: 'JOB_ACTION', value: 'sonar'
            }
            steps {
                script {
                    sh '''
                    docker run --rm \
                    -v "$(pwd)":/app \
                    -e SONAR_HOST_URL=$SONAR_LKS_HOST_URL \
                    -e SONAR_TOKEN=$SONAR_TOKEN \
                    -e JOB_ACTION=$JOB_ACTION \
                    $IMAGE_SONAR \
                    '''
                }
            }
        }
    }
    post {
        always{
            deleteDir()
        }
    }
}
