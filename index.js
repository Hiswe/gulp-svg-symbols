'use strict';

var _             = require('lodash');
var gutil         = require('gulp-util');
var through       = require('through2');
var Promise       = require('bluebird');

var PLUGIN_NAME   = 'gulp-svg-symbols';

var buffer        = [];
var defaults      = require('./lib/default-config');
var options       = {};
var formatSvgData = require('./lib/format-svg-data');
var toSvgFile     = Promise.promisify(require('./lib/svg-data-to-svg-file'));
var toCssFile     = Promise.promisify(require('./lib/svg-data-to-css-file'));

function transform(file, encoding, cb) {
  if (file.isNull()) {
    this.push(file);
    return cb();
  }

  if (file.isStream()) {
    this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    return cb();
  }

  formatSvgData(file, options, function (result) {
    buffer.push(result)
    return cb(null);
  });
}

function flush(cb) {
  var that  = this;
  var files = [];
  files.push(toSvgFile(buffer));
  files.push(toCssFile(buffer));
  Promise.all(files).then(function (files) {
    files.forEach(function (file) {
      that.push(file);
    });
    cb();
  });
}

// Greatly inspired by https://www.npmjs.org/package/gulp-svg-sprites
module.exports = function (opts) {
  // flush the buffer
  // https://github.com/Hiswe/gulp-svg-symbols/issues/2
  buffer  = [];
  // merge options
  options = _.merge(_.cloneDeep(defaults), opts || {});
  return through.obj(transform, flush);
};
