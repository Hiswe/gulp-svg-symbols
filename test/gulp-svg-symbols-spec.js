var fs            = require('fs');
var path          = require('path');
var gutil         = require('gulp-util');

var lib           = require('../index.js');
var config        = require('../lib/default-config');
var formatSvgData = require('../lib/format-svg-data.js');
var toSvg         = require('../lib/svg-data-to-svg-file.js');
var toCss         = require('../lib/svg-data-to-css-file.js');


// Use the github files for this
describe('gulp-svg-symbols – no options', function() {

  beforeEach(function() {
    this.github = new gutil.File({
      base: 'test/source',
      cwd: 'test/',
      path: 'test/source/github.svg',
      contents: fs.readFileSync('test/source/github.svg')
    });
    this.info = { width: 22,
      height: 24,
      name: 'github',
      id: 'github',
      className: '.github',
      cssWidth : '22px',
      cssHeight : '24px'
    };
  });

  it('should have a svg to data function', function(done){
    var that = this;
    formatSvgData(this.github, config, function(result){
      expect(result.info).toEqual(jasmine.any(Object));
      expect(result.info).toEqual(that.info);
      done();
    });
  });

  it('should be rendered as a svg file', function(done){
    var that = this;
    formatSvgData(this.github, config, function(result){
      toSvg([result], function(err, result){
        expect(result.path).toEqual('svg-symbols.svg');
        expect(result.contents.toString()).toEqual(fs.readFileSync('test/source/github-symbol.svg').toString())
        done();
      });
    });
  });

  it('should be rendered as a css file', function(done){
    var that = this;
    formatSvgData(this.github, config, function(result){
      toCss([result], function(err, result){
        expect(result.path).toEqual('svg-symbols.css');
        expect(result.contents.toString()).toEqual(fs.readFileSync('test/source/github-symbol.css').toString())
        done();
      });
    });
  });
});

// Use the codepen files for that
describe('gulp-svg-symbols with options', function() {
  beforeEach(function() {
    this.file = new gutil.File({
      base: 'test/source',
      cwd: 'test/',
      path: 'test/source/codepen.svg',
      contents: fs.readFileSync('test/source/codepen.svg')
    });
    this.info = { width: 24,
      height: 24,
      name: 'codepen',
      id: 'icon-codepen',
      className: '.icon-codepen',
      cssWidth : '1.5em',
      cssHeight : '1.5em'
    };
    this.config = {
      svgId:     'icon-%f',
      className: '.icon-%f',
      fontSize:   16
    }
  });

  it('should have a svg to data function', function(done){
    var that = this;
    formatSvgData(this.file, this.config, function(result){
      expect(result.info).toEqual(jasmine.any(Object));
      expect(result.info).toEqual(that.info);
      done();
    });
  });

  it('should be rendered as a svg file', function(done){
    var that = this;
    formatSvgData(this.file, this.config, function(result){
      toSvg([result], function(err, result){
        expect(result.path).toEqual('svg-symbols.svg');
        expect(result.contents.toString()).toEqual(fs.readFileSync('test/source/codepen-symbol.svg').toString())
        done();
      });
    });
  });

  it('should be rendered as a css file', function(done){
    var that = this;
    formatSvgData(this.file, this.config, function(result){
      toCss([result], function(err, result){
        expect(result.path).toEqual('svg-symbols.css');
        expect(result.contents.toString()).toEqual(fs.readFileSync('test/source/codepen-symbol.css').toString())
        done();
      });
    });
  });
});
