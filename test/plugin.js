'use strict';
/*jshint maxlen:false */
/*global jasmine, beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */

var fs            = require('fs');
var es            = require('event-stream');
var gulp          = require('gulp');

var svgSymbols    = require('../index.js');
var srcGlob       = 'test/source/*.svg';

describe('Plugin', function () {

  it('should produce two files', function (done) {
    var that = this;
    gulp.src(srcGlob)
      .pipe(svgSymbols({silent: true}))
      .pipe(es.writeArray(function (err, output) {
        expect(output.length).toEqual(2);
        expect(output[0].path).toEqual('svg-symbols.svg');
        expect(output[1].path).toEqual('svg-symbols.css');
        done();
      }));
  });

  it('should have the right output if called many times', function (done) {
    var that = this;
    gulp.src(srcGlob)
      .pipe(svgSymbols({silent: true}))
      .pipe(es.wait(function () {
        gulp.src(srcGlob)
          .pipe(svgSymbols({silent: true}))
          .pipe(es.writeArray(function (err, output) {
            var svgOutputFile = fs.readFileSync('test/output/svg-symbols.svg');
            var cssOutputFile = fs.readFileSync('test/output/svg-symbols.css');
            expect(output.length).toEqual(2);
            expect(output[0].contents.toString()).toEqual(svgOutputFile.toString());
            expect(output[1].contents.toString()).toEqual(cssOutputFile.toString());
            done();
          }));
      }));
  });

  it('can generate a demo page', function (done) {
    var that = this;
    gulp.src(srcGlob)
      .pipe(svgSymbols({
        templates: ['default-demo'],
        silent: true,
      }))
      .pipe(es.writeArray(function (err, output) {
        expect(output.length).toEqual(1);
        expect(output[0].path).toEqual('svg-symbols-demo-page.html');
        done();
      }));
  });

});


describe('Plugin - defs', function () {

  it('should handle svg with defs', function (done) {
    var that = this;
    gulp.src('test/source/gradient.svg')
      .pipe(svgSymbols({silent: true}))
      .pipe(es.writeArray(function (err, output) {
        var svgContent = output[0].contents.toString()
        expect(/<defs>/.test(svgContent)).toBe(true);
        done();
      }));
  });

  it('should handle svg withouts defs', function (done) {
    var that = this;
    gulp.src('test/source/gear_without_dimensions.svg')
      .pipe(svgSymbols({silent: true}))
      .pipe(es.writeArray(function (err, output) {
        var svgContent = output[0].contents.toString()
        expect(/<defs>/.test(svgContent)).toBe(false);
        done();
      }));
  });

  it('should handle svg with empty defs', function (done) {
    var that = this;
    gulp.src('test/source/chinese letter with styles.svg')
      .pipe(svgSymbols({silent: true}))
      .pipe(es.writeArray(function (err, output) {
        var svgContent = output[0].contents.toString()
        expect(/<defs>/.test(svgContent)).toBe(false);
        done();
      }));
  });

});

describe('Plugin - title', function () {
  var src = 'test/source/gear_without_dimensions.svg';

  it('should handle title', function (done) {
    gulp.src(src)
      .pipe(svgSymbols({
        title: 'pouic',
        silent: true,
      }))
      .pipe(es.writeArray(function (err, output) {
        var svgContent = output[0].contents.toString()
        expect(/<title>pouic<\/title>/.test(svgContent)).toBe(true);
        done();
      }));
  });

  it('should remove title if title option is false', function (done) {
    gulp.src(src)
      .pipe(svgSymbols({
        title: false,
        silent: true,
      }))
      .pipe(es.writeArray(function (err, output) {
        var svgContent = output[0].contents.toString()
        expect(/<title>/.test(svgContent)).toBe(false);
        done();
      }));
  });

  it('should remove title if title option is an empty string', function (done) {
    gulp.src(src)
      .pipe(svgSymbols({
        title: '',
        silent: true,
      }))
      .pipe(es.writeArray(function (err, output) {
        var svgContent = output[0].contents.toString()
        expect(/<title>/.test(svgContent)).toBe(false);
        done();
      }));
  });
});
