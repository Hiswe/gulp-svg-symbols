'use strict';

var path          = require('path');
var tmpl          = require('consolidate').lodash;
var utils         = require('./utils');
var BPromise      = require('bluebird');

var renderTemplate = function (template, svgData, defs, callback) {
  var name = path.basename(template);
  var renderDatas = {
    icons: svgData,
  };
  if (defs.length) renderDatas.defs = defs.join('\n');
  var svgContent = tmpl(template, renderDatas, function (err, result) {
    if (err) return callback(err, result);
    callback(null, utils.createFile(name, result));
  });
};

renderTemplate = BPromise.promisify(renderTemplate);

function renderTemplates(templates, svgData, defs) {
  return templates.map(function (template) {
    return renderTemplate(template, svgData, defs);
  });
};

module.exports = {
  renderAll:  renderTemplates,
  render:     renderTemplate,
};
