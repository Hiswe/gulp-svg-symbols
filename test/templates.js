'use strict';

/*jshint maxlen:false */
/*global jasmine, beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */

const gulp            = require(`gulp`);
const fs              = require(`fs`);
const path            = require(`path`);
const gutil           = require(`gulp-util`);
const BPromise        = require(`bluebird`);
const es              = require(`event-stream`);

const svgSymbols      = require(`../index.js`);
const templates       = require(`../lib/templates.js`);
const htmlOutput      = fs.readFileSync(`test/output/template.html`).toString();
const jsonOutput      = fs.readFileSync(`test/output/template.json`).toString();

const datas           = {
  icons: [
    {id: `pouic`},
    {id: `clapou`},
  ],
};
const tmpl            = [
  path.join(__dirname, `./source/template.html`),
  path.join(__dirname, `./source/template.json`)
];

describe(`Render default-svg`, function () {

  it(`should add a classname to root SVG when passed as option`, function (done) {
    gulp
      .src(`test/source/*.svg`)
      .pipe(svgSymbols({
        warn: false,
        svgClassname: `foobar`,
        templates: [`default-svg`]
      }))
      .pipe(es.writeArray(function (err, output) {
        const svg = output[0].contents.toString();
        expect((svg.match(/class="foobar"/g) || []).length).toEqual(1);
        done();
      }));
  });
});

describe(`Render custom templates`, function () {

  it(`should render a random template with random infos`, function (done) {
    templates.render(tmpl[0], datas)
      .then(function (file) {
        expect(file.contents.toString()).toEqual(htmlOutput);
        done();
      })
      .catch(done.fail);
  });

  it(`should render an array of templates`, function (done) {
    const files = templates.renderAll(tmpl, datas);
    BPromise
      .all(files)
      .then(function (files) {
        expect(files.length).toEqual(2);
        expect(files[0].contents.toString()).toEqual(htmlOutput);
        expect(files[1].contents.toString()).toEqual(jsonOutput);
        done();
      })
      .catch(done.fail);
  });
});
