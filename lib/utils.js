'use strict';

var _             = require('lodash');
var math          = require('mathjs');
var path          = require('path');
var SVGO          = require('svgo');
var svg2js        = require('svgo/lib/svgo/svg2js');

// Format a size to px or em
exports.cssSize = function (size, fontSize) {
  var unit = 'px';
  if (_.isNumber(fontSize) && fontSize > 0) {
    unit = 'em';
  }
  if (unit === 'px') {
    return size + 'px';
  }
  return math.round(size / fontSize, 3) + 'em';
};

exports.dynamicText = function(template, name) {
  return template.replace('%f', name);
};
