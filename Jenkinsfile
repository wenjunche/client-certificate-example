pipeline {
  agent {
    label 'docker'
  }
  stages {
    stage('checkout'){
      steps {
        checkout scm
      }
    }

    stage('create npmrc') {
      environment {
        NPM_READ_TOKEN = credentials('NPM_TOKEN')
      }
      steps {
        sh "echo //registry.npmjs.org/:_authToken=$NPM_READ_TOKEN > .npmrc"
      }
    }

    stage('build') {
      steps {
        script {
          GIT_SHORT_SHA = sh ( script: "git rev-parse --short HEAD", returnStdout: true ).trim()
        }
        script {
          BUILD_PROJECT = env.BUILD_PROJECT
          GIR_ROOT_DIR = "${BUILD_PROJECT}"
          DOCKERFILE = "${BUILD_PROJECT}/Dockerfile"
        }
        sh "GIR_ROOT_DIR=${GIR_ROOT_DIR} gir build -f $DOCKERFILE -- --build-arg GIT_SHORT_SHA=$GIT_SHORT_SHA"
      }
    }

    stage('test') {
      steps {
        echo "Skipping test for now"
      }
    }

    stage('push') {
      steps {
        sh "GIR_ROOT_DIR=${GIR_ROOT_DIR} AWS_REGION=us-east-1 gir push"
      }
    }

    stage('provision') {
      environment {
        OPENFIN_SECURITY_TOKEN = credentials('OPENFIN-SECURITY-TOKEN-STAGING')
        POLICY_PROXY_URL = "https://aws-policy-proxy-staging.openfin.co"
      }
      steps {
        sh "GIR_ROOT_DIR=${GIR_ROOT_DIR} AWS_REGION=us-east-1 gir provision"
      }
    }

    stage('deploy') {
      steps {
        sh "GIR_ROOT_DIR=${GIR_ROOT_DIR} AWS_REGION=us-east-1 gir deploy"
      }
    }
  }
}