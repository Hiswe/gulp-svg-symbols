'use strict';

var _             = require('lodash');
var path          = require('path');

// Format a size to px or em
function cssSize(size, fontSize) {
  var unit = 'px';
  if (_.isNumber(fontSize) && fontSize > 0) {
    unit = 'em';
  }
  if (unit === 'px') {
    return size + 'px';
  }
  return _.round(size / fontSize, 3) + 'em';
};

function dynamicText(template, name) {
  return template.replace('%f', name);
};

function viewboxToArray(viewbox) {
  return viewbox.split(' ').map(function (value) {
    return parseInt(value, 10);
  });
};

function sizeOrViewboxFallback(size, fallback) {
  if (_.isUndefined(size)) {
    return fallback;
  }
  return parseInt(size, 10);
};


module.exports = {
  cssSize:                cssSize,
  dynamicText:            dynamicText,
  viewboxToArray:         viewboxToArray,
  sizeOrViewboxFallback:  sizeOrViewboxFallback
};
