'use strict';

module.exports = {
  svgId:          '%f',
  className:      '.%f',
  fontSize:       0,
  accessibility:  function (name) { return {title: name + ' icon'}; },
  css:            true
};