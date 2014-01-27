var whimp = require('../whimper');
var logger = require('../logger');

whimp.task('a', { 
  run: function(params, resolver) {
    setTimeout(function() {
      resolver.resolve('Some good');
    }, 1000);
  } 
});

whimp.task('b', {
  run: function(params, resolver) {
    setTimeout(function(){
      resolver.reject('I suck.');
    }, 2500);
  }
})

whimp.task('c', [ 'd' ]);
whimp.task('d', [ 'e' ]);
whimp.task('e', [ 'a' ]);
whimp.task('f', { 
  run: function(params, resolver) {
    resolver.resolve();
  } 
});

//whimp.task('test', [ 'a', 'b', 'f', 'c' ]);

whimp.task('test', {
  depends: [ 'c', 'a' ],
  describe: 'A very simple task for testing.',
  options: {
    '!key': 'Some required option.',
    'value': 'Some optional value.'
  },
  run: function(params, resolver) {
    logger.write('test', 'got key=' + params.key);
    return whimp.run('b');
  }
});

whimp.cli();