var gulp = require('gulp');

var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babel = require('babelify');
var uglify = require('gulp-uglify');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var importCSS = require('postcss-import');
var simpleCSSVars = require('postcss-simple-vars');

var browserSync = require('browser-sync').create();

gulp.task('javascript', function() {
  return buildJS();
});
gulp.task('javascript_dev', function() {
  return buildJS(true);
});
function buildJS(dev) {
  var bundler = browserify('./source/index.js', {debug: dev}).transform(babel, {presets: ["es2015"]});
  var fileStream = bundler.bundle()
    .on('error', function(error) { console.error(error); this.emit('end'); })
    .pipe(source('index.js'))
    .pipe(buffer());
  if(dev) {
    fileStream = fileStream
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write())
  }
  else {
    fileStream = fileStream
      .pipe(uglify({ 'preserveComments': 'license' }))
  }
  return fileStream.pipe(gulp.dest('./'));
}
gulp.task('javascriptsync', ['javascript_dev'], function() {
  browserSync.reload();
});
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch("./source/*.css", ['synccss']);
  gulp.watch("./source/*.js", ['javascriptsync']);
  gulp.watch("./index.html", browserSync.reload);
});
function css() {
  var processors = [
    importCSS(),
    autoprefixer(),
    simpleCSSVars()
  ];
  return gulp.src('./source/app.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./'));
}
gulp.task('css', css);
gulp.task('synccss', function() {
  css().pipe(browserSync.stream());
});


gulp.task('default', ['javascript', 'css']);
