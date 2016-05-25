'use strict';

var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var maps = require('gulp-sourcemaps');
var del = require('del');

var projectData = require('./app/data/data.json');

var paths = {
  sass: 'app/scss/**/*.scss',
  scripts: 'app/js/**/*.js',
  fonts: 'app/fonts/**',
  images: 'app/img/**'
};

gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del([
    'dist',
    'app/css/app.css*',
    'app/js/app*.js*',
    'app/**/*.html'
  ]);
});

gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/pages/**/*.+(html|nunjucks)')
    // Adding data to Nunjucks
    .pipe(data(function() {
      return require('./app/data/data.json')
    }))
    // Renders template with nunjucks
    .pipe(nunjucksRender({
      path: ['app/templates']
    }))
    // output files in app folder
    .pipe(gulp.dest('app'))
});

gulp.task('projects', function() {
  for (var i = 0; i < projectData.projects.length; i++) {
    var project = projectData.projects[i],
        fileName = project.name.replace(/ +/g, '-').toLowerCase();

    gulp.src('app/pages/project.nunjucks')
        .pipe(nunjucksRender({
          data: project,
          path: ['app/templates']
        }))
        .pipe(rename(fileName + ".html"))
        .pipe(gulp.dest('app'));
  }
});

gulp.task('sass', function () {
  return gulp.src('app/scss/app.scss')
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('app/css'));
});

gulp.task('scripts', ['minifyScripts']);

gulp.task('concatScripts', function() {
  return gulp.src([
    'app/js/vendor/modernizr-2.8.3.min.js',
    'app/js/vendor/isotope.pkgd.min.js',
    'app/js/plugins.js',
    'app/js/main.js'
  ])
    .pipe(maps.init())
    .pipe(concat('app.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('app/js'));
});

gulp.task('minifyScripts', ['concatScripts'], function() {
  return gulp.src('app/js/app.js')
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('app/js'));
});

gulp.task('serve', ['watch']);

gulp.task('build', ['nunjucks', 'projects', 'sass', 'scripts'], function() {
  return gulp.src([
    'app/css/app.css',
    'app/js/app.min.js',
    'app/**/*.html',
    paths.fonts,
    paths.images
  ], { base: './app' })
    .pipe(gulp.dest('dist'))
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('app/**/*.nunjucks', ['nunjucks']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.scripts, ['scripts']);
  // gulp.watch(paths.fonts, ['fonts']);
  // gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
