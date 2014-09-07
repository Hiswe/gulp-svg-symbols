'use strict';

var path          = require('path');
var _tmpl         = require('consolidate').lodash;
var gutil         = require('gulp-util');
var File          = gutil.File;
var BPromise      = require('bluebird');

var renderTemplate = function (svgData, template, callback) {
  var name = path.basename(template);
  var svgContent = _tmpl(template, {icons: svgData}, function (err, result) {
    if (err) return callback(err, result);
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

module.exports = function(svgData, templates) {
  return templates.map(function (template) {
    return renderTemplate(svgData, template);
  });
};
