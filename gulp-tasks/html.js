'use strict';

/* eslint-env node */

const gulp = require('gulp');

gulp.task('html', () => {
  return gulp.src(global.src + '/**/*.html')
  .pipe(gulp.dest(global.dest));
});
