var gulp        = require('gulp');
var jasmine     = require('gulp-jasmine');
var svgSymbols  = require('./index');

gulp.task('test', function (){
  return gulp.src('test/*.js')
    .pipe(jasmine());
});

gulp.task('demo', function (){
  return gulp.src(['test/source/github.svg', 'test/source/codepen.svg'])
    .pipe(svgSymbols())
    .pipe(gulp.dest('tmp'));
});