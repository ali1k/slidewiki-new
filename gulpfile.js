var gulp= require('gulp');
var gutil= require('gulp-util');
var browserify= require('gulp-browserify');
var concat= require('gulp-concat');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var filesize = require('gulp-filesize');
var inject = require("gulp-inject");

gulp.task('browserify', function(){

  gulp.src('src/js/main.js')
  .pipe(browserify({transform: ['reactify', 'envify']}))
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('dist/js'));
/*
  //inject to index.html
  gulp.src('src/index.html')
  .pipe(inject(gulp.src(appStream), {relative: false, ignorePath:'dist'}))
  .pipe(gulp.dest('dist'));
*/
})

gulp.task('copy', function(){
  gulp.src('src/index.html')
  .pipe(gulp.dest('dist'));
  //css files
  gulp.src('src/css/**/*.css')
  .pipe(concat('bundle.css'))
  .pipe(gulp.dest('dist/css'));
  //images
  gulp.src('src/img/**/*.*')
  .pipe(gulp.dest('dist/img'));
})

gulp.task('compress', function() {
  gulp.src('src/js/main.js')
  .pipe(browserify({transform: ['reactify', 'envify']}))
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('dist/js'))
  .pipe(filesize())
  .pipe(uglify())
  .pipe(rename('bundle.min.js'))
  .pipe(filesize())
  .pipe(gulp.dest('dist/js'))
  .on('error', gutil.log)
});

gulp.task('clean', function () {
  return gulp.src('dist/js/*.js', {read: true})
    .pipe(clean())
    .pipe(gulp.dest('dist/js'));
});


gulp.task('default',['browserify', 'copy']);
gulp.task('build',['compress']);
gulp.task('watch', function(){
  gulp.watch('src/**/*.*', ['default']);
})
