'use strict';

var _             = require('lodash');
var gutil         = require('gulp-util');
var GulpError     = gutil.PluginError;
var through       = require('through2');
var BPromise      = require('bluebird');

var parseOptions      = require('./lib/parse-options.js');
var gatherDataFromSvg = require('./lib/raw-svg-data.js');
var mergeDatas        = require('./lib/merge-datas.js');
var renderTemplates   = require('./lib/render-templates.js');

var PLUGIN_NAME       = 'gulp-svg-symbols';
var buffer            = [];
var options           = {};

function transform(file, encoding, cb) {
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
}

function flush(cb) {
  var that  = this;
  var svgData;
  var files;

  // Add custom datas
  svgData = buffer.map(function (svgRawData) {
    return mergeDatas(svgRawData, options);
  });

  // Render all templates
  files = renderTemplates(svgData, options.templates);

  function outputFiles(files) {
    files.forEach(function (file) {
      that.push(file);
    });
    cb();
  }

  BPromise.all(files).then(outputFiles);
}

var plugin = function (opts) {
  // flush the buffer
  // https://github.com/Hiswe/gulp-svg-symbols/issues/2
  buffer  = [];

  options = parseOptions(opts);

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
