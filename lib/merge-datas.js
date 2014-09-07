'use strict';

var _ = require('lodash');

module.exports = function mergeDatas(svgRawData, options) {
  var transform     = options.transformData;
  var result        = {};
  var lightOptions  = _.omit(options, ['transformData', 'templates']);
  result            = options.transformData(svgRawData, lightOptions);
  result.svg        = svgRawData;
  return result;
};