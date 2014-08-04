'use strict';

var _             = require('lodash');
var math          = require('mathjs');
var path          = require('path');
var SVGO          = require('svgo');
var svg2js        = require('svgo/lib/svgo/svg2js');

function formatEm(px, baseFont) {
  var emSize = px / baseFont;
  math.round(emSize, 3);
  return emSize + 'em';
}

function addCssSize(result, options) {
  var unit = 'px';
  if (_.isNumber(options.fontSize) && options.fontSize > 0) {
    unit = 'em';
  }
  if (unit === 'px') {
    result.info.cssWidth   = result.info.width + 'px';
    result.info.cssHeight  = result.info.height + 'px';
  } else {
    result.info.cssWidth   = formatEm(result.info.width, options.fontSize);
    result.info.cssHeight  = formatEm(result.info.height, options.fontSize);
  }
  return result;
}

function addTitle(name, result, options) {
  var accessibility = options.accessibility;
  if (accessibility === false) {
    return result;
  }
  if (_.isFunction(accessibility)) {
    var customData =  accessibility(name);
    if (customData.title) {
      result.info.title = customData.title;
    }
    if (customData.description) {
      result.info.description = customData.description;
    }
    return result;
  }
  result.info.title = name + ' icon';
  return result;
}

module.exports = function formatSvgData(file, options, callback) {
  var svgo = new SVGO(options.svgoConfig);
  svgo.optimize(file.contents.toString(), function (result) {
    svg2js(result.data, function (svgjs) {
      var name = /(.*)\.svg/.exec(path.basename(file.path))[1];
      result.data           = result.data.replace(/^<svg[^>]+>|<\/svg>$/g, '');
      result.info.width     = math.number(result.info.width);
      result.info.height    = math.number(result.info.height);
      result.info.viewBox   = svgjs.content[0].attrs.viewBox.value;
      result.info.id        = options.svgId.replace('%f', name);
      result.info.className = options.className.replace('%f', name);
      result = addCssSize(result, options);
      result = addTitle(name, result, options);
      return callback(result);
    });
  });
};
