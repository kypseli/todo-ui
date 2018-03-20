pipeline {
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
            steps {
                echo 'deploy app'
            }
        }
    }
}
