'use strict';

var toCssSize   = require('./utils').cssSize;
var formatText  = require('./utils').dynamicText;

module.exports = {
  dataTransform: function(svg, option) {
    return {
      id:           formatText(option.id, svg.name),
      className:    formatText(option.className, svg.name),
      title:        formatText(option.title, svg.name),
      width:        toCssSize(svg.width, option.fontSize),
      height:       toCssSize(svg.height, option.fontSize)
    };
  },
  templates: [
    'default-svg',
    'default-css'
  ],
  fontSize:   0,
  id:         '%f',
  className:  '.%f',
  title:      '%f icon',
};

