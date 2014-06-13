# gulp-svg-symbols

*gulp-svg-symbols* is a minimal plugin for [gulp](http://gulpjs.com).  
It converts a bunch of svg files to a single svg file containing each one as a symbol.  
See [css-trick](http://css-tricks.com/svg-symbol-good-choice-icons/) for more details.

The plugin produce 2 files:

- *svg-symbols.svg* containing all SVG symbols
- *svg-symbols.css* containing all classes with the right svg sizes

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

You can overload the default options by passing an object as an argument to ```svgSymbols()```  
```%f``` is the file name. 

Some observations

- If you want to change the file name use [gulp-rename](https://www.npmjs.org/package/gulp-rename)  
- If you want to change the generated files name, again use [gulp-rename](https://www.npmjs.org/package/gulp-rename)
- If you want different destination for the files, use [gulp-if](https://www.npmjs.org/package/gulp-if)
- Unlike [gulp-svg-sprites](https://www.npmjs.org/package/gulp-svg-sprites) it doesn't generate preview files.
- Unlike [gulp-svg-sprites](https://www.npmjs.org/package/gulp-svg-sprites) there is no way to add padding to svg files.   
 It should be the purpose of another plugin, no?

So put together, you will have something like that:

```js
var gulp 		= require('gulp');
var if 			= require('gulp-if');
var rename 		= require('gulp-rename');
var svgSymbols 	= require('gulp-svg-symbols');

gulp.task('sprites', function () {
  return gulp.src('assets/svg/*.svg')
   	.pipe(rename(renameFunction))
    .pipe(svgSymbols({
      svgId:     'icon-%f',
	  className: '.icon-%f'
    }))
    .pipe(rename(outputFilesRenameFunction))
    .pipe(if( /[.]svg$/, gulp.dest('views/svg'), gulp.dest('public/css')))
});
```

## All credits goes to

- [Chris Coyier](http://css-tricks.com/) for the trick
- [Shaky Shane](https://www.npmjs.org/~shakyshane) for the [gulp-svg-sprites](https://www.npmjs.org/package/gulp-svg-sprites) plugin
