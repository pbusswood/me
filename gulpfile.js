var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');

var projectData = require('./app/data/data.json');

var paths = {
  sass: 'app/scss/*.scss',
  scripts: 'app/js/**/*.js',
  fonts: 'app/fonts/*',
  images: 'app/img/**/*'
};

gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['build']);
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
    .pipe(gulp.dest('build'))
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
        .pipe(gulp.dest('build'));
  }
});

gulp.task('sass', function () {
  return gulp.src([
    'app/scss/normalize.scss',
    'app/scss/defaults.scss',
    'app/scss/fonts.scss',
    'app/scss/main.scss',
    'app/scss/photos.scss'
  ])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('all.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('scripts', function() {
  return gulp.src([
    'app/js/vendor/modernizr-2.8.3.min.js',
    'app/js/vendor/isotope.pkgd.min.js',
    'app/js/plugins.js',
    'app/js/main.js'
  ])
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('build/fonts'));
});

// Copy all static images
gulp.task('images', function() {
  return gulp.src(paths.images)
    // .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('app/**/*', ['nunjucks']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.fonts, ['fonts']);
  gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'nunjucks', 'projects', 'sass', 'scripts', 'fonts', 'images']);
