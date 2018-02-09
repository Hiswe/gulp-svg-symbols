import _ from 'lodash';
import fs from 'fs';
import Vinyl from 'vinyl';
import test from 'ava';

import { parseFile as formatSvgData} from '../lib/svg.js';

////////
// BASIC
////////

// Use the skull files for that
const svgFile = new Vinyl({
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

const expectedInfo = {
  content:  fs.readFileSync(`test/output/skull-symbol.svg`).toString(),
  width:    150,
  height:   150,
  name:     `skull`,
  viewBox:  `-50 0 150 150`,
};

const basicTitle = `get SVG datas - Gather basic info from SVG`;

test( `${basicTitle} - should be an object`, async t => {
  const result = await formatSvgData(svgFile);
  t.true( _.isPlainObject(result) );
  t.deepEqual( Object.keys(result).sort(), authorizedInfo );
});

test( `${basicTitle} - should have the right width & height`, async t => {
  const result = await formatSvgData(svgFile);
  t.is( result.width, expectedInfo.width, `width`);
  t.is( result.height, expectedInfo.height, `height`);
});

test( `${basicTitle} - should have the right viewbox`, async t => {
  const result = await formatSvgData(svgFile);
  t.is( result.viewbox, expectedInfo.viewbox );
});

test( `${basicTitle} - output the right name`, async t => {
  const result = await formatSvgData(svgFile);
  t.is( result.name, expectedInfo.name );
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

const noDimensionTitle = `get SVG datas - Handle SVG without dimensions`;

test( `${noDimensionTitle} - should have the right width & height`, async t => {
  const result = await formatSvgData(noDimensionSvgFile);
  t.is( result.width, noDimensionExpectedInfo.width, `width` );
  t.is( result.height, noDimensionExpectedInfo.height, `height` );
});

test( `${noDimensionTitle} - should have the right viewbox`, async t => {
  const result = await formatSvgData(noDimensionSvgFile);
  t.is( result.viewbox, noDimensionExpectedInfo.viewbox);
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

const percentTitle = `get SVG datas - Handle SVG with percent dimensions`;

test( `${percentTitle} - should have the right width & height`, async t => {
  const result = await formatSvgData(percentSvgFile);
  t.is( result.width, percentExpectedInfo.width, `width` );
  t.is( result.height, percentExpectedInfo.height, `height` );
});

test( `${percentTitle} - should have the right viewbox`, async t => {
  const result = await formatSvgData(percentSvgFile);
  t.is( result.viewbox, percentExpectedInfo.viewbox);
});
