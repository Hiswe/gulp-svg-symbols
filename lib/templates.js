'use strict';

const path                    = require(`path`);
const consolidate             = require(`consolidate`);
consolidate.requires.lodash = require(`lodash`);
const tmpl                    = consolidate.lodash;
const BPromise                = require(`bluebird`);
const utils                   = require(`./utils`);

let render = function render(template, datas, callback) {
  const name = path.basename(template);
  tmpl(template, datas, function (err, result) {
    if (err) return callback(err, result);
    callback(null, utils.createFile(name, result));
  });
};

render = BPromise.promisify(render);

function renderAll(templates, datas) {
  return templates.map(function (template) {
    return render(template, datas);
  });
}

module.exports = {
  renderAll,
  render,
};
