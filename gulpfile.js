'use strict';

var path          = require('path');
var gulp          = require('gulp');
var jshint        = require('gulp-jshint');
var stylish       = require('jshint-stylish');
var jscs          = require('gulp-jscs');
var jsbeautifier  = require('gulp-jsbeautifier');
var jasmine       = require('gulp-jasmine');

var svgSymbols    = require('./index');
var svgGlob       = 'test/source/*.svg';
var jsGlob        = ['index.js', 'gulpfile.js', 'lib/*.js', 'test/*.js'];

gulp.task('test', function () {
  return gulp.src([
      'test/parse-options.js',
      // 'test/plugin.js',
      'test/render-templates.js',
      'test/svg-raw-datas.js',
      'test/transform-raw-data.js',
    ])
    .pipe(jasmine({verbose: true}));
});

gulp.task('demo', function () {
  return gulp.src(svgGlob)
    .pipe(svgSymbols())
    .pipe(gulp.dest('tmp'));
});

gulp.task('demo-single', function () {
  return gulp.src([
      'test/source/warning.svg',
      'test/source/zoom.svg',
      'test/source/skull.svg'])
    .pipe(svgSymbols.demoPage({
      removeAttributes: 'full'
    }))
    .pipe(gulp.dest('tmp'));
});

gulp.task('hint', function () {
  return gulp.src(jsGlob)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jscs());
});

gulp.task('demo-page', function () {
  return gulp.src(svgGlob)
    .pipe(svgSymbols.demoPage())
    .pipe(jsbeautifier({
      indentSize: 2,
      logSuccess: false
    }))
    .pipe(gulp.dest('tmp'));
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

gulp.task('watch', function () {
  gulp.watch(svgGlob,                                 ['demo']);
  gulp.watch('templates/svg-symbols-demo-page.html',  ['demo-page']);
  return gulp.watch(jsGlob, ['hint']);
});

gulp.task('default', function (cb) {
  console.log('test');
  console.log('demo');
  console.log('hint');
  console.log('watch');
  console.log('demo-page');
  cb();
});
