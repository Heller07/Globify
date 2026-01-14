pipeline {
    agent {
    docker {
        image 'node:18'
        args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
}


    stages {
        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t myapp:latest .'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
        docker stop myapp || true
        docker rm myapp || true
        docker run -d -p 8080:8080 --name myapp myapp:latest
        '''
            }
        }
    }
}
