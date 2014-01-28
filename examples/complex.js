var fs = require('fs');
var _ = require('lodash');

var whimp = require('../whimper');
var logger = require('../logger');

// create-dir()
whimp.task('create-dir', {
  run: function createDir(params, resolver) {
    // Contrived to show "async"
    setTimeout(function() {
      fs.mkdir(params.dir, function(e) {
        if ( e != null ) {
          resolver.reject(e);
        }
        else {
          resolver.resolve();
        }
      });
    }, 1005);
  }
}); //- create-dir()

// delete-dir()
whimp.task('delete-dir', {
  depends: [ 'create-dir' ],
  run: function deleteDir(params, resolver) {
    fs.rmdir(params.dir, function(e) {
      if ( e != null ) {
        resolver.reject(e);
      }
      else {
        resolver.resolve();
      }
    });
  }
}); //- delete-dir()

// default()
whimp.task('default', {
  options: {
    '!dir': 'The directory to create and then delete.'
  },
  depends: [ 'delete-dir' ]
}); //- default()

whimp.cli();

// $ node complex --dir test