var util = require('util');
var _ = require('lodash');

var Task = require('./Task');

// -----
//  Helpers
// -----

var format = util.format;

// orderTasks()
var orderTasks = function orderTasks(tasks, taskNames, results, recurse) {
  results = results || [];
  recurse = recurse || [];

  // Helper to find a task
  var addedTask = function(name) {
    return _.any(results[0], function(t) {
      return t.name === name;
    }) || _.any(results[1], function(t) {
      return t.name === name;
    });
  };

  // Iterate over our task names
  taskNames.forEach(function(name) {
    if ( !addedTask(name) ) {
      var task = tasks[name];
      if ( !(task instanceof Task) ) {
        throw new Error(format("A task with the name '%s' does not exist.", name));
      }

      if ( recurse.indexOf(name) >= 0 ) {
        recurse.push(name);
        throw new Error(format("Recursive dependencies found: %s", recurse.join(" > ")));
      }

      if ( _.isArray(task.depends) && task.depends.length > 0 ) {
        recurse.push(name);
        orderTasks(tasks, task.depends, results, recurse);
        recurse.pop();

        results[1].push(task);
      }
      else {
        results[0].push(task);
      }
    }
  });
}; //- orderTasks()

// Exports
module.exports = orderTasks;