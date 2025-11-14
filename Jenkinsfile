pipeline {
  agent any
  environment {
    IMAGE_NAME = "samarthkolur/wevoluntr"   // change this
    TAG = "${env.BUILD_NUMBER}"            // or use git commit: sh('git rev-parse --short HEAD').trim()
    REGISTRY = "docker.io"                 // or your registry host
    CREDENTIALS_ID = "docker-hub-creds"    // Jenkins credential you created
  }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Build Docker image') {
      steps {
        sh "docker build -t ${REGISTRY}/${IMAGE_NAME}:${TAG} ."
      }
    }

    stage('Login & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login ${REGISTRY} -u "$DOCKER_USER" --password-stdin
            docker push ${REGISTRY}/${IMAGE_NAME}:${TAG}
            docker logout ${REGISTRY}
          '''
        }
      }
    }

    stage('Deploy on this host (restart container)') {
      steps {
        // stops old container (if any) and runs new one. Adjust container name, ports, volumes as needed.
        sh '''
          set -e
          CONTAINER_NAME="wevoluntr-app"
          IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"

          # stop & remove existing container (ignore errors)
          docker rm -f ${CONTAINER_NAME} || true

          # run new container (example - change ports and env)
          docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${IMAGE}
        '''
      }
    }
  }

  post {
    always { echo "Finished pipeline (build ${TAG})" }
  }
}
