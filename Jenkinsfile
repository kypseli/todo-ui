pipeline {
  triggers {
   eventTrigger event(generic('todo-api'))
  }
  stages {
    stage('Build') {
      steps {
        echo 'triggered by todo-api event'
      }
    }
  }
}
