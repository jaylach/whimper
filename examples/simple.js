var whimp = require('../whimper');
var logger = require('../logger');

// useme()
var useme = function useme(params, resolver) {
  console.log('in use');
  setTimeout(function() {
    resolver.reject('not okay');
  }, 1000);
}; //- useme()

whimp.task('a', { 
  run: function(params, resolver) {
    return true;
  } 
});

whimp.task('b', {
  run: function(params, resolver) {
    return whimp.use(useme, params);
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

whimp.task('simple', {
  depends: [ 'c', 'a' ],
  describe: 'A very simple task for testing.',
  options: {
    '!key': 'Some required option.',
    'value': 'Some optional value.'
  },
  run: function(params, resolver) {
    logger.write('simple', 'got key=' + params.key);
    return whimp.run('b');
  }
});

whimp.cli();