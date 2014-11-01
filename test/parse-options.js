'use strict';

/*jshint maxlen:false */
/*global jasmine, beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */

var _             = require('lodash');

var defaults      = require('../lib/default-config.js');
var parseOptions  = require('../lib/parse-options.js');

describe('Options', function () {

  it('should keep the original if nothing is passed by', function (done) {
    var options = _.omit(parseOptions(), ['templates']);
    expect(options).toEqual(_.omit(defaults, ['templates']));
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
      svgoConfig: {bar: 'baz'}
    };
    var options   = parseOptions(opts);
    opts.css      = true;
    expect(options).toEqual(opts);
    done();
  });

  it('should remove css template if css: false', function (done) {
    var options   = parseOptions({css: false});
    var templates = options.templates;
    expect(templates.length).toEqual(1);
    expect(/templates\/svg-symbols.svg$/.test(templates[0])).toBe(true);
    done();
  });

  it('shouldn\'t remove any templates if css: false and custom templates are provided', function (done) {
    var options   = parseOptions({
      css: false,
      templates: ['pouic', 'clapou', 'buzuck']
    });
    var templates = options.templates;
    expect(templates.length).toEqual(3);
    done();
  });

});
