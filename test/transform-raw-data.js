'use strict';

/*jshint maxlen:false */
/*global jasmine, beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */

var _                 = require('lodash');
var fs                = require('fs');

var transformSvgData  = require('../lib/merge-datas.js');
var defaultOptions    = require('../lib/default-config.js');
var userOptions       = _.defaults({
  id:         'icon-%f',
  className:  '.icon-%f',
  fontSize:   16,
  // Keep default title
  // title:      'logo of %f'
}, defaultOptions);
var customOptions   = _.defaults({
  id:         'svg-icon-%f',
  dataTransform: function (svg, options) {
    return {
      svg:  false,
      id:   options.id.replace('%f', svg.name)
    }
  }
}, defaultOptions);

var svgRawData    = {
  content:  fs.readFileSync('test/output/codepen-symbol.svg').toString(),
  width:    24,
  height:   24,
  name:     'codepen',
  viewBox:  '0 0 24 24'
};
var resultDefault  = {
  svg:        svgRawData,
  id:         'codepen',
  className:  '.codepen',
  title:      'codepen icon',
  width:      '24px',
  height:     '24px'
};
var resultDefaultOptions  = {
  svg:        svgRawData,
  id:         'icon-codepen',
  className:  '.icon-codepen',
  title:      'codepen icon',
  width:      '1.5em',
  height:     '1.5em'
};
var resultCustomOptions  = {
  svg:        svgRawData,
  id:         'svg-icon-codepen'
};

describe('Transform - default', function () {
  it('should be an object', function (done) {
    var result = transformSvgData(svgRawData, defaultOptions);
    expect(result).toEqual(jasmine.any(Object));
    done();
  });
  it('should have the raw datas', function (done) {
    var result = transformSvgData(svgRawData, defaultOptions);
    expect(result.svg).toEqual(resultDefault.svg);
    done();
  });
  it('should have the right id', function (done) {
    var result = transformSvgData(svgRawData, defaultOptions);
    expect(result.id).toEqual(resultDefault.id);
    done();
  });
  it('should have the right className', function (done) {
    var result = transformSvgData(svgRawData, defaultOptions);
    expect(result.className).toEqual(resultDefault.className);
    done();
  });
  it('should have the right title', function (done) {
    var result = transformSvgData(svgRawData, defaultOptions);
    expect(result.title).toEqual(resultDefault.title);
    done();
  });
  it('should output the right width', function (done) {
    var result = transformSvgData(svgRawData, defaultOptions);
    expect(result.width).toEqual(resultDefault.width);
    done();
  });
  it('should output the right height', function (done) {
    var result = transformSvgData(svgRawData, defaultOptions);
    expect(result.height).toEqual(resultDefault.height);
    done();
  });
});


describe('Transform - default & options', function () {
  it('should be an object', function (done) {
    var result = transformSvgData(svgRawData, userOptions);
    expect(result).toEqual(jasmine.any(Object));
    done();
  });
  it('should have the raw datas', function (done) {
    var result = transformSvgData(svgRawData, userOptions);
    expect(result.svg).toEqual(resultDefaultOptions.svg);
    done();
  });
  it('should have the right id', function (done) {
    var result = transformSvgData(svgRawData, userOptions);
    expect(result.id).toEqual(resultDefaultOptions.id);
    done();
  });
  it('should have the right className', function (done) {
    var result = transformSvgData(svgRawData, userOptions);
    expect(result.className).toEqual(resultDefaultOptions.className);
    done();
  });
  it('should have the right title', function (done) {
    var result = transformSvgData(svgRawData, userOptions);
    expect(result.title).toEqual(resultDefaultOptions.title);
    done();
  });
  it('should output the right width', function (done) {
    var result = transformSvgData(svgRawData, userOptions);
    expect(result.width).toEqual(resultDefaultOptions.width);
    done();
  });
  it('should output the right height', function (done) {
    var result = transformSvgData(svgRawData, userOptions);
    expect(result.height).toEqual(resultDefaultOptions.height);
    done();
  });
});

describe('Transform - custom & options', function () {
  it('should be an object', function (done) {
    var result = transformSvgData(svgRawData, customOptions);
    expect(result).toEqual(jasmine.any(Object));
    done();
  });
  it('should have only user keys', function (done) {
    var result  = transformSvgData(svgRawData, customOptions);
    var keys    = Object.keys(result).sort();
    expect(keys).toEqual(['svg', 'id'].sort());
    done();
  });
  it("should have the raw datas that can't be overwritten", function (done) {
    var result = transformSvgData(svgRawData, customOptions);
    expect(result.svg).toEqual(resultCustomOptions.svg);
    done();
  });
  it('should have the right id', function (done) {
    var result = transformSvgData(svgRawData, customOptions);
    expect(result.id).toEqual(resultCustomOptions.id);
    done();
  });
});
