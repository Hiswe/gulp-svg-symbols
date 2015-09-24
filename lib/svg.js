'use strict';

var _               = require('lodash');
var path            = require('path');
var cheerio         = require('cheerio');
var slug            = require('slug');

var utils           = require('./utils');
var cheerioOptions  = {
  normalizeWhitespace: true,
  xmlMode: true
};

function parseFile(file, options, callback) {
  var $       = cheerio.load(file.contents.toString(), cheerioOptions);
  var $svg    = $('svg');
  var attr    = $svg[0].attribs;
  var viewBox = utils.viewboxToArray(attr.viewBox, file.path);

  var result  = {
    name:     slug(/(.*)\.svg/.exec(path.basename(file.path))[1]),
    viewBox:  viewBox.join(' '),
    originalAttributes: attr,
    // SVG files might not have size
    // https://github.com/Hiswe/gulp-svg-symbols/issues/10
    width:    utils.sizeOrViewboxFallback(attr.width, viewBox[2]),
    height:   utils.sizeOrViewboxFallback(attr.height, viewBox[3]),
  }

  // STYLE handling
  var $style      = $svg.find('style');
  if ($style.length) {
    result.style  = $style.html().trim();
    // don't format more than adding newlines after each rules end
    result.style  = result.style.replace(/}\s*(?!\n)/g, '}\n');
  };
  $style.remove();

  // DEFS handling
  var $defs      = $svg.find('defs');
  if ($defs.children().length) {
    result.defs  = $defs.html();
  }
  $defs.remove();

  // CONTENT
  // only optim is to remove empty group
  $svg.find('g').each(function () {
    if (!$(this).children().length) $(this).remove();
  });

  result.content = $svg.html();

  return callback(result);
};

module.exports = {
  parseFile: parseFile,
};
