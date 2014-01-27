var exec = require('child_process').exec;
var util = require('util');
var _ = require('lodash');

var whimp = require('./whimper');
var logger = require('./logger');

var format = util.format;

// Create our testing task
whimp.task('run-tests', {
  describe: 'Run the Whimper mocha tests.',
  options: {
    'reporter': 'Which reporter to use, defaults to "spec"'
  },
  run: function(params, resolver) {
    var reporter = 'spec';
    if ( _.isString(params.reporter) ) {
      reporter = params.reporter;
    }

    // Run our command!
    var command = format('mocha --reporter %s', reporter);
    exec(command, function(error, stdout) {
      if ( error != null ) {
        resolver.reject(error);
      }
      else {
        logger.write('run-tests', stdout);
        resolver.resolve();
      }
    });
  }
});

whimp.cli();