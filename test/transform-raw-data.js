import _ from 'lodash'
import fs from 'fs'
import test from 'ava'

import { formatDataForTemplate as transformSvgData } from '../lib/svg.js'
import defaultOptions from '../lib/default-config.js'

const svgRawData = {
  content: fs.readFileSync(`test/output/codepen-symbol.svg`).toString(),
  width: 24,
  height: 24,
  name: `codepen square`,
  id: `codepen-square`,
  viewBox: `0 0 24 24`,
}

////////
// DEFAULT
////////

const resultDefault = {
  svg: svgRawData,
  id: `codepen-square`,
  class: `.codepen-square`,
  title: `codepen square icon`,
  width: `24px`,
  height: `24px`,
}

const defaultTitle = `Transform data - default`

test(`${defaultTitle} - should be an object`, t => {
  const result = transformSvgData(svgRawData, defaultOptions)
  t.true(_.isPlainObject(result))
})

test(`${defaultTitle} - should have the raw datas`, t => {
  const result = transformSvgData(svgRawData, defaultOptions)
  t.is(result.svg, resultDefault.svg)
})

test(`${defaultTitle} - should have the right id`, t => {
  const result = transformSvgData(svgRawData, defaultOptions)
  t.is(result.id, resultDefault.id)
})

test(`${defaultTitle} - should have the right title`, t => {
  const result = transformSvgData(svgRawData, defaultOptions)
  t.true(_.isUndefined(result.title))
})

test(`${defaultTitle} - should have the right width & height`, t => {
  const result = transformSvgData(svgRawData, defaultOptions)
  t.is(result.width, resultDefault.width, `width`)
  t.is(result.height, resultDefault.height, `height`)
})

////////
// USER OPTIONS
////////

const userOptions = _.defaults(
  {
    id: `icon-%f`,
    class: `.icon-%f`,
    fontSize: 16,
    title: `logo of %f`,
  },
  defaultOptions
)

const resultDefaultOptions = {
  svg: svgRawData,
  id: `icon-codepen-square`,
  class: `.icon-codepen-square`,
  title: `logo of codepen square`,
  width: `1.5em`,
  height: `1.5em`,
}

const optionsTitle = `Transform data - default & options`

test(`${optionsTitle} - should be an object`, t => {
  const result = transformSvgData(svgRawData, userOptions)
  t.true(_.isPlainObject(result))
})

test(`${optionsTitle} - should have the raw datas`, t => {
  const result = transformSvgData(svgRawData, userOptions)
  t.is(result.svg, resultDefaultOptions.svg)
})

test(`${optionsTitle} - should have the right id`, t => {
  const result = transformSvgData(svgRawData, userOptions)
  t.is(result.id, resultDefaultOptions.id)
})

test(`${optionsTitle} - should have the right class`, t => {
  const result = transformSvgData(svgRawData, userOptions)
  t.is(result.class, resultDefaultOptions.class)
})

test(`${optionsTitle} - should have the right title`, t => {
  const result = transformSvgData(svgRawData, userOptions)
  t.is(result.title, resultDefaultOptions.title)
})

test(`${optionsTitle} - should have the right width & height`, t => {
  const result = transformSvgData(svgRawData, userOptions)
  t.is(result.width, resultDefaultOptions.width, `width`)
  t.is(result.height, resultDefaultOptions.height, `height`)
})

////////
// CUSTOM OPTIONS
////////

const customOptions = _.defaults(
  {
    id: `svg-icon-%f`,
    transformData: (svg, options) => {
      return {
        svg: false,
        id: options.id.replace(`%f`, svg.id),
      }
    },
  },
  defaultOptions
)

const resultCustomOptions = {
  svg: svgRawData,
  id: `svg-icon-codepen-square`,
}

const customOptionsTitle = `Transform - custom & options`

test(`${customOptionsTitle} - should be an object`, t => {
  const result = transformSvgData(svgRawData, customOptions)
  t.true(_.isPlainObject(result))
})

test(`${customOptionsTitle} - should have only user keys`, t => {
  const result = transformSvgData(svgRawData, customOptions)
  const keys = Object.keys(result).sort()
  t.deepEqual(keys, [`svg`, `id`].sort())
})

test(`${customOptionsTitle} - raw datas aren't overwritten`, t => {
  const result = transformSvgData(svgRawData, customOptions)
  t.is(result.svg, resultCustomOptions.svg)
})

test(`${customOptionsTitle} - should have the right id`, t => {
  const result = transformSvgData(svgRawData, customOptions)
  t.is(result.id, resultCustomOptions.id)
})

test(`${customOptionsTitle} - title should be removable`, t => {
  const result = transformSvgData(svgRawData, customOptions)
  t.true(_.isUndefined(result.title))
})
