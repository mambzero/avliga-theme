let gulp = require('gulp'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    browserSync = require('browser-sync').create(),
    deploy = require('gulp-gh-pages'),
    htmlBeautify = require('gulp-html-beautify'),
    removeEmptyLines = require('gulp-remove-empty-lines');

const root = '_site';

gulp.task('jekyll-dev', shell.task(['bundle exec jekyll build --config _config.yml,_config_dev.yml']));
gulp.task('jekyll-prod', shell.task(['bundle exec jekyll build --config _config.yml']));

gulp.task('sass', function() {
    return gulp
    .src(['./_assets/sass/styles.scss'])
    .pipe(sass({includePaths: ['./_sass/']}))
    .pipe(gulp.dest('./'+root+'/assets/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('html-beautify', function() {
    return gulp.src('./'+root+'/**/*.html')
    .pipe(htmlBeautify({indent_with_tabs: true}))
    .pipe(removeEmptyLines())
    .pipe(gulp.dest('./'+root+'/'));
});

gulp.task('deploy-gh-pages', function() {
    return gulp
    .src(root+'/**/*')
    .pipe(deploy());
});

gulp.task('watch', function() {

    browserSync.init({
        files: [root + '/**'],
        port: 4000,
        server: {
          baseDir: root
        }
    });

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
            './*.html',
            './*.yml'
        ], 
        gulp.series('jekyll-dev', 'html-beautify', 'sass')
    );
    
});
  
gulp.task('default', gulp.series('jekyll-dev', 'html-beautify', 'sass', 'watch'));
  
gulp.task('deploy', gulp.series('jekyll-prod', 'html-beautify', 'sass', 'deploy-gh-pages'));