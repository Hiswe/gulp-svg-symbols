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
var templates         = require('./lib/templates.js');
var utils             = require('./lib/utils.js');

var PLUGIN_NAME       = utils.name;
var BASE              = __dirname;
var templatesPath 	  = {
  'default-svg':  path.join(BASE, './templates/svg-symbols.svg'),
  'default-css':  path.join(BASE, './templates/svg-symbols.css'),
  'default-demo': path.join(BASE, './templates/svg-symbols-demo-page.html')
};

var plugin = function (opts) {
  opts = opts || {};
  var buffer  = [];
  var defs    = [];
  // clone everything as we don't want to mutate anything
  var options = _.defaults(_.cloneDeep(opts), _.cloneDeep(defaults));

  // expand path to default templates
  options.templates = options.templates.map(function(pathName) {
  	if (pathName in templatesPath) return templatesPath[pathName];
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
      buffer.push(result);
      return cb(null);
    });

  }, function flush(cb) {
    var that = this;

    var svgData = buffer.map(function (svgRawData) {
      if (svgRawData.defs) defs.push(svgRawData.defs);
      delete svgRawData.defs;
      return mergeDatas(svgRawData, options);
    });

    var files = templates.renderAll(options.templates, svgData, defs);

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

plugin.pluginName = PLUGIN_NAME;

module.exports = plugin;
