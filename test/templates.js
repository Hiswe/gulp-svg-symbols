import gulp from 'gulp';
import fs from 'fs';
import path from 'path';
import es from 'event-stream';
import test from 'ava';
import intercept from 'intercept-stdout';

import svgSymbols from '../index.js';
import templates from '../lib/templates.js';

test.beforeEach( t => {
  t.context.stdout = [];
  t.context.unhookIntercept = intercept( txt => {
    t.context.stdout.push(txt);
  });
});

test.afterEach(t => {
  t.context.unhookIntercept();
});

////////
// DEFAULT SVG TEMPLATE
////////

const defaultSvgTitle = `Attributes handling in default-svg`;

test.cb( `${defaultSvgTitle} - should add xmlns attribute`, t => {
  gulp
    .src(`test/source/*.svg`)
    .pipe(svgSymbols({
      warn: false,
      templates: [`default-svg`, ],
    }))
    .pipe(es.writeArray( (err, output) => {
      const svg = output[0].contents.toString();
      t.regex( svg, /xmlns="http:\/\/www.w3.org\/2000\/svg"/g );
      t.end();
    }));
});

test.cb( `${defaultSvgTitle} - add a class to root SVG when wanted`, t => {
  gulp
    .src(`test/source/*.svg`)
    .pipe(svgSymbols({
      warn: false,
      svgAttrs: {class: `foobar`, },
      templates: [`default-svg`, ],
    }))
    .pipe(es.writeArray( (err, output) => {
      const svg = output[0].contents.toString();
      t.regex( svg,  /class="foobar"/g );
      t.end();
    }));
});

test.serial.cb( `${defaultSvgTitle} - handle deprecated svgClassname`, t => {
  gulp
    .src(`test/source/*.svg`)
    .pipe(svgSymbols({
      svgClassname: `foobar`,
      templates: [`default-svg`, ],
    }))
    .pipe(es.writeArray( (err, output) => {
      const svg = output[0].contents.toString();
      t.regex( svg, /class="foobar"/g );
      const messageRegex = /options\.svgClassname\sis\sdeprecated/;
      const warnMessage = t.context.stdout.find( e => messageRegex.test(e) );
      t.truthy( warnMessage, `has the svgClassname deprecaiton warning` );
      t.end();
    }));
});

test.cb( `${defaultSvgTitle} - should add any string attributes`, t => {
  gulp
    .src(`test/source/*.svg`)
    .pipe(svgSymbols({
      warn: false,
      svgAttrs: {foo: `bar`, pouic: `clapou`, },
      templates: [`default-svg`, ],
    }))
    .pipe(es.writeArray( (err, output) => {
      const svg = output[0].contents.toString();
      t.regex( svg, /foo="bar"/g );
      t.regex( svg, /pouic="clapou"/g );
      t.end();
    }));
});

test.cb( `${defaultSvgTitle} - add any string attributes with double quotes`, t => {
  gulp
    .src(`test/source/*.svg`)
    .pipe(svgSymbols({
      warn: false,
      svgAttrs: {foo: `"bar"`, },
      templates: [`default-svg`, ],
    }))
    .pipe(es.writeArray( (err, output) => {
      const svg = output[0].contents.toString();
      t.regex( svg, /foo="&quot;bar&quot;"/g );
      t.end();
    }));
});

test.cb( `${defaultSvgTitle} - handle any boolean attributes`, t => {
  gulp
    .src(`test/source/*.svg`)
    .pipe(svgSymbols({
      warn: false,
      svgAttrs: {foo: true, bar: false, },
      templates: [`default-svg`, ],
    }))
    .pipe(es.writeArray( (err, output) => {
      const svg = output[0].contents.toString();
      t.regex( svg, /\sfoo/g );
      t.notRegex( svg, /\sbar/g );
      t.end();
    }));
});

test.cb( `${defaultSvgTitle} - remove xmlns attribute if setted to false`, t => {
  gulp
    .src(`test/source/*.svg`)
    .pipe(svgSymbols({
      warn: false,
      svgAttrs: {xmlns: false, },
      templates: [`default-svg`, ],
    }))
    .pipe(es.writeArray( (err, output) => {
      const svg = output[0].contents.toString();
      t.notRegex( svg, /xmlns="http:\/\/www.w3.org\/2000\/svg"/g );
      t.end();
    }));
});

test.cb( `${defaultSvgTitle} - should handle any number attributes`, t => {
  gulp
    .src(`test/source/*.svg`)
    .pipe(svgSymbols({
      warn: false,
      svgAttrs: {foo: 300, },
      templates: [`default-svg`, ],
    }))
    .pipe(es.writeArray( (err, output) => {
      const svg = output[0].contents.toString();
      t.regex( svg, /\sfoo="300"/g );
      t.end();
    }));
});

test.cb( `${defaultSvgTitle} - add the xlink namespace if found inside the file`, t => {
  gulp
    .src(`test/source/xlink-href.svg`)
    .pipe(svgSymbols({
      warn: false,
      svgAttrs: {foo: 300, },
      templates: [`default-svg`, ],
    }))
    .pipe(es.writeArray( (err, output) => {
      const svg = output[0].contents.toString();
      t.regex( svg, /\sxmlns:xlink="http:\/\/www.w3.org\/1999\/xlink"/g );
      t.end();
    }));
});

////////
// CUSTOM TEMPLATE
////////

const htmlOutput = fs.readFileSync(`test/output/template.html`).toString();
const jsonOutput = fs.readFileSync(`test/output/template.json`).toString();

const datas = {
  icons: [
    {id: `pouic`, },
    {id: `clapou`, },
  ],
};
const tmpl = [
  path.join(__dirname, `./source/template.html`),
  path.join(__dirname, `./source/template.json`),
];

const customTmplTitle = `Render custom templates`;

test( `${customTmplTitle} - render a custom template`, async t => {
  const file = await templates.render(tmpl[0], datas);
  t.is( file.contents.toString(), htmlOutput );
});

test( `${customTmplTitle} - render an array of templates`, async t => {
  const files = await Promise.all( templates.renderAll(tmpl, datas) );
  t.is( files.length, 2 );
  t.is( files[0].contents.toString(), htmlOutput );
  t.is( files[1].contents.toString(), jsonOutput );
});
