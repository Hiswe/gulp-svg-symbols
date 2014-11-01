'use strict';

var _         = require('lodash');
var path      = require('path');
var gutil     = require('gulp-util');

var defaults  = require('./default-config');
var presets   = require('./presets');

function mergePresets(domain, entry) {
  if (!_.isString(entry)) {
    return entry;
  }
  if (_.has(presets[domain], entry)) {
    return presets[domain][entry];
  }
  return entry;
}

function expandAttributes(attributes) {
  if (!_.isArray(attributes) || !attributes.length) {
    return attributes;
  }
  var expanded = [];

  attributes.forEach(function (attribute) {
    if (_.has(presets.expandedAttributes, attribute)) {
      expanded = _.union(expanded, presets.expandedAttributes[attribute]);
    } else {
      expanded = _.union(expanded, [attribute]);
    }
  });
  return expanded;
}

module.exports = function (opts) {
  opts        = opts || {};
  // clone everything as we don't want to mutate anything
  var options = _.defaults(_.cloneDeep(opts), _.cloneDeep(defaults));

  options.templates = options.templates.map(function (template) {
    return mergePresets('templates', template);
  });

  options.removeTags        = mergePresets('tags', options.removeTags);

  options.removeAttributes  = mergePresets('attributes', options.removeAttributes);
  options.removeAttributes  = expandAttributes(options.removeAttributes);

  return options;
};
