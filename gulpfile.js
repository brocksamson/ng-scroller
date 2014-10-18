var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
var jshint = require('gulp-jshint');
var del = require('del');

gulp.task('default', ['build', 'test'], function() {});

gulp.task('clean', function(cb){
    del(['dist/*'], cb);
});

gulp.task('build', ['clean'], function(){
    return gulp.src(['src/*.js'])
        .pipe(jshint())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('test', function(){
    return gulp.src(['test/runner.html'])
        .pipe(mochaPhantomJS());
});

gulp.task('watch', ['build', 'test'], function(){
    // livereload.listen();
    gulp.watch(['test/*.js', 'src/*.js'], ['build', 'test'])
    // .on('change', livereload.changed);
});