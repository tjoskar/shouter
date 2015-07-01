'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

gulp.task('build', function () {
    return gulp.src('src/shouter.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
