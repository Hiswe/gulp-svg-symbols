'use strict';

/*jshint maxlen:false */
/*global jasmine, beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */

var fs            = require('fs');
var path          = require('path');
var gutil         = require('gulp-util');

var config        = require('../lib/default-config');
var formatSvgData = require('../lib/format-svg-data.js');
var toSvg         = require('../lib/svg-data-to-svg-file.js');
var toCss         = require('../lib/svg-data-to-css-file.js');

// Use the codepen files for that
describe('transform method with options', function () {
  beforeEach(function () {
    this.file = new gutil.File({
      base: 'test/source',
      cwd: 'test/',
      path: 'test/source/codepen.svg',
      contents: fs.readFileSync('test/source/codepen.svg')
    });
    this.info = { width: 24,
      height: 24,
      title: 'codepen icon',
      id: 'icon-codepen',
      className: '.icon-codepen',
      cssWidth: '1.5em',
      cssHeight: '1.5em',
      viewBox: '0 0 24 24'
    };
    this.config = {
      svgId:     'icon-%f',
      className: '.icon-%f',
      fontSize:   16
    };
  });

  it('should gather the right data for a svg file', function (done) {
    var that = this;
    formatSvgData(this.file, this.config, function (result) {
      delete result.data;
      expect(result.info).toEqual(jasmine.any(Object));
      expect(result.info).toEqual(that.info);
      done();
    });
  });

  it('should render the right svg', function (done) {
    var that = this;
    formatSvgData(this.file, this.config, function (result) {
      toSvg([result], function (err, result) {
        var outputFile = fs.readFileSync('test/output/codepen-symbol.svg');
        expect(result.path).toEqual('svg-symbols.svg');
        expect(result.contents.toString()).toEqual(outputFile.toString());
        done();
      });
    });
  });

  it('should render the right css', function (done) {
    var that = this;
    formatSvgData(this.file, this.config, function(result){
      toCss([result], function(err, result){
        var outputFile = fs.readFileSync('test/output/codepen-symbol.css');
        expect(result.path).toEqual('svg-symbols.css');
        expect(result.contents.toString()).toEqual(outputFile.toString());
        done();
      });
    });
  });
});
