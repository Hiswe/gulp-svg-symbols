'use strict';

const _             = require(`lodash`);
const path          = require(`path`);
const PluginError   = require(`plugin-error`);
const through       = require(`through2`);

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
  options.templates = options.templates.map( pathName => {
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

    // svgClassname option is now living inside svgAttrs
    // issue a deprecation warning and copy the value to it's rightful place
    if (typeof options.svgClassname !== `undefined`) {
      utils.logWarn(options, `options.svgClassname is deprecated. Please replace it with options.svgAttrs.classname`);
      options.svgAttrs.classname = options.svgClassname;
    }

    // automatically insert xlink if needed
    const haystack  = svgData.map(templates.svgdataToSymbol).join(``) + (defs || ``);
    if (/\sxlink:[a-z]+=/.test(haystack)) {
      options.svgAttrs[`xmlns:xlink`] = `http://www.w3.org/1999/xlink`;
    }

    const files = templates.renderAll(options.templates, {
      svgAttrs: options.svgAttrs,
      icons: svgData,
      defs: defs,
    });

    function outputFiles(files) {
      files.forEach(function (file) {
        that.push(file);
      });
      cb();
    }

    Promise.all(files).then(outputFiles);
  });
}

module.exports = gulpSvgSymbols;
