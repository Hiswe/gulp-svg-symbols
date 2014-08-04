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

// Use the skull svg for this
describe('Copy the good viewbox', function () {

  beforeEach(function() {
    this.github = new gutil.File({
      base: 'test/source',
      cwd: 'test/',
      path: 'test/source/skull.svg',
      contents: fs.readFileSync('test/source/skull.svg')
    });
    this.info = { width: 150,
      height: 150,
      title: 'skull icon',
      id: 'skull',
      className: '.skull',
      cssWidth : '150px',
      cssHeight : '150px',
      viewBox : '-50 0 150 150',
    };
  });

  it('should gather the right data for a svg file', function (done) {
    var that = this;
    formatSvgData(this.github, config, function (result) {
      expect(result.info).toEqual(jasmine.any(Object));
      expect(result.info).toEqual(that.info);
      done();
    });
  });

  it('should render the right svg', function (done) {
    var that = this;
    formatSvgData(this.github, config, function (result){
      toSvg([result], function (err, result) {
        expect(result.path).toEqual('svg-symbols.svg');
        var outputFile = fs.readFileSync('test/output/skull-symbol.svg').toString();
        expect(result.contents.toString()).toEqual(outputFile);
        done();
      });
    });
  });

  it('should render the right css', function (done) {
    var that = this;
    formatSvgData(this.github, config, function (result){
      toCss([result], function (err, result) {
        var outputFile = fs.readFileSync('test/output/skull-symbol.css').toString();
        expect(result.path).toEqual('svg-symbols.css');
        expect(result.contents.toString()).toEqual(outputFile);
        done();
      });
    });
  });

});