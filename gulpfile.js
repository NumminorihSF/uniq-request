/**
 * Created by numminorihsf on 09.03.16.
 */

var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', function(){
  gulp.src([
    'src/**/*.js'
  ], {base:'src'})
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./build'))
});

