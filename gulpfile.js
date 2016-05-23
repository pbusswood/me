var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');

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
