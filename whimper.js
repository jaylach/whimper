'use strict';

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

// promiseFulfilled()
var promiseFulfilled = function promiseFulfilled() {
  // Do something when we're fulfilled?
}; //- promiseFulfilled()

// promiseRejected()
var promiseRejected = function(taskName) {
  return function promiseRejected(error) {
    var message = error;
    if ( error instanceof Error ) {
      message = error.message;
    }

    message = format('Failure. %s', message);
    logger.error(taskName, message);

    throw error;
  }; 
}; //- promiseRejected()

var format = util.format;

// -----
//  Constructor
// -----

// Whimper()
var Whimper = function Whimper() {
  this._tasks = {};
  this.defaultTask = 'default';
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
  else if ( _.isFunction(task) ) {
    var oldTask = task;
    task = {
      run: oldTask
    }
  }

  // Validate our task
  if ( this._validateTask(taskName, task) ) {
    var defaults = {
      name: taskName,
      depends: [],
      options: {},
      run: function(params, resolver) {
        resolver.resolve();
      }
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
    .then(promiseFulfilled)
    .catch(promiseRejected(taskName));
}; //- run()

// use()
Whimper.prototype.use = function use(func, params) {
  if ( !_.isFunction(func) ) {
    throw new Error("A function is required for 'use'.");
  }

  var funcName = func.name;
  if ( funcName.length === 0 ) funcName = '(Anonymous)';

  var taskOptions = {
    name: funcName,
    run: func
  };

  var task = new Task(taskOptions);

  return task.run(params)
    .then(promiseFulfilled)
    .catch(promiseRejected(funcName));
}; //- use()

// quiet()
Whimper.prototype.quiet = function quiet(quiet) {
  logger.quiet = quiet;
}; //- quiet()

// hasTask()
Whimper.prototype.hasTask = function hasTask(taskName) {
  return (this._tasks[taskName] instanceof Task);
}; //- hasTask()

// cli()
Whimper.prototype.cli = function cli() {
  require('./lib/cli');
}; //- cli()

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

// _empty()
Whimper.prototype._empty = function _empty() {
  // WARNING: This is here for testing purposes only. Should never need to be called
  // outside of the whimper test suite.

  this._tasks = {};
}; //- _empty()

// Exports
module.exports = new Whimper();