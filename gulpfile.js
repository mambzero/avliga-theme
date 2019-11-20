let gulp = require('gulp'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell');

gulp.task('jekyll', shell.task(['bundle exec jekyll build --config']));

gulp.task('sass', function() {
    return gulp
    .src(['./_assets/sass/styles.scss'])
    .pipe(sass({includePaths: ['./_sass/']}))
    .pipe(gulp.dest('./_site/assets/css'));
});

gulp.task('watch', function() {
    gulp.watch([
        './_assets/sass/styles.scss', 
        './_sass/**/*.scss'
        ], 
        gulp.series('sass')
    );
    gulp.watch([
        './_data/**/*.*', 
        './_includes/**/*.html', 
        './_layouts/**/*.html',
        './collections/**/*.html',
        './*.html'
        ], 
        gulp.series('jekyll')
    );
});

gulp.task('default', gulp.series('jekyll', 'sass', 'watch'));