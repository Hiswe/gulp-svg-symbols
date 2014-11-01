'use strict';

var _               = require('lodash');
var getDefaultData  = require('./get-default-data.js');

module.exports = function mergeDatas(svgRawData, options) {
  var result        = {};
  var lightOptions  = _.omit(options, ['transformData', 'templates']);
  var defaultData   = getDefaultData(svgRawData, options);

  result      = options.transformData(svgRawData, defaultData, lightOptions);
  result.svg  = svgRawData;

  return result;
};
