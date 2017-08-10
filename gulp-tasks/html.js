'use strict';

/* eslint-env node */

const gulp = require('gulp');
const cssimport = require('gulp-cssimport');
const path = require('path');

gulp.task('html:post-process', () => {
  return gulp.src(global.dest + '/**/*.html')
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
