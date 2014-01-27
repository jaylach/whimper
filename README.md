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
- plugin free! (more below)
- not globally installed (more below)

### plugin free?
That's right! Whey create yet another plugin system when all whimper does is call JavaScript functions anyways? So long as 
your function returns a promise (q, when, whatever) or resolves it's own promise, whimper doesn't care. Why get all fancy?

### not globally installed?
Global installs sucks. They make things sucky and whimper is not sucky. whimper, instead, let's you chose how you want to
run your tasks. If you want run your tasks from the command line, whimper gives you a way to do that. If you want to run 
them through code, you can do that to. You have power to decide and that's a wonderful thing.. at least we think so!

# a simple task
```javascript
var whimp = require('whimper');

whimp.task('simple-task', {
  run: function(params, resolver) {
    // Gotta make sure I resolve myself
    resolver.resolve();
  }
});
```

