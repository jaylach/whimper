var q = require('q');
var clc = require('cli-color');
var moment = require('moment');
var _ = require('lodash');

var logger = require('./logger');

// -----
//  Constructor
// -----

// Runner()
var Runner = function Runner(task, whimp) {
  this.task = task;
  this.whimp = whimp;
  this.deferred = q.defer();
}; //- Runner()

// -----
//  Public
// -----

// run()
Runner.prototype.run = function run(params) {
  var wrap = this._wrap;
  var self = this;

  wrap(params)
    .call(this)
    .done(function() {
      self._notifyEnd();
      self.deferred.resolve();
    }, function(error) {
      var message = "Task '" + logger._tnstyle(self.task.name) + "' failed: " + logger._errstyle(error);
      logger.log(message);

      var newMessage = "One or more dependencies failed.";
      self.deferred.reject(newMessage);
    });

  return this.deferred.promise;
}; //- run()

// -----
//  Private
// -----

// dependsChain()
Runner.prototype._dependsChain = function _dependsChain(params) {
  var chain = [];

  if ( _.isArray(this.task.depends) && this.task.depends.length > 0 ) {
    var self = this;
    this.task.depends.forEach(function(item) {
      if ( !self.whimp.hasTask(item) ) {
        throw new Error(util.format("A task with the name '%s' does not exist.", item));
      }

      var subTask = self.whimp._tasks[item];
      var runner = new Runner(subTask, self.whimp);
      chain.push(runner.run(params));
    });
  }

  return chain;
}; //- dependsChain()

// notifyStart()
Runner.prototype._notifyStart = function _notifyStart() {
  var taskName = this.task.name;
  this._startTime = moment();

  var xtcolor = logger._tnstyle;
  var startLog = "Running task '" + xtcolor(taskName) + "' ...";

  logger.log(startLog);
}; //- notifyStart()

// notifyEnd()
Runner.prototype._notifyEnd = function _notifyEnd() {
  var taskName = this.task.name;
  this._endTime = moment();

  var diff = this._endTime.diff(this._startTime);
  var runTime = moment.duration(diff).asSeconds();

  var xtcolor = logger._tnstyle;
  var endLog = "Finished '" + xtcolor(taskName) + "' in " + runTime + "s";

  logger.log(endLog);
}; //- notifyEnd()

// wrap()
Runner.prototype._wrap = function _wrap(params) {
  var wrapper = function wrapper() {
    var self = this;

    var deferred = q.defer();
    this._notifyStart();

    var chain = this._dependsChain(params);
    q.all(chain)
      .done(function() {
        return self.task.run(params, deferred);
      }, function(error) {
        var message = "Task '" + logger._tnstyle(self.task.name) + "' failed: " + logger._errstyle(error);
        logger.log(message);

        var newMessage = "One or more dependencies failed.";
        self.deferred.reject(newMessage);
      });

    return deferred.promise;
  };

  return wrapper;
}; //- _wrap()

// Export
module.exports = Runner;