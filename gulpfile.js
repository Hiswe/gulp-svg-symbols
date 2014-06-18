var gulp        = require('gulp');
var jasmine     = require('gulp-jasmine');
var svgSymbols  = require('./index');
var svgGlob     = 'test/source/*.svg';

gulp.task('test', function (){
  return gulp.src('test/*.js')
    .pipe(jasmine({verbose: true}));
});

gulp.task('demo', function (){
  return gulp.src(svgGlob)
    .pipe(svgSymbols())
    .pipe(gulp.dest('tmp'));
});

gulp.task('watch', function (){
  return gulp.watch(svgGlob, ['demo']);
});
