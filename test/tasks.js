'use strict';

var should = require('should');
var when = require('when');
var _ = require('lodash');

var Task = require('../lib/Task');
var whimp = require('../whimper');

require('mocha');

// -----
//  Tests
// -----

// Be quiet
whimp.quiet(true);

// describe()
describe('whimper tasks', function() {
  // task()
  describe('task()', function() {
    beforeEach(function() {
      whimp._empty();
    });

    var runFunc = function(params, resolver) {
      resolver.resolve();
    };

    it('Should create task wrapper.', function(done) {
      whimp.task('someTask', {
        run: runFunc
      });

      (whimp._tasks.someTask instanceof Task).should.be.true;

      done();
    });

    it('Should register a unique task.', function(done) {
      whimp.task('someTask', {
        run: runFunc
      });

      should.exist(whimp._tasks.someTask);
      whimp._tasks.someTask._run.should.eql(runFunc);

      done();
    });

    it('Should not registered task that already exists.', function(done) {
      var register = function() {
        whimp.task('someTask', {
          run: runFunc
        });
      };

      register();
      (whimp._tasks.someTask instanceof Task).should.be.true;

      (function() {
        register();
      }).should.throw();

      done();
    });
  }); //- task()

  describe('run()', function() {
    beforeEach(function() {
      whimp._empty();
    });

    var runFunc = function(params, resolver) {
      resolver.resolve();
    };

    var runFuncReject = function(params, resolver) {
      resolver.reject();
    };

    it('Should return a promise.', function(done) {
      whimp.task('someTask', {
        run: runFunc
      });

      var promise = whimp.run('someTask');
      when.isPromiseLike(promise).should.be.true;

      done();
    });
  });
}); //- describe()