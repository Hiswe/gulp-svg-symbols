var path          = require('path');
var _tmpl         = require('consolidate').lodash
var gutil         = require('gulp-util');
var File          = gutil.File;

var svgTplFile    = path.join(__dirname, '../templates/template.svg');

module.exports = function(buffer, callback) {
  var svgContent = _tmpl(svgTplFile, {icons: buffer}, function (err, result){
    if (err) return callback(err, result);
    var file =  new File({
      cwd:  './',
      base: './',
      path: 'svg-symbols.svg',
      contents: new Buffer(result)
    });
    callback(null, file);
  });
}
