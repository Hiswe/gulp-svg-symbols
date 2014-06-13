'use strict';

var _             = require('lodash');
var gutil         = require('gulp-util');
var through       = require('through2');

var PLUGIN_NAME   = "gulp-svg-symbol";

var buffer        = [];
var defaults      = require('./lib/default-config');
var options       = {};
var formatSvgData = require('./lib/format-svg-data');
var toSvgFile     = require('./lib/svg-data-to-svg-file');
var toCssFile     = require('./lib/svg-data-to-css-file');

function transform(file, encoding, cb) {
  if (file.isNull()) {
    this.push(file);
    return cb();
  }

  if (file.isStream()) {
    this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    return cb();
  }

  formatSvgData(file, options,function (result) {
    buffer.push(result)
    return cb(null);
  });
}

function flush(cb) {
  var that = this;
  toSvgFile(buffer, function (err, result){
    that.push(result);
  });
  toCssFile(buffer, function (err, result){
    that.push(result);
    cb();
  });
}

// Greatly inspired by https://www.npmjs.org/package/gulp-svg-sprites
module.exports = function (opts) {
  options = _.merge(_.cloneDeep(defaults), opts || {});
  return through.obj(transform, flush);
};
