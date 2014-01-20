var pkg = require('./package.json');
var Whimper = require('./lib/whimper');
var whimp = new Whimper();

// Exports
module.exports = whimp;
module.exports.version = pkg.version;