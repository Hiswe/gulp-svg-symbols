'use strict';

var formatText  = require('./utils').dynamicText;
var toCssSize   = require('./utils').cssSize;

module.exports = function (svg, options) {
  var defaultData = {
    id:         formatText(options.id, svg.name),
    className:  formatText(options.className, svg.name),
    width:      toCssSize(svg.width, options.fontSize),
    height:     toCssSize(svg.height, options.fontSize)
  };

  if (options.title !== false) {
    defaultData.title = formatText(options.title, svg.name);
  }

  return defaultData;
};
