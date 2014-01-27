var clc = require('cli-color');

// -----
//  Constants
// -----

var WHIMPER_TEXT_COLOR = 183;
var WHIMPER_BG_COLOR = 237;
var TASK_NAME_TEXT_COLOR = 62;
var ERROR_TEXT_COLOR = 160;
var SUCCESS_TEXT_COLOR = 28;

// -----
//  Constructor
// -----

// Logger()
var Logger = function Logger() {
  // Set our styles
  this._header = clc.xterm(WHIMPER_TEXT_COLOR)
                    .bgXterm(WHIMPER_BG_COLOR)(' whimper ') + ' ';

  this._tnStyle = clc.xterm(TASK_NAME_TEXT_COLOR);
  this._errorStyle = clc.xterm(ERROR_TEXT_COLOR);
  this._succStyle = clc.xterm(SUCCESS_TEXT_COLOR);
}; //- Logger()

// -----
//  Public
// -----

// write()
Logger.prototype.write = function write(taskName, what) {
  if ( arguments.length === 1 ) {
    what = taskName;
    taskName = null;
  }

  var toLog = this._header;
  if ( taskName != null ) {
    toLog += this._tnStyle(taskName) + ': ';
  }
  toLog += what;

  console.log(toLog);
}; //- write()

// error()
Logger.prototype.error = function error(taskName, what) {
  if ( arguments.length === 1 ) {
    what = taskName;
    taskName = null;
  }

  what = this._errorStyle(what);
  this.write(taskName, what);
}; //- error()

// Exports
module.exports = new Logger();