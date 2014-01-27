var util = require('util');

var when = require('when');
var parallel = require('when/parallel');
var sequence = require('when/sequence');
var _ = require('lodash');

var Task = require('./lib/Task');
var orderTasks = require('./lib/orderTasks');
var logger = require('./logger');

// -----
//  Helpers
// -----

var format = util.format;

// -----
//  Constructor
// -----

// Whimper()
var Whimper = function Whimper() {
  this._tasks = {};
}; //- Whimper()

// -----
//  Public
// -----

// task()
Whimper.prototype.task = function task(taskName, task) {
  // If our task param is an array, assume it's an array of dependencies
  if ( _.isArray(task) ) {
    var oldTask = task;
    task = {
      depends: oldTask
    };
  }

  // Validate our task
  if ( this._validateTask(taskName, task) ) {
    var defaults = {
      name: taskName,
      depends: [],
      options: {}
    };
    task = _.defaults(task, defaults);

    // Store our task
    this._tasks[taskName] = new Task(task);
  }
}; //- task()

// run()
Whimper.prototype.run = function run(taskName, params) {
  if ( !this.hasTask(taskName) ) {
    throw new Error(format("A task with the name '%s' does not exist.", taskName));
  }

  // Simple helper to strip out our functions
  var stripFunctions = function stripFunctions(inArray) {
    return _.map(inArray, function(t) {
      return t.run.bind(t);
    });
  };

  // Run our tasks
  var task = this._tasks[taskName];

  var ordered = [ [ /* concurrent */ ], [ /* sequenced */ ]];
  orderTasks(this._tasks, [ task.name ], ordered);
  
  var concurrent = stripFunctions(ordered[0]);
  var sequenced = stripFunctions(ordered[1]);

  var self = this;
  this._isRunning = true;

  return parallel(concurrent, params)
    .then(function() {
      return sequence(sequenced, params);
    })
    .then(function runDoneFulfilled() {
      console.log('done?');
      // Do something special when we're done?
    })
    .catch(function runDoneRejected(error) {
      var message = error;
      if ( error instanceof Error ) {
        message = error.message;
      }

      message = format('Failure. %s', message);
      logger.error(taskName, message);

      throw error;
    });
}; //- run()

// hasTask()
Whimper.prototype.hasTask = function hasTask(taskName) {
  return (this._tasks[taskName] instanceof Task);
}; //- hasTask()

// -----
//  Private
// -----

// _validateTask()
Whimper.prototype._validateTask = function _validateTask(taskName, task) {
  // Validate our task's name
  if ( taskName == null ) {
    throw new Error("A task cannot be registered without a name.");
    return false;
  }
  if ( taskName.indexOf(' ') >= 0 ) {
    throw new Error("A task's name cannot contain spaces.");
    return false;
  }
  if ( this.hasTask(taskName) ) {
    throw new Error(format("A task with the name '%s' already exists.", taskName));
    return false;
  }

  // Validate our task
  if ( !_.isPlainObject(task) ) {
    throw new Error("A task definition object is required.");
    return false;
  }
  if ( !_.isFunction(task.run) && !_.isArray(task.depends) ) {
    throw new Error("A task must have either a 'run' or 'depends' property (or both).");
    return false;
  }

  return true;
}; //- _validateTask()

// Exports
module.exports = new Whimper();