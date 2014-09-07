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
      .pipe(svgSymbols())
      .pipe(es.writeArray(function (err, output) {
        expect(output.length).toEqual(2);
        expect(output[0].path).toEqual('svg-symbols.svg');
        expect(output[1].path).toEqual('svg-symbols.css');
        done();
      }))
  });

  it('should have the right output if called many times', function(done){
    var that = this;
    gulp.src(srcGlob)
      .pipe(svgSymbols())
      .pipe(es.wait(function () {
        gulp.src(srcGlob)
          .pipe(svgSymbols())
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

  it('should have a demo-page method', function (done) {
    var that = this;
    gulp.src(srcGlob)
      .pipe(svgSymbols.demoPage())
      .pipe(es.writeArray(function (err, output) {
        expect(output.length).toEqual(1);
        expect(output[0].path).toEqual('svg-symbols-demo-page.html');
        done();
      }))
  });

});
