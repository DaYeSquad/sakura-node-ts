// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

var gulp = require('gulp');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var tsSourcemaps = require('gulp-sourcemaps');
var spawn = require('child_process').spawn;
var node;

/**
 * $ gulp ts
 *
 * Compile TypeScript files into 'dist/'.
 */
var tsProject = ts.createProject('src/tsconfig.json');
gulp.task('ts', function() {
  var tsResult = tsProject.src()
    .pipe(tsSourcemaps.init())
    .pipe(tsProject());
  return tsResult.js
    .pipe(tsSourcemaps.write('.'))
    .pipe(gulp.dest('dist/'));
});

/**
 * $ gulp server
 *
 * Start the server.
 */
gulp.task('server', function() {
  if (node) node.kill();
  node = spawn('node', ['dist/app.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes');
    }
  })
});

/**
 * $ gulp
 *
 * Watch *.ts changes => recompile => restart the server.
 */
gulp.task('default', ['server'], function () {
  gulp.watch('src/**/*.ts', ['ts']);

  gulp.watch('dist/**/*.js', ['server']);
});

// clean up if an error goes unhandled.
process.on('exit', function() {
  if (node) node.kill()
});
