'use strict';

module.exports = {
  // attributes that will be be pushed in the SVG root node
  svgAttrs:     {
    // class that will be added in default template root SVG (deprecated)
    classname:  null,
    xmlns:      `http://www.w3.org/2000/svg`,
  },
  // this will be used for generating SVG id and associated class names
  id:         `%f`,
  className:  `.%f`,
  // Determine size in CSS (em/px)
  fontSize:   0,
  // debug log
  warn:       true,
  // accessibility title
  title:      false,
  // templates to render
  templates: [
    `default-svg`,
    `default-css`,
  ],
  // slug params or custom function
  slug: {},
  // datas passed to templates while rendering
  transformData: function (svg, defaultData, options) {
    return defaultData;
  },
};
