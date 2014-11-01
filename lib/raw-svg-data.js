'use strict';

var _               = require('lodash');
var math            = require('mathjs');
var path            = require('path');
var cheerio         = require('cheerio');

var u               = require('./utils');
var cleanSvg        = require('./clean-svg');
var cheerioOptions  = {
  normalizeWhitespace: true,
  xmlMode: true
};

function isTransform(option) {
  return _.isArray(option) && option.length;
}

module.exports = function getRawSvgData(file, options, callback) {
  var $       = cheerio.load(file.contents.toString(), cheerioOptions);
  // Apply some basic transformations
  if (isTransform(options.transformSvg)) {
    options.transformSvg.forEach(function (transform) {
      // User custom optimization
      if (_.isFunction(transform)) {
        $ = transform($);
      }
      // Build in optimizations
      if (_.isString(transform) && _.isFunction(cleanSvg[transform])) {
        $ = cleanSvg[transform]($);
      }
    });
  }

  // Cleanup tag attributes
  if (isTransform(options.removeAttributes)) {
    $ = cleanSvg.removeAttributes($, options.removeAttributes);
  }

  // Cleanup tag attributes
  if (isTransform(options.removeTags)) {
    $ = cleanSvg.removeTags($, options.removeTags);
  }

  var $svg    = $('svg');
  var attr    = $svg[0].attribs;
  var name    = /(.*)\.svg/.exec(path.basename(file.path))[1];
  var viewBox = u.viewboxToArray(attr.viewBox);
  var content = $svg.html();
  // SVG files might not have size
  // https://github.com/Hiswe/gulp-svg-symbols/issues/10
  var width   = u.sizeOrViewboxFallback(attr.width, viewBox[2]);
  var height  = u.sizeOrViewboxFallback(attr.height, viewBox[3]);

  return callback({
    name:               name,
    content:            content,
    originalAttributes: attr,
    viewBox:            viewBox.join(' '),
    width:              width,
    height:             height
  });
};
