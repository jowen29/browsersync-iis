
browsersync-iis
===============

IIS middleware for browser-sync


```
var iis = require('browsersync-iis');

browserSync({
  server: {
    baseDir: ['app'],

    middleware: iis({
      baseDir: __dirname + '/app',
      ext: '.shtml',
      version: '1.0.0'
    })
  },
});
```