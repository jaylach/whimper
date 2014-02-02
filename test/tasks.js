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
      whimp.hasTask('someTask').should.be.true;

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
      whimp.hasTask('someTask').should.be.true;

      (function() {
        register();
      }).should.throw();

      done();
    });

    it('Should register a task from dependency array.', function(done) {
      var depends = [ 'one', 'two' ];
      whimp.task('someTask', depends);

      should.exist(whimp._tasks.someTask);
      whimp.hasTask('someTask').should.be.true;
      
      whimp._tasks.someTask.depends.should.eql(depends);
      (typeof(whimp._tasks.someTask._run)).should.eql('function');

      done();      
    });

    it('Should register a task from function.', function(done) {
      whimp.task('someTask', runFunc);

      should.exist(whimp._tasks.someTask);
      whimp.hasTask('someTask').should.be.true;

      whimp._tasks.someTask._run.should.eql(runFunc);

      done();
    });
  }); //- task()

  // run()
  describe('run()', function() {
    beforeEach(function() {
      whimp._empty();
    });

    var runFuncResolve = function(params, resolver) {
      // Simulate a very quick async call
      setImmediate(resolver.resolve);
    };

    var runFuncValue = function(params, resolver) {
      return true;
    };

    var runFuncReject = function(params, resolver) {
      // Simulate a very quick async call
      setImmediate(resolver.reject);
    };

    var runFuncValueReject = function(params, resolver) {
      return new Error('Test error');
    };

    it('Should return a promise.', function(done) {
      whimp.task('someTask', {
        run: runFuncResolve
      });

      var promise = whimp.run('someTask');
      when.isPromiseLike(promise).should.be.true;

      done();
    });

    it('Should resolve a task from a promise.', function(done) {
      whimp.task('someTask', {
        run: runFuncResolve
      });

      var promise = whimp.run('someTask');
      promise.done(function() {
        promise.inspect().state.should.eql('fulfilled');

        done();
      });
    });

    it('Should reject a task from a promise.', function(done) {
      whimp.task('someTask', {
        run: runFuncReject
      });

      var promise = whimp.run('someTask');
      promise.done(function() {
        false.should.be.true;

        done();
      }, function() {
        promise.inspect().state.should.eql('rejected');

        done();
      });
    });

    it('Should resolve a task from a value.', function(done) {
      whimp.task('someTask', {
        run: runFuncValue
      });

      var promise = whimp.run('someTask');
      promise.done(function() {
        promise.inspect().state.should.eql('fulfilled');

        done();
      });
    });

    it('Should reject a task from a value.', function(done) {
      whimp.task('someTask', {
        run: runFuncValueReject
      });

      var promise = whimp.run('someTask');
      promise.done(function() {
        false.should.be.true;

        done();
      }, function() {
        promise.inspect().state.should.eql('rejected');
        
        done();
      });
    });
  }); //- run()

  // use()
  describe('use()', function() {
    it('Should execute a function.', function(done) {
      var f = function(params, resolver) {
        resolver.resolve();
      };

      var promise = whimp.use(f, {});
      when.isPromiseLike(promise).should.be.true

      promise.done(function() {
        promise.inspect().state.should.eql('fulfilled');
        done();
      }, function() {
        false.should.be.true;
        done();
      });
    });
  }); //- use()

  // config()
  describe('config()', function() {
    it('Should register a task configuration.', function(done) {
      done();
    });
  }); //- config()
}); //- describe()