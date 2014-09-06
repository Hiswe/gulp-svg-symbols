'use strict';

var math          = require('mathjs');
var path          = require('path');
var SVGO          = require('svgo');
var svg2js        = require('svgo/lib/svgo/svg2js');

module.exports = function getRawSvgData(file, options, callback) {
  var svgo        = new SVGO(options.svgoConfig);
  var getViewbox  = function getViewbox(result) {
    svg2js(result.data, function (svgjs) {
      return callback({
        content:  result.data.replace(/^<svg[^>]+>|<\/svg>$/g, ''),
        width:    math.number(result.info.width),
        height:   math.number(result.info.height),
        viewBox:  svgjs.content[0].attrs.viewBox.value,
        name:     /(.*)\.svg/.exec(path.basename(file.path))[1]
      });
    });
  };
  svgo.optimize(file.contents.toString(), getViewbox);
};
