'use strict';

var _         = require('lodash');
var path      = require('path');
var gutil     = require('gulp-util');

var defaults  = require('./default-config');
var svgTmpl   = path.join(__dirname, '../templates/svg-symbols.svg');
var cssTmpl   = path.join(__dirname, '../templates/svg-symbols.css');
var demoTmpl  = path.join(__dirname, '../templates/svg-symbols-demo-page.html');

function handleDefaultTemplates(template) {
  switch (template) {
      case 'default-svg':
        template = svgTmpl;
        break;
      case 'default-css':
        template = cssTmpl;
        break;
      case 'default-demo':
        template = demoTmpl;
        break;
    }
    return template;
}

module.exports = function (opts) {
  opts        = opts || {};
  var options = _.defaults(_.cloneDeep(opts), defaults);

  // Optional CSS file
  // https://github.com/Hiswe/gulp-svg-symbols/issues/3
  if (_.isUndefined(opts.templates) && options.css === false) {
    options.templates.pop();
    // Deprecated in favor of { templates: ['svg-default']}
    gutil.log('css option is deprecated');
    gutil.log('please specify option templates to:  [\'svg-default\']');
  }

  options.templates = options.templates.map(handleDefaultTemplates);

  return options;
};
