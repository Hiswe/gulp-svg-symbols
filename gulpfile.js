'use strict';

const path          = require(`path`);
const gulp          = require(`gulp`);
const eslint        = require(`gulp-eslint`)
const jasmine       = require(`gulp-jasmine`);
const doctoc        = require(`gulp-doctoc`);

const svgSymbols    = require(`./index`);
const svgGlob       = `test/source/*.svg`;
const jsGlob        = [
  `**/*.js`,
  `!node_modules`,
  `!node_modules/**/*`,
  `!**/node_modules`,
  `!**/node_modules/**/*`,
];

function test() {
  return gulp.src([
    `test/plugin.js`,
    `test/templates.js`,
    `test/get-svg-datas.js`,
    `test/transform-raw-data.js`,
  ])
    .pipe(jasmine({verbose: true,}));
}
test.description = `run the tests`;

function lint() {
  return gulp.src(jsGlob)
    .pipe(eslint({fix: true,}))
    .pipe(eslint.format())
    .pipe(gulp.dest(`./`));
}
lint.description = `lint the code using eslint`;

function templates() {
  return gulp.src(svgGlob)
    .pipe(svgSymbols({
      templates: [
        path.join(__dirname, `./test/source/template.html`),
        path.join(__dirname, `./test/source/template.json`),
      ],
    }))
    .pipe(gulp.dest(`tmp`));
}
templates.description = `test some user-defined templates`;

function toc() {
  return gulp.src(`./README.md`)
    .pipe(doctoc({
      mode: `github.com`,
    }))
    .pipe(gulp.dest(`./`));
}
toc.description = `update the readme's table of content`;

function watch() {
  return gulp.watch(jsGlob, lint);
}
watch.description = `hint on file change`;

module.exports = {
  test,
  lint,
  templates,
  watch,
};
