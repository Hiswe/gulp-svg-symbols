'use strict';

const gulp            = require(`gulp`);
const fs              = require(`fs`);
const path            = require(`path`);
const BPromise        = require(`bluebird`);
const es              = require(`event-stream`);

const svgSymbols      = require(`../index.js`);
const templates       = require(`../lib/templates.js`);
const htmlOutput      = fs.readFileSync(`test/output/template.html`).toString();
const jsonOutput      = fs.readFileSync(`test/output/template.json`).toString();

const datas           = {
  icons: [
    {id: `pouic`, },
    {id: `clapou`, },
  ],
};
const tmpl            = [
  path.join(__dirname, `./source/template.html`),
  path.join(__dirname, `./source/template.json`),
];

describe(`Attributes handling in default-svg`, function () {

  it(`should add xmlns attribute`, done => {
    gulp
      .src(`test/source/*.svg`)
      .pipe(svgSymbols({
        warn: false,
        templates: [`default-svg`, ],
      }))
      .pipe(es.writeArray( (err, output) => {
        const svg = output[0].contents.toString();
        expect(svg).toMatch(/xmlns="http:\/\/www.w3.org\/2000\/svg"/g);
        done();
      }));
  });

  it(`should add a classname to root SVG when passed as option`, done => {
    gulp
      .src(`test/source/*.svg`)
      .pipe(svgSymbols({
        warn: false,
        svgAttrs: {classname: `foobar`, },
        templates: [`default-svg`, ],
      }))
      .pipe(es.writeArray( (err, output) => {
        const svg = output[0].contents.toString();
        expect(svg).toMatch(/class="foobar"/g);
        done();
      }));
  });

  it(`should handle the old svgClassname attribute as well`, done => {
    gulp
      .src(`test/source/*.svg`)
      .pipe(svgSymbols({
        warn: false,
        svgClassname: `foobar`,
        templates: [`default-svg`, ],
      }))
      .pipe(es.writeArray( (err, output) => {
        const svg = output[0].contents.toString();
        expect(svg).toMatch(/class="foobar"/g);
        done();
      }));
  });

  it(`should add any string attributes`, done => {
    gulp
      .src(`test/source/*.svg`)
      .pipe(svgSymbols({
        warn: false,
        svgAttrs: {foo: `bar`, pouic: `clapou`, },
        templates: [`default-svg`, ],
      }))
      .pipe(es.writeArray( (err, output) => {
        const svg = output[0].contents.toString();
        expect(svg).toMatch(/foo="bar"/g);
        expect(svg).toMatch(/pouic="clapou"/g);
        done();
      }));
  });

  it(`should add any string attributes with double quotes`, done => {
    gulp
      .src(`test/source/*.svg`)
      .pipe(svgSymbols({
        warn: false,
        svgAttrs: {foo: `"bar"`, },
        templates: [`default-svg`, ],
      }))
      .pipe(es.writeArray( (err, output) => {
        const svg = output[0].contents.toString();
        expect(svg).toMatch(/foo="&quot;bar&quot;"/g);
        done();
      }));
  });

  it(`should handle any boolean attributes`, done => {
    gulp
      .src(`test/source/*.svg`)
      .pipe(svgSymbols({
        warn: false,
        svgAttrs: {foo: true, bar: false, },
        templates: [`default-svg`, ],
      }))
      .pipe(es.writeArray( (err, output) => {
        const svg = output[0].contents.toString();
        expect(svg).toMatch(/\sfoo/g);
        expect(svg).not.toMatch(/\sbar/g);
        done();
      }));
  });

  it(`should remove xmlns attribute if setted to false`, done => {
    gulp
      .src(`test/source/*.svg`)
      .pipe(svgSymbols({
        warn: false,
        svgAttrs: {xmlns: false, },
        templates: [`default-svg`, ],
      }))
      .pipe(es.writeArray( (err, output) => {
        const svg = output[0].contents.toString();
        expect(svg).not.toMatch(/xmlns="http:\/\/www.w3.org\/2000\/svg"/g);
        done();
      }));
  });

  it(`should handle any number attributes`, done => {
    gulp
      .src(`test/source/*.svg`)
      .pipe(svgSymbols({
        warn: false,
        svgAttrs: {foo: 300, },
        templates: [`default-svg`, ],
      }))
      .pipe(es.writeArray( (err, output) => {
        const svg = output[0].contents.toString();
        expect(svg).toMatch(/\sfoo="300"/g);
        done();
      }));
  });

  it(`should add the xlink namespace if founded on the file`, done => {
    gulp
      .src(`test/source/xlink-href.svg`)
      .pipe(svgSymbols({
        warn: false,
        templates: [`default-svg`, ],
      }))
      .pipe(es.writeArray( (err, output) => {
        const svg = output[0].contents.toString();
        expect(svg).toMatch(/\sxmlns:xlink="http:\/\/www.w3.org\/1999\/xlink"/g);
        done();
      }));
  });
});

describe(`Render custom templates`, function () {

  it(`should render a random template with random infos`, done => {
    templates.render(tmpl[0], datas)
      .then( file => {
        expect(file.contents.toString()).toEqual(htmlOutput);
        done();
      })
      .catch(done.fail);
  });

  it(`should render an array of templates`, done => {
    const files = templates.renderAll(tmpl, datas);
    BPromise
      .all(files)
      .then( files => {
        expect(files.length).toEqual(2);
        expect(files[0].contents.toString()).toEqual(htmlOutput);
        expect(files[1].contents.toString()).toEqual(jsonOutput);
        done();
      })
      .catch(done.fail);
  });
});
