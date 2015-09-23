'use strict';

var _               = require('lodash');
var path            = require('path');
var cheerio         = require('cheerio');

var utils           = require('./utils');
var cheerioOptions  = {
  normalizeWhitespace: true,
  xmlMode: true
};

module.exports = function getRawSvgData(file, options, callback) {
  var $       = cheerio.load(file.contents.toString(), cheerioOptions);
  var $svg    = $('svg');
  var attr    = $svg[0].attribs;
  var name    = /(.*)\.svg/.exec(path.basename(file.path))[1];
  var viewBox = utils.viewboxToArray(attr.viewBox);
  var content = $svg.html();
  // SVG files might not have size
  // https://github.com/Hiswe/gulp-svg-symbols/issues/10
  var width   = utils.sizeOrViewboxFallback(attr.width, viewBox[2]);
  var height  = utils.sizeOrViewboxFallback(attr.height, viewBox[3]);
  return callback({
    name:               name,
    content:            content,
    originalAttributes: attr,
    viewBox:            viewBox.join(' '),
    width:              width,
    height:             height
  });
};
