'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var buffer = require('vinyl-buffer');

gulp.task('build', function () {
    return gulp.src('src/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('browserify', function () {
    return browserify('src/shouter.js', { debug: true })
        .transform(babelify.configure({
            optional: [
                'es7.decorators',
                'es7.functionBind'
            ]
        }))
        .bundle()
        .pipe(source('shouter.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', console.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/browser'));
});

gulp.task('default', ['build', 'browserify']);
