var whimp = require('../index');
var logger = require('../lib/logger');

whimp.task('depends1', {
  run: function depends1(params, deferred) {
    setTimeout(function() {
      deferred.resolve();
    }, 2500);
  }
});

whimp.task('depends2', {
  depends: [ 'depends3' ],
  run: function depends2(params, deferred) {
    deferred.resolve();
  }
});

whimp.task('depends3', {
  run: function depends3(params, deferred) {
    deferred.resolve();
  }
});

whimp.task('some-depends', {
  run: function someDepends(params, deferred) {
    setTimeout(function() {
      deferred.reject('I suck.');
    }, 1000);
  }
});

whimp.task('some-task', {
  depends: [ 'some-depends' ],
  run: function someTask(params, deferred) {
    logger.log('In some-task');
    setTimeout(function() {
      deferred.resolve();
    }, 1500);
  }
});

whimp.task('test-task', {
  depends: [ 'depends1', 'depends2' ],
  run: function testTask(params, deferred) {
    return whimp.run('some-task');
  }
});

whimp.run('test-task');