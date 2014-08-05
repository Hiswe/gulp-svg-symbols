# gulp-svg-symbols

[![NPM version](https://badge.fury.io/js/gulp-svg-symbols.svg)](http://badge.fury.io/js/gulp-svg-symbols) [![Build Status](https://travis-ci.org/Hiswe/gulp-svg-symbols.svg?branch=master)](https://travis-ci.org/Hiswe/gulp-svg-symbols)

*gulp-svg-symbols* is a minimal plugin for [gulp](http://gulpjs.com).  
It converts a bunch of svg files to a single svg file containing each one as a symbol.  
See [css-trick](http://css-tricks.com/svg-symbol-good-choice-icons/) for more details.

The plugin produce 2 files:

- *svg-symbols.svg* containing all SVG symbols
- *svg-symbols.css* containing all classes with the right svg sizes

## install

```
npm install --save-dev gulp-svg-symbols
```

## example

in your gulpfile.js

```js
var gulp = require('gulp');
var svgSymbols = require('gulp-svg-symbols');

gulp.task('sprites', function () {
  return gulp.src('assets/svg/*.svg')
    .pipe(svgSymbols())
    .pipe(gulp.dest('assets'));
});
```

in your HTML, you first have to [reference the SVG](http://css-tricks.com/svg-sprites-use-better-icon-fonts/)  
then:

```html
<svg role="img" class="github">
  <use xlink:href="#github"></use>
</svg>
```

- **class** is the one generated in the CSS file
- **xlink:href** is the symbol id in the SVG file

## options

You can overload the [default options](https://github.com/Hiswe/gulp-svg-symbols/blob/master/lib/default-config.js) by passing an object as an argument to `svgSymbols()`

### svgId & className

text templates for generating icon class & symbols id  
`%f` is the file name placeholder.

### fontSize

this option let you define a base font.  
If it's superior to 0, then the sizes in your CSS file will be in **em**.

### css

`false` remove the CSS file output.

### accessibility

take `false` or a `function` as param.  
With **false** the template won't output any `title` tag.  
The **function** take the current name as param.  
You should return an object like:
```js
return {
  title: 'my title for the <title> tag',
  description: 'my description for the <desc> tag'
};
```

### other observations

- If you want to change the file name use [gulp-rename](https://www.npmjs.org/package/gulp-rename)  
- If you want to change the generated files name, again use [gulp-rename](https://www.npmjs.org/package/gulp-rename)
- If you want different destination for the files, use [gulp-if](https://www.npmjs.org/package/gulp-if)
- Unlike [gulp-svg-sprites](https://www.npmjs.org/package/gulp-svg-sprites) it doesn't generate preview files.
- Unlike [gulp-svg-sprites](https://www.npmjs.org/package/gulp-svg-sprites) there is no way to add padding to svg files.
 It should be the purpose of another plugin, no?

### All put together:

```js
var gulp        = require('gulp');
var rename      = require('gulp-rename');
var svgSymbols  = require('gulp-svg-symbols');
var dictionary  = require('./svg-dictionary.json');

gulp.task('sprites', function () {
  return gulp.src('assets/svg/*.svg')
  .pipe(rename(renameFunction))
  .pipe(svgSymbols({
    svgId:     'icon-%f',
    className: '.icon-%f',
    fontSize:   16,
    accessibility: function (name) {
      return {
        title: dictionary[name].title,
        description: dictionary[name].description
      }
    },
    css: false
  }))
  .pipe(rename(outputFilesRenameFunction))
  .pipe(gulp.dest('views/svg'));
});
```

## Untested features

### SVGO

This plugin use [SVGO](https://github.com/svg/svgo) before concatenating the files.  
Options to SVGO could be passed by using svgoConfig option:

```js
.pipe(svgSymbols({
  svgoConfig: {
    // pass here any options to svgo
  }
}))
```

### Demo page

You can generate a simple demo page with `svgSymbols.demoPage()`

```js
var gulp = require('gulp');
var svgSymbols = require('gulp-svg-symbols');

gulp.task('demo', function () {
  return gulp.src('assets/svg/*.svg')
    .pipe(svgSymbols.demoPage())
    .pipe(gulp.dest('tmp'));
});
```

## Release History

- **0.1.5** — Fix test
- **0.1.4** — Fix viewbox issue
- **0.1.3** — Custom `<title>` &amp; `<desc>` content
- **0.1.2** — Config for optional CSS output
- **0.1.1** — Add travis build
- **0.1.0** — Publish to NPM and fix [watch issue](https://github.com/Hiswe/gulp-svg-symbols/issues/2)
- **0.0.2** — Css can be generated with *em* size
- **0.0.1** — First release

## All credits goes to

- [Chris Coyier](http://css-tricks.com/) for the [trick](http://css-tricks.com/svg-symbol-good-choice-icons/)
- [Shaky Shane](https://www.npmjs.org/~shakyshane) for the [gulp-svg-sprites](https://www.npmjs.org/package/gulp-svg-sprites) plugin
