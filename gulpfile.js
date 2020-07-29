/* global require */

var gulp = require('gulp');
var mainBowerFiles = require('gulp-main-bower-files');
var eslint = require('gulp-eslint');

var lintPathsJS = ['dashboard/static/js/*.js', 'gulpfile.js'];

var lintPathsCSS = ['dashboard/static/css/**/*.css'];

gulp.task('js:lint', () => {
  return gulp
    .src(lintPathsJS)
    .pipe(
      eslint({
        rules: {
          'comma-dangle': 0,
        },
        envs: ['es2017'],
        useEslintrc: true,
      })
    )
    .pipe(eslint.formatEach())
    .pipe(eslint.failAfterError());
});

gulp.task('css:lint', () => {
  return gulp.src(lintPathsCSS);
});

gulp.task('bower', function () {
  return gulp
    .src('./bower.json')
    .pipe(mainBowerFiles())
    .pipe(gulp.dest('./dashboard/static/lib'));
});

gulp.task('default', gulp.series(['css:lint', 'js:lint', 'bower']));
