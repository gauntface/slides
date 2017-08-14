'use strict';

/* eslint-env node */

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const rollup = require('rollup-stream');
const uglify = require('rollup-plugin-uglify-es');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const path = require('path');

const buildComponentJS = (relativeFilePath) => {
  return rollup({
    entry: path.join('src', relativeFilePath),
    format: 'es',
    sourceMap: true,
    plugins: [
      uglify({
        mangle: {
          properties: {
            // mangle > properties > regex will allow uglify-es to minify
            // private variable and names.
            regex: /^_/,
            // If you are getting an error due to a property mangle
            // set this flag to true and the property will be changed
            // from '_foo' to '$_foo$' to help diagnose the problem.
            debug: false,
          },
        },
      }),
    ],
    onwarn: (warning) => {
      // The final builds should have no warnings.
      throw new Error(`Unable to resolve import. ${warning.message}`);
    },
  })
  // We must give the generated stream the same name as the entry file
  // for the sourcemaps to work correctly
  .pipe(source(relativeFilePath))
  // gulp-sourcemaps don't work with streams so we need
  .pipe(buffer())
  // This tells gulp-sourcemaps to load the inline sourcemap
  .pipe(sourcemaps.init({loadMaps: true}))
  // This writes the sourcemap alongside the final build file
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(global.dest));
};

gulp.task('scripts:gf-slide-container', function() {
  return buildComponentJS(
    'components/gf-slide-container/gf-slide-container.js');
});

gulp.task('scripts:gf-slide', function() {
  return buildComponentJS('components/gf-slide/gf-slide.js');
});

gulp.task('scripts', gulp.parallel([
  'scripts:gf-slide',
  'scripts:gf-slide-container'
]));
