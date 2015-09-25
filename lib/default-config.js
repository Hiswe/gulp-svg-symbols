'use strict';

module.exports = {
  id:         '%f',
  className:  '.%f',
  fontSize:   0,
  warn:       true,
  title:      false,
  templates: [
    'default-svg',
    'default-css'
  ],
  transformData: function (svg, defaultData, options) {
    return defaultData;
  }
};
