'use strict';

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
  transformData: function(svg, defaultData, options) {
    return defaultData;
  },
  svgoConfig: {}
};
