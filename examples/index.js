var whimp = require('../whimper');

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
whimp.task('f', { run: function() {} });

//whimp.task('test', [ 'a', 'b', 'f', 'c' ]);

whimp.task('test', {
  depends: [ 'a' ],
  run: function(params, resolver) {
    return whimp.run('b');
  }
});

whimp.run('test');