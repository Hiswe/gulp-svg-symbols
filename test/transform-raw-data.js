'use strict';

/*jshint maxlen:false */
/*global jasmine, beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */

var _                 = require('lodash');
var fs                = require('fs');

var transformSvgData  = require('../lib/svg.js').formatForTemplate;
var defaultOptions    = require('../lib/default-config.js');
var userOptions       = _.defaults({
  id:         'icon-%f',
  className:  '.icon-%f',
  fontSize:   16,
  title:      'logo of %f'
}, defaultOptions);
var customOptions   = _.defaults({
  id:         'svg-icon-%f',
  transformData: function (svg, options) {
    return {
      svg:  false,
      id:   options.id.replace('%f', svg.id)
    };
  }
}, defaultOptions);

var optionsWithoutTitle = _.defaults({
  title: false
});

var svgRawData    = {
  content:  fs.readFileSync('test/output/codepen-symbol.svg').toString(),
  width:    24,
  height:   24,
  name:     'codepen square',
  id:       'codepen-square',
  viewBox:  '0 0 24 24',
};
var resultDefault  = {
  svg:        svgRawData,
  id:         'codepen-square',
  className:  '.codepen-square',
  title:      'codepen square icon',
  width:      '24px',
  height:     '24px'
};
var resultDefaultOptions  = {
  svg:        svgRawData,
  id:         'icon-codepen-square',
  className:  '.icon-codepen-square',
  title:      'logo of codepen square',
  width:      '1.5em',
  height:     '1.5em'
};
var resultCustomOptions  = {
  svg:        svgRawData,
  id:         'svg-icon-codepen-square'
};

describe('Transform data - default', function () {
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
    expect(result.title).toBeUndefined();
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

describe('Transform data - default & options', function () {
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

describe('Transform - title should be removable', function () {
  it('shouldn\'t have a title', function (done) {
    var result  = transformSvgData(svgRawData, customOptions);
    expect(result.title).not.toBeDefined();
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
  it('should have the raw datas that can\'t be overwritten', function (done) {
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
