'use strict';

var path          = require('path');
var gulp          = require('gulp');
var svgSymbols    = require('../index');
var gulpif        = require('gulp-if');
var rename        = require('gulp-rename');

var svgGlob       = '../test/source/*.svg';

require('gulp-task-list')(gulp);

// output task lists
gulp.task('default', ['task-list']);

// default options output
gulp.task('svg', function () {
  return gulp.src(svgGlob)
  .pipe(svgSymbols())
  .pipe(gulp.dest('ex-default'));
});

// adding the demo page
gulp.task('demo-page', function () {
  return gulp.src(svgGlob)
  .pipe(svgSymbols({
    templates: [
      'default-svg',
      'default-css',
      'default-demo',
    ]
  }))
  .pipe(gulp.dest('ex-demo-page'));
});

// add a class name to the outputed SVG in case of SVG being included in the DOM
gulp.task('svg-classname', function () {
  return gulp.src(svgGlob)
  .pipe(svgSymbols({
    svgClassname: 'custom-name',
  }))
  .pipe(gulp.dest('ex-svg-classname'));
});

var customCSSTemplate = path.join(__dirname, '../test/source/template.json');
// custom templates & files in different folders
gulp.task('custom-template', function () {
  return gulp.src(svgGlob)
  .pipe(svgSymbols({
    id:         'icon-%f',
    className:  '.icon-%f',
    title:      false,
    fontSize:   16,
    templates: ['default-svg', 'default-demo', customCSSTemplate]
  }))
  .pipe(rename(function (path) {
    path.basename = 'icon-files';
  }))
  .pipe(gulpif( /[.]svg$/, gulp.dest('ex-custom-template/views')))
  .pipe(gulpif( /[.]json$/, gulp.dest('ex-custom-template/front')))
  .pipe(gulpif( /[.]html$/, gulp.dest('ex-custom-template/tmp')));
});


// custom template to test aspect ratio
gulp.task('aspect-ratio', function () {
  return gulp.src([
    '../test/source/aspect-ratio.svg',
    '../test/source/github.svg'
  ])
  .pipe(svgSymbols({
    templates: [
      path.join(__dirname, '/aspect-ratio-test.html'),
    ]
  }))
  .pipe(gulp.dest('ex-aspect-ratio'));
});
