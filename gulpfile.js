'use strict';

const gulp          = require(`gulp`);
const eslint        = require(`gulp-eslint`);
const doctoc        = require(`gulp-doctoc`);
const cache         = require(`gulp-cached`);

const jsGlob        = [
  `**/*.js`,
  `!node_modules`,
  `!node_modules/**/*`,
  `!**/node_modules`,
  `!**/node_modules/**/*`,
];

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
  lint,
  toc,
  watch,
};
