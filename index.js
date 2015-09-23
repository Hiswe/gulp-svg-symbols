'use strict';

var _                 = require('lodash');
var path              = require('path');
var gutil             = require('gulp-util');
var GulpError         = gutil.PluginError;
var through           = require('through2');
var BPromise          = require('bluebird');

var defaults          = require('./lib/default-config');
var svg  				      = require('./lib/svg');
var mergeDatas        = require('./lib/merge-datas.js');
var renderTemplates   = require('./lib/render-templates.js');

var PLUGIN_NAME       = 'gulp-svg-symbols';
var BASE              = __dirname;
var templates 				= {
  'default-svg':  path.join(BASE, './templates/svg-symbols.svg'),
  'default-css':  path.join(BASE, './templates/svg-symbols.css'),
  'default-demo': path.join(BASE, './templates/svg-symbols-demo-page.html')
};

var plugin = function (opts) {
  opts = opts || {};
  var buffer  = [];
  var style   = [];
  // clone everything as we don't want to mutate anything
  var options = _.defaults(_.cloneDeep(opts), _.cloneDeep(defaults));

  // expand path to default templates
  options.templates = options.templates.map(function(pathName) {
  	if (pathName in templates) return templates[pathName];
  	return pathname;
  });

  return through.obj(function transform(file, encoding, cb) {

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new GulpError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    svg.parseFile(file, options, function (result) {
      if (result.style) style.push(result.style);
      delete result.style;
      buffer.push(result);
      return cb(null);
    });

  }, function flush(cb) {
    var that = this;

    var svgData = buffer.map(function (svgRawData) {
      return mergeDatas(svgRawData, options);
    });

    var files = renderTemplates(options.templates, svgData);

    function outputFiles(files) {
      files.forEach(function (file) { that.push(file); });
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
