'use strict';

/*jshint maxlen:false */
/*global jasmine, beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */

var fs              = require('fs');
var path            = require('path');
var gutil           = require('gulp-util');
var BPromise        = require('bluebird');

var templates       = require('../lib/templates.js');
var htmlOutput      = fs.readFileSync('test/output/template.html').toString();
var jsonOutput      = fs.readFileSync('test/output/template.json').toString();

var datas           = {icons:
  [
    {id: 'pouic'},
    {id: 'clapou'}
  ],
};
var tmpl            = [
  path.join(__dirname, './source/template.html'),
  path.join(__dirname, './source/template.json')
];

describe('Render templates', function () {

  it('should render a random template with random infos', function (done) {
    templates.render(tmpl[0], datas)
    .then(function (file) {
      expect(file.contents.toString()).toEqual(htmlOutput);
      done();
    })
    .catch(done.fail);
  });

  it('should render an array of templates', function (done) {
    var files = templates.renderAll(tmpl, datas);
    BPromise
      .all(files)
      .then(function (files) {
        expect(files.length).toEqual(2);
        expect(files[0].contents.toString()).toEqual(htmlOutput);
        expect(files[1].contents.toString()).toEqual(jsonOutput);
        done();
      })
      .catch(done.fail);
  });
});
