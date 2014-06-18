'use strict';

var path          = require('path');
var _tmpl         = require('consolidate').lodash;
var gutil         = require('gulp-util');
var File          = gutil.File;

var cssTplFile    = path.join(__dirname, '../templates/template.css');

module.exports = function(buffer, callback) {
  var svgContent = _tmpl(cssTplFile, {icons: buffer}, function (err, result){
    if (err) return callback(err, result);
    var file =  new File({
      cwd:  './',
      base: './',
      path: 'svg-symbols.css',
      contents: new Buffer(result)
    });
    callback(null, file);
  });
};
