pipeline {
    options { 
        buildDiscarder(logRotator(numToKeepStr: '4')) 
        timestamps()
    }
    agent none
    triggers {
        eventTrigger(event(generic('todo-api')))
    }
    stages {
        stage('Event Trigger') {
            when {
                expression { 
                    return currentBuild.rawBuild.getCause(com.cloudbees.jenkins.plugins.pipeline.events.EventTriggerCause)
                }
            }
            steps {
                echo 'triggered by published event: todo-api'
            }
        }
        stage('Build') {
            steps {
                echo 'build app'
            }
        }
        stage('Test') {
            steps {
                echo 'test app'
            }
        }
        stage('Deploy') {
              options {
                  timeout(time: 5, unit: 'MINUTES') 
              }
              when {
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
