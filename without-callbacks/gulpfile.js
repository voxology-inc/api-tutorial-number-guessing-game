var gulp = require('gulp');
var zip = require('gulp-zip');
var del = require('del');


gulp.task('prep', ['clear', 'zip']);


gulp.task('clear', function(cb){

    del([
        './dist/**'
    ], cb)
});

gulp.task('zip', function(){

    return gulp.src([
        './package.json',
        './application.js',
        './routes/*',
        './bin/*'
    ], {base: '.'})
        .pipe(zip('archive'+ Date.now() +'.zip'))
        .pipe(gulp.dest('dist'))

});