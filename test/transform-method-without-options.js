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

// Use the github files for this
xdescribe('transform method without options', function () {
  beforeEach(function() {
    this.github = new gutil.File({
      base: 'test/source',
      cwd: 'test/',
      path: 'test/source/github.svg',
      contents: fs.readFileSync('test/source/github.svg')
    });
    this.info = { width: 22,
      height: 24,
      title: 'github icon',
      id: 'github',
      className: '.github',
      cssWidth : '22px',
      cssHeight : '24px',
      viewBox : '0 0 22 24',
    };
  });

  it('should gather the right data for a svg file', function (done) {
    var that = this;
    formatSvgData(this.github, config, function (result) {
      delete result.data;
      expect(result.info).toEqual(jasmine.any(Object));
      expect(result.info).toEqual(that.info);
      done();
    });
  });

  it('should render the right svg', function (done) {
    var that = this;
    formatSvgData(this.github, config, function (result){
      toSvg([result], function (err, result) {
        expect(err).toBe(null);
        expect(result.path).toEqual('svg-symbols.svg');
        var outputFile = fs.readFileSync('test/output/github-symbol.svg');
        expect(result.contents.toString()).toEqual(outputFile.toString());
        done();
      });
    });
  });

  it('should render the right css', function (done) {
    var that = this;
    formatSvgData(this.github, config, function (result) {
      toCss([result], function (err, result) {
        expect(err).toBe(null);
        var outputFile = fs.readFileSync('test/output/github-symbol.css');
        expect(result.path).toEqual('svg-symbols.css');
        expect(result.contents.toString()).toEqual(outputFile.toString());
        done();
      });
    });
  });
});
