'use strict';

var _ = require('lodash');

module.exports = function mergeDatas(svgRawData, options) {
  var transform     = options.dataTransform;
  var result        = {};
  var lightOptions  = _.omit(options, ['dataTransform', 'templates']);
  result            = options.dataTransform(svgRawData, lightOptions);
  result.svg        = svgRawData;
  return result;
};