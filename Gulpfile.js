var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babel = require('babelify');

gulp.task('javascript', function() {
  var bundler = browserify('./source/index.js', {debug: true}).transform(babel);

  return bundler.bundle()
    .on('error', function(error) { console.error(error); this.emit('end'); })
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});


gulp.task('default', ['javascript']);
