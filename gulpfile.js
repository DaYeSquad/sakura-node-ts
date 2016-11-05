// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

var gulp = require('gulp');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var tsSourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

/**
 * $ gulp ts
 *
 * Compile TypeScript files into 'dist/'.
 */
var tsProject = ts.createProject('./tsconfig.json');
gulp.task('ts', function() {
  var tsResult = tsProject.src()
    .pipe(tsSourcemaps.init())
    .pipe(tsProject());
  return merge([
    tsResult.js
      .pipe(tsSourcemaps.write('.'))
      .pipe(gulp.dest('./lib/js')),
    tsResult.dts
      .pipe(gulp.dest('./lib/definitions'))
  ]);
});

/**
 * $ gulp clean
 *
 * Clean ./lib folder.
 */
gulp.task('clean', function() {
  return gulp.src('./lib', {read: false})
    .pipe(clean({force: true}));
});

/**
 * $ gulp
 *
 * Clean ./lib and rebuild.
 */
gulp.task('default', function() {
  runSequence('clean', 'ts');
});
