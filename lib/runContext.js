var util = require('util');

var q = require('q');
var clc = require('cli-color');
var moment = require('moment');
var _ = require('lodash');

var logger = require('./logger');

// -----
//  Helpers
// -----

// promisfy()
var promisfy = function promisfy(task, params) {
  var deferred = q.defer();

  var promise = task.run(params, deferred);
  if ( q.isPromise(promise) ) {
    promise.then(function promisfyDoneFulfilled() {
      deferred.resolve();
    })
    .fail(function promisfyDoneRejected(error) { 
      deferred.reject(error);
    });
  }

  return deferred.promise;
}; //- promisfy()

// -----
//  Constructor
// -----

// RunContext()
var RunContext = function RunContext(task, whimp) {
  this.task = task;
  this.whimp = whimp;
  this.deferred = q.defer();
}; //- RunContext()

// -----
//  Public
// -----

// run()
RunContext.prototype.run = function run(params) {
  var self = this;

  // Log that we started
  this._notifyStart();

  // Run our chain and our task
  var syncChain = this._dependsChain(params, false);
  var asyncChain = this._dependsChain(params, true);

  q.all(asyncChain)
    .then(function() {
      return syncChain.reduce(function(current, next) {
        return current.then(function() {
          return next(params);
        });
      }, q());
    })
    .then(function runThen() {
      return promisfy(self.task, params);
    })
    .then(function runDoneFulfilled() {
      self._notifyEnd();

      self.deferred.resolve();
    })
    .fail(function runDoneRejected(error) {
      var message = "Task '" + logger._tnstyle(self.task.name) + "' failed: " + logger._errstyle(error);
      logger.log(message);

      var newMessage = "One or more dependencies failed.";
      self.deferred.reject(newMessage);
    });

  // I promise thee ...
  return this.deferred.promise;
}; //- run()

// -----
//  Private
// -----

// dependsChain()
RunContext.prototype._dependsChain = function _dependsChain(params, concurrent) {
  var self = this;
  var chain = [];

  if ( _.isArray(this.task.depends) && this.task.depends.length > 0 ) {
    var self = this;
    this.task.depends.forEach(function(item) {
      if ( !self.whimp.hasTask(item) ) {
        throw new Error(util.format("A task with the name '%s' does not exist.", item));
      }

      var subTask = self.whimp._tasks[item];
      var context = new RunContext(subTask, self.whimp);

      if ( subTask.concurrent == concurrent ) {
        if ( concurrent === true ) {
          chain.push(context.run(params));
        }
        else {
          chain.push(context.run.bind(context));
        }
      }
    });
  }

  return chain;
}; //- dependsChain()

// notifyStart()
RunContext.prototype._notifyStart = function _notifyStart() {
  var taskName = this.task.name;
  this._startTime = moment();

  var xtcolor = logger._tnstyle;
  var startLog = "Running task '" + xtcolor(taskName) + "' ...";

  logger.log(startLog);
}; //- notifyStart()

// notifyEnd()
RunContext.prototype._notifyEnd = function _notifyEnd() {
  var taskName = this.task.name;
  this._endTime = moment();

  var diff = this._endTime.diff(this._startTime);
  var runTime = moment.duration(diff).asSeconds();

  var xtcolor = logger._tnstyle;
  var endLog = "Finished '" + xtcolor(taskName) + "' in " + runTime + "s";

  logger.log(endLog);
}; //- notifyEnd()

// Export
module.exports = RunContext;