'use strict';

var util = require('util');

// -----
//  Helpers
// -----

var format = util.format;

// -----
//  Constructor
// -----

// TaskError()
var TaskError = function TaskError(taskName, message) {
  Error.call(this);

  this.taskName = taskName;
  this.message = message;
}; //- TaskError()

// -----
//  Header
// -----

// toString()
TaskError.prototype.toString = function toString() {
  return message;
}; //- toString()

util.inherits(TaskError, Error);

// Exports
module.exports = TaskError;