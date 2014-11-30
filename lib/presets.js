'use strict';

var path  = require('path');
var base  = __dirname;

exports.templates = {
  'default-svg':  path.join(base, '../templates/svg-symbols.svg'),
  'default-css':  path.join(base, '../templates/svg-symbols.css'),
  'default-demo': path.join(base, '../templates/svg-symbols-demo-page.html')
};

exports.tags = {
  default: [
    'style'
  ],
  common: [
    'style',
    'title',
    'desc'
  ],
  full: [
    'style',
    'title',
    'desc',
    'defs'
  ]
};

exports.attributes = {
  min: [
    'style'
  ],
  common: [
    'id',
    'style'
  ],
  full: [
    'id',
    'style',
    'fill*',
    'clip*',
    'stroke*'
  ]
};

// http://www.w3.org/TR/SVG/propidx.html
exports.expandedAttributes = {
  'clip*': [
    'clip',
    'clip-path',
    'clip-rule'
  ],
  'color*': [
    'color',
    'color-interpolation',
    'color-interpolation-filters',
    'color-profile',
    'color-rendering'
  ],
  'fill*': [
    'fill',
    'fill-opacity',
    'fill-rule'
  ],
  'font*': [
    'font',
    'font-family',
    'font-size',
    'font-size-adjust',
    'font-stretch',
    'font-style',
    'font-variant',
    'font-weight'
  ],
  'stroke*': [
    'stroke',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width'
  ]
};
