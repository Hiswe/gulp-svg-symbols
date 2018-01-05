'use strict';

const path                    = require(`path`);
const consolidate             = require(`consolidate`);
consolidate.requires.lodash   = require(`lodash`);
const tmpl                    = consolidate.lodash;
const utils                   = require(`./utils`);

function attributesToString(obj) {
  return Object
    .getOwnPropertyNames(obj)
    .reduce( (str, key) => {
      const attr        = key.replace(/[^a-zA-Z-]/g, ``);
      const raw         = obj[key];
      const rawEscaped  = String(raw).replace(/"/g, `&quot;`);
      const t           = typeof raw;
      if (attr === `classname`  && t === `string`) {
        return `${str} class="${rawEscaped}"`;
      }
      if (t === `string` || t === `boolean` || (t === `number` && !isNaN(raw))) {
        return `${str} ${attr}="${rawEscaped}"`;
      }
      return str;
    }, ``);
}

function svgdataToSymbol(icon) {
  const symbolAttrs = attributesToString({
    id: icon.id,
    viewBox: icon.svg.viewBox,
    preserveAspectRatio: icon.svg.originalAttributes.preserveAspectRatio,
  });
  const title = icon.title ? `<title>${icon.title}</title>` : ``;
  return `<symbol${ symbolAttrs }>${ title }${ icon.svg.content }</symbol>`;
}

function render(template, datas) {
  const name = path.basename(template);
  // add some utilities function to lodash template engine
  // this avoid bloating the template with javascript
  // and keep the use of it optionnal
  datas.imports = {
    attributesToString,
    svgdataToSymbol,
  };
  return tmpl(template, datas)
    .then( result => utils.createFile(name, result) );
}

function renderAll(templates, datas) {
  return templates.map( template => render(template, datas) );
}

module.exports = {
  attributesToString,
  svgdataToSymbol,
  renderAll,
  render,
};
