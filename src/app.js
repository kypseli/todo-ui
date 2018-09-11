var todoApiUrl = 'http://todo-api.k8s.beedemo.net/todos/'
var todoStorage = {
  fetch: function (callback) {
		$.getJSON(todoApiUrl, function(data){
      var todos = data;
      todoStorage.uid = todos.length;
      callback(todos);
		});
  },
  save: function (todo) {
    console.log("saving", todo);
    $.ajax({
      type: "POST",
      url: todoApiUrl,
      beforeSend: function(xhr){xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');},
      contentType: "application/json",
      data: JSON.stringify(todo)
    }).done(function(result) {
    	console.log("Saved", result);
    	todo._id = result._id;
    });
  },
  update: function (todo) {
    console.log("updating", todo);
    $.ajax({
      type: "PUT",
      url: todoApiUrl,
      beforeSend: function(xhr){xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');},
      crossDomain: true,
      contentType: "application/json",
      data: JSON.stringify(todo)
    }).done(function(result) {
    	console.log("Updated", result);
    });
  },
  updateAll: function (todos) {
    console.log("updating", todos);
    var saveOne = function(todo, callback){
			$.ajax({
        type: "PUT",
        url: todoApiUrl,
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify(todo)
      }).done(function(result) {
        console.log("Updated", result);
        	callback(null, result);
      });
    };
    
    var funcs = [];
		todos.forEach(function (todo) {
			funcs.push(async.apply(saveOne, todo));
		});
		async.parallel(funcs, function(error, result) {
	  		console.log("updateAll", error, result);
	  });
  },
  delete: function (todo) {
    console.log("deleting", todo);
    $.ajax({
      type: "DELETE",
      url: todoApiUrl,
      crossDomain: true,
      contentType: "application/json",
      data: JSON.stringify(todo)
    }).done(function(result) {
    	console.log("Saved", result);
    	todo._id = result._id;
    });
  }
};

// visibility filters
var filters = {
  all: function (todos) {
    return todos;
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed;
    });
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed;
    });
  }
};

// app Vue instance
var app = new Vue({
  // app initial state
  data: {
    todos: [],
    newTodo: '',
    editedTodo: null,
    visibility: 'all'
  },

  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler: function (todos) {
      	console.log("Something happend to ", todos.length);
        //todoStorage.save(todos)
      },
      deep: true
    }
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.todos);
    },
    remaining: function () {
      return filters.active(this.todos).length;
    },
    allDone: {
      get: function () {
        return this.remaining === 0;
      },
      set: function (value) {
        this.todos.forEach(function (todo) {
          todo.completed = value;
        });
        todoStorage.updateAll(this.todos);
      }
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items';
    }
  },
	created: function() {
	    this.getTodoFromDb();
	},
  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
  	
  	getTodoFromDb: function(){
    	var self = this;
    	todoStorage.fetch(function(tododata){
      	console.log("Get data ", tododata);
      	self.todos = tododata;
      });
    },
    addTodo: function () {
      var value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      var newtodo = {
        description: value,
        completed: false
      };
      todoStorage.save(newtodo);
      this.todos.push(newtodo);
      this.newTodo = '';
    },

    removeTodo: function (todo) {
	    todoStorage.delete(todo);
      this.todos.splice(this.todos.indexOf(todo), 1);
    },
    
    setState: function (todo) {
    	todo.completed = !todo.completed;
	    todoStorage.update(todo);
    },

    editTodo: function (todo) {
    	todoStorage.update(todo);
      this.beforeEditCache = todo.description;
      this.editedTodo = todo;
    },

    doneEdit: function (todo) {
    	console.log("doneEdit", todo);
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.description = todo.description.trim();
      if (!todo.description) {
        this.removeTodo(todo);
      } else {
      	todoStorage.update(todo);
      }
    },

    cancelEdit: function (todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },

    removeCompleted: function () {
      this.todos.forEach(function (todo) {
        if (todo.completed) {
            todoStorage.delete(todo);
        }
      });
      this.todos = filters.active(this.todos)
    }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, value) {
      if (value) {
        el.focus();
      }
    }
  }
})

// handle routing
function onHashChange () {
  var visibility = window.location.hash.replace(/#\/?/, '');
  if (filters[visibility]) {
    app.visibility = visibility;
  } else {
    window.location.hash = '';
    app.visibility = 'all';
  }
}

window.addEventListener('hashchange', onHashChange);
onHashChange();

// mount
app.$mount('.todoapp');
