'use strict';

var _                 = require('lodash');
var path              = require('path');
var gutil             = require('gulp-util');
var GulpError         = gutil.PluginError;
var through           = require('through2');
var BPromise          = require('bluebird');

var defaults          = require('./lib/default-config');
var svg  				      = require('./lib/svg');
var templates         = require('./lib/templates.js');
var utils             = require('./lib/utils.js');

var PLUGIN_NAME       = utils.name;
var templatesPath 	  = {
  'default-svg':  path.join(__dirname, './templates/svg-symbols.svg'),
  'default-css':  path.join(__dirname, './templates/svg-symbols.css'),
  'default-demo': path.join(__dirname, './templates/svg-symbols-demo-page.html')
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

  // buffer and transform every files
  return through.obj(function transform(file, encoding, cb) {

    if (file.isNull()) {
      return cb(null, file);
    }

    // we don't handle streams :,(
    // use https://github.com/nfroidure/gulp-streamify if you're reading this
    // next versions should use https://www.npmjs.com/package/bufferstreams
    if (file.isStream()) {
      this.emit('error', new GulpError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    svg.parseFile(file, options, function (result) {
      buffer.push(result);
      return cb(null);
    });

  // put all generated files back in the stream
  }, function flush(cb) {
    var that = this;

    var svgData = buffer.map(function (svgRawData) {
      // defs are not at an SVG level
      // they should be handled globally to the new SVG file
      if (svgRawData.defs) defs.push(svgRawData.defs);
      delete svgRawData.defs;
      //
      return svg.formatForTemplate(svgRawData, options);
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
