'use strict';

const _             = require(`lodash`);
const path          = require(`path`);
const PluginError   = require(`plugin-error`);
const through       = require(`through2`);
const BPromise      = require(`bluebird`);

const defaults      = require(`./lib/default-config`);
const svg           = require(`./lib/svg`);
const templates     = require(`./lib/templates.js`);
const utils         = require(`./lib/utils.js`);

const PLUGIN_NAME   = utils.name;
const templatesPath = {
  'default-svg':  path.join(__dirname, `./templates/svg-symbols.svg`),
  'default-css':  path.join(__dirname, `./templates/svg-symbols.css`),
  'default-demo': path.join(__dirname, `./templates/svg-symbols-demo-page.html`),
};

function gulpSvgSymbols(opts = {}) {
  const buffer  = [];
  let defs      = [];

  // clone everything as we don't want to mutate anything
  const options = _.defaults(_.cloneDeep(opts), _.cloneDeep(defaults));

  // expand path to default templates
  options.templates = options.templates.map(function (pathName) {
    if (pathName in templatesPath) return templatesPath[pathName];
    return pathName;
  });

  // buffer and transform every files
  return through.obj(function transform(file, encoding, cb) {

    if (file.isNull()) {
      return cb(null, file);
    }

    // we don't handle streams :,(
    // use https://github.com/nfroidure/gulp-streamify if you're reading this
    // next versions should use https://www.npmjs.com/package/bufferstreams
    if (file.isStream()) {
      const errorReason = `Streaming is not supported`;
      this.emit(`error`, new PluginError(PLUGIN_NAME, errorReason));
      return cb();
    }

    svg.parseFile(file, options, function (result) {
      buffer.push(result);
      return cb(null);
    });

  // put all generated files back in the stream
  }, function flush(cb) {
    const that    = this;

    const svgData = buffer.map(function (svgRawData) {
      // defs are not at an SVG level
      // they should be handled globally to the new SVG file
      if (svgRawData.defs) defs.push(svgRawData.defs);
      //
      return svg.formatForTemplate(svgRawData, options);
    });
    // force defs to have a value.
    // better for templates to check if `false` rather than length…
    defs = defs.length > 0 ? defs.join(`\n`) : false;

    const files = templates.renderAll(options.templates, {
      svgClassname: options.svgClassname,
      icons: svgData,
      defs: defs,
    });

    function outputFiles(files) {
      files.forEach(function (file) {
        that.push(file);
      });
      cb();
    }

    BPromise.all(files).then(outputFiles);
  });
}

module.exports = gulpSvgSymbols;
