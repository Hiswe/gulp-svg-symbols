'use strict';

var math          = require('mathjs');
var path          = require('path');
var SVGO          = require('svgo');
var svg2js        = require('svgo/lib/svgo/svg2js');

module.exports = function getRawSvgData(file, options, callback) {
  var svgo        = new SVGO(options.svgoConfig);
  var getViewbox  = function getViewbox(result) {

    svg2js(result.data, function (svgjs) {

      var viewBox = svgjs.content[0].attrs.viewBox.value;
      viewBox     = viewBox.split(' ').map(function (value) {
        return math.number(value);
      });

      // SVG files might not have size
      // https://github.com/Hiswe/gulp-svg-symbols/issues/10
      result.info.width   = result.info.width   || viewBox[2];
      result.info.height  = result.info.height  || viewBox[3];

      return callback({
        content:  result.data.replace(/^<svg[^>]+>|<\/svg>$/g, ''),
        width:    math.number(result.info.width),
        height:   math.number(result.info.height),
        viewBox:  viewBox.join(' '),
        name:     /(.*)\.svg/.exec(path.basename(file.path))[1]
      });
    });

  };
  svgo.optimize(file.contents.toString(), getViewbox);
};
