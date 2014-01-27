'use strict';

var should = require('should');
var _ = require('lodash');

var Task = require('../lib/Task');
var orderTasks = require('../lib/orderTasks');

require('mocha');

// -----
//  Tests
// -----

// describe()
describe('orderTasks()', function() {
  it('Should build proper dependency list.', function(done) {
    var tasks = {
      a: new Task({ name: 'a', depends: [ 'b', 'c' ] }),
      b: new Task({ name: 'b', depends: [ 'd' ] }),
      c: new Task({ name: 'c' }),
      d: new Task({ name: 'd' })
    };

    var concurrentExpectd = [ 'd', 'c' ];
    var sequencedExpected = [ 'b', 'a' ];

    var results = [[], []];
    orderTasks(tasks, [ 'a' ], results);

    // Let's just strip our names out, makes it easier for testing.
    var concurrent = _.map(results[0], function(t) {
      return t.name;
    });
    var sequenced = _.map(results[1], function(t) {
      return t.name;
    });

    concurrent.should.eql(concurrentExpectd);
    sequenced.should.eql(sequencedExpected);
    
    done();
  });
}); //- describe()