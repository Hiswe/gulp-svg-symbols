'use strict'

const path = require(`path`)
const gulp = require(`gulp`)
const gulpif = require(`gulp-if`)
const rename = require(`gulp-rename`)
const svgmin = require(`gulp-svgmin`)
const cheerio = require(`gulp-cheerio`)
const prettify = require(`gulp-html-prettify`)
const gulpSass = require(`gulp-sass`)
const gulpStylus = require(`gulp-stylus`)
// need to reference the real module
// https://github.com/Hiswe/gulp-svg-symbols/issues/35#issuecomment-254494474
// const svgSymbols    = require(`gulp-svg-symbols`);
// for test purpose
const svgSymbols = require(`../index.js`)

const svgGlob = `../test/source/*.svg`

////////
// DEFAULT OPTIONS OUTPUT
////////

function svg() {
  return gulp
    .src(svgGlob)
    .pipe(svgSymbols())
    .pipe(gulp.dest(`ex-default`))
}
svg.description = `default use of the plugin`

////////
// ADDING THE DEMO PAGE
////////

function demoPage() {
  return gulp
    .src(svgGlob)
    .pipe(
      svgSymbols({
        templates: [`default-svg`, `default-css`, `default-demo`],
      })
    )
    .pipe(gulp.dest(`ex-demo-page`))
}
demoPage.description = `Generating the demo page along with the default templates`

////////
// ALL TEMPLATES
////////

function allBuildInTemplates() {
  return gulp
    .src(`../test/source/github.svg`)
    .pipe(
      svgSymbols({
        templates: [
          `default-svg`,
          `default-css`,
          `default-css-var`,
          `default-sass`,
          `default-stylus`,
          `default-demo`,
        ],
      })
    )
    .pipe(gulp.dest(`ex-build-in-templates`))
}
demoPage.description = `Generating all default templates`

////////
// SCSS
////////

function sass() {
  return gulp
    .src(svgGlob)
    .pipe(
      svgSymbols({
        templates: [`default-sass`],
      })
    )
    .pipe(gulp.dest(`ex-sass`))
    .pipe(gulpSass())
    .pipe(gulp.dest(`ex-sass`))
}
sass.description = `Generating scss file`

////////
// STYLUS
////////

function stylus() {
  return gulp
    .src(svgGlob)
    .pipe(
      svgSymbols({
        templates: [`default-stylus`],
      })
    )
    .pipe(gulp.dest(`ex-stylus`))
    .pipe(gulpStylus())
    .pipe(gulp.dest(`ex-stylus`))
}
stylus.description = `Generating styl file`

////////
// CSS VAR
////////

function cssVar() {
  return gulp
    .src(svgGlob)
    .pipe(
      svgSymbols({
        templates: [`default-css-var`],
      })
    )
    .pipe(gulp.dest(`ex-css-var`))
}
cssVar.description = `Generating css file with custom properties`

////////
// SVG GLOBAL CLASS NAME
////////

// add a class name to the outputted SVG in case of SVG being included in the DOM
function svgClassname() {
  return gulp
    .src(svgGlob)
    .pipe(
      svgSymbols({
        svgAttrs: { class: `custom-name` },
      })
    )
    .pipe(gulp.dest(`ex-svg-classname`))
}
svgClassname.description = `Adding add a class to the generated SVG file`

////////
// CUSTOM TEMPLATES
////////

const customCSSTemplate = path.join(__dirname, `../test/source/template.json`)
const customHTMLTemplate = path.join(__dirname, `../test/source/template.html`)

function customTemplate() {
  return gulp
    .src(svgGlob)
    .pipe(
      svgSymbols({
        id: `icon-%f`,
        className: `.icon-%f`,
        title: false,
        fontSize: 16,
        templates: [
          `default-svg`,
          `default-demo`,
          customCSSTemplate,
          customHTMLTemplate,
        ],
      })
    )
    .pipe(
      rename(function(path) {
        path.basename = `icon-files`
      })
    )
    .pipe(gulpif(/[.]svg$/, gulp.dest(`ex-custom-template/views`)))
    .pipe(gulpif(/[.]json$/, gulp.dest(`ex-custom-template/front`)))
    .pipe(gulpif(/[.]html$/, gulp.dest(`ex-custom-template/tmp`)))
}
customTemplate.description = `Using custom templates`

////////
// CUSTOM TEMPLATES with ASPECT RATIO
////////

function aspectRatio() {
  return gulp
    .src([
      `../test/source/aspect-ratio.svg`,
      `../test/source/chinese letter with styles.svg`,
      `../test/source/github.svg`,
    ])
    .pipe(
      svgSymbols({
        templates: [
          path.join(__dirname, `/aspect-ratio-test.html`),
          `default-svg`,
        ],
      })
    )
    .pipe(gulp.dest(`ex-aspect-ratio`))
}
aspectRatio.description = `A custom template with aspect ratios`

////////
// OUTPUT WITH SVG INCLUDING SAME MASK IDS
////////

function svgContainingIdenticalId() {
  return (
    gulp
      .src(`./svg-with-masks-sources/*.svg`)
      .pipe(
        svgmin(file => {
          const { relative } = file
          const prefix = path.basename(relative, path.extname(relative))
          return {
            js2svg: {
              pretty: true,
            },
            plugins: [
              {
                // this prevent duplicated IDs when bundled in the same file
                cleanupIDs: { prefix: `${prefix}-` },
              },
              {
                // some cleaning
                removeDoctype: true,
              },
              {
                removeXMLProcInst: true,
              },
              {
                removeTitle: true,
              },
              {
                removeDesc: { removeAny: true },
              },
              {
                convertTransform: {},
              },
            ],
          }
        })
      )
      // We need to move <clipPath> and <Mask> to the defs…
      // …in order for Firefox to render the SVG correctly
      .pipe(
        cheerio({
          run: ($, file) => {
            const $clipPath = $(`clipPath`)
            const $mask = $(`mask`)
            let $defs = $(`defs`)
            const hasClipPath = $clipPath.length > 0
            const hasMask = $mask.length > 0
            const hasDefs = $defs.length > 0
            if (!hasClipPath && !hasMask) return
            if (!hasDefs) {
              $defs = $(`<defs></defs>`)
              $defs.prependTo(`svg`)
            }
            function copyToDefs(i, el) {
              const $el = $(el)
              const $clone = $el.clone()
              $clone.appendTo($defs)
              $el.remove()
            }
            if (hasClipPath) $clipPath.each(copyToDefs)
            if (hasMask) $mask.each(copyToDefs)
          },
          parserOptions: {
            xmlMode: true,
          },
        })
      )
      // reformat
      .pipe(prettify({ indent_char: ` `, indent_size: 2 }))
      .pipe(gulp.dest(`ex-svg-with-masks`))
      // everything is ready for gulp-svg-symbols!
      .pipe(
        svgSymbols({
          templates: [`default-demo`],
        })
      )
      .pipe(gulp.dest(`ex-svg-with-masks`))
  )
}
svgContainingIdenticalId.description = `How to handle SVGs with masks IDs`

////////
// VUE
////////

function vue() {
  return gulp
    .src([
      `../test/source/chinese letter with styles.svg`,
      `../test/source/gradient.svg`,
      `../test/source/xlink-href.svg`,
      `../test/source/aspect-ratio.svg`,
      `../test/source/crâne noir.svg`,
      `../test/source/github.svg`,
    ])
    .pipe(
      svgSymbols({
        svgAttrs: { class: `svg-symbol` },
        class: `.svg-symbol--%f`,
        templates: [`default-vue`, `default-demo`],
      })
    )
    .pipe(gulp.dest(`ex-vue`))
}
vue.description = `vue template`

////////
// EXPORTING TASKS
////////

gulp.task(`svg`, svg)
gulp.task(`sass`, sass)
gulp.task(`all-build-in-templates`, allBuildInTemplates)
gulp.task(`stylus`, stylus)
gulp.task(`css-var`, cssVar)
gulp.task(`demo-page`, demoPage)
gulp.task(`svg-classname`, svgClassname)
gulp.task(`custom-template`, customTemplate)
gulp.task(`aspect-ratio`, aspectRatio)
gulp.task(`svg-containing-identical-id`, svgContainingIdenticalId)
gulp.task(`vue`, vue)
gulp.task(
  `all`,
  gulp.parallel(svg, demoPage, svgClassname, customTemplate, aspectRatio, vue)
)
