var util = require('util');
var _ = require('lodash');
var clc = require('cli-color');

var Runner = require('./runner');
var logger = require('./logger');

// -----
//  Constructor
// -----

// Whimper()
var Whimper = function Whimper() {
  this._tasks = [];
}; //- Whimper()

// -----
//  Public
// -----

// task()
Whimper.prototype.task = function task(taskName, options) {
  if ( !_.isPlainObject(options) ) {
    logger.error("A 'run' or 'depends' option is required when registering a task.");
    return;
  }
  
  // Merge our options
  var defaults = {
    concurrent: false,
    depends: [],
    options: {}
  };

  options = _.defaults(options, defaults);

  // Validate our options
  var run = options.run;
  var depends = options.depends;
  if ( _.isFunction(run) || (_.isArray(depends) && depends.length > 0) ) {
    if ( this._tasks[taskName] == null ) {
      options.name = taskName;
      this._tasks[taskName] = options;
    }
    else {
      logger.error(util.format("A task with the name '%s' already exists.", taskName));
      return;
    }
  }
  else {
    logger.error("A 'run' or 'depends' option is required when registering a task.");
    return;
  }
}; //- task()

// run()
Whimper.prototype.run = function run(taskName, params) {
  try {
    // If we don't have a task by this name, fail out
    if ( !this.hasTask(taskName) ) {
      throw new Error(util.format("A task with the name '%s' does not exist.", taskName));
      return;
    }

    var task = this._tasks[taskName];
    return new Runner(task, this).run(params);
  }
  catch (error) {
    logger.error(error.message);
    return;
  }
}; //- run()

// hasTask()
Whimper.prototype.hasTask = function hasTask(taskName) {
  var task = this._tasks[taskName];
  if ( !_.isPlainObject(task) ) {
    return false;
  }

  return true;
}; //- hasTask()

module.exports = Whimper;