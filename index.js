'use strict';

var _                 = require('lodash');
var gutil             = require('gulp-util');
var GulpError         = gutil.PluginError;
var through           = require('through2');
var BPromise          = require('bluebird');

var parseOptions      = require('./lib/parse-options.js');
var gatherDataFromSvg = require('./lib/raw-svg-data.js');
var mergeDatas        = require('./lib/merge-datas.js');
var renderTemplates   = require('./lib/render-templates.js');

var PLUGIN_NAME       = 'gulp-svg-symbols';

var plugin = function (opts) {
  var buffer  = [];
  var options = parseOptions(opts);

  return through.obj(function transform(file, encoding, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new GulpError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    gatherDataFromSvg(file, options, function (result) {
      buffer.push(result);
      return cb(null);
    });

  }, function flush(cb) {
    var that = this;
    var svgData;
    var files;

    svgData = buffer.map(function (svgRawData) {
      return mergeDatas(svgRawData, options);
    });

    files = renderTemplates(options.templates, svgData);

    function outputFiles(files) {
      files.forEach(function (file) {
        that.push(file);
      });
      cb();
    }

    BPromise.all(files).then(outputFiles);

  });
};

// Generate a demo html page
plugin.demoPage = function (opts) {
  opts            = _.omit(opts, ['transformData']);
  opts.templates  = ['default-demo'];
  return plugin(opts);
};

module.exports = plugin;
