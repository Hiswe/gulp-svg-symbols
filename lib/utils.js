'use strict';

const _           = require(`lodash`);
const path        = require(`path`);
const gutil       = require(`gulp-util`);
const PluginError = require(`plugin-error`);
const log         = require(`fancy-log`);
const warn        = require(`ansi-yellow`);
const grey        = require(`ansi-grey`);
const Vinyl       = require(`vinyl`);
const PLUGIN_NAME = `gulp-svg-symbols`;

// Format a size to px or em
function cssSize(size, fontSize) {
  var unit = `px`;
  if (_.isNumber(fontSize) && fontSize > 0) {
    unit = `em`;
  }
  if (unit === `px`) {
    return size + `px`;
  }
  return _.round(size / fontSize, 3) + `em`;
}

function dynamicText(template, name) {
  return template.replace(`%f`, name);
}

function viewboxToArray(viewbox, name, options) {
  if (_.isUndefined(viewbox)) {
    if (options.warn) {
      log(warn(PLUGIN_NAME), grey(`viewbox missing in file`), name);
    }
    return [0, 0, 100, 100];
  }

  return viewbox.split(` `).map(function (value) {
    return parseFloat(value, 10);
  });
}

function sizeOrViewboxFallback(size, fallback) {
  // no size -> get viewbox fallback
  if (_.isUndefined(size)) {
    return fallback;
  }
  // handle percent svg size -> get viewbox fallback
  // https://github.com/Hiswe/gulp-svg-symbols/issues/24
  if (/\d+%/.test(size)) {
    return (parseInt(size, 10) * fallback) / 100;
  }
  return parseInt(size, 10);
}

function createFile(name, contents) {
  return new Vinyl({
    cwd:  `./`,
    base: `./`,
    path: name,
    contents: new Buffer(contents)
  });
}

module.exports = {
  cssSize,
  dynamicText,
  viewboxToArray,
  sizeOrViewboxFallback,
  createFile,
  name: PLUGIN_NAME,
};
