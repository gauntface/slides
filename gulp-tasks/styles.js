'use strict';

/* eslint-env node */

const gulp = require('gulp');
const cssimport = require('gulp-cssimport');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');

gulp.task('styles', () => {
  const browserSupport = ['last 2 versions'];
  const processors = [
    cssnext({browsers: browserSupport, warnForDuplicates: false}),
    cssnano()
  ];

  return gulp.src(global.src + '/**/*.css')
  .pipe(cssimport({}))
  .pipe(postcss(processors))
  .pipe(gulp.dest(global.dest));
});
