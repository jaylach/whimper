<p align="center">
  <img width="164" height="92" src="http://os.codegrit.com/images/whimper.png" />
</p>

# whimper [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]
A simple, unintrusive, task runner for node.js.

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
each task's responsibility to either return another promise or resolve/reject its resolver.  

### plugin free
That's right! Whey create yet another plugin system when all whimper does is call JavaScript functions anyways? So long as 
your function returns a promise (q, when, whatever) or resolves its own promise, whimper doesn't care. Why get all fancy?

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

### task structure
```javascript
whimp.task('task-name', {
  // Optional.
  describe: 'A description of this task',
  // Optional. Any task options. Used by CLI.
  options: {
    'foo': 'An optional option.',
    '!bar': 'A required option.'
  }, 
  // Conditional. An array of task names this task depends on. Either this or the 
  // run property is required.
  depends: [ 'a', 'b' ],
  // Conditional. What our task actually does. Either this or the depends property 
  // is required.
  run: function(params, resolver) {
    // Resolve yourself!
    // Or return a promise!
  }
});
```

A task can optionally be describe as just an array of dependencies. Great for composing
```javascript
whimp.task('task-name', [ 'a', 'b', 'c' ]);
```

# a complex example
You can find a slightly more, though not any less contrived, examples at [examples/complex.js](https://github.com/jaylach/whimper/blob/master/examples/complex.js). 
You can run this example by doing ...
```
$ node complex --dir test
```

# so, another task runner?
Does the node community really need yet another task runner? I believe that yes, yes we do. 
Why, you may ask? It's quite simple, I think. The task runners that exist today are either far too complicated (here's looking
at you, grunt), far too niche (gulp is really a build system, not a task runner), or just wheel reinvention. There were no
good (subjective, I know) task runners that allowed me to just run JavaScript. Everything required configuration, plugins,
global installs, and the like. I didn't want that. I wanted to run JavaScript and JavaScript alone. 

Hence, whimper was born.

[travis-url]: https://travis-ci.org/jaylach/whimper
[travis-image]: https://travis-ci.org/jaylach/whimper.png?branch=master
[npm-url]: https://npmjs.org/package/whimper
[npm-image]: https://badge.fury.io/js/whimper.png
