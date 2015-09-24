'use strict';
/*jshint maxlen:false */
/*global jasmine, beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */

var fs            = require('fs');
var es            = require('event-stream');
var gulp          = require('gulp');

var svgSymbols    = require('../index.js');

describe('Plugin', function () {

  it('should produce two files', function (done) {
    var that = this;
    gulp.src('test/source/*.svg')
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
    gulp.src('test/source/github.svg')
      .pipe(svgSymbols({silent: true}))
      .pipe(es.wait(function () {
        gulp.src('test/source/github.svg')
          .pipe(svgSymbols({silent: true}))
          .pipe(es.writeArray(function (err, output) {
            var svg = output[0].contents.toString();
            var css = output[1].contents.toString();
            expect(output.length).toEqual(2);
            expect((svg.match(/<symbol/g) || []).length).toEqual(1);
            expect((css.match(/github/g) || []).length).toEqual(1);
            done();
          }));
      }));
  });

  it('can generate a demo page', function (done) {
    var that = this;
    gulp.src('test/source/github.svg')
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
        expect(svgContent).toMatch(/<defs>/g);
        done();
      }));
  });

  it('should handle svg withouts defs', function (done) {
    var that = this;
    gulp.src('test/source/gear_without_dimensions.svg')
      .pipe(svgSymbols({silent: true}))
      .pipe(es.writeArray(function (err, output) {
        var svgContent = output[0].contents.toString()
        expect(svgContent).not.toMatch(/<defs>/g);
        done();
      }));
  });

  it('should handle svg with empty defs', function (done) {
    var that = this;
    gulp.src('test/source/chinese letter with styles.svg')
      .pipe(svgSymbols({silent: true}))
      .pipe(es.writeArray(function (err, output) {
        var svgContent = output[0].contents.toString();
        expect(svgContent).not.toMatch(/<defs>/g);
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
        expect(svgContent).toMatch(/<title>pouic<\/title>/g);
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
        expect(svgContent).not.toMatch(/<title>/g);
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
        expect(svgContent).not.toMatch(/<title>/g);
        done();
      }));
  });
});
