var _             = require('lodash');
var fs            = require('fs');
var path          = require('path');
var gutil         = require('gulp-util');

var config        = require('../lib/default-config');
var formatSvgData = require('../lib/format-svg-data.js');
var toSvg         = require('../lib/svg-data-to-svg-file.js');
var toCss         = require('../lib/svg-data-to-css-file.js');

// Use the mail SVG for test
describe('Accessibility option', function () {
  beforeEach(function () {
    this.file = new gutil.File({
      base: 'test/source',
      cwd: 'test/',
      path: 'test/source/mail.svg',
      contents: fs.readFileSync('test/source/mail.svg')
    });
    this.info = {
      width: 28,
      height: 24,
      title: 'mail icon',
      id: 'icon-mail',
      className: '.icon-mail',
      cssWidth : '1.75em',
      cssHeight : '1.5em'
    };
    this.dummyDesc = {
      title: 'envelope',
      description: 'a stylised envelope',
      pouic: 'clapou'
    };
    this.config = {
      svgId:     'icon-%f',
      className: '.icon-%f',
      fontSize:   16
    };
  });

  it('should remove title data if Accessibility is disable', function (done) {
    var that = this;
    this.config.accessibility = false;
    delete this.info.title;
    formatSvgData(this.file, this.config, function (result) {
      expect(result.info).toEqual(that.info);
      done();
    });
  });

  it('should add title & descriptions if provided', function (done) {
    var that = this;
    var expectedResult = _.merge(this.info, this.dummyDesc);
    delete expectedResult.pouic;
    this.config.accessibility = function (name) { return that.dummyDesc; }
    formatSvgData(this.file, this.config, function (result) {
      expect(result.info).toEqual(expectedResult);
      done();
    });
  });

  it('should render the SVG without title if accessibility is unwanted', function (done) {
    var that = this;
    this.config.accessibility = false;
    formatSvgData(this.file, this.config, function (result) {
      toSvg([result], function (err, result) {
        var outputFile = fs.readFileSync('test/output/mail-symbol.svg').toString();
        expect(result.path).toEqual('svg-symbols.svg');
        expect(result.contents.toString()).toEqual(outputFile);
        done();
      });
    });
  });

  it('should render the SVG with title & desc if a custom accessibility function is defined', function (done) {
    var that = this;
    this.config.accessibility = function (name) { return that.dummyDesc; }
    formatSvgData(this.file, this.config, function (result) {
      toSvg([result], function (err, result) {
        var outputFile = fs.readFileSync('test/output/mail-symbol-accessible.svg').toString();
        expect(result.path).toEqual('svg-symbols.svg');
        expect(result.contents.toString()).toEqual(outputFile);
        done();
      });
    });
  });

  it('should render the right css', function (done) {
    var that = this;
    this.config.accessibility = false;
    formatSvgData(this.file, this.config, function(result){
      toCss([result], function(err, result){
        var outputFile = fs.readFileSync('test/output/mail-symbol.css').toString();
        expect(result.path).toEqual('svg-symbols.css');
        expect(result.contents.toString()).toEqual(outputFile);
        done();
      });
    });
  });
});
