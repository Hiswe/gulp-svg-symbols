'use strict';

const es            = require(`event-stream`);
const gulp          = require(`gulp`);

const svgSymbols    = require(`../index.js`);

////////
// BASIC
////////

describe(`Plugin – basic`, function () {

  it(`should produce two files`, function (done) {
    gulp.src([
      `test/source/*.svg`,
      `!test/source/crâne noir.svg`,
      `!test/source/aspect-ratio.svg`,
    ])
      .pipe(svgSymbols({warn: false}))
      .pipe(es.writeArray(function (err, output) {
        expect(output.length).toEqual(2);
        expect(output[0].path).toEqual(`svg-symbols.svg`);
        expect(output[1].path).toEqual(`svg-symbols.css`);
        done();
      }));
  });

  // control duplicate attributes in a watch case
  // https://github.com/Hiswe/gulp-svg-symbols/issues/2
  it(`should have the right output if called many times`, function (done) {
    gulp.src(`test/source/github.svg`)
      .pipe(svgSymbols({warn: false}))
      .pipe(es.wait(function () {
        gulp.src(`test/source/github.svg`)
          .pipe(svgSymbols({warn: false}))
          .pipe(es.writeArray(function (err, output) {
            const svg = output[0].contents.toString();
            const css = output[1].contents.toString();
            expect(output.length).toEqual(2);
            expect((svg.match(/<symbol/g) || []).length).toEqual(1);
            expect((css.match(/github/g) || []).length).toEqual(1);
            done();
          }));
      }));
  });

  it(`can generate a demo page`, function (done) {
    gulp.src(`test/source/github.svg`)
      .pipe(svgSymbols({
        templates: [`default-demo`],
        warn: false,
      }))
      .pipe(es.writeArray(function (err, output) {
        expect(output.length).toEqual(1);
        expect(output[0].path).toEqual(`svg-symbols-demo-page.html`);
        done();
      }));
  });

});

////////
// CONCAT DEFS
////////

describe(`Plugin - defs`, function () {

  it(`should handle svg with defs`, function (done) {
    gulp.src(`test/source/gradient.svg`)
      .pipe(svgSymbols({warn: false}))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).toMatch(/<defs>/g);
        done();
      }));
  });

  it(`should handle svg withouts defs`, function (done) {
    gulp.src(`test/source/gear_without_dimensions.svg`)
      .pipe(svgSymbols({warn: false}))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).not.toMatch(/<defs>/g);
        done();
      }));
  });

  it(`should handle svg with empty defs`, function (done) {
    gulp.src(`test/source/chinese letter with styles.svg`)
      .pipe(svgSymbols({warn: false}))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).not.toMatch(/<defs>/g);
        done();
      }));
  });

});

////////
// CONCAT STYLES
////////

describe(`Plugin - style tags`, function () {
  it(`should remove style attributes and put content in another file`, function (done) {
    gulp.src(`test/source/warning with styles and empty group.svg`)
      .pipe(svgSymbols({warn: false}))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        const cssContent = output[1].contents.toString();
        expect(svgContent).not.toMatch(/<style/g);
        expect(cssContent).toMatch(/\.alert{fill:#C40000;}/g);
        done();
      }));
  });

});

////////
// REMOVE EMPTY GROUPS
////////

describe(`Plugin - empty groups`, function () {
  it(`should remove empty groups`, function (done) {
    gulp.src(`test/source/warning with styles and empty group.svg`)
      .pipe(svgSymbols({warn: false}))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect((svgContent.match(/<g>/g) || []).length).toEqual(1);
        done();
      }));
  });

});

////////
// HANDLE TITLE
////////

describe(`Plugin - title`, function () {
  const src = `test/source/gear_without_dimensions.svg`;

  it(`should handle title`, function (done) {
    gulp.src(src)
      .pipe(svgSymbols({
        title: `pouic`,
        warn: false,
      }))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).toMatch(/<title>pouic<\/title>/g);
        done();
      }));
  });

  it(`should remove title if title option is false`, function (done) {
    gulp.src(src)
      .pipe(svgSymbols({
        title: false,
        warn: false,
      }))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).not.toMatch(/<title>/g);
        done();
      }));
  });

  it(`should remove title if title option is an empty string`, function (done) {
    gulp.src(src)
      .pipe(svgSymbols({
        title: ``,
        warn: false,
      }))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).not.toMatch(/<title>/g);
        done();
      }));
  });

  it(`should't add a title if one is already there`, function (done) {
    gulp.src(`test/source/instagram-black.svg`)
      .pipe(svgSymbols({
        title: `clapou`,
        warn: false,
      }))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).toMatch(/<title>/g);
        expect((svgContent.match(/<symbol/g) || []).length).toEqual(1);
        done();
      }));
  });
});

////////
// HANDLE IDS
////////

describe(`Plugin - id`, function () {

  it(`should slug ids`, function (done) {
    const src = `test/source/crâne noir.svg`;
    gulp.src(src)
      .pipe(svgSymbols({warn: false,}))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).toMatch(/id="crane-noir"/g);
        done();
      }));
  });

  it(`should handle speakingurl options`, function (done) {
    const src = `test/source/crâne noir.svg`;
    gulp.src(src)
      .pipe(svgSymbols({
        warn: false,
        slug: {
          separator: `_`,
          custom: {
            'c': `k`
          }
        }
      }))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).toMatch(/id="krane_noir"/g);
        done();
      }));
  });

  it(`should handle custom slug function`, function (done) {
    const src = `test/source/crâne noir.svg`;
    gulp.src(src)
      .pipe(svgSymbols({
        warn: false,
        slug: function (name) {
          const result = name.split(` `);
          return `test-name-`  + result[1];
        },
      }))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).toMatch(/id="test-name-noir"/g);
        done();
      }));
  });

});


////////
// HANDLE PRESERVE ASPECT RATIO
////////

describe(`Plugin - preserveAspectRatio`, function () {

  it(`shouldn't add preserveAspectRatio if none present on source`, function (done) {
    const src = `test/source/zoom.svg`;
    gulp.src(src)
      .pipe(svgSymbols({warn: false,}))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).not.toMatch(/preserveAspectRatio/g);
        done();
      }));
  });

  it(`should port preserveAspectRatio with a value of "none"`, function (done) {
    const src = `test/source/aspect-ratio.svg`;
    gulp.src(src)
      .pipe(svgSymbols({warn: false,}))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).toMatch(/preserveAspectRatio="none"/g);
        done();
      }));
  });

  it(`should port preserveAspectRatio with any value`, function (done) {
    const src = `test/source/chinese letter with styles.svg`;
    gulp.src(src)
      .pipe(svgSymbols({warn: false,}))
      .pipe(es.writeArray(function (err, output) {
        const svgContent = output[0].contents.toString();
        expect(svgContent).toMatch(/preserveAspectRatio="xMidYMid"/g);
        done();
      }));
  });

});
