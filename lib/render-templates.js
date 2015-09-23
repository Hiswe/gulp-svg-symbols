'use strict';

var path          = require('path');
var tmpl          = require('consolidate').lodash;
var gutil         = require('gulp-util');
var File          = gutil.File;
var BPromise      = require('bluebird');

var renderTemplate = function (template, svgData, callback) {
  var name = path.basename(template);
  var svgContent = tmpl(template, {icons: svgData}, function (err, result) {
    if (err) { return callback(err, result); }
    var file =  new File({
      cwd:  './',
      base: './',
      path: name,
      contents: new Buffer(result)
    });
    callback(null, file);
  });
};

renderTemplate = BPromise.promisify(renderTemplate);

var renderTemplates = function (templates, svgData) {
  return templates.map(function (template) {
    return renderTemplate(template, svgData);
  });
};

// for test purpose
renderTemplates.render = renderTemplate;

module.exports = renderTemplates;
