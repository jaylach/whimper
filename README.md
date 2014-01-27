# whimper [![Build Status][travis-image]][travis-url]
A simple, unintrusive, task runner for node.js.

[travis-url]: https://travis-ci.org/jaylach/whimper
[travis-image]: https://travis-ci.org/jaylach/whimper.png?branch=master

# notes
Please note that whimper is currently in an alpha state. Tests need to be stronger, examples need to be made better, and it
it needs to gain some usage so the kinks can be ironed out. It's usable, for sure, just be sure to report any issues back 
here.. or, better yet, submit a patch!

# overview
whimper is, in reality, just a pretty api around managing and running JavaScirpt functions. It stays out of your way and 
lets you do what you do best: write code. It's simple yet eloquent. Compared to other task runners out there, it really
ends not with a bang, but a whimper.

whimper is ...
- lightweight and out of your way
- built on promises
- just JavaScirpt functions
- plugin free!
- not globally installed

### built on promises
whimper is built entirely on the use of promises. Every task takes in two arguments: `params` and `resolver`. The `params`
argument is an object describing any parameteres being passed to it. The `resolver` argument is a when.js [resolver](https://github.com/cujojs/when/blob/master/docs/api.md#deferred). It is
each task's responsibility to either return another promise or resolver/reject this resolver.  

### plugin free
That's right! Whey create yet another plugin system when all whimper does is call JavaScript functions anyways? So long as 
your function returns a promise (q, when, whatever) or resolves it's own promise, whimper doesn't care. Why get all fancy?

### not globally installed
Global installs stink. They make things stinky and whimper is not stinky. whimper, instead, let's you chose how you want to
run your tasks. If you want run your tasks from the command line, whimper gives you a way to do that. If you want to run 
them through code, you can do that too. You have power to decide and that's a wonderful thing.. at least we think so!

# installation
```
$ npm install whimper
```

# a simple example
```javascript
// tasks.js
var whimp = require('whimper');

whimp.task('simple-task', {
  run: function(params, resolver) {
    doSomethingAsync(function(error) {
      if ( error != null ) {
        resolver.reject(error);
      }
      else {
        resolver.resolve();
      }
    });
  }
});

whimp.run('simple-task');
```

and then ...
```
$ node tasks
```

### with cli support
replace `whimp.run('simple-task')` with `whimp.cli()`

and then ...
```
$ node tasks simple-task
```

# a complex example
```javascript
// TODO: Include a complex example.
```
