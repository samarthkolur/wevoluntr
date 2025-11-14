pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build') {
      steps {
        sh 'echo "Building..."'
        # insert build commands, e.g. npm ci && npm test or ./mvnw -B -DskipTests clean package
      }
    }
    stage('Archive') {
      steps {
        archiveArtifacts artifacts: '**/target/*.jar', allowEmptyArchive: true
      }
    }
  }
}
