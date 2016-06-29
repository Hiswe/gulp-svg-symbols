'use strict';

var path          = require('path');
var gulp          = require('gulp');
var jshint        = require('gulp-jshint');
var stylish       = require('jshint-stylish');
var jscs          = require('gulp-jscs');
var jsbeautifier  = require('gulp-jsbeautifier');
var jasmine       = require('gulp-jasmine');
var doctoc        = require('gulp-doctoc');

var svgSymbols    = require('./index');
var svgGlob       = 'test/source/*.svg';
var jsGlob        = [
  'index.js',
  'gulpfile.js',
  'lib/*.js',
  'test/*.js',
  'examples/gulpfile.js',
];

gulp.task('test', function () {
  return gulp.src([
      'test/plugin.js',
      'test/templates.js',
      'test/get-svg-datas.js',
      'test/transform-raw-data.js',
    ])
    .pipe(jasmine({verbose: true}));
});

gulp.task('hint', function () {
  return gulp.src(jsGlob)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jscs());
});

gulp.task('templates', function () {
  return gulp.src(svgGlob)
    .pipe(svgSymbols({
      templates: [
        path.join(__dirname, './test/source/template.html'),
        path.join(__dirname, './test/source/template.json')
      ]
    }))
    .pipe(gulp.dest('tmp'));
});

gulp.task('toc', function() {
  return gulp.src('./README.md')
  .pipe(doctoc({
    mode: "github.com",
  }))
  .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
  return gulp.watch(jsGlob, ['hint']);
});

gulp.task('default', function (cb) {
  console.log('test');
  console.log('hint');
  console.log('watch');
  cb();
});
