var path          = require('path');
var SVGO          = require('svgo');
var svgo          = new SVGO();

module.exports = function formatSvgData(file, options, callback) {
  svgo.optimize(file.contents.toString(), function (result) {
    result.data           = result.data.replace(/^<svg[^>]+>|<\/svg>$/g, "");
    result.info.width     = ~~result.info.width;
    result.info.height    = ~~result.info.height;
    result.info.name      = /(.*)\.svg/.exec(path.basename(file.path))[1];
    result.info.id        = options.svgId.replace("%f", result.info.name);
    result.info.className = options.className.replace("%f", result.info.name);
    return callback(result);
  });
}