'use strict';

var _       = require('lodash');
var slug    = require('slug');
var path    = require('path');
var cheerio = require('cheerio');

var utils   = require('./utils');

//
// GATHER ELEMENTARY INFORMATIONS ABOUT THE SVG FILE
//

function parseFile(file, options, callback) {
  var $       = cheerio.load(file.contents.toString(), {
    normalizeWhitespace: true,
    xmlMode: true
  });
  var $svg    = $('svg');
  var attr    = $svg[0].attribs;
  var viewBox = utils.viewboxToArray(attr.viewBox, file.path, options);
  var name    = /(.*)\.svg/.exec(path.basename(file.path))[1];

  var result  = {
    name:               name,
    viewBox:            viewBox.join(' '),
    originalAttributes: attr,
    // Slug id because I don't like spaces in IDs or Classes XD
    id:                 slug(name),
    // SVG files might not have size
    // https://github.com/Hiswe/gulp-svg-symbols/issues/10
    width:    utils.sizeOrViewboxFallback(attr.width, viewBox[2]),
    height:   utils.sizeOrViewboxFallback(attr.height, viewBox[3]),
  };

  // STYLE handling
  var $style      = $svg.find('style');
  if ($style.length) {
    result.style  = $style.html().trim();
    // don't format more than adding newlines after each rules end
    result.style  = result.style.replace(/}\s*(?!\n)/g, '}\n');
  }
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
}

//
// MODIFY DATAS BEFORE GIVING IT TO TEMPLATES
//

function formatForTemplate(svgRawData, options) {
  var result        = {};
  // this can be overrided by user transformData function
  var tmplDatas     = {
    id:         utils.dynamicText(options.id, svgRawData.id),
    className:  utils.dynamicText(options.className, svgRawData.id),
    width:      utils.cssSize(svgRawData.width, options.fontSize),
    height:     utils.cssSize(svgRawData.height, options.fontSize),
  };
  // It should be handled by a custom template or custom transformData
  if (options.title !== false && !/<title>/.test(svgRawData.content)) {
    tmplDatas.title = utils.dynamicText(options.title, svgRawData.name);
  }

  // Styles coming from <style /> are kept ine the SVG file
  // we don't take care of duplicated styles or anything else
  if (svgRawData.style) tmplDatas.style = svgRawData.style;

  // Apply TransformData option
  // no need to be able to call transformData inside transformData %)
  result      = options.transformData(svgRawData, tmplDatas, _.omit(options, [
    'transformData',
    'templates'
  ]));
  // Always keep a reference of the original datas
  result.svg  = svgRawData;

  return result;
}

module.exports = {
  parseFile:          parseFile,
  formatForTemplate:  formatForTemplate,
};
