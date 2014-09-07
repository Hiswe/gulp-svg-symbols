'use strict';

var toCssSize   = require('./utils').cssSize;
var formatText  = require('./utils').dynamicText;

module.exports = {
  id:         '%f',
  className:  '.%f',
  fontSize:   0,
  css:        true,
  title:      '%f icon',
  templates: [
    'default-svg',
    'default-css'
  ],
  transformData: function(svg, options) {
    return {
      id:           formatText(options.id, svg.name),
      className:    formatText(options.className, svg.name),
      title:        formatText(options.title, svg.name),
      width:        toCssSize(svg.width, options.fontSize),
      height:       toCssSize(svg.height, options.fontSize)
    };
  },
  svgoConfig: {}
};
