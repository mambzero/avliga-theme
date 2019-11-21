let gulp = require('gulp'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    browserSync = require('browser-sync').create(),
    deploy = require('gulp-gh-pages');

const root = '_site';

gulp.task('jekyll-dev', shell.task(['bundle exec jekyll build --config _config.yml,_config_dev.yml']));
gulp.task('jekyll-prod', shell.task(['bundle exec jekyll build --config _config.yml']));

gulp.task('sass', function() {
    return gulp
    .src(['./_assets/sass/styles.scss'])
    .pipe(sass({includePaths: ['./_sass/']}))
    .pipe(gulp.dest('./_site/assets/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
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
        './*.html'
        ], 
        gulp.series('jekyll-dev','sass')
    );
});
  
gulp.task('default', gulp.series('jekyll-dev', 'sass', 'watch'));

gulp.task('deploy-gh-pages', function() {
    return gulp
    .src('_site/**/*')
    .pipe(deploy());
});
  
gulp.task('deploy', gulp.series('jekyll-prod', 'sass', 'deploy-gh-pages'));