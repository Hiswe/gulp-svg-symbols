'use strict';

const fs            = require(`fs`);
const Vinyl         = require(`vinyl`);

const formatSvgData = require(`../lib/svg.js`).parseFile;

////////
// BASIC
////////

// Use the skull files for that
const svgFile       = new Vinyl({
  base: `test/source`,
  cwd:  `test/`,
  path: `test/source/skull.svg`,
  contents: fs.readFileSync(`test/source/skull.svg`),
});

const authorizedInfo = [
  `name`,
  `viewBox`,
  `originalAttributes`,
  `id`,
  `width`,
  `height`,
  `content`,
].sort();
const expectedInfo  = {
  content:  fs.readFileSync(`test/output/skull-symbol.svg`).toString(),
  width:    150,
  height:   150,
  name:     `skull`,
  viewBox:  `-50 0 150 150`,
};

describe(`get SVG datas - Gather basic info from SVG`, function () {
  it(`should be an object`, done => {
    formatSvgData(svgFile, {}, result => {
      expect(result).toEqual(jasmine.any(Object));
      expect(Object.keys(result).sort()).toEqual(authorizedInfo);
      done();
    });
  });
  it(`should have the right width`, done => {
    formatSvgData(svgFile, {}, result => {
      expect(result.width).toEqual(expectedInfo.width);
      done();
    });
  });
  it(`should have the right height`, done => {
    formatSvgData(svgFile, {}, result => {
      expect(result.height).toEqual(expectedInfo.height);
      done();
    });
  });
  it(`should have the right viewbox`, done => {
    formatSvgData(svgFile, {}, result => {
      expect(result.viewbox).toEqual(expectedInfo.viewbox);
      done();
    });
  });
  it(`should output the right name`, done => {
    formatSvgData(svgFile, {}, result => {
      expect(result.name).toEqual(expectedInfo.name);
      done();
    });
  });
});

////////
// NO DIMENSIONS
////////

const noDimensionSvgFile  = new Vinyl({
  base: `test/source`,
  cwd: `test/`,
  path: `test/source/skull.svg`,
  contents: fs.readFileSync(`test/source/gear_without_dimensions.svg`),
});
const noDimensionExpectedInfo  = {
  content:  fs.readFileSync(`test/output/gear_without_dimensions-symbol.svg`).toString(),
  width:    229.6,
  height:   259.9,
  name:     `gear_without_dimensions`,
  viewBox:  `0 0 229.6 259.9`,
};

describe(`get SVG datas - Handle SVG without dimensions`, function () {
  it(`should have the right width`, done => {
    formatSvgData(noDimensionSvgFile, {}, result => {
      expect(result.width).toEqual(noDimensionExpectedInfo.width);
      done();
    });
  });
  it(`should have the right height`, done => {
    formatSvgData(noDimensionSvgFile, {}, result => {
      expect(result.height).toEqual(noDimensionExpectedInfo.height);
      done();
    });
  });
  it(`should have the right viewbox`, done => {
    formatSvgData(noDimensionSvgFile, {}, result => {
      expect(result.viewbox).toEqual(noDimensionExpectedInfo.viewbox);
      done();
    });
  });
});

////////
// PERCENT DIMENSIONS
////////

// https://github.com/Hiswe/gulp-svg-symbols/issues/24

const percentSvgFile  = new Vinyl({
  base: `test/source`,
  cwd: `test/`,
  path: `test/source/skull.svg`,
  contents: fs.readFileSync(`test/source/icon-with-percent-size.svg`),
});
const percentExpectedInfo  = {
  width:    20,
  height:   26,
  name:     `icon-with-percent-size`,
  viewBox:  `0 0 20 26`,
};

describe(`get SVG datas - Handle SVG with percent dimensions`, function () {
  it(`should have the right width`, done => {
    formatSvgData(percentSvgFile, {}, result => {
      expect(result.width).toEqual(percentExpectedInfo.width);
      done();
    });
  });
  it(`should have the right height`, done => {
    formatSvgData(percentSvgFile, {}, result => {
      expect(result.height).toEqual(percentExpectedInfo.height);
      done();
    });
  });
  it(`should have the right viewbox`, done => {
    formatSvgData(percentSvgFile, {}, result => {
      expect(result.viewbox).toEqual(percentExpectedInfo.viewbox);
      done();
    });
  });
});
