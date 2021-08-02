module.exports = function browserSyncSSI(opt) {

  'use strict';

  var gulpiis = require('gulp-iis');
  var path = require('path');
  var fs = require('fs');
  var url = require('url');

  var opt = opt || {};
  var ext = opt.ext || '.shtml';
  var defaultFile = opt.defaultFile || ['default', 'index'];
  var baseDir = opt.baseDir || __dirname;
  var matcher = '/**/*' + ext;
  var version = opt.version || '';
  var bsURL;

  if (version === '') {
    bsURL = '/browser-sync/browser-sync-client.js';
  }
  else {
      if (version >= '1.0.0') {
        bsURL = '/browser-sync/browser-sync-client.' + version + '.js';
      }
      else {
        bsURL = '/browser-sync-client.' + version + '.js';
      }
  }

  var parser = new gulpiis(baseDir, baseDir, matcher);

  return function(req, res, next) {

    var pathname = url.parse(req.originalUrl || req.url).pathname,
        filename;
    //var filename = path.join(baseDir, pathname.substr(-1) === '/' ? pathname + defaultFile + ext : pathname);

    var exist = false;
    for (let i = 0; i < defaultFile.length; i++) {
      filename = path.join(baseDir, pathname.substr(-1) === '/' ? pathname + defaultFile[i] + ext : pathname);
      if (filename.indexOf(ext) > -1 && fs.existsSync(filename)) {
        exist = true;
        break;
      }
    }

    if (exist) {

      var contents = parser.parse(filename, fs.readFileSync(filename, {
        encoding: 'utf8'
      })).contents;

      //TODO inject more elegant using regexp
      contents = contents.replace(/<\/head>/, '<script async src="' + bsURL + '"></script></head>');

      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(contents);

    } else {
      next();
    }

  };
};
