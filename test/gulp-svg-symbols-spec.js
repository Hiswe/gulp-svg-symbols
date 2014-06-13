var fs            = require('fs');
var path          = require('path');
var gutil         = require('gulp-util');

var lib           = require('../index.js');
var config        = require('../lib/default-config');
var formatSvgData = require('../lib/format-svg-data.js');
var toSvg         = require('../lib/svg-data-to-svg-file.js');
var toCss         = require('../lib/svg-data-to-css-file.js');

describe('gulp-svg-symbols', function() {

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
      className: '.github'
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
        expect(result.contents.toString()).toEqual(fs.readFileSync('test/source/symbol.css').toString())
        done();
      });
    });
  });
});
