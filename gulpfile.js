'use strict';

const gulp          = require(`gulp`);
const eslint        = require(`gulp-eslint`);
const jasmine       = require(`gulp-jasmine`);
const doctoc        = require(`gulp-doctoc`);
const cache         = require(`gulp-cached`);

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
    .pipe(jasmine({verbose: true, }));
}
test.description = `run the tests`;

function lint() {
  return gulp.src(jsGlob)
    .pipe(cache(`linting`))
    .pipe(eslint({fix: true, }))
    .pipe(eslint.format())
    .pipe(gulp.dest(`./`));
}
lint.description = `lint the code using eslint`;

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
  watch,
};
