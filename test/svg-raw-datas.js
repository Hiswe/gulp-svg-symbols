'use strict';

/*jshint maxlen:false */
/*global jasmine, beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */

var fs            = require('fs');
var path          = require('path');
var gutil         = require('gulp-util');

var config        = require('../lib/default-config');
var formatSvgData = require('../lib/raw-svg-data.js');

// Use the skull files for that
var svgFile       = new gutil.File({
  base: 'test/source',
  cwd: 'test/',
  path: 'test/source/skull.svg',
  contents: fs.readFileSync('test/source/skull.svg')
});
var authorizedInfo = ['content', 'width', 'height', 'name', 'viewBox'].sort();
var expectedInfo  = {
  content:  fs.readFileSync('test/output/skull-symbol.svg').toString(),
  width:    150,
  height:   150,
  name:     'skull',
  viewBox:  '-50 0 150 150'
};

describe('Gather basic info from SVG', function () {
  it('should be an object', function (done) {
    formatSvgData(svgFile, {}, function (result) {
      expect(result).toEqual(jasmine.any(Object));
      expect(Object.keys(result).sort()).toEqual(authorizedInfo);
      done();
    });
  });
  it('should have the right width', function (done) {
    formatSvgData(svgFile, {}, function (result) {
      expect(result.width).toEqual(expectedInfo.width);
      done();
    });
  });
  it('should have the right height', function (done) {
    formatSvgData(svgFile, {}, function (result) {
      expect(result.height).toEqual(expectedInfo.height);
      done();
    });
  });
  it('should have the right viewbox', function (done) {
    formatSvgData(svgFile, {}, function (result) {
      expect(result.viewbox).toEqual(expectedInfo.viewbox);
      done();
    });
  });
  it('should output the right name', function (done) {
    formatSvgData(svgFile, {}, function (result) {
      expect(result.name).toEqual(expectedInfo.name);
      done();
    });
  });
  it('should output the right svg content', function (done) {
    formatSvgData(svgFile, {}, function (result) {
      expect(result.content).toEqual(expectedInfo.content);
      done();
    });
  });
});
