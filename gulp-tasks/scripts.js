'use strict';

/* eslint-env node */

const gulp = require('gulp');
const rollup = require('gulp-rollup');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', function() {
  return gulp.src(global.src + '/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(rollup({
    entry: [
      'src/components/gf-slide/gf-slide.js',
      'src/components/gf-slide-container/gf-slide-container.js'
    ],
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(global.dest));
});
