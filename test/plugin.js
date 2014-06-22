var fs            = require('fs');
var es            = require('event-stream');
var gulp          = require('gulp');
var path          = require('path');
var gutil         = require('gulp-util');

var svgSymbols    = require('../index.js');
var srcGlob       = 'test/source/*.svg'

describe('gulp-svg-symbols plugin', function () {
  beforeEach(function () {
    this.output =  [];
  });

  it('should produce two files', function(done){
    var that = this;
    gulp.src(srcGlob)
      .pipe(svgSymbols())
      .pipe(es.mapSync(function (data){
        that.output.push(data);
        return data;
      }))
      .pipe(es.wait(function () {
        expect(that.output.length).toEqual(2);
        expect(that.output[0].path).toEqual('svg-symbols.svg');
        expect(that.output[1].path).toEqual('svg-symbols.css');
        done();
      }));
  });

  it('should have the right output if called many times', function(done){
    var that = this;
    gulp.src(srcGlob)
      .pipe(svgSymbols())
      .pipe(es.wait(function () {
        gulp.src(srcGlob)
          .pipe(svgSymbols())
          .pipe(es.mapSync(function (data){
            that.output.push(data);
            return data;
          }))
          .pipe(es.wait(function () {
            var svgOutputFile = fs.readFileSync('test/output/svg-symbols.svg').toString();
            var cssOutputFile = fs.readFileSync('test/output/svg-symbols.css').toString();
            expect(that.output.length).toEqual(2);
            expect(that.output[0].contents.toString()).toEqual(svgOutputFile);
            expect(that.output[1].contents.toString()).toEqual(cssOutputFile);
            done();
          }));
      }));
  });
});

describe('gulp-svg-symbols plugin without CSS', function () {
  beforeEach(function () {
    this.output =  [];
    this.options = {css: false}
  });

  it('should produce one file', function(done){
    var that = this;
    gulp.src(srcGlob)
      .pipe(svgSymbols(this.options))
      .pipe(es.mapSync(function (data){
        that.output.push(data);
        return data;
      }))
      .pipe(es.wait(function () {
        expect(that.output.length).toEqual(1);
        expect(that.output[0].path).toEqual('svg-symbols.svg');
        done();
      }));
  });

  it('should have the right output if called many times', function(done){
    var that = this;
    gulp.src(srcGlob)
      .pipe(svgSymbols(this.options))
      .pipe(es.wait(function () {
        gulp.src(srcGlob)
          .pipe(svgSymbols(that.options))
          .pipe(es.mapSync(function (data){
            that.output.push(data);
            return data;
          }))
          .pipe(es.wait(function () {
            var svgOutputFile = fs.readFileSync('test/output/svg-symbols.svg').toString();
            expect(that.output.length).toEqual(1);
            expect(that.output[0].contents.toString()).toEqual(svgOutputFile);
            done();
          }));
      }));
  });
});
