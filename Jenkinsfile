library 'kypseli'
pipeline {
    options { 
        buildDiscarder(logRotator(numToKeepStr: '4')) 
        preserveStashes()
    }
    agent none
    triggers {
        eventTrigger simpleMatch('todo-api')
    }
    stages {
        stage('Test') {
          agent {
            kubernetes {
              label 'test'
              yamlFile 'test-pod.yml'
            }
          }
          steps {
            container('nginx') {
              sh 'cp -r $WORKSPACE/src/* /usr/share/nginx/html'
              sh 'nginx -g "daemon off;" &'
            }
            container('testcafe') {
              sh '/opt/testcafe/docker/testcafe-docker.sh --debug-on-fail "chromium --no-sandbox" tests/*.js -r xunit:res.xml'
            }
            stash name: 'src', includes: 'src/*, nginx/*, Dockerfile'
          }
          post {
            always {
              junit 'res.xml'
            }
          }
        }
        stage('Docker Build and Push') {
          //don't need an agent as one is provided in shared pipeline library -> kypseli
          agent none
          when {
            beforeAgent true
            branch 'master'
          }
          steps {
            dockerBuildPush('kypseli/todo-ui', "${BUILD_NUMBER}",'./') {
                unstash 'src'
            }
          }
        }
        stage('Deploy') {
              options {
                  timeout(time: 3, unit: 'MINUTES') 
              }
              when {
                  beforeAgent true
                  branch 'master'
              }
              input {
                  message "Deploy to prod?"
                  ok "Yes"
                  submitter "kypseli*ops"
              }
            steps {
                echo 'deploy app'
            }
        }
    }
}
