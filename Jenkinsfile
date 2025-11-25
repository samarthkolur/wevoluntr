pipeline {
  agent any

  environment {
    REGISTRY       = "docker.io"
    IMAGE_NAME     = "samarthdkolur1/wevoluntr"   // no :tag here
    CREDENTIALS_ID = "docker-hub-creds"           // must match Jenkins credential ID
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Determine Tag') {
      steps {
        script {
          // use short git SHA as the tag (stable + traceable)
          def tag = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          env.IMG_TAG = tag
          echo "Using image tag: ${env.IMG_TAG}"
        }
      }
    }

    stage('Build Docker image') {
      steps {
        sh '''
          set -e
          # pass a dummy MONGODB_URI so Next.js build doesn't crash
          docker build \
            --build-arg MONGODB_URI="build-placeholder-uri" \
            -t ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG} .
          
          docker tag ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG} ${REGISTRY}/${IMAGE_NAME}:latest
        '''
      }
    }

    stage('Login & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            set -e
            echo "$DOCKER_PASS" | docker login ${REGISTRY} -u "$DOCKER_USER" --password-stdin
            docker push ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG}
            docker push ${REGISTRY}/${IMAGE_NAME}:latest
            docker logout ${REGISTRY}
          '''
        }
      }
    }

    stage('Deploy on this host (restart container)') {
      steps {
        // inject real MONGODB_URI from Jenkins credentials
        withCredentials([string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI')]) {
          sh '''
            set -e
            CONTAINER_NAME="wevoluntr-app"
            IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMG_TAG}"

            # stop & remove existing container (ignore errors)
            docker rm -f ${CONTAINER_NAME} || true

            # run new container (host 80 -> container 3000) with real MONGODB_URI
            docker run -d --name ${CONTAINER_NAME} \
              -p 80:3000 \
              --restart unless-stopped \
              -e MONGODB_URI="$MONGODB_URI" \
              ${IMAGE}
          '''
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline finished — deployed ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG}"
    }
    cleanup {
      // optional: free builder caches and dangling images to save disk
      sh '''
        docker builder prune -af || true
        docker image prune -af || true
      '''
      cleanWs()
    }
    failure {
      echo "Pipeline failed — check console output"
    }
  }
}
