'use strict';

var path          = require('path');
var SVGO          = require('svgo');
var svgo          = new SVGO();


function addCssSize(result, options) {
  var unit = (typeof options.fontSize === 'number' && options.fontSize > 0) ? 'em' : 'px';
  if (unit === 'px') {
    result.info.cssWidth     = result.info.width + 'px';
    result.info.cssHeight    = result.info.height + 'px';
  } else {
    result.info.cssWidth     = formatEm(result.info.width, options.fontSize);
    result.info.cssHeight    = formatEm(result.info.height, options.fontSize);
  }
  return result;
}

function formatEm(px, baseFont) {
  px = px / baseFont;
  parseFloat(Math.round(px * 1000) / 1000).toFixed(3)
  return px + 'em';
}

module.exports = function formatSvgData(file, options, callback) {
  svgo.optimize(file.contents.toString(), function (result) {
    result.data           = result.data.replace(/^<svg[^>]+>|<\/svg>$/g, "");
    result.info.width     = ~~result.info.width;
    result.info.height    = ~~result.info.height;
    result.info.name      = /(.*)\.svg/.exec(path.basename(file.path))[1];
    result.info.id        = options.svgId.replace("%f", result.info.name);
    result.info.className = options.className.replace("%f", result.info.name);
    return callback(addCssSize(result, options));
  });
}