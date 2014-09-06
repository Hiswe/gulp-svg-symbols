'use strict';

var _             = require('lodash');
var path          = require('path');
var gutil         = require('gulp-util');
var GulpError     = gutil.PluginError;
var through       = require('through2');
var BPromise       = require('bluebird');
var _tmpl         = require('consolidate').lodash;
var File          = gutil.File;

var PLUGIN_NAME   = 'gulp-svg-symbols';

var buffer        = [];
var defaults      = require('./lib/default-config');
var options       = {};
var formatSvgData = require('./lib/format-svg-data');
var toSvgFile     = BPromise.promisify(require('./lib/svg-data-to-svg-file'));
var toCssFile     = BPromise.promisify(require('./lib/svg-data-to-css-file'));

function transform(file, encoding, cb) {
  if (file.isNull()) {
    this.push(file);
    return cb();
  }

  if (file.isStream()) {
    this.emit('error', new GulpError(PLUGIN_NAME, 'Streaming not supported'));
    return cb();
  }

  formatSvgData(file, options, function (result) {
    buffer.push(result);
    return cb(null);
  });
}

function flush(cb) {
  var that  = this;
  var files = [];
  buffer.map(function (svgRawData) {
    var result = options.dataTransform;
  });
  files.push(toSvgFile(buffer));
  // Optional CSS file
  // https://github.com/Hiswe/gulp-svg-symbols/issues/3
  if (options.css === true) {
    files.push(toCssFile(buffer));
  }
  BPromise.all(files).then(function (files) {
    files.forEach(function (file) {
      that.push(file);
    });
    cb();
  });
}

// Greatly inspired by https://www.npmjs.org/package/gulp-svg-sprites
var plugin = function (opts) {
  // flush the buffer
  // https://github.com/Hiswe/gulp-svg-symbols/issues/2
  buffer  = [];
  // merge options
  options = _.defaults(opts || {}, defaults);
  return through.obj(transform, flush);
};

// TODO move this to lib
// Generate a demo html page
// plugin.demoPage = function (opts) {
//   buffer = [];
//   options = _.defaults(opts || {}, defaults);
//   return through.obj(transform, function (cb) {
//     var that          = this;
//     var files         = [toSvgFile(buffer), toCssFile(buffer)];
//     var demoTemplate  = path.join(__dirname, './templates/demo.html');

//     var allFilesDone  = function allFilesDone(files) {
//       var datas = {icons: buffer, files: files};
//       _tmpl(demoTemplate, datas, function (err, result) {
//         if (err) return cb(err, result);
//         var file =  new File({
//           cwd:  './',
//           base: './',
//           path: 'svg-symbols-demo-page.html',
//           contents: new Buffer(result)
//         });
//         that.push(file);
//         cb();
//       });
//     };

//     BPromise.all(files).then(allFilesDone);
//   });
// };

module.exports = plugin;
