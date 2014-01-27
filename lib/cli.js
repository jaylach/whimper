'use strict';

/** 
TODO:
 This whole thing needs to be cleaned up. There are
 much better ways to do what I'm doing. It will suffice for now
 but I do plan on cleaning this all up. 

 Also need to make the output for the various lists (tasks, options, etc)
 much prettier. They are fairly simple, and kind of ugly, right now.
**/

var util = require('util');
var clc = require('cli-color');
var _ = require('lodash');

var argv = require('optimist')
            .usage('Usage: $0 [tasks] [--options]')
            .argv;

var whimp = require('../whimper');
var logger = require('../logger');

// -----
//  Helpers
// -----

var format = util.format;
var params = {};

// validateTasks()
var validateTasks = function validateTasks(tasks) {
  var valid = true;

  tasks.forEach(function(taskName) {
    if ( !whimp.hasTask(taskName) ) {
      logger.error(format("A task with the name '%s' does not exist.", taskName));
      valid = false;
    }

    var task = whimp._tasks[taskName];
    if ( _.isPlainObject(task.options) ) {
      var opts = Object.keys(task.options);

      opts.forEach(function(key) {
        var required = key.indexOf('!') === 0;
        if ( required ) key = key.substr(1);

        if ( required && argv[key] == null ) {
          logger.error(format("Task '%s' requires the option '%s'.", taskName, key));
          valid = false;
          return;
        }

        params[key] = argv[key];
      });
    }
  });

  return valid;
}; //- validateTasks()

// -----
//  CommandLine
// -----

// Allow for listing of all registered tasks
if ( argv['tasks'] != null ) {
  var taskKeys = Object.keys(whimp._tasks);
  taskKeys.forEach(function(t) {
    var task = whimp._tasks[t];
    logger.write(t, task.describe || 'A task!');
  });

  return;
}

// Allow for help of a single task (listing description, options, etc)
if ( argv['?'] != null && _.isString(argv['?']) ) {
  var taskName = argv['?'];
  if ( !whimp.hasTask(taskName) ) {
    logger.error(format("A task with the name '%s' does not exist.", taskName));
  }

  var task = whimp._tasks[taskName];
  logger.write(taskName, task.describe || 'A task!');
  if ( _.isPlainObject(task.options) ) {
    var optKeys = Object.keys(task.options);
    optKeys.forEach(function(key) {
      var required = key.indexOf('!') === 0;
      var newKey = key;
      if ( required ) newKey = key.substr(1);

      logger.write(format('\t--%s\t%s\t%s', newKey, task.options[key], (required ? 'required' : '')));
    });
  }

  return;
}

// Get our task names
var taskNames = argv._;

if ( taskNames.length === 0 ) {
  logger.write(format('%s: %s task [--options]', clc.bold('Usage'), argv['$0']));
  logger.write(format(' %s: %s --tasks', clc.bold('List'), argv['$0']));
  logger.write(format(' %s: %s -? task', clc.bold('Help'), argv['$0']));
  return;
}

if ( validateTasks(taskNames) ) {
  taskNames.forEach(function(t) {
    whimp.run(t, params);
  });
}