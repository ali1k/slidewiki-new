// Gulpfile.js
var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  uglify = require('gulp-uglify'),
  minifyCSS = require('gulp-minify-css'),
  stripDebug = require('gulp-strip-debug'),
  jshint = require('gulp-jshint'),
  webpack = require('gulp-webpack'),
  webpackDevServer = require("webpack-dev-server"),
  concat = require('gulp-concat');


gulp.task('webpack', function() {
  return gulp.src('./src/client.js')
    .pipe(webpack({
      resolve: {
        extensions: ['', '.js', '.jsx']
      },
      output: {
        filename: 'bundle.js'
      },
      module: {
        loaders: [{
          test: /\.css$/,
          loader: 'style!css'
        }, {
          test: /\.jsx$/,
          loader: 'jsx-loader'
        }]
      },
      plugins: [
        // new webpack.optimize.UglifyJsPlugin()
      ]
    }))
    .pipe(gulp.dest('build/js'));
});

gulp.task('lint', function() {
  gulp.src('src/**/*.js')
    .pipe(jshint())
})

gulp.task('minify-css', function() {
  gulp.src('build/css/*.css')
    .pipe(minifyCSS({
      keepBreaks: true
    }))
    .pipe(gulp.dest('build/css/'))
});

gulp.task('strip-debug', function() {
  gulp.src('build/js/*.js')
    .pipe(stripDebug())
    .pipe(gulp.dest('build/js/'))
});

gulp.task('compress', ["minify-css"], function() {
  gulp.src('build/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js/'))
});

gulp.task('nodemon-lint', function() {
  nodemon({
      script: 'src/server.js',
      ext: 'js jsx',
      ignore: ['build/']
    })
    .on('change', ['lint'])
    .on('restart', function() {
      console.log('server restarted!')
    })
})

gulp.task('assets', function() {
  //css files
  gulp.src('src/assets/css/**/*.css')
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('build/css'));
  //images
  gulp.src('src/assets/img/**/*.*')
    .pipe(gulp.dest('build/img'));
  //js files
  gulp.src('src/assets/js/**/*.*')
    .pipe(gulp.dest('build/js'));
})

gulp.task("webpack-watch", ["assets", "lint", "webpack"], function() {
  gulp.watch(["src/**/*"], ["assets", "lint", "webpack"]);
});

gulp.task('default', ["assets", "lint", "webpack"], function() {

});
