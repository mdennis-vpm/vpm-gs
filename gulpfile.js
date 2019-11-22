var gulp        = require('gulp');
var babel       = require('gulp-babel');
var polyfill    = require('babel-polyfill');
var runSequence = require('run-sequence');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');

gulp.task('scripts', function() {
  return gulp.src('js/animation*.js')
  .pipe(babel())
  .pipe(gulp.dest('dist'));
});

gulp.task('scripts-minify', function() {
  return gulp.src('js/animation*.js')
  .pipe(babel())
  .pipe(uglify())
  .pipe(rename(function(path) {
    path.basename += ".min";
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('js/**/*.js', ['scripts', 'scripts-minify']);
});

gulp.task('default', function(done) {
  runSequence('scripts', 'scripts-minify', 'watch', done);
});
