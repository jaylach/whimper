'use strict';

var util = require('util');
var when = require('when');
var moment = require('moment');
var _ = require('lodash');

var TaskError = require('./TaskError');
var logger = require('../logger');

// -----
//  Helpers
// -----

var format = util.format;

// setupError()
var setupError = function setupError(taskName, error) {
  var message = error;
  var e = new TaskError(taskName, format("Task '%s' failed with error '%s'.", taskName, message));

  if ( error instanceof Error ) {
    message = error.message;
    var errorTask = taskName;
    var errorMsg = format("Task '%s' failed with error '%s'.", errorTask, message);
    
    if ( error instanceof TaskError ) {
      errorTask = error.taskName;
      errorMsg = error.message;      
    }

    e = new TaskError(errorTask, errorMsg); 
  }

  return e;
}; //- setupError()

// -----
//  Constructor
// -----

// Task()
var Task = function Task(task) {
  this.name = task.name;
  this.depends = task.depends;
  this.options = task.options;
  this.describe = task.describe;

  this._run = task.run;
  this._isRunning = false;
  this._isDone = false;
}; //- Task()

// -----
//  Public
// -----

// run()
Task.prototype.run = function run(params) {
  var deferred = when.defer();
  var resolver = deferred.resolver;
  var promise = deferred.promise;

  var self = this;
  var taskName = this.name;

  this._startTask();
  var maybePromise = this._run(params, resolver);
  if ( when.isPromiseLike(maybePromise) ) {
    maybePromise.done(function(value) {
      resolver.resolve(value);
    }, function(error) {
      resolver.reject(setupError(taskName, error));
    });
  }
  // Attempt to handle a task that returns a value.
  // We are assuming that since it returned a value it's 
  // not going to resolve itself.
  else if ( !_.isUndefined(maybePromise) ) {
    // Reject on returning an error
    if ( maybePromise instanceof Error ) {
      resolver.reject(maybePromise);
    }
    else {
      resolver.resolve(maybePromise);
    }
  }

  return promise.then(function() {
    self._endTask(true);
  }).catch(function(error) {
    self._endTask(false);

    throw setupError(taskName, error);
  });
}; //- run()

// -----
//  Private
// -----

// _startTask()
Task.prototype._startTask = function _startTask() {
  var taskName = this.name;

  this._startTime = moment();
  this._isRunning = true;
  this._isDone = false;

  var xtcolor = logger._tnStyle;
  var what = format("Running task '%s' ...", xtcolor(taskName));

  logger.write(what);
}; //- _startTask()

// _endTask()
Task.prototype._endTask = function _endTask(success) {
  var taskName = this.name;

  this._endTime = moment();
  this._isRunning = false;
  this._isDone = true;

  var diff = this._endTime.diff(this._startTime);
  var runTime = moment.duration(diff).asSeconds();

  var outcome = success ? logger._succStyle(":)") : logger._errorStyle(":(");

  var xtcolor = logger._tnStyle;
  var what = format("Finished task '%s' in %ss %s", xtcolor(taskName), runTime, outcome);

  logger.write(what);
}; //- _endTask()

// Exports
module.exports = Task;