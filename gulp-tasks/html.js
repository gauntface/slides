'use strict';

/* eslint-env node */

const gulp = require('gulp');
const replace = require('gulp-replace');
const cssimport = require('gulp-cssimport');
const inlinesource = require('gulp-inline-source');
const path = require('path');

gulp.task('html:post-process', () => {
  return gulp.src(global.dest + '/**/*.html')
    // Inline Javascript
  .pipe(inlinesource({
    compress: false
  }))
  // Rename the absolute css import paths so cssimport works
  .pipe(replace('/src/components/', './../'))
  .pipe(cssimport({
    includePaths: [
      path.join(__dirname, '..'),
    ]
  }))
  .pipe(gulp.dest(global.dest));
});

gulp.task('html:copy', () => {
  return gulp.src(global.src + '/**/*.html')
  .pipe(gulp.dest(global.dest));
});

gulp.task('html', gulp.series('html:copy', 'html:post-process'));
