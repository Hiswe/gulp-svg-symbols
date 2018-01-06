'use strict';

const path          = require(`path`);
const gulp          = require(`gulp`);
const gulpif        = require(`gulp-if`);
const rename        = require(`gulp-rename`);
// In your own environment it should be:
//  const svgSymbols    = require(`gulp-svg-symbols`);
// we require the lib like this have the most recent version of the library
const svgSymbols    = require(`../index.js`);

const svgGlob       = `../test/source/*.svg`;

// default options output
function svg() {
  return gulp.src(svgGlob)
    .pipe(svgSymbols())
    .pipe(gulp.dest(`ex-default`));
}
svg.description = `default use of the plugin`;

// adding the demo page
function demoPage() {
  return gulp.src(svgGlob)
    .pipe(svgSymbols({
      templates: [
        `default-svg`,
        `default-css`,
        `default-demo`,
      ],
    }))
    .pipe(gulp.dest(`ex-demo-page`));
}
demoPage.description  = `Generating the demo page along with the default templates`;

// add a class name to the outputed SVG in case of SVG being included in the DOM
function svgClassname() {
  return gulp.src(svgGlob)
    .pipe(svgSymbols({
      svgAttrs: { class: `custom-name`, },
    }))
    .pipe(gulp.dest(`ex-svg-classname`));
}
svgClassname.description  = `Adding add a class to the generated SVG file`;

const customCSSTemplate   = path.join(__dirname, `../test/source/template.json`);
const customHTMLTemplate  = path.join(__dirname, `../test/source/template.html`);
// custom templates & files in different folders
function customTemplate() {
  return gulp.src(svgGlob)
    .pipe(svgSymbols({
      id:         `icon-%f`,
      className:  `.icon-%f`,
      title:      false,
      fontSize:   16,
      templates: [`default-svg`, `default-demo`, customCSSTemplate, customHTMLTemplate, ],
    }))
    .pipe(rename(function (path) {
      path.basename = `icon-files`;
    }))
    .pipe(gulpif( /[.]svg$/, gulp.dest(`ex-custom-template/views`)))
    .pipe(gulpif( /[.]json$/, gulp.dest(`ex-custom-template/front`)))
    .pipe(gulpif( /[.]html$/, gulp.dest(`ex-custom-template/tmp`)));
}
customTemplate.description  = `Using custom templates`;

// custom template to test aspect ratio
function aspectRatio() {
  return gulp.src([
    `../test/source/aspect-ratio.svg`,
    `../test/source/github.svg`,
  ])
    .pipe(svgSymbols({
      templates: [
        path.join(__dirname, `/aspect-ratio-test.html`),
      ],
    }))
    .pipe(gulp.dest(`ex-aspect-ratio`));
}
aspectRatio.description = `A custom template with aspect ratios`;

gulp.task(`svg`, svg);
gulp.task(`demo-page`, demoPage);
gulp.task(`svg-classname`, svgClassname);
gulp.task(`custom-template`, customTemplate);
gulp.task(`aspect-ratio`, aspectRatio);
gulp.task(`all`, gulp.parallel(svg, demoPage, svgClassname, customTemplate, aspectRatio));
