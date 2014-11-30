'use strict';

/*jshint maxlen:false */
/*global jasmine, beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */

var _             = require('lodash');

var defaults      = require('../lib/default-config.js');
var parseOptions  = require('../lib/parse-options.js');

describe('Parse options', function () {

  it('should keep some originals if nothing is passed by', function (done) {
    var options = parseOptions();
    expect(options.id).toEqual(defaults.id);
    expect(options.className).toEqual(defaults.className);
    expect(options.fontSize).toEqual(defaults.fontSize);
    expect(options.title).toEqual(defaults.title);
    expect(options.templates.length).toEqual(options.templates.length);
    expect(options.removeAttributes).toEqual(options.removeAttributes);
    expect(options.transformData).toEqual(options.transformData);
    done();
  });

  it('should expand transformSvg default', function (done) {
    var options = parseOptions();
    expect(options.transformSvg.length).toEqual(1);
    expect(options.transformSvg[0]).toEqual('removeEmptyGroup');
    done();
  });

  it('should expand removeTags default', function (done) {
    var options = parseOptions();
    expect(options.removeTags.length).toEqual(1);
    expect(options.removeTags[0]).toEqual('style');
    done();
  });

  it('should expand removeAttributes presets', function (done) {
    var options = parseOptions({removeAttributes: 'full'});
    console.log(options.removeAttributes);
    expect(options.removeAttributes.length).toEqual(16);
    expect(options.removeAttributes).toEqual([ 'id', 'style', 'fill',
      'fill-opacity', 'fill-rule', 'clip', 'clip-path', 'clip-rule', 'stroke',
      'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap',
      'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity',
      'stroke-width'
    ]);
   done();
  });

  it('should expand templates array', function (done) {
    var options   = parseOptions({
      templates: ['default-svg', 'default-css', 'stylus', 'default-demo']
    });
    var templates = options.templates;
    expect(templates.length).toEqual(4);
    expect(/templates\/svg-symbols.svg$/.test(templates[0])).toBe(true);
    expect(/templates\/svg-symbols.css$/.test(templates[1])).toBe(true);
    expect(templates[2]).toEqual('stylus');
    expect(/templates\/svg-symbols-demo-page.html$/.test(templates[3])).toBe(true);
    done();
  });

  it('should merge custom options', function (done) {
    var opts      = {
      transformData: function (svg, option) { return {};},
      templates: ['svg', 'jade', 'stylus'],
      fontSize:   15,
      id:         '%f',
      className:  '.%f',
      title:      '%f icon',
      custom:     {foo: 'bar'},
      transformSvg: false,
      removeTags: false,
      removeAttributes: false
    };
    var options   = parseOptions(opts);
    expect(options).toEqual(opts);
    done();
  });

});
