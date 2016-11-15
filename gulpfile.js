'use strict';

/* eslint-env node */

const gulp = require('gulp');

global.src = 'src';
global.dest = 'build';

require('./gulp-tasks/styles.js');
require('./gulp-tasks/scripts.js');
require('./gulp-tasks/html.js');

gulp.task('default', ['styles', 'scripts', 'html']);
