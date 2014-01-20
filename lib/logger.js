var clc = require('cli-color');

// -----
//  Constructor
// -----

// Logger()
var Logger = function Logger() {
  this.header = clc.xterm(183).bgXterm(237)(' whimper ') + ' ';

  this._tnstyle = clc.xterm(62);
  this._errstyle = clc.red;
}; //- Logger()

// -----
//  Public
// -----

// log()
Logger.prototype.log = function log(what) {
  console.log(this.header + what);
}; //- log()

// error()
Logger.prototype.error = function error(what) {
  what = clc.red(what);
  this.log(what);
};

// Exports
module.exports = new Logger();