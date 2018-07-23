import gulp from 'gulp'
import es from 'event-stream'
import test from 'ava'

import svgSymbols from '../index.js'

////////
// BASIC
////////

const basicTitle = `Plugin – basic`

test.cb(`${basicTitle} - should produce two files`, t => {
  gulp
    .src([
      `test/source/*.svg`,
      `!test/source/crâne noir.svg`,
      `!test/source/aspect-ratio.svg`,
    ])
    .pipe(svgSymbols({ warn: false }))
    .pipe(
      es.writeArray((err, output) => {
        t.is(output.length, 2)
        t.is(output[0].path, `svg-symbols.svg`)
        t.is(output[1].path, `svg-symbols.css`)
        t.end()
      }),
    )
})

// control duplicate attributes in a watch case
// https://github.com/Hiswe/gulp-svg-symbols/issues/2

test.cb(`${basicTitle} - have the right output if called many times`, t => {
  gulp
    .src(`test/source/github.svg`)
    .pipe(svgSymbols({ warn: false }))
    .pipe(
      es.wait(function() {
        gulp
          .src(`test/source/github.svg`)
          .pipe(svgSymbols({ warn: false }))
          .pipe(
            es.writeArray((err, output) => {
              const svg = output[0].contents.toString()
              const css = output[1].contents.toString()
              t.is(output.length, 2)
              t.regex(svg, /<symbol/g)
              t.regex(css, /github/g)
              t.end()
            }),
          )
      }),
    )
})

test.cb(`${basicTitle} - can generate a demo page`, t => {
  gulp
    .src(`test/source/github.svg`)
    .pipe(
      svgSymbols({
        templates: [`default-demo`],
        warn: false,
      }),
    )
    .pipe(
      es.writeArray((err, output) => {
        t.is(output.length, 1)
        t.is(output[0].path, `svg-symbols-demo-page.html`)
        t.end()
      }),
    )
})

test.cb(
  `${basicTitle} - shouldn't generate any file if no svg are passed in`,
  t => {
    gulp
      .src(`this/path/doesnt/match/any/*.svg`)
      .pipe(svgSymbols({ warn: false }))
      .pipe(
        es.writeArray((err, output) => {
          t.is(output.length, 0)
          t.end()
        }),
      )
  },
)

////////
// CONCAT DEFS
////////

const defsTitle = `Plugin – defs`

test.cb(`${defsTitle} - should handle svg with defs`, t => {
  gulp
    .src(`test/source/gradient.svg`)
    .pipe(svgSymbols({ warn: false }))
    .pipe(
      es.writeArray((err, output) => {
        const svgContent = output[0].contents.toString()
        t.regex(svgContent, /<defs>/g)
        t.end()
      }),
    )
})

test.cb(`${defsTitle} - should handle svg withouts defs`, t => {
  gulp
    .src(`test/source/gear_without_dimensions.svg`)
    .pipe(svgSymbols({ warn: false }))
    .pipe(
      es.writeArray((err, output) => {
        const svgContent = output[0].contents.toString()
        t.notRegex(svgContent, /<defs>/g)
        t.end()
      }),
    )
})

test.cb(`${defsTitle} - should handle svg with empty defs`, t => {
  gulp
    .src(`test/source/chinese letter with styles.svg`)
    .pipe(svgSymbols({ warn: false }))
    .pipe(
      es.writeArray((err, output) => {
        const svgContent = output[0].contents.toString()
        t.notRegex(svgContent, /<defs>/g)
        t.end()
      }),
    )
})

////////
// CONCAT STYLES
////////

test.cb(
  `Plugin - style tags - should remove style attributes and put content in another file`,
  t => {
    gulp
      .src(`test/source/warning with styles and empty group.svg`)
      .pipe(svgSymbols({ warn: false }))
      .pipe(
        es.writeArray((err, output) => {
          const svgContent = output[0].contents.toString()
          const cssContent = output[1].contents.toString()
          t.notRegex(svgContent, /<style/g)
          t.regex(cssContent, /\.alert{fill:#C40000;}/g)
          t.end()
        }),
      )
  },
)

////////
// REMOVE EMPTY GROUPS
////////

test.cb(`Plugin - empty groups - should remove empty groups`, t => {
  gulp
    .src(`test/source/warning with styles and empty group.svg`)
    .pipe(svgSymbols({ warn: false }))
    .pipe(
      es.writeArray((err, output) => {
        const svgContent = output[0].contents.toString()
        t.is((svgContent.match(/<g>/g) || []).length, 1)
        t.end()
      }),
    )
})

////////
// HANDLE TITLE
////////

const titleHandlingTitle = `Plugin – title`
const titleSrc = `test/source/gear_without_dimensions.svg`

test.cb(`${titleHandlingTitle} - should handle title`, t => {
  gulp
    .src(titleSrc)
    .pipe(
      svgSymbols({
        warn: false,
        title: `pouic`,
      }),
    )
    .pipe(
      es.writeArray((err, output) => {
        const svgContent = output[0].contents.toString()
        t.regex(svgContent, /<title>pouic<\/title>/g)
        t.end()
      }),
    )
})

test.cb(
  `${titleHandlingTitle} - should remove title if title option is false`,
  t => {
    gulp
      .src(titleSrc)
      .pipe(
        svgSymbols({
          warn: false,
          title: false,
        }),
      )
      .pipe(
        es.writeArray((err, output) => {
          const svgContent = output[0].contents.toString()
          t.notRegex(svgContent, /<title>/g)
          t.end()
        }),
      )
  },
)

test.cb(
  `${titleHandlingTitle} - should remove title if title option is an empty string`,
  t => {
    gulp
      .src(titleSrc)
      .pipe(
        svgSymbols({
          warn: false,
          title: ``,
        }),
      )
      .pipe(
        es.writeArray((err, output) => {
          const svgContent = output[0].contents.toString()
          t.notRegex(svgContent, /<title>/g)
          t.end()
        }),
      )
  },
)

test.cb(
  `${titleHandlingTitle} - shouldn't add a title if one is already there`,
  t => {
    gulp
      .src(`test/source/instagram-black.svg`)
      .pipe(
        svgSymbols({
          warn: false,
          title: `clapou`,
        }),
      )
      .pipe(
        es.writeArray((err, output) => {
          const svgContent = output[0].contents.toString()
          t.regex(svgContent, /<title>instagram-black<\/title>/g)
          t.end()
        }),
      )
  },
)

////////
// HANDLE IDS
////////

const idHandlingTitle = `Plugin – title`
const idSrc = `test/source/crâne noir.svg`

test.cb(`${idHandlingTitle} - should slug ids`, t => {
  gulp
    .src(idSrc)
    .pipe(svgSymbols({ warn: false }))
    .pipe(
      es.writeArray((err, output) => {
        const svgContent = output[0].contents.toString()
        t.regex(svgContent, /id="crane-noir"/g)
        t.end()
      }),
    )
})

test.cb(`${idHandlingTitle} - should handle speakingurl options`, t => {
  gulp
    .src(idSrc)
    .pipe(
      svgSymbols({
        warn: false,
        slug: {
          separator: `_`,
          custom: {
            c: `k`,
          },
        },
      }),
    )
    .pipe(
      es.writeArray((err, output) => {
        const svgContent = output[0].contents.toString()
        t.regex(svgContent, /id="krane_noir"/g)
        t.end()
      }),
    )
})

test.cb(`${idHandlingTitle} - should handle custom slug function`, t => {
  gulp
    .src(idSrc)
    .pipe(
      svgSymbols({
        warn: false,
        slug: name => {
          const result = name.split(` `)
          return `test-name-${result[1]}`
        },
      }),
    )
    .pipe(
      es.writeArray((err, output) => {
        const svgContent = output[0].contents.toString()
        t.regex(svgContent, /id="test-name-noir"/g)
        t.end()
      }),
    )
})

////////
// HANDLE PRESERVE ASPECT RATIO
////////

const aspectRatioTitle = `Plugin – preserveAspectRatio`

test.cb(
  `${aspectRatioTitle} - shouldn't add preserveAspectRatio if none present on source`,
  t => {
    gulp
      .src(`test/source/zoom.svg`)
      .pipe(svgSymbols({ warn: false }))
      .pipe(
        es.writeArray((err, output) => {
          const svgContent = output[0].contents.toString()
          t.notRegex(svgContent, /preserveAspectRatio/g)
          t.end()
        }),
      )
  },
)

test.cb(
  `${aspectRatioTitle} - should port preserveAspectRatio with a value of "none"`,
  t => {
    gulp
      .src(`test/source/aspect-ratio.svg`)
      .pipe(svgSymbols({ warn: false }))
      .pipe(
        es.writeArray((err, output) => {
          const svgContent = output[0].contents.toString()
          t.regex(svgContent, /preserveAspectRatio="none"/g)
          t.end()
        }),
      )
  },
)

test.cb(
  `${aspectRatioTitle} - should port preserveAspectRatio with any value`,
  t => {
    gulp
      .src(`test/source/chinese letter with styles.svg`)
      .pipe(svgSymbols({ warn: false }))
      .pipe(
        es.writeArray((err, output) => {
          const svgContent = output[0].contents.toString()
          t.regex(svgContent, /preserveAspectRatio="xMidYMid"/g)
          t.end()
        }),
      )
  },
)
