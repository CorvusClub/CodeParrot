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
  var bundler = browserify('./source/index.js', {debug: true}).transform(babel, {presets: ["es2015"]});

  return bundler.bundle()
    .on('error', function(error) { console.error(error); this.emit('end'); })
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./'));
});
gulp.task('javascriptsync', ['javascript'], browserSync.reload);
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
