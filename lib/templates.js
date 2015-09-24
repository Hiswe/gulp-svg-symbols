'use strict';

var path          = require('path');
var tmpl          = require('consolidate').lodash;
var utils         = require('./utils');
var BPromise      = require('bluebird');

var render = function render(template, datas, callback) {
  var name = path.basename(template);
  var svgContent = tmpl(template, datas, function (err, result) {
    if (err) return callback(err, result);
    callback(null, utils.createFile(name, result));
  });
};

render = BPromise.promisify(render);

function renderAll(templates, datas) {
  return templates.map(function (template) {
    return render(template, datas);
  });
}

module.exports = {
  renderAll:  renderAll,
  render:     render,
};
